import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/crypto";

// 获取当前用户
async function getCurrentUser(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  return verifyToken(token);
}

// 提现手续费率
const WITHDRAW_FEE_RATE = 0.001; // 0.1%
const MIN_WITHDRAW_AMOUNT = 10000; // 100元（分）
const MAX_WITHDRAW_AMOUNT = 5000000; // 50000元（分）

// 创建提现申请
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { amount, bankName, cardNo, cardHolder } = await req.json();

    // 验证参数
    if (!amount || !bankName || !cardNo || !cardHolder) {
      return NextResponse.json({ error: "参数错误" }, { status: 400 });
    }

    // 验证提现金额
    if (amount < MIN_WITHDRAW_AMOUNT) {
      return NextResponse.json(
        { error: `最低提现金额为 ${MIN_WITHDRAW_AMOUNT / 100} 元` },
        { status: 400 }
      );
    }

    if (amount > MAX_WITHDRAW_AMOUNT) {
      return NextResponse.json(
        { error: `最高提现金额为 ${MAX_WITHDRAW_AMOUNT / 100} 元` },
        { status: 400 }
      );
    }

    // 查询用户余额
    const userData = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { balance: true },
    });

    if (!userData || userData.balance < amount) {
      return NextResponse.json({ error: "余额不足" }, { status: 400 });
    }

    // 计算手续费
    const fee = Math.floor(amount * WITHDRAW_FEE_RATE);
    const actualAmount = amount - fee;

    // 生成提现单号
    const withdrawNo = `WD${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;

    // 创建提现记录
    const withdraw = await prisma.withdraw.create({
      data: {
        withdrawNo,
        userId: user.userId,
        amount,
        fee,
        actualAmount,
        bankName,
        cardNo: cardNo.slice(-4), // 只保存后4位
        cardHolder,
        status: "PENDING",
      },
    });

    // 冻结用户余额
    await prisma.user.update({
      where: { id: user.userId },
      data: {
        balance: { decrement: amount },
        frozenBalance: { increment: amount },
      },
    });

    // 创建交易记录
    await prisma.transaction.create({
      data: {
        userId: user.userId,
        type: "expense",
        title: "提现至银行卡",
        amount: -amount,
        status: "pending",
        orderNo: withdrawNo,
        source: `${bankName}(${cardNo.slice(-4)})`,
      },
    });

    // TODO: 调用真实银行转账接口
    // 这里模拟异步处理
    setTimeout(async () => {
      try {
        // 模拟转账成功
        await prisma.withdraw.update({
          where: { id: withdraw.id },
          data: {
            status: "COMPLETED",
            completedAt: new Date(),
          },
        });

        // 解冻并扣除余额
        await prisma.user.update({
          where: { id: user.userId },
          data: {
            frozenBalance: { decrement: amount },
          },
        });

        // 更新交易记录
        await prisma.transaction.updateMany({
          where: { orderNo: withdrawNo },
          data: { status: "completed" },
        });

        console.log(`提现 ${withdrawNo} 处理完成`);
      } catch (error) {
        console.error("处理提现失败:", error);
      }
    }, 5000); // 5秒后模拟完成

    return NextResponse.json({
      success: true,
      withdraw: {
        id: withdraw.id,
        withdrawNo: withdraw.withdrawNo,
        amount: withdraw.amount,
        fee: withdraw.fee,
        actualAmount: withdraw.actualAmount,
        status: withdraw.status,
        bankName: withdraw.bankName,
        cardNo: `****${withdraw.cardNo}`,
        createdAt: withdraw.createdAt,
      },
      message: "提现申请已提交，预计2小时内到账",
    });
  } catch (error: any) {
    console.error("创建提现错误:", error);
    return NextResponse.json(
      { error: error.message || "提现失败" },
      { status: 500 }
    );
  }
}

// 查询提现记录
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const [withdraws, total] = await Promise.all([
      prisma.withdraw.findMany({
        where: { userId: user.userId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.withdraw.count({ where: { userId: user.userId } }),
    ]);

    return NextResponse.json({
      success: true,
      withdraws: withdraws.map((w) => ({
        id: w.id,
        withdrawNo: w.withdrawNo,
        amount: w.amount,
        fee: w.fee,
        actualAmount: w.actualAmount,
        status: w.status,
        bankName: w.bankName,
        cardNo: `****${w.cardNo}`,
        createdAt: w.createdAt,
        completedAt: w.completedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("查询提现记录错误:", error);
    return NextResponse.json(
      { error: error.message || "查询失败" },
      { status: 500 }
    );
  }
}
