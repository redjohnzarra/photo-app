import React from 'react';
import { Upload } from 'antd';

const { Dragger } = Upload;

const UploadSection = ({ fileList, updateFileList }) => {
  const uploadProps = {
    // name: 'file',
    accept: '.png,.jpeg,.gif',
    multiple: true,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      updateFileList(newFileList);
    },
    beforeUpload: (_file, newFileList) => {
      updateFileList([...fileList, ...newFileList]);

      return false;
    },
    fileList,
    listType: 'picture',
  };

  return (
    <Dragger {...uploadProps}>
      <p className="upload-text">
        Drag 'n' drop some files here, or click to select files
      </p>
    </Dragger>
  );
};

export default UploadSection;
