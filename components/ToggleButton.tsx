import styled from 'styled-components'
import { devices } from '../utils/devices'

const ToggleBtn = styled.button`
  height: 36px;
  margin: 12px 4px 12px 12px;
  margin-right: 4px;
  position: absolute;
  top: 0;
  right: 0;
  color: ${({ theme }) => theme.offWhite};
  background: transparent;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: right;
  z-index: 150;

  @media only screen and (${devices.smallMobile}) {
    margin-right: 12px;
  }
`

const ToggleText = styled.p`
  margin-right: 8px;
  font-size: 12px;
  font-family: 'Borna';
  @media only screen and (${devices.tablet}) {
    font-size: 14px;
  }
`

const IconContainer = styled.div`
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.midGreen};
  padding: 8px 8px 5px 8px;
`

type ToggleButtonProps = {
  handleClick?: (e: unknown) => void
  text: string
  icon: JSX.Element
}

function ToggleButton({ handleClick, text, icon }: ToggleButtonProps) {
  return (
    <ToggleBtn onClick={handleClick}>
      <ToggleText>{text}</ToggleText>
      <IconContainer>{icon}</IconContainer>
    </ToggleBtn>
  )
}

export default ToggleButton
