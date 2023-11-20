import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './App.css';

function App() {
  // Dynamic import of images from the "Backgrounds" and "Stickers" folders
  const backgroundContext = require.context('./Backgrounds', false, /\.(png|jpe?g|svg)$/);
  const stickerContext = require.context('./Stickers', false, /\.(png|jpe?g|svg)$/);

  const backgrounds = backgroundContext.keys().map(backgroundContext);
  const stickers = stickerContext.keys().map(stickerContext);

  return (
    <div className="App">
      <div className="container-fluid" style={{ height: '85vh', border: '1px solid #ddd' }}>
    
      </div>

      <div className="container-fluid" style={{ height: '15vh', backgroundColor: '#282c34', padding: '10px' }}>
        <div className="row">
          <div className="col-md-6">
            <button className="btn btn-primary btn-block">Stickers</button>
          </div>
          <div className="col-md-6">
            <button className="btn btn-secondary btn-block">Buttons</button>
          </div>
        </div>


        <div className="row mt-3">
          {stickers.map((sticker, index) => (
            <div key={index} className="col-md-2">
              <img src={sticker} alt={`Sticker ${index + 1}`} style={{ width: '100%' }} />
            </div>
          ))}
        </div>

   
      </div>
    </div>
  );
}

export default App;
