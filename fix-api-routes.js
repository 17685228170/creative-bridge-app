import fs from 'fs';
import path from 'path';

const apiDir = './src/app/api';

// 需要添加动态配置的文件
const filesToFix = [
  'auth/login/route.ts',
  'auth/register/route.ts',
  'demands/route.ts',
  'demands/my/route.ts',
  'ideas/route.ts',
  'ideas/my/route.ts',
  'payment/mock-pay/route.ts',
  'payment/order/route.ts',
  'payment/withdraw/route.ts',
  'trade/route.ts',
  'trade/stats/route.ts',
];

filesToFix.forEach(file => {
  const filePath = path.join(apiDir, file);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否已经添加了 dynamic export
    if (!content.includes("export const dynamic")) {
      // 在第一行 import 之后添加 dynamic export
      const lines = content.split('\n');
      let insertIndex = 0;
      
      // 找到最后一个 import 语句的位置
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('import ')) {
          insertIndex = i + 1;
        }
      }
      
      // 插入 dynamic export
      lines.splice(insertIndex, 0, '', "export const dynamic = 'force-dynamic';");
      
      content = lines.join('\n');
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed: ${file}`);
    } else {
      console.log(`⏭️  Already fixed: ${file}`);
    }
  } else {
    console.log(`❌ Not found: ${file}`);
  }
});

console.log('\n✨ All API routes have been fixed!');
