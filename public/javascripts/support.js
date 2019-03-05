// const getTotalPrice = (formId, priceDay) => {
//   const form = document.getElementById(formId);
//   const dateStart = form.getElementsById('dateStart');
//   const dateEnd = form.getElementsById('dateEnd');
//   console.log(`dateStart= ${dateStart} dateEnd= ${dateEnd}`);
// };


// Menu

const delClass = (className, elementId) => {
  const element = document.getElementById(elementId);
  element.classList.remove(className);
}

const addClass = (className, elementId) => {
  const element = document.getElementById(elementId);
  element.classList.add(className);
}

// flash-alerts

document.addEventListener('DOMContentLoaded', () => {
  const element = document.getElementsByClassName('alert');
  console.log(element);
  if (element.length > 0) {
    setTimeout(() => {
      element[0].classList.add('hidden');
    }, 2500);
  }
}, false);
