const fs = require("fs");

// all_poems.txt dosyasını oku
const allPoemsText = fs.readFileSync("all_poems.txt", "utf-8");

// Şiirleri ayır (boş satıra göre)
const poems = allPoemsText
  .split("\n\n")
  .map((p) => p.trim())
  .filter((p) => p.length > 0);

// Şiirleri 5’li gruplara böl
const chunkSize = 5;
const chunks = [];
for (let i = 0; i < poems.length; i += chunkSize) {
  chunks.push(poems.slice(i, i + chunkSize));
}

// poems klasörü yoksa oluştur
if (!fs.existsSync("poems")) {
  fs.mkdirSync("poems");
}

// Eski dosyaları sil
fs.readdirSync("poems").forEach((file) => {
  fs.unlinkSync(`poems/${file}`);
});

// Yeni JSON dosyaları oluştur
chunks.forEach((chunk, index) => {
  const data = { poems: chunk };
  fs.writeFileSync(`poems/poems${index + 1}.json`, JSON.stringify(data, null, 2));
});

console.log(`✅ ${chunks.length} JSON dosyası oluşturuldu.`);
