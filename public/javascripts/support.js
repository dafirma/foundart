
const hideElement = (clicked, hidde) => { //Type string
  $(clicked).on('click', (e) => {
    e.preventDefault();
    $(hidde).toggleClass('hidden');
  });
}
hideElement('.menu-item', '#menu-content'); // Display menu
hideElement('#btn-update-password', '#user-update-password');

// Flash msg
if ($('.alert').length > 0) {
  setTimeout(() => {
    $('.alert').hide();
  }, 2500);
};
