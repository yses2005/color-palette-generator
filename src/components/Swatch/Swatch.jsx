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

export const Swatch = (props) => {
    const {rgbColor} = props;
    // const hexColor = rgbToHex(rgbColor);

    const [hexColor, setColor] = useState();

    useEffect(() => {
        setColor(rgbToHex(rgbColor));
    })

    return (
        <div className="swatch">

            <input type="color" value={hexColor} onChange={(e) => {setColor(e.target.value)}} className="palette_color"></input>

            <br />
            {hexColor}
            <br />
            {`rgb(${rgbColor.join(', ')})`}

        </div>
    )
}
