import { useRef, useEffect } from 'react'
import styled from 'styled-components'

import Close from '../public/icons/close.svg'
import { Paragraph } from './Typography'
import { IconButton } from './shared'
import { devices } from '../utils/devices'

const Modal = styled.div<{ scrollY: number }>`
  background-color: rgba(0, 0, 0, 0.5);
  width: 100vw;
  height: 100vh;
  z-index: 0;
  top: ${({ scrollY }) => `calc(50% + ${scrollY}px)`};
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;

  & div:nth-of-type(1) {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    & div {
      width: 70vw;
      height: auto;
      padding: 3rem 2rem 2.5rem 2rem;
      display: flex;
      flex-direction: column;
      background: ${({ theme }) => theme.darkestGrey};
      color: ${({ theme }) => theme.white};
      z-index: 10;
      border-radius: 16px;
      box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.04);

      @media only screen and (${devices.tablet}) {
        width: 350px;
      }

      & button {
        position: absolute;
        right: 1rem;
        top: 1rem;
      }
    }
  }
`

type Props = { text: string; close: () => void; scrollY: number }

function InfoModal({ text, close, scrollY }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const activeElement = document.activeElement as HTMLElement

  let focusableElements: HTMLElement[] | undefined
  let activeIndex = -1

  const handleKeydown = (evt: KeyboardEvent) => {
    // todo: replace keyCode with KeyboardEvent.code
    const listener = keyListenersMap.get(evt.keyCode)
    return listener && listener(evt)
  }

  const handleTab = (evt: KeyboardEvent) => {
    const total = focusableElements?.length
    if (!evt.shiftKey) {
      activeIndex + 1 === total ? (activeIndex = 0) : (activeIndex += 1)
      if (focusableElements) focusableElements[activeIndex].focus()
      return evt.preventDefault()
    }
    if (evt.shiftKey) {
      total && activeIndex - 1 < 0 ? (activeIndex = total - 1) : (activeIndex -= 1)
      if (focusableElements) {
        const typecastElement = focusableElements[activeIndex] as HTMLElement
        typecastElement.focus()
      }
      return evt.preventDefault()
    }
  }

  const handleEscape = (evt: KeyboardEvent) => {
    if (evt.key === 'Escape') close()
  }

  const keyListenersMap = new Map([
    [9, handleTab],
    [27, handleEscape],
  ])

  useEffect(() => {
    if (ref.current) {
      focusableElements = Array.from(
        ref.current.querySelectorAll('a, button, textarea') as NodeListOf<HTMLElement>,
      )
    }
  }, [ref])

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown)
    return () => {
      document.removeEventListener('keydown', handleKeydown)
      activeElement.focus()
    }
  }, [])

  return (
    <Modal ref={ref} scrollY={scrollY}>
      <div>
        <div>
          <IconButton type="button" aria-label="Stäng information" onClick={close}>
            <Close />
          </IconButton>
          <Paragraph>{text}</Paragraph>
        </div>
      </div>
    </Modal>
  )
}

export default InfoModal
