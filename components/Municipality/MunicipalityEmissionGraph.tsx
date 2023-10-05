/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */

import styled from 'styled-components'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Graph from '../Graph'
import InfoModal from '../InfoModal'
import MetaTags from '../MetaTags'
import {
  IconButton, MenuContainer, MenuInput, MenuLabel,
} from '../shared'
import { Municipality as TMunicipality } from '../../utils/types'
import { devices } from '../../utils/devices'
import Info from '../../public/icons/info.svg'

const GraphWrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column;
`

const InfoButton = styled(IconButton)`
  height: 21px;
`

const InfoButtonWrapper = styled.div`
  @media only screen and (${devices.tablet}) {
    display: flex;
    justify-content: start;
    width: 100%;
    margin-top: -50px;
    margin-right: 1rem;
    justify-content: end;
  }
`

type EmissionGraphProps = {
  municipality: TMunicipality
  selectedCharts: number[]
  handleSelectCharts: (chart: number) => void
}

function MunicipalityEmissionGraph({
  municipality,
  selectedCharts = [0],
  handleSelectCharts,
}: EmissionGraphProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const toggleModal = () => {
    // eslint-disable-next-line no-shadow
    const { body } = document
    setIsOpen(!isOpen)
    body.style.overflow = isOpen ? '' : 'hidden'
  }

  return (
    <>
      <MetaTags
        title={`Klimatkollen — Hur går det i ${municipality.Name}?`}
        // FIXME description
        description="Some description..."
        url={`${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}`}
      />
      <GraphWrapper>
        <InfoButtonWrapper>
          <InfoButton type="button" aria-label="Om grafen" onClick={toggleModal}>
            <Info />
          </InfoButton>
        </InfoButtonWrapper>
        <Graph
          charts={selectedCharts}
          historical={municipality.HistoricalEmission.EmissionPerYear}
          trend={municipality.EmissionTrend.TrendPerYear}
          budget={municipality.Budget.BudgetPerYear}
        />
      </GraphWrapper>
      <MenuContainer>
        <MenuLabel>
          <MenuInput
            type="checkbox"
            onChange={() => handleSelectCharts(0)}
            checked={selectedCharts.includes(0)}
          />
          Historiskt
        </MenuLabel>
        <MenuLabel>
          <MenuInput
            type="checkbox"
            onChange={() => handleSelectCharts(1)}
            checked={selectedCharts.includes(1)}
          />
          Trend
        </MenuLabel>
        <MenuLabel>
          <MenuInput
            type="checkbox"
            onChange={() => handleSelectCharts(2)}
            checked={selectedCharts.includes(2)}
          />
          Parisavtalet
        </MenuLabel>
      </MenuContainer>
      {isOpen && (
        <InfoModal
          close={toggleModal}
          // Fixme
          text="Some information text..."
          // Additional logic for scrolling may be required here
          scrollY={window.scrollY}
        />
      )}
    </>
  )
}

export default MunicipalityEmissionGraph
