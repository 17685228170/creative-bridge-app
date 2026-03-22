const fs = require('fs');
const path = require('path');

const apiDir = './src/app/api';

function findRouteFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      findRouteFiles(fullPath, files);
    } else if (item === 'route.ts') {
      files.push(fullPath);
    }
  }
  
  return files;
}

const routeFiles = findRouteFiles(apiDir);

routeFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 检查是否包含 headers 使用
  if (content.includes('headers') || content.includes('req.headers') || content.includes('request.headers')) {
    // 检查是否已经添加了所有动态配置
    const hasDynamic = content.includes("export const dynamic");
    const hasRevalidate = content.includes("export const revalidate");
    const hasFetchCache = content.includes("export const fetchCache");
    
    if (!hasDynamic || !hasRevalidate || !hasFetchCache) {
      // 找到第一个 import 之后的位置
      const lines = content.split('\n');
      let insertIndex = 0;
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('import ')) {
          insertIndex = i + 1;
        }
      }
      
      // 添加缺失的配置
      const configs = [];
      if (!hasDynamic) configs.push("export const dynamic = 'force-dynamic';");
      if (!hasRevalidate) configs.push("export const revalidate = 0;");
      if (!hasFetchCache) configs.push("export const fetchCache = 'force-no-store';");
      
      if (configs.length > 0) {
        lines.splice(insertIndex, 0, '', ...configs);
        content = lines.join('\n');
        fs.writeFileSync(filePath, content);
        console.log(`✅ Fixed: ${filePath.replace(apiDir, '')}`);
      }
    } else {
      console.log(`⏭️  Already fixed: ${filePath.replace(apiDir, '')}`);
    }
  } else {
    console.log(`⏭️  No headers used: ${filePath.replace(apiDir, '')}`);
  }
});

console.log('\n✨ All API routes have been fixed!');
