import { evaluate } from 'mathjs';

export type DataMatrix = (string | number)[][];

export const isAttemptingFormula = (value: string) => {
  return value.trim().startsWith('=');
};

export const calculateForCell = (data: DataMatrix, formula: string) => {
  if (!isValidFormulaForCell(formula)) {
    return '#NON_VALID_FORMULA';
  }
  const cells: string[] = formula.match(/[A-Z]\d+/g) || [];
  const operators = getOperators(formula);
  if (operators.length === 0) {
    return getCellValue(data, cells[0]);
  }
  const values = cells.map((cell) => {
    return getCellValue(data, cell);
  });
  const parsedFormula = cells.reduce((acc, curr, i) => {
    return acc.replace(curr, values[i].toString());
  }, formula);
  return evaluate(parsedFormula);
};

const getOperators = (formula: string) => {
  return formula.match(/[+\-*/]/g) || [];
};

const getCellValue = (data: DataMatrix, cell: string) => {
  const { column, row } = cellToIndex(cell);
  return parseFloat(data[column][row].toString());
};

const isValidFormulaForCell = (formula: string) => {
  const exp = new RegExp('^\\s*[A-Z]*\\d+\\s*([\\+*-\\/]\\s*[A-Z]*\\d+\\s*)*$');
  return formula.match(exp);
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
  if (!isValidFormulaForColumn(formula)) {
    return '#NON_VALID_FORMULA';
  }
  const columns: string[] = formula.match(/[A-Z]/g) || [];
  const operators = getOperators(formula);
  if (operators.length === 0) {
    return data[columnToIndex(columns[0])][row];
  }
  const parsedFormula = columns.reduce((acc, curr, i) => {
    return acc.replace(curr, data[columnToIndex(curr)][row].toString());
  }, formula);
  return evaluate(parsedFormula);
};

const columnToIndex = (column: string) => {
  return column.charCodeAt(0) - 65;
};

const isValidFormulaForColumn = (formula: string) => {
  const exp = new RegExp(
    '^\\s*[A-Z]+|\\d+\\s*([\\+*-\\/]\\s*([A-Z]+|\\d+)\\s*)*$',
  );
  return formula.match(exp);
};
