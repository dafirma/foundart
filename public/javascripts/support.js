// const getTotalPrice = (formId, priceDay) => {
//   const form = document.getElementById(formId);
//   const dateStart = form.getElementsById('dateStart');
//   const dateEnd = form.getElementsById('dateEnd');
//   console.log(`dateStart= ${dateStart} dateEnd= ${dateEnd}`);
// };


// Menu

function delClass(className, elementId) {
  const element = document.getElementById(elementId);
  element.classList.remove(className);
}

function addClass(className, elementId) {
  const element = document.getElementById(elementId);
  element.classList.add(className);
}
