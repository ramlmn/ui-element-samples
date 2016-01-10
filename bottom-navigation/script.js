'use strict';

class BottomNavigation {
  constructor() {
    this.handleResize = this.handleResize.bind(this);

    // Get container and backdrop elements
    this.container = document.querySelector('.nav__bottom');
    this.backdrop = this.container.querySelector('.nav__backdrop');

    // Grab all the elements and get current active element
    this.els = Array.from(this.container.querySelectorAll('.nav__element'));
    this.activeElement = document.querySelector('.nav__element--active');

    // Add a resize event
    window.addEventListener('resize', this.handleResize);
    // Call this once
    this.handleResize();

    // Add click event for each element
    this.els.forEach((el) => {
      el.addEventListener('click', (e) => {
        // If the element is already active or
        // another element is still being animated
        if(this.activeElement !== el && !this.isAnimating)
          this.activateElement(e, this.els.indexOf(el));
      });
    });
  }

  activateElement(e, index) {
    // Remove active class for all elements
    this.els.forEach((el) => {
      el.classList.remove('nav__element--active');
    });

    // Get the active element and add the active class
    this.activeElement = this.els[index];
    this.activeElement.classList.add('nav__element--active');

    // Grab the color for backdrop
    let color = this.activeElement.dataset.backdrop;
    this.backdrop.style.backgroundColor = color;

    // Position the backdrop in place
    this.backdrop.style.left = `${e.pageX - this.cleft - this.rad}px`;
    this.backdrop.style.top = `${e.pageY - this.ctop - this.rad}px`;

    // Know if animation is completed
    this.isAnimating = !0;

    // Animate the backdrop
    let animation = this.backdrop.animate([
      {transform: `scale(0)`},
      {transform: `scale(1)`}
    ], {duration: 300, timing: 'linear'});

    // When animation is finished
    animation.onfinish = () => {
      // Indicate animation has finished
      this.isAnimating = !1;

      // Scale down the backdrop and set background for container
      this.backdrop.style.transform = "scale(0)";
      this.container.style.backgroundColor = color;
    }
  }

  handleResize() {
    // Whenever the window is resized
    let bcr = this.container.getBoundingClientRect();

    // Calculate the diagonal of container
    this.rad = Math.sqrt(bcr.height ** 2 + bcr.width ** 2);

    // Store these values for later use
    this.cleft = bcr.left;
    this.ctop = bcr.top;

    // Change the width and height for backdrop
    this.backdrop.style.width = `${this.rad * 2}px`;
    this.backdrop.style.height = `${this.rad * 2}px`;
  }
}

new BottomNavigation();
