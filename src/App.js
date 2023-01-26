import logo from './logo.svg';
import { useEffect, useState } from 'react';
import { Swatch } from './components/Swatch';
import Blob1 from './components/Blob1';
import Blob2 from './components/Blob2';
import Blob3 from './components/Blob3';
import Blob4 from './components/Blob4';
import Blob5 from './components/Blob5';
import Circle from './components/Circle';
import chroma from 'chroma-js';


import axios from 'axios';
import './App.css';

function App() {

  const[color, setColor] = useState("blue")
  const click = color=>{
    setColor(color)
  }

  /*animation for swatches*/
  const observer2 = new IntersectionObserver((entries) => {
    entries.forEach((entry)=> {
      console.log(entry)
      if(entry.isIntersecting)
      {
        entry.target.classList.add('delay');
      }
      else 
     {
        entry.target.classList.remove('delay');
      }
    })
  })

  const delayEle = document.querySelectorAll('.norm');
  delayEle.forEach((el)=>observer2.observe(el));

  /*animation for section1*/
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry)=> {
      console.log(entry)
      if(entry.isIntersecting)
      {
        entry.target.classList.add('show');
      }
      else 
     {
        entry.target.classList.remove('show');
      }
    })
  })
  const hiddenElements = document.querySelectorAll('.hidden');
  hiddenElements.forEach((el)=>observer.observe(el));

  const BLACK = chroma('black');
  const WHITE = chroma('white');
  const BLWT = [BLACK, WHITE];
  const BW = [BLACK.luminance(), WHITE.luminance()];

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
    const s = getRandomValue(42, 95) / 100;
    const v = getRandomValue(40, 95) / 100;

    return [h, s, v];
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

  const calculateLuminance = (rgbColor) => {
    const temp = rgbColor.map((v) => {
      v /= 255;
      return v <= 0.03928
            ? v / 12.92
            : Math.pow( (v + 0.055) / 1.055, 2.4 );
    });

    return temp[0] * 0.2126 + temp[1] * 0.7152 + temp[2] * 0.0722;
  }

  const calculateContrast = (color1, color2) => {
    let lum1, lum2;
    if (typeof color1 === "object") {
      lum1 = calculateLuminance(color1);
    } 
    else if (typeof color1 === "number") {
      lum1 = color1;
    }

    if (typeof color2 === "object") {
      lum2 = calculateLuminance(color2);
    } 
    else if (typeof color1 === "number") {
      lum2 = color2;
    }

   if (lum1 > lum2) {
    return ((lum2 + 0.05) / (lum1 + 0.05));
   }
   else {
    return ((lum1 + 0.05) / (lum2 + 0.05));
   }
  }

  const getRandomRgb = () => {
    return hsvToRgb(getRandomHsv());
  }

  const complementaryColor = (hsvColor) => {
    const newColor = [...hsvColor];
    newColor[0] = (newColor[0] + 180) % 360;

    return newColor;
  }

  const createColor = ({ hsvColor, newHue = hsvColor[0], newSaturation = hsvColor[1], newValue = hsvColor[2] }) => {
    const newColor = [...hsvColor];
    
    newColor[0] = newHue < 0 ? newHue + 360 : newHue;
    newColor[0] = newColor[0] % 360;
    newColor[1] = newSaturation;
    newColor[2] = newValue;

    if (newColor[1] > 1) {
      newColor[1] = newColor[1] - 0.8;
    }
    else if (newColor[1]  < 0) {
      newColor[1] = newColor[1] + 0.8;
    }

    if (newColor[2] > 1) {
      newColor[2] = newColor[2] - 0.8;
    }
    else if (newColor[2] < 0) {
      newColor[2] = newColor[2] + 0.8;
    }

    return newColor;
  }

  const modifyColor = ({ hsvColor, newHue = hsvColor[0], newSaturation = hsvColor[1], newValue = hsvColor[2] }) => {
    hsvColor[0] = newHue < 0 ? newHue + 360 : newHue;
    hsvColor[0] = hsvColor[0] % 360;
    hsvColor[1] = newSaturation;
    hsvColor[2] = newValue;

    if (hsvColor[1] > 1) {
      hsvColor[1] = hsvColor[1] - 0.8;
    }
    else if (hsvColor[1]  < 0) {
      hsvColor[1] = hsvColor[1] + 0.8;
    }

    if (hsvColor[2] > 1) {
      hsvColor[2] = hsvColor[2] - 0.8;
    }
    else if (hsvColor[2] < 0) {
      hsvColor[2] = hsvColor[2] + 0.8;
    }
  }

  const calculateContrastLum = (luminance1, luminance2) => {
    if (luminance1 > luminance2) {
      return ((luminance2 + 0.05) / (luminance1 + 0.05));
     }
     else {
      return ((luminance1 + 0.05) / (luminance2 + 0.05));
     }
  }
  
  const getTargetLuminance = (lum1, ratio) => {
    let lum2 =  ((lum1 + 0.05) / ratio + 0.05);
    if (lum2 < 0) {
      lum2 = (ratio * ( lum1 + 0.05 ) - 0.05);
    }
    return lum2;
  }

  const calculateHue = (hue) => {
    if (hue < 0) {
      hue = 360 + hue;
    }

    return hue % 360;
  }

  const monochrome = (inputColor) => {
    // Complies to W3C color contrast requirements
    let baseColor = chroma(inputColor);
    let rgbPalette = [];
    let base1, base2, base3, base4, base5;

    base1 = baseColor.luminance(getTargetLuminance(BW[getRandomValue(0, 1)], getRandomValue(25, 45) / 10));
    rgbPalette.push(base1);

    base2 = base1.darken();
    rgbPalette.push(base2);

    base3 = base1.brighten()
    rgbPalette.push(base3);

    base4 = base2.darken();
    rgbPalette.push(base4);

    base5 = base3.brighten();
    rgbPalette.push(base5);

    rgbPalette = rgbPalette.map((chromaColor) => { return chromaColor.rgb(); });
    orderByLuminance(rgbPalette);

    return Promise.resolve(rgbPalette);
  }

  const complement = (inputColor) => {
    let baseColor = chroma(inputColor);
    let rgbPalette = [];
    let base1, base2, base3;

    base1 = baseColor.luminance(getTargetLuminance(BW[getRandomValue(0, 1)], getRandomValue(25, 45) / 10));
    rgbPalette.push(base1);
    
    base2 = base1.darken();
    rgbPalette.push(base2);

    base3 = base1.brighten()
    rgbPalette.push(base3);

    rgbPalette = rgbPalette.map((chromaColor) => { return chromaColor.rgb(); });

    orderByLuminance(rgbPalette, -1);

    rgbPalette.push([255 - rgbPalette[2][0], 255 - rgbPalette[2][1], 255 - rgbPalette[2][2]])
    const idx = getRandomValue(0, 1);
    rgbPalette.push([255 - rgbPalette[idx][0], 255 - rgbPalette[idx][1], 255 - rgbPalette[idx][2]])

    return Promise.resolve(rgbPalette);
  }

  const analogica = (inputColor) => {
    let baseColor = chroma(inputColor);
    let rgbPalette = [];
    let base1, base2, base3, base4, base5;

    base1 = baseColor.luminance(getTargetLuminance(BW[getRandomValue(0, 1)], getRandomValue(25, 45) / 10));
    rgbPalette.push(base1);

    base2 = base1.darken(0.5);
    rgbPalette.push(base2);

    base3 = base1.brighten(0.5)
    rgbPalette.push(base3);

    base4 = base2.darken(0.5);
    rgbPalette.push(base4);

    base5 = base3.brighten(0.5);
    rgbPalette.push(base5);

    // let idx = [0, 1, 2, 3, 4], colorIdx, direction = 1;
    // for (let i = 0; i < 3; i++) {
    //   colorIdx = idx.splice(getRandomValue(0, idx.length - 1), 1)[0];

    //   if (getRandomValue(-1, 1) < 0) {
    //     direction = -1
    //   }

    //   rgbPalette[colorIdx] =  rgbPalette[colorIdx].set('hsv.h', calculateHue(rgbPalette[colorIdx].get('hsv.h') + (direction * getRandomValue(30, 60))));
    // }

    
    rgbPalette.sort((a, b) => { return b.luminance() - a.luminance(); });

    let direction = getRandomValue(-1, 1), brightenVal, saturateVal;
    if (direction < 0) {
      direction = -1
    }
    else {
      direction = 1;
    }

    for (let i = 0; i < 3; i++) {
      brightenVal = getRandomValue(10, 100) / 100;
      saturateVal = getRandomValue(10, 100) / 100;
      direction = -1 * direction;
      rgbPalette[i] =  rgbPalette[i].set('hsv.h', calculateHue(rgbPalette[i].get('hsv.h') + (direction * getRandomValue(30, 60))));
      rgbPalette[i] = rgbPalette[i].brighten(brightenVal);
      rgbPalette[i] = rgbPalette[i].saturate(saturateVal);
    }


    rgbPalette = rgbPalette.map((chromaColor) => { return chromaColor.rgb(); });
    orderByLuminance(rgbPalette);

    for (let r of rgbPalette) {
      console.log(1 / calculateContrast(rgbPalette[0], r));
    }

    return Promise.resolve(rgbPalette);
  }

  const analogic = (inputColor) => {
    const lum1 = calculateLuminance([127, 127, 127]);
    const inputHsv = rgbToHsv(inputColor);
    
    const lum = calculateLuminance(inputColor);
    let outputColor, lum2;
    for (let i = 0.01; i <= 1; i += 0.01) {
      outputColor = hslToRgb([inputHsv[0], i, 1 - lum1]);
      lum2 = calculateLuminance(outputColor);
      console.log(lum, lum1, lum2)
    }


    return Promise.resolve([inputColor, outputColor]);
  }

  // const monochrome = (inputColor) => {
  //   // Complies to W3C color contrast requirements
    
  //   const baseHsv = rgbToHsv(inputColor);
  //   const baseLum = calculateLuminance(inputColor);

  //   let compHsv = [...baseHsv];
  //   while (calculateContrast(baseLum, calculateLuminance(hsvToRgb(compHsv))) > 0.2857) { // 1:4
  //     modifyColor({
  //       hsvColor: compHsv,
  //       newSaturation: compHsv[1] + (getRandomValue(5, 10) / 100),
  //       newValue: compHsv[2] - (getRandomValue(5, 10) / 100), 
  //     });
  //   } 

  //   const compRgb = hsvToRgb(compHsv);
  //   const rgbPalette = [];

  //   const canvas = document.createElement("canvas");
  //   canvas.width = 200;
  //   canvas.height = 1;
  //   const ctx = canvas.getContext("2d", { willReadFrequently : true });

  //   const grd = ctx.createLinearGradient(0,0,200,0);
  //   grd.addColorStop(0,`rgb(${inputColor[0]}, ${inputColor[1]}, ${inputColor[2]})`);
  //   grd.addColorStop(1,`rgb(${compRgb[0]}, ${compRgb[1]}, ${compRgb[2]})`);

  //   ctx.fillStyle = grd;
  //   ctx.fillRect(0,0,200,1);

  //   let swatch;
  //   for (let i = 0; i < 5; i++) {
  //     swatch = ctx.getImageData(i * getRandomValue(40, 45), 0, 1, 1).data;
  //     rgbPalette.push([swatch[0], swatch[1], swatch[2]])
  //   }

  //   for (let r in rgbPalette) {
  //     console.log(1 / calculateContrast(rgbPalette[0], rgbPalette[r]));
  //   }

  //   return Promise.resolve(rgbPalette);
  // }

  
  // const monochromeAlt = (inputColor) => {
  //   // Complies to W3C color contrast requirements
    
  //   const baseHsv = rgbToHsv(inputColor);
  //   const baseLum = calculateLuminance(inputColor);

  //   let compHsv = [...baseHsv];
  //   while (calculateContrast(baseLum, calculateLuminance(hsvToRgb(compHsv))) > 0.2857) { // 1:4
  //     modifyColor({
  //       hsvColor: compHsv,
  //       newSaturation: compHsv[1] + (getRandomValue(5, 10) / 100),
  //       newValue: compHsv[2] - (getRandomValue(5, 10) / 100), 
  //     });
  //   } 

  //   const compRgb = hsvToRgb(compHsv);
  //   const rgbPalette = [];

  //   const canvas = document.createElement("canvas");
  //   canvas.width = 200;
  //   canvas.height = 1;
  //   const ctx = canvas.getContext("2d", { willReadFrequently : true });

  //   const grd = ctx.createLinearGradient(0,0,200,0);
  //   grd.addColorStop(0,`rgb(${inputColor[0]}, ${inputColor[1]}, ${inputColor[2]})`);
  //   grd.addColorStop(1,`rgb(${compRgb[0]}, ${compRgb[1]}, ${compRgb[2]})`);

  //   ctx.fillStyle = grd;
  //   ctx.fillRect(0,0,200,1);

  //   let swatch;
  //   for (let i = 0; i < 5; i++) {
  //     swatch = ctx.getImageData(i * getRandomValue(40, 45), 0, 1, 1).data;
  //     rgbPalette.push([swatch[0], swatch[1], swatch[2]])
  //   }

  //   // let r;
  //   // for (let temp of rgbPalette) {
  //   //   r = chroma(temp);
  //   //   console.log(chroma.contrast(r, 'black'), chroma.contrast(r, 'white'));
  //   //   // r = chroma(temp);
  //   //   // console.log(chroma.contrast(r, 'black'), chroma.contrast('white'));
  //   // }

  //   return Promise.resolve(rgbPalette);
  // }

  // const monochromeAlt1 = (customColor) => {
  //   const baseColor = rgbToHsv(customColor);

  //   let hsvPalette = [];
  //   if (baseColor[2] <= 0.20) {
  //     const color1 = [...baseColor];
  //     const color2 = [...baseColor];
  //     const color3 = [...baseColor];
  //     const color4 = [...baseColor];

  //     color1[2] = getRandomValue(25, 40) / 100;
  //     color2[2] = getRandomValue(45, 60) / 100;
  //     color3[2] = getRandomValue(65, 80) / 100;
  //     color4[2] = getRandomValue(85, 100) / 100;

  //     color1[1] += getRandomValue(-5, 5) / 100;
  //     color2[1] += getRandomValue(-5, 5) / 100;
  //     color3[1] += getRandomValue(-5, 5) / 100;
  //     color4[1] += getRandomValue(-5, 5) / 100;

  //     hsvPalette = [baseColor, color1, color2, color3, color4];
  //   }
  //   else if (baseColor[2] <= 0.40) {
  //     const color1 = [...baseColor];
  //     const color2 = [...baseColor];
  //     const color3 = [...baseColor];
  //     const color4 = [...baseColor];

  //     color1[2] = getRandomValue(18, 23) / 100;
  //     color2[2] = getRandomValue(45, 60) / 100;
  //     color3[2] = getRandomValue(65, 80) / 100;
  //     color4[2] = getRandomValue(85, 100) / 100;

  //     color1[1] += getRandomValue(-5, 5) / 100;
  //     color2[1] += getRandomValue(-5, 5) / 100;
  //     color3[1] += getRandomValue(-5, 5) / 100;
  //     color4[1] += getRandomValue(-5, 5) / 100;


  //     hsvPalette = [color1, baseColor, color2, color3, color4];
  //   }
  //   else if (baseColor[2] <= 0.60) {
  //     const color1 = [...baseColor];
  //     const color2 = [...baseColor];
  //     const color3 = [...baseColor];
  //     const color4 = [...baseColor];

  //     color1[2] = getRandomValue(18, 23) / 100;
  //     color2[2] = getRandomValue(25, 40) / 100;
  //     color3[2] = getRandomValue(65, 80) / 100;
  //     color4[2] = getRandomValue(85, 100) / 100;

  //     color1[1] += getRandomValue(-5, 5) / 100;
  //     color2[1] += getRandomValue(-5, 5) / 100;
  //     color3[1] += getRandomValue(-5, 5) / 100;
  //     color4[1] += getRandomValue(-5, 5) / 100;


  //     hsvPalette = [color1, color2, baseColor, color3, color4];
  //   }
  //   else if (baseColor[2] <= 0.80) {
  //     const color1 = [...baseColor];
  //     const color2 = [...baseColor];
  //     const color3 = [...baseColor];
  //     const color4 = [...baseColor];

  //     color1[2] = getRandomValue(18, 23) / 100;
  //     color2[2] = getRandomValue(25, 40) / 100;
  //     color3[2] = getRandomValue(45, 60) / 100;
  //     color4[2] = getRandomValue(85, 100) / 100;

  //     color1[1] += getRandomValue(-5, 5) / 100;
  //     color2[1] += getRandomValue(-5, 5) / 100;
  //     color3[1] += getRandomValue(-5, 5) / 100;
  //     color4[1] += getRandomValue(-5, 5) / 100;

  //     hsvPalette = [color1, color2, color3, baseColor, color4];
  //   }
  //   else if (baseColor[2] <= 1.00) {
  //     const color1 = [...baseColor];
  //     const color2 = [...baseColor];
  //     const color3 = [...baseColor];
  //     const color4 = [...baseColor];

  //     color1[2] = getRandomValue(18, 23) / 100;
  //     color2[2] = getRandomValue(25, 40) / 100;
  //     color3[2] = getRandomValue(45, 60) / 100;
  //     color4[2] = getRandomValue(65, 80) / 100;

  //     color1[1] += getRandomValue(-5, 5) / 100;
  //     color2[1] += getRandomValue(-5, 5) / 100;
  //     color3[1] += getRandomValue(-5, 5) / 100;
  //     color4[1] += getRandomValue(-5, 5) / 100;

  //     hsvPalette = [color1, color2, color3, color4, baseColor];
  //   } 
    
  //   const rgbPalette = hsvPalette.map((hsvColor) => {return hsvToRgb(hsvColor);});
  //   console.log(calculateContrast(rgbPalette[0], rgbPalette[4]));
  //   return rgbPalette;
  // }

  // const monochromeAlt2 = (inputColor) => {
  //   // s: 20 40 60 80 100
  //   // v: 20 40 60 80 100
  //   const baseHsv = rgbToHsv(inputColor);
  //   const baseHsl = rgbToHsl(inputColor);
  //   const baseLum = calculateLuminance(inputColor);

  //   let hsvPalette = [baseHsv];
  //   for (let i = 0; i < 3; i++) {
  //     hsvPalette.push(createColor({
  //       hsvColor: hsvPalette[i],
  //       newSaturation: hsvPalette[i][1] + (getRandomValue(10, 15) / 100),
  //       newValue: hsvPalette[i][2] - (getRandomValue(10, 15) / 100),
  //     }))
  //   }
  //   var l2 = ( ( baseLum + 0.05 ) / 3.5 - 0.05 );
  //   if (l2 < 0) {
  //     l2 = ( 3.5 * ( baseLum + 0.05 ) - 0.05 );
  //   }

  //   hsvPalette.push(([baseHsl[0], baseHsl[1], l2]))

    
  //   const rgbPalette = hsvPalette.map((hsvColor) => {return hsvToRgb(hsvColor);});
  //   orderByLuminance(rgbPalette);
  //   console.log(calculateContrast(rgbPalette[0], rgbPalette[4]));
  //   return rgbPalette;
  // }

  // const complement = (inputColor) => {
  //   let baseColor = chroma(inputColor);
  //   let compColor = chroma(inputColor.map((channel) => { return (255 - channel); }));

  //   let rgbPalette = [];
  //   // let prevRatio = 2.5, currRatio, lum1, lum2;
  //   // for (let i = 0; i < 3; i++) {
  //   //   lum1 = BW[getRandomValue(0, 1)];
  //   //   currRatio = getRandomValue((prevRatio + 2) * 10, (prevRatio + 4) * 10) / 10;

  //   //   lum2 = ((lum1 + 0.05) / currRatio + 0.05);
  //   //   if (lum2 < 0) {
  //   //     lum2 = (currRatio * ( lum1 + 0.05 ) - 0.05);
  //   //   }

  //   //   console.log(ratio);

  //   //   rgbPalette.push(baseColor.luminance(lum2).rgb());
  //   //   prevRatio = currRatio;
  //   // }

  //   orderByLuminance(rgbPalette);
  //   let ratio, comparison, lum1, lum2;
  //   let base1, base2, base3;
  //   let darkComp, lightComp;
  //   let mod1, mod2;
  //   // mid base 
  //   comparison = getRandomValue(0, 1);
  //   lum1 = BW[comparison];
  //   ratio = getRandomValue(25, 45) / 10

  //   lum2 = ((lum1 + 0.05) / ratio + 0.05);
  //   if (lum2 < 0) {
  //     lum2 = (ratio * ( lum1 + 0.05 ) - 0.05);
  //   }

  //   base1 = baseColor.luminance(lum2);
  //   rgbPalette.push(base1);
    
  //   lum1 = BW[0];
  //   ratio = getRandomValue(100, 120) / 10;

  //   lum2 = ((lum1 + 0.05) / ratio + 0.05);
  //   if (lum2 < 0) {
  //     lum2 = (ratio * ( lum1 + 0.05 ) - 0.05);
  //   }

  //   base2 = base1.darken();
  //   rgbPalette.push(base2);

  //   base3 = base1.brighten()
  //   rgbPalette.push(base3);

  


  //   rgbPalette = rgbPalette.map((chromaColor) => { return chromaColor.rgb(); });

  //   orderByLuminance(rgbPalette);

  //   rgbPalette.push([255 - rgbPalette[2][0], 255 - rgbPalette[2][1], 255 - rgbPalette[2][2]])
  //   const idx = getRandomValue(0, 1);
  //   rgbPalette.push([255 - rgbPalette[idx][0], 255 - rgbPalette[idx][1], 255 - rgbPalette[idx][2]])


  //   return Promise.resolve(rgbPalette);
  // }

  // const complementAlt3 = (customColor) => {
  //   const baseColor = rgbToHsv(customColor);
  //   // const baseColor = modifyColor({
  //   //   hsvColor: hsvCustom,
  //   //   newSaturation: hsvCustom[1] * (getRandomValue(70, 80) / 100),
  //   //   newValue: hsvCustom[2] * (getRandomValue(80, 90) / 100)
  //   // });

  //   const complementColor = complementaryColor(baseColor);

  //   const baseVariant1 = createColor({
  //     hsvColor: baseColor,
  //     newSaturation: baseColor[1] + (getRandomValue(10, 20) / 100),
  //     newValue: baseColor[2] - (getRandomValue(10, 20) / 100),
  //   });

  //   const baseVariant2 = createColor({
  //     hsvColor: baseColor,
  //     newSaturation: baseColor[1] - (getRandomValue(10, 20) / 100),
  //     newValue: baseColor[2] + (getRandomValue(10, 20) / 100),
  //   });

  //   const complementVariant1 = createColor({
  //     hsvColor: complementColor,
  //     newSaturation: complementColor[1] + (getRandomValue(10, 20) / 100),
  //     newValue: complementColor[2] - (getRandomValue(10, 20) / 100),
  //   });
    
  //   const complementVariant2 = createColor({
  //     hsvColor: complementColor,
  //     newSaturation: complementColor[1] - (getRandomValue(10, 20) / 100),
  //     newValue: complementColor[2] + (getRandomValue(10, 20) / 100),
  //   });


  //   const hsvPalette = [baseColor, baseVariant1, baseVariant2, complementColor, complementVariant1, complementVariant2];
  //   const rgbPalette = hsvPalette.map((hsvSwatch) => {return hsvToRgb(hsvSwatch);});

  //   orderByLuminance(rgbPalette);
  //   rgbPalette.splice(2, 1);
  //   orderByColor(rgbPalette);

  //   return Promise.resolve(rgbPalette);
  // }

  const analogicAlt = (rgbColor) => {
    const baseColor = rgbToHsv(rgbColor);
    const hueModifier = getRandomValue(20, 40);

    const leftColor = createColor({hsvColor: baseColor, newHue: baseColor[0] - hueModifier});

    const rightColor = createColor({hsvColor: baseColor, newHue: baseColor[0] + hueModifier});

    let leftDirection;
    if (getRandomValue(-1, 1) > 0) {
      leftDirection = 1
    }
    else {
      leftDirection = -1
    }

    const leftColor2 = createColor({
      hsvColor: leftColor, 
      newSaturation: leftColor[1] +  (leftDirection * getRandomValue(20, 30) / 100),
      newValue: leftColor[2] - (leftDirection * getRandomValue(20, 30) / 100),
    });

    let rightDirection;
    if (getRandomValue(-1, 1) > 0) {
      rightDirection = 1
    }
    else {
      rightDirection = -1
    }

    const rightColor2 = createColor({
      hsvColor: rightColor, 
      newSaturation: rightColor[1] + (rightDirection * getRandomValue(20, 30) / 100),
      newValue: rightColor[2] - (rightDirection * getRandomValue(20, 30) / 100),
    });

    // const hsvPalette = [leftColor2, leftColor, baseColor, rightColor, rightColor2];
    const hsvPalette = [leftColor, baseColor, rightColor];
    const rgbPalette = hsvPalette.map((hsvSwatch) => {return hsvToRgb(hsvSwatch);});
    orderByLuminance(rgbPalette);

    for (let r of rgbPalette) {
      console.log(calculateLuminance(r));
    }

    // orderByColor(rgbPalette);

    return rgbPalette;
  }

  const equivalentGray = (rgbColor) => {
    const luminance = calculateLuminance(rgbColor);

    let l = 0, r = 255;

    let mid, midLum;
    while (l < r) {
      mid = (l + r) / 2;
      midLum = calculateLuminance([mid, mid, mid]);

      if (midLum === luminance) {
        break;
      }
      else if (midLum > luminance) {
        r = mid - 1;
      }
      else {
        l = mid + 1;
      }  // midLum < luminance

    }

    return Math.round(mid);
  }

  const hslToRgb = (hslColor) => {
    const [h, s, l] = hslColor;

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
  
  const rgbToHsl = (rgbColor) => {
    const [r, g, b] = rgbColor;

    const newR = r / 255;
    const newG = g / 255;
    const newB = b / 255;

    const cMax = Math.max(newR, newG, newB);
    const cMin = Math.min(newR, newG, newB);

    const delta = cMax - cMin;
    let h = 0, s = 0, l = 0;

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
      h = 360 + h;
    }

    l = (cMax + cMin) / 2;

    if (delta !== 0) {
        s = delta / (1 - Math.abs((2 * l) - 1));
    }

    h = Math.round(h % 360);
    s = (Math.round(s * 10000)) / 10000;
    l = (Math.round(l * 10000)) / 10000;

    return [h, s, l];
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
      modes = ['monochrome', 'complement'];
    }
    else {
      modes = ['monochrome', 'complement'];
    }

    return modes[getRandomValue(0, modes.length - 1)];
  }

  const [customizer, setCustom] = useState(getRandomRgb());
  const [colorPalette, setPalette] = useState(null);
  const [inputImg, setImg] = useState(null);
  
  const fetchPalette = async (custom) => {
    // // For debugging each palette mode
    // let rawPalette;
    // rawPalette = await analogic(custom);
    // // rawPalette = rawPalette.concat(await complementAlt2(custom));

    const paletteMode = randomizeMode(custom);
    let rawPalette;
    if (paletteMode === 'monochrome') {
      rawPalette = await monochrome(custom);
    }
    else if (paletteMode === 'complement') {
      rawPalette = await complement(custom);
    }
    // else if (paletteMode === 'analogic') {
    //   rawPalette = analogic(custom);
    // }

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

    const data = {};

    let pRgb, pHex, pHsl;
    for (let p in palette) {
      pRgb = palette[p];
      pHex = rgbToHex(pRgb);
      pHsl = rgbToHsl(pRgb);

      pRgb = `rgb(${pRgb[0]}, ${pRgb[1]}, ${pRgb[2]})`;
      pHsl = `hsl(${pHsl[0]}, ${Math.round(pHsl[1] * 100)}%, ${Math.round(pHsl[2] * 100)}%)`;
      
      data[`swatch-${p + 1}`] = {
        'hex': pHex,
        'rgb': pRgb,
        'hsl': pHsl
      }
    }

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

  const isColor = (rgbColor) => {
    return calculateSaturation(rgbColor) !== 0;
  }

  const removeDuplicates = (rgbValues) => {
    let tempValues = [rgbValues[0]];
    let finalValues = [];

    for (let i = 1, base = rgbValues[0], difference; i < rgbValues.length; i++) {
      difference = calculateContrast(base, rgbValues[i]);

      if (difference < 0.9) {
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
      newColor = createColor({hsvColor: rgbToHsv(rgbValues[pos]),
        newHue: getRandomValue(-5, 5),
        newSaturation: getRandomValue(-3, 3) / 100,
        newValue: getRandomValue(-3, 3) / 100}
        );
      rgbValues.push(hsvToRgb(newColor));
    };
  }

  const orderByLuminance = (rgbValues, order=1) => {
    // Order the colors by relative luminance, lightest to darkest
    rgbValues.sort((a, b) => { 
      const lumA = calculateLuminance(a);
      const lumB = calculateLuminance(b);

      return order * (lumB - lumA); 
    });
  }

  const orderByHue = (rgbValues) => {
    // Order the colors by relative luminance, lightest to darkest
    rgbValues.sort((a, b) => { 
      const hueA = rgbToHsv(a)[0];
      const hueB = rgbToHsv(b)[0];

      return hueB - hueA; 
    });
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

    const paletteMode = randomizeMode(custom);
    let rawPalette;
    if (paletteMode === 'monochrome') {
      rawPalette = await monochrome(custom);
    }
    else if (paletteMode === 'complement') {
      rawPalette = await complement(custom);
    }

    setPalette(rawPalette);

  })();
  }, []);

  const sampleWebsite = () => {
    let rawPalette = [...colorPalette];
    orderByLuminance(rawPalette);

    let rgbPalette = rawPalette.map((rgb) => {
      const [r, g, b] = rgb;
      return `rgb(${r},${g},${b})`;
    })

    let namedPalette = {

    };

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (1 / calculateContrast(rawPalette[i], rawPalette[j]) >= 4.5) {
          if (namedPalette[rgbPalette[i]] === undefined) {
            namedPalette[rgbPalette[i]] = []
          }

          namedPalette[rgbPalette[i]].push(rgbPalette[j]);
        }
      }
    }

    let namedSwatches = Object.keys(namedPalette);
    if (namedSwatches.length === 0) {
      return;
    }

    let bg1, bg2, swatch1, swatch2, fg1, fg2, t;

    bg1 = namedSwatches.splice(getRandomValue(0, namedSwatches.length - 1), 1)[0];

    bg2 = namedSwatches.splice(getRandomValue(0, namedSwatches.length - 1), 1)[0];

    if (namedPalette[bg2].length > namedPalette[bg1].length) {
      t = bg1;
      bg1 = bg2;
      bg2 = t;
    }

    swatch1 = namedPalette[bg1];
    swatch2 = namedPalette[bg2];

    fg1 = []
    if (swatch1.length > 1) {
      t = getRandomValue(0, swatch1.length - 2)
      fg1 = swatch1.slice(t, t + 2);
    }
    else {
      fg1 = [swatch1[0], swatch1[0]];
    }

    fg2 = swatch2[getRandomValue(0, swatch2.length - 1)];

    return (
      <div id="sampleSite" className = "hidden" 
      style={{  backgroundColor: bg1}}>
    <h1 style={{color: fg1[0]}}>Sample Website</h1>
    <h2 style={{color: fg1[1] }}>Lorem ipsum dolor sit amet,</h2>
    <p style={{color: fg1[1] }}>consectetur adipiscing elit. Fusce ornare dui ipsum, ut consequat libero mattis sit amet. Nam vel sodales diam, nec gravida elit. Sed nibh sapien, pharetra et dapibus ac, auctor eu ipsum.</p>
    <button id = "sampleButton" style = {{backgroundColor: bg2, color: fg2, border: fg2}}>Click me!</button>
  </div>
    );
  }

  return (
    <div className="App">
      <section className = "hidden" id="top" >
        <div className = "elementsContainer">

        <Blob1 className="bg"/>
        <Blob2 className="bg"/>
        <Blob3 className="bg"/>
        <Blob4 className="bg"/>
        <Blob5 className="bg"/>
        <Circle className="bg"/>

          <p className = "behind"> WHITELIGHT </p>
          <p className = "front"> WHITELIGHT </p>

          <div id = "optionCP"> 
            <button className="option-text" id = "pick-text" onClick={() => fetchPalette(customizer)}> <a href="#bot"> colorpick </a></button>
            <input className = "colorPick" type="color" onChange={(e) => { setCustom(hexToRgb(e.target.value));}} />
          </div>

          <div id = "optionU">
            <button className="option-text" id = "upld-text" onClick={() => { extractColors(inputImg); }}> <a href="#bot"> upload </a> </button>
            <input type="file" id="imgfile" onChange={(e) => { setImg(e.target.files[0]); }} />
          </div>

          <div id="labelBorder">
            <label for="imgfile" className = "upldBtn" >
              <i className="fa-solid fa-upload fa-3x"></i>
            </label>
          </div>
        
          <div id = "optionRan">
            <div id = "ranIcon">
              <a href="#bot" onClick={() => fetchPalette(getRandomRgb())}>
              <i class="fa-solid fa-question fa-3x"></i>
              </a>
            </div>
          
            <button className = "option-text" id = "random-text" onClick={() => fetchPalette(getRandomRgb())}> <a href="#bot"> random </a></button>
          </div>

        </div>
      </section>

      
      <section className = "hidden" id="bot">
        <br />

        <div className="palette" >
          {colorPalette ? colorPalette.map((rawColor, index) => {return (<Swatch rgbColor={rawColor} onChange={(e) => {changePalette(index, hexToRgb(e.target.value));}} />)}) : null }
          <br />
        </div>
        
        <a href = "#top"> <i class="fa-solid fa-angles-up fa-3x"></i> </a>
        <a href={`data:${exportPalette(colorPalette)}`} download="color.json" className='copier'>Download here!</a>
        {colorPalette ? sampleWebsite() : null}
        {/* <div id="sampleSite" className = "hidden" 
            style={{  backgroundColor: colorPalette[0]}}>
          <h1 style={{color: "red"}}>Sample Website</h1>
          <h2 style={{color: "blue" }}>Lorem ipsum dolor sit amet,</h2>
          <p style={{color: "black" }}>consectetur adipiscing elit. Fusce ornare dui ipsum, ut consequat libero mattis sit amet. Nam vel sodales diam, nec gravida elit. Sed nibh sapien, pharetra et dapibus ac, auctor eu ipsum.</p>
          <button id = "sampleButton" style = {{backgroundColor: 'green'}}>Click me!</button>
        </div> */}
        
        {/* 
        <a href={`data:${exportPalette(colorPalette)}`} download="color.json" className='copier'>Download</a> */}

      </section>
  </div>
  );
}

export default App;
