import { HelpOutlineOutlined } from '@mui/icons-material';
import {
  Box,
  ClickAwayListener,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  useMediaQuery,
} from '@mui/material';
import { FunctionComponent, useState } from 'react';
import { DESKTOP_CELL_SIZE, MOBILE_CELL_SIZE, NUM_COLS, TABLET_CELL_SIZE } from '../constants';
import { getWindowSize } from '../models/global';

const TitleContainer: FunctionComponent = () => {
  // State
  const [tooltipOpen, setTooltipOpen] = useState(false);

  // Styling
  const { isMobile, isTablet } = getWindowSize(useMediaQuery);
  const cellSize = isMobile ? MOBILE_CELL_SIZE : isTablet ? TABLET_CELL_SIZE : DESKTOP_CELL_SIZE;
  const boardWidth = `${NUM_COLS} * (${cellSize})`;
  const maxWidth = `calc(${boardWidth} + ${isMobile ? '2rem' : cellSize})`;
  const helpText = (
    <Box
      sx={{
        padding: `${isMobile ? 0.3 : isTablet ? 0.5 : 1}rem`,
        fontSize: '1rem',
      }}
    >
      Click on a cell to add a block. Click the '⟲' icon to change the block, and click the '×' icon
      to remove the block. A valid board contains
      <b> exactly one </b> 2×2 block and <b> exactly two </b> free spaces. You can also click{' '}
      <em> Create Board For Me </em> to get a random board. Move the 2×2 block to the red area at
      the bottom of the board to win!
    </Box>
  );
  const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
    <ClickAwayListener onClickAway={() => setTooltipOpen(false)}>
      <Tooltip {...props} classes={{ popper: className }} />
    </ClickAwayListener>
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  });

  return (
    <StyledTooltip open={tooltipOpen} title={helpText} arrow>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'end',
          justifyContent: 'center',
          height: `${isMobile ? 2.5 : isTablet ? 3.8 : 4.95}rem`,
        }}
      >
        <Box
          sx={{
            height: '100%',
            fontSize: `${isMobile ? 2.3 : isTablet ? 3.5 : 4.5}rem`,
            fontWeight: '400',
            padding: 0,
          }}
        >
          KLOTSKI SOLVER
        </Box>
        <HelpOutlineOutlined
          color="action"
          sx={{
            marginLeft: '0.5rem',
            marginBottom: '-2px',
            fontSize: `${isMobile ? 1 : 1.2}rem`,
          }}
          onClick={() => {
            if (isMobile) setTooltipOpen(!tooltipOpen);
          }}
          onMouseEnter={() => setTooltipOpen(true)}
          onMouseLeave={() => setTooltipOpen(false)}
        />
      </Box>
    </StyledTooltip>
  );
};

export default TitleContainer;
