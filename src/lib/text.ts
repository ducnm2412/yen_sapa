const NBSP = " ";
const GLUE_TOKENS = new Set(["/", "—", "–", "-", "·", "&", "+"]);

/**
 * Chống "chữ mồ côi": nối từ cuối với từ liền trước bằng dấu cách không ngắt,
 * nên dòng cuối luôn có ít nhất 2 từ. Nếu từ liền trước là ký hiệu (/, —, ·…)
 * thì nối thêm một từ nữa để không còn "/ Aquamarine" đứng riêng.
 */
export function noOrphan(text: string): string {
  const words = text.trim().split(/\s+/);
  if (words.length < 3) return text;
  let glue = 1;
  if (GLUE_TOKENS.has(words[words.length - 2]) && words.length >= 4) glue = 2;
  const head = words.slice(0, words.length - glue - 1).join(" ");
  const tail = words.slice(words.length - glue - 1).join(NBSP);
  return head ? `${head} ${tail}` : tail;
}
