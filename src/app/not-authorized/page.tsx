export default function NotAuthorized() {
  return (
    <div className="min-h-[60vh] grid place-items-center p-8">
      <div className="max-w-md space-y-3 text-center">
        <h1 className="text-2xl font-semibold">Not authorized</h1>
        <p className="text-slate-600">Your account doesn’t have admin access. Please sign in with an admin user.</p>
        <a href="/login" className="inline-flex justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Go to login</a>
      </div>
    </div>
  );
}