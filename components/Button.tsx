import styled from 'styled-components'
import { devices } from '../utils/devices'
import { Paragraph } from './Typography'

const Button = styled.button`
  height: 56px;
  color: ${({ theme }) => theme.black};
  background: ${({ theme }) => theme.midGreen};
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  cursor: pointer;
  fill: ${({ theme }) => theme.black};
  width: 100%;
  font-family: Borna;

  @media only screen and (${devices.tablet}) {
    max-width: 350px;
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
}

function ShareButton({ handleClick, text }: ShareButtonProps) {
  return (
    <Button type="submit" onClick={handleClick}>
      <Paragraph>{text}</Paragraph>
    </Button>
  )
}

export default ShareButton
