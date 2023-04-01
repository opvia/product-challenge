import React, { useState, useEffect } from 'react';

import { Column, EditableCell2, Region, RegionCardinality, Regions, Table2 } from '@blueprintjs/table';
import { ColumnData } from './contexts/experimentData';

import CreateColumn from './components/CreateColumn';
import { useExperimentData } from './contexts/experimentData';


const OpviaTable: React.FC = () => {

  const { columns, sparseCellData, getSparseRefFromIndexes, createNewDerivedColumn } = useExperimentData();
  const [selectedIndexes, setSelectedIndexes] = useState(new Map<number, string>());
  const [selectedColumns, setSelectedColumns] = useState<ColumnData[]>([]);
  const [mathType, setMathType] = useState<'column' | 'row'>('column');

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

  const handleOnSelection = (selectedRegion: Region[]) => {
    // const columns = Regions.getFocusCellCoordinatesFromRegion(selectedRegion[0]);
    if (!selectedRegion.length) return;
    let hasCols = false;
    let hasRows = false;
    selectedRegion.forEach((region) => {
      const shape = Regions.getRegionCardinality(region)
      if (shape === RegionCardinality.FULL_COLUMNS) {
        hasCols = true;
      }
      if (shape === RegionCardinality.FULL_ROWS) {
        hasRows = true;
      }
    })
    if (hasCols && !hasRows) {
      setMathType('column')
      let newMap = new Map<number, string>()
      selectedRegion.forEach((region) => {
        const columnIndex = Regions.getFocusCellCoordinatesFromRegion(region).col;
        const dataColumn = columns[columnIndex];
        newMap.set(columnIndex, dataColumn.columnName)
      })
      setSelectedIndexes(newMap)
      return
    }
    if (!hasCols && hasRows) {
      setMathType('row')
      let newMap = new Map<number, string>()
      columns.forEach((column, i) => {
        newMap.set(i, column.columnName)
      })
      setSelectedIndexes(newMap)
      return
    }
    setSelectedIndexes(new Map<number, string>())
  }

  useEffect(() => {
    let c = Array.from(selectedIndexes.keys()).map((i) => columns[i])
    setSelectedColumns(c)
  }, [selectedIndexes])


  return (
    <React.Fragment>
      <Table2 enableRowHeader={true} defaultRowHeight={30} numRows={8} onSelection={handleOnSelection} selectionModes={[RegionCardinality.FULL_COLUMNS, RegionCardinality.FULL_ROWS]}>
        {cols}
      </Table2>
      {selectedColumns.length > 1 && (
        <CreateColumn columns={selectedColumns} handleNewDerivedColumn={createNewDerivedColumn} mathType={mathType} />
      )}
    </React.Fragment >
  );
};

export default OpviaTable;
