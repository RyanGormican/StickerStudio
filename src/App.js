import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { Icon } from '@iconify/react';

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
  const [clickMode, setClickMode] = useState('place');
  const [selectedStickerIndex, setSelectedStickerIndex] = useState(null);

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

  const handleStickerClick = (sticker, index) => {
    if (clickMode === 'erase') {
      setPlacedStickers((prevStickers) => {
        const updatedStickers = [...prevStickers];
        updatedStickers.splice(index, 1);
        return updatedStickers;
      });
    } else {
      setSelectedStickerIndex(index);
      setSelectedSticker(selectedStickerIndex === index ? null : sticker);
      setPreviewSticker(null);
    }
  };
   const handleMouseMove = (event) => {
    if (clickMode === 'erase') return;

    if (selectedSticker) {
      const x = event.clientX - (10.5 * window.innerWidth) / 200;
      const y = event.clientY - (10.5 * window.innerHeight) / 200;

      setPreviewSticker({ sticker: selectedSticker, x, y });
    }
  };

  const handleContainerStickerMouseDown = (event, sticker, index) => {
    if (clickMode === 'erase') return;

    const rect = event.target.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    document.addEventListener('mousemove', (e) => handleContainerStickerMouseMove(e, sticker, offsetX, offsetY));
    document.addEventListener('mouseup', handleContainerStickerMouseUp);
  };

  const handleContainerStickerMouseMove = (event, sticker, offsetX, offsetY) => {
    if (clickMode === 'erase') return;

    const x = event.clientX - offsetX;
    const y = event.clientY - offsetY;

    setPreviewSticker({ sticker, x, y });
  };

  const handleContainerStickerMouseUp = () => {
    if (clickMode === 'erase') return;

    document.removeEventListener('mousemove', handleContainerStickerMouseMove);
    document.removeEventListener('mouseup', handleContainerStickerMouseUp);

    if (selectedSticker && previewSticker) {
      setPlacedStickers([...placedStickers, previewSticker]);
      setSelectedSticker(null);
      setPreviewSticker(null);
    }
  };

  const handleTopContainerClick = (event) => {
    if (clickMode === 'place') {
      if (selectedSticker) {
        const x = event.clientX - (10.5 * window.innerWidth) / 200;
        const y = event.clientY - (10.5 * window.innerHeight) / 200;

        setPlacedStickers([...placedStickers, { sticker: selectedSticker, x, y }]);
      }
    } else if (clickMode === 'erase') {
      const clickedStickerIndex = placedStickers.findIndex(
        (placedSticker) => {
          const rect = event.target.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;

          return (
            x >= placedSticker.x &&
            x <= placedSticker.x + (10.5 * window.innerWidth) / 200 &&
            y >= placedSticker.y &&
            y <= placedSticker.y + (10.5 * window.innerHeight) / 200
          );
        }
      );

      if (clickedStickerIndex !== -1) {
        const updatedStickers = [...placedStickers];
        updatedStickers.splice(clickedStickerIndex, 1);
        setPlacedStickers(updatedStickers);
      }
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
        case 'P':
          setClickMode('place');
          break;
        case 'E':
          setClickMode('erase');
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
        {/* Render placed stickers in erase mode */}
        {placedStickers.map((placedSticker, index) => (
          <img
            key={index}
            src={placedSticker.sticker.src}
            alt={placedSticker.sticker.alt}
            className={`selected-sticker ${clickMode === 'erase' ? 'erase-mode' : ''}`}
            style={{
              position: 'absolute',
              width: '10.5vw',
              height: '10.5vh',
              left: `${placedSticker.x}px`,
              top: `${placedSticker.y}px`,
              opacity: 1,
            }}
            onMouseDown={(e) => handleContainerStickerMouseDown(e, placedSticker.sticker, index)}
          />
        ))}

        {previewSticker && clickMode !== 'erase' && (
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
            onMouseMove={(e) => handleContainerStickerMouseMove(e, previewSticker.sticker, 0, 0)}
            onMouseUp={handleContainerStickerMouseUp}
          />
        )}
      </div>

      <div>
        <div className="row" style={{ backgroundColor: '#282c34' }}>
          <div className="col-md-6">
            <button
              className={`btn btn-${view === 'stickers' ? 'primary' : 'secondary'} btn-block`}
              style={{ visibility: buttonsVisible ? 'visible' : 'hidden', width: '20vw', fontSize: '3vh' }}
              onClick={() => {
                setView('stickers');
              }}
            >
              Stickers
            </button>
            <button
              className={`btn btn-${view === 'stickers' ? 'secondary' : 'secondary'} btn-block`}
              style={{ visibility: buttonsVisible ? 'visible' : 'hidden', width: '10vw', fontSize: '3vh' }}
              onClick={() => {
                downloadImage();
              }}
            >
              <Icon icon="material-symbols:download" />
            </button>
            <button
              className={`btn btn-${clickMode === 'erase' ? 'primary' : 'secondary'} btn-block`}
              style={{ visibility: buttonsVisible ? 'visible' : 'hidden', width: '10vw', fontSize: '3vh' }}
              onClick={() => {
                setClickMode('erase');
              }}
            >
              <Icon icon="iconoir:erase" />
            </button>
          </div>
          <div className="col-md-6" style={{ visibility: buttonsVisible ? 'visible' : 'hidden' }}>
            <button
              className={`btn btn-${clickMode === 'place' ? 'primary' : 'secondary'} btn-block`}
              style={{ visibility: buttonsVisible ? 'visible' : 'hidden', width: '10vw', fontSize: '3vh' }}
              onClick={() => {
                setClickMode('place');
              }}
            >
              <Icon icon="mingcute:hand-fill" />
            </button>
            <button
              className={`btn btn-${view === 'stickers' ? 'secondary' : 'secondary'} btn-block`}
              style={{ visibility: buttonsVisible ? 'visible' : 'hidden', width: '7.5vw', fontSize: '3vh' }}
              onClick={() => {
                undoLastSticker([]);
              }}
            >
              <Icon icon="material-symbols:undo" />
            </button>
            <button
              className={`btn btn-${view === 'backgrounds' ? 'primary' : 'secondary'} btn-block`}
              onClick={() => setView('backgrounds')}
              style={{ visibility: buttonsVisible ? 'visible' : 'hidden', width: '20vw', fontSize: '3vh' }}
            >
              Backgrounds
            </button>
            <button
              className={`btn btn-${view === 'stickers' ? 'secondary' : 'secondary'} btn-block`}
              style={{ visibility: buttonsVisible ? 'visible' : 'hidden', width: '10vw', fontSize: '3vh' }}
              onClick={() => {
                setPlacedStickers([]);
              }}
            >
              <Icon icon="mdi:broom" />
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
                    className={`image clickable ${selectedStickerIndex === index ? 'selected' : ''}`}
                    onClick={() => handleStickerClick(sticker, index)}
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
                  <img src={background.src} alt={background.alt} className="imageB" />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
