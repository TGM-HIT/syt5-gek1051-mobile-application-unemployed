## Full-Text Search for Items – SH ID6

### Status  
Implementiert

### User Story  
**ID 06**  
Als Benutzer möchte ich per Suchleiste nach einem Artikel per Volltextsuche suchen können, damit bei großen Listen Artikel schneller gefunden werden.  
**Story Points:** 2  
**Verantwortlich:** Gioia Frolik  
**Kategorie:** SH

---

## Technische Umsetzung

### Suchfunktion [nach Artikeln] innerhalb einer geöffneten Einkaufsliste über Volltext
`syt5-gek1051-mobile-application-unemployed/src/app/list/[...slug]/page.tsx`

#### Funktion  
```tsx
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
```

---

### Suche nach kompletten Einkaufslisten
`syt5-gek1051-mobile-application-unemployed/src/app/page.tsx`

#### Funktion  
```tsx
const [searchTerm, setSearchTerm] = useState<string>("");

const filteredLists = shoppingLists.filter((list) =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase())
);
```
---

## Technologie  
Die Implementierung basiert auf Next.js (React) und ersetzt die vorherige Vue2-Lösung.
