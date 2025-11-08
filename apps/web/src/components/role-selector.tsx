"use client";

import { User, Shield, Users } from "lucide-react";

type Role = "admin" | "manager" | "user" | "all";

interface RoleSelectorProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

export function RoleSelector({ currentRole, onRoleChange }: RoleSelectorProps) {
  const roles: { value: Role; label: string; icon: JSX.Element }[] = [
    { value: "all", label: "All Data", icon: <User className="h-4 w-4" /> },
    { value: "admin", label: "Admin", icon: <Shield className="h-4 w-4" /> },
    { value: "manager", label: "Manager", icon: <Users className="h-4 w-4" /> },
    { value: "user", label: "User", icon: <User className="h-4 w-4" /> },
  ];

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700">View:</label>
      <div className="flex gap-1 border rounded-md p-1 bg-white">
        {roles.map((role) => (
          <button
            key={role.value}
            onClick={() => onRoleChange(role.value)}
            className={`flex items-center gap-1 px-3 py-1 text-xs rounded transition-colors ${
              currentRole === role.value
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {role.icon}
            <span>{role.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

