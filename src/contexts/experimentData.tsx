import { createContext, useEffect, useReducer, useState } from "react";
import { ExpressionEvent, Operator } from "../assets/types";

type ColDataType = "time" | "data";

export interface ColumnData {
    columnName: string;
    columnType: ColDataType;
    columnId: string;
}

export const columnData: ColumnData[] = [
    { columnName: "Time", columnType: "time", columnId: "time" },
    { columnName: "Cell Density", columnType: "data", columnId: "cell_density" },
    { columnName: "Volume", columnType: "data", columnId: "volume" },
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
    columnVariableNames: string[];
    getSparseRefFromIndexes: (rowIndex: number, columnIndex: number) => string;
    setColumnData: (column: ColumnData) => void;
    setSparseCellData: (sparseCellData: RowData) => void;
    getSparseDataBasedOnColumnName: (columnName: string) => Array<number | string>;
};

export const ExperimentDataContext = createContext<ExperimentDataContext>({
    columns: columnData,
    sparseCellData: rowData,
    columnVariableNames: [],
    getSparseRefFromIndexes: (rowIndex: number, columnIndex: number) => `${columnIndex}-${rowIndex}`,
    setColumnData: (column: ColumnData) => { },
    setSparseCellData: (sparseCellData: RowData) => { },
    getSparseDataBasedOnColumnName: (columnName: string) => [],
});


export const useExperimentData = (): ExperimentDataContext => {

    const [columns, setColumns] = useState(columnData);
    const [sparseCellData, setSparseCellData] = useState<RowData>(rowData);
    const [columnVariableNames, setColumnVariableNames] = useState<string[]>([]);

    const getSparseRefFromIndexes = (rowIndex: number, columnIndex: number): string => `${columnIndex}-${rowIndex}`;

    const getSparseDataBasedOnColumnName = (columnName: string) => {
        const columnIndex = columns.findIndex((c) => c.columnId === columnName);
        if (!columnIndex) return [];

        const values: Array<number | string> = []
        for (let i = 0; i < 8; i++) {
            values.push(sparseCellData[`${columnIndex}-${i}`])
        }
        return values;
    };

    const setColumnData = (column: ColumnData) => {
        const newColumns = [...columns, column];
        setColumns(newColumns);
    };

    const availableVariableNames = () => {
        const variableNames = columns
    }

    useEffect(() => {
        const variableNames = columns
            .filter((c) => c.columnType === "data")
            .map((c) => c.columnName.toLocaleLowerCase().replaceAll(" ", "_"));
        setColumnVariableNames([...variableNames]);
    }, [columns])



    return { columns, sparseCellData, getSparseRefFromIndexes, getSparseDataBasedOnColumnName, setColumnData, setSparseCellData, columnVariableNames };
}
