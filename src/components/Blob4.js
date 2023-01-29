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
	transform: translate(0px,100px) rotate(400deg);

}

to 
{
	transform: translate(50px,50px) rotate(450deg);
}
`
const Blob = styled.div`
animation: ${move} 10s infinite alternate;
position: absolute;
top:50%;
left:90%;
width: 250px;
height: 250px;
border: 1px transparent #000000;
border-radius:35% 65% 22% 78% / 50% 75% 25% 50% ;

background: conic-gradient(from 80.38deg at 50% 61.35%, #AD2DFB 0deg, rgba(243, 244, 152, 0.351042) 150.24deg, rgba(207, 207, 207, 0.351042) 197.56deg, rgba(255, 187, 244, 0.351042) 213.68deg, rgba(255, 255, 255, 0.351042) 48.14deg, #AD2DFB 360deg);
`;