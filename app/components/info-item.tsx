interface InfoItemProps {
  title: string;
  value?: string;
  icon?: React.ReactNode;
}

export default function InfoItem({ title, value, icon }: InfoItemProps) {
  return (
    <div className="flex flex-col bg-gray-50 p-4 rounded-b-xl">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="mt-1 flex items-center gap-2">
        <div className="flex-1">
          <span className="text-sm font-semibold text-gray-800 break-all">
            {value || "—"}
          </span>
        </div>
        {icon ? icon : null}
      </div>
    </div>
  );
}
