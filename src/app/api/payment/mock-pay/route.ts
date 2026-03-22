import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

// 模拟支付接口（开发测试用）
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNo = searchParams.get("orderNo");

    if (!orderNo) {
      return NextResponse.json({ error: "订单号不能为空" }, { status: 400 });
    }

    // 查找订单
    const order = await prisma.order.findUnique({
      where: { orderNo },
    });

    if (!order) {
      return NextResponse.json({ error: "订单不存在" }, { status: 404 });
    }

    if (order.status !== "PENDING") {
      return NextResponse.json({ error: "订单状态错误" }, { status: 400 });
    }

    // 模拟支付成功处理
    const now = new Date();
    
    // 计算会员有效期
    const durationMonths = order.billingCycle === "yearly" ? 12 : 1;
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + durationMonths);

    // 更新订单状态
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "PAID",
        paidAt: now,
        transactionId: `MOCK${Date.now()}`,
      },
    });

    // 更新用户会员信息
    await prisma.user.update({
      where: { id: order.userId },
      data: {
        vipLevel: order.planId,
        vipExpiresAt: expiresAt,
      },
    });

    // 创建交易记录
    await prisma.transaction.create({
      data: {
        userId: order.userId,
        type: "expense",
        title: `购买${order.planId === "gold" ? "黄金" : "白银"}会员`,
        amount: -order.amount,
        status: "completed",
        orderNo: order.orderNo,
        source: "会员中心",
      },
    });

    return NextResponse.json({
      success: true,
      message: "支付成功",
      order: {
        orderNo: order.orderNo,
        status: "PAID",
        paidAt: now,
      },
      vip: {
        level: order.planId,
        expiresAt: expiresAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("模拟支付错误:", error);
    return NextResponse.json(
      { error: error.message || "支付失败" },
      { status: 500 }
    );
  }
}

// 支付宝回调（实际部署时使用）
export async function POST(req: NextRequest) {
  try {
    // 验证支付宝回调签名
    // 更新订单状态
    // 开通会员
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("支付回调错误:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
