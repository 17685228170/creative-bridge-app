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

    if (user.role !== "ENTERPRISE") {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }

    const demands = await prisma.demand.findMany({
      where: { enterpriseId: user.userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, demands });
  } catch (error) {
    console.error("获取我的需求错误:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}
