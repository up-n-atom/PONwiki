const swiper = new Swiper('.swiper', {
  createElements: true,
  pagination: {
    auto: true,
    clickable: true,
    renderBullet: function (index, className) {
      const step = this.slides[index].hasAttribute('step') ? this.slides[index].getAttribute('step') : index + 1;
      return '<span class="' + className + '">step ' + step + "</span>";
    },
  },
  navigation: true,
  on: {
    afterInit: function (swiper) {
      let stepsElement = this.el.nextElementSibling;
      while (!(stepsElement instanceof HTMLOListElement)) {
        stepsElement = stepsElement.nextElementSibling || stepsElement.nextSibling;
      }
      this.slides.map((el, i) => el.hasAttribute('step') ? el.getAttribute('step') - 1 : i).forEach(function (index) {
        if (index < stepsElement.children.length && stepsElement.children[index] instanceof HTMLLIElement) {
          ['click', 'mouseover'].forEach(function (e) {
            stepsElement.children[index].addEventListener(e, () => swiper.slideTo(index));
          });
        }
      });
    },
  },
});
