chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
      _gaq.push(['_trackEvent','Listen', 'Youtube', request.data]);
});

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-44984649-1']);
(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();