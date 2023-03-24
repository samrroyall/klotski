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

  return (
    <Button
      sx={{
        marginX: `${isMobile ? 0.3 : 0.5}rem`,
				fontSize: `${isMobile ? 0.7 : 1}rem`,
        padding: `${isMobile ? 0.3 : 0.5}rem`,
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