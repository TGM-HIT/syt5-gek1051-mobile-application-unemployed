import { cn } from '@/lib/utils'; // Assuming 'cn' is imported from shadcn's utils for conditional classnames
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


export function ShoppingListButton({ id, name, itemsChecked }: { id: number, name: string, itemsChecked: string }) {
    return (
        <div
            className={cn(
                'relative popover-bg p-4 border-2 border rounded-lg shadow-md transition-all duration-300',
                'hover:scale-105 hover:bg-accent h-40 w-40'
            )}
        >
            <div className="flex flex-col space-y-2">
                <div className='flex flex-row'>
                    <h2 className="font-semibold text-lg overflow-hidden text-ellipsis justify-self-left grow">{name}</h2>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Ellipsis className='text-muted-foreground hover:text-foreground transition-all duration-300' />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Manage {name}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Edit name</DropdownMenuItem>
                            <DropdownMenuItem>Edit description</DropdownMenuItem>
                            <DropdownMenuItem>Export PDF</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <Link href={`/list/${id}`}>
                    <p className="text-sm text-muted-foreground overflow-hidden text-ellipsis">{"This is a todo list"}</p>
                    <div className="text-xs text-muted-foreground italic">
                        <span>{itemsChecked} items checked</span>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export function NewShoppingListButton() {
    return (
        <Dialog>
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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add a new shopping list</DialogTitle>
                    <DialogDescription>
                        Enter your shopping list name and description
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name" placeholder="Groceries" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Input id="description" placeholder='Foods with a load of protein' className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Add</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
