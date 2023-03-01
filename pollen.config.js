/** @type {import('pollen-css').Config} */
const config = pollen => ({
  output: './src/styles/pollen.css',
  modules: {
    color: {
      ...pollen.color,
      'youjitsu-1': '#a4003e',
      'youjitsu-2': '#e5025a',
    },
    scaleFluid: false,
    width: false,
    line: false,
    ease: false,
    easing: false,
    elevation: false,
    grid: false,
  },
});

module.exports = config;
