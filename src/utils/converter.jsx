  export const hslToRgb = (hslColor) => {
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
  
  export const rgbToHsl = (rgbColor) => {
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

  export const hsvToRgb = (hsvColor) => {
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

  export const rgbToHsv = (rgbColor) => {
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

  export const valueToHex = (value) => {
    const hexValue = value.toString(16);
    return hexValue.length === 1 ? `0${hexValue}` : hexValue;
  }

  export const hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
  };

  export const rgbToHex = (rgbColor) => {
    const [r, g, b] = rgbColor;

    const hexR = valueToHex(r);
    const hexG = valueToHex(g);
    const hexB = valueToHex(b);

    return `#${hexR}${hexG}${hexB}`;
  }