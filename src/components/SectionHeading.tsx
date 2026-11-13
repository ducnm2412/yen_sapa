import clsx from "clsx";
import { SplitChars, SplitWords } from "@/components/motion/Split";

export function SectionHeading({
  eyebrow,
  title,
  text,
  light,
  dim,
  titleEffect = "words",
}: {
  dim?: number[];
  titleEffect?: "words" | "blur-words";
  eyebrow: string;
  title: string;
  text?: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      <p
        className={clsx(
          "flex items-center gap-3 text-xs font-semibold tracking-[0.3em] uppercase",
          light ? "text-beige-200" : "text-moss-700",
        )}
      >
        <span data-reveal="line" className="h-px w-8 origin-left bg-burgundy" aria-hidden="true" />
        <span data-reveal="chars">
          <SplitChars text={eyebrow} />
        </span>
      </p>
      <h2
        data-reveal={titleEffect}
        className={clsx(
          "mt-4 font-serif text-4xl leading-tight font-medium sm:text-5xl",
          light ? "text-white" : "text-moss-900",
        )}
      >
        <SplitWords text={title} dim={dim} />
      </h2>
      {text && (
        <p
          data-reveal="fade-up"
          data-delay="0.2"
          className={clsx("mt-4 text-base leading-relaxed sm:text-lg", light ? "text-beige-100" : "text-muted")}
        >
          {text}
        </p>
      )}
    </div>
  );
}
