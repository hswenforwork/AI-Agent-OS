# Google Gemini API 串接說明

## 目前連線方式

`GitHub Pages 瀏覽器 → Google Gemini API`

這是個人 MVP 使用的最簡單方式，不需要安裝軟體，也不需要建立 Cloudflare Worker。

## 使用方法

1. 前往 [Google AI Studio](https://aistudio.google.com/apikey) 建立 Gemini API 金鑰。
2. 開啟 AI Agent OS 的「AI 工作台」。
3. 將金鑰貼入「Gemini API 金鑰」。
4. 選擇 AI 代理與模型。
5. 點選「測試連線」，成功後即可開始對話。

## 金鑰保存方式

- 金鑰只暫存在目前分頁的記憶體。
- 金鑰不會寫入 GitHub、JSON、Markdown 或瀏覽器 `localStorage`。
- 重新整理或關閉分頁後，金鑰會自動消失。
- 平台只會把金鑰傳送到 Google Gemini API。

## 安全注意事項

- 本方式適合個人 MVP，不適合開放給不特定使用者。
- 公用電腦請使用無痕視窗，完成後關閉全部無痕視窗並登出 Google 與 GitHub。
- 不要讓瀏覽器記住金鑰，也不要將金鑰貼到聊天室或 GitHub。
- 如果金鑰疑似外洩，請立即到 Google AI Studio 撤銷並重新建立。
- 建議在 Google Cloud 為金鑰設定 API 限制與使用額度警示。

## 第一階段模型

- Gemini 3.8 Flash：一般工作與快速回覆。
- Gemini 3.5 Flash-Lite：大量、低成本任務。
- Gemini 3.1 Pro Preview：需要較高推理能力的任務。

## 進階備用方案

儲存庫內的 `雲端函式` 資料夾保留作為未來正式公開服務的安全升級方案；目前網站不會呼叫其中的 Cloudflare Worker 程式。
