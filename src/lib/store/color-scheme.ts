import { useCallback } from 'react';
import { create, useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';

type ColorScheme = 'light' | 'dark';

type State = {
  colorScheme?: ColorScheme;
  setColorScheme(this: void, colorScheme?: ColorScheme): void;
  resolvedColorScheme: ColorScheme;
};

const colorScheme = globalThis.localStorage?.theme;
const media = globalThis.matchMedia?.('(prefers-color-scheme: dark)');
const documentClasses = globalThis.document?.documentElement.classList;

const store = createStore<State>(set => ({
  colorScheme,
  setColorScheme(colorScheme?: ColorScheme) {
    if (colorScheme) {
      globalThis.localStorage.theme = colorScheme;
    } else {
      globalThis.localStorage.removeItem('theme');
    }

    const toggle = colorScheme == null ? media.matches : colorScheme === 'dark';
    documentClasses.toggle('dark', toggle);
    set(() => ({
      colorScheme,
      resolvedColorScheme: toggle ? 'dark' : 'light',
    }));
  },
  resolvedColorScheme: documentClasses?.contains('dark') ? 'dark' : 'light',
}));

media?.addEventListener('change', event => {
  if (globalThis.localStorage?.theme != null) {
    return;
  }

  documentClasses.toggle('dark', event.matches);
  store.setState({ resolvedColorScheme: event.matches ? 'dark' : 'light' });
});

const useBoundStore = <T>(selector: (state: State) => T) =>
  useStore(store, selector);

export function useColorScheme() {
  return [
    useBoundStore(useCallback(state => state.colorScheme, [])),
    useBoundStore(useCallback(state => state.setColorScheme, [])),
    useBoundStore(useCallback(state => state.resolvedColorScheme, [])),
  ] as const;
}

export default store;
