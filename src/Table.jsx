import * as React from 'react';

import {
  Column, EditableCell, Table, 
} from '@blueprintjs/table';

const columns = [
  { columnName: 'Time', columnType: 'time', columnId: 'time_col' },
  { columnName: 'Cell Density', columnType: 'data', columnId: 'var_col_1' },
  { columnName: 'Volume', columnType: 'data', columnId: 'var_col_2' },
];

const dummyTableData = {
  '0-0': '2021-01-01T20:39:26.023Z',
  '0-1': '2021-01-02T20:39:26.023Z',
  '0-2': '2021-01-03T20:39:26.023Z',
  '0-3': '2021-01-04T20:39:26.023Z',
  '0-4': '2021-01-05T20:39:26.023Z',
  '0-5': '2021-01-06T20:39:26.023Z',
  '0-6': '2021-01-07T20:39:26.023Z',
  '0-7': '2021-01-08T20:39:26.023Z',
  '1-0': 100,
  '1-1': 120,
  '1-2': 140,
  '1-3': 150,
  '1-4': 166,
  '1-5': 174,
  '1-6': 182,
  '1-7': 194,
  '2-0': 990,
  '2-1': 980,
  '2-2': 970,
  '2-3': 960,
  '2-4': 956,
  '2-5': 954,
  '2-6': 955,
  '2-7': 949,
};

export default class TableDollarExample extends React.PureComponent {
    getSparseRefFromIndexes = (rowIndex, columnIndex) => `${columnIndex}-${rowIndex}`

    cellRenderer = (rowIndex,
      columnIndex) => {
      const sparsePosition = this.getSparseRefFromIndexes(rowIndex, columnIndex);
      const value = dummyTableData[sparsePosition];
      return (
        <EditableCell
          value={value}
        />
      );
    }

    render() {
      const cols = columns.map((column) => (
        <Column
          key={`${column.id}`}
          cellRenderer={(rowIndex, columnIndex) => this.cellRenderer(rowIndex,
            columnIndex)}
          name={column.columnName}
        />
      ));

      return (
        <Table
          defaultRowHeight={30}
          numRows={8}
        >
          {cols}
        </Table>
      );
    }
}
