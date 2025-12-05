✅ README – Setup Frontend & Backend (lokální vývoj)

Tento projekt aktuálně obsahuje frontend i backend v jedné složce. Níže je kompletní návod, jak spustit obě části aplikace na vašem počítači.

🚀 1. Frontend Setup

Frontend běží na JavaScriptovém vývojovém serveru (Vite).
Pro jeho spuštění je potřeba mít Node.js + npm.

📌 1.1. Instalace Node.js (doporučeno přes NVM)

Doporučujeme nainstalovat Node.js pomocí nvm (Node Version Manager):

🟦 macOS / Linux – instalace NVM:

https://github.com/nvm-sh/nvm#installing-and-updating

Po instalaci:

nvm install --lts
nvm use --lts

🟦 Windows – instalace NVM-Windows:

Použijte tento nástroj:
https://github.com/coreybutler/nvm-windows/releases

Po instalaci:

nvm install lts
nvm use lts


Ověřte instalaci:

node -v
npm -v

📌 1.2. Klonování repozitáře

Pokud chcete pracovat lokálně:

git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

📌 1.3. Instalace frontend závislostí
npm install

📌 1.4. Spuštění vývojového serveru
npm run dev


Frontend běží defaultně na:

http://localhost:5173

🐍 2. Backend Setup (Django)

Backend je vytvořen v Pythonu pomocí Django REST Framework.

📌 2.1. Ověření Pythonu

Doporučeno: Python 3.11+

python --version

📌 2.2. Vytvoření virtuálního prostředí
python -m venv venv

📌 2.3. Aktivace virtuálního prostředí
🟦 Windows (PowerShell)

Pokud se objeví chyba o zakázaných skriptech:

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass


Poté aktivace:

venv\Scripts\activate

🍏 macOS / Linux
source venv/bin/activate

📌 2.4. Instalace backend závislostí
pip install -r requirements.txt

📌 2.5. Migrace databáze
python manage.py migrate

📌 2.6. Spuštění Django backend serveru
python manage.py runserver


Backend běží na:

http://127.0.0.1:8000

🔗 3. Jak spolu frontend a backend komunikují

Frontend a backend se spouštějí zvlášť:

Služba	Adresa
Frontend	http://localhost:5173

Backend	http://127.0.0.1:8000

Frontend posílá HTTP požadavky na backend API.

V produkci bude vše spojeno (například přes Docker nebo Nginx).

🛠️ 4. Struktura projektu (dočasná)

Momentálně jsou obě části v jedné složce.
Později se doporučuje rozdělení:

MediCare/
 ├── backend/
 ├── frontend/
 └── README.md
