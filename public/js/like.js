/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const doLike = async (tourId) => {
  try {
    const url = `../api/v1/tours/${tourId}/likes`;
    const res = await axios({
      method: 'POST',
      url,
    });
    if (res.data.status === 'success') {
      showAlert('success', `Like tour successfully!`);
      window.setTimeout(() => {
        location.reload();
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const doUnlike = async (tourId) => {
  try {
    const url = `../api/v1/tours/${tourId}/likes`;
    const res = await axios({
      method: 'DELETE',
      url,
    });

    if (res.data.status === 'success') {
      showAlert('success', `Unlike tour successfully!`);
      window.setTimeout(() => {
        location.reload();
      }, 500);
    }
  } catch {
    showAlert('error', err.response.data.message);
  }
};
