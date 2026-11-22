# Cozy Paw Shop

Sito statico multipagina, in italiano, ispirato al mockup Cozy Paw.

## Pagine
- `index.html`: home e prodotti in evidenza.
- `collezione.html`: catalogo filtrabile.
- `prodotto.html?id=...`: scheda prodotto, aperta in una nuova scheda cliccando sulle immagini del catalogo.
- `chi-siamo.html`, `su-misura.html` e `carrello.html`.

Il carrello conserva gli articoli nel browser, quindi resta disponibile navigando tra le pagine.

## Ordini reali
Il checkout prepara una richiesta d’ordine ma non elabora pagamenti e non registra ordini su un server. Collegare un indirizzo email ufficiale a `mailto:` in `app.js`; per pagamenti online e gestione degli ordini serve integrare un backend o un servizio ecommerce.

Il logo approvato è `img/logo-cozy-paw.png`; la palette riprende crema, rosa cipria e marrone caldo dell’immagine. Le fotografie dei prodotti sono riutilizzate da `../cozy-paw/img/` nel repository.
