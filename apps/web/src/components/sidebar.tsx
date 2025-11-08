"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  LayoutDashboard, 
  FileText, 
  Folder, 
  Users, 
  User, 
  Settings,
  MessageSquare,
  X,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: FileText, label: "Invoice", href: "/invoice" },
  { icon: Folder, label: "Other files", href: "/files" },
  { icon: Users, label: "Departments", href: "/departments" },
  { icon: User, label: "Users", href: "/users" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: MessageSquare, label: "Chat with Data", href: "/chat" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white border shadow-md"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed lg:static inset-y-0 left-0 z-40 flex h-screen w-64 flex-col border-r bg-white transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 flex-shrink-0">
          <span className="text-lg font-bold text-blue-600">B</span>
        </div>
        <div className="min-w-0">
          <div className="font-semibold truncate text-blue-600">Buchhaltung</div>
          <div className="text-xs text-gray-500">12 members</div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden ml-auto p-1 rounded-md hover:bg-gray-100"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        <div className="mb-4 px-2 text-xs font-semibold uppercase text-gray-500">
          GENERAL
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="mb-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">
          Rohit Kumar
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>Flowbit AI</span>
          <span className="text-blue-600">→</span>
        </div>
      </div>
      </div>
    </>
  );
}

