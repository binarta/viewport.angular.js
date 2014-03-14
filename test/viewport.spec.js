describe('viewport module', function () {
    beforeEach(module('viewport'));

    describe('viewport directive', function () {
        var directive, scope, window, mediaQuery, size;
        var appliedToScope = false;
        var smallQuery = 'screen and (max-width: 767px)';
        var mediumQuery = 'screen and (min-width:768px) and (max-width:979px)';

        beforeEach(inject(function ($window) {
            window = $window;
            window.matchMedia = function (query) {
                mediaQuery = query;
                return {
                    matches: function () {
                        if (size == 'small' && mediaQuery == smallQuery) return true;
                        else return size == 'medium' && mediaQuery == mediumQuery;
                    }() ? true : false
                }
            };
            directive = ViewportDirectiveFactory(window);
        }));

        it('restrict to class', function () {
            expect(directive.restrict).toEqual('C');
        });

        describe('on link', function () {
            beforeEach(inject(function ($rootScope) {
                scope = $rootScope.$new();
            }));

            describe('if mediaMatch is not supported', function () {
                beforeEach(function () {
                    window.matchMedia = undefined;
                    directive.link(scope);
                });

                it('fallback to default values', function () {
                    expect(scope.viewport.small).toEqual(false);
                    expect(scope.viewport.medium).toEqual(false);
                    expect(scope.viewport.large).toEqual(true);
                });
            });

            describe('if mediaMatch is supported', function () {

                describe('on small viewport', function () {

                    beforeEach(function () {
                        size = 'small';
                        directive.link(scope);
                    });

                    it('viewport is a small screen', function () {
                        expect(scope.viewport.small).toEqual(true);
                    });

                    it('viewport is not a medium screen', function () {
                        expect(scope.viewport.medium).toEqual(false);
                    });

                    it('viewport is not a large screen', function () {
                        expect(scope.viewport.large).toEqual(false);
                    });
                });

                describe('on medium viewport', function () {

                    beforeEach(function () {
                        size = 'medium';
                        directive.link(scope);
                    });

                    it('viewport is not a small screen', function () {
                        expect(scope.viewport.small).toEqual(false);
                    });

                    it('viewport is a medium screen', function () {
                        expect(scope.viewport.medium).toEqual(true);
                    });

                    it('viewport is not a large screen', function () {
                        expect(scope.viewport.large).toEqual(false);
                    });
                });

                describe('on large viewport', function () {

                    beforeEach(function () {
                        size = 'large';
                        directive.link(scope);
                    });

                    it('viewport is not a small screen', function () {
                        expect(scope.viewport.small).toEqual(false);
                    });

                    it('viewport is not a medium screen', function () {
                        expect(scope.viewport.medium).toEqual(false);
                    });

                    it('viewport is a large screen', function () {
                        expect(scope.viewport.large).toEqual(true);
                    });
                });

                describe('on window resize', function () {
                    var viewportCallback, timesCalled;

                    beforeEach(function () {
                        timesCalled = 0;

                        scope.$apply = function (callback) {
                            appliedToScope = true;
                            callback();
                        };

                        _.debounce = jasmine.createSpy().andCallFake(function(callback) {
                            timesCalled++;
                            return callback;
                        });

                        spyOn(angular, 'element').andCallFake(function () {
                            window.on = jasmine.createSpy('on').andCallFake(function (event, callback) {
                                viewportCallback = callback;
                            });
                            window.off = jasmine.createSpy('off');
                            return window;
                        });

                        directive.link(scope);
                    });

                    it('should bind to the window resize event', function () {
                        expect(window.on).toHaveBeenCalledWith('resize', jasmine.any(Function));
                        expect(viewportCallback).toBeDefined();
                    });

                    it('update viewport values upon resize to medium', function () {
                        size = 'medium';
                        viewportCallback();

                        expect(appliedToScope).toEqual(true);
                        expect(scope.viewport.large).toEqual(false);
                        expect(scope.viewport.medium).toEqual(true);
                        expect(scope.viewport.small).toEqual(false);
                    });

                    it('update viewport values upon resize to small', function () {
                        size = 'small';
                        viewportCallback();

                        expect(appliedToScope).toEqual(true);
                        expect(scope.viewport.large).toEqual(false);
                        expect(scope.viewport.medium).toEqual(false);
                        expect(scope.viewport.small).toEqual(true);
                    });

                    it('resize events should be debounced to prevent unnecessary calls', function () {
                        viewportCallback();
                        viewportCallback();
                        viewportCallback();
                        viewportCallback();

                        expect(_.debounce).toHaveBeenCalledWith(jasmine.any(Function), 100);
                        expect(timesCalled).toEqual(1);
                    });
                });
            });
        });
    });
});