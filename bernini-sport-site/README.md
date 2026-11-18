# Bernini Sport — e-commerce multipagina (DEMO)

**Versione 2 — sito statico pronto per GitHub Pages.**

La precedente homepage con catalogo incorporato è stata ristrutturata come **sito a pagine distinte**, mantenendo la grafica Bernini Sport (antracite, arancione e accento lime), il layout responsive e il catalogo dimostrativo di 12 articoli.

> **Non è ancora un negozio abilitato alle vendite.** Non esistono backend, inventario, checkout, database, elaborazione ordini, invio email o pagamenti. I prodotti, i prezzi, gli sconti e le immagini sono esemplificativi. Non attivare acquisti pubblici prima delle integrazioni e verifiche necessarie.

## Struttura del sito

| Pagina | File | Funzione |
| --- | --- | --- |
| Homepage | `index.html` | Hero, categorie, prodotti in evidenza, offerte e anticipazione Chi siamo |
| Catalogo | `shop.html` | Ricerca, filtro prezzo, offerte, ordinamento e paginazione |
| Categorie | `categoria-running.html`, `categoria-fitness.html`, `categoria-calcio.html`, `categoria-outdoor.html`, `categoria-tennis.html`, `categoria-accessori.html` | Pagine dedicate per disciplina |
| Offerte | `offerte.html` | Catalogo dei prodotti scontati |
| Prodotti | `prodotti/*.html` | 12 pagine prodotto distinte, scelta taglie, quantità, prodotti correlati |
| Chi siamo | `chi-siamo.html` | Identità del negozio, valori, area da personalizzare con storia e foto reali |
| Carrello | `carrello.html` | Elenco articoli, varianti, quantità e subtotale, salvato nel browser |
| Preferiti | `preferiti.html` | Wishlist salvata nel browser |
| Contatti | `contatti.html` | Struttura contatti e form solo dimostrativo (nessun invio) |
| Informazioni | `spedizioni-resi.html`, `privacy.html`, `condizioni.html` | Segnaposto da sostituire con contenuti reali e documenti approvati |
| Errore | `404.html` | Pagina non trovata |

**File comuni**
- `styles.css`: grafica e versione mobile.
- `app.js`: carrello, preferiti, catalogo, filtri, taglie, link tra pagine.
- `data/products.js`: catalogo dimostrativo; ciascun prodotto ha un ID e uno **slug** che determina la sua pagina `prodotti/<slug>.html`.
- `assets/`: logo SVG, favicon, segnaposto immagini. Le fotografie dimostrative sono caricate da URL Unsplash, non incluse nel file ZIP.
- `.nojekyll`: consente la pubblicazione diretta su GitHub Pages senza elaborazione Jekyll.

## Installazione / GitHub Pages

1. Scarica ed estrai lo ZIP.
2. Apri la cartella `bernini-sport-site`.
3. Nel repository GitHub esistente, **sostituisci i vecchi file** con i nuovi e carica tutte le cartelle, in particolare `prodotti/`, `data/` e `assets/`. I file come `index.html`, `shop.html` e `styles.css` devono rimanere **nella radice del repository**.
4. Se è un repository nuovo, crea il progetto su `https://github.com/new` e carica il contenuto della cartella, non la cartella esterna.
5. In **Settings → Pages**, scegli **Deploy from a branch → main → /(root) → Save**.
6. Apri l'indirizzo GitHub Pages del tuo repository e prova i collegamenti del menu, una categoria, una scheda prodotto e il carrello.

Tutti i collegamenti sono relativi: funziona sia all'indirizzo `https://utente.github.io/nome-repo/` sia alla radice di un futuro dominio, senza modificare il codice.

Per un test locale veloce, apri `index.html` nel browser. Per simulare un server statico, nella cartella del sito avvia `python -m http.server 8000` e visita `http://localhost:8000`.

## Cambiare prodotti e contenuti

### Catalogo
Nel file `data/products.js` modifica nome, marchio, categoria, prezzo, foto, taglie, sconto. Mantieni **ID** e **slug** per preservare i link tra pagine. Se aggiungi prodotti, crea anche la relativa pagina HTML sotto `prodotti/` e assegna un nuovo ID. Per cataloghi numerosi questa generazione statica andrà automatizzata o collegata al futuro gestionale.

### Chi siamo e contatti
- `chi-siamo.html`: sostituisci i testi editoriali dimostrativi con storia reale del negozio, missione, persone e foto autorizzate.
- `contatti.html`: aggiungi indirizzo, telefono, email e orari ufficiali. Il modulo non invia dati: richiede integrazione tecnica e informativa.
- `assets/logo.svg` / `assets/logo-light.svg`: sostituisci con logo ufficiale se diverso dal concept.

### Spedizioni, privacy, condizioni
Le pagine informative contengono **segnaposto espliciti**, non documenti legali utilizzabili. Prima del lancio commerciale inserire le reali informazioni aziendali, privacy e cookie policy, condizioni di vendita, resi, consegne, imposte e modalità di pagamento, secondo gli obblighi applicabili.

## Funzioni della demo

- Navigazione multipagina effettiva, senza router o dipendenze JS.
- Home e pagine categoria con link propri, utilizzabili tramite link diretti o segnalibri.
- Schede articolo con URL individuali, taglie e scelta quantità.
- Carrello e preferiti persistenti nel browser con `localStorage` (chiave compatibile con la vecchia demo `bernini-sport-demo-v1`).
- Catalogo filtrabile per nome, prezzo massimo, sconto, ordinabile e paginato.
- Nessun servizio di tracciamento o form invio attivato dal codice.
- HTML accessibile con link, etichette, descrizioni, navigazione mobile e focus visibile.

## Per arrivare alla vendita online

1. Confermare requisiti del cliente: inventario, marchi, varianti, magazzino, promozioni e spedizioni.
2. Scegliere una piattaforma e-commerce/backend o un sistema headless con pannello amministrativo.
3. Collegare pagamenti, ordini, email transazionali e giacenze reali.
4. Completare contenuti aziendali, condizioni e privacy, aggiornare prodotti e immagini autorizzate.
5. Verificare prestazioni, SEO, accessibilità, sicurezza e trattamento dei dati. **Solo allora** eliminare il meta tag `noindex,nofollow` dalle pagine destinate all'indicizzazione.

**Nota SEO:** il mockup crea pagine HTML separate per ogni prodotto, così l'architettura e gli URL sono già più vicini a un vero e-commerce. I contenuti prodotto generati via JavaScript vanno resi statici o serviti da una piattaforma appropriata nella versione commerciale.
