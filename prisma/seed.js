const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('开始种子数据...');

  // 创建测试创作者
  const creator = await prisma.user.upsert({
    where: { email: 'creator@test.com' },
    update: {},
    create: {
      email: 'creator@test.com',
      password: await bcrypt.hash('123456', 10),
      name: '测试创作者',
      role: 'CREATOR',
      balance: 100000, // 1000元
      vipLevel: 'gold',
      vipExpiresAt: new Date('2026-12-31'),
    },
  });
  console.log('创建创作者:', creator.name);

  // 创建测试企业
  const enterprise = await prisma.user.upsert({
    where: { email: 'enterprise@test.com' },
    update: {},
    create: {
      email: 'enterprise@test.com',
      password: await bcrypt.hash('123456', 10),
      name: '测试企业',
      role: 'ENTERPRISE',
    },
  });
  console.log('创建企业:', enterprise.name);

  // 创建测试创意
  const idea = await prisma.idea.create({
    data: {
      title: '智能家居中控面板设计',
      description: '极简主义风格，融合语音交互与触控操作',
      category: '工业设计',
      images: JSON.stringify(['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800']),
      fileHash: 'test-hash-001',
      status: 'APPROVED',
      tags: JSON.stringify(['智能家居', '极简主义']),
      publishMode: 'public',
      views: 2347,
      likes: 156,
      creatorId: creator.id,
    },
  });
  console.log('创建创意:', idea.title);

  // 创建测试存证
  const certificate = await prisma.certificate.create({
    data: {
      ideaId: idea.id,
      txHash: '0x' + 'a'.repeat(64),
      chainId: 'antchain-open',
      blockNumber: '12345678',
      certNo: 'CB202603220001',
      certUrl: 'https://cert.antchain.antgroup.com/CB202603220001',
      contentHash: '0x' + 'b'.repeat(64),
      metadata: JSON.stringify({ timestamp: Date.now() }),
    },
  });
  console.log('创建存证:', certificate.certNo);

  // 创建测试需求
  const demand = await prisma.demand.create({
    data: {
      title: '智能家居产品外观设计',
      description: '寻找智能家居中控面板的外观设计方案',
      category: '工业设计',
      budget: '¥50,000-100,000',
      status: 'OPEN',
      applicants: 12,
      views: 456,
      enterpriseId: enterprise.id,
    },
  });
  console.log('创建需求:', demand.title);

  // 创建测试交易
  const trade = await prisma.trade.create({
    data: {
      tradeNo: 'TR202603220001',
      ideaId: idea.id,
      creatorId: creator.id,
      enterpriseId: enterprise.id,
      type: 'license',
      amount: 500000, // 5000元
      commission: 50000, // 500元 (10%)
      commissionRate: 0.10,
      creatorIncome: 450000, // 4500元
      description: '作品授权使用',
      status: 'COMPLETED',
      paidAt: new Date(),
      paymentMethod: 'alipay',
    },
  });
  console.log('创建交易:', trade.tradeNo);

  // 创建平台收入记录
  await prisma.platformIncome.create({
    data: {
      tradeId: trade.id,
      amount: trade.commission,
      rate: trade.commissionRate,
      description: `交易 ${trade.tradeNo} 抽成`,
    },
  });

  // 创建交易记录
  await prisma.transaction.create({
    data: {
      userId: creator.id,
      type: 'income',
      title: '作品授权收入',
      amount: trade.creatorIncome,
      status: 'completed',
      orderNo: trade.tradeNo,
      source: enterprise.name,
    },
  });

  console.log('种子数据完成！');
  console.log('\n测试账号:');
  console.log('创作者: creator@test.com / 123456');
  console.log('企业: enterprise@test.com / 123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
