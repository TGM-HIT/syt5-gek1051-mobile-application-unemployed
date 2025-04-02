export interface BaseType {
    _id: string
    type: string
}

export interface Address {
    country?: string;
    city?: string;
    street?: string;
    postcode?: string;
}

export interface ListEntry {
    id: string
    name: string
    description: string
    category: string
    editor: string
    amount: number
    checked: boolean
    createdAt: Date
    updatedAt: Date
    pinned: boolean
}

export interface List extends BaseType {
    name: string
    description: string
    address: Address
    entries: {
        [id: string]: ListEntry
    }
}
