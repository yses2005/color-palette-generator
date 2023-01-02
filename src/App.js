import logo from './logo.svg';
import { useEffect, useState } from 'react';
import { Swatch } from './components/Swatch';
import axios from 'axios';
import './App.css';

function App() {

  const getRandomValue = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const getRandomRgb = () => {
    const h = getRandomValue(0, 359);
    const s = getRandomValue(42, 98) / 100;
    const l = getRandomValue(40, 90) / 100;

    const c = (1 - Math.abs((2 * l) - 1)) * s;

    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));

    const m = l - (c / 2);

    let tempR = 0, tempG = 0, tempB = 0;
    if (h < 60) {
      tempR = c;
      tempG = x;
    }
    else if (h < 120) {
      tempR = x;
      tempG = c;
    }
    else if (h < 180) {
      tempG = c;
      tempB = x;
    }
    else if (h < 240) {
      tempG = x;
      tempB = c;
    }
    else if (h < 300) {
      tempR = x;
      tempB = c;
    }
    else if (h < 360) {
      tempR = c;
      tempB = x;
    }

    const r = (tempR + m) * 255;
    const g = (tempG + m) * 255;
    const b = (tempB + m) * 255;

    // console.log(h, s, l);
    // console.log(tempR, tempB, tempG);
    // console.log(r, g, b);
    return [Math.round(r), Math.round(g), Math.round(b)];
  }

  const valueToHex = (value) => {
    const hexValue = value.toString(16);
    return hexValue.length === 1 ? `0${hexValue}` : hexValue;
  }

  const hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
  };

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

    if (h <= 0) {
      h = 360 - h;
    }

    l = (cMax + cMin) / 2;

    if (delta !== 0) {
        s = delta / (1 - Math.abs((2 * l) - 1));
    }

    return [`${Math.round(h)}`, `${Math.round(s * 100)}%`, `${Math.round(l * 100)}%`]
  }


  const [customizer, setCustom] = useState(getRandomRgb());
  const [colorPalette, setPalette] = useState(null);


  const fetchPalette = async (custom) => {
    var data = {
      model : "ui",
      input : [custom, "N","N","N","N"],
    }

    const res = await axios.post('http://colormind.io/api/', JSON.stringify(data));
    setPalette(res.data.result)
  }

  const changePalette = (index, value) => {
    const colorPaletteCopy = [...colorPalette];
    colorPaletteCopy[index] = value;
    setPalette(colorPaletteCopy);
  }

  const exportPalette = (palette) => {
    if (!palette) {
      return "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({}));
    }

    const data = {
        'swatch-1': {
          'rgb': palette[0],
          'hex': rgbToHex(palette[0]),
          'hsl': rbgToHsl(palette[0])
        },
        'swatch-2': {
          'rgb': palette[1],
          'hex': rgbToHex(palette[1]),
          'hsl': rbgToHsl(palette[1])
        },
        'swatch-3': {
          'rgb': palette[2],
          'hex': rgbToHex(palette[2]),
          'hsl': rbgToHsl(palette[2])
        },
        'swatch-4': {
          'rgb': palette[3],
          'hex': rgbToHex(palette[3]),
          'hsl': rbgToHsl(palette[3])
        },
        'swatch-5': {
          'rgb': palette[4],
          'hex': rgbToHex(palette[4]),
          'hsl': rbgToHsl(palette[4])
        },
    };

    const download = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));

    return download
}

useEffect(() => {
  (async () => {
    var data = {
      model : "ui",
      input : [getRandomRgb(), "N", "N","N","N"],
    }

    const res = await axios.post('http://colormind.io/api/', JSON.stringify(data));
    setPalette(res.data.result)

  })();
  }, []);

  return (
    <div className="App">

      <input type="color" onChange={(e) => {
        setCustom(hexToRgb(e.target.value));
      }}></input>

      {/* <input type="color" value={customizer}></input> */}


      <br />

      <button onClick={() => fetchPalette(getRandomRgb())}> Generate random palette </button>
      <button onClick={() => fetchPalette(customizer)}> Generate palette from color picker </button>

      <br />

      {colorPalette ? colorPalette.map((rawColor, index) => {return (<Swatch rgbColor={rawColor} onChange={(e) => {changePalette(index, hexToRgb(e.target.value));}} />)}) : null }

      <br />

      <a href={`data:${exportPalette(colorPalette)}`} download="color.json" className='copier'>Download</a>

    </div>
  );
}

export default App;
