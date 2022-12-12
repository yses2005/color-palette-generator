import logo from './logo.svg';
import { useState, useEffect } from 'react';
import {Swatch} from './components/Swatch';
import axios from 'axios';
import './App.css';

function App() {
  const [customizer, setCustom] = useState(null);
  const [colorPalette, setPalette] = useState(null);

  const hex_to_rgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
  };

  const fetchPalette = async (custom) => {
    var data = {
      model : "default",
      input : [custom, "N","N","N","N"],
    }

    // const res = await axios.post('/api/', data).then((response) => {
    //   set(response.data.result)
    // });
    const res = await axios.post('/api/', data);
    setPalette(res.data.result)
    // setPalette(res);
  }

  

  return (
    <div className="App">

      <input type="color" onChange={(e) => {
        setCustom(hex_to_rgb(e.target.value));
        // console.log(customizer);
      }}></input>

      <br />

      <button onClick={() => fetchPalette("N")}> Generate random palette </button>
      <button onClick={() => fetchPalette(customizer)}> Generate palette from color picker </button>

      <br />

      {colorPalette ? colorPalette.map((rawColor) => {return (<Swatch rgbColor={rawColor} />)}) : null }

    </div>
  );
}

export default App;
