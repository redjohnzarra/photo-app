/**
 * Common file component for populating the upload button found in header.
 */

import { UploadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';

const UploadButton = ({ onClick, disabled }) => {
  return (
    <Button type="text" onClick={onClick} disabled={disabled}>
      <UploadOutlined className="mr-10" />
      Upload
    </Button>
  );
};

export default UploadButton;
