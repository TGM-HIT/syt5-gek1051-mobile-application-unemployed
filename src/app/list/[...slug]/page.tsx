"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"
import { List, ListEntry } from "@/types/shoppinglist"
import dynamic from "next/dynamic"
import { Separator } from "@/components/ui/separator"

// Dynamically load components
const AddItemModal = dynamic(() => import("@/components/layout/shopping_entry").then((e) => e.AddItemModal), { ssr: false })
const FilterAndSort = dynamic(() => import("@/components/layout/shopping_entry").then((e) => e.FilterAndSort), { ssr: false })
const LoadTemplateModal = dynamic(() => import("@/components/layout/shopping_entry").then((e) => e.LoadTemplateModal), { ssr: false })
const ShoppingItem = dynamic(() => import("@/components/layout/shopping_entry").then((e) => e.ShoppingItem), { ssr: false })

// Function to get the database functions when needed
async function getDBFunctions() {
    const { addOrUpdateListEntry, getList, getListEntries } = await import("@/lib/list_db")
    const { listenForChanges } = await import("@/lib/db")
    return { addOrUpdateListEntry, getList, getListEntries, listenForChanges }
}

export default function ShoppingList({ params }: { params: Promise<{ slug: string }> }) {
    const [list, setList] = useState<List | null>(null)
    const [items, setItems] = useState<ListEntry[]>([])
    const [filterChecked, setFilterChecked] = useState<"all" | "checked" | "unchecked">("all")
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [sortBy, setSortBy] = useState<{ key: keyof ListEntry | null; order: "asc" | "desc" | null }>({ key: "name", order: "asc" })

    // On component mount, get the data from DB
    useEffect(() => {
        // Call the function to get DB functions when needed
        getDBFunctions().then((dbFunctions) => {
            // Fetch the list data and set it in state
            if (params) {
                params.then((e) => {
                    dbFunctions.getList(e.slug[0]).then((listData) => {
                        if (listData) {
                            setList(listData)
                            dbFunctions.getListEntries(listData._id).then(setItems)
                        }
                    })
                })
            }

            // Listen for real-time changes and update items accordingly

        })
    }, [params])

    useEffect(() => {
        getDBFunctions().then((dbFunctions) => {
            if (list) {
                dbFunctions.listenForChanges(() => {
                    if (list) {
                        dbFunctions.getListEntries(list._id).then(setItems)
                    }
                })
            }
        })
    }, [list])

    // Restore the original functionality for changing the sorting order
    const changeSort = (key: keyof ListEntry) => {
        // If we're sorting by the same key, toggle the order
        if (sortBy.key === key) {
            setSortBy((prevState) => ({
                key,
                order: prevState.order === "asc" ? "desc" : "asc", // Toggle between ascending and descending
            }))
        } else {
            // Otherwise, set a new key and default to ascending order
            setSortBy({ key, order: "asc" })
        }
    }

    // Handle editing of an item
    const handleEdit = (item: ListEntry) => {
        if (list) {
            getDBFunctions().then((dbFunctions) => {
                dbFunctions.addOrUpdateListEntry(list._id, item)
            })
        }
    }

    // Apply filters to the items
    const filterItems = (items: ListEntry[], filterChecked: "all" | "checked" | "unchecked") => {
        return items.filter((item) =>
            (filterChecked === "all" ? true : filterChecked === "checked" ? item.checked : !item.checked)
        )
    }

    // Search items based on a query and a key
    const searchItems = (items: ListEntry[], searchQuery: string, searchKey: keyof ListEntry) => {
        return items.filter((item) =>
            item[searchKey]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    }

    // Sort items based on the selected key and order
    const sortItems = (items: ListEntry[], sortBy: { key: keyof ListEntry | null; order: "asc" | "desc" | null }) => {
        return [...items].sort((a, b) => {
            if (!sortBy.key) return b.updatedAt.getTime() - a.updatedAt.getTime()

            const valueA = a[sortBy.key]?.toString().toLowerCase() ?? ""
            const valueB = b[sortBy.key]?.toString().toLowerCase() ?? ""

            if (sortBy.order === "asc") return valueA.localeCompare(valueB)
            if (sortBy.order === "desc") return valueB.localeCompare(valueA)
            return 0
        })
    }

    // Filter pinned and unpinned items
    const pinnedItems = sortItems(searchItems(filterItems(items, filterChecked), searchQuery, "name"), sortBy).filter((item) => item.pinned)
    const unpinnedItems = sortItems(searchItems(filterItems(items, filterChecked), searchQuery, "name"), sortBy).filter((item) => !item.pinned)

    return (
        <div className="w-full mx-auto p-4 space-y-4">
            <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                <Select onValueChange={(value) => changeSort(value as keyof ListEntry)}>
                    <SelectTrigger className="w-full sm:w-auto">Name</SelectTrigger>
                    <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="description">Description</SelectItem>
                        <SelectItem value="category">Category</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                    </SelectContent>
                </Select>

                <Input
                    className="w-full sm:flex-1"
                    placeholder="Search by name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <div className="flex gap-2 flex-col sm:flex-row w-full sm:w-auto">
                    <AddItemModal onSave={(item) => handleEdit(item)} />
                    {list && <LoadTemplateModal list={list} />}
                </div>
            </div>

            <FilterAndSort
                filterChecked={filterChecked}
                setFilterChecked={setFilterChecked}
                sortBy={sortBy}
                changeSort={changeSort}
            />

            <div>
                {pinnedItems.map((item) => (
                    <ShoppingItem key={item.id} listId={list?._id || ''} item={item} />
                ))}
                <Separator />
                {unpinnedItems.map((item) => (
                    <ShoppingItem
                        template={list?.type === "template"}
                        key={item.id}
                        listId={list?._id || ''}
                        item={item}
                    />
                ))}
            </div>
        </div>
    )
}

