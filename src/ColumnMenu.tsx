import { Menu, MenuItem } from '@blueprintjs/core';

type Props = {
  onAddColumn: (direction: 1 | -1) => void;
  onRemoveColumn: () => void;
  onAddCalculation: () => void;
};

export default function ColumnMenu(props: Props) {
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
