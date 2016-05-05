angular.module('viewport', ['config', 'angularx'])
    .service('viewport', ['$window', 'binDebounce', ViewportService])
    .run(['viewport', '$rootScope', 'config', UpdateViewportValues])
    .directive('viewport', ['viewport', ViewportDirectiveFactory]);

function UpdateViewportValues(viewport, $rootScope, config) {
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

    viewport.onChange(updateViewportValues);
}

function ViewportService($window, binDebounce) {
    //Bootstrap3 media queries
    var xsQuery = '(max-width: 767px)';
    var smQuery = '(min-width: 768px) and (max-width:991px)';
    var mdQuery = '(min-width: 992px) and (max-width:1199px)';
    var lgQuery = '(min-width: 1200px)';
    //Bootstrap2 media queries
    var tabletQuery = '(min-width:768px) and (max-width:979px)';
    var desktopQuery = '(min-width: 980px)';

    var size;
    angular.element($window).on('resize', function () {
        size = undefined;
    });

    function getSize() {
        if (!size) {
            var match = $window.matchMedia;
            if (!match) size = 'lg';
            if (!size && match(xsQuery).matches) size = 'xs';
            if (!size && match(smQuery).matches) size = 'sm';
            if (!size && match(mdQuery).matches) size = 'md';
            if (!size && match(lgQuery).matches) size = 'lg';
        }
        return size;
    }

    return {
        visibleXs: function () {
            return getSize() == 'xs';
        },
        visibleSm: function () {
            return getSize() == 'sm';
        },
        visibleMd: function () {
            return getSize() == 'md';
        },
        visibleLg: function () {
            return getSize() == 'lg';
        },
        visiblePhone: function () {
            return getSize() == 'xs';
        },
        visibleTablet: function () {
            if ($window.matchMedia) return $window.matchMedia(tabletQuery).matches;
            else return false;
        },
        visibleDesktop: function () {
            if ($window.matchMedia) return $window.matchMedia(desktopQuery).matches;
            else return true;
        },
        onChange: function (callback) {
            var debounced = binDebounce(function () {
                callback(getSize());
            }, 150, true);
            
            angular.element($window).on('resize', debounced);
            return function () {
                angular.element($window).off('resize', debounced);
            }
        }
    }
}

//@deprecated Use viewport hashmap on $rootScope instead.
function ViewportDirectiveFactory(viewport) {
    return {
        restrict: 'C',
        link: function ($scope) {
            $scope.viewport = {};

            function updateViewportValues() {
                $scope.viewport.small = viewport.visiblePhone();
                $scope.viewport.medium = viewport.visibleTablet();
                $scope.viewport.large = !$scope.viewport.small && !$scope.viewport.medium;
            }
            
            viewport.onChange(updateViewportValues);
        }
    };
}