import { FunctionComponent, useState } from 'react';
import { Alert, Box, Slide } from '@mui/material';

export enum Severity {
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Success = 'success',
}

interface Props {
  msg: string;
  severity: Severity;
  closeCallback: () => any;
}

export const Toast: FunctionComponent<Props> = ({ msg, severity, closeCallback }) => {
  const [show, setShow] = useState(true);

  return (
    <Box>
      <Slide direction="down" in={show} mountOnEnter unmountOnExit>
        <Alert
          sx={{ width: '30rem' }}
          severity={severity}
          onClose={() => {
            setShow(false);
            closeCallback();
          }}
        >
          {msg}
        </Alert>
      </Slide>
    </Box>
  );
};
