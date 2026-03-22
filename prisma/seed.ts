import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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
      creatorId: creator.id,
    },
  });
  console.log('创建创意:', idea.title);

  // 创建测试需求
  const demand = await prisma.demand.create({
    data: {
      title: '智能家居产品外观设计',
      description: '寻找智能家居中控面板的外观设计方案',
      category: '工业设计',
      budget: '¥50,000-100,000',
      status: 'OPEN',
      enterpriseId: enterprise.id,
    },
  });
  console.log('创建需求:', demand.title);

  console.log('种子数据完成！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
