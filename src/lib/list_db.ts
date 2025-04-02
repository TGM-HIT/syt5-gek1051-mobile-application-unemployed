"use client"

import { BaseType, List, ListEntry } from '@/types/shoppinglist';
import { localDB } from './db';

export async function getLists(): Promise<List[]> {
    try {
        const result = await localDB.allDocs<BaseType>({ include_docs: true });
        const lists = result.rows.map(row => row.doc).filter(doc => doc && doc.type === "list");
        return lists as unknown as List[]
    } catch (error) {
        console.error('Error fetching lists:', error);
        return []
    }
}

export async function getTemplates(): Promise<List[]> {
    try {
        const result = await localDB.allDocs<BaseType>({ include_docs: true });
        const lists = result.rows.map(row => row.doc).filter(doc => doc && doc.type === "template");
        return lists as unknown as List[]
    } catch (error) {
        console.error('Error fetching templates:', error);
        return []
    }
}

export async function getList(listId: string): Promise<List | null> {
    try {
        const list: List = await localDB.get(listId)
        return list
    } catch (error) {
        console.error('Error fetching list:', error);
        return null
    }
}

export async function addList(list: List
): Promise<void> {
    try {
        await localDB.put(list);
    } catch (error) {
        console.error('Error adding list:', error);
    }
}

export async function updateList(list: List): Promise<void> {
    try {
        await localDB.put(list);
    } catch (error) {
        console.error('Error updating list:', error);
    }
}

export async function deleteList(id: string): Promise<void> {
    try {
        const doc = await localDB.get(id);
        await localDB.remove(doc);
    } catch (error) {
        console.error('Error deleting list:', error);
    }
}

export async function getListEntries(listId: string): Promise<ListEntry[]> {
    try {
        const list: List = await localDB.get(listId)
        return Object.keys(list.entries).map((e) => {
            return {
                ...list.entries[e],
                updatedAt: new Date(list.entries[e].updatedAt),
                createdAt: new Date(list.entries[e].createdAt)
            }
        })
    } catch (error) {
        console.error('Error while retrieving list:', error);
        return []
    }
}

export async function addOrUpdateListEntry(listId: string, entry: ListEntry): Promise<void> {
    try {
        const list: List = await localDB.get(listId);
        list.entries[entry.id] = entry
        await localDB.put(list);
    } catch (error) {
        console.error('Error adding entry:', error);
    }
}

export async function addEntriesBulk(listId: string, entries: ListEntry[]): Promise<void> {
    try {
        const list: List = await localDB.get(listId);
        entries.forEach((e) => list.entries[e.id] = e)
        await localDB.put(list);
    } catch (error) {
        console.error('Error adding entry:', error);
    }
}

export async function deleteListEntry(listId: string, entryId: string): Promise<void> {
    try {
        const list: List = await localDB.get(listId);
        delete list.entries[entryId]
        await localDB.put(list);
    } catch (error) {
        console.error('Error deleting entry:', error);
    }
}
