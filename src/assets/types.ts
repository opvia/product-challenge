export type Operator = "+" | "-" | "*" | "/";

export interface ParsedExpressionResult {
  operator: Operator;
  colA: string;
  colB: string;
}

export interface ExpressionEvent {
  newColumnName: string;
  parseResult: ParsedExpressionResult;
}
