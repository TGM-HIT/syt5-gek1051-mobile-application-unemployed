# Offline Shopping List Storage

_Dokumentation der (bereits vorhandenen) MH (ID3)_

**Task description**
"Als Benutzer möchte ich, dass Einkaufslisten lokal gespeichert werden, damit sie bearbeitet werden können, wenn keine Internetverbindung besteht."

Inspect: storage > Index DB > http://localhost:8081 > _pouch_shopping (default) > by-sequence: 

![image](https://github.com/user-attachments/assets/b4feeea3-7560-4810-aed1-c485b4760dd4)

## Technologien
- Vue.js: Frontend-Framework für die Benutzeroberfläche
- PouchDB: Clientseitige Datenbank für die Offline-Speicherung
- Service Worker: Ermöglicht die Offline-Nutzung durch Caching der App-Resourcen
- (CouchDB: Synchronisierung mit einem Server, wenn eine Internetverbindung besteht)

## Implementierung
### I Datenstruktur
-> Daten werden in einer lokalen PouchDB-Instanz gespeichert

Einkaufsliste (type: "list"):
```json
{
  "type": "list",
  "version": 1,
  "title": "Hofer",
  "checked": false,
  "place": {
    "title": "tgm",
    "license": null,
    "lat": null,
    "lon": null,
    "address": {}
  },
  "createdAt": "2025-03-12T09:46:22.590Z",
  "updatedAt": "2025-03-12T09:46:43.605Z",
  "_doc_id_rev": "list:cm85qjke50000206e7efi6pki::1-6074c6a366b64214af3be8ab308f10bf"
}
```

Artikel (type: "item"):
```json
{
  "type": "item",
  "version": 1,
  "title": "Skyr",
  "checked": false,
  "createdAt": "2025-03-12T09:46:49.973Z",
  "updatedAt": "2025-03-12T09:46:49.973Z",
  "list": "list:cm85qjke50000206e7efi6pki",
  "_doc_id_rev": "item:cm85qk5it0001206ehclarh2c::1-4824361b2d1f404bba0e88b7586be120"
}

```
### II Speicherung in PouchDB
-> Speicherung in der IndexDB des Browsers
```javascript
import PouchDB from 'pouchdb';

const db = new PouchDB('shopping');

// Eine neue Liste speichern
async function saveList(title) {
  const list = {
    _id: `list:${new Date().getTime()}`,
    type: "list",
    title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  await db.put(list);
}

// Einen Artikel zur Liste hinzufügen
async function addItem(listId, title) {
  const item = {
    _id: `item:${new Date().getTime()}`,
    type: "item",
    title,
    checked: false,
    list: listId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  await db.put(item);
}
```

### III Abrufen von Einkaufslisten
```javascript
async function getLists() {
  const result = await db.find({ selector: { type: "list" } });
  return result.docs;
}
```
### IV Synchronisation mit CouchDB
Falls eine Internetverbindung besteht -> synchronisiert sich PouchDB mit CouchDB
```javascript
const remoteDB = new PouchDB('https://username:password@your-couchdb-instance/shopping');

db.sync(remoteDB, {
  live: true,
  retry: true
}).on('change', (info) => {
  console.log("Daten synchronisiert:", info);
}).on('error', (err) => {
  console.error("Sync-Fehler:", err);
});

```

## Offline Speicherung
Ein Service Worker ermöglicht das Caching der App-Dateien für Offline-Zugriff.
```javascript
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('shopping-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/shoppinglist.js',
        '/shoppinglist.css'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

## Conclusion
- [x] Einkaufslisten werden lokal gespeichert und bleiben offline verfügbar.
- [x] Änderungen werden beim nächsten Online-Status automatisch synchronisiert.
- [x] Die App bleibt durch Service Worker und IndexDB performant und zuverlässig.

