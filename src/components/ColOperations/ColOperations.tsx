import { ParsedExpressionResult } from "../../assets/types";
import { evaluateExpression, Operator, operators } from "../../utils/math.utils";
import { useState } from "react"
import './ColOperations.scss'
import { useRecoilState, useRecoilValue } from "recoil";
import { ColumnData, columnData, columnNamesAsVariables, getLargestRowLength, getSparseRefFromIndexes, tableData } from "../../atoms/tableData";
import Tags from "../Tags/Tags";

const ColOperations = () => {

    const [expression, setExpression] = useState<string>('')
    const [parsedExpression, setParsedExpression] = useState<ParsedExpressionResult | null>(null)
    const [newColumnName, setColumnName] = useState<string>('')

    const largestRowLength = useRecoilValue(getLargestRowLength)
    const columnVariableNames = useRecoilValue(columnNamesAsVariables)
    const [columns, setColumns] = useRecoilState(columnData)
    const [sparseCellData, setSparseCellData] = useRecoilState(tableData)


    function parseExpression(expression: string): ParsedExpressionResult {
        const operatorRegex = /[\+\-\*\/]/;
        const tokens = expression.split(operatorRegex);
        const operator = expression.match(operatorRegex)?.[0] || ""

        if (tokens.length !== 2 || !operator) {
            return {} as ParsedExpressionResult
        }
        return {
            operator: operator as Operator,
            colA: tokens[0].trim(),
            colB: tokens[1].trim(),
        };
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExpression(e.target.value)
        const { operator, colA, colB } = parseExpression(e.target.value);
        if (operator && colA && colB) {
            setParsedExpression({ operator, colA, colB })
        }
    }

    const handleNewColumnName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setColumnName(e.target.value)
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