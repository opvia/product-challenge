import * as React from 'react';

import {
  Column,
  ColumnHeaderCell2,
  EditableCell2,
  Table2,
} from '@blueprintjs/table';
import { dummyTableData } from './data/dummyData';
import ColumnMenu from './ColumnMenu';

const originalColumns = [
  { columnName: 'Time', columnType: 'time', columnId: 'time_col' },
  { columnName: 'Cell Density', columnType: 'data', columnId: 'cell_density' },
  { columnName: 'Volume', columnType: 'data', columnId: 'volume' },
];

const OpviaTable: React.FC = () => {
  const [columns, setCols] = React.useState(originalColumns);

  const onAddColumn = (index: number) => {
    return (direction: 1 | -1) => {
      const pos = direction === 1 ? index + 1 : index;
      const copy = [...columns];
      copy.splice(pos, 0, {
        columnName: '',
        columnType: 'data',
        columnId: '',
      });
      setCols(copy);
    };
  };

  const columnHeaderCellRenderer = (index?: number) => {
    return (
      <ColumnHeaderCell2
      name={columns[index ?? 0].columnName}
      menuRenderer= {(index) => 
        <ColumnMenu onAddColumn={onAddColumn(index ?? 0)}></ColumnMenu>
      }
      />
    );
  };

  const cellRenderer = (rowIndex: number, columnIndex: number) => {
    const columnId = columns[columnIndex].columnId;
    const value = dummyTableData[columnId] ? dummyTableData[columnId][rowIndex] : '';
    return <EditableCell2 value={String(value)} />;
  };

  const cols = columns.map((column) => (
    <Column
      key={`${column.columnId}`}
      cellRenderer={cellRenderer}
      name={column.columnName}
      columnHeaderCellRenderer={columnHeaderCellRenderer}
    />
  ));

  return (
    <>
      <Table2 defaultRowHeight={30} numRows={8}>
        {cols}
      </Table2>
    </>
  );
};

export default OpviaTable;
