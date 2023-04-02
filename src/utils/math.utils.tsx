import { type ParsedExpressionResult } from '../assets/types'

export const operators = ['+', '-', '*', '/'] as const
export type Operator = typeof operators[number]

export const getOperationFunction = (
  operator: Operator
): (a: number, b: number) => number => {
  switch (operator) {
    case '+':
      return (a, b) => a + b
    case '-':
      return (a, b) => a - b
    case '*':
      return (a, b) => a * b
    case '/':
      return (a, b) => a / b
    default:
      throw new Error(`Unsupported operator: ${'undefined'}`)
  }
}

export const evaluateExpression = (
  a: number[],
  b: number[],
  operator: Operator
): number[] => {
  const operationFunc = getOperationFunction(operator)
  return a.map((value, index) => operationFunc(value, b[index]))
}

export const mathExpressionParser = (expression: string): ParsedExpressionResult | null => {
  if (typeof expression !== 'string') return null

  const operatorRegex = /[+\-*/]/
  const tokens = expression.split(operatorRegex)
  const operator = expression.match(operatorRegex)?.[0]

  if (operator === undefined || tokens.length !== 2) return null

  return {
    operator: operator as Operator,
    colA: tokens[0].trim(),
    colB: tokens[1].trim()
  }
}
