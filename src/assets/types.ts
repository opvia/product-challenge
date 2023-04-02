import { type Operator } from '../utils/math.utils'
export interface ParsedExpressionResult {
  operator: Operator
  colA: string
  colB: string
}

export interface ExpressionEvent {
  newColumnName: string
  parseResult?: ParsedExpressionResult
}
