import styled from 'styled-components'
import Icon from '../public/icons/share.svg'

const Button = styled.button<{ icon: boolean }>`
  width: 280px;
  height: 56px;
  color: ${({ theme }) => theme.black};
  background: ${({ theme }) => theme.main};
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 0;
  display: flex;
  align-items: center;
  justify-content: ${({ icon }) => (icon ? 'start' : 'center')};
  padding-left: ${({ icon }) => (icon ? '20px' : '0%')};
  cursor: pointer;
  fill: ${({ theme }) => theme.black};
  p {
    font-weight: bold;
    font-size: 16px;
    margin-left: ${({ icon }) => (icon ? '30%' : '0%')};
  }

  &:hover {
    background: ${({ theme }) => theme.greenGraphTwo};
  }

  &:focus {
    border: 2px solid ${({ theme }) => theme.white};
  }

  &:disabled {
    background: ${({ theme }) => theme.grey};
    color: ${({ theme }) => theme.white};
    fill: ${({ theme }) => theme.white};
  }
`

type ShareButtonProps = {
  handleClick: () => void
  text: string
  shareIcon?: boolean
}

const ShareButton = ({ handleClick, text, shareIcon = false }: ShareButtonProps) => {
  return (
    <Button type="button" onClick={handleClick} icon={shareIcon}>
      {shareIcon && <Icon />}
      <p>{text}</p>
    </Button>
  )
}

export default ShareButton
