import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken, calculateFileHash } from "@/lib/crypto";
import { notarizeOnChain } from "@/lib/antchain";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export const dynamic = 'force-dynamic';

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || "104857600"); // 100MB

// 确保上传目录存在
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// 生成唯一文件名
function generateUniqueFilename(originalName: string): string {
  const ext = path.extname(originalName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}${ext}`;
}

// 保存文件到本地
async function saveFile(file: File): Promise<{ url: string; size: number; mimeType: string }> {
  await ensureUploadDir();
  
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // 检查文件大小
  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error(`文件大小超过限制 (${MAX_FILE_SIZE / 1024 / 1024}MB)`);
  }
  
  const filename = generateUniqueFilename(file.name);
  const filepath = path.join(UPLOAD_DIR, filename);
  
  await writeFile(filepath, buffer);
  
  return {
    url: `/uploads/${filename}`,
    size: buffer.length,
    mimeType: file.type,
  };
}

// 获取当前用户
async function getCurrentUser(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  return verifyToken(token);
}

// 创建创意 + 蚂蚁链存证
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    if (user.role !== "CREATOR") {
      return NextResponse.json({ error: "只有创作者可以上传创意" }, { status: 403 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const publishMode = (formData.get("publishMode") as string) || "vault";
    const tagsStr = formData.get("tags") as string;
    const tags = tagsStr ? JSON.parse(tagsStr) : [];
    
    // 获取所有文件
    const files: File[] = [];
    for (let i = 0; i < 10; i++) {
      const file = formData.get(`files`) as File;
      if (file && file.size > 0) {
        files.push(file);
      }
    }
    
    // 如果没有 files 字段，尝试获取单个 file
    if (files.length === 0) {
      const singleFile = formData.get("file") as File;
      if (singleFile && singleFile.size > 0) {
        files.push(singleFile);
      }
    }

    if (!title || !description || !category) {
      return NextResponse.json({ error: "请填写所有必填字段" }, { status: 400 });
    }

    if (files.length === 0) {
      return NextResponse.json({ error: "请至少上传一个文件" }, { status: 400 });
    }

    // 保存所有文件并计算哈希
    const savedFiles = await Promise.all(
      files.map(async (file) => {
        const saved = await saveFile(file);
        const buffer = Buffer.from(await file.arrayBuffer());
        const hash = calculateFileHash(buffer);
        return { ...saved, hash, originalName: file.name };
      })
    );

    // 使用第一个文件的哈希作为主哈希
    const fileHash = savedFiles[0].hash;

    // 检查是否已存在相同哈希的创意
    const existingIdea = await prisma.idea.findUnique({
      where: { fileHash },
    });

    if (existingIdea) {
      // 删除已上传的文件
      // await Promise.all(savedFiles.map(f => unlink(path.join(UPLOAD_DIR, path.basename(f.url)))));
      return NextResponse.json(
        { error: "该创意已存在，请勿重复上传" },
        { status: 409 }
      );
    }

    // 创建创意记录
    const idea = await prisma.idea.create({
      data: {
        title,
        description,
        category,
        images: JSON.stringify(savedFiles.map(f => f.url)),
        fileHash,
        creatorId: user.userId,
        status: publishMode === "public" ? "APPROVED" : "PRIVATE",
        tags: JSON.stringify(tags),
        publishMode,
      },
    });

    // 蚂蚁链存证
    const notarizeResult = await notarizeOnChain({
      fileHash,
      creatorId: user.userId,
      title,
      description,
      metadata: { 
        category, 
        ideaId: idea.id,
        tags,
        publishMode,
        fileCount: savedFiles.length,
      },
    });

    if (!notarizeResult.success) {
      // 存证失败，删除创意记录
      await prisma.idea.delete({ where: { id: idea.id } });
      return NextResponse.json(
        { error: "存证失败，请稍后重试" },
        { status: 500 }
      );
    }

    // 保存存证证书
    const certificate = await prisma.certificate.create({
      data: {
        ideaId: idea.id,
        txHash: notarizeResult.txHash,
        chainId: notarizeResult.chainId,
        blockNumber: notarizeResult.blockNumber,
        certNo: notarizeResult.certNo,
        certUrl: notarizeResult.certUrl,
        contentHash: notarizeResult.contentHash,
        metadata: JSON.stringify({
          timestamp: notarizeResult.timestamp,
          fileHash,
          files: savedFiles.map(f => ({ url: f.url, hash: f.hash, size: f.size })),
        }),
      },
    });

    return NextResponse.json({
      success: true,
      idea: {
        id: idea.id,
        title: idea.title,
        description: idea.description,
        category: idea.category,
        status: idea.status,
        publishMode,
        createdAt: idea.createdAt,
        images: savedFiles.map(f => f.url),
      },
      certificate: {
        certNo: certificate.certNo,
        txHash: certificate.txHash,
        certUrl: certificate.certUrl,
        createdAt: certificate.createdAt,
      },
    });
  } catch (error: any) {
    console.error("上传创意错误:", error);
    return NextResponse.json(
      { error: error.message || "上传失败，请稍后重试" },
      { status: 500 }
    );
  }
}

// 获取创意列表（创意广场）
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const sort = searchParams.get("sort") || "newest";

    const where: any = {
      status: "APPROVED",
      ...(category && category !== "all" ? { category } : {}),
    };

    let orderBy: any = { createdAt: "desc" };
    switch (sort) {
      case "popular":
        orderBy = { views: "desc" };
        break;
      case "trending":
        orderBy = { likes: "desc" };
        break;
    }

    const [ideas, total] = await Promise.all([
      prisma.idea.findMany({
        where,
        include: {
          creator: {
            select: { id: true, name: true, avatar: true },
          },
          certificate: {
            select: { certNo: true, createdAt: true },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.idea.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      ideas: ideas.map((idea) => ({
        ...idea,
        images: JSON.parse(idea.images),
        tags: idea.tags ? JSON.parse(idea.tags) : [],
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("获取创意列表错误:", error);
    return NextResponse.json(
      { error: "获取失败，请稍后重试" },
      { status: 500 }
    );
  }
}
