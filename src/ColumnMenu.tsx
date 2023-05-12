import { Menu, MenuItem } from '@blueprintjs/core';

type Props = {
  onAddColumn: (direction: 1 | -1) => void;
  onEditName: () => void;
};

export default function ColumnMenu(props: Props) {
  return (
    <Menu>
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
        icon="edit"
        text="Edit column name"
        onClick={() => {
          props.onEditName();
        }}
      />
    </Menu>
  );
}
