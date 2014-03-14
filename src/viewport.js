angular.module('viewport', [])
    .directive('viewport', ['$window', ViewportDirectiveFactory]);

function ViewportDirectiveFactory($window) {
    return {
        restrict: 'C',
        link: function ($scope) {
            $scope.viewport = {};
            var window = $window;

            var isSmall = function () {
                if (window.matchMedia) return window.matchMedia("screen and (max-width: 767px)").matches;
                else return false;
            };

            var isMedium = function () {
                if (window.matchMedia) return window.matchMedia("screen and (min-width:768px) and (max-width:979px)").matches;
                else return false;
            };

            function upadateViewportValues() {
                $scope.viewport.small = isSmall();
                $scope.viewport.medium = isMedium();
                $scope.viewport.large = !$scope.viewport.small && !$scope.viewport.medium;
            }

            upadateViewportValues();

            var debouncedUpdate = _.debounce(function () {
                $scope.$apply(function () {
                    upadateViewportValues();
                });
            }, 100);

            angular.element(window).on('resize', debouncedUpdate);
        }
    };
}