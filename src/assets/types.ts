export const operators = ["add", "subtract", "multiply", "divide"] as const;
export type Operator = typeof operators[number];
