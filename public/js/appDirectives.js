angular.module('appDirectives',[])
    .constant('keyCodes', {
        esc: 27,
        space: 32,
        enter: 13,
        tab: 9,
        backspace: 8,
        shift: 16,
        ctrl: 17,
        alt: 18,
        capslock: 20,
        numlock: 144
    })
    //Directive for fire functions by key binds [keydown keypress] - more info in: http://stackoverflow.com/a/21882091
    .directive('keyBind', ['keyCodes', function (keyCodes) {
        function map(obj) {
            var mapped = {};
            for (var key in obj) {
                var action = obj[key];
                if (keyCodes.hasOwnProperty(key)) {
                    mapped[keyCodes[key]] = action;
                }
            }
            return mapped;
        }

        return function (scope, element, attrs) {
            var bindings = map(scope.$eval(attrs.keyBind));
            element.bind("keydown keypress", function (event) {
                if (bindings.hasOwnProperty(event.which)) {
                    scope.$apply(function() {
                         scope.$eval(bindings[event.which]);
                    });
                }
            });
        };
    }]);