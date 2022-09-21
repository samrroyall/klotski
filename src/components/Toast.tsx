import { FunctionComponent } from 'react';
import { Alert, Box, Slide, useMediaQuery } from '@mui/material';
import { Severity } from '../state/appSlice';
import { MOBILE_CUTOFF } from '../constants';

interface Props {
  msg: string;
  severity: Severity;
}

export const Toast: FunctionComponent<Props> = ({ msg, severity }) => {
  const isMobile = useMediaQuery(`(max-width:${MOBILE_CUTOFF}px)`);

  return (
    <Box>
      <Slide direction="down" in={true} mountOnEnter unmountOnExit>
        <Alert sx={{ 
          marginBottom: isMobile ? '0.2rem' : '0.5rem', 
          width: isMobile ? '90%' : '30rem',
          marginX: 'auto',
        }} severity={severity}>
          {msg}
        </Alert>
      </Slide>
    </Box>
  );
};
