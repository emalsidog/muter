import React, { useEffect, useState } from 'react';
import { Button, Stack, TextField, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { AnimatePresence, motion } from 'framer-motion';

import { ipcRenderer } from 'renderer/ipc-renderer';
import { Channels } from 'main/ipc/ipc.types';

import { Props } from './RecordKeybinding.types';

const allowedFKeys = Array.from({ length: 12 }, (_, i) => `F${i + 1}`);
const allowedLetters = /^[A-Z]$/;
const allowedNumbers = /^[0-9]$/;

function RecordKeybinding({ value, onFinish }: Props) {
  const [isRecordingKeyBind, set$isRecordingKeyBind] = useState(false);
  const [keybinding, set$keybinding] = useState('');

  const handleRecordKeyBind = () => {
    set$isRecordingKeyBind(!isRecordingKeyBind);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (!isRecordingKeyBind) return;

    const modifiers = [
      e.ctrlKey ? 'Ctrl' : null,
      e.shiftKey ? 'Shift' : null,
      e.altKey ? 'Alt' : null,
      e.metaKey ? 'Meta' : null,
    ].filter(Boolean);

    let mainKey: string | null = null;

    if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
      mainKey = null; // modifier only, ignore as main
    } else if (allowedFKeys.includes(e.key)) {
      mainKey = e.key;
    } else if (allowedLetters.test(e.key.toUpperCase())) {
      mainKey = e.key.toUpperCase();
    } else if (allowedNumbers.test(e.key)) {
      mainKey = e.key;
    } else {
      return;
    }

    const combo = [...modifiers, mainKey].filter(Boolean).join('+');
    set$keybinding(combo);
  };

  const handleKeyUp = () => {
    set$isRecordingKeyBind(false);

    if (onFinish) {
      onFinish(keybinding);
    }
  };

  const handleDeleteKeybinding = () => {
    if (onFinish) {
      onFinish('');
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      set$isRecordingKeyBind(false);
    }, 5000);

    if (isRecordingKeyBind) {
      ipcRenderer.send(Channels.DISABLE_KEYBINDINGS);
    } else {
      ipcRenderer.send(Channels.ENABLE_KEYBINDINGS);
    }

    return () => {
      ipcRenderer.send(Channels.ENABLE_KEYBINDINGS);
      clearTimeout(timeoutId);
    };
  }, [isRecordingKeyBind]);

  return (
    <Stack direction="row">
      <TextField
        error={isRecordingKeyBind}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        size="small"
        value={value}
        placeholder="No Keybinding Set"
        sx={{
          width: '100%',
          '& .MuiOutlinedInput-notchedOutline': {
            transition: 'border-color 0.15s ease-in-out',
          },
        }}
        slotProps={{
          input: {
            readOnly: true,
            endAdornment: (
              <Stack direction="row" alignContent="center" gap="8px">
                <motion.div
                  layout
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                  <Button
                    color={isRecordingKeyBind ? 'error' : 'primary'}
                    variant={isRecordingKeyBind ? 'outlined' : 'contained'}
                    size="small"
                    onClick={handleRecordKeyBind}
                    sx={{ minWidth: 150 }}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={isRecordingKeyBind ? 'stop' : 'edit'}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.1 }}
                      >
                        <Typography textTransform="initial" variant="body1">
                          {isRecordingKeyBind ? 'Stop recording' : 'Record'}
                        </Typography>
                      </motion.span>
                    </AnimatePresence>
                  </Button>
                </motion.div>

                <AnimatePresence mode="popLayout">
                  {!isRecordingKeyBind && value && (
                    <motion.div
                      key="delete-button"
                      layout
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                      <Button
                        color="error"
                        variant="outlined"
                        size="small"
                        onClick={handleDeleteKeybinding}
                        sx={{ minWidth: 0 }}
                      >
                        <DeleteOutlineIcon />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Stack>
            ),
          },
        }}
      />
    </Stack>
  );
}

export default RecordKeybinding;
