import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
function App() {
  const backgroundContext = require.context('./Backgrounds', false, /\.(png|jpe?g|svg)$/);
  const stickerContext = require.context('./Stickers', false, /\.(png|jpe?g|svg)$/);
  const [view, setView] = useState('stickers');
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [placedStickers, setPlacedStickers] = useState([]);
  const [previewSticker, setPreviewSticker] = useState(null);
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

  const handleStickerClick = (sticker) => {
    setSelectedSticker(sticker);
  };

  const handleMouseMove = (event) => {
  if (selectedSticker) {
    const x = event.clientX - (10.5 * window.innerWidth) / 200; 
    const y = event.clientY - (10.5 * window.innerHeight) / 200; 

    setPreviewSticker({ sticker: selectedSticker, x, y });
  }
};

 const handleTopContainerClick = (event) => {
  if (selectedSticker) {
    const x = event.clientX - (10.5 * window.innerWidth) / 200; 
    const y = event.clientY - (10.5 * window.innerHeight) / 200; 

    setPlacedStickers([...placedStickers, { sticker: selectedSticker, x, y }]);
    setPreviewSticker(null);
  }
};
  const handleKeyDown = (event) => {
    if (event.shiftKey) {
      switch (event.key) {
        case 'C':
          setPlacedStickers([]);
          break;
        case 'D':
          downloadImage();
          break;
        default:
          break;
      }
    }
  };


   const downloadImage = () => {
    const topContainer = document.getElementById('container-fluid');

    if (topContainer) {
      html2canvas(topContainer).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, 'image.png');
        });
      });
    } else {

    }
  };



  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  return (
    <div className="App" onMouseMove={handleMouseMove}>
      <div
        className="container-fluid"
        id="container-fluid"
        style={{
          height: '80vh',
          ...topContainerStyle,
          position: 'relative',
        }}
        onClick={handleTopContainerClick}
      >
        {placedStickers.map((placedSticker, index) => (
          <img
            key={index}
            src={placedSticker.sticker.src}
            alt={placedSticker.sticker.alt}
            className="selected-sticker"
            style={{
              position: 'absolute',
              width: '10.5vw',
              height: '10.5vh',
              left: `${placedSticker.x}px`,
              top: `${placedSticker.y}px`,
              opacity: 1,
            }}
          />
        ))}
        {previewSticker && (
          <img
            src={previewSticker.sticker.src}
            alt={previewSticker.sticker.alt}
            className="selected-sticker"
            style={{
              position: 'absolute',
              width: '10.5vw',
              height: '10.5vh',
              left: `${previewSticker.x}px`,
              top: `${previewSticker.y}px`,
              opacity: 0.7,
            }}
          />
        )}
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

      <div className="container-fixed-bottom">
        <div className="row mt-3">
          {view === 'stickers' &&
            stickers.map((sticker, index) => (
              <div key={index} className="col-md-2">
                <img
                  src={sticker.src}
                  alt={sticker.alt}
                  className={`image clickable ${selectedSticker === sticker ? 'selected' : ''}`}
                  onClick={() => handleStickerClick(sticker)}
                />
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
