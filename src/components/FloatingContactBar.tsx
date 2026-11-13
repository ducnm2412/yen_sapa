import { Phone } from "lucide-react";
import { site } from "@/content/site";
import { MessengerIcon, ZaloIcon } from "@/components/icons/BrandIcons";

/**
 * Thanh liên hệ cố định ở đáy màn hình trên mobile (D-11, D-12).
 * Thuần HTML: link tel:/Zalo/Messenger và <details> chọn chi nhánh hoạt động cả khi chưa có JavaScript.
 */
export function FloatingContactBar() {
  return (
    <div className="animate-rise-in fixed inset-x-0 bottom-0 z-30 border-t border-beige-200 bg-beige-50/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <div className="grid grid-cols-3">
        <details className="group relative">
          <summary className="flex h-16 cursor-pointer flex-col items-center justify-center gap-1 text-xs font-semibold text-moss-800">
            <Phone className="size-5" aria-hidden="true" />
            Gọi
          </summary>
          <div className="absolute bottom-[calc(100%+0.5rem)] left-2 w-64 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-beige-200">
            <p className="px-3 pt-2 pb-1 text-xs font-medium text-muted">Chọn chi nhánh để gọi</p>
            {site.branches.map((b) => (
              <a
                key={b.id}
                href={`tel:${b.hotlineE164}`}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-sm text-ink hover:bg-beige-100"
              >
                <span className="font-semibold">{b.shortName}</span>
                <span className="text-moss-700">{b.hotlineDisplay}</span>
              </a>
            ))}
          </div>
        </details>
        <a
          href={site.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-16 flex-col items-center justify-center gap-1 border-x border-beige-200 text-xs font-semibold text-moss-800"
        >
          <ZaloIcon className="size-6 text-[#0068ff]" />
          Zalo
        </a>
        <a
          href={site.messengerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-16 flex-col items-center justify-center gap-1 text-xs font-semibold text-moss-800"
        >
          <MessengerIcon className="size-5 text-[#0866ff]" />
          Messenger
        </a>
      </div>
    </div>
  );
}
