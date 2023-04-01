
import { FC, Fragment, ReactElement, useState } from 'react';
import { ColumnData } from '../contexts/experimentData'
import { Operator, operators } from '../assets/types';
import './CreateColumn.styles.scss'

interface CreateColumnProps {
    columns: ColumnData[];
    handleNewDerivedColumn: (newColumn: ColumnData) => void;
    mathType: 'row' | 'column';
}

const CreateColumn: FC<CreateColumnProps> = ({ columns, handleNewDerivedColumn, mathType }) => {

    const [formFields, setFormFields] = useState({
        name: '',
        colAId: columns[0].columnId,
        operator: 'add',
        colBId: columns[1].columnId,
        formula: 'gradient'
    });
    const { name, colAId, operator, colBId, formula } = formFields;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormFields({ ...formFields, [name]: value });
    };

    const handleNewColumn = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newColumn: ColumnData = {
            columnId: `${name.replaceAll(' ', '_')}`,
            columnName: name,
            columnType: 'data',
            derived: {
                colAId: colAId,
                colBId: colBId,
                ...(mathType === 'row' ? { formula: formula } : { operator: operator as Operator })
            }
        };
        handleNewDerivedColumn(newColumn)
    }

    const cols = columns.filter((column) => mathType === 'column' ? column.columnType === 'data' : column).map((column) => (
        <option key={column.columnId} value={column.columnId} >{column.columnName}</option>
    ))

    const onlyTimeBasedCols = columns.filter((column) => column.columnType === 'time').map((column) => (
        <option key={column.columnId} value={column.columnId} >{column.columnName}</option>
    ))

    const newColForm = () => {
        return (
            <Fragment>
                <div>
                    <div>Name</div>
                    <input name="name" type="text" onChange={handleChange} required />
                </div>
                <div>
                    <div>Column A</div>
                    <select name="colAId" onChange={handleChange} defaultValue={colAId}>
                        {cols}
                    </select>
                </div>
                <div>
                    <div>Operator</div>
                    <select name="operator" id="" onChange={handleChange}>
                        {operators.map((operator) => (
                            <option key={operator} value={operator}>{operator}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <div>Column B</div>
                    <select name="colBId" onChange={handleChange} defaultValue={colBId}>
                        {cols}
                    </select>
                </div>
            </Fragment>
        )
    }
    const newRowForm = () => {
        return (
            <Fragment>
                <div>
                    <div>Name</div>
                    <input name="name" type="text" onChange={handleChange} required />
                </div>
                <div>
                    <div>Column A</div>
                    <select name="colAId" onChange={handleChange} defaultValue={colAId}>
                        {onlyTimeBasedCols}
                    </select>
                </div>
                <div>
                    <div>Formula</div>
                    <select name="formula" id="" onChange={handleChange}>
                        <option key={formula} value={formula}>{formula}</option>
                    </select>
                </div>
                <div>
                    <div>Column B</div>
                    <select name="colBId" onChange={handleChange} defaultValue={colBId}>
                        {cols}
                    </select>
                </div>
            </Fragment>
        )
    }

    return (
        <div className="create-column-container">
            <h2>New column via {mathType.toUpperCase()}</h2>
            <form onSubmit={handleNewColumn} >
                {mathType === 'column' ? newColForm() : ''}
                {mathType === 'row' ? newRowForm() : ''}
                <div>
                    <div>Finish</div>
                    <button name="submit" type="submit">Create</button>
                </div>
            </form>
        </div>
    )
}

export default CreateColumn