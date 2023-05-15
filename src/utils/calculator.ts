import { evaluate } from 'mathjs';

export type DataMatrix = (string | number)[][];

export const isAttemptingFormula = (value: string) => {
  return value.trim().startsWith('=');
};

export const calculateForCell = (data: DataMatrix, formula: string) => {
  if (!isValidFormula(formula, true)) {
    return '#NON_VALID_FORMULA';
  }
  const parsedFormula = parseCells(formula, data);
  return evaluate(parsedFormula);
};

const parseCells = (formula: string, data: DataMatrix) => {
  const cells: string[] = formula.match(/[A-Z]\d+/g) || [];
  const values = cells.map((cell) => {
    return getCellValue(data, cell);
  });
  const parsedFormula = cells.reduce((acc, curr, i) => {
    return acc.replace(curr, values[i].toString());
  }, formula);
  return parsedFormula;
};

const getCellValue = (data: DataMatrix, cell: string) => {
  const { column, row } = cellToIndex(cell);
  return parseFloat(data[column][row].toString());
};

const cellToIndex = (cell: string) => {
  const [column, row] = cell.split('');
  return {
    column: column.charCodeAt(0) - 65,
    row: parseInt(row) - 1,
  };
};

export const calculateForColumn = (
  data: DataMatrix,
  formula: string,
  row: number,
) => {
  if (!isValidFormula(formula)) {
    return '#NON_VALID_FORMULA';
  }
  const parsed1 = parseCells(formula, data);
  const parsed2 = parseColumns(parsed1, data, row);
  return evaluate(parsed2);
};

const parseColumns = (
  formula: string,
  data: DataMatrix,
  row: number,
) => {
  const columns: string[] = formula.match(/[A-Z]/g) || [];
  return columns.reduce((acc, curr) => {
    return acc.replace(curr, data[columnToIndex(curr)][row].toString());
  }, formula);
};

const columnToIndex = (column: string) => {
  return column.charCodeAt(0) - 65;
};

const isValidFormula = (formula: string, isForCell = false) => {
  const operators = '[+\\-*\\/]';
  const columns = '[A-Z]';
  const cells = '[A-Z]\\d+';
  const numbers = '\\d+';
  // Columns are not allowed in cell formulas
  const operands = isForCell
    ? `(${cells}|${numbers})`
    : `(${columns}|${cells}|${numbers})`;
  const exp = new RegExp(
    `^\\s*(${operands})\\s*(${operators}\\s*(${operands})\\s*)*\\s*$`,
  );
  return formula.match(exp);
};
