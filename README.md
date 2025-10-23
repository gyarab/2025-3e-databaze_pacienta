# 2025-3e-databaze_pacienta

**Ramcove rozvrzena prace**

🧩 1. Fáze: Analýza a návrh (1–2 týdny)
Cíle:

Vyjasnit požadavky, hlavní funkce a MVP

Navrhnout architekturu aplikace

Zmapovat právní rámec (GDPR, zdravotní údaje)

Vytvořit první wireframy a uživatelské scénáře

Úkoly:
Role	Hlavní úkoly
Produkt & design	• Vytvořit wireframy (např. Figma)
• Definovat obrazovky: přehled léčby, přidání záznamu, detail, časová osa, vyhledávání, export
• Popis uživatelských toků (user flows)
Backend vývojář	• Navrhnout architekturu a databázový model (uživatel, událost, typ, dokument, lék, procedura)
• Rozmyslet API strukturu (REST / GraphQL)
• Zvolit stack (např. Node.js + PostgreSQL / Python + Django)
Frontend vývojář	• Zvolit framework (např. React + Next.js)
• Vytvořit základní UI strukturu s mock daty
• Připravit routování a základní komponenty
Společně (celý tým)	• Konzultace s právníkem nebo rešerše požadavků:
 – GDPR a zpracování osobních a zdravotních údajů
 – Souhlas se zpracováním dat
 – Možnosti šifrování a uchovávání souborů
 – Pravidla pro export dat (např. PDF se souhlasem uživatele)
⚙️ 2. Fáze: Vývoj základní funkční verze (3–5 týdnů)
Cíle:

Implementovat MVP aplikace

Zajistit bezpečné přihlašování, ukládání a zobrazení dat

Umožnit export a vyhledávání

Úkoly:
Role	Hlavní úkoly
Backend vývojář	• Implementovat přihlašování (JWT/Auth0)
• API pro CRUD operace (záznamy, dokumenty, léky, procedury)
• Implementovat nahrávání dokumentů (S3 / Firebase)
• Vyhledávání a filtrování
• Export dat (PDF / CSV)
Frontend vývojář	• Login/registrace obrazovky
• Formuláře pro přidávání záznamů
• Časová osa s událostmi
• Vyhledávání a filtrování
• Export dat (uživatelské rozhraní)
Produkt & design	• Testování použitelnosti (UX testy)
• Doladění UI (barvy, typografie, ikonografie)
• Příprava nápovědy, onboardingových textů
Společně (celý tým)	• Ověřit, že ukládání dat a export odpovídá GDPR principům (např. právo na výmaz, přenositelnost dat)
🔐 3. Fáze: Bezpečnost, právní dokumentace a testování (2 týdny)
Cíle:

Zajistit bezpečnost dat

Vytvořit právní a provozní dokumentaci

Otestovat funkčnost a použitelnost

Úkoly:
Role	Hlavní úkoly
Backend vývojář	• Implementace šifrování dat (např. AES pro uložené soubory)
• Logování a zabezpečení API endpointů
• Testy (unit + integration)
Frontend vývojář	• Validace formulářů
• Vylepšení UX chybových hlášek
• Testování v různých prohlížečích / mobilech
Produkt & design	• Příprava uživatelských podmínek a zásad ochrany osobních údajů
• Zajištění souhlasu uživatele se zpracováním dat (checkbox při registraci)
• Uživatelské testy pilotní verze
Společně	• Revize bezpečnosti (možná konzultace s právníkem / IT security specialistou)
• Nasazení testovací verze
🚀 4. Fáze: Nasazení a provoz (1–2 týdny)
Cíle:

Nasazení na veřejný server

Nastavení monitoringu a zálohování

Finalizace dokumentace

Úkoly:
Role	Hlavní úkoly
Backend vývojář	• Deployment (např. Railway, Render, AWS)
• CI/CD (GitHub Actions)
• Monitoring a logování
Frontend vývojář	• Nasazení (Vercel / Netlify)
• Oprava chyb z testování
• Příprava finální build verze
Produkt & design	• Dokumentace projektu (uživatelská + vývojová)
• Krátký návod „Jak aplikaci používat“
• Sběr zpětné vazby po spuštění
🧾 5. Právní / dokumentační část (paralelně během vývoje)

Tato část by měla být zpracována alespoň rámcově v dokumentaci projektu.

Oblast	Co zpracovat / ověřit
GDPR	– Správce vs. zpracovatel dat
– Jaký souhlas uživatel dává
– Možnost smazat účet a všechna data („right to be forgotten“)
Zdravotní údaje	– Zda aplikace skutečně ukládá citlivá data (ano)
– Nutnost šifrování v klidu i při přenosu (SSL/TLS)
– Kde budou data fyzicky uložena (EU region)
Bezpečnost	– Šifrování hesel (bcrypt)
– HTTPS, CORS, ochrana proti XSS/CSRF
– Role-based access control (uživatel nemá přístup k cizím datům)
Uživatelské dokumenty	– Podmínky používání
– Zásady ochrany osobních údajů
– Souhlas se zpracováním dat (při registraci)
🧭 Doporučené technologie (MVP bez AI)
Vrstva	Technologie
Frontend	React (Next.js) + TailwindCSS
Backend	Node.js (NestJS / Express) nebo Python (FastAPI)
Databáze	PostgreSQL
Storage	AWS S3 / Firebase Storage
Autentizace	JWT / Auth0
Nasazení	Vercel (frontend) + Render / Railway (backend)
Dokumentace	Notion nebo GitBook (pro týmovou práci a zápisy)
