import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { SelectedData } from '../utils/types'
import { datasetDescriptions } from '../utils/datasetDescriptions'
import ArrowDown from '../public/icons/arrow-down-current-color.svg'
import { colorTheme } from '../Theme'

const DropdownContainer = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
`

const DropdownSelectWrapper = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
`

const DropdownSelectText = styled.div`
  font-family: Borna;
  font-weight: 600;
  font-size: 32px;
  margin-bottom: 5px;
  color: ${({ theme }) => theme.offWhite};
  background-color: transparent;
  border: none;
  border-radius: 8px;
  text-decoration: underline;

  &:hover {
    color: ${({ theme }) => theme.lightGreen};
  }
`

const ArrowIcon = styled(ArrowDown)`
  margin-left: 8px;
  margin-bottom: 4px;
`

const DatasetWrapper = styled.ul`
  margin-top: 8px;
  background-color: ${({ theme }) => theme.inBetweenBlack};
  border-radius: 8px;
  max-height: 500px;
  position: absolute;
  z-index: 200;
  width: 256px;
`

const Dataset = styled.li`
  color: ${({ theme }) => theme.offWhite};
  padding: 16px;
  cursor: pointer;
  font-size: 24px;
  border-radius: 8px;
  list-style-type: none;

  &:hover {
    color: ${({ theme }) => theme.lightGreen};
    border-radius: 8px;
  }
`

type MenuProps = {
  selectedData: SelectedData
  handleDataChange: (newData: SelectedData) => void
}

function DropdownMenu({ selectedData, handleDataChange }: MenuProps) {
  const [showDropDown, setShowDropDown] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (showDropDown && ref.current && !ref.current.contains(e.target as Node)) {
        setShowDropDown(false)
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)

    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside)
    }
  }, [showDropDown])

  const onDatasetClick = (option: string) => {
    handleDataChange(option)
    setShowDropDown(false)
  }

  return (
    <DropdownContainer ref={ref}>
      <DropdownSelectWrapper onClick={() => setShowDropDown(!showDropDown)}>
        <DropdownSelectText>
          {selectedData.toString().toLowerCase() || 'välj data'}
          <ArrowIcon />
        </DropdownSelectText>
        {showDropDown && (
          <DatasetWrapper>
            {Object.keys(datasetDescriptions).map((option) => (
              <Dataset
                key={option}
                onClick={() => onDatasetClick(option)}
                style={{ backgroundColor: option === selectedData ? colorTheme.darkGreenTwo : 'inherit' }}
              >
                {option.toLowerCase()}
              </Dataset>
            ))}
          </DatasetWrapper>
        )}
      </DropdownSelectWrapper>
    </DropdownContainer>
  )
}

export default DropdownMenu
