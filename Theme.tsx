import { ReactNode } from 'react'
import { ThemeProvider } from 'styled-components'

const colors2024 = {
  gray: {
    50: '#F7F7F7',
    100: '#E1E1E1',
    150: '#C3C3C3',
    200: '#A5A5A5',
    250: '#878787',
    300: '#444444',
    350: '#5B5B5B',
    400: '#717171',
    500: '#2E2E2E',
    600: '#272727',
    650: '#202020',
    700: '#191919',
    750: '#121212',
    800: '#0E0E0E',
    850: '#090909',
    900: '#050505',
    950: '#000000',
  },
  orange: {
    50: '#FEE7CD',
    100: '#FEDBB4',
    150: '#FDCF9A',
    200: '#FDC381',
    250: '#FDB768',
    300: '#FBAD59',
    350: '#F9A349',
    400: '#F6993A',
    500: '#F48F2A',
    600: '#E38320',
    650: '#D37715',
    700: '#C26B0B',
    750: '#B25F00',
    800: '#A05500',
    850: '#8E4B00',
    900: '#7D4100',
    950: '#6B3700',
  },
  blue: {
    50: '#D4E7F7',
    100: '#C5DFFA',
    150: '#B6DAFB',
    200: '#A7D5FD',
    250: '#99CFFF',
    300: '#96CDFD',
    350: '#79B7F0',
    400: '#69ACE9',
    500: '#59A0E1',
    600: '#4B90CB',
    650: '#3D81B5',
    700: '#2E729E',
    750: '#206288',
    800: '#1D577A',
    850: '#1A4C6B',
    900: '#16415D',
    950: '#13364E',
  },
  green: {
    50: '#F1FFCC',
    100: '#E7FEA5',
    150: '#E3FD95',
    200: '#DEFD86',
    250: '#D5FD63',
    300: '#CDFA4C',
    350: '#C5F735',
    400: '#BCF51D',
    500: '#AAE506',
    600: '#9AD006',
    650: '#8BBB06',
    700: '#7CA605',
    750: '#6C9105',
    800: '#608009',
    850: '#556E0E',
    900: '#495D12',
    950: '#3D4B16',
  },
  pink: {
    50: '#FAE1E9',
    100: '#F5C6D4',
    150: '#F3B9CB',
    200: '#F0ADC1',
    250: '#EEA0B7',
    300: '#EF95B0',
    350: '#EF8AA9',
    400: '#F080A1',
    500: '#F0759A',
    600: '#DA698B',
    650: '#C35D7C',
    700: '#AD516C',
    750: '#97455D',
    800: '#8E3D55',
    850: '#85364D',
    900: '#7C2E45',
    950: '#73263D',
  },
}

const namedColors2024 = {
  white: colors2024.gray[50],
  gray: colors2024.gray[250],
  black1: colors2024.gray[500],
  black2: colors2024.gray[750],
  black3: colors2024.gray[950],

  orange1: colors2024.orange[50],
  orange2: colors2024.orange[250],
  orange3: colors2024.orange[500],
  orange4: colors2024.orange[750],
  orange5: colors2024.orange[950],

  blue1: colors2024.blue[50],
  blue2: colors2024.blue[250],
  blue3: colors2024.blue[500],
  blue4: colors2024.blue[750],
  blue5: colors2024.blue[950],

  green1: colors2024.green[50],
  green2: colors2024.green[250],
  green3: colors2024.green[500],
  green4: colors2024.green[750],
  green5: colors2024.green[950],

  pink1: colors2024.pink[50],
  pink2: colors2024.pink[250],
  pink3: colors2024.pink[500],
  pink4: colors2024.pink[750],
  pink5: colors2024.pink[950],
}

export const colorTheme = {
  newColors: namedColors2024,
  huePalette: colors2024,

  black: '#181818', // replace with black3
  lightBlack: '#262626', // replace with black2
  grey: '#939393', // replace with gray
  offWhite: '#FFFDFA', // replace with white

  red: '#EF3030',
  darkRed: '#8B1A1A',
  darkRedOpaque: 'rgba(139, 26, 26, 0.6)',
  darkDarkRed: '#450d0d',

  orange: '#FF6813',
  darkOrange: '#B55018',
  darkOrangeOpaque: 'rgb(181, 80, 24, 0.6)',

  darkYellow: '#FFA137',
  lightYellow: '#FFE07A',

  beige: '#FFF0D0',

  lightBlue: '#81DFFF',

  lightGreen: '#15D8D8',
  lightGreenOpaqe: 'rgba(103, 255, 238, 0.6)',
  lightGreenDark: 'rgb(0, 179, 159, 0.2)',

  midGreen: '#30ACB4',
  darkGreenOne: '#216675',
  darkGreenTwo: '#1B3940',

  gradientBlack: 'linear-gradient(#181818, #404040)',
  gradientGreen: 'linear-gradient(#216675, #30ACB4)',
  gradientOrange: 'linear-gradient(#EF3030, #FF6813)',
  gradientRed: 'linear-gradient(#EF3030, #8B1A1A)',
}

type Props = {
  children: ReactNode
}

export type ColorTheme = typeof colorTheme

function Theme({ children }: Props) {
  return <ThemeProvider theme={colorTheme}>{children}</ThemeProvider>
}

export default Theme
