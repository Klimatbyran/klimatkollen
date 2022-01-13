import React, { ReactNode } from 'react'
import { ThemeProvider, DefaultTheme } from 'styled-components'

const colorTheme: DefaultTheme = {
  main: '#91DFC8',
  greenGraphOne: '#6BA292',
  greenGraphTwo: '#94D3C1',
  greenGraphThree: '#DDF1EB',
  yellow: '#EFBF17',
  red: '#EF3054',
  white: '#FFFFFF',
  lightGrey: '#F2F2F2',
  grey: '#6C6C6C',
  dark: '#424242',
  black: '#2D2D2D',
}

type Props = {
  children: ReactNode
}

const Theme = ({ children }: Props) => {
  return <ThemeProvider theme={colorTheme}>{children}</ThemeProvider>
}

export default Theme
