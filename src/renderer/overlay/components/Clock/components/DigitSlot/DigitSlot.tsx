import { Box } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

import type { Props } from './DigitSlot.types';

function DigitSlot({ char, id }: Props) {
  if (!/\d/.test(char)) {
    return (
      <Box
        component="span"
        sx={{
          display: 'inline-block',
          fontSize: '28px',
          fontWeight: 'bold',
          color: 'white',
          fontFamily: 'Comfortaa, sans-serif',
        }}
      >
        {char}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-block',
        overflow: 'hidden',
        width: '1rem',
        height: '2em',
        verticalAlign: 'top',
      }}
    >
      <AnimatePresence initial={false}>
        <motion.span
          key={`${id}-${char}`}
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          style={{
            display: 'block',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            textAlign: 'center',
            fontSize: '28px',
            fontWeight: 'bold',
            color: 'white',
            fontFamily: 'Comfortaa, sans-serif',
          }}
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </Box>
  );
}

export default DigitSlot;
