import React from 'react'
import './App.scss'
import OpviaTable from './components/OpviaTable/OpviaTable'

const App: React.FC = () => {
  return (
    <div className="App">
      <h1 className="app-title">Column Challenge</h1>
      <OpviaTable />
    </div>
  )
}

export default App
