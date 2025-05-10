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

----

# Test Protocol

## Test Environment
- **Browser:** Chrome / Firefox
- **Database:** PouchDB (IndexedDB)
- **Network:** Online & Offline mode
- **DevTools:** IndexedDB Storage (`_pouch_shopping`)

---

## Test Cases

### 1. Create and Retrieve Shopping List
**Objective:** Ensure a new shopping list is stored and retrievable.

| Step | Action | Expected Result | Status (✔/x) |
|------|--------|----------------|---------------|
| 1 | Open the shopping list app | App loads successfully | ✔ |
| 2 | Create a new shopping list (e.g., "Supermarket") | List appears in UI | ✔ |
| 3 | Open DevTools → Application → IndexedDB → `_pouch_shopping` | List is stored as `type: "list"` | ✔ |
| 4 | Refresh the page | List persists after reload | ✔ |

---

### 2. Add Items to Shopping List
**Objective:** Verify that items are linked to lists and persist locally.

| Step | Action | Expected Result | Status (✔/x) |
|------|--------|----------------|---------------|
| 1 | Select an existing shopping list | List opens successfully | ✔ |
| 2 | Add an item (e.g., "Skyr") | Item appears under the list | ✔ |
| 3 | Open DevTools → IndexedDB → `_pouch_shopping` | `type: "item"` exists with correct `list` ID | ✔ |
| 4 | Refresh the page | Items remain linked to the list | ✔ |

---

### 3. Offline Mode: Editing and Retrieval
**Objective:** Ensure the user can edit lists while offline.

| Step | Action | Expected Result | Status (✔/x) |
|------|--------|----------------|---------------|
| 1 | Go to DevTools → Network → Set to **Offline** | App runs without crashing | ✔ |
| 2 | Add a new list (e.g., "Offline Test") | List appears in UI | ✔ |
| 3 | Add items while offline | Items appear in UI | ✔ |
| 4 | Close and reopen the app | List and items persist | ✔ |

---

```bash
sudo pacman -S couchdb

sudo nano /etc/couchdb/local.ini
->
[httpd]
bind_address = 127.0.0.1

[admins]
admin = *******

# start in background
sudo systemctl enable couchdb
sudo systemctl start couchdb
# check status
sudo systemctl status couchdb

on http://localhost:8081/
Sync URL: http://admin:*******@127.0.0.1:5984/shopping-list

```


! `Synch Error`!
Auf http://127.0.0.1:5984/_utils/#_config -> CORS -> Enable CORS
Restrict to: http://localhost:8081

-> "`Synching`"

### 4. Syncing Changes When Online
**Objective:** Offline changes should sync when reconnecting.

| Step | Action | Expected Result | Status (✔/x) |
|------|--------|----------------|---------------|
| 1 | Ensure the app is **online** and syncing with CouchDB | Sync is active | ✔ |
| 2 | Go offline and edit a list (rename, add items) | Changes are stored locally | ✔ |
| 3 | Go online again | Changes sync to CouchDB | ✔ | 
| 4 | Check CouchDB database | Updated lists and items appear | ✔ |

---

## Debugging Notes
| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| List disappears after refresh | `db.put()` not storing properly | Check `saveList()` function |
| Items not linked to list | `list` field missing in item | Ensure `listId` is passed |
| Syncing not working | `db.sync()` misconfigured | Verify CouchDB URL & CORS |

---

## **Test Summary**
| Test Case | Status (✔/x) | Notes |
|-----------|--------------|-------|
| Create and Retrieve List | ✔ |  |
| Add Items to List | ✔ |  |
| Offline Mode | ✔ |  |
| Sync on Reconnect | ✔ | alles auf 127.0.0.1 also alles gesynct |

🟢 **Pass Criteria:** All tests succeed without data loss.  
🔴 **Fail Criteria:** Lists or items disappear, or sync does not work.

---

tested by Gioia Frolik (unemployed slave)
- **Test Date:**  2025-03-19
- **Version:** V2

