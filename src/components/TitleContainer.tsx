import { HelpOutlineOutlined } from '@mui/icons-material';
import {
  Box,
  ClickAwayListener,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  useTheme,
} from '@mui/material';
import { FunctionComponent, useContext, useState } from 'react';
import { SizeContext } from '../App';
import { NUM_COLS } from '../constants';

const TitleContainer: FunctionComponent = () => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const theme = useTheme();
  const { isMobile, isTablet, cellSize } = useContext(SizeContext);

  const helpText = (
    <Box
      sx={{
        padding: `${isMobile ? 0.3 : isTablet ? 0.5 : 1}rem`,
        fontSize: `${isMobile ? 0.8 : 1}rem`,
      }}
    >
      <Box style={{ marginBottom: '0.1rem' }}>
        <b>Building a Board:</b>
        <ul style={{ margin: '0' }}>
          <li>Click on an empty cell to add a block</li>
          <li>Click on a block to change its size</li>
          <li>
            Click the <b>×</b> icon to remove the block
          </li>
          <li>
            A valid board contains <em>exactly one</em> 2×2 block and <em>exactly two</em> free
            spaces
          </li>
        </ul>
      </Box>
      <Box style={{ marginBottom: '0.1rem' }}>
        <b>
          <em>Note: </em>
        </b>
        You can also click the <em>Create Board For Me</em> button to get a random board
      </Box>
      <Box style={{ marginBottom: '0.1rem' }}>
        <b style={{ display: 'block' }}>How to win:</b>
        <ul style={{ margin: '0' }}>
          <li>Move the 2×2 block to the red area at the bottom of the board </li>
        </ul>
      </Box>
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
      backgroundColor: theme.palette.background.default,
      border: `1px solid ${theme.palette.text.primary}`,
      color: theme.palette.text.primary,
    },
    [`& .${tooltipClasses.arrow}::before`]: {
      backgroundColor: theme.palette.background.default,
      border: `1px solid ${theme.palette.text.primary}`,
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
            sx={{
              verticalAlign: 'end',
              fontSize: `${isMobile ? 14 : 16}px`,
              [`& svg`]: {
                fill: theme.palette.text.primary,
              },
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
