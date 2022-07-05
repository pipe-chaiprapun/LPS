"use strict";

var App = {
	initLoadPage: function () {
		(function () {

			var treeviewMenu = $('.app-menu');

			// Toggle Sidebar
			$('[data-toggle="sidebar"]').click(function (event) {
				event.preventDefault();
				$('.app').toggleClass('sidenav-toggled');
			});

			// Activate sidebar treeview toggle
			$("[data-toggle='treeview']").click(function (event) {
				event.preventDefault();
				if (!$(this).parent().hasClass('is-expanded')) {
					treeviewMenu.find("[data-toggle='treeview']").parent().removeClass('is-expanded');
				}
				$(this).parent().toggleClass('is-expanded');
			});

			// Set initial active toggle
			$("[data-toggle='treeview.'].is-expanded").parent().toggleClass('is-expanded');

			//Activate bootstrip tooltips
			// $("[data-toggle='tooltip']").tooltip();

			var $th = $('.tableFixHead').find('thead th')
			$('.tableFixHead').on('scroll', function () {
				$th.css('transform', 'translateY(' + this.scrollTop + 'px)');
			});
		})();
	}
}
