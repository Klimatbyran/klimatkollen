import Link from 'next/link';
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
                        <Link href={'kommuner/kommun/' + { val.name.toLowerCase }}>
                            <td>{val.name}</td>
                            <td>{val.emissions + ' %'}</td> {/* fixme fixa plustecken om positivt */}
                        </Link>
                    </tr>
                )
            })}
        </table>
    )
}