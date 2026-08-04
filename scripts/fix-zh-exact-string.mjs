import fs from 'fs';
import path from 'path';

const zhDir = 'd:/Projects/appaw-store/src/lib/guides/content/zh';
const exactString = '我們為客戶提供免費的初步驗卡服務，協助評估卡況並預測可能的分數。同時附設基本清潔保養，有效降低鑑定過程中的扣分風險，全力為您的珍藏爭取最高評級。';

const files = fs.readdirSync(zhDir).filter(f => f.endsWith('.ts'));

for (const file of files) {
  const filePath = path.join(zhDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace variations with the exact string
  content = content.replace(/到店時 Appaw 提供免費初步驗卡，協助評估卡況並預測可能的分數，並附設基本清潔保養以降低鑑定過程中的扣分風險。/g, `到店時，${exactString}`);
  content = content.replace(/到店時 Appaw 會協助評估卡況並預測可能的分數，並附設基本清潔保養，有效降低鑑定過程中的扣分風險，全力為您的珍藏爭取最高評級。/g, `到店時，${exactString}`);
  content = content.replace(/到店後，Appaw 先提供免費初步驗卡，協助評估置中、表面狀況與邊角完整度，並預測可能的分數；若卡況適合提交鑑定，則附設基本清潔保養以降低鑑定過程中的扣分風險。/g, `到店後，${exactString}`);
  content = content.replace(/到店後 Appaw 會提供免費初步驗卡，協助評估卡況並預測可能的分數，並附設基本清潔保養以降低鑑定過程中的扣分風險。/g, `到店後，${exactString}`);
  content = content.replace(/Appaw 為客戶提供免費初步驗卡服務，協助評估置中、表面狀況與邊角完整度，並預測可能的分數。同時附設基本清潔保養，有效降低鑑定過程中的扣分風險，全力為您的珍藏爭取最高評級。/g, exactString);
  content = content.replace(/到店時享有免費初步驗卡與基本清潔保養，協助評估卡況並預測可能的分數。/g, `到店時，${exactString}`);
  
  // grade-or-protect-first.ts
  content = content.replace(/到店時 Appaw 提供免費初步驗卡，協助評估卡況並預測可能的分數，並附設基本清潔保養以降低扣分風險；/g, `到店時，${exactString}`);
  content = content.replace(/到店時享有免費初步驗卡與基本清潔保養，協助預測可能的分數並降低扣分風險。/g, `到店時，${exactString}`);

  // psa-grading-standards.ts
  content = content.replace(/提交鑑定前進行基本清潔保養，有助降低表面污漬（ST）等 Qualifier 標籤的扣分風險；到店驗卡時亦可由專人協助評估卡況並預測可能的分數，避免不必要的鑑定成本。/g, exactString);
  content = content.replace(/並透過初步驗卡評估卡況、預測可能的分數；/g, `並利用我們的服務：${exactString}`);
  content = content.replace(/到店時 Appaw 提供免費初步驗卡，協助評估卡況並預測可能的分數，並附設基本清潔保養以降低扣分風險；/g, `到店時，${exactString}`);
  content = content.replace(/香港藏家亦可於 138 Arena 面交時由 Appaw 提供免費初步驗卡與基本清潔保養，協助預測可能的分數並降低扣分風險。/g, `香港藏家亦可於 138 Arena 面交，${exactString}`);

  // regrade-or-reholder.ts
  content = content.replace(/香港藏家亦可於 138 Arena 面交時由 Appaw 提供免費初步驗卡，協助評估卡況並預測重新評級後可能的分數，並附設基本清潔保養以降低扣分風險。/g, `香港藏家亦可於 138 Arena 面交，${exactString}`);
  content = content.replace(/若計劃重新評級，建議先進行初步驗卡，評估卡況並預測可能的分數，並附設基本清潔保養以降低鑑定過程中的扣分風險。/g, `若計劃重新評級，${exactString}`);
  content = content.replace(/香港藏家亦可於 138 Arena 面交時由 Appaw 提供免費初步驗卡與基本清潔保養，協助預測可能的分數。/g, `香港藏家亦可於 138 Arena 面交，${exactString}`);

  // psa-10-centering-requirements.ts
  content = content.replace(/香港藏家可於 138 Arena 面交時由 Appaw 提供免費初步驗卡，協助評估卡況並預測可能的分數，並附設基本清潔保養以降低鑑定過程中的扣分風險。/g, `香港藏家可於 138 Arena 面交，${exactString}`);
  content = content.replace(/到店時 Appaw 提供免費初步驗卡與基本清潔保養，協助評估卡況並預測可能的分數，全力為您的珍藏爭取最高評級；/g, `到店時，${exactString}`);

  // choose-35pt-slab-protector.ts
  content = content.replace(/計劃提交鑑定的藏家，可於 \[138 Arena\]\(\/business\/psa-grading\/\) 面交時享有免費初步驗卡與基本清潔保養，協助評估卡況並預測可能的分數，全力為您的珍藏爭取最高評級。/g, `計劃提交鑑定的藏家，可於 [138 Arena](/business/psa-grading/) 面交，${exactString}`);

  // display-graded-cards.ts
  content = content.replace(/若同時計劃提交鑑定，到店時 Appaw 提供免費初步驗卡與基本清潔保養，協助評估卡況並預測可能的分數。/g, `若同時計劃提交鑑定，到店時，${exactString}`);
  content = content.replace(/尚未取得鑑定卡的藏家，可先於 138 Arena 面交完成免費初步驗卡，再決定是否代送鑑定；/g, `尚未取得鑑定卡的藏家，可先於 138 Arena 面交，${exactString}之後再決定是否代送鑑定；`);
  content = content.replace(/提交鑑定前，香港藏家可於 138 Arena 面交享有免費初步驗卡與基本清潔保養，有效降低鑑定過程中的扣分風險。/g, `提交鑑定前，香港藏家可於 138 Arena 面交，${exactString}`);

  // identify-fake-psa-slabs.ts
  content = content.replace(/到店時 Appaw 提供免費初步驗卡與基本清潔保養，協助評估卡況並預測可能的分數。/g, `到店時，${exactString}`);
  content = content.replace(/若您持有裸卡並計劃提交鑑定，可於 138 Arena 面交享有免費初步驗卡與基本清潔保養，協助評估卡況並預測可能的分數，全力為您的珍藏爭取最高評級。/g, `若您持有裸卡並計劃提交鑑定，可於 138 Arena 面交，${exactString}`);

  // uv-protection-graded-cards.ts
  content = content.replace(/提交鑑定前，香港藏家可於 138 Arena 面交享有免費初步驗卡與基本清潔保養，有效降低鑑定過程中的扣分風險。/g, `提交鑑定前，香港藏家可於 138 Arena 面交，${exactString}`);

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
