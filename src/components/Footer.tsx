import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-pure-black border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo Text */}
          <div className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tighter text-white">
              THE <span className="text-primary">KLAN</span> BJJ
            </span>
          </div>

          {/* Social Icons */}
          <div className="flex gap-6">
            <a
              href="https://www.facebook.com/theklanmartialarts"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white/5 hover:bg-[#1877F2] p-3 rounded-full transition-all duration-300"
              aria-label="Facebook"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/the_klanmx/"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white/5 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] p-3 rounded-full transition-all duration-300"
              aria-label="Instagram"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@theklanmx"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white/5 hover:bg-[#000000] hover:shadow-[0_0_15px_rgba(0,242,234,0.7)] p-3 rounded-full transition-all duration-300 relative overflow-hidden"
              aria-label="TikTok"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00f2ea] to-[#ff0050] opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5 text-white group-hover:scale-110 transition-transform relative z-10"
              >
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.74-1.66.39-.73.54-1.5.54-2.34l-.01-8.98c-1.01.27-2.03.54-3.04.81-.03-1.4-.04-2.8-.01-4.2.02-.33.05-.66.07-.99.01-.25.02-.5.06-.74.1-.23.18-.46.33-.67.14-.2.28-.4.49-.55.19-.14.41-.24.64-.29 1.1-.03 2.19.01 3.28.02z" />
              </svg>
            </a>
          </div>

          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} The Klan BJJ. Honor & Lealtad.
          </p>
        </div>
      </div>
    </footer>
  );
};
