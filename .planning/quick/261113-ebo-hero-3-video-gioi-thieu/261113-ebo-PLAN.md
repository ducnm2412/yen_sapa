---
quick_id: 261113-ebo
slug: hero-3-video-gioi-thieu
date: 2026-11-13
---

# Quick: Hero dùng 3 video giới thiệu

## Goal
Hero section giới thiệu spa bằng 3 video dọc (9:16) phát luân phiên, không làm hỏng LCP.

## Tasks
1. Tạo `src/components/HeroVideoReel.tsx` (client):
   - 3 clip: space-tour-1 (Không gian), facial-led-device (Công nghệ), face-lifting (Liệu trình); mỗi clip phát một đoạn ~7s rồi chuyển.
   - `muted playsInline`, chỉ gắn `src` cho clip đang phát + clip kế tiếp (lazy), faststart nên chỉ tải phần cần.
   - Mobile: làm nền toàn màn hình (fade-in phủ lên ảnh LCP khi đã phát). Desktop (lg+): khung reels 9:16 bên phải.
   - Thanh tiến trình 3 đoạn + nhãn, bấm để chuyển clip.
   - Tạm dừng khi hero khuất màn hình hoặc tab ẩn; không render khi prefers-reduced-motion.
2. Gắn vào `src/components/Hero.tsx`; ảnh treatment-room vẫn `preload` làm nền LCP.

## Verify
- `npx tsc --noEmit`, `npx eslint`, `npm run build` pass.
