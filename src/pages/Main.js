/**
 * This file serves as the main container for the whole app.
 */

import { Button, Checkbox, Modal, Spin } from 'antd';
import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import ImageGrid from '../components/ImageGrid';
import ImageUploadModal from '../components/ImageUploadModal';
import {
  hideDeleteInstructionsIndicator,
  pageSizes,
} from '../constants/appConfig';
import DeletePhotosContext from '../context/DeletePhotosContext';
import { _delete, _get, _post } from '../utils/restClient';

const Main = () => {
  let imageListRef = useRef(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { imagesToDelete, setImagesToDelete } = useContext(DeletePhotosContext);

  const [photosState, setPhotosState] = useState({
    list: [],
    loading: false,
    currentPage: 0,
    pageSize: get(pageSizes, 2), // for 25 - default
    loadMore: true,
  });

  /**
   * Common function for updating the photosState state.
   * @param photosStateObject
   */
  const updatePhotosStateObject = (photosStateObject) => {
    setPhotosState({
      ...photosState,
      ...photosStateObject,
    });
  };

  /**
   * Function that checks if the backend API is up and running.
   */
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

  /**
   * Function that fetches the list of photos.
   * @param reset - boolean indicator if the fetch action is to reset (start from the initial loading) or not (when clicking on load more)
   * @param pageSizeParam - number used for the limit of images to be returned from API
   * @param currentPageParam - number indicator for the page the user is currentlty in (used when clicking load more)
   */
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

  /**
   * Function that shows a modal instructions for deleting photos.
   */
  const showDeletePhotosInstructions = () => {
    if (!localStorage.getItem(hideDeleteInstructionsIndicator)) {
      let dontShowChecked = false;
      Modal.info({
        title: 'Deleting photos instruction',
        content: (
          <div>
            <div>To start deleting photos, please click on any image.</div>
            <br />
            <div>
              <Checkbox onChange={(e) => (dontShowChecked = e.target.checked)}>
                Dont show this pop-up again
              </Checkbox>
            </div>
          </div>
        ),
        onOk: () => {
          localStorage.setItem(
            hideDeleteInstructionsIndicator,
            dontShowChecked
          );
        },
      });
    }
  };

  useEffect(showDeletePhotosInstructions, []);

  /**
   * Function triggered when page size select value from header changes.
   * @param pageSize - new page size value selected (number of items to fetch in each API photos fetch request)
   */
  const handlePageSizeChange = (pageSize) => {
    getListOfPhotos(true, pageSize);
  };

  /**
   * Function called after successfully uploading photos.
   */
  const handleAfterImageUpload = () => {
    setShowUploadModal(false);
    resetAndRefetchList();
  };

  /**
   * Common function for refetching the photos list and scrolling to top most portion.
   */
  const resetAndRefetchList = () => {
    getListOfPhotos();
    if (imageListRef) {
      imageListRef.scrollTo(0, 0);
    }
  };

  /**
   * Function called when clicking on Upload button.
   */
  const handleOnUploadClick = () => {
    setShowUploadModal(true);
  };

  /**
   * Function called when closing the upload modal (cancelling the upload process).
   */
  const handleOnUploadCancel = () => {
    setShowUploadModal(false);
  };

  /**
   * Function called when clicking on Load More button.
   */
  const loadMorePhotos = () => {
    const usedPageCounter = photosState.currentPage + 1;
    getListOfPhotos(false, photosState.pageSize, usedPageCounter);
  };

  /**
   * Function called when clicking on Delete n photos button from header.
   * Pops up a confirmation modal if you want to proceed with the action.
   */
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

  /**
   * Function called when delete photos action is confirmed.
   * @param imagesToDeleteLength - length of images to delete
   * @param photosLabel  - label to be used for photos or photo depending on images to delete length
   */
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

  /**
   * Function called after successfully deleting the photos and clicking on the OK button on the success pop-up.
   */
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
