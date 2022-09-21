import { Button, SxProps, Theme, useMediaQuery } from "@mui/material";
import { FunctionComponent } from "react";
import { MOBILE_CUTOFF } from "../constants";

interface Props {
  title: string;
  onClick: () => any;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

const ButtonWrapper: FunctionComponent<Props> = ({ title, onClick, disabled, sx }) => {
  const isMobile = useMediaQuery(`(max-width:${MOBILE_CUTOFF}px)`);
  const size = isMobile ? 'small' : 'medium';

  return (
    <Button
      sx={{
        ...sx,
        fontSize: `${isMobile ? '0.6rem' : '1rem'} !important`,
      }}
      variant="outlined"
      size={size}
      disabled={disabled || false}
      onClick={onClick}
    >
      {title}
    </Button>
  );
};

export default ButtonWrapper;