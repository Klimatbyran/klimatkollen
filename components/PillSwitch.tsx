import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'

import { devices } from '../utils/devices'

const Switch = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 240px;
  height: 40px;
  background: ${({ theme }) => theme.lightBlack};
  border-radius: 12px;
  margin-bottom: 16px;
  cursor: pointer;

  @media only screen and (${devices.tablet}) {
    width: 264px;
    height: 56px;
    margin-bottom: 40px;
  }
`

const Slider = styled.div<{ isActive: boolean }>`
  position: absolute;
  top: 4px;
  left: ${({ isActive }) => (isActive ? 'calc(50%)' : '4px')}; /* width of the switch - width of slider */
  width: calc(50% - 4px);
  height: 32px; /* height of the slider */
  background: ${({ theme }) => theme.darkGreenOne};
  border-radius: 8px;
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  z-index: 1;
  pointer-events: none;

  @media only screen and (${devices.tablet}) {
    height: 48px; /* height of the slider */
  }
`

const DataGroupLink = styled(Link)`
  position: absolute;
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.offWhite};
  z-index: 20;
  text-decoration: none;

  &:first-of-type {
    left: 0px;
  }

  &:last-of-type {
    right: 0px;
  }
`

type PillSwitchProps = {
  isActive: boolean
  links: {text: string, href: string}[]
}

function PillSwitch({ isActive, links }: PillSwitchProps) {
  const { t } = useTranslation()
  return (
    <Switch aria-label={t('common:components.PillSwitch.label')}>
      {links.map(({ text, href }) => (
        <DataGroupLink href={href} key={href}>{text}</DataGroupLink>
      ))}
      <Slider isActive={isActive} />
    </Switch>
  )
}

export default PillSwitch
