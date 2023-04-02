import { useRecoilState, useRecoilValue } from "recoil";
import { ColumnData, columnData, getLargestRowLength, getSparseRefFromIndexes, tableData } from "./tableData";

const useTableDataHelpers = () => {
    const [columns, setColumns] = useRecoilState(columnData)
    const [sparseCellData, setSparseCellData] = useRecoilState(tableData)
    const largestRowLength = useRecoilValue(getLargestRowLength)

    const createSparseCellData = (arr: number[], newColumnName: string) => {
        const newSparseCellData = { ...sparseCellData };
        const largestIndex = columns.length

        for (let i = 0; i < arr.length; i++) {
            newSparseCellData[getSparseRefFromIndexes(i, largestIndex)] = arr[i];
        }
        setSparseCellData(newSparseCellData)
        const newColData = { columnName: newColumnName, columnType: "data", columnId: newColumnName.toLowerCase().replaceAll(" ", "_") } as ColumnData
        setColumns([...columns, newColData])
    }

    const getSparseDataBasedOnColumnName = (columnName: string) => {
        const columnIndex = columns.findIndex((c) => c.columnId === columnName);
        if (columnIndex < 0) return [];

        const values: Array<number> = []
        for (let i = 0; i < largestRowLength; i++) {
            let v = sparseCellData[`${columnIndex}-${i}`]
            if (typeof v === 'string') v = new Date(v).getTime()
            values.push(v)
        }
        return values;
    }

    return { createSparseCellData, getSparseDataBasedOnColumnName };
}

export default useTableDataHelpers