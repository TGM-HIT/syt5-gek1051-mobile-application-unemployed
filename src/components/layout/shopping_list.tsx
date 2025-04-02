import { cn } from '@/lib/utils';
import { Ellipsis, PlusIcon } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import { Address as AddressDetails, List } from "@/types/shoppinglist"
import { generatePdf } from '@/lib/pdf';
import { addList, deleteList, updateList } from '@/lib/list_db';
import { Switch } from '../ui/switch';

export function ShoppingListButton({ list }: { list: List }) {
    const [showInfo, setShowInfo] = useState(false);
    const [editField, setEditField] = useState('');
    const [editValue, setEditValue] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    return (
        <div
            className={cn(
                'relative bg-popover p-4 border-2 border rounded-lg shadow-md transition-all duration-300',
                'hover:scale-105 hover:bg-accent h-40 w-40 overflow-y-scroll'
            )}
        >
            <div className="flex flex-col space-y-2">
                <div className='flex flex-row'>
                    <h2 className="font-semibold text-lg overflow-hidden text-ellipsis justify-self-left grow">{list.name || <i>No name</i>}</h2>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Ellipsis className='text-muted-foreground hover:text-foreground transition-all duration-300' />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Manage {list.name}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setShowInfo(true)}>Display info</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setIsEditing(true); setEditField('name'); setEditValue(list.name); }}>Edit name</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setIsEditing(true); setEditField('description'); setEditValue(list.description); }}>Edit description</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => generatePdf(list)}>Export PDF</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setShowDelete(true)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Link href={`/list/${list._id}`}>
                    <p className="text-sm text-muted-foreground overflow-hidden text-ellipsis">{list.description || <i>No description</i>}</p>
                    <div className="text-xs text-muted-foreground italic">
                        <span>{Object.keys(list.entries).filter(e => list.entries[e].checked).length} / {Object.keys(list.entries).length} items checked</span>
                    </div>
                </Link>
            </div>

            <Dialog open={showInfo} onOpenChange={setShowInfo}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Shopping List Info</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        <strong>Name:</strong> {list.name} <br />
                        <strong>Description:</strong> {list.description} <br />
                        <strong>Address:</strong> {list.address.street}, {list.address.city}, {list.address.country}, {list.address.postcode}
                    </DialogDescription>
                    <DialogFooter>
                        <Button onClick={() => setShowInfo(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showDelete} onOpenChange={setShowDelete}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        This action will permanently delete your shopping list,
                    </DialogDescription>
                    <DialogFooter>
                        <Button variant={'outline'} onClick={() => setShowDelete(false)}>Cancel</Button>
                        <Button onClick={async () => { await deleteList(list._id) }}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit {editField}</DialogTitle>
                    </DialogHeader>
                    <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                    <DialogFooter>
                        <Button onClick={() => {
                            setIsEditing(false);
                            updateList({ ...list, [`${editField}`]: editValue })
                        }}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

interface Address {
    label: string;
    value: string;
    details: AddressDetails
}

export function NewShoppingListButton() {
    const [dialogOpen, setDialogOpen] = useState(false)

    const [isTemplate, setIsTemplate] = useState(false)
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [addressQuery, setAddressQuery] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [street, setStreet] = useState<string>('');
    const [postcode, setPostcode] = useState<string>('');
    const [suggestions, setSuggestions] = useState<Address[]>([]);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const fetchAddressSuggestions = async () => {
        let query = addressQuery;
        if (country) query += `, ${country}`;
        if (city) query += `, ${city}`;
        if (street) query += `, ${street}`;
        if (postcode) query += `, ${postcode}`;

        if (!query) {
            setSuggestions([]);
            return;
        }

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&extratags=1`
        );
        const data = await response.json();
        setSuggestions(data.map((item: typeof data) => ({
            label: item.display_name,
            value: item.display_name,
            details: {
                country: item.address.country,
                city: item.address.city || item.address.town || item.address.village,
                street: item.address.road,
                postcode: item.address.postcode,
            }
        })));
    };

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddressQuery(e.target.value);
        if (timeoutId) clearTimeout(timeoutId);
        const newTimeoutId = setTimeout(fetchAddressSuggestions, 1000);
        setTimeoutId(newTimeoutId);
    };

    const handleAddressSelect = (address: Address) => {
        setCountry(address.details.country || '');
        setCity(address.details.city || '');
        setStreet(address.details.street || '');
        setPostcode(address.details.postcode || '');
        setAddressQuery(address.value);
        setSuggestions([]);
    };

    const clearFields = () => {
        setName('');
        setDescription('');
        setCountry('');
        setCity('');
        setStreet('');
        setPostcode('');
        setAddressQuery('');
        setSuggestions([]);
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <div
                    className={cn(
                        'relative popover-bg p-10 border-2 border rounded-lg shadow-md transition-all duration-300',
                        'hover:scale-105 hover:bg-accent h-40 w-40'
                    )}
                >
                    <PlusIcon size={'auto'} className='text-muted-foreground hover:text-foreground transition-all duration-300' />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[40em] sm:max-h-[30em] overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle>Add a new shopping list</DialogTitle>
                    <DialogDescription>
                        Enter your shopping list name, description, and optional address details
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Groceries" required value={name} onChange={(e) => setName(e.target.value)} />
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" placeholder='Foods with a load of protein' required value={description} onChange={(e) => setDescription(e.target.value)} />
                    <Label htmlFor="addressQuery">Search Address</Label>
                    <div className="relative">
                        <Input disabled={isTemplate} id="addressQuery" placeholder="Search Address" value={addressQuery} onChange={handleQueryChange} />
                        {!isTemplate && suggestions.length > 0 && (
                            <ul className="absolute bg-popover text-foreground border w-full mt-1 rounded-md shadow-md max-h-40 overflow-auto z-10">
                                {suggestions.map((s, index) => (
                                    <li key={index} className="p-2 hover:bg-secondary cursor-pointer" onClick={() => handleAddressSelect(s)}>
                                        {s.label}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <Label htmlFor="country">Country</Label>
                    <Input disabled={isTemplate} id="country" placeholder="Austria" value={country} onChange={(e) => setCountry(e.target.value)} />
                    <Label htmlFor="city">City</Label>
                    <Input disabled={isTemplate} id="city" placeholder="Vienna" value={city} onChange={(e) => setCity(e.target.value)} />
                    <Label htmlFor="street">Street Address</Label>
                    <Input disabled={isTemplate} id="street" placeholder="Wexstraße 29" value={street} onChange={(e) => setStreet(e.target.value)} />
                    <Label htmlFor="postcode">Postal Code</Label>
                    <Input disabled={isTemplate} id="postcode" placeholder="1200" value={postcode} onChange={(e) => setPostcode(e.target.value)} />
                </div>
                <DialogFooter className='flex flex-row grow items-center'>
                    <Label htmlFor="template">Is a template</Label>
                    <Switch id='template' checked={isTemplate} onCheckedChange={(e) => setIsTemplate(e)} />
                    <div className='flex-1' />
                    <Button onClick={clearFields} variant={'outline'}>Clear</Button>
                    <Button type="submit" onClick={(event) => {
                        event.preventDefault()
                        addList(name, description, { country, city, street, postcode }, isTemplate)
                        setDialogOpen(false)
                    }}>Add</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}