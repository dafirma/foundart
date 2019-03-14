// Menu

const delClass = (className, elementId) => {
  console.log('hola');
  const element = document.getElementById(elementId);
  console.log(element);
  element.classList.remove(className);
};

const addClass = (className, elementId) => {
  const element = document.getElementById(elementId);
  element.classList.add(className);
};

// flash-alerts

// document.addEventListener('DOMContentLoaded', () => {
const element = document.getElementsByClassName('alert');

if (element.length > 0) {
  setTimeout(() => {
    element[0].classList.add('hidden');
  }, 2500);
}
// }, false);

const updatePass = document.getElementById('btn-update-password');
if (updatePass) {
  updatePass.addEventListener('click', () => {
    delClass('hidden', 'user-update-password');
  });
}