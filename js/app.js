(function toggleNavitation() {
  document.querySelector('.hamburger').addEventListener('click', function () {
    document.querySelector('.nav').classList.toggle('nav--active');
  })
})();