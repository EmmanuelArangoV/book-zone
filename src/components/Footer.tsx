export default function Footer() {
  return (
    <footer className="bg-[#1c1410] text-[#f7f3e9] border-t-4 border-[#c8860a] mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-lg font-light tracking-widest uppercase">BOOK</span>
            <span className="text-lg font-black text-[#c8860a] tracking-widest uppercase">ZONE</span>
            <p className="text-xs text-[#c8860a] mt-1 uppercase tracking-widest">Est. 2024</p>
          </div>
          <p className="text-xs text-[#5c3d2e] uppercase tracking-widest">
            © {new Date().getFullYear()} BookZone. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
