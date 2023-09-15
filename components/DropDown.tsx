import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import ArrowDown from '../public/icons/arrow-down.svg'
import ArrowRightWhite from '../public/icons/arrow-right-white.svg'
import ArrowRightGreen from '../public/icons/arrow-right-green.svg'
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
  border: 1px solid white;
  border-radius: 4px;
  color: ${({ theme }) => theme.offWhite};
  font-size: 16px;
  font-weight: 300;
  font-family: Borna;
  padding-left: 0.8rem;
  outline: none;

  ::placeholder {
    color: ${({ theme }) => theme.white};
  }

  @media only screen and (${devices.tablet}) {
    width: 305px;
  }
`

const Btn = styled.button`
  background-color: transparent;
  width: 40px;
  height: 30px;
  right: 5px;
  position: absolute;
  border: none;
`

const RoundButton = styled.button`
  appearance: none;
  height: 20px;
  width: 20px;
  border: none;
  background: none;
`

const MunicipalitiesWrapper = styled.ul`
  background-color: ${({ theme }) => theme.lightBlack};
  border-radius: 4px;
  max-height: 195px;
  overflow-y: scroll;
  position: absolute;
  z-index: 20;
`

const Municipality = styled.li`
  color: ${({ theme }) => theme.offWhite};
  text-decoration: none;
  width: 305px;
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
  className: string
}

function DropDown({ municipalitiesName, placeholder, className }: Props) {
  const sortedMunicipalities = municipalitiesName.sort((a, b) => a.localeCompare(b))
  const [showDropDown, setShowDropDown] = useState(false)
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('')
  const [municipalities, setMunicipalities] = useState(sortedMunicipalities)
  const [showInfoText, setShowInfoText] = useState(false)

  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

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
    const filteredMunicipalities = sortedMunicipalities.filter((test) => test.toLowerCase().includes(value.toLowerCase()))
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
              <ArrowDown />
            </Btn>
          </Flex>
          {showDropDown && (
            <MunicipalitiesWrapper className={className}>
              {municipalities.map((name) => (
                <Municipality onClick={() => onMunicipalityClick(name)}>
                  {name}
                </Municipality>
              ))}
            </MunicipalitiesWrapper>
          )}
        </SearchDropDown>
        <RoundButton onClick={seeMunicipality}>
          {selectedMunicipality ? (
            <ArrowRightGreen aria-label="Visa kommun" />
          ) : (
            <ArrowRightWhite aria-label="Visa kommun" />
          )}
        </RoundButton>
      </Container>
      {showInfoText && <ErrorText>Välj en kommun i listan</ErrorText>}
    </div>
  )
}

export default DropDown
