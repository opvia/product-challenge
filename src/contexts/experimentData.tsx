import { createContext, useState } from "react";
import { Operator } from "../assets/types";

type ColDataType = "time" | "data";

export interface ColumnDerivative {
  colAId: string;
  colBId: string;
  operator?: Operator;
  formula?: "gradient";
}
export interface ColumnData {
  columnName: string;
  columnType: ColDataType;
  columnId: string;
  derived?: ColumnDerivative;
}

export const columnData: ColumnData[] = [
  { columnName: "Time", columnType: "time", columnId: "time_col" },
  { columnName: "Cell Density", columnType: "data", columnId: "var_col_1" },
  { columnName: "Volume", columnType: "data", columnId: "var_col_2" },
];

export const rowData: RowData = {
  "0-0": "2021-01-01T20:39:26.023Z",
  "0-1": "2021-01-02T20:39:26.023Z",
  "0-2": "2021-01-03T20:39:26.023Z",
  "0-3": "2021-01-04T20:39:26.023Z",
  "0-4": "2021-01-05T20:39:26.023Z",
  "0-5": "2021-01-06T20:39:26.023Z",
  "0-6": "2021-01-07T20:39:26.023Z",
  "0-7": "2021-01-08T20:39:26.023Z",
  "1-0": 100,
  "1-1": 120,
  "1-2": 140,
  "1-3": 150,
  "1-4": 166,
  "1-5": 174,
  "1-6": 182,
  "1-7": 194,
  "2-0": 990,
  "2-1": 980,
  "2-2": 970,
  "2-3": 960,
  "2-4": 956,
  "2-5": 954,
  "2-6": 955,
  "2-7": 949,
};

export interface RowData {
  [key: string]: string | number;
}

export interface ExperimentDataContext {
    columns: ColumnData[];
    sparseCellData: RowData;
    getSparseRefFromIndexes: (rowIndex: number, columnIndex: number) => string;
    setCellData: (rowIndex: number, columnIndex: number, value: string) => void;
    setColumnData: (column: ColumnData) => void;
    setSparseCellData: (sparseCellData: RowData) => void;
    createNewDerivedColumn: (col: ColumnData) => void;
};

export const ExperimentDataContext = createContext({ columns: columnData, sparseCellData: rowData });


export const useExperimentData = (): ExperimentDataContext => {
    const [columns, setColumns] = useState(columnData);
    const [sparseCellData, setSparseCellData] = useState(rowData);

    const getSparseRefFromIndexes = (rowIndex: number, columnIndex: number): string => `${columnIndex}-${rowIndex}`;

    const setCellData = (rowIndex: number, columnIndex: number, value: string) => {
        const sparsePosition = getSparseRefFromIndexes(rowIndex, columnIndex);
        setSparseCellData({ ...sparseCellData, [sparsePosition]: value });
    };

    // TODO
    const removeCellData = (rowIndex: number, columnIndex: number) => { }

    const setColumnData = (column: ColumnData) => {
        const newColumns = [...columns, column];
        setColumns(newColumns);
    };

    const columnMath = (col: ColumnData) => {
        const { colAId, operator, colBId } = col.derived;
        const indexA = columns.findIndex((col) => col.columnId === colAId);
        const indexB = columns.findIndex((col) => col.columnId === colBId);
        const largestIndex = columns.length
        const newSparseData: RowData = {};
        for (let i = 0; i < 8; i++) {
            const colAValue = sparseCellData[`${indexA}-${i}`] as number;
            const colBValue = sparseCellData[`${indexB}-${i}`] as number;
            if (colAValue && colBValue) {
                switch (operator) {
                    case 'add':
                        newSparseData[`${largestIndex}-${i}`] = colAValue + colBValue;
                        break;
                    case 'subtract':
                        newSparseData[`${largestIndex}-${i}`] = colAValue - colBValue;
                        break;
                    case 'multiply':
                        newSparseData[`${largestIndex}-${i}`] = colAValue * colBValue;
                        break;
                    case 'divide':
                        newSparseData[`${largestIndex}-${i}`] = colAValue / colBValue;
                        break;
                    default:
                        break;
                }
            }
        }
        return newSparseData;
    }


    const rowMath = (col: ColumnData) => {
        const { colAId, formula, colBId } = col.derived;
        const indexA = columns.findIndex((col) => col.columnId === colAId);
        const indexB = columns.findIndex((col) => col.columnId === colBId);
        const largestIndex = columns.length
        if (formula === 'gradient') {
            const newSparseData: RowData = {};
            for (let i = 1; i < 8; i++) {
                const colBValue = sparseCellData[`${indexB}-${i}`] as number;
                const colBValuePrev = sparseCellData[`${indexB}-${i - 1}`] as number

                const res = ((colBValue - colBValuePrev) / colBValue) * 100
                newSparseData[`${largestIndex}-${i}`] = res;
            }
            newSparseData[`${largestIndex}-${0}`] = 0
            return newSparseData;
        }
        return {}
    }

    const isDateTimeOrNumber = (value: number | Date) => { return typeof value === 'number' || value instanceof Date }



    // TODO
    const removeColumnData = (columnId: string) => { }

    const createNewDerivedColumn = (col: ColumnData) => {
        setColumnData(col)
        const newSparseData = col.derived?.operator ? columnMath(col) : rowMath(col)
        setSparseCellData({ ...sparseCellData, ...newSparseData });
    }

    return { columns, sparseCellData, getSparseRefFromIndexes, setCellData, setColumnData, setSparseCellData, createNewDerivedColumn };
}
