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

const valueToHex = (value) => {
    const hexValue = value.toString(16);
    return hexValue.length === 1 ? `0${hexValue}` : hexValue;
}

const rgbToHex = (rgbColor) => {
    const [r, g, b] = rgbColor;

    const hexR = valueToHex(r);
    const hexG = valueToHex(g);
    const hexB = valueToHex(b);

    return `#${hexR}${hexG}${hexB}`;
}

const rbgToHsl = (rgbColor) => {
    const [r, g, b] = rgbColor;

    const newR = r / 255;
    const newG = g / 255;
    const newB = b / 255;

    const cMax = Math.max(newR, newG, newB);
    const cMin = Math.min(newR, newG, newB);

    const delta = cMax - cMin;
    let h = 0, s = 0, l = 0;

    // if (delta === 0) {
    //     const 
    // }
    if (cMax === newR) {
        h = 60 * (((newG - newB) / delta) % 6);
    }
    else if (cMax === newG) {
        h = 60 * (((newB - newR) / delta) + 2);
    }
    else if (cMax === newB) {
        h = 60 * (((newR - newG) / delta) + 4);
    }

    if (h < 0) {
        h = 360 + h;
    }
    else if (h === 360) {
        h = 0;
    }

    l = (cMax + cMin) / 2;

    if (delta !== 0) {
        s = delta / (1 - Math.abs((2 * l) - 1));
    }

    return [`${Math.round(h)}`, `${Math.round(s * 100)}%`, `${Math.round(l * 100)}%`]
}


export const Swatch = (props) => {
    const { rgbColor, onChange } = props;
    const hexColor = rgbToHex(rgbColor);

    return (
        <div className="swatch">

            {/* <input type="color" value={hexColor} onChange={(e) => {setColor(e.target.value);}} className="palette_color"></input> */}
            <input type="color" value={hexColor} onChange={onChange} className="palette_color"></input>

            <br />
            <button value={hexColor} onClick={(e) => {
                navigator.clipboard.writeText(e.target.value);
                alert("Successfully copied HEX code!");
            }} className="copier">{hexColor}</button>
            {/* {hexColor} */}
            <br />
            <button value={`rgb(${rgbColor.join(', ')})`} onClick={(e) => {
                navigator.clipboard.writeText(e.target.value);
                alert("Successfully copied RGB code!");
            }} className="copier">{`rgb(${rgbColor.join(', ')})`}</button>
            <br />
            <button value={`hsl(${rbgToHsl(rgbColor).join(', ')})`} onClick={(e) => {
                navigator.clipboard.writeText(e.target.value);
                alert("Successfully copied HSL code!");
            }} className="copier">{`hsl(${rbgToHsl(rgbColor).join(', ')})`}</button>
            <br />
            {/* <a href={`data:${exportColor(hexColor, rgbColor)}`} download="color.json" className='copier'>Donwload</a>            */}

        </div>
    )
}
