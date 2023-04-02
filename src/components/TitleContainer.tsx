import { HelpOutlineOutlined } from '@mui/icons-material';
import {
  Box,
  ClickAwayListener,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from '@mui/material';
import { FunctionComponent, useContext, useState } from 'react';
import { SizeContext } from '../App';
import { NUM_COLS } from '../constants';

const TitleContainer: FunctionComponent = () => {
  // State
  const [tooltipOpen, setTooltipOpen] = useState(false);

  // Styling
  const { isMobile, isTablet, cellSize } = useContext(SizeContext);
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
      maxWidth: `calc(${NUM_COLS} * ${cellSize} + ${isMobile ? '1rem' : cellSize})`,
      marginTop: '0.25rem !important',
    },
  });

  return (
    <StyledTooltip open={tooltipOpen} title={helpText} arrow>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'end',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            fontSize: `${isMobile ? 2.3 : isTablet ? 3.5 : 4.5}rem`,
            fontFamily: "'Righteous', cursive",
            fontWeight: 400,
            lineHeight: 1,
          }}
        >
          Klotski Solver
        </Box>
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'end',
            paddingBottom: `${isMobile ? 0.23 : isTablet ? 0.4 : 0.5}rem`,
            marginLeft: '0.5rem',
          }}
        >
          <HelpOutlineOutlined
            color="action"
            sx={{
              verticalAlign: 'end',
              fontSize: `${isMobile ? 14 : 16}px`,
            }}
            onClick={() => {
              if (isMobile) setTooltipOpen(!tooltipOpen);
            }}
            onMouseEnter={() => setTooltipOpen(true)}
            onMouseLeave={() => setTooltipOpen(false)}
          />
        </Box>
      </Box>
    </StyledTooltip>
  );
};

export default TitleContainer;
