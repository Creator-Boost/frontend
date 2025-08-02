export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-center px-4 w-full max-w-screen-sm">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-white tracking-wide relative">
          <span className="relative inline-block  overflow-hidden">
            <span className="relative z-10 inline-block animate-textReveal">
              <span className="text-emerald-500 text-8xl tracking-widest font-bold">Creator</span>
              <span className="text-white text-8xl tracking-widest font-bold">Boost</span>
            </span>
            <span className="absolute inset-0 bg-black animate-textMask z-20" />
          </span>
        </h1>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes textReveal {
          0% { opacity: 0; transform: translateY(10px); }
          70% { opacity: 1; transform: translateY(0); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes textMask {
          0% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        .animate-textReveal {
          animation: textReveal 1s ease forwards;
        }
        .animate-textMask {
          animation: textMask 1s ease forwards;
        }
      `}</style>
    </div>
  );
}
