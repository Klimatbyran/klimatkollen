import { ReactNode } from 'react'
import { ThemeProvider } from 'styled-components'

const colors = {
  black: '#181818',
  lightBlack: '#262626',
  grey: '#939393',
  offWhite: '#FFFDFA',

  red: '#EF3030',
  redOpaque: 'rgba(239, 48, 48, 0.6)',
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

  sectors: {
    transports: {
      border: '',
      fill: '',
    },
    industry: {
      border: '',
      fill: '',
    },
    agriculture: {
      border: '',
      fill: '',
    },
    energy: {
      border: '',
      fill: '',
    },
    other: {
      border: '',
      fill: '',
    },
  },
}

colors.sectors = {
  transports: {
    border: colors.midGreen,
    fill: `${colors.midGreen}56`,
  },
  industry: {
    border: colors.lightBlue,
    fill: `${colors.lightBlue}56`,
  },
  agriculture: {
    border: colors.orange,
    fill: `${colors.orange}56`,
  },
  energy: {
    border: colors.darkYellow,
    fill: `${colors.darkYellow}56`,
  },
  other: {
    border: colors.red,
    fill: `${colors.red}56`,
  },
}

export const colorTheme = colors

export const spacingTheme = {
  smallSpacing: '8px',
}

type Props = {
  children: ReactNode
}

function Theme({ children }: Props) {
  return <ThemeProvider theme={colorTheme}>{children}</ThemeProvider>
}

export default Theme
