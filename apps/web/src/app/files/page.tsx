"use client";

import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder, File, Upload, Search, X, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { formatBytes } from "@/lib/utils";

interface FileItem {
  id: string;
  name: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url?: string;
  department?: string;
  departmentId?: string;
  tags: string[];
  description?: string;
  createdAt: string;
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [search, setSearch] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadForm, setUploadForm] = useState({
    name: "",
    description: "",
    departmentId: "",
    tags: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchFiles();
  }, [search]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || "/api";
      const params = new URLSearchParams();
      if (search) params.append("search", search);

      const response = await fetch(`${apiBase}/files?${params.toString()}`);
      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error("Failed to fetch files:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadForm({ ...uploadForm, name: file.name });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    setUploading(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || "/api";
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("name", uploadForm.name || selectedFile.name);
      formData.append("description", uploadForm.description);
      if (uploadForm.departmentId) {
        formData.append("departmentId", uploadForm.departmentId);
      }
      if (uploadForm.tags) {
        formData.append("tags", uploadForm.tags);
      }

      const response = await fetch(`${apiBase}/files`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully!");
        setIsUploadOpen(false);
        setSelectedFile(null);
        setUploadForm({ name: "", description: "", departmentId: "", tags: "" });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        fetchFiles();
      } else {
        const error = await response.json();
        alert(`Failed to upload file: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || "/api";
      const response = await fetch(`${apiBase}/files/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("File deleted successfully!");
        fetchFiles();
      } else {
        const error = await response.json();
        alert(`Failed to delete file: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file");
    }
  };

  const getFileIcon = (fileType: string) => {
    const type = fileType.toLowerCase();
    if (type === "pdf") return "📄";
    if (["doc", "docx"].includes(type)) return "📝";
    if (["xls", "xlsx"].includes(type)) return "📊";
    if (["jpg", "jpeg", "png", "gif"].includes(type)) return "🖼️";
    return "📎";
  };

  const getFileColor = (fileType: string) => {
    const type = fileType.toLowerCase();
    if (type === "pdf") return "bg-red-100 text-red-600";
    if (["doc", "docx"].includes(type)) return "bg-blue-100 text-blue-600";
    if (["xls", "xlsx"].includes(type)) return "bg-green-100 text-green-600";
    return "bg-gray-100 text-gray-600";
  };

  const filteredFiles = files.filter((file) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      file.name.toLowerCase().includes(searchLower) ||
      file.fileName.toLowerCase().includes(searchLower) ||
      file.description?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden lg:ml-0">
        <Header title="Other Files" />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">
          {/* Header Actions */}
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">File Management</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your documents and files ({files.length} total)
              </p>
            </div>
            <Button onClick={() => setIsUploadOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search files..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Files Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading files...</p>
            </div>
          ) : filteredFiles.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No files yet</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Upload your first file to get started
                </p>
                <Button onClick={() => setIsUploadOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFiles.map((file) => (
                <Card key={file.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded ${getFileColor(file.fileType)}`}>
                        <span className="text-2xl">{getFileIcon(file.fileType)}</span>
                      </div>
                      <div className="flex gap-2">
                        {file.url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(file.url, "_blank");
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(file.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-sm truncate mt-2">{file.name}</CardTitle>
                    <p className="text-xs text-gray-500">{formatBytes(file.fileSize)}</p>
                    {file.description && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {file.description}
                      </p>
                    )}
                    {file.department && (
                      <p className="text-xs text-purple-600 mt-1">{file.department}</p>
                    )}
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription>Select a file to upload</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file">File *</Label>
              <input
                ref={fileInputRef}
                type="file"
                id="file"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {selectedFile ? selectedFile.name : "Choose File"}
              </Button>
              {selectedFile && (
                <p className="text-xs text-gray-500">
                  {formatBytes(selectedFile.size)} • {selectedFile.type}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={uploadForm.name}
                onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                placeholder="File name (optional)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                placeholder="File description (optional)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={uploadForm.tags}
                onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!selectedFile || uploading}>
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
