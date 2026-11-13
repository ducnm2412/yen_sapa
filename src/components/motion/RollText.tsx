/** Chữ cuộn khi hover nút/link cha: chữ trượt lên, bản sao thế chỗ (CSS .roll-text trong globals.css). */
export function RollText({ label }: { label: string }) {
  return (
    <span className="roll-text">
      <span>{label}</span>
      <span aria-hidden="true">{label}</span>
    </span>
  );
}
