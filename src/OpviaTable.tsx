import * as React from 'react';

import { Column, EditableCell2, Table2 } from '@blueprintjs/table';
import { dummyTableData } from './data/dummyData';

const columns = [
  { columnName: 'Time', columnType: 'time', columnId: 'time_col' },
  { columnName: 'Cell Density', columnType: 'data', columnId: 'var_col_1' },
  { columnName: 'Volume', columnType: 'data', columnId: 'var_col_2' },
];

const OpviaTable: React.FC = () => {
  const getSparseRefFromIndexes = (rowIndex, columnIndex) =>
    `${columnIndex}-${rowIndex}`;

  const cellRenderer = (rowIndex, columnIndex) => {
    const sparsePosition = getSparseRefFromIndexes(rowIndex, columnIndex);
    const value = dummyTableData[sparsePosition];
    return <EditableCell2 value={value} />;
  };

  const cols = columns.map((column) => (
    <Column
      key={`${column.columnId}`}
      cellRenderer={cellRenderer}
      name={column.columnName}
    />
  ));

  return (
    <Table2 defaultRowHeight={30} numRows={8}>
      {cols}
    </Table2>
  );
};

export default OpviaTable;
