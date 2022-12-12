import React from 'react';
import styled from 'styled-components';

interface PropsType {
    children: React.ReactNode;
  }

  export default function MunicipalityList(props: PropsType) {
    return (
      <ul>
        {React.Children.map(props.children, (child) => {
          return <li>{child}</li>;
        })}
        <li>Hejson</li>
      </ul>
    );
  }

  // fixme allt, ska vara tabell