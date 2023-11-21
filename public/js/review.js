/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const createReview = async (tourId, data) => {
  try {
    const url = `../api/v1/tours/${tourId}/reviews`;
    const res = await axios({
      method: 'POST',
      url,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', `Post your review successfully!`);
      window.setTimeout(() => {
        location.reload();
      }, 300);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
