export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="text-center w-full mb-12 fade-in">
      <h2 className="font-serif text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-white to-purple-200 mb-4 drop-shadow-sm">{title}</h2>
      {subtitle && <p className="text-purple-300/80 font-serif italic text-lg tracking-wide">{subtitle}</p>}
      <div className="w-24 h-1 bg-gradient-to-r from-purple-900/50 via-purple-500/80 to-purple-900/50 mx-auto mt-6 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.4)]"></div>
    </div>
  );
}
