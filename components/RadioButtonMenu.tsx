import React from 'react'
import styled from 'styled-components'
import { datasetDescriptions, default_dataset } from '../data/dataset_descriptions'
import router from 'next/router'
import { SelectedData } from '../utils/types'

const RadioContainer = styled.div`
  margin-top: 30px;
  gap: 16px;
  display: flex;
`

const RadioLabel = styled.label`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-family: 'Anonymous Pro';
  font-size: 14px;
  line-height: 20px;
  text-decoration: none;
  color: ${({ theme }) => theme.offWhite};
  border: 1px solid ${({ theme }) => theme.lightBlack};
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

const replaceLetters = (word: string) => {
  // replace å ä ö
  return word.replace('å', 'a').replace('ä', 'a').replace('ö', 'o')
}

const datasetKeys = Object.keys(datasetDescriptions)

type MenuProps = {
  selectedData: SelectedData
  setSelectedData: React.Dispatch<React.SetStateAction<SelectedData>>
}

const RadioButtonMenu = ({ selectedData, setSelectedData }: MenuProps) => {
  const handleSelectData = (datasetName: string) => {
    const path =
      datasetName !== default_dataset
        ? '/' + replaceLetters(datasetName).toLowerCase()
        : '/'
    router.push(path, undefined, { shallow: true, scroll: false })
    setSelectedData(datasetName)
  }

  return (
    <RadioContainer>
      {datasetKeys.map((option) => (
        <React.Fragment key={option}>
          <RadioInput
            type="radio"
            id={option}
            value={option}
            checked={selectedData === option}
            onChange={() => handleSelectData(option)}
          />
          <RadioLabel htmlFor={option}>{option}</RadioLabel>
        </React.Fragment>
      ))}
    </RadioContainer>
  )
}

export default RadioButtonMenu
