import React from 'react';
import get from 'lodash/get';
import { Col } from 'antd';

const ImageItem = ({ image }) => {
  return (
    <Col className="image-item-container">
      <div
        className="image-item"
        style={{
          backgroundImage: `url(${get(image, 'raw')})`,
        }}
      />
      <div>{get(image, 'name')}</div>
      <b>{get(image, 'album')}</b>
    </Col>
  );
};

export default ImageItem;
