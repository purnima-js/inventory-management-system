"use client"

import { useLogout, useUser } from "../hooks/useAuth"
import { Menu } from "lucide-react"
import { useState } from "react"
import CartIcon from "./CartIcon"

const Navbar = () => {
  const { data: user } = useUser()
  const logout = useLogout()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout.mutate()
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 flex items-center">
            <h1 className="text-xl font-semibold">Inventory Management</h1>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-4">
            <CartIcon />
            <div className="text-sm text-gray-600">
              Welcome, <span className="font-medium">{user?.username}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary text-sm" disabled={logout.isPending}>
              {logout.isPending ? "Logging out..." : "Logout"}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <CartIcon />
            <button
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMenuOpen && (
          <div className="md:hidden py-2 border-t border-gray-200">
            <div className="px-4 py-2 text-sm text-gray-600">
              Welcome, <span className="font-medium">{user?.username}</span>
            </div>
            <div className="px-4 py-2">
              <button onClick={handleLogout} className="w-full btn btn-secondary text-sm" disabled={logout.isPending}>
                {logout.isPending ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
