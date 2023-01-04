import logo from './logo.svg';
import { useEffect, useState } from 'react';
import { Swatch } from './components/Swatch';
import axios from 'axios';
import './App.css';

function App() {

  const getRandomValue = (min, max) => {
    let randomVal = Math.floor(Math.random() * (max - min + 1)) + min;

    if (min < 0 && randomVal <= -min) {
      randomVal = (Math.random() < 0.5 ? -1 : 1) * randomVal;
    }

    return randomVal;
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

  const calculateSaturation = (rgbColor) => {
    const [r, g, b] = rgbColor;

    const tempR = r / 255;
    const tempG = g / 255;
    const tempB = b / 255;

    const cMax = Math.max(tempR, tempG, tempB);
    const cMin = Math.min(tempR, tempG, tempB);

    const delta = cMax - cMin;

    const s = cMax !== 0 ? delta / cMax : 0;
    return (Math.round(s * 10000)) / 10000;
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

  const calculatetLuminance = (rgbColor) => {
    const temp = rgbColor.map((v) => {
      v /= 255;
      return v <= 0.03928
            ? v / 12.92
            : Math.pow( (v + 0.055) / 1.055, 2.4 );
    });

    return temp[0] * 0.2126 + temp[1] * 0.7152 + temp[2] * 0.0722;
  }

  const calculateContrast = (color1, color2) => {
    const luminance1 = calculatetLuminance(color1);
    const luminance2 = calculatetLuminance(color2);

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
  // const [imgFile, setImg] = useState(null);

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

  const buildRgb = (imageData, imageSize) => {
    const rgbValues = [];
    for (let i = 0, offset, r, g, b,a ; i < imageSize; i += 4) {
      offset = i * 4;
      r = imageData[offset];
      g = imageData[offset + 1];
      b = imageData[offset + 2];

      // if 
      // a = imageData[offset + 3];

      rgbValues.push([r, g, b]);
    }
  
    return rgbValues;
  };

  const findBiggestColorRange = (rgbValues) => {
    let rMin = Number.MAX_VALUE;
    let gMin = Number.MAX_VALUE;
    let bMin = Number.MAX_VALUE;
  
    let rMax = Number.MIN_VALUE;
    let gMax = Number.MIN_VALUE;
    let bMax = Number.MIN_VALUE;
  
    rgbValues.forEach((pixel) => {
      rMin = Math.min(rMin, pixel[0]);
      gMin = Math.min(gMin, pixel[1]);
      bMin = Math.min(bMin, pixel[2]);
  
      rMax = Math.max(rMax, pixel[0]);
      gMax = Math.max(gMax, pixel[1]);
      bMax = Math.max(bMax, pixel[2]);
    });
  
    const rRange = rMax - rMin;
    const gRange = gMax - gMin;
    const bRange = bMax - bMin;
  
    const biggestRange = Math.max(rRange, gRange, bRange);
    if (biggestRange === rRange) {
      return 0; // 0: r
    } 
    else if (biggestRange === gRange) {
      return 1; // 1: g
    } 
    else {
      return 2; // 2: b
    }
  };

  const quantizeColor = (rgbValues, depth) => {
    const MAX_DEPTH = 4; // Returns 2^MAX_DEPTH colors
  
    // Base case
    if (depth === MAX_DEPTH || rgbValues.length === 0) {
      const color = rgbValues.reduce(
        (prev, curr) => {
          prev[0] += curr[0];
          prev[1] += curr[1];
          prev[2] += curr[2];
  
          return prev;
        },
        [0, 0, 0]
      );
  

      color[0] = Math.round(color[0] / rgbValues.length);
      color[1] = Math.round(color[1] / rgbValues.length);
      color[2] = Math.round(color[2] / rgbValues.length);
  
      return [color];
    }
  
    /**
     *  Recursively do the following:
     *  1. Find the pixel channel (red,green or blue) with biggest difference/range
     *  2. Order by this channel
     *  3. Divide in half the rgb colors list
     *  4. Repeat process again, until desired depth or base case
     */
    const componentToSortBy = findBiggestColorRange(rgbValues);
    rgbValues.sort((p1, p2) => {
      return p1[componentToSortBy] - p2[componentToSortBy];
    });
  
    const mid = rgbValues.length / 2;
    return[
      ...quantizeColor(rgbValues.slice(0, mid), depth + 1),
      ...quantizeColor(rgbValues.slice(mid + 1), depth + 1),
    ];
  };

  // const calculateHueDifference = (rgbValue, rgbValue)

  const calculateColorDistance = (rgbValue1, rgbValue2) => {
    // Calculates the squared distance between two rgb values
    const distR = Math.pow(rgbValue1[0] - rgbValue2[0], 2);
    const distG = Math.pow(rgbValue1[1] - rgbValue2[1], 2);
    const distB = Math.pow(rgbValue1[2] - rgbValue2[2], 2);

    return distR + distG + distB;
  }

  const isBlack = (rgbColor) => {
    return (rgbColor[0] === 0) && (rgbColor[1] === 0) && (rgbColor[2] === 0);
  }

  const isWhite = (rgbColor) => {
    return (rgbColor[0] === 255) && (rgbColor[1] === 255) && (rgbColor[2] === 255);
  }

  // const isColor = (rgbColor) => {
  //   return (rgbColor[0] < 255 && rgbColor[0] > 0) || (rgbColor[1] < 255 && rgbColor[1] > 0) || (rgbColor[2] < 255 && rgbColor[2] > 0);
  // }

  const isColor = (rgbColor) => {
    return calculateSaturation(rgbColor) !== 0;
  }

  const removeDuplicates = (rgbValues) => {
    let tempValues = [rgbValues[0]];
    let finalValues = [];

    for (let i = 1, base = rgbValues[0], difference; i < rgbValues.length; i++) {
      difference = calculateContrast(base, rgbValues[i]);

      if (difference < 0.9) {
        // console.log(difference);
        tempValues.push(rgbValues[i]);
        base = rgbValues[i];
      }
    }

    for (const t of tempValues) {
      if (isColor(t)) {
        finalValues.push(t);
      }
    }

    if (finalValues.length < 5) {
      console.log(finalValues);
      fillMissing(finalValues);
    }
    else if (finalValues.length > 5) {
      finalValues = finalValues.slice(0, 5);
    }


    return finalValues;
  }

  const fillMissing = (rgbValues) => {
    
    for (let i = 0, pos, newColor; i < 5 - rgbValues.length; i++) {
      pos = getRandomValue(0, rgbValues.length - 1);
      newColor = modifyColor({hsvColor: rgbToHsv(rgbValues[pos]),
        newHue: getRandomValue(-5, 5),
        newSaturation: getRandomValue(-3, 3) / 100,
        newValue: getRandomValue(-3, 3) / 100}
        );
      rgbValues.push(hsvToRgb(newColor));
    };
  }

  const orderByLuminance = (rgbValues) => {
    // Order the colors by relative luminance, lightest to darkest
    rgbValues.sort((a, b) => { return calculatetLuminance(b) - calculatetLuminance(a); });
  }
  
  const extractColors = (imgFile) => {
    // const image = new Image();
    // const fileReader = new FileReader();
    // console.log(imgFile);

    var URL = window.webkitURL || window.URL;
    var imgUrl = URL.createObjectURL(imgFile);
    var img = new Image();
    img.src = imgUrl;

    img.onload = () => {

      // Set the canvas size to be the same as of the uploaded image
      // const canvas = document.getElementById("canvas");
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      /**
       * getImageData returns an array full of RGBA values
       * each pixel consists of four values: the red value of the colour, the green, the blue and the alpha
       * (transparency). For array value consistency reasons,
       * the alpha is not from 0 to 1 like it is in the RGBA of CSS, but from 0 to 255.
       */
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Convert the image data to RGB values so its much simpler
      // console.log(imageData.data);
      // console.log(imageData.data.length);
      // console.log(canvas.width * canvas.height);
      // console.time('building');
      const rgbArray = buildRgb(imageData.data, canvas.width * canvas.height);
      // console.timeEnd('building');
      // console.log(imageData);

      /**
       * Color quantization
       * A process that reduces the number of colors used in an image
       * while trying to visually maintin the original image as much as possible
       */
      // const quantColors = quantization(rgbArray, 0);
      const quantColors = quantizeColor(rgbArray, 0);
      orderByLuminance(quantColors);

      const paletteColors = removeDuplicates(quantColors);
      // console.log(removeDuplicates(quantColors));
      // Create the HTML structure to show the color palette
      // console.log(quantColors);
      setPalette(paletteColors);
    };

    
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

      <input type="file" id="imgfile" onChange={(e) => { extractColors(e.target.files[0]); }} />


      <br />

      {colorPalette ? colorPalette.map((rawColor, index) => {return (<Swatch rgbColor={rawColor} onChange={(e) => {changePalette(index, hexToRgb(e.target.value));}} />)}) : null }

      <br />
{/* 
      <a href={`data:${exportPalette(colorPalette)}`} download="color.json" className='copier'>Download</a> */}

    </div>
  );
}

export default App;
