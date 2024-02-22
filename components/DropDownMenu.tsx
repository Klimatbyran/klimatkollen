import React from 'react'
import styled from 'styled-components'
import { datasetDescriptions } from '../utils/datasetDescriptions'
import { SelectedData } from '../utils/types'
import ArrowDown from '../public/icons/arrow-down.svg'

const DropdownContainer = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
`

const DropdownSelectWrapper = styled.div`
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid white;
    pointer-events: none;
  }
`

const DropdownSelect = styled.select`
  font-family: Borna;
  font-weight: 600;
  font-size: 32px;
  padding: 16px;
  padding-right: 36px; /* Increase right padding to make room for the chevron */
  margin-bottom: 7px;
  color: ${({ theme }) => theme.offWhite};
  background-color: black;
  background-image: ${ArrowDown} /* Path to your chevron icon */
  background-repeat: no-repeat;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: underline;

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  &:hover {
    background-color: ${({ theme }) => theme.darkGreenTwo};
  }
`

type MenuProps = {
  selectedData: SelectedData
  handleDataChange: (newData: SelectedData) => void
}

function DropdownMenu({ selectedData, handleDataChange }: MenuProps) {
  return (
    <DropdownContainer>
      <DropdownSelectWrapper>
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
      </DropdownSelectWrapper>
    </DropdownContainer>
  )
}

export default DropdownMenu
