/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useMemo, useState } from 'react'
import styled from 'styled-components'

const Input = styled.input`
  transform-origin: 75px 75px;
  transform: rotate(-90deg);
`

export default function Range({ data, index, setData }) {
  const [value, setValue] = useState(0)

  const onInputChange = (event) => {
    const newValue = parseFloat(event.target.value)
    setValue(newValue)
    // update following data points as well
    const newData = [...data]
    newData[index] = { ...newData[index], change: newValue }
    setData(newData)
  }

  return (
    <Input
      type="range"
      onChange={onInputChange}
      min={1}
      max={2}
      step={0.01}
      value={value}
    />
  )
}
