import { Fragment } from 'react'
import styled from 'styled-components'
import { DataDescriptions, SelectedData } from '../utils/types'
import { devices } from '../utils/devices'

const RadioContainer = styled.div`
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

const RadioLabel = styled.label`
  padding: 8px 16px;
  font-family: 'Anonymous Pro';
  font-size: 16px;
  text-decoration: none;
  color: ${({ theme }) => theme.offWhite};
  background: ${({ theme }) => theme.lightBlack};
  border: none;
  border-radius: 8px;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.darkGreenTwo};
  }
`

const RadioInput = styled.input`
  display: none;
  &:checked + ${RadioLabel} {
    color: ${({ theme }) => theme.black};
    background: ${({ theme }) => theme.midGreen};

    &:hover {
      background: ${({ theme }) => theme.lightGreen};
    }
  }
`

type MenuProps = {
  selectedData: SelectedData
  handleDataChange: (newData: SelectedData) => void
  dataDescriptions: DataDescriptions
}

function RadioButtonMenu({ selectedData, handleDataChange, dataDescriptions }: MenuProps) {
  const datasetKeys = Object.keys(dataDescriptions)
  return (
    <RadioContainer>
      {datasetKeys.map((option) => (
        <Fragment key={option}>
          <RadioInput
            type="radio"
            id={option}
            value={option}
            checked={selectedData === option}
            onChange={() => handleDataChange(option)}
          />
          <RadioLabel htmlFor={option}>{option}</RadioLabel>
        </Fragment>
      ))}
    </RadioContainer>
  )
}

export default RadioButtonMenu
