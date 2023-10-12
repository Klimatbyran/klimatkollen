import { Fragment } from 'react'
import router from 'next/router'
import { datasetDescriptions, defaultDataset } from '../data/dataset_descriptions'
import { SelectedData } from '../utils/types'
import { MenuContainer, MenuInput, MenuLabel } from './shared'
import { colorTheme } from '../Theme'

const replaceLetters = (word: string) => word.replace('å', 'a').replace('ä', 'a').replace('ö', 'o') // replace å ä ö

const datasetKeys = Object.keys(datasetDescriptions)

type MenuProps = {
  selectedData: SelectedData
  setSelectedData: React.Dispatch<React.SetStateAction<SelectedData>>
}

function RadioMenu({ selectedData, setSelectedData }: MenuProps) {
  const handleSelectData = (datasetName: string) => {
    const path = datasetName !== defaultDataset
      ? `/${replaceLetters(datasetName).toLowerCase()}`
      : '/'
    router.push(path, undefined, { shallow: true, scroll: false })
    setSelectedData(datasetName)
  }

  return (
    <MenuContainer>
      {datasetKeys.map((option) => (
        <Fragment key={option}>
          <MenuInput
            type="radio"
            id={option}
            value={option}
            checked={selectedData === option}
            onChange={() => handleSelectData(option)}
            $backgroundColor={colorTheme.midGreen}
            $hoverColor={colorTheme.lightGreen}
          />
          <MenuLabel
            htmlFor={option}
            $borderColor={colorTheme.midGreen}
            $backgroundColor={colorTheme.darkGreenTwo}
          >
            {option}
          </MenuLabel>
        </Fragment>
      ))}
    </MenuContainer>
  )
}

export default RadioMenu
