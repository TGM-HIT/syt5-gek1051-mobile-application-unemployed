"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { List } from "@/types/shoppinglist";

const ShoppingListButton = dynamic(() => import("@/components/layout/shopping_list").then((mod) => mod.ShoppingListButton), { ssr: false });
const NewShoppingListButton = dynamic(() => import("@/components/layout/shopping_list").then((mod) => mod.NewShoppingListButton), { ssr: false });
const ShoppingTemplateButton = dynamic(() => import("@/components/layout/shopping_template").then((mod) => mod.ShoppingTemplateButton), { ssr: false });

export default function ShoppingList() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [lists, setLists] = useState<List[]>([]);
    const [templates, setTemplates] = useState<List[]>([]);

    useEffect(() => {
        // Lazily load database functions when needed
        async function fetchData() {
            // Dynamically import the database functions
            const { getLists, getTemplates } = await import("@/lib/list_db");
            const { listenForChanges } = await import("@/lib/db");

            // Fetch lists and templates
            const listsData = await getLists();
            setLists(listsData);

            const templatesData = await getTemplates();
            setTemplates(templatesData);

            // Listen for real-time changes in the database
            listenForChanges((updatedDoc) => {
                if (updatedDoc._deleted) {
                    setLists((prev) => prev.filter((e) => e._id !== updatedDoc._id));
                    setTemplates((prev) => prev.filter((e) => e._id !== updatedDoc._id));
                } else {
                    const updateFn = updatedDoc.type === "list" ? setLists : setTemplates;
                    updateFn((prev: List[]) => {
                        if (updatedDoc._deleted) {
                            return prev.filter((e) => e._id !== updatedDoc._id);
                        }

                        const index = prev.findIndex((list) => list._id === updatedDoc._id);
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
        }

        fetchData();
    }, []); // Empty dependency array ensures this only runs once when the component mounts

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
                            <ShoppingListButton list={list} />
                        </div>
                    ))}
                    <NewShoppingListButton />
                </div>
                <Separator />
                <div className="flex flex-row flex-wrap space-x-4 space-y-4 p-4">
                    {templates.map((template) => (
                        <div key={template._id} className="flex items-center space-x-2">
                            <ShoppingTemplateButton template={template} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
