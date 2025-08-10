interface InfoBoxProps {
  label: string;
  value: string;
}

export function InfoBox({ label, value }: InfoBoxProps) {
  return (
    <div className="rounded-lg border p-2">
      <div className="text-[10px] uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <div className="text-sm">{value}</div>
    </div>
  );
}