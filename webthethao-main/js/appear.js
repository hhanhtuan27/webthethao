(function ($) {
    $.fn.listnav = function (options) {
        var opts = $.extend({}, $.fn.listnav.defaults, options),
            letters = ['_', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '-'],
            firstClick = false,
            clickEventType=((document.ontouchstart!==null)?'click':'touchend');
        opts.prefixes = $.map(opts.prefixes, function (n) {
            return n.toLowerCase();
        });
        return this.each(function () {
            var $wrapper, $letters, $letterCount, left, width, count,
                id = this.id,
                $list = $(this),
                counts = {},
                allCount = 0, fullCount = 0,
                isAll = true,
                prevLetter = '';
            if ( !$('#' + id + '-nav').length ) {
                $('<div id="' + id + '-nav" class="listNav"/>').insertBefore($list);
            }
            $wrapper = $('#' + id + '-nav');
            function init() {
                $wrapper.append(createLettersHtml());
                $letters = $('.ln-letters', $wrapper).slice(0, 1);
                if ( opts.showCounts ) {
                    $letterCount = $('.ln-letter-count', $wrapper).slice(0, 1);
                }
                addClasses();
                addNoMatchLI();
                bindHandlers();
                if (opts.flagDisabled) {
                    addDisabledClass();
                }
                if ( !opts.includeAll ) {
                    $('.all', $letters).remove();
                }
                if ( !opts.includeNums ) {
                    $('._', $letters).remove();
                }
                if ( !opts.includeOther ) {
                    $('.-', $letters).remove();
                }
                if ( opts.removeDisabled ) {
                    $('.ln-disabled', $letters).remove();
                }
                $(':last', $letters).addClass('ln-last');
                if ( $.cookie && (opts.cookieName !== null) ) {
                    var cookieLetter = $.cookie(opts.cookieName);
                    if ( cookieLetter !== null && typeof cookieLetter !== "undefined" ) {
                        opts.initLetter = cookieLetter;
                    }
                }
                if ( opts.initLetter !== '' ) {
                    firstClick = true;
                    $('.' + opts.initLetter.toLowerCase(), $letters).slice(0, 1).trigger(clickEventType);
                } else {
                    if ( opts.includeAll ) {
                        $('.all', $letters).addClass('ln-selected');
                    } else {
                        for ( var i = ((opts.includeNums) ? 0 : 1); i < letters.length; i++) {
                            if ( counts[letters[i]] > 0 ) {
                                firstClick = true;
                                $('.' + letters[i], $letters).slice(0, 1).trigger(clickEventType);
                                break;
                            }
                        }
                    }
                }
            }
            function setLetterCountTop() {
                var letterCountHeight = $letterCount.outerHeight();
                $letterCount.css({
                    top: $('a:first', $wrapper).slice(0, 1).position().top - letterCountHeight
                });
            }
            function addClasses() {
                var str, spl, $this,
                    firstChar = '',
                    hasPrefixes = (opts.prefixes.length > 0),
                    hasFilterSelector = (opts.filterSelector.length > 0);
                $($list).children().each(function () {
                    $this = $(this);
                    if ( !hasFilterSelector ) {
                        str = $.trim($this.text()).toLowerCase();
                    } else {
                        str = $.trim($this.find(opts.filterSelector).text()).toLowerCase();
                    }
                    if (str !== '') {
                        if (hasPrefixes) {
                            var prefixes = $.map(opts.prefixes, function(value) {
                                return value.indexOf(' ') <= 0 ? value + ' ' : value;
                            });
                            var matches = $.grep(prefixes, function(value) {
                                return str.indexOf(value) === 0;
                            });
                            if (matches.length > 0) {
                                var afterMatch = str.toLowerCase().split(matches[0])[1];
                                if(afterMatch != null) {
                                    firstChar = $.trim(afterMatch).charAt(0);
                                } else {
                                    firstChar = str.charAt(0);
                                }
                                addLetterClass(firstChar, $this, true);
                                return;
                            }
                        }
                        firstChar = str.charAt(0);
                        addLetterClass(firstChar, $this);
                    }
                });
            }
            function addLetterClass(firstChar, $el, isPrefix) {
                if ( /\W/.test(firstChar) ) {
                    firstChar = '-';
                }
                if ( !isNaN(firstChar) ) {
                    firstChar = '_';
                }
                $el.addClass('ln-' + firstChar);
                if ( counts[firstChar] === undefined ) {
                    counts[firstChar] = 0;
                }
                counts[firstChar]++;
                if (!isPrefix) {
                    allCount++;
                }
            }
            function addDisabledClass() {
                for ( var i = 0; i < letters.length; i++ ) {
                    if ( counts[letters[i]] === undefined ) {
                        $('.' + letters[i], $letters).addClass('ln-disabled');
                    }
                }
            }
            function addNoMatchLI() {
                $list.append('<li class="ln-no-match listNavHide">' + opts.noMatchText + '</li>');
            }
            function getLetterCount(el) {
                if ($(el).hasClass('all')) {
                    if (opts.dontCount) {
                        fullCount = allCount - $list.find(opts.dontCount).length;
                    } else {
                        fullCount = allCount;
                    }
                    return fullCount;
                } else {
                    el = '.ln-' + $(el).attr('class').split(' ')[0];
                    if (opts.dontCount) {
                        count = $list.find(el).not(opts.dontCount).length;
                    } else {
                        count = $list.find(el).length;
                    }
                    return (count !== undefined) ? count : 0;
                }
            }
            function bindHandlers() {
                if (opts.showCounts) {
                    $wrapper.mouseover(function () {
                        setLetterCountTop();
                    });
                    $('.ln-letters a', $wrapper).mouseover(function () {
                        left = $(this).position().left;
                        width = ($(this).outerWidth()) + 'px';
                        count = getLetterCount(this);
                        $letterCount.css({
                            left: left,
                            width: width
                        }).text(count).addClass("letterCountShow").removeClass("listNavHide");
                    }).mouseout(function () {
                        $letterCount.addClass("listNavHide").removeClass("letterCountShow");
                    });
                }
                $('a', $letters).bind(clickEventType, function (e) {
                    e.preventDefault();
                    var $this = $(this),
                        letter = $this.attr('class').split(' ')[0],
                        noMatches = $list.children('.ln-no-match');
                    if ( prevLetter !== letter ) {
                        $('a.ln-selected', $letters).removeClass('ln-selected');
                        if ( letter === 'all' ) {
                            $list.children().addClass("listNavShow").removeClass("listNavHide");
                            noMatches.addClass("listNavHide").removeClass("listNavShow");
                            isAll = true;
                        } else {
                            if ( isAll ) {
                                $list.children().addClass("listNavHide").removeClass("listNavShow");
                                isAll = false;
                            } else if (prevLetter !== '') {
                                $list.children('.ln-' + prevLetter).addClass("listNavHide").removeClass("listNavShow");
                            }
                            var count = getLetterCount(this);
                            if (count > 0) {
                                $list.children('.ln-' + letter).addClass("listNavShow").removeClass("listNavHide");
                                noMatches.addClass("listNavHide").removeClass("listNavShow");
                            } else {
                                noMatches.addClass("listNavShow").removeClass("listNavHide");
                            }
                        }
                        prevLetter = letter;
                        if ($.cookie && (opts.cookieName !== null)) {
                            $.cookie(opts.cookieName, letter, {
                                expires: 999
                            });
                        }
                        $this.addClass('ln-selected');
                        $this.blur();
                        if (!firstClick && (opts.onClick !== null)) {
                            opts.onClick(letter);
                        } else {
                            firstClick = false;
                        }
                    }
                });
            }
            function createLettersHtml() {
                var html = [];
                for (var i = 1; i < letters.length; i++) {
                    if (html.length === 0) {
                        html.push('<a class="all" href="#">'+ opts.allText + '</a><a class="_" href="#">0-9</a>');
                    }
                    html.push('<a class="' + letters[i] + '" href="#">' + ((letters[i] === '-') ? 'ETC' : letters[i].toUpperCase()) + '</a>');
                }
                return '<div class="ln-letters">' + html.join('') + '</div>' + ((opts.showCounts) ? '<div class="ln-letter-count listNavHide">0</div>' : '');
            }
            init();
        });
    };

    $.fn.listnav.defaults = {
        initLetter: '',
        includeAll: true,
        allText: 'All',
        includeOther: false,
        includeNums: true,
        flagDisabled: true,
        removeDisabled: false,
        noMatchText: 'Không có thương hiệu',
        showCounts: true,
        dontCount: '',
        cookieName: null,
        onClick: null,
        prefixes: [],
        filterSelector: ''
    };
})(jQuery);
(function(e){e.fn.appear=function(t,n){var r=e.extend({data:undefined,one:true,accX:0,accY:0},n);return this.each(function(){var n=e(this);n.appeared=false;if(!t){n.trigger("appear",r.data);return}var i=e(window);var s=function(){if(!n.is(":visible")){n.appeared=false;return}var e=i.scrollLeft();var t=i.scrollTop();var s=n.offset();var o=s.left;var u=s.top;var a=r.accX;var f=r.accY;var l=n.height();var c=i.height();var h=n.width();var p=i.width();if(u+l+f>=t&&u<=t+c+f&&o+h+a>=e&&o<=e+p+a){if(!n.appeared)n.trigger("appear",r.data)}else{n.appeared=false}};var o=function(){n.appeared=true;if(r.one){i.unbind("scroll",s);var o=e.inArray(s,e.fn.appear.checks);if(o>=0)e.fn.appear.checks.splice(o,1)}t.apply(this,arguments)};if(r.one)n.one("appear",r.data,o);else n.bind("appear",r.data,o);i.scroll(s);e.fn.appear.checks.push(s);s()})};e.extend(e.fn.appear,{checks:[],timeout:null,checkAll:function(){var t=e.fn.appear.checks.length;if(t>0)while(t--)e.fn.appear.checks[t]()},run:function(){if(e.fn.appear.timeout)clearTimeout(e.fn.appear.timeout);e.fn.appear.timeout=setTimeout(e.fn.appear.checkAll,20)}});e.each(["append","prepend","after","before","attr","removeAttr","addClass","removeClass","toggleClass","remove","css","show","hide"],function(t,n){var r=e.fn[n];if(r){e.fn[n]=function(){var t=r.apply(this,arguments);e.fn.appear.run();return t}}})})(jQuery);