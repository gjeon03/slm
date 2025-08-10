export default function Footer() {
  return (
    <footer className="py-8 text-center text-xs text-gray-400 space-y-2">
      <div className="flex items-center justify-center gap-2">
        <span>Made with ❤️ by</span>
        <a
          href="mailto:bygimbap@gmail.com"
          className="text-[#ffbe6b] hover:text-[#ffddae] transition-colors"
        >
          bygimbap
        </a>
      </div>
    </footer>
  );
}
