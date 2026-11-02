"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Upload, FileText, Plug, ChevronRight } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="!text-lg font-semibold text-gray-900 !mb-2">Settings</h2>
        <p className="!text-sm text-gray-500">RX form, admin password, and third-party integrations.</p>
      </div>

      <RxFormCard />
      <PasswordCard />
      <IntegrationsLinkCard />
    </div>
  );
}

function RxFormCard() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [originalFilename, setOriginalFilename] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/settings/rx-form");
      const data = await res.json();
      setFileUrl(data.fileUrl);
      setOriginalFilename(data.originalFilename);
      setUpdatedAt(data.updatedAt);
    } catch {
      /* best-effort status fetch */
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount
    fetchStatus();
  }, []);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/settings/rx-form", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      toast.success("RX form updated. It's now live across the site.");
      fetchStatus();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div>
          <h3 className="!text-sm font-semibold text-gray-900">RX form</h3>
          <p className="!text-xs text-gray-500 mt-0.5">
            Upload the current prescription form PDF. It replaces the form linked across the site immediately.
          </p>
        </div>
      </div>

      {!isLoading && (
        <div className="text-xs text-gray-400 mb-4">
          {originalFilename ? (
            <>
              Current file: <span className="text-gray-900 font-medium">{originalFilename}</span>
              {updatedAt && <span className="text-gray-500"> · updated {new Date(updatedAt).toLocaleString()}</span>}
            </>
          ) : (
            <span>Using the default RX form bundled with the site. Upload one to replace it.</span>
          )}
          {fileUrl && (
            <>
              {" "}
              <a href={fileUrl} target="_blank" rel="noreferrer" className="text-blue-glow hover:underline">
                View current file
              </a>
            </>
          )}
        </div>
      )}

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="bg-blue-default hover:bg-blue-bright !text-white font-semibold py-2 px-4 rounded-lg !text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow disabled:opacity-50"
      >
        <Upload className="w-3.5 h-3.5" />
        {isUploading ? "Uploading…" : "Upload new RX form (PDF)"}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = "";
        }}
      />
    </section>
  );
}

function PasswordCard() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password");
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="!text-sm font-semibold text-gray-900 mb-1">Admin password</h3>
      <p className="!text-xs text-gray-500 !mb-4">Change the password used to sign in to this admin panel.</p>

      <form onSubmit={handleSubmit} className="space-y-3 max-w-sm">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            Current password
          </label>
          <input
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 text-sm focus:border-blue-default outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            New password
          </label>
          <input
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 text-sm focus:border-blue-default outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            Confirm new password
          </label>
          <input
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 text-sm focus:border-blue-default outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-default hover:bg-blue-bright !text-white font-semibold py-2 px-4 rounded-lg !text-xs cursor-pointer disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "Saving…" : "Change password"}
        </button>
      </form>
    </section>
  );
}

function IntegrationsLinkCard() {
  return (
    <Link
      href="/admin/settings/integrations"
      className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:border-blue-default/50 transition-colors"
    >
      <div className="flex items-start gap-3">
        <Plug className="w-5 h-5 text-blue-glow mt-0.5" />
        <div>
          <h3 className="!text-sm font-semibold text-gray-900">Integrations</h3>
          <p className="!text-xs text-gray-500 mt-0.5">Manage UPS Shipping and Cloudinary credentials.</p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </Link>
  );
}
