/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */

import styled from 'styled-components'
import { useRouter } from 'next/router'
import Graph from '../Graph'
import MetaTags from '../MetaTags'
import {
  MenuContainer, MenuInput, MenuLabel,
} from '../shared'
import { Municipality as TMunicipality } from '../../utils/types'
import { colorTheme } from '../../Theme'

const GraphWrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column;
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
  const router = useRouter()

  const numberInCharts = (n: number) => selectedCharts.includes(n)

  return (
    <>
      <MetaTags
        title={`Klimatkollen — Hur går det i ${municipality.Name}?`}
        // FIXME description
        description="Some description..."
        url={`${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}`}
      />
      <GraphWrapper>
        <Graph
          charts={selectedCharts}
          historical={municipality.HistoricalEmission.EmissionPerYear}
          trend={municipality.EmissionTrend.TrendPerYear}
          budget={municipality.Budget.BudgetPerYear}
        />
      </GraphWrapper>
      <MenuContainer>
        <MenuInput
          id="historical"
          type="checkbox"
          onChange={() => handleSelectCharts(0)}
          checked={numberInCharts(0)}
          $backgroundColor={colorTheme.orange}
          $hoverColor={colorTheme.lightOrange}
        />
        <MenuLabel
          htmlFor="historical"
          $borderColor={colorTheme.orange}
          $backgroundColor={colorTheme.darkOrangeOpaque}
        >
          Historiskt
        </MenuLabel>
        <MenuInput
          id="trend"
          type="checkbox"
          onChange={() => handleSelectCharts(1)}
          checked={numberInCharts(1)}
          $backgroundColor={colorTheme.red}
          $hoverColor={colorTheme.lightRed}
        />
        <MenuLabel
          htmlFor="trend"
          $borderColor={colorTheme.red}
          $backgroundColor={colorTheme.darkRedOpaque}
        >
          Trend
        </MenuLabel>
        <MenuInput
          id="paris"
          type="checkbox"
          onChange={() => handleSelectCharts(2)}
          checked={numberInCharts(2)}
          $backgroundColor={colorTheme.lightGreen}
          $hoverColor={colorTheme.lighterGreen}
        />
        <MenuLabel
          htmlFor="paris"
          $borderColor={colorTheme.lightGreen}
          $backgroundColor={colorTheme.darkGreenOne}
        >
          Parisavtalet
        </MenuLabel>
      </MenuContainer>
    </>
  )
}

export default MunicipalityEmissionGraph
