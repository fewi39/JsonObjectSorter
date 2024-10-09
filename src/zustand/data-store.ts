import { create } from "zustand"

export interface Item extends Information {
    id: Number
}
export interface Information {
    count      : Number
    explanation: String
}
export interface ItemStore {
    items  : Map<Number, Information>
    loading: Boolean       // 制御用変数
    error  : Error | null  // 制御用変数

    getData    : (id: Number) => void
    getDataList: (          ) => void
    sendData   : (id: Number) => void
    clearStore : (          ) => void
}

export const useItemStore = create<ItemStore>((set, get) => ({
    items  : new Map(),
    loading: false,  // 制御用変数
    error  : null,   // 制御用変数
 
    getData: async (id: Number) => {
        console.log("[zustand] call getData()")
        set({ loading: true})
        try {
            const response = await fetch(`https://xxx.xxx/xxx?id=${id}`)
            const data = await response.json()
            delete data.id
            set({ items: get().items.set(id, data), loading: false })
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
                set({ error: error, loading: false })
            }
        }
    },

    getDataList: async () => {
        console.log("[zustand] call getDataList()")
        set({ loading: true})
        try {
            const response = await fetch('https://xxx.xxx/xxx')
            const dataList = await response.json()
            set({ items: new Map() })
            for (const data of dataList) {
                const id = data.id
                delete data.id
                set({ items: get().items.set(id, data) })
            }
            set({ loading: false })
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
                set({ error: error, loading: false })
            }
        }
    },

    sendData: async (id: Number) => {
        console.log("[zustand] call sendData()")
        set({ loading: true})
        try {
            const information = get().items.get(id)
            const response = await fetch(`https://xxx.xxx/xxx?id=${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(information)
            })
            if (!response.ok) {
                const data = await response.json()
                throw new Error(`${response.status}, ${data}`)
            }
            set({ loading: false })
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
                set({ error: error, loading: false })
            }
        }
    },

    clearStore: () => {
        console.log("[zustand] call clear()")
        get().items.clear()
        set({ error: null, loading: false })
    }
}))