import React, { ReactNode } from 'react'
import { ThemeProvider, DefaultTheme } from 'styled-components'

export const colorTheme = {
  main: '#91DFC8',

  rust: '#EF5E30',
  rustOpaque: 'rgb(239, 94, 48, 0.6)',
  red: '#EF3054',
  redOpaque: 'rgba(84, 46, 53, 0.6)',
  green: '#94D3C1',
  greenOpaqe: 'rgba(145, 223, 200, 0.6)',

  orange: '#EF9917',
  darkOrange: '#EF7F17',
  yellow: '#EFBF17',
  blue: '#91BFC8',

  white: '#FFFFFF',
  paperWhite: '#F9FBFF',
  mint: '#D5F2E9',

  lightGrey: '#B3B3B3',
  grey: '#6C6C6C',
  darkGrey: '#424242',
  darkestGrey: '#2D2D2D',

  dustyGreen: '#6BA292',
  darkGreen: '#2D7B64',

  gradient: 'linear-gradient(rgba(45,45,45, 1), rgba(0,0,0, 0.0))',
}

type Props = {
  children: ReactNode
}

const Theme = ({ children }: Props) => {
  return <ThemeProvider theme={colorTheme}>{children}</ThemeProvider>
}

export default Theme
