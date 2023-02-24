import { easing as easingFunctions } from 'ts-easing';

export function extractTime(date: Date) {
  return [
    date.getFullYear().toString().padStart(4, '0'),
    (date.getMonth() + 1).toString().padStart(2, '0'),
  ] as const;
}

type Coordinates = {
  x: number;
  y: number;
};

type CoordinatesTo = Coordinates & {
  duration: number;
  easing?: keyof typeof easingFunctions;
};

export function tween(
  element: HTMLElement,
  from: Coordinates,
  { duration, easing = 'inOutSine', ...to }: CoordinatesTo,
) {
  let start = -1;
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  const step = (timestamp: number) => {
    if (start < 0) {
      start = timestamp;
    }

    const elapsed = timestamp - start;
    const eased = Math.min(1, easingFunctions[easing](elapsed / duration));
    const x = from.x + dx * eased;
    const y = from.y + dy * eased;

    element.style.transform = `translate3d(${x}px, ${y}px, 0)`;

    if (elapsed < duration) {
      requestAnimationFrame(step);
      return;
    }

    element.style.transform = '';
  };

  requestAnimationFrame(step);
}
