import { evaluate } from 'mathjs';

export type DataMatrix = (string | number)[][];

const aggregateFnNames = ['SUM', 'AVERAGE', 'MAX', 'MIN', 'MEDIAN'];
const aggregateFnRegexStr = `(${aggregateFnNames.join('|')})\\s*\\(\\s*[A-Z]\\s*\\)`;

export const isFormulaInput = (value: string) => {
  return value?.trim().startsWith('=');
};

export const getFormulaFromInput = (value: string) => {
  // Remove spaces and the '=' sign from the formula input
  return value?.trim().slice(1);
};

export const createMatrix = <T>(rows: number, columns: number, value: T) => {
  const data: T[][] = [];
  for (let i = 0; i < rows; i++) {
    const row: T[] = [];
    for (let j = 0; j < columns; j++) {
      row.push(value);
    }
    data.push(row);
  }
  return data;
};

/**
 * Calculates the value of a column formula for a given row
 * @param data An array of columns, each column is an array of values
 * @param formula A string representing a formula
 * @param row The row index of the cell that the formula is being calculated for
 */
export const calculateForColumn = (
  data: DataMatrix,
  formula: string,
  row: number,
) => {
  if (!isValidFormula(formula)) {
    return '#NON_VALID_FORMULA';
  }
  const parsed1 = parseAggregateFunctions(formula, data);
  const parsed2 = parseCells(parsed1, data);
  const parsed3 = parseColumns(parsed2, data, row);
  return evaluate(parsed3);
};

const isValidFormula = (formula: string, isForCell = false) => {
  // Aggregate functions can only be applied to entire columns
  const functions = aggregateFnRegexStr;
  const operators = '[+\\-*\\/]';
  const columns = '[A-Z]';
  const cells = '[A-Z]\\d+';
  const numbers = '\\d+';
  // Columns are not allowed in cell formulas
  const operands = isForCell
    ? `(${functions}|${cells}|${numbers})`
    : `(${functions}|${columns}|${cells}|${numbers})`;
  const exp = new RegExp(
    `^\\s*\\(*\\s*(${operands})\\s*(${operators}\\s*(${operands})\\s*\\)*\\s*)*\\s*$`,
  );
  return formula.match(exp);
};

const parseAggregateFunctions = (formula: string, data: DataMatrix) => {
  const regexp = new RegExp(aggregateFnRegexStr, 'g');
  const functions: string[] = formula.match(regexp) || [];
  const parsedFunctions = functions.reduce((acc, curr) => {
    let [functionName, column] = curr.split('(');
    functionName = functionName.trim();
    column = column.replace(')', '').trim();
    const columnData = data[columnToIndex(column)].map((v) =>
      parseFloat(v.toString()),
    );
    return acc.replace(
      curr,
      calculateAggregationFn(columnData, functionName).toFixed(2),
    );
  }, formula);
  return parsedFunctions;
};

const calculateAggregationFn = (columnData: number[], functionName: string) => {
  switch (functionName) {
    case 'SUM':
      return columnData.reduce((acc, curr) => {
        return acc + curr;
      }, 0);
    case 'AVERAGE':
      return (
        columnData.reduce((acc, curr) => {
          return acc + curr;
        }, 0) / columnData.length
      );
    case 'MAX':
      return Math.max(...columnData);
    case 'MIN':
      return Math.min(...columnData);
    case 'MEDIAN':
      const sorted = columnData.sort((a, b) => a - b);
      const middle = Math.floor(sorted.length / 2);
      if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
      }
      return sorted[middle];
    default:
      return 0;
  }
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

const parseColumns = (formula: string, data: DataMatrix, row: number) => {
  const columns: string[] = formula.match(/[A-Z]/g) || [];
  return columns.reduce((acc, curr) => {
    const value = parseFloat(data[columnToIndex(curr)][row].toString());
    return acc.replace(curr, value.toString());
  }, formula);
};

const columnToIndex = (column: string) => {
  return column.charCodeAt(0) - 65;
};

/**
 * Calculates the value of formula. To be used for cell formulas.
 * @param data An array of columns, each column is an array of values
 * @param formula A string representing a formula
 */
export const calculateForCell = (data: DataMatrix, formula: string) => {
  if (!isValidFormula(formula, true)) {
    return '#NON_VALID_FORMULA';
  }
  const parsed1 = parseAggregateFunctions(formula, data);
  const parsed2 = parseCells(parsed1, data);
  return evaluate(parsed2);
};
