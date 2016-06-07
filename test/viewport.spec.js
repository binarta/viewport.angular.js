describe('viewport module', function () {
    beforeEach(module('viewport'));

    describe('viewport service', function () {
        var $rootScope, viewport, window, screenSize, binDebounce;

        beforeEach(inject(function (_$rootScope_, _viewport_, $window, _binDebounce_) {
            $rootScope = _$rootScope_;
            viewport = _viewport_;
            window = $window;
            binDebounce = _binDebounce_;

            spyOn(angular, 'element').and.callFake(function () {
                window.on = jasmine.createSpy('on').and.callFake(function (event, callback) {
                    callback();
                });
                window.off = jasmine.createSpy('off');
                window.data = function (){};
                return window;
            });

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

        describe('listen for viewport changes', function () {
            var newSize, deregister;

            beforeEach(function () {
                function callback (size) {
                    newSize = size;
                }

                deregister = viewport.onChange(callback);
            });

            it('lookup is debounced and called immediately', function () {
                expect(binDebounce).toHaveBeenCalledWith(jasmine.any(Function), 150, true);
            });

            it('listen on resize', function () {
                expect(window.on).toHaveBeenCalledWith('resize', jasmine.any(Function));
            });

            describe('with debounced callback', function () {
                var debounce;

                beforeEach(function () {
                    debounce = window.on.calls.first().args[1];
                });

                it('for xs screen size', function () {
                    screenSize.xs = true;
                    debounce();

                    expect(newSize).toEqual('xs');
                });

                it('for sm screen size', function () {
                    screenSize.sm = true;
                    debounce();

                    expect(newSize).toEqual('sm');
                });

                it('for md screen size', function () {
                    screenSize.md = true;
                    debounce();

                    expect(newSize).toEqual('md');
                });

                it('for lg screen size', function () {
                    screenSize.lg = true;
                    debounce();

                    expect(newSize).toEqual('lg');
                });

                it('returns a deregister function', function () {
                    deregister();

                    expect(window.off).toHaveBeenCalledWith('resize', debounce);
                });
            });
        });

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
                        visibleDesktop: function () {return false},
                        onChange: function (callback) {callback()}
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
                    viewport = {
                        visiblePhone: function () {return false;},
                        visibleTablet: function () {return false},
                        visibleDesktop: function () {return false},
                        onChange: function (callback) {callback()}
                    };

                    config = {
                        styling: 'bootstrap2'
                    };

                });

                it('and viewport is phone', function () {
                    viewport.visiblePhone = function () {return true;};

                    UpdateViewportValues(viewport, $rootScope, config);

                    expect($rootScope.viewport).toEqual({
                        phone: true,
                        tablet: false,
                        desktop: false
                    });
                });

                it('and viewport is tablet', function () {
                    viewport.visibleTablet = function () {return true};

                    UpdateViewportValues(viewport, $rootScope, config);

                    expect($rootScope.viewport).toEqual({
                        phone: false,
                        tablet: true,
                        desktop: false
                    });
                });

                it('and viewport is desktop', function () {
                    viewport.visibleDesktop = function () {return true};

                    UpdateViewportValues(viewport, $rootScope, config);

                    expect($rootScope.viewport).toEqual({
                        phone: false,
                        tablet: false,
                        desktop: true
                    });
                });
            });

            describe('when styling is Bootstrap 3', function () {
                beforeEach(function () {
                    viewport = {
                        visibleXs: function () {return false;},
                        visibleSm: function () {return false},
                        visibleMd: function () {return false},
                        visibleLg: function () {return false},
                        onChange: function (callback) {callback()}
                    };

                    config = {
                        styling: 'bootstrap3'
                    };

                });

                it('and viewport is xs', function () {
                    viewport.visibleXs = function () {return true;};

                    UpdateViewportValues(viewport, $rootScope, config);

                    expect($rootScope.viewport).toEqual({
                        xs: true,
                        sm: false,
                        md: false,
                        lg: false
                    });
                });

                it('and viewport is sm', function () {
                    viewport.visibleSm = function () {return true};

                    UpdateViewportValues(viewport, $rootScope, config);

                    expect($rootScope.viewport).toEqual({
                        xs: false,
                        sm: true,
                        md: false,
                        lg: false
                    });
                });

                it('and viewport is md', function () {
                    viewport.visibleMd = function () {return true};

                    UpdateViewportValues(viewport, $rootScope, config);

                    expect($rootScope.viewport).toEqual({
                        xs: false,
                        sm: false,
                        md: true,
                        lg: false
                    });
                });

                it('and viewport is lg', function () {
                    viewport.visibleLg = function () {return true};

                    UpdateViewportValues(viewport, $rootScope, config);

                    expect($rootScope.viewport).toEqual({
                        xs: false,
                        sm: false,
                        md: false,
                        lg: true
                    });
                });
            });
        });
    });

    describe('viewport directive', function () {
        var directive, scope, viewport;

        beforeEach(function () {
            viewport = {
                visiblePhone: function () {return false;},
                visibleTablet: function () {return false},
                visibleDesktop: function () {return false},
                onChange: function (callback) {callback()}
            };

            directive = ViewportDirectiveFactory(viewport);
        });

        it('restrict to class', function () {
            expect(directive.restrict).toEqual('C');
        });

        describe('on link', function () {
            beforeEach(inject(function ($rootScope) {
                scope = $rootScope.$new();
            }));

            describe('on small viewport', function () {

                beforeEach(function () {
                    viewport.visiblePhone = function () {return true;};
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
                    viewport.visibleTablet = function () {return true;};
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
                    viewport.visibleDesktop = function () {return true;};
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
        });
    });
});