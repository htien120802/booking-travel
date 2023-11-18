/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
// import keys from '../../config/keys';

// const stripe = Stripe(keys.stripeKey);

const stripe = Stripe(
  'pk_test_51ODcUPEJYMV0dwY5NBx9ySEcqL2MIH5NfBdw766sYs1ExEZJ54i4lUFZTSsPrq300Ui3VBblenWgHdD7clqbHRkw00Yb1rUTyg',
);

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
