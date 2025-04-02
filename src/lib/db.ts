import PouchDB from 'pouchdb-browser';

export const localDB = new PouchDB('shopping_lists');


export async function syncDatabase(remoteURL: string, auth?: { username: string, password: string }) {
    const remoteDB = new PouchDB(remoteURL, { auth });

    return new Promise<void>((resolve, reject) => {
        try {
            localDB.sync(remoteDB, { live: true, retry: true })
                .on('change', async (info) => {

                    if (info.direction === 'pull') {
                        await handleConflicts(info.change.docs);
                    }
                    await getPouchDocs();
                })
                .on('paused', () => { resolve() })
                .on('active', () => {
                    resolve()
                })
                .on('denied', (err) => {
                    reject(err); // Reject the promise if sync is denied
                })
                .on('complete', (info) => {
                    resolve(); // Resolve when sync is complete
                })
                .on('error', (err) => {
                    reject(err); // Reject the promise on error
                });
        } catch (error) {
            reject(error); // Reject the promise if an error is thrown in try block
        }
    });
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
        const deletePromises = conflictedDoc._conflicts?.map((rev: string) =>
            localDB.remove(conflictedDoc._id, rev)
        );
        if (deletePromises) await Promise.all(deletePromises);
    } catch (err) {
        console.error('Error resolving conflict:', err);
    }
}

export async function getPouchDocs() {
    try {
        const result = await localDB.allDocs({ include_docs: true });
        console.log('Fetched documents:', result.rows);
    } catch (err) {
        console.error('Error fetching documents:', err);
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
