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
import { Activity, Plus, UserCircle2 } from "lucide-react";
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
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, FileText, Pill, Activity, Calendar } from "lucide-react";
import { TimelineEvent } from "@/components/TimelineEvent";
import { AddEventDialog } from "@/components/AddEventDialog";
import { clearToken, createEvent, getAdminOverview, getEvents, getMe, getToken } from "@/lib/api";
import type { AdminUserOverview, HealthEvent, UserProfile } from "@/types/health";

const Dashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<HealthEvent[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<HealthEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [adminOverview, setAdminOverview] = useState<AdminUserOverview[]>([]);
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
        const [me, fetchedEvents, fetchedProfile] = await Promise.all([getMe(), getEvents(), getProfile()]);
        setUser(me);
        setEvents(fetchedEvents);
        setProfile(fetchedProfile);

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      try {
        const [me, fetchedEvents] = await Promise.all([getMe(), getEvents()]);
        setUser(me);
        setEvents(fetchedEvents);

        if (me.is_staff) {
          const overview = await getAdminOverview();
          setAdminOverview(overview);
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
        setEvents((prev) => prev.map((item) => (item.id === savedEvent.id ? savedEvent : item)));
      } else {
        savedEvent = await createEvent(formEvent);
        setEvents((prev) => [savedEvent, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }

      if (file) {
        await uploadDocument(file.name, file, savedEvent.id);
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

  const handleAddEvent = async (newEvent: Omit<HealthEvent, "id">) => {
    try {
      const event = await createEvent(newEvent);
      setEvents((prev) => [event, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setIsDialogOpen(false);
      setError("");
    } catch {
      setError("Nepodařilo se uložit záznam do databáze.");
    }
  };

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  if (isLoading) return <div className="p-8 text-center">Načítám data…</div>;
  if (isLoading) {
    return <div className="p-8 text-center">Načítám data…</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <button onClick={() => navigate("/")} className="flex items-center gap-3 text-left">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">MediCare</h1>
            </button>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  setEditingEvent(null);
                  setIsDialogOpen(true);
                }}
                size="lg"
                className="gap-2"
              >
                <Plus className="h-5 w-5" />
                Přidat záznam
              </Button>

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
            <div className="flex gap-2">
              <Button onClick={() => setIsDialogOpen(true)} size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Přidat záznam
              </Button>
              <Button variant="outline" onClick={handleLogout}>Odhlásit</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && <p className="mb-4 text-destructive">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6"><p className="text-sm text-muted-foreground">Celkem záznamů</p><p className="text-2xl font-bold">{events.length}</p></Card>
          <Card className="p-6"><p className="text-sm text-muted-foreground">Léky</p><p className="text-2xl font-bold">{events.filter((e) => e.type === "medication").length}</p></Card>
          <Card className="p-6"><p className="text-sm text-muted-foreground">Dokumenty</p><p className="text-2xl font-bold">{events.filter((e) => e.type === "document").length}</p></Card>
          <Card className="p-6"><p className="text-sm text-muted-foreground">Operace</p><p className="text-2xl font-bold">{events.filter((e) => e.type === "surgery").length}</p></Card>
        </div>

        <Card className="p-6 bg-card mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Časová osa léčby</h2>
          {events.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Zatím nemáte žádné záznamy</p>
              <Button
                onClick={() => {
                  setEditingEvent(null);
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Přidat první záznam
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event, index) => (
                <TimelineEvent
                  key={event.id}
                  event={event}
                  isLast={index === events.length - 1}
                  onEdit={(selectedEvent) => {
                    setEditingEvent(selectedEvent);
                    setIsDialogOpen(true);
                  }}
                />
                <TimelineEvent key={event.id} event={event} isLast={index === events.length - 1} />
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

      <AddEventDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onAddEvent={handleSaveEvent} initialEvent={editingEvent} />

      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Můj profil</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div><Label>Výška (cm)</Label><Input type="number" value={profile.height_cm ?? ""} onChange={(e) => setProfile({ ...profile, height_cm: e.target.value ? Number(e.target.value) : null })} /></div>
            <div><Label>Váha (kg)</Label><Input type="number" value={profile.weight_kg ?? ""} onChange={(e) => setProfile({ ...profile, weight_kg: e.target.value ? Number(e.target.value) : null })} /></div>
            <div><Label>Rodné číslo</Label><Input value={profile.national_id ?? ""} onChange={(e) => setProfile({ ...profile, national_id: e.target.value })} /></div>
            <div><Label>Telefon</Label><Input value={profile.phone_number ?? ""} onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })} /></div>
            <div><Label>Pojišťovna</Label><Input value={profile.insurance_provider ?? ""} onChange={(e) => setProfile({ ...profile, insurance_provider: e.target.value })} /></div>
            <div><Label>Datum narození</Label><Input type="date" value={profile.date_of_birth ?? ""} onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value || null })} /></div>
          </div>
          <Button onClick={handleSaveProfile}>Uložit profil</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Změnit heslo</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>Původní heslo</Label><Input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} /></div>
            <div><Label>Nové heslo</Label><Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
            <Button onClick={handleChangePassword}>Uložit nové heslo</Button>
          </div>
        </DialogContent>
      </Dialog>
      <AddEventDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onAddEvent={handleAddEvent} />
    </div>
  );
};

export default Dashboard;
