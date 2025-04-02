"use client";

import { useEffect, useState } from "react";
import { NewShoppingListButton, ShoppingListButton } from "@/components/layout/shopping_list";
import { Input } from "@/components/ui/input";
import { getLists } from "@/lib/list_db";
import { List } from "@/types/shoppinglist";
import { Separator } from "@/components/ui/separator";
import { listenForChanges } from "@/lib/db";
import { getTemplates } from "@/lib/list_db";
import { ShoppingTemplateButton } from "@/components/layout/shopping_template";

export default function ShoppingList() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [lists, setLists] = useState<List[]>([]);
    const [templates, setTemplates] = useState<List[]>([]);

    useEffect(() => {
        function fetchLists() {
            getLists().then((e) => setLists(e))
            getTemplates().then((e) => setTemplates(e))
        }

        fetchLists();
        listenForChanges((updatedDoc) => {
            if (updatedDoc._deleted) {
                setLists((prev) => prev.filter(e => e._id !== updatedDoc._id))
                setTemplates((prev) => prev.filter(e => e._id !== updatedDoc._id))
            } else {
                const updateFn = updatedDoc.type == 'list' ? setLists : setTemplates
                updateFn((prev: List[]) => {
                    if (updatedDoc._deleted) {
                        return prev.filter(e => e._id !== updatedDoc._id);
                    }

                    const index = prev.findIndex(list => list._id === updatedDoc._id);
                    if (index > -1) {
                        const updatedLists = [...prev];
                        updatedLists[index] = updatedDoc;
                        return updatedLists;
                    } else {
                        return [...prev, updatedDoc];
                    }
                });
            }
        });
    }, [setLists, setTemplates]);

    const filteredLists = lists.filter((list) =>
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

            <div className="flex flex-col">
                <div className="flex flex-row flex-wrap space-x-4 space-y-4 p-4">
                    {filteredLists.map((list) => (
                        <div key={list._id} className="flex items-center space-x-2">
                            <ShoppingListButton
                                list={list} />
                        </div>
                    ))}
                    <NewShoppingListButton />
                </div>
                <Separator />
                <div className="flex flex-row flex-wrap space-x-4 space-y-4 p-4">
                    {templates.map((template) => (
                        <div key={template._id} className="flex items-center space-x-2">
                            <ShoppingTemplateButton
                                template={template} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
