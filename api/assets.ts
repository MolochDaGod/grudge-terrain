const queue: unknown[] = [];

export default function handler(req: { method?: string; body?: unknown }, res: {
  setHeader: (k: string, v: string) => void;
  status: (n: number) => { json: (b: unknown) => unknown; end: () => unknown };
}) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method === "POST") {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body ?? {};
    queue.push({ ...(body as object), at: new Date().toISOString() });
    return res.status(200).json({
      ok: true,
      publish: "https://assets.grudge-studio.com/models/nature/organized/uploads/",
      wrangler: "npx wrangler r2 object put grudge-assets/models/nature/organized/uploads/<file> --file=<local> --remote",
    });
  }
  res.status(200).json({ cdn: "https://assets.grudge-studio.com", queue });
}
