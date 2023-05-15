import * as React from 'react';
import { uid } from 'uid';
import {
  Column,
  ColumnHeaderCell2,
  EditableName,
  Table2,
} from '@blueprintjs/table';
import {
  calculateForCell,
  calculateForColumn,
  createMatrix,
  getFormulaFromInput,
  isFormulaInput,
} from './utils/tableCalculator';
import ColumnMenu from './ColumnMenu';
import FormulaDialog from './FormulaDialog';
// Using custom EditableCell2 component to allow for custom cell editing
import { EditableCell2 } from './lib/blueprint-table/src/cell/EditableCell2';

export type DataColumn = {
  columnName: string;
  columnType: string;
  columnId: string;
  columnFormula?: string;
};

export type Data = Record<string, string[] | number[]>;

type OpviaTableProps = {
  data: Data;
  columns: DataColumn[];
  onChange?: (data: Data, columns: DataColumn[]) => void;
};

const OpviaTable: React.FC<OpviaTableProps> = (props) => {
  const [data, setData] = React.useState<Data>(props.data);
  const [columns, setCols] = React.useState<DataColumn[]>(props.columns);
  const [editingColumnFormula, setEditingColumnFormula] =
    React.useState<number>();
  const numRows = data[Object.keys(data)[0]].length;
  const [formulaMatrix, setFormulaMatrix] = React.useState<string[][]>(
    createMatrix(numRows, columns.length, ''),
  );

  React.useEffect(() => {
    if (props.onChange) {
      props.onChange(data, columns);
    }
  }, [data, columns]);

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

  const onColumnFormulaSubmit = (formula: string) => {
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

  const onCellFormulaSubmit = (
    value: string,
    rowIndex: number,
    columnIndex: number,
  ) => {
    const formula = getFormulaFromInput(value);
    const columnId = columns[columnIndex].columnId;
    const matrix = columns.map((col) => data[col.columnId]);
    const copy = { ...data };
    if (copy[columnId] === undefined) {
      copy[columnId] = [];
    }
    copy[columnId][rowIndex] = calculateForCell(matrix, formula);
    setData(copy);
  };

  const onCellConfirm =
    (rowIndex: number, columnIndex: number) => (value: string) => {
      if (isFormulaInput(value)) {
        onCellFormulaSubmit(value, rowIndex, columnIndex);
        // save formula for later use
        const copyFM = [...formulaMatrix];
        copyFM[rowIndex][columnIndex] = value;
        setFormulaMatrix(copyFM);
      } else {
        // remove formula
        const copyFM = [...formulaMatrix];
        copyFM[rowIndex][columnIndex] = '';
        setFormulaMatrix(copyFM);
      }
    };

  const cellRenderer = (rowIndex: number, columnIndex: number) => {
    const columnId = columns[columnIndex].columnId;
    const value = data[columnId] ? data[columnId][rowIndex] : '';
    return (
      <EditableCell2
        value={String(value)}
        onChange={onCellChange(rowIndex, columnIndex)}
        onConfirm={onCellConfirm(rowIndex, columnIndex)}
        onEditValue={
          formulaMatrix[rowIndex]
            ? formulaMatrix[rowIndex][columnIndex]
            : undefined
        }
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
        onSubmit={onColumnFormulaSubmit}
        formula={getColumnFormula(editingColumnFormula)}
      ></FormulaDialog>
    </>
  );
};

export default OpviaTable;
