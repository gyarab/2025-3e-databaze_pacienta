import React, { createContext, useContext, useEffect, useState } from "react";

type Lang = "cs" | "en";

const defaultLang: Lang = (localStorage.getItem("medicare_lang") as Lang) ?? "cs";

const dict: Record<Lang, Record<string, string>> = {
  cs: {
    appName: "MediCare",
    start: "Začít",
    tryFree: "Vyzkoušet zdarma",
    learnMore: "Zjistit více",
    addRecord: "Přidat záznam",
    addFirstRecord: "Přidat první záznam",
    timeline: "Časová osa léčby",
    totalRecords: "Celkem záznamů",
    medication: "Léky",
    documents: "Dokumenty",
    surgeries: "Operace",
    noRecords: "Zatím nemáte žádné záznamy",
    cancel: "Zrušit",
    saveChanges: "Uložit změny",
    createRecord: "Přidat záznam",
    editRecord: "Upravit záznam",
    attachment: "Příloha (PDF / obrázek)",
    existingAttachments: "Existující přílohy",
    delete: "Smazat",
    confirmDeleteRecord: "Opravdu chcete smazat celý záznam? Tuto akci nelze vrátit.",
  surgery: "Operace",
  medication_label: "Léky",
  // homepage features
  feature1_title: "Časová osa",
  feature1_description: "Přehledné zobrazení všech zdravotních událostí v chronologickém pořadí",
  feature2_title: "Dokumenty",
  feature2_description: "Nahrávejte a organizujte lékařské zprávy na jednom místě",
  feature3_title: "Vyhledávání",
  feature3_description: "Rychle najděte potřebné informace o léčbě nebo lécích",
  feature4_title: "Bezpečnost",
  feature4_description: "Vaše data jsou chráněna a přístupná pouze vám",
  feature5_title: "Komplexní evidence",
  feature5_description: "Operace, léky, rehabilitace i lázně na jednom místě",
  feature6_title: "Budoucnost",
  feature6_description: "Brzy s AI asistentem pro automatické třídění a odpovědi",
  // profile / auth
  myProfile: "Můj profil",
  changePassword: "Změnit heslo",
  logout: "Odhlásit se",
  edit: "Upravit",
  deleteRecordConfirm: "Opravdu chcete smazat celý záznam?",
  rehabilitation: "Rehabilitace",
  spa: "Lázně",
  },
  en: {
    appName: "MediCare",
    start: "Get started",
    tryFree: "Try for free",
    learnMore: "Learn more",
    addRecord: "Add record",
    addFirstRecord: "Add the first record",
    timeline: "Treatment timeline",
    totalRecords: "Total records",
    medication: "Medications",
    documents: "Documents",
    surgeries: "Surgeries",
    noRecords: "You don't have any records yet",
    cancel: "Cancel",
    saveChanges: "Save changes",
    createRecord: "Add record",
    editRecord: "Edit record",
    attachment: "Attachment (PDF / image)",
    existingAttachments: "Existing attachments",
    delete: "Delete",
    confirmDeleteRecord: "Are you sure you want to delete this entire record? This action cannot be undone.",
  surgery: "Surgery",
  medication_label: "Medications",
  // homepage features
  feature1_title: "Timeline",
  feature1_description: "Clear view of all health events in chronological order",
  feature2_title: "Documents",
  feature2_description: "Upload and organize medical reports in one place",
  feature3_title: "Search",
  feature3_description: "Quickly find treatment or medication details",
  feature4_title: "Security",
  feature4_description: "Your data is protected and accessible only to you",
  feature5_title: "Comprehensive",
  feature5_description: "Surgeries, medications, rehab and spa stays in one place",
  feature6_title: "Future",
  feature6_description: "Soon with AI assistant for automatic sorting and replies",
  // profile / auth
  myProfile: "My profile",
  changePassword: "Change password",
  logout: "Log out",
  edit: "Edit",
  deleteRecordConfirm: "Are you sure you want to delete this entire record?",
  rehabilitation: "Rehabilitation",
  spa: "Spa",
  },
};

const I18nContext = createContext({
  lang: defaultLang,
  setLang: (l: Lang) => {},
  t: (k: string) => k,
  toggle: () => {},
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(defaultLang);

  useEffect(() => {
    localStorage.setItem("medicare_lang", lang);
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const toggle = () => setLangState((s) => (s === "cs" ? "en" : "cs"));
  const t = (k: string) => dict[lang][k] ?? dict["cs"][k] ?? k;

  return <I18nContext.Provider value={{ lang, setLang, t, toggle }}>{children}</I18nContext.Provider>;
};

export const useI18n = () => useContext(I18nContext);

export default LanguageProvider;
