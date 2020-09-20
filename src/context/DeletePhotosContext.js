/**
 * Context file for handling the images to delete.
 */

import React from 'react';

const DeletePhotosContext = React.createContext({
  imagesToDelete: [],
  setImagesToDelete: () => {},
  handleOnImageSelect: () => {},
});

export default DeletePhotosContext;
