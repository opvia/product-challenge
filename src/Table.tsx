import React from 'react';
import { Cell, Column, Table2 } from '@blueprintjs/table';
import { entitiesFromView, columnsForThisRun, viewContext } from './data';

const TABLE_HEIGHT = 500;

const BioreactorTable: React.FC = () => {
  const data = entitiesFromView;
  const columnNames = columnsForThisRun;

  const cellRenderer = (rowIndex: number, columnIndex: number) => {
    const row = data[rowIndex];
    const field = row.fields.find(f => f.name === columnNames[columnIndex]);
    const val = field ? field.value : 'N/A';
    return <Cell>{typeof val === 'number' ? val.toFixed(2) : val}</Cell>;
  };

  const columns = columnNames.map((name, i) => (
    <Column key={i} name={name} cellRenderer={cellRenderer} />
  ));

  return (
    <div style={{ padding: 40 }}>
      <p>Filtered on: {viewContext.filter}</p>
      <div style={{ height: TABLE_HEIGHT, border: '1px solid #eee' }}>
        <Table2 numRows={data.length} enableGhostCells>
          {columns}
        </Table2>
      </div>
    </div>
  );
};

export default BioreactorTable;