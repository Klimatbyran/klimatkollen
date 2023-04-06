import React, { ReactNode } from 'react'
import { ThemeProvider, DefaultTheme } from 'styled-components'

const colorTheme: DefaultTheme = {
  main: '#91DFC8',
  greenGraphOne: '#6BA292',
  greenGraphTwo: '#94D3C1',
  greenGraphThree: '#DDF1EB',
  yellow: '#EFBF17',
  darkYellow: '#BF9812',
  red: '#EF3054',
  white: '#FFFFFF',
  paperWhite: '#F9FBFF',
  lightGrey: '#B3B3B3',
  grey: '#6C6C6C',
  darkGrey: '#424242',
  darkestGrey: '#2D2D2D',
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
