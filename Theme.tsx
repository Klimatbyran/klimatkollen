import React, { ReactNode } from 'react'
import { ThemeProvider } from 'styled-components'

export const colorTheme = {
  black: '#181818',
  lightBlack: '#262626',
  offWhite: '#FFFDFA',

  red: '#EF3030',
  darkRed: '#8B1A1A',

  orange: '#FF6813',
  darkOrange: '#B55018',

  darkYellow: '#FFA137',
  lightYellow: '#FFE07A',

  beige: '#FFF0D0',

  lightBlue: '#81DFFF',

  lightGreen: '#67FFEE',
  midGreen: '#30ACB4',
  darkGreenOne: '#216675',
  darkGreenTwo: '#1B3940',

  gradientBlack: 'linear-gradient(#181818, #404040)',
  gradientGreen: 'linear-gradient(#216675, #30ACB4)',
  gradientOrange: 'linear-gradient(#EF3030, #FF6813)',
  gradientRed: 'linear-gradient(#EF3030, #8B1A1A)',

  // Old color scheme

  main: '#91DFC8',

  rust: '#EF5E30',
  rustOpaque: 'rgb(239, 94, 48, 0.6)',
  // red: '#EF3054',
  redOpaque: 'rgba(239, 48, 84, 0.6)',
  redDark: 'rgba(239, 48, 84, 0.2)',
  green: '#94D3C1',
  greenOpaqe: 'rgba(145, 223, 200, 0.6)',
  greenDark: 'rgba(145, 223, 200, 0.2)',

  // orange: '#EF9917',
  yellow: '#EFBF17',
  blue: '#91BFC8',

  white: '#FFFFFF',
  paperWhite: '#F9FBFF',
  mint: '#D5F2E9',

  lightlightBlack: '#B3B3B3',

  gradient: 'linear-gradient(rgba(45,45,45, 1), rgba(0,0,0, 0.0))',
}

type Props = {
  children: ReactNode
}

const Theme = ({ children }: Props) => {
  return <ThemeProvider theme={colorTheme}>{children}</ThemeProvider>
}

export default Theme
