import "./globals.css";

export const metadata = {
  title: "F1 AI Race Strategist",
  description: "AI-Powered F1 Strategy Engine",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-white min-h-screen font-sans">
        <nav className="border-b border-gray-800 bg-[#111] px-6 py-4 flex items-center gap-6">
          <h1 className="text-xl font-bold text-red-600 tracking-widest">ARIS</h1>
          <div className="flex gap-4 text-sm text-gray-400">
            <span className="hover:text-white cursor-pointer transition">HOME</span>
            <span className="hover:text-white cursor-pointer transition">LIVE</span>
            <span className="hover:text-white cursor-pointer transition">REPLAY</span>
            <span className="hover:text-white cursor-pointer transition">STANDINGS</span>
          </div>
        </nav>

        <main className="p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}