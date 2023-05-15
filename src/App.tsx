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

  return (
    <div className="App">
      <OpviaTable columns={columns} data={data} onChange={onChangeTable}/>
    </div>
  );
};

const onChangeTable = (data: any, columns: any) => {
  saveInStorage('columns', columns);
  saveInStorage('data', data);
};

export default App;
