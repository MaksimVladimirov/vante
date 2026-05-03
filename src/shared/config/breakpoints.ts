export const breakpoints = {
  xs: 375,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  '2xl': 1440,
} as const;

export type Breakpoint = keyof typeof breakpoints;

export const mediaQuery = {
  xs: `(max-width: ${breakpoints.sm - 1}px)`,
  sm: `(min-width: ${breakpoints.sm}px)`,
  md: `(min-width: ${breakpoints.md}px)`,
  lg: `(min-width: ${breakpoints.lg}px)`,
  xl: `(min-width: ${breakpoints.xl}px)`,
  '2xl': `(min-width: ${breakpoints['2xl']}px)`,
  maxSm: `(max-width: ${breakpoints.md - 1}px)`,
  maxMd: `(max-width: ${breakpoints.lg - 1}px)`,
  maxLg: `(max-width: ${breakpoints.xl - 1}px)`,
};
