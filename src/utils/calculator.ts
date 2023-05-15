import { evaluate } from 'mathjs';

export type DataMatrix = (string | number)[][];

export const isAttemptingFormula = (value: string) => {
  return value.trim().startsWith('=');
};

export const calculateForCell = (data: DataMatrix, formula: string) => {
  if (!isValidFormulaForCell(formula)) {
    return '#NON_VALID_FORMULA';
  }
  const cells = formula
    .split(/[\+\-\*\/]/)
    .map((i) => i.trim())
    .filter((i) => /^[A-Z]\d$/.test(i));
  const operators = formula.split(/[A-Z]\d/).map((i) => i.trim());
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
