export default function Section({
  title,
  children,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}
