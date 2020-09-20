/**
 * App container file. Contains the provider and the component indicator to be used by React.
 */

import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import React, { useState } from 'react';
import './App.css';
import DeletePhotosContext from './context/DeletePhotosContext';
import Main from './pages/Main';

function App() {
  const [imagesToDelete, setImagesToDelete] = useState([]);

  /**
   * Function called when an image is clicked.
   * Updates the images to delete list.
   * @param image
   */
  const handleOnImageSelect = (image) => {
    const newSelectedImages = [...imagesToDelete];
    const selectedImageIdx = findIndex(newSelectedImages, [
      'id',
      get(image, 'id'),
    ]);

    if (selectedImageIdx === -1) {
      newSelectedImages.push(image);
    } else {
      newSelectedImages.splice(selectedImageIdx, 1);
    }

    setImagesToDelete(newSelectedImages);
  };

  return (
    <DeletePhotosContext.Provider
      value={{ imagesToDelete, setImagesToDelete, handleOnImageSelect }}
    >
      <div className="App">
        <Main />
      </div>
    </DeletePhotosContext.Provider>
  );
}

export default App;
