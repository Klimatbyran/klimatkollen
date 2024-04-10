import {
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
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
      background: ${({ theme }) => theme.black};
      color: ${({ theme }) => theme.offWhite};
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

type Props = {
  text: string
  close: () => void
  scrollY: number
}

function InfoModal({ text, close, scrollY }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const activeElement = document.activeElement as HTMLElement

  const focusableElementsRef = useRef<HTMLElement[] | undefined>(undefined)

  const handleTab = useCallback((evt: KeyboardEvent) => {
    const total = focusableElementsRef.current?.length || 0
    const focusedElementIndex = focusableElementsRef.current?.indexOf(evt.target as HTMLElement) || -1

    let newIndex = 0

    if (!evt.shiftKey) {
      newIndex = (focusedElementIndex + 1) % total
    } else {
      newIndex = (focusedElementIndex - 1 + total) % total
    }

    focusableElementsRef.current?.[newIndex].focus()
    evt.preventDefault()
  }, [])

  const handleEscape = useCallback((evt: KeyboardEvent) => {
    if (evt.key === 'Escape') close()
  }, [close])

  const keyListenersMap = useMemo(() => new Map([
    ['Tab', handleTab],
    ['Escape', handleEscape],
  ]), [handleTab, handleEscape])

  const handleKeydown = useCallback((evt: KeyboardEvent) => {
    const listener = keyListenersMap.get(evt.code)
    return listener && listener(evt)
  }, [keyListenersMap])

  useEffect(() => {
    if (ref.current) {
      focusableElementsRef.current = Array.from(
        ref.current.querySelectorAll('a, button, textarea') as NodeListOf<HTMLElement>,
      )
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown)
    return () => {
      document.removeEventListener('keydown', handleKeydown)
      activeElement.focus()
    }
  }, [activeElement, handleKeydown])

  return (
    <Modal ref={ref} scrollY={scrollY}>
      <div>
        <div>
          {/* NOTE: Consider replacing with a translation "Stäng" accessed via common.actions.close */}
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
