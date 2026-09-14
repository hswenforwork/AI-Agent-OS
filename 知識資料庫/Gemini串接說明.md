# Google Gemini API 串接說明

## 安全架構

`GitHub Pages → Cloudflare Worker → Google Gemini API`

Gemini API 金鑰只存放在 Cloudflare Worker 的加密機密設定，不可寫進 GitHub、HTML、JSON 或聊天訊息。

## Worker 需要的兩個機密

| 名稱 | 用途 |
|---|---|
| `GEMINI_API_KEY` | 您在 Google AI Studio 建立的 Gemini API 金鑰 |
| `APP_ACCESS_KEY` | 您自行設定的平台私人通行碼 |

## 部署後要更新的設定

Cloudflare 會提供一個以 `workers.dev` 結尾的網址。請將該網址填入 `系統設定/AI服務設定.json` 的 `API網址`，不要在網址後方加入 `/chat`。

## 安全注意事項

- 不要把 Gemini API 金鑰貼到聊天中。
- 不要把 Gemini API 金鑰提交到 GitHub。
- 公用電腦使用完畢後，請關閉網頁並登出相關帳號。
- 私人通行碼不會保存在平台，重新整理頁面後需要重新輸入。
- Cloudflare Worker 只允許 `hswenforwork.github.io` 網站來源及指定模型。

## 第一階段模型

- Gemini 3.8 Flash：一般工作與快速回覆。
- Gemini 3.5 Flash-Lite：大量、低成本任務。
- Gemini 3.1 Pro Preview：需要較高推理能力的任務。
