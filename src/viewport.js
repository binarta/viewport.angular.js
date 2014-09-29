angular.module('viewport', ['config'])
    .service('viewport', ['$window', ViewportService])
    .run(['viewport', '$window', '$rootScope', 'config', UpdateViewportValues])
    .directive('viewport', ['$window', 'viewport', ViewportDirectiveFactory]);

function UpdateViewportValues(viewport, $window, $rootScope, config) {
    var updateViewportValuesForBootstrap2 = function () {
        $rootScope.viewport = {
            phone: viewport.visiblePhone(),
            tablet: viewport.visibleTablet(),
            desktop: viewport.visibleDesktop()
        };
    };

    var updateViewportValuesForBootstrap3 = function () {
        $rootScope.viewport = {
            xs: viewport.visibleXs(),
            sm: viewport.visibleSm(),
            md: viewport.visibleMd(),
            lg: viewport.visibleLg()
        };
    };

    var updateViewportValues = function () {
        if (config.styling == 'bootstrap2') updateViewportValuesForBootstrap2();
        if (config.styling == 'bootstrap3') updateViewportValuesForBootstrap3();
    };

    updateViewportValues();
    var debouncedUpdate = _.debounce(function () {
        $rootScope.$apply(function () {
            updateViewportValues();
        });
    }, 100);

    angular.element($window).on('resize', debouncedUpdate);
}

function ViewportService($window) {
    //Bootstrap3 media queries
    var xsQuery = '(max-width: 767px)';
    var smQuery = '(min-width: 768px) and (max-width:991px)';
    var mdQuery = '(min-width: 992px) and (max-width:1199px)';
    var lgQuery = '(min-width: 1200px)';
    //Bootstrap2 media queries
    var phoneQuery = '(max-width: 767px)';
    var tabletQuery = '(min-width:768px) and (max-width:979px)';
    var desktopQuery = '(min-width: 980px)';

    return {
        visibleXs: function () {
            if ($window.matchMedia) return $window.matchMedia(xsQuery).matches;
            else return false;
        },
        visibleSm: function () {
            if ($window.matchMedia) return $window.matchMedia(smQuery).matches;
            else return false;
        },
        visibleMd: function () {
            if ($window.matchMedia) return $window.matchMedia(mdQuery).matches;
            else return false;
        },
        visibleLg: function () {
            if ($window.matchMedia) return $window.matchMedia(lgQuery).matches;
            else return true;
        },
        visiblePhone: function () {
            if ($window.matchMedia) return $window.matchMedia(phoneQuery).matches;
            else return false;
        },
        visibleTablet: function () {
            if ($window.matchMedia) return $window.matchMedia(tabletQuery).matches;
            else return false;
        },
        visibleDesktop: function () {
            if ($window.matchMedia) return $window.matchMedia(desktopQuery).matches;
            else return true;
        }
    }
}

//@deprecated Use viewport hashmap on $rootScope instead.
function ViewportDirectiveFactory($window, viewport) {
    return {
        restrict: 'C',
        link: function ($scope) {
            $scope.viewport = {};

            function updateViewportValues() {
                $scope.viewport.small = viewport.visiblePhone();
                $scope.viewport.medium = viewport.visibleTablet();
                $scope.viewport.large = !$scope.viewport.small && !$scope.viewport.medium;
            }

            updateViewportValues();

            var debouncedUpdate = _.debounce(function () {
                $scope.$apply(function () {
                    updateViewportValues();
                });
            }, 100);

            angular.element($window).on('resize', debouncedUpdate);
        }
    };
}