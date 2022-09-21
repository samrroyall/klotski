import { Box, colors, useMediaQuery } from "@mui/material";
import { FunctionComponent } from "react";
import { MOBILE_CUTOFF } from "../constants";
import { UIBlock } from "../models/global";

interface Props {
  block: UIBlock;
  show: boolean;
  onClick: () => any;
}

const AddBlockSelector: FunctionComponent<Props> = ({ block, onClick }) => {
  const isMobile = useMediaQuery(`(max-width:${MOBILE_CUTOFF}px)`);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '50%',
        width: '50%',
        color: colors.grey[400],
        '&:hover': { color: colors.grey[800] },
        fontSize: isMobile ? '0.8rem' : '1rem',
        fontWeight: 'bold',
      }}
      onClick={onClick}
    >
      {block.rows}×{block.cols}
    </Box>
  );
};

export default AddBlockSelector;