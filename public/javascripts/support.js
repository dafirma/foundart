// Menu

$(() => {
  $('.menu-item').on('click', (e) => {
    e.preventDefault();
    $('#menu-content').toggleClass('hidden');
  });
});

// Flash msg
if ($('.alert').length > 0) {
  setTimeout(() => {
    $('.alert').hide();
  }, 2500);
}

// Show change password form
$('#btn-update-password').on('click', (e) => {
  e.preventDefault();
  $('#user-update-password').toggleClass('hidden');
});