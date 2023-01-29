import styled, {keyframes} from "styled-components"

export default function Blob5()
{
	return(
		<Circ/>
		)
}

const move = keyframes`

from 
{
	transform: rotate(400deg);
	opacity:1;

}

to 
{
	transform: translate(100px,20px) rotate(450deg);
	opacity: 0.5;
}
`

const Circ = styled.div`
animation: ${move} 15s infinite alternate;
position: absolute;
width: 200px;
height: 200px;
border: 1px solid #000000;
border-radius: 85% 15% 33% 67% / 49% 11% 89% 51% ;
top:55%;
left:40%;
mix-blend-mode: multiply;
`;