import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/crypto";

// 强制动态渲染
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// 获取当前用户
async function getCurrentUser(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  return verifyToken(token);
}

// 平台交易统计（管理员用）
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: any = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // 总体统计
    const overallStats = await prisma.trade.aggregate({
      where: { status: "COMPLETED", ...where },
      _sum: {
        amount: true,
        commission: true,
        creatorIncome: true,
      },
      _count: {
        id: true,
      },
    });

    return NextResponse.json({
      success: true,
      overall: {
        totalTradeAmount: overallStats._sum.amount || 0,
        totalCommission: overallStats._sum.commission || 0,
        totalCreatorIncome: overallStats._sum.creatorIncome || 0,
        totalTradeCount: overallStats._count.id || 0,
      },
    });
  } catch (error: any) {
    console.error("查询交易统计错误:", error);
    return NextResponse.json(
      { error: error.message || "查询失败" },
      { status: 500 }
    );
  }
}
