import { ReactNode } from 'react'
import { ThemeProvider } from 'styled-components'

const colors = {
  black: '#181818',
  lightBlack: '#262626',
  grey: '#939393',
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
    jordbruk: {
      border: '',
      fill: '',
    },
    heatingEnergy: {
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
    fill: `${colors.midGreen}44`,
  },
  industry: {
    border: colors.lightBlue,
    fill: `${colors.lightBlue}44`,
  },
  jordbruk: {
    border: colors.darkGreenOne,
    fill: `${colors.darkGreenOne}44`,
  },
  heatingEnergy: {
    border: colors.lightYellow,
    fill: `${colors.lightYellow}44`,
  },
  other: {
    border: colors.darkYellow,
    fill: `${colors.darkYellow}44`,
  },
}

export const colorTheme = colors

export const colorOfSector = (name: string) => ({
  'Transporter': colorTheme.sectors.transports,
  'Utrikes transporter': colorTheme.sectors.transports,

  'Industri (energi + processer)': colorTheme.sectors.industry,

  'Jordbruk': colorTheme.sectors.jordbruk,

  'Egen uppärmning av bostäder och lokaler': colorTheme.sectors.heatingEnergy,
  'El och fjärrvärme': colorTheme.sectors.heatingEnergy,

  'Arbetsmaskiner': colorTheme.sectors.other,
  'Produktanvändning (inkl. lösningsmedel)': colorTheme.sectors.other,
  'Avfall (inkl.avlopp)': colorTheme.sectors.other,
}[name] || { border: '#FFFFFF', fill: '#FFFFFF' })

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
