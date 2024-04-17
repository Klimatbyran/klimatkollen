import styled from 'styled-components'
import { useTranslation } from 'next-i18next'

import { H2, H5, Paragraph } from '../Typography'
import FactSection from '../FactSection'
import { Municipality } from '../../utils/types'
import EVCar from '../../public/icons/evcars_32.svg'
import Bike from '../../public/icons/bikelanes_32.svg'
import Basket from '../../public/icons/consumtion_32.svg'
import Charger from '../../public/icons/charger.svg'
import Procurements from '../../public/icons/kpis/procurements_32.svg'
import { requirementsInProcurement } from '../../utils/datasetDefinitions'

const StyledH2 = styled(H2)`
  margin-top: 32px;
  margin-bottom: 32px;
  width: 100%;
`

const StyledH5 = styled(H5)`
  margin: 32px 0 32px 16px;
`

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`

type SolutionSectionProps = {
  icon: JSX.Element
  title: string
  heading: string
  data: string
  info: string
}

function SolutionSection({
  icon, title, heading, data, info,
}: SolutionSectionProps) {
  return (
    <>
      <FlexContainer>
        {icon}
        <StyledH5>{title}</StyledH5>
      </FlexContainer>
      <FactSection heading={heading} data={data} info={info} />
    </>
  )
}

type SolutionsProps = {
  municipality: Municipality
}

function MunicipalitySolutions({ municipality }: SolutionsProps) {
  const { t } = useTranslation()
  return (
    <>
      <StyledH2>{t('municipality:solutions.title')}</StyledH2>
      <Paragraph>
        {t('municipality:solutions.description')}
      </Paragraph>
      <SolutionSection
        icon={<Basket />}
        title={t('municipality:solutions.household.title')}
        heading={t('municipality:solutions.household.heading')}
        data={t('municipality:tonnes', { amount: municipality.TotalConsumptionEmission.toFixed(1) })}
        info={t('municipality:solutions.household.info')}
      />
      <SolutionSection
        icon={<Procurements />}
        title={t('municipality:solutions.procurement.title')}
        heading={t('municipality:solutions.procurement.heading')}
        data={requirementsInProcurement(municipality.ProcurementScore, t)}
        info={t('municipality:solutions.procurement.info')}
      />
      <SolutionSection
        icon={<EVCar />}
        title={t('municipality:solutions.electricCars.title')}
        heading={t('municipality:solutions.electricCars.heading')}
        data={t('municipality:percentagePoints', { num: (municipality.ElectricCarChangePercent * 100).toFixed(1) })}
        info={t('municipality:solutions.electricCars.info')}
      />
      <SolutionSection
        icon={<Charger />}
        title={t('municipality:solutions.chargers.title')}
        heading={t('municipality:solutions.chargers.heading')}
        data={`${municipality.ElectricVehiclePerChargePoints < 1e10
          ? municipality.ElectricVehiclePerChargePoints.toFixed(1)
          : t('common:datasets.missingChargers')}`}
        info={t('municipality:solutions.chargers.info')}
      />
      <SolutionSection
        icon={<Bike />}
        title={t('municipality:solutions.bikes.title')}
        heading={t('municipality:solutions.bikes.heading')}
        data={t('municipality:solutions.bikes.meters', { meters: municipality.BicycleMetrePerCapita.toFixed(1) })}
        info={t('municipality:solutions.bikes.info')}
      />
    </>
  )
}

export default MunicipalitySolutions
