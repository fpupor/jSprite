;(function($, undefined) {
    'use strict';

    var ver = '1.0.0';

    $.fn.jSprite = {};

    var debug = function (s) {
        if ($.fn.jSprite.debug) {
            log(s);
        }
    };

    var log = function () {

    };

    var pause = function () {

    };
    $.fn.jSprite.pause = pause;

    var stop = function () {

    };
    $.fn.jSprite.stop = stop;

    var goTo = function () {

    };
    $.fn.jSprite.goTo = goTo;

    var getSize = function (options) {
        var image = new Image();
        image.src = $(options.element).css('backgroundImage').replace(/url\((['"])?(.*?)\1\)/gi, '$2');

        return {
            width: image.width/options.columns,
            height: image.height/options.lines
        };
    };

    var sprite = {
            top         : 0,
            left        : 0,
            position    : 0
        },
        spriteReloadTimeout     = 0,
        spriteTransitionTimeout = 0;

    var animation = function (settings, callback) {
        var element                 = settings.element,
            timeTransition          = settings.timeTransition,
            timeReload              = settings.timeReload,
            spriteBgWidth           = settings.width,
            spriteBgHeight          = settings.height,
            spriteBgLine            = settings.columns,
            spriteBgTotal           = settings.total;

        clearTimeout(spriteTransitionTimeout);
        clearTimeout(spriteReloadTimeout);

        if (element.length && element.is(':visible')) {
            if (sprite.position < (spriteBgTotal - 1)) {
                sprite.position++;

                var line = (sprite.position % spriteBgLine) / 100;

                sprite.left = sprite.left + spriteBgWidth;

                if (line === 0) {
                   sprite.top = sprite.top + spriteBgHeight;
                   sprite.left = 0;
                }

                element.css({'background-position': '-' + sprite.left + 'px -' + sprite.top + 'px'});

                spriteTransitionTimeout = setTimeout(function() {
                    animation(settings, callback);
                }, timeTransition);
            } else {
                if (timeReload) {
                    spriteReloadTimeout = setTimeout(function() {
                        sprite.position = 0;
                        sprite.top = 0;
                        sprite.left = 0;

                        element.css({'background-position': '0 0'});

                        animation(settings, callback);
                    }, timeReload * 1000);
                }
            }
        }
    };

    var play = function (options, callback) {
        var defaults = {
            timeTransition  : (options.timeTransition) ? options.timeTransition : 50, //milsec
            timeReload      : (options.timeReload) ? options.timeReload : 3, //segundos
            hover           : false
        };

        // Merge defaults and options, without modifying defaults
        var settings = $.extend( {}, defaults, options );

        if (options.getSize) {
            settings = $.extend({}, getSize(settings), settings);
        }

        animation(settings, callback);
    };

    $.fn.jSprite = function (options) {
        play($.extend({}, { element: this }, options));

        return this;
    };
}(jQuery));
