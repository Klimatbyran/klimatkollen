import { useState } from 'react'
import styled from 'styled-components'
import ArrowDown from '../public/icons/arrow-down.svg'

const SearchDropDown = styled.div`
  position: relative;
  display: inline-block;
`

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-contet: center;
`

const Link = styled.a`
  color: ${({ theme }) => theme.black};
  text-decoration: none;
  width: 280px;
  height: 56px;
  display: flex;
  align-items: center;
  padding-left: 1rem;
`

const Input = styled.input`
  width: 280px;
  height: 56px;
  background-color: ${({ theme }) => theme.black};
  border: 1px solid white;
  border-radius: 4px;
  color: ${({ theme }) => theme.white};
  padding-left: 1rem;
  outline: none;

  ::placeholder {
    color: ${({ theme }) => theme.white};
    font-size: 14px;
    font-family: Helvetica Neue;
    font-weight: 300;
  }
`

const Btn = styled.button`
  background-color: ${({ theme }) => theme.black};
  width: 40px;
  height: 30px;
  right: 10px;
  position: absolute;
  border: none;
`

const MunicipalitiesWrapper = styled.div`
  background-color: #f9fbff;
  max-height: 195px;
  overflow-y: scroll;
`

const DropDown = () => {
  //TO DO: get municipalities from API
  const municipalitiesFromApi = [
    'Göteborg',
    'Stockholm',
    'Malmö',
    'Bjuv',
    'Ekerö',
    'Tyresö',
  ]
  const sortedMunicipalities = municipalitiesFromApi.sort((a, b) => a.localeCompare(b))

  const [showDropDown, setShowDropDown] = useState(false)
  const [municipalities, setMunicipalities] = useState(sortedMunicipalities)

  const onInputChange = (value: string) => {
    if (value.length < 1) {
      setShowDropDown(false)
    } else {
      setShowDropDown(true)
    }
    const filterdMunicipalities = sortedMunicipalities.filter((test) =>
      test.toLowerCase().startsWith(value.toLowerCase()),
    )
    setMunicipalities(filterdMunicipalities)
  }

  return (
    <SearchDropDown>
      <Flex>
        <Input
          type="text"
          placeholder="Hur går det för din kommun?"
          onChange={(e) => onInputChange(e.target.value)}
        />
        <Btn onClick={() => setShowDropDown((current) => !current)}>
          <ArrowDown />
        </Btn>
      </Flex>
      {showDropDown && (
        <MunicipalitiesWrapper>
          {municipalities.map((name, i) => (
            <Link key={i} href={`/kommun/${name}`}>
              {name}
            </Link>
          ))}
        </MunicipalitiesWrapper>
      )}
    </SearchDropDown>
  )
}

export default DropDown
