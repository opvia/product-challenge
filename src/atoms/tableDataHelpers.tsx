import { useRecoilState, useRecoilValue } from 'recoil'
import { type ColumnData, columnData, getLargestRowLength, getSparseRefFromIndexes, tableData } from './tableData'

interface UseTableDataHelpersReturn {
  createSparseCellData: (arr: number[], newColumnName: string) => void
  getSparseDataBasedOnColumnName: (columnName: string) => number[]
}

const useTableDataHelpers = (): UseTableDataHelpersReturn => {
  const [columns, setColumns] = useRecoilState(columnData)
  const [sparseCellData, setSparseCellData] = useRecoilState(tableData)
  const largestRowLength = useRecoilValue(getLargestRowLength)

  const createSparseCellData = (arr: number[], newColumnName: string): void => {
    const newSparseCellData = { ...sparseCellData }
    const largestIndex = columns.length

    for (let i = 0; i < arr.length; i++) {
      newSparseCellData[getSparseRefFromIndexes(i, largestIndex)] = arr[i]
    }
    setSparseCellData(newSparseCellData)
    const newColData: ColumnData = { columnName: newColumnName, columnType: 'data', columnId: newColumnName.toLowerCase().replaceAll(' ', '_') }
    setColumns([...columns, newColData])
  }

  const getSparseDataBasedOnColumnName = (columnName: string): number[] => {
    const columnIndex = columns.findIndex((c) => c.columnId === columnName)
    if (columnIndex < 0) return []

    const values: number[] = []
    for (let i = 0; i < largestRowLength; i++) {
      let v = sparseCellData[`${columnIndex}-${i}`]
      if (typeof v === 'string') v = new Date(v).getTime()
      values.push(v)
    }
    return values
  }

  return { createSparseCellData, getSparseDataBasedOnColumnName }
}

export default useTableDataHelpers
