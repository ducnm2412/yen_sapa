---
quick_id: 261113-ebo
slug: hero-3-video-gioi-thieu
status: complete
date: 2026-11-13
---

# Summary: Hero dùng 3 video làm nền

Theo yêu cầu bổ sung của người dùng, thiết kế đổi từ "khung reels bên phải" sang **nền hero chia 3 cột, mỗi cột một video**.

## Changes
- `src/components/HeroVideoReel.tsx` (mới, client): lưới 3 cột `space-tour-1`, `facial-led-device`, `face-lifting`; `autoPlay muted loop playsInline preload="metadata"`; mỗi video fade-in khi đã phát (ảnh LCP treatment-room vẫn ở dưới); pause khi hero khuất màn hình / tab ẩn; không render khi `prefers-reduced-motion: reduce`.
- `src/components/Hero.tsx`: chèn `<HeroVideoReel />` giữa ảnh nền và lớp gradient.

## Deviations
- Thực thi inline thay vì executor trong worktree: `src/` chưa được commit nên worktree không có mã nguồn.
- `space-tour-1.mp4` là bản 1080p ~20MB; nên nén về 720p (FFmpeg chưa cài trên máy).

## Verify
- `tsc --noEmit`, `eslint`, `npm run build` pass. Chưa kiểm tra trực quan trên thiết bị thật.
