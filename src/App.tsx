import React from 'react';
import './App.css';
import OpviaTable from './OpviaTable';
import { dummyTableData } from './data/dummyData';

const originalColumns = [
  { columnName: 'Time', columnType: 'time', columnId: 'time_col' },
  { columnName: 'Cell Density', columnType: 'data', columnId: 'cell_density' },
  { columnName: 'Volume', columnType: 'data', columnId: 'volume' },
];

const App: React.FC = () => {
  return (
    <div className="App">
      <OpviaTable columns={originalColumns} data={dummyTableData}/>
    </div>
  );
};

export default App;
