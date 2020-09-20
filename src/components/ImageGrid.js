/**
 * File responsible for populating the image grid.
 */

import { Row } from 'antd';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import React from 'react';
import ImageItem from './ImageItem';

const ImageGrid = ({ imageList, handleOnUploadClick, loading }) => {
  /**
   * Function that populates the image grid if image list from the api is not empty or displays a message if the list is emopty.
   */
  const populateImageGrid = () => {
    if (isEmpty(imageList)) {
      return (
        <div className="empty-image-list">
          {!loading && (
            <div>
              List is empty. Click on &nbsp;
              <b className="upload-bold" onClick={handleOnUploadClick}>
                Upload
              </b>
              &nbsp; button to get started.
            </div>
          )}
        </div>
      );
    } else {
      return map(imageList, (image, idx) => (
        <ImageItem key={get(image, 'id', idx)} image={image} />
      ));
    }
  };

  return <Row gutter={15}>{populateImageGrid()}</Row>;
};

export default ImageGrid;
