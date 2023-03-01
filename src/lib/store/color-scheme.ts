import { useCallback } from 'react';
import { create, useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';

type ColorScheme = 'light' | 'dark';

type State = {
  colorScheme: ColorScheme;
  setColorScheme(this: void, colorScheme?: ColorScheme): void;
};

const colorScheme = globalThis.localStorage?.theme;
const media = globalThis.matchMedia?.('(prefers-color-scheme: dark)');

const store = createStore<State>(set => ({
  colorScheme,
  setColorScheme(colorScheme?: ColorScheme) {
    set(() => ({ colorScheme }));
    if (colorScheme) {
      globalThis.localStorage.theme = colorScheme;
    } else {
      globalThis.localStorage.removeItem('theme');
    }

    document.documentElement.classList.toggle(
      'dark',
      colorScheme == null ? media.matches : colorScheme === 'dark',
    );
  },
}));

media?.addEventListener('change', event => {
  if (globalThis.localStorage?.theme == null) {
    document.documentElement.classList.toggle('dark', event.matches);
  }
});

const useBoundStore = <T>(selector: (state: State) => T) =>
  useStore(store, selector);

export function useColorScheme() {
  return [
    useBoundStore(useCallback(state => state.colorScheme, [])),
    useBoundStore(useCallback(state => state.setColorScheme, [])),
  ] as const;
}

export default store;
