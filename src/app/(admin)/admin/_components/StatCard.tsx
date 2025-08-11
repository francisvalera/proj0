export default function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="p-5">
        <div className="text-sm text-slate-500">{label}</div>
        <div className="text-2xl font-semibold mt-1 text-slate-900">{value}</div>
        {hint ? <div className="text-xs text-slate-400 mt-1">{hint}</div> : null}
      </div>
    </div>
  );
}
