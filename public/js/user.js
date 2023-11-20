/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const createUser = async (data) => {
    try {
        const url = `/api/v1/users`
        const res = await axios({
            method: 'POST',
            url,
            data,
          });
        if (res.data.status === 'success') {
            showAlert('success', `Create user successfully!`);
            window.setTimeout(() => {
                location.assign('/admin/users');
              }, 500);
          }
    }
    catch {
        showAlert('error', err.response.data.message);
    }
}

// type is either 'password' or 'data'
export const updateUser = async (data, id,type) => {
  try {
    const url =
      type === 'password'
        ? `/api/v1/users/${id}/updatepassword`
        : `/api/v1/users/${id}`;

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
      location.reload();
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteUser = async (id) => {
    try {
        const url = `/api/v1/users/${id}`
        const res = await axios({
            method: 'DELETE',
            url,
          });
          
        if (res.data.status === 'success') {
            showAlert('success', `Delete user successfully!`);
            window.setTimeout(() => {
                location.reload();
              }, 500);
          }
    }
    catch {
        showAlert('error', err.response.data.message);
    }
}
