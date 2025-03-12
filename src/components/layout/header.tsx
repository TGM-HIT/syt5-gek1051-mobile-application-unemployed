"use client"

import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import { Label } from "@/components/ui/label"

function ModeToggle() {
    const { setTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function SearchFunction() {
    return (
        <div className="relative">
            <div className="absolute left-1 top-1 h-1 w-1 text-muted-foreground">
                <SearchIcon />
            </div>
            <Input
                type="search"
                placeholder="Search..."
                className="w-full bg-background pl-8 pr-12 focus:outline-none focus:ring-1 focus:ring-primary md:w-[200px] lg:w-[300px]"
            />
        </div>

    )
}

export function SyncDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Sync</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Synchronize with a database</DialogTitle>
                    <DialogDescription>
                        Enter your CouchDB credentials to sync your shopping lists!
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="url" className="text-right">
                            URL
                        </Label>
                        <Input id="url" placeholder="http://localhost:1234/db" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                            Password
                        </Label>
                        <Input id="password" type="password" className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Synchronize</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function Header() {
    return (
        <div className="flex flex-row place-content-between grow flex-wrap items-center p-2">
            <h1 className="font-semibold italic">Unemployed Shopping</h1>
            <div>
                <SearchFunction />
            </div>
            <div className="flex flex-row space-x-2">
                <SyncDialog />
                <ModeToggle />
            </div>
        </div>
    )
}
