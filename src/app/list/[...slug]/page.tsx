"use client"

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"
import { ShoppingListEntry } from "@/types/shoppinglist"
import { AddItemModal, FilterAndSort, ShoppingItem } from "@/components/layout/shopping_entry"
import { addOrUpdateEntry, getEntries, listenForChanges } from "@/lib/sync"
import { Separator } from "@/components/ui/separator"

export default function ShoppingList({ params }: { params: Promise<{ slug: string }> }) {
    const listId = useRef<string | null>(null);
    const [items, setItems] = useState<ShoppingListEntry[]>([])

    const fetch = () => {
        if (listId.current) getEntries(listId.current).then((e) => setItems(e))
    }

    useEffect(() => {
        params.then((e) => {
            listId.current = e.slug[0]
            fetch()
        })
    }, [params, listId])

    useEffect(() => {
        listenForChanges(() => {
            fetch()
        });
    }, [listId, setItems])

    const [sortBy, setSortBy] = useState<{ key: keyof ShoppingListEntry | null; order: "asc" | "desc" | null }>({ key: null, order: null })
    const [filterChecked, setFilterChecked] = useState<"all" | "checked" | "unchecked">("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [searchKey, setSearchKey] = useState<keyof ShoppingListEntry>("name")

    function changeSort(key: keyof ShoppingListEntry) {
        setSortBy((prev) => {
            if (prev.key === key) {
                if (prev.order === "asc") return { key, order: "desc" }
                if (prev.order === "desc") return { key: null, order: null }
            }
            return { key, order: "asc" }
        })
    }

    function handleEdit(item: ShoppingListEntry) {
        if (listId.current) addOrUpdateEntry(listId.current, item)
    }

    const filteredItems = items.filter((item) =>
        (filterChecked === "all" ? true : filterChecked === "checked" ? item.checked : !item.checked)
    );

    const searchedItems = filteredItems.filter((item) =>
        item[searchKey]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedItems = [...searchedItems].sort((a, b) => {
        if (!sortBy.key) return b.updatedAt.getTime() - a.updatedAt.getTime()

        const valueA = a[sortBy.key]?.toString().toLowerCase() ?? ""
        const valueB = b[sortBy.key]?.toString().toLowerCase() ?? ""

        if (sortBy.order === "asc") return valueA.localeCompare(valueB)
        if (sortBy.order === "desc") return valueB.localeCompare(valueA)
        return 0
    })

    const pinnedItems = sortedItems.filter((item) => item.pinned)
    const unpinnedItems = sortedItems.filter((item) => !item.pinned)

    return (
        <div className="w-full mx-auto p-4 space-y-4">
            <div className="flex gap-2">
                <Select onValueChange={(value) => setSearchKey(value as keyof ShoppingListEntry)}>
                    <SelectTrigger>{searchKey.charAt(0).toUpperCase() + searchKey.slice(1)}</SelectTrigger>
                    <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="description">Description</SelectItem>
                        <SelectItem value="category">Category</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                    </SelectContent>
                </Select>
                <Input
                    placeholder={`Search by ${searchKey}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <AddItemModal onSave={(item) => {
                    handleEdit(item)
                }} />
            </div>
            <FilterAndSort filterChecked={filterChecked} setFilterChecked={setFilterChecked} sortBy={sortBy} changeSort={changeSort} />
            <div>
                {pinnedItems.map((item) => (
                    <ShoppingItem key={item.id} listId={listId.current || ''} item={item} />
                ))}
                <Separator />
                {unpinnedItems.map((item) => (
                    <ShoppingItem key={item.id} listId={listId.current || ''} item={item} />
                ))}
            </div>
        </div>
    )
}
