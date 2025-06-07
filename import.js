const fs = require('fs');

// 直接读取整个 JSON 文件
const data = fs.readFileSync('dictionary.json', 'utf8');
const obj = JSON.parse(data);

const writeStream = fs.createWriteStream('dictionary.csv', { encoding: 'utf8' });
writeStream.write('key,value\n');

for (const key in obj) {
  let valueObj = obj[key];  // Skip null values
  if (valueObj === null) {
    continue;
  }

  if (typeof valueObj === 'object') {
    const innerKeys = Object.keys(valueObj);
    if (innerKeys.length === 1) {
      const word = innerKeys[0];
      if (valueObj[word] === null) {
        continue;
      }      const value = JSON.stringify(valueObj[word]);
      // 将JSON字符串中的引号转义，避免CSV解析错误
      const escapedValue = value.replace(/"/g, '""');
      writeStream.write(`${word},"${escapedValue}"\n`);
      continue;
    }
  }
  // fallback: 直接导出
  const value = JSON.stringify(valueObj);
  // 将JSON字符串中的引号转义，避免CSV解析错误
  const escapedValue = value.replace(/"/g, '""');
  writeStream.write(`${key},"${escapedValue}"\n`);
}

writeStream.end();
console.log('导出完成');