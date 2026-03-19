import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddEventDialog } from "@/components/AddEventDialog";
import { TimelineEvent } from "@/components/TimelineEvent";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Activity, Plus, UserCircle2, FileText, Pill, Calendar, Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  changePassword,
  clearToken,
  createEvent,
  getAdminOverview,
  getEvents,
  getMe,
  getProfile,
  getToken,
  type PatientProfile,
  updateEvent,
  updateProfile,
  uploadDocument,
  getDocuments,
  deleteEvent,
} from "@/lib/api";
import type { AdminUserOverview, HealthEvent, UserProfile } from "@/types/health";

const Dashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<HealthEvent[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<HealthEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [adminOverview, setAdminOverview] = useState<AdminUserOverview[]>([]);
  const [documentsMap, setDocumentsMap] = useState<Record<string, import("@/types/health").DocumentRecord[]>>({});
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerDoc, setViewerDoc] = useState<import("@/types/health").DocumentRecord | null>(null);
  const [error, setError] = useState("");

  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [profile, setProfile] = useState<PatientProfile>({});
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
      return;
    }
    
    const loadData = async () => {
      try {
        const [me, fetchedEvents] = await Promise.all([getMe(), getEvents()]);
        setUser(me);
  // ensure chronological order (newest first)
  setEvents(fetchedEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

        if (me.is_staff) {
          const overview = await getAdminOverview();
          setAdminOverview(overview);
        }
        // fetch documents and map them by medical_event id
        try {
          const docs = await getDocuments();
          const map: Record<string, import("@/types/health").DocumentRecord[]> = {};
          docs.forEach((d) => {
            const key = d.medical_event ?? "";
            if (!map[key]) map[key] = [];
            map[key].push(d);
          });
          setDocumentsMap(map);
        } catch (e) {
          // ignore documents fetching errors
        }
      } catch {
        clearToken();
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleSaveEvent = async (formEvent: Omit<HealthEvent, "id">, file: File | null) => {
    try {
      let savedEvent: HealthEvent;
      if (editingEvent) {
        savedEvent = await updateEvent(editingEvent.id, formEvent);
        setEvents((prev) => {
          const next = prev.map((item) => (item.id === savedEvent.id ? savedEvent : item));
          return next.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        });
      } else {
        savedEvent = await createEvent(formEvent);
        setEvents((prev) => {
          const next = [...prev, savedEvent];
          return next.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        });
      }

      if (file) {
        try {
          const created = await uploadDocument(file.name, file, savedEvent.id);
          // merge created document into documentsMap for this event
          setDocumentsMap((prev) => {
            const key = String(savedEvent.id ?? "");
            const next = { ...prev } as Record<string, import("@/types/health").DocumentRecord[]>;
            next[key] = [...(next[key] ?? []), created as import("@/types/health").DocumentRecord];
            return next;
          });
        } catch (e) {
          // ignore upload errors here (already handled above)
        }
      }

      setIsDialogOpen(false);
      setEditingEvent(null);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nepodařilo se uložit záznam.");
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updated = await updateProfile(profile);
      setProfile(updated);
      setProfileOpen(false);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nepodařilo se uložit profil.");
    }
  };

  const handleChangePassword = async () => {
    try {
      await changePassword(oldPassword, newPassword);
      setOldPassword("");
      setNewPassword("");
      setPasswordOpen(false);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nepodařilo se změnit heslo.");
    }
  };

  

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  const { t, toggle, setLang } = useI18n();

  if (isLoading) return <div className="p-8 text-center">Načítám data…</div>;
  if (isLoading) {
    return <div className="p-8 text-center">Načítám data…</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <button onClick={() => {
              if (window.location.pathname === "/dashboard") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                navigate("/");
              }
            }} className="flex items-center gap-3 text-left">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">MediCare</h1>
            </button>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <button title="Čeština" onClick={() => setLang("cs")} className="text-lg">🇨🇿</button>
                  <button title="English" onClick={() => setLang("en")} className="text-lg">🇬🇧</button>
                  <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle language">
                    <Globe className="h-5 w-5" />
                  </Button>
                </div>

                <Button
                  onClick={() => {
                    setEditingEvent(null);
                    setIsDialogOpen(true);
                  }}
                  size="lg"
                  className="gap-2"
                >
                  <Plus className="h-5 w-5" />
                  {t("addRecord")}
                </Button>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="Můj profil">
                    <UserCircle2 className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setProfileOpen(true)}>Můj profil</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPasswordOpen(true)}>Změnit heslo</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>Odhlásit se</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* profile + add button are in the previous group; removed duplicate add and separate logout button */}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && <p className="mb-4 text-destructive">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className={`p-6 cursor-pointer ${filter === null ? "ring-2 ring-primary" : ""}`} onClick={() => setFilter(null)}>
            <p className="text-sm text-muted-foreground">{t("totalRecords")}</p>
            <p className="text-2xl font-bold">{events.length}</p>
          </Card>

          <Card className={`p-6 cursor-pointer ${filter === "medication" ? "ring-2 ring-primary" : ""}`} onClick={() => setFilter(filter === "medication" ? null : "medication")}>
            <p className="text-sm text-muted-foreground">{t("medication")}</p>
            <p className="text-2xl font-bold">{events.filter((e) => e.type === "medication").length}</p>
          </Card>

          <Card className={`p-6 cursor-pointer ${filter === "document" ? "ring-2 ring-primary" : ""}`} onClick={() => setFilter(filter === "document" ? null : "document")}>
            <p className="text-sm text-muted-foreground">{t("documents")}</p>
            <p className="text-2xl font-bold">{events.filter((e) => e.type === "document").length}</p>
          </Card>

          <Card className={`p-6 cursor-pointer ${filter === "surgery" ? "ring-2 ring-primary" : ""}`} onClick={() => setFilter(filter === "surgery" ? null : "surgery")}>
            <p className="text-sm text-muted-foreground">{t("surgeries")}</p>
            <p className="text-2xl font-bold">{events.filter((e) => e.type === "surgery").length}</p>
          </Card>
        </div>

        <Card className="p-6 bg-card mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Časová osa léčby</h2>
          {events.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">{t("noRecords")}</p>
              <Button
                onClick={() => {
                  setEditingEvent(null);
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("addFirstRecord")}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {events
                .filter((e) => (filter ? e.type === filter : true))
                .map((event, index, arr) => (
                  <TimelineEvent
                    key={event.id}
                    event={event}
                    isLast={index === arr.length - 1}
                    onEdit={(selectedEvent) => {
                      setEditingEvent(selectedEvent);
                      setIsDialogOpen(true);
                    }}
                    documents={documentsMap[event.id] ?? []}
                    onOpenDocument={(d) => {
                      setViewerDoc(d);
                      setViewerOpen(true);
                    }}
                  />
                ))}
            </div>
          )}
        </Card>

        {user?.is_staff && (
          <Card className="p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">Admin přehled uživatelů</h2>
            <div className="space-y-2">
              {adminOverview.map((item) => (
                <div key={item.username} className="flex items-center justify-between border rounded px-3 py-2">
                  <span>{item.username}</span>
                  <span className="text-muted-foreground">Záznamů: {item.event_count}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>


      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
          <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("myProfile")}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div><Label>Výška (cm)</Label><Input type="number" value={profile.height_cm ?? ""} onChange={(e) => setProfile({ ...profile, height_cm: e.target.value ? Number(e.target.value) : null })} /></div>
            <div><Label>Váha (kg)</Label><Input type="number" value={profile.weight_kg ?? ""} onChange={(e) => setProfile({ ...profile, weight_kg: e.target.value ? Number(e.target.value) : null })} /></div>
            <div><Label>Rodné číslo</Label><Input value={profile.national_id ?? ""} onChange={(e) => setProfile({ ...profile, national_id: e.target.value })} /></div>
            <div><Label>Telefon</Label><Input value={profile.phone_number ?? ""} onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })} /></div>
            <div><Label>Pojišťovna</Label><Input value={profile.insurance_provider ?? ""} onChange={(e) => setProfile({ ...profile, insurance_provider: e.target.value })} /></div>
            <div><Label>Datum narození</Label><Input type="date" value={profile.date_of_birth ?? ""} onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value || null })} /></div>
          </div>
          <Button onClick={handleSaveProfile}>{t("saveChanges")}</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("changePassword")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>Původní heslo</Label><Input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} /></div>
            <div><Label>Nové heslo</Label><Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
            <Button onClick={handleChangePassword}>{t("saveChanges")}</Button>
          </div>
        </DialogContent>
      </Dialog>
      <AddEventDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddEvent={handleSaveEvent}
        initialEvent={editingEvent}
        existingDocuments={editingEvent ? (documentsMap[editingEvent.id] ?? []).map((d) => ({ id: String(d.id), title: d.title, file: d.file })) : []}
  onDeleteDocument={async (id: string) => {
          try {
            // call API to delete document if available
            // keep local state in sync
            setDocumentsMap((prev) => {
              const next = { ...prev };
              if (!editingEvent) return next;
              next[editingEvent.id] = (next[editingEvent.id] ?? []).filter((d) => String(d.id) !== id);
              return next;
            });
          } catch (e) {
            // ignore for now
          }
        }}
        onDeleteRecord={async (id: string) => {
          try {
            await deleteEvent(id);
            setEvents((prev) => prev.filter((ev) => ev.id !== id));
            setDocumentsMap((prev) => {
              const next = { ...prev };
              delete next[id];
              return next;
            });
          } catch (e) {
            // TODO: show error
          }
        }}
      />

      {/* Document viewer dialog */}
      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="sm:max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle>{viewerDoc?.title ?? t("documents")}</DialogTitle>
          </DialogHeader>
          <div className="h-[70vh]">
            {viewerDoc ? (
              (() => {
                const lower = viewerDoc.file.toLowerCase();
                const isImage = [".png", ".jpg", ".jpeg", ".gif", ".webp"].some((ext) => lower.endsWith(ext));
                const isPdf = lower.endsWith(".pdf") || lower.startsWith("data:application/pdf");
                if (isImage) {
                  return <img src={viewerDoc.file} alt={viewerDoc.title} className="max-h-[70vh] w-full object-contain" />;
                }
                // PDFs and other embeddable types — use iframe which works with proper URLs/CORS
                if (isPdf) {
                  return <iframe src={viewerDoc.file} title={viewerDoc.title} className="w-full h-full border-0" />;
                }
                // fallback to iframe for anything else; if the server returns a download, the browser will prompt
                return <iframe src={viewerDoc.file} title={viewerDoc.title} className="w-full h-full border-0" />;
              })()
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
