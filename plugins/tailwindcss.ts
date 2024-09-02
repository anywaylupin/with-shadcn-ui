import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette';
import plugin from 'tailwindcss/plugin';
import svgToDataUri from 'mini-svg-data-uri';

export const AddVariablesForColors = plugin(({ addBase, theme }) => {
  const allColors = flattenColorPalette(theme('colors'));
  const newVars = Object.fromEntries(Object.entries(allColors).map(([key, val]) => [`--${key}`, val]));

  addBase({ ':root': newVars });
});

export const AuroraBackground = plugin(({ addComponents }) => {
  addComponents({
    '.bg-aurora': {
      '--aurora':
        'repeating-linear-gradient(100deg,var(--blue-500) 10%,var(--indigo-300) 15%,var(--blue-300) 20%,var(--violet-200) 25%,var(--blue-400) 30%)',
      '--dark-gradient':
        'repeating-linear-gradient(100deg,var(--black) 0%,var(--black) 7%,var(--transparent) 10%,var(--transparent) 12%,var(--black) 16%)',
      '--white-gradient':
        'repeating-linear-gradient(100deg,var(--white) 0%,var(--white) 7%,var(--transparent) 10%,var(--transparent) 12%,var(--white) 16%)',
      backgroundImage: 'var(--white-gradient),var(--aurora)',
      backgroundPosition: '50% 50%,50% 50%',
      backgroundSize: '300%, 200%',
      maskImage: 'radial-gradient(ellipse at 100% 0%,black 10%,var(--transparent) 70%)'
    },
    '.bg-aurora::after': {
      content: '""',
      backgroundAttachment: 'fixed',
      backgroundImage: 'var(--white-gradient),var(--aurora)',
      backgroundSize: '200%, 100%'
    }
  });
});

/**
 * @link https://ui.aceternity.com/components/grid-and-dot-backgrounds
 */
export const GridAndDotsBackground = plugin(({ matchUtilities, theme }) => {
  matchUtilities(
    {
      'bg-grid': (value) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
        )}")`
      }),
      'bg-grid-small': (value) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
        )}")`
      }),
      'bg-dot': (value) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
        )}")`
      }),
      'bg-dot-thick': (value) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="2.5"></circle></svg>`
        )}")`
      })
    },
    { values: flattenColorPalette(theme('backgroundColor')), type: 'color' }
  );
});
