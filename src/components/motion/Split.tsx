import { Fragment } from "react";

/**
 * Tách chữ phía server (không layout shift, không cần plugin).
 * Mỗi từ nằm trong một "mặt nạ" overflow-hidden có padding đủ cho dấu tiếng Việt (ệ, ẫ, ử…).
 * Dấu cách nằm NGOÀI inline-block để không bị trình duyệt bỏ đi.
 */
export function SplitWords({ text, dim = [] }: { text: string; /** chỉ số các từ hiển thị nhạt */ dim?: number[] }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="split-word">
            <span className={dim.includes(i) ? "split-inner word-dim" : "split-inner"}>{w}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
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
