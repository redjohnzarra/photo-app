import { Col, Modal, Row, Select, Spin } from 'antd';
import capitalize from 'lodash/capitalize';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import React, { useState } from 'react';
import { albumNamesHardCoded, modalAlertStyle } from '../constants/appConfig';
import { _put } from '../utils/restClient';
import UploadButton from './UploadButton';
import UploadSection from './UploadSection';

const { Option } = Select;

const ImageUploadModal = ({ visible, handleAfterSave, handleCancel }) => {
  const [uploadState, setUploadState] = useState({
    uploading: false,
    fileList: [],
    selectedAlbum: null,
  });

  const updateUploadStateObject = (uploadStateObject) => {
    setUploadState({
      ...uploadState,
      ...uploadStateObject,
    });
  };

  const populateAlbumOptions = () =>
    map(albumNamesHardCoded, (album) => (
      <Option key={album} value={album}>
        {album}
      </Option>
    ));

  const handleSelectAlbum = (selectedAlbum) => {
    updateUploadStateObject({ selectedAlbum });
  };

  const updateFileList = (fileList) => {
    updateUploadStateObject({
      fileList,
    });
  };

  const onUploadClick = () => {
    if (uploadState.selectedAlbum) {
      const formData = new FormData();
      formData.append('album', uploadState.selectedAlbum);
      uploadState.fileList.forEach((file) => {
        formData.append('documents', file);
      });

      uploadPhotos(formData);
    } else {
      Modal.error({
        title: 'No album selected',
        content: 'Please select an album!',
        style: modalAlertStyle,
      });
    }
  };

  const uploadPhotos = (payload) => {
    updateUploadStateObject({
      uploading: true,
    });
    const photoLabel = `photo${uploadState.fileList.length > 1 ? 's' : ''}`;
    _put('/photos', payload)
      .then(() => {
        updateUploadStateObject({
          uploading: false,
        });
        Modal.success({
          title: 'Success',
          content: `${capitalize(photoLabel)} uploaded successfully!`,
          onOk: handleAfterSave,
          style: modalAlertStyle,
        });
      })
      .catch(() => {
        Modal.error({
          title: 'Error',
          content: `Failed to upload the ${photoLabel}`,
          style: modalAlertStyle,
        });
      });
  };

  const populateUploadModalFooter = () => (
    <Col span={24}>
      <Row type="flex" justify="space-between">
        <Col>
          <Select
            className={
              uploadState.selectedAlbum ? 'album-select' : 'album-select-grey'
            }
            value={uploadState.selectedAlbum}
            onChange={handleSelectAlbum}
            bordered={false}
            placeholder="Select album"
          >
            {populateAlbumOptions()}
          </Select>
        </Col>
        <Col>
          <UploadButton
            onClick={onUploadClick}
            disabled={isEmpty(uploadState.fileList)}
          />
        </Col>
      </Row>
    </Col>
  );

  return (
    <Modal
      title="Upload photos"
      visible={visible}
      onCancel={handleCancel}
      footer={populateUploadModalFooter()}
      maskClosable={false}
      className="upload-modal"
    >
      <Spin spinning={uploadState.uploading}>
        <div>
          <Row>
            <Col span={24} className="h-100">
              <UploadSection
                fileList={uploadState.fileList}
                updateFileList={updateFileList}
              />
              {isEmpty(uploadState.fileList) && (
                <div className="file-list-empty">No files selected...</div>
              )}
            </Col>
          </Row>
        </div>
      </Spin>
    </Modal>
  );
};

export default ImageUploadModal;
