"use client";

import { useEffect, useState } from "react";
import { NewShoppingListButton, ShoppingListButton } from "@/components/layout/shopping_list";
import { Input } from "@/components/ui/input";
import { getLists, listenForChanges } from "@/lib/sync";
import { List } from "@/types/shoppinglist";

export default function ShoppingList() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [shoppingLists, setShoppingLists] = useState<List[]>([]);

    useEffect(() => {
        function fetchLists() {
            getLists().then((e) => setShoppingLists(e))
        }
        fetchLists();
        listenForChanges((updatedDoc) => {
            setShoppingLists(prevLists => {
                if (updatedDoc._deleted) {
                    return prevLists.filter(list => list._id !== updatedDoc._id);
                }

                const index = prevLists.findIndex(list => list._id === updatedDoc._id);
                if (index > -1) {
                    const updatedLists = [...prevLists];
                    updatedLists[index] = updatedDoc;
                    return updatedLists;
                } else {
                    return [...prevLists, updatedDoc];
                }
            });
        });
    }, [setShoppingLists]);

    const filteredLists = shoppingLists.filter((list) =>
        list.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="p-4">
                <Input
                    placeholder="Search for a shopping list..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex flex-row flex-wrap space-x-4 space-y-4 p-4">
                {filteredLists.map((list) => (
                    <div key={list._id} className="flex items-center space-x-2">
                        <ShoppingListButton
                            list={list} />
                    </div>
                ))}
                <NewShoppingListButton />
            </div>
        </div>
    );
}

