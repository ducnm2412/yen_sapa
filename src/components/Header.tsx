"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Menu, X } from "lucide-react";
import { site } from "@/content/site";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,color] duration-500 ease-(--ease-luxe)",
        solid
          ? "bg-beige-50/95 text-ink shadow-[0_1px_0_rgba(43,42,38,0.08),0_12px_30px_-18px_rgba(43,42,38,0.25)] backdrop-blur"
          : "bg-gradient-to-b from-black/45 to-transparent text-white",
      )}
    >
      {/* Thanh tiến trình cuộn (vàng champagne) */}
      <div
        data-scroll-progress
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-gold-500 via-gold-300 to-gold-500 shadow-[0_0_8px_rgba(216,192,138,0.5)]"
      />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-20 sm:px-6">
        <a
          data-hero="logo"
          href="#trang-chu"
          className="flex items-center gap-2.5 sm:gap-3"
          aria-label={`${site.name} — về đầu trang`}
        >
          <Image
            src="/images/brand/logo-red-mark.png"
            alt=""
            width={48}
            height={48}
            className="size-10 rounded-full ring-1 ring-white/50 min-[400px]:size-11 sm:size-12"
          />
          {/* Tên doanh nghiệp: một kiểu chữ duy nhất, rõ ràng */}
          <span className="text-[15px] leading-none font-semibold tracking-tight whitespace-nowrap min-[400px]:text-lg sm:text-xl">
            {site.name}
          </span>
        </a>

        <nav data-hero="nav" aria-label="Điều hướng chính" className="hidden items-center gap-8 md:flex">
          {site.nav.map((item) => (
            <a key={item.href} href={item.href} data-nav-link className="nav-link text-sm font-medium tracking-wide whitespace-nowrap">
              {item.label}
            </a>
          ))}
          <a
            href={site.bookingAnchor}
            data-magnetic
            className="btn-shimmer rounded-full bg-moss-700 px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-white transition-colors duration-300 hover:bg-moss-800"
          >
            Đặt lịch
          </a>
        </nav>

        <div data-hero="nav" className="flex items-center gap-2 md:hidden">
          <a href={site.bookingAnchor} className="rounded-full bg-moss-700 px-4 py-2 text-sm font-semibold whitespace-nowrap text-white max-[359px]:hidden">
            Đặt lịch
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            className="grid size-11 place-items-center rounded-full"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-menu"
        aria-label="Menu di động"
        inert={!open}
        className={clsx(
          "fixed inset-x-0 top-16 bottom-0 bg-beige-50 px-6 pt-8 transition-[opacity,visibility] duration-500 ease-(--ease-luxe) md:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <ul className="flex flex-col gap-2">
          {site.nav.map((item, i) => (
            <li
              key={item.href}
              style={{ transitionDelay: open ? `${80 + i * 70}ms` : "0ms" }}
              className={clsx(
                "transition-[opacity,transform] duration-700 ease-(--ease-luxe)",
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
              )}
            >
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="block border-b border-beige-200 py-4 font-serif text-3xl text-moss-900"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-muted">
          {site.hours.display} · {site.hours.days}
        </p>
      </nav>
    </header>
  );
}
