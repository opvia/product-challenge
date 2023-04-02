import { useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil";

import { ParsedExpressionResult } from "../../assets/types";
import { evaluateExpression, mathExpressionParser, operators } from "../../utils/math.utils";
import { columnData, columnNamesAsVariables, } from "../../atoms/tableData";
import Tags from "../Tags/Tags";
import useTableDataHelpers from "../../atoms/tableDataHelpers";

import './ColOperations.scss'

const ColOperations = () => {

    const [expression, setExpression] = useState<string>('')
    const [parsedExpression, setParsedExpression] = useState<ParsedExpressionResult | null>(null)
    const [newColumnName, setColumnName] = useState<string>('')

    const columnVariableNames = useRecoilValue(columnNamesAsVariables)
    const [columns, setColumns] = useRecoilState(columnData)

    const { createSparseCellData, getSparseDataBasedOnColumnName } = useTableDataHelpers()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExpression(e.target.value.trim())
        const { operator, colA, colB } = mathExpressionParser(e.target.value);
        if (operator && colA && colB) {
            setParsedExpression({ operator, colA, colB })
        }
    }

    const handleNewColumnName = (e: React.ChangeEvent<HTMLInputElement>) => setColumnName(e.target.value)

    const handleExpressionParse = () => {
        if (parsedExpression === null) return;
        const { colA, colB, operator } = parsedExpression

        const columnNameExists = columns.find((c) => c.columnId === newColumnName.toLowerCase().replaceAll(" ", "_"))
        if (columnNameExists) {
            alert("Column name already exists")
            return;
        }

        const colAData = getSparseDataBasedOnColumnName(colA)
        const colBData = getSparseDataBasedOnColumnName(colB)

        const res = evaluateExpression(colAData, colBData, operator)
        createSparseCellData(res, newColumnName)
    }


    return (
        <div className="expression-container">
            <h2>Column Operations</h2>
            <p>Use variable names and operators to create new columns</p>
            <div className="operators-container card">
                <h3>Operators</h3>
                <Tags tags={operators.map((o) => o)} />
            </div>
            <div className="variables-container card">
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