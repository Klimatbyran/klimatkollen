import styled from 'styled-components'
import { devices } from '../utils/devices'

type BackgroundColors = 'darkGrey' | 'darkestGrey' | 'gradient'

const Wrap = styled.div<{ background: BackgroundColors }>`
  background: ${({ background, theme }) => theme[background]};
  width: 100%;
  display: flex;
  justify-content: center;
`

const WrapInner = styled.div`
  width: 100%;
  max-width: 840px;
  padding: 40px 20px;

  @media only screen and (${devices.tablet}) {
    padding: 30px 20px;
  }
`

type Props = {
  children: React.ReactNode
  backgroundColor: BackgroundColors
}

export default function PageWrapper({ children, backgroundColor }: Props) {
  return (
    <Wrap background={backgroundColor}>
      <WrapInner>{children}</WrapInner>
    </Wrap>
  )
}
