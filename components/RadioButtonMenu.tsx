import { Fragment } from 'react'
import styled from 'styled-components'
import { datasetKeys } from '../utils/datasetDescriptions'
import { SelectedData } from '../utils/types'
import { devices } from '../utils/devices'

const RadioContainer = styled.div`
  margin: 16px 0 32px 0;
  gap: 8px;
  display: flex;
  font-weight: bolder;
  flex-wrap: wrap;
  justify-content: center;

  @media only screen and (${devices.tablet}) {
    gap: 16px;
  }
  
`

const RadioLabel = styled.label`
  padding: 0.5rem 1rem;
  font-family: 'Anonymous Pro';
  font-size: 14px;
  line-height: 24px;
  text-decoration: none;
  color: ${({ theme }) => theme.offWhite};
  border: 1px solid ${({ theme }) => theme.midGreen};
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
}

function RadioButtonMenu({ selectedData, handleDataChange }: MenuProps) {
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
