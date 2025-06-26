import React from 'react';
import { Howl } from 'howler';
import { useLocalStorage } from './useLocalStorage';

export const useSound = (src, volume = 0.5) => {
  const [soundEnabled] = useLocalStorage('soundEnabled', true);

  const play = React.useCallback(() => {
    if (!soundEnabled || !src) return;

    const sound = new Howl({
      src: [src],
      volume: volume,
      html5: true,
    });
    sound.play();
  }, [src, volume, soundEnabled]);

  return play;
};