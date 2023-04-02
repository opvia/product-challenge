import React, { type ReactElement, useState } from 'react'
import { useRecoilState } from 'recoil'

import { columnData } from '../../atoms/tableData'
import useTableDataHelpers from '../../atoms/tableDataHelpers'

import './RowOperations.styles.scss'

const RowOperations = (): ReactElement => {
  const [newColumnName, setNewColumnName] = useState<string>('Rate')
  const [colA, setColA] = useState<string>('time')
  const [colB, setColB] = useState<string>('cell_density')
  const [columns] = useRecoilState(columnData)

  const { createSparseCellData, getSparseDataBasedOnColumnName } = useTableDataHelpers()

  const timeBasedColumns = columns.filter((c) => c.columnType === 'time')
  const dataBasedColumns = columns.filter((c) => c.columnType === 'data')

  const handleNewColName = (e: React.ChangeEvent<HTMLInputElement>): void => { setNewColumnName(e.target.value) }
  const handleSelectColA = (e: React.ChangeEvent<HTMLSelectElement>): void => { setColA(e.target.value) }
  const handleSelectColB = (e: React.ChangeEvent<HTMLSelectElement>): void => { setColB(e.target.value) }

  const handleGenerate = (): void => {
    const colAData = getSparseDataBasedOnColumnName(colA).map((d) => new Date(d).getTime())
    const colBData = getSparseDataBasedOnColumnName(colB)

    const calculation = colBData.map((d, i) => {
      if (i === 0) return 0
      const rateOfChange = (d - colBData[i - 1]) / ((colAData[i] - colAData[i - 1]) * 1000)
      return rateOfChange
    })
    createSparseCellData(calculation, newColumnName)
  }

  return (
        <div className="formula-container">

            <h2>Row Operations</h2>
            <p>Use pre-defined formulas</p>
            <div className="form-container">
                <div className="row">
                    <label htmlFor="newcolumnname"><h4>New Column Name</h4></label>
                    <input name="newcolumnname" type="text" required placeholder="Rate" value={newColumnName} onChange={handleNewColName} />
                </div>
                <div className="row">
                    <label><h4>Formula</h4></label>
                    <button>
                        <span className="formula-name">Rate of change</span>
                        <span className="formula-expression">(B[i] - B[i-1]) / ((A[i] - A[i-1]) * 1000)</span>
                    </button>
                </div>
                <div className="row">
                    <label htmlFor="colA"><h4>A</h4></label>
                    <select name="colA" id="" onInput={handleSelectColA} required defaultValue={timeBasedColumns[0].columnId}>
                        {timeBasedColumns.map((c) => <option key={c.columnId} value={c.columnId}>{c.columnName}</option>)}
                    </select>
                </div>
                <div className="row">
                    <label htmlFor="colB"><h4>B</h4></label>
                    <select name="colB" id="" onInput={handleSelectColB} required>
                        {dataBasedColumns.map((c) => <option key={c.columnId} value={c.columnId}>{c.columnName}</option>)}
                    </select>
                </div>
                <div className="row">
                    <label htmlFor="generate"><h4> </h4></label>
                    <button onClick={handleGenerate}>
                        Generate
                    </button>
                </div>
            </div>
        </div>
  )
}

export default RowOperations
