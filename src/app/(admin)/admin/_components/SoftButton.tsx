export default function SoftButton({ children, icon, onClick, ariaLabel }: { children?: React.ReactNode; icon?: React.ReactNode; onClick?: () => void; ariaLabel?: string; }) {
  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-neutral-50 active:shadow"
    >
      {icon}
      {children}
    </button>
  );
}