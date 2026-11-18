# BERNINI SPORT — Mockup e-commerce professionale

Sito dimostrativo, responsive, in italiano, realizzato in **HTML + CSS + JavaScript puro**. Nessuna dipendenza, nessuna compilazione e nessun abbonamento tecnico richiesto per pubblicare questa demo statica su GitHub Pages.

**IMPORTANTE: NON È ANCORA UN E-COMMERCE OPERATIVO.** Prodotti e prezzi sono inventati. Il carrello e i preferiti funzionano nel browser e vengono salvati localmente, ma **nessun ordine, pagamento, email o account utente è realmente elaborato**. La demo non comprende un pannello di amministrazione o un database.

## Funzioni già presenti

- Home page moderna con stile premium, responsive per smartphone, tablet e desktop
- Menu discipline sportive, card editoriali e catalogo con 12 articoli demo
- Ricerca istantanea nel catalogo, filtri per categoria e prodotti scontati
- Ordinamento per prezzo e nome
- Scheda prodotto con eventuale selezione taglia
- Preferiti e carrello con quantità e subtotale, salvati su `localStorage`
- Newsletter e checkout **solo dimostrativi**, senza invii o addebiti
- Immagine segnaposto se una foto non è disponibile
- Logo vettoriale e favicon originale di esempio

## Come caricare su GitHub

1. Estrai lo ZIP in una cartella sul computer.
2. Vai su [github.com/new](https://github.com/new), crea un repository, per esempio `bernini-sport`.
3. Apri il repository e seleziona **Add file → Upload files**.
4. Trascina **tutti i file e le cartelle contenuti nella cartella `bernini-sport-site`** (non solo `index.html`). Mantieni la stessa struttura.
5. Fai clic su **Commit changes**.
6. Vai su **Settings → Pages → Build and deployment**.
7. Seleziona **Deploy from a branch**, branch **main**, cartella **/(root)**, poi **Save**.
8. Dopo la pubblicazione GitHub Pages, l'indirizzo normalmente sarà `https://TUO-USERNAME.github.io/bernini-sport/` (dipende dal nome del repository). Usa l'URL effettivamente mostrato da GitHub.

In alternativa puoi pubblicare con Git:

```bash
git init
git add .
git commit -m "Bernini Sport: prima demo e-commerce"
git branch -M main
git remote add origin https://github.com/TUO-USERNAME/bernini-sport.git
git push -u origin main
```

> GitHub Pages ospita file statici: **non gestisce di per sé ordini, database o pagamenti**.

## Personalizzare il negozio

- **Prodotti e prezzi:** `data/products.js` contiene l'elenco dei prodotti dimostrativi. Sostituisci `name`, `brand`, `category`, `price`, `oldPrice`, `image`, `sizes` e gli altri campi con dati reali.
- **Immagini:** puoi usare URL di immagini autorizzate, ma per produzione conviene aggiungere immagini ottimizzate nella cartella `assets/images/` e usare `image: 'assets/images/foto.jpg'`. Le foto di esempio sono collegate a Unsplash: **non sono distribuite dentro lo ZIP**, richiedono Internet e vanno sostituite con foto reali e verificandone le autorizzazioni d'uso.
- **Logo:** `assets/logo.svg` e `assets/logo-light.svg` sono proposte grafiche di esempio e possono essere sostituite con il logo ufficiale del negozio.
- **Testi, messaggi e contatti:** `index.html`.
- **Colori, layout e responsive:** `styles.css` (variabili di colore nelle prime righe).
- **Funzioni del catalogo e carrello:** `app.js`.

Apri `index.html` nel browser per vedere la demo. Non è necessario installare Node.js, pacchetti o strumenti di build.

## Prima di lanciare il vero e-commerce

1. Convalidare identità del brand e grafica con il proprietario.
2. Sostituire i prodotti, le foto, i prezzi, gli sconti e le condizioni demo con contenuti reali autorizzati.
3. Attivare piattaforma e-commerce/backend con database, varianti, inventario, ordini, email e pannello amministrativo.
4. Integrare un checkout affidabile (ad esempio un provider pagamenti o una piattaforma e-commerce) e configurare pagamenti, IVA, spedizioni e resi.
5. Inserire informazioni aziendali e legali reali, privacy/cookie policy, condizioni di vendita e adempimenti applicabili.
6. Attivare newsletter solo dopo aver configurato un servizio di iscrizione, informativa privacy e raccolta del consenso.
7. Effettuare test su dispositivi e browser reali, controllo accessibilità, performance, SEO e sicurezza.
8. Togliere `<meta name="robots" content="noindex, nofollow">` da `index.html` solo quando il sito sarà pronto a essere indicizzato.
9. Collegare un dominio del negozio e configurare correttamente il DNS.

## Note per gli sviluppatori

- Il sito è volutamente privo di framework per consentire la pubblicazione immediata su GitHub Pages e facilitare le modifiche con Codex.
- Non ci sono chiavi segrete o API private.
- La persistenza di carrello e preferiti usa esclusivamente il browser, non è sincronizzata tra dispositivi.
- Le foto remote possono non funzionare se il servizio esterno è bloccato/offline: in quel caso appare un segnaposto per le card prodotti.
- Per un negozio con checkout reale consigliamo una seconda fase architetturale dedicata, non l'aggiunta di soli pulsanti di pagamento a questo prototipo.
