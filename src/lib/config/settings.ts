import prisma from "@/lib/prisma";

type EffectiveSettings = {
  storeEmail: string;
  fromEmail: string;
  storeName: string;
};

let cache: EffectiveSettings | null = null;
let ts = 0;
const TTL = 60_000; // 60s

export async function getEffectiveSettings(): Promise<EffectiveSettings> {
  const now = Date.now();
  if (cache && now - ts < TTL) return cache;

  // Read the single Settings row (you already seed storeEmail)
  const row = await prisma.settings.findFirst();

  const storeEmail = row?.storeEmail || process.env.EMAIL_SERVER_USER || "";
  const fromEmail = process.env.EMAIL_FROM || `Kuya Kards <${process.env.EMAIL_SERVER_USER ?? "no-reply@example.com"}>`;
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Kuya Kardz Motorcycle Trading";

  cache = { storeEmail, fromEmail, storeName };
  ts = now;
  return cache;
}