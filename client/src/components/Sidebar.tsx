"use client";

import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tag,
  Settings,
  Menu,
  X,
  ShoppingCart,
  Percent,
  BarChart2,
  ClipboardList,
} from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed z-50 bottom-4 right-4 md:hidden bg-indigo-600 text-white p-3 rounded-full shadow-lg"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - fixed on mobile, fixed width on desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <h2 className="text-xl font-bold text-indigo-600">Inventory App</h2>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
              onClick={closeSidebar}
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
              onClick={closeSidebar}
            >
              <Package className="mr-3 h-5 w-5" />
              Products
            </NavLink>

            <NavLink
              to="/categories"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
              onClick={closeSidebar}
            >
              <Tag className="mr-3 h-5 w-5" />
              Categories
            </NavLink>

            <NavLink
              to="/order-items"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
              onClick={closeSidebar}
            >
              <ShoppingCart className="mr-3 h-5 w-5" />
              Order Items
            </NavLink>

            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
              onClick={closeSidebar}
            >
              <ClipboardList className="mr-3 h-5 w-5" />
              Orders
            </NavLink>

            <NavLink
              to="/discounts"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
              onClick={closeSidebar}
            >
              <Percent className="mr-3 h-5 w-5" />
              Discounts
            </NavLink>

            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
              onClick={closeSidebar}
            >
              <BarChart2 className="mr-3 h-5 w-5" />
              Reports
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
              onClick={closeSidebar}
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </NavLink>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Inventory Management
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
