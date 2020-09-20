import React from 'react';
import { CheckOutlined } from '@ant-design/icons';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import findIndex from 'lodash/findIndex';
import { Col } from 'antd';

const ImageItem = ({ image, onImageSelect, selectedToDeleteItems }) => {
  const handleOnImageClick = () => {
    onImageSelect(image);
  };

  let itemClass = '';
  if (!isEmpty(selectedToDeleteItems)) {
    itemClass =
      findIndex(selectedToDeleteItems, ['id', get(image, 'id')]) === -1
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
