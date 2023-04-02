import React, { useState, useEffect } from 'react';
import './OpviaTable.scss'
import { Column, EditableCell2, Region, RegionCardinality, Regions, Table2 } from '@blueprintjs/table';
import { useExperimentData } from '../../contexts/experimentData';
import Expression from '../Expression/Expression';
import { useRecoilState, useRecoilValue } from 'recoil';
import { columnData, getSparseRefFromIndexes, tableData } from '../../atoms/tableData';

const OpviaTable: React.FC = () => {

  const columns = useRecoilValue(columnData)
  const sparseCellData = useRecoilValue(tableData)

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
      <Table2 enableRowHeader={true} defaultRowHeight={30} numRows={8} selectionModes={[RegionCardinality.FULL_COLUMNS, RegionCardinality.FULL_ROWS]}>
        {cols}
      </Table2>
      <Expression />
    </div >
  );
};

export default OpviaTable;