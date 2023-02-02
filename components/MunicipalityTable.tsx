import React from 'react'

type Props = {
    emissionsLevels: Array<{ name: string; emissions: number }>
}

export default function MunicipalityTable(props: Props) {
    return (
        <table>
            <tr>
                <th>Kommun</th>
                <th>Utsläpp</th>
            </tr>
            {props.emissionsLevels.map((val, key) => {
                return (
                    <tr key={key}>
                        <td>{val.name}</td>
                        <td>{val.emissions}</td>
                    </tr>
                )
            })}
        </table>
    )
}