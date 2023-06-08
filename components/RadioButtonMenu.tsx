import React from "react"
import styled from "styled-components"
import { dataSetDescriptions } from "../data/dataset_descriptions"
import router from "next/router"
import { SelectedData } from "../utils/types"


const RadioContainer = styled.div`
  margin-top: 30px;
  gap: 16px;
  display: flex;
  font-weight: bolder;
`

const RadioLabel = styled.label`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  text-decoration: none;
  color: ${({ theme }) => theme.offWhite};
  background: ${({ theme }) => theme.lightBlack};
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

const datasetKeys = Object.keys(dataSetDescriptions)

type MenuProps = {
  selectedData: SelectedData
  setSelectedData: React.Dispatch<React.SetStateAction<SelectedData>>
}

const RadioButtonMenu = ({ selectedData, setSelectedData }: MenuProps) => {
  const handleSelectData = (dataSetName: string) => {
    const path = dataSetName === 'Elbilarna' ? '/elbilarna' : dataSetName === 'Klimatplanerna' ? '/klimatplanerna' : '/'
    router.push(path, undefined, { shallow: true })
    setSelectedData(dataSetName as SelectedData)
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