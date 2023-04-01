import { ExpressionEvent, Operator, ParsedExpressionResult } from "@/assets/types";
import { useExperimentData } from "../../contexts/experimentData";
import { evaluateExpression } from "../../utils/math.utils";
import { useState } from "react"
import './Expression.scss'
import { useRecoilValue } from "recoil";
import { columnNamesAsVariables } from "../../atoms/tableData";

interface ExpressionProps {
    onHandleParsedExpression: (result: [], newColumnName: string) => void
}

const Expression = ({ onHandleParsedExpression }: ExpressionProps) => {

    const { getSparseDataBasedOnColumnName, columnVariableNames } = useExperimentData();
    const [expression, setExpression] = useState<string>('')
    const [parsedExpression, setParsedExpression] = useState<ParsedExpressionResult>({ operator: '+', colA: '', colB: '' })
    const [columnName, setColumnName] = useState<string>('')

    const names = useRecoilValue(columnNamesAsVariables)
    console.log(names)


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

    const handleExpressionParse = () => {
        const { colA, colB, operator } = parsedExpression

        const colAData = getSparseDataBasedOnColumnName(colA)
        const colBData = getSparseDataBasedOnColumnName(colB)

        const res = evaluateExpression(colAData, colBData, operator)
        onHandleParsedExpression(res, columnName)
    }

    return (
        <div class="expression-container">
            <div className="col">
                <h2>Input expression</h2>
                <p>variables that can be used are the column name in the table as all lowercase and with spaces as underscores. for example</p>
                <p>Cell Denisty becomes cell_density as a variable name</p>
                <p>operators: - + / *</p>
            </div>
            <div class="col">
                <div className="variables-container">
                    <h3>Variable names</h3>
                    <ul className="tags">
                        {columnVariableNames.map((name) => <li key={name}> <span className="tag" >{name}</span></li>)}
                    </ul>
                </div>

                <div className="form-container">
                    <input type="text" name="expression" id="expression" onInput={handleInputChange} placeholder="cell_density * volume" />
                    <input type="text" required onInput={handleNewColumnName} placeholder="Cell Count" />
                    <button onClick={handleExpressionParse}>Go</button>
                </div>
            </div>
        </div>
    )

}

export default Expression