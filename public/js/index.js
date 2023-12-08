import '@babel/polyfill';
import { displayMap } from './mapbox';
import { signup } from './signup';
import { login, logout } from './login';
import { forgetpassword, resetpassword } from './resetpassword';
import { updateSettings } from './updateSettings';
import { createUser, updateUser, deleteUser } from './user';
import { createReview, deleteReview, updateReview } from './review';
import { deleteBooking } from './booking';
import { bookTour } from './stripe';
import { doLike, doUnlike } from './like';
import { showAlert } from './alerts';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const signupForm = document.querySelector('.form--signup');
const loginForm = document.querySelector('.form--login');
const forgotPasswordForm = document.querySelector('.form--forget-password');
const resetPasswordForm = document.querySelector('.form--reset-password');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const submitReviewBtn = document.getElementById('btn-submit-review');
const updateReviewBtn = document.getElementById('btn-submit-edit-review');
const searchBtn = document.querySelector('.icon-search');
const likeBtn = document.querySelector('.like-icon');
const unlikeBtn = document.querySelector('.unlike-icon');

// const userDataAddFormInAdmin = document.querySelector('.form-user-add-data');
// const userDataFormInAdmin = document.querySelector('.form-user-data-admin');
// const userPasswordFormInAdmin = document.querySelector(
//   '.form-user-password-admin',
// );
// const btnDeleteModel = document.querySelectorAll('.btn-confirm-delete');
// const btnPagination = document.getElementById('btn-pagination');

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    signup(name, email, password, passwordConfirm);
  });
}

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (forgotPasswordForm)
  forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('btn-send').textContent = 'sending...';
    const email = document.getElementById('email').value;
    forgetpassword(email);
  });

if (resetPasswordForm)
  resetPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('btn-send').textContent = 'submitting...';
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const resetToken = document.getElementById('resetToken').value;
    resetpassword(password, passwordConfirm, resetToken);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
    // const name = document.getElementById('name').value;
    // const email = document.getElementById('email').value;
    // updateSettings({ name, email }, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (bookBtn)
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });

if (submitReviewBtn)
  submitReviewBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const rating = document.querySelector('input[name="rating"]:checked').value;
    const review = document.getElementById('reviewInput').value;
    const tourId = submitReviewBtn.getAttribute('tour-id');
    createReview(tourId, { rating, review });
  });

if (updateReviewBtn)
  updateReviewBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const rating = document.querySelector('input[name="rating"]:checked').value;
    const review = document.getElementById('reviewInput').value;
    const reviewId = updateReviewBtn.getAttribute('review-id');
    updateReview(reviewId, { rating, review });
  });

if (searchBtn)
  searchBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const keyword = document.getElementById('search').value;
    window.setTimeout(() => {
      location.assign(`/all-tours?search=${keyword}`);
    }, 1000);
  });

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);

if (likeBtn)
  likeBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const tourId = likeBtn.getAttribute('tour-id');
    doLike(tourId);
  });

if (unlikeBtn)
  unlikeBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const tourId = unlikeBtn.getAttribute('tour-id');
    doUnlike(tourId);
  });
////////// ADMIN
// if (btnDeleteModel) {
//   btnDeleteModel.forEach((btn) => {
//     btn.addEventListener('click', (e) => {
//       const id = btn.getAttribute('data-id');
//       console.log(id);
//       const objecType = btn.getAttribute('object-type');
//       if (objecType === 'user') {
//         deleteUser(id);
//       } else if (objecType === 'review'){
//         deleteReview(id);
//       } else if (objecType === 'booking'){
//         deleteBooking(id);
//       }
//     })
//   });
// };

// if (userDataAddFormInAdmin)
//   userDataAddFormInAdmin.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const name = document.getElementById('name').value;
//     const email = document.getElementById('email').value;
//     const role = document.querySelector('input[name="role"]:checked').value;
//     const password = document.getElementById('password').value;
//     const passwordConfirm = document.getElementById('passwordConfirm').value;
//     createUser({ name, email, role, password, passwordConfirm });
//   });

// if (userDataFormInAdmin)
//   userDataFormInAdmin.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const form = new FormData();
//     form.append('name', document.getElementById('name').value);
//     form.append('email', document.getElementById('email').value);
//     form.append('photo', document.getElementById('photo').files[0]);
//     const userId = document.getElementById('user-id').value;

//     updateUser(form, userId, 'data');
//   });

// if (userPasswordFormInAdmin)
//   userPasswordFormInAdmin.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     document.querySelector('.btn--save-password').textContent = 'Updating...';
//     const password = document.getElementById('password').value;
//     const passwordConfirm = document.getElementById('password-confirm').value;
//     const userId = document.getElementById('user-id').value;
//     await updateUser({ password, passwordConfirm }, userId, 'password');

//     document.querySelector('.btn--save-password').textContent = 'Save password';
//     document.getElementById('password').value = '';
//     document.getElementById('password-confirm').value = '';
//   });

// if (btnPagination)
//   btnPagination.addEventListener('click', (e) => {
//     const page = e.target.dataset;
//     if (!page) {
//       window.location.href = `/admin/users?page=${page}`;
//     } else {
//       window.location.href = `/admin/users`;
//     }
//   });
