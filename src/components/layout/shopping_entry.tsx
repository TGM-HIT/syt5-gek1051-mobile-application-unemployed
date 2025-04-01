// eslint-disable-next-line @typescript-eslint/no-require-imports
const { v4: uuidv4 } = require('uuid');
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Pencil, Pin, PinOff, ArrowUp, ArrowDown, Plus, Trash } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"
import { ShoppingListEntry } from "@/types/shoppinglist"
import { addOrUpdateEntry, deleteEntry } from "@/lib/sync";

export const AddItemModal = ({ onSave }: { onSave: (item: ShoppingListEntry) => void }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [editor, setEditor] = useState("");
    const [amount, setAmount] = useState(1);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" /> Add Item
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Item</DialogTitle>
                    <DialogDescription>
                        Add a new shopping list entry.
                    </DialogDescription>
                </DialogHeader>
                <label>Name</label>
                <Input id="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <label>Description</label>
                <Textarea id="description" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <label>Category</label>
                <Input id="category" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
                <label>Editor</label>
                <Input id="editor" placeholder="Editor" value={editor} onChange={(e) => setEditor(e.target.value)} />
                <label>Amount</label>
                <Input type="number" id="amount" placeholder="Amount" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                <Button onClick={() => onSave({
                    id: uuidv4(),
                    name,
                    description,
                    category,
                    editor,
                    amount,
                    checked: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    pinned: false
                })}>Save Item</Button>
            </DialogContent>
        </Dialog>
    );
}

const DeleteItemModal = ({ listId, item, open, setOpen }: { listId: string, item: ShoppingListEntry, open: boolean, setOpen: (open: boolean) => void }) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    This action will permanently delete your shopping entry.
                </DialogDescription>
                <DialogFooter>
                    <Button variant={'outline'} onClick={() => {
                        setOpen(false)
                    }}>Cancel</Button>
                    <Button onClick={async () => {
                        deleteEntry(listId, item.id)
                        setOpen(false)
                    }}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const EditItemModal = ({ listId, item, open, setOpen }: { listId: string, item: ShoppingListEntry, open: boolean, setOpen: (open: boolean) => void }) => {
    const [name, setName] = useState(item?.name || "")
    const [description, setDescription] = useState(item?.description || "")
    const [category, setCategory] = useState(item?.category || "")
    const [editor, setEditor] = useState(item?.editor || "")
    const [amount, setAmount] = useState(item?.amount || 0)

    useEffect(() => {
        if (item) {
            setName(item.name)
            setDescription(item.description)
            setCategory(item.category)
            setEditor(item.editor)
            setAmount(item.amount)
        }
    }, [item]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Item</DialogTitle>
                </DialogHeader>
                <label>Name</label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />

                <label>Description</label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />

                <label>Category</label>
                <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} />

                <label>Editor</label>
                <Input id="editor" value={editor} onChange={(e) => setEditor(e.target.value)} />

                <label>Amount</label>
                <Input type="number" id="amount" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />

                <Button
                    onClick={() => item ? addOrUpdateEntry(listId, {
                        ...item,
                        name,
                        description,
                        category,
                        editor,
                        amount,
                        updatedAt: new Date()
                    }) : null}
                >
                    Save Changes
                </Button>
            </DialogContent>
        </Dialog>
    )
}

export const FilterAndSort = ({ filterChecked, setFilterChecked, sortBy, changeSort }: {
    filterChecked: "all" | "checked" | "unchecked",
    setFilterChecked: (value: "all" | "checked" | "unchecked") => void,
    sortBy: { key: keyof ShoppingListEntry | null; order: "asc" | "desc" | null },
    changeSort: (key: keyof ShoppingListEntry) => void

}) => (
    <div className="flex justify-between items-center">
        <Select onValueChange={(value) => setFilterChecked(value as "all" | "checked" | "unchecked")}>
            <SelectTrigger>Filter: {filterChecked}</SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="checked">Checked</SelectItem>
                <SelectItem value="unchecked">Unchecked</SelectItem>
            </SelectContent>
        </Select>
        <div className="flex gap-2">
            {["name", "category", "editor"].map((key) => (
                <Button key={`sort-dropdown-item-${key}`} variant={sortBy.key === key ? "default" : "outline"} onClick={() => changeSort(key as keyof ShoppingListEntry)}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    {sortBy.key === key && (sortBy.order === "asc" ? <ArrowUp className="w-4 h-4 ml-2" /> : <ArrowDown className="w-4 h-4 ml-2" />)}
                </Button>
            ))}
        </div>
    </div >
)

export const ShoppingItem = ({ listId, item }: {
    listId: string;
    item: ShoppingListEntry;
}) => {
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const edit = (updatedItem: ShoppingListEntry) => { if (listId) addOrUpdateEntry(listId, updatedItem) }

    return (
        <Card key={item.id} className="p-3 mb-2 flex-row items-center justify-between">
            <div className="flex items-center gap-4 w-full">
                <Checkbox
                    checked={item.checked}
                    onCheckedChange={() => {
                        edit({ ...item, checked: !item.checked })
                    }}
                    className="w-6 h-6"
                />
                <div className="flex flex-col w-full text-left">
                    <h3 className="text-lg font-semibold">{item.name || (<i>No name</i>)} ({item.amount} pcs)</h3>
                    <p className="text-md text-muted-foreground">{item.description}</p>
                    <p className="text-sm text-muted-foreground">{item.category || (<i>No category</i>)}</p>
                    <p className="text-sm text-muted-foreground">{item.editor || (<i>No editor</i>)}</p>
                    <p className="text-xs text-muted-foreground">
                        Last updated: {item.updatedAt.toDateString()} at {item.updatedAt.toLocaleTimeString()}
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-2 items-center">
                <Button variant="ghost" size="icon" onClick={() => {
                    edit({ ...item, pinned: !item.pinned })
                }}>
                    {item.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setEditModalOpen(true)}>
                    <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleteModalOpen(true)}>
                    <Trash className="w-4 h-4" />
                </Button>
            </div>

            <EditItemModal listId={listId} item={item} setOpen={setEditModalOpen} open={editModalOpen} />
            <DeleteItemModal listId={listId} item={item} setOpen={setDeleteModalOpen} open={deleteModalOpen} />
        </Card>
    );
};
