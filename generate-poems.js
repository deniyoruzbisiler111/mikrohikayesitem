const fs = require("fs");

// Kaynak şiir dosyası
const inputFile = "all_poems.txt";
// Çıkış klasörü
const outputDir = "poems";

// Dosyayı oku
const content = fs.readFileSync(inputFile, "utf-8");

// Şiirleri boş satırlardan ayır
let poems = content
  .split(/\n\s*\n/) // boş satıra göre böl
  .map(p => p.trim())
  .filter(p => p.length > 0);

// poems klasörünü oluştur (yoksa)
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// 5'erli gruplara böl
let groupSize = 5;
let fileIndex = 1;

for (let i = 0; i < poems.length; i += groupSize) {
  let chunk = poems.slice(i, i + groupSize);

  let jsonData = {
    poems: chunk.map((poem, idx) => ({
      id: (i + idx + 1),
      text: poem
    }))
  };

  let fileName = `${outputDir}/poems-${fileIndex}.json`;
  fs.writeFileSync(fileName, JSON.stringify(jsonData, null, 2), "utf-8");
  console.log(`✔️ ${fileName} oluşturuldu`);

  fileIndex++;
}
