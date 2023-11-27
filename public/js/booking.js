/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
export const deleteBooking = async (id) => {
    try {
        const url = `/api/v1/bookings/${id}`
        const res = await axios({
            method: 'DELETE',
            url,
          });
          
        if (res.data.status === 'success') {
            showAlert('success', `Delete booking successfully!`);
            window.setTimeout(() => {
                location.reload();
              }, 1000);
          }
    }
    catch {
        showAlert('error', err.response.data.message);
    }
  }