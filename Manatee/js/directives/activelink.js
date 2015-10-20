var activeLink = function () {
    return {
        link: function (scope, element, attrs) {
            var thisUL = element;
            element.find('a').on('click', function () {
                thisUL.find('li').removeClass("active");
                angular.element(this)
                    .parent()
                    .addClass('active');
            });
        }
    };
};