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
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteReview = async (id) => {
  try {
    const url = `/api/v1/reviews/${id}`;
    const res = await axios({
      method: 'DELETE',
      url,
    });

    if (res.data.status === 'success') {
      showAlert('success', `Delete review successfully!`);
      window.setTimeout(() => {
        location.reload();
      }, 1000);
    }
  } catch {
    showAlert('error', err.response.data.message);
  }
};

export const updateReview = async (id, data) => {
  try {
    const url = `/api/v1/reviews/${id}`;
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `Update review successfully!`);
      window.setTimeout(() => {
        location.assign('/my-reviews');
      }, 1000);
    }
  } catch {
    showAlert('error', err.response.data.message);
  }
};
