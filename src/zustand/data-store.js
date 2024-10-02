import { create } from "zustand"
// eslint-disable-next-line
import { shallow } from 'zustand/shallow'

const useStore = create((set, get) => ({
    items: new Map(),
    loading: false, // 制御用変数
    error  : null , // 制御用変数
 
    getData: async (id) => {
        console.log("[zustand] call getData()")
        set({ loading: true})
        try {
            const response = await fetch(`https://xxx.xxx/xxx?id=${id}`)
            const data = await response.json()
            delete data.id
            set({ items: get().items.set(id, data), loading: false })
        } catch (error) {
            set({ error: error, loading: false })
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
        } catch (error) {
            set({ error: error, loading: false })
        }
    },
    sendData: async (id) => {
        console.log("[zustand] call sendData()")
        set({ loading: true})
        try {
            const data = get().items.get(id)
            data.id = id
            const response = await fetch(`https://xxx.xxx/xxx?id=${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })
            if (!response.ok) {
                const data = await response.json()
                throw new Error(`${response.status}, ${data}`)
            }
            set({ loading: false })
        } catch (error) {
            set({ error: error, loading: false })
        }
    },
    clearStore: () => {
        console.log("[zustand] call clear()")
        set({ items: get().items.clear(), loading: false, error: null })
    }
}))

export default function Data() {
    // eslint-disable-next-line
    // const { items, _1, _2, getData, getDataList, sendData, _3 } = useStore((state) => ({
    //     items      : state.items,
    //     _1         : state.loading,
    //     _2         : state.error,
    //     getData    : state.getData,
    //     getDataList: state.getDataList,
    //     sendData   : state.sendData,
    //     _3         : state.clearStore
    // }), shallow)

    // eslint-disable-next-line
    const { items, _1, _2, getData, getDataList, sendData, _3 } = useStore()

    let renderItems = []
    items.forEach((data, id) => {
        renderItems.push(<li>{id}: {data}</li>)
    })

    return (
        <div>
            <ul>{renderItems}</ul>
            <button onClick={() => getDataList()}>get latest data</button>
            <button onClick={() => sendData()}>send data</button>
        </div>
    )
}