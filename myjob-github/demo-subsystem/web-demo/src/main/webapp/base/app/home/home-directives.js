angular.module('masgetWebApp.home')
    .directive('repeatTimes', ['$timeout', 'utils', function ($timeout, utils) {
        return {
            restrict: 'A',
            link: function ($scope, element, attr) {
                var times = parseInt(attr.repeatTimes);
                for (var i = 0; i < times; i++) {
                    element.parent().prepend(element.clone(true));
                }
                element.remove();
            }
        }
    }])
    .directive('ngRightClick', ['$parse', function ($parse) {
        return function (scope, element, attrs) {
            var fn = $parse(attrs.ngRightClick);
            element.bind('contextmenu', function (event) {
                scope.$apply(function () {
                    event.preventDefault();
                    fn(scope)(event);
                });
            });
        };
    }])
    .provider('$waveEffect', function () {

        var requestAnimateFrame = function () {
            return (
                window.requestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                }
                );
        }();

        this.$get = ["$timeout", function ($timeout) {
            function waveEffectFactory(element, waveEffectColor,waveEffectSpeed) {
                var canvas = {},
                    centerX = 0,
                    centerY = 0,
                    color = '#FFFFFF',
                    speed = 2,
                    context = {},
                    radius = 0,
                    press = function (event) {
                        element = event.toElement;
                        element.width = element.offsetWidth;
                        element.height = element.offsetHeight;
                        context.clearRect && context.clearRect(0, 0, element.clientWidth, element.clientHeight);
                        context = element.getContext('2d');
                        context.globalAlpha = 0.3
                        radius = 0;
                        centerX = event.offsetX;
                        centerY = event.offsetY;
                        draw();
                    },

                    draw = function () {
                        context.clearRect(0, 0, element.clientWidth, element.clientHeight);
                        context.beginPath();
                        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
                        context.fillStyle = color;
                        context.fill();
                        radius += speed;
                        if (radius < element.width) {
                            requestAnimateFrame(draw);
                        } else {
                            context.clearRect(0, 0, element.clientWidth, element.clientHeight);
                        }
                    };

                canvas = document.createElement('canvas');
                canvas.addEventListener('click', press, false);
                element[0].style.position = "relative";
                element[0].appendChild(canvas);
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                canvas.style.position = 'absolute';
                canvas.style.top = '0px';
                canvas.style.left = '0px';
                waveEffectColor && (color = waveEffectColor);
                waveEffectSpeed&&(speed = waveEffectSpeed);
            }

            return waveEffectFactory;

        }];
    })
    .directive('waveEffect', ['$waveEffect', function ($waveEffect) {
        return function (scope, element, attrs) {
            if(typeof attrs.waveEffectSpeed == "string") attrs.waveEffectSpeed = parseInt(attrs.waveEffectSpeed);
            $waveEffect(element, attrs.waveEffectColor,attrs.waveEffectSpeed);
        };
    }])
    .
    directive('onFinishRenderFilters', ['$timeout', 'utils', function ($timeout, utils) {
        return {
            restrict: 'A',
            link: function ($scope, element, attr) {
                if (attr.onFinishRenderFilters != "login" && attr.onFinishRenderFilters != "loginForm" && currentActiceModuleName) {
                    $timeout(function () {
                        utils.adaptSize();
                    });
                }
                if (attr.onFinishRenderFilters == "login") {
                    $timeout(function () {
                        $scope.$broadcast("renderFinished", {element: element, type: "login"})
                    });
                } else if (attr.onFinishRenderFilters == "loginForm") {
                    $timeout(function () {
                        $scope.$broadcast("renderFinished", {element: element, type: "loginForm"})
                    });
                } else if (attr.onFinishRenderFilters == "home") {
                    $timeout(function () {
                        $scope.$broadcast("renderFinished", {element: element, type: "home"})
                    });
                } else if (attr.onFinishRenderFilters == "notice") {
                    $timeout(function () {
                        $scope.$broadcast("renderFinished", {element: element, type: "notice"})
                    });
                } else if (attr.onFinishRenderFilters == "schedule") {
                    $timeout(function () {
                        $scope.$broadcast("renderFinished", {element: element, type: "schedule"})
                    });
                } else if (attr.onFinishRenderFilters == "leftBar_buzcircle") {
                    $timeout(function () {
                        $scope.$broadcast("renderFinished", {element: element, type: "leftBar_buzcircle"})
                    });
                } else if (attr.onFinishRenderFilters == "buzcircle_find") {
                    $timeout(function () {
                        $scope.$broadcast("renderFinished", {element: element, type: "buzcircle_find"})
                    });
                } else if (attr.onFinishRenderFilters == "buzcircle_edit") {
                    $timeout(function () {
                        $scope.$broadcast("renderFinished", {element: element, type: "buzcircle_edit"});
                    });
                } else if (attr.onFinishRenderFilters == "buzcircle_groupPanel") {
                    $timeout(function () {
                        $scope.$broadcast("renderFinished", {element: element, type: "buzcircle_groupPanel"});
                    });
                } else if (attr.onFinishRenderFilters == "mgchat") {
                    $timeout(function () {
                        $scope.$broadcast("renderFinished", {element: element, type: "mgchat", element: element});
                    });
                } else if (attr.onFinishRenderFilters == "editCompany") {
                    $timeout(function () {
                        $scope.$broadcast("renderFinished", {element: element, type: "editCompany"});
                    });
                } else if (attr.onFinishRenderFilters == "editStaff") {
                    $timeout(function () {
                        $scope.$broadcast("renderFinished", {element: element, type: "editStaff"});
                    });
                } else if (attr.onFinishRenderFilters == "editStation") {
                    $timeout(function () {
                        $scope.$broadcast("renderFinished", {element: element, type: "editStation"});
                    });
                } else if (attr.onFinishRenderFilters == "leftBar_contacts") {
                    $timeout(function () {
                        $scope.$broadcast("renderFinished", {element: element, type: "leftBar_contacts"});
                    });
                } else if (attr.onFinishRenderFilters == "leftBar_contacts") {
                    $timeout(function () {
                        $scope.$broadcast("renderFinished", {element: element, type: "leftBar_contacts"});
                    });
                } else if (attr.onFinishRenderFilters == "contacts_list") {
                    $timeout(function () {
                        $scope.$broadcast("renderFinished", {element: element, type: "contacts_list"});
                    });
                } else if (attr.onFinishRenderFilters == "find_list") {
                    $timeout(function () {
                        $scope.$broadcast("renderFinished", {element: element, type: "find_list"});
                    });
                }
            }
        };
    }]);