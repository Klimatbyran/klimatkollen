import React from 'react'
import styled from 'styled-components'
import Link, { type LinkProps } from 'next/link'
import { useTranslation } from 'next-i18next'

import { devices } from '../utils/devices'
import { DataGroup, defaultDataGroup } from '../pages'

const Switch = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 240px;
  height: 40px;
  background: ${({ theme }) => theme.newColors.black1};
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
  left: ${({ isActive }) => (isActive ? '50%' : '4px')}; /* width of the switch - width of slider */
  width: calc(50% - 4px);
  height: 32px; /* height of the slider */
  background: ${({ theme }) => theme.newColors.blue2};
  border-radius: 8px;
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

const DataGroupLink = styled(Link)<LinkProps & { isActive: boolean }>`
  position: absolute;
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme, isActive }) => theme.newColors[isActive ? 'black3' : 'white']};
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
  selectedDataGroup: DataGroup
  links: { text: string, href: string }[]
}

function PillSwitch({ selectedDataGroup, links }: PillSwitchProps) {
  const { t } = useTranslation()
  return (
    <Switch aria-label={t('common:components.PillSwitch.label')}>
      {links.map(({ text, href }) => (
        <DataGroupLink href={href} key={href} isActive={href.includes(selectedDataGroup)}>{text}</DataGroupLink>
      ))}
      <Slider isActive={selectedDataGroup !== defaultDataGroup} />
    </Switch>
  )
}

export default PillSwitch
