import { Fragment } from 'react'
import router from 'next/router'
import { datasetDescriptions, defaultDataset } from '../data/dataset_descriptions'
import { SelectedData } from '../utils/types'
import { MenuContainer, MenuInput, MenuLabel } from './shared'

const replaceLetters = (word: string) => word.replace('å', 'a').replace('ä', 'a').replace('ö', 'o')

const datasetKeys = Object.keys(datasetDescriptions)

type MenuProps = {
  selectedData: SelectedData[]
  setSelectedData: React.Dispatch<React.SetStateAction<SelectedData[]>>
}

function CheckboxMenu({ selectedData, setSelectedData }: MenuProps) {
  const handleSelectData = (datasetName: string) => {
    const path = datasetName !== defaultDataset
      ? `/${replaceLetters(datasetName).toLowerCase()}`
      : '/'

    router.push(path, undefined, { shallow: true, scroll: false })

    const newSelectedData = selectedData.includes(datasetName)
      ? selectedData.filter((item) => item !== datasetName)
      : [...selectedData, datasetName]

    setSelectedData(newSelectedData)
  }

  return (
    <MenuContainer>
      {datasetKeys.map((option) => (
        <Fragment key={option}>
          <MenuInput
            type="checkbox"
            id={option}
            value={option}
            checked={selectedData.includes(option)}
            onChange={() => handleSelectData(option)}
          />
          <MenuLabel htmlFor={option}>{option}</MenuLabel>
        </Fragment>
      ))}
    </MenuContainer>
  )
}

export default CheckboxMenu
