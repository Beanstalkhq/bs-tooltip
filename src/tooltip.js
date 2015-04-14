angular.module('bs-tooltip')
	.directive('bsTooltip', function() {
		var idCounter = 0;
		var TIMEOUT = 1000;
		return {
			restrict: "A",
			link: function(scope, el, attr) {
				var id = ++idCounter;
				var timeout1, timeout2;
				var tooltipEl;
				var tooltipDisplayed = false;
				var instant = attr.bsTooltipInstant || attr.bsTooltipInstant == "";

				/** Setup main hover event for the tooltip **/
				el.on('mouseenter.bstooltip'+id, function(e) {
					if(timeout1) clearTimeout(timeout1);
					if (timeout2) clearTimeout(timeout2);
					timeout1 = setTimeout(function() {
						if(!tooltipDisplayed) {
							renderTooltip(e);
						}
					}, instant ? 100 : TIMEOUT);
				});

				el.on('mouseleave.bstooltip'+id, function() {
					if(timeout2) clearTimeout(timeout2);
					timeout2 = setTimeout(function() {
						clearTimeout(timeout1);
						closeTooltip();
					}, instant ? 100 : 500);
				});

				/** Cleanup events **/
				scope.$on('$destroy', function() {
					closeTooltip();
					clearTimeout(timeout1);
					clearTimeout(timeout2);
					el.off('mouseenter.bstooltip'+id);
					el.off('mouseleave.bstooltip'+id);
				});

				function renderTooltip(e) {
					tooltipDisplayed = true;

					var rect = el[0].getBoundingClientRect();
					var topScroll = $(document).scrollTop();

					tooltipEl = $(
						`
						<span class="bs-tooltip" style="left:${e.clientX}px; top:${topScroll + rect.top + rect.height + 4}px;">${attr.bsTooltip}</span>
						`
					).hide();
					$('body').append(tooltipEl)

					var width = tooltipEl.width();
					var documentWidth = $(document).width();

					var leftPos = rect.left;

					if((leftPos + width + 10) > documentWidth) {
						leftPos = leftPos - (width + 15);
					}

					tooltipEl.css({
						left: leftPos
					}).show();
				}

				function closeTooltip() {
					tooltipDisplayed = false;
					if(tooltipEl) tooltipEl.remove();
				}
			}
		}
	});
