import styled from 'styled-components'
import { devices } from '../utils/devices'

const ToggleBtn = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  color: ${({ theme }) => theme.newColors.white};
  background: ${({ theme }) => `${theme.lightBlack}99`};
  padding: 4px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: right;
  z-index: 150;
`

const ToggleText = styled.p`
  padding-left: 4px;
  padding-right: 8px;
  font-size: 12px;
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
