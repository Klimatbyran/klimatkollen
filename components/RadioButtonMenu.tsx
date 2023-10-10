import { Fragment } from 'react'
import styled from 'styled-components'
import { datasetDescriptions } from '../data/dataset_descriptions'
import { SelectedData } from '../utils/types'

const RadioContainer = styled.div`
  margin: 32px 0;
  gap: 16px;
  display: flex;
  font-weight: bolder;
  flex-wrap: wrap;
  justify-content: center;
`

const RadioLabel = styled.label`
  padding: 0.5rem 1rem;
  font-family: 'Anonymous Pro';
  font-size: 14px;
  line-height: 20px;
  text-decoration: none;
  color: ${({ theme }) => theme.offWhite};
  border: 1px solid ${({ theme }) => theme.midGreen};
  border-radius: 8px;
  white-space: nowrap;
  cursor: pointer;
  margin-bottom: 8px;

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

const datasetKeys = Object.keys(datasetDescriptions)

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
