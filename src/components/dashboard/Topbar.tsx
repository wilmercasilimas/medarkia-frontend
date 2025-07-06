export default function Topbar() {
  return (
    <header className="w-full bg-white border-b px-4 py-3 shadow-sm flex justify-between items-center">
      <h1 className="text-xl font-semibold text-primary">Panel Medarkia</h1>
      <div className="flex items-center gap-4">
        {/* Aquí podría ir el avatar del usuario, botón de logout, etc */}
        <span className="text-sm text-gray-600">Dr. Wilmer</span>
      </div>
    </header>
  );
}
