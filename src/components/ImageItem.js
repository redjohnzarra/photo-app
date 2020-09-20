import { CheckOutlined } from '@ant-design/icons';
import { Col } from 'antd';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import React, { useContext } from 'react';
import DeletePhotosContext from '../context/DeletePhotosContext';

const ImageItem = ({ image }) => {
  const { imagesToDelete, handleOnImageSelect } = useContext(
    DeletePhotosContext
  );
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

  return (
    <Col className="image-item-container">
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
