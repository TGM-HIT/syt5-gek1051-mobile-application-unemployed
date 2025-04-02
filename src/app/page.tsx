"use client"

import { NewShoppingListButton, ShoppingListButton } from "@/components/layout/shopping_list";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function ShoppingList() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const shoppingLists = [
        { id: 1, name: 'Groceries', itemsChecked: '12 / 14' },
        { id: 2, name: 'Electronics', itemsChecked: '3 / 5' },
        { id: 3, name: 'Books', itemsChecked: '8 / 10' },
        { id: 4, name: 'Furniture', itemsChecked: '1 / 4' },
    ];

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
            
            <div className='flex flex-row flex-wrap space-x-4 space-y-4 p-4'>
                {filteredLists.map((list) => (
                    <ShoppingListButton 
                        key={list.id}
                        id={list.id}
                        name={list.name}
                        itemsChecked={list.itemsChecked}
                    />
                ))}
                <NewShoppingListButton />
            </div>
        </div>
    );
}
