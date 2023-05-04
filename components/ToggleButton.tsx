import styled from 'styled-components'

const ToggleBtn = styled.button`
  width: 112px;
  height: 36px;
  margin-top: 3rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.paperWhite};
  background: transparent;
  border-radius: 4px;
  border: 1px solid white;
  padding: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: ${({ theme }) => theme.darkGrey};
  }
`

const ToggleText = styled.p`
  margin-left: 8px;
  font-size: 14px;
`

type ToggleButtonProps = {
  handleClick?: (e: any) => void
  text: string
  icon: JSX.Element
}

const ToggleButton = ({ handleClick, text, icon }: ToggleButtonProps) => {
  return (
    <ToggleBtn onClick={handleClick}>
      {icon}
      <ToggleText>
        {text}
      </ToggleText>
    </ToggleBtn >
  )
}

export default ToggleButton