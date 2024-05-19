import styled from 'styled-components'
import { DataDescriptions, DatasetKey } from '../utils/types'
import { devices } from '../utils/devices'

const ButtonContainer = styled.div`
  margin: 8px 0 32px 0;
  gap: 8px;
  display: flex;
  font-weight: bolder;
  flex-wrap: wrap;
  justify-content: center;

  @media only screen and (${devices.tablet}) {
    margin: 16px 0;
    gap: 16px;
  }
`

const Button = styled.button<{active: boolean}>`
  padding: 8px 16px;
  font-family: 'Anonymous Pro';
  font-size: 16px;
  text-decoration: none;
  line-height: 19px;
  color: ${({ theme }) => theme.offWhite};
  background: ${({ theme }) => theme.lightBlack};
  border: none;
  border-radius: 8px;
  white-space: nowrap;
  box-sizing: border-box;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.darkGreenTwo};
  }

  ${({ theme, active }) => active && `
    color: ${theme.black};
    background: ${theme.midGreen};

    &:hover {
      background-color: ${theme.lightGreen};
  }
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
