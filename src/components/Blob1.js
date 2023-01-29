import styled, {keyframes} from "styled-components"

export default function BlobAnimation()
{
	return(
		<Blob/>
		)
}

const move = keyframes`

from 
{
	transform: translate(50px,-50px) rotate(-80deg);

}

to 
{
	transform: translate(200px, 10px) rotate(-180deg);
}

`

const Blob = styled.div`


animation: ${move} 70s infinite alternate;

position: absolute;
left:30%;
width: 300px;
height: 300px;
top:-15%;

transform: rotate(-27deg);
border: 1px transparent #000000;
border-radius:25% 75% 38% 62% / 28% 60% 40% 72%  ;


background: conic-gradient(from 80.38deg at 50% 61.35%, #AD2DFB 0deg, rgba(243, 244, 152, 0.351042) 150.24deg, rgba(207, 207, 207, 0.351042) 197.56deg, rgba(255, 187, 244, 0.351042) 213.68deg, rgba(255, 255, 255, 0.351042) 48.14deg, #AD2DFB 360deg);

transition-delay: 1000ms;

`;