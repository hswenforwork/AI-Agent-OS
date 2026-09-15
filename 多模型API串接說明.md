# 多模型 API 串接說明

這份文件取代舊版「只有 Gemini」的說明，涵蓋平台目前支援的三家供應商。三家的連線方式相同：**瀏覽器直接呼叫供應商 API，金鑰只暫存在目前分頁的記憶體**，不會寫入 GitHub、JSON、Markdown 或瀏覽器 `localStorage`；重新整理或關閉分頁後金鑰會自動消失。

## 目前連線方式

`GitHub Pages 瀏覽器 → 供應商 API（Gemini / OpenAI / Claude，依你選的模型決定）`

這是個人 MVP 使用的最簡單方式，不需要安裝軟體。`雲端函式` 資料夾保留作為未來要做「真正背景自動化、金鑰放伺服器」時的升級起點（見下方「進階備用方案」與開發路線圖），目前網站不會呼叫其中的 Cloudflare Worker。

## 一、Google Gemini

1. 前往 [Google AI Studio](https://aistudio.google.com/apikey) 建立金鑰。
2. 在 AI 工作台選擇 Gemini 底下任一模型，貼入「Gemini API 金鑰」。
3. 點選「測試連線」。
4. 免費額度用完時，平台會自動改用較省成本的模型並在畫面提示。

## 二、OpenAI ChatGPT

1. 前往 [OpenAI Platform](https://platform.openai.com/api-keys) 建立帳號（與網頁版 ChatGPT Plus 訂閱是不同系統，需要另外設定計費方式才能呼叫 API）。
2. 建立金鑰（`sk-` 開頭）。
3. 在 AI 工作台選擇 OpenAI 底下任一模型，貼入「OpenAI API 金鑰」。
4. 點選「測試連線」。
5. 模型代碼可能隨時間變動，若測試失敗，先到 OpenAI Platform 的模型清單核對目前正確的代碼字串，再回來更新 `系統設定/AI服務設定.json`。

## 三、Anthropic Claude

1. 前往 [Anthropic Console](https://console.anthropic.com/settings/keys) 建立金鑰（`sk-ant-` 開頭）。這跟你平常用的 Claude.ai／Cowork 訂閱是不同帳號、分開計費——**如果只是想找 Claude 討論事情，直接開一般 Claude 對話通常更省錢**，這裡的 API 金鑰是給「需要平台自動呼叫 Claude、當作團隊一員」的情境用的。
2. 平台呼叫 Claude API 時會加上 `anthropic-dangerous-direct-browser-access` 標頭，讓瀏覽器可以直接呼叫（這是 Anthropic 提供給雛型／個人專案使用的做法，官方不建議用在會被不特定多人使用的正式產品）。
3. 在 AI 工作台選擇 Claude 底下任一模型，貼入「Claude API 金鑰」，點選「測試連線」。

## 安全注意事項（三家通用）

- 本方式適合個人 MVP，不適合開放給不特定使用者——任何拿到這個網頁又能操作瀏覽器開發者工具的人，理論上都能看到你當下貼入的金鑰。
- 公用電腦請使用無痕視窗，完成後關閉全部無痕視窗並登出各服務。
- 不要讓瀏覽器記住金鑰，也不要把金鑰貼到聊天室、GitHub 或任何 Markdown 文件。
- 金鑰疑似外洩時，立即到對應供應商後台撤銷並重新建立。
- 建議在各供應商後台為金鑰設定用量上限或告警，不要只依賴這個平台的費用估算（平台的估算是依文字長度粗略換算，不是官方帳單）。

## 費用估算的限制

工作台的「本月預估花費」是用文字長度粗略換算 token 數乘以價格算出來的概估值，不是供應商的即時用量 API，實際費用請以各供應商後台帳單為準。這個估算的目的是提醒你「大概燒了多少」，避免完全沒有感覺地一直呼叫，不是精確計費工具。

## 進階備用方案

儲存庫內的 `雲端函式` 資料夾保留作為未來正式升級的起點：把金鑰移到伺服器端（例如 Cloudflare Worker、Supabase Edge Function），才能做到真正不需要使用者每次貼金鑰、且能在背景執行的自動化。這是 2026-09-14 訪談確認的下一階段方向，目前尚未實作，詳見 [開發計畫與路線圖](開發計畫與路線圖.md)。
