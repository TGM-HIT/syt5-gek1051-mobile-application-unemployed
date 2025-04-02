"use client";

import PouchDB from 'pouchdb-browser';

export const localDB = new PouchDB('shopping_lists');

export async function syncDatabase(remoteURL: string, auth?: { username: string, password: string }) {
    const remoteDB = new PouchDB(remoteURL, { auth });

    try {
        localDB.sync(remoteDB, { live: true, retry: true })
            .on('change', async (info) => {
                if (info.direction === 'pull') {
                    await handleConflicts(info.change.docs);
                }
                await getPouchDocs();
            })
            .on('paused', (err) => console.log('Sync Paused:', err))
            .on('active', () => console.log('Sync Active'))
            .on('denied', (err) => console.error('Sync Denied:', err))
            .on('complete', (info) => console.log('Sync Complete:', info))
            .on('error', (err) => { throw err });
    } catch (error) {
        return error;
    }
}

async function handleConflicts(docs: any[]) {
    for (const doc of docs) {
        if (doc._conflicts && doc._conflicts.length > 0) {
            await resolveConflict(doc);
        }
    }
}

async function resolveConflict(doc: any) {
    try {
        const conflictedDoc = await localDB.get(doc._id, { conflicts: true });
        const deletePromises = conflictedDoc._conflicts.map((rev: string) =>
            localDB.remove(conflictedDoc._id, rev)
        );
        await Promise.all(deletePromises);
        await getShoppingLists();
    } catch (err) {
        console.error('Error resolving conflict:', err);
    }
}

export function listenForChanges(updateUI: (data: any) => void) {
    localDB.changes({
        since: 'now',
        live: true,
        include_docs: true
    }).on('change', (change) => {
        console.log('Database Change:', change);
        updateUI(change.doc);
    }).on('error', (err) => console.error('Change Listener Error:', err));
}

export async function getPouchDocs() {
    try {
        const result = await localDB.allDocs({ include_docs: true });
        console.log('Fetched documents:', result.rows);
    } catch (err) {
        console.error('Error fetching documents:', err);
    }
}

export async function getShoppingLists() {
    console.log('Fetching updated shopping lists...');
}

