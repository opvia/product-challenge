import React from 'react';
import './OpviaTable.scss'
import { Column, EditableCell2, Region, RegionCardinality, Regions, Table2 } from '@blueprintjs/table';
import ColOperations from '../ColOperations/ColOperations';
import { useRecoilValue } from 'recoil';
import { columnData, getLargestRowLength, getSparseRefFromIndexes, tableData } from '../../atoms/tableData';
import RowOperations from '../RowOperations/RowOperations';

const OpviaTable: React.FC = () => {

  const columns = useRecoilValue(columnData)
  const sparseCellData = useRecoilValue(tableData)
  const largestRowLength = useRecoilValue(getLargestRowLength)

  const cellRenderer = (rowIndex: number, columnIndex: number) => {
    const sparsePosition = getSparseRefFromIndexes(rowIndex, columnIndex);
    const value = sparseCellData[sparsePosition];
    return <EditableCell2 value={String(value)} />;
  };

  const cols = columns.map((column) => (
    <Column
      key={`${column.columnId}`}
      cellRenderer={cellRenderer}
      name={column.columnName}
    />
  ));

  return (
    <div className="opvia-table-container">
      <Table2 enableRowHeader={true} defaultRowHeight={30} numRows={largestRowLength} selectionModes={[RegionCardinality.FULL_COLUMNS, RegionCardinality.FULL_ROWS]}>
        {cols}
      </Table2>
      <div className="forms">
        <ColOperations />
        <RowOperations />
      </div>
    </div >
  );
};

export default OpviaTable;