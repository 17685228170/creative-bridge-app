import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/crypto";

export const revalidate = 0;
export const fetchCache = 'force-no-store';

export const dynamic = 'force-dynamic';

async function getCurrentUser(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  return verifyToken(token);
}

// 创建需求
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    if (user.role !== "ENTERPRISE") {
      return NextResponse.json({ error: "只有企业可以发布需求" }, { status: 403 });
    }

    const { title, description, category, budget } = await req.json();

    if (!title || !description || !category) {
      return NextResponse.json({ error: "请填写所有必填字段" }, { status: 400 });
    }

    const demand = await prisma.demand.create({
      data: {
        title,
        description,
        category,
        budget,
        enterpriseId: user.userId,
        status: "OPEN",
      },
    });

    return NextResponse.json({ success: true, demand });
  } catch (error) {
    console.error("创建需求错误:", error);
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}

// 获取所有需求（公开）
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const where: any = {
      status: "OPEN",
      ...(category && category !== "all" ? { category } : {}),
    };

    const demands = await prisma.demand.findMany({
      where,
      include: {
        enterprise: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, demands });
  } catch (error) {
    console.error("获取需求错误:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}