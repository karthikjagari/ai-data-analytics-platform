"use client";

import { MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header({ title }: { title: string }) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-6">
      <h1 className="text-lg lg:text-xl font-semibold truncate">{title}</h1>
      
      <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
        <div className="hidden md:flex items-center gap-2 rounded-lg bg-red-100 px-3 py-1.5 text-sm text-red-700">
          <span>←</span>
          <span className="whitespace-nowrap">Ayushman Tiwari</span>
        </div>
        
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="hidden sm:block text-right">
            <div className="text-sm font-medium">Amit Jadhav</div>
            <div className="text-xs text-gray-500">Admin</div>
          </div>
          <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
            <AvatarFallback className="text-xs lg:text-sm">AJ</AvatarFallback>
          </Avatar>
          <button className="text-gray-400 hover:text-gray-600 p-1">
            <MoreVertical className="h-4 w-4 lg:h-5 lg:w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

