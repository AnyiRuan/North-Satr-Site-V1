
(function(){
  function initTicker(){
    var wrap = document.querySelector('#brand-ticker .ticker-inner');
    var track = document.querySelector('#brand-ticker .ticker-track');
    if(!wrap || !track) return;
    // Ensure at least 2x width to avoid blank space
    // Clone content until track width >= 2 * wrapper width
    var safety = 0;
    var baseHTML = track.innerHTML;
    while(track.scrollWidth < wrap.clientWidth * 2 && safety < 20){
      track.innerHTML += baseHTML;
      safety++;
    }
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initTicker);
  }else{
    initTicker();
  }
})();
