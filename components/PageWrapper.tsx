import styled, { css } from 'styled-components'
import { devices } from '../utils/devices'

type BackgroundColors = 'midGreen' | 'lightBlack' | 'black' | 'gradient'

const Wrap = styled.div<{ $background: BackgroundColors }>`
  background: ${({ $background, theme }) => theme[$background]};
  width: 100%;
  display: flex;
  justify-content: center;
`

const WrapInner = styled.div<{ compact?: boolean }>`
  width: 100%;
  max-width: 840px;
  
  ${({ compact }) => (compact ? css`
    padding: 0;

    @media only screen and (${devices.smallMobile}) {
      padding: 0px 16px;
    }
  ` : css`
    padding: 0px 16px;
  `)}

  @media only screen and (${devices.tablet}) {
    padding: 32px 24px;
  }
`

type Props = {
  children: React.ReactNode
  backgroundColor: BackgroundColors
  compact?: boolean
}

export default function PageWrapper({ children, backgroundColor, compact }: Props) {
  return (
    <Wrap $background={backgroundColor}>
      <WrapInner compact={compact}>{children}</WrapInner>
    </Wrap>
  )
}
