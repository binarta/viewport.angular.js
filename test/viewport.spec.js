describe('viewport module', function () {
    angular.module('notifications', []);
    angular.module('rest.client', []);
    angular.module('angular.usecase.adapter', []);
    angular.module('checkpoint', []);
    angular.module('toggle.edit.mode', []);
    beforeEach(module('viewport'));
    beforeEach(module('config'));

    describe('viewport service', function () {
        var viewport, window, screenSize;

        beforeEach(inject(function (_viewport_, $window) {
            viewport = _viewport_;
            window = $window;

            screenSize = {
                xs: false,
                sm: false,
                md: false,
                lg: false,
                phone: false,
                tablet: false,
                desktop: false
            };

            window.matchMedia = function (query) {
                var matches = false;
                if (query == '(max-width: 767px)' && screenSize.xs == true) matches = true;
                if (query == '(min-width: 768px) and (max-width:991px)' && screenSize.sm == true) matches = true;
                if (query == '(min-width: 992px) and (max-width:1199px)' && screenSize.md == true) matches = true;
                if (query == '(min-width: 1200px)' && screenSize.lg == true) matches = true;
                if (query == '(max-width: 767px)' && screenSize.phone == true) matches = true;
                if (query == '(min-width:768px) and (max-width:979px)' && screenSize.tablet == true) matches = true;
                if (query == '(min-width: 980px)' && screenSize.desktop == true) matches = true;
                return {
                    matches: matches
                };
            };
        }));

        describe('for xs screen size', function () {
            beforeEach(function () {
                screenSize.xs = true;
            });

            it('test', function () {
                expect(viewport.visibleXs()).toEqual(true);
                expect(viewport.visibleSm()).toEqual(false);
                expect(viewport.visibleMd()).toEqual(false);
                expect(viewport.visibleLg()).toEqual(false);
            });
        });

        describe('for sm screen size', function () {
            beforeEach(function () {
                screenSize.sm = true;
            });

            it('test', function () {
                expect(viewport.visibleXs()).toEqual(false);
                expect(viewport.visibleSm()).toEqual(true);
                expect(viewport.visibleMd()).toEqual(false);
                expect(viewport.visibleLg()).toEqual(false);
            });
        });

        describe('for md screen size', function () {
            beforeEach(function () {
                screenSize.md = true;
            });

            it('test', function () {
                expect(viewport.visibleXs()).toEqual(false);
                expect(viewport.visibleSm()).toEqual(false);
                expect(viewport.visibleMd()).toEqual(true);
                expect(viewport.visibleLg()).toEqual(false);
            });
        });

        describe('for lg screen size', function () {
            beforeEach(function () {
                screenSize.lg = true;
            });

            it('test', function () {
                expect(viewport.visibleXs()).toEqual(false);
                expect(viewport.visibleSm()).toEqual(false);
                expect(viewport.visibleMd()).toEqual(false);
                expect(viewport.visibleLg()).toEqual(true);
            });
        });

        describe('for phone', function () {
            beforeEach(function () {
                screenSize.phone = true;
            });

            it('test', function () {
                expect(viewport.visiblePhone()).toEqual(true);
                expect(viewport.visibleTablet()).toEqual(false);
                expect(viewport.visibleDesktop()).toEqual(false);
            });
        });

        describe('for tablet', function () {
            beforeEach(function () {
                screenSize.tablet = true;
            });

            it('test', function () {
                expect(viewport.visiblePhone()).toEqual(false);
                expect(viewport.visibleTablet()).toEqual(true);
                expect(viewport.visibleDesktop()).toEqual(false);
            });
        });

        describe('for desktop', function () {
            beforeEach(function () {
                screenSize.desktop = true;
            });

            it('test', function () {
                expect(viewport.visiblePhone()).toEqual(false);
                expect(viewport.visibleTablet()).toEqual(false);
                expect(viewport.visibleDesktop()).toEqual(true);
            });
        });

        describe('when matchMedia is undefined', function () {
            beforeEach(function () {
                window.matchMedia = undefined;
            });

            it('assume viewport is lg', function () {
                expect(viewport.visibleXs()).toEqual(false);
                expect(viewport.visibleSm()).toEqual(false);
                expect(viewport.visibleMd()).toEqual(false);
                expect(viewport.visibleLg()).toEqual(true);
            });

            it('assume viewport is desktop', function () {
                expect(viewport.visiblePhone()).toEqual(false);
                expect(viewport.visibleTablet()).toEqual(false);
                expect(viewport.visibleDesktop()).toEqual(true);
            });
        });
    });

    describe('viewport initialize', function () {
        var $rootScope, $window;

        describe('is executed on run', function () {
            beforeEach(module('viewport', function ($provide) {
                $provide.decorator('config', function () {
                    return {
                        styling: 'bootstrap2'
                    };
                });

                $provide.decorator('viewport', function () {
                    return {
                        visiblePhone: function () {return true;},
                        visibleTablet: function () {return false},
                        visibleDesktop: function () {return false}
                    };
                });
            }));

            beforeEach(inject(function (_$rootScope_, _$window_) {
                $rootScope = _$rootScope_;
                $window = _$window_;
            }));

            it('expose values on rootScope', function () {
                expect($rootScope.viewport).toEqual({
                    phone: true,
                    tablet: false,
                    desktop: false
                });
            });
        });

        describe('run block', function () {
            var viewport, config;

            beforeEach(inject(function (_$rootScope_, _$window_, _viewport_) {
                $rootScope = _$rootScope_;
                $window = _$window_;
                viewport = _viewport_;
            }));

            describe('when styling is Bootstrap 2', function () {
                beforeEach(function () {
                    config = {
                        styling: 'bootstrap2'
                    };

                });

                it('and viewport is phone', function () {
                    viewport = {
                        visiblePhone: function () {return true;},
                        visibleTablet: function () {return false},
                        visibleDesktop: function () {return false}
                    };

                    UpdateViewportValues(viewport, $window, $rootScope, config);

                    expect($rootScope.viewport).toEqual({
                        phone: true,
                        tablet: false,
                        desktop: false
                    });
                });

                it('and viewport is tablet', function () {
                    viewport = {
                        visiblePhone: function () {return false;},
                        visibleTablet: function () {return true},
                        visibleDesktop: function () {return false}
                    };

                    UpdateViewportValues(viewport, $window, $rootScope, config);

                    expect($rootScope.viewport).toEqual({
                        phone: false,
                        tablet: true,
                        desktop: false
                    });
                });

                it('and viewport is desktop', function () {
                    viewport = {
                        visiblePhone: function () {return false;},
                        visibleTablet: function () {return false},
                        visibleDesktop: function () {return true}
                    };

                    UpdateViewportValues(viewport, $window, $rootScope, config);

                    expect($rootScope.viewport).toEqual({
                        phone: false,
                        tablet: false,
                        desktop: true
                    });
                });
            });

            describe('when styling is Bootstrap 3', function () {
                beforeEach(function () {
                    config = {
                        styling: 'bootstrap3'
                    };

                });

                it('and viewport is xs', function () {
                    viewport = {
                        visibleXs: function () {return true;},
                        visibleSm: function () {return false},
                        visibleMd: function () {return false},
                        visibleLg: function () {return false}
                    };

                    UpdateViewportValues(viewport, $window, $rootScope, config);

                    expect($rootScope.viewport).toEqual({
                        xs: true,
                        sm: false,
                        md: false,
                        lg: false
                    });
                });

                it('and viewport is sm', function () {
                    viewport = {
                        visibleXs: function () {return false;},
                        visibleSm: function () {return true},
                        visibleMd: function () {return false},
                        visibleLg: function () {return false}
                    };

                    UpdateViewportValues(viewport, $window, $rootScope, config);

                    expect($rootScope.viewport).toEqual({
                        xs: false,
                        sm: true,
                        md: false,
                        lg: false
                    });
                });

                it('and viewport is md', function () {
                    viewport = {
                        visibleXs: function () {return false;},
                        visibleSm: function () {return false},
                        visibleMd: function () {return true},
                        visibleLg: function () {return false}
                    };

                    UpdateViewportValues(viewport, $window, $rootScope, config);

                    expect($rootScope.viewport).toEqual({
                        xs: false,
                        sm: false,
                        md: true,
                        lg: false
                    });
                });

                it('and viewport is lg', function () {
                    viewport = {
                        visibleXs: function () {return false;},
                        visibleSm: function () {return false},
                        visibleMd: function () {return false},
                        visibleLg: function () {return true}
                    };

                    UpdateViewportValues(viewport, $window, $rootScope, config);

                    expect($rootScope.viewport).toEqual({
                        xs: false,
                        sm: false,
                        md: false,
                        lg: true
                    });
                });
            });

            describe('on window resize', function () {
                var viewportCallback, timesCalled, appliedToScope;

                beforeEach(function () {
                    config = {
                        styling: 'bootstrap2'
                    };

                    timesCalled = 0;

                    $rootScope.$apply = function (callback) {
                        appliedToScope = true;
                        callback();
                    };

                    _.debounce = jasmine.createSpy().andCallFake(function(callback) {
                        timesCalled++;
                        return callback;
                    });

                    spyOn(angular, 'element').andCallFake(function () {
                        $window.on = jasmine.createSpy('on').andCallFake(function (event, callback) {
                            viewportCallback = callback;
                        });
                        $window.off = jasmine.createSpy('off');
                        return $window;
                    });

                    UpdateViewportValues(viewport, $window, $rootScope, config);
                });

                it('should bind to the window resize event', function () {
                    expect($window.on).toHaveBeenCalledWith('resize', jasmine.any(Function));
                    expect(viewportCallback).toBeDefined();
                });

                it('viewport values are applied to rootScope and debounced', function () {
                    viewportCallback();
                    viewportCallback();
                    viewportCallback();

                    expect(appliedToScope).toEqual(true);
                    expect(timesCalled).toEqual(1);
                });
            });
        });
    });

    describe('viewport directive', function () {
        var directive, scope, window, mediaQuery, size;
        var appliedToScope = false;
        var smallQuery = '(max-width: 767px)';
        var mediumQuery = '(min-width:768px) and (max-width:979px)';

        beforeEach(inject(function ($window, _viewport_) {
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
            directive = ViewportDirectiveFactory(window, _viewport_);
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