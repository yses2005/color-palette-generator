import './style.css'
import { useState, useEffect } from 'react';

const hexToRgb = (hexColor) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}

const rgbToHex = (rgbColor) => {
    const [r, g, b] = rgbColor;

    const hexR = r.toString(16);
    const hexG = g.toString(16);
    const hexB = b.toString(16);

    return `#${hexR}${hexG}${hexB}`;
}

const exportColor = (hexColor, rgbColor) => {
    const data = {
        'hex': hexColor,
        'rgb': rgbColor
    };
    // console.log(JSON.stringify(data))
    const download = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));

    return download

}

export const Swatch = (props) => {
    const {rgbColor} = props;
    const hexColor = rgbToHex(rgbColor);

    // const [hexColor, setColor] = useState();

    // useEffect(() => {
    //     setColor(rgbToHex(rgbColor));
    // })

    return (
        <div className="swatch">

            {/* <input type="color" value={hexColor} onChange={(e) => {setColor(e.target.value);}} className="palette_color"></input> */}
            <input type="color" value={hexColor} className="palette_color"></input>

            <br />
            <button value={hexColor} onClick={(e) => {
                navigator.clipboard.writeText(e.target.value);
                alert("Successfully copied hex code!");
            }} className="copier">{hexColor}</button>
            {/* {hexColor} */}
            <br />
            <button value={`rgb(${rgbColor.join(', ')})`} onClick={(e) => {
                navigator.clipboard.writeText(e.target.value);
                alert("Successfully copied rgb code!");
            }} className="copier">{`rgb(${rgbColor.join(', ')})`}</button>
            <br />
            <a href={`data:${exportColor(hexColor, rgbColor)}`} download="color.json" className='copier'>Donwload</a>           

        </div>
    )
}
