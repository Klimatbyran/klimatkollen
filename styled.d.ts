import 'styled-components'
import { type ColorTheme } from './Theme'

// Declare types for our styled-components Theme to provide auto-completion
declare module 'styled-components' {
  export interface DefaultTheme extends ColorTheme {}
}
