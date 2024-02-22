import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { SelectedData } from '../utils/types'
import { datasetDescriptions } from '../utils/datasetDescriptions'
import ArrowDown from '../public/icons/arrow-down-current-color.svg'

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
  margin-bottom: 3px;
  color: ${({ theme }) => theme.offWhite};
  background-color: transparent;
  border: none;
  border-radius: 8px;
  text-decoration: underline;

  &:hover {
    color: ${({ theme }) => theme.lightGreen};
  }
`

const Btn = styled.button`
  margin-left: 8px;
  background-color: transparent;
  border: none;
  cursor: pointer;
`

const ArrowIcon = styled(ArrowDown)`
  margin-bottom: 4px;
  color: ${({ theme }) => theme.offWhite};

  &:hover {
    color: ${({ theme }) => theme.lightGreen};
  }
`

const DatasetWrapper = styled.ul`
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
          <Btn>
            <ArrowIcon />
          </Btn>
        </DropdownSelectText>
        {showDropDown && (
          <DatasetWrapper>
            {Object.keys(datasetDescriptions).map((option) => (
              <Dataset key={option} onClick={() => onDatasetClick(option)}>
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
