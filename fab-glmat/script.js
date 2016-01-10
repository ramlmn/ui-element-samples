(function() {
  'use strict';

  const outer = document.querySelector('.outer');
  const inner = document.querySelector('.inner');
  const overlay = document.querySelector('.overlay');

  let d = Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2));
  outer.style.width = `${d}px`;
  outer.style.height = `${d}px`;

  outer.style.marginLeft = `${-(outer.clientWidth - window.innerWidth) / 2}px`;
  outer.style.marginTop = `${-(outer.clientHeight - window.innerHeight) / 2}px`;

  let BCR = outer.getBoundingClientRect();

  let initialDiameter = 72;

  let finalScale = 1;
  let initialScale = initialDiameter / BCR.height;

  let initialOpacity = 1;
  let finalOpacity = 0;

  const duration = 250;

  let start = null;
  let isAnimating = false;

  function _clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  let timingFunction = (v, pow = 4) => {
    v = _clamp(v, 0, 1);
    return 1 - Math.pow(1 - v, pow);
  };

  function update(scale, opacity) {
    let matrix = mat4.fromValues(
      scale, 0, 0, 0,
      0, scale, 0, 0,
      0, 0, 1, -(1 / 500),
      0, 0, 0, 1
    );

    let invMatrix = mat4.create();
    mat4.invert(invMatrix, matrix);

    matrix = Array.from(matrix);
    invMatrix = Array.from(invMatrix);

    overlay.style.opacity = opacity;

    outer.style.transform = `matrix3d(${matrix.join(',')})`;
    inner.style.transform = `matrix3d(${invMatrix.join(',')})`;
  }

  function loop() {
    let now = Date.now();
    let final = start + duration;

    if (now >= final) {
      update(finalScale, finalOpacity);

      [initialScale, finalScale] = [finalScale, initialScale];
      [initialOpacity, finalOpacity] = [finalOpacity, initialOpacity];

      outer.style.willChange = '';
      inner.style.willChange = '';

      isAnimating = false;

      return;
    }

    let factor = timingFunction((now - start) / duration);

    let scale = (finalScale - initialScale) * factor + initialScale;
    let opacity = (finalOpacity - initialOpacity) * factor + initialOpacity;

    update(scale, opacity);

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(() =>{
    update(initialScale, initialOpacity);
  });

  inner.addEventListener('click', () => {
    if (isAnimating) {
      return;
    }

    isAnimating = true;

    start = Date.now();

    outer.style.willChange = 'transform';
    inner.style.willChange = 'transform';

    requestAnimationFrame(loop);
  });
})();
