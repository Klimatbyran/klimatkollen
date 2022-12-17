import React from 'react';
import styled from 'styled-components';

interface PropsType {
  emissionsLevels: Array<{ name: string; emissions: number }>
}

export default function MunicipalityList(props: PropsType) {

  return (
    <ul>
      {Object.keys(props).map(props.emissionsLevels, (child) => {
        return <li>{child}</li>;
      })}
      <li>Hejson</li>
    </ul>
  );
}

  // fixme allt, ska vara tabell