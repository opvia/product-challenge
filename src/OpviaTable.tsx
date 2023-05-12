import * as React from 'react';

import {
  Column,
  ColumnHeaderCell2,
  EditableCell2,
  EditableName,
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
  const [editableColumnHeader, setEditableColumnHeader] = React.useState<
    number | null
  >(null);

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

  const columnNameRenderer = (_name: string, index?: number) => {
    if (index == undefined || index === null) return <span></span>;
    if (editableColumnHeader !== index) {
      return <span>{columns[index].columnName}</span>;
    }
    return (
      <div id={`editable-name`}>
        <EditableName
          intent="primary"
          name={columns[index ?? 0].columnName}
          onChange={(value) => {
            const copy = [...columns];
            copy[index ?? 0].columnName = value;
            setCols(copy);
          }}
          onConfirm={() => {
            setEditableColumnHeader(null);
          }}
          onCancel={() => {
            setEditableColumnHeader(null);
          }}
        />
      </div>
    );
  };

  const columnHeaderCellRenderer = (index?: number) => {
    return (
      <ColumnHeaderCell2
        nameRenderer={columnNameRenderer}
        menuRenderer={(index) => (
          <ColumnMenu
            onAddColumn={onAddColumn(index ?? 0)}
            onEditName={() => setEditableColumnHeader(index ?? 0)}
          ></ColumnMenu>
        )}
      />
    );
  };

  const cellRenderer = (rowIndex: number, columnIndex: number) => {
    const columnId = columns[columnIndex].columnId;
    const value = dummyTableData[columnId]
      ? dummyTableData[columnId][rowIndex]
      : '';
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
