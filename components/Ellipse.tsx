import styled from 'styled-components';

const Ellipse = styled.div`
position: absolute;
width: 347px;
height: 318px;
left: -187px;
top: -119px;
background: ${(props) => props.theme.dark};
filter: blur(98px);
z-index: -1;
`;

export default Ellipse;