'use strict';

class FabExpander {
  constructor() {
    this.toggleFab = this.toggleFab.bind(this);
    this.update_ = this.update_.bind(this);
    this.first = this.first.bind(this);
    this.last = this.last.bind(this);
    this.invert = this.invert.bind(this);
    this.play = this.play.bind(this);

    this.delay_ = 0;
    this.duration_ = 200;

    this.first_ = {
      layout: null,
      opacity: 0
    };

    this.last_ = {
      layout: null,
      opacity: 0
    };

    this.invert_ = {
      x: 0, y: 0, sx: 1, sy: 1, a: 0
    };

    this.fab = document.querySelector('.fab');
    this.fabContent = this.fab.querySelector('.fab__content');

    const fabBCR = this.fab.getBoundingClientRect();
    const fabContentBCR = this.fabContent.getBoundingClientRect();
    this.fabContent.style.transform = `translate(-${fabContentBCR.width / 2 - fabBCR.width / 2}px, -${fabContentBCR.height / 2 - fabBCR.height / 2}px)`;

    this.fabContent.addEventListener('click', this.toggleFab, false);
  }

  easing_(t) {
    return --t * t * t * t * t + 1;
  }

  toggleFab() {

    if (this.fab.classList.contains("last")) {

      this.fab.classList.remove("last");

      this.fab.style.transformOrigin = null;
      this.fab.style.transform = null;
      this.fab.style.opacity = null;
      this.fab.style.willChange = null;
      this.fab.style.backgroundColor = `rgba(34, 150, 244, 1)`;
      this.fab.style.overflow = "hidden";

      this.fabContent.style.transformOrigin = null;
      this.fabContent.style.transform = null;
      this.fabContent.style.opacity = null;
      this.fabContent.style.willChange = null;

      requestAnimationFrame(() => {
        const fabBCR = this.fab.getBoundingClientRect();
        const fabContentBCR = this.fabContent.getBoundingClientRect();

        let transform = `translate(-${fabContentBCR.width / 2 - fabBCR.width / 2}px, -${fabContentBCR.height / 2 - fabBCR.height / 2}px)`;

        this.fabContent.style.transform = transform;
      });

    } else {

      this.first();
      this.last();
      this.invert();
      this.play();

    }

  }

  clamp_(value, min=Number.NEGATIVE_INFINITY, max=Number.POSITIVE_INFINITY) {
    return Math.min(max, Math.max(min, value));
  }

  first() {
    this.first_.layout = this.fab.getBoundingClientRect();
    this.first_.opacity = window.getComputedStyle(this.fab).opacity;
  }

  last() {
    this.fab.classList.add("last");
    this.last_.layout = this.fab.getBoundingClientRect();
    this.last_.opacity = window.getComputedStyle(this.fab).opacity;

    let fabLayout = this.fab.getBoundingClientRect();
    let fabCLayout = this.fabContent.getBoundingClientRect();
    this.fabContent.style.transform =
      `translate(${(fabLayout.width - fabCLayout.width) / 2 }px, ${(fabLayout.height - fabCLayout.height) / 2}px)`;
  }

  invert() {
    let willChange = [];

    this.updateTransform_ = true;
    this.updateOpacity_ = false;

    // Update the invert values.
    this.invert_.x = this.first_.layout.left - this.last_.layout.left;
    this.invert_.y = this.first_.layout.top - this.last_.layout.top;
    this.invert_.sx = this.first_.layout.width / this.last_.layout.width;
    this.invert_.sy = this.first_.layout.height / this.last_.layout.height;
    this.invert_.a = this.last_.opacity - this.first_.opacity;

    // Apply the transform.
    if (this.updateTransform_) {
      this.fab.style.transformOrigin = '0 0';
      this.fab.style.transform =
          `translate(${this.invert_.x}px, ${this.invert_.y}px)
           scale(${this.invert_.sx}, ${this.invert_.sy})`;

      willChange.push('transform');
    }

    if (this.updateOpacity_) {
      this.fab.style.opacity = this.first_.opacity;
      willChange.push('opacity');
    }

    this.fab.style.willChange = willChange.join(',');
    this.fabContent.style.willChange = willChange.join(',');
  }

  play() {
    if (typeof startTime === 'undefined')
      this.start_ = window.performance.now() + this.delay_;
    else
      this.start_ = startTime + this.delay_;

    requestAnimationFrame(this.update_);
  }

  update_() {
    let time = (window.performance.now() - this.start_) / this.duration_;
    time = this.clamp_(time, 0, 1);
    let remappedTime = this.easing_(time);

    let update = {
      x: this.invert_.x * (1 - remappedTime),
      y: this.invert_.y * (1 - remappedTime),
      sx: this.invert_.sx + (1 - this.invert_.sx) * remappedTime,
      sy: this.invert_.sy + (1 - this.invert_.sy) * remappedTime,
      a: this.first_.opacity + (this.invert_.a) * remappedTime
    };

    if (this.updateTransform_) {
      this.fab.style.transform = `translate(${update.x}px, ${update.y}px) scale(${update.sx}, ${update.sy})`;

      this.fab.style.backgroundColor = `rgba(34, 150, 244, ${Math.min(1, 1 - (remappedTime * 2))})`;
      this.fabContent.style.opacity = remappedTime;
    }

    if (this.updateOpacity_) {
      this.fab.style.opacity = update.a;
    }

    if (time < 1) {
      requestAnimationFrame(this.update_);
    } else {
      this.fab.style.overflow = "visible";
      this.fab.style.transformOrigin = null;
      this.fab.style.transform = null;
      this.fab.style.opacity = null;
      this.fab.style.willChange = null;
      this.fabContent.style.willChange = null;
    }
  }
}

new FabExpander();
