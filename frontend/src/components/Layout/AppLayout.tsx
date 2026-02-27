export function AppLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container">
      <div className="card">
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
}
