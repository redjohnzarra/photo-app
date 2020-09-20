/**
 * File that populates the header section of the app.
 */

import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Row, Select, Typography } from 'antd';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import React, { useContext } from 'react';
import { pageSizes } from '../constants/appConfig';
import DeletePhotosContext from '../context/DeletePhotosContext';
import UploadButton from './UploadButton';

const { Title } = Typography;
const { Option } = Select;

const Header = ({
  selectedPageSize,
  handlePageSizeChange,
  handleOnUploadClick,
  confirmDeletePhotos,
}) => {
  const { imagesToDelete } = useContext(DeletePhotosContext);
  /**
   * Function that populates the options for the page size selection.
   */
  const populatePageOptions = () =>
    map(pageSizes, (size) => (
      <Option key={size} value={size}>
        {size}
      </Option>
    ));

  const photosLabel = imagesToDelete.length > 1 ? 'photos' : 'photo';
  return (
    <Row type="flex" justify="space-between" align="middle">
      <Col>
        <Title level={2}>Photos</Title>
      </Col>
      <Col>
        <Row type="flex" align="middle">
          {!isEmpty(imagesToDelete) && (
            <>
              <Col>
                <Button icon={<DeleteOutlined />} onClick={confirmDeletePhotos}>
                  Delete {imagesToDelete.length} {photosLabel}
                </Button>
              </Col>
              <div className="divider-thick-fixed">|</div>
            </>
          )}

          <Col>
            <UploadButton onClick={handleOnUploadClick} />
          </Col>
          <div className="divider-thick">|</div>
          <Col>
            <Select
              className="page-select"
              value={selectedPageSize}
              onChange={handlePageSizeChange}
              bordered={false}
            >
              {populatePageOptions()}
            </Select>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Header;
