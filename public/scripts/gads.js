// @ts-nocheck
// Google Ads gtag init — reads window.__GADS_ID
(() => {
	var id = window.__GADS_ID;
	if (!id) return;
	window.dataLayer = window.dataLayer || [];
	window.gtag = function () {
		window.dataLayer.push(arguments);
	};
	window.gtag("js", new Date());
	window.gtag("config", id);
})();
