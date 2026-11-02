"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, XCircle, HelpCircle, Loader2 } from "lucide-react";

type ConnectionStatus = "not_configured" | "not_tested" | "connected" | "failed";

interface IntegrationView {
  integration: "ups" | "cloudinary";
  isEnabled: boolean;
  connectionStatus: ConnectionStatus;
  lastTestedAt: string | null;
  lastError: string | null;
  settings: Record<string, string>;
  credentialFields: Record<string, boolean>;
  updatedAt: string | null;
}

interface SecretFieldConfig {
  key: string;
  label: string;
}

interface SettingFieldConfig {
  key: string;
  label: string;
  type: "text" | "select";
  options?: { value: string; label: string }[];
}

const INTEGRATIONS: {
  name: "ups" | "cloudinary";
  title: string;
  description: string;
  secretFields: SecretFieldConfig[];
  settingFields: SettingFieldConfig[];
}[] = [
  {
    name: "ups",
    title: "UPS Shipping API",
    description: "Used to authenticate with UPS for shipping-related features.",
    secretFields: [
      { key: "clientId", label: "Client ID" },
      { key: "clientSecret", label: "Client secret" },
      { key: "accountNumber", label: "Account number" },
    ],
    settingFields: [
      {
        key: "environment",
        label: "Environment",
        type: "select",
        options: [
          { value: "sandbox", label: "Sandbox" },
          { value: "production", label: "Production" },
        ],
      },
    ],
  },
  {
    name: "cloudinary",
    title: "Cloudinary",
    description: "Used for image and file uploads across the admin panel (articles, guides, RX form).",
    secretFields: [
      { key: "apiKey", label: "API key" },
      { key: "apiSecret", label: "API secret" },
    ],
    settingFields: [{ key: "cloudName", label: "Cloud name", type: "text" }],
  },
];

export default function AdminIntegrationsPage() {
  const [views, setViews] = useState<Record<string, IntegrationView>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchViews = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/integrations");
      if (!res.ok) throw new Error("Failed to load integrations");
      const data: IntegrationView[] = await res.json();
      const map: Record<string, IntegrationView> = {};
      for (const v of data) map[v.integration] = v;
      setViews(map);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load integrations");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount
    fetchViews();
  }, [fetchViews]);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="!text-3xl !font-semibold text-gray-900">Integrations</h2>
        <p className="!text-xs text-gray-500">
          Configure third-party API credentials. Changes take effect immediately, no restart required.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-blue-glow animate-spin" />
        </div>
      ) : (
        INTEGRATIONS.map((config) => (
          <IntegrationCard
            key={config.name}
            config={config}
            view={views[config.name]}
            onChange={fetchViews}
          />
        ))
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: ConnectionStatus }) {
  const map: Record<ConnectionStatus, { label: string; className: string; Icon: typeof CheckCircle2 }> = {
    connected: { label: "Connected", className: "text-emerald-400 bg-emerald-400/10", Icon: CheckCircle2 },
    failed: { label: "Failed", className: "text-red-400 bg-red-400/10", Icon: XCircle },
    not_tested: { label: "Not tested", className: "text-amber-400 bg-amber-400/10", Icon: HelpCircle },
    not_configured: { label: "Not configured", className: "text-gray-500 bg-gray-100", Icon: HelpCircle },
  };
  const { label, className, Icon } = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${className}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}

function IntegrationCard({
  config,
  view,
  onChange,
}: {
  config: (typeof INTEGRATIONS)[number];
  view: IntegrationView | undefined;
  onChange: () => void;
}) {
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing local form state to fetched data
    if (view) setSettings(view.settings || {});
  }, [view]);

  if (!view) return null;
  const activeView = view;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/integrations/${config.name}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credentials, settings, isEnabled: activeView.isEnabled }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save configuration");
      toast.success(`${config.title} configuration saved`);
      setCredentials({});
      onChange();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save configuration");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleTest() {
    setIsTesting(true);
    try {
      const res = await fetch(`/api/admin/integrations/${config.name}/test`, { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        toast.success(data.message || "Connection successful");
      } else {
        toast.error(data.message || "Connection failed");
      }
      onChange();
    } catch {
      toast.error("Could not test the connection");
    } finally {
      setIsTesting(false);
    }
  }

  async function handleToggle() {
    const nextEnabled = !activeView.isEnabled;
    if (!nextEnabled && !confirm(`Disable ${config.title}? Features relying on it will stop working.`)) {
      return;
    }
    setIsToggling(true);
    try {
      const res = await fetch(`/api/admin/integrations/${config.name}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isEnabled: nextEnabled }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update integration");
      toast.success(nextEnabled ? `${config.title} enabled` : `${config.title} disabled`);
      onChange();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update integration");
    } finally {
      setIsToggling(false);
    }
  }

  return (
    <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="!text-sm font-semibold text-gray-900">{config.title}</h3>
            <StatusBadge status={view.connectionStatus} />
          </div>
          <p className="!text-xs text-gray-500 mt-1">{config.description}</p>
          {view.updatedAt && (
            <p className="!text-[11px] text-gray-400 mt-1">Last updated {new Date(view.updatedAt).toLocaleString()}</p>
          )}
          {view.connectionStatus === "failed" && view.lastError && (
            <p className="!text-[11px] text-red-400 mt-1">{view.lastError}</p>
          )}
        </div>
        <button
          onClick={handleToggle}
          disabled={isToggling}
          className={`shrink-0 relative w-11 h-6 rounded-full transition-colors border-none cursor-pointer disabled:opacity-50 ${
            view.isEnabled ? "bg-blue-default" : "bg-gray-300"
          }`}
          title={view.isEnabled ? "Disable integration" : "Enable integration"}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
              view.isEnabled ? "translate-x-5" : ""
            }`}
          />
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {config.secretFields.map((field) => {
            const isSaved = view.credentialFields[field.key];
            return (
              <div key={field.key}>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  {field.label}
                </label>
                <input
                  type="password"
                  value={credentials[field.key] ?? ""}
                  onChange={(e) => setCredentials((c) => ({ ...c, [field.key]: e.target.value }))}
                  placeholder={isSaved ? "•••••••• (saved — leave blank to keep)" : "Not set"}
                  autoComplete="off"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 text-sm focus:border-blue-default outline-none"
                />
              </div>
            );
          })}
          {config.settingFields.map((field) => (
            <div key={field.key}>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  value={settings[field.key] ?? field.options?.[0]?.value ?? ""}
                  onChange={(e) => setSettings((s) => ({ ...s, [field.key]: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:border-blue-default outline-none"
                >
                  {field.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={settings[field.key] ?? ""}
                  onChange={(e) => setSettings((s) => ({ ...s, [field.key]: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 text-sm focus:border-blue-default outline-none"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-blue-default hover:bg-blue-bright !text-white font-semibold py-2 px-4 rounded-lg !text-xs cursor-pointer disabled:opacity-50 transition-colors"
          >
            {isSaving ? "Saving…" : "Save Configuration"}
          </button>
          <button
            type="button"
            onClick={handleTest}
            disabled={isTesting}
            className="bg-transparent hover:bg-gray-100 border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg !text-xs cursor-pointer disabled:opacity-50 transition-colors"
          >
            {isTesting ? "Testing…" : "Test Connection"}
          </button>
        </div>
      </form>
    </section>
  );
}
