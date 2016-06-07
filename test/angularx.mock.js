angular.module('angularx', []).factory('binDebounce', function () {
    return jasmine.createSpy('binDebounce').and.callFake(function (callback) {
        return callback;
    });
});