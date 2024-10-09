import React from 'react'
import { Item, useItemStore } from "./data-store"

const Data: React.FC = () => {
    const { items, loading, error } = useItemStore()
    const { getDataList, sendData } = useItemStore()

    let renderItems: Item[] = []
    items.forEach((data, id) => {
        const item: Item = { id, ...data }
        renderItems.push(item)
    })
    let selectedId: Number

    return (
        <div>
            <ul>
                {renderItems.map((value, index) => {
                    return (
                        <li key={index.toString()}>
                            <p>id: {index.toString()}</p>
                            <p>count: {value.count.toString()}</p>
                            <p>explanation: {value.explanation}</p>
                        </li>
                    )
                })}
                <button onClick={() => getDataList()}>get latest data</button>
            </ul>

            <label>
                Choose id of sending data. 
                <select name="selectedId" onChange={e => selectedId = Number(e.target.value)}>
                    {renderItems.map((_, index) => {
                        return (
                            <option key={index.toString()} value={index}>index</option>
                        )
                    })}
                </select>
            </label>
            <button onClick={() => sendData(selectedId)}>send data</button>
        </div>
    )
}
export default Data;