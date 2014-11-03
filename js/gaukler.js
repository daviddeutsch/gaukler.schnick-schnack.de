jQuery(function($){
	var data,
		loc;

	var initSupersized = function() {
		$.supersized({
			// Functionality
			slide_interval : 4000,
			transition : 1,
			transition_speed : 1000,
			fit_always: 1,
			horizontal_center: 1,
			slide_links : "blank",
			slides : data[loc]
		});
	};

	var loadgallery = function(event) {
		if ( typeof this.hash === 'undefined' ) {
			loc = window.location.hash.slice(1);
		} else {
			loc = this.hash.slice(1);
		}

		if ( $.supersized.vars.slideshow_interval !== false ) {
			if ($.supersized.vars.in_animation) return false;

			api.playToggle();

			$("#supersized li").remove();

			clearInterval($.supersized.vars.slideshow_interval);

			initSupersized();

			api.playToggle();
		} else {
			$("#prevslide, #nextslide, #slidecaption").show();

			$("#intro").remove();
			$("#content").remove();

			initSupersized();
		}

		return true;
	};

	var loadcontent = function(event){
		if ( typeof this.hash === 'undefined' ) {
			loc = window.location.hash.slice(1);
		} else {
			loc = this.hash.slice(1);
		}

		if ( $.supersized.vars.slideshow_interval ) {
			if($.supersized.vars.in_animation) return false;

			if (!$.supersized.vars.is_paused) api.playToggle();

			$("#supersized li").hide();
		}

		$("#prevslide, #nextslide, #slidecaption").hide();
		$("#intro").remove();
		$("#slide-list li").remove();

		$("#content").remove();
		$("#content-wrap").append('<div id="content"></div>');
		$("#content").load("data/"+loc+".html", function(){ $("#content a").click(loadgallery); } );

		return true;
	};

	var redirect = function(event){
// 					window.navigate(event.currentTarget.hash);
		window.location.hash = "#" + event.currentTarget.hash.slice(1);
		window.location.reload(true);
	};

	$.getJSON("data.json", function(json) {
		data = json;

		$("#prevslide, #nextslide").hide();

		$("#menu-main a, .picture_collection a").click(redirect);
		$("#menu-sub a, .button_collection a").click(redirect);

		var sloc = window.location.hash.slice(1);

		if ( sloc ) {
			if ( $.inArray(sloc, ["programme","charity","technik","referenzen","kosten","kontakt"] ) > -1 ) {
				loadcontent();
			} else {
				loadgallery();
			}
		} else {
			$("#intro").show();
		}
	});
});
