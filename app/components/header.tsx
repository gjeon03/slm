import Image from "next/image";

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-[#F9CE61]">
          <Image
            src="/favicon.ico"
            alt="Logo"
            width={24}
            height={24}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-semibold tracking-tight">SLM</span>
      </div>
    </header>
  );
}
