import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/crypto";

// 标记为动态路由
export const dynamic = 'force-dynamic';

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

    // TODO: 验证管理员权限
    // if (user.role !== "ADMIN") {
    //   return NextResponse.json({ error: "无权访问" }, { status: 403 });
    // }

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

    // 按类型统计
    const typeStats = await prisma.trade.groupBy({
      by: ["type"],
      where: { status: "COMPLETED", ...where },
      _sum: {
        amount: true,
        commission: true,
      },
      _count: {
        id: true,
      },
    });

    // 按日期统计（最近30天）
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyStats = await prisma.$queryRaw`
      SELECT 
        date(createdAt) as date,
        SUM(amount) as totalAmount,
        SUM(commission) as totalCommission,
        COUNT(id) as tradeCount
      FROM Trade
      WHERE status = 'COMPLETED'
        AND createdAt >= ${thirtyDaysAgo}
      GROUP BY date(createdAt)
      ORDER BY date DESC
    `;

    // 按VIP等级统计抽成
    const vipStats = await prisma.$queryRaw`
      SELECT 
        u.vipLevel,
        COUNT(t.id) as tradeCount,
        SUM(t.amount) as totalAmount,
        SUM(t.commission) as totalCommission,
        AVG(t.commissionRate) as avgRate
      FROM Trade t
      JOIN User u ON t.creatorId = u.id
      WHERE t.status = 'COMPLETED'
      GROUP BY u.vipLevel
    `;

    return NextResponse.json({
      success: true,
      overall: {
        totalTradeAmount: overallStats._sum.amount || 0,
        totalCommission: overallStats._sum.commission || 0,
        totalCreatorIncome: overallStats._sum.creatorIncome || 0,
        totalTradeCount: overallStats._count.id || 0,
        avgCommissionRate: overallStats._sum.amount 
          ? ((overallStats._sum.commission || 0) / overallStats._sum.amount * 100).toFixed(2)
          : "0",
      },
      byType: typeStats.map((s) => ({
        type: s.type,
        tradeCount: s._count.id,
        totalAmount: s._sum.amount || 0,
        totalCommission: s._sum.commission || 0,
      })),
      daily: dailyStats,
      byVip: vipStats,
    });
  } catch (error: any) {
    console.error("查询交易统计错误:", error);
    return NextResponse.json(
      { error: error.message || "查询失败" },
      { status: 500 }
    );
  }
}
