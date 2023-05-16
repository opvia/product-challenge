import * as React from 'react';
import {
  Overlay,
  Card,
  ControlGroup,
  InputGroup,
  Button,
} from '@blueprintjs/core';

const wrapperStyle: React.CSSProperties = {
  margin: 'auto',
  width: '50%',
  position: 'relative',
  marginTop: '2rem',
};

type FormulaDialogProps = {
  onClose?: () => void;
  onSubmit: (formula: string) => void;
  isOpen?: boolean;
  formula?: string;
};

const FormulaDialog: React.FC<FormulaDialogProps> = ({
  onClose,
  isOpen,
  onSubmit,
  formula = '',
}) => {
  const [value, setValue] = React.useState(formula);

  React.useEffect(() => {
    setValue(formula.trim());
  }, [formula]);

  const submit = () => {
    onSubmit(value.trim());
  };

  return (
    <Overlay onClose={onClose} isOpen={isOpen}>
      <div style={wrapperStyle}>
        <Card>
          <h4>Write the formula</h4>
          <p>Columns can be specified by letter, like A, B, C ...</p>
          <p>Allowed operators: + - * /</p>
          <p>Allowed functions: SUM, AVERAGE, MIN, MAX, MEDIAN</p>
          <br />
          <ControlGroup fill={true} vertical={false}>
            <InputGroup
              fill={true}
              placeholder="A + B + C ..."
              value={value}
              autoFocus={true}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit();
              }}
            />
            <Button icon="arrow-right" onClick={() => submit()} />
          </ControlGroup>
        </Card>
      </div>
    </Overlay>
  );
};

export default FormulaDialog;