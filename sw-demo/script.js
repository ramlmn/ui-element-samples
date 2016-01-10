class ExpandableCards {
  constructor() {
    this.items = Array.from(document.querySelectorAll(".item"));
    this.main = document.querySelector('.main');

    this.scrollTo = this.scrollTo.bind(this);
    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
    this.scrollRAFID = null;

    this.addEventListeners();
  }

  addEventListeners() {

    this.items.forEach(item => {
      let header = item.querySelector(".item__header");
      let headerImage = item.querySelector('.item__header-image');
      let close = item.querySelector('.close');

      let img = new Image();
      img.src = headerImage.dataset.bg;
      img.addEventListener('load', () => {
        headerImage.style.background = `#EEE url(${img.src}) no-repeat center center / cover`;
      });

      item.addEventListener('click', this.expand.bind(undefined, item), false);
      close.addEventListener('click', this.collapse.bind(undefined, item), false);
    });
  }

  collapse(item, e) {
    e.stopPropagation();
    if (!item.classList.contains('last'))
      return;

    item.classList.remove('last');
    this.main.style.overflowY = 'auto';
    // this.rafID = requestAnimationFrame(() => {this.scrollTo(this.main, item.dataset.top ? item.dataset.top : 0, 150)});
  }

  expand(item) {
    if (item.classList.contains('last'))
      return;

    // item.dataset.top = this.main.scrollTop;
    this.main.style.overflowY = 'hidden';
    item.classList.add('last');
    this.scrollRAFID = requestAnimationFrame(() => {
      this.scrollTo(this.main, item.offsetTop - 20, 275)
    });

  }

  scrollTo(element, to, duration) {
    let start = Date.now(),
      from = element.scrollTop;

    if (from === to) return;

    function scroll(rafid) {
      let currentTime = Date.now(),
        diff = Math.min(1, ((currentTime - start) / duration));

      element.scrollTop = (diff * (to - from)) + from;

      if (diff < 1)
        requestAnimationFrame(scroll);
      else
        cancelAnimationFrame(rafid);
    }

    requestAnimationFrame(()=> scroll(this.scrollRAFID));
  }

}

window.addEventListener('load', () => new ExpandableCards);
