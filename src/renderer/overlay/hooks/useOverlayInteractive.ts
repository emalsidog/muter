import { useEffect, useId, useRef, useState } from 'react';

import { Channels } from 'main/ipc/ipc.types';

type Options = {
  clickable?: boolean;
};

type HoverPayload = { id: string; isHovered: boolean };

export function useOverlayInteractive<T extends HTMLElement = HTMLElement>(
  options: Options = {},
) {
  const { clickable = false } = options;
  const id = useId();
  const ref = useRef<T>(null);
  const [hovered, set$hovered] = useState(false);
  const clickableRef = useRef(clickable);
  clickableRef.current = clickable;

  useEffect(() => {
    return window.electron.ipcRenderer.on(
      Channels.OVERLAY_HOVER,
      ({ id: hoverId, isHovered }: HoverPayload) => {
        if (hoverId === id) {
          set$hovered(isHovered);
        }
      },
    );
  }, [id]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const { left, top, width, height } = ref.current.getBoundingClientRect();

    window.electron.ipcRenderer.send(Channels.REGISTER_OVERLAY_ELEMENT, {
      id,
      bounds: {
        x: left + window.screenX,
        y: top + window.screenY,
        width,
        height,
      },
      clickable: clickableRef.current,
    });
  });

  useEffect(() => {
    return () => {
      window.electron.ipcRenderer.send(Channels.UNREGISTER_OVERLAY_ELEMENT, id);
    };
  }, [id]);

  return { ref, hovered };
}
