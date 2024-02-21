import React from 'react'
import styled from 'styled-components'
import { datasetDescriptions } from '../utils/datasetDescriptions'
import { SelectedData } from '../utils/types'

const DropdownContainer = styled.div`
  display: flex;
  justify-content: left;
`

const DropdownSelect = styled.select`
  padding: 8px 16px;
  margin-bottom: 8px;
  font-family: Borna;
  font-size: 32px;
  color: ${({ theme }) => theme.offWhite};
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.lightGreen};
  }
`

type MenuProps = {
  selectedData: SelectedData
  handleDataChange: (newData: SelectedData) => void
}

function DropdownMenu({ selectedData, handleDataChange }: MenuProps) {
  return (
    <DropdownContainer>
      <DropdownSelect
        value={selectedData}
        onChange={(e) => handleDataChange(e.target.value as SelectedData)}
      >
        {Object.keys(datasetDescriptions).map((option) => (
          <option key={option} value={option}>
            {option.toLowerCase()}
          </option>
        ))}
      </DropdownSelect>
    </DropdownContainer>
  )
}

export default DropdownMenu
