(function () {

	angular.module('gauklerApp', [
		'ngAnimate', 'ngTouch', 'ui.router'
	]);

	/**
	 * @name AppCfg
	 *
	 * @desc Set up the Application
	 */
	function AppCfg( $urlRouterProvider, $stateProvider, $locationProvider )
	{
		$urlRouterProvider
			.otherwise('/');

		$stateProvider
			.state('home', {
				url: '/',
				views: {
					"main": {
						templateUrl: 'partials/intro.html'
					}
				}
			})

			.state('gallerie', {
				url: '/gallerie/{path:.*}',
				views: {
					"main": {
						templateUrl: 'partials/gallery.html'
					}
				},
				onExit: function() {
					// Clear out old slides
					angular.element('#supersized li').remove();
				}
			})

			.state('info', {
				url: '/info/{path:.*}',
				views: {
					"main": {
						templateUrl: 'partials/doc.html'
					}
				}
			})

		;
	}

	AppCfg.$inject = ['$urlRouterProvider', '$stateProvider', '$locationProvider'];
	angular.module('gauklerApp').config(AppCfg);

	/**
	 * @name AppRun
	 *
	 * @desc Data to prepare when we run the application
	 */
	function AppRun( $rootScope, $http )
	{
		$rootScope.data = {};

		$http.get('data.json')
			.then(function(data){
				$rootScope.data = data.data;
			});

		$rootScope.docs = [
			{ key: 'programme', title: 'Programme' },
			{ key: 'charity', title: 'Charity' },
			{ key: 'technik', title: 'Technische Fragen' },
			{ key: 'referenzen', title: 'Referenzen' },
			{ key: 'kosten', title: 'Kosten' },
			{ key: 'kontakt', title: 'Kontakt & Buchung' }
		];

		$rootScope.galleries = [
			{ key: 'akrobatik', image: 'start_01', title: 'Akrobatik' },
			{ key: 'closeup_zaubern', image: 'start_09', title: 'Closeup Zaubern' },
			{ key: 'clownerie_slapstick', image: 'start_07', title: 'Clownerie & Slapstick' },
			{ key: 'einrad_stelzen', image: 'start_02', title: 'Einrad & Stelzen' },
			{ key: 'feuerkunst', image: 'start_03', title: 'Feuerkunst' },
			{ key: 'hulahoop_swinging', image: 'start_04', title: 'Hulahoop & Swinging' },
			{ key: 'jonglage', image: 'start_05', title: 'Jonglage' },
			{ key: 'lebende_skulpturen', image: 'start_06', title: 'Lebende Skulpturen' },
			{ key: 'walkacts', image: 'start_08', title: 'Walkacts' },
			{ key: 'zauberei', image: 'start_10', title: 'Zauberei' }
		];
	}

	AppRun.$inject = ['$rootScope', '$http'];
	angular.module('gauklerApp').run(AppRun);

	/**
	 * @name NavCtrl
	 */
	function NavCtrl( $rootScope, $scope )
	{
	}

	NavCtrl.$inject = ['$rootScope', '$scope'];
	angular.module('gauklerApp').controller('NavCtrl', NavCtrl);


	/**
	 * @name GalleryCtrl
	 */
	function GalleryCtrl( $rootScope, $scope, $stateParams )
	{
		$scope.list = $rootScope.data[$stateParams.path];

		var initSupersized = function() {
			$.supersized({
				// Functionality
				slide_interval : 4000,
				transition : 1,
				transition_speed : 1000,
				fit_always: 1,
				horizontal_center: 1,
				slide_links : "blank",
				slides : $scope.list
			});
		};

		var loadgallery = function(event) {
			if ( $.supersized.vars.slideshow_interval !== false ) {
				if ($.supersized.vars.in_animation) return false;

				api.playToggle();

				clearInterval($.supersized.vars.slideshow_interval);

				initSupersized();

				api.playToggle();
			} else {
				initSupersized();
			}

			return true;
		};

		var loadcontent = function(event){
			if ( $.supersized.vars.slideshow_interval ) {
				if($.supersized.vars.in_animation) return false;

				if (!$.supersized.vars.is_paused) api.playToggle();
			}

			return true;
		};

		loadgallery();
	}

	GalleryCtrl.$inject = ['$rootScope', '$scope', '$stateParams'];
	angular.module('gauklerApp').controller('GalleryCtrl', GalleryCtrl);


	/**
	 * @name DocCtrl
	 */
	function DocCtrl( $scope, $stateParams, $http, $sce )
	{
		$http.get('data/' + $stateParams.path + ".html")
			.then(function(data){
				$scope.content = $sce.trustAsHtml(data.data);
			});
	}

	DocCtrl.$inject = ['$scope', '$stateParams', '$http', '$sce'];
	angular.module('gauklerApp').controller('DocCtrl', DocCtrl);


})();
