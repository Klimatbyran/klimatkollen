import styled, { css } from 'styled-components'
import { devices } from '../utils/devices'

type BackgroundColors = 'black2' | 'transparent'

const Wrap = styled.div<{ $background: BackgroundColors }>`
  background: ${({ $background, theme }) => (
    $background === 'transparent'
      ? $background
      : theme.newColors[$background]
  )};
  width: 100%;
  display: flex;
  justify-content: center;
`

const WrapInner = styled.div<{ compact?: boolean }>`
  width: 100%;
  max-width: 840px;
  
  ${({ compact }) => (compact ? css`
    padding: 0;

    @media only screen and (${devices.tablet}) {
      padding: 0 16px;
    }
  ` : css`
    padding: 0 16px;
  `)}

  @media only screen and (${devices.tablet}) {
    padding: 32px 24px;
  }
`

type Props = {
  children: React.ReactNode
  backgroundColor?: BackgroundColors
  compact?: boolean
}

export default function PageWrapper({ children, compact, backgroundColor = 'transparent' }: Props) {
  return (
    <Wrap $background={backgroundColor}>
      <WrapInner compact={compact}>{children}</WrapInner>
    </Wrap>
  )
}
