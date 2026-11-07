import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { COMPANY } from '@/lib/company';
import { zhPrivacyMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = zhPrivacyMetadata;

function SectionDivider({ num }: { num: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="font-mono text-xs text-text-muted tracking-widest">{num}</span>
      <div className="flex-1 h-px bg-border-default" />
    </div>
  );
}

export default function ZhPrivacyPage() {
  return (
    <main className="bg-surface-bg min-h-screen">
      <div className="container-custom max-w-3xl py-16 md:py-24">
        <p className="section-label mb-4">私隱</p>
        <h1 className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-2">
          私隱保護政策
        </h1>
        <p className="text-text-muted text-sm mb-10">最後更新：2026年11月7日</p>

        <div className="mb-10">
          <SectionDivider num="01" />
          <h2 className="text-2xl font-bold font-display text-text-primary mb-4">我們收集的資料</h2>

          <h3 className="text-base font-semibold text-text-primary mb-2">自動收集的資料（Google Analytics 4）</h3>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            當您瀏覽本網站時，Google Analytics 4 會自動收集：
          </p>
          <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm mb-6">
            <li>瀏覽的頁面與停留時間</li>
            <li>大致地理位置（國家／城市層級）</li>
            <li>裝置類型、瀏覽器與作業系統</li>
            <li>來源途徑（您如何找到我們）</li>
          </ul>
          <p className="text-text-secondary text-sm leading-relaxed mb-6">
            上述分析資料會經彙總並匿名化處理。另外，部分網站功能會收集您主動提交的有限資料——例如
            PSA評級代送鑑定進度查詢頁的登記電話號碼與參考編號，以及預約交卡時所填的預約資料。我們不會透過分析工具，從一般瀏覽行為中擷取您的姓名或電郵。
          </p>

          <h3 className="text-base font-semibold text-text-primary mb-2">自動收集的資料（Microsoft Clarity）</h3>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            我們與 Microsoft Clarity 合作，透過行為指標、熱圖與工作階段重播，了解您如何使用本網站，以便改善產品與體驗。
            Clarity 可能收集：
          </p>
          <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm mb-4">
            <li>瀏覽頁面、點擊、捲動與滑鼠移動</li>
            <li>工作階段錄影與熱圖資料</li>
            <li>裝置類型、瀏覽器與螢幕解析度</li>
            <li>來源途徑與大致地理位置</li>
          </ul>
          <p className="text-text-secondary text-sm leading-relaxed mb-6">
            網站使用資料以第一方及第三方 cookies 與其他追蹤技術擷取，用作優化網站與了解瀏覽路徑。有關 Microsoft
            如何收集及使用資料，請參閱{' '}
            <a
              href="https://www.microsoft.com/privacy/privacystatement"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-link hover:underline"
            >
              Microsoft 私隱聲明
            </a>
            。
          </p>

          <h3 className="text-base font-semibold text-text-primary mb-2">您自願提供的資料</h3>
          <p className="text-text-secondary text-sm leading-relaxed mb-6">
            若您透過 WhatsApp（+852-9285-1189）或電郵（support@appaw.store）聯絡我們，我們會收到您選擇分享的聯絡資料與訊息內容。
            若您使用 PSA評級代送鑑定進度查詢頁，您會提交登記電話號碼與參考編號以查詢批次。若您預約交卡，我們會收到您填寫的預約資料。
            上述資料僅用於回覆查詢、提供進度查詢或協助完成交易。
          </p>

          <h3 className="text-base font-semibold text-text-primary mb-2">卡牌置中（Card Centering Tools）流動應用程式</h3>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            <strong>卡牌置中（Card Centering Tools）</strong>由 Appaw Store Limited 提供，可於本機量度卡牌置中，
            並追蹤你經 Appaw Store 代送 PSA 的進度。
          </p>
          <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm mb-4">
            <li>用於量度的相機／相簿照片只留在本機，不會上傳至我們的伺服器。</li>
            <li>
              若使用「追蹤」功能，你輸入的電話號碼只會傳送至 Appaw 評級 API，用以查找你在 Appaw Store 的送件，
              不會用於廣告。
            </li>
            <li>
              成功查詢後，評級掃描圖可能會顯示並暫存於本機。本機亦可能保存最近一次查詢電話及已開啟的評級狀態，
              直至你在設定中清除查詢記錄（此操作亦會清除掃描圖快取）。
            </li>
            <li>
              App 會透過 <strong>Google AdMob</strong> 顯示橫幅廣告。Google 可能收集裝置及廣告相關資料（例如廣告識別碼、
              廣告資料、產品互動）以投放及衡量廣告。詳見{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-link hover:underline"
              >
                Google 私隱政策
              </a>
              。本 App 不會跨其他公司的 App 或網站追蹤你作廣告用途。
            </li>
          </ul>
          <p className="text-text-secondary text-sm leading-relaxed mb-6">
            我們不會出售你的電話號碼、置中照片或評級掃描圖。AdMob 廣告與追蹤查詢資料分開處理。
          </p>

          <h3 className="text-base font-semibold text-text-primary mb-2">兒童</h3>
          <p className="text-text-secondary text-sm leading-relaxed mb-6">
            本網站及卡牌置中 App 並非以 13 歲以下兒童為對象，我們亦不會明知而收集 13 歲以下兒童的個人資料。
            App 內廣告已設定為非兒童導向。如您認為有兒童向我們提供了個人資料，請聯絡我們，我們會將其刪除。
          </p>

          <h3 className="text-base font-semibold text-text-primary mb-2">購買資料</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            所有購買經{' '}
            <a
              href="https://appawstore.etsy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-link hover:underline"
            >
              Etsy
            </a>{' '}
            或{' '}
            <a
              href="https://www.carousell.com.hk/u/appaw.store/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-link hover:underline"
            >
              Carousell
            </a>{' '}
            處理。本網站不處理或儲存付款資料。請參閱各平台的私隱政策，了解購買資料如何處理。
          </p>
        </div>

        <div className="mb-10">
          <SectionDivider num="02" />
          <h2 className="text-2xl font-bold font-display text-text-primary mb-4">我們如何使用資料</h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-3">我們使用分析資料以：</p>
          <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm mb-4">
            <li>了解哪些頁面與產品對訪客最有用</li>
            <li>改善網站內容與使用體驗</li>
            <li>監察網站效能</li>
            <li>檢視工作階段重播與熱圖，找出可用性問題</li>
          </ul>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            您分享的聯絡資料僅用於回覆查詢及協助交易。卡牌置中 App 中的電話號碼與評級掃描圖，只用於 Appaw Store
            送件追蹤與顯示。
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            在流動 App 內，Google AdMob 會使用裝置及廣告相關資料以顯示及衡量橫幅廣告。我們不會出售或出租你的個人資料。
          </p>
        </div>

        <div className="mb-10">
          <SectionDivider num="03" />
          <h2 className="text-2xl font-bold font-display text-text-primary mb-4">Cookies</h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            本網站使用 cookies 作分析與改善體驗。您可於首次造訪時透過 cookie 橫幅選擇接受或拒絕非必要 cookies。
            若您拒絕，將不會放置分析 cookies。您可隨時透過 cookie 偏好設定更改選擇。
          </p>
        </div>

        <div className="mb-10">
          <SectionDivider num="04" />
          <h2 className="text-2xl font-bold font-display text-text-primary mb-4">第三方服務</h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            我們使用下列第三方服務；各服務按其自身私隱政策處理資料：
          </p>
          <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm mb-4">
            <li>Google Analytics 4 — 網站分析</li>
            <li>Microsoft Clarity — 行為分析與工作階段重播</li>
            <li>Google AdMob — 卡牌置中 App 橫幅廣告</li>
            <li>WhatsApp（Meta）— 顧客聯絡</li>
            <li>Etsy / Carousell — 購買處理</li>
          </ul>
        </div>

        <div className="mb-10">
          <SectionDivider num="05" />
          <h2 className="text-2xl font-bold font-display text-text-primary mb-4">資料保留與您的權利</h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Google Analytics 4 資料保留 14 個月，期後由 Google 自動刪除。Microsoft Clarity 工作階段錄影及相關分析資料
            按 Microsoft 的保留政策保存（工作階段重播一般最多 30 日）。經 WhatsApp 或電郵分享的聯絡資料，
            以及進度查詢／預約所需資料，僅在處理查詢或完成交易所需期間保留。
          </p>
          <p className="text-text-secondary text-sm leading-relaxed mb-2">您有權：</p>
          <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm mb-4">
            <li>查閱我們持有的您的個人資料</li>
            <li>要求更正不準確資料</li>
            <li>要求刪除資料（在適用法律允許範圍內）</li>
          </ul>
          <p className="text-text-secondary text-sm leading-relaxed">
            行使上述權利，請以 WhatsApp 聯絡：+852-9285-1189，或電郵 support@appaw.store。
          </p>
        </div>

        <div className="mb-10">
          <SectionDivider num="06" />
          <h2 className="text-2xl font-bold font-display text-text-primary mb-4">營運者</h2>
          <p className="font-semibold text-text-primary">{COMPANY.legalName}</p>
          <p className="text-text-secondary text-sm">商業登記號碼 {COMPANY.brNumber}</p>
          <p className="text-text-secondary text-sm mt-4">
            英文版：{' '}
            <Link href="/privacy/" className="text-accent-link hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>

        <div className="mb-2">
          <SectionDivider num="07" />
          <h2 className="text-2xl font-bold font-display text-text-primary mb-4">政策更新</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            我們可能不時更新本政策，頁頂的「最後更新」日期反映最新修訂。更新後繼續使用本網站，
            即表示您接受更新後的政策。
          </p>
        </div>
      </div>
    </main>
  );
}
