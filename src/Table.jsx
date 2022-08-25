import * as React from 'react';

import {
  Column, EditableCell, Table, 
} from '@blueprintjs/table';

const columns = [
  { columnName: 'Time', columnType: 'time', columnId: 'time_col' },
  { columnName: 'Cell Density', columnType: 'data', columnId: 'var_col_1' },
  { columnName: 'Volume', columnType: 'data', columnId: 'var_col_2' },
];

const dummyTableData = {
  '0-0': '2021-01-01T20:39:26.023Z',
  '0-1': '2021-01-02T20:39:26.023Z',
  '0-2': '2021-01-03T20:39:26.023Z',
  '0-3': '2021-01-04T20:39:26.023Z',
  '0-4': '2021-01-05T20:39:26.023Z',
  '0-5': '2021-01-06T20:39:26.023Z',
  '0-6': '2021-01-07T20:39:26.023Z',
  '0-7': '2021-01-08T20:39:26.023Z',
  '1-0': 100,
  '1-1': 120,
  '1-2': 140,
  '1-3': 150,
  '1-4': 166,
  '1-5': 174,
  '1-6': 182,
  '1-7': 194,
  '2-0': 990,
  '2-1': 980,
  '2-2': 970,
  '2-3': 960,
  '2-4': 956,
  '2-5': 954,
  '2-6': 955,
  '2-7': 949,
};

let currentTableData = dummyTableData;
let numberRows = 8;
let numberColums = 3;

export default class TableDollarExample extends React.PureComponent {
    getSparseRefFromIndexes = (rowIndex, columnIndex) => `${columnIndex}-${rowIndex}`

    cellRenderer = (rowIndex,
      columnIndex) => {
      const sparsePosition = this.getSparseRefFromIndexes(rowIndex, columnIndex);
      const value = currentTableData[sparsePosition];
      return (
        <EditableCell
          value={value}
        />
      );
    }

    render() {
      const columnARef = React.createRef();
      const columnBRef = React.createRef();
      const columnOPRef = React.createRef();
      const columnNameRef = React.createRef();
      const columnTimeNameRef = React.createRef();
      const columnTimeChangeRef = React.createRef();
      const columnTimeUnitRef = React.createRef();

      const cols = columns.map((column) => (
        <Column
          key={`${column.id}`}
          cellRenderer={(rowIndex, columnIndex) => this.cellRenderer(rowIndex,
            columnIndex)}
          name={column.columnName}
        />
      ));

      const calcuateCellData = (cellFormula, rowNumber) => {
        let formulaSplit = cellFormula.split(' ')
        let firstValue = currentTableData[`${formulaSplit[0].slice(-1)}-${rowNumber}`]
        let secondValue = currentTableData[`${formulaSplit[2].slice(-1)}-${rowNumber}`]
        let formulaOperation = formulaSplit[1]
        return eval(firstValue + formulaOperation + secondValue);
      };

      const calcuateCellDataTimeChange = (colNumber, rowNumber, timeUnit) => {
        if (rowNumber !== 0) {
          let timeValue = Date.parse(currentTableData[`0-${rowNumber}`])
          let timeValuePrev = Date.parse(currentTableData[`0-${rowNumber - 1}`])
          let colValue = currentTableData[`${colNumber}-${rowNumber}`]
          let colValuePrev = currentTableData[`${colNumber}-${rowNumber - 1}`]        
          return (colValue - colValuePrev)/((timeValue - timeValuePrev)/timeUnit);
        } else {
          return "N/A"
        }
      };

      const handleAddColumn = () => {
        let col_1 = columnARef.current.value
        let col_2 = columnBRef.current.value
        let operation = columnOPRef.current.value
        let col_name = columnNameRef.current.value
        columns.push({ 
          columnName: `${col_name}`, 
          columnType: 'data', 
          columnId: `calc_col_${numberColums}`, 
          columnFormula: `${col_1} ${operation} ${col_2}`, 
        });
        let newData = {};
        for (let i = 0; i < numberRows; i++) {
          newData[`${numberColums}-${i}`] = calcuateCellData(columns[numberColums].columnFormula, i)
        }
        currentTableData = { ...currentTableData, ...newData };
        columnARef.current.append(<option value={`calc_col_${numberColums}`}>{col_name}</option>)
        columnBRef.current.append(<option value={`calc_col_${numberColums}`}>{col_name}</option>)
        columnNameRef.current.value = ""
        numberRows += 1;
        numberColums += 1;
        this.forceUpdate();
      };

      const handleAddRow = () => {
        let col_name = columnTimeNameRef.current.value
        let col_to_evaluate = columnTimeChangeRef.current.value
        let timeUnit = 1000
        if (columnTimeUnitRef.current.value === "minute") {
          timeUnit = 60000
        }
        columns.push({ 
          columnName: `${col_name}`, 
          columnType: 'data', 
          columnId: `time_change_col_${numberColums}`, 
        });
        let newData = {};
        for (let i = 0; i < numberRows; i++) {
          newData[`${numberColums}-${i}`] = calcuateCellDataTimeChange(col_to_evaluate.slice(-1), i, timeUnit)
        }
        currentTableData = { ...currentTableData, ...newData };
        columnTimeNameRef.current.value = ""
        numberRows += 1;
        numberColums += 1;
        this.forceUpdate();
      }

      let selectionOptions = columns.map((e, key) => {
        if (e.columnName === "Time") {return null}
        return <option key={key} value={e.columnId}>{e.columnName}</option>;
      })

      const resetPage = () => {
        window.location.reload(false)
      }

      return (
        <div>
          <Table
            defaultRowHeight={30}
            numRows={8}
          >
            {cols}
          </Table>
          <input ref={columnNameRef} type="text" id="columnName" name="columnName" placeholder='Type Column name here'/>
          <select name="column_a" ref={columnARef} id="column_a">
            {selectionOptions}
          </select>
          <select name="operation" ref={columnOPRef} id="operation">
            <option value="+">+</option>
            <option value="-">-</option>
            <option value="*">*</option>
            <option value="/">/</option>
          </select>
          <select name="column_b" ref={columnBRef} id="column_b">
            {selectionOptions}
          </select>
          <span> ={'>'} </span>
          <button onClick={handleAddColumn} type="button">Add column!</button>
          <br/>
          <input type="text" ref={columnTimeNameRef} id="columnTimeName" name="columnTimeName" placeholder='Type Column name here'/>
          <select ref={columnTimeChangeRef} name="column_time_change" id="column_time_change">
            {selectionOptions}
          </select>
          <select ref={columnTimeUnitRef} name="column_time_unit" id="column_time_unit">
            <option value="minute">Per Minute</option>;
            <option value="second">Per Second</option>;
          </select>
          <span> ={'>'} </span>
          <button onClick={handleAddRow} type="button">Add rate of change!</button>
          <br/>
          <button onClick={resetPage}>Reset</button>
        </div>
      );
    }
}
