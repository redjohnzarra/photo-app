/* eslint-disable no-underscore-dangle */

import axios from 'axios';

import { apiBaseURL } from '../constants/appConfig';

export const _get = (path, config = {}) =>
  new Promise((resolve, reject) => {
    const payload = Object.assign(config, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    });

    axios
      .get(`${apiBaseURL}${path}`, payload)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const _post = (path, body, config = {}) =>
  new Promise((resolve, reject) => {
    const payload = Object.assign(config, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    });

    axios
      .post(`${apiBaseURL}${path}`, body || {}, payload)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const _put = (path, body, config = {}) =>
  new Promise((resolve, reject) => {
    const payload = { ...config };
    console.log('payload: ', payload);
    axios
      .put(`${apiBaseURL}${path}`, body || {}, payload)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const _patch = (path, body, config = {}) =>
  new Promise((resolve, reject) => {
    const payload = Object.assign(config, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    });

    axios
      .patch(`${apiBaseURL}${path}`, body || {}, payload)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const _delete = (path, config = {}) =>
  new Promise((resolve, reject) => {
    const payload = Object.assign(config, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    });

    axios
      .delete(`${apiBaseURL}${path}`, payload)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
