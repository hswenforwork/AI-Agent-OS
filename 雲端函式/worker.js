const 允許來源 = "https://hswenforwork.github.io";
const 允許模型 = new Set([
  "gemini-3.8-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-pro-preview"
]);

function 跨網域標頭(origin) {
  return {
    "Access-Control-Allow-Origin": origin === 允許來源 ? origin : 允許來源,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Access-Key",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  };
}

function 回應(origin, body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: 跨網域標頭(origin)
  });
}

function 取得文字(data) {
  if (typeof data.output_text === "string") return data.output_text;
  const texts = [];
  for (const step of data.steps || []) {
    const contents = step?.output || step?.content || [];
    for (const item of Array.isArray(contents) ? contents : [contents]) {
      if (item?.type === "text" && item.text) texts.push(item.text);
      if (typeof item?.text === "string") texts.push(item.text);
    }
  }
  return texts.join("\n").trim();
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: 跨網域標頭(origin) });
    }
    if (origin && origin !== 允許來源) {
      return 回應(origin, { 錯誤: "不允許的網站來源" }, 403);
    }
    if (!env.GEMINI_API_KEY || !env.APP_ACCESS_KEY) {
      return 回應(origin, { 錯誤: "Worker 尚未完成機密設定" }, 503);
    }
    if (request.headers.get("X-Access-Key") !== env.APP_ACCESS_KEY) {
      return 回應(origin, { 錯誤: "私人通行碼不正確" }, 401);
    }

    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/health") {
      return 回應(origin, { 狀態: "正常", 供應商: "Google Gemini" });
    }
    if (request.method !== "POST" || url.pathname !== "/chat") {
      return 回應(origin, { 錯誤: "找不到這個服務路徑" }, 404);
    }

    try {
      const body = await request.json();
      const model = 允許模型.has(body.模型) ? body.模型 : "gemini-3.8-flash";
      const history = Array.isArray(body.訊息) ? body.訊息.slice(-12) : [];
      const input = history
        .map(item => `${item.角色 === "AI" ? "AI" : "使用者"}：${String(item.內容 || "").slice(0, 12000)}`)
        .join("\n\n")
        .slice(0, 30000);
      if (!input.trim()) return 回應(origin, { 錯誤: "訊息不可為空白" }, 400);

      const googleResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          model,
          system_instruction: `你是${body.代理名稱 || "AI代理"}。你的角色是：${body.代理角色 || "協助使用者完成任務"}。請使用繁體中文，先給結論，再提供清楚可執行的步驟。`,
          input,
          generation_config: { temperature: 0.6 }
        })
      });
      const data = await googleResponse.json();
      if (!googleResponse.ok) {
        console.error("Gemini API error", googleResponse.status);
        return 回應(origin, { 錯誤: `Gemini API 呼叫失敗（${googleResponse.status}）` }, 502);
      }
      const answer = 取得文字(data);
      if (!answer) return 回應(origin, { 錯誤: "Gemini 沒有傳回文字內容" }, 502);
      return 回應(origin, { 回覆: answer, 模型: model });
    } catch (error) {
      console.error("Worker error", error);
      return 回應(origin, { 錯誤: "處理請求時發生錯誤" }, 500);
    }
  }
};
