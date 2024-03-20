import React, { useState } from 'react'
import styled from 'styled-components'

const SwitchLabel = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 240px; 
  height: 56px;
  background: ${({ theme }) => theme.lightGreen};
  border-radius: 28px;
  margin-bottom: 40px;
  cursor: pointer;
`

const Slider = styled.div<{ isActive: boolean }>`
  position: absolute;
  top: 4px;
  left: ${({ isActive }) => (isActive ? 'calc(100% - 122px)' : '4px')}; /* Width of the switch - width of slider */
  width: 120px; /* Width of the slider */
  height: 48px; /* Height of the slider */
  background: #fff;
  border-radius: 48px; /* Half of the height to make it pill-shaped */
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  z-index: 1;
`

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`

const TextLeft = styled.span`
  position: absolute;
  left: 16px;
  color: black;
  pointer-events: none; /* ignore pointer events so label still triggers input */
  z-index: 10;
`

const TextRight = styled.span`
  position: absolute;
  right: 16px;
  color: black;
  pointer-events: none;
  z-index: 10;
`

type PillSwitchProps = {
  onToggle: (isActive: boolean) => void
}

function PillSwitch({ onToggle }: PillSwitchProps) {
  const [isActive, setIsActive] = useState(true)

  const handleToggle = () => {
    const newIsActive = !isActive
    setIsActive(newIsActive)
    onToggle(newIsActive)
  }

  return (
    <SwitchLabel>
      <TextLeft>Företag</TextLeft>
      <TextRight>Geografiskt</TextRight>
      <Slider isActive={isActive} />
      <SwitchInput
        type="checkbox"
        checked={isActive}
        onClick={handleToggle}
      />
    </SwitchLabel>
  )
}

export default PillSwitch
