import { ExpressionEvent, Operator, ParsedExpressionResult } from "@/assets/types";
import { evaluateExpression } from "../../utils/math.utils";
import { useState } from "react"
import './Expression.scss'
import { useRecoilState, useRecoilValue } from "recoil";
import { columnData, columnNamesAsVariables, getSparseRefFromIndexes, tableData } from "../../atoms/tableData";

const Expression = () => {

    const [expression, setExpression] = useState<string>('')
    const [parsedExpression, setParsedExpression] = useState<ParsedExpressionResult>({ operator: '+', colA: '', colB: '' })
    const [newColumnName, setColumnName] = useState<string>('')

    const columnVariableNames = useRecoilValue(columnNamesAsVariables)
    const [columns, setColumns] = useRecoilState(columnData)
    const [sparseCellData, setSparseCellData] = useRecoilState(tableData)


    function parseExpression(expression: string): ParsedExpressionResult {
        const operatorRegex = /[\+\-\*\/]/;
        const tokens = expression.split(operatorRegex);
        const operator = expression.match(operatorRegex)?.[0] || "+" as Operator

        if (tokens.length !== 2 || !operator) {
            return {
                operator: '+' as Operator,
                colA: '',
                colB: '',
            }
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
        console.log(columns)
        const columnIndex = columns.findIndex((c) => c.columnId === columnName);
        if (!columnIndex) return [];

        const values: Array<number | string> = []
        for (let i = 0; i < 8; i++) {
            values.push(sparseCellData[`${columnIndex}-${i}`])
        }
        return values;
    }

    const handleExpressionParse = () => {
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
            <div className="col">
                <h2>Input expression</h2>
                <p>variables that can be used are the column name in the table as all lowercase and with spaces as underscores. for example</p>
                <p>Cell Denisty becomes cell_density as a variable name</p>
                <p>operators: - + / *</p>
            </div>
            <div className="col">
                <div className="variables-container">
                    <h3>Variable names</h3>
                    <ul className="tags">
                        {columnVariableNames.map((name) => <li key={name}> <span className="tag" >{name}</span></li>)}
                    </ul>
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
        </div>
    )

}

export default Expression