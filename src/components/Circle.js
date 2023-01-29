import styled, {keyframes} from "styled-components"

export default function Circle()
{
	return(
		<Circ/>
		)
}

const move = keyframes`

from 
{
	transform: translate(0px,100px) rotate(400deg);
	opacity:1;
}

to 
{
	transform: translate(0px,300px) rotate(450deg);
	opacity:0.5;
}
`

const Circ = styled.div`
animation: ${move} 30s infinite alternate;
position: absolute;
width: 500px;
height: 500px;
border: 1px solid #000000;
border-radius: 50%;
top:-15%;
left:-15%;
mix-blend-mode: multiply;

`;