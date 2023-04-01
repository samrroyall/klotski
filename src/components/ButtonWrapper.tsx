import { Button, SxProps, Theme } from '@mui/material';
import { FunctionComponent, useContext } from 'react';
import { SizeContext } from '../App';

interface Props {
  title: string;
  onClick: () => any;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

const ButtonWrapper: FunctionComponent<Props> = ({ title, onClick, disabled, sx }) => {
  const { isMobile } = useContext(SizeContext);

  return (
    <Button
      sx={{
        marginX: `${isMobile ? 0.2 : 0.5}rem`,
        fontSize: isMobile ? '0.9rem' : '1rem',
        paddingX: `${isMobile ? 0.3 : 0.5}rem`,
        paddingY: `${isMobile ? 0.1 : 0.3}rem`,
        ...sx,
      }}
      variant="outlined"
      size="medium"
      disabled={disabled || false}
      onClick={onClick}
    >
      {title}
    </Button>
  );
};

export default ButtonWrapper;
