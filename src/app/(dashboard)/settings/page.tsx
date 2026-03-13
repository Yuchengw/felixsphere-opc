"use client";

import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <div>
          <h3 className="font-medium mb-4">Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Name</label>
              <p className="font-medium">{session?.user?.name ?? "—"}</p>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Email</label>
              <p className="font-medium">{session?.user?.email ?? "—"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
