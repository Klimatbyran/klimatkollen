import React, { ReactNode } from 'react'
import { ThemeProvider } from 'styled-components'

export const colorTheme = {
  black: '#181818',
  lightBlack: '#262626',
  offWhite: '#FFFDFA',

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

  lightGreen: '#67FFEE',
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

export const spacingTheme = {
  smallSpacing: '8px',
}

type Props = {
  children: ReactNode
}

const Theme = ({ children }: Props) => {
  return <ThemeProvider theme={colorTheme}>{children}</ThemeProvider>
}

export default Theme
