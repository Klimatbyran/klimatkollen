import styled, { css } from 'styled-components'
import { devices } from '../utils/devices'

const ToggleBtn = styled.button<{ viewMode: string }>`
  height: 32px;
  margin: 16px;
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

  @media only screen and (${devices.mobile}) {
    margin: 12px;
  }

  ${({ viewMode }) => viewMode === 'lista'
  && css`
      position: static;
      width: 98%;
      height: 40px;
      margin: 1%;;
      background: ${({ theme }) => theme.midGreen};
      justify-content: center;
      color: ${({ theme }) => theme.black};

      @media only screen and (${devices.mobile}) {
        width: 96%;
        height: 40px;
        margin: 2%;;
      }
    `}
`

const ToggleText = styled.p`
  margin-right: 8px;
  font-size: 14px;
  font-family: 'Borna';
  @media only screen and (${devices.mobile}) {
    font-size: 12px;
  }
`

const IconContainer = styled.div`
  border-radius: 12px;
  border: none;
  background: ${({ theme }) => theme.midGreen};
  padding: 8px 8px 5px 8px;
`

type ToggleButtonProps = {
  handleClick?: (e: unknown) => void
  text: string
  icon: JSX.Element
  viewMode: string
}

function ToggleButton({
  handleClick, text, icon, viewMode,
}: ToggleButtonProps) {
  return (
    <ToggleBtn onClick={handleClick} viewMode={viewMode}>
      <ToggleText>{text}</ToggleText>
      <IconContainer>{icon}</IconContainer>
    </ToggleBtn>
  )
}

export default ToggleButton
