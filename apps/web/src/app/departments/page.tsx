"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Plus, Building2, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";

interface Department {
  id: string;
  name: string;
  description?: string;
  budget?: number;
  color?: string;
  avatar?: string;
  memberCount: number;
  fileCount: number;
  createdAt: string;
  updatedAt: string;
}

const defaultColors = [
  { bg: "bg-blue-100", text: "text-blue-600" },
  { bg: "bg-green-100", text: "text-green-600" },
  { bg: "bg-purple-100", text: "text-purple-600" },
  { bg: "bg-orange-100", text: "text-orange-600" },
  { bg: "bg-pink-100", text: "text-pink-600" },
  { bg: "bg-yellow-100", text: "text-yellow-600" },
];

type DepartmentColor = 
  | { bg: string; text: string; custom?: never }
  | { bg: string; text: string; custom: string };

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    budget: "",
    color: "",
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || "/api";
      const response = await fetch(`${apiBase}/departments`);
      const data = await response.json();
      setDepartments(data.departments || []);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingDept(null);
    setFormData({ name: "", description: "", budget: "", color: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (dept: Department) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      description: dept.description || "",
      budget: dept.budget?.toString() || "",
      color: dept.color || "",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name) {
      alert("Name is required");
      return;
    }

    setLoading(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || "/api";
      const url = editingDept
        ? `${apiBase}/departments/${editingDept.id}`
        : `${apiBase}/departments`;
      const method = editingDept ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          budget: formData.budget ? parseFloat(formData.budget) : null,
          color: formData.color || null,
        }),
      });

      if (response.ok) {
        alert(editingDept ? "Department updated successfully!" : "Department created successfully!");
        setIsDialogOpen(false);
        fetchDepartments();
      } else {
        const error = await response.json();
        alert(`Failed to save: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error saving department:", error);
      alert("Failed to save department");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department?")) return;

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || "/api";
      const response = await fetch(`${apiBase}/departments/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Department deleted successfully!");
        fetchDepartments();
      } else {
        const error = await response.json();
        alert(`Failed to delete: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting department:", error);
      alert("Failed to delete department");
    }
  };

  const getDepartmentColor = (dept: Department, index: number): DepartmentColor => {
    if (dept.color) {
      // If color is a hex code, use it as background
      if (dept.color.startsWith("#")) {
        return { bg: "", text: "", custom: dept.color };
      }
    }
    const colorIndex = index % defaultColors.length;
    return defaultColors[colorIndex];
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden lg:ml-0">
        <Header title="Departments" />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">
          {/* Header Actions */}
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage organizational departments ({departments.length} total)
              </p>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              New Department
            </Button>
          </div>

          {/* Departments Grid */}
          {loading && departments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading departments...</p>
            </div>
          ) : departments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No departments yet</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Create your first department to get started
                </p>
                <Button onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Department
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {departments.map((dept, index) => {
                const color = getDepartmentColor(dept, index);
                return (
                  <Card key={dept.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div
                          className={`p-3 rounded-lg ${
                            "custom" in color && color.custom
                              ? ""
                              : `${color.bg} ${color.text}`
                          }`}
                          style={"custom" in color && color.custom ? { backgroundColor: color.custom + "20", color: color.custom } : {}}
                        >
                          <Building2 className="h-6 w-6" />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{dept.memberCount}</div>
                          <div className="text-xs text-gray-500">Members</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <CardTitle>{dept.name}</CardTitle>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(dept)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(dept.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {dept.description && (
                          <p className="text-sm text-gray-600">{dept.description}</p>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Budget</span>
                          <span className="font-semibold">
                            {dept.budget ? formatCurrency(dept.budget) : "Not set"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Files</span>
                          <span className="font-semibold">{dept.fileCount}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {[...Array(Math.min(dept.memberCount, 5))].map((_, i) => (
                              <Avatar key={i} className="h-8 w-8 border-2 border-white">
                                <AvatarFallback className="bg-gray-200 text-xs">
                                  {String.fromCharCode(65 + i)}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          {dept.memberCount > 5 && (
                            <span className="text-xs text-gray-500">
                              +{dept.memberCount - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingDept ? "Edit Department" : "Create New Department"}
            </DialogTitle>
            <DialogDescription>
              {editingDept
                ? "Update department information"
                : "Fill in the details to create a new department"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Department name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Department description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (€)</Label>
              <Input
                id="budget"
                type="number"
                step="0.01"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color (hex code)</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="#3B82F6"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : editingDept ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
