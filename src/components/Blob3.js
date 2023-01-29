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
	transform: translate(50px,50px) rotate(400deg);

}

to 
{
	transform: translate(25px,20px) rotate(450deg);
}
`


const Blob = styled.div`
animation: ${move} 5s infinite alternate;
position: absolute;
top:0%;
left:90%;
width: 650px;
height: 650px; 
border: 1px transparent #000000;
border-radius:50%;

transform: rotate(400deg);
background: conic-gradient(from 80.38deg at 50% 61.35%, #AD2DFB 0deg, rgba(243, 244, 152, 0.351042) 153.24deg, rgba(207, 207, 207, 0.351042) 167.56deg, rgba(255, 187, 244, 0.351042) 213.68deg, rgba(255, 255, 255, 0.351042) 248.14deg, #AD2DFB 360deg);
`;