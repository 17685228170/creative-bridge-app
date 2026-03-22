import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/crypto";

export const revalidate = 0;
export const fetchCache = 'force-no-store';

// 标记为动态路由
export const dynamic = 'force-dynamic';

async function getCurrentUser(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const ideas = await prisma.idea.findMany({
      where: { creatorId: user.userId },
      include: {
        certificate: {
          select: { certNo: true, createdAt: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      ideas: ideas.map((idea) => ({
        ...idea,
        images: JSON.parse(idea.images),
      })),
    });
  } catch (error) {
    console.error("获取我的创意错误:", error);
    return NextResponse.json(
      { error: "获取失败，请稍后重试" },
      { status: 500 }
    );
  }
}
