const fs = require("fs");
const path = require("path");

const INPUT = "all_poems.txt";
const OUT_DIR = "poems";
const GROUP_SIZE = 5;

// 1) Kaynak metni oku
if (!fs.existsSync(INPUT)) {
  console.error(`❌ ${INPUT} bulunamadı.`);
  process.exit(1);
}
const content = fs.readFileSync(INPUT, "utf8");

// 2) Şiirleri ayır:
// - Boş satıra göre böl (bir veya daha fazla boş satır)
// - Satır içindeki "\n" dizilerini gerçek satır sonuna çevir (kopyala/yapıştır kaynaklı durumlar için)
let poems = content
  .split(/\r?\n\s*\r?\n/)               // bloklara ayır
  .map(p => p.trim())
  .filter(p => p.length > 0)
  .map(p => p.replace(/\\n/g, "\n"));   // literal \n -> gerçek newline

if (poems.length === 0) {
  console.error("❌ Hiç şiir bulunamadı. all_poems.txt içeriğini kontrol et.");
  process.exit(1);
}

// 3) çıktı klasörü
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// 4) Eski json'ları sil (yalnızca .json)
for (const f of fs.readdirSync(OUT_DIR)) {
  if (f.endsWith(".json")) fs.unlinkSync(path.join(OUT_DIR, f));
}

// 5) 5'lik gruplara böl ve yaz
const indexList = [];
let fileNo = 1;

for (let i = 0; i < poems.length; i += GROUP_SIZE) {
  const chunk = poems.slice(i, i + GROUP_SIZE);
  const data = { poems: chunk }; // dizeler halinde (index.html böyle bekliyor)
  const fileName = `poems${fileNo}.json`; // poems1.json, poems2.json, ...
  fs.writeFileSync(path.join(OUT_DIR, fileName), JSON.stringify(data, null, 2), "utf8");
  indexList.push(fileName);
  fileNo++;
}

// 6) index.json yaz (index.html buradan dosya listesini alıyor)
fs.writeFileSync(path.join(OUT_DIR, "index.json"), JSON.stringify(indexList, null, 2), "utf8");

console.log(`✅ ${indexList.length} JSON dosyası üretildi:`, indexList.join(", "));
