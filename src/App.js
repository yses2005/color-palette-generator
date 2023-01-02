import logo from './logo.svg';
import { useEffect, useState } from 'react';
import { Swatch } from './components/Swatch';
import axios from 'axios';
import './App.css';

function App() {

  const getRandomValue = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const getRandomHsl = () => {
    const h = getRandomValue(0, 359);
    const s = getRandomValue(42, 90) / 100;
    const l = getRandomValue(40, 90) / 100;

    return {'h': h, 's': s, 'l': l}
  }

  const getRandomHsv = () => {
    const h = getRandomValue(0, 359);
    const s = getRandomValue(45, 100) / 100;
    const v = getRandomValue(45, 100) / 100;

    return [h, s, v];
  }

  const hsvToRgb = (hsvColor) => {
    const [h, s, v] = hsvColor;

    const c = v * s;

    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));

    const m = v - c;

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

    const r = Math.round((tempR + m) * 255);
    const g = Math.round((tempG + m) * 255);
    const b = Math.round((tempB + m) * 255);

    return [r, g, b];
  }

  const rgbToHsv = (rgbColor) => {
    const [r, g, b] = rgbColor;

    const tempR = r / 255;
    const tempG = g / 255;
    const tempB = b / 255;

    const cMax = Math.max(tempR, tempG, tempB);
    const cMin = Math.min(tempR, tempG, tempB);

    const delta = cMax - cMin;

    let h = 0, s = 0, v = cMax;
    if (cMax !== 0) {
      s = delta / cMax
    }

    if (cMax === tempR) {
      h = 60 * (((tempG - tempB) / delta) % 6);
    }
    else if (cMax === tempG) {
        h = 60 * (((tempB - tempR) / delta) + 2);
    }
    else if (cMax === tempB) {
        h = 60 * (((tempR - tempG) / delta) + 4);
    }

    if (h < 0) {
      h = 360 + h;
    }

    h = Math.round(h % 360);
    s = (Math.round(s * 10000)) / 10000;
    v = (Math.round(v * 10000)) / 10000;

    return [h, s, v];
  }

  const getLuminance = (rgbColor) => {
    const temp = rgbColor.map((v) => {
      v /= 255;
      return v <= 0.03928
            ? v / 12.92
            : Math.pow( (v + 0.055) / 1.055, 2.4 );
    });

    return temp[0] * 0.2126 + temp[1] * 0.7152 + temp[2] * 0.0722;
  }

  const calculateContrast = (color1, color2) => {
    const luminance1 = getLuminance(color1);
    const luminance2 = getLuminance(color2);

   if (luminance1 > luminance2) {
    return ((luminance2 + 0.05) / (luminance1 + 0.05));
   }
   else {
    return ((luminance1 + 0.05) / (luminance2 + 0.05));
   }
  }

  const getRandomRgb = () => {
    return hsvToRgb(getRandomHsv());
  }

  const complementaryColor = (hsvColor) => {
    const [...newColor] = hsvColor;
    newColor[0] = (newColor[0] + 180) % 360;

    return newColor;
  }

  const complement = (customColor) => {
    const firstColor = rgbToHsv(customColor);
    // const [...firstVariant1] = firstColor;
    // const [...firstVariant2] = firstColor;

    // const [...secondColor] = firstColor;
    // secondColor[0] = (secondColor[0] + 180) % 360;

    // const [...secondVariant] = secondColor;
    
    // Edit the hue, saturation, and value of the variants


    const [...secondColor] = firstColor; // color 2
    secondColor[0] = (secondColor[0] + 180) % 360;

    const [...thirdColor] = firstColor; // lighter color 1
    // thirdColor[1] -= .02;
    thirdColor[2] = getRandomValue(85, 90) / 100;


    const [...fourthColor] = secondColor;  // lighter / darker color 1
    // fourthColor[1] -= .02 ;
    // fourthColor[2] = .9;
    if (0.9 - fourthColor[2] > fourthColor[2] - 0.3) {
      fourthColor[2] = getRandomValue(85, 90) / 100;
    }
    else {
      fourthColor[2] = getRandomValue(30, 35) / 100;
    }


    const [...fifthColor] = firstColor;  // darker color 1
    fifthColor[2] = getRandomValue(30, 35) / 100;

    const hsvPalette = [fifthColor, firstColor, thirdColor, secondColor, fourthColor];
    const rgbPalette = hsvPalette.map((hsvSwatch) => {return hsvToRgb(hsvSwatch);});

    return rgbPalette;
  }

  const monochrome = (customColor) => {
    // s: 20 40 60 80 100
    // v: 20 40 60 80 100

    const baseColor = rgbToHsv(customColor);

    let hsvPalette = [];
    if (baseColor[2] <= 0.20) {
      const color1 = [...baseColor];
      const color2 = [...baseColor];
      const color3 = [...baseColor];
      const color4 = [...baseColor];

      color1[2] = getRandomValue(25, 40) / 100;
      color2[2] = getRandomValue(45, 60) / 100;
      color3[2] = getRandomValue(65, 80) / 100;
      color4[2] = getRandomValue(85, 100) / 100;

      hsvPalette = [baseColor, color1, color2, color3, color4];
    }
    else if (baseColor[2] <= 0.40) {
      const color1 = [...baseColor];
      const color2 = [...baseColor];
      const color3 = [...baseColor];
      const color4 = [...baseColor];

      color1[2] = getRandomValue(18, 23) / 100;
      color2[2] = getRandomValue(45, 60) / 100;
      color3[2] = getRandomValue(65, 80) / 100;
      color4[2] = getRandomValue(85, 100) / 100;

      hsvPalette = [color1, baseColor, color2, color3, color4];
    }
    else if (baseColor[2] <= 0.60) {
      const color1 = [...baseColor];
      const color2 = [...baseColor];
      const color3 = [...baseColor];
      const color4 = [...baseColor];

      color1[2] = getRandomValue(18, 23) / 100;
      color2[2] = getRandomValue(25, 40) / 100;
      color3[2] = getRandomValue(65, 80) / 100;
      color4[2] = getRandomValue(85, 100) / 100;

      hsvPalette = [color1, color2, baseColor, color3, color4];
    }
    else if (baseColor[2] <= 0.80) {
      const color1 = [...baseColor];
      const color2 = [...baseColor];
      const color3 = [...baseColor];
      const color4 = [...baseColor];

      color1[2] = getRandomValue(18, 23) / 100;
      color2[2] = getRandomValue(25, 40) / 100;
      color3[2] = getRandomValue(45, 60) / 100;
      color4[2] = getRandomValue(85, 100) / 100;

      hsvPalette = [color1, color2, color3, baseColor, color4];
    }
    else if (baseColor[2] <= 1.00) {
      const color1 = [...baseColor];
      const color2 = [...baseColor];
      const color3 = [...baseColor];
      const color4 = [...baseColor];

      color1[2] = getRandomValue(18, 23) / 100;
      color2[2] = getRandomValue(25, 40) / 100;
      color3[2] = getRandomValue(45, 60) / 100;
      color4[2] = getRandomValue(65, 80) / 100;

      hsvPalette = [color1, color2, color3, color4, baseColor];
    } 

    return hsvPalette.map((hsvColor) => {return hsvToRgb(hsvColor);});
  }


  const modifyColor = ({ hsvColor, newHue = null, newSaturation = null, newValue = null }) => {
    const newColor = [...hsvColor];
    
    if (newHue) {
      newColor[0] = newHue < 0 ? newHue + 360 : newHue;
      newColor[0] = newColor[0] % 360;
    } 
    if (newSaturation) newColor[1] = newSaturation;
    if (newValue) newColor[2] = newValue;

    return newColor;
  }

  const analogic = (rgbColor) => {
    const baseColor = rgbToHsv(rgbColor);
    const hueModifier = getRandomValue(13, 30);

    const leftColor1 = modifyColor({hsvColor: baseColor, newHue: baseColor[0] - hueModifier});
    const leftColor2 = modifyColor({hsvColor: baseColor, newHue: baseColor[0] - (2 * hueModifier)});
    const rightColor1 = modifyColor({hsvColor: baseColor, newHue: baseColor[0] + hueModifier});
    const rightColor2 = modifyColor({hsvColor: baseColor, newHue: baseColor[0] + (2 * hueModifier)});

    const hsvPalette = [leftColor2, leftColor1, baseColor, rightColor1, rightColor2]
    return hsvPalette.map((hsvSwatch) => {return hsvToRgb(hsvSwatch);});
  }

  const hslToRgb = (hslColor) => {
    const {h, s, l} = hslColor;

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

  const randomizeMode = (seed) => {
    const hsvSeed = rgbToHsv(seed);

    let modes;
    if (hsvSeed[1] < .2 || hsvSeed[2] < .2) {
      modes = ['monochrome', 'random'];
    }
    else {
      modes = ['monochrome', 'analogic', 'complement'];
    }

    return modes[getRandomValue(0, modes.length - 1)];
  }

  const [customizer, setCustom] = useState(getRandomRgb());
  const [colorPalette, setPalette] = useState(null);

  const allColorData = (rgbColor) => {
    const colorData = {};

    colorData.rgb = rgbColor;
    colorData.hex = rgbToHex(rgbColor);
    colorData.hsl = rbgToHsl(rgbColor);
    colorData.hsv = rgbToHsv(rgbColor);

    return colorData;
  }

  const fetchPalette = async (custom) => {
    var data = {
      model : "default",
      input : [custom, "N", "N", "N", "N"],
    }

    const paletteMode = randomizeMode(custom);
    const res = await axios.post('http://colormind.io/api/', JSON.stringify(data));

    let rawPalette;
    if (paletteMode === 'random') {
      rawPalette = res.data.result;
    }
    else if (paletteMode === 'monochrome') {
      rawPalette = monochrome(res.data.result[0]);
    }
    else if (paletteMode === 'analogic') {
      rawPalette = analogic(res.data.result[0]);
    }
    else if (paletteMode === 'complement') {
      rawPalette = complement(res.data.result[0]);
    }

    setPalette(rawPalette);
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
    const custom = getRandomRgb();

    var data = {
      model : "default",
      input : [custom, "N", "N", "N", "N"],
    }

    const paletteMode = randomizeMode(custom);
    const res = await axios.post('http://colormind.io/api/', JSON.stringify(data));

    let rawPalette;
    if (paletteMode === 'random') {
      rawPalette = res.data.result;
    }
    else if (paletteMode === 'monochrome') {
      rawPalette = monochrome(res.data.result[0]);
    }
    else if (paletteMode === 'analogic') {
      rawPalette = analogic(res.data.result[0]);
    }
    else if (paletteMode === 'complement') {
      rawPalette = complement(res.data.result[0]);
    }

    setPalette(rawPalette);

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
