import React from 'react';
import './App.css';
import OpviaTable from './OpviaTable';
import { useExperimentData } from './contexts/experimentData';
import { ComputeEngine } from "@cortex-js/compute-engine";


const App: React.FC = () => {
  return (
    <div className="App">
      <OpviaTable />
    </div>
  );
};

export default App;
