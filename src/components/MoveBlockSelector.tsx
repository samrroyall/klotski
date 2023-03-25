import { Box, colors } from '@mui/material';
import { FunctionComponent } from 'react';

interface Props {
  size: number;
  show: boolean;
  onClick: () => any;
}

const MoveBlockSelector: FunctionComponent<Props> = ({ size, show, onClick }) => (
  <Box
    sx={{
      height: `${size}rem`,
      width: `${size}rem`,
      backgroundColor: colors.deepPurple[300],
      '&:hover': { backgroundColor: colors.deepPurple[400] },
      zIndex: show ? 20 : 0,
    }}
    onClick={onClick}
  ></Box>
);

export default MoveBlockSelector;
