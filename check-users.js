const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkUsers() {
  console.log('Checking database...');
  
  const users = await prisma.user.findMany();
  console.log('Users in database:', users.length);
  
  if (users.length === 0) {
    console.log('No users found. Creating test users...');
    
    // Create creator
    await prisma.user.create({
      data: {
        email: 'creator@test.com',
        password: await bcrypt.hash('123456', 10),
        name: 'Test Creator',
        role: 'CREATOR',
        balance: 100000,
        vipLevel: 'gold',
      },
    });
    console.log('Created: creator@test.com / 123456');
    
    // Create enterprise
    await prisma.user.create({
      data: {
        email: 'enterprise@test.com',
        password: await bcrypt.hash('123456', 10),
        name: 'Test Enterprise',
        role: 'ENTERPRISE',
      },
    });
    console.log('Created: enterprise@test.com / 123456');
  } else {
    users.forEach(u => {
      console.log(`- ${u.email} (${u.role})`);
    });
  }
  
  await prisma.$disconnect();
}

checkUsers().catch(console.error);
