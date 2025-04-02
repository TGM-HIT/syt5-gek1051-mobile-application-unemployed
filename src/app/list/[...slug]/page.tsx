"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"
import { List, ListEntry } from "@/types/shoppinglist"
import { AddItemModal, FilterAndSort, LoadTemplateModal, ShoppingItem } from "@/components/layout/shopping_entry"
import { addOrUpdateListEntry, getList, getListEntries } from "@/lib/list_db"
import { Separator } from "@/components/ui/separator"
import { listenForChanges } from "@/lib/db"

export default function ShoppingList({ params }: { params: Promise<{ slug: string }> }) {
    const [items, setItems] = useState<ListEntry[]>([])
    const [list, setList] = useState<List | null>(null)

    useEffect(() => {
        params.then((e) => {
            getList(e.slug[0]).then((e) => {
                if (e) {
                    setList(e)
                    getListEntries(e._id).then((f) => setItems(f))
                }
            })
        })
    }, [params, setList])

    useEffect(() => {
        listenForChanges(() => {
            if (list) getListEntries(list._id).then((e) => setItems(e))
        });
    }, [list, setItems])

    const [sortBy, setSortBy] = useState<{ key: keyof ListEntry | null; order: "asc" | "desc" | null }>({ key: null, order: null })
    const [filterChecked, setFilterChecked] = useState<"all" | "checked" | "unchecked">("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [searchKey, setSearchKey] = useState<keyof ListEntry>("name")

    function changeSort(key: keyof ListEntry) {
        setSortBy((prev) => {
            if (prev.key === key) {
                if (prev.order === "asc") return { key, order: "desc" }
                if (prev.order === "desc") return { key: null, order: null }
            }
            return { key, order: "asc" }
        })
    }

    function handleEdit(item: ListEntry) {
        if (list) addOrUpdateListEntry(list._id, item)
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
                <Select onValueChange={(value) => setSearchKey(value as keyof ListEntry)}>
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
                {list && <LoadTemplateModal list={list} />}
            </div>
            <FilterAndSort filterChecked={filterChecked} setFilterChecked={setFilterChecked} sortBy={sortBy} changeSort={changeSort} />
            <div>
                {pinnedItems.map((item) => (
                    <ShoppingItem key={item.id} listId={list?._id || ''} item={item} />
                ))}
                <Separator />
                {unpinnedItems.map((item) => (
                    <ShoppingItem template={list?.type == "template"} key={item.id} listId={list?._id || ''} item={item} />
                ))}
            </div>
        </div>
    )
}