import React from 'react';
import './App.css';
import OpviaTable, { Data, DataColumn } from './OpviaTable';
import { dummyTableData } from './data/dummyData';
import { saveInStorage, getFromStorage } from './utils/storage';

const originalColumns = [
  { columnName: 'Time', columnType: 'time', columnId: 'time_col' },
  { columnName: 'Cell Density', columnType: 'data', columnId: 'cell_density' },
  { columnName: 'Volume', columnType: 'data', columnId: 'volume' },
];

const App: React.FC = () => {
  const data = getFromStorage<Data>('data') || dummyTableData;
  const columns = getFromStorage<DataColumn[]>('columns') ?? originalColumns;
  const formulas = getFromStorage<string[][]>('formulas') ?? [];

  return (
    <div className="App">
      <OpviaTable
        columns={columns}
        data={data}
        formulas={formulas}
        onChange={onChangeTable}
      />
    </div>
  );
};

const onChangeTable = (data: Data, columns: DataColumn[], formulas: string[][]) => {
  saveInStorage('columns', columns);
  saveInStorage('data', data);
  saveInStorage('formulas', formulas);
};

export default App;
