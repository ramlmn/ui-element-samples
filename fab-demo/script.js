'use strict';

class FabExpander {
  constructor() {
    this.toggleFab = this.toggleFab.bind(this);

    this.fab = document.querySelector('.fab');
    this.fabContent = this.fab.querySelector('.fab__content');

    this.resetFab();

    this.fab.addEventListener('click', this.toggleFab, false);
  }

  resetFab() {
    this.fab.classList.remove('last');

    this.fab.style.width = null;
    this.fab.style.height = null;
    this.fab.style.backgroundColor = null;
    this.fab.style.overflow = null;

    requestAnimationFrame(() => {
      const fabBCR = this.fab.getBoundingClientRect();
      const fabContentBCR = this.fabContent.getBoundingClientRect();

      let transform = `translate(-${fabContentBCR.width / 2 - fabBCR.width / 2}px, -${fabContentBCR.height / 2 - fabBCR.height / 2}px)`;

      this.fabContent.style.transform = transform;
      this.fabContent.style.opacity = null;
    });
  }

  toggleFab() {
    const duration = 250;

    let fab = this.fab;
    let fabContent = this.fabContent;

    const fabBCR = this.fab.getBoundingClientRect();
    const fabContentBCR = fabContent.getBoundingClientRect();

    if (fab.classList.contains('last')) {
      this.resetFab();
      return;
    }

    // Yo, Ho! Pythagorean theorem
    const endRad = Math.sqrt(fabContentBCR.height ** 2 + fabContentBCR.width ** 2) - fabBCR.height;
    const startTime = window.performance.now();

    function easing(t) {
      return --t * t * t * t * t + 1;
    }

    function clamp(value, min=Number.NEGATIVE_INFINITY, max=Number.POSITIVE_INFINITY) {
      return Math.min(max, Math.max(min, value));
    }

    function update() {
      let time = (window.performance.now() - startTime) / duration;
      time = clamp(time, 0, 1);
      let remappedTime = easing(time);

      // Start with the same height you have
      let width = endRad * remappedTime + fabBCR.height;

      // Same height and width because it's a circle
      fab.style.width = `${width}px`;
      fab.style.height = `${width}px`;
      fab.style.backgroundColor = `rgba(34, 150, 244, ${1 - remappedTime * 1.5})`;

      fabContent.style.opacity = remappedTime;
      fabContent.style.transform = `translate(${(width - fabContentBCR.width) / 2}px, ${(width - fabContentBCR.height) / 2}px)`;

      if (time < 1) {
        requestAnimationFrame(update);
      } else {
        fab.style.overflow = "visible";
      }
    }

    fab.classList.add('last');
    requestAnimationFrame(update);
  }

}

new FabExpander();
