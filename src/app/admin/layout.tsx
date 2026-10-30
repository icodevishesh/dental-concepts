import { Toaster } from "react-hot-toast";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-sans antialiased">
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#141b2d", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" },
        }}
      />
    </div>
  );
}
