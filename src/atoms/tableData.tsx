import { atom, selector, selectorFamily } from "recoil";

type RowDataKey = `${number}-${number}`
type RowData = Record<RowDataKey, string | number>
const defaultData: RowData = {
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
}


export type ColDataType = "time" | "data";

export interface ColumnData {
    columnName: string;
    columnType: ColDataType;
    columnId: string;
}

export const tableData = atom<RowData>({
    key: 'tableData',
    default: defaultData,
});


export const columnData = atom<ColumnData[]>({
    key: 'columnData',
    default: [
        { columnName: "Time", columnType: "time", columnId: "time" },
        { columnName: "Cell Density", columnType: "data", columnId: "cell_density" },
        { columnName: "Volume", columnType: "data", columnId: "volume" },
    ]
});


export const columnNamesAsVariables = selector({
    key: 'columnNamesAsVariables',
    get: ({ get }) => {
        const columns = get(columnData);
        return columns.map((column: ColumnData) => column.columnName.replaceAll(' ', '_').toLowerCase());
    },
});

export const getSparseRefFromIndexes = (rowIndex: number, columnIndex: number): RowDataKey => `${columnIndex}-${rowIndex}`;

export const getLargestRowLength = selector({
    key: 'getLargestRowLength',
    get: ({ get }) => {
        const sparseCellData = get(tableData);
        let largest = 0;
        Object.keys(sparseCellData).forEach((key) => {
            const [_, rowIndex] = key.split('-');
            if (parseInt(rowIndex) > largest) {
                largest = parseInt(rowIndex);
            }
        });
        return largest;
    }
});

// export const getSparseDataBasedOnColumnName = selectorFamily({
//     key: 'getSparseDataBasedOnColumnName',
//     get: (columnName: string) => ({ get }) => {
//         const columns = get(columnData);
//         const sparseCellData = get(tableData);
//         const largestRowLength = get(getLargestRowLength);
//         const columnIndex = columns.findIndex((c) => c.columnId === columnName);
//         if (!columnIndex) return [];

//         const values: Array<number | string> = []
//         for (let i = 0; i < largestRowLength; i++) {
//             values.push(sparseCellData[`${columnIndex}-${i}`])
//         }
//         return values;
//     }
// });