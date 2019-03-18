
const hideElement = (clicked, hidde) => { //Type string
  $(clicked).on('click', (e) => {
    e.preventDefault();
    $(hidde).toggleClass('hidden');
  });
}
hideElement('.menu-item', '#menu-content'); // Display menu
hideElement('#btn-update-password', '#user-update-password');
hideElement('#open-search', '#main-search'); // Display serach form

// Hide / Show button search
// function openForm() {
//   document.getElementById('main-search').style.display = 'block';
//   let btn = document.getElementById('container-btn-search');
//   if (btn.style.display === 'block') {
//     btn.style.display = 'none';
//   } else {
//     btn.style.display = 'block';
//   }
//   document.getElementById('container-btn-search').style.display = 'none';
// }

// function closeForm() {
//   document.getElementsById('main-search').style.display = 'none';
// }

// Flash msg
if ($('.alert').length > 0) {
  setTimeout(() => {
    $('.alert').hide();
  }, 2500);
};
