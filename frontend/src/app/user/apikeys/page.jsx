"use client";
import { useState , useEffect, useRef} from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CursorGlow } from "@/components/dashboard/CursorGlow";
import { AnimatedBorderCard } from "@/components/dashboard/AnimatedBorderCard";
import { motion, AnimatePresence } from "framer-motion";
import { refreshToken } from "@/lib/auth";

import {
  Key,
  Plus,
  Copy,
  RefreshCw,
  Trash2,
  Eye,
  EyeOff,
  Check,
  Shield,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAuth } from "../../providers/AuthProvider";

import { apiRequest } from "@/lib/Api";
import { useRouter } from "next/navigation";

export default function APIKeys() {
  const { toast } = useToast();

  const [apiKeys, setApiKeys] = useState([]);
  const [visibleKeys, setVisibleKeys] = useState(new Set());
  const [copiedKey, setCopiedKey] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isRegenerateOpen, setIsRegenerateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState(null);
  const [isKeyCreatedOpen, setIsKeyCreatedOpen] = useState(false);
  const [keyDialogMode, setKeyDialogMode] = useState(null); 

 const maskKey = (key) => {
  if (!key || typeof key !== "string" || key.length < 16) return "••••••••••••••••••••••••";
  return key.substring(0, 12) + "••••••••••••••••••••" + key.slice(-4);
};





const { ready, isAuthenticated } = useAuth();
const router = useRouter();
const didInit = useRef(false);

useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (didInit.current) return;
    didInit.current = true;

    let cancelled = false;

    async function fetchApiKeys() {
      try {
        const res = await apiRequest("/get_api_keys", { method: "GET" }, true, router);
        const keysData = res.Active_Api_Keys || res.api_keys || res;

        if (!cancelled) {
          setApiKeys(
            (Array.isArray(keysData) ? keysData : []).map((k) => ({
              id: k.keyId || k.id,
              keyId: k.keyId || k.id,
              keyName: k.keyName || k.name,
              key: k.api_Key_Hashed || "",
              created_at: k.created_at,
              usage_Left: k.usage_Left,
            }))
          );
        }
      } catch (err) {
        console.error("API Keys fetch failed:", err.message);
        toast({
          title: "Failed to load API keys",
          description: err.message.includes("Session expired")
            ? "Please login again."
            : "Please refresh the page.",
          variant: "destructive",
        });
      }
    }

    fetchApiKeys();

    return () => {
      cancelled = true;
    };
  }, [ready, isAuthenticated, router]);

  // ----------------- Handlers ---------------
  const toggleKeyVisibility = (id) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;
    setIsLoading(true);
    try {
      const res = await apiRequest(
        "/generate_api_key",
        { method: "POST", body: JSON.stringify({ keyName: newKeyName }) },
        true,
        router
      );

      const plainKey = res.Api_key || res.api_key || "";
      const newKey = {
        id: res.id || Date.now().toString(),
        keyName: newKeyName,
        key: plainKey,
        created_at: new Date().toISOString(),
        usage_Left: 50000,
      };
      setApiKeys((prev) => [newKey, ...prev]);
      setNewKeyName("");
      setIsCreateOpen(false);

      setTimeout(() => {
        setNewlyCreatedKey(plainKey);
        setKeyDialogMode("create");
        setIsKeyCreatedOpen(true);
      }, 200);
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyKey = async (key, id) => {
    if (!key || key.length === 0) {
      toast({
        title: "Cannot Copy",
        description:
          "This API key is no longer available. Keys can only be copied once when created.",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(key);
      setCopiedKey(id);
      toast({ title: "API Key Copied", description: "The API key has been copied to clipboard." });
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      toast({ title: "Copy Failed", description: "Failed to copy. Try again.", variant: "destructive" });
    }
  };

  const handleRegenerateKey = async () => {
    if (!selectedKey?.id) return;
    setIsLoading(true);
    try {
      const res = await apiRequest(
        "/regenerate_api_key",
        { method: "POST", body: JSON.stringify({ keyId: selectedKey.id }) },
        true,
        router
      );

      const newPlainKey = res.New_key || "";
      if (newPlainKey) {
        setNewlyCreatedKey(newPlainKey);
        setKeyDialogMode("regenerate");
        setIsRegenerateOpen(false);
        setTimeout(() => setIsKeyCreatedOpen(true), 200);
      }

      // Refetch keys
      const updated = await apiRequest("/get_api_keys", { method: "GET" }, true, router);
      const keysData = updated.Active_Api_Keys || updated.api_keys || updated;
      setApiKeys(
        (Array.isArray(keysData) ? keysData : []).map((k) => ({
          id: k.keyId || k.id,
          keyId: k.keyId || k.id,
          keyName: k.keyName || k.name,
          key: k.api_Key_Hashed || "",
          created_at: k.created_at,
          usage_Left: k.usage_Left,
        }))
      );
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to regenerate API key",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setSelectedKey(null);
    }
  };

  const handleDeleteKey = async () => {
    if (!selectedKey) return;
    setIsLoading(true);
    try {
      await apiRequest(
        "/delete_api_key",
        { method: "POST", body: JSON.stringify({ keyId: selectedKey.id }) },
        true,
        router
      );
      setApiKeys((prev) => prev.filter((k) => k.id !== selectedKey.id));
      setIsDeleteOpen(false);
      setSelectedKey(null);
      toast({ title: "API Key Deleted", description: "The key has been permanently deleted." });
    } catch (err) {
      toast({ title: "Error", description: err.message || "Failed to delete API key", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

  const formatNumber = (num) => new Intl.NumberFormat("en-US").format(num);


  return (
    <DashboardLayout>
    <CursorGlow />
    <div className="p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Key className="w-8 h-8 text-primary" />
            API Keys
          </h1>
          <p className="text-muted-foreground">
            Manage your API keys for secure access to the messaging platform.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New API Key
          </Button>
        </motion.div>
      </motion.div>

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Your data is encrypted and secure</p>
            <p className="text-xs text-muted-foreground">
              API keys are encrypted at rest and in transit. Never share your keys publicly.
            </p>
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="ml-auto w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/50"
          />
        </div>
      </motion.div>

      {/* API Keys Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <AnimatedBorderCard className="overflow-hidden">
          <div className="p-6 border-b border-border/30">
            <h2 className="text-xl font-semibold text-foreground">Your API Keys</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {apiKeys.filter(k => k.usage_Left > 0).length} active keys
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/30 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Key Name</TableHead>
                  <TableHead className="text-muted-foreground">API Key</TableHead>
                  <TableHead className="text-muted-foreground">Created</TableHead>
                  <TableHead className="text-muted-foreground">Requests Left</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {apiKeys.map((apiKey, index) => {
                    const status = apiKey.usage_Left > 0 ? "active" : "revoked";
                    const isDisabled = status === "revoked";

                    return (
                      <motion.tr
                        key={apiKey.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={cn(
                          "border-border/30 transition-all duration-200 group",
                          status === "active" ? "hover:bg-primary/5" : "opacity-60"
                        )}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Key className="w-4 h-4 text-muted-foreground" />
                            {apiKey.keyName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-muted/50 px-2 py-1 rounded font-mono">
                              {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                            </code>
                            <button
                              onClick={() => toggleKeyVisibility(apiKey.id)}
      className="p-1 hover:bg-muted/50 rounded transition-colors"
      title={apiKey.key ? "Toggle visibility" : "Key is hashed and cannot be shown"}
                            >
                              {visibleKeys.has(apiKey.id) ? (
                                <EyeOff className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <Eye className="w-4 h-4 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(apiKey.created_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-muted-foreground" />
                            <span>{formatNumber(apiKey.usage_Left)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                              status === "active"
                                ? "bg-primary/10 text-primary"
                                : "bg-destructive/10 text-destructive"
                            )}
                          >
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                status === "active" ? "bg-primary" : "bg-destructive"
                              )}
                            />
                            {status === "active" ? "Active" : "Revoked"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <motion.button
  whileHover={{ scale: apiKey.key ? 1.1 : 1 }}
  whileTap={{ scale: apiKey.key ? 0.95 : 1 }}
  onClick={() => handleCopyKey(apiKey.key, apiKey.id)}
  disabled={isDisabled || !apiKey.key}
  className={cn(
    "p-2 rounded-lg transition-all duration-200",
    !isDisabled && apiKey.key
      ? "hover:bg-primary/10 text-muted-foreground hover:text-primary"
      : "opacity-50 cursor-not-allowed"
  )}
  title={apiKey.key ? "Copy API key" : "Key was not saved and cannot be copied"}
>
  <AnimatePresence mode="wait">
    {copiedKey === apiKey.id ? (
      <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
        <Check className="w-4 h-4 text-primary" />
      </motion.div>
    ) : (
      <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
        <Copy className="w-4 h-4" />
      </motion.div>
    )}
  </AnimatePresence>
</motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedKey(apiKey);
                                setIsRegenerateOpen(true);
                              }}
                              disabled={isDisabled}
                              className={cn(
                                "p-2 rounded-lg transition-all duration-200",
                                !isDisabled
                                  ? "hover:bg-yellow-500/10 text-muted-foreground hover:text-yellow-500"
                                  : "opacity-50 cursor-not-allowed"
                              )}
                            >
                              <RefreshCw className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedKey(apiKey);
                                setIsDeleteOpen(true);
                              }}
                              disabled={isDisabled}
                              className={cn(
                                "p-2 rounded-lg transition-all duration-200",
                                !isDisabled
                                  ? "hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                                  : "opacity-50 cursor-not-allowed"
                              )}
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </AnimatedBorderCard>
      </motion.div>

      {/* Usage Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          {
            label: "Total Requests Left",
            value: formatNumber(apiKeys.reduce((sum, k) => sum + k.usage_Left, 0)),
            icon: Activity,
          },
          {
            label: "Active Keys",
            value: apiKeys.filter(k => k.usage_Left > 0).length.toString(),
            icon: Key,
          },
          {
            label: "Revoked Keys",
            value: apiKeys.filter(k => k.usage_Left <= 0).length.toString(),
            icon: Shield,
          },
        ].map(stat => (
          <AnimatedBorderCard key={stat.label}>
            <div className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </AnimatedBorderCard>
        ))}
      </motion.div>
    </div>

      {/* Create Key Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-card/95 backdrop-blur-xl border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              Create New API Key
            </DialogTitle>
            <DialogDescription>
              Generate a new API key for your application. Make sure to copy it once created.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="keyName">Key Name</Label>
              <Input
                id="keyName"
                placeholder="e.g., Production API"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="bg-muted/50 border-border/50 focus:border-primary"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateKey}
              disabled={!newKeyName.trim() || isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Create Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Regenerate Key Dialog */}
      <AlertDialog open={isRegenerateOpen} onOpenChange={setIsRegenerateOpen}>
        <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Regenerate API Key
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will generate a new API key for "{selectedKey?.keyName}". The old key will immediately stop working. Make sure to update your applications.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRegenerateKey}
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Regenerate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Key Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-destructive" />
              Revoke API Key
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently revoke "{selectedKey?.keyName}". Any applications using this key will lose access immediately. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteKey}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Revoke Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
    
    

      <Dialog open={isKeyCreatedOpen} onOpenChange={setIsKeyCreatedOpen}>
  <DialogContent className="bg-card/95 backdrop-blur-xl border-border/50">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        {keyDialogMode === "create" ? (
          <>
            <Key className="w-5 h-5 text-primary" />
            API Key Created Successfully
          </>
        ) : (
          <>
            <RefreshCw className="w-5 h-5 text-yellow-500" />
            API Key Regenerated
          </>
        )}
      </DialogTitle>

      <DialogDescription>
        {keyDialogMode === "create"
          ? "Make sure to copy your API key now. You won't be able to see it again!"
          : "Your API key has been regenerated. Copy it now and update your applications."}
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>
          {keyDialogMode === "create" ? "Your API Key" : "New API Key"}
        </Label>

        <div className="flex items-center gap-2">
          <Input
            readOnly
            value={newlyCreatedKey || ""}
            className="bg-muted/50 border-border/50 font-mono text-sm"
          />

          <Button
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(newlyCreatedKey);
              toast({
                title: "Copied!",
                description: "API key copied to clipboard.",
              });
            }}
            className="bg-primary hover:bg-primary/90"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
        <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-yellow-600 dark:text-yellow-500">
          This is the only time you'll see this key. Store it securely.
          {keyDialogMode === "regenerate" &&
            " The old key has been revoked and will no longer work."}
        </p>
      </div>
    </div>

    <DialogFooter>
      <Button
        onClick={() => {
          setIsKeyCreatedOpen(false);
          setNewlyCreatedKey(null);
          setKeyDialogMode(null);
        }}
        className="bg-primary hover:bg-primary/90"
      >
        I've Saved My Key
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </DashboardLayout>
  );
}