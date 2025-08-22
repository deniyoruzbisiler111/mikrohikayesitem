const fs = require('fs');

const input = fs.readFileSync('all_poems.txt', 'utf8');
const poems = input.split(/\r?\n/).filter(line => line.trim() !== '');

const chunkSize = 5;
const outputDir = 'poems';
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// eski dosyaları sil
fs.readdirSync(outputDir).forEach(f => fs.unlinkSync(`${outputDir}/${f}`));

let indexFiles = [];
for (let i=0; i<poems.length; i+=chunkSize) {
  const chunk = poems.slice(i, i+chunkSize);
  const fileName = `poems${i/chunkSize+1}.json`;
  fs.writeFileSync(`${outputDir}/${fileName}`, JSON.stringify({ poems: chunk }, null, 2));
  indexFiles.push(fileName);
}

fs.writeFileSync(`${outputDir}/index.json`, JSON.stringify(indexFiles, null, 2));
console.log("✅ JSON dosyaları oluşturuldu:", indexFiles);

