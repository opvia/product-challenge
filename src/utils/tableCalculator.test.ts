import { expect, test } from 'vitest'

import { calculateForCell, calculateForColumn, createMatrix, getFormulaFromInput, isFormulaInput } from "./tableCalculator";

// isFormulaInput function tests
test('isFormulaInput should return false if value is empty string', () => {
  const isFormula = isFormulaInput('');
  expect(isFormula).toBe(false);
});

test('isFormulaInput should return false if value is a string not starting with "=" sign', () => {
  const isFormula = isFormulaInput(' A1 = 200');
  expect(isFormula).toBe(false);
});

test('isFormulaInput should return true if value is a string starting with "=" sign', () => {
  const isFormula = isFormulaInput('= A1');
  expect(isFormula).toBe(true);
});

test('isFormulaInput should return true if value is a string starting with "=" sign and has spaces', () => {
  const isFormula = isFormulaInput(' = A1');
  expect(isFormula).toBe(true);
});

// getFormulaFromInput function tests
test('getFormulaFromInput should return empty string if value is empty string', () => {
  const formula = getFormulaFromInput('');
  expect(formula).toBe('');
});

test('getFormulaFromInput should return formula without "=" sign', () => {
  const formula = getFormulaFromInput('= A1');
  expect(formula).toBe(' A1');
});

test('getFormulaFromInput should return formula without "=" sign even with spaces preceding it', () => {
  const formula = getFormulaFromInput(' = A1');
  expect(formula).toBe(' A1');
});

// createMatrix function tests
test('createMatrix should return an empty array if rows or columns are 0', () => {
    const table = createMatrix(0, 0, 0);
    expect(table).toStrictEqual([]);
  });

  test('createMatrix should return an array of arrays of numbers', () => {
    const table = createMatrix(3, 3, 0);
    expect(table).toStrictEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]);
  });

  test('createMatrix should return an array of arrays of strings', () => {
    const table = createMatrix(3, 3, 'test');
    expect(table).toStrictEqual([
      ['test', 'test', 'test'],
      ['test', 'test', 'test'],
      ['test', 'test', 'test']
    ]);
  });

  //  calculateForColumn function tests
  test('calculateForColumn should return "#NON_VALID_FORMULA" if formula is not valid', () => {
    const table = [
      [3, 1, 2],
      [1, 1, 2],
      [5, 8, 2]
    ];
    const result = calculateForColumn(table, 'fake formula', 0);
    expect(result).toBe('#NON_VALID_FORMULA');
  });

  test('calculateForColumn should return the result of applying the formula to a specific row', () => {
    const table = [
      [3, 1, 2],
      [1, 1, 2],
      [5, 8, 2]
    ];
    const result = calculateForColumn(table, '(A + B) * 4 / 2 - 2 + A1', 1);
    expect(result).toBe(5);
  });

  test('calculateForColumn should return the sum of the column if formula is "SUM(A)"', () => {
    const table = [
      [3, 1, 2],
      [1, 1, 2],
      [1, 1, 2]
    ];
    const result = calculateForColumn(table, 'SUM(A)', 0);
    expect(result).toBe(6);
  });

  test('calculateForColumn should return the average of the column if formula is "AVERAGE(A)"', () => {
    const table = [
      [3, 1, 2],
      [1, 1, 2],
      [1, 1, 2]
    ];
    const result = calculateForColumn(table, 'AVERAGE(A)', 0);
    expect(result).toBe(2);
  });

  test('calculateForColumn should return the min of the column if formula is "MIN(A)"', () => {
    const table = [
      [3, 1, 2],
      [1, 1, 2],
      [4, 5, 4]
    ];
    const result = calculateForColumn(table, 'MIN(C)', 0);
    expect(result).toBe(4);
  });

  test('calculateForColumn should return the min of the column if formula is "MAX(A)"', () => {
    const table = [
      [3, 5, 2],
      [1, 1, 2],
      [1, 1, 2]
    ];
    const result = calculateForColumn(table, 'MAX(A)', 0);
    expect(result).toBe(5);
  });

  test('calculateForColumn should return the median of the column if formula is "MEDIAN(A)"', () => {
    const table = [
      [3, 5, 2],
      [1, 1, 2],
      [1, 1, 2]
    ];
    const result = calculateForColumn(table, 'MEDIAN(A)', 0);
    expect(result).toBe(3);
  });

  //  calculateForCell function tests
  test('calculateForCell should return "#NON_VALID_FORMULA" if formula is not valid', () => {
    const table = [
      [3, 1, 2],
      [1, 1, 2],
      [5, 8, 2]
    ];
    const result = calculateForCell(table, 'fake formula');
    expect(result).toBe('#NON_VALID_FORMULA');
  });

  test('calculateForCell should return "#NON_VALID_FORMULA" if formula includes a column', () => {
    const table = [
      [3, 1, 2],
      [1, 1, 2],
      [5, 8, 2]
    ];
    const result = calculateForCell(table, 'A + B');
    expect(result).toBe('#NON_VALID_FORMULA');
  });

  test('calculateForCell should return the result of applying the formula to a specific row', () => {
    const table = [
      [3, 1, 2],
      [1, 1, 2],
      [5, 8, 2]
    ];
    const result = calculateForCell(table, '(A1 + B1) * 4 / 2 - 2');
    expect(result).toBe(6);
  });

  test('calculateForCell should return the sum of the column if formula is "SUM(A)"', () => {
    const table = [
      [3, 1, 2],
      [1, 1, 2],
      [1, 1, 2]
    ];
    const result = calculateForCell(table, 'SUM(A)');
    expect(result).toBe(6);
  });

  test('calculateForCell should return the average of the column if formula is "AVERAGE(A)"', () => {
    const table = [
      [3, 1, 2],
      [1, 1, 2],
      [1, 1, 2]
    ];
    const result = calculateForCell(table, 'AVERAGE(A)');
    expect(result).toBe(2);
  });

  test('calculateForCell should return the min of the column if formula is "MIN(A)"', () => {
    const table = [
      [3, 1, 2],
      [1, 1, 2],
      [4, 5, 4]
    ];
    const result = calculateForCell(table, 'MIN(C)');
    expect(result).toBe(4);
  });

  test('calculateForCell should return the min of the column if formula is "MAX(A)"', () => {
    const table = [
      [3, 5, 2],
      [1, 1, 2],
      [1, 1, 2]
    ];
    const result = calculateForCell(table, 'MAX(A)');
    expect(result).toBe(5);
  });

  test('calculateForCell should return the median of the column if formula is "MEDIAN(A)"', () => {
    const table = [
      [3, 5, 2],
      [1, 1, 2],
      [1, 1, 2]
    ];
    const result = calculateForCell(table, 'MEDIAN(A)');
    expect(result).toBe(3);
  });
