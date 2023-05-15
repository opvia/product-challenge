import * as React from 'react';
import { uid } from 'uid';
import {
  Column,
  ColumnHeaderCell2,
  EditableCell2,
  EditableName,
  Table2,
} from '@blueprintjs/table';
import {
  calculateForCell,
  calculateForColumn,
  isAttemptingFormula,
} from './utils/calculator';
import ColumnMenu from './ColumnMenu';
import FormulaDialog from './FormulaDialog';

type DataColumn = {
  columnName: string;
  columnType: string;
  columnId: string;
  columnFormula?: string;
};

type Data = Record<string, string[] | number[]>;

type OpviaTableProps = {
  data: Data;
  columns: DataColumn[];
};

const OpviaTable: React.FC<OpviaTableProps> = (props) => {
  const [data, setData] = React.useState<Data>(props.data);
  const [columns, setCols] = React.useState<DataColumn[]>(props.columns);
  const [editingColumnFormula, setEditingColumnFormula] =
    React.useState<number>();
  const numRows = data[Object.keys(data)[0]].length;

  const onAddColumn = (index: number) => (direction: 1 | -1) => {
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

  const onRemoveColumn = (index: number) => () => {
    const copy = [...columns];
    copy.splice(index!, 1);
    setCols(copy);
  };

  const onColumnNameChange = (index: number) => (value: string) => {
    const copy = [...columns];
    copy[index].columnName = value;
    setCols(copy);
  };

  const onAddCalculation = (index: number) => () => {
    setEditingColumnFormula(index);
  };

  const onFormulaSubmit = (formula: string) => {
    // Save formula in column
    const columnsCopy = [...columns];
    const columnCopy = columnsCopy[editingColumnFormula!];
    columnCopy.columnFormula = formula;
    setCols(columnsCopy);
    setEditingColumnFormula(undefined);
    // Do the calculation for cells
    const columnId = columnCopy.columnId;
    const matrix = columns.map((col) => data[col.columnId]);
    const dataCopy = { ...data };
    if (dataCopy[columnId] === undefined) {
      dataCopy[columnId] = [];
    }
    dataCopy[columnId] = dataCopy[columnId].map((_v, i) =>
      calculateForColumn(matrix, formula, i),
    );
    setData(dataCopy);
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
            onAddCalculation={onAddCalculation(index!)}
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
        copy[columnId][rowIndex] = calculateForCell(matrix, formula);
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

  const getColumnFormula = (index?: number) => {
    if (index === undefined) return '';
    return columns[index].columnFormula || '';
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
      <FormulaDialog
        isOpen={editingColumnFormula !== undefined}
        onClose={() => setEditingColumnFormula(undefined)}
        onSubmit={onFormulaSubmit}
        formula={getColumnFormula(editingColumnFormula)}
      ></FormulaDialog>
    </>
  );
};

export default OpviaTable;
