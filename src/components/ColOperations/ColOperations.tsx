import React, { useState, type ReactElement } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { evaluateExpression, mathExpressionParser, operators, type ParsedExpressionResult } from '../../utils/math.utils'
import { columnData, columnNamesAsVariables } from '../../atoms/tableData'
import Tags from '../Tags/Tags'
import useTableDataHelpers from '../../atoms/tableDataHelpers'
import './ColOperations.styles.scss'

const ColOperations = (): ReactElement => {
  const [, setExpression] = useState<string>('')
  const [parsedExpression, setParsedExpression] = useState<ParsedExpressionResult | null>(null)
  const [newColumnName, setColumnName] = useState<string>('')

  const columnVariableNames = useRecoilValue(columnNamesAsVariables)
  const [columns] = useRecoilState(columnData)

  const { createSparseCellData, getSparseDataBasedOnColumnName } = useTableDataHelpers()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setExpression(e.target.value.trim())
    const result = mathExpressionParser(e.target.value)
    if (result === null) return
    const { colA, colB, operator } = result
    if (colA !== '' && colB !== '') {
      setParsedExpression({ operator, colA, colB })
    }
  }

  const handleNewColumnName = (e: React.ChangeEvent<HTMLInputElement>): void => { setColumnName(e.target.value) }

  const handleExpressionParse = (): void => {
    if (parsedExpression === null) return
    const { colA, colB, operator } = parsedExpression

    const columnNameExists = columns.find((c) => c.columnId === newColumnName.toLowerCase().replaceAll(' ', '_'))
    if (columnNameExists != null) {
      alert('Column name already exists')
      return
    }

    const colAData = getSparseDataBasedOnColumnName(colA)
    const colBData = getSparseDataBasedOnColumnName(colB)

    const res = evaluateExpression(colAData, colBData, operator)
    createSparseCellData(res, newColumnName)
  }

  return (
        <div className="col-operations-container">
            <h2>Column Operations</h2>
            <p>Use variable names and operators to create new columns</p>
            <div className="card">
                <h3>Operators</h3>
                <Tags tags={operators.map((o) => o)} />
            </div>
            <div className="card">
                <h3>Variable names</h3>
                <Tags tags={columnVariableNames} />
            </div>

            <div className="form-container">
                <div className="row">
                    <label htmlFor="expression"><h4>Expression</h4></label>
                    <input type="text" name="expression" id="expression" onInput={handleInputChange} placeholder="cell_density * volume" />
                </div>
                <div className="row">
                    <label htmlFor="newColumnName"><h4>New Column Name</h4></label>
                    <input type="text" required onInput={handleNewColumnName} placeholder="Cell Count" />
                </div>
                <div className="row">
                    <button onClick={handleExpressionParse}>Go</button>
                </div>
            </div>
        </div>
  )
}

export default ColOperations
