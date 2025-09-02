
/* Injected by automation: seamless marquee duplicator */
(function() {
  function init() {
    var marquee = document.querySelector('#ports-marquee .ports-track');
    if (!marquee || marquee.dataset.cloned === '1') return;
    var children = Array.prototype.slice.call(marquee.children);
    children.forEach(function(li){
      var clone = li.cloneNode(true);
      clone.setAttribute('aria-hidden','true');
      marquee.appendChild(clone);
    });
    marquee.dataset.cloned = '1';
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
