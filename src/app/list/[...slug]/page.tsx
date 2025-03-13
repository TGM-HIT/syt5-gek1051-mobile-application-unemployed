"use client"

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react"

function SearchFunction() {
    return (
        <div className="relative">
            <div className="absolute left-2 top-2 text-muted-foreground">
                <SearchIcon size={20} />
            </div>
            <Input
                type="search"
                placeholder="Search..."
                className="w-full bg-background pl-8 pr-12 focus:outline-none focus:ring-1 focus:ring-primary md:w-[200px] lg:w-[300px]"
            />
        </div>

    )
}

export default function List({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const [slugValue, setSlugValue] = useState<string | undefined>(undefined);

    useEffect(() => {
        params.then(v => setSlugValue(v.slug))
    }, [setSlugValue, params])

    return <h1>{slugValue}</h1>
}
