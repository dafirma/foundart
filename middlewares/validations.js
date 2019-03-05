function formFieldsEmpty(formId, redirectPath) {
  const form = document.getElementById(formId);
  let validation = true;
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const { elements } = this;

    function checkLenght() {
      elements.forEach((element) => {
        if (!element.value.length) {
          validation = false;
        }
        return validation;
      });
    }

    if (checkLenght()) {
      this.submit();
    } else {
      req.flash('error', 'Empty fields');
      res.redirect(redirectPath);
    }
  });
}
