import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const backgroundContext = require.context('./Backgrounds', false, /\.(png|jpe?g|svg)$/);
  const stickerContext = require.context('./Stickers', false, /\.(png|jpe?g|svg)$/);
  const [view, setView] = useState('stickers');
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [topContainerStyle, setTopContainerStyle] = useState({ background: 'none' });

  const backgrounds = backgroundContext.keys().map((key, index) => ({
    src: backgroundContext(key),
    alt: `Background ${index + 1}`,
  }));

  const stickers = stickerContext.keys().map((key, index) => ({
    src: stickerContext(key),
    alt: `Sticker ${index + 1}`,
  }));

  const handleBackgroundClick = (background) => {
    setSelectedBackground(background);
    setTopContainerStyle({
      background: `url(${background.src})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    });
  };

  return (
    <div className="App">
      <div className="container-fluid" style={{ height: '80vh', ...topContainerStyle }}>

      </div>

      <div className="row" style={{ backgroundColor: '#282c34' }}>
        <div className="col-md-6">
          <button
            className={`btn btn-${view === 'stickers' ? 'primary' : 'secondary'} btn-block`}
            onClick={() => {
              setView('stickers');
            }}
          >
            Stickers
          </button>
        </div>
        <div className="col-md-6">
          <button
            className={`btn btn-${view === 'backgrounds' ? 'primary' : 'secondary'} btn-block`}
            onClick={() => setView('backgrounds')}
          >
            Backgrounds
          </button>
        </div>
      </div>

      <div className="container-fixed-bottom>
        <div className="row mt-3">
          {view === 'stickers' &&
            stickers.map((sticker, index) => (
              <div key={index} className="col-md-2">
                <img src={sticker.src} alt={sticker.alt} className="image" />
              </div>
            ))}
          {view === 'backgrounds' &&
            backgrounds.map((background, index) => (
              <div
                key={index}
                className={`col-md-2 clickable ${selectedBackground === background ? 'selected' : ''}`}
                onClick={() => handleBackgroundClick(background)}
              >
                <img src={background.src} alt={background.alt} className="image" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
