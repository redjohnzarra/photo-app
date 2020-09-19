import React, { useState, useEffect, useRef } from 'react';
import { Modal, Spin, Button } from 'antd';
import get from 'lodash/get';
import Header from '../components/Header';
import ImageUploadModal from '../components/ImageUploadModal';
import ImageGrid from '../components/ImageGrid';
import { pageSizes } from '../constants/appConfig';

import { _get, _post } from '../utils/restClient';

const Main = () => {
  let imageListRef = useRef(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [photosState, setPhotosState] = useState({
    list: [],
    loading: false,
    currentPage: 0,
    pageSize: get(pageSizes, 2), // for 25 - default
    loadMore: true,
  });

  const updatePhotosStateObject = (photosStateObject) => {
    setPhotosState({
      ...photosState,
      ...photosStateObject,
    });
  };

  const checkIfApiActive = () => {
    _get('/health')
      .then(() => {
        getListOfPhotos();
      })
      .catch(() => {
        Modal.error({
          title: 'API error',
          content: (
            <div>
              Backend API is not running. Please run the API and click on{' '}
              <b>Refresh</b> button to try again.
            </div>
          ),
          okText: 'Refresh',
          onOk: () => {
            window.location.reload();
          },
        });
      });
  };

  const getListOfPhotos = (
    reset = true,
    usedPageSize = photosState.pageSize,
    usedCurrentPage = photosState.currentPage
  ) => {
    updatePhotosStateObject({
      loading: true,
    });
    const { list } = photosState;
    _post('/photos/list', {
      skip: usedCurrentPage * usedPageSize,
      limit: usedPageSize,
    })
      .then(({ data }) => {
        const { documents, count, skip } = data;
        const newPhotosList =
          reset && skip === 0 ? data.documents : [...list, ...documents];

        updatePhotosStateObject({
          list: newPhotosList,
          loading: false,
          loadMore: count < usedPageSize ? false : true,
          pageSize: usedPageSize,
          currentPage: usedCurrentPage,
        });
      })
      .catch(() => {
        Modal.error({
          title: 'Error',
          content: 'Failed to fetch photos list!',
          onOk: () => {
            updatePhotosStateObject({
              loading: false,
            });
          },
        });
      });
  };

  useEffect(checkIfApiActive, []);

  const handlePageSizeChange = (pageSize) => {
    getListOfPhotos(true, pageSize);
  };

  const handleAfterImageUpload = () => {
    setShowUploadModal(false);
    getListOfPhotos();
    if (imageListRef) {
      imageListRef.scrollTo(0, 0);
    }
  };

  const handleOnUploadClick = () => {
    setShowUploadModal(true);
  };

  const handleOnUploadCancel = () => {
    setShowUploadModal(false);
  };

  const loadMorePhotos = () => {
    const usedPageCounter = photosState.currentPage + 1;
    getListOfPhotos(false, photosState.pageSize, usedPageCounter);
  };

  return (
    <div>
      <Header
        selectedPageSize={photosState.pageSize}
        handlePageSizeChange={handlePageSizeChange}
        handleOnUploadClick={handleOnUploadClick}
      />
      <Spin spinning={photosState.loading}>
        <div
          className="image-list-container"
          style={{ height: window.innerHeight - 75 }}
          ref={(ref) => (imageListRef = ref)}
        >
          <ImageGrid
            imageList={photosState.list}
            handleOnUploadClick={handleOnUploadClick}
            loading={photosState.loading}
          />

          {photosState.loadMore && !photosState.loading && (
            <div className="load-more-btn">
              <Button type="text" onClick={loadMorePhotos}>
                {' '}
                Load More{' '}
              </Button>
            </div>
          )}
        </div>
      </Spin>
      <ImageUploadModal
        visible={showUploadModal}
        handleAfterSave={handleAfterImageUpload}
        handleCancel={handleOnUploadCancel}
      />
    </div>
  );
};

export default Main;
