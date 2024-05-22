import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import ArrowDown from '../public/icons/arrow-down.svg'
import { devices } from '../utils/devices'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  width: 100%;

  @media only screen and (${devices.tablet}) {
    width: 325px;
  }
`

const SearchDropDown = styled.div`
  position: relative;
  width: 100%;
`

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`

const StyledInput = styled.input`
  width: 100%;
  height: 56px;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.midGreen};
  border-radius: 4px;
  color: ${({ theme }) => theme.offWhite};
  font-size: 16px;
  font-family: 'DM Sans Variable', sans-serif;
  padding-left: 0.8rem;
  outline: none;
  width: 325px;

  ::placeholder {
    color: ${({ theme }) => theme.offWhite};
  }
`

const Btn = styled.button`
  background-color: transparent;
  width: 20px;
  height: 20px;
  right: 16px;
  position: absolute;
  border: none;
`

const MunicipalitiesWrapper = styled.ul`
  background-color: ${({ theme }) => theme.newColors.black2};
  border-radius: 4px;
  max-height: 195px;
  overflow-y: scroll;
  position: absolute;
  z-index: 20;
`

const Municipality = styled.li`
  color: ${({ theme }) => theme.offWhite};
  text-decoration: none;
  width: 310px;
  height: 56px;
  display: flex;
  align-items: center;
  padding-left: 1rem;
  position: relative;
`

const ErrorText = styled.div`
  margin-top: 8px;
`

type Props = {
  municipalitiesName: Array<string>
  placeholder: string
}

export function getSortedMunicipalities(municipalitiesName: Array<string>) {
  return municipalitiesName.sort((a, b) => a.localeCompare(b, 'sv'))
}

export function search(query: string, municipalitiesName: Array<string>) {
  const queryLowerCase = query.toLowerCase()

  return municipalitiesName
    .filter((municipality) => municipality.toLowerCase().includes(queryLowerCase))
    .sort((a, b) => {
      const lowerA = a.toLowerCase()
      const lowerB = b.toLowerCase()

      const startsWithQueryA = lowerA.startsWith(queryLowerCase)
      const startsWithQueryB = lowerB.startsWith(queryLowerCase)

      if (startsWithQueryA && !startsWithQueryB) {
        return -1
      }
      if (!startsWithQueryA && startsWithQueryB) {
        return 1
      }

      return 0
    })
}

function DropDown({ municipalitiesName, placeholder }: Props) {
  const sortedMunicipalities = getSortedMunicipalities(municipalitiesName)
  const [showDropDown, setShowDropDown] = useState(false)
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('')
  const [municipalities, setMunicipalities] = useState(sortedMunicipalities)
  const [showInfoText, setShowInfoText] = useState(false)

  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { t } = useTranslation()

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      const element = e.target

      if (showDropDown && element instanceof Node && !ref.current?.contains(element)) {
        setShowDropDown(false)
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)

    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside)
    }
  }, [showDropDown])

  const onMunicipalityClick = (name: string) => {
    setSelectedMunicipality(name)
    setShowDropDown(false)

    if (municipalities.includes(name)) {
      router.push(`/kommun/${name.toLowerCase()}`)
    }
  }

  const onInputChange = (value: string) => {
    setSelectedMunicipality(value)
    if (value.length < 1) {
      setShowDropDown(false)
    } else {
      setShowDropDown(true)
    }
    const filteredMunicipalities = search(value, sortedMunicipalities)
    setMunicipalities(filteredMunicipalities)
  }

  const seeMunicipality = () => {
    const municipalityExists = municipalities.find(
      (municipality) => municipality.toLowerCase() === selectedMunicipality.toLowerCase(),
    )

    if (municipalityExists) {
      router.push(`/kommun/${selectedMunicipality.toLowerCase()}`)
    } else {
      setShowInfoText(true)
      setTimeout(() => {
        setShowInfoText(false)
      }, 2000)
    }
  }

  return (
    <div>
      <Container>
        <SearchDropDown ref={ref}>
          <Flex>
            <StyledInput
              aria-label={placeholder}
              type="text"
              placeholder={placeholder}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  seeMunicipality()
                }
              }}
              onChange={(e) => onInputChange(e.target.value)}
              value={selectedMunicipality}
            />
            <Btn onClick={() => setShowDropDown((current) => !current)}>
              <ArrowDown aria-label={t('common:components.DropDown.label')} />
            </Btn>
          </Flex>
          {showDropDown && (
            <MunicipalitiesWrapper>
              {municipalities.map((name) => (
                <Municipality onClick={() => onMunicipalityClick(name)} key={name}>
                  {name}
                </Municipality>
              ))}
            </MunicipalitiesWrapper>
          )}
        </SearchDropDown>
      </Container>
      {showInfoText && <ErrorText>Välj en kommun i listan</ErrorText>}
    </div>
  )
}

export default DropDown
