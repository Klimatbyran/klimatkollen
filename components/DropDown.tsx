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
  color: #2d2d2d;
  text-decoration: none;
  display: block;
  width: 280px;
  height: 56px;
  display: flex;
  align-items: center;
  padding-left: 1rem;
`

// const Button = styled.button`
//   border: 1px solid white;
//   background-color: #2d2d2d;
//   border-radius: 4px;
//   width: 280px;
//   height: 56px;
//   color: white;
// `

const Input = styled.input`
  width: 280px;
  height: 56px;
  background-color: #2d2d2d;
  border: 1px solid white;
  border-radius: 4px;
  color: white;
  padding-left: 1rem;
  outline: none;

  ::placeholder {
    color: white;
    font-size: 16px;
  }
`

const Btn = styled.button`
  background-color: red;
  right: 30px;
  position: absolute;
`

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-contet: center;
`

const Items = styled.div`
  background-color: #f9fbff;
`

const DropDown = () => {
  const [showDropDown, setShowDropDown] = useState(false)
  const municipalitiesFromApi = ['Göteborg', 'Stockholm', 'Malmö', 'Mallmö']

  const [municipalities, setMunicipalities] = useState(municipalitiesFromApi)

  const onInputChange = (value: string) => {
    if (value.length < 1) {
      console.log('e')
      setShowDropDown(false)
    } else {
      setShowDropDown(true)
    }
    // console.log(value)
    // console.log(showDropDown)
    const filterdMunicipalities = municipalitiesFromApi.filter((test) =>
      test.toLowerCase().startsWith(value.toLowerCase()),
    )
    setMunicipalities(filterdMunicipalities)
  }

  return (
    <DropDownDiv>
      <Content id="myDropdown">
        <Flex>
          <Input
            type="text"
            placeholder="Hur går det för din kommun?"
            onChange={(e) => onInputChange(e.target.value)}
          />
          <Btn onClick={() => setShowDropDown(!showDropDown)}> Ner </Btn>
        </Flex>
        {showDropDown && (
          <Items>
            {municipalities.map((name, i) => (
              <Link key={i} href={`/kommun/${name}`}>
                {name}
              </Link>
            ))}
          </Items>
        )}
      </Content>
    </DropDownDiv>
  )
}

export default DropDown
