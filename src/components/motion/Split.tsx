import { Fragment } from "react";

/** "~" trong chuỗi = dấu cách không ngắt dòng, dùng để giữ nguyên từ ghép tiếng Việt (chuyên~nghiệp, an~yên). */
const glue = (w: string) => w.replace(/~/g, " ");

/**
 * Tách chữ phía server (không layout shift, không cần plugin).
 * Mỗi từ nằm trong một "mặt nạ" overflow-hidden có padding đủ cho dấu tiếng Việt (ệ, ẫ, ử…).
 * Dấu cách nằm NGOÀI inline-block để không bị trình duyệt bỏ đi.
 */
export function SplitWords({ text, dim = [] }: { text: string; /** chỉ số các từ hiển thị nhạt */ dim?: number[] }) {
  const words = text.split(" ");
  const word = (i: number) => (
    <span className="split-word">
      <span className={dim.includes(i) ? "split-inner word-dim" : "split-inner"}>{glue(words[i])}</span>
    </span>
  );
  // Ghép 2 từ cuối vào một khối không ngắt dòng để không bao giờ có 1 chữ trơ trọi ở dòng cuối
  // (mỗi từ là inline-block nên không dùng được &nbsp;).
  const tailCount = words.length >= 3 ? 2 : 0;
  const head = words.length - tailCount;
  return (
    <>
      {words.slice(0, head).map((_, i) => (
        <Fragment key={i}>
          {word(i)}
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
      {tailCount > 0 && (
        <span className="whitespace-nowrap">
          {word(head)} {word(head + 1)}
        </span>
      )}
    </>
  );
}

export function SplitChars({ text }: { text: string }) {
  return (
    <span>
      <span className="sr-only">{text}</span>
      {/* Gom ký tự theo từ để trình duyệt chỉ xuống dòng giữa các từ */}
      {text.split(" ").map((word, wi, arr) => (
        <Fragment key={wi}>
          <span aria-hidden="true" className="whitespace-nowrap">
            {Array.from(word).map((c, i) => (
              <span key={i} className="split-char">
                {c}
              </span>
            ))}
          </span>
          {wi < arr.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
