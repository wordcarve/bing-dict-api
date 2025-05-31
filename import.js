const fs = require('fs');

// 直接读取整个 JSON 文件
const data = fs.readFileSync('dictionary.json', 'utf8');
const obj = JSON.parse(data);

const writeStream = fs.createWriteStream('dictionary.csv', { encoding: 'utf8' });
writeStream.write('key,value\n');

for (const key in obj) {
  let valueObj = obj[key];
  if (typeof valueObj === 'object' && valueObj !== null) {
    const innerKeys = Object.keys(valueObj);
    if (innerKeys.length === 1) {
      const word = innerKeys[0];
      const value = JSON.stringify(valueObj[word]); // 不做转义
      writeStream.write(`${word},${value}\n`);
      continue;
    }
  }
  // fallback: 直接导出
  const value = JSON.stringify(valueObj); // 不做转义
  writeStream.write(`${key},${value}\n`);
}

writeStream.end();
console.log('导出完成');