import { Operator } from "@/assets/types";

export const getOperationFunction = (
    operator: Operator
): (a: number, b: number) => number => {
    switch (operator) {
        case "+":
            return (a, b) => a + b;
        case "-":
            return (a, b) => a - b;
        case "*":
            return (a, b) => a * b;
        case "/":
            return (a, b) => a / b;
        default:
            throw new Error(`Unsupported operator: ${operator}`);
    }
}

export const evaluateExpression = (
    a: number[],
    b: number[],
    operator: Operator
): number[] => {
    const operationFunc = getOperationFunction(operator);
    return a.map((value, index) => operationFunc(value, b[index]));
}