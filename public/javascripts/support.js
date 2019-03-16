// Menu

$(() => {     
  $('.menu-item').on('click', (e) => {
    e.preventDefault();
    $('#menu-content').toggleClass('hidden');
  });
});

// document.addEventListener('DOMContentLoaded', () => {
if ($('.alert').length > 0) {
  setTimeout(() => {
    $('.alert').hide();
  }, 2500);
}
// }, false);

// const updatePass = document.getElementById('btn-update-password');
// if ($('#btn-update-password')) {
//   updatePass.addEventListener('click', () => {
//     delClass('hidden', 'user-update-password');
//   });
  $('#btn-update-password').on('click', (e) => {
    e.preventDefault();
    $('#user-update-password').toggleClass('hidden');
  });

// }

