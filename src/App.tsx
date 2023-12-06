import { Classes } from '@blueprintjs/core';
import React from 'react';
import './App.css';
import OpviaTable from './OpviaTable';

const App: React.FC = () => {
  return (
    <div className="App">
      <div style={{ height: 50 }}></div>
      <div style={{ paddingBottom: 10 }} className={Classes.TEXT_LARGE}>
        This is an empty template with the blueprintjs table installed and
        working with some dummy data. You can use this as your starting off
        point.
      </div>

      <div>
        Please carefully read the instructions in the readme on github{' '}
        <a href="https://github.com/opvia/column-cals-interview">here.</a>
      </div>
      <div style={{ padding: 75 }}>
        <OpviaTable />
      </div>
    </div>
  );
};

export default App;
