import React from 'react';

const DeletePhotosContext = React.createContext({
  imagesToDelete: [],
  setImagesToDelete: () => {},
  handleOnImageSelect: () => {},
});

export default DeletePhotosContext;
