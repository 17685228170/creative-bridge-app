import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/crypto";

export const dynamic = 'force-dynamic';

// 获取当前用户
async function getCurrentUser(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  return verifyToken(token);
}

// VIP 套餐配置
const VIP_PLANS = {
  silver: {
    id: "silver",
    name: "白银会员",
    monthlyPrice: 9900, // 分
    yearlyPrice: 99000, // 分
    benefits: ["不限确权", "20个作品监测", "每6小时扫描", "1次/季度律师函", "12%交易抽成"],
  },
  gold: {
    id: "gold",
    name: "黄金会员",
    monthlyPrice: 29900, // 分
    yearlyPrice: 199900, // 分
    benefits: ["不限确权", "不限作品监测", "实时扫描", "3次/月律师函", "诉讼垫付", "专属法务", "10%交易抽成"],
  },
};

// 创建支付订单
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { planId, billingCycle, paymentMethod } = await req.json();

    if (!planId || !billingCycle || !paymentMethod) {
      return NextResponse.json({ error: "参数错误" }, { status: 400 });
    }

    const plan = VIP_PLANS[planId as keyof typeof VIP_PLANS];
    if (!plan) {
      return NextResponse.json({ error: "套餐不存在" }, { status: 404 });
    }

    const amount = billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
    const orderNo = `VIP${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;

    // 创建订单记录
    const order = await prisma.order.create({
      data: {
        orderNo,
        userId: user.userId,
        type: "VIP",
        planId,
        billingCycle,
        amount,
        paymentMethod,
        status: "PENDING",
        metadata: JSON.stringify({
          planName: plan.name,
          benefits: plan.benefits,
        }),
      },
    });

    // TODO: 调用真实支付接口（支付宝/微信）
    // 这里返回模拟的支付参数
    let paymentParams: any = {};
    
    if (paymentMethod === "alipay") {
      // 模拟支付宝支付参数
      paymentParams = {
        method: "alipay.trade.page.pay",
        outTradeNo: orderNo,
        totalAmount: (amount / 100).toFixed(2),
        subject: `${plan.name} - ${billingCycle === "yearly" ? "年付" : "月付"}`,
        body: plan.benefits.join(", "),
        // 实际应该调用支付宝 SDK 生成支付表单
        mockUrl: `/api/payment/mock-pay?orderNo=${orderNo}`,
      };
    } else if (paymentMethod === "wechat") {
      // 模拟微信支付参数
      paymentParams = {
        appId: process.env.WECHAT_PAY_APP_ID || "mock_app_id",
        timeStamp: String(Math.floor(Date.now() / 1000)),
        nonceStr: Math.random().toString(36).substring(2, 15),
        package: `prepay_id=mock_prepay_id_${orderNo}`,
        signType: "RSA",
        paySign: "mock_sign",
        mockUrl: `/api/payment/mock-pay?orderNo=${orderNo}`,
      };
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNo: order.orderNo,
        amount: order.amount,
        status: order.status,
      },
      paymentParams,
    });
  } catch (error: any) {
    console.error("创建支付订单错误:", error);
    return NextResponse.json(
      { error: error.message || "创建订单失败" },
      { status: 500 }
    );
  }
}

// 查询订单状态
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNo = searchParams.get("orderNo");

    if (!orderNo) {
      return NextResponse.json({ error: "订单号不能为空" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { orderNo },
    });

    if (!order) {
      return NextResponse.json({ error: "订单不存在" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNo: order.orderNo,
        type: order.type,
        planId: order.planId,
        billingCycle: order.billingCycle,
        amount: order.amount,
        status: order.status,
        paidAt: order.paidAt,
        createdAt: order.createdAt,
      },
    });
  } catch (error: any) {
    console.error("查询订单错误:", error);
    return NextResponse.json(
      { error: error.message || "查询失败" },
      { status: 500 }
    );
  }
}
