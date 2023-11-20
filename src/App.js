import React,{useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './App.css';

function App() {
  const backgroundContext = require.context('./Backgrounds', false, /\.(png|jpe?g|svg)$/);
  const stickerContext = require.context('./Stickers', false, /\.(png|jpe?g|svg)$/);
  const [view,setView] = useState('stickers');
  const backgrounds = backgroundContext.keys().map(backgroundContext);
  const stickers = stickerContext.keys().map(stickerContext);

  return (
    <div className="App">
      <div className="container-fluid" style={{ height: '85vh', border: '1px solid #ddd' }}>
    
      </div>

       <div className="row"  style={{ backgroundColor: '#282c34'}}>
          <div className="col-md-6">
            <button className="btn btn-primary btn-block">Stickers</button>
          </div>
          <div className="col-md-6">
            <button className="btn btn-secondary btn-block">Backgrounds</button>
          </div>
        </div>
      <div className="container-fluid" style={{ height: '15vh', backgroundColor: '#282c34', padding: '10px' }}>
       

      (view === 'stickers' && (
        <div className="row mt-3">
          {stickers.map((sticker, index) => (
            <div key={index} className="col-md-2">
              <img src={sticker} alt={`Sticker ${index + 1}`} style={{ width: '100%' }} />
            </div>
          ))}
        </div>
        ))
       (view === 'backgrounds' && (
        <div className="row mt-3">
          {backgrounds.map((background, index) => (
            <div key={index} className="col-md-2">
              <img src={background} alt={`Background ${index + 1}`} style={{ width: '100%' }} />
            </div>
          ))}
        </div>
        ))
      </div>
    </div>
  );
}

export default App;
