import React, { useState } from 'react'
import styled from 'styled-components'

const SwitchLabel = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 264px; 
  height: 56px;
  background: ${({ theme }) => theme.lightBlack};
  border-radius: 28px;
  margin-bottom: 40px;
  cursor: pointer;
`

const Slider = styled.div<{ isActive: boolean }>`
  position: absolute;
  top: 4px;
  left: ${({ isActive }) => (isActive ? 'calc(50%)' : '4px')}; /* width of the switch - width of slider */
  width: calc(50% - 4px);
  height: 48px; /* height of the slider */
  background: ${({ theme }) => theme.darkGreenOne};
  border-radius: 48px;
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
  width: 50%;
  left: 0px;
  text-align: center;
  color: ${({ theme }) => theme.offWhite};
  pointer-events: none; /* ignore pointer events so label still triggers input */
  z-index: 10;
`

const TextRight = styled.span`
  position: absolute;
  width: 50%;
  right: 0px;
  text-align: center;
  color: ${({ theme }) => theme.offWhite};
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
