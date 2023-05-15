import { Menu, MenuItem } from '@blueprintjs/core';

type ColumnMenuProps = {
  onAddColumn: (direction: 1 | -1) => void;
  onRemoveColumn: () => void;
  onAddCalculation: () => void;
};

const ColumnMenu: React.FC<ColumnMenuProps> = (props) => {
  return (
    <Menu>
      <MenuItem
        icon="derive-column"
        text="Add calculation"
        onClick={() => {
          props.onAddCalculation();
        }}
      />
      <MenuItem
        icon="add-column-left"
        text="Add column left"
        onClick={() => {
          props.onAddColumn(-1);
        }}
      />
      <MenuItem
        icon="add-column-right"
        text="Add column right"
        onClick={() => {
          props.onAddColumn(1);
        }}
      />
      <MenuItem
        icon="trash"
        text="Remove column"
        onClick={() => {
          props.onRemoveColumn();
        }}
      />
    </Menu>
  );
}

export default ColumnMenu;