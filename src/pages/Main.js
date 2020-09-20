import React, { useState, useEffect, useRef } from 'react';
import { Modal, Spin, Button } from 'antd';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import findIndex from 'lodash/findIndex';
import Header from '../components/Header';
import ImageUploadModal from '../components/ImageUploadModal';
import ImageGrid from '../components/ImageGrid';
import { pageSizes } from '../constants/appConfig';

import { _get, _post, _delete } from '../utils/restClient';

const Main = () => {
  let imageListRef = useRef(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState([]);

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
    pageSizeParam = photosState.pageSize,
    currentPageParam = photosState.currentPage
  ) => {
    const usedPageSize = reset ? get(pageSizes, 2) : pageSizeParam;
    const usedCurrentPage = reset ? 0 : currentPageParam;
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
    resetAndRefetchList();
  };

  const resetAndRefetchList = () => {
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

  const handleOnImageSelect = (image) => {
    const newSelectedImages = [...imagesToDelete];
    const selectedImageIdx = findIndex(newSelectedImages, [
      'id',
      get(image, 'id'),
    ]);

    if (selectedImageIdx === -1) {
      newSelectedImages.push(image);
    } else {
      newSelectedImages.splice(selectedImageIdx, 1);
    }

    setImagesToDelete(newSelectedImages);
  };

  const confirmDeletePhotos = () => {
    let photosLabel = 'photo';
    let demonstrative = 'this';
    const imagesToDeleteLength = imagesToDelete.length;
    if (imagesToDeleteLength > 1) {
      photosLabel = 'photos';
      demonstrative = 'these';
    }
    Modal.confirm({
      title: `Delete ${photosLabel}`,
      content: (
        <div>
          Are you sure you want to delete {demonstrative} {imagesToDeleteLength}{' '}
          {photosLabel}?
        </div>
      ),
      onOk: () => deletePhotos(imagesToDeleteLength, photosLabel),
    });
  };

  const deletePhotos = (imagesToDeleteLength, photosLabel) => {
    const toDeleteList = [];
    forEach(imagesToDelete, (image) => {
      const album = get(image, 'album');
      const name = get(image, 'name');
      const albumIndex = findIndex(toDeleteList, ['album', album]);
      if (albumIndex === -1) {
        toDeleteList.push({
          album,
          documents: name,
        });
      } else {
        toDeleteList[albumIndex] = {
          album,
          documents: get(toDeleteList, `${albumIndex}.documents`) + ',' + name,
        };
      }
    });

    _delete('/photos', {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      data: JSON.stringify(toDeleteList),
    })
      .then(() => {
        Modal.success({
          title: 'Success',
          content: `Successfully deleted ${imagesToDeleteLength} ${photosLabel}!`,
          onOk: handleAfterDelete,
        });
      })
      .catch(() => {
        Modal.error({
          title: 'Error',
          content: `Failed to delete the ${photosLabel}!`,
        });
      });
  };

  const handleAfterDelete = () => {
    setImagesToDelete([]);
    resetAndRefetchList();
  };

  return (
    <div>
      <Header
        selectedPageSize={photosState.pageSize}
        handlePageSizeChange={handlePageSizeChange}
        handleOnUploadClick={handleOnUploadClick}
        selectedToDeleteItems={imagesToDelete}
        confirmDeletePhotos={confirmDeletePhotos}
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
            handleOnImageSelect={handleOnImageSelect}
            selectedToDeleteItems={imagesToDelete}
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
