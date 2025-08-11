export default function Card({ title, children, toolbar }: { title?: string; children: React.ReactNode; toolbar?: React.ReactNode; }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {(title || toolbar) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          {title ? <h3 className="text-lg font-semibold tracking-tight">{title}</h3> : <div />}
          {toolbar}
        </div>
      )}
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}