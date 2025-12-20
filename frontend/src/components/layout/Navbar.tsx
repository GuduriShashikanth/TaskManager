import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";
import { NotificationBell } from "../notifications/NotificationBell";

export function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="font-bold text-xl text-gray-900">TaskFlow</span>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <NotificationBell />
            <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
            <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
          </div>

          <div className="sm:hidden flex items-center gap-2">
            <NotificationBell />
            <button className="p-2" onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="sm:hidden pb-4 border-t">
            <div className="pt-4 space-y-2">
              <p className="text-sm text-gray-600 px-2">Welcome, {user?.name}</p>
              <Button variant="ghost" size="sm" onClick={logout} className="w-full justify-start">Logout</Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
