class Dialogs {
  constructor() {
    this.buttons = Array.from(document.querySelectorAll('.btn[data-toggle-type="dialog"]'));
    this.obfuscator = document.querySelector(".layout__obfuscator");

    this.addEventListeners();
  }

  addEventListeners() {
    this.buttons.forEach(btn => {
      if (!btn.dataset.toggle)
        return;

      var dialog = document.querySelector(btn.dataset.toggle);

      var close = Array.from(dialog.querySelectorAll(".close"));
      close.forEach(btn => btn.addEventListener('click', () => {
        dialog.classList.remove('open');
      }));

      btn.addEventListener('click', () => {
        dialog.classList.add('open');
      });
    });
  }
}

window.addEventListener('DOMContentLoaded', () => new Dialogs);
