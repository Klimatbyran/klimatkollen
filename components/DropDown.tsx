import styled from 'styled-components'
import { useState } from 'react'

const DropDownDiv = styled.div`
  position: relative;
  display: inline-block;
`

const Content = styled.div`
  position: absolute;
  background-color: #2d2d2d;
  min-width: 230px;
  z-index: 1;
`

const Link = styled.a`
  color: white;
  text-decoration: none;
  display: block;
  width: 280px;
  height: 56px;
  display: flex;
  align-items: center;
  padding-left: 1rem;
`

const Button = styled.button`
  border: 1px solid white;
  background-color: #2d2d2d;
  border-radius: 4px;
  width: 280px;
  height: 56px;
  color: white;
`

const Input = styled.input`
  width: 280px;
  height: 56px;
  background-color: #2d2d2d;
  border: none;
  color: white;
  padding-left: 1rem;
  outline: none;
`

const DropDown = () => {
  const [showDropDown, setShowDropDown] = useState(false)
  const municipalitiesFromApi = ['Göteborg', 'Stockholm', 'Malmö', 'Mallmö']

  const [municipalities, setMunicipalities] = useState(municipalitiesFromApi)

  const onInputChange = (value: string) => {
    const filterdMunicipalities = municipalitiesFromApi.filter((test) =>
      test.toLowerCase().startsWith(value.toLowerCase()),
    )
    setMunicipalities(filterdMunicipalities)
  }

  return (
    <DropDownDiv>
      <Button onClick={() => setShowDropDown(!showDropDown)}>
        Hur går det för din kommun?
      </Button>
      {showDropDown && (
        <Content id="myDropdown">
          <Input
            type="text"
            placeholder="Search.."
            id="myInput"
            onChange={(e) => onInputChange(e.target.value)}
          />
          {municipalities.map((name, i) => (
            <Link key={i} href={`/kommun/${name}`}>
              {name}
            </Link>
          ))}
        </Content>
      )}
    </DropDownDiv>
  )
}

export default DropDown
