import styled from 'styled-components'

import Close from '../public/icons/close.svg'
import { Paragraph } from './Typography'
import { Button } from './shared'

const Modal = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  width: 100vw;
  height: 100vh;
  z-index: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;

  & div:nth-of-type(1) {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    & div {
      width: 350px;
      height: auto;
      padding: 3rem 2rem 2rem 2rem;
      display: flex;
      flex-direction: column;
      background: ${({ theme }) => theme.black};
      color: ${({ theme }) => theme.white};
      z-index: 10;
      border-radius: 16px;
      box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.04);

      & button {
        position: absolute;
        right: 1rem;
        top: 1rem;
      }
    }
  }
`

type Props = { text: string; onClick: () => void }

const InfoModal = ({ text, onClick }: Props) => {
  return (
    <Modal>
      <div>
        <div>
          <Button type="button" aria-label="Stäng information" onClick={onClick}>
            <Close />
          </Button>
          <Paragraph>{text}</Paragraph>
        </div>
      </div>
    </Modal>
  )
}

export default InfoModal
