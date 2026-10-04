# Ripostiglio: come metterlo online e installarlo

Ripostiglio è un'app web installabile (PWA). L'archivio, cioè oggetti, foto, categorie ed elenchi, sta solo online su **Supabase**. Sul telefono e sul PC restano soltanto i file dell'app (per aprirla velocemente), l'accesso al tuo account e qualche preferenza, come l'ordinamento scelto.

Servono due account gratuiti:
- **Supabase**, per l'archivio. Non serve la carta di credito.
- **GitHub**, per pubblicare l'app su un indirizzo tuo.

Tempo richiesto: circa 20 minuti, una volta sola.

---

## 1. Crea l'archivio su Supabase

1. Vai su <https://supabase.com>, registrati e premi **New project**.
   - Nome: `ripostiglio`
   - Database password: scegline una e salvala (non serve all'app, ma è bene averla)
   - Region: **Central EU (Frankfurt)** o un'altra in Europa
2. Aspetta un paio di minuti che il progetto sia pronto.
3. Apri **SQL Editor** → **New query**. Incolla tutto il contenuto del file `supabase-setup.sql` e premi **Run**. Deve comparire "Success".
4. Apri **Project Settings → API** (oppure il pulsante **Connect** in alto) e copia due valori:
   - **Project URL**, del tipo `https://abcdefgh.supabase.co`
   - la chiave **anon public**, che nei progetti nuovi si chiama **publishable** e inizia con `sb_publishable_`
5. Apri il file `config.js` con un editor di testo e incolla i due valori al posto di `INCOLLA-QUI…`.

> La chiave anon/publishable è fatta apposta per stare dentro l'app ed è visibile a chiunque apra il sito: è normale. I dati restano protetti perché le regole create dallo script permettono a ciascun account di vedere e modificare solo le proprie righe e le proprie foto.

## 2. Pubblica l'app su GitHub Pages

1. Vai su <https://github.com>, registrati e crea un nuovo repository (**New**):
   - Nome: `ripostiglio`
   - Visibilità: **Public** (GitHub Pages è gratuito sui repository pubblici; i tuoi dati non sono lì, sono su Supabase)
2. Nel repository premi **Add file → Upload files** e trascina **tutti i file e le cartelle** di questa cartella: `index.html`, `config.js` (già compilato), `sw.js`, `supabase.js`, `manifest.webmanifest`, `supabase-setup.sql`, `LEGGIMI.md` e la cartella `icons`. Premi **Commit changes**.
3. La cartella `.github` è nascosta e su Mac o Windows spesso non viene trascinata. Per aggiungerla a mano: **Add file → Create new file**, scrivi come nome `.github/workflows/tieni-sveglio.yml`, incolla il contenuto dell'omonimo file e premi **Commit changes**.
4. Apri **Settings → Pages**. In "Build and deployment" scegli **Deploy from a branch**, branch **main**, cartella **/ (root)**, poi **Save**.
5. Dopo un minuto in alto compare l'indirizzo dell'app, del tipo `https://tuonome.github.io/ripostiglio/`. Salvalo.

## 3. Collega Supabase all'indirizzo dell'app

In Supabase apri **Authentication → URL Configuration**:
- **Site URL**: l'indirizzo dell'app, ad esempio `https://tuonome.github.io/ripostiglio/`
- **Redirect URLs**: aggiungi lo stesso indirizzo

Serve perché le mail di conferma e di cambio password ti riportino all'app.

## 4. Crea il tuo account e chiudi le registrazioni

1. Apri l'indirizzo dell'app, premi **Prima volta? Crea l'account**, inserisci email e password.
2. Apri la mail di conferma che ti arriva, poi accedi.
3. Torna in Supabase: **Authentication → Sign In / Providers** (in alcune versioni **Authentication → Settings**) e disattiva **Allow new users to sign up**. Così nessun altro può registrarsi sul tuo archivio.

## 5. Installa l'app

- **Android (Chrome)**: apri l'indirizzo, accedi, poi tocca **Installa l'app** in fondo alla pagina, oppure menu ⋮ → **Installa app**.
- **iPhone (Safari)**: apri l'indirizzo, tocca **Condividi** (il quadrato con la freccia) → **Aggiungi alla schermata Home**.
- **PC (Chrome o Edge)**: nella barra dell'indirizzo compare l'icona di installazione, oppure usa la versione web normalmente.

Su ogni dispositivo accedi con lo stesso account: vedrai lo stesso archivio, che si aggiorna da solo quando modifichi qualcosa altrove.

---

## Da sapere

- **Senza connessione** l'app si apre, ma mostra solo l'avviso che sei offline: l'archivio non viene copiato sul dispositivo.
- **Pausa di Supabase**: i progetti gratuiti vengono messi in pausa dopo circa una settimana senza attività. Il file `.github/workflows/tieni-sveglio.yml` interroga l'archivio ogni 3 giorni per tenerlo attivo. Se dovesse comunque andare in pausa, basta aprire il progetto su Supabase e premere **Restore**: i dati non si perdono. GitHub può sospendere questi controlli automatici dopo 60 giorni senza modifiche al repository; in quel caso ti manda una mail e li riattivi con un clic dalla scheda **Actions**.
- **Spazio gratuito**: 500 MB per i dati e 1 GB per le foto. Ogni foto viene ridotta a circa 1600 pixel prima del caricamento (di solito 200–400 KB), quindi c'è posto per qualche migliaio di foto.
- **Backup**: il piano gratuito non fa backup scaricabili. Usa ogni tanto **Esporta in CSV** in fondo alla pagina.
- **Aggiornare l'app**: sostituisci i file su GitHub. Alla successiva apertura l'app scarica la nuova versione da sola.
