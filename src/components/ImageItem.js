/**
 * File responsible for populating each image section with labels.
 */

import { CheckOutlined } from '@ant-design/icons';
import { Col } from 'antd';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import React, {
  useContext,
  useCallback,
  useLayoutEffect,
  useState,
} from 'react';
import DeletePhotosContext from '../context/DeletePhotosContext';
import { mdMaxIndicator } from '../constants/appConfig';

const ImageItem = ({ image }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { imagesToDelete, handleOnImageSelect } = useContext(
    DeletePhotosContext
  );

  /**
   * Function called when clicking on the image, thus triggering the delete action.
   */
  const handleOnImageClick = () => {
    handleOnImageSelect(image);
  };

  let itemClass = '';
  if (!isEmpty(imagesToDelete)) {
    itemClass =
      findIndex(imagesToDelete, ['id', get(image, 'id')]) === -1
        ? 'image-not-selected'
        : 'image-selected';
  }

  /**
   * Function that is called upon window resize.
   */
  const checkWindowSize = () => {
    setWindowWidth(window.innerWidth);
  };

  /**
   * Callback function that will be called whenever a window resize is triggered.
   * Applies debounce to keep a succeeding function from being called when resize is trigger in
   * a short span of time.
   */
  const resizeWindowHandler = useCallback(debounce(checkWindowSize, 400), []);

  /**
   * Function that adds a listener for window resize and binds it to a function.
   */
  const resizeWindowInitializer = () => {
    window.addEventListener('resize', resizeWindowHandler);
  };
  useLayoutEffect(resizeWindowInitializer, []);

  const isMDOrLess = windowWidth < mdMaxIndicator;
  const usedSizes = isMDOrLess ? { md: 6, sm: 12, xs: 24 } : {};

  return (
    <Col
      className="image-item-container"
      {...usedSizes}
      style={{ width: isMDOrLess ? 'auto' : '20%' }}
    >
      {itemClass === 'image-selected' && (
        <div className="delete-checkmark">
          <CheckOutlined />
        </div>
      )}
      <div
        className={`image-item ${itemClass}`}
        style={{
          backgroundImage: `url(${get(image, 'raw')})`,
        }}
        onClick={handleOnImageClick}
      />
      <div>{get(image, 'name')}</div>
      <b>{get(image, 'album')}</b>
    </Col>
  );
};

export default ImageItem;
