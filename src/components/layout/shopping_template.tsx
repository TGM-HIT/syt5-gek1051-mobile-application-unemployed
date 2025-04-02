import { cn } from '@/lib/utils';
import { Ellipsis } from 'lucide-react';
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
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import { deleteList, updateList } from '@/lib/list_db';
import { List } from '@/types/shoppinglist';

export function ShoppingTemplateButton({ template }: { template: List }) {
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
                    <h2 className="font-semibold text-lg overflow-hidden text-ellipsis justify-self-left grow">{template.name || <i>No name</i>}</h2>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Ellipsis className='text-muted-foreground hover:text-foreground transition-all duration-300' />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Manage {template.name}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setShowInfo(true)}>Display info</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setIsEditing(true); setEditField('name'); setEditValue(template.name); }}>Edit name</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setIsEditing(true); setEditField('description'); setEditValue(template.description); }}>Edit description</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setShowDelete(true)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Link href={`/list/${template._id}`}>
                    <p className="text-sm text-muted-foreground overflow-hidden text-ellipsis">{template.description || <i>No description</i>}</p>
                    <p className="text-xs text-muted-foreground italic">
                        Template
                    </p>
                </Link>
            </div>

            <Dialog open={showInfo} onOpenChange={setShowInfo}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Shopping List Info</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        <strong>Name:</strong> {template.name} <br />
                        <strong>Description:</strong> {template.description} <br />
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
                        <Button onClick={async () => { await deleteList(template._id) }}>Delete</Button>
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
                            updateList({ ...template, [`${editField}`]: editValue })
                        }}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
