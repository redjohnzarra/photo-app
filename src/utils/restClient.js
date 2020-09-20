/* eslint-disable no-underscore-dangle */

import axios from 'axios';

import { apiBaseURL } from '../constants/appConfig';

export const _get = (path, config = {}) =>
  new Promise((resolve, reject) => {
    axios
      .get(`${apiBaseURL}${path}`, config)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const _post = (path, body, config = {}) =>
  new Promise((resolve, reject) => {
    axios
      .post(`${apiBaseURL}${path}`, body || {}, config)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const _put = (path, body, config = {}) =>
  new Promise((resolve, reject) => {
    axios
      .put(`${apiBaseURL}${path}`, body || {}, config)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const _patch = (path, body, config = {}) =>
  new Promise((resolve, reject) => {
    axios
      .patch(`${apiBaseURL}${path}`, body || {}, config)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const _delete = (path, config = {}) =>
  new Promise((resolve, reject) => {
    // axios
    //   .delete(`${apiBaseURL}${path}`, config)
    //   .then((response) => {
    //     resolve(response);
    //   })
    //   .catch((error) => {
    //     reject(error);
    //   });
    /**
     * axios.delete doesn't seem to work well when passing the body so I used this one below
     */
    axios({
      method: 'DELETE',
      url: `${apiBaseURL}${path}`,
      ...config,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
