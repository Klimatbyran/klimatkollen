import styled, { css } from 'styled-components'
import { DataDescriptions, DatasetKey } from '../utils/types'
import { devices } from '../utils/devices'

const ButtonContainer = styled.div`
  margin: 8px 0 32px 0;
  gap: 8px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  @media only screen and (${devices.tablet}) {
    margin: 16px 0;
    gap: 16px;
  }
`

const Button = styled.button<{active: boolean}>`
  padding: 8px 16px;
  font-size: 16px;
  font-weight: 400;
  text-decoration: none;
  color: ${({ theme }) => theme.newColors.white};
  background: ${({ theme }) => theme.newColors.black2};
  border: none;
  border-radius: 8px;
  white-space: nowrap;
  box-sizing: border-box;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.newColors.black3};
    background: ${({ theme }) => theme.newColors.blue1};
  }

  ${({ theme, active }) => active && css`
    color: ${theme.newColors.black3};
    background: ${theme.newColors.blue2} !important;
  `}
`

type MenuProps = {
  selectedData: DatasetKey
  handleDataChange: (newData: DatasetKey) => void
  dataDescriptions: DataDescriptions
}

function DatasetButtonMenu({ selectedData, handleDataChange, dataDescriptions }: MenuProps) {
  const datasetKeys = Object.keys(dataDescriptions) as DatasetKey[]
  return (
    <ButtonContainer>
      {datasetKeys.map((key) => (
        <Button
          key={key}
          active={selectedData === key}
          onClick={() => handleDataChange(key)}
        >
          {dataDescriptions[key].name}
        </Button>
      ))}
    </ButtonContainer>
  )
}

export default DatasetButtonMenu
