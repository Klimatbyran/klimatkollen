import styled from 'styled-components'

const ToggleBtn = styled.button`
  width: 112px;
  height: 36px;
  margin-top: 1rem;
  margin-right: 1rem;
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
  justify-content: center;
  z-index: 150;
  &:hover {
    background: ${({ theme }) => theme.lightBlack};
  }
`

const ToggleText = styled.p`
  margin-right: 8px;
  font-size: 16px;
  font-family: 'Borna';
`

const IconContainer = styled.div`
  border-radius: 12px;
  border: none;
  background: ${({ theme }) => theme.darkGreenOne};
  padding: 8px;
`

type ToggleButtonProps = {
  handleClick?: (e: unknown) => void
  text: string
  icon: JSX.Element
}

const ToggleButton = ({ handleClick, text, icon }: ToggleButtonProps) => {
  return (
    <ToggleBtn onClick={handleClick}>
      <ToggleText>{text}</ToggleText>
      <IconContainer>{icon}</IconContainer>
    </ToggleBtn>
  )
}

export default ToggleButton
