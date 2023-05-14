import * as React from 'react';
import { uid } from 'uid';

import {
  Column,
  ColumnHeaderCell2,
  EditableCell2,
  EditableName,
  Table2,
} from '@blueprintjs/table';
import { dummyTableData } from './data/dummyData';
import ColumnMenu from './ColumnMenu';
import { calculate, isAttemptingFormula } from './utils/calculator';

const originalColumns = [
  { columnName: 'Time', columnType: 'time', columnId: 'time_col' },
  { columnName: 'Cell Density', columnType: 'data', columnId: 'cell_density' },
  { columnName: 'Volume', columnType: 'data', columnId: 'volume' },
];

type Data = typeof dummyTableData;

const OpviaTable: React.FC = () => {
  const [data, setData] = React.useState(dummyTableData);
  const [columns, setCols] = React.useState(originalColumns);
  const numRows = dummyTableData[Object.keys(dummyTableData)[0]].length;

  const onAddColumn = (index: number) => {
    return (direction: 1 | -1) => {
      const pos = direction === 1 ? index + 1 : index;
      const copy = [...columns];
      const columnId = uid(16);
      copy.splice(pos, 0, {
        columnName: '',
        columnType: 'data',
        columnId,
      });
      setData({ ...data, [columnId]: new Array(numRows).fill(' ') });
      setCols(copy);
    };
  };

  const onRemoveColumn = (index: number) => {
    return () => {
      const copy = [...columns];
      copy.splice(index!, 1);
      setCols(copy);
    };
  };

  const onColumnNameChange = (index: number) => {
    return (value: string) => {
      const copy = [...columns];
      copy[index].columnName = value;
      setCols(copy);
    };
  };

  const columnHeaderCellRenderer = (index?: number) => {
    if (index === undefined) return <></>;
    return (
      <ColumnHeaderCell2
        nameRenderer={(_name, index) => (
          <EditableName
            name={columns[index!].columnName}
            onChange={onColumnNameChange(index!)}
          />
        )}
        menuRenderer={(index) => (
          <ColumnMenu
            onAddColumn={onAddColumn(index!)}
            onRemoveColumn={onRemoveColumn(index!)}
          ></ColumnMenu>
        )}
      />
    );
  };

  const onCellChange = (rowIndex: number, columnIndex: number) => {
    return (value: string) => {
      const columnId = columns[columnIndex].columnId;
      const copy = { ...data };
      if (copy[columnId] === undefined) {
        copy[columnId] = [];
      }
      copy[columnId][rowIndex] = value;
      setData(copy);
    };
  };

  const onCellConfirm =
    (columnId: string, rowIndex: number) => (value: string) => {
      if (isAttemptingFormula(value)) {
        // Remove spaces and the '=' sign from the formula
        const formula = value.trim().slice(1);
        const matrix = columns.map((col) => data[col.columnId]);
        const copy = { ...data };
        if (copy[columnId] === undefined) {
          copy[columnId] = [];
        }
        copy[columnId][rowIndex] = calculate(matrix, formula);
        setData(copy);
      }
    };

  const cellRenderer = (rowIndex: number, columnIndex: number) => {
    const columnId = columns[columnIndex].columnId;
    const value = data[columnId] ? data[columnId][rowIndex] : '';
    return (
      <EditableCell2
        value={String(value)}
        onChange={onCellChange(rowIndex, columnIndex)}
        onConfirm={onCellConfirm(columnId, rowIndex)}
      />
    );
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
      <Table2
        defaultRowHeight={30}
        numRows={numRows}
        enableColumnInteractionBar
        cellRendererDependencies={[data]}
      >
        {cols}
      </Table2>
    </>
  );
};

export default OpviaTable;
