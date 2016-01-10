'use strict';

class Fab extends HTMLElement {

  constructor() {

    super();

    let a = "afd";

    const doc = document.currentScript.ownerDocument;
    const tmpl = doc.querySelector('#element-fab-tmpl');

    this._root = this.attachShadow({ mode: 'open' });
    this._root.appendChild(tmpl.content.cloneNode(true));

    this._container = this._root.querySelector('.container');
    this._underlay = this._root.querySelector('.underlay');
    this._element = this._root.querySelector('.element');

    this._duration = 500;

  }

  connectedCallback() {

    this._element.style.background =
      `url(${this.getAttribute('bg')}) no-repeat center center / cover`;

    if (this.getAttribute('expanded')) {

      this.expand(false);

    } else {

      this.collapse(false);

    }

  }

  expand(animate) {

    if (animate) {



    } else {



    }

  }

  collapse(animate) {

    if (animate) {



    } else {



    }

  }

  _addClass() {

  }

  _first() {

    this._containerFirst.layout = this._container.getBoundingClientRect();
    this._containerFirst.opacity =
      parseFloat(window.getComputedStyle(this._container).opacity);

    this._underlayFirst.layout = this._underlay.getBoundingClientRect();
    this._underlayFirst.opacity =
      parseFloat(window.getComputedStyle(this._underlay).opacity);

    this._elementFirst.layout = this._element.getBoundingClientRect();
    this._elementFirst.opacity =
      parseFloat(window.getComputedStyle(this._element).opacity);

  }

  _last(lastClassName) {

    if (typeof lastClassName !== 'undefined')
      this._addClass(lastClassName);

    this._containerLast.layout = this._container.getBoundingClientRect();
    this._containerLast.opacity =
      parseFloat(window.getComputedStyle(this._container).opacity);

    this._underlayLast.layout = this._underlay.getBoundingClientRect();
    this._underlayLast.opacity =
      parseFloat(window.getComputedStyle(this._underlay).opacity);

    this._elementLast.layout = this._element.getBoundingClientRect();
    this._elementLast.opacity =
      parseFloat(window.getComputedStyle(this._element).opacity);

  }

  _invert() {

    let willChange = [];

    // Update the invert values.
    this.invert_.x = this.first_.layout.left - this.last_.layout.left;
    this.invert_.y = this.first_.layout.top - this.last_.layout.top;
    this.invert_.sx = this.first_.layout.width / this.last_.layout.width;
    this.invert_.sy = this.first_.layout.height / this.last_.layout.height;
    this.invert_.a = this.last_.opacity - this.first_.opacity;

    this._containerInvert.x = this._containerFirst.layout.left
      - this._containerLast.layout.left;
    this._containerInvert.y = this._containerFirst.layout.top
      - this._containerLast.layout.top;
    this._containerInvert.sx = this._containerFirst.layout.width
      - this._containerLast.layout.width;
    this._containerInvert.sy = this._containerFirst.layout.height
      - this._containerLast.layout.height;
    this._containerInvert.a = this._containerFirst.opacity
      - this._containerLast.opacity;

    this._underlayInvert.x = this._underlayFirst.layout.left
      - this._underlayLast.layout.left;
    this._underlayInvert.y = this._underlayFirst.layout.top
      - this._underlayLast.layout.top;
    this._underlayInvert.sx = this._underlayFirst.layout.width
      - this._underlayLast.layout.width;
    this._underlayInvert.sy = this._underlayFirst.layout.height
      - this._underlayLast.layout.height;
    this._underlayInvert.a = this._underlayFirst.opacity
      - this._underlayLast.opacity;

    this._elementInvert.x = this._elementFirst.layout.left
      - this._elementLast.layout.left;
    this._elementInvert.y = this._elementFirst.layout.top
      - this._elementLast.layout.top;
    this._elementInvert.sx = this._elementFirst.layout.width
      - this._elementLast.layout.width;
    this._elementInvert.sy = this._elementFirst.layout.height
      - this._elementLast.layout.height;
    this._elementInvert.a = this._elementFirst.opacity
      - this._elementLast.opacity;


    this._container.style.transform =
      `translate(${this._containerInvert.x}px, ${this._containerInvert.y}px)
        scale(${this._containerInvert.sx}, ${this._containerInvert.sy})`;
    this._container.style.opacity = this._containerFirst.opacity;

    this._underlay.style.transform =
      `translate(${this._underlayInvert.x}px, ${this._underlayInvert.y}px)
        scale(${this._underlayInvert.sx}, ${this._underlayInvert.sy})`;
    this._underlay.style.opacity = this._underlayFirst.opacity;

    this._element.style.transform =
      `translate(${this._elementInvert.x}px, ${this._elementInvert.y}px)
        scale(${this._elementInvert.sx}, ${this._elementInvert.sy})`;
    this._element.style.opacity = this._elementFirst.opacity;

  }

  _play(startTime) {

    if (this.invert_ === null)
      throw new Error('invert() must be called before play()');

    this._play_(startTime);

  }

  _clamp_ (value, min=Number.NEGATIVE_INFINITY, max=Number.POSITIVE_INFINITY) {
    return Math.min(max, Math.max(min, value));
  }

  _play_(startTime) {

    if (typeof startTime === 'undefined')
      this._start = window.performance.now();
    else
      this._start = startTime;

    requestAnimationFrame(this._update_);

  }

  _update_() {

    let time = (window.performance.now() - this._start) / this._duration;
    time = this._clamp_(time, 0, 1);
    let rT = this._easing_(time); // remappedTime

    let containerUpdate = {
      x: this._containerInvert.x * (1 - rT),
      y: this._containerInvert.y * (1 - rT),
      sx: this._containerInvert.sx + (1 - this._containerInvert.sx) * rT,
      sy: this._containerInvert.sy + (1 - this._containerInvert.sy) * rT,
      a: this._containerFirst.opacity + (this._containerInvert.a) * rT
    };

    let underlayUpdate = {
      x: this._underlayInvert.x * (1 - rT),
      y: this._underlayInvert.y * (1 - rT),
      sx: this._underlayInvert.sx + (1 - this._underlayInvert.sx) * rT,
      sy: this._underlayInvert.sy + (1 - this._underlayInvert.sy) * rT,
      a: this._underlayFirst.opacity + (this._underlayInvert.a) * rT
    };

    let elementUpdate = {
      x: this._elementInvert.x * (1 - rT),
      y: this._elementInvert.y * (1 - rT),
      sx: this._elementInvert.sx + (1 - this._elementInvert.sx) * rT,
      sy: this._elementInvert.sy + (1 - this._elementInvert.sy) * rT,
      a: this._elementFirst.opacity + (this._elementInvert.a) * rT
    };

    this._container.style.transform =
      `translate(${containerUpdate.x}px, ${containerUpdate.y}px)
        scale(${containerUpdate.sx}, ${containerUpdate.sy})`;
    this._container.style.opacity = containerUpdate.a;

    this._underlay.style.transform =
      `translate(${underlayUpdate.x}px, ${underlayUpdate.y}px)
        scale(${underlayUpdate.sx}, ${underlayUpdate.sy})`;
    this._underlay.style.opacity = underlayUpdate.a;

    this._element.style.transform =
      `translate(${elementUpdate.x}px, ${elementUpdate.y}px)
        scale(${elementUpdate.sx}, ${elementUpdate.sy})`;
    this._element.style.opacity = elementUpdate.a;


    if (time < 1) {
      requestAnimationFrame(this._update_);
    } else {

    }

  }

  disconnectedCallback() {

  }

  attributeChangedCallback(attrName, oldVal, newVal) {

    if (attrName === 'expanded') {
      if (newVal === true) {
        this._expand()
      } else {

      }
    }

  }

}

customElements.define('element-fab', Fab);
