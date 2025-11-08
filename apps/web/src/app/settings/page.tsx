"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings as SettingsIcon, Bell, Shield, Database, Globe, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Setting {
  id: string;
  key: string;
  value: any;
  category: string;
  description?: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    general: {
      appName: "Flowbit Analytics",
      timezone: "UTC",
      language: "English",
    },
    notifications: {
      email: true,
      push: true,
      invoiceAlerts: true,
    },
    security: {
      password: "",
      twoFactorEnabled: false,
    },
    database: {
      connectionStatus: "connected",
      lastBackup: new Date().toISOString(),
    },
    api: {
      apiBase: process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001/api",
      vannaUrl: "http://localhost:8000",
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || "/api";
      const response = await fetch(`${apiBase}/settings`);
      const data = await response.json();

      if (data.settings && data.settings.length > 0) {
        // Load settings from API
        const settingsMap: any = {};
        data.settings.forEach((setting: Setting) => {
          if (!settingsMap[setting.category]) {
            settingsMap[setting.category] = {};
          }
          settingsMap[setting.category][setting.key] = setting.value;
        });

        setFormData((prev) => ({
          ...prev,
          ...settingsMap,
        }));
      }

      // Fetch database connection status
      try {
        const healthResponse = await fetch(`${apiBase.replace("/api", "")}/health`);
        if (healthResponse.ok) {
          setFormData((prev) => ({
            ...prev,
            database: {
              ...prev.database,
              connectionStatus: "connected",
            },
          }));
        }
      } catch (error) {
        setFormData((prev) => ({
          ...prev,
          database: {
            ...prev.database,
            connectionStatus: "disconnected",
          },
        }));
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSetting = async (category: string, key: string, value: any) => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || "/api";
      await fetch(`${apiBase}/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: `${category}.${key}`,
          value,
          category,
        }),
      });
    } catch (error) {
      console.error(`Failed to save setting ${category}.${key}:`, error);
    }
  };

  const handleSave = async (category: string) => {
    setSaving(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || "/api";
      const categoryData = formData[category as keyof typeof formData];

      // Save all settings in the category
      for (const [key, value] of Object.entries(categoryData)) {
        await saveSetting(category, key, value);
      }

      alert(`${category.charAt(0).toUpperCase() + category.slice(1)} settings saved successfully!`);
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleGeneralChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      general: {
        ...prev.general,
        [key]: value,
      },
    }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
  };

  const handleSecurityChange = (key: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: value,
      },
    }));
  };

  const handleApiChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      api: {
        ...prev.api,
        [key]: value,
      },
    }));
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden lg:ml-0">
        <Header title="Settings" />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your application settings</p>
          </div>

          <div className="space-y-6">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  General Settings
                </CardTitle>
                <CardDescription>Configure general application preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="app-name">Application Name</Label>
                  <Input
                    id="app-name"
                    value={formData.general.appName}
                    onChange={(e) => handleGeneralChange("appName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={formData.general.timezone}
                    onChange={(e) => handleGeneralChange("timezone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    value={formData.general.language}
                    onChange={(e) => handleGeneralChange("language", e.target.value)}
                  />
                </div>
                <Button onClick={() => handleSave("general")} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive email updates</p>
                  </div>
                  <Switch
                    checked={formData.notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-gray-500">Receive browser notifications</p>
                  </div>
                  <Switch
                    checked={formData.notifications.push}
                    onCheckedChange={(checked) => handleNotificationChange("push", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Invoice Alerts</Label>
                    <p className="text-sm text-gray-500">Get notified about new invoices</p>
                  </div>
                  <Switch
                    checked={formData.notifications.invoiceAlerts}
                    onCheckedChange={(checked) => handleNotificationChange("invoiceAlerts", checked)}
                  />
                </div>
                <Button onClick={() => handleSave("notifications")} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security
                </CardTitle>
                <CardDescription>Manage security and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Change Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    value={formData.security.password}
                    onChange={(e) => handleSecurityChange("password", e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                  <Switch
                    checked={formData.security.twoFactorEnabled}
                    onCheckedChange={(checked) => handleSecurityChange("twoFactorEnabled", checked)}
                  />
                </div>
                <Button onClick={() => handleSave("security")} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>

            {/* Database */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database
                </CardTitle>
                <CardDescription>Database connection and management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Connection Status</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        formData.database.connectionStatus === "connected"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <span className="text-sm text-gray-600">
                      {formData.database.connectionStatus === "connected"
                        ? "Connected to Supabase"
                        : "Disconnected"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Last Backup</Label>
                  <p className="text-sm text-gray-500">
                    {new Date(formData.database.lastBackup).toLocaleString()}
                  </p>
                </div>
                <Button variant="outline" onClick={() => alert("Backup initiated")}>
                  Backup Now
                </Button>
              </CardContent>
            </Card>

            {/* API Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  API Configuration
                </CardTitle>
                <CardDescription>Manage API endpoints and keys</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-base">API Base URL</Label>
                  <Input
                    id="api-base"
                    value={formData.api.apiBase}
                    onChange={(e) => handleApiChange("apiBase", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vanna-url">Vanna AI URL</Label>
                  <Input
                    id="vanna-url"
                    value={formData.api.vannaUrl}
                    onChange={(e) => handleApiChange("vannaUrl", e.target.value)}
                  />
                </div>
                <Button onClick={() => handleSave("api")} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
