import { Fragment } from 'react'
import styled from 'styled-components'
import router from 'next/router'
import { datasetDescriptions } from '../data/dataset_descriptions'
import { SelectedData } from '../utils/types'

const RadioContainer = styled.div`
  margin-top: 30px;
  gap: 16px;
  display: flex;
  font-weight: bolder;
  flex-wrap: wrap;
`

const RadioLabel = styled.label`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  text-decoration: none;
  color: white;
  background: ${({ theme }) => theme.darkGrey};
  white-space: nowrap;
  cursor: pointer;
  margin-bottom: 8px;

  &:hover {
    background: ${({ theme }) => theme.grey};
  }
`

const RadioInput = styled.input`
  display: none;
  &:checked + ${RadioLabel} {
    color: ${({ theme }) => theme.darkestGrey};
    background: ${({ theme }) => theme.green};

    &:hover {
      background: ${({ theme }) => theme.mint};
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
