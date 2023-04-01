import React, { useState, useEffect } from 'react';
import './OpviaTable.scss'
import { Column, EditableCell2, Region, RegionCardinality, Regions, Table2 } from '@blueprintjs/table';
import { useExperimentData } from '../../contexts/experimentData';
import Expression from '../Expression/Expression';

const OpviaTable: React.FC = () => {

  const { columns, sparseCellData, getSparseRefFromIndexes, setSparseCellData, setColumnData } = useExperimentData();

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

  const createSparseCellData = (arr: number[], newColumnName: string) => {
    const newSparseCellData = { ...sparseCellData };
    const largestIndex = columns.length

    for (let i = 0; i < arr.length; i++) {
      newSparseCellData[getSparseRefFromIndexes(i, largestIndex)] = arr[i];
    }
    setSparseCellData(newSparseCellData)
    const newColData = { columnName: newColumnName, columnType: "data", columnId: newColumnName.toLowerCase().replaceAll(" ", "_") }
    setSparseCellData(newSparseCellData);
    setColumnData(newColData)
  }

  return (
    <div className="opvia-table-container">
      <Table2 enableRowHeader={true} defaultRowHeight={30} numRows={8} selectionModes={[RegionCardinality.FULL_COLUMNS, RegionCardinality.FULL_ROWS]}>
        {cols}
      </Table2>
      <Expression onHandleParsedExpression={createSparseCellData} />
    </div >
  );
};

export default OpviaTable;