"use client"

import PouchDB from 'pouchdb-browser';

export const localDB = new PouchDB('shopping_lists');

export async function syncDatabase(remoteURL: string, auth?: { username: string, password: string }) {
    const remoteDB = new PouchDB(remoteURL, { auth });

    try {
        localDB.sync(remoteDB, { live: true, retry: true })
            .on('change', async (info) => {
                console.log('Sync Change:', info);
            })
            .on('paused', (err) => console.log('Sync Paused:', err))
            .on('active', () => console.log('Sync Active'))
            .on('denied', (err) => console.error('Sync Denied:', err))
            .on('complete', (info) => console.log('Sync Complete:', info))
            .on('error', (err) => { throw err });
    } catch (error) {
        return error
    }
}


// Listen for real-time changes and update UI
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
