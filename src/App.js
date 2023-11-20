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
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [placedStickers, setPlacedStickers] = useState([]);
  const [previewSticker, setPreviewSticker] = useState(null);
  const [topContainerStyle, setTopContainerStyle] = useState({ background: 'none' });
  const [isCursorInside, setIsCursorInside] = useState(false);
  const [containerClass, setContainerClass] = useState('');
  const [buttonsVisible, setButtonsVisible] = useState(true);
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

  if (background) {
    setBackgroundImage(background.src);

    const img = new Image();
    img.src = background.src;
    img.onload = () => {
      stretchBackground();
    };
  }
};

const stretchBackground = () => {
  const container = document.getElementById('container-fluid');

  if (container) {
    container.style.backgroundImage = `url(${backgroundImage})`;
    container.style.backgroundSize = '100% 100%';
    container.style.backgroundPosition = 'center';
  }
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

const undoLastSticker = () => {
  setPlacedStickers((prevStickers) => {
    const updatedStickers = [...prevStickers];
    updatedStickers.pop();
    return updatedStickers;
  });
};
  const handleKeyDown = (event) => {
    if (event.shiftKey) {
      switch (event.key) {
        case 'B':
        setButtonsVisible(!buttonsVisible);
        break;
        case 'C':
          setPlacedStickers([]);
          break;
        case 'D':
          downloadImage();
          break;
        case 'Z':
        undoLastSticker();
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


  const handleContainerEnter = () => {
    setIsCursorInside(true);
  };

  const handleContainerLeave = () => {
    setIsCursorInside(false);
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
        className={`container-fluid ${containerClass}`}
        id="container-fluid"
        style={{
          height: '80vh',
          ...topContainerStyle,
          position: 'relative',
        }}
        onClick={handleTopContainerClick}
        onMouseEnter={handleContainerEnter}
        onMouseLeave={handleContainerLeave}
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
            className={`selected-sticker`}
            style={{
              position: 'absolute',
              width: '10.5vw',
              height: '10.5vh',
              left: `${previewSticker.x}px`,
              top: `${previewSticker.y}px`,
              opacity: isCursorInside ? 0.5 : 0,
            }}
          />
        )}
      </div>

 

      <div>
       <div className="row" style={{ backgroundColor: '#282c34',  }}>
      <div className="col-md-6">
        <button
          className={`btn btn-${view === 'stickers' ? 'primary' : 'secondary'} btn-block` }
          style={{visibility: buttonsVisible ? 'visible' : 'hidden'}}
          onClick={() => {
            setView('stickers');
          }}
        >
          Stickers
        </button>
      </div>
      <div className="col-md-6" style={{visibility: buttonsVisible ? 'visible' : 'hidden'}}>
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
                  style={selectedSticker && selectedSticker.alt === sticker.alt ? { border: '2px solid white' } : {}}
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
    </div>
  );
}

export default App;
