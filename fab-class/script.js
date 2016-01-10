'use strict';

let timingFunction = (k) => {
  if ((k *= 2) < 1) {
    return 0.5 * k * k * k;
  }
  return 0.5 * ((k -= 2) * k * k + 2);
};

class ExpandableFab {
  constructor(el, radius, duration) {
    this._radius = radius || 72;
    this._duration = duration || 275;

    this._fab = el;
    this._inner = this._fab.querySelector('.fab-inner');
    this._overlay = this._fab.querySelector('.fab-overlay');

    this._loop = this._loop.bind(this);
    this._toggle = this._toggle.bind(this);

    let BCR = this._inner.getBoundingClientRect();
    let fabRadius =
      Math.sqrt(Math.pow(BCR.height, 2) + Math.pow(BCR.width, 2)) + 10;
    this._fab.style.width = `${fabRadius}px`;
    this._fab.style.height = `${fabRadius}px`;

    this._start = null;
    this._isAnimating = false;
    this._expanded = this._fab.getAttribute('expanded') || false;
    this._perspective =
      parseFloat(getComputedStyle(this._fab).perspective) || 500;

    this._initialScale =
      this._radius / parseFloat(getComputedStyle(this._fab).width);
    this._initialOpacity = 1;
    this._finalScale = 1;
    this._finalOpacity = 0;

    this._inner.addEventListener('click', this._toggle);

    if (this._expanded) {
      requestAnimationFrame(
        this._update.bind(this, this._finalScale, this._finalOpacity));
    } else {
      requestAnimationFrame(
        this._update.bind(this, this._initialScale, this._initialOpacity));
    }
  }

  _toggle() {
    if (this._isAnimating) {
      return;
    }

    this._isAnimating = true;

    if (this._expanded) {
      this._collapse();
    } else {
      this._expand();
    }

    this._start = Date.now();

    this._fab.style.willChange = 'transform';
    this._inner.style.willChange = 'transform';

    requestAnimationFrame(this._loop);
  }

  _expand() {
    this._finalScale = 1;
    this._initialScale =
      this._radius / parseFloat(getComputedStyle(this._fab).width);

    this._initialOpacity = 1;
    this._finalOpacity = 0;

    this._expanded = true;
    this._fab.setAttribute('expanded', true);
    document.body.classList.add('obfuscated');
  }

  _collapse() {
    this._finalScale = 
      this._radius / parseFloat(getComputedStyle(this._fab).width);
    this._initialScale = 1;

    this._initialOpacity = 0;
    this._finalOpacity = 1;

    this._expanded = false;
    this._fab.setAttribute('expanded', false);
    document.body.classList.remove('obfuscated');
  }

  _loop() {
    let now = Date.now();
    let final = this._start + this._duration;

    if (now >= final) {
      this._update(this._finalScale, this._finalOpacity);

      this._fab.style.willChange = '';
      this._inner.style.willChange = '';

      this._isAnimating = false;

      return;
    }

    let factor = timingFunction((now - this._start) / this._duration);

    let scale =
      (this._finalScale - this._initialScale) * factor + this._initialScale;
    let opacity =
      (this._finalOpacity - this._initialOpacity) * factor + this._initialOpacity;

    this._update(scale, opacity);

    requestAnimationFrame(this._loop);
  }

  _update(scale, opacity) {

    let matrix = mat4.fromValues(
      scale, 0, 0, 0,
      0, scale, 0, 0,
      0, 0, 1, -(1 / this._perspective),
      0, 0, 0, 1
    );

    let invMatrix = mat4.create();
    mat4.invert(invMatrix, matrix);

    matrix = Array.from(matrix);
    invMatrix = Array.from(invMatrix);

    this._overlay.style.opacity = opacity;

    this._fab.style.transform = `matrix3d(${matrix.join(',')})`;
    this._inner.style.transform = `matrix3d(${invMatrix.join(',')})`;

  }

  get expanded() {
    return this._expanded;
  }

  set expanded(v) {
    this._expanded = v;
    this._toggle();
  }
}

Array.from(document.querySelectorAll('.fab'))
  .forEach(el => {
    new ExpandableFab(el);
  });