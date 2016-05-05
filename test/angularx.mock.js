angular.module('angularx', []).factory('binDebounce', function () {
    return jasmine.createSpy('binDebounce').andCallFake(function (callback) {
        return callback;
    });
});