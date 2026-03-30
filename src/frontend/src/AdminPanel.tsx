import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  LogIn,
  LogOut,
  ShieldAlert,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ExternalBlob } from "./backend";
import type { NFTItem } from "./backend.d";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

interface AdminPanelProps {
  onClose: () => void;
  onGalleryChange: () => void;
}

export default function AdminPanel({
  onClose,
  onGalleryChange,
}: AdminPanelProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { actor } = useActor();

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(false);

  const [items, setItems] = useState<NFTItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLoggedIn = loginStatus === "success" && !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  // Check admin status once actor + identity are ready
  useEffect(() => {
    if (!actor || !isLoggedIn) {
      setIsAdmin(null);
      return;
    }
    setCheckingAdmin(true);
    actor
      .isCallerAdmin()
      .then((result) => setIsAdmin(result))
      .catch(() => setIsAdmin(false))
      .finally(() => setCheckingAdmin(false));
  }, [actor, isLoggedIn]);

  const fetchItems = useCallback(async () => {
    if (!actor) return;
    setLoadingItems(true);
    try {
      const result = await actor.getAllNFTItems();
      setItems(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingItems(false);
    }
  }, [actor]);

  useEffect(() => {
    if (isAdmin) fetchItems();
  }, [isAdmin, fetchItems]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !file || !title.trim()) return;
    setUploading(true);
    setUploadError("");
    setUploadProgress(0);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) =>
        setUploadProgress(pct),
      );
      await actor.addNFTItem(title.trim(), blob);
      setTitle("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await fetchItems();
      onGalleryChange();
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!actor) return;
    setDeletingId(id);
    try {
      await actor.deleteNFTItem(id);
      await fetchItems();
      onGalleryChange();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="admin-overlay"
        className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto py-12 px-4"
        style={{
          background: "rgba(4, 6, 12, 0.92)",
          backdropFilter: "blur(12px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          className="relative w-full max-w-2xl rounded-2xl p-8 flex flex-col gap-6"
          style={{
            background: "#070A0F",
            border: "1px solid oklch(0.82 0.18 200 / 0.3)",
            boxShadow:
              "0 0 60px oklch(0.82 0.18 200 / 0.1), 0 0 120px oklch(0.62 0.22 295 / 0.08)",
          }}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2
              className="font-display font-extrabold text-xl tracking-widest uppercase"
              style={{ color: "oklch(0.82 0.18 200)" }}
            >
              Admin Panel
            </h2>
            <button
              type="button"
              onClick={onClose}
              data-ocid="admin.close_button"
              className="text-muted-foreground hover:text-white transition-colors"
              aria-label="Close admin panel"
            >
              <X size={20} />
            </button>
          </div>

          {/* Not logged in */}
          {!isLoggedIn && (
            <div className="flex flex-col items-center gap-6 py-10">
              <p
                className="text-sm tracking-wide text-center"
                style={{ color: "#A8B3C7" }}
              >
                Log in with Internet Identity to manage your NFT gallery.
              </p>
              <Button
                data-ocid="admin.primary_button"
                onClick={() => login()}
                disabled={isLoggingIn}
                className="btn-cyan px-8 py-3 rounded-pill font-display font-bold text-sm tracking-widest uppercase inline-flex items-center gap-2"
                style={{ background: "none", border: "none", padding: 0 }}
              >
                {isLoggingIn ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <LogIn size={16} />
                )}
                {isLoggingIn ? "Logging in..." : "Login"}
              </Button>
            </div>
          )}

          {/* Checking admin */}
          {isLoggedIn && checkingAdmin && (
            <div
              className="flex items-center justify-center py-10 gap-3"
              data-ocid="admin.loading_state"
            >
              <Loader2
                size={20}
                className="animate-spin"
                style={{ color: "oklch(0.82 0.18 200)" }}
              />
              <span style={{ color: "#A8B3C7" }}>Verifying access...</span>
            </div>
          )}

          {/* Not admin */}
          {isLoggedIn && !checkingAdmin && isAdmin === false && (
            <div
              className="flex flex-col items-center gap-6 py-10"
              data-ocid="admin.error_state"
            >
              <ShieldAlert
                size={40}
                style={{ color: "oklch(0.62 0.22 295)" }}
              />
              <p
                className="text-sm tracking-wide text-center"
                style={{ color: "#A8B3C7" }}
              >
                You are not authorized as admin.
              </p>
              <button
                type="button"
                data-ocid="admin.secondary_button"
                onClick={() => {
                  clear();
                  setIsAdmin(null);
                }}
                className="inline-flex items-center gap-2 text-xs font-display tracking-widest uppercase transition-colors"
                style={{ color: "oklch(0.82 0.18 200)" }}
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}

          {/* Admin content */}
          {isLoggedIn && !checkingAdmin && isAdmin === true && (
            <>
              {/* Upload form */}
              <div
                className="rounded-xl p-6 flex flex-col gap-4"
                style={{
                  background: "#0D1426",
                  border: "1px solid oklch(0.82 0.18 200 / 0.2)",
                }}
              >
                <h3
                  className="font-display font-bold text-sm tracking-widest uppercase"
                  style={{ color: "oklch(0.82 0.18 200)" }}
                >
                  Upload New NFT
                </h3>
                <form onSubmit={handleUpload} className="flex flex-col gap-3">
                  <Input
                    data-ocid="admin.input"
                    placeholder="NFT Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={uploading}
                    className="bg-transparent border-border text-foreground placeholder:text-muted-foreground"
                    style={{ borderColor: "oklch(0.82 0.18 200 / 0.3)" }}
                  />
                  <input
                    ref={fileInputRef}
                    data-ocid="admin.upload_button"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    disabled={uploading}
                    className="text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:tracking-widest file:uppercase cursor-pointer"
                    style={{
                      color: "#A8B3C7",
                      // @ts-ignore
                      "--file-bg": "oklch(0.82 0.18 200 / 0.15)",
                    }}
                  />
                  {uploading && (
                    <div
                      className="flex flex-col gap-1"
                      data-ocid="admin.loading_state"
                    >
                      <Progress value={uploadProgress} className="h-1" />
                      <span className="text-xs" style={{ color: "#A8B3C7" }}>
                        Uploading... {Math.round(uploadProgress)}%
                      </span>
                    </div>
                  )}
                  {uploadError && (
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.6 0.22 25)" }}
                      data-ocid="admin.error_state"
                    >
                      {uploadError}
                    </p>
                  )}
                  <Button
                    type="submit"
                    data-ocid="admin.submit_button"
                    disabled={uploading || !file || !title.trim()}
                    className="btn-cyan self-start px-6 py-2.5 rounded-pill font-display font-bold text-xs tracking-widest uppercase inline-flex items-center gap-2"
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      height: "auto",
                    }}
                  >
                    {uploading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Upload size={14} />
                    )}
                    {uploading ? "Uploading..." : "Upload NFT"}
                  </Button>
                </form>
              </div>

              {/* Items grid */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3
                    className="font-display font-bold text-sm tracking-widest uppercase"
                    style={{ color: "oklch(0.62 0.22 295)" }}
                  >
                    Current Collection
                  </h3>
                  <button
                    type="button"
                    onClick={fetchItems}
                    className="text-xs transition-colors"
                    style={{ color: "#A8B3C7" }}
                  >
                    Refresh
                  </button>
                </div>

                {loadingItems && (
                  <div
                    className="flex items-center justify-center py-8"
                    data-ocid="admin.loading_state"
                  >
                    <Loader2
                      size={20}
                      className="animate-spin"
                      style={{ color: "oklch(0.82 0.18 200)" }}
                    />
                  </div>
                )}

                {!loadingItems && items.length === 0 && (
                  <div
                    className="flex items-center justify-center py-8 rounded-xl text-sm"
                    style={{
                      color: "#A8B3C7",
                      border: "1px dashed oklch(0.82 0.18 200 / 0.2)",
                    }}
                    data-ocid="admin.empty_state"
                  >
                    No NFTs uploaded yet.
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {items.map((item, i) => (
                    <div
                      key={String(item.id)}
                      data-ocid={`admin.item.${i + 1}`}
                      className="relative group rounded-xl overflow-hidden"
                      style={{ border: "1px solid oklch(0.82 0.18 200 / 0.2)" }}
                    >
                      <div className="aspect-square">
                        <img
                          src={item.image.getDirectURL()}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div
                        className="p-2 flex items-center justify-between gap-1"
                        style={{ background: "#0D1426" }}
                      >
                        <span
                          className="text-xs font-display font-bold tracking-wider uppercase truncate"
                          style={{ color: "#F2F7FF" }}
                        >
                          {item.title}
                        </span>
                        <button
                          type="button"
                          data-ocid={`admin.delete_button.${i + 1}`}
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="flex-shrink-0 p-1 rounded transition-colors hover:bg-red-500/20"
                          style={{ color: "oklch(0.6 0.22 25)" }}
                          aria-label={`Delete ${item.title}`}
                        >
                          {deletingId === item.id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Trash2 size={12} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logout */}
              <div className="flex justify-end">
                <button
                  type="button"
                  data-ocid="admin.secondary_button"
                  onClick={() => {
                    clear();
                    setIsAdmin(null);
                  }}
                  className="inline-flex items-center gap-2 text-xs font-display tracking-widest uppercase transition-colors"
                  style={{ color: "#A8B3C7" }}
                >
                  <LogOut size={12} /> Logout
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
