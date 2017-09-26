/*!
 * jScroll - jQuery Plugin for Infinite Scrolling / Auto-Paging
 * @see @link{http://jscroll.com}
 *
 * @copyright 2011-2017, Philip Klauzinski
 * @license Dual licensed under the MIT and GPL Version 2 licenses.
 * @author Philip Klauzinski (http://webtopian.com)
 * @version 2.3.9
 * @requires jQuery v1.4.3+
 * @preserve
 *
 * Modified by Kevin Delord on 25.09.2017 to conform to the current grid and slideshow layout.
 */
(function($) {

    'use strict';

    // Define the jscroll namespace and default settings
    $.jscroll = {
        defaults: {
            debug: false,
            autoTrigger: true,
            autoTriggerUntil: false,
            spinnerClass: '',
            padding: 0,
            nextSelector: 'a:last',
            contentSelector: '',
            pagingSelector: '',
            callback: false
        }
    };

    // Constructor
    var jScroll = function($e, options) {

        // Private vars and methods
        var _data = $e.data('jscroll'),
            _userOptions = (typeof options === 'function') ? { callback: options } : options,
            _options = $.extend({}, $.jscroll.defaults, _userOptions, _data || {}),
            _isWindow = ($e.css('overflow-y') === 'visible'),
            _$next = $e.find(_options.nextSelector).first(),
            _$window = $(window),
            _$body = $('body'),
            _$scroll = _isWindow ? _$window : $e,
            _nextHref = $.trim(_$next.attr('href')),

            // Check if a loading image is defined and preload
            _preloadImage = function() {
                var src = $(_options.loadingHtml).filter('img').attr('src');
                if (src) {
                    var image = new Image();
                    image.src = src;
                }
            },

            // Find the next link's parent, or add one, and hide it
            _nextWrap = function($next) {
                var $parent;
                if (_options.pagingSelector) {
                    $next.closest(_options.pagingSelector).hide();
                } else {
                    $parent = $next.parent().not('.grid').addClass('jscroll-next-parent').hide();
                    if (!$parent.length) {
                        $next.wrap('<div class="jscroll-next-parent" />').parent().hide();
                    }
                }
            },

            // Remove the jscroll behavior and data from an element
            _destroy = function() {
                return _$scroll.unbind('.jscroll').removeData('jscroll');
            },

            // Observe the scroll event for when to trigger the next load
            _observe = function() {
                if ($e.is(':visible')) {
                    var $inner = $e.find('ul.grid').first(),
                        data = $e.data('jscroll'),
                        borderTopWidth = parseInt($e.css('borderTopWidth'), 10),
                        borderTopWidthInt = isNaN(borderTopWidth) ? 0 : borderTopWidth,
                        iContainerTop = parseInt($e.css('paddingTop'), 10) + borderTopWidthInt,
                        iTopHeight = _isWindow ? _$scroll.scrollTop() : $e.offset().top,
                        innerTop = $inner.length ? $inner.offset().top : 0,
                        iTotalHeight = Math.ceil(iTopHeight - innerTop + _$scroll.height() + iContainerTop);

                    if (!data.waiting && iTotalHeight + _options.padding >= $inner.outerHeight() && $inner.outerHeight() > 0) {
                        _debug('info', 'jScroll:', $inner.outerHeight() - iTotalHeight, 'from bottom. Loading next request...');
                        return _load();
                    }
                }
            },

            // Check if the href for the next set of content has been set
            _checkNextHref = function(data) {
                data = data || $e.data('jscroll');
                if (!data || !data.nextHref) {
                    _debug('warn', 'jScroll: nextSelector not found - destroying');
                    _destroy();
                    return false;
                } else {
                    _setBindings();
                    return true;
                }
            },

            _setBindings = function() {
                var $next = $e.find(_options.nextSelector).first();
                if (!$next.length) {
                    return;
                }
                if (_options.autoTrigger && (_options.autoTriggerUntil === false || _options.autoTriggerUntil > 0)) {
                    _nextWrap($next);
                    var scrollingBodyHeight = _$body.height() - $e.offset().top,
                        scrollingHeight = ($e.height() < scrollingBodyHeight) ? $e.height() : scrollingBodyHeight,
                        windowHeight = ($e.offset().top - _$window.scrollTop() > 0) ? _$window.height() - ($e.offset().top - $(window).scrollTop()) : _$window.height();
                    if (scrollingHeight <= windowHeight) {
                        _observe();
                    }
                    _$scroll.unbind('.jscroll').bind('scroll.jscroll', function() {
                        return _observe();
                    });
                    if (_options.autoTriggerUntil > 0) {
                        _options.autoTriggerUntil--;
                    }
                } else {
                    _$scroll.unbind('.jscroll');
                    $next.bind('click.jscroll', function() {
                        _nextWrap($next);
                        _load();
                        return false;
                    });
                }
            },

            // Load the next href link, if available
            _loadNewHref = function(callback) {
                var data = $e.data('jscroll'),
                    nextHref = data.nextHref;

                // Create a div element to ONLY load the next href element.
                var $newHref = $( '<div />' )
                $newHref.load(nextHref + ' ' + _options.nextSelector, function(r, status) {
                    let newHref = $newHref.children().first().attr('href')
                    data.nextHref = (newHref ? $.trim(newHref) : false)
                    data.waiting = false;

                    _checkNextHref();
                    if (_options.callback) {
                        _options.callback.call(this, nextHref);
                    }

                    _debug('dir', data);

                    callback();
                });
            },

            // Load the next set of slideshow content, if available
            _loadSlideshow = function(callback) {
                var $slideContainer = $e.find('ul.slide').first();
                var nextHref = $e.data('jscroll').nextHref + ' ' + _options.slideshowSelector;

                // Integrate temporary div to load the new content. It's gonna be removed later.
                $slideContainer.append('<div class="jscroll-slideshow-tmp" />')

                _debug('info', 'jScroll: load next slideshow content with url: ', nextHref);
                $slideContainer.children('.jscroll-slideshow-tmp').first().load(nextHref, function(r, status) {
                    if (status === 'error') {
                        return _destroy();
                    }

                    // Insert the new slideshow items into the current slideshow (the parent of the current element).
                    $slideContainer.append($(this).children());
                    $(this).remove();

                    callback();
                });
            },

            // Load the next set of content, if available
            _load = function() {
                var $inner = $e.find('ul.grid').first(),
                    data = $e.data('jscroll'),
                    spinner = '<div class="' + _options.spinnerClass + '"></div>';

                data.waiting = true;
                // Integrate temporary div to load the new content. It's gonna be removed later.
                $inner.append('<div class="jscroll-tmp" />')
                // Add loading spinner.
                $inner.parent().append(spinner);

                return $e.animate({scrollTop: $inner.outerHeight()}, 0, function() {
                    var nextHref = data.nextHref;
                    _debug('info', 'jScroll: load next page with url: ', nextHref);
                    $inner.children('.jscroll-tmp').first().load(nextHref + ' ' + _options.contentSelector, function(r, status) {
                        if (status === 'error') {
                            return _destroy();
                        }

                        // Insert the new grid items into the current grid-wrap (the parent of the current element).
                        $inner.append($(this).children());
                        $(this).remove();

                        // Load the new slideshow content.
                        _loadSlideshow(function() {
                            // Load new Href for the next automatic load.
                            _loadNewHref(function() {
                                // Remove laoding spinner.
                                $inner.parent().children().remove('.' + _options.spinnerClass);
                            });
                        });
                        // Remove the previous next link now that we have a new one.
                        $('.jscroll-next-parent', $e).remove();
                    });
                });
            },

            // Safe console debug - http://klauzinski.com/javascript/safe-firebug-console-in-javascript
            _debug = function(m) {
                if (_options.debug && typeof console === 'object' && (typeof m === 'object' || typeof console[m] === 'function')) {
                    if (typeof m === 'object') {
                        var args = [];
                        for (var sMethod in m) {
                            if (typeof console[sMethod] === 'function') {
                                args = (m[sMethod].length) ? m[sMethod] : [m[sMethod]];
                                console[sMethod].apply(console, args);
                            } else {
                                console.log.apply(console, args);
                            }
                        }
                    } else {
                        console[m].apply(console, Array.prototype.slice.call(arguments, 1));
                    }
                }
            };

        // Initialization
        $e.data('jscroll', $.extend({}, _data, {initialized: true, waiting: false, nextHref: _nextHref}));
        _preloadImage();
        _setBindings();

        // Expose API methods via the jQuery.jscroll namespace, e.g. $('sel').jscroll.method()
        $.extend($e.jscroll, {
            destroy: _destroy
        });

        return $e;
    };

    // Define the jscroll plugin method and loop
    $.fn.jscroll = function(m) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data('jscroll');

            // Instantiate jScroll on this element if it hasn't been already
            if (data && data.initialized) {
                return;
            }
            jScroll($this, m);
        });
    };

})(jQuery);
