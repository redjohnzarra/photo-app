/**
 * File responsible for populating the image upload modal.
 */

import { Col, Modal, Row, Select, Spin } from 'antd';
import capitalize from 'lodash/capitalize';
import forEach from 'lodash/forEach';
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

  /**
   * Common function for updating the upload state object.
   * @param uploadStateObject
   */
  const updateUploadStateObject = (uploadStateObject) => {
    setUploadState({
      ...uploadState,
      ...uploadStateObject,
    });
  };

  /**
   * Function that populates the album options based on the hardcoded value in appConfig constant file.
   */
  const populateAlbumOptions = () =>
    map(albumNamesHardCoded, (album) => (
      <Option key={album} value={album}>
        {album}
      </Option>
    ));

  /**
   * Function called when selecting an album.
   * @param selectedAlbum
   */
  const handleSelectAlbum = (selectedAlbum) => {
    updateUploadStateObject({ selectedAlbum });
  };

  /**
   * Function that updates the file list during upload action.
   * @param fileList
   */
  const updateFileList = (fileList) => {
    updateUploadStateObject({
      fileList,
    });
  };

  /**
   * Function called when clicking on the upload button on the modal.
   * Pops up an error message if no album is selected.
   */
  const onUploadClick = () => {
    if (uploadState.selectedAlbum) {
      const formData = new FormData();
      formData.append('album', uploadState.selectedAlbum);
      forEach(uploadState.fileList, (file) => {
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

  /**
   * Function for uploading the photos to the API.
   * @param payload
   */
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
          onOk: () => {
            handleAfterSave();

            updateUploadStateObject({
              fileList: [],
              selectedAlbum: null,
            });
          },
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

  /**
   * Function for populating the footer section of upload modal where album select component is and the upload button.
   */
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
      destroyOnClose
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
