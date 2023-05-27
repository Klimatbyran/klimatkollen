import styled from 'styled-components'
import Icon from '../public/icons/share.svg'
import { devices } from '../utils/devices'


const Button = styled.button<{ icon: boolean }>`
  height: 56px;
  color: ${({ theme }) => theme.black};
  background: ${({ theme }) => theme.midGreen};
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 0;
  display: flex;
  align-items: center;
  justify-content: ${({ icon }) => (icon ? 'start' : 'center')};
  padding-left: ${({ icon }) => (icon ? '20px' : '20px')};
  padding-right: ${({ icon }) => (icon ? '20px' : '20px')};
  cursor: pointer;
  fill: ${({ theme }) => theme.black};
  width: 100%;

  @media only screen and (${devices.tablet}) {
    max-width: 350px;
  }

  span {
    font-weight: bold;
    font-size: 16px;
    display: block;
    flex-grow: 1;
    margin-left: ${({ icon }) => (icon ? '20px' : '0px')};
  }

  &:hover {
    background: ${({ theme }) => theme.lightGreen};
  }

  &:focus {
    border: 2px solid ${({ theme }) => theme.offWhite};
  }

  &:disabled {
    background: ${({ theme }) => theme.lightBlack};
    color: ${({ theme }) => theme.offWhite};
    fill: ${({ theme }) => theme.offWhite};
  }
`

type ShareButtonProps = {
  handleClick?: (e: unknown) => void
  text: string
  shareIcon?: boolean
}

const ShareButton = ({ handleClick, text, shareIcon = false }: ShareButtonProps) => {
  return (
    <Button type="submit" onClick={handleClick} icon={shareIcon} >
      {shareIcon && <Icon />}
      <span>{text}</span>
    </Button>
  )
}

export default ShareButton