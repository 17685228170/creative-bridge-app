import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/crypto";

// 获取当前用户
async function getCurrentUser(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  return verifyToken(token);
}

// 抽成比例配置
const COMMISSION_RATES = {
  free: 0.15,    // 免费会员 15%
  silver: 0.12,  // 白银会员 12%
  gold: 0.10,    // 黄金会员 10%
};

// 创建交易（当企业购买创意或达成合作时调用）
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const {
      ideaId,           // 创意ID
      demandId,         // 需求ID（可选）
      amount,           // 交易金额（分）
      type,             // 交易类型：license(授权)/sale(出售)/cooperation(合作)
      description,      // 交易描述
      enterpriseId,     // 企业ID
    } = await req.json();

    // 验证参数
    if (!ideaId || !amount || !type || !enterpriseId) {
      return NextResponse.json({ error: "参数错误" }, { status: 400 });
    }

    if (amount <= 0) {
      return NextResponse.json({ error: "交易金额必须大于0" }, { status: 400 });
    }

    // 查询创意和创作者
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      include: {
        creator: {
          select: { id: true, name: true, vipLevel: true },
        },
      },
    });

    if (!idea) {
      return NextResponse.json({ error: "创意不存在" }, { status: 404 });
    }

    // 验证企业用户
    const enterprise = await prisma.user.findUnique({
      where: { id: enterpriseId },
    });

    if (!enterprise || enterprise.role !== "ENTERPRISE") {
      return NextResponse.json({ error: "企业用户不存在" }, { status: 404 });
    }

    // 生成交易单号
    const tradeNo = `TR${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;

    // 计算抽成
    const creatorVipLevel = idea.creator.vipLevel || "free";
    const commissionRate = COMMISSION_RATES[creatorVipLevel as keyof typeof COMMISSION_RATES] || COMMISSION_RATES.free;
    const commission = Math.floor(amount * commissionRate);
    const creatorIncome = amount - commission;

    // 创建交易记录
    const trade = await prisma.trade.create({
      data: {
        tradeNo,
        ideaId,
        demandId,
        creatorId: idea.creator.id,
        enterpriseId,
        type,
        amount,
        commission,
        commissionRate,
        creatorIncome,
        description,
        status: "PENDING", // 待支付
      },
    });

    return NextResponse.json({
      success: true,
      trade: {
        id: trade.id,
        tradeNo: trade.tradeNo,
        type: trade.type,
        amount: trade.amount,
        commission: trade.commission,
        commissionRate: trade.commissionRate,
        creatorIncome: trade.creatorIncome,
        status: trade.status,
        createdAt: trade.createdAt,
      },
      breakdown: {
        total: amount,
        platformCommission: commission,
        platformRate: `${(commissionRate * 100).toFixed(0)}%`,
        creatorReceives: creatorIncome,
        creatorRate: `${((1 - commissionRate) * 100).toFixed(0)}%`,
      },
    });
  } catch (error: any) {
    console.error("创建交易错误:", error);
    return NextResponse.json(
      { error: error.message || "创建交易失败" },
      { status: 500 }
    );
  }
}

// 确认支付（企业支付后调用）
export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { tradeNo, paymentMethod } = await req.json();

    if (!tradeNo) {
      return NextResponse.json({ error: "交易单号不能为空" }, { status: 400 });
    }

    // 查询交易
    const trade = await prisma.trade.findUnique({
      where: { tradeNo },
      include: {
        creator: true,
      },
    });

    if (!trade) {
      return NextResponse.json({ error: "交易不存在" }, { status: 404 });
    }

    if (trade.status !== "PENDING") {
      return NextResponse.json({ error: "交易状态错误" }, { status: 400 });
    }

    // TODO: 调用真实支付接口验证支付状态
    // 这里模拟支付成功

    const now = new Date();

    // 更新交易状态
    await prisma.trade.update({
      where: { id: trade.id },
      data: {
        status: "COMPLETED",
        paidAt: now,
        paymentMethod,
      },
    });

    // 增加创作者余额
    await prisma.user.update({
      where: { id: trade.creatorId },
      data: {
        balance: { increment: trade.creatorIncome },
        totalIncome: { increment: trade.creatorIncome },
      },
    });

    // 创建创作者收入交易记录
    await prisma.transaction.create({
      data: {
        userId: trade.creatorId,
        type: "income",
        title: `作品${trade.type === "license" ? "授权" : trade.type === "sale" ? "出售" : "合作"}收入`,
        amount: trade.creatorIncome,
        status: "completed",
        orderNo: tradeNo,
        source: trade.enterpriseId,
      },
    });

    // 创建平台抽成记录（可选，用于统计）
    await prisma.platformIncome.create({
      data: {
        tradeId: trade.id,
        amount: trade.commission,
        rate: trade.commissionRate,
        description: `交易 ${tradeNo} 抽成`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "支付成功",
      trade: {
        tradeNo: trade.tradeNo,
        status: "COMPLETED",
        paidAt: now,
      },
    });
  } catch (error: any) {
    console.error("确认支付错误:", error);
    return NextResponse.json(
      { error: error.message || "支付确认失败" },
      { status: 500 }
    );
  }
}

// 查询交易记录
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type");
    const role = searchParams.get("role"); // creator/enterprise

    const where: any = {};
    
    if (role === "creator") {
      where.creatorId = user.userId;
    } else if (role === "enterprise") {
      where.enterpriseId = user.userId;
    } else {
      // 默认查询当前用户相关的所有交易
      where.OR = [
        { creatorId: user.userId },
        { enterpriseId: user.userId },
      ];
    }

    if (type) {
      where.type = type;
    }

    const [trades, total] = await Promise.all([
      prisma.trade.findMany({
        where,
        include: {
          idea: {
            select: { id: true, title: true, images: true },
          },
          creator: {
            select: { id: true, name: true, avatar: true },
          },
          enterprise: {
            select: { id: true, name: true, avatar: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.trade.count({ where }),
    ]);

    // 统计信息
    const stats = await prisma.trade.aggregate({
      where: role === "creator" ? { creatorId: user.userId } : { enterpriseId: user.userId },
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
      trades: trades.map((t) => ({
        ...t,
        idea: {
          ...t.idea,
          images: t.idea.images ? JSON.parse(t.idea.images) : [],
        },
      })),
      stats: {
        totalAmount: stats._sum.amount || 0,
        totalCommission: stats._sum.commission || 0,
        totalCreatorIncome: stats._sum.creatorIncome || 0,
        totalCount: stats._count.id || 0,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("查询交易记录错误:", error);
    return NextResponse.json(
      { error: error.message || "查询失败" },
      { status: 500 }
    );
  }
}
