(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global = global || self, global.GLightbox = factory());
}(this, (function () { 'use strict';

    function _typeof(obj) {
        "@babel/helpers - typeof";

        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
            _typeof = function (obj) {
                return typeof obj;
            };
        } else {
            _typeof = function (obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
        }

        return _typeof(obj);
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        return Constructor;
    }

    var uid = Date.now();
    function extend() {
        var extended = {};
        var deep = true;
        var i = 0;
        var length = arguments.length;

        if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
            deep = arguments[0];
            i++;
        }

        var merge = function merge(obj) {
            for (var prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                        extended[prop] = extend(true, extended[prop], obj[prop]);
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };

        for (; i < length; i++) {
            var obj = arguments[i];
            merge(obj);
        }

        return extended;
    }
    function each(collection, callback) {
        if (isNode(collection) || collection === window || collection === document) {
            collection = [collection];
        }

        if (!isArrayLike(collection) && !isObject(collection)) {
            collection = [collection];
        }

        if (size(collection) == 0) {
            return;
        }

        if (isArrayLike(collection) && !isObject(collection)) {
            var l = collection.length,
                i = 0;

            for (; i < l; i++) {
                if (callback.call(collection[i], collection[i], i, collection) === false) {
                    break;
                }
            }
        } else if (isObject(collection)) {
            for (var key in collection) {
                if (has(collection, key)) {
                    if (callback.call(collection[key], collection[key], key, collection) === false) {
                        break;
                    }
                }
            }
        }
    }
    function getNodeEvents(node) {
        var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var fn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var cache = node[uid] = node[uid] || [];
        var data = {
            all: cache,
            evt: null,
            found: null
        };

        if (name && fn && size(cache) > 0) {
            each(cache, function (cl, i) {
                if (cl.eventName == name && cl.fn.toString() == fn.toString()) {
                    data.found = true;
                    data.evt = i;
                    return false;
                }
            });
        }

        return data;
    }
    function addEvent(eventName) {
        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            onElement = _ref.onElement,
            withCallback = _ref.withCallback,
            _ref$avoidDuplicate = _ref.avoidDuplicate,
            avoidDuplicate = _ref$avoidDuplicate === void 0 ? true : _ref$avoidDuplicate,
            _ref$once = _ref.once,
            once = _ref$once === void 0 ? false : _ref$once,
            _ref$useCapture = _ref.useCapture,
            useCapture = _ref$useCapture === void 0 ? false : _ref$useCapture;

        var thisArg = arguments.length > 2 ? arguments[2] : undefined;
        var element = onElement || [];

        if (isString(element)) {
            element = document.querySelectorAll(element);
        }

        function handler(event) {
            if (isFunction(withCallback)) {
                withCallback.call(thisArg, event, this);
            }

            if (once) {
                handler.destroy();
            }
        }

        handler.destroy = function () {
            each(element, function (el) {
                var events = getNodeEvents(el, eventName, handler);

                if (events.found) {
                    events.all.splice(events.evt, 1);
                }

                if (el.removeEventListener) {
                    el.removeEventListener(eventName, handler, useCapture);
                }
            });
        };

        each(element, function (el) {
            var events = getNodeEvents(el, eventName, handler);

            if (el.addEventListener && avoidDuplicate && !events.found || !avoidDuplicate) {
                el.addEventListener(eventName, handler, useCapture);
                events.all.push({
                    eventName: eventName,
                    fn: handler
                });
            }
        });
        return handler;
    }
    function addClass(node, name) {
        each(name.split(' '), function (cl) {
            return node.classList.add(cl);
        });
    }
    function removeClass(node, name) {
        each(name.split(' '), function (cl) {
            return node.classList.remove(cl);
        });
    }
    function hasClass(node, name) {
        return node.classList.contains(name);
    }
    function closest(elem, selector) {
        while (elem !== document.body) {
            elem = elem.parentElement;

            if (!elem) {
                return false;
            }

            var matches = typeof elem.matches == 'function' ? elem.matches(selector) : elem.msMatchesSelector(selector);

            if (matches) {
                return elem;
            }
        }
    }
    function animateElement(element) {
        var animation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        if (!element || animation === '') {
            return false;
        }

        if (animation === 'none') {
            if (isFunction(callback)) {
                callback();
            }

            return false;
        }

        var animationEnd = whichAnimationEvent();
        var animationNames = animation.split(' ');
        each(animationNames, function (name) {
            addClass(element, 'g' + name);
        });
        addEvent(animationEnd, {
            onElement: element,
            avoidDuplicate: false,
            once: true,
            withCallback: function withCallback(event, target) {
                each(animationNames, function (name) {
                    removeClass(target, 'g' + name);
                });

                if (isFunction(callback)) {
                    callback();
                }
            }
        });
    }
    function cssTransform(node) {
        var translate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

        if (translate === '') {
            node.style.webkitTransform = '';
            node.style.MozTransform = '';
            node.style.msTransform = '';
            node.style.OTransform = '';
            node.style.transform = '';
            return false;
        }

        node.style.webkitTransform = translate;
        node.style.MozTransform = translate;
        node.style.msTransform = translate;
        node.style.OTransform = translate;
        node.style.transform = translate;
    }
    function show(element) {
        element.style.display = 'block';
    }
    function hide(element) {
        element.style.display = 'none';
    }
    function createHTML(htmlStr) {
        var frag = document.createDocumentFragment(),
            temp = document.createElement('div');
        temp.innerHTML = htmlStr;

        while (temp.firstChild) {
            frag.appendChild(temp.firstChild);
        }

        return frag;
    }
    function windowSize() {
        return {
            width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        };
    }
    function whichAnimationEvent() {
        var t,
            el = document.createElement('fakeelement');
        var animations = {
            animation: 'animationend',
            OAnimation: 'oAnimationEnd',
            MozAnimation: 'animationend',
            WebkitAnimation: 'webkitAnimationEnd'
        };

        for (t in animations) {
            if (el.style[t] !== undefined) {
                return animations[t];
            }
        }
    }
    function whichTransitionEvent() {
        var t,
            el = document.createElement('fakeelement');
        var transitions = {
            transition: 'transitionend',
            OTransition: 'oTransitionEnd',
            MozTransition: 'transitionend',
            WebkitTransition: 'webkitTransitionEnd'
        };

        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    }
    function createIframe(config) {
        var url = config.url,
            allow = config.allow,
            callback = config.callback,
            appendTo = config.appendTo;
        var iframe = document.createElement('iframe');
        iframe.className = 'vimeo-video gvideo';
        iframe.src = url;
        iframe.style.width = '100%';
        iframe.style.height = '100%';

        if (allow) {
            iframe.setAttribute('allow', allow);
        }

        iframe.onload = function () {
            iframe.onload = null;
            addClass(iframe, 'node-ready');

            if (isFunction(callback)) {
                callback();
            }
        };

        if (appendTo) {
            appendTo.appendChild(iframe);
        }

        return iframe;
    }
    function waitUntil(check, onComplete, delay, timeout) {
        if (check()) {
            onComplete();
            return;
        }

        if (!delay) {
            delay = 100;
        }

        var timeoutPointer;
        var intervalPointer = setInterval(function () {
            if (!check()) {
                return;
            }

            clearInterval(intervalPointer);

            if (timeoutPointer) {
                clearTimeout(timeoutPointer);
            }

            onComplete();
        }, delay);

        if (timeout) {
            timeoutPointer = setTimeout(function () {
                clearInterval(intervalPointer);
            }, timeout);
        }
    }
    function injectAssets(url, waitFor, callback) {
        if (isNil(url)) {
            console.error('Inject assets error');
            return;
        }

        if (isFunction(waitFor)) {
            callback = waitFor;
            waitFor = false;
        }

        if (isString(waitFor) && waitFor in window) {
            if (isFunction(callback)) {
                callback();
            }

            return;
        }

        var found;

        if (url.indexOf('.css') !== -1) {
            found = document.querySelectorAll('link[href="' + url + '"]');

            if (found && found.length > 0) {
                if (isFunction(callback)) {
                    callback();
                }

                return;
            }

            var head = document.getElementsByTagName('head')[0];
            var headStyles = head.querySelectorAll('link[rel="stylesheet"]');
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = url;
            link.media = 'all';

            if (headStyles) {
                head.insertBefore(link, headStyles[0]);
            } else {
                head.appendChild(link);
            }

            if (isFunction(callback)) {
                callback();
            }

            return;
        }

        found = document.querySelectorAll('script[src="' + url + '"]');

        if (found && found.length > 0) {
            if (isFunction(callback)) {
                if (isString(waitFor)) {
                    waitUntil(function () {
                        return typeof window[waitFor] !== 'undefined';
                    }, function () {
                        callback();
                    });
                    return false;
                }

                callback();
            }

            return;
        }

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        script.onload = function () {
            if (isFunction(callback)) {
                if (isString(waitFor)) {
                    waitUntil(function () {
                        return typeof window[waitFor] !== 'undefined';
                    }, function () {
                        callback();
                    });
                    return false;
                }

                callback();
            }
        };

        document.body.appendChild(script);
    }
    function isMobile() {
        return 'navigator' in window && window.navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i);
    }
    function isTouch() {
        return isMobile() !== null || document.createTouch !== undefined || 'ontouchstart' in window || 'onmsgesturechange' in window || navigator.msMaxTouchPoints;
    }
    function isFunction(f) {
        return typeof f === 'function';
    }
    function isString(s) {
        return typeof s === 'string';
    }
    function isNode(el) {
        return !!(el && el.nodeType && el.nodeType == 1);
    }
    function isArray(ar) {
        return Array.isArray(ar);
    }
    function isArrayLike(ar) {
        return ar && ar.length && isFinite(ar.length);
    }
    function isObject(o) {
        var type = _typeof(o);

        return type === 'object' && o != null && !isFunction(o) && !isArray(o);
    }
    function isNil(o) {
        return o == null;
    }
    function has(obj, key) {
        return obj !== null && hasOwnProperty.call(obj, key);
    }
    function size(o) {
        if (isObject(o)) {
            if (o.keys) {
                return o.keys().length;
            }

            var l = 0;

            for (var k in o) {
                if (has(o, k)) {
                    l++;
                }
            }

            return l;
        } else {
            return o.length;
        }
    }
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function getNextFocusElement() {
        var current = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
        var btns = document.querySelectorAll('.gbtn[data-taborder]:not(.disabled)');

        if (!btns.length) {
            return false;
        }

        if (btns.length == 1) {
            return btns[0];
        }

        if (typeof current == 'string') {
            current = parseInt(current);
        }

        var orders = [];
        each(btns, function (btn) {
            orders.push(btn.getAttribute('data-taborder'));
        });
        var highestOrder = Math.max.apply(Math, orders.map(function (order) {
            return parseInt(order);
        }));
        var newIndex = current < 0 ? 1 : current + 1;

        if (newIndex > highestOrder) {
            newIndex = '1';
        }

        var nextOrders = orders.filter(function (el) {
            return el >= parseInt(newIndex);
        });
        var nextFocus = nextOrders.sort()[0];
        return document.querySelector(".gbtn[data-taborder=\"".concat(nextFocus, "\"]"));
    }

    function keyboardNavigation(instance) {
        if (instance.events.hasOwnProperty('keyboard')) {
            return false;
        }

        instance.events['keyboard'] = addEvent('keydown', {
            onElement: window,
            withCallback: function withCallback(event, target) {
                event = event || window.event;
                var key = event.keyCode;

                if (key == 9) {
                    var focusedButton = document.querySelector('.gbtn.focused');

                    if (!focusedButton) {
                        var activeElement = document.activeElement && document.activeElement.nodeName ? document.activeElement.nodeName.toLocaleLowerCase() : false;

                        if (activeElement == 'input' || activeElement == 'textarea' || activeElement == 'button') {
                            return;
                        }
                    }

                    event.preventDefault();
                    var btns = document.querySelectorAll('.gbtn[data-taborder]');

                    if (!btns || btns.length <= 0) {
                        return;
                    }

                    if (!focusedButton) {
                        var first = getNextFocusElement();

                        if (first) {
                            first.focus();
                            addClass(first, 'focused');
                        }

                        return;
                    }

                    var currentFocusOrder = focusedButton.getAttribute('data-taborder');
                    var nextFocus = getNextFocusElement(currentFocusOrder);
                    removeClass(focusedButton, 'focused');

                    if (nextFocus) {
                        nextFocus.focus();
                        addClass(nextFocus, 'focused');
                    }
                }

                if (key == 39) {
                    instance.nextSlide();
                }

                if (key == 37) {
                    instance.prevSlide();
                }

                if (key == 27) {
                    instance.close();
                }
            }
        });
    }

    function getLen(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }

    function dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }

    function getAngle(v1, v2) {
        var mr = getLen(v1) * getLen(v2);

        if (mr === 0) {
            return 0;
        }

        var r = dot(v1, v2) / mr;

        if (r > 1) {
            r = 1;
        }

        return Math.acos(r);
    }

    function cross(v1, v2) {
        return v1.x * v2.y - v2.x * v1.y;
    }

    function getRotateAngle(v1, v2) {
        var angle = getAngle(v1, v2);

        if (cross(v1, v2) > 0) {
            angle *= -1;
        }

        return angle * 180 / Math.PI;
    }

    var EventsHandlerAdmin = function () {
        function EventsHandlerAdmin(el) {
            _classCallCheck(this, EventsHandlerAdmin);

            this.handlers = [];
            this.el = el;
        }

        _createClass(EventsHandlerAdmin, [{
            key: "add",
            value: function add(handler) {
                this.handlers.push(handler);
            }
        }, {
            key: "del",
            value: function del(handler) {
                if (!handler) {
                    this.handlers = [];
                }

                for (var i = this.handlers.length; i >= 0; i--) {
                    if (this.handlers[i] === handler) {
                        this.handlers.splice(i, 1);
                    }
                }
            }
        }, {
            key: "dispatch",
            value: function dispatch() {
                for (var i = 0, len = this.handlers.length; i < len; i++) {
                    var handler = this.handlers[i];

                    if (typeof handler === 'function') {
                        handler.apply(this.el, arguments);
                    }
                }
            }
        }]);

        return EventsHandlerAdmin;
    }();

    function wrapFunc(el, handler) {
        var EventshandlerAdmin = new EventsHandlerAdmin(el);
        EventshandlerAdmin.add(handler);
        return EventshandlerAdmin;
    }

    var TouchEvents = function () {
        function TouchEvents(el, option) {
            _classCallCheck(this, TouchEvents);

            this.element = typeof el == 'string' ? document.querySelector(el) : el;
            this.start = this.start.bind(this);
            this.move = this.move.bind(this);
            this.end = this.end.bind(this);
            this.cancel = this.cancel.bind(this);
            this.element.addEventListener('touchstart', this.start, false);
            this.element.addEventListener('touchmove', this.move, false);
            this.element.addEventListener('touchend', this.end, false);
            this.element.addEventListener('touchcancel', this.cancel, false);
            this.preV = {
                x: null,
                y: null
            };
            this.pinchStartLen = null;
            this.zoom = 1;
            this.isDoubleTap = false;

            var noop = function noop() {};

            this.rotate = wrapFunc(this.element, option.rotate || noop);
            this.touchStart = wrapFunc(this.element, option.touchStart || noop);
            this.multipointStart = wrapFunc(this.element, option.multipointStart || noop);
            this.multipointEnd = wrapFunc(this.element, option.multipointEnd || noop);
            this.pinch = wrapFunc(this.element, option.pinch || noop);
            this.swipe = wrapFunc(this.element, option.swipe || noop);
            this.tap = wrapFunc(this.element, option.tap || noop);
            this.doubleTap = wrapFunc(this.element, option.doubleTap || noop);
            this.longTap = wrapFunc(this.element, option.longTap || noop);
            this.singleTap = wrapFunc(this.element, option.singleTap || noop);
            this.pressMove = wrapFunc(this.element, option.pressMove || noop);
            this.twoFingerPressMove = wrapFunc(this.element, option.twoFingerPressMove || noop);
            this.touchMove = wrapFunc(this.element, option.touchMove || noop);
            this.touchEnd = wrapFunc(this.element, option.touchEnd || noop);
            this.touchCancel = wrapFunc(this.element, option.touchCancel || noop);
            this.translateContainer = this.element;
            this._cancelAllHandler = this.cancelAll.bind(this);
            window.addEventListener('scroll', this._cancelAllHandler);
            this.delta = null;
            this.last = null;
            this.now = null;
            this.tapTimeout = null;
            this.singleTapTimeout = null;
            this.longTapTimeout = null;
            this.swipeTimeout = null;
            this.x1 = this.x2 = this.y1 = this.y2 = null;
            this.preTapPosition = {
                x: null,
                y: null
            };
        }

        _createClass(TouchEvents, [{
            key: "start",
            value: function start(evt) {
                if (!evt.touches) {
                    return;
                }

                var ignoreDragFor = ['a', 'button', 'input'];

                if (evt.target && evt.target.nodeName && ignoreDragFor.indexOf(evt.target.nodeName.toLowerCase()) >= 0) {
                    console.log('ignore drag for this touched element', evt.target.nodeName.toLowerCase());
                    return;
                }

                this.now = Date.now();
                this.x1 = evt.touches[0].pageX;
                this.y1 = evt.touches[0].pageY;
                this.delta = this.now - (this.last || this.now);
                this.touchStart.dispatch(evt, this.element);

                if (this.preTapPosition.x !== null) {
                    this.isDoubleTap = this.delta > 0 && this.delta <= 250 && Math.abs(this.preTapPosition.x - this.x1) < 30 && Math.abs(this.preTapPosition.y - this.y1) < 30;

                    if (this.isDoubleTap) {
                        clearTimeout(this.singleTapTimeout);
                    }
                }

                this.preTapPosition.x = this.x1;
                this.preTapPosition.y = this.y1;
                this.last = this.now;
                var preV = this.preV,
                    len = evt.touches.length;

                if (len > 1) {
                    this._cancelLongTap();

                    this._cancelSingleTap();

                    var v = {
                        x: evt.touches[1].pageX - this.x1,
                        y: evt.touches[1].pageY - this.y1
                    };
                    preV.x = v.x;
                    preV.y = v.y;
                    this.pinchStartLen = getLen(preV);
                    this.multipointStart.dispatch(evt, this.element);
                }

                this._preventTap = false;
                this.longTapTimeout = setTimeout(function () {
                    this.longTap.dispatch(evt, this.element);
                    this._preventTap = true;
                }.bind(this), 750);
            }
        }, {
            key: "move",
            value: function move(evt) {
                if (!evt.touches) {
                    return;
                }

                var preV = this.preV,
                    len = evt.touches.length,
                    currentX = evt.touches[0].pageX,
                    currentY = evt.touches[0].pageY;
                this.isDoubleTap = false;

                if (len > 1) {
                    var sCurrentX = evt.touches[1].pageX,
                        sCurrentY = evt.touches[1].pageY;
                    var v = {
                        x: evt.touches[1].pageX - currentX,
                        y: evt.touches[1].pageY - currentY
                    };

                    if (preV.x !== null) {
                        if (this.pinchStartLen > 0) {
                            evt.zoom = getLen(v) / this.pinchStartLen;
                            this.pinch.dispatch(evt, this.element);
                        }

                        evt.angle = getRotateAngle(v, preV);
                        this.rotate.dispatch(evt, this.element);
                    }

                    preV.x = v.x;
                    preV.y = v.y;

                    if (this.x2 !== null && this.sx2 !== null) {
                        evt.deltaX = (currentX - this.x2 + sCurrentX - this.sx2) / 2;
                        evt.deltaY = (currentY - this.y2 + sCurrentY - this.sy2) / 2;
                    } else {
                        evt.deltaX = 0;
                        evt.deltaY = 0;
                    }

                    this.twoFingerPressMove.dispatch(evt, this.element);
                    this.sx2 = sCurrentX;
                    this.sy2 = sCurrentY;
                } else {
                    if (this.x2 !== null) {
                        evt.deltaX = currentX - this.x2;
                        evt.deltaY = currentY - this.y2;
                        var movedX = Math.abs(this.x1 - this.x2),
                            movedY = Math.abs(this.y1 - this.y2);

                        if (movedX > 10 || movedY > 10) {
                            this._preventTap = true;
                        }
                    } else {
                        evt.deltaX = 0;
                        evt.deltaY = 0;
                    }

                    this.pressMove.dispatch(evt, this.element);
                }

                this.touchMove.dispatch(evt, this.element);

                this._cancelLongTap();

                this.x2 = currentX;
                this.y2 = currentY;

                if (len > 1) {
                    evt.preventDefault();
                }
            }
        }, {
            key: "end",
            value: function end(evt) {
                if (!evt.changedTouches) {
                    return;
                }

                this._cancelLongTap();

                var self = this;

                if (evt.touches.length < 2) {
                    this.multipointEnd.dispatch(evt, this.element);
                    this.sx2 = this.sy2 = null;
                }

                if (this.x2 && Math.abs(this.x1 - this.x2) > 30 || this.y2 && Math.abs(this.y1 - this.y2) > 30) {
                    evt.direction = this._swipeDirection(this.x1, this.x2, this.y1, this.y2);
                    this.swipeTimeout = setTimeout(function () {
                        self.swipe.dispatch(evt, self.element);
                    }, 0);
                } else {
                    this.tapTimeout = setTimeout(function () {
                        if (!self._preventTap) {
                            self.tap.dispatch(evt, self.element);
                        }

                        if (self.isDoubleTap) {
                            self.doubleTap.dispatch(evt, self.element);
                            self.isDoubleTap = false;
                        }
                    }, 0);

                    if (!self.isDoubleTap) {
                        self.singleTapTimeout = setTimeout(function () {
                            self.singleTap.dispatch(evt, self.element);
                        }, 250);
                    }
                }

                this.touchEnd.dispatch(evt, this.element);
                this.preV.x = 0;
                this.preV.y = 0;
                this.zoom = 1;
                this.pinchStartLen = null;
                this.x1 = this.x2 = this.y1 = this.y2 = null;
            }
        }, {
            key: "cancelAll",
            value: function cancelAll() {
                this._preventTap = true;
                clearTimeout(this.singleTapTimeout);
                clearTimeout(this.tapTimeout);
                clearTimeout(this.longTapTimeout);
                clearTimeout(this.swipeTimeout);
            }
        }, {
            key: "cancel",
            value: function cancel(evt) {
                this.cancelAll();
                this.touchCancel.dispatch(evt, this.element);
            }
        }, {
            key: "_cancelLongTap",
            value: function _cancelLongTap() {
                clearTimeout(this.longTapTimeout);
            }
        }, {
            key: "_cancelSingleTap",
            value: function _cancelSingleTap() {
                clearTimeout(this.singleTapTimeout);
            }
        }, {
            key: "_swipeDirection",
            value: function _swipeDirection(x1, x2, y1, y2) {
                return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? x1 - x2 > 0 ? 'Left' : 'Right' : y1 - y2 > 0 ? 'Up' : 'Down';
            }
        }, {
            key: "on",
            value: function on(evt, handler) {
                if (this[evt]) {
                    this[evt].add(handler);
                }
            }
        }, {
            key: "off",
            value: function off(evt, handler) {
                if (this[evt]) {
                    this[evt].del(handler);
                }
            }
        }, {
            key: "destroy",
            value: function destroy() {
                if (this.singleTapTimeout) {
                    clearTimeout(this.singleTapTimeout);
                }

                if (this.tapTimeout) {
                    clearTimeout(this.tapTimeout);
                }

                if (this.longTapTimeout) {
                    clearTimeout(this.longTapTimeout);
                }

                if (this.swipeTimeout) {
                    clearTimeout(this.swipeTimeout);
                }

                this.element.removeEventListener('touchstart', this.start);
                this.element.removeEventListener('touchmove', this.move);
                this.element.removeEventListener('touchend', this.end);
                this.element.removeEventListener('touchcancel', this.cancel);
                this.rotate.del();
                this.touchStart.del();
                this.multipointStart.del();
                this.multipointEnd.del();
                this.pinch.del();
                this.swipe.del();
                this.tap.del();
                this.doubleTap.del();
                this.longTap.del();
                this.singleTap.del();
                this.pressMove.del();
                this.twoFingerPressMove.del();
                this.touchMove.del();
                this.touchEnd.del();
                this.touchCancel.del();
                this.preV = this.pinchStartLen = this.zoom = this.isDoubleTap = this.delta = this.last = this.now = this.tapTimeout = this.singleTapTimeout = this.longTapTimeout = this.swipeTimeout = this.x1 = this.x2 = this.y1 = this.y2 = this.preTapPosition = this.rotate = this.touchStart = this.multipointStart = this.multipointEnd = this.pinch = this.swipe = this.tap = this.doubleTap = this.longTap = this.singleTap = this.pressMove = this.touchMove = this.touchEnd = this.touchCancel = this.twoFingerPressMove = null;
                window.removeEventListener('scroll', this._cancelAllHandler);
                return null;
            }
        }]);

        return TouchEvents;
    }();

    function resetSlideMove(slide) {
        var transitionEnd = whichTransitionEvent();
        var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var media = hasClass(slide, 'gslide-media') ? slide : slide.querySelector('.gslide-media');
        var container = closest(media, '.ginner-container');
        var desc = slide.querySelector('.gslide-description');

        if (windowWidth > 769) {
            media = container;
        }

        addClass(media, 'greset');
        cssTransform(media, 'translate3d(0, 0, 0)');
        addEvent(transitionEnd, {
            onElement: media,
            once: true,
            withCallback: function withCallback(event, target) {
                removeClass(media, 'greset');
            }
        });
        media.style.opacity = '';

        if (desc) {
            desc.style.opacity = '';
        }
    }

    function touchNavigation(instance) {
        if (instance.events.hasOwnProperty('touch')) {
            return false;
        }

        var winSize = windowSize();
        var winWidth = winSize.width;
        var winHeight = winSize.height;
        var process = false;
        var currentSlide = null;
        var media = null;
        var mediaImage = null;
        var doingMove = false;
        var initScale = 1;
        var maxScale = 4.5;
        var currentScale = 1;
        var doingZoom = false;
        var imageZoomed = false;
        var zoomedPosX = null;
        var zoomedPosY = null;
        var lastZoomedPosX = null;
        var lastZoomedPosY = null;
        var hDistance;
        var vDistance;
        var hDistancePercent = 0;
        var vDistancePercent = 0;
        var vSwipe = false;
        var hSwipe = false;
        var startCoords = {};
        var endCoords = {};
        var xDown = 0;
        var yDown = 0;
        var isInlined;
        var sliderWrapper = document.getElementById('glightbox-slider');
        var overlay = document.querySelector('.goverlay');
        var touchInstance = new TouchEvents(sliderWrapper, {
            touchStart: function touchStart(e) {
                process = true;

                if (hasClass(e.targetTouches[0].target, 'ginner-container') || closest(e.targetTouches[0].target, '.gslide-desc') || e.targetTouches[0].target.nodeName.toLowerCase() == 'a') {
                    process = false;
                }

                if (closest(e.targetTouches[0].target, '.gslide-inline') && !hasClass(e.targetTouches[0].target.parentNode, 'gslide-inline')) {
                    process = false;
                }

                if (process) {
                    endCoords = e.targetTouches[0];
                    startCoords.pageX = e.targetTouches[0].pageX;
                    startCoords.pageY = e.targetTouches[0].pageY;
                    xDown = e.targetTouches[0].clientX;
                    yDown = e.targetTouches[0].clientY;
                    currentSlide = instance.activeSlide;
                    media = currentSlide.querySelector('.gslide-media');
                    isInlined = currentSlide.querySelector('.gslide-inline');
                    mediaImage = null;

                    if (hasClass(media, 'gslide-image')) {
                        mediaImage = media.querySelector('img');
                    }

                    var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

                    if (windowWidth > 769) {
                        media = currentSlide.querySelector('.ginner-container');
                    }

                    removeClass(overlay, 'greset');

                    if (e.pageX > 20 && e.pageX < window.innerWidth - 20) {
                        return;
                    }

                    e.preventDefault();
                }
            },
            touchMove: function touchMove(e) {
                if (!process) {
                    return;
                }

                endCoords = e.targetTouches[0];

                if (doingZoom || imageZoomed) {
                    return;
                }

                if (isInlined && isInlined.offsetHeight > winHeight) {
                    var moved = startCoords.pageX - endCoords.pageX;

                    if (Math.abs(moved) <= 13) {
                        return false;
                    }
                }

                doingMove = true;
                var xUp = e.targetTouches[0].clientX;
                var yUp = e.targetTouches[0].clientY;
                var xDiff = xDown - xUp;
                var yDiff = yDown - yUp;

                if (Math.abs(xDiff) > Math.abs(yDiff)) {
                    vSwipe = false;
                    hSwipe = true;
                } else {
                    hSwipe = false;
                    vSwipe = true;
                }

                hDistance = endCoords.pageX - startCoords.pageX;
                hDistancePercent = hDistance * 100 / winWidth;
                vDistance = endCoords.pageY - startCoords.pageY;
                vDistancePercent = vDistance * 100 / winHeight;
                var opacity;

                if (vSwipe && mediaImage) {
                    opacity = 1 - Math.abs(vDistance) / winHeight;
                    overlay.style.opacity = opacity;

                    if (instance.settings.touchFollowAxis) {
                        hDistancePercent = 0;
                    }
                }

                if (hSwipe) {
                    opacity = 1 - Math.abs(hDistance) / winWidth;
                    media.style.opacity = opacity;

                    if (instance.settings.touchFollowAxis) {
                        vDistancePercent = 0;
                    }
                }

                if (!mediaImage) {
                    return cssTransform(media, "translate3d(".concat(hDistancePercent, "%, 0, 0)"));
                }

                cssTransform(media, "translate3d(".concat(hDistancePercent, "%, ").concat(vDistancePercent, "%, 0)"));
            },
            touchEnd: function touchEnd() {
                if (!process) {
                    return;
                }

                doingMove = false;

                if (imageZoomed || doingZoom) {
                    lastZoomedPosX = zoomedPosX;
                    lastZoomedPosY = zoomedPosY;
                    return;
                }

                var v = Math.abs(parseInt(vDistancePercent));
                var h = Math.abs(parseInt(hDistancePercent));

                if (v > 29 && mediaImage) {
                    instance.close();
                    return;
                }

                if (v < 29 && h < 25) {
                    addClass(overlay, 'greset');
                    overlay.style.opacity = 1;
                    return resetSlideMove(media);
                }
            },
            multipointEnd: function multipointEnd() {
                setTimeout(function () {
                    doingZoom = false;
                }, 50);
            },
            multipointStart: function multipointStart() {
                doingZoom = true;
                initScale = currentScale ? currentScale : 1;
            },
            pinch: function pinch(evt) {
                if (!mediaImage || doingMove) {
                    return false;
                }

                doingZoom = true;
                mediaImage.scaleX = mediaImage.scaleY = initScale * evt.zoom;
                var scale = initScale * evt.zoom;
                imageZoomed = true;

                if (scale <= 1) {
                    imageZoomed = false;
                    scale = 1;
                    lastZoomedPosY = null;
                    lastZoomedPosX = null;
                    zoomedPosX = null;
                    zoomedPosY = null;
                    mediaImage.setAttribute('style', '');
                    return;
                }

                if (scale > maxScale) {
                    scale = maxScale;
                }

                mediaImage.style.transform = "scale3d(".concat(scale, ", ").concat(scale, ", 1)");
                currentScale = scale;
            },
            pressMove: function pressMove(e) {
                if (imageZoomed && !doingZoom) {
                    var mhDistance = endCoords.pageX - startCoords.pageX;
                    var mvDistance = endCoords.pageY - startCoords.pageY;

                    if (lastZoomedPosX) {
                        mhDistance = mhDistance + lastZoomedPosX;
                    }

                    if (lastZoomedPosY) {
                        mvDistance = mvDistance + lastZoomedPosY;
                    }

                    zoomedPosX = mhDistance;
                    zoomedPosY = mvDistance;
                    var style = "translate3d(".concat(mhDistance, "px, ").concat(mvDistance, "px, 0)");

                    if (currentScale) {
                        style += " scale3d(".concat(currentScale, ", ").concat(currentScale, ", 1)");
                    }

                    cssTransform(mediaImage, style);
                }
            },
            swipe: function swipe(evt) {
                if (imageZoomed) {
                    return;
                }

                if (doingZoom) {
                    doingZoom = false;
                    return;
                }

                if (evt.direction == 'Left') {
                    if (instance.index == instance.elements.length - 1) {
                        return resetSlideMove(media);
                    }

                    instance.nextSlide();
                }

                if (evt.direction == 'Right') {
                    if (instance.index == 0) {
                        return resetSlideMove(media);
                    }

                    instance.prevSlide();
                }
            }
        });
        instance.events['touch'] = touchInstance;
    }

    var ZoomImages = function () {
        function ZoomImages(el, slide) {
            var _this = this;

            var onclose = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

            _classCallCheck(this, ZoomImages);

            this.img = el;
            this.slide = slide;
            this.onclose = onclose;

            if (this.img.setZoomEvents) {
                return false;
            }

            this.active = false;
            this.zoomedIn = false;
            this.dragging = false;
            this.currentX = null;
            this.currentY = null;
            this.initialX = null;
            this.initialY = null;
            this.xOffset = 0;
            this.yOffset = 0;
            this.img.addEventListener('mousedown', function (e) {
                return _this.dragStart(e);
            }, false);
            this.img.addEventListener('mouseup', function (e) {
                return _this.dragEnd(e);
            }, false);
            this.img.addEventListener('mousemove', function (e) {
                return _this.drag(e);
            }, false);
            this.img.addEventListener('click', function (e) {
                if (_this.slide.classList.contains('dragging-nav')) {
                    _this.zoomOut();

                    return false;
                }

                if (!_this.zoomedIn) {
                    return _this.zoomIn();
                }

                if (_this.zoomedIn && !_this.dragging) {
                    _this.zoomOut();
                }
            }, false);
            this.img.setZoomEvents = true;
        }

        _createClass(ZoomImages, [{
            key: "zoomIn",
            value: function zoomIn() {
                var winWidth = this.widowWidth();

                if (this.zoomedIn || winWidth <= 768) {
                    return;
                }

                var img = this.img;
                img.setAttribute('data-style', img.getAttribute('style'));
                img.style.maxWidth = img.naturalWidth + 'px';
                img.style.maxHeight = img.naturalHeight + 'px';

                if (img.naturalWidth > winWidth) {
                    var centerX = winWidth / 2 - img.naturalWidth / 2;
                    this.setTranslate(this.img.parentNode, centerX, 0);
                }

                this.slide.classList.add('zoomed');
                this.zoomedIn = true;
            }
        }, {
            key: "zoomOut",
            value: function zoomOut() {
                this.img.parentNode.setAttribute('style', '');
                this.img.setAttribute('style', this.img.getAttribute('data-style'));
                this.slide.classList.remove('zoomed');
                this.zoomedIn = false;
                this.currentX = null;
                this.currentY = null;
                this.initialX = null;
                this.initialY = null;
                this.xOffset = 0;
                this.yOffset = 0;

                if (this.onclose && typeof this.onclose == 'function') {
                    this.onclose();
                }
            }
        }, {
            key: "dragStart",
            value: function dragStart(e) {
                e.preventDefault();

                if (!this.zoomedIn) {
                    this.active = false;
                    return;
                }

                if (e.type === 'touchstart') {
                    this.initialX = e.touches[0].clientX - this.xOffset;
                    this.initialY = e.touches[0].clientY - this.yOffset;
                } else {
                    this.initialX = e.clientX - this.xOffset;
                    this.initialY = e.clientY - this.yOffset;
                }

                if (e.target === this.img) {
                    this.active = true;
                    this.img.classList.add('dragging');
                }
            }
        }, {
            key: "dragEnd",
            value: function dragEnd(e) {
                var _this2 = this;

                e.preventDefault();
                this.initialX = this.currentX;
                this.initialY = this.currentY;
                this.active = false;
                setTimeout(function () {
                    _this2.dragging = false;
                    _this2.img.isDragging = false;

                    _this2.img.classList.remove('dragging');
                }, 100);
            }
        }, {
            key: "drag",
            value: function drag(e) {
                if (this.active) {
                    e.preventDefault();

                    if (e.type === 'touchmove') {
                        this.currentX = e.touches[0].clientX - this.initialX;
                        this.currentY = e.touches[0].clientY - this.initialY;
                    } else {
                        this.currentX = e.clientX - this.initialX;
                        this.currentY = e.clientY - this.initialY;
                    }

                    this.xOffset = this.currentX;
                    this.yOffset = this.currentY;
                    this.img.isDragging = true;
                    this.dragging = true;
                    this.setTranslate(this.img, this.currentX, this.currentY);
                }
            }
        }, {
            key: "onMove",
            value: function onMove(e) {
                if (!this.zoomedIn) {
                    return;
                }

                var xOffset = e.clientX - this.img.naturalWidth / 2;
                var yOffset = e.clientY - this.img.naturalHeight / 2;
                this.setTranslate(this.img, xOffset, yOffset);
            }
        }, {
            key: "setTranslate",
            value: function setTranslate(node, xPos, yPos) {
                node.style.transform = 'translate3d(' + xPos + 'px, ' + yPos + 'px, 0)';
            }
        }, {
            key: "widowWidth",
            value: function widowWidth() {
                return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            }
        }]);

        return ZoomImages;
    }();

    var DragSlides = function () {
        function DragSlides() {
            var _this = this;

            var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, DragSlides);

            var dragEl = config.dragEl,
                _config$toleranceX = config.toleranceX,
                toleranceX = _config$toleranceX === void 0 ? 40 : _config$toleranceX,
                _config$toleranceY = config.toleranceY,
                toleranceY = _config$toleranceY === void 0 ? 65 : _config$toleranceY,
                _config$slide = config.slide,
                slide = _config$slide === void 0 ? null : _config$slide,
                _config$instance = config.instance,
                instance = _config$instance === void 0 ? null : _config$instance;
            this.el = dragEl;
            this.active = false;
            this.dragging = false;
            this.currentX = null;
            this.currentY = null;
            this.initialX = null;
            this.initialY = null;
            this.xOffset = 0;
            this.yOffset = 0;
            this.direction = null;
            this.lastDirection = null;
            this.toleranceX = toleranceX;
            this.toleranceY = toleranceY;
            this.toleranceReached = false;
            this.dragContainer = this.el;
            this.slide = slide;
            this.instance = instance;
            this.el.addEventListener('mousedown', function (e) {
                return _this.dragStart(e);
            }, false);
            this.el.addEventListener('mouseup', function (e) {
                return _this.dragEnd(e);
            }, false);
            this.el.addEventListener('mousemove', function (e) {
                return _this.drag(e);
            }, false);
        }

        _createClass(DragSlides, [{
            key: "dragStart",
            value: function dragStart(e) {
                if (this.slide.classList.contains('zoomed')) {
                    this.active = false;
                    return;
                }

                if (e.type === 'touchstart') {
                    this.initialX = e.touches[0].clientX - this.xOffset;
                    this.initialY = e.touches[0].clientY - this.yOffset;
                } else {
                    this.initialX = e.clientX - this.xOffset;
                    this.initialY = e.clientY - this.yOffset;
                }

                var clicked = e.target.nodeName.toLowerCase();
                var exludeClicks = ['input', 'select', 'textarea', 'button', 'a'];

                if (e.target.classList.contains('nodrag') || closest(e.target, '.nodrag') || exludeClicks.indexOf(clicked) !== -1) {
                    this.active = false;
                    return;
                }

                e.preventDefault();

                if (e.target === this.el || clicked !== 'img' && closest(e.target, '.gslide-inline')) {
                    this.active = true;
                    this.el.classList.add('dragging');
                    this.dragContainer = closest(e.target, '.ginner-container');
                }
            }
        }, {
            key: "dragEnd",
            value: function dragEnd(e) {
                var _this2 = this;

                e && e.preventDefault();
                this.initialX = 0;
                this.initialY = 0;
                this.currentX = null;
                this.currentY = null;
                this.initialX = null;
                this.initialY = null;
                this.xOffset = 0;
                this.yOffset = 0;
                this.active = false;

                if (this.doSlideChange) {
                    this.instance.preventOutsideClick = true;
                    this.doSlideChange == 'right' && this.instance.prevSlide();
                    this.doSlideChange == 'left' && this.instance.nextSlide();
                }

                if (this.doSlideClose) {
                    this.instance.close();
                }

                if (!this.toleranceReached) {
                    this.setTranslate(this.dragContainer, 0, 0, true);
                }

                setTimeout(function () {
                    _this2.instance.preventOutsideClick = false;
                    _this2.toleranceReached = false;
                    _this2.lastDirection = null;
                    _this2.dragging = false;
                    _this2.el.isDragging = false;

                    _this2.el.classList.remove('dragging');

                    _this2.slide.classList.remove('dragging-nav');

                    _this2.dragContainer.style.transform = '';
                    _this2.dragContainer.style.transition = '';
                }, 100);
            }
        }, {
            key: "drag",
            value: function drag(e) {
                if (this.active) {
                    e.preventDefault();
                    this.slide.classList.add('dragging-nav');

                    if (e.type === 'touchmove') {
                        this.currentX = e.touches[0].clientX - this.initialX;
                        this.currentY = e.touches[0].clientY - this.initialY;
                    } else {
                        this.currentX = e.clientX - this.initialX;
                        this.currentY = e.clientY - this.initialY;
                    }

                    this.xOffset = this.currentX;
                    this.yOffset = this.currentY;
                    this.el.isDragging = true;
                    this.dragging = true;
                    this.doSlideChange = false;
                    this.doSlideClose = false;
                    var currentXInt = Math.abs(this.currentX);
                    var currentYInt = Math.abs(this.currentY);

                    if (currentXInt > 0 && currentXInt >= Math.abs(this.currentY) && (!this.lastDirection || this.lastDirection == 'x')) {
                        this.yOffset = 0;
                        this.lastDirection = 'x';
                        this.setTranslate(this.dragContainer, this.currentX, 0);
                        var doChange = this.shouldChange();

                        if (!this.instance.settings.dragAutoSnap && doChange) {
                            this.doSlideChange = doChange;
                        }

                        if (this.instance.settings.dragAutoSnap && doChange) {
                            this.instance.preventOutsideClick = true;
                            this.toleranceReached = true;
                            this.active = false;
                            this.instance.preventOutsideClick = true;
                            this.dragEnd(null);
                            doChange == 'right' && this.instance.prevSlide();
                            doChange == 'left' && this.instance.nextSlide();
                            return;
                        }
                    }

                    if (this.toleranceY > 0 && currentYInt > 0 && currentYInt >= currentXInt && (!this.lastDirection || this.lastDirection == 'y')) {
                        this.xOffset = 0;
                        this.lastDirection = 'y';
                        this.setTranslate(this.dragContainer, 0, this.currentY);
                        var doClose = this.shouldClose();

                        if (!this.instance.settings.dragAutoSnap && doClose) {
                            this.doSlideClose = true;
                        }

                        if (this.instance.settings.dragAutoSnap && doClose) {
                            this.instance.close();
                        }

                        return;
                    }
                }
            }
        }, {
            key: "shouldChange",
            value: function shouldChange() {
                var doChange = false;
                var currentXInt = Math.abs(this.currentX);

                if (currentXInt >= this.toleranceX) {
                    var dragDir = this.currentX > 0 ? 'right' : 'left';

                    if (dragDir == 'left' && this.slide !== this.slide.parentNode.lastChild || dragDir == 'right' && this.slide !== this.slide.parentNode.firstChild) {
                        doChange = dragDir;
                    }
                }

                return doChange;
            }
        }, {
            key: "shouldClose",
            value: function shouldClose() {
                var doClose = false;
                var currentYInt = Math.abs(this.currentY);

                if (currentYInt >= this.toleranceY) {
                    doClose = true;
                }

                return doClose;
            }
        }, {
            key: "setTranslate",
            value: function setTranslate(node, xPos, yPos) {
                var animated = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

                if (animated) {
                    node.style.transition = 'all .2s ease';
                } else {
                    node.style.transition = '';
                }

                node.style.transform = "translate3d(".concat(xPos, "px, ").concat(yPos, "px, 0)");
            }
        }]);

        return DragSlides;
    }();

    function slideImage(slide, data, index, callback) {
        var slideMedia = slide.querySelector('.gslide-media');
        var img = new Image();
        var titleID = 'gSlideTitle_' + index;
        var textID = 'gSlideDesc_' + index;
        img.addEventListener('load', function () {
            if (isFunction(callback)) {
                callback();
            }
        }, false);
        img.src = data.href;

        if (data.sizes != '' && data.srcset != '') {
            img.sizes = data.sizes;
            img.srcset = data.srcset;
        }

        img.alt = '';

        if (!isNil(data.alt) && data.alt !== '') {
            img.alt = data.alt;
        }

        if (data.title !== '') {
            img.setAttribute('aria-labelledby', titleID);
        }

        if (data.description !== '') {
            img.setAttribute('aria-describedby', textID);
        }

        if (data.hasOwnProperty('_hasCustomWidth') && data._hasCustomWidth) {
            img.style.width = data.width;
        }

        if (data.hasOwnProperty('_hasCustomHeight') && data._hasCustomHeight) {
            img.style.height = data.height;
        }

        slideMedia.insertBefore(img, slideMedia.firstChild);
        return;
    }

    function slideVideo(slide, data, index, callback) {
        var _this = this;

        var slideContainer = slide.querySelector('.ginner-container');
        var videoID = 'gvideo' + index;
        var slideMedia = slide.querySelector('.gslide-media');
        var videoPlayers = this.getAllPlayers();
        addClass(slideContainer, 'gvideo-container');
        slideMedia.insertBefore(createHTML('<div class="gvideo-wrapper"></div>'), slideMedia.firstChild);
        var videoWrapper = slide.querySelector('.gvideo-wrapper');
        injectAssets(this.settings.plyr.css, 'Plyr');
        var url = data.href;
        var provider = data === null || data === void 0 ? void 0 : data.videoProvider;
        var customPlaceholder = false;
        slideMedia.style.maxWidth = data.width;
        injectAssets(this.settings.plyr.js, 'Plyr', function () {
            if (!provider && url.match(/vimeo\.com\/([0-9]*)/)) {
                provider = 'vimeo';
            }

            if (!provider && (url.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || url.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/) || url.match(/(youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9\-_]+)/))) {
                provider = 'youtube';
            }

            if (provider === 'local' || !provider) {
                provider = 'local';
                var html = '<video id="' + videoID + '" ';
                html += "style=\"background:#000; max-width: ".concat(data.width, ";\" ");
                html += 'preload="metadata" ';
                html += 'x-webkit-airplay="allow" ';
                html += 'playsinline ';
                html += 'controls ';
                html += 'class="gvideo-local">';
                html += "<source src=\"".concat(url, "\">");
                html += '</video>';
                customPlaceholder = createHTML(html);
            }

            var placeholder = customPlaceholder ? customPlaceholder : createHTML("<div id=\"".concat(videoID, "\" data-plyr-provider=\"").concat(provider, "\" data-plyr-embed-id=\"").concat(url, "\"></div>"));
            addClass(videoWrapper, "".concat(provider, "-video gvideo"));
            videoWrapper.appendChild(placeholder);
            videoWrapper.setAttribute('data-id', videoID);
            videoWrapper.setAttribute('data-index', index);
            var playerConfig = has(_this.settings.plyr, 'config') ? _this.settings.plyr.config : {};
            var player = new Plyr('#' + videoID, playerConfig);
            player.on('ready', function (event) {
                videoPlayers[videoID] = event.detail.plyr;

                if (isFunction(callback)) {
                    callback();
                }
            });
            waitUntil(function () {
                return slide.querySelector('iframe') && slide.querySelector('iframe').dataset.ready == 'true';
            }, function () {
                _this.resize(slide);
            });
            player.on('enterfullscreen', handleMediaFullScreen);
            player.on('exitfullscreen', handleMediaFullScreen);
        });
    }

    function handleMediaFullScreen(event) {
        var media = closest(event.target, '.gslide-media');

        if (event.type === 'enterfullscreen') {
            addClass(media, 'fullscreen');
        }

        if (event.type === 'exitfullscreen') {
            removeClass(media, 'fullscreen');
        }
    }

    function slideInline(slide, data, index, callback) {
        var _this = this;

        var slideMedia = slide.querySelector('.gslide-media');
        var hash = has(data, 'href') && data.href ? data.href.split('#').pop().trim() : false;
        var content = has(data, 'content') && data.content ? data.content : false;
        var innerContent;

        if (content) {
            if (isString(content)) {
                innerContent = createHTML("<div class=\"ginlined-content\">".concat(content, "</div>"));
            }

            if (isNode(content)) {
                if (content.style.display == 'none') {
                    content.style.display = 'block';
                }

                var container = document.createElement('div');
                container.className = 'ginlined-content';
                container.appendChild(content);
                innerContent = container;
            }
        }

        if (hash) {
            var div = document.getElementById(hash);

            if (!div) {
                return false;
            }

            var cloned = div.cloneNode(true);
            cloned.style.height = data.height;
            cloned.style.maxWidth = data.width;
            addClass(cloned, 'ginlined-content');
            innerContent = cloned;
        }

        if (!innerContent) {
            console.error('Unable to append inline slide content', data);
            return false;
        }

        slideMedia.style.height = data.height;
        slideMedia.style.width = data.width;
        slideMedia.appendChild(innerContent);
        this.events['inlineclose' + hash] = addEvent('click', {
            onElement: slideMedia.querySelectorAll('.gtrigger-close'),
            withCallback: function withCallback(e) {
                e.preventDefault();

                _this.close();
            }
        });

        if (isFunction(callback)) {
            callback();
        }

        return;
    }

    function slideIframe(slide, data, index, callback) {
        var slideMedia = slide.querySelector('.gslide-media');
        var iframe = createIframe({
            url: data.href,
            callback: callback
        });
        slideMedia.parentNode.style.maxWidth = data.width;
        slideMedia.parentNode.style.height = data.height;
        slideMedia.appendChild(iframe);
        return;
    }

    var SlideConfigParser = function () {
        function SlideConfigParser() {
            var slideParamas = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, SlideConfigParser);

            this.defaults = {
                href: '',
                sizes: '',
                srcset: '',
                title: '',
                type: '',
                videoProvider: '',
                description: '',
                alt: '',
                descPosition: 'bottom',
                effect: '',
                width: '',
                height: '',
                content: false,
                zoomable: true,
                draggable: true
            };

            if (isObject(slideParamas)) {
                this.defaults = extend(this.defaults, slideParamas);
            }
        }

        _createClass(SlideConfigParser, [{
            key: "sourceType",
            value: function sourceType(url) {
                var origin = url;
                url = url.toLowerCase();

                if (url.match(/\.(jpeg|jpg|jpe|gif|png|apn|webp|avif|svg)/) !== null) {
                    return 'image';
                }

                if (url.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || url.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/) || url.match(/(youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9\-_]+)/)) {
                    return 'video';
                }

                if (url.match(/vimeo\.com\/([0-9]*)/)) {
                    return 'video';
                }

                if (url.match(/\.(mp4|ogg|webm|mov)/) !== null) {
                    return 'video';
                }

                if (url.match(/\.(mp3|wav|wma|aac|ogg)/) !== null) {
                    return 'audio';
                }

                if (url.indexOf('#') > -1) {
                    var hash = origin.split('#').pop();

                    if (hash.trim() !== '') {
                        return 'inline';
                    }
                }

                if (url.indexOf('goajax=true') > -1) {
                    return 'ajax';
                }

                return 'external';
            }
        }, {
            key: "parseConfig",
            value: function parseConfig(element, settings) {
                var _this = this;

                var data = extend({
                    descPosition: settings.descPosition
                }, this.defaults);

                if (isObject(element) && !isNode(element)) {
                    if (!has(element, 'type')) {
                        if (has(element, 'content') && element.content) {
                            element.type = 'inline';
                        } else if (has(element, 'href')) {
                            element.type = this.sourceType(element.href);
                        }
                    }

                    var objectData = extend(data, element);
                    this.setSize(objectData, settings);
                    return objectData;
                }

                var url = '';
                var config = element.getAttribute('data-glightbox');
                var nodeType = element.nodeName.toLowerCase();

                if (nodeType === 'a') {
                    url = element.href;
                }

                if (nodeType === 'img') {
                    url = element.src;
                    data.alt = element.alt;
                }

                data.href = url;
                each(data, function (val, key) {
                    if (has(settings, key) && key !== 'width') {
                        data[key] = settings[key];
                    }

                    var nodeData = element.dataset[key];

                    if (!isNil(nodeData)) {
                        data[key] = _this.sanitizeValue(nodeData);
                    }
                });

                if (data.content) {
                    data.type = 'inline';
                }

                if (!data.type && url) {
                    data.type = this.sourceType(url);
                }

                if (!isNil(config)) {
                    var cleanKeys = [];
                    each(data, function (v, k) {
                        cleanKeys.push(';\\s?' + k);
                    });
                    cleanKeys = cleanKeys.join('\\s?:|');

                    if (config.trim() !== '') {
                        each(data, function (val, key) {
                            var str = config;
                            var match = 's?' + key + 's?:s?(.*?)(' + cleanKeys + 's?:|$)';
                            var regex = new RegExp(match);
                            var matches = str.match(regex);

                            if (matches && matches.length && matches[1]) {
                                var value = matches[1].trim().replace(/;\s*$/, '');
                                data[key] = _this.sanitizeValue(value);
                            }
                        });
                    }
                } else {
                    if (!data.title && nodeType == 'a') {
                        var title = element.title;

                        if (!isNil(title) && title !== '') {
                            data.title = title;
                        }
                    }

                    if (!data.title && nodeType == 'img') {
                        var alt = element.alt;

                        if (!isNil(alt) && alt !== '') {
                            data.title = alt;
                        }
                    }
                }

                if (data.description && data.description.substring(0, 1) === '.') {
                    var description;

                    try {
                        description = document.querySelector(data.description).innerHTML;
                    } catch (error) {
                        if (!(error instanceof DOMException)) {
                            throw error;
                        }
                    }

                    if (description) {
                        data.description = description;
                    }
                }

                if (!data.description) {
                    var nodeDesc = element.querySelector('.glightbox-desc');

                    if (nodeDesc) {
                        data.description = nodeDesc.innerHTML;
                    }
                }

                this.setSize(data, settings, element);
                this.slideConfig = data;
                return data;
            }
        }, {
            key: "setSize",
            value: function setSize(data, settings) {
                var element = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
                var defaultWith = data.type == 'video' ? this.checkSize(settings.videosWidth) : this.checkSize(settings.width);
                var defaultHeight = this.checkSize(settings.height);
                data.width = has(data, 'width') && data.width !== '' ? this.checkSize(data.width) : defaultWith;
                data.height = has(data, 'height') && data.height !== '' ? this.checkSize(data.height) : defaultHeight;

                if (element && data.type == 'image') {
                    data._hasCustomWidth = element.dataset.width ? true : false;
                    data._hasCustomHeight = element.dataset.height ? true : false;
                }

                return data;
            }
        }, {
            key: "checkSize",
            value: function checkSize(size) {
                return isNumber(size) ? "".concat(size, "px") : size;
            }
        }, {
            key: "sanitizeValue",
            value: function sanitizeValue(val) {
                if (val !== 'true' && val !== 'false') {
                    return val;
                }

                return val === 'true';
            }
        }]);

        return SlideConfigParser;
    }();

    var Slide = function () {
        function Slide(el, instance, index) {
            _classCallCheck(this, Slide);

            this.element = el;
            this.instance = instance;
            this.index = index;
        }

        _createClass(Slide, [{
            key: "setContent",
            value: function setContent() {
                var _this = this;

                var slide = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
                var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

                if (hasClass(slide, 'loaded')) {
                    return false;
                }

                var settings = this.instance.settings;
                var slideConfig = this.slideConfig;
                var isMobileDevice = isMobile();

                if (isFunction(settings.beforeSlideLoad)) {
                    settings.beforeSlideLoad({
                        index: this.index,
                        slide: slide,
                        player: false
                    });
                }

                var type = slideConfig.type;
                var position = slideConfig.descPosition;
                var slideMedia = slide.querySelector('.gslide-media');
                var slideTitle = slide.querySelector('.gslide-title');
                var slideText = slide.querySelector('.gslide-desc');
                var slideDesc = slide.querySelector('.gdesc-inner');
                var finalCallback = callback;
                var titleID = 'gSlideTitle_' + this.index;
                var textID = 'gSlideDesc_' + this.index;

                if (isFunction(settings.afterSlideLoad)) {
                    finalCallback = function finalCallback() {
                        if (isFunction(callback)) {
                            callback();
                        }

                        settings.afterSlideLoad({
                            index: _this.index,
                            slide: slide,
                            player: _this.instance.getSlidePlayerInstance(_this.index)
                        });
                    };
                }

                if (slideConfig.title == '' && slideConfig.description == '') {
                    if (slideDesc) {
                        slideDesc.parentNode.parentNode.removeChild(slideDesc.parentNode);
                    }
                } else {
                    if (slideTitle && slideConfig.title !== '') {
                        slideTitle.id = titleID;
                        slideTitle.innerHTML = slideConfig.title;
                    } else {
                        slideTitle.parentNode.removeChild(slideTitle);
                    }

                    if (slideText && slideConfig.description !== '') {
                        slideText.id = textID;

                        if (isMobileDevice && settings.moreLength > 0) {
                            slideConfig.smallDescription = this.slideShortDesc(slideConfig.description, settings.moreLength, settings.moreText);
                            slideText.innerHTML = slideConfig.smallDescription;
                            this.descriptionEvents(slideText, slideConfig);
                        } else {
                            slideText.innerHTML = slideConfig.description;
                        }
                    } else {
                        slideText.parentNode.removeChild(slideText);
                    }

                    addClass(slideMedia.parentNode, "desc-".concat(position));
                    addClass(slideDesc.parentNode, "description-".concat(position));
                }

                addClass(slideMedia, "gslide-".concat(type));
                addClass(slide, 'loaded');

                if (type === 'video') {
                    slideVideo.apply(this.instance, [slide, slideConfig, this.index, finalCallback]);
                    return;
                }

                if (type === 'external') {
                    slideIframe.apply(this, [slide, slideConfig, this.index, finalCallback]);
                    return;
                }

                if (type === 'inline') {
                    slideInline.apply(this.instance, [slide, slideConfig, this.index, finalCallback]);

                    if (slideConfig.draggable) {
                        new DragSlides({
                            dragEl: slide.querySelector('.gslide-inline'),
                            toleranceX: settings.dragToleranceX,
                            toleranceY: settings.dragToleranceY,
                            slide: slide,
                            instance: this.instance
                        });
                    }

                    return;
                }

                if (type === 'image') {
                    slideImage(slide, slideConfig, this.index, function () {
                        var img = slide.querySelector('img');

                        if (slideConfig.draggable) {
                            new DragSlides({
                                dragEl: img,
                                toleranceX: settings.dragToleranceX,
                                toleranceY: settings.dragToleranceY,
                                slide: slide,
                                instance: _this.instance
                            });
                        }

                        if (slideConfig.zoomable && img.naturalWidth > img.offsetWidth) {
                            addClass(img, 'zoomable');
                            new ZoomImages(img, slide, function () {
                                _this.instance.resize();
                            });
                        }

                        if (isFunction(finalCallback)) {
                            finalCallback();
                        }
                    });
                    return;
                }

                if (isFunction(finalCallback)) {
                    finalCallback();
                }
            }
        }, {
            key: "slideShortDesc",
            value: function slideShortDesc(string) {
                var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
                var wordBoundary = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
                var div = document.createElement('div');
                div.innerHTML = string;
                var cleanedString = div.innerText;
                var useWordBoundary = wordBoundary;
                string = cleanedString.trim();

                if (string.length <= n) {
                    return string;
                }

                var subString = string.substr(0, n - 1);

                if (!useWordBoundary) {
                    return subString;
                }

                div = null;
                return subString + '... <a href="#" class="desc-more">' + wordBoundary + '</a>';
            }
        }, {
            key: "descriptionEvents",
            value: function descriptionEvents(desc, data) {
                var _this2 = this;

                var moreLink = desc.querySelector('.desc-more');

                if (!moreLink) {
                    return false;
                }

                addEvent('click', {
                    onElement: moreLink,
                    withCallback: function withCallback(event, target) {
                        event.preventDefault();
                        var body = document.body;
                        var desc = closest(target, '.gslide-desc');

                        if (!desc) {
                            return false;
                        }

                        desc.innerHTML = data.description;
                        addClass(body, 'gdesc-open');
                        var shortEvent = addEvent('click', {
                            onElement: [body, closest(desc, '.gslide-description')],
                            withCallback: function withCallback(event, target) {
                                if (event.target.nodeName.toLowerCase() !== 'a') {
                                    removeClass(body, 'gdesc-open');
                                    addClass(body, 'gdesc-closed');
                                    desc.innerHTML = data.smallDescription;

                                    _this2.descriptionEvents(desc, data);

                                    setTimeout(function () {
                                        removeClass(body, 'gdesc-closed');
                                    }, 400);
                                    shortEvent.destroy();
                                }
                            }
                        });
                    }
                });
            }
        }, {
            key: "create",
            value: function create() {
                return createHTML(this.instance.settings.slideHTML);
            }
        }, {
            key: "getConfig",
            value: function getConfig() {
                if (!isNode(this.element) && !this.element.hasOwnProperty('draggable')) {
                    this.element.draggable = this.instance.settings.draggable;
                }

                var parser = new SlideConfigParser(this.instance.settings.slideExtraAttributes);
                this.slideConfig = parser.parseConfig(this.element, this.instance.settings);
                return this.slideConfig;
            }
        }]);

        return Slide;
    }();

    var _version = '3.1.0';

    var isMobile$1 = isMobile();

    var isTouch$1 = isTouch();

    var html = document.getElementsByTagName('html')[0];
    var defaults = {
        selector: '.glightbox',
        elements: null,
        skin: 'clean',
        theme: 'clean',
        closeButton: true,
        startAt: null,
        autoplayVideos: true,
        autofocusVideos: true,
        descPosition: 'bottom',
        width: '900px',
        height: '506px',
        videosWidth: '960px',
        beforeSlideChange: null,
        afterSlideChange: null,
        beforeSlideLoad: null,
        afterSlideLoad: null,
        slideInserted: null,
        slideRemoved: null,
        slideExtraAttributes: null,
        onOpen: null,
        onClose: null,
        loop: false,
        zoomable: true,
        draggable: true,
        dragAutoSnap: false,
        dragToleranceX: 40,
        dragToleranceY: 65,
        preload: true,
        oneSlidePerOpen: false,
        touchNavigation: true,
        touchFollowAxis: true,
        keyboardNavigation: true,
        closeOnOutsideClick: true,
        plugins: false,
        plyr: {
            css: 'https://cdn.plyr.io/3.6.12/plyr.css',
            js: 'https://cdn.plyr.io/3.6.12/plyr.js',
            config: {
                ratio: '16:9',
                fullscreen: {
                    enabled: true,
                    iosNative: true
                },
                youtube: {
                    noCookie: true,
                    rel: 0,
                    showinfo: 0,
                    iv_load_policy: 3
                },
                vimeo: {
                    byline: false,
                    portrait: false,
                    title: false,
                    transparent: false
                }
            }
        },
        openEffect: 'zoom',
        closeEffect: 'zoom',
        slideEffect: 'slide',
        moreText: 'See more',
        moreLength: 60,
        cssEfects: {
            fade: {
                "in": 'fadeIn',
                out: 'fadeOut'
            },
            zoom: {
                "in": 'zoomIn',
                out: 'zoomOut'
            },
            slide: {
                "in": 'slideInRight',
                out: 'slideOutLeft'
            },
            slideBack: {
                "in": 'slideInLeft',
                out: 'slideOutRight'
            },
            none: {
                "in": 'none',
                out: 'none'
            }
        },
        svg: {
            close: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve"><g><g><path d="M505.943,6.058c-8.077-8.077-21.172-8.077-29.249,0L6.058,476.693c-8.077,8.077-8.077,21.172,0,29.249C10.096,509.982,15.39,512,20.683,512c5.293,0,10.586-2.019,14.625-6.059L505.943,35.306C514.019,27.23,514.019,14.135,505.943,6.058z"/></g></g><g><g><path d="M505.942,476.694L35.306,6.059c-8.076-8.077-21.172-8.077-29.248,0c-8.077,8.076-8.077,21.171,0,29.248l470.636,470.636c4.038,4.039,9.332,6.058,14.625,6.058c5.293,0,10.587-2.019,14.624-6.057C514.018,497.866,514.018,484.771,505.942,476.694z"/></g></g></svg>',
            next: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"> <g><path d="M360.731,229.075l-225.1-225.1c-5.3-5.3-13.8-5.3-19.1,0s-5.3,13.8,0,19.1l215.5,215.5l-215.5,215.5c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-4l225.1-225.1C365.931,242.875,365.931,234.275,360.731,229.075z"/></g></svg>',
            prev: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"><g><path d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"/></g></svg>'
        }
    };
    defaults.slideHTML = "<div class=\"gslide\">\n    <div class=\"gslide-inner-content\">\n        <div class=\"ginner-container\">\n            <div class=\"gslide-media\">\n            </div>\n            <div class=\"gslide-description\">\n                <div class=\"gdesc-inner\">\n                    <h4 class=\"gslide-title\"></h4>\n                    <div class=\"gslide-desc\"></div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>";
    defaults.lightboxHTML = "<div id=\"glightbox-body\" class=\"glightbox-container\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"false\">\n    <div class=\"gloader visible\"></div>\n    <div class=\"goverlay\"></div>\n    <div class=\"gcontainer\">\n    <div id=\"glightbox-slider\" class=\"gslider\"></div>\n    <button class=\"gclose gbtn\" aria-label=\"Close\" data-taborder=\"3\">{closeSVG}</button>\n    <button class=\"gprev gbtn\" aria-label=\"Previous\" data-taborder=\"2\">{prevSVG}</button>\n    <button class=\"gnext gbtn\" aria-label=\"Next\" data-taborder=\"1\">{nextSVG}</button>\n</div>\n</div>";

    var GlightboxInit = function () {
        function GlightboxInit() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, GlightboxInit);

            this.customOptions = options;
            this.settings = extend(defaults, options);
            this.effectsClasses = this.getAnimationClasses();
            this.videoPlayers = {};
            this.apiEvents = [];
            this.fullElementsList = false;
        }

        _createClass(GlightboxInit, [{
            key: "init",
            value: function init() {
                var _this = this;

                var selector = this.getSelector();

                if (selector) {
                    this.baseEvents = addEvent('click', {
                        onElement: selector,
                        withCallback: function withCallback(e, target) {
                            e.preventDefault();

                            _this.open(target);
                        }
                    });
                }

                this.elements = this.getElements();
            }
        }, {
            key: "open",
            value: function open() {
                var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
                var startAt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

                if (this.elements.length === 0) {
                    return false;
                }

                this.activeSlide = null;
                this.prevActiveSlideIndex = null;
                this.prevActiveSlide = null;
                var index = isNumber(startAt) ? startAt : this.settings.startAt;

                if (isNode(element)) {
                    var gallery = element.getAttribute('data-gallery');

                    if (gallery) {
                        this.fullElementsList = this.elements;
                        this.elements = this.getGalleryElements(this.elements, gallery);
                    }

                    if (isNil(index)) {
                        index = this.getElementIndex(element);

                        if (index < 0) {
                            index = 0;
                        }
                    }
                }

                if (!isNumber(index)) {
                    index = 0;
                }

                this.build();

                animateElement(this.overlay, this.settings.openEffect === 'none' ? 'none' : this.settings.cssEfects.fade["in"]);

                var body = document.body;
                var scrollBar = window.innerWidth - document.documentElement.clientWidth;

                if (scrollBar > 0) {
                    var styleSheet = document.createElement('style');
                    styleSheet.type = 'text/css';
                    styleSheet.className = 'gcss-styles';
                    styleSheet.innerText = ".gscrollbar-fixer {margin-right: ".concat(scrollBar, "px}");
                    document.head.appendChild(styleSheet);

                    addClass(body, 'gscrollbar-fixer');
                }

                addClass(body, 'glightbox-open');

                addClass(html, 'glightbox-open');

                if (isMobile$1) {
                    addClass(document.body, 'glightbox-mobile');

                    this.settings.slideEffect = 'slide';
                }

                this.showSlide(index, true);

                if (this.elements.length === 1) {
                    addClass(this.prevButton, 'glightbox-button-hidden');

                    addClass(this.nextButton, 'glightbox-button-hidden');
                } else {
                    removeClass(this.prevButton, 'glightbox-button-hidden');

                    removeClass(this.nextButton, 'glightbox-button-hidden');
                }

                this.lightboxOpen = true;
                this.trigger('open');

                if (isFunction(this.settings.onOpen)) {
                    this.settings.onOpen();
                }

                if (isTouch$1 && this.settings.touchNavigation) {
                    touchNavigation(this);
                }

                if (this.settings.keyboardNavigation) {
                    keyboardNavigation(this);
                }
            }
        }, {
            key: "openAt",
            value: function openAt() {
                var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                this.open(null, index);
            }
        }, {
            key: "showSlide",
            value: function showSlide() {
                var _this2 = this;

                var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                var first = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

                show(this.loader);

                this.index = parseInt(index);
                var current = this.slidesContainer.querySelector('.current');

                if (current) {
                    removeClass(current, 'current');
                }

                this.slideAnimateOut();
                var slideNode = this.slidesContainer.querySelectorAll('.gslide')[index];

                if (hasClass(slideNode, 'loaded')) {
                    this.slideAnimateIn(slideNode, first);

                    hide(this.loader);
                } else {
                    show(this.loader);

                    var slide = this.elements[index];
                    var slideData = {
                        index: this.index,
                        slide: slideNode,
                        slideNode: slideNode,
                        slideConfig: slide.slideConfig,
                        slideIndex: this.index,
                        trigger: slide.node,
                        player: null
                    };
                    this.trigger('slide_before_load', slideData);
                    slide.instance.setContent(slideNode, function () {
                        hide(_this2.loader);

                        _this2.resize();

                        _this2.slideAnimateIn(slideNode, first);

                        _this2.trigger('slide_after_load', slideData);
                    });
                }

                this.slideDescription = slideNode.querySelector('.gslide-description');
                this.slideDescriptionContained = this.slideDescription && hasClass(this.slideDescription.parentNode, 'gslide-media');

                if (this.settings.preload) {
                    this.preloadSlide(index + 1);
                    this.preloadSlide(index - 1);
                }

                this.updateNavigationClasses();
                this.activeSlide = slideNode;
            }
        }, {
            key: "preloadSlide",
            value: function preloadSlide(index) {
                var _this3 = this;

                if (index < 0 || index > this.elements.length - 1) {
                    return false;
                }

                if (isNil(this.elements[index])) {
                    return false;
                }

                var slideNode = this.slidesContainer.querySelectorAll('.gslide')[index];

                if (hasClass(slideNode, 'loaded')) {
                    return false;
                }

                var slide = this.elements[index];
                var type = slide.type;
                var slideData = {
                    index: index,
                    slide: slideNode,
                    slideNode: slideNode,
                    slideConfig: slide.slideConfig,
                    slideIndex: index,
                    trigger: slide.node,
                    player: null
                };
                this.trigger('slide_before_load', slideData);

                if (type === 'video' || type === 'external') {
                    setTimeout(function () {
                        slide.instance.setContent(slideNode, function () {
                            _this3.trigger('slide_after_load', slideData);
                        });
                    }, 200);
                } else {
                    slide.instance.setContent(slideNode, function () {
                        _this3.trigger('slide_after_load', slideData);
                    });
                }
            }
        }, {
            key: "prevSlide",
            value: function prevSlide() {
                this.goToSlide(this.index - 1);
            }
        }, {
            key: "nextSlide",
            value: function nextSlide() {
                this.goToSlide(this.index + 1);
            }
        }, {
            key: "goToSlide",
            value: function goToSlide() {
                var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
                this.prevActiveSlide = this.activeSlide;
                this.prevActiveSlideIndex = this.index;

                if (!this.loop() && (index < 0 || index > this.elements.length - 1)) {
                    return false;
                }

                if (index < 0) {
                    index = this.elements.length - 1;
                } else if (index >= this.elements.length) {
                    index = 0;
                }

                this.showSlide(index);
            }
        }, {
            key: "insertSlide",
            value: function insertSlide() {
                var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

                if (index < 0) {
                    index = this.elements.length;
                }

                var slide = new Slide(config, this, index);
                var data = slide.getConfig();

                var slideInfo = extend({}, data);

                var newSlide = slide.create();
                var totalSlides = this.elements.length - 1;
                slideInfo.index = index;
                slideInfo.node = false;
                slideInfo.instance = slide;
                slideInfo.slideConfig = data;
                this.elements.splice(index, 0, slideInfo);
                var addedSlideNode = null;
                var addedSlidePlayer = null;

                if (this.slidesContainer) {
                    if (index > totalSlides) {
                        this.slidesContainer.appendChild(newSlide);
                    } else {
                        var existingSlide = this.slidesContainer.querySelectorAll('.gslide')[index];
                        this.slidesContainer.insertBefore(newSlide, existingSlide);
                    }

                    if (this.settings.preload && this.index == 0 && index == 0 || this.index - 1 == index || this.index + 1 == index) {
                        this.preloadSlide(index);
                    }

                    if (this.index === 0 && index === 0) {
                        this.index = 1;
                    }

                    this.updateNavigationClasses();
                    addedSlideNode = this.slidesContainer.querySelectorAll('.gslide')[index];
                    addedSlidePlayer = this.getSlidePlayerInstance(index);
                    slideInfo.slideNode = addedSlideNode;
                }

                this.trigger('slide_inserted', {
                    index: index,
                    slide: addedSlideNode,
                    slideNode: addedSlideNode,
                    slideConfig: data,
                    slideIndex: index,
                    trigger: null,
                    player: addedSlidePlayer
                });

                if (isFunction(this.settings.slideInserted)) {
                    this.settings.slideInserted({
                        index: index,
                        slide: addedSlideNode,
                        player: addedSlidePlayer
                    });
                }
            }
        }, {
            key: "removeSlide",
            value: function removeSlide() {
                var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;

                if (index < 0 || index > this.elements.length - 1) {
                    return false;
                }

                var slide = this.slidesContainer && this.slidesContainer.querySelectorAll('.gslide')[index];

                if (slide) {
                    if (this.getActiveSlideIndex() == index) {
                        if (index == this.elements.length - 1) {
                            this.prevSlide();
                        } else {
                            this.nextSlide();
                        }
                    }

                    slide.parentNode.removeChild(slide);
                }

                this.elements.splice(index, 1);
                this.trigger('slide_removed', index);

                if (isFunction(this.settings.slideRemoved)) {
                    this.settings.slideRemoved(index);
                }
            }
        }, {
            key: "slideAnimateIn",
            value: function slideAnimateIn(slide, first) {
                var _this4 = this;

                var slideMedia = slide.querySelector('.gslide-media');
                var slideDesc = slide.querySelector('.gslide-description');
                var prevData = {
                    index: this.prevActiveSlideIndex,
                    slide: this.prevActiveSlide,
                    slideNode: this.prevActiveSlide,
                    slideIndex: this.prevActiveSlide,
                    slideConfig: isNil(this.prevActiveSlideIndex) ? null : this.elements[this.prevActiveSlideIndex].slideConfig,
                    trigger: isNil(this.prevActiveSlideIndex) ? null : this.elements[this.prevActiveSlideIndex].node,
                    player: this.getSlidePlayerInstance(this.prevActiveSlideIndex)
                };
                var nextData = {
                    index: this.index,
                    slide: this.activeSlide,
                    slideNode: this.activeSlide,
                    slideConfig: this.elements[this.index].slideConfig,
                    slideIndex: this.index,
                    trigger: this.elements[this.index].node,
                    player: this.getSlidePlayerInstance(this.index)
                };

                if (slideMedia.offsetWidth > 0 && slideDesc) {
                    hide(slideDesc);

                    slideDesc.style.display = '';
                }

                removeClass(slide, this.effectsClasses);

                if (first) {
                    animateElement(slide, this.settings.cssEfects[this.settings.openEffect]["in"], function () {
                        if (_this4.settings.autoplayVideos) {
                            _this4.slidePlayerPlay(slide);
                        }

                        _this4.trigger('slide_changed', {
                            prev: prevData,
                            current: nextData
                        });

                        if (isFunction(_this4.settings.afterSlideChange)) {
                            _this4.settings.afterSlideChange.apply(_this4, [prevData, nextData]);
                        }
                    });
                } else {
                    var effectName = this.settings.slideEffect;
                    var animIn = effectName !== 'none' ? this.settings.cssEfects[effectName]["in"] : effectName;

                    if (this.prevActiveSlideIndex > this.index) {
                        if (this.settings.slideEffect == 'slide') {
                            animIn = this.settings.cssEfects.slideBack["in"];
                        }
                    }

                    animateElement(slide, animIn, function () {
                        if (_this4.settings.autoplayVideos) {
                            _this4.slidePlayerPlay(slide);
                        }

                        _this4.trigger('slide_changed', {
                            prev: prevData,
                            current: nextData
                        });

                        if (isFunction(_this4.settings.afterSlideChange)) {
                            _this4.settings.afterSlideChange.apply(_this4, [prevData, nextData]);
                        }
                    });
                }

                setTimeout(function () {
                    _this4.resize(slide);
                }, 100);

                addClass(slide, 'current');
            }
        }, {
            key: "slideAnimateOut",
            value: function slideAnimateOut() {
                if (!this.prevActiveSlide) {
                    return false;
                }

                var prevSlide = this.prevActiveSlide;

                removeClass(prevSlide, this.effectsClasses);

                addClass(prevSlide, 'prev');

                var animation = this.settings.slideEffect;
                var animOut = animation !== 'none' ? this.settings.cssEfects[animation].out : animation;
                this.slidePlayerPause(prevSlide);
                this.trigger('slide_before_change', {
                    prev: {
                        index: this.prevActiveSlideIndex,
                        slide: this.prevActiveSlide,
                        slideNode: this.prevActiveSlide,
                        slideIndex: this.prevActiveSlideIndex,
                        slideConfig: isNil(this.prevActiveSlideIndex) ? null : this.elements[this.prevActiveSlideIndex].slideConfig,
                        trigger: isNil(this.prevActiveSlideIndex) ? null : this.elements[this.prevActiveSlideIndex].node,
                        player: this.getSlidePlayerInstance(this.prevActiveSlideIndex)
                    },
                    current: {
                        index: this.index,
                        slide: this.activeSlide,
                        slideNode: this.activeSlide,
                        slideIndex: this.index,
                        slideConfig: this.elements[this.index].slideConfig,
                        trigger: this.elements[this.index].node,
                        player: this.getSlidePlayerInstance(this.index)
                    }
                });

                if (isFunction(this.settings.beforeSlideChange)) {
                    this.settings.beforeSlideChange.apply(this, [{
                        index: this.prevActiveSlideIndex,
                        slide: this.prevActiveSlide,
                        player: this.getSlidePlayerInstance(this.prevActiveSlideIndex)
                    }, {
                        index: this.index,
                        slide: this.activeSlide,
                        player: this.getSlidePlayerInstance(this.index)
                    }]);
                }

                if (this.prevActiveSlideIndex > this.index && this.settings.slideEffect == 'slide') {
                    animOut = this.settings.cssEfects.slideBack.out;
                }

                animateElement(prevSlide, animOut, function () {
                    var container = prevSlide.querySelector('.ginner-container');
                    var media = prevSlide.querySelector('.gslide-media');
                    var desc = prevSlide.querySelector('.gslide-description');
                    container.style.transform = '';
                    media.style.transform = '';

                    removeClass(media, 'greset');

                    media.style.opacity = '';

                    if (desc) {
                        desc.style.opacity = '';
                    }

                    removeClass(prevSlide, 'prev');
                });
            }
        }, {
            key: "getAllPlayers",
            value: function getAllPlayers() {
                return this.videoPlayers;
            }
        }, {
            key: "getSlidePlayerInstance",
            value: function getSlidePlayerInstance(index) {
                var id = 'gvideo' + index;
                var videoPlayers = this.getAllPlayers();

                if (has(videoPlayers, id) && videoPlayers[id]) {
                    return videoPlayers[id];
                }

                return false;
            }
        }, {
            key: "stopSlideVideo",
            value: function stopSlideVideo(slide) {
                if (isNode(slide)) {
                    var node = slide.querySelector('.gvideo-wrapper');

                    if (node) {
                        slide = node.getAttribute('data-index');
                    }
                }

                console.log('stopSlideVideo is deprecated, use slidePlayerPause');
                var player = this.getSlidePlayerInstance(slide);

                if (player && player.playing) {
                    player.pause();
                }
            }
        }, {
            key: "slidePlayerPause",
            value: function slidePlayerPause(slide) {
                if (isNode(slide)) {
                    var node = slide.querySelector('.gvideo-wrapper');

                    if (node) {
                        slide = node.getAttribute('data-index');
                    }
                }

                var player = this.getSlidePlayerInstance(slide);

                if (player && player.playing) {
                    player.pause();
                }
            }
        }, {
            key: "playSlideVideo",
            value: function playSlideVideo(slide) {
                if (isNode(slide)) {
                    var node = slide.querySelector('.gvideo-wrapper');

                    if (node) {
                        slide = node.getAttribute('data-index');
                    }
                }

                console.log('playSlideVideo is deprecated, use slidePlayerPlay');
                var player = this.getSlidePlayerInstance(slide);

                if (player && !player.playing) {
                    player.play();
                }
            }
        }, {
            key: "slidePlayerPlay",
            value: function slidePlayerPlay(slide) {
                var _this$settings$plyr$c;

                if (isMobile$1 && !((_this$settings$plyr$c = this.settings.plyr.config) !== null && _this$settings$plyr$c !== void 0 && _this$settings$plyr$c.muted)) {
                    return;
                }

                if (isNode(slide)) {
                    var node = slide.querySelector('.gvideo-wrapper');

                    if (node) {
                        slide = node.getAttribute('data-index');
                    }
                }

                var player = this.getSlidePlayerInstance(slide);

                if (player && !player.playing) {
                    player.play();

                    if (this.settings.autofocusVideos) {
                        player.elements.container.focus();
                    }
                }
            }
        }, {
            key: "setElements",
            value: function setElements(elements) {
                var _this5 = this;

                this.settings.elements = false;
                var newElements = [];

                if (elements && elements.length) {
                    each(elements, function (el, i) {
                        var slide = new Slide(el, _this5, i);
                        var data = slide.getConfig();

                        var slideInfo = extend({}, data);

                        slideInfo.slideConfig = data;
                        slideInfo.instance = slide;
                        slideInfo.index = i;
                        newElements.push(slideInfo);
                    });
                }

                this.elements = newElements;

                if (this.lightboxOpen) {
                    this.slidesContainer.innerHTML = '';

                    if (this.elements.length) {
                        each(this.elements, function () {
                            var slide = createHTML(_this5.settings.slideHTML);

                            _this5.slidesContainer.appendChild(slide);
                        });

                        this.showSlide(0, true);
                    }
                }
            }
        }, {
            key: "getElementIndex",
            value: function getElementIndex(node) {
                var index = false;

                each(this.elements, function (el, i) {
                    if (has(el, 'node') && el.node == node) {
                        index = i;
                        return true;
                    }
                });

                return index;
            }
        }, {
            key: "getElements",
            value: function getElements() {
                var _this6 = this;

                var list = [];
                this.elements = this.elements ? this.elements : [];

                if (!isNil(this.settings.elements) && isArray(this.settings.elements) && this.settings.elements.length) {
                    each(this.settings.elements, function (el, i) {
                        var slide = new Slide(el, _this6, i);
                        var elData = slide.getConfig();

                        var slideInfo = extend({}, elData);

                        slideInfo.node = false;
                        slideInfo.index = i;
                        slideInfo.instance = slide;
                        slideInfo.slideConfig = elData;
                        list.push(slideInfo);
                    });
                }

                var nodes = false;
                var selector = this.getSelector();

                if (selector) {
                    nodes = document.querySelectorAll(this.getSelector());
                }

                if (!nodes) {
                    return list;
                }

                each(nodes, function (el, i) {
                    var slide = new Slide(el, _this6, i);
                    var elData = slide.getConfig();

                    var slideInfo = extend({}, elData);

                    slideInfo.node = el;
                    slideInfo.index = i;
                    slideInfo.instance = slide;
                    slideInfo.slideConfig = elData;
                    slideInfo.gallery = el.getAttribute('data-gallery');
                    list.push(slideInfo);
                });

                return list;
            }
        }, {
            key: "getGalleryElements",
            value: function getGalleryElements(list, gallery) {
                return list.filter(function (el) {
                    return el.gallery == gallery;
                });
            }
        }, {
            key: "getSelector",
            value: function getSelector() {
                if (this.settings.elements) {
                    return false;
                }

                if (this.settings.selector && this.settings.selector.substring(0, 5) == 'data-') {
                    return "*[".concat(this.settings.selector, "]");
                }

                return this.settings.selector;
            }
        }, {
            key: "getActiveSlide",
            value: function getActiveSlide() {
                return this.slidesContainer.querySelectorAll('.gslide')[this.index];
            }
        }, {
            key: "getActiveSlideIndex",
            value: function getActiveSlideIndex() {
                return this.index;
            }
        }, {
            key: "getAnimationClasses",
            value: function getAnimationClasses() {
                var effects = [];

                for (var key in this.settings.cssEfects) {
                    if (this.settings.cssEfects.hasOwnProperty(key)) {
                        var effect = this.settings.cssEfects[key];
                        effects.push("g".concat(effect["in"]));
                        effects.push("g".concat(effect.out));
                    }
                }

                return effects.join(' ');
            }
        }, {
            key: "build",
            value: function build() {
                var _this7 = this;

                if (this.built) {
                    return false;
                }

                var children = document.body.childNodes;
                var bodyChildElms = [];

                each(children, function (el) {
                    if (el.parentNode == document.body && el.nodeName.charAt(0) !== '#' && el.hasAttribute && !el.hasAttribute('aria-hidden')) {
                        bodyChildElms.push(el);
                        el.setAttribute('aria-hidden', 'true');
                    }
                });

                var nextSVG = has(this.settings.svg, 'next') ? this.settings.svg.next : '';
                var prevSVG = has(this.settings.svg, 'prev') ? this.settings.svg.prev : '';
                var closeSVG = has(this.settings.svg, 'close') ? this.settings.svg.close : '';
                var lightboxHTML = this.settings.lightboxHTML;
                lightboxHTML = lightboxHTML.replace(/{nextSVG}/g, nextSVG);
                lightboxHTML = lightboxHTML.replace(/{prevSVG}/g, prevSVG);
                lightboxHTML = lightboxHTML.replace(/{closeSVG}/g, closeSVG);
                lightboxHTML = createHTML(lightboxHTML);
                document.body.appendChild(lightboxHTML);
                var modal = document.getElementById('glightbox-body');
                this.modal = modal;
                var closeButton = modal.querySelector('.gclose');
                this.prevButton = modal.querySelector('.gprev');
                this.nextButton = modal.querySelector('.gnext');
                this.overlay = modal.querySelector('.goverlay');
                this.loader = modal.querySelector('.gloader');
                this.slidesContainer = document.getElementById('glightbox-slider');
                this.bodyHiddenChildElms = bodyChildElms;
                this.events = {};

                addClass(this.modal, 'glightbox-' + this.settings.skin);

                if (this.settings.closeButton && closeButton) {
                    this.events['close'] = addEvent('click', {
                        onElement: closeButton,
                        withCallback: function withCallback(e, target) {
                            e.preventDefault();

                            _this7.close();
                        }
                    });
                }

                if (closeButton && !this.settings.closeButton) {
                    closeButton.parentNode.removeChild(closeButton);
                }

                if (this.nextButton) {
                    this.events['next'] = addEvent('click', {
                        onElement: this.nextButton,
                        withCallback: function withCallback(e, target) {
                            e.preventDefault();

                            _this7.nextSlide();
                        }
                    });
                }

                if (this.prevButton) {
                    this.events['prev'] = addEvent('click', {
                        onElement: this.prevButton,
                        withCallback: function withCallback(e, target) {
                            e.preventDefault();

                            _this7.prevSlide();
                        }
                    });
                }

                if (this.settings.closeOnOutsideClick) {
                    this.events['outClose'] = addEvent('click', {
                        onElement: modal,
                        withCallback: function withCallback(e, target) {
                            if (!_this7.preventOutsideClick && !hasClass(document.body, 'glightbox-mobile') && !closest(e.target, '.ginner-container')) {
                                if (!closest(e.target, '.gbtn') && !hasClass(e.target, 'gnext') && !hasClass(e.target, 'gprev')) {
                                    _this7.close();
                                }
                            }
                        }
                    });
                }

                each(this.elements, function (slide, i) {
                    _this7.slidesContainer.appendChild(slide.instance.create());

                    slide.slideNode = _this7.slidesContainer.querySelectorAll('.gslide')[i];
                });

                if (isTouch$1) {
                    addClass(document.body, 'glightbox-touch');
                }

                this.events['resize'] = addEvent('resize', {
                    onElement: window,
                    withCallback: function withCallback() {
                        _this7.resize();
                    }
                });
                this.built = true;
            }
        }, {
            key: "resize",
            value: function resize() {
                var slide = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
                slide = !slide ? this.activeSlide : slide;

                if (!slide || hasClass(slide, 'zoomed')) {
                    return;
                }

                var winSize = windowSize();

                var video = slide.querySelector('.gvideo-wrapper');
                var image = slide.querySelector('.gslide-image');
                var description = this.slideDescription;
                var winWidth = winSize.width;
                var winHeight = winSize.height;

                if (winWidth <= 768) {
                    addClass(document.body, 'glightbox-mobile');
                } else {
                    removeClass(document.body, 'glightbox-mobile');
                }

                if (!video && !image) {
                    return;
                }

                var descriptionResize = false;

                if (description && (hasClass(description, 'description-bottom') || hasClass(description, 'description-top')) && !hasClass(description, 'gabsolute')) {
                    descriptionResize = true;
                }

                if (image) {
                    if (winWidth <= 768) {
                        var imgNode = image.querySelector('img');
                    } else if (descriptionResize) {
                        var descHeight = description.offsetHeight;

                        var _imgNode = image.querySelector('img');

                        _imgNode.setAttribute('style', "max-height: calc(100vh - ".concat(descHeight, "px)"));

                        description.setAttribute('style', "max-width: ".concat(_imgNode.offsetWidth, "px;"));
                    }
                }

                if (video) {
                    var ratio = has(this.settings.plyr.config, 'ratio') ? this.settings.plyr.config.ratio : '';

                    if (!ratio) {
                        var containerWidth = video.clientWidth;
                        var containerHeight = video.clientHeight;
                        var divisor = containerWidth / containerHeight;
                        ratio = "".concat(containerWidth / divisor, ":").concat(containerHeight / divisor);
                    }

                    var videoRatio = ratio.split(':');
                    var videoWidth = this.settings.videosWidth;
                    var maxWidth = this.settings.videosWidth;

                    if (isNumber(videoWidth) || videoWidth.indexOf('px') !== -1) {
                        maxWidth = parseInt(videoWidth);
                    } else {
                        if (videoWidth.indexOf('vw') !== -1) {
                            maxWidth = winWidth * parseInt(videoWidth) / 100;
                        } else if (videoWidth.indexOf('vh') !== -1) {
                            maxWidth = winHeight * parseInt(videoWidth) / 100;
                        } else if (videoWidth.indexOf('%') !== -1) {
                            maxWidth = winWidth * parseInt(videoWidth) / 100;
                        } else {
                            maxWidth = parseInt(video.clientWidth);
                        }
                    }

                    var maxHeight = maxWidth / (parseInt(videoRatio[0]) / parseInt(videoRatio[1]));
                    maxHeight = Math.floor(maxHeight);

                    if (descriptionResize) {
                        winHeight = winHeight - description.offsetHeight;
                    }

                    if (maxWidth > winWidth || maxHeight > winHeight || winHeight < maxHeight && winWidth > maxWidth) {
                        var vwidth = video.offsetWidth;
                        var vheight = video.offsetHeight;

                        var _ratio = winHeight / vheight;

                        var vsize = {
                            width: vwidth * _ratio,
                            height: vheight * _ratio
                        };
                        video.parentNode.setAttribute('style', "max-width: ".concat(vsize.width, "px"));

                        if (descriptionResize) {
                            description.setAttribute('style', "max-width: ".concat(vsize.width, "px;"));
                        }
                    } else {
                        video.parentNode.style.maxWidth = "".concat(videoWidth);

                        if (descriptionResize) {
                            description.setAttribute('style', "max-width: ".concat(videoWidth, ";"));
                        }
                    }
                }
            }
        }, {
            key: "reload",
            value: function reload() {
                this.init();
            }
        }, {
            key: "updateNavigationClasses",
            value: function updateNavigationClasses() {
                var loop = this.loop();

                removeClass(this.nextButton, 'disabled');

                removeClass(this.prevButton, 'disabled');

                if (this.index == 0 && this.elements.length - 1 == 0) {
                    addClass(this.prevButton, 'disabled');

                    addClass(this.nextButton, 'disabled');
                } else if (this.index === 0 && !loop) {
                    addClass(this.prevButton, 'disabled');
                } else if (this.index === this.elements.length - 1 && !loop) {
                    addClass(this.nextButton, 'disabled');
                }
            }
        }, {
            key: "loop",
            value: function loop() {
                var loop = has(this.settings, 'loopAtEnd') ? this.settings.loopAtEnd : null;
                loop = has(this.settings, 'loop') ? this.settings.loop : loop;
                return loop;
            }
        }, {
            key: "close",
            value: function close() {
                var _this8 = this;

                if (!this.lightboxOpen) {
                    if (this.events) {
                        for (var key in this.events) {
                            if (this.events.hasOwnProperty(key)) {
                                this.events[key].destroy();
                            }
                        }

                        this.events = null;
                    }

                    return false;
                }

                if (this.closing) {
                    return false;
                }

                this.closing = true;
                this.slidePlayerPause(this.activeSlide);

                if (this.fullElementsList) {
                    this.elements = this.fullElementsList;
                }

                if (this.bodyHiddenChildElms.length) {
                    each(this.bodyHiddenChildElms, function (el) {
                        el.removeAttribute('aria-hidden');
                    });
                }

                addClass(this.modal, 'glightbox-closing');

                animateElement(this.overlay, this.settings.openEffect == 'none' ? 'none' : this.settings.cssEfects.fade.out);

                animateElement(this.activeSlide, this.settings.cssEfects[this.settings.closeEffect].out, function () {
                    _this8.activeSlide = null;
                    _this8.prevActiveSlideIndex = null;
                    _this8.prevActiveSlide = null;
                    _this8.built = false;

                    if (_this8.events) {
                        for (var _key in _this8.events) {
                            if (_this8.events.hasOwnProperty(_key)) {
                                _this8.events[_key].destroy();
                            }
                        }

                        _this8.events = null;
                    }

                    var body = document.body;

                    removeClass(html, 'glightbox-open');

                    removeClass(body, 'glightbox-open touching gdesc-open glightbox-touch glightbox-mobile gscrollbar-fixer');

                    _this8.modal.parentNode.removeChild(_this8.modal);

                    _this8.trigger('close');

                    if (isFunction(_this8.settings.onClose)) {
                        _this8.settings.onClose();
                    }

                    var styles = document.querySelector('.gcss-styles');

                    if (styles) {
                        styles.parentNode.removeChild(styles);
                    }

                    _this8.lightboxOpen = false;
                    _this8.closing = null;
                });
            }
        }, {
            key: "destroy",
            value: function destroy() {
                this.close();
                this.clearAllEvents();

                if (this.baseEvents) {
                    this.baseEvents.destroy();
                }
            }
        }, {
            key: "on",
            value: function on(evt, callback) {
                var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

                if (!evt || !isFunction(callback)) {
                    throw new TypeError('Event name and callback must be defined');
                }

                this.apiEvents.push({
                    evt: evt,
                    once: once,
                    callback: callback
                });
            }
        }, {
            key: "once",
            value: function once(evt, callback) {
                this.on(evt, callback, true);
            }
        }, {
            key: "trigger",
            value: function trigger(eventName) {
                var _this9 = this;

                var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
                var onceTriggered = [];

                each(this.apiEvents, function (event, i) {
                    var evt = event.evt,
                        once = event.once,
                        callback = event.callback;

                    if (evt == eventName) {
                        callback(data);

                        if (once) {
                            onceTriggered.push(i);
                        }
                    }
                });

                if (onceTriggered.length) {
                    each(onceTriggered, function (i) {
                        return _this9.apiEvents.splice(i, 1);
                    });
                }
            }
        }, {
            key: "clearAllEvents",
            value: function clearAllEvents() {
                this.apiEvents.splice(0, this.apiEvents.length);
            }
        }, {
            key: "version",
            value: function version() {
                return _version;
            }
        }]);

        return GlightboxInit;
    }();

    function glightbox () {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var instance = new GlightboxInit(options);
        instance.init();
        return instance;
    }

    return glightbox;

})));
/*! For license information please see main.js.LICENSE.txt */
(()=>{var e={99418:(e,t,n)=>{var r={"./sendinblue-form.br.json":22622,"./sendinblue-form.de.json":76978,"./sendinblue-form.en.json":41432,"./sendinblue-form.es.json":95955,"./sendinblue-form.fr.json":33011,"./sendinblue-form.it.json":44762,"./sendinblue-form.pt.json":65911};function a(e){var t=s(e);return n(t)}function s(e){if(!n.o(r,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return r[e]}a.keys=function(){return Object.keys(r)},a.resolve=s,e.exports=a,a.id=99418},26981:(e,t,n)=>{"use strict";n(11983);var r,a=(r=n(40115))&&r.__esModule?r:{default:r};a.default._babelPolyfill&&"undefined"!=typeof console&&console.warn&&console.warn("@babel/polyfill is loaded more than once on this page. This is probably not desirable/intended and may have consequences if different versions of the polyfills are applied sequentially. If you do need to load the polyfill more than once, use @babel/polyfill/noConflict instead to bypass the warning."),a.default._babelPolyfill=!0},11983:(e,t,n)=>{"use strict";n(16266),n(10990),n(70911),n(14160),n(6197),n(96728),n(54039),n(93568),n(78051),n(38250),n(15434),n(54952),n(96337),n(35666)},81013:()=>{!function(e){function t(r){if(n[r])return n[r].exports;var a=n[r]={i:r,l:!1,exports:{}};return e[r].call(a.exports,a,a.exports,t),a.l=!0,a.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t){Array.from||(Array.from=function(){var e=Object.prototype.toString,t=function(t){return"function"==typeof t||"[object Function]"===e.call(t)},n=Math.pow(2,53)-1,r=function(e){var t=function(e){var t=Number(e);return isNaN(t)?0:0!==t&&isFinite(t)?(t>0?1:-1)*Math.floor(Math.abs(t)):t}(e);return Math.min(Math.max(t,0),n)};return function(e){var n=Object(e);if(null==e)throw new TypeError("Array.from requires an array-like object - not null or undefined");var a,s=arguments.length>1?arguments[1]:void 0;if(void 0!==s){if(!t(s))throw new TypeError("Array.from: when provided, the second argument must be a function");arguments.length>2&&(a=arguments[2])}for(var i,o=r(n.length),d=t(this)?Object(new this(o)):new Array(o),u=0;u<o;)i=n[u],d[u]=s?void 0===a?s(i,u):s.call(a,i,u):i,u+=1;return d.length=o,d}}())}])},28380:(e,t,n)=>{n(81013)},82700:(e,t,n)=>{"use strict";var r=n(20377),a=n(17020),s=n(41546);e.exports=function(e){var t=r(this),n=a(t.length);if(!s(e))throw new TypeError("Array#find: predicate must be a function");if(0!==n){var i;arguments.length>0&&(i=arguments[1]);for(var o,d=0;d<n;d++)if(o=t[d],e.apply(i,[o,d,t]))return o}}},90854:(e,t,n)=>{"use strict";var r=n(4289),a=n(21924),s=n(58974),i=n(82700),o=n(4656),d=n(84600),u=a("Array.prototype.slice"),_=o(),l=function(e,t){s(e);var n=u(arguments,1);return _.apply(e,n)};r(l,{getPolyfill:o,implementation:i,shim:d}),e.exports=l},4656:(e,t,n)=>{"use strict";e.exports=function(){return Array.prototype.find&&1!==[,1].find((function(){return!0}))?Array.prototype.find:n(82700)}},84600:(e,t,n)=>{"use strict";var r=n(4289),a=n(97272),s=n(4656);e.exports=function(){var e=s();return r(Array.prototype,{find:e},{find:function(){return Array.prototype.find!==e}}),a("find"),e}},23336:(e,t,n)=>{"use strict";var r=n(91387);Array.from(document.getElementsByClassName("sib-captcha")).forEach((e=>{const t=e.querySelector(".form__entry");e.querySelector(".g-recaptcha").addEventListener("captchaChange",(()=>(0,r.jG)(t)))}))},84759:(e,t,n)=>{"use strict";var r=n(91387);Array.from(document.getElementsByClassName("sib-checkbox-group")).forEach((e=>{const t=e.querySelector(".form__entry");e.errorMessage=window.REQUIRED_ERROR_MESSAGE,e.value=Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map((e=>e.value)),Array.from(t.getElementsByTagName("input")).forEach((n=>{n.addEventListener("change",(n=>{const a=n.target.getAttribute("data-value");n.target.checked?e.value=[...e.value,a]:e.value=e.value.filter((e=>e!==a)),(0,r.jG)(t)}))}))}))},20319:(e,t,n)=>{"use strict";n.d(t,{G:()=>I,P:()=>N});var r=n(84319),a=n.n(r),s=n(91387),i=n(86622);const o=/^[0-9]{5,15}$/,d=/^(([0][0-9]|[1-9])[*]+){5,15}/,u=/^(([0-9]*)|(([0-9]*)\.([0-9]*)))$/,_=window.LOCALE||"en",l=n(99418)(`./sendinblue-form.${_}.json`),{pickaday:{month:{january:c,february:m,march:h,april:f,may:y,june:p,july:M,august:L,september:Y,october:g,november:v,december:k},weekday:{sunday:w,monday:b,tuesday:D,wednesday:T,thursday:S,friday:j,saturday:x},weekdaysShort:{sun:H,mon:O,tue:E,wed:P,thur:A,fri:F,sat:W}}}=l;function N(e,t,n){if("date"===e.dataset.type){const r=new RegExp(e.getAttribute("pattern"));return e.value&&!r.exec(e.value)?((0,s.uH)(t,window.INVALID_DATE,n),!1):((0,s.jG)(t),!0)}return e.getAttribute("data-numeric")?e.value&&!u.exec(e.value)?((0,s.uH)(t,window.INVALID_NUMBER,n),!1):((0,s.jG)(t),!0):"email"===e.type?((0,s.jG)(t),!0):"tel"!==e.type||(!e.value||o.test(e.value)||d.test(e.value)?((0,s.jG)(t,n),!0):((0,s.uH)(t,window.SMS_INVALID_MESSAGE,n),!1))}const C=Array.from(document.getElementsByClassName("sib-input")),R=Array.from(document.getElementsByClassName("sib-sms-input"));C.forEach((e=>{e.errorMessage=window.REQUIRED_ERROR_MESSAGE;let t=null;const n=e.querySelector(".form__entry"),r=e.querySelector(".input");r.addEventListener("input",(e=>{(0,s.jG)(n)})),"date"===r.dataset.type&&new(a())({i18n:{previousMonth:"Previous Month",nextMonth:"Next Month",months:[c,m,h,f,y,p,M,L,Y,g,v,k],weekdays:[w,b,D,T,S,j,x],weekdaysShort:[H,O,E,P,A,F,W]},field:r,format:r.dataset.format.toUpperCase(),defaultDate:new Date,keyboardInput:!1,yearRange:[1900,2099],toString(e,t){const n=e=>e>=10?e:`0${e}`;return t.replace("DD",n(e.getDate())).replace("MM",n(e.getMonth()+1)).replace("YYYY",e.getFullYear())},onSelect:()=>{(0,s.jG)(n)}})}));const I=[];R.forEach((e=>{const{placeholder:t,required:n,countryCode:r,whatsappCountryCode:a,value:o,whatsappvalue:d,attributename:u}=e.dataset;e.errorMessage=window.SMS_EMPTY_MESSAGE,fetch("https://static.brevo.com/js/countries.json").then((e=>e.json())).then((s=>{I.push(new i.Z({elem:e,placeholder:t,required:n,name:u||"SMS",countryCode:"WHATSAPP"===u?a:r,value:"WHATSAPP"===u?d:o,countryCodes:s}))}));const _=e.closest(".form__entry");e.querySelector('input[type="tel"]').addEventListener("input",(()=>{(0,s.jG)(_),(0,s.jG)(_,!0)}))}))},38496:(e,t,n)=>{"use strict";n.d(t,{r:()=>d});var r=n(91387);const a=Array.from(document.getElementsByClassName("sib-multiselect")),s=window.translation?window.translation.common:{selectedList:"",selectedLists:""};function i(e){return(1===e?s.selectedList:s.selectedLists).replace("{quantity}",e)}const o=({select:e,menu:t,displayName:n,items:a})=>{e.internalValue=e.value,n.innerText=i(e.value.length),a.forEach((t=>{const n=t.querySelector("input"),r=n.getAttribute("data-value");e.value.includes(r)?n.checked=!0:n.checked=!1})),(0,r.Wj)(t)},d=()=>{a.forEach((e=>{const t=e.querySelector(".input"),n=e.querySelector("input"),r=e.querySelector(".sib-menu");Array.from(r.getElementsByClassName("sib-menu__item")),n.value="",e.value=[],t.innerText=i(0)}))};a.forEach((e=>{const t=e.querySelector(".input"),n=e.querySelector("input"),a=e.querySelector(".sib-menu"),s=e.querySelector(".form__entry"),d=e.querySelector(".sib-menu__apply-button"),u=e.querySelector(".sib-menu__cancel-button"),_=e.querySelector(".sib-menu__select-all-button"),l=e.querySelector(".sib-menu__clear-button"),c=Array.from(a.getElementsByClassName("sib-menu__item")),m=c.map((e=>e.querySelector('input[type="checkbox"]:checked'))).filter((e=>e)).map((e=>e.dataset.value));e.internalValue=m,e.value=m,e.errorMessage=window.REQUIRED_MULTISELECT_MESSAGE,t.addEventListener("click",(e=>{a.getAttribute("data-open")||(e.stopPropagation(),(0,r.qn)(t.parentElement,a))})),a.addEventListener("click",(e=>{e.stopPropagation()})),u.addEventListener("click",(({select:e,menu:t,displayName:n,items:r})=>()=>{o({select:e,menu:t,displayName:n,items:r})})({select:e,menu:a,displayName:t,items:c})),d.addEventListener("click",(({select:e,menu:t,formEntry:n,displayName:a,input:s})=>()=>{e.value=e.internalValue,a.innerText=i(e.value.length),s.value=JSON.stringify(e.value),(0,r.Wj)(t),(0,r.jG)(n)})({select:e,menu:a,formEntry:s,displayName:t,input:n})),_.addEventListener("click",(({select:e,items:t})=>()=>{e.internalValue=t.map((e=>{const t=e.querySelector("input");return t.checked=!0,t.getAttribute("data-value")}))})({select:e,items:c})),l.addEventListener("click",(({select:e,items:t})=>()=>{t.forEach((e=>{e.querySelector("input").checked=!1})),e.internalValue=[]})({items:c,select:e})),c.forEach(((t,n,r)=>{const a=t.querySelector("input");t.addEventListener("click",(({item:e,checkbox:t,select:n})=>()=>{const e=t.getAttribute("data-value");t.checked?(t.checked=!1,n.internalValue=n.internalValue.filter((t=>t!==e))):(t.checked=!0,n.internalValue=[...n.internalValue.filter((t=>t!==e)),e])})({item:t,checkbox:a,select:e}))})),document.addEventListener("click",(()=>{a.getAttribute("data-open")&&o({select:e,menu:a,displayName:t,items:c})}))}))},76762:(e,t,n)=>{"use strict";var r=n(91387);Array.from(document.getElementsByClassName("sib-optin")).forEach((e=>{e.errorMessage=window.REQUIRED_ERROR_MESSAGE;const t=e.querySelector(".form__entry"),n=Array.from(t.getElementsByTagName("input"))[0];n.checked&&(e.value=n.checked),n.addEventListener("change",(()=>{e.value=n.checked,(0,r.jG)(t)}))}))},62274:(e,t,n)=>{"use strict";var r=n(91387);Array.from(document.getElementsByClassName("sib-radiobutton-group")).forEach((e=>{const t=e.querySelector('input[type="radio"]:checked');e.value=t?t.value:"",e.errorMessage=window.REQUIRED_ERROR_MESSAGE;const n=e.querySelector(".form__entry"),a=Array.from(e.getElementsByTagName("input")),s=document.getElementById("sib-other-reason");a.forEach((t=>t.addEventListener("change",(a=>{"other"===t.id?(s.disabled=!1,s.hidden=!1,s.focus()):s&&(s.value="",s.disabled=!0,s.hidden=!0),e.value=a.target.value,(0,r.jG)(n)}))))}))},65548:(e,t,n)=>{"use strict";var r=n(91387);Array.from(document.getElementsByClassName("sib-select")).forEach((e=>{const t=e.querySelector(".form__entry");Array.from(t.getElementsByTagName("select"))[0].addEventListener("change",(()=>(0,r.jG)(t)))}))},86622:(e,t,n)=>{"use strict";n.d(t,{Z:()=>r});const r=class{constructor(e){this.options=e,this.elem="string"==typeof e.elem?document.querySelector(e.elem):e.elem,this.mainClass="sib-sms-select",this.titleClass=`${this.mainClass}__title`,this.listClass=`${this.mainClass}__list`,this.selectedClass="sib-is-selected",this.openClass="sib-is-open",this.selectOptions=e.countryCodes,this.toggle=this.toggle.bind(this),this.open=this.open.bind(this),this.close=this.close.bind(this),this.createDropdown=this.createDropdown.bind(this),this.onSelectClick=this.onSelectClick.bind(this),this.updateCallingCode=this.updateCallingCode.bind(this),this.onPhoneNumberChange=this.onPhoneNumberChange.bind(this),this.dialCode=this.selectOptions[0].calling_code,this.elem.innerHTML="",this.render()}toggle(){this.dropdown.classList.toggle(this.openClass)}open(){this.dropdown.classList.add(this.openClass)}close(){this.dropdown.classList.remove(this.openClass)}createDropdown(){const e=document.createElement("ul");return e.className=this.listClass,this.selectOptions.forEach((({name:t,calling_code:n,code:r},a)=>{const s=document.createElement("li"),i=document.createElement("span"),o=document.createElement("span");i.className=`sib-flag sib-flag-${r.toLocaleLowerCase()}`,o.textContent=t,o.className=`${this.mainClass}__label-text`,s.setAttribute("data-value",n),s.setAttribute("data-index",a),s.setAttribute("data-code",r),s.appendChild(i),s.appendChild(o),s.addEventListener("click",this.onOptionClick.bind(this)),e.appendChild(s)})),e}createNumberInput(){const e=document.createElement("div"),{placeholder:t,placeholderStyles:n,required:r,name:a}=this.options;if(e.className=`${this.mainClass}__number-input`,e.innerHTML=`\n      <input\n        type="text"\n        class="${this.mainClass}__calling-code"\n        name="${"WHATSAPP"===a?"WHATSAPP__COUNTRY_CODE":"SMS__COUNTRY_CODE"}"\n        value="${this.dialCode}"\n        readonly\n      />\n      <input\n        type="tel"\n        name="${"WHATSAPP"===a?"WHATSAPP":"SMS"}"\n        class="${this.mainClass}__phone-number"\n        ${this.options.required&&'required data-required="true"'}\n        ${!!this.options.placeholderPreview&&`value="${this.options.placeholderPreview}"`}\n        ${r&&'required data-required="true"'}\n        ${!!t&&`placeholder="${t}"`}\n        ${!!this.options.value&&`value="${this.options.value}"`}\n        style="${n}"\n      />\n    `,!this.options.showPlaceholder){const t=document.createElement("div");t.className=`${this.mainClass}__number-input__overlay`,e.appendChild(t)}return e}onSelectClick(e){e.preventDefault(),this.toggle();const t=this.selectContainer.querySelector(`.${this.titleClass}`).getBoundingClientRect(),{offsetWidth:n}=document.querySelector(`.${this.mainClass}`);this.dropdown.style.top=`${t.top+t.height+(window.scrollY||window.pageYOffset)}px`,this.dropdown.style.left=`${t.left}px`,this.dropdown.style.width=`${n}px`}onOptionClick(e){const t=e.target.closest("li");this.setCountryCodeValue(t);const{code:n}=t.dataset,{onCountryCodeChange:r}=this.options;"function"==typeof r&&r({countryCode:n}),this.close()}setCountryCodeValue(e){const t=this.selectContainer.querySelector(`.${this.titleClass}`);t.innerHTML="",t.appendChild(e.firstChild.cloneNode(!0)),t.appendChild(e.querySelector(`.${this.mainClass}__label-text`).cloneNode(!0)),this.selectOptions.forEach(((e,t)=>this.dropdown.querySelectorAll("li")[t].classList.remove(this.selectedClass))),e.classList.add(this.selectedClass),this.dialCode=e.dataset.value,this.updateCallingCode(this.dialCode,this.phoneNumber)}onPhoneNumberChange({target:e}){this.phoneNumber=e.value,this.updateCallingCode(this.dialCode,this.phoneNumber)}updateCallingCode(e,t){this.numberInputContainer.querySelector(`.${this.mainClass}__calling-code`).value=e,typeof this.options.onChange==typeof Function&&this.options.onChange({callingCode:e,phoneNumber:t})}setDefaultCountryCode(){const{countryCode:e}=this.options,t=Array.from(this.dropdown.querySelectorAll("li")),n=e&&t.find((t=>t.dataset.code===e))||t[0];this.setCountryCodeValue(n)}bindEvents(){const{onPlaceholderChange:e,onPhoneNumberClick:t}=this.options;this.numberInputContainer.querySelector(`.${this.mainClass}__calling-code`).addEventListener("change",this.onPhoneNumberChange),e&&"function"==typeof e&&this.numberInputContainer.querySelector(`.${this.mainClass}__phone-number`).addEventListener("change",e),t&&"function"==typeof t&&this.numberInputContainer.querySelector(`.${this.mainClass}__phone-number`).addEventListener("click",t),this.button.addEventListener("click",this.onSelectClick),document.addEventListener("click",(e=>{this.selectContainer.contains(e.target)||this.close()})),this.setDefaultCountryCode()}resetSelect(){this.dialCode=this.selectOptions[0].calling_code,this.selectContainer.querySelector(`.${this.titleClass}`).innerHTML="",this.selectContainer.querySelector(`.${this.titleClass}`).appendChild(this.dropdown.firstChild.firstElementChild.cloneNode(!0)),this.dropdown=this.createDropdown(),document.body.appendChild(this.dropdown),this.setDefaultCountryCode()}render(){this.selectContainer=this.elem,this.selectContainer.className=this.mainClass,this.dropdown=this.createDropdown(),document.body.appendChild(this.dropdown),this.numberInputContainer=this.createNumberInput(),this.button=document.createElement("div"),this.button.className=this.titleClass,this.button.appendChild(this.dropdown.childNodes[0].firstChild.cloneNode(!0)),this.selectContainer.appendChild(this.button),this.selectContainer.appendChild(this.numberInputContainer),this.bindEvents()}}},91387:(e,t,n)=>{"use strict";n.d(t,{Wj:()=>S,qn:()=>p,jG:()=>L,uH:()=>M}),n(90854);var r=setTimeout;function a(){}function s(e){if(!(this instanceof s))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],l(e,this)}function i(e,t){for(;3===e._state;)e=e._value;0!==e._state?(e._handled=!0,s._immediateFn((function(){var n=1===e._state?t.onFulfilled:t.onRejected;if(null!==n){var r;try{r=n(e._value)}catch(e){return void d(t.promise,e)}o(t.promise,r)}else(1===e._state?o:d)(t.promise,e._value)}))):e._deferreds.push(t)}function o(e,t){try{if(t===e)throw new TypeError("A promise cannot be resolved with itself.");if(t&&("object"==typeof t||"function"==typeof t)){var n=t.then;if(t instanceof s)return e._state=3,e._value=t,void u(e);if("function"==typeof n)return void l((r=n,a=t,function(){r.apply(a,arguments)}),e)}e._state=1,e._value=t,u(e)}catch(t){d(e,t)}var r,a}function d(e,t){e._state=2,e._value=t,u(e)}function u(e){2===e._state&&0===e._deferreds.length&&s._immediateFn((function(){e._handled||s._unhandledRejectionFn(e._value)}));for(var t=0,n=e._deferreds.length;t<n;t++)i(e,e._deferreds[t]);e._deferreds=null}function _(e,t,n){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.promise=n}function l(e,t){var n=!1;try{e((function(e){n||(n=!0,o(t,e))}),(function(e){n||(n=!0,d(t,e))}))}catch(e){if(n)return;n=!0,d(t,e)}}s.prototype.catch=function(e){return this.then(null,e)},s.prototype.then=function(e,t){var n=new this.constructor(a);return i(this,new _(e,t,n)),n},s.prototype.finally=function(e){var t=this.constructor;return this.then((function(n){return t.resolve(e()).then((function(){return n}))}),(function(n){return t.resolve(e()).then((function(){return t.reject(n)}))}))},s.all=function(e){return new s((function(t,n){if(!e||void 0===e.length)throw new TypeError("Promise.all accepts an array");var r=Array.prototype.slice.call(e);if(0===r.length)return t([]);var a=r.length;function s(e,i){try{if(i&&("object"==typeof i||"function"==typeof i)){var o=i.then;if("function"==typeof o)return void o.call(i,(function(t){s(e,t)}),n)}r[e]=i,0==--a&&t(r)}catch(e){n(e)}}for(var i=0;i<r.length;i++)s(i,r[i])}))},s.resolve=function(e){return e&&"object"==typeof e&&e.constructor===s?e:new s((function(t){t(e)}))},s.reject=function(e){return new s((function(t,n){n(e)}))},s.race=function(e){return new s((function(t,n){for(var r=0,a=e.length;r<a;r++)e[r].then(t,n)}))},s._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e)}||function(e){r(e,0)},s._unhandledRejectionFn=function(e){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)};const c=s;var m=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if(void 0!==n.g)return n.g;throw new Error("unable to locate global object")}();m.Promise||(m.Promise=c),n(2924),n(28380),n.g._babelPolyfill||window._babelPolyfill||n(26981);var h=n(20319),f=n(38496);const y=50;function p(e,t){const{height:n,width:r}=e.getBoundingClientRect(),a=e.offsetParent.offsetLeft,s=e.offsetTop+n;t.style.top=`${s}px`,t.style.width=`${r}px`,t.style.left=`${a}px`,t.style.display="block",t.setAttribute("data-open","true")}function M(e,t,n){const r=e.querySelector(n?".entry__error--secondary":".entry__error--primary");r.innerText=t,r.style.display="block",e.classList.add("entry_errored")}function L(e,t){const n=e.querySelector(t?".entry__error--secondary":".entry__error--primary")||e.querySelector(".entry__error"),r=e.querySelector(t?".entry__error--primary":".entry__error--secondary");n.style.display="none",n.innerText="",r&&r.innerText||e.classList.remove("entry_errored")}function Y(e,t,n,r){return!r&&!e.getAttribute("data-required")||(!e.value||e.value instanceof Array&&!e.value.length?(M(t,n||window.REQUIRED_ERROR_MESSAGE),!1):(L(t),!0))}function g(e,t){const n=t.closest(".form__entry"),r=t.querySelector('input[type="tel"]'),a=function(e,t,n,r=!1,a=!1){return L(t),!r&&!e.getAttribute("data-required")||(!e.value||e.value instanceof Array&&!e.value.length?(M(t,n||window.REQUIRED_ERROR_MESSAGE,a),!1):(L(t,a),!0))}(r,n,t.errorMessage,!1,!0)&&(0,h.P)(r,n,!0);return e&&a}function v(e,t){const n=t.querySelector(".form__entry");return window.grecaptcha&&window.grecaptcha.getResponse()?(L(n),e):(M(n,window.REQUIRED_ERROR_MESSAGE),!1)}function k(e,t){const n=t.querySelector(".form__entry"),r=t.querySelector(".input");r.setAttribute("data-touched","true");const a=Y(r,n,r.errorMessage)&&(0,h.P)(r,n);return e&&a}function w(e,t){const n=t.querySelector(".form__entry"),r=t.querySelector("select");r.setAttribute("data-touched","true");const a=Y(r,n,r.errorMessage)&&(0,h.P)(r,n);return e&&a}function b(e,t){const n=document.querySelector("#sib-form-container"),r=n.querySelector("#success-message"),a=n.querySelector("#error-message"),s=n.querySelector(".sib-loader")||n.querySelector(".loader"),i=n.querySelector('button[type="submit"]');s?(s.style.display="none",i.style.display="inline-block"):(i.querySelector("svg").addClass("sib-hide-loader-icon"),i.removeAttribute("disabled"),i.classList.remove("sib-form-block__button-disabled")),r.classList.remove("sib-form-message-panel--active"),a.classList.remove("sib-form-message-panel--active");const o=n&&n.offsetLeft||0,d=n&&H(n)||0;window.scrollTo({top:d,left:o,behavior:"smooth"}),e.success?(e.redirect?window.top.location.replace(e.redirect):(r.classList.add("sib-form-message-panel--active"),e.message&&((r.getElementsByClassName("sib-form-message-panel__inner-text")||r.getElementsByClassName("sib-form-message-panel__text"))[0].innerText=e.message),"update"!=t.getAttribute("data-type")&&function(e){Array.from(e.getElementsByClassName("sib-checkbox-group")).forEach((e=>{e.value=[]})),Array.from(e.getElementsByClassName("sib-optin")).forEach((e=>{e.value=""})),e.reset(),(0,f.r)(),h.G.forEach((e=>e.resetSelect()))}(t)),window.AUTOHIDE&&(n.querySelector("#sib-container").style.display="none")):(window.grecaptcha&&window.grecaptcha.reset(),a.classList.add("sib-form-message-panel--active"),e.message&&((a.getElementsByClassName("sib-form-message-panel__inner-text")||a.getElementsByClassName("sib-form-message-panel__text"))[0].innerText=e.message),function(e){const t=document.querySelector("#sib-form-container");document.querySelectorAll(".form__entry").forEach((e=>{if(e.classList.contains("entry_errored")){const t=e.querySelector(".entry__error");t.style.display="none",t.innerHTML=""}})),Object.entries(e).forEach((([e,n])=>{const r=t.querySelector(`input[name="${e}"]`),a=t.querySelector(`select[name="${e}"]`);M((r||a).closest(".form__entry"),n)}))}(e.errors))}function D(){const e=document.querySelector("#sib-form-container"),t=e.querySelector("#success-message"),n=e.querySelector("#error-message"),r=e.querySelector(".sib-loader")||e.querySelector(".loader"),a=e.querySelector('button[type="submit"]');r?(r.style.display="none",a.style.display="inline-block"):(a.querySelector("svg").addClass("sib-hide-loader-icon"),a.removeAttribute("disabled"),a.classList.remove("sib-form-block__button-disabled")),t.classList.remove("sib-form-message-panel--active"),n.classList.add("sib-form-message-panel--active");const s=e&&e.offsetLeft||0,i=e&&H(e)||0;window.scrollTo({top:i,left:s,behavior:"smooth"})}function T(e){const t=e.querySelector(".sib-loader")||e.querySelector(".loader"),n=e.querySelector('button[type="submit"]');t?(t.style.display="inline-block",n.style.display="none"):(n.querySelector("svg").removeClass("sib-hide-loader-icon"),n.setAttribute("disabled",!0),n.classList.add("sib-form-block__button-disabled"));const r=new XMLHttpRequest,a=new FormData(e);r.addEventListener("load",(t=>{try{b(JSON.parse(t.target.response),e)}catch(e){D(t.target.response)}})),r.addEventListener("error",(e=>{D(JSON.parse(e.target.response))})),r.open("POST",`${e.getAttribute("action")}?isAjax=1`),r.send(a)}function S(e){e.style.display="none",e.removeAttribute("data-open")}const j=document.querySelector("#sib-form");j.setAttribute("novalidate","true");const x=document.querySelector("form#sib-form input[name='email_address_check'].input--hidden");function H(e){let t=0;if(e.offsetParent)do{t+=e.offsetTop,e=e.offsetParent}while(e);return t-y}x&&x.setAttribute("aria-hidden","true"),j.addEventListener("submit",(e=>{e.preventDefault();let t=!0;if([...Array.from(j.getElementsByClassName("sib-optin")),...Array.from(j.getElementsByClassName("sib-multiselect")),...Array.from(j.getElementsByClassName("sib-checkbox-group")),...Array.from(j.getElementsByClassName("sib-radiobutton-group"))].forEach((e=>{const n=e.querySelector(".form__entry"),r=Y(e,n,e.errorMessage);t=t&&r})),t=Array.from(j.getElementsByClassName("sib-select")).reduce(w,t),t=Array.from(j.getElementsByClassName("sib-input")).reduce(k,t),t=Array.from(j.getElementsByClassName("sib-captcha")).reduce(v,t),t=Array.from(j.getElementsByClassName("sib-sms-select")).reduce(g,t),t){const e=j.querySelector(".sib-loader")||j.querySelector(".loader"),t=j.querySelector('button[type="submit"]');e?(e.style.display="inline-block",t.style.display="none"):(t.querySelector("svg").removeClass("sib-hide-loader-icon"),t.setAttribute("disabled",!0),t.classList.add("sib-form-block__button-disabled"));const n=j.querySelector(".g-recaptcha"),r=!!n&&"invisible"===n.dataset.size;window.grecaptcha&&r?(window.grecaptcha.reset(),window.grecaptcha.execute()):T(j)}})),window.invisibleCaptchaCallback=()=>{const e=document.querySelector("#sib-form-container"),t=e.querySelector(".sib-loader")||e.querySelector(".loader"),n=e.querySelector('button[type="submit"]');t?(t.style.display="inline-block",n.style.display="none"):(n.querySelector("svg").removeClass("sib-hide-loader-icon"),n.setAttribute("disabled",!0),n.classList.add("sib-form-block__button-disabled")),T(j)},SVGElement.prototype.hasClass=function(e){return new RegExp("(\\s|^)"+e+"(\\s|$)").test(this.getAttribute("class"))},SVGElement.prototype.addClass=function(e){this.hasClass(e)||this.setAttribute("class",this.getAttribute("class")+" "+e)},SVGElement.prototype.removeClass=function(e){var t=this.getAttribute("class").replace(new RegExp("(\\s|^)"+e+"(\\s|$)","g"),"$2");this.hasClass(e)&&this.setAttribute("class",t)}},21924:(e,t,n)=>{"use strict";var r=n(40210),a=n(55559),s=a(r("String.prototype.indexOf"));e.exports=function(e,t){var n=r(e,!!t);return"function"==typeof n&&s(e,".prototype.")>-1?a(n):n}},55559:(e,t,n)=>{"use strict";var r=n(58612),a=n(40210),s=n(67771),i=a("%TypeError%"),o=a("%Function.prototype.apply%"),d=a("%Function.prototype.call%"),u=a("%Reflect.apply%",!0)||r.call(d,o),_=a("%Object.defineProperty%",!0),l=a("%Math.max%");if(_)try{_({},"a",{value:1})}catch(e){_=null}e.exports=function(e){if("function"!=typeof e)throw new i("a function is required");var t=u(r,d,arguments);return s(t,1+l(0,e.length-(arguments.length-1)),!0)};var c=function(){return u(r,o,arguments)};_?_(e.exports,"apply",{value:c}):e.exports.apply=c},16266:(e,t,n)=>{n(95767),n(68132),n(48388),n(37470),n(94882),n(41520),n(27476),n(79622),n(89375),n(43533),n(84672),n(64157),n(35095),n(49892),n(75115),n(99176),n(68838),n(96253),n(39730),n(6059),n(48377),n(71084),n(64299),n(11246),n(30726),n(1901),n(75972),n(53403),n(92516),n(49371),n(86479),n(91736),n(51889),n(65177),n(81246),n(76503),n(66786),n(50932),n(57526),n(21591),n(9073),n(80347),n(30579),n(4669),n(67710),n(45789),n(33514),n(99978),n(58472),n(86946),n(35068),n(413),n(50191),n(98306),n(64564),n(39115),n(29539),n(96620),n(62850),n(10823),n(17732),n(40856),n(80703),n(91539),n(5292),n(45177),n(73694),n(37648),n(27795),n(4531),n(23605),n(6780),n(69937),n(10511),n(81822),n(19977),n(91031),n(46331),n(41560),n(20774),n(30522),n(58295),n(87842),n(50110),n(20075),n(24336),n(19371),n(98837),n(26773),n(15745),n(33057),n(3750),n(23369),n(99564),n(32e3),n(48977),n(52310),n(94899),n(31842),n(56997),n(83946),n(18269),n(66108),n(76774),n(21466),n(59357),n(76142),n(51876),n(40851),n(88416),n(98184),n(30147),n(59192),n(30142),n(1786),n(75368),n(46964),n(62152),n(74821),n(79103),n(81303),n(83318),n(70162),n(33834),n(21572),n(82139),n(10685),n(85535),n(17347),n(83049),n(96633),n(68989),n(78270),n(64510),n(73984),n(75769),n(50055),n(96014),e.exports=n(25645)},70911:(e,t,n)=>{n(1268),e.exports=n(25645).Array.flatMap},10990:(e,t,n)=>{n(62773),e.exports=n(25645).Array.includes},15434:(e,t,n)=>{n(83276),e.exports=n(25645).Object.entries},78051:(e,t,n)=>{n(98351),e.exports=n(25645).Object.getOwnPropertyDescriptors},38250:(e,t,n)=>{n(96409),e.exports=n(25645).Object.values},54952:(e,t,n)=>{"use strict";n(40851),n(9865),e.exports=n(25645).Promise.finally},6197:(e,t,n)=>{n(92770),e.exports=n(25645).String.padEnd},14160:(e,t,n)=>{n(41784),e.exports=n(25645).String.padStart},54039:(e,t,n)=>{n(94325),e.exports=n(25645).String.trimRight},96728:(e,t,n)=>{n(65869),e.exports=n(25645).String.trimLeft},93568:(e,t,n)=>{n(79665),e.exports=n(28787).f("asyncIterator")},40115:(e,t,n)=>{n(34579),e.exports=n(11327).global},85663:e=>{e.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},12159:(e,t,n)=>{var r=n(36727);e.exports=function(e){if(!r(e))throw TypeError(e+" is not an object!");return e}},11327:e=>{var t=e.exports={version:"2.6.12"};"number"==typeof __e&&(__e=t)},19216:(e,t,n)=>{var r=n(85663);e.exports=function(e,t,n){if(r(e),void 0===t)return e;switch(n){case 1:return function(n){return e.call(t,n)};case 2:return function(n,r){return e.call(t,n,r)};case 3:return function(n,r,a){return e.call(t,n,r,a)}}return function(){return e.apply(t,arguments)}}},89666:(e,t,n)=>{e.exports=!n(7929)((function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a}))},97467:(e,t,n)=>{var r=n(36727),a=n(33938).document,s=r(a)&&r(a.createElement);e.exports=function(e){return s?a.createElement(e):{}}},83856:(e,t,n)=>{var r=n(33938),a=n(11327),s=n(19216),i=n(41818),o=n(27069),d="prototype",u=function(e,t,n){var _,l,c,m=e&u.F,h=e&u.G,f=e&u.S,y=e&u.P,p=e&u.B,M=e&u.W,L=h?a:a[t]||(a[t]={}),Y=L[d],g=h?r:f?r[t]:(r[t]||{})[d];for(_ in h&&(n=t),n)(l=!m&&g&&void 0!==g[_])&&o(L,_)||(c=l?g[_]:n[_],L[_]=h&&"function"!=typeof g[_]?n[_]:p&&l?s(c,r):M&&g[_]==c?function(e){var t=function(t,n,r){if(this instanceof e){switch(arguments.length){case 0:return new e;case 1:return new e(t);case 2:return new e(t,n)}return new e(t,n,r)}return e.apply(this,arguments)};return t[d]=e[d],t}(c):y&&"function"==typeof c?s(Function.call,c):c,y&&((L.virtual||(L.virtual={}))[_]=c,e&u.R&&Y&&!Y[_]&&i(Y,_,c)))};u.F=1,u.G=2,u.S=4,u.P=8,u.B=16,u.W=32,u.U=64,u.R=128,e.exports=u},7929:e=>{e.exports=function(e){try{return!!e()}catch(e){return!0}}},33938:e=>{var t=e.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=t)},27069:e=>{var t={}.hasOwnProperty;e.exports=function(e,n){return t.call(e,n)}},41818:(e,t,n)=>{var r=n(4743),a=n(83101);e.exports=n(89666)?function(e,t,n){return r.f(e,t,a(1,n))}:function(e,t,n){return e[t]=n,e}},33758:(e,t,n)=>{e.exports=!n(89666)&&!n(7929)((function(){return 7!=Object.defineProperty(n(97467)("div"),"a",{get:function(){return 7}}).a}))},36727:e=>{e.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},4743:(e,t,n)=>{var r=n(12159),a=n(33758),s=n(33206),i=Object.defineProperty;t.f=n(89666)?Object.defineProperty:function(e,t,n){if(r(e),t=s(t,!0),r(n),a)try{return i(e,t,n)}catch(e){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(e[t]=n.value),e}},83101:e=>{e.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}},33206:(e,t,n)=>{var r=n(36727);e.exports=function(e,t){if(!r(e))return e;var n,a;if(t&&"function"==typeof(n=e.toString)&&!r(a=n.call(e)))return a;if("function"==typeof(n=e.valueOf)&&!r(a=n.call(e)))return a;if(!t&&"function"==typeof(n=e.toString)&&!r(a=n.call(e)))return a;throw TypeError("Can't convert object to primitive value")}},34579:(e,t,n)=>{var r=n(83856);r(r.G,{global:n(33938)})},24963:e=>{e.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},83365:(e,t,n)=>{var r=n(92032);e.exports=function(e,t){if("number"!=typeof e&&"Number"!=r(e))throw TypeError(t);return+e}},17722:(e,t,n)=>{var r=n(86314)("unscopables"),a=Array.prototype;null==a[r]&&n(87728)(a,r,{}),e.exports=function(e){a[r][e]=!0}},76793:(e,t,n)=>{"use strict";var r=n(24496)(!0);e.exports=function(e,t,n){return t+(n?r(e,t).length:1)}},83328:e=>{e.exports=function(e,t,n,r){if(!(e instanceof t)||void 0!==r&&r in e)throw TypeError(n+": incorrect invocation!");return e}},27007:(e,t,n)=>{var r=n(55286);e.exports=function(e){if(!r(e))throw TypeError(e+" is not an object!");return e}},5216:(e,t,n)=>{"use strict";var r=n(20508),a=n(92337),s=n(10875);e.exports=[].copyWithin||function(e,t){var n=r(this),i=s(n.length),o=a(e,i),d=a(t,i),u=arguments.length>2?arguments[2]:void 0,_=Math.min((void 0===u?i:a(u,i))-d,i-o),l=1;for(d<o&&o<d+_&&(l=-1,d+=_-1,o+=_-1);_-- >0;)d in n?n[o]=n[d]:delete n[o],o+=l,d+=l;return n}},46852:(e,t,n)=>{"use strict";var r=n(20508),a=n(92337),s=n(10875);e.exports=function(e){for(var t=r(this),n=s(t.length),i=arguments.length,o=a(i>1?arguments[1]:void 0,n),d=i>2?arguments[2]:void 0,u=void 0===d?n:a(d,n);u>o;)t[o++]=e;return t}},79315:(e,t,n)=>{var r=n(22110),a=n(10875),s=n(92337);e.exports=function(e){return function(t,n,i){var o,d=r(t),u=a(d.length),_=s(i,u);if(e&&n!=n){for(;u>_;)if((o=d[_++])!=o)return!0}else for(;u>_;_++)if((e||_ in d)&&d[_]===n)return e||_||0;return!e&&-1}}},10050:(e,t,n)=>{var r=n(741),a=n(49797),s=n(20508),i=n(10875),o=n(16886);e.exports=function(e,t){var n=1==e,d=2==e,u=3==e,_=4==e,l=6==e,c=5==e||l,m=t||o;return function(t,o,h){for(var f,y,p=s(t),M=a(p),L=r(o,h,3),Y=i(M.length),g=0,v=n?m(t,Y):d?m(t,0):void 0;Y>g;g++)if((c||g in M)&&(y=L(f=M[g],g,p),e))if(n)v[g]=y;else if(y)switch(e){case 3:return!0;case 5:return f;case 6:return g;case 2:v.push(f)}else if(_)return!1;return l?-1:u||_?_:v}}},37628:(e,t,n)=>{var r=n(24963),a=n(20508),s=n(49797),i=n(10875);e.exports=function(e,t,n,o,d){r(t);var u=a(e),_=s(u),l=i(u.length),c=d?l-1:0,m=d?-1:1;if(n<2)for(;;){if(c in _){o=_[c],c+=m;break}if(c+=m,d?c<0:l<=c)throw TypeError("Reduce of empty array with no initial value")}for(;d?c>=0:l>c;c+=m)c in _&&(o=t(o,_[c],c,u));return o}},42736:(e,t,n)=>{var r=n(55286),a=n(4302),s=n(86314)("species");e.exports=function(e){var t;return a(e)&&("function"!=typeof(t=e.constructor)||t!==Array&&!a(t.prototype)||(t=void 0),r(t)&&null===(t=t[s])&&(t=void 0)),void 0===t?Array:t}},16886:(e,t,n)=>{var r=n(42736);e.exports=function(e,t){return new(r(e))(t)}},34398:(e,t,n)=>{"use strict";var r=n(24963),a=n(55286),s=n(97242),i=[].slice,o={};e.exports=Function.bind||function(e){var t=r(this),n=i.call(arguments,1),d=function(){var r=n.concat(i.call(arguments));return this instanceof d?function(e,t,n){if(!(t in o)){for(var r=[],a=0;a<t;a++)r[a]="a["+a+"]";o[t]=Function("F,a","return new F("+r.join(",")+")")}return o[t](e,n)}(t,r.length,r):s(t,r,e)};return a(t.prototype)&&(d.prototype=t.prototype),d}},41488:(e,t,n)=>{var r=n(92032),a=n(86314)("toStringTag"),s="Arguments"==r(function(){return arguments}());e.exports=function(e){var t,n,i;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(n=function(e,t){try{return e[t]}catch(e){}}(t=Object(e),a))?n:s?r(t):"Object"==(i=r(t))&&"function"==typeof t.callee?"Arguments":i}},92032:e=>{var t={}.toString;e.exports=function(e){return t.call(e).slice(8,-1)}},9824:(e,t,n)=>{"use strict";var r=n(99275).f,a=n(42503),s=n(24408),i=n(741),o=n(83328),d=n(3531),u=n(42923),_=n(15436),l=n(2974),c=n(67057),m=n(84728).fastKey,h=n(1616),f=c?"_s":"size",y=function(e,t){var n,r=m(t);if("F"!==r)return e._i[r];for(n=e._f;n;n=n.n)if(n.k==t)return n};e.exports={getConstructor:function(e,t,n,u){var _=e((function(e,r){o(e,_,t,"_i"),e._t=t,e._i=a(null),e._f=void 0,e._l=void 0,e[f]=0,null!=r&&d(r,n,e[u],e)}));return s(_.prototype,{clear:function(){for(var e=h(this,t),n=e._i,r=e._f;r;r=r.n)r.r=!0,r.p&&(r.p=r.p.n=void 0),delete n[r.i];e._f=e._l=void 0,e[f]=0},delete:function(e){var n=h(this,t),r=y(n,e);if(r){var a=r.n,s=r.p;delete n._i[r.i],r.r=!0,s&&(s.n=a),a&&(a.p=s),n._f==r&&(n._f=a),n._l==r&&(n._l=s),n[f]--}return!!r},forEach:function(e){h(this,t);for(var n,r=i(e,arguments.length>1?arguments[1]:void 0,3);n=n?n.n:this._f;)for(r(n.v,n.k,this);n&&n.r;)n=n.p},has:function(e){return!!y(h(this,t),e)}}),c&&r(_.prototype,"size",{get:function(){return h(this,t)[f]}}),_},def:function(e,t,n){var r,a,s=y(e,t);return s?s.v=n:(e._l=s={i:a=m(t,!0),k:t,v:n,p:r=e._l,n:void 0,r:!1},e._f||(e._f=s),r&&(r.n=s),e[f]++,"F"!==a&&(e._i[a]=s)),e},getEntry:y,setStrong:function(e,t,n){u(e,t,(function(e,n){this._t=h(e,t),this._k=n,this._l=void 0}),(function(){for(var e=this,t=e._k,n=e._l;n&&n.r;)n=n.p;return e._t&&(e._l=n=n?n.n:e._t._f)?_(0,"keys"==t?n.k:"values"==t?n.v:[n.k,n.v]):(e._t=void 0,_(1))}),n?"entries":"values",!n,!0),l(t)}}},23657:(e,t,n)=>{"use strict";var r=n(24408),a=n(84728).getWeak,s=n(27007),i=n(55286),o=n(83328),d=n(3531),u=n(10050),_=n(79181),l=n(1616),c=u(5),m=u(6),h=0,f=function(e){return e._l||(e._l=new y)},y=function(){this.a=[]},p=function(e,t){return c(e.a,(function(e){return e[0]===t}))};y.prototype={get:function(e){var t=p(this,e);if(t)return t[1]},has:function(e){return!!p(this,e)},set:function(e,t){var n=p(this,e);n?n[1]=t:this.a.push([e,t])},delete:function(e){var t=m(this.a,(function(t){return t[0]===e}));return~t&&this.a.splice(t,1),!!~t}},e.exports={getConstructor:function(e,t,n,s){var u=e((function(e,r){o(e,u,t,"_i"),e._t=t,e._i=h++,e._l=void 0,null!=r&&d(r,n,e[s],e)}));return r(u.prototype,{delete:function(e){if(!i(e))return!1;var n=a(e);return!0===n?f(l(this,t)).delete(e):n&&_(n,this._i)&&delete n[this._i]},has:function(e){if(!i(e))return!1;var n=a(e);return!0===n?f(l(this,t)).has(e):n&&_(n,this._i)}}),u},def:function(e,t,n){var r=a(s(t),!0);return!0===r?f(e).set(t,n):r[e._i]=n,e},ufstore:f}},45795:(e,t,n)=>{"use strict";var r=n(3816),a=n(42985),s=n(77234),i=n(24408),o=n(84728),d=n(3531),u=n(83328),_=n(55286),l=n(74253),c=n(7462),m=n(22943),h=n(40266);e.exports=function(e,t,n,f,y,p){var M=r[e],L=M,Y=y?"set":"add",g=L&&L.prototype,v={},k=function(e){var t=g[e];s(g,e,"delete"==e||"has"==e?function(e){return!(p&&!_(e))&&t.call(this,0===e?0:e)}:"get"==e?function(e){return p&&!_(e)?void 0:t.call(this,0===e?0:e)}:"add"==e?function(e){return t.call(this,0===e?0:e),this}:function(e,n){return t.call(this,0===e?0:e,n),this})};if("function"==typeof L&&(p||g.forEach&&!l((function(){(new L).entries().next()})))){var w=new L,b=w[Y](p?{}:-0,1)!=w,D=l((function(){w.has(1)})),T=c((function(e){new L(e)})),S=!p&&l((function(){for(var e=new L,t=5;t--;)e[Y](t,t);return!e.has(-0)}));T||((L=t((function(t,n){u(t,L,e);var r=h(new M,t,L);return null!=n&&d(n,y,r[Y],r),r}))).prototype=g,g.constructor=L),(D||S)&&(k("delete"),k("has"),y&&k("get")),(S||b)&&k(Y),p&&g.clear&&delete g.clear}else L=f.getConstructor(t,e,y,Y),i(L.prototype,n),o.NEED=!0;return m(L,e),v[e]=L,a(a.G+a.W+a.F*(L!=M),v),p||f.setStrong(L,e,y),L}},25645:e=>{var t=e.exports={version:"2.6.12"};"number"==typeof __e&&(__e=t)},92811:(e,t,n)=>{"use strict";var r=n(99275),a=n(90681);e.exports=function(e,t,n){t in e?r.f(e,t,a(0,n)):e[t]=n}},741:(e,t,n)=>{var r=n(24963);e.exports=function(e,t,n){if(r(e),void 0===t)return e;switch(n){case 1:return function(n){return e.call(t,n)};case 2:return function(n,r){return e.call(t,n,r)};case 3:return function(n,r,a){return e.call(t,n,r,a)}}return function(){return e.apply(t,arguments)}}},53537:(e,t,n)=>{"use strict";var r=n(74253),a=Date.prototype.getTime,s=Date.prototype.toISOString,i=function(e){return e>9?e:"0"+e};e.exports=r((function(){return"0385-07-25T07:06:39.999Z"!=s.call(new Date(-50000000000001))}))||!r((function(){s.call(new Date(NaN))}))?function(){if(!isFinite(a.call(this)))throw RangeError("Invalid time value");var e=this,t=e.getUTCFullYear(),n=e.getUTCMilliseconds(),r=t<0?"-":t>9999?"+":"";return r+("00000"+Math.abs(t)).slice(r?-6:-4)+"-"+i(e.getUTCMonth()+1)+"-"+i(e.getUTCDate())+"T"+i(e.getUTCHours())+":"+i(e.getUTCMinutes())+":"+i(e.getUTCSeconds())+"."+(n>99?n:"0"+i(n))+"Z"}:s},870:(e,t,n)=>{"use strict";var r=n(27007),a=n(21689),s="number";e.exports=function(e){if("string"!==e&&e!==s&&"default"!==e)throw TypeError("Incorrect hint");return a(r(this),e!=s)}},91355:e=>{e.exports=function(e){if(null==e)throw TypeError("Can't call method on  "+e);return e}},67057:(e,t,n)=>{e.exports=!n(74253)((function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a}))},62457:(e,t,n)=>{var r=n(55286),a=n(3816).document,s=r(a)&&r(a.createElement);e.exports=function(e){return s?a.createElement(e):{}}},74430:e=>{e.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},5541:(e,t,n)=>{var r=n(47184),a=n(64548),s=n(14682);e.exports=function(e){var t=r(e),n=a.f;if(n)for(var i,o=n(e),d=s.f,u=0;o.length>u;)d.call(e,i=o[u++])&&t.push(i);return t}},42985:(e,t,n)=>{var r=n(3816),a=n(25645),s=n(87728),i=n(77234),o=n(741),d="prototype",u=function(e,t,n){var _,l,c,m,h=e&u.F,f=e&u.G,y=e&u.S,p=e&u.P,M=e&u.B,L=f?r:y?r[t]||(r[t]={}):(r[t]||{})[d],Y=f?a:a[t]||(a[t]={}),g=Y[d]||(Y[d]={});for(_ in f&&(n=t),n)c=((l=!h&&L&&void 0!==L[_])?L:n)[_],m=M&&l?o(c,r):p&&"function"==typeof c?o(Function.call,c):c,L&&i(L,_,c,e&u.U),Y[_]!=c&&s(Y,_,m),p&&g[_]!=c&&(g[_]=c)};r.core=a,u.F=1,u.G=2,u.S=4,u.P=8,u.B=16,u.W=32,u.U=64,u.R=128,e.exports=u},8852:(e,t,n)=>{var r=n(86314)("match");e.exports=function(e){var t=/./;try{"/./"[e](t)}catch(n){try{return t[r]=!1,!"/./"[e](t)}catch(e){}}return!0}},74253:e=>{e.exports=function(e){try{return!!e()}catch(e){return!0}}},28082:(e,t,n)=>{"use strict";n(18269);var r=n(77234),a=n(87728),s=n(74253),i=n(91355),o=n(86314),d=n(21165),u=o("species"),_=!s((function(){var e=/./;return e.exec=function(){var e=[];return e.groups={a:"7"},e},"7"!=="".replace(e,"$<a>")})),l=function(){var e=/(?:)/,t=e.exec;e.exec=function(){return t.apply(this,arguments)};var n="ab".split(e);return 2===n.length&&"a"===n[0]&&"b"===n[1]}();e.exports=function(e,t,n){var c=o(e),m=!s((function(){var t={};return t[c]=function(){return 7},7!=""[e](t)})),h=m?!s((function(){var t=!1,n=/a/;return n.exec=function(){return t=!0,null},"split"===e&&(n.constructor={},n.constructor[u]=function(){return n}),n[c](""),!t})):void 0;if(!m||!h||"replace"===e&&!_||"split"===e&&!l){var f=/./[c],y=n(i,c,""[e],(function(e,t,n,r,a){return t.exec===d?m&&!a?{done:!0,value:f.call(t,n,r)}:{done:!0,value:e.call(n,t,r)}:{done:!1}})),p=y[0],M=y[1];r(String.prototype,e,p),a(RegExp.prototype,c,2==t?function(e,t){return M.call(e,this,t)}:function(e){return M.call(e,this)})}}},53218:(e,t,n)=>{"use strict";var r=n(27007);e.exports=function(){var e=r(this),t="";return e.global&&(t+="g"),e.ignoreCase&&(t+="i"),e.multiline&&(t+="m"),e.unicode&&(t+="u"),e.sticky&&(t+="y"),t}},13325:(e,t,n)=>{"use strict";var r=n(4302),a=n(55286),s=n(10875),i=n(741),o=n(86314)("isConcatSpreadable");e.exports=function e(t,n,d,u,_,l,c,m){for(var h,f,y=_,p=0,M=!!c&&i(c,m,3);p<u;){if(p in d){if(h=M?M(d[p],p,n):d[p],f=!1,a(h)&&(f=void 0!==(f=h[o])?!!f:r(h)),f&&l>0)y=e(t,n,h,s(h.length),y,l-1)-1;else{if(y>=9007199254740991)throw TypeError();t[y]=h}y++}p++}return y}},3531:(e,t,n)=>{var r=n(741),a=n(28851),s=n(86555),i=n(27007),o=n(10875),d=n(69002),u={},_={},l=e.exports=function(e,t,n,l,c){var m,h,f,y,p=c?function(){return e}:d(e),M=r(n,l,t?2:1),L=0;if("function"!=typeof p)throw TypeError(e+" is not iterable!");if(s(p)){for(m=o(e.length);m>L;L++)if((y=t?M(i(h=e[L])[0],h[1]):M(e[L]))===u||y===_)return y}else for(f=p.call(e);!(h=f.next()).done;)if((y=a(f,M,h.value,t))===u||y===_)return y};l.BREAK=u,l.RETURN=_},40018:(e,t,n)=>{e.exports=n(3825)("native-function-to-string",Function.toString)},3816:e=>{var t=e.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=t)},79181:e=>{var t={}.hasOwnProperty;e.exports=function(e,n){return t.call(e,n)}},87728:(e,t,n)=>{var r=n(99275),a=n(90681);e.exports=n(67057)?function(e,t,n){return r.f(e,t,a(1,n))}:function(e,t,n){return e[t]=n,e}},40639:(e,t,n)=>{var r=n(3816).document;e.exports=r&&r.documentElement},1734:(e,t,n)=>{e.exports=!n(67057)&&!n(74253)((function(){return 7!=Object.defineProperty(n(62457)("div"),"a",{get:function(){return 7}}).a}))},40266:(e,t,n)=>{var r=n(55286),a=n(27375).set;e.exports=function(e,t,n){var s,i=t.constructor;return i!==n&&"function"==typeof i&&(s=i.prototype)!==n.prototype&&r(s)&&a&&a(e,s),e}},97242:e=>{e.exports=function(e,t,n){var r=void 0===n;switch(t.length){case 0:return r?e():e.call(n);case 1:return r?e(t[0]):e.call(n,t[0]);case 2:return r?e(t[0],t[1]):e.call(n,t[0],t[1]);case 3:return r?e(t[0],t[1],t[2]):e.call(n,t[0],t[1],t[2]);case 4:return r?e(t[0],t[1],t[2],t[3]):e.call(n,t[0],t[1],t[2],t[3])}return e.apply(n,t)}},49797:(e,t,n)=>{var r=n(92032);e.exports=Object("z").propertyIsEnumerable(0)?Object:function(e){return"String"==r(e)?e.split(""):Object(e)}},86555:(e,t,n)=>{var r=n(87234),a=n(86314)("iterator"),s=Array.prototype;e.exports=function(e){return void 0!==e&&(r.Array===e||s[a]===e)}},4302:(e,t,n)=>{var r=n(92032);e.exports=Array.isArray||function(e){return"Array"==r(e)}},18367:(e,t,n)=>{var r=n(55286),a=Math.floor;e.exports=function(e){return!r(e)&&isFinite(e)&&a(e)===e}},55286:e=>{e.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},55364:(e,t,n)=>{var r=n(55286),a=n(92032),s=n(86314)("match");e.exports=function(e){var t;return r(e)&&(void 0!==(t=e[s])?!!t:"RegExp"==a(e))}},28851:(e,t,n)=>{var r=n(27007);e.exports=function(e,t,n,a){try{return a?t(r(n)[0],n[1]):t(n)}catch(t){var s=e.return;throw void 0!==s&&r(s.call(e)),t}}},49988:(e,t,n)=>{"use strict";var r=n(42503),a=n(90681),s=n(22943),i={};n(87728)(i,n(86314)("iterator"),(function(){return this})),e.exports=function(e,t,n){e.prototype=r(i,{next:a(1,n)}),s(e,t+" Iterator")}},42923:(e,t,n)=>{"use strict";var r=n(4461),a=n(42985),s=n(77234),i=n(87728),o=n(87234),d=n(49988),u=n(22943),_=n(468),l=n(86314)("iterator"),c=!([].keys&&"next"in[].keys()),m="keys",h="values",f=function(){return this};e.exports=function(e,t,n,y,p,M,L){d(n,t,y);var Y,g,v,k=function(e){if(!c&&e in T)return T[e];switch(e){case m:case h:return function(){return new n(this,e)}}return function(){return new n(this,e)}},w=t+" Iterator",b=p==h,D=!1,T=e.prototype,S=T[l]||T["@@iterator"]||p&&T[p],j=S||k(p),x=p?b?k("entries"):j:void 0,H="Array"==t&&T.entries||S;if(H&&(v=_(H.call(new e)))!==Object.prototype&&v.next&&(u(v,w,!0),r||"function"==typeof v[l]||i(v,l,f)),b&&S&&S.name!==h&&(D=!0,j=function(){return S.call(this)}),r&&!L||!c&&!D&&T[l]||i(T,l,j),o[t]=j,o[w]=f,p)if(Y={values:b?j:k(h),keys:M?j:k(m),entries:x},L)for(g in Y)g in T||s(T,g,Y[g]);else a(a.P+a.F*(c||D),t,Y);return Y}},7462:(e,t,n)=>{var r=n(86314)("iterator"),a=!1;try{var s=[7][r]();s.return=function(){a=!0},Array.from(s,(function(){throw 2}))}catch(e){}e.exports=function(e,t){if(!t&&!a)return!1;var n=!1;try{var s=[7],i=s[r]();i.next=function(){return{done:n=!0}},s[r]=function(){return i},e(s)}catch(e){}return n}},15436:e=>{e.exports=function(e,t){return{value:t,done:!!e}}},87234:e=>{e.exports={}},4461:e=>{e.exports=!1},13086:e=>{var t=Math.expm1;e.exports=!t||t(10)>22025.465794806718||t(10)<22025.465794806718||-2e-17!=t(-2e-17)?function(e){return 0==(e=+e)?e:e>-1e-6&&e<1e-6?e+e*e/2:Math.exp(e)-1}:t},34934:(e,t,n)=>{var r=n(61801),a=Math.pow,s=a(2,-52),i=a(2,-23),o=a(2,127)*(2-i),d=a(2,-126);e.exports=Math.fround||function(e){var t,n,a=Math.abs(e),u=r(e);return a<d?u*(a/d/i+1/s-1/s)*d*i:(n=(t=(1+i/s)*a)-(t-a))>o||n!=n?u*(1/0):u*n}},46206:e=>{e.exports=Math.log1p||function(e){return(e=+e)>-1e-8&&e<1e-8?e-e*e/2:Math.log(1+e)}},61801:e=>{e.exports=Math.sign||function(e){return 0==(e=+e)||e!=e?e:e<0?-1:1}},84728:(e,t,n)=>{var r=n(93953)("meta"),a=n(55286),s=n(79181),i=n(99275).f,o=0,d=Object.isExtensible||function(){return!0},u=!n(74253)((function(){return d(Object.preventExtensions({}))})),_=function(e){i(e,r,{value:{i:"O"+ ++o,w:{}}})},l=e.exports={KEY:r,NEED:!1,fastKey:function(e,t){if(!a(e))return"symbol"==typeof e?e:("string"==typeof e?"S":"P")+e;if(!s(e,r)){if(!d(e))return"F";if(!t)return"E";_(e)}return e[r].i},getWeak:function(e,t){if(!s(e,r)){if(!d(e))return!0;if(!t)return!1;_(e)}return e[r].w},onFreeze:function(e){return u&&l.NEED&&d(e)&&!s(e,r)&&_(e),e}}},14351:(e,t,n)=>{var r=n(3816),a=n(74193).set,s=r.MutationObserver||r.WebKitMutationObserver,i=r.process,o=r.Promise,d="process"==n(92032)(i);e.exports=function(){var e,t,n,u=function(){var r,a;for(d&&(r=i.domain)&&r.exit();e;){a=e.fn,e=e.next;try{a()}catch(r){throw e?n():t=void 0,r}}t=void 0,r&&r.enter()};if(d)n=function(){i.nextTick(u)};else if(!s||r.navigator&&r.navigator.standalone)if(o&&o.resolve){var _=o.resolve(void 0);n=function(){_.then(u)}}else n=function(){a.call(r,u)};else{var l=!0,c=document.createTextNode("");new s(u).observe(c,{characterData:!0}),n=function(){c.data=l=!l}}return function(r){var a={fn:r,next:void 0};t&&(t.next=a),e||(e=a,n()),t=a}}},43499:(e,t,n)=>{"use strict";var r=n(24963);function a(e){var t,n;this.promise=new e((function(e,r){if(void 0!==t||void 0!==n)throw TypeError("Bad Promise constructor");t=e,n=r})),this.resolve=r(t),this.reject=r(n)}e.exports.f=function(e){return new a(e)}},35345:(e,t,n)=>{"use strict";var r=n(67057),a=n(47184),s=n(64548),i=n(14682),o=n(20508),d=n(49797),u=Object.assign;e.exports=!u||n(74253)((function(){var e={},t={},n=Symbol(),r="abcdefghijklmnopqrst";return e[n]=7,r.split("").forEach((function(e){t[e]=e})),7!=u({},e)[n]||Object.keys(u({},t)).join("")!=r}))?function(e,t){for(var n=o(e),u=arguments.length,_=1,l=s.f,c=i.f;u>_;)for(var m,h=d(arguments[_++]),f=l?a(h).concat(l(h)):a(h),y=f.length,p=0;y>p;)m=f[p++],r&&!c.call(h,m)||(n[m]=h[m]);return n}:u},42503:(e,t,n)=>{var r=n(27007),a=n(35588),s=n(74430),i=n(69335)("IE_PROTO"),o=function(){},d="prototype",u=function(){var e,t=n(62457)("iframe"),r=s.length;for(t.style.display="none",n(40639).appendChild(t),t.src="javascript:",(e=t.contentWindow.document).open(),e.write("<script>document.F=Object<\/script>"),e.close(),u=e.F;r--;)delete u[d][s[r]];return u()};e.exports=Object.create||function(e,t){var n;return null!==e?(o[d]=r(e),n=new o,o[d]=null,n[i]=e):n=u(),void 0===t?n:a(n,t)}},99275:(e,t,n)=>{var r=n(27007),a=n(1734),s=n(21689),i=Object.defineProperty;t.f=n(67057)?Object.defineProperty:function(e,t,n){if(r(e),t=s(t,!0),r(n),a)try{return i(e,t,n)}catch(e){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(e[t]=n.value),e}},35588:(e,t,n)=>{var r=n(99275),a=n(27007),s=n(47184);e.exports=n(67057)?Object.defineProperties:function(e,t){a(e);for(var n,i=s(t),o=i.length,d=0;o>d;)r.f(e,n=i[d++],t[n]);return e}},18693:(e,t,n)=>{var r=n(14682),a=n(90681),s=n(22110),i=n(21689),o=n(79181),d=n(1734),u=Object.getOwnPropertyDescriptor;t.f=n(67057)?u:function(e,t){if(e=s(e),t=i(t,!0),d)try{return u(e,t)}catch(e){}if(o(e,t))return a(!r.f.call(e,t),e[t])}},39327:(e,t,n)=>{var r=n(22110),a=n(20616).f,s={}.toString,i="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[];e.exports.f=function(e){return i&&"[object Window]"==s.call(e)?function(e){try{return a(e)}catch(e){return i.slice()}}(e):a(r(e))}},20616:(e,t,n)=>{var r=n(60189),a=n(74430).concat("length","prototype");t.f=Object.getOwnPropertyNames||function(e){return r(e,a)}},64548:(e,t)=>{t.f=Object.getOwnPropertySymbols},468:(e,t,n)=>{var r=n(79181),a=n(20508),s=n(69335)("IE_PROTO"),i=Object.prototype;e.exports=Object.getPrototypeOf||function(e){return e=a(e),r(e,s)?e[s]:"function"==typeof e.constructor&&e instanceof e.constructor?e.constructor.prototype:e instanceof Object?i:null}},60189:(e,t,n)=>{var r=n(79181),a=n(22110),s=n(79315)(!1),i=n(69335)("IE_PROTO");e.exports=function(e,t){var n,o=a(e),d=0,u=[];for(n in o)n!=i&&r(o,n)&&u.push(n);for(;t.length>d;)r(o,n=t[d++])&&(~s(u,n)||u.push(n));return u}},47184:(e,t,n)=>{var r=n(60189),a=n(74430);e.exports=Object.keys||function(e){return r(e,a)}},14682:(e,t)=>{t.f={}.propertyIsEnumerable},33160:(e,t,n)=>{var r=n(42985),a=n(25645),s=n(74253);e.exports=function(e,t){var n=(a.Object||{})[e]||Object[e],i={};i[e]=t(n),r(r.S+r.F*s((function(){n(1)})),"Object",i)}},51131:(e,t,n)=>{var r=n(67057),a=n(47184),s=n(22110),i=n(14682).f;e.exports=function(e){return function(t){for(var n,o=s(t),d=a(o),u=d.length,_=0,l=[];u>_;)n=d[_++],r&&!i.call(o,n)||l.push(e?[n,o[n]]:o[n]);return l}}},57643:(e,t,n)=>{var r=n(20616),a=n(64548),s=n(27007),i=n(3816).Reflect;e.exports=i&&i.ownKeys||function(e){var t=r.f(s(e)),n=a.f;return n?t.concat(n(e)):t}},47743:(e,t,n)=>{var r=n(3816).parseFloat,a=n(29599).trim;e.exports=1/r(n(84644)+"-0")!=-1/0?function(e){var t=a(String(e),3),n=r(t);return 0===n&&"-"==t.charAt(0)?-0:n}:r},55960:(e,t,n)=>{var r=n(3816).parseInt,a=n(29599).trim,s=n(84644),i=/^[-+]?0[xX]/;e.exports=8!==r(s+"08")||22!==r(s+"0x16")?function(e,t){var n=a(String(e),3);return r(n,t>>>0||(i.test(n)?16:10))}:r},10188:e=>{e.exports=function(e){try{return{e:!1,v:e()}}catch(e){return{e:!0,v:e}}}},50094:(e,t,n)=>{var r=n(27007),a=n(55286),s=n(43499);e.exports=function(e,t){if(r(e),a(t)&&t.constructor===e)return t;var n=s.f(e);return(0,n.resolve)(t),n.promise}},90681:e=>{e.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}},24408:(e,t,n)=>{var r=n(77234);e.exports=function(e,t,n){for(var a in t)r(e,a,t[a],n);return e}},77234:(e,t,n)=>{var r=n(3816),a=n(87728),s=n(79181),i=n(93953)("src"),o=n(40018),d="toString",u=(""+o).split(d);n(25645).inspectSource=function(e){return o.call(e)},(e.exports=function(e,t,n,o){var d="function"==typeof n;d&&(s(n,"name")||a(n,"name",t)),e[t]!==n&&(d&&(s(n,i)||a(n,i,e[t]?""+e[t]:u.join(String(t)))),e===r?e[t]=n:o?e[t]?e[t]=n:a(e,t,n):(delete e[t],a(e,t,n)))})(Function.prototype,d,(function(){return"function"==typeof this&&this[i]||o.call(this)}))},27787:(e,t,n)=>{"use strict";var r=n(41488),a=RegExp.prototype.exec;e.exports=function(e,t){var n=e.exec;if("function"==typeof n){var s=n.call(e,t);if("object"!=typeof s)throw new TypeError("RegExp exec method returned something other than an Object or null");return s}if("RegExp"!==r(e))throw new TypeError("RegExp#exec called on incompatible receiver");return a.call(e,t)}},21165:(e,t,n)=>{"use strict";var r,a,s=n(53218),i=RegExp.prototype.exec,o=String.prototype.replace,d=i,u="lastIndex",_=(r=/a/,a=/b*/g,i.call(r,"a"),i.call(a,"a"),0!==r[u]||0!==a[u]),l=void 0!==/()??/.exec("")[1];(_||l)&&(d=function(e){var t,n,r,a,d=this;return l&&(n=new RegExp("^"+d.source+"$(?!\\s)",s.call(d))),_&&(t=d[u]),r=i.call(d,e),_&&r&&(d[u]=d.global?r.index+r[0].length:t),l&&r&&r.length>1&&o.call(r[0],n,(function(){for(a=1;a<arguments.length-2;a++)void 0===arguments[a]&&(r[a]=void 0)})),r}),e.exports=d},27195:e=>{e.exports=Object.is||function(e,t){return e===t?0!==e||1/e==1/t:e!=e&&t!=t}},27375:(e,t,n)=>{var r=n(55286),a=n(27007),s=function(e,t){if(a(e),!r(t)&&null!==t)throw TypeError(t+": can't set as prototype!")};e.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(e,t,r){try{(r=n(741)(Function.call,n(18693).f(Object.prototype,"__proto__").set,2))(e,[]),t=!(e instanceof Array)}catch(e){t=!0}return function(e,n){return s(e,n),t?e.__proto__=n:r(e,n),e}}({},!1):void 0),check:s}},2974:(e,t,n)=>{"use strict";var r=n(3816),a=n(99275),s=n(67057),i=n(86314)("species");e.exports=function(e){var t=r[e];s&&t&&!t[i]&&a.f(t,i,{configurable:!0,get:function(){return this}})}},22943:(e,t,n)=>{var r=n(99275).f,a=n(79181),s=n(86314)("toStringTag");e.exports=function(e,t,n){e&&!a(e=n?e:e.prototype,s)&&r(e,s,{configurable:!0,value:t})}},69335:(e,t,n)=>{var r=n(3825)("keys"),a=n(93953);e.exports=function(e){return r[e]||(r[e]=a(e))}},3825:(e,t,n)=>{var r=n(25645),a=n(3816),s="__core-js_shared__",i=a[s]||(a[s]={});(e.exports=function(e,t){return i[e]||(i[e]=void 0!==t?t:{})})("versions",[]).push({version:r.version,mode:n(4461)?"pure":"global",copyright:"Â© 2020 Denis Pushkarev (zloirock.ru)"})},58364:(e,t,n)=>{var r=n(27007),a=n(24963),s=n(86314)("species");e.exports=function(e,t){var n,i=r(e).constructor;return void 0===i||null==(n=r(i)[s])?t:a(n)}},77717:(e,t,n)=>{"use strict";var r=n(74253);e.exports=function(e,t){return!!e&&r((function(){t?e.call(null,(function(){}),1):e.call(null)}))}},24496:(e,t,n)=>{var r=n(81467),a=n(91355);e.exports=function(e){return function(t,n){var s,i,o=String(a(t)),d=r(n),u=o.length;return d<0||d>=u?e?"":void 0:(s=o.charCodeAt(d))<55296||s>56319||d+1===u||(i=o.charCodeAt(d+1))<56320||i>57343?e?o.charAt(d):s:e?o.slice(d,d+2):i-56320+(s-55296<<10)+65536}}},42094:(e,t,n)=>{var r=n(55364),a=n(91355);e.exports=function(e,t,n){if(r(t))throw TypeError("String#"+n+" doesn't accept regex!");return String(a(e))}},29395:(e,t,n)=>{var r=n(42985),a=n(74253),s=n(91355),i=/"/g,o=function(e,t,n,r){var a=String(s(e)),o="<"+t;return""!==n&&(o+=" "+n+'="'+String(r).replace(i,"&quot;")+'"'),o+">"+a+"</"+t+">"};e.exports=function(e,t){var n={};n[e]=t(o),r(r.P+r.F*a((function(){var t=""[e]('"');return t!==t.toLowerCase()||t.split('"').length>3})),"String",n)}},75442:(e,t,n)=>{var r=n(10875),a=n(68595),s=n(91355);e.exports=function(e,t,n,i){var o=String(s(e)),d=o.length,u=void 0===n?" ":String(n),_=r(t);if(_<=d||""==u)return o;var l=_-d,c=a.call(u,Math.ceil(l/u.length));return c.length>l&&(c=c.slice(0,l)),i?c+o:o+c}},68595:(e,t,n)=>{"use strict";var r=n(81467),a=n(91355);e.exports=function(e){var t=String(a(this)),n="",s=r(e);if(s<0||s==1/0)throw RangeError("Count can't be negative");for(;s>0;(s>>>=1)&&(t+=t))1&s&&(n+=t);return n}},29599:(e,t,n)=>{var r=n(42985),a=n(91355),s=n(74253),i=n(84644),o="["+i+"]",d=RegExp("^"+o+o+"*"),u=RegExp(o+o+"*$"),_=function(e,t,n){var a={},o=s((function(){return!!i[e]()||"â€‹Â…"!="â€‹Â…"[e]()})),d=a[e]=o?t(l):i[e];n&&(a[n]=d),r(r.P+r.F*o,"String",a)},l=_.trim=function(e,t){return e=String(a(e)),1&t&&(e=e.replace(d,"")),2&t&&(e=e.replace(u,"")),e};e.exports=_},84644:e=>{e.exports="\t\n\v\f\r Â áš€á Žâ€€â€â€‚â€ƒâ€„â€…â€†â€‡â€ˆâ€‰â€Šâ€¯âŸã€€\u2028\u2029\ufeff"},74193:(e,t,n)=>{var r,a,s,i=n(741),o=n(97242),d=n(40639),u=n(62457),_=n(3816),l=_.process,c=_.setImmediate,m=_.clearImmediate,h=_.MessageChannel,f=_.Dispatch,y=0,p={},M="onreadystatechange",L=function(){var e=+this;if(p.hasOwnProperty(e)){var t=p[e];delete p[e],t()}},Y=function(e){L.call(e.data)};c&&m||(c=function(e){for(var t=[],n=1;arguments.length>n;)t.push(arguments[n++]);return p[++y]=function(){o("function"==typeof e?e:Function(e),t)},r(y),y},m=function(e){delete p[e]},"process"==n(92032)(l)?r=function(e){l.nextTick(i(L,e,1))}:f&&f.now?r=function(e){f.now(i(L,e,1))}:h?(s=(a=new h).port2,a.port1.onmessage=Y,r=i(s.postMessage,s,1)):_.addEventListener&&"function"==typeof postMessage&&!_.importScripts?(r=function(e){_.postMessage(e+"","*")},_.addEventListener("message",Y,!1)):r=M in u("script")?function(e){d.appendChild(u("script"))[M]=function(){d.removeChild(this),L.call(e)}}:function(e){setTimeout(i(L,e,1),0)}),e.exports={set:c,clear:m}},92337:(e,t,n)=>{var r=n(81467),a=Math.max,s=Math.min;e.exports=function(e,t){return(e=r(e))<0?a(e+t,0):s(e,t)}},94843:(e,t,n)=>{var r=n(81467),a=n(10875);e.exports=function(e){if(void 0===e)return 0;var t=r(e),n=a(t);if(t!==n)throw RangeError("Wrong length!");return n}},81467:e=>{var t=Math.ceil,n=Math.floor;e.exports=function(e){return isNaN(e=+e)?0:(e>0?n:t)(e)}},22110:(e,t,n)=>{var r=n(49797),a=n(91355);e.exports=function(e){return r(a(e))}},10875:(e,t,n)=>{var r=n(81467),a=Math.min;e.exports=function(e){return e>0?a(r(e),9007199254740991):0}},20508:(e,t,n)=>{var r=n(91355);e.exports=function(e){return Object(r(e))}},21689:(e,t,n)=>{var r=n(55286);e.exports=function(e,t){if(!r(e))return e;var n,a;if(t&&"function"==typeof(n=e.toString)&&!r(a=n.call(e)))return a;if("function"==typeof(n=e.valueOf)&&!r(a=n.call(e)))return a;if(!t&&"function"==typeof(n=e.toString)&&!r(a=n.call(e)))return a;throw TypeError("Can't convert object to primitive value")}},78440:(e,t,n)=>{"use strict";if(n(67057)){var r=n(4461),a=n(3816),s=n(74253),i=n(42985),o=n(89383),d=n(91125),u=n(741),_=n(83328),l=n(90681),c=n(87728),m=n(24408),h=n(81467),f=n(10875),y=n(94843),p=n(92337),M=n(21689),L=n(79181),Y=n(41488),g=n(55286),v=n(20508),k=n(86555),w=n(42503),b=n(468),D=n(20616).f,T=n(69002),S=n(93953),j=n(86314),x=n(10050),H=n(79315),O=n(58364),E=n(56997),P=n(87234),A=n(7462),F=n(2974),W=n(46852),N=n(5216),C=n(99275),R=n(18693),I=C.f,z=R.f,J=a.RangeError,U=a.TypeError,G=a.Uint8Array,q="ArrayBuffer",V="Shared"+q,B="BYTES_PER_ELEMENT",$="prototype",K=Array[$],Z=d.ArrayBuffer,Q=d.DataView,X=x(0),ee=x(2),te=x(3),ne=x(4),re=x(5),ae=x(6),se=H(!0),ie=H(!1),oe=E.values,de=E.keys,ue=E.entries,_e=K.lastIndexOf,le=K.reduce,ce=K.reduceRight,me=K.join,he=K.sort,fe=K.slice,ye=K.toString,pe=K.toLocaleString,Me=j("iterator"),Le=j("toStringTag"),Ye=S("typed_constructor"),ge=S("def_constructor"),ve=o.CONSTR,ke=o.TYPED,we=o.VIEW,be="Wrong length!",De=x(1,(function(e,t){return He(O(e,e[ge]),t)})),Te=s((function(){return 1===new G(new Uint16Array([1]).buffer)[0]})),Se=!!G&&!!G[$].set&&s((function(){new G(1).set({})})),je=function(e,t){var n=h(e);if(n<0||n%t)throw J("Wrong offset!");return n},xe=function(e){if(g(e)&&ke in e)return e;throw U(e+" is not a typed array!")},He=function(e,t){if(!g(e)||!(Ye in e))throw U("It is not a typed array constructor!");return new e(t)},Oe=function(e,t){return Ee(O(e,e[ge]),t)},Ee=function(e,t){for(var n=0,r=t.length,a=He(e,r);r>n;)a[n]=t[n++];return a},Pe=function(e,t,n){I(e,t,{get:function(){return this._d[n]}})},Ae=function(e){var t,n,r,a,s,i,o=v(e),d=arguments.length,_=d>1?arguments[1]:void 0,l=void 0!==_,c=T(o);if(null!=c&&!k(c)){for(i=c.call(o),r=[],t=0;!(s=i.next()).done;t++)r.push(s.value);o=r}for(l&&d>2&&(_=u(_,arguments[2],2)),t=0,n=f(o.length),a=He(this,n);n>t;t++)a[t]=l?_(o[t],t):o[t];return a},Fe=function(){for(var e=0,t=arguments.length,n=He(this,t);t>e;)n[e]=arguments[e++];return n},We=!!G&&s((function(){pe.call(new G(1))})),Ne=function(){return pe.apply(We?fe.call(xe(this)):xe(this),arguments)},Ce={copyWithin:function(e,t){return N.call(xe(this),e,t,arguments.length>2?arguments[2]:void 0)},every:function(e){return ne(xe(this),e,arguments.length>1?arguments[1]:void 0)},fill:function(e){return W.apply(xe(this),arguments)},filter:function(e){return Oe(this,ee(xe(this),e,arguments.length>1?arguments[1]:void 0))},find:function(e){return re(xe(this),e,arguments.length>1?arguments[1]:void 0)},findIndex:function(e){return ae(xe(this),e,arguments.length>1?arguments[1]:void 0)},forEach:function(e){X(xe(this),e,arguments.length>1?arguments[1]:void 0)},indexOf:function(e){return ie(xe(this),e,arguments.length>1?arguments[1]:void 0)},includes:function(e){return se(xe(this),e,arguments.length>1?arguments[1]:void 0)},join:function(e){return me.apply(xe(this),arguments)},lastIndexOf:function(e){return _e.apply(xe(this),arguments)},map:function(e){return De(xe(this),e,arguments.length>1?arguments[1]:void 0)},reduce:function(e){return le.apply(xe(this),arguments)},reduceRight:function(e){return ce.apply(xe(this),arguments)},reverse:function(){for(var e,t=this,n=xe(t).length,r=Math.floor(n/2),a=0;a<r;)e=t[a],t[a++]=t[--n],t[n]=e;return t},some:function(e){return te(xe(this),e,arguments.length>1?arguments[1]:void 0)},sort:function(e){return he.call(xe(this),e)},subarray:function(e,t){var n=xe(this),r=n.length,a=p(e,r);return new(O(n,n[ge]))(n.buffer,n.byteOffset+a*n.BYTES_PER_ELEMENT,f((void 0===t?r:p(t,r))-a))}},Re=function(e,t){return Oe(this,fe.call(xe(this),e,t))},Ie=function(e){xe(this);var t=je(arguments[1],1),n=this.length,r=v(e),a=f(r.length),s=0;if(a+t>n)throw J(be);for(;s<a;)this[t+s]=r[s++]},ze={entries:function(){return ue.call(xe(this))},keys:function(){return de.call(xe(this))},values:function(){return oe.call(xe(this))}},Je=function(e,t){return g(e)&&e[ke]&&"symbol"!=typeof t&&t in e&&String(+t)==String(t)},Ue=function(e,t){return Je(e,t=M(t,!0))?l(2,e[t]):z(e,t)},Ge=function(e,t,n){return!(Je(e,t=M(t,!0))&&g(n)&&L(n,"value"))||L(n,"get")||L(n,"set")||n.configurable||L(n,"writable")&&!n.writable||L(n,"enumerable")&&!n.enumerable?I(e,t,n):(e[t]=n.value,e)};ve||(R.f=Ue,C.f=Ge),i(i.S+i.F*!ve,"Object",{getOwnPropertyDescriptor:Ue,defineProperty:Ge}),s((function(){ye.call({})}))&&(ye=pe=function(){return me.call(this)});var qe=m({},Ce);m(qe,ze),c(qe,Me,ze.values),m(qe,{slice:Re,set:Ie,constructor:function(){},toString:ye,toLocaleString:Ne}),Pe(qe,"buffer","b"),Pe(qe,"byteOffset","o"),Pe(qe,"byteLength","l"),Pe(qe,"length","e"),I(qe,Le,{get:function(){return this[ke]}}),e.exports=function(e,t,n,d){var u=e+((d=!!d)?"Clamped":"")+"Array",l="get"+e,m="set"+e,h=a[u],p=h||{},M=h&&b(h),L=!h||!o.ABV,v={},k=h&&h[$],T=function(e,n){I(e,n,{get:function(){return function(e,n){var r=e._d;return r.v[l](n*t+r.o,Te)}(this,n)},set:function(e){return function(e,n,r){var a=e._d;d&&(r=(r=Math.round(r))<0?0:r>255?255:255&r),a.v[m](n*t+a.o,r,Te)}(this,n,e)},enumerable:!0})};L?(h=n((function(e,n,r,a){_(e,h,u,"_d");var s,i,o,d,l=0,m=0;if(g(n)){if(!(n instanceof Z||(d=Y(n))==q||d==V))return ke in n?Ee(h,n):Ae.call(h,n);s=n,m=je(r,t);var p=n.byteLength;if(void 0===a){if(p%t)throw J(be);if((i=p-m)<0)throw J(be)}else if((i=f(a)*t)+m>p)throw J(be);o=i/t}else o=y(n),s=new Z(i=o*t);for(c(e,"_d",{b:s,o:m,l:i,e:o,v:new Q(s)});l<o;)T(e,l++)})),k=h[$]=w(qe),c(k,"constructor",h)):s((function(){h(1)}))&&s((function(){new h(-1)}))&&A((function(e){new h,new h(null),new h(1.5),new h(e)}),!0)||(h=n((function(e,n,r,a){var s;return _(e,h,u),g(n)?n instanceof Z||(s=Y(n))==q||s==V?void 0!==a?new p(n,je(r,t),a):void 0!==r?new p(n,je(r,t)):new p(n):ke in n?Ee(h,n):Ae.call(h,n):new p(y(n))})),X(M!==Function.prototype?D(p).concat(D(M)):D(p),(function(e){e in h||c(h,e,p[e])})),h[$]=k,r||(k.constructor=h));var S=k[Me],j=!!S&&("values"==S.name||null==S.name),x=ze.values;c(h,Ye,!0),c(k,ke,u),c(k,we,!0),c(k,ge,h),(d?new h(1)[Le]==u:Le in k)||I(k,Le,{get:function(){return u}}),v[u]=h,i(i.G+i.W+i.F*(h!=p),v),i(i.S,u,{BYTES_PER_ELEMENT:t}),i(i.S+i.F*s((function(){p.of.call(h,1)})),u,{from:Ae,of:Fe}),B in k||c(k,B,t),i(i.P,u,Ce),F(u),i(i.P+i.F*Se,u,{set:Ie}),i(i.P+i.F*!j,u,ze),r||k.toString==ye||(k.toString=ye),i(i.P+i.F*s((function(){new h(1).slice()})),u,{slice:Re}),i(i.P+i.F*(s((function(){return[1,2].toLocaleString()!=new h([1,2]).toLocaleString()}))||!s((function(){k.toLocaleString.call([1,2])}))),u,{toLocaleString:Ne}),P[u]=j?S:x,r||j||c(k,Me,x)}}else e.exports=function(){}},91125:(e,t,n)=>{"use strict";var r=n(3816),a=n(67057),s=n(4461),i=n(89383),o=n(87728),d=n(24408),u=n(74253),_=n(83328),l=n(81467),c=n(10875),m=n(94843),h=n(20616).f,f=n(99275).f,y=n(46852),p=n(22943),M="ArrayBuffer",L="DataView",Y="prototype",g="Wrong index!",v=r[M],k=r[L],w=r.Math,b=r.RangeError,D=r.Infinity,T=v,S=w.abs,j=w.pow,x=w.floor,H=w.log,O=w.LN2,E="buffer",P="byteLength",A="byteOffset",F=a?"_b":E,W=a?"_l":P,N=a?"_o":A;function C(e,t,n){var r,a,s,i=new Array(n),o=8*n-t-1,d=(1<<o)-1,u=d>>1,_=23===t?j(2,-24)-j(2,-77):0,l=0,c=e<0||0===e&&1/e<0?1:0;for((e=S(e))!=e||e===D?(a=e!=e?1:0,r=d):(r=x(H(e)/O),e*(s=j(2,-r))<1&&(r--,s*=2),(e+=r+u>=1?_/s:_*j(2,1-u))*s>=2&&(r++,s/=2),r+u>=d?(a=0,r=d):r+u>=1?(a=(e*s-1)*j(2,t),r+=u):(a=e*j(2,u-1)*j(2,t),r=0));t>=8;i[l++]=255&a,a/=256,t-=8);for(r=r<<t|a,o+=t;o>0;i[l++]=255&r,r/=256,o-=8);return i[--l]|=128*c,i}function R(e,t,n){var r,a=8*n-t-1,s=(1<<a)-1,i=s>>1,o=a-7,d=n-1,u=e[d--],_=127&u;for(u>>=7;o>0;_=256*_+e[d],d--,o-=8);for(r=_&(1<<-o)-1,_>>=-o,o+=t;o>0;r=256*r+e[d],d--,o-=8);if(0===_)_=1-i;else{if(_===s)return r?NaN:u?-D:D;r+=j(2,t),_-=i}return(u?-1:1)*r*j(2,_-t)}function I(e){return e[3]<<24|e[2]<<16|e[1]<<8|e[0]}function z(e){return[255&e]}function J(e){return[255&e,e>>8&255]}function U(e){return[255&e,e>>8&255,e>>16&255,e>>24&255]}function G(e){return C(e,52,8)}function q(e){return C(e,23,4)}function V(e,t,n){f(e[Y],t,{get:function(){return this[n]}})}function B(e,t,n,r){var a=m(+n);if(a+t>e[W])throw b(g);var s=e[F]._b,i=a+e[N],o=s.slice(i,i+t);return r?o:o.reverse()}function $(e,t,n,r,a,s){var i=m(+n);if(i+t>e[W])throw b(g);for(var o=e[F]._b,d=i+e[N],u=r(+a),_=0;_<t;_++)o[d+_]=u[s?_:t-_-1]}if(i.ABV){if(!u((function(){v(1)}))||!u((function(){new v(-1)}))||u((function(){return new v,new v(1.5),new v(NaN),v.name!=M}))){for(var K,Z=(v=function(e){return _(this,v),new T(m(e))})[Y]=T[Y],Q=h(T),X=0;Q.length>X;)(K=Q[X++])in v||o(v,K,T[K]);s||(Z.constructor=v)}var ee=new k(new v(2)),te=k[Y].setInt8;ee.setInt8(0,2147483648),ee.setInt8(1,2147483649),!ee.getInt8(0)&&ee.getInt8(1)||d(k[Y],{setInt8:function(e,t){te.call(this,e,t<<24>>24)},setUint8:function(e,t){te.call(this,e,t<<24>>24)}},!0)}else v=function(e){_(this,v,M);var t=m(e);this._b=y.call(new Array(t),0),this[W]=t},k=function(e,t,n){_(this,k,L),_(e,v,L);var r=e[W],a=l(t);if(a<0||a>r)throw b("Wrong offset!");if(a+(n=void 0===n?r-a:c(n))>r)throw b("Wrong length!");this[F]=e,this[N]=a,this[W]=n},a&&(V(v,P,"_l"),V(k,E,"_b"),V(k,P,"_l"),V(k,A,"_o")),d(k[Y],{getInt8:function(e){return B(this,1,e)[0]<<24>>24},getUint8:function(e){return B(this,1,e)[0]},getInt16:function(e){var t=B(this,2,e,arguments[1]);return(t[1]<<8|t[0])<<16>>16},getUint16:function(e){var t=B(this,2,e,arguments[1]);return t[1]<<8|t[0]},getInt32:function(e){return I(B(this,4,e,arguments[1]))},getUint32:function(e){return I(B(this,4,e,arguments[1]))>>>0},getFloat32:function(e){return R(B(this,4,e,arguments[1]),23,4)},getFloat64:function(e){return R(B(this,8,e,arguments[1]),52,8)},setInt8:function(e,t){$(this,1,e,z,t)},setUint8:function(e,t){$(this,1,e,z,t)},setInt16:function(e,t){$(this,2,e,J,t,arguments[2])},setUint16:function(e,t){$(this,2,e,J,t,arguments[2])},setInt32:function(e,t){$(this,4,e,U,t,arguments[2])},setUint32:function(e,t){$(this,4,e,U,t,arguments[2])},setFloat32:function(e,t){$(this,4,e,q,t,arguments[2])},setFloat64:function(e,t){$(this,8,e,G,t,arguments[2])}});p(v,M),p(k,L),o(k[Y],i.VIEW,!0),t[M]=v,t[L]=k},89383:(e,t,n)=>{for(var r,a=n(3816),s=n(87728),i=n(93953),o=i("typed_array"),d=i("view"),u=!(!a.ArrayBuffer||!a.DataView),_=u,l=0,c="Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array".split(",");l<9;)(r=a[c[l++]])?(s(r.prototype,o,!0),s(r.prototype,d,!0)):_=!1;e.exports={ABV:u,CONSTR:_,TYPED:o,VIEW:d}},93953:e=>{var t=0,n=Math.random();e.exports=function(e){return"Symbol(".concat(void 0===e?"":e,")_",(++t+n).toString(36))}},30575:(e,t,n)=>{var r=n(3816).navigator;e.exports=r&&r.userAgent||""},1616:(e,t,n)=>{var r=n(55286);e.exports=function(e,t){if(!r(e)||e._t!==t)throw TypeError("Incompatible receiver, "+t+" required!");return e}},36074:(e,t,n)=>{var r=n(3816),a=n(25645),s=n(4461),i=n(28787),o=n(99275).f;e.exports=function(e){var t=a.Symbol||(a.Symbol=s?{}:r.Symbol||{});"_"==e.charAt(0)||e in t||o(t,e,{value:i.f(e)})}},28787:(e,t,n)=>{t.f=n(86314)},86314:(e,t,n)=>{var r=n(3825)("wks"),a=n(93953),s=n(3816).Symbol,i="function"==typeof s;(e.exports=function(e){return r[e]||(r[e]=i&&s[e]||(i?s:a)("Symbol."+e))}).store=r},69002:(e,t,n)=>{var r=n(41488),a=n(86314)("iterator"),s=n(87234);e.exports=n(25645).getIteratorMethod=function(e){if(null!=e)return e[a]||e["@@iterator"]||s[r(e)]}},32e3:(e,t,n)=>{var r=n(42985);r(r.P,"Array",{copyWithin:n(5216)}),n(17722)("copyWithin")},15745:(e,t,n)=>{"use strict";var r=n(42985),a=n(10050)(4);r(r.P+r.F*!n(77717)([].every,!0),"Array",{every:function(e){return a(this,e,arguments[1])}})},48977:(e,t,n)=>{var r=n(42985);r(r.P,"Array",{fill:n(46852)}),n(17722)("fill")},98837:(e,t,n)=>{"use strict";var r=n(42985),a=n(10050)(2);r(r.P+r.F*!n(77717)([].filter,!0),"Array",{filter:function(e){return a(this,e,arguments[1])}})},94899:(e,t,n)=>{"use strict";var r=n(42985),a=n(10050)(6),s="findIndex",i=!0;s in[]&&Array(1)[s]((function(){i=!1})),r(r.P+r.F*i,"Array",{findIndex:function(e){return a(this,e,arguments.length>1?arguments[1]:void 0)}}),n(17722)(s)},52310:(e,t,n)=>{"use strict";var r=n(42985),a=n(10050)(5),s="find",i=!0;s in[]&&Array(1)[s]((function(){i=!1})),r(r.P+r.F*i,"Array",{find:function(e){return a(this,e,arguments.length>1?arguments[1]:void 0)}}),n(17722)(s)},24336:(e,t,n)=>{"use strict";var r=n(42985),a=n(10050)(0),s=n(77717)([].forEach,!0);r(r.P+r.F*!s,"Array",{forEach:function(e){return a(this,e,arguments[1])}})},30522:(e,t,n)=>{"use strict";var r=n(741),a=n(42985),s=n(20508),i=n(28851),o=n(86555),d=n(10875),u=n(92811),_=n(69002);a(a.S+a.F*!n(7462)((function(e){Array.from(e)})),"Array",{from:function(e){var t,n,a,l,c=s(e),m="function"==typeof this?this:Array,h=arguments.length,f=h>1?arguments[1]:void 0,y=void 0!==f,p=0,M=_(c);if(y&&(f=r(f,h>2?arguments[2]:void 0,2)),null==M||m==Array&&o(M))for(n=new m(t=d(c.length));t>p;p++)u(n,p,y?f(c[p],p):c[p]);else for(l=M.call(c),n=new m;!(a=l.next()).done;p++)u(n,p,y?i(l,f,[a.value,p],!0):a.value);return n.length=p,n}})},23369:(e,t,n)=>{"use strict";var r=n(42985),a=n(79315)(!1),s=[].indexOf,i=!!s&&1/[1].indexOf(1,-0)<0;r(r.P+r.F*(i||!n(77717)(s)),"Array",{indexOf:function(e){return i?s.apply(this,arguments)||0:a(this,e,arguments[1])}})},20774:(e,t,n)=>{var r=n(42985);r(r.S,"Array",{isArray:n(4302)})},56997:(e,t,n)=>{"use strict";var r=n(17722),a=n(15436),s=n(87234),i=n(22110);e.exports=n(42923)(Array,"Array",(function(e,t){this._t=i(e),this._i=0,this._k=t}),(function(){var e=this._t,t=this._k,n=this._i++;return!e||n>=e.length?(this._t=void 0,a(1)):a(0,"keys"==t?n:"values"==t?e[n]:[n,e[n]])}),"values"),s.Arguments=s.Array,r("keys"),r("values"),r("entries")},87842:(e,t,n)=>{"use strict";var r=n(42985),a=n(22110),s=[].join;r(r.P+r.F*(n(49797)!=Object||!n(77717)(s)),"Array",{join:function(e){return s.call(a(this),void 0===e?",":e)}})},99564:(e,t,n)=>{"use strict";var r=n(42985),a=n(22110),s=n(81467),i=n(10875),o=[].lastIndexOf,d=!!o&&1/[1].lastIndexOf(1,-0)<0;r(r.P+r.F*(d||!n(77717)(o)),"Array",{lastIndexOf:function(e){if(d)return o.apply(this,arguments)||0;var t=a(this),n=i(t.length),r=n-1;for(arguments.length>1&&(r=Math.min(r,s(arguments[1]))),r<0&&(r=n+r);r>=0;r--)if(r in t&&t[r]===e)return r||0;return-1}})},19371:(e,t,n)=>{"use strict";var r=n(42985),a=n(10050)(1);r(r.P+r.F*!n(77717)([].map,!0),"Array",{map:function(e){return a(this,e,arguments[1])}})},58295:(e,t,n)=>{"use strict";var r=n(42985),a=n(92811);r(r.S+r.F*n(74253)((function(){function e(){}return!(Array.of.call(e)instanceof e)})),"Array",{of:function(){for(var e=0,t=arguments.length,n=new("function"==typeof this?this:Array)(t);t>e;)a(n,e,arguments[e++]);return n.length=t,n}})},3750:(e,t,n)=>{"use strict";var r=n(42985),a=n(37628);r(r.P+r.F*!n(77717)([].reduceRight,!0),"Array",{reduceRight:function(e){return a(this,e,arguments.length,arguments[1],!0)}})},33057:(e,t,n)=>{"use strict";var r=n(42985),a=n(37628);r(r.P+r.F*!n(77717)([].reduce,!0),"Array",{reduce:function(e){return a(this,e,arguments.length,arguments[1],!1)}})},50110:(e,t,n)=>{"use strict";var r=n(42985),a=n(40639),s=n(92032),i=n(92337),o=n(10875),d=[].slice;r(r.P+r.F*n(74253)((function(){a&&d.call(a)})),"Array",{slice:function(e,t){var n=o(this.length),r=s(this);if(t=void 0===t?n:t,"Array"==r)return d.call(this,e,t);for(var a=i(e,n),u=i(t,n),_=o(u-a),l=new Array(_),c=0;c<_;c++)l[c]="String"==r?this.charAt(a+c):this[a+c];return l}})},26773:(e,t,n)=>{"use strict";var r=n(42985),a=n(10050)(3);r(r.P+r.F*!n(77717)([].some,!0),"Array",{some:function(e){return a(this,e,arguments[1])}})},20075:(e,t,n)=>{"use strict";var r=n(42985),a=n(24963),s=n(20508),i=n(74253),o=[].sort,d=[1,2,3];r(r.P+r.F*(i((function(){d.sort(void 0)}))||!i((function(){d.sort(null)}))||!n(77717)(o)),"Array",{sort:function(e){return void 0===e?o.call(s(this)):o.call(s(this),a(e))}})},31842:(e,t,n)=>{n(2974)("Array")},81822:(e,t,n)=>{var r=n(42985);r(r.S,"Date",{now:function(){return(new Date).getTime()}})},91031:(e,t,n)=>{var r=n(42985),a=n(53537);r(r.P+r.F*(Date.prototype.toISOString!==a),"Date",{toISOString:a})},19977:(e,t,n)=>{"use strict";var r=n(42985),a=n(20508),s=n(21689);r(r.P+r.F*n(74253)((function(){return null!==new Date(NaN).toJSON()||1!==Date.prototype.toJSON.call({toISOString:function(){return 1}})})),"Date",{toJSON:function(e){var t=a(this),n=s(t);return"number"!=typeof n||isFinite(n)?t.toISOString():null}})},41560:(e,t,n)=>{var r=n(86314)("toPrimitive"),a=Date.prototype;r in a||n(87728)(a,r,n(870))},46331:(e,t,n)=>{var r=Date.prototype,a="Invalid Date",s="toString",i=r[s],o=r.getTime;new Date(NaN)+""!=a&&n(77234)(r,s,(function(){var e=o.call(this);return e==e?i.call(this):a}))},39730:(e,t,n)=>{var r=n(42985);r(r.P,"Function",{bind:n(34398)})},48377:(e,t,n)=>{"use strict";var r=n(55286),a=n(468),s=n(86314)("hasInstance"),i=Function.prototype;s in i||n(99275).f(i,s,{value:function(e){if("function"!=typeof this||!r(e))return!1;if(!r(this.prototype))return e instanceof this;for(;e=a(e);)if(this.prototype===e)return!0;return!1}})},6059:(e,t,n)=>{var r=n(99275).f,a=Function.prototype,s=/^\s*function ([^ (]*)/,i="name";i in a||n(67057)&&r(a,i,{configurable:!0,get:function(){try{return(""+this).match(s)[1]}catch(e){return""}}})},88416:(e,t,n)=>{"use strict";var r=n(9824),a=n(1616),s="Map";e.exports=n(45795)(s,(function(e){return function(){return e(this,arguments.length>0?arguments[0]:void 0)}}),{get:function(e){var t=r.getEntry(a(this,s),e);return t&&t.v},set:function(e,t){return r.def(a(this,s),0===e?0:e,t)}},r,!0)},76503:(e,t,n)=>{var r=n(42985),a=n(46206),s=Math.sqrt,i=Math.acosh;r(r.S+r.F*!(i&&710==Math.floor(i(Number.MAX_VALUE))&&i(1/0)==1/0),"Math",{acosh:function(e){return(e=+e)<1?NaN:e>94906265.62425156?Math.log(e)+Math.LN2:a(e-1+s(e-1)*s(e+1))}})},66786:(e,t,n)=>{var r=n(42985),a=Math.asinh;r(r.S+r.F*!(a&&1/a(0)>0),"Math",{asinh:function e(t){return isFinite(t=+t)&&0!=t?t<0?-e(-t):Math.log(t+Math.sqrt(t*t+1)):t}})},50932:(e,t,n)=>{var r=n(42985),a=Math.atanh;r(r.S+r.F*!(a&&1/a(-0)<0),"Math",{atanh:function(e){return 0==(e=+e)?e:Math.log((1+e)/(1-e))/2}})},57526:(e,t,n)=>{var r=n(42985),a=n(61801);r(r.S,"Math",{cbrt:function(e){return a(e=+e)*Math.pow(Math.abs(e),1/3)}})},21591:(e,t,n)=>{var r=n(42985);r(r.S,"Math",{clz32:function(e){return(e>>>=0)?31-Math.floor(Math.log(e+.5)*Math.LOG2E):32}})},9073:(e,t,n)=>{var r=n(42985),a=Math.exp;r(r.S,"Math",{cosh:function(e){return(a(e=+e)+a(-e))/2}})},80347:(e,t,n)=>{var r=n(42985),a=n(13086);r(r.S+r.F*(a!=Math.expm1),"Math",{expm1:a})},30579:(e,t,n)=>{var r=n(42985);r(r.S,"Math",{fround:n(34934)})},4669:(e,t,n)=>{var r=n(42985),a=Math.abs;r(r.S,"Math",{hypot:function(e,t){for(var n,r,s=0,i=0,o=arguments.length,d=0;i<o;)d<(n=a(arguments[i++]))?(s=s*(r=d/n)*r+1,d=n):s+=n>0?(r=n/d)*r:n;return d===1/0?1/0:d*Math.sqrt(s)}})},67710:(e,t,n)=>{var r=n(42985),a=Math.imul;r(r.S+r.F*n(74253)((function(){return-5!=a(4294967295,5)||2!=a.length})),"Math",{imul:function(e,t){var n=65535,r=+e,a=+t,s=n&r,i=n&a;return 0|s*i+((n&r>>>16)*i+s*(n&a>>>16)<<16>>>0)}})},45789:(e,t,n)=>{var r=n(42985);r(r.S,"Math",{log10:function(e){return Math.log(e)*Math.LOG10E}})},33514:(e,t,n)=>{var r=n(42985);r(r.S,"Math",{log1p:n(46206)})},99978:(e,t,n)=>{var r=n(42985);r(r.S,"Math",{log2:function(e){return Math.log(e)/Math.LN2}})},58472:(e,t,n)=>{var r=n(42985);r(r.S,"Math",{sign:n(61801)})},86946:(e,t,n)=>{var r=n(42985),a=n(13086),s=Math.exp;r(r.S+r.F*n(74253)((function(){return-2e-17!=!Math.sinh(-2e-17)})),"Math",{sinh:function(e){return Math.abs(e=+e)<1?(a(e)-a(-e))/2:(s(e-1)-s(-e-1))*(Math.E/2)}})},35068:(e,t,n)=>{var r=n(42985),a=n(13086),s=Math.exp;r(r.S,"Math",{tanh:function(e){var t=a(e=+e),n=a(-e);return t==1/0?1:n==1/0?-1:(t-n)/(s(e)+s(-e))}})},413:(e,t,n)=>{var r=n(42985);r(r.S,"Math",{trunc:function(e){return(e>0?Math.floor:Math.ceil)(e)}})},11246:(e,t,n)=>{"use strict";var r=n(3816),a=n(79181),s=n(92032),i=n(40266),o=n(21689),d=n(74253),u=n(20616).f,_=n(18693).f,l=n(99275).f,c=n(29599).trim,m="Number",h=r[m],f=h,y=h.prototype,p=s(n(42503)(y))==m,M="trim"in String.prototype,L=function(e){var t=o(e,!1);if("string"==typeof t&&t.length>2){var n,r,a,s=(t=M?t.trim():c(t,3)).charCodeAt(0);if(43===s||45===s){if(88===(n=t.charCodeAt(2))||120===n)return NaN}else if(48===s){switch(t.charCodeAt(1)){case 66:case 98:r=2,a=49;break;case 79:case 111:r=8,a=55;break;default:return+t}for(var i,d=t.slice(2),u=0,_=d.length;u<_;u++)if((i=d.charCodeAt(u))<48||i>a)return NaN;return parseInt(d,r)}}return+t};if(!h(" 0o1")||!h("0b1")||h("+0x1")){h=function(e){var t=arguments.length<1?0:e,n=this;return n instanceof h&&(p?d((function(){y.valueOf.call(n)})):s(n)!=m)?i(new f(L(t)),n,h):L(t)};for(var Y,g=n(67057)?u(f):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),v=0;g.length>v;v++)a(f,Y=g[v])&&!a(h,Y)&&l(h,Y,_(f,Y));h.prototype=y,y.constructor=h,n(77234)(r,m,h)}},75972:(e,t,n)=>{var r=n(42985);r(r.S,"Number",{EPSILON:Math.pow(2,-52)})},53403:(e,t,n)=>{var r=n(42985),a=n(3816).isFinite;r(r.S,"Number",{isFinite:function(e){return"number"==typeof e&&a(e)}})},92516:(e,t,n)=>{var r=n(42985);r(r.S,"Number",{isInteger:n(18367)})},49371:(e,t,n)=>{var r=n(42985);r(r.S,"Number",{isNaN:function(e){return e!=e}})},86479:(e,t,n)=>{var r=n(42985),a=n(18367),s=Math.abs;r(r.S,"Number",{isSafeInteger:function(e){return a(e)&&s(e)<=9007199254740991}})},91736:(e,t,n)=>{var r=n(42985);r(r.S,"Number",{MAX_SAFE_INTEGER:9007199254740991})},51889:(e,t,n)=>{var r=n(42985);r(r.S,"Number",{MIN_SAFE_INTEGER:-9007199254740991})},65177:(e,t,n)=>{var r=n(42985),a=n(47743);r(r.S+r.F*(Number.parseFloat!=a),"Number",{parseFloat:a})},81246:(e,t,n)=>{var r=n(42985),a=n(55960);r(r.S+r.F*(Number.parseInt!=a),"Number",{parseInt:a})},30726:(e,t,n)=>{"use strict";var r=n(42985),a=n(81467),s=n(83365),i=n(68595),o=1..toFixed,d=Math.floor,u=[0,0,0,0,0,0],_="Number.toFixed: incorrect invocation!",l="0",c=function(e,t){for(var n=-1,r=t;++n<6;)r+=e*u[n],u[n]=r%1e7,r=d(r/1e7)},m=function(e){for(var t=6,n=0;--t>=0;)n+=u[t],u[t]=d(n/e),n=n%e*1e7},h=function(){for(var e=6,t="";--e>=0;)if(""!==t||0===e||0!==u[e]){var n=String(u[e]);t=""===t?n:t+i.call(l,7-n.length)+n}return t},f=function(e,t,n){return 0===t?n:t%2==1?f(e,t-1,n*e):f(e*e,t/2,n)};r(r.P+r.F*(!!o&&("0.000"!==8e-5.toFixed(3)||"1"!==.9.toFixed(0)||"1.25"!==1.255.toFixed(2)||"1000000000000000128"!==(0xde0b6b3a7640080).toFixed(0))||!n(74253)((function(){o.call({})}))),"Number",{toFixed:function(e){var t,n,r,o,d=s(this,_),u=a(e),y="",p=l;if(u<0||u>20)throw RangeError(_);if(d!=d)return"NaN";if(d<=-1e21||d>=1e21)return String(d);if(d<0&&(y="-",d=-d),d>1e-21)if(t=function(e){for(var t=0,n=e;n>=4096;)t+=12,n/=4096;for(;n>=2;)t+=1,n/=2;return t}(d*f(2,69,1))-69,n=t<0?d*f(2,-t,1):d/f(2,t,1),n*=4503599627370496,(t=52-t)>0){for(c(0,n),r=u;r>=7;)c(1e7,0),r-=7;for(c(f(10,r,1),0),r=t-1;r>=23;)m(1<<23),r-=23;m(1<<r),c(1,1),m(2),p=h()}else c(0,n),c(1<<-t,0),p=h()+i.call(l,u);return u>0?y+((o=p.length)<=u?"0."+i.call(l,u-o)+p:p.slice(0,o-u)+"."+p.slice(o-u)):y+p}})},1901:(e,t,n)=>{"use strict";var r=n(42985),a=n(74253),s=n(83365),i=1..toPrecision;r(r.P+r.F*(a((function(){return"1"!==i.call(1,void 0)}))||!a((function(){i.call({})}))),"Number",{toPrecision:function(e){var t=s(this,"Number#toPrecision: incorrect invocation!");return void 0===e?i.call(t):i.call(t,e)}})},75115:(e,t,n)=>{var r=n(42985);r(r.S+r.F,"Object",{assign:n(35345)})},68132:(e,t,n)=>{var r=n(42985);r(r.S,"Object",{create:n(42503)})},37470:(e,t,n)=>{var r=n(42985);r(r.S+r.F*!n(67057),"Object",{defineProperties:n(35588)})},48388:(e,t,n)=>{var r=n(42985);r(r.S+r.F*!n(67057),"Object",{defineProperty:n(99275).f})},89375:(e,t,n)=>{var r=n(55286),a=n(84728).onFreeze;n(33160)("freeze",(function(e){return function(t){return e&&r(t)?e(a(t)):t}}))},94882:(e,t,n)=>{var r=n(22110),a=n(18693).f;n(33160)("getOwnPropertyDescriptor",(function(){return function(e,t){return a(r(e),t)}}))},79622:(e,t,n)=>{n(33160)("getOwnPropertyNames",(function(){return n(39327).f}))},41520:(e,t,n)=>{var r=n(20508),a=n(468);n(33160)("getPrototypeOf",(function(){return function(e){return a(r(e))}}))},49892:(e,t,n)=>{var r=n(55286);n(33160)("isExtensible",(function(e){return function(t){return!!r(t)&&(!e||e(t))}}))},64157:(e,t,n)=>{var r=n(55286);n(33160)("isFrozen",(function(e){return function(t){return!r(t)||!!e&&e(t)}}))},35095:(e,t,n)=>{var r=n(55286);n(33160)("isSealed",(function(e){return function(t){return!r(t)||!!e&&e(t)}}))},99176:(e,t,n)=>{var r=n(42985);r(r.S,"Object",{is:n(27195)})},27476:(e,t,n)=>{var r=n(20508),a=n(47184);n(33160)("keys",(function(){return function(e){return a(r(e))}}))},84672:(e,t,n)=>{var r=n(55286),a=n(84728).onFreeze;n(33160)("preventExtensions",(function(e){return function(t){return e&&r(t)?e(a(t)):t}}))},43533:(e,t,n)=>{var r=n(55286),a=n(84728).onFreeze;n(33160)("seal",(function(e){return function(t){return e&&r(t)?e(a(t)):t}}))},68838:(e,t,n)=>{var r=n(42985);r(r.S,"Object",{setPrototypeOf:n(27375).set})},96253:(e,t,n)=>{"use strict";var r=n(41488),a={};a[n(86314)("toStringTag")]="z",a+""!="[object z]"&&n(77234)(Object.prototype,"toString",(function(){return"[object "+r(this)+"]"}),!0)},64299:(e,t,n)=>{var r=n(42985),a=n(47743);r(r.G+r.F*(parseFloat!=a),{parseFloat:a})},71084:(e,t,n)=>{var r=n(42985),a=n(55960);r(r.G+r.F*(parseInt!=a),{parseInt:a})},40851:(e,t,n)=>{"use strict";var r,a,s,i,o=n(4461),d=n(3816),u=n(741),_=n(41488),l=n(42985),c=n(55286),m=n(24963),h=n(83328),f=n(3531),y=n(58364),p=n(74193).set,M=n(14351)(),L=n(43499),Y=n(10188),g=n(30575),v=n(50094),k="Promise",w=d.TypeError,b=d.process,D=b&&b.versions,T=D&&D.v8||"",S=d[k],j="process"==_(b),x=function(){},H=a=L.f,O=!!function(){try{var e=S.resolve(1),t=(e.constructor={})[n(86314)("species")]=function(e){e(x,x)};return(j||"function"==typeof PromiseRejectionEvent)&&e.then(x)instanceof t&&0!==T.indexOf("6.6")&&-1===g.indexOf("Chrome/66")}catch(e){}}(),E=function(e){var t;return!(!c(e)||"function"!=typeof(t=e.then))&&t},P=function(e,t){if(!e._n){e._n=!0;var n=e._c;M((function(){for(var r=e._v,a=1==e._s,s=0,i=function(t){var n,s,i,o=a?t.ok:t.fail,d=t.resolve,u=t.reject,_=t.domain;try{o?(a||(2==e._h&&W(e),e._h=1),!0===o?n=r:(_&&_.enter(),n=o(r),_&&(_.exit(),i=!0)),n===t.promise?u(w("Promise-chain cycle")):(s=E(n))?s.call(n,d,u):d(n)):u(r)}catch(e){_&&!i&&_.exit(),u(e)}};n.length>s;)i(n[s++]);e._c=[],e._n=!1,t&&!e._h&&A(e)}))}},A=function(e){p.call(d,(function(){var t,n,r,a=e._v,s=F(e);if(s&&(t=Y((function(){j?b.emit("unhandledRejection",a,e):(n=d.onunhandledrejection)?n({promise:e,reason:a}):(r=d.console)&&r.error&&r.error("Unhandled promise rejection",a)})),e._h=j||F(e)?2:1),e._a=void 0,s&&t.e)throw t.v}))},F=function(e){return 1!==e._h&&0===(e._a||e._c).length},W=function(e){p.call(d,(function(){var t;j?b.emit("rejectionHandled",e):(t=d.onrejectionhandled)&&t({promise:e,reason:e._v})}))},N=function(e){var t=this;t._d||(t._d=!0,(t=t._w||t)._v=e,t._s=2,t._a||(t._a=t._c.slice()),P(t,!0))},C=function(e){var t,n=this;if(!n._d){n._d=!0,n=n._w||n;try{if(n===e)throw w("Promise can't be resolved itself");(t=E(e))?M((function(){var r={_w:n,_d:!1};try{t.call(e,u(C,r,1),u(N,r,1))}catch(e){N.call(r,e)}})):(n._v=e,n._s=1,P(n,!1))}catch(e){N.call({_w:n,_d:!1},e)}}};O||(S=function(e){h(this,S,k,"_h"),m(e),r.call(this);try{e(u(C,this,1),u(N,this,1))}catch(e){N.call(this,e)}},(r=function(e){this._c=[],this._a=void 0,this._s=0,this._d=!1,this._v=void 0,this._h=0,this._n=!1}).prototype=n(24408)(S.prototype,{then:function(e,t){var n=H(y(this,S));return n.ok="function"!=typeof e||e,n.fail="function"==typeof t&&t,n.domain=j?b.domain:void 0,this._c.push(n),this._a&&this._a.push(n),this._s&&P(this,!1),n.promise},catch:function(e){return this.then(void 0,e)}}),s=function(){var e=new r;this.promise=e,this.resolve=u(C,e,1),this.reject=u(N,e,1)},L.f=H=function(e){return e===S||e===i?new s(e):a(e)}),l(l.G+l.W+l.F*!O,{Promise:S}),n(22943)(S,k),n(2974)(k),i=n(25645)[k],l(l.S+l.F*!O,k,{reject:function(e){var t=H(this);return(0,t.reject)(e),t.promise}}),l(l.S+l.F*(o||!O),k,{resolve:function(e){return v(o&&this===i?S:this,e)}}),l(l.S+l.F*!(O&&n(7462)((function(e){S.all(e).catch(x)}))),k,{all:function(e){var t=this,n=H(t),r=n.resolve,a=n.reject,s=Y((function(){var n=[],s=0,i=1;f(e,!1,(function(e){var o=s++,d=!1;n.push(void 0),i++,t.resolve(e).then((function(e){d||(d=!0,n[o]=e,--i||r(n))}),a)})),--i||r(n)}));return s.e&&a(s.v),n.promise},race:function(e){var t=this,n=H(t),r=n.reject,a=Y((function(){f(e,!1,(function(e){t.resolve(e).then(n.resolve,r)}))}));return a.e&&r(a.v),n.promise}})},21572:(e,t,n)=>{var r=n(42985),a=n(24963),s=n(27007),i=(n(3816).Reflect||{}).apply,o=Function.apply;r(r.S+r.F*!n(74253)((function(){i((function(){}))})),"Reflect",{apply:function(e,t,n){var r=a(e),d=s(n);return i?i(r,t,d):o.call(r,t,d)}})},82139:(e,t,n)=>{var r=n(42985),a=n(42503),s=n(24963),i=n(27007),o=n(55286),d=n(74253),u=n(34398),_=(n(3816).Reflect||{}).construct,l=d((function(){function e(){}return!(_((function(){}),[],e)instanceof e)})),c=!d((function(){_((function(){}))}));r(r.S+r.F*(l||c),"Reflect",{construct:function(e,t){s(e),i(t);var n=arguments.length<3?e:s(arguments[2]);if(c&&!l)return _(e,t,n);if(e==n){switch(t.length){case 0:return new e;case 1:return new e(t[0]);case 2:return new e(t[0],t[1]);case 3:return new e(t[0],t[1],t[2]);case 4:return new e(t[0],t[1],t[2],t[3])}var r=[null];return r.push.apply(r,t),new(u.apply(e,r))}var d=n.prototype,m=a(o(d)?d:Object.prototype),h=Function.apply.call(e,m,t);return o(h)?h:m}})},10685:(e,t,n)=>{var r=n(99275),a=n(42985),s=n(27007),i=n(21689);a(a.S+a.F*n(74253)((function(){Reflect.defineProperty(r.f({},1,{value:1}),1,{value:2})})),"Reflect",{defineProperty:function(e,t,n){s(e),t=i(t,!0),s(n);try{return r.f(e,t,n),!0}catch(e){return!1}}})},85535:(e,t,n)=>{var r=n(42985),a=n(18693).f,s=n(27007);r(r.S,"Reflect",{deleteProperty:function(e,t){var n=a(s(e),t);return!(n&&!n.configurable)&&delete e[t]}})},17347:(e,t,n)=>{"use strict";var r=n(42985),a=n(27007),s=function(e){this._t=a(e),this._i=0;var t,n=this._k=[];for(t in e)n.push(t)};n(49988)(s,"Object",(function(){var e,t=this,n=t._k;do{if(t._i>=n.length)return{value:void 0,done:!0}}while(!((e=n[t._i++])in t._t));return{value:e,done:!1}})),r(r.S,"Reflect",{enumerate:function(e){return new s(e)}})},96633:(e,t,n)=>{var r=n(18693),a=n(42985),s=n(27007);a(a.S,"Reflect",{getOwnPropertyDescriptor:function(e,t){return r.f(s(e),t)}})},68989:(e,t,n)=>{var r=n(42985),a=n(468),s=n(27007);r(r.S,"Reflect",{getPrototypeOf:function(e){return a(s(e))}})},83049:(e,t,n)=>{var r=n(18693),a=n(468),s=n(79181),i=n(42985),o=n(55286),d=n(27007);i(i.S,"Reflect",{get:function e(t,n){var i,u,_=arguments.length<3?t:arguments[2];return d(t)===_?t[n]:(i=r.f(t,n))?s(i,"value")?i.value:void 0!==i.get?i.get.call(_):void 0:o(u=a(t))?e(u,n,_):void 0}})},78270:(e,t,n)=>{var r=n(42985);r(r.S,"Reflect",{has:function(e,t){return t in e}})},64510:(e,t,n)=>{var r=n(42985),a=n(27007),s=Object.isExtensible;r(r.S,"Reflect",{isExtensible:function(e){return a(e),!s||s(e)}})},73984:(e,t,n)=>{var r=n(42985);r(r.S,"Reflect",{ownKeys:n(57643)})},75769:(e,t,n)=>{var r=n(42985),a=n(27007),s=Object.preventExtensions;r(r.S,"Reflect",{preventExtensions:function(e){a(e);try{return s&&s(e),!0}catch(e){return!1}}})},96014:(e,t,n)=>{var r=n(42985),a=n(27375);a&&r(r.S,"Reflect",{setPrototypeOf:function(e,t){a.check(e,t);try{return a.set(e,t),!0}catch(e){return!1}}})},50055:(e,t,n)=>{var r=n(99275),a=n(18693),s=n(468),i=n(79181),o=n(42985),d=n(90681),u=n(27007),_=n(55286);o(o.S,"Reflect",{set:function e(t,n,o){var l,c,m=arguments.length<4?t:arguments[3],h=a.f(u(t),n);if(!h){if(_(c=s(t)))return e(c,n,o,m);h=d(0)}if(i(h,"value")){if(!1===h.writable||!_(m))return!1;if(l=a.f(m,n)){if(l.get||l.set||!1===l.writable)return!1;l.value=o,r.f(m,n,l)}else r.f(m,n,d(0,o));return!0}return void 0!==h.set&&(h.set.call(m,o),!0)}})},83946:(e,t,n)=>{var r=n(3816),a=n(40266),s=n(99275).f,i=n(20616).f,o=n(55364),d=n(53218),u=r.RegExp,_=u,l=u.prototype,c=/a/g,m=/a/g,h=new u(c)!==c;if(n(67057)&&(!h||n(74253)((function(){return m[n(86314)("match")]=!1,u(c)!=c||u(m)==m||"/a/i"!=u(c,"i")})))){u=function(e,t){var n=this instanceof u,r=o(e),s=void 0===t;return!n&&r&&e.constructor===u&&s?e:a(h?new _(r&&!s?e.source:e,t):_((r=e instanceof u)?e.source:e,r&&s?d.call(e):t),n?this:l,u)};for(var f=function(e){e in u||s(u,e,{configurable:!0,get:function(){return _[e]},set:function(t){_[e]=t}})},y=i(_),p=0;y.length>p;)f(y[p++]);l.constructor=u,u.prototype=l,n(77234)(r,"RegExp",u)}n(2974)("RegExp")},18269:(e,t,n)=>{"use strict";var r=n(21165);n(42985)({target:"RegExp",proto:!0,forced:r!==/./.exec},{exec:r})},76774:(e,t,n)=>{n(67057)&&"g"!=/./g.flags&&n(99275).f(RegExp.prototype,"flags",{configurable:!0,get:n(53218)})},21466:(e,t,n)=>{"use strict";var r=n(27007),a=n(10875),s=n(76793),i=n(27787);n(28082)("match",1,(function(e,t,n,o){return[function(n){var r=e(this),a=null==n?void 0:n[t];return void 0!==a?a.call(n,r):new RegExp(n)[t](String(r))},function(e){var t=o(n,e,this);if(t.done)return t.value;var d=r(e),u=String(this);if(!d.global)return i(d,u);var _=d.unicode;d.lastIndex=0;for(var l,c=[],m=0;null!==(l=i(d,u));){var h=String(l[0]);c[m]=h,""===h&&(d.lastIndex=s(u,a(d.lastIndex),_)),m++}return 0===m?null:c}]}))},59357:(e,t,n)=>{"use strict";var r=n(27007),a=n(20508),s=n(10875),i=n(81467),o=n(76793),d=n(27787),u=Math.max,_=Math.min,l=Math.floor,c=/\$([$&`']|\d\d?|<[^>]*>)/g,m=/\$([$&`']|\d\d?)/g;n(28082)("replace",2,(function(e,t,n,h){return[function(r,a){var s=e(this),i=null==r?void 0:r[t];return void 0!==i?i.call(r,s,a):n.call(String(s),r,a)},function(e,t){var a=h(n,e,this,t);if(a.done)return a.value;var l=r(e),c=String(this),m="function"==typeof t;m||(t=String(t));var y=l.global;if(y){var p=l.unicode;l.lastIndex=0}for(var M=[];;){var L=d(l,c);if(null===L)break;if(M.push(L),!y)break;""===String(L[0])&&(l.lastIndex=o(c,s(l.lastIndex),p))}for(var Y,g="",v=0,k=0;k<M.length;k++){L=M[k];for(var w=String(L[0]),b=u(_(i(L.index),c.length),0),D=[],T=1;T<L.length;T++)D.push(void 0===(Y=L[T])?Y:String(Y));var S=L.groups;if(m){var j=[w].concat(D,b,c);void 0!==S&&j.push(S);var x=String(t.apply(void 0,j))}else x=f(w,c,b,D,S,t);b>=v&&(g+=c.slice(v,b)+x,v=b+w.length)}return g+c.slice(v)}];function f(e,t,r,s,i,o){var d=r+e.length,u=s.length,_=m;return void 0!==i&&(i=a(i),_=c),n.call(o,_,(function(n,a){var o;switch(a.charAt(0)){case"$":return"$";case"&":return e;case"`":return t.slice(0,r);case"'":return t.slice(d);case"<":o=i[a.slice(1,-1)];break;default:var _=+a;if(0===_)return n;if(_>u){var c=l(_/10);return 0===c?n:c<=u?void 0===s[c-1]?a.charAt(1):s[c-1]+a.charAt(1):n}o=s[_-1]}return void 0===o?"":o}))}}))},76142:(e,t,n)=>{"use strict";var r=n(27007),a=n(27195),s=n(27787);n(28082)("search",1,(function(e,t,n,i){return[function(n){var r=e(this),a=null==n?void 0:n[t];return void 0!==a?a.call(n,r):new RegExp(n)[t](String(r))},function(e){var t=i(n,e,this);if(t.done)return t.value;var o=r(e),d=String(this),u=o.lastIndex;a(u,0)||(o.lastIndex=0);var _=s(o,d);return a(o.lastIndex,u)||(o.lastIndex=u),null===_?-1:_.index}]}))},51876:(e,t,n)=>{"use strict";var r=n(55364),a=n(27007),s=n(58364),i=n(76793),o=n(10875),d=n(27787),u=n(21165),_=n(74253),l=Math.min,c=[].push,m="split",h="length",f="lastIndex",y=4294967295,p=!_((function(){RegExp(y,"y")}));n(28082)("split",2,(function(e,t,n,_){var M;return M="c"=="abbc"[m](/(b)*/)[1]||4!="test"[m](/(?:)/,-1)[h]||2!="ab"[m](/(?:ab)*/)[h]||4!="."[m](/(.?)(.?)/)[h]||"."[m](/()()/)[h]>1||""[m](/.?/)[h]?function(e,t){var a=String(this);if(void 0===e&&0===t)return[];if(!r(e))return n.call(a,e,t);for(var s,i,o,d=[],_=(e.ignoreCase?"i":"")+(e.multiline?"m":"")+(e.unicode?"u":"")+(e.sticky?"y":""),l=0,m=void 0===t?y:t>>>0,p=new RegExp(e.source,_+"g");(s=u.call(p,a))&&!((i=p[f])>l&&(d.push(a.slice(l,s.index)),s[h]>1&&s.index<a[h]&&c.apply(d,s.slice(1)),o=s[0][h],l=i,d[h]>=m));)p[f]===s.index&&p[f]++;return l===a[h]?!o&&p.test("")||d.push(""):d.push(a.slice(l)),d[h]>m?d.slice(0,m):d}:"0"[m](void 0,0)[h]?function(e,t){return void 0===e&&0===t?[]:n.call(this,e,t)}:n,[function(n,r){var a=e(this),s=null==n?void 0:n[t];return void 0!==s?s.call(n,a,r):M.call(String(a),n,r)},function(e,t){var r=_(M,e,this,t,M!==n);if(r.done)return r.value;var u=a(e),c=String(this),m=s(u,RegExp),h=u.unicode,f=(u.ignoreCase?"i":"")+(u.multiline?"m":"")+(u.unicode?"u":"")+(p?"y":"g"),L=new m(p?u:"^(?:"+u.source+")",f),Y=void 0===t?y:t>>>0;if(0===Y)return[];if(0===c.length)return null===d(L,c)?[c]:[];for(var g=0,v=0,k=[];v<c.length;){L.lastIndex=p?v:0;var w,b=d(L,p?c:c.slice(v));if(null===b||(w=l(o(L.lastIndex+(p?0:v)),c.length))===g)v=i(c,v,h);else{if(k.push(c.slice(g,v)),k.length===Y)return k;for(var D=1;D<=b.length-1;D++)if(k.push(b[D]),k.length===Y)return k;v=g=w}}return k.push(c.slice(g)),k}]}))},66108:(e,t,n)=>{"use strict";n(76774);var r=n(27007),a=n(53218),s=n(67057),i="toString",o=/./[i],d=function(e){n(77234)(RegExp.prototype,i,e,!0)};n(74253)((function(){return"/a/b"!=o.call({source:"a",flags:"b"})}))?d((function(){var e=r(this);return"/".concat(e.source,"/","flags"in e?e.flags:!s&&e instanceof RegExp?a.call(e):void 0)})):o.name!=i&&d((function(){return o.call(this)}))},98184:(e,t,n)=>{"use strict";var r=n(9824),a=n(1616);e.exports=n(45795)("Set",(function(e){return function(){return e(this,arguments.length>0?arguments[0]:void 0)}}),{add:function(e){return r.def(a(this,"Set"),e=0===e?0:e,e)}},r)},40856:(e,t,n)=>{"use strict";n(29395)("anchor",(function(e){return function(t){return e(this,"a","name",t)}}))},80703:(e,t,n)=>{"use strict";n(29395)("big",(function(e){return function(){return e(this,"big","","")}}))},91539:(e,t,n)=>{"use strict";n(29395)("blink",(function(e){return function(){return e(this,"blink","","")}}))},5292:(e,t,n)=>{"use strict";n(29395)("bold",(function(e){return function(){return e(this,"b","","")}}))},29539:(e,t,n)=>{"use strict";var r=n(42985),a=n(24496)(!1);r(r.P,"String",{codePointAt:function(e){return a(this,e)}})},96620:(e,t,n)=>{"use strict";var r=n(42985),a=n(10875),s=n(42094),i="endsWith",o=""[i];r(r.P+r.F*n(8852)(i),"String",{endsWith:function(e){var t=s(this,e,i),n=arguments.length>1?arguments[1]:void 0,r=a(t.length),d=void 0===n?r:Math.min(a(n),r),u=String(e);return o?o.call(t,u,d):t.slice(d-u.length,d)===u}})},45177:(e,t,n)=>{"use strict";n(29395)("fixed",(function(e){return function(){return e(this,"tt","","")}}))},73694:(e,t,n)=>{"use strict";n(29395)("fontcolor",(function(e){return function(t){return e(this,"font","color",t)}}))},37648:(e,t,n)=>{"use strict";n(29395)("fontsize",(function(e){return function(t){return e(this,"font","size",t)}}))},50191:(e,t,n)=>{var r=n(42985),a=n(92337),s=String.fromCharCode,i=String.fromCodePoint;r(r.S+r.F*(!!i&&1!=i.length),"String",{fromCodePoint:function(e){for(var t,n=[],r=arguments.length,i=0;r>i;){if(t=+arguments[i++],a(t,1114111)!==t)throw RangeError(t+" is not a valid code point");n.push(t<65536?s(t):s(55296+((t-=65536)>>10),t%1024+56320))}return n.join("")}})},62850:(e,t,n)=>{"use strict";var r=n(42985),a=n(42094),s="includes";r(r.P+r.F*n(8852)(s),"String",{includes:function(e){return!!~a(this,e,s).indexOf(e,arguments.length>1?arguments[1]:void 0)}})},27795:(e,t,n)=>{"use strict";n(29395)("italics",(function(e){return function(){return e(this,"i","","")}}))},39115:(e,t,n)=>{"use strict";var r=n(24496)(!0);n(42923)(String,"String",(function(e){this._t=String(e),this._i=0}),(function(){var e,t=this._t,n=this._i;return n>=t.length?{value:void 0,done:!0}:(e=r(t,n),this._i+=e.length,{value:e,done:!1})}))},4531:(e,t,n)=>{"use strict";n(29395)("link",(function(e){return function(t){return e(this,"a","href",t)}}))},98306:(e,t,n)=>{var r=n(42985),a=n(22110),s=n(10875);r(r.S,"String",{raw:function(e){for(var t=a(e.raw),n=s(t.length),r=arguments.length,i=[],o=0;n>o;)i.push(String(t[o++])),o<r&&i.push(String(arguments[o]));return i.join("")}})},10823:(e,t,n)=>{var r=n(42985);r(r.P,"String",{repeat:n(68595)})},23605:(e,t,n)=>{"use strict";n(29395)("small",(function(e){return function(){return e(this,"small","","")}}))},17732:(e,t,n)=>{"use strict";var r=n(42985),a=n(10875),s=n(42094),i="startsWith",o=""[i];r(r.P+r.F*n(8852)(i),"String",{startsWith:function(e){var t=s(this,e,i),n=a(Math.min(arguments.length>1?arguments[1]:void 0,t.length)),r=String(e);return o?o.call(t,r,n):t.slice(n,n+r.length)===r}})},6780:(e,t,n)=>{"use strict";n(29395)("strike",(function(e){return function(){return e(this,"strike","","")}}))},69937:(e,t,n)=>{"use strict";n(29395)("sub",(function(e){return function(){return e(this,"sub","","")}}))},10511:(e,t,n)=>{"use strict";n(29395)("sup",(function(e){return function(){return e(this,"sup","","")}}))},64564:(e,t,n)=>{"use strict";n(29599)("trim",(function(e){return function(){return e(this,3)}}))},95767:(e,t,n)=>{"use strict";var r=n(3816),a=n(79181),s=n(67057),i=n(42985),o=n(77234),d=n(84728).KEY,u=n(74253),_=n(3825),l=n(22943),c=n(93953),m=n(86314),h=n(28787),f=n(36074),y=n(5541),p=n(4302),M=n(27007),L=n(55286),Y=n(20508),g=n(22110),v=n(21689),k=n(90681),w=n(42503),b=n(39327),D=n(18693),T=n(64548),S=n(99275),j=n(47184),x=D.f,H=S.f,O=b.f,E=r.Symbol,P=r.JSON,A=P&&P.stringify,F="prototype",W=m("_hidden"),N=m("toPrimitive"),C={}.propertyIsEnumerable,R=_("symbol-registry"),I=_("symbols"),z=_("op-symbols"),J=Object[F],U="function"==typeof E&&!!T.f,G=r.QObject,q=!G||!G[F]||!G[F].findChild,V=s&&u((function(){return 7!=w(H({},"a",{get:function(){return H(this,"a",{value:7}).a}})).a}))?function(e,t,n){var r=x(J,t);r&&delete J[t],H(e,t,n),r&&e!==J&&H(J,t,r)}:H,B=function(e){var t=I[e]=w(E[F]);return t._k=e,t},$=U&&"symbol"==typeof E.iterator?function(e){return"symbol"==typeof e}:function(e){return e instanceof E},K=function(e,t,n){return e===J&&K(z,t,n),M(e),t=v(t,!0),M(n),a(I,t)?(n.enumerable?(a(e,W)&&e[W][t]&&(e[W][t]=!1),n=w(n,{enumerable:k(0,!1)})):(a(e,W)||H(e,W,k(1,{})),e[W][t]=!0),V(e,t,n)):H(e,t,n)},Z=function(e,t){M(e);for(var n,r=y(t=g(t)),a=0,s=r.length;s>a;)K(e,n=r[a++],t[n]);return e},Q=function(e){var t=C.call(this,e=v(e,!0));return!(this===J&&a(I,e)&&!a(z,e))&&(!(t||!a(this,e)||!a(I,e)||a(this,W)&&this[W][e])||t)},X=function(e,t){if(e=g(e),t=v(t,!0),e!==J||!a(I,t)||a(z,t)){var n=x(e,t);return!n||!a(I,t)||a(e,W)&&e[W][t]||(n.enumerable=!0),n}},ee=function(e){for(var t,n=O(g(e)),r=[],s=0;n.length>s;)a(I,t=n[s++])||t==W||t==d||r.push(t);return r},te=function(e){for(var t,n=e===J,r=O(n?z:g(e)),s=[],i=0;r.length>i;)!a(I,t=r[i++])||n&&!a(J,t)||s.push(I[t]);return s};U||(o((E=function(){if(this instanceof E)throw TypeError("Symbol is not a constructor!");var e=c(arguments.length>0?arguments[0]:void 0),t=function(n){this===J&&t.call(z,n),a(this,W)&&a(this[W],e)&&(this[W][e]=!1),V(this,e,k(1,n))};return s&&q&&V(J,e,{configurable:!0,set:t}),B(e)})[F],"toString",(function(){return this._k})),D.f=X,S.f=K,n(20616).f=b.f=ee,n(14682).f=Q,T.f=te,s&&!n(4461)&&o(J,"propertyIsEnumerable",Q,!0),h.f=function(e){return B(m(e))}),i(i.G+i.W+i.F*!U,{Symbol:E});for(var ne="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),re=0;ne.length>re;)m(ne[re++]);for(var ae=j(m.store),se=0;ae.length>se;)f(ae[se++]);i(i.S+i.F*!U,"Symbol",{for:function(e){return a(R,e+="")?R[e]:R[e]=E(e)},keyFor:function(e){if(!$(e))throw TypeError(e+" is not a symbol!");for(var t in R)if(R[t]===e)return t},useSetter:function(){q=!0},useSimple:function(){q=!1}}),i(i.S+i.F*!U,"Object",{create:function(e,t){return void 0===t?w(e):Z(w(e),t)},defineProperty:K,defineProperties:Z,getOwnPropertyDescriptor:X,getOwnPropertyNames:ee,getOwnPropertySymbols:te});var ie=u((function(){T.f(1)}));i(i.S+i.F*ie,"Object",{getOwnPropertySymbols:function(e){return T.f(Y(e))}}),P&&i(i.S+i.F*(!U||u((function(){var e=E();return"[null]"!=A([e])||"{}"!=A({a:e})||"{}"!=A(Object(e))}))),"JSON",{stringify:function(e){for(var t,n,r=[e],a=1;arguments.length>a;)r.push(arguments[a++]);if(n=t=r[1],(L(t)||void 0!==e)&&!$(e))return p(t)||(t=function(e,t){if("function"==typeof n&&(t=n.call(this,e,t)),!$(t))return t}),r[1]=t,A.apply(P,r)}}),E[F][N]||n(87728)(E[F],N,E[F].valueOf),l(E,"Symbol"),l(Math,"Math",!0),l(r.JSON,"JSON",!0)},30142:(e,t,n)=>{"use strict";var r=n(42985),a=n(89383),s=n(91125),i=n(27007),o=n(92337),d=n(10875),u=n(55286),_=n(3816).ArrayBuffer,l=n(58364),c=s.ArrayBuffer,m=s.DataView,h=a.ABV&&_.isView,f=c.prototype.slice,y=a.VIEW,p="ArrayBuffer";r(r.G+r.W+r.F*(_!==c),{ArrayBuffer:c}),r(r.S+r.F*!a.CONSTR,p,{isView:function(e){return h&&h(e)||u(e)&&y in e}}),r(r.P+r.U+r.F*n(74253)((function(){return!new c(2).slice(1,void 0).byteLength})),p,{slice:function(e,t){if(void 0!==f&&void 0===t)return f.call(i(this),e);for(var n=i(this).byteLength,r=o(e,n),a=o(void 0===t?n:t,n),s=new(l(this,c))(d(a-r)),u=new m(this),_=new m(s),h=0;r<a;)_.setUint8(h++,u.getUint8(r++));return s}}),n(2974)(p)},1786:(e,t,n)=>{var r=n(42985);r(r.G+r.W+r.F*!n(89383).ABV,{DataView:n(91125).DataView})},70162:(e,t,n)=>{n(78440)("Float32",4,(function(e){return function(t,n,r){return e(this,t,n,r)}}))},33834:(e,t,n)=>{n(78440)("Float64",8,(function(e){return function(t,n,r){return e(this,t,n,r)}}))},74821:(e,t,n)=>{n(78440)("Int16",2,(function(e){return function(t,n,r){return e(this,t,n,r)}}))},81303:(e,t,n)=>{n(78440)("Int32",4,(function(e){return function(t,n,r){return e(this,t,n,r)}}))},75368:(e,t,n)=>{n(78440)("Int8",1,(function(e){return function(t,n,r){return e(this,t,n,r)}}))},79103:(e,t,n)=>{n(78440)("Uint16",2,(function(e){return function(t,n,r){return e(this,t,n,r)}}))},83318:(e,t,n)=>{n(78440)("Uint32",4,(function(e){return function(t,n,r){return e(this,t,n,r)}}))},46964:(e,t,n)=>{n(78440)("Uint8",1,(function(e){return function(t,n,r){return e(this,t,n,r)}}))},62152:(e,t,n)=>{n(78440)("Uint8",1,(function(e){return function(t,n,r){return e(this,t,n,r)}}),!0)},30147:(e,t,n)=>{"use strict";var r,a=n(3816),s=n(10050)(0),i=n(77234),o=n(84728),d=n(35345),u=n(23657),_=n(55286),l=n(1616),c=n(1616),m=!a.ActiveXObject&&"ActiveXObject"in a,h="WeakMap",f=o.getWeak,y=Object.isExtensible,p=u.ufstore,M=function(e){return function(){return e(this,arguments.length>0?arguments[0]:void 0)}},L={get:function(e){if(_(e)){var t=f(e);return!0===t?p(l(this,h)).get(e):t?t[this._i]:void 0}},set:function(e,t){return u.def(l(this,h),e,t)}},Y=e.exports=n(45795)(h,M,L,u,!0,!0);c&&m&&(d((r=u.getConstructor(M,h)).prototype,L),o.NEED=!0,s(["delete","has","get","set"],(function(e){var t=Y.prototype,n=t[e];i(t,e,(function(t,a){if(_(t)&&!y(t)){this._f||(this._f=new r);var s=this._f[e](t,a);return"set"==e?this:s}return n.call(this,t,a)}))})))},59192:(e,t,n)=>{"use strict";var r=n(23657),a=n(1616),s="WeakSet";n(45795)(s,(function(e){return function(){return e(this,arguments.length>0?arguments[0]:void 0)}}),{add:function(e){return r.def(a(this,s),e,!0)}},r,!1,!0)},1268:(e,t,n)=>{"use strict";var r=n(42985),a=n(13325),s=n(20508),i=n(10875),o=n(24963),d=n(16886);r(r.P,"Array",{flatMap:function(e){var t,n,r=s(this);return o(e),t=i(r.length),n=d(r,0),a(n,r,r,t,0,1,e,arguments[1]),n}}),n(17722)("flatMap")},62773:(e,t,n)=>{"use strict";var r=n(42985),a=n(79315)(!0);r(r.P,"Array",{includes:function(e){return a(this,e,arguments.length>1?arguments[1]:void 0)}}),n(17722)("includes")},83276:(e,t,n)=>{var r=n(42985),a=n(51131)(!0);r(r.S,"Object",{entries:function(e){return a(e)}})},98351:(e,t,n)=>{var r=n(42985),a=n(57643),s=n(22110),i=n(18693),o=n(92811);r(r.S,"Object",{getOwnPropertyDescriptors:function(e){for(var t,n,r=s(e),d=i.f,u=a(r),_={},l=0;u.length>l;)void 0!==(n=d(r,t=u[l++]))&&o(_,t,n);return _}})},96409:(e,t,n)=>{var r=n(42985),a=n(51131)(!1);r(r.S,"Object",{values:function(e){return a(e)}})},9865:(e,t,n)=>{"use strict";var r=n(42985),a=n(25645),s=n(3816),i=n(58364),o=n(50094);r(r.P+r.R,"Promise",{finally:function(e){var t=i(this,a.Promise||s.Promise),n="function"==typeof e;return this.then(n?function(n){return o(t,e()).then((function(){return n}))}:e,n?function(n){return o(t,e()).then((function(){throw n}))}:e)}})},92770:(e,t,n)=>{"use strict";var r=n(42985),a=n(75442),s=n(30575),i=/Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(s);r(r.P+r.F*i,"String",{padEnd:function(e){return a(this,e,arguments.length>1?arguments[1]:void 0,!1)}})},41784:(e,t,n)=>{"use strict";var r=n(42985),a=n(75442),s=n(30575),i=/Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(s);r(r.P+r.F*i,"String",{padStart:function(e){return a(this,e,arguments.length>1?arguments[1]:void 0,!0)}})},65869:(e,t,n)=>{"use strict";n(29599)("trimLeft",(function(e){return function(){return e(this,1)}}),"trimStart")},94325:(e,t,n)=>{"use strict";n(29599)("trimRight",(function(e){return function(){return e(this,2)}}),"trimEnd")},79665:(e,t,n)=>{n(36074)("asyncIterator")},91181:(e,t,n)=>{for(var r=n(56997),a=n(47184),s=n(77234),i=n(3816),o=n(87728),d=n(87234),u=n(86314),_=u("iterator"),l=u("toStringTag"),c=d.Array,m={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},h=a(m),f=0;f<h.length;f++){var y,p=h[f],M=m[p],L=i[p],Y=L&&L.prototype;if(Y&&(Y[_]||o(Y,_,c),Y[l]||o(Y,l,p),d[p]=c,M))for(y in r)Y[y]||s(Y,y,r[y],!0)}},84633:(e,t,n)=>{var r=n(42985),a=n(74193);r(r.G+r.B,{setImmediate:a.set,clearImmediate:a.clear})},32564:(e,t,n)=>{var r=n(3816),a=n(42985),s=n(30575),i=[].slice,o=/MSIE .\./.test(s),d=function(e){return function(t,n){var r=arguments.length>2,a=!!r&&i.call(arguments,2);return e(r?function(){("function"==typeof t?t:Function(t)).apply(this,a)}:t,n)}};a(a.G+a.B+a.F*o,{setTimeout:d(r.setTimeout),setInterval:d(r.setInterval)})},96337:(e,t,n)=>{n(32564),n(84633),n(91181),e.exports=n(25645)},12296:(e,t,n)=>{"use strict";var r=n(31044)(),a=n(40210),s=r&&a("%Object.defineProperty%",!0);if(s)try{s({},"a",{value:1})}catch(e){s=!1}var i=a("%SyntaxError%"),o=a("%TypeError%"),d=n(27296);e.exports=function(e,t,n){if(!e||"object"!=typeof e&&"function"!=typeof e)throw new o("`obj` must be an object or a function`");if("string"!=typeof t&&"symbol"!=typeof t)throw new o("`property` must be a string or a symbol`");if(arguments.length>3&&"boolean"!=typeof arguments[3]&&null!==arguments[3])throw new o("`nonEnumerable`, if provided, must be a boolean or null");if(arguments.length>4&&"boolean"!=typeof arguments[4]&&null!==arguments[4])throw new o("`nonWritable`, if provided, must be a boolean or null");if(arguments.length>5&&"boolean"!=typeof arguments[5]&&null!==arguments[5])throw new o("`nonConfigurable`, if provided, must be a boolean or null");if(arguments.length>6&&"boolean"!=typeof arguments[6])throw new o("`loose`, if provided, must be a boolean");var r=arguments.length>3?arguments[3]:null,a=arguments.length>4?arguments[4]:null,u=arguments.length>5?arguments[5]:null,_=arguments.length>6&&arguments[6],l=!!d&&d(e,t);if(s)s(e,t,{configurable:null===u&&l?l.configurable:!u,enumerable:null===r&&l?l.enumerable:!r,value:n,writable:null===a&&l?l.writable:!a});else{if(!_&&(r||a||u))throw new i("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");e[t]=n}}},4289:(e,t,n)=>{"use strict";var r=n(82215),a="function"==typeof Symbol&&"symbol"==typeof Symbol("foo"),s=Object.prototype.toString,i=Array.prototype.concat,o=n(12296),d=n(31044)(),u=function(e,t,n,r){if(t in e)if(!0===r){if(e[t]===n)return}else if("function"!=typeof(a=r)||"[object Function]"!==s.call(a)||!r())return;var a;d?o(e,t,n,!0):o(e,t,n)},_=function(e,t){var n=arguments.length>2?arguments[2]:{},s=r(t);a&&(s=i.call(s,Object.getOwnPropertySymbols(t)));for(var o=0;o<s.length;o+=1)u(e,s[o],t[s[o]],n[s[o]])};_.supportsDescriptors=!!d,e.exports=_},2924:()=>{var e;"function"!=typeof(e=window.Element.prototype).matches&&(e.matches=e.msMatchesSelector||e.mozMatchesSelector||e.webkitMatchesSelector||function(e){for(var t=this,n=(t.document||t.ownerDocument).querySelectorAll(e),r=0;n[r]&&n[r]!==t;)++r;return Boolean(n[r])}),"function"!=typeof e.closest&&(e.closest=function(e){for(var t=this;t&&1===t.nodeType;){if(t.matches(e))return t;t=t.parentNode}return null})},97272:(e,t,n)=>{"use strict";var r=n(48824),a="function"==typeof Symbol&&"symbol"==typeof Symbol.unscopables,s=a&&Array.prototype[Symbol.unscopables],i=TypeError;e.exports=function(e){if("string"!=typeof e||!e)throw new i("method must be a non-empty string");if(!r(Array.prototype,e))throw new i("method must be on Array.prototype");a&&(s[e]=!0)}},41503:(e,t,n)=>{"use strict";var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator,a=n(34149),s=n(95320),i=n(18923),o=n(12636);e.exports=function(e){if(a(e))return e;var t,n="default";if(arguments.length>1&&(arguments[1]===String?n="string":arguments[1]===Number&&(n="number")),r&&(Symbol.toPrimitive?t=function(e,t){var n=e[t];if(null!=n){if(!s(n))throw new TypeError(n+" returned for property "+t+" of object "+e+" is not a function");return n}}(e,Symbol.toPrimitive):o(e)&&(t=Symbol.prototype.valueOf)),void 0!==t){var d=t.call(e,n);if(a(d))return d;throw new TypeError("unable to convert exotic object to primitive")}return"default"===n&&(i(e)||o(e))&&(n="string"),function(e,t){if(null==e)throw new TypeError("Cannot call method on "+e);if("string"!=typeof t||"number"!==t&&"string"!==t)throw new TypeError('hint must be "string" or "number"');var n,r,i,o="string"===t?["toString","valueOf"]:["valueOf","toString"];for(i=0;i<o.length;++i)if(n=e[o[i]],s(n)&&(r=n.call(e),a(r)))return r;throw new TypeError("No default value")}(e,"default"===n?"number":n)}},34149:e=>{"use strict";e.exports=function(e){return null===e||"function"!=typeof e&&"object"!=typeof e}},17648:e=>{"use strict";var t=Object.prototype.toString,n=Math.max,r=function(e,t){for(var n=[],r=0;r<e.length;r+=1)n[r]=e[r];for(var a=0;a<t.length;a+=1)n[a+e.length]=t[a];return n};e.exports=function(e){var a=this;if("function"!=typeof a||"[object Function]"!==t.apply(a))throw new TypeError("Function.prototype.bind called on incompatible "+a);for(var s,i=function(e,t){for(var n=[],r=1,a=0;r<e.length;r+=1,a+=1)n[a]=e[r];return n}(arguments),o=n(0,a.length-i.length),d=[],u=0;u<o;u++)d[u]="$"+u;if(s=Function("binder","return function ("+function(e,t){for(var n="",r=0;r<e.length;r+=1)n+=e[r],r+1<e.length&&(n+=",");return n}(d)+"){ return binder.apply(this,arguments); }")((function(){if(this instanceof s){var t=a.apply(this,r(i,arguments));return Object(t)===t?t:this}return a.apply(e,r(i,arguments))})),a.prototype){var _=function(){};_.prototype=a.prototype,s.prototype=new _,_.prototype=null}return s}},58612:(e,t,n)=>{"use strict";var r=n(17648);e.exports=Function.prototype.bind||r},40210:(e,t,n)=>{"use strict";var r,a=SyntaxError,s=Function,i=TypeError,o=function(e){try{return s('"use strict"; return ('+e+").constructor;")()}catch(e){}},d=Object.getOwnPropertyDescriptor;if(d)try{d({},"")}catch(e){d=null}var u=function(){throw new i},_=d?function(){try{return u}catch(e){try{return d(arguments,"callee").get}catch(e){return u}}}():u,l=n(41405)(),c=n(28185)(),m=Object.getPrototypeOf||(c?function(e){return e.__proto__}:null),h={},f="undefined"!=typeof Uint8Array&&m?m(Uint8Array):r,y={"%AggregateError%":"undefined"==typeof AggregateError?r:AggregateError,"%Array%":Array,"%ArrayBuffer%":"undefined"==typeof ArrayBuffer?r:ArrayBuffer,"%ArrayIteratorPrototype%":l&&m?m([][Symbol.iterator]()):r,"%AsyncFromSyncIteratorPrototype%":r,"%AsyncFunction%":h,"%AsyncGenerator%":h,"%AsyncGeneratorFunction%":h,"%AsyncIteratorPrototype%":h,"%Atomics%":"undefined"==typeof Atomics?r:Atomics,"%BigInt%":"undefined"==typeof BigInt?r:BigInt,"%BigInt64Array%":"undefined"==typeof BigInt64Array?r:BigInt64Array,"%BigUint64Array%":"undefined"==typeof BigUint64Array?r:BigUint64Array,"%Boolean%":Boolean,"%DataView%":"undefined"==typeof DataView?r:DataView,"%Date%":Date,"%decodeURI%":decodeURI,"%decodeURIComponent%":decodeURIComponent,"%encodeURI%":encodeURI,"%encodeURIComponent%":encodeURIComponent,"%Error%":Error,"%eval%":eval,"%EvalError%":EvalError,"%Float32Array%":"undefined"==typeof Float32Array?r:Float32Array,"%Float64Array%":"undefined"==typeof Float64Array?r:Float64Array,"%FinalizationRegistry%":"undefined"==typeof FinalizationRegistry?r:FinalizationRegistry,"%Function%":s,"%GeneratorFunction%":h,"%Int8Array%":"undefined"==typeof Int8Array?r:Int8Array,"%Int16Array%":"undefined"==typeof Int16Array?r:Int16Array,"%Int32Array%":"undefined"==typeof Int32Array?r:Int32Array,"%isFinite%":isFinite,"%isNaN%":isNaN,"%IteratorPrototype%":l&&m?m(m([][Symbol.iterator]())):r,"%JSON%":"object"==typeof JSON?JSON:r,"%Map%":"undefined"==typeof Map?r:Map,"%MapIteratorPrototype%":"undefined"!=typeof Map&&l&&m?m((new Map)[Symbol.iterator]()):r,"%Math%":Math,"%Number%":Number,"%Object%":Object,"%parseFloat%":parseFloat,"%parseInt%":parseInt,"%Promise%":"undefined"==typeof Promise?r:Promise,"%Proxy%":"undefined"==typeof Proxy?r:Proxy,"%RangeError%":RangeError,"%ReferenceError%":ReferenceError,"%Reflect%":"undefined"==typeof Reflect?r:Reflect,"%RegExp%":RegExp,"%Set%":"undefined"==typeof Set?r:Set,"%SetIteratorPrototype%":"undefined"!=typeof Set&&l&&m?m((new Set)[Symbol.iterator]()):r,"%SharedArrayBuffer%":"undefined"==typeof SharedArrayBuffer?r:SharedArrayBuffer,"%String%":String,"%StringIteratorPrototype%":l&&m?m(""[Symbol.iterator]()):r,"%Symbol%":l?Symbol:r,"%SyntaxError%":a,"%ThrowTypeError%":_,"%TypedArray%":f,"%TypeError%":i,"%Uint8Array%":"undefined"==typeof Uint8Array?r:Uint8Array,"%Uint8ClampedArray%":"undefined"==typeof Uint8ClampedArray?r:Uint8ClampedArray,"%Uint16Array%":"undefined"==typeof Uint16Array?r:Uint16Array,"%Uint32Array%":"undefined"==typeof Uint32Array?r:Uint32Array,"%URIError%":URIError,"%WeakMap%":"undefined"==typeof WeakMap?r:WeakMap,"%WeakRef%":"undefined"==typeof WeakRef?r:WeakRef,"%WeakSet%":"undefined"==typeof WeakSet?r:WeakSet};if(m)try{null.error}catch(e){var p=m(m(e));y["%Error.prototype%"]=p}var M=function e(t){var n;if("%AsyncFunction%"===t)n=o("async function () {}");else if("%GeneratorFunction%"===t)n=o("function* () {}");else if("%AsyncGeneratorFunction%"===t)n=o("async function* () {}");else if("%AsyncGenerator%"===t){var r=e("%AsyncGeneratorFunction%");r&&(n=r.prototype)}else if("%AsyncIteratorPrototype%"===t){var a=e("%AsyncGenerator%");a&&m&&(n=m(a.prototype))}return y[t]=n,n},L={"%ArrayBufferPrototype%":["ArrayBuffer","prototype"],"%ArrayPrototype%":["Array","prototype"],"%ArrayProto_entries%":["Array","prototype","entries"],"%ArrayProto_forEach%":["Array","prototype","forEach"],"%ArrayProto_keys%":["Array","prototype","keys"],"%ArrayProto_values%":["Array","prototype","values"],"%AsyncFunctionPrototype%":["AsyncFunction","prototype"],"%AsyncGenerator%":["AsyncGeneratorFunction","prototype"],"%AsyncGeneratorPrototype%":["AsyncGeneratorFunction","prototype","prototype"],"%BooleanPrototype%":["Boolean","prototype"],"%DataViewPrototype%":["DataView","prototype"],"%DatePrototype%":["Date","prototype"],"%ErrorPrototype%":["Error","prototype"],"%EvalErrorPrototype%":["EvalError","prototype"],"%Float32ArrayPrototype%":["Float32Array","prototype"],"%Float64ArrayPrototype%":["Float64Array","prototype"],"%FunctionPrototype%":["Function","prototype"],"%Generator%":["GeneratorFunction","prototype"],"%GeneratorPrototype%":["GeneratorFunction","prototype","prototype"],"%Int8ArrayPrototype%":["Int8Array","prototype"],"%Int16ArrayPrototype%":["Int16Array","prototype"],"%Int32ArrayPrototype%":["Int32Array","prototype"],"%JSONParse%":["JSON","parse"],"%JSONStringify%":["JSON","stringify"],"%MapPrototype%":["Map","prototype"],"%NumberPrototype%":["Number","prototype"],"%ObjectPrototype%":["Object","prototype"],"%ObjProto_toString%":["Object","prototype","toString"],"%ObjProto_valueOf%":["Object","prototype","valueOf"],"%PromisePrototype%":["Promise","prototype"],"%PromiseProto_then%":["Promise","prototype","then"],"%Promise_all%":["Promise","all"],"%Promise_reject%":["Promise","reject"],"%Promise_resolve%":["Promise","resolve"],"%RangeErrorPrototype%":["RangeError","prototype"],"%ReferenceErrorPrototype%":["ReferenceError","prototype"],"%RegExpPrototype%":["RegExp","prototype"],"%SetPrototype%":["Set","prototype"],"%SharedArrayBufferPrototype%":["SharedArrayBuffer","prototype"],"%StringPrototype%":["String","prototype"],"%SymbolPrototype%":["Symbol","prototype"],"%SyntaxErrorPrototype%":["SyntaxError","prototype"],"%TypedArrayPrototype%":["TypedArray","prototype"],"%TypeErrorPrototype%":["TypeError","prototype"],"%Uint8ArrayPrototype%":["Uint8Array","prototype"],"%Uint8ClampedArrayPrototype%":["Uint8ClampedArray","prototype"],"%Uint16ArrayPrototype%":["Uint16Array","prototype"],"%Uint32ArrayPrototype%":["Uint32Array","prototype"],"%URIErrorPrototype%":["URIError","prototype"],"%WeakMapPrototype%":["WeakMap","prototype"],"%WeakSetPrototype%":["WeakSet","prototype"]},Y=n(58612),g=n(48824),v=Y.call(Function.call,Array.prototype.concat),k=Y.call(Function.apply,Array.prototype.splice),w=Y.call(Function.call,String.prototype.replace),b=Y.call(Function.call,String.prototype.slice),D=Y.call(Function.call,RegExp.prototype.exec),T=/[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g,S=/\\(\\)?/g,j=function(e,t){var n,r=e;if(g(L,r)&&(r="%"+(n=L[r])[0]+"%"),g(y,r)){var s=y[r];if(s===h&&(s=M(r)),void 0===s&&!t)throw new i("intrinsic "+e+" exists, but is not available. Please file an issue!");return{alias:n,name:r,value:s}}throw new a("intrinsic "+e+" does not exist!")};e.exports=function(e,t){if("string"!=typeof e||0===e.length)throw new i("intrinsic name must be a non-empty string");if(arguments.length>1&&"boolean"!=typeof t)throw new i('"allowMissing" argument must be a boolean');if(null===D(/^%?[^%]*%?$/,e))throw new a("`%` may not be present anywhere but at the beginning and end of the intrinsic name");var n=function(e){var t=b(e,0,1),n=b(e,-1);if("%"===t&&"%"!==n)throw new a("invalid intrinsic syntax, expected closing `%`");if("%"===n&&"%"!==t)throw new a("invalid intrinsic syntax, expected opening `%`");var r=[];return w(e,T,(function(e,t,n,a){r[r.length]=n?w(a,S,"$1"):t||e})),r}(e),r=n.length>0?n[0]:"",s=j("%"+r+"%",t),o=s.name,u=s.value,_=!1,l=s.alias;l&&(r=l[0],k(n,v([0,1],l)));for(var c=1,m=!0;c<n.length;c+=1){var h=n[c],f=b(h,0,1),p=b(h,-1);if(('"'===f||"'"===f||"`"===f||'"'===p||"'"===p||"`"===p)&&f!==p)throw new a("property names with quotes must have matching quotes");if("constructor"!==h&&m||(_=!0),g(y,o="%"+(r+="."+h)+"%"))u=y[o];else if(null!=u){if(!(h in u)){if(!t)throw new i("base intrinsic for "+e+" exists, but the property is not available.");return}if(d&&c+1>=n.length){var M=d(u,h);u=(m=!!M)&&"get"in M&&!("originalValue"in M.get)?M.get:u[h]}else m=g(u,h),u=u[h];m&&!_&&(y[o]=u)}}return u}},27296:(e,t,n)=>{"use strict";var r=n(40210)("%Object.getOwnPropertyDescriptor%",!0);if(r)try{r([],"length")}catch(e){r=null}e.exports=r},31044:(e,t,n)=>{"use strict";var r=n(40210)("%Object.defineProperty%",!0),a=function(){if(r)try{return r({},"a",{value:1}),!0}catch(e){return!1}return!1};a.hasArrayLengthDefineBug=function(){if(!a())return null;try{return 1!==r([],"length",{value:1}).length}catch(e){return!0}},e.exports=a},28185:e=>{"use strict";var t={foo:{}},n=Object;e.exports=function(){return{__proto__:t}.foo===t.foo&&!({__proto__:null}instanceof n)}},41405:(e,t,n)=>{"use strict";var r="undefined"!=typeof Symbol&&Symbol,a=n(55419);e.exports=function(){return"function"==typeof r&&"function"==typeof Symbol&&"symbol"==typeof r("foo")&&"symbol"==typeof Symbol("bar")&&a()}},55419:e=>{"use strict";e.exports=function(){if("function"!=typeof Symbol||"function"!=typeof Object.getOwnPropertySymbols)return!1;if("symbol"==typeof Symbol.iterator)return!0;var e={},t=Symbol("test"),n=Object(t);if("string"==typeof t)return!1;if("[object Symbol]"!==Object.prototype.toString.call(t))return!1;if("[object Symbol]"!==Object.prototype.toString.call(n))return!1;for(t in e[t]=42,e)return!1;if("function"==typeof Object.keys&&0!==Object.keys(e).length)return!1;if("function"==typeof Object.getOwnPropertyNames&&0!==Object.getOwnPropertyNames(e).length)return!1;var r=Object.getOwnPropertySymbols(e);if(1!==r.length||r[0]!==t)return!1;if(!Object.prototype.propertyIsEnumerable.call(e,t))return!1;if("function"==typeof Object.getOwnPropertyDescriptor){var a=Object.getOwnPropertyDescriptor(e,t);if(42!==a.value||!0!==a.enumerable)return!1}return!0}},96410:(e,t,n)=>{"use strict";var r=n(55419);e.exports=function(){return r()&&!!Symbol.toStringTag}},48824:(e,t,n)=>{"use strict";var r=Function.prototype.call,a=Object.prototype.hasOwnProperty,s=n(58612);e.exports=s.call(r,a)},95320:e=>{"use strict";var t,n,r=Function.prototype.toString,a="object"==typeof Reflect&&null!==Reflect&&Reflect.apply;if("function"==typeof a&&"function"==typeof Object.defineProperty)try{t=Object.defineProperty({},"length",{get:function(){throw n}}),n={},a((function(){throw 42}),null,t)}catch(e){e!==n&&(a=null)}else a=null;var s=/^\s*class\b/,i=function(e){try{var t=r.call(e);return s.test(t)}catch(e){return!1}},o=function(e){try{return!i(e)&&(r.call(e),!0)}catch(e){return!1}},d=Object.prototype.toString,u="function"==typeof Symbol&&!!Symbol.toStringTag,_=!(0 in[,]),l=function(){return!1};if("object"==typeof document){var c=document.all;d.call(c)===d.call(document.all)&&(l=function(e){if((_||!e)&&(void 0===e||"object"==typeof e))try{var t=d.call(e);return("[object HTMLAllCollection]"===t||"[object HTML document.all class]"===t||"[object HTMLCollection]"===t||"[object Object]"===t)&&null==e("")}catch(e){}return!1})}e.exports=a?function(e){if(l(e))return!0;if(!e)return!1;if("function"!=typeof e&&"object"!=typeof e)return!1;try{a(e,null,t)}catch(e){if(e!==n)return!1}return!i(e)&&o(e)}:function(e){if(l(e))return!0;if(!e)return!1;if("function"!=typeof e&&"object"!=typeof e)return!1;if(u)return o(e);if(i(e))return!1;var t=d.call(e);return!("[object Function]"!==t&&"[object GeneratorFunction]"!==t&&!/^\[object HTML/.test(t))&&o(e)}},18923:(e,t,n)=>{"use strict";var r=Date.prototype.getDay,a=Object.prototype.toString,s=n(96410)();e.exports=function(e){return"object"==typeof e&&null!==e&&(s?function(e){try{return r.call(e),!0}catch(e){return!1}}(e):"[object Date]"===a.call(e))}},98420:(e,t,n)=>{"use strict";var r,a,s,i,o=n(21924),d=n(96410)();if(d){r=o("Object.prototype.hasOwnProperty"),a=o("RegExp.prototype.exec"),s={};var u=function(){throw s};i={toString:u,valueOf:u},"symbol"==typeof Symbol.toPrimitive&&(i[Symbol.toPrimitive]=u)}var _=o("Object.prototype.toString"),l=Object.getOwnPropertyDescriptor;e.exports=d?function(e){if(!e||"object"!=typeof e)return!1;var t=l(e,"lastIndex");if(!t||!r(t,"value"))return!1;try{a(e,i)}catch(e){return e===s}}:function(e){return!(!e||"object"!=typeof e&&"function"!=typeof e)&&"[object RegExp]"===_(e)}},12636:(e,t,n)=>{"use strict";var r=Object.prototype.toString;if(n(41405)()){var a=Symbol.prototype.toString,s=/^Symbol\(.*\)$/;e.exports=function(e){if("symbol"==typeof e)return!0;if("[object Symbol]"!==r.call(e))return!1;try{return function(e){return"symbol"==typeof e.valueOf()&&s.test(a.call(e))}(e)}catch(e){return!1}}}else e.exports=function(e){return!1}},42786:function(e,t,n){!function(e){"use strict";e.defineLocale("af",{months:"Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember".split("_"),monthsShort:"Jan_Feb_Mrt_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des".split("_"),weekdays:"Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag".split("_"),weekdaysShort:"Son_Maa_Din_Woe_Don_Vry_Sat".split("_"),weekdaysMin:"So_Ma_Di_Wo_Do_Vr_Sa".split("_"),meridiemParse:/vm|nm/i,isPM:function(e){return/^nm$/i.test(e)},meridiem:function(e,t,n){return e<12?n?"vm":"VM":n?"nm":"NM"},longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Vandag om] LT",nextDay:"[MÃ´re om] LT",nextWeek:"dddd [om] LT",lastDay:"[Gister om] LT",lastWeek:"[Laas] dddd [om] LT",sameElse:"L"},relativeTime:{future:"oor %s",past:"%s gelede",s:"'n paar sekondes",ss:"%d sekondes",m:"'n minuut",mm:"%d minute",h:"'n uur",hh:"%d ure",d:"'n dag",dd:"%d dae",M:"'n maand",MM:"%d maande",y:"'n jaar",yy:"%d jaar"},dayOfMonthOrdinalParse:/\d{1,2}(ste|de)/,ordinal:function(e){return e+(1===e||8===e||e>=20?"ste":"de")},week:{dow:1,doy:4}})}(n(30381))},14130:function(e,t,n){!function(e){"use strict";var t=function(e){return 0===e?0:1===e?1:2===e?2:e%100>=3&&e%100<=10?3:e%100>=11?4:5},n={s:["Ø£Ù‚Ù„ Ù…Ù† Ø«Ø§Ù†ÙŠØ©","Ø«Ø§Ù†ÙŠØ© ÙˆØ§Ø­Ø¯Ø©",["Ø«Ø§Ù†ÙŠØªØ§Ù†","Ø«Ø§Ù†ÙŠØªÙŠÙ†"],"%d Ø«ÙˆØ§Ù†","%d Ø«Ø§Ù†ÙŠØ©","%d Ø«Ø§Ù†ÙŠØ©"],m:["Ø£Ù‚Ù„ Ù…Ù† Ø¯Ù‚ÙŠÙ‚Ø©","Ø¯Ù‚ÙŠÙ‚Ø© ÙˆØ§Ø­Ø¯Ø©",["Ø¯Ù‚ÙŠÙ‚ØªØ§Ù†","Ø¯Ù‚ÙŠÙ‚ØªÙŠÙ†"],"%d Ø¯Ù‚Ø§Ø¦Ù‚","%d Ø¯Ù‚ÙŠÙ‚Ø©","%d Ø¯Ù‚ÙŠÙ‚Ø©"],h:["Ø£Ù‚Ù„ Ù…Ù† Ø³Ø§Ø¹Ø©","Ø³Ø§Ø¹Ø© ÙˆØ§Ø­Ø¯Ø©",["Ø³Ø§Ø¹ØªØ§Ù†","Ø³Ø§Ø¹ØªÙŠÙ†"],"%d Ø³Ø§Ø¹Ø§Øª","%d Ø³Ø§Ø¹Ø©","%d Ø³Ø§Ø¹Ø©"],d:["Ø£Ù‚Ù„ Ù…Ù† ÙŠÙˆÙ…","ÙŠÙˆÙ… ÙˆØ§Ø­Ø¯",["ÙŠÙˆÙ…Ø§Ù†","ÙŠÙˆÙ…ÙŠÙ†"],"%d Ø£ÙŠØ§Ù…","%d ÙŠÙˆÙ…Ù‹Ø§","%d ÙŠÙˆÙ…"],M:["Ø£Ù‚Ù„ Ù…Ù† Ø´Ù‡Ø±","Ø´Ù‡Ø± ÙˆØ§Ø­Ø¯",["Ø´Ù‡Ø±Ø§Ù†","Ø´Ù‡Ø±ÙŠÙ†"],"%d Ø£Ø´Ù‡Ø±","%d Ø´Ù‡Ø±Ø§","%d Ø´Ù‡Ø±"],y:["Ø£Ù‚Ù„ Ù…Ù† Ø¹Ø§Ù…","Ø¹Ø§Ù… ÙˆØ§Ø­Ø¯",["Ø¹Ø§Ù…Ø§Ù†","Ø¹Ø§Ù…ÙŠÙ†"],"%d Ø£Ø¹ÙˆØ§Ù…","%d Ø¹Ø§Ù…Ù‹Ø§","%d Ø¹Ø§Ù…"]},r=function(e){return function(r,a,s,i){var o=t(r),d=n[e][t(r)];return 2===o&&(d=d[a?0:1]),d.replace(/%d/i,r)}},a=["Ø¬Ø§Ù†ÙÙŠ","ÙÙŠÙØ±ÙŠ","Ù…Ø§Ø±Ø³","Ø£ÙØ±ÙŠÙ„","Ù…Ø§ÙŠ","Ø¬ÙˆØ§Ù†","Ø¬ÙˆÙŠÙ„ÙŠØ©","Ø£ÙˆØª","Ø³Ø¨ØªÙ…Ø¨Ø±","Ø£ÙƒØªÙˆØ¨Ø±","Ù†ÙˆÙÙ…Ø¨Ø±","Ø¯ÙŠØ³Ù…Ø¨Ø±"];e.defineLocale("ar-dz",{months:a,monthsShort:a,weekdays:"Ø§Ù„Ø£Ø­Ø¯_Ø§Ù„Ø¥Ø«Ù†ÙŠÙ†_Ø§Ù„Ø«Ù„Ø§Ø«Ø§Ø¡_Ø§Ù„Ø£Ø±Ø¨Ø¹Ø§Ø¡_Ø§Ù„Ø®Ù…ÙŠØ³_Ø§Ù„Ø¬Ù…Ø¹Ø©_Ø§Ù„Ø³Ø¨Øª".split("_"),weekdaysShort:"Ø£Ø­Ø¯_Ø¥Ø«Ù†ÙŠÙ†_Ø«Ù„Ø§Ø«Ø§Ø¡_Ø£Ø±Ø¨Ø¹Ø§Ø¡_Ø®Ù…ÙŠØ³_Ø¬Ù…Ø¹Ø©_Ø³Ø¨Øª".split("_"),weekdaysMin:"Ø­_Ù†_Ø«_Ø±_Ø®_Ø¬_Ø³".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"D/â€M/â€YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},meridiemParse:/Øµ|Ù…/,isPM:function(e){return"Ù…"===e},meridiem:function(e,t,n){return e<12?"Øµ":"Ù…"},calendar:{sameDay:"[Ø§Ù„ÙŠÙˆÙ… Ø¹Ù†Ø¯ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",nextDay:"[ØºØ¯Ù‹Ø§ Ø¹Ù†Ø¯ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",nextWeek:"dddd [Ø¹Ù†Ø¯ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",lastDay:"[Ø£Ù…Ø³ Ø¹Ù†Ø¯ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",lastWeek:"dddd [Ø¹Ù†Ø¯ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",sameElse:"L"},relativeTime:{future:"Ø¨Ø¹Ø¯ %s",past:"Ù…Ù†Ø° %s",s:r("s"),ss:r("s"),m:r("m"),mm:r("m"),h:r("h"),hh:r("h"),d:r("d"),dd:r("d"),M:r("M"),MM:r("M"),y:r("y"),yy:r("y")},postformat:function(e){return e.replace(/,/g,"ØŒ")},week:{dow:0,doy:4}})}(n(30381))},96135:function(e,t,n){!function(e){"use strict";e.defineLocale("ar-kw",{months:"ÙŠÙ†Ø§ÙŠØ±_ÙØ¨Ø±Ø§ÙŠØ±_Ù…Ø§Ø±Ø³_Ø£Ø¨Ø±ÙŠÙ„_Ù…Ø§ÙŠ_ÙŠÙˆÙ†ÙŠÙˆ_ÙŠÙˆÙ„ÙŠÙˆØ²_ØºØ´Øª_Ø´ØªÙ†Ø¨Ø±_Ø£ÙƒØªÙˆØ¨Ø±_Ù†ÙˆÙ†Ø¨Ø±_Ø¯Ø¬Ù†Ø¨Ø±".split("_"),monthsShort:"ÙŠÙ†Ø§ÙŠØ±_ÙØ¨Ø±Ø§ÙŠØ±_Ù…Ø§Ø±Ø³_Ø£Ø¨Ø±ÙŠÙ„_Ù…Ø§ÙŠ_ÙŠÙˆÙ†ÙŠÙˆ_ÙŠÙˆÙ„ÙŠÙˆØ²_ØºØ´Øª_Ø´ØªÙ†Ø¨Ø±_Ø£ÙƒØªÙˆØ¨Ø±_Ù†ÙˆÙ†Ø¨Ø±_Ø¯Ø¬Ù†Ø¨Ø±".split("_"),weekdays:"Ø§Ù„Ø£Ø­Ø¯_Ø§Ù„Ø¥ØªÙ†ÙŠÙ†_Ø§Ù„Ø«Ù„Ø§Ø«Ø§Ø¡_Ø§Ù„Ø£Ø±Ø¨Ø¹Ø§Ø¡_Ø§Ù„Ø®Ù…ÙŠØ³_Ø§Ù„Ø¬Ù…Ø¹Ø©_Ø§Ù„Ø³Ø¨Øª".split("_"),weekdaysShort:"Ø§Ø­Ø¯_Ø§ØªÙ†ÙŠÙ†_Ø«Ù„Ø§Ø«Ø§Ø¡_Ø§Ø±Ø¨Ø¹Ø§Ø¡_Ø®Ù…ÙŠØ³_Ø¬Ù…Ø¹Ø©_Ø³Ø¨Øª".split("_"),weekdaysMin:"Ø­_Ù†_Ø«_Ø±_Ø®_Ø¬_Ø³".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Ø§Ù„ÙŠÙˆÙ… Ø¹Ù„Ù‰ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",nextDay:"[ØºØ¯Ø§ Ø¹Ù„Ù‰ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",nextWeek:"dddd [Ø¹Ù„Ù‰ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",lastDay:"[Ø£Ù…Ø³ Ø¹Ù„Ù‰ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",lastWeek:"dddd [Ø¹Ù„Ù‰ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",sameElse:"L"},relativeTime:{future:"ÙÙŠ %s",past:"Ù…Ù†Ø° %s",s:"Ø«ÙˆØ§Ù†",ss:"%d Ø«Ø§Ù†ÙŠØ©",m:"Ø¯Ù‚ÙŠÙ‚Ø©",mm:"%d Ø¯Ù‚Ø§Ø¦Ù‚",h:"Ø³Ø§Ø¹Ø©",hh:"%d Ø³Ø§Ø¹Ø§Øª",d:"ÙŠÙˆÙ…",dd:"%d Ø£ÙŠØ§Ù…",M:"Ø´Ù‡Ø±",MM:"%d Ø£Ø´Ù‡Ø±",y:"Ø³Ù†Ø©",yy:"%d Ø³Ù†ÙˆØ§Øª"},week:{dow:0,doy:12}})}(n(30381))},56440:function(e,t,n){!function(e){"use strict";var t={1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7",8:"8",9:"9",0:"0"},n=function(e){return 0===e?0:1===e?1:2===e?2:e%100>=3&&e%100<=10?3:e%100>=11?4:5},r={s:["Ø£Ù‚Ù„ Ù…Ù† Ø«Ø§Ù†ÙŠØ©","Ø«Ø§Ù†ÙŠØ© ÙˆØ§Ø­Ø¯Ø©",["Ø«Ø§Ù†ÙŠØªØ§Ù†","Ø«Ø§Ù†ÙŠØªÙŠÙ†"],"%d Ø«ÙˆØ§Ù†","%d Ø«Ø§Ù†ÙŠØ©","%d Ø«Ø§Ù†ÙŠØ©"],m:["Ø£Ù‚Ù„ Ù…Ù† Ø¯Ù‚ÙŠÙ‚Ø©","Ø¯Ù‚ÙŠÙ‚Ø© ÙˆØ§Ø­Ø¯Ø©",["Ø¯Ù‚ÙŠÙ‚ØªØ§Ù†","Ø¯Ù‚ÙŠÙ‚ØªÙŠÙ†"],"%d Ø¯Ù‚Ø§Ø¦Ù‚","%d Ø¯Ù‚ÙŠÙ‚Ø©","%d Ø¯Ù‚ÙŠÙ‚Ø©"],h:["Ø£Ù‚Ù„ Ù…Ù† Ø³Ø§Ø¹Ø©","Ø³Ø§Ø¹Ø© ÙˆØ§Ø­Ø¯Ø©",["Ø³Ø§Ø¹ØªØ§Ù†","Ø³Ø§Ø¹ØªÙŠÙ†"],"%d Ø³Ø§Ø¹Ø§Øª","%d Ø³Ø§Ø¹Ø©","%d Ø³Ø§Ø¹Ø©"],d:["Ø£Ù‚Ù„ Ù…Ù† ÙŠÙˆÙ…","ÙŠÙˆÙ… ÙˆØ§Ø­Ø¯",["ÙŠÙˆÙ…Ø§Ù†","ÙŠÙˆÙ…ÙŠÙ†"],"%d Ø£ÙŠØ§Ù…","%d ÙŠÙˆÙ…Ù‹Ø§","%d ÙŠÙˆÙ…"],M:["Ø£Ù‚Ù„ Ù…Ù† Ø´Ù‡Ø±","Ø´Ù‡Ø± ÙˆØ§Ø­Ø¯",["Ø´Ù‡Ø±Ø§Ù†","Ø´Ù‡Ø±ÙŠÙ†"],"%d Ø£Ø´Ù‡Ø±","%d Ø´Ù‡Ø±Ø§","%d Ø´Ù‡Ø±"],y:["Ø£Ù‚Ù„ Ù…Ù† Ø¹Ø§Ù…","Ø¹Ø§Ù… ÙˆØ§Ø­Ø¯",["Ø¹Ø§Ù…Ø§Ù†","Ø¹Ø§Ù…ÙŠÙ†"],"%d Ø£Ø¹ÙˆØ§Ù…","%d Ø¹Ø§Ù…Ù‹Ø§","%d Ø¹Ø§Ù…"]},a=function(e){return function(t,a,s,i){var o=n(t),d=r[e][n(t)];return 2===o&&(d=d[a?0:1]),d.replace(/%d/i,t)}},s=["ÙŠÙ†Ø§ÙŠØ±","ÙØ¨Ø±Ø§ÙŠØ±","Ù…Ø§Ø±Ø³","Ø£Ø¨Ø±ÙŠÙ„","Ù…Ø§ÙŠÙˆ","ÙŠÙˆÙ†ÙŠÙˆ","ÙŠÙˆÙ„ÙŠÙˆ","Ø£ØºØ³Ø·Ø³","Ø³Ø¨ØªÙ…Ø¨Ø±","Ø£ÙƒØªÙˆØ¨Ø±","Ù†ÙˆÙÙ…Ø¨Ø±","Ø¯ÙŠØ³Ù…Ø¨Ø±"];e.defineLocale("ar-ly",{months:s,monthsShort:s,weekdays:"Ø§Ù„Ø£Ø­Ø¯_Ø§Ù„Ø¥Ø«Ù†ÙŠÙ†_Ø§Ù„Ø«Ù„Ø§Ø«Ø§Ø¡_Ø§Ù„Ø£Ø±Ø¨Ø¹Ø§Ø¡_Ø§Ù„Ø®Ù…ÙŠØ³_Ø§Ù„Ø¬Ù…Ø¹Ø©_Ø§Ù„Ø³Ø¨Øª".split("_"),weekdaysShort:"Ø£Ø­Ø¯_Ø¥Ø«Ù†ÙŠÙ†_Ø«Ù„Ø§Ø«Ø§Ø¡_Ø£Ø±Ø¨Ø¹Ø§Ø¡_Ø®Ù…ÙŠØ³_Ø¬Ù…Ø¹Ø©_Ø³Ø¨Øª".split("_"),weekdaysMin:"Ø­_Ù†_Ø«_Ø±_Ø®_Ø¬_Ø³".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"D/â€M/â€YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},meridiemParse:/Øµ|Ù…/,isPM:function(e){return"Ù…"===e},meridiem:function(e,t,n){return e<12?"Øµ":"Ù…"},calendar:{sameDay:"[Ø§Ù„ÙŠÙˆÙ… Ø¹Ù†Ø¯ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",nextDay:"[ØºØ¯Ù‹Ø§ Ø¹Ù†Ø¯ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",nextWeek:"dddd [Ø¹Ù†Ø¯ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",lastDay:"[Ø£Ù…Ø³ Ø¹Ù†Ø¯ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",lastWeek:"dddd [Ø¹Ù†Ø¯ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",sameElse:"L"},relativeTime:{future:"Ø¨Ø¹Ø¯ %s",past:"Ù…Ù†Ø° %s",s:a("s"),ss:a("s"),m:a("m"),mm:a("m"),h:a("h"),hh:a("h"),d:a("d"),dd:a("d"),M:a("M"),MM:a("M"),y:a("y"),yy:a("y")},preparse:function(e){return e.replace(/ØŒ/g,",")},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]})).replace(/,/g,"ØŒ")},week:{dow:6,doy:12}})}(n(30381))},47702:function(e,t,n){!function(e){"use strict";e.defineLocale("ar-ma",{months:"ÙŠÙ†Ø§ÙŠØ±_ÙØ¨Ø±Ø§ÙŠØ±_Ù…Ø§Ø±Ø³_Ø£Ø¨Ø±ÙŠÙ„_Ù…Ø§ÙŠ_ÙŠÙˆÙ†ÙŠÙˆ_ÙŠÙˆÙ„ÙŠÙˆØ²_ØºØ´Øª_Ø´ØªÙ†Ø¨Ø±_Ø£ÙƒØªÙˆØ¨Ø±_Ù†ÙˆÙ†Ø¨Ø±_Ø¯Ø¬Ù†Ø¨Ø±".split("_"),monthsShort:"ÙŠÙ†Ø§ÙŠØ±_ÙØ¨Ø±Ø§ÙŠØ±_Ù…Ø§Ø±Ø³_Ø£Ø¨Ø±ÙŠÙ„_Ù…Ø§ÙŠ_ÙŠÙˆÙ†ÙŠÙˆ_ÙŠÙˆÙ„ÙŠÙˆØ²_ØºØ´Øª_Ø´ØªÙ†Ø¨Ø±_Ø£ÙƒØªÙˆØ¨Ø±_Ù†ÙˆÙ†Ø¨Ø±_Ø¯Ø¬Ù†Ø¨Ø±".split("_"),weekdays:"Ø§Ù„Ø£Ø­Ø¯_Ø§Ù„Ø¥Ø«Ù†ÙŠÙ†_Ø§Ù„Ø«Ù„Ø§Ø«Ø§Ø¡_Ø§Ù„Ø£Ø±Ø¨Ø¹Ø§Ø¡_Ø§Ù„Ø®Ù…ÙŠØ³_Ø§Ù„Ø¬Ù…Ø¹Ø©_Ø§Ù„Ø³Ø¨Øª".split("_"),weekdaysShort:"Ø§Ø­Ø¯_Ø§Ø«Ù†ÙŠÙ†_Ø«Ù„Ø§Ø«Ø§Ø¡_Ø§Ø±Ø¨Ø¹Ø§Ø¡_Ø®Ù…ÙŠØ³_Ø¬Ù…Ø¹Ø©_Ø³Ø¨Øª".split("_"),weekdaysMin:"Ø­_Ù†_Ø«_Ø±_Ø®_Ø¬_Ø³".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Ø§Ù„ÙŠÙˆÙ… Ø¹Ù„Ù‰ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",nextDay:"[ØºØ¯Ø§ Ø¹Ù„Ù‰ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",nextWeek:"dddd [Ø¹Ù„Ù‰ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",lastDay:"[Ø£Ù…Ø³ Ø¹Ù„Ù‰ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",lastWeek:"dddd [Ø¹Ù„Ù‰ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",sameElse:"L"},relativeTime:{future:"ÙÙŠ %s",past:"Ù…Ù†Ø° %s",s:"Ø«ÙˆØ§Ù†",ss:"%d Ø«Ø§Ù†ÙŠØ©",m:"Ø¯Ù‚ÙŠÙ‚Ø©",mm:"%d Ø¯Ù‚Ø§Ø¦Ù‚",h:"Ø³Ø§Ø¹Ø©",hh:"%d Ø³Ø§Ø¹Ø§Øª",d:"ÙŠÙˆÙ…",dd:"%d Ø£ÙŠØ§Ù…",M:"Ø´Ù‡Ø±",MM:"%d Ø£Ø´Ù‡Ø±",y:"Ø³Ù†Ø©",yy:"%d Ø³Ù†ÙˆØ§Øª"},week:{dow:1,doy:4}})}(n(30381))},16040:function(e,t,n){!function(e){"use strict";var t={1:"Ù¡",2:"Ù¢",3:"Ù£",4:"Ù¤",5:"Ù¥",6:"Ù¦",7:"Ù§",8:"Ù¨",9:"Ù©",0:"Ù "},n={"Ù¡":"1","Ù¢":"2","Ù£":"3","Ù¤":"4","Ù¥":"5","Ù¦":"6","Ù§":"7","Ù¨":"8","Ù©":"9","Ù ":"0"};e.defineLocale("ar-sa",{months:"ÙŠÙ†Ø§ÙŠØ±_ÙØ¨Ø±Ø§ÙŠØ±_Ù…Ø§Ø±Ø³_Ø£Ø¨Ø±ÙŠÙ„_Ù…Ø§ÙŠÙˆ_ÙŠÙˆÙ†ÙŠÙˆ_ÙŠÙˆÙ„ÙŠÙˆ_Ø£ØºØ³Ø·Ø³_Ø³Ø¨ØªÙ…Ø¨Ø±_Ø£ÙƒØªÙˆØ¨Ø±_Ù†ÙˆÙÙ…Ø¨Ø±_Ø¯ÙŠØ³Ù…Ø¨Ø±".split("_"),monthsShort:"ÙŠÙ†Ø§ÙŠØ±_ÙØ¨Ø±Ø§ÙŠØ±_Ù…Ø§Ø±Ø³_Ø£Ø¨Ø±ÙŠÙ„_Ù…Ø§ÙŠÙˆ_ÙŠÙˆÙ†ÙŠÙˆ_ÙŠÙˆÙ„ÙŠÙˆ_Ø£ØºØ³Ø·Ø³_Ø³Ø¨ØªÙ…Ø¨Ø±_Ø£ÙƒØªÙˆØ¨Ø±_Ù†ÙˆÙÙ…Ø¨Ø±_Ø¯ÙŠØ³Ù…Ø¨Ø±".split("_"),weekdays:"Ø§Ù„Ø£Ø­Ø¯_Ø§Ù„Ø¥Ø«Ù†ÙŠÙ†_Ø§Ù„Ø«Ù„Ø§Ø«Ø§Ø¡_Ø§Ù„Ø£Ø±Ø¨Ø¹Ø§Ø¡_Ø§Ù„Ø®Ù…ÙŠØ³_Ø§Ù„Ø¬Ù…Ø¹Ø©_Ø§Ù„Ø³Ø¨Øª".split("_"),weekdaysShort:"Ø£Ø­Ø¯_Ø¥Ø«Ù†ÙŠÙ†_Ø«Ù„Ø§Ø«Ø§Ø¡_Ø£Ø±Ø¨Ø¹Ø§Ø¡_Ø®Ù…ÙŠØ³_Ø¬Ù…Ø¹Ø©_Ø³Ø¨Øª".split("_"),weekdaysMin:"Ø­_Ù†_Ø«_Ø±_Ø®_Ø¬_Ø³".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},meridiemParse:/Øµ|Ù…/,isPM:function(e){return"Ù…"===e},meridiem:function(e,t,n){return e<12?"Øµ":"Ù…"},calendar:{sameDay:"[Ø§Ù„ÙŠÙˆÙ… Ø¹Ù„Ù‰ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",nextDay:"[ØºØ¯Ø§ Ø¹Ù„Ù‰ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",nextWeek:"dddd [Ø¹Ù„Ù‰ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",lastDay:"[Ø£Ù…Ø³ Ø¹Ù„Ù‰ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",lastWeek:"dddd [Ø¹Ù„Ù‰ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",sameElse:"L"},relativeTime:{future:"ÙÙŠ %s",past:"Ù…Ù†Ø° %s",s:"Ø«ÙˆØ§Ù†",ss:"%d Ø«Ø§Ù†ÙŠØ©",m:"Ø¯Ù‚ÙŠÙ‚Ø©",mm:"%d Ø¯Ù‚Ø§Ø¦Ù‚",h:"Ø³Ø§Ø¹Ø©",hh:"%d Ø³Ø§Ø¹Ø§Øª",d:"ÙŠÙˆÙ…",dd:"%d Ø£ÙŠØ§Ù…",M:"Ø´Ù‡Ø±",MM:"%d Ø£Ø´Ù‡Ø±",y:"Ø³Ù†Ø©",yy:"%d Ø³Ù†ÙˆØ§Øª"},preparse:function(e){return e.replace(/[Ù¡Ù¢Ù£Ù¤Ù¥Ù¦Ù§Ù¨Ù©Ù ]/g,(function(e){return n[e]})).replace(/ØŒ/g,",")},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]})).replace(/,/g,"ØŒ")},week:{dow:0,doy:6}})}(n(30381))},37100:function(e,t,n){!function(e){"use strict";e.defineLocale("ar-tn",{months:"Ø¬Ø§Ù†ÙÙŠ_ÙÙŠÙØ±ÙŠ_Ù…Ø§Ø±Ø³_Ø£ÙØ±ÙŠÙ„_Ù…Ø§ÙŠ_Ø¬ÙˆØ§Ù†_Ø¬ÙˆÙŠÙ„ÙŠØ©_Ø£ÙˆØª_Ø³Ø¨ØªÙ…Ø¨Ø±_Ø£ÙƒØªÙˆØ¨Ø±_Ù†ÙˆÙÙ…Ø¨Ø±_Ø¯ÙŠØ³Ù…Ø¨Ø±".split("_"),monthsShort:"Ø¬Ø§Ù†ÙÙŠ_ÙÙŠÙØ±ÙŠ_Ù…Ø§Ø±Ø³_Ø£ÙØ±ÙŠÙ„_Ù…Ø§ÙŠ_Ø¬ÙˆØ§Ù†_Ø¬ÙˆÙŠÙ„ÙŠØ©_Ø£ÙˆØª_Ø³Ø¨ØªÙ…Ø¨Ø±_Ø£ÙƒØªÙˆØ¨Ø±_Ù†ÙˆÙÙ…Ø¨Ø±_Ø¯ÙŠØ³Ù…Ø¨Ø±".split("_"),weekdays:"Ø§Ù„Ø£Ø­Ø¯_Ø§Ù„Ø¥Ø«Ù†ÙŠÙ†_Ø§Ù„Ø«Ù„Ø§Ø«Ø§Ø¡_Ø§Ù„Ø£Ø±Ø¨Ø¹Ø§Ø¡_Ø§Ù„Ø®Ù…ÙŠØ³_Ø§Ù„Ø¬Ù…Ø¹Ø©_Ø§Ù„Ø³Ø¨Øª".split("_"),weekdaysShort:"Ø£Ø­Ø¯_Ø¥Ø«Ù†ÙŠÙ†_Ø«Ù„Ø§Ø«Ø§Ø¡_Ø£Ø±Ø¨Ø¹Ø§Ø¡_Ø®Ù…ÙŠØ³_Ø¬Ù…Ø¹Ø©_Ø³Ø¨Øª".split("_"),weekdaysMin:"Ø­_Ù†_Ø«_Ø±_Ø®_Ø¬_Ø³".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Ø§Ù„ÙŠÙˆÙ… Ø¹Ù„Ù‰ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",nextDay:"[ØºØ¯Ø§ Ø¹Ù„Ù‰ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",nextWeek:"dddd [Ø¹Ù„Ù‰ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",lastDay:"[Ø£Ù…Ø³ Ø¹Ù„Ù‰ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",lastWeek:"dddd [Ø¹Ù„Ù‰ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",sameElse:"L"},relativeTime:{future:"ÙÙŠ %s",past:"Ù…Ù†Ø° %s",s:"Ø«ÙˆØ§Ù†",ss:"%d Ø«Ø§Ù†ÙŠØ©",m:"Ø¯Ù‚ÙŠÙ‚Ø©",mm:"%d Ø¯Ù‚Ø§Ø¦Ù‚",h:"Ø³Ø§Ø¹Ø©",hh:"%d Ø³Ø§Ø¹Ø§Øª",d:"ÙŠÙˆÙ…",dd:"%d Ø£ÙŠØ§Ù…",M:"Ø´Ù‡Ø±",MM:"%d Ø£Ø´Ù‡Ø±",y:"Ø³Ù†Ø©",yy:"%d Ø³Ù†ÙˆØ§Øª"},week:{dow:1,doy:4}})}(n(30381))},30867:function(e,t,n){!function(e){"use strict";var t={1:"Ù¡",2:"Ù¢",3:"Ù£",4:"Ù¤",5:"Ù¥",6:"Ù¦",7:"Ù§",8:"Ù¨",9:"Ù©",0:"Ù "},n={"Ù¡":"1","Ù¢":"2","Ù£":"3","Ù¤":"4","Ù¥":"5","Ù¦":"6","Ù§":"7","Ù¨":"8","Ù©":"9","Ù ":"0"},r=function(e){return 0===e?0:1===e?1:2===e?2:e%100>=3&&e%100<=10?3:e%100>=11?4:5},a={s:["Ø£Ù‚Ù„ Ù…Ù† Ø«Ø§Ù†ÙŠØ©","Ø«Ø§Ù†ÙŠØ© ÙˆØ§Ø­Ø¯Ø©",["Ø«Ø§Ù†ÙŠØªØ§Ù†","Ø«Ø§Ù†ÙŠØªÙŠÙ†"],"%d Ø«ÙˆØ§Ù†","%d Ø«Ø§Ù†ÙŠØ©","%d Ø«Ø§Ù†ÙŠØ©"],m:["Ø£Ù‚Ù„ Ù…Ù† Ø¯Ù‚ÙŠÙ‚Ø©","Ø¯Ù‚ÙŠÙ‚Ø© ÙˆØ§Ø­Ø¯Ø©",["Ø¯Ù‚ÙŠÙ‚ØªØ§Ù†","Ø¯Ù‚ÙŠÙ‚ØªÙŠÙ†"],"%d Ø¯Ù‚Ø§Ø¦Ù‚","%d Ø¯Ù‚ÙŠÙ‚Ø©","%d Ø¯Ù‚ÙŠÙ‚Ø©"],h:["Ø£Ù‚Ù„ Ù…Ù† Ø³Ø§Ø¹Ø©","Ø³Ø§Ø¹Ø© ÙˆØ§Ø­Ø¯Ø©",["Ø³Ø§Ø¹ØªØ§Ù†","Ø³Ø§Ø¹ØªÙŠÙ†"],"%d Ø³Ø§Ø¹Ø§Øª","%d Ø³Ø§Ø¹Ø©","%d Ø³Ø§Ø¹Ø©"],d:["Ø£Ù‚Ù„ Ù…Ù† ÙŠÙˆÙ…","ÙŠÙˆÙ… ÙˆØ§Ø­Ø¯",["ÙŠÙˆÙ…Ø§Ù†","ÙŠÙˆÙ…ÙŠÙ†"],"%d Ø£ÙŠØ§Ù…","%d ÙŠÙˆÙ…Ù‹Ø§","%d ÙŠÙˆÙ…"],M:["Ø£Ù‚Ù„ Ù…Ù† Ø´Ù‡Ø±","Ø´Ù‡Ø± ÙˆØ§Ø­Ø¯",["Ø´Ù‡Ø±Ø§Ù†","Ø´Ù‡Ø±ÙŠÙ†"],"%d Ø£Ø´Ù‡Ø±","%d Ø´Ù‡Ø±Ø§","%d Ø´Ù‡Ø±"],y:["Ø£Ù‚Ù„ Ù…Ù† Ø¹Ø§Ù…","Ø¹Ø§Ù… ÙˆØ§Ø­Ø¯",["Ø¹Ø§Ù…Ø§Ù†","Ø¹Ø§Ù…ÙŠÙ†"],"%d Ø£Ø¹ÙˆØ§Ù…","%d Ø¹Ø§Ù…Ù‹Ø§","%d Ø¹Ø§Ù…"]},s=function(e){return function(t,n,s,i){var o=r(t),d=a[e][r(t)];return 2===o&&(d=d[n?0:1]),d.replace(/%d/i,t)}},i=["ÙŠÙ†Ø§ÙŠØ±","ÙØ¨Ø±Ø§ÙŠØ±","Ù…Ø§Ø±Ø³","Ø£Ø¨Ø±ÙŠÙ„","Ù…Ø§ÙŠÙˆ","ÙŠÙˆÙ†ÙŠÙˆ","ÙŠÙˆÙ„ÙŠÙˆ","Ø£ØºØ³Ø·Ø³","Ø³Ø¨ØªÙ…Ø¨Ø±","Ø£ÙƒØªÙˆØ¨Ø±","Ù†ÙˆÙÙ…Ø¨Ø±","Ø¯ÙŠØ³Ù…Ø¨Ø±"];e.defineLocale("ar",{months:i,monthsShort:i,weekdays:"Ø§Ù„Ø£Ø­Ø¯_Ø§Ù„Ø¥Ø«Ù†ÙŠÙ†_Ø§Ù„Ø«Ù„Ø§Ø«Ø§Ø¡_Ø§Ù„Ø£Ø±Ø¨Ø¹Ø§Ø¡_Ø§Ù„Ø®Ù…ÙŠØ³_Ø§Ù„Ø¬Ù…Ø¹Ø©_Ø§Ù„Ø³Ø¨Øª".split("_"),weekdaysShort:"Ø£Ø­Ø¯_Ø¥Ø«Ù†ÙŠÙ†_Ø«Ù„Ø§Ø«Ø§Ø¡_Ø£Ø±Ø¨Ø¹Ø§Ø¡_Ø®Ù…ÙŠØ³_Ø¬Ù…Ø¹Ø©_Ø³Ø¨Øª".split("_"),weekdaysMin:"Ø­_Ù†_Ø«_Ø±_Ø®_Ø¬_Ø³".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"D/â€M/â€YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},meridiemParse:/Øµ|Ù…/,isPM:function(e){return"Ù…"===e},meridiem:function(e,t,n){return e<12?"Øµ":"Ù…"},calendar:{sameDay:"[Ø§Ù„ÙŠÙˆÙ… Ø¹Ù†Ø¯ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",nextDay:"[ØºØ¯Ù‹Ø§ Ø¹Ù†Ø¯ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",nextWeek:"dddd [Ø¹Ù†Ø¯ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",lastDay:"[Ø£Ù…Ø³ Ø¹Ù†Ø¯ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",lastWeek:"dddd [Ø¹Ù†Ø¯ Ø§Ù„Ø³Ø§Ø¹Ø©] LT",sameElse:"L"},relativeTime:{future:"Ø¨Ø¹Ø¯ %s",past:"Ù…Ù†Ø° %s",s:s("s"),ss:s("s"),m:s("m"),mm:s("m"),h:s("h"),hh:s("h"),d:s("d"),dd:s("d"),M:s("M"),MM:s("M"),y:s("y"),yy:s("y")},preparse:function(e){return e.replace(/[Ù¡Ù¢Ù£Ù¤Ù¥Ù¦Ù§Ù¨Ù©Ù ]/g,(function(e){return n[e]})).replace(/ØŒ/g,",")},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]})).replace(/,/g,"ØŒ")},week:{dow:6,doy:12}})}(n(30381))},31083:function(e,t,n){!function(e){"use strict";var t={1:"-inci",5:"-inci",8:"-inci",70:"-inci",80:"-inci",2:"-nci",7:"-nci",20:"-nci",50:"-nci",3:"-Ã¼ncÃ¼",4:"-Ã¼ncÃ¼",100:"-Ã¼ncÃ¼",6:"-ncÄ±",9:"-uncu",10:"-uncu",30:"-uncu",60:"-Ä±ncÄ±",90:"-Ä±ncÄ±"};e.defineLocale("az",{months:"yanvar_fevral_mart_aprel_may_iyun_iyul_avqust_sentyabr_oktyabr_noyabr_dekabr".split("_"),monthsShort:"yan_fev_mar_apr_may_iyn_iyl_avq_sen_okt_noy_dek".split("_"),weekdays:"Bazar_Bazar ertÉ™si_Ã‡É™rÅŸÉ™nbÉ™ axÅŸamÄ±_Ã‡É™rÅŸÉ™nbÉ™_CÃ¼mÉ™ axÅŸamÄ±_CÃ¼mÉ™_ÅžÉ™nbÉ™".split("_"),weekdaysShort:"Baz_BzE_Ã‡Ax_Ã‡É™r_CAx_CÃ¼m_ÅžÉ™n".split("_"),weekdaysMin:"Bz_BE_Ã‡A_Ã‡É™_CA_CÃ¼_ÅžÉ™".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[bugÃ¼n saat] LT",nextDay:"[sabah saat] LT",nextWeek:"[gÉ™lÉ™n hÉ™ftÉ™] dddd [saat] LT",lastDay:"[dÃ¼nÉ™n] LT",lastWeek:"[keÃ§É™n hÉ™ftÉ™] dddd [saat] LT",sameElse:"L"},relativeTime:{future:"%s sonra",past:"%s É™vvÉ™l",s:"bir neÃ§É™ saniyÉ™",ss:"%d saniyÉ™",m:"bir dÉ™qiqÉ™",mm:"%d dÉ™qiqÉ™",h:"bir saat",hh:"%d saat",d:"bir gÃ¼n",dd:"%d gÃ¼n",M:"bir ay",MM:"%d ay",y:"bir il",yy:"%d il"},meridiemParse:/gecÉ™|sÉ™hÉ™r|gÃ¼ndÃ¼z|axÅŸam/,isPM:function(e){return/^(gÃ¼ndÃ¼z|axÅŸam)$/.test(e)},meridiem:function(e,t,n){return e<4?"gecÉ™":e<12?"sÉ™hÉ™r":e<17?"gÃ¼ndÃ¼z":"axÅŸam"},dayOfMonthOrdinalParse:/\d{1,2}-(Ä±ncÄ±|inci|nci|Ã¼ncÃ¼|ncÄ±|uncu)/,ordinal:function(e){if(0===e)return e+"-Ä±ncÄ±";var n=e%10;return e+(t[n]||t[e%100-n]||t[e>=100?100:null])},week:{dow:1,doy:7}})}(n(30381))},9808:function(e,t,n){!function(e){"use strict";function t(e,t,n){return"m"===n?t?"Ñ…Ð²Ñ–Ð»Ñ–Ð½Ð°":"Ñ…Ð²Ñ–Ð»Ñ–Ð½Ñƒ":"h"===n?t?"Ð³Ð°Ð´Ð·Ñ–Ð½Ð°":"Ð³Ð°Ð´Ð·Ñ–Ð½Ñƒ":e+" "+(r=+e,a={ss:t?"ÑÐµÐºÑƒÐ½Ð´Ð°_ÑÐµÐºÑƒÐ½Ð´Ñ‹_ÑÐµÐºÑƒÐ½Ð´":"ÑÐµÐºÑƒÐ½Ð´Ñƒ_ÑÐµÐºÑƒÐ½Ð´Ñ‹_ÑÐµÐºÑƒÐ½Ð´",mm:t?"Ñ…Ð²Ñ–Ð»Ñ–Ð½Ð°_Ñ…Ð²Ñ–Ð»Ñ–Ð½Ñ‹_Ñ…Ð²Ñ–Ð»Ñ–Ð½":"Ñ…Ð²Ñ–Ð»Ñ–Ð½Ñƒ_Ñ…Ð²Ñ–Ð»Ñ–Ð½Ñ‹_Ñ…Ð²Ñ–Ð»Ñ–Ð½",hh:t?"Ð³Ð°Ð´Ð·Ñ–Ð½Ð°_Ð³Ð°Ð´Ð·Ñ–Ð½Ñ‹_Ð³Ð°Ð´Ð·Ñ–Ð½":"Ð³Ð°Ð´Ð·Ñ–Ð½Ñƒ_Ð³Ð°Ð´Ð·Ñ–Ð½Ñ‹_Ð³Ð°Ð´Ð·Ñ–Ð½",dd:"Ð´Ð·ÐµÐ½ÑŒ_Ð´Ð½Ñ–_Ð´Ð·Ñ‘Ð½",MM:"Ð¼ÐµÑÑÑ†_Ð¼ÐµÑÑÑ†Ñ‹_Ð¼ÐµÑÑÑ†Ð°Ñž",yy:"Ð³Ð¾Ð´_Ð³Ð°Ð´Ñ‹_Ð³Ð°Ð´Ð¾Ñž"}[n].split("_"),r%10==1&&r%100!=11?a[0]:r%10>=2&&r%10<=4&&(r%100<10||r%100>=20)?a[1]:a[2]);var r,a}e.defineLocale("be",{months:{format:"ÑÑ‚ÑƒÐ´Ð·ÐµÐ½Ñ_Ð»ÑŽÑ‚Ð°Ð³Ð°_ÑÐ°ÐºÐ°Ð²Ñ–ÐºÐ°_ÐºÑ€Ð°ÑÐ°Ð²Ñ–ÐºÐ°_Ñ‚Ñ€Ð°ÑžÐ½Ñ_Ñ‡ÑÑ€Ð²ÐµÐ½Ñ_Ð»Ñ–Ð¿ÐµÐ½Ñ_Ð¶Ð½Ñ–ÑžÐ½Ñ_Ð²ÐµÑ€Ð°ÑÐ½Ñ_ÐºÐ°ÑÑ‚Ñ€Ñ‹Ñ‡Ð½Ñ–ÐºÐ°_Ð»Ñ–ÑÑ‚Ð°Ð¿Ð°Ð´Ð°_ÑÐ½ÐµÐ¶Ð½Ñ".split("_"),standalone:"ÑÑ‚ÑƒÐ´Ð·ÐµÐ½ÑŒ_Ð»ÑŽÑ‚Ñ‹_ÑÐ°ÐºÐ°Ð²Ñ–Ðº_ÐºÑ€Ð°ÑÐ°Ð²Ñ–Ðº_Ñ‚Ñ€Ð°Ð²ÐµÐ½ÑŒ_Ñ‡ÑÑ€Ð²ÐµÐ½ÑŒ_Ð»Ñ–Ð¿ÐµÐ½ÑŒ_Ð¶Ð½Ñ–Ð²ÐµÐ½ÑŒ_Ð²ÐµÑ€Ð°ÑÐµÐ½ÑŒ_ÐºÐ°ÑÑ‚Ñ€Ñ‹Ñ‡Ð½Ñ–Ðº_Ð»Ñ–ÑÑ‚Ð°Ð¿Ð°Ð´_ÑÐ½ÐµÐ¶Ð°Ð½ÑŒ".split("_")},monthsShort:"ÑÑ‚ÑƒÐ´_Ð»ÑŽÑ‚_ÑÐ°Ðº_ÐºÑ€Ð°Ñ_Ñ‚Ñ€Ð°Ð²_Ñ‡ÑÑ€Ð²_Ð»Ñ–Ð¿_Ð¶Ð½Ñ–Ð²_Ð²ÐµÑ€_ÐºÐ°ÑÑ‚_Ð»Ñ–ÑÑ‚_ÑÐ½ÐµÐ¶".split("_"),weekdays:{format:"Ð½ÑÐ´Ð·ÐµÐ»ÑŽ_Ð¿Ð°Ð½ÑÐ´Ð·ÐµÐ»Ð°Ðº_Ð°ÑžÑ‚Ð¾Ñ€Ð°Ðº_ÑÐµÑ€Ð°Ð´Ñƒ_Ñ‡Ð°Ñ†Ð²ÐµÑ€_Ð¿ÑÑ‚Ð½Ñ–Ñ†Ñƒ_ÑÑƒÐ±Ð¾Ñ‚Ñƒ".split("_"),standalone:"Ð½ÑÐ´Ð·ÐµÐ»Ñ_Ð¿Ð°Ð½ÑÐ´Ð·ÐµÐ»Ð°Ðº_Ð°ÑžÑ‚Ð¾Ñ€Ð°Ðº_ÑÐµÑ€Ð°Ð´Ð°_Ñ‡Ð°Ñ†Ð²ÐµÑ€_Ð¿ÑÑ‚Ð½Ñ–Ñ†Ð°_ÑÑƒÐ±Ð¾Ñ‚Ð°".split("_"),isFormat:/\[ ?[Ð£ÑƒÑž] ?(?:Ð¼Ñ–Ð½ÑƒÐ»ÑƒÑŽ|Ð½Ð°ÑÑ‚ÑƒÐ¿Ð½ÑƒÑŽ)? ?\] ?dddd/},weekdaysShort:"Ð½Ð´_Ð¿Ð½_Ð°Ñ‚_ÑÑ€_Ñ‡Ñ†_Ð¿Ñ‚_ÑÐ±".split("_"),weekdaysMin:"Ð½Ð´_Ð¿Ð½_Ð°Ñ‚_ÑÑ€_Ñ‡Ñ†_Ð¿Ñ‚_ÑÐ±".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY Ð³.",LLL:"D MMMM YYYY Ð³., HH:mm",LLLL:"dddd, D MMMM YYYY Ð³., HH:mm"},calendar:{sameDay:"[Ð¡Ñ‘Ð½Ð½Ñ Ñž] LT",nextDay:"[Ð—Ð°ÑžÑ‚Ñ€Ð° Ñž] LT",lastDay:"[Ð£Ñ‡Ð¾Ñ€Ð° Ñž] LT",nextWeek:function(){return"[Ð£] dddd [Ñž] LT"},lastWeek:function(){switch(this.day()){case 0:case 3:case 5:case 6:return"[Ð£ Ð¼Ñ–Ð½ÑƒÐ»ÑƒÑŽ] dddd [Ñž] LT";case 1:case 2:case 4:return"[Ð£ Ð¼Ñ–Ð½ÑƒÐ»Ñ‹] dddd [Ñž] LT"}},sameElse:"L"},relativeTime:{future:"Ð¿Ñ€Ð°Ð· %s",past:"%s Ñ‚Ð°Ð¼Ñƒ",s:"Ð½ÐµÐºÐ°Ð»ÑŒÐºÑ– ÑÐµÐºÑƒÐ½Ð´",m:t,mm:t,h:t,hh:t,d:"Ð´Ð·ÐµÐ½ÑŒ",dd:t,M:"Ð¼ÐµÑÑÑ†",MM:t,y:"Ð³Ð¾Ð´",yy:t},meridiemParse:/Ð½Ð¾Ñ‡Ñ‹|Ñ€Ð°Ð½Ñ–Ñ†Ñ‹|Ð´Ð½Ñ|Ð²ÐµÑ‡Ð°Ñ€Ð°/,isPM:function(e){return/^(Ð´Ð½Ñ|Ð²ÐµÑ‡Ð°Ñ€Ð°)$/.test(e)},meridiem:function(e,t,n){return e<4?"Ð½Ð¾Ñ‡Ñ‹":e<12?"Ñ€Ð°Ð½Ñ–Ñ†Ñ‹":e<17?"Ð´Ð½Ñ":"Ð²ÐµÑ‡Ð°Ñ€Ð°"},dayOfMonthOrdinalParse:/\d{1,2}-(Ñ–|Ñ‹|Ð³Ð°)/,ordinal:function(e,t){switch(t){case"M":case"d":case"DDD":case"w":case"W":return e%10!=2&&e%10!=3||e%100==12||e%100==13?e+"-Ñ‹":e+"-Ñ–";case"D":return e+"-Ð³Ð°";default:return e}},week:{dow:1,doy:7}})}(n(30381))},68338:function(e,t,n){!function(e){"use strict";e.defineLocale("bg",{months:"ÑÐ½ÑƒÐ°Ñ€Ð¸_Ñ„ÐµÐ²Ñ€ÑƒÐ°Ñ€Ð¸_Ð¼Ð°Ñ€Ñ‚_Ð°Ð¿Ñ€Ð¸Ð»_Ð¼Ð°Ð¹_ÑŽÐ½Ð¸_ÑŽÐ»Ð¸_Ð°Ð²Ð³ÑƒÑÑ‚_ÑÐµÐ¿Ñ‚ÐµÐ¼Ð²Ñ€Ð¸_Ð¾ÐºÑ‚Ð¾Ð¼Ð²Ñ€Ð¸_Ð½Ð¾ÐµÐ¼Ð²Ñ€Ð¸_Ð´ÐµÐºÐµÐ¼Ð²Ñ€Ð¸".split("_"),monthsShort:"ÑÐ½Ñƒ_Ñ„ÐµÐ²_Ð¼Ð°Ñ€_Ð°Ð¿Ñ€_Ð¼Ð°Ð¹_ÑŽÐ½Ð¸_ÑŽÐ»Ð¸_Ð°Ð²Ð³_ÑÐµÐ¿_Ð¾ÐºÑ‚_Ð½Ð¾Ðµ_Ð´ÐµÐº".split("_"),weekdays:"Ð½ÐµÐ´ÐµÐ»Ñ_Ð¿Ð¾Ð½ÐµÐ´ÐµÐ»Ð½Ð¸Ðº_Ð²Ñ‚Ð¾Ñ€Ð½Ð¸Ðº_ÑÑ€ÑÐ´Ð°_Ñ‡ÐµÑ‚Ð²ÑŠÑ€Ñ‚ÑŠÐº_Ð¿ÐµÑ‚ÑŠÐº_ÑÑŠÐ±Ð¾Ñ‚Ð°".split("_"),weekdaysShort:"Ð½ÐµÐ´_Ð¿Ð¾Ð½_Ð²Ñ‚Ð¾_ÑÑ€Ñ_Ñ‡ÐµÑ‚_Ð¿ÐµÑ‚_ÑÑŠÐ±".split("_"),weekdaysMin:"Ð½Ð´_Ð¿Ð½_Ð²Ñ‚_ÑÑ€_Ñ‡Ñ‚_Ð¿Ñ‚_ÑÐ±".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"D.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd, D MMMM YYYY H:mm"},calendar:{sameDay:"[Ð”Ð½ÐµÑ Ð²] LT",nextDay:"[Ð£Ñ‚Ñ€Ðµ Ð²] LT",nextWeek:"dddd [Ð²] LT",lastDay:"[Ð’Ñ‡ÐµÑ€Ð° Ð²] LT",lastWeek:function(){switch(this.day()){case 0:case 3:case 6:return"[ÐœÐ¸Ð½Ð°Ð»Ð°Ñ‚Ð°] dddd [Ð²] LT";case 1:case 2:case 4:case 5:return"[ÐœÐ¸Ð½Ð°Ð»Ð¸Ñ] dddd [Ð²] LT"}},sameElse:"L"},relativeTime:{future:"ÑÐ»ÐµÐ´ %s",past:"Ð¿Ñ€ÐµÐ´Ð¸ %s",s:"Ð½ÑÐºÐ¾Ð»ÐºÐ¾ ÑÐµÐºÑƒÐ½Ð´Ð¸",ss:"%d ÑÐµÐºÑƒÐ½Ð´Ð¸",m:"Ð¼Ð¸Ð½ÑƒÑ‚Ð°",mm:"%d Ð¼Ð¸Ð½ÑƒÑ‚Ð¸",h:"Ñ‡Ð°Ñ",hh:"%d Ñ‡Ð°ÑÐ°",d:"Ð´ÐµÐ½",dd:"%d Ð´ÐµÐ½Ð°",w:"ÑÐµÐ´Ð¼Ð¸Ñ†Ð°",ww:"%d ÑÐµÐ´Ð¼Ð¸Ñ†Ð¸",M:"Ð¼ÐµÑÐµÑ†",MM:"%d Ð¼ÐµÑÐµÑ†Ð°",y:"Ð³Ð¾Ð´Ð¸Ð½Ð°",yy:"%d Ð³Ð¾Ð´Ð¸Ð½Ð¸"},dayOfMonthOrdinalParse:/\d{1,2}-(ÐµÐ²|ÐµÐ½|Ñ‚Ð¸|Ð²Ð¸|Ñ€Ð¸|Ð¼Ð¸)/,ordinal:function(e){var t=e%10,n=e%100;return 0===e?e+"-ÐµÐ²":0===n?e+"-ÐµÐ½":n>10&&n<20?e+"-Ñ‚Ð¸":1===t?e+"-Ð²Ð¸":2===t?e+"-Ñ€Ð¸":7===t||8===t?e+"-Ð¼Ð¸":e+"-Ñ‚Ð¸"},week:{dow:1,doy:7}})}(n(30381))},67438:function(e,t,n){!function(e){"use strict";e.defineLocale("bm",{months:"Zanwuyekalo_Fewuruyekalo_Marisikalo_Awirilikalo_MÉ›kalo_ZuwÉ›nkalo_Zuluyekalo_Utikalo_SÉ›tanburukalo_É”kutÉ”burukalo_Nowanburukalo_Desanburukalo".split("_"),monthsShort:"Zan_Few_Mar_Awi_MÉ›_Zuw_Zul_Uti_SÉ›t_É”ku_Now_Des".split("_"),weekdays:"Kari_NtÉ›nÉ›n_Tarata_Araba_Alamisa_Juma_Sibiri".split("_"),weekdaysShort:"Kar_NtÉ›_Tar_Ara_Ala_Jum_Sib".split("_"),weekdaysMin:"Ka_Nt_Ta_Ar_Al_Ju_Si".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"MMMM [tile] D [san] YYYY",LLL:"MMMM [tile] D [san] YYYY [lÉ›rÉ›] HH:mm",LLLL:"dddd MMMM [tile] D [san] YYYY [lÉ›rÉ›] HH:mm"},calendar:{sameDay:"[Bi lÉ›rÉ›] LT",nextDay:"[Sini lÉ›rÉ›] LT",nextWeek:"dddd [don lÉ›rÉ›] LT",lastDay:"[Kunu lÉ›rÉ›] LT",lastWeek:"dddd [tÉ›mÉ›nen lÉ›rÉ›] LT",sameElse:"L"},relativeTime:{future:"%s kÉ”nÉ”",past:"a bÉ› %s bÉ”",s:"sanga dama dama",ss:"sekondi %d",m:"miniti kelen",mm:"miniti %d",h:"lÉ›rÉ› kelen",hh:"lÉ›rÉ› %d",d:"tile kelen",dd:"tile %d",M:"kalo kelen",MM:"kalo %d",y:"san kelen",yy:"san %d"},week:{dow:1,doy:4}})}(n(30381))},76225:function(e,t,n){!function(e){"use strict";var t={1:"à§§",2:"à§¨",3:"à§©",4:"à§ª",5:"à§«",6:"à§¬",7:"à§­",8:"à§®",9:"à§¯",0:"à§¦"},n={"à§§":"1","à§¨":"2","à§©":"3","à§ª":"4","à§«":"5","à§¬":"6","à§­":"7","à§®":"8","à§¯":"9","à§¦":"0"};e.defineLocale("bn-bd",{months:"à¦œà¦¾à¦¨à§à§Ÿà¦¾à¦°à¦¿_à¦«à§‡à¦¬à§à¦°à§à§Ÿà¦¾à¦°à¦¿_à¦®à¦¾à¦°à§à¦š_à¦à¦ªà§à¦°à¦¿à¦²_à¦®à§‡_à¦œà§à¦¨_à¦œà§à¦²à¦¾à¦‡_à¦†à¦—à¦¸à§à¦Ÿ_à¦¸à§‡à¦ªà§à¦Ÿà§‡à¦®à§à¦¬à¦°_à¦…à¦•à§à¦Ÿà§‹à¦¬à¦°_à¦¨à¦­à§‡à¦®à§à¦¬à¦°_à¦¡à¦¿à¦¸à§‡à¦®à§à¦¬à¦°".split("_"),monthsShort:"à¦œà¦¾à¦¨à§_à¦«à§‡à¦¬à§à¦°à§_à¦®à¦¾à¦°à§à¦š_à¦à¦ªà§à¦°à¦¿à¦²_à¦®à§‡_à¦œà§à¦¨_à¦œà§à¦²à¦¾à¦‡_à¦†à¦—à¦¸à§à¦Ÿ_à¦¸à§‡à¦ªà§à¦Ÿ_à¦…à¦•à§à¦Ÿà§‹_à¦¨à¦­à§‡_à¦¡à¦¿à¦¸à§‡".split("_"),weekdays:"à¦°à¦¬à¦¿à¦¬à¦¾à¦°_à¦¸à§‹à¦®à¦¬à¦¾à¦°_à¦®à¦™à§à¦—à¦²à¦¬à¦¾à¦°_à¦¬à§à¦§à¦¬à¦¾à¦°_à¦¬à§ƒà¦¹à¦¸à§à¦ªà¦¤à¦¿à¦¬à¦¾à¦°_à¦¶à§à¦•à§à¦°à¦¬à¦¾à¦°_à¦¶à¦¨à¦¿à¦¬à¦¾à¦°".split("_"),weekdaysShort:"à¦°à¦¬à¦¿_à¦¸à§‹à¦®_à¦®à¦™à§à¦—à¦²_à¦¬à§à¦§_à¦¬à§ƒà¦¹à¦¸à§à¦ªà¦¤à¦¿_à¦¶à§à¦•à§à¦°_à¦¶à¦¨à¦¿".split("_"),weekdaysMin:"à¦°à¦¬à¦¿_à¦¸à§‹à¦®_à¦®à¦™à§à¦—à¦²_à¦¬à§à¦§_à¦¬à§ƒà¦¹_à¦¶à§à¦•à§à¦°_à¦¶à¦¨à¦¿".split("_"),longDateFormat:{LT:"A h:mm à¦¸à¦®à§Ÿ",LTS:"A h:mm:ss à¦¸à¦®à§Ÿ",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm à¦¸à¦®à§Ÿ",LLLL:"dddd, D MMMM YYYY, A h:mm à¦¸à¦®à§Ÿ"},calendar:{sameDay:"[à¦†à¦œ] LT",nextDay:"[à¦†à¦—à¦¾à¦®à§€à¦•à¦¾à¦²] LT",nextWeek:"dddd, LT",lastDay:"[à¦—à¦¤à¦•à¦¾à¦²] LT",lastWeek:"[à¦—à¦¤] dddd, LT",sameElse:"L"},relativeTime:{future:"%s à¦ªà¦°à§‡",past:"%s à¦†à¦—à§‡",s:"à¦•à§Ÿà§‡à¦• à¦¸à§‡à¦•à§‡à¦¨à§à¦¡",ss:"%d à¦¸à§‡à¦•à§‡à¦¨à§à¦¡",m:"à¦à¦• à¦®à¦¿à¦¨à¦¿à¦Ÿ",mm:"%d à¦®à¦¿à¦¨à¦¿à¦Ÿ",h:"à¦à¦• à¦˜à¦¨à§à¦Ÿà¦¾",hh:"%d à¦˜à¦¨à§à¦Ÿà¦¾",d:"à¦à¦• à¦¦à¦¿à¦¨",dd:"%d à¦¦à¦¿à¦¨",M:"à¦à¦• à¦®à¦¾à¦¸",MM:"%d à¦®à¦¾à¦¸",y:"à¦à¦• à¦¬à¦›à¦°",yy:"%d à¦¬à¦›à¦°"},preparse:function(e){return e.replace(/[à§§à§¨à§©à§ªà§«à§¬à§­à§®à§¯à§¦]/g,(function(e){return n[e]}))},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]}))},meridiemParse:/à¦°à¦¾à¦¤|à¦­à§‹à¦°|à¦¸à¦•à¦¾à¦²|à¦¦à§à¦ªà§à¦°|à¦¬à¦¿à¦•à¦¾à¦²|à¦¸à¦¨à§à¦§à§à¦¯à¦¾|à¦°à¦¾à¦¤/,meridiemHour:function(e,t){return 12===e&&(e=0),"à¦°à¦¾à¦¤"===t?e<4?e:e+12:"à¦­à§‹à¦°"===t||"à¦¸à¦•à¦¾à¦²"===t?e:"à¦¦à§à¦ªà§à¦°"===t?e>=3?e:e+12:"à¦¬à¦¿à¦•à¦¾à¦²"===t||"à¦¸à¦¨à§à¦§à§à¦¯à¦¾"===t?e+12:void 0},meridiem:function(e,t,n){return e<4?"à¦°à¦¾à¦¤":e<6?"à¦­à§‹à¦°":e<12?"à¦¸à¦•à¦¾à¦²":e<15?"à¦¦à§à¦ªà§à¦°":e<18?"à¦¬à¦¿à¦•à¦¾à¦²":e<20?"à¦¸à¦¨à§à¦§à§à¦¯à¦¾":"à¦°à¦¾à¦¤"},week:{dow:0,doy:6}})}(n(30381))},8905:function(e,t,n){!function(e){"use strict";var t={1:"à§§",2:"à§¨",3:"à§©",4:"à§ª",5:"à§«",6:"à§¬",7:"à§­",8:"à§®",9:"à§¯",0:"à§¦"},n={"à§§":"1","à§¨":"2","à§©":"3","à§ª":"4","à§«":"5","à§¬":"6","à§­":"7","à§®":"8","à§¯":"9","à§¦":"0"};e.defineLocale("bn",{months:"à¦œà¦¾à¦¨à§à§Ÿà¦¾à¦°à¦¿_à¦«à§‡à¦¬à§à¦°à§à§Ÿà¦¾à¦°à¦¿_à¦®à¦¾à¦°à§à¦š_à¦à¦ªà§à¦°à¦¿à¦²_à¦®à§‡_à¦œà§à¦¨_à¦œà§à¦²à¦¾à¦‡_à¦†à¦—à¦¸à§à¦Ÿ_à¦¸à§‡à¦ªà§à¦Ÿà§‡à¦®à§à¦¬à¦°_à¦…à¦•à§à¦Ÿà§‹à¦¬à¦°_à¦¨à¦­à§‡à¦®à§à¦¬à¦°_à¦¡à¦¿à¦¸à§‡à¦®à§à¦¬à¦°".split("_"),monthsShort:"à¦œà¦¾à¦¨à§_à¦«à§‡à¦¬à§à¦°à§_à¦®à¦¾à¦°à§à¦š_à¦à¦ªà§à¦°à¦¿à¦²_à¦®à§‡_à¦œà§à¦¨_à¦œà§à¦²à¦¾à¦‡_à¦†à¦—à¦¸à§à¦Ÿ_à¦¸à§‡à¦ªà§à¦Ÿ_à¦…à¦•à§à¦Ÿà§‹_à¦¨à¦­à§‡_à¦¡à¦¿à¦¸à§‡".split("_"),weekdays:"à¦°à¦¬à¦¿à¦¬à¦¾à¦°_à¦¸à§‹à¦®à¦¬à¦¾à¦°_à¦®à¦™à§à¦—à¦²à¦¬à¦¾à¦°_à¦¬à§à¦§à¦¬à¦¾à¦°_à¦¬à§ƒà¦¹à¦¸à§à¦ªà¦¤à¦¿à¦¬à¦¾à¦°_à¦¶à§à¦•à§à¦°à¦¬à¦¾à¦°_à¦¶à¦¨à¦¿à¦¬à¦¾à¦°".split("_"),weekdaysShort:"à¦°à¦¬à¦¿_à¦¸à§‹à¦®_à¦®à¦™à§à¦—à¦²_à¦¬à§à¦§_à¦¬à§ƒà¦¹à¦¸à§à¦ªà¦¤à¦¿_à¦¶à§à¦•à§à¦°_à¦¶à¦¨à¦¿".split("_"),weekdaysMin:"à¦°à¦¬à¦¿_à¦¸à§‹à¦®_à¦®à¦™à§à¦—à¦²_à¦¬à§à¦§_à¦¬à§ƒà¦¹_à¦¶à§à¦•à§à¦°_à¦¶à¦¨à¦¿".split("_"),longDateFormat:{LT:"A h:mm à¦¸à¦®à§Ÿ",LTS:"A h:mm:ss à¦¸à¦®à§Ÿ",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm à¦¸à¦®à§Ÿ",LLLL:"dddd, D MMMM YYYY, A h:mm à¦¸à¦®à§Ÿ"},calendar:{sameDay:"[à¦†à¦œ] LT",nextDay:"[à¦†à¦—à¦¾à¦®à§€à¦•à¦¾à¦²] LT",nextWeek:"dddd, LT",lastDay:"[à¦—à¦¤à¦•à¦¾à¦²] LT",lastWeek:"[à¦—à¦¤] dddd, LT",sameElse:"L"},relativeTime:{future:"%s à¦ªà¦°à§‡",past:"%s à¦†à¦—à§‡",s:"à¦•à§Ÿà§‡à¦• à¦¸à§‡à¦•à§‡à¦¨à§à¦¡",ss:"%d à¦¸à§‡à¦•à§‡à¦¨à§à¦¡",m:"à¦à¦• à¦®à¦¿à¦¨à¦¿à¦Ÿ",mm:"%d à¦®à¦¿à¦¨à¦¿à¦Ÿ",h:"à¦à¦• à¦˜à¦¨à§à¦Ÿà¦¾",hh:"%d à¦˜à¦¨à§à¦Ÿà¦¾",d:"à¦à¦• à¦¦à¦¿à¦¨",dd:"%d à¦¦à¦¿à¦¨",M:"à¦à¦• à¦®à¦¾à¦¸",MM:"%d à¦®à¦¾à¦¸",y:"à¦à¦• à¦¬à¦›à¦°",yy:"%d à¦¬à¦›à¦°"},preparse:function(e){return e.replace(/[à§§à§¨à§©à§ªà§«à§¬à§­à§®à§¯à§¦]/g,(function(e){return n[e]}))},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]}))},meridiemParse:/à¦°à¦¾à¦¤|à¦¸à¦•à¦¾à¦²|à¦¦à§à¦ªà§à¦°|à¦¬à¦¿à¦•à¦¾à¦²|à¦°à¦¾à¦¤/,meridiemHour:function(e,t){return 12===e&&(e=0),"à¦°à¦¾à¦¤"===t&&e>=4||"à¦¦à§à¦ªà§à¦°"===t&&e<5||"à¦¬à¦¿à¦•à¦¾à¦²"===t?e+12:e},meridiem:function(e,t,n){return e<4?"à¦°à¦¾à¦¤":e<10?"à¦¸à¦•à¦¾à¦²":e<17?"à¦¦à§à¦ªà§à¦°":e<20?"à¦¬à¦¿à¦•à¦¾à¦²":"à¦°à¦¾à¦¤"},week:{dow:0,doy:6}})}(n(30381))},11560:function(e,t,n){!function(e){"use strict";var t={1:"à¼¡",2:"à¼¢",3:"à¼£",4:"à¼¤",5:"à¼¥",6:"à¼¦",7:"à¼§",8:"à¼¨",9:"à¼©",0:"à¼ "},n={"à¼¡":"1","à¼¢":"2","à¼£":"3","à¼¤":"4","à¼¥":"5","à¼¦":"6","à¼§":"7","à¼¨":"8","à¼©":"9","à¼ ":"0"};e.defineLocale("bo",{months:"à½Ÿà¾³à¼‹à½–à¼‹à½‘à½„à¼‹à½”à½¼_à½Ÿà¾³à¼‹à½–à¼‹à½‚à½‰à½²à½¦à¼‹à½”_à½Ÿà¾³à¼‹à½–à¼‹à½‚à½¦à½´à½˜à¼‹à½”_à½Ÿà¾³à¼‹à½–à¼‹à½–à½žà½²à¼‹à½”_à½Ÿà¾³à¼‹à½–à¼‹à½£à¾”à¼‹à½”_à½Ÿà¾³à¼‹à½–à¼‹à½‘à¾²à½´à½‚à¼‹à½”_à½Ÿà¾³à¼‹à½–à¼‹à½–à½‘à½´à½“à¼‹à½”_à½Ÿà¾³à¼‹à½–à¼‹à½–à½¢à¾’à¾±à½‘à¼‹à½”_à½Ÿà¾³à¼‹à½–à¼‹à½‘à½‚à½´à¼‹à½”_à½Ÿà¾³à¼‹à½–à¼‹à½–à½…à½´à¼‹à½”_à½Ÿà¾³à¼‹à½–à¼‹à½–à½…à½´à¼‹à½‚à½…à½²à½‚à¼‹à½”_à½Ÿà¾³à¼‹à½–à¼‹à½–à½…à½´à¼‹à½‚à½‰à½²à½¦à¼‹à½”".split("_"),monthsShort:"à½Ÿà¾³à¼‹1_à½Ÿà¾³à¼‹2_à½Ÿà¾³à¼‹3_à½Ÿà¾³à¼‹4_à½Ÿà¾³à¼‹5_à½Ÿà¾³à¼‹6_à½Ÿà¾³à¼‹7_à½Ÿà¾³à¼‹8_à½Ÿà¾³à¼‹9_à½Ÿà¾³à¼‹10_à½Ÿà¾³à¼‹11_à½Ÿà¾³à¼‹12".split("_"),monthsShortRegex:/^(à½Ÿà¾³à¼‹\d{1,2})/,monthsParseExact:!0,weekdays:"à½‚à½Ÿà½ à¼‹à½‰à½²à¼‹à½˜à¼‹_à½‚à½Ÿà½ à¼‹à½Ÿà¾³à¼‹à½–à¼‹_à½‚à½Ÿà½ à¼‹à½˜à½²à½‚à¼‹à½‘à½˜à½¢à¼‹_à½‚à½Ÿà½ à¼‹à½£à¾·à½‚à¼‹à½”à¼‹_à½‚à½Ÿà½ à¼‹à½•à½´à½¢à¼‹à½–à½´_à½‚à½Ÿà½ à¼‹à½”à¼‹à½¦à½„à½¦à¼‹_à½‚à½Ÿà½ à¼‹à½¦à¾¤à½ºà½“à¼‹à½”à¼‹".split("_"),weekdaysShort:"à½‰à½²à¼‹à½˜à¼‹_à½Ÿà¾³à¼‹à½–à¼‹_à½˜à½²à½‚à¼‹à½‘à½˜à½¢à¼‹_à½£à¾·à½‚à¼‹à½”à¼‹_à½•à½´à½¢à¼‹à½–à½´_à½”à¼‹à½¦à½„à½¦à¼‹_à½¦à¾¤à½ºà½“à¼‹à½”à¼‹".split("_"),weekdaysMin:"à½‰à½²_à½Ÿà¾³_à½˜à½²à½‚_à½£à¾·à½‚_à½•à½´à½¢_à½¦à½„à½¦_à½¦à¾¤à½ºà½“".split("_"),longDateFormat:{LT:"A h:mm",LTS:"A h:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm",LLLL:"dddd, D MMMM YYYY, A h:mm"},calendar:{sameDay:"[à½‘à½²à¼‹à½¢à½²à½„] LT",nextDay:"[à½¦à½„à¼‹à½‰à½²à½“] LT",nextWeek:"[à½–à½‘à½´à½“à¼‹à½•à¾²à½‚à¼‹à½¢à¾—à½ºà½¦à¼‹à½˜], LT",lastDay:"[à½à¼‹à½¦à½„] LT",lastWeek:"[à½–à½‘à½´à½“à¼‹à½•à¾²à½‚à¼‹à½˜à½à½ à¼‹à½˜] dddd, LT",sameElse:"L"},relativeTime:{future:"%s à½£à¼‹",past:"%s à½¦à¾”à½“à¼‹à½£",s:"à½£à½˜à¼‹à½¦à½„",ss:"%d à½¦à¾à½¢à¼‹à½†à¼",m:"à½¦à¾à½¢à¼‹à½˜à¼‹à½‚à½…à½²à½‚",mm:"%d à½¦à¾à½¢à¼‹à½˜",h:"à½†à½´à¼‹à½šà½¼à½‘à¼‹à½‚à½…à½²à½‚",hh:"%d à½†à½´à¼‹à½šà½¼à½‘",d:"à½‰à½²à½“à¼‹à½‚à½…à½²à½‚",dd:"%d à½‰à½²à½“à¼‹",M:"à½Ÿà¾³à¼‹à½–à¼‹à½‚à½…à½²à½‚",MM:"%d à½Ÿà¾³à¼‹à½–",y:"à½£à½¼à¼‹à½‚à½…à½²à½‚",yy:"%d à½£à½¼"},preparse:function(e){return e.replace(/[à¼¡à¼¢à¼£à¼¤à¼¥à¼¦à¼§à¼¨à¼©à¼ ]/g,(function(e){return n[e]}))},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]}))},meridiemParse:/à½˜à½šà½“à¼‹à½˜à½¼|à½žà½¼à½‚à½¦à¼‹à½€à½¦|à½‰à½²à½“à¼‹à½‚à½´à½„|à½‘à½‚à½¼à½„à¼‹à½‘à½‚|à½˜à½šà½“à¼‹à½˜à½¼/,meridiemHour:function(e,t){return 12===e&&(e=0),"à½˜à½šà½“à¼‹à½˜à½¼"===t&&e>=4||"à½‰à½²à½“à¼‹à½‚à½´à½„"===t&&e<5||"à½‘à½‚à½¼à½„à¼‹à½‘à½‚"===t?e+12:e},meridiem:function(e,t,n){return e<4?"à½˜à½šà½“à¼‹à½˜à½¼":e<10?"à½žà½¼à½‚à½¦à¼‹à½€à½¦":e<17?"à½‰à½²à½“à¼‹à½‚à½´à½„":e<20?"à½‘à½‚à½¼à½„à¼‹à½‘à½‚":"à½˜à½šà½“à¼‹à½˜à½¼"},week:{dow:0,doy:6}})}(n(30381))},1278:function(e,t,n){!function(e){"use strict";function t(e,t,n){return e+" "+function(e,t){return 2===t?function(e){var t={m:"v",b:"v",d:"z"};return void 0===t[e.charAt(0)]?e:t[e.charAt(0)]+e.substring(1)}(e):e}({mm:"munutenn",MM:"miz",dd:"devezh"}[n],e)}function n(e){return e>9?n(e%10):e}var r=[/^gen/i,/^c[Ê¼\']hwe/i,/^meu/i,/^ebr/i,/^mae/i,/^(mez|eve)/i,/^gou/i,/^eos/i,/^gwe/i,/^her/i,/^du/i,/^ker/i],a=/^(genver|c[Ê¼\']hwevrer|meurzh|ebrel|mae|mezheven|gouere|eost|gwengolo|here|du|kerzu|gen|c[Ê¼\']hwe|meu|ebr|mae|eve|gou|eos|gwe|her|du|ker)/i,s=[/^Su/i,/^Lu/i,/^Me([^r]|$)/i,/^Mer/i,/^Ya/i,/^Gw/i,/^Sa/i];e.defineLocale("br",{months:"Genver_CÊ¼hwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu".split("_"),monthsShort:"Gen_CÊ¼hwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker".split("_"),weekdays:"Sul_Lun_Meurzh_MercÊ¼her_Yaou_Gwener_Sadorn".split("_"),weekdaysShort:"Sul_Lun_Meu_Mer_Yao_Gwe_Sad".split("_"),weekdaysMin:"Su_Lu_Me_Mer_Ya_Gw_Sa".split("_"),weekdaysParse:s,fullWeekdaysParse:[/^sul/i,/^lun/i,/^meurzh/i,/^merc[Ê¼\']her/i,/^yaou/i,/^gwener/i,/^sadorn/i],shortWeekdaysParse:[/^Sul/i,/^Lun/i,/^Meu/i,/^Mer/i,/^Yao/i,/^Gwe/i,/^Sad/i],minWeekdaysParse:s,monthsRegex:a,monthsShortRegex:a,monthsStrictRegex:/^(genver|c[Ê¼\']hwevrer|meurzh|ebrel|mae|mezheven|gouere|eost|gwengolo|here|du|kerzu)/i,monthsShortStrictRegex:/^(gen|c[Ê¼\']hwe|meu|ebr|mae|eve|gou|eos|gwe|her|du|ker)/i,monthsParse:r,longMonthsParse:r,shortMonthsParse:r,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D [a viz] MMMM YYYY",LLL:"D [a viz] MMMM YYYY HH:mm",LLLL:"dddd, D [a viz] MMMM YYYY HH:mm"},calendar:{sameDay:"[Hiziv da] LT",nextDay:"[WarcÊ¼hoazh da] LT",nextWeek:"dddd [da] LT",lastDay:"[DecÊ¼h da] LT",lastWeek:"dddd [paset da] LT",sameElse:"L"},relativeTime:{future:"a-benn %s",past:"%s Ê¼zo",s:"un nebeud segondennoÃ¹",ss:"%d eilenn",m:"ur vunutenn",mm:t,h:"un eur",hh:"%d eur",d:"un devezh",dd:t,M:"ur miz",MM:t,y:"ur bloaz",yy:function(e){switch(n(e)){case 1:case 3:case 4:case 5:case 9:return e+" bloaz";default:return e+" vloaz"}}},dayOfMonthOrdinalParse:/\d{1,2}(aÃ±|vet)/,ordinal:function(e){return e+(1===e?"aÃ±":"vet")},week:{dow:1,doy:4},meridiemParse:/a.m.|g.m./,isPM:function(e){return"g.m."===e},meridiem:function(e,t,n){return e<12?"a.m.":"g.m."}})}(n(30381))},80622:function(e,t,n){!function(e){"use strict";function t(e,t,n){var r=e+" ";switch(n){case"ss":return r+(1===e?"sekunda":2===e||3===e||4===e?"sekunde":"sekundi");case"m":return t?"jedna minuta":"jedne minute";case"mm":return r+(1===e?"minuta":2===e||3===e||4===e?"minute":"minuta");case"h":return t?"jedan sat":"jednog sata";case"hh":return r+(1===e?"sat":2===e||3===e||4===e?"sata":"sati");case"dd":return r+(1===e?"dan":"dana");case"MM":return r+(1===e?"mjesec":2===e||3===e||4===e?"mjeseca":"mjeseci");case"yy":return r+(1===e?"godina":2===e||3===e||4===e?"godine":"godina")}}e.defineLocale("bs",{months:"januar_februar_mart_april_maj_juni_juli_august_septembar_oktobar_novembar_decembar".split("_"),monthsShort:"jan._feb._mar._apr._maj._jun._jul._aug._sep._okt._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"nedjelja_ponedjeljak_utorak_srijeda_Äetvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sri._Äet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_Äe_pe_su".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[juÄer u] LT",lastWeek:function(){switch(this.day()){case 0:case 3:return"[proÅ¡lu] dddd [u] LT";case 6:return"[proÅ¡le] [subote] [u] LT";case 1:case 2:case 4:case 5:return"[proÅ¡li] dddd [u] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"par sekundi",ss:t,m:t,mm:t,h:t,hh:t,d:"dan",dd:t,M:"mjesec",MM:t,y:"godinu",yy:t},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}})}(n(30381))},2468:function(e,t,n){!function(e){"use strict";e.defineLocale("ca",{months:{standalone:"gener_febrer_marÃ§_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre".split("_"),format:"de gener_de febrer_de marÃ§_d'abril_de maig_de juny_de juliol_d'agost_de setembre_d'octubre_de novembre_de desembre".split("_"),isFormat:/D[oD]?(\s)+MMMM/},monthsShort:"gen._febr._marÃ§_abr._maig_juny_jul._ag._set._oct._nov._des.".split("_"),monthsParseExact:!0,weekdays:"diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte".split("_"),weekdaysShort:"dg._dl._dt._dc._dj._dv._ds.".split("_"),weekdaysMin:"dg_dl_dt_dc_dj_dv_ds".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM [de] YYYY",ll:"D MMM YYYY",LLL:"D MMMM [de] YYYY [a les] H:mm",lll:"D MMM YYYY, H:mm",LLLL:"dddd D MMMM [de] YYYY [a les] H:mm",llll:"ddd D MMM YYYY, H:mm"},calendar:{sameDay:function(){return"[avui a "+(1!==this.hours()?"les":"la")+"] LT"},nextDay:function(){return"[demÃ  a "+(1!==this.hours()?"les":"la")+"] LT"},nextWeek:function(){return"dddd [a "+(1!==this.hours()?"les":"la")+"] LT"},lastDay:function(){return"[ahir a "+(1!==this.hours()?"les":"la")+"] LT"},lastWeek:function(){return"[el] dddd [passat a "+(1!==this.hours()?"les":"la")+"] LT"},sameElse:"L"},relativeTime:{future:"d'aquÃ­ %s",past:"fa %s",s:"uns segons",ss:"%d segons",m:"un minut",mm:"%d minuts",h:"una hora",hh:"%d hores",d:"un dia",dd:"%d dies",M:"un mes",MM:"%d mesos",y:"un any",yy:"%d anys"},dayOfMonthOrdinalParse:/\d{1,2}(r|n|t|Ã¨|a)/,ordinal:function(e,t){var n=1===e?"r":2===e?"n":3===e?"r":4===e?"t":"Ã¨";return"w"!==t&&"W"!==t||(n="a"),e+n},week:{dow:1,doy:4}})}(n(30381))},5822:function(e,t,n){!function(e){"use strict";var t={format:"leden_Ãºnor_bÅ™ezen_duben_kvÄ›ten_Äerven_Äervenec_srpen_zÃ¡Å™Ã­_Å™Ã­jen_listopad_prosinec".split("_"),standalone:"ledna_Ãºnora_bÅ™ezna_dubna_kvÄ›tna_Äervna_Äervence_srpna_zÃ¡Å™Ã­_Å™Ã­jna_listopadu_prosince".split("_")},n="led_Ãºno_bÅ™e_dub_kvÄ›_Ävn_Ävc_srp_zÃ¡Å™_Å™Ã­j_lis_pro".split("_"),r=[/^led/i,/^Ãºno/i,/^bÅ™e/i,/^dub/i,/^kvÄ›/i,/^(Ävn|Äerven$|Äervna)/i,/^(Ävc|Äervenec|Äervence)/i,/^srp/i,/^zÃ¡Å™/i,/^Å™Ã­j/i,/^lis/i,/^pro/i],a=/^(leden|Ãºnor|bÅ™ezen|duben|kvÄ›ten|Äervenec|Äervence|Äerven|Äervna|srpen|zÃ¡Å™Ã­|Å™Ã­jen|listopad|prosinec|led|Ãºno|bÅ™e|dub|kvÄ›|Ävn|Ävc|srp|zÃ¡Å™|Å™Ã­j|lis|pro)/i;function s(e){return e>1&&e<5&&1!=~~(e/10)}function i(e,t,n,r){var a=e+" ";switch(n){case"s":return t||r?"pÃ¡r sekund":"pÃ¡r sekundami";case"ss":return t||r?a+(s(e)?"sekundy":"sekund"):a+"sekundami";case"m":return t?"minuta":r?"minutu":"minutou";case"mm":return t||r?a+(s(e)?"minuty":"minut"):a+"minutami";case"h":return t?"hodina":r?"hodinu":"hodinou";case"hh":return t||r?a+(s(e)?"hodiny":"hodin"):a+"hodinami";case"d":return t||r?"den":"dnem";case"dd":return t||r?a+(s(e)?"dny":"dnÃ­"):a+"dny";case"M":return t||r?"mÄ›sÃ­c":"mÄ›sÃ­cem";case"MM":return t||r?a+(s(e)?"mÄ›sÃ­ce":"mÄ›sÃ­cÅ¯"):a+"mÄ›sÃ­ci";case"y":return t||r?"rok":"rokem";case"yy":return t||r?a+(s(e)?"roky":"let"):a+"lety"}}e.defineLocale("cs",{months:t,monthsShort:n,monthsRegex:a,monthsShortRegex:a,monthsStrictRegex:/^(leden|ledna|Ãºnora|Ãºnor|bÅ™ezen|bÅ™ezna|duben|dubna|kvÄ›ten|kvÄ›tna|Äervenec|Äervence|Äerven|Äervna|srpen|srpna|zÃ¡Å™Ã­|Å™Ã­jen|Å™Ã­jna|listopadu|listopad|prosinec|prosince)/i,monthsShortStrictRegex:/^(led|Ãºno|bÅ™e|dub|kvÄ›|Ävn|Ävc|srp|zÃ¡Å™|Å™Ã­j|lis|pro)/i,monthsParse:r,longMonthsParse:r,shortMonthsParse:r,weekdays:"nedÄ›le_pondÄ›lÃ­_ÃºterÃ½_stÅ™eda_Ätvrtek_pÃ¡tek_sobota".split("_"),weekdaysShort:"ne_po_Ãºt_st_Ät_pÃ¡_so".split("_"),weekdaysMin:"ne_po_Ãºt_st_Ät_pÃ¡_so".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd D. MMMM YYYY H:mm",l:"D. M. YYYY"},calendar:{sameDay:"[dnes v] LT",nextDay:"[zÃ­tra v] LT",nextWeek:function(){switch(this.day()){case 0:return"[v nedÄ›li v] LT";case 1:case 2:return"[v] dddd [v] LT";case 3:return"[ve stÅ™edu v] LT";case 4:return"[ve Ätvrtek v] LT";case 5:return"[v pÃ¡tek v] LT";case 6:return"[v sobotu v] LT"}},lastDay:"[vÄera v] LT",lastWeek:function(){switch(this.day()){case 0:return"[minulou nedÄ›li v] LT";case 1:case 2:return"[minulÃ©] dddd [v] LT";case 3:return"[minulou stÅ™edu v] LT";case 4:case 5:return"[minulÃ½] dddd [v] LT";case 6:return"[minulou sobotu v] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"pÅ™ed %s",s:i,ss:i,m:i,mm:i,h:i,hh:i,d:i,dd:i,M:i,MM:i,y:i,yy:i},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}(n(30381))},50877:function(e,t,n){!function(e){"use strict";e.defineLocale("cv",{months:"ÐºÓ‘Ñ€Ð»Ð°Ñ‡_Ð½Ð°Ñ€Ó‘Ñ_Ð¿ÑƒÑˆ_Ð°ÐºÐ°_Ð¼Ð°Ð¹_Ò«Ó—Ñ€Ñ‚Ð¼Ðµ_ÑƒÑ‚Ó‘_Ò«ÑƒÑ€Ð»Ð°_Ð°Ð²Ó‘Ð½_ÑŽÐ¿Ð°_Ñ‡Ó³Ðº_Ñ€Ð°ÑˆÑ‚Ð°Ð²".split("_"),monthsShort:"ÐºÓ‘Ñ€_Ð½Ð°Ñ€_Ð¿ÑƒÑˆ_Ð°ÐºÐ°_Ð¼Ð°Ð¹_Ò«Ó—Ñ€_ÑƒÑ‚Ó‘_Ò«ÑƒÑ€_Ð°Ð²Ð½_ÑŽÐ¿Ð°_Ñ‡Ó³Ðº_Ñ€Ð°Ñˆ".split("_"),weekdays:"Ð²Ñ‹Ñ€ÑÐ°Ñ€Ð½Ð¸ÐºÑƒÐ½_Ñ‚ÑƒÐ½Ñ‚Ð¸ÐºÑƒÐ½_Ñ‹Ñ‚Ð»Ð°Ñ€Ð¸ÐºÑƒÐ½_ÑŽÐ½ÐºÑƒÐ½_ÐºÓ—Ò«Ð½ÐµÑ€Ð½Ð¸ÐºÑƒÐ½_ÑÑ€Ð½ÐµÐºÑƒÐ½_ÑˆÓ‘Ð¼Ð°Ñ‚ÐºÑƒÐ½".split("_"),weekdaysShort:"Ð²Ñ‹Ñ€_Ñ‚ÑƒÐ½_Ñ‹Ñ‚Ð»_ÑŽÐ½_ÐºÓ—Ò«_ÑÑ€Ð½_ÑˆÓ‘Ð¼".split("_"),weekdaysMin:"Ð²Ñ€_Ñ‚Ð½_Ñ‹Ñ‚_ÑŽÐ½_ÐºÒ«_ÑÑ€_ÑˆÐ¼".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD-MM-YYYY",LL:"YYYY [Ò«ÑƒÐ»Ñ…Ð¸] MMMM [ÑƒÐ¹Ó‘Ñ…Ó—Ð½] D[-Ð¼Ó—ÑˆÓ—]",LLL:"YYYY [Ò«ÑƒÐ»Ñ…Ð¸] MMMM [ÑƒÐ¹Ó‘Ñ…Ó—Ð½] D[-Ð¼Ó—ÑˆÓ—], HH:mm",LLLL:"dddd, YYYY [Ò«ÑƒÐ»Ñ…Ð¸] MMMM [ÑƒÐ¹Ó‘Ñ…Ó—Ð½] D[-Ð¼Ó—ÑˆÓ—], HH:mm"},calendar:{sameDay:"[ÐŸÐ°ÑÐ½] LT [ÑÐµÑ…ÐµÑ‚Ñ€Ðµ]",nextDay:"[Ð«Ñ€Ð°Ð½] LT [ÑÐµÑ…ÐµÑ‚Ñ€Ðµ]",lastDay:"[Ó–Ð½ÐµÑ€] LT [ÑÐµÑ…ÐµÑ‚Ñ€Ðµ]",nextWeek:"[ÒªÐ¸Ñ‚ÐµÑ] dddd LT [ÑÐµÑ…ÐµÑ‚Ñ€Ðµ]",lastWeek:"[Ð˜Ñ€Ñ‚Ð½Ó—] dddd LT [ÑÐµÑ…ÐµÑ‚Ñ€Ðµ]",sameElse:"L"},relativeTime:{future:function(e){return e+(/ÑÐµÑ…ÐµÑ‚$/i.exec(e)?"Ñ€ÐµÐ½":/Ò«ÑƒÐ»$/i.exec(e)?"Ñ‚Ð°Ð½":"Ñ€Ð°Ð½")},past:"%s ÐºÐ°ÑÐ»Ð»Ð°",s:"Ð¿Ó—Ñ€-Ð¸Ðº Ò«ÐµÐºÐºÑƒÐ½Ñ‚",ss:"%d Ò«ÐµÐºÐºÑƒÐ½Ñ‚",m:"Ð¿Ó—Ñ€ Ð¼Ð¸Ð½ÑƒÑ‚",mm:"%d Ð¼Ð¸Ð½ÑƒÑ‚",h:"Ð¿Ó—Ñ€ ÑÐµÑ…ÐµÑ‚",hh:"%d ÑÐµÑ…ÐµÑ‚",d:"Ð¿Ó—Ñ€ ÐºÑƒÐ½",dd:"%d ÐºÑƒÐ½",M:"Ð¿Ó—Ñ€ ÑƒÐ¹Ó‘Ñ…",MM:"%d ÑƒÐ¹Ó‘Ñ…",y:"Ð¿Ó—Ñ€ Ò«ÑƒÐ»",yy:"%d Ò«ÑƒÐ»"},dayOfMonthOrdinalParse:/\d{1,2}-Ð¼Ó—Ñˆ/,ordinal:"%d-Ð¼Ó—Ñˆ",week:{dow:1,doy:7}})}(n(30381))},47373:function(e,t,n){!function(e){"use strict";e.defineLocale("cy",{months:"Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr".split("_"),monthsShort:"Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag".split("_"),weekdays:"Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn".split("_"),weekdaysShort:"Sul_Llun_Maw_Mer_Iau_Gwe_Sad".split("_"),weekdaysMin:"Su_Ll_Ma_Me_Ia_Gw_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Heddiw am] LT",nextDay:"[Yfory am] LT",nextWeek:"dddd [am] LT",lastDay:"[Ddoe am] LT",lastWeek:"dddd [diwethaf am] LT",sameElse:"L"},relativeTime:{future:"mewn %s",past:"%s yn Ã´l",s:"ychydig eiliadau",ss:"%d eiliad",m:"munud",mm:"%d munud",h:"awr",hh:"%d awr",d:"diwrnod",dd:"%d diwrnod",M:"mis",MM:"%d mis",y:"blwyddyn",yy:"%d flynedd"},dayOfMonthOrdinalParse:/\d{1,2}(fed|ain|af|il|ydd|ed|eg)/,ordinal:function(e){var t="";return e>20?t=40===e||50===e||60===e||80===e||100===e?"fed":"ain":e>0&&(t=["","af","il","ydd","ydd","ed","ed","ed","fed","fed","fed","eg","fed","eg","eg","fed","eg","eg","fed","eg","fed"][e]),e+t},week:{dow:1,doy:4}})}(n(30381))},24780:function(e,t,n){!function(e){"use strict";e.defineLocale("da",{months:"januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),weekdays:"sÃ¸ndag_mandag_tirsdag_onsdag_torsdag_fredag_lÃ¸rdag".split("_"),weekdaysShort:"sÃ¸n_man_tir_ons_tor_fre_lÃ¸r".split("_"),weekdaysMin:"sÃ¸_ma_ti_on_to_fr_lÃ¸".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY HH:mm",LLLL:"dddd [d.] D. MMMM YYYY [kl.] HH:mm"},calendar:{sameDay:"[i dag kl.] LT",nextDay:"[i morgen kl.] LT",nextWeek:"pÃ¥ dddd [kl.] LT",lastDay:"[i gÃ¥r kl.] LT",lastWeek:"[i] dddd[s kl.] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"%s siden",s:"fÃ¥ sekunder",ss:"%d sekunder",m:"et minut",mm:"%d minutter",h:"en time",hh:"%d timer",d:"en dag",dd:"%d dage",M:"en mÃ¥ned",MM:"%d mÃ¥neder",y:"et Ã¥r",yy:"%d Ã¥r"},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}(n(30381))},60217:function(e,t,n){!function(e){"use strict";function t(e,t,n,r){var a={m:["eine Minute","einer Minute"],h:["eine Stunde","einer Stunde"],d:["ein Tag","einem Tag"],dd:[e+" Tage",e+" Tagen"],w:["eine Woche","einer Woche"],M:["ein Monat","einem Monat"],MM:[e+" Monate",e+" Monaten"],y:["ein Jahr","einem Jahr"],yy:[e+" Jahre",e+" Jahren"]};return t?a[n][0]:a[n][1]}e.defineLocale("de-at",{months:"JÃ¤nner_Februar_MÃ¤rz_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"JÃ¤n._Feb._MÃ¤rz_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.".split("_"),monthsParseExact:!0,weekdays:"Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),weekdaysShort:"So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY HH:mm",LLLL:"dddd, D. MMMM YYYY HH:mm"},calendar:{sameDay:"[heute um] LT [Uhr]",sameElse:"L",nextDay:"[morgen um] LT [Uhr]",nextWeek:"dddd [um] LT [Uhr]",lastDay:"[gestern um] LT [Uhr]",lastWeek:"[letzten] dddd [um] LT [Uhr]"},relativeTime:{future:"in %s",past:"vor %s",s:"ein paar Sekunden",ss:"%d Sekunden",m:t,mm:"%d Minuten",h:t,hh:"%d Stunden",d:t,dd:t,w:t,ww:"%d Wochen",M:t,MM:t,y:t,yy:t},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}(n(30381))},60894:function(e,t,n){!function(e){"use strict";function t(e,t,n,r){var a={m:["eine Minute","einer Minute"],h:["eine Stunde","einer Stunde"],d:["ein Tag","einem Tag"],dd:[e+" Tage",e+" Tagen"],w:["eine Woche","einer Woche"],M:["ein Monat","einem Monat"],MM:[e+" Monate",e+" Monaten"],y:["ein Jahr","einem Jahr"],yy:[e+" Jahre",e+" Jahren"]};return t?a[n][0]:a[n][1]}e.defineLocale("de-ch",{months:"Januar_Februar_MÃ¤rz_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jan._Feb._MÃ¤rz_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.".split("_"),monthsParseExact:!0,weekdays:"Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),weekdaysShort:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),weekdaysMin:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY HH:mm",LLLL:"dddd, D. MMMM YYYY HH:mm"},calendar:{sameDay:"[heute um] LT [Uhr]",sameElse:"L",nextDay:"[morgen um] LT [Uhr]",nextWeek:"dddd [um] LT [Uhr]",lastDay:"[gestern um] LT [Uhr]",lastWeek:"[letzten] dddd [um] LT [Uhr]"},relativeTime:{future:"in %s",past:"vor %s",s:"ein paar Sekunden",ss:"%d Sekunden",m:t,mm:"%d Minuten",h:t,hh:"%d Stunden",d:t,dd:t,w:t,ww:"%d Wochen",M:t,MM:t,y:t,yy:t},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}(n(30381))},59740:function(e,t,n){!function(e){"use strict";function t(e,t,n,r){var a={m:["eine Minute","einer Minute"],h:["eine Stunde","einer Stunde"],d:["ein Tag","einem Tag"],dd:[e+" Tage",e+" Tagen"],w:["eine Woche","einer Woche"],M:["ein Monat","einem Monat"],MM:[e+" Monate",e+" Monaten"],y:["ein Jahr","einem Jahr"],yy:[e+" Jahre",e+" Jahren"]};return t?a[n][0]:a[n][1]}e.defineLocale("de",{months:"Januar_Februar_MÃ¤rz_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jan._Feb._MÃ¤rz_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.".split("_"),monthsParseExact:!0,weekdays:"Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),weekdaysShort:"So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY HH:mm",LLLL:"dddd, D. MMMM YYYY HH:mm"},calendar:{sameDay:"[heute um] LT [Uhr]",sameElse:"L",nextDay:"[morgen um] LT [Uhr]",nextWeek:"dddd [um] LT [Uhr]",lastDay:"[gestern um] LT [Uhr]",lastWeek:"[letzten] dddd [um] LT [Uhr]"},relativeTime:{future:"in %s",past:"vor %s",s:"ein paar Sekunden",ss:"%d Sekunden",m:t,mm:"%d Minuten",h:t,hh:"%d Stunden",d:t,dd:t,w:t,ww:"%d Wochen",M:t,MM:t,y:t,yy:t},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}(n(30381))},5300:function(e,t,n){!function(e){"use strict";var t=["Þ–Þ¬Þ‚ÞªÞ‡Þ¦ÞƒÞ©","ÞŠÞ¬Þ„Þ°ÞƒÞªÞ‡Þ¦ÞƒÞ©","Þ‰Þ§ÞƒÞ¨Þ—Þª","Þ‡Þ­Þ•Þ°ÞƒÞ©ÞÞª","Þ‰Þ­","Þ–Þ«Þ‚Þ°","Þ–ÞªÞÞ¦Þ‡Þ¨","Þ‡Þ¯ÞŽÞ¦ÞÞ°Þ“Þª","ÞÞ¬Þ•Þ°Þ“Þ¬Þ‰Þ°Þ„Þ¦ÞƒÞª","Þ‡Þ®Þ†Þ°Þ“Þ¯Þ„Þ¦ÞƒÞª","Þ‚Þ®ÞˆÞ¬Þ‰Þ°Þ„Þ¦ÞƒÞª","Þ‘Þ¨ÞÞ¬Þ‰Þ°Þ„Þ¦ÞƒÞª"],n=["Þ‡Þ§Þ‹Þ¨Þ‡Þ°ÞŒÞ¦","Þ€Þ¯Þ‰Þ¦","Þ‡Þ¦Þ‚Þ°ÞŽÞ§ÞƒÞ¦","Þ„ÞªÞ‹Þ¦","Þ„ÞªÞƒÞ§ÞÞ°ÞŠÞ¦ÞŒÞ¨","Þ€ÞªÞ†ÞªÞƒÞª","Þ€Þ®Þ‚Þ¨Þ€Þ¨ÞƒÞª"];e.defineLocale("dv",{months:t,monthsShort:t,weekdays:n,weekdaysShort:n,weekdaysMin:"Þ‡Þ§Þ‹Þ¨_Þ€Þ¯Þ‰Þ¦_Þ‡Þ¦Þ‚Þ°_Þ„ÞªÞ‹Þ¦_Þ„ÞªÞƒÞ§_Þ€ÞªÞ†Þª_Þ€Þ®Þ‚Þ¨".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"D/M/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},meridiemParse:/Þ‰Þ†|Þ‰ÞŠ/,isPM:function(e){return"Þ‰ÞŠ"===e},meridiem:function(e,t,n){return e<12?"Þ‰Þ†":"Þ‰ÞŠ"},calendar:{sameDay:"[Þ‰Þ¨Þ‡Þ¦Þ‹Þª] LT",nextDay:"[Þ‰Þ§Þ‹Þ¦Þ‰Þ§] LT",nextWeek:"dddd LT",lastDay:"[Þ‡Þ¨Þ‡Þ°Þ”Þ¬] LT",lastWeek:"[ÞŠÞ§Þ‡Þ¨ÞŒÞªÞˆÞ¨] dddd LT",sameElse:"L"},relativeTime:{future:"ÞŒÞ¬ÞƒÞ­ÞŽÞ¦Þ‡Þ¨ %s",past:"Þ†ÞªÞƒÞ¨Þ‚Þ° %s",s:"ÞÞ¨Þ†ÞªÞ‚Þ°ÞŒÞªÞ†Þ®Þ…Þ¬Þ‡Þ°",ss:"d% ÞÞ¨Þ†ÞªÞ‚Þ°ÞŒÞª",m:"Þ‰Þ¨Þ‚Þ¨Þ“Þ¬Þ‡Þ°",mm:"Þ‰Þ¨Þ‚Þ¨Þ“Þª %d",h:"ÞŽÞ¦Þ‘Þ¨Þ‡Þ¨ÞƒÞ¬Þ‡Þ°",hh:"ÞŽÞ¦Þ‘Þ¨Þ‡Þ¨ÞƒÞª %d",d:"Þ‹ÞªÞˆÞ¦Þ€Þ¬Þ‡Þ°",dd:"Þ‹ÞªÞˆÞ¦ÞÞ° %d",M:"Þ‰Þ¦Þ€Þ¬Þ‡Þ°",MM:"Þ‰Þ¦ÞÞ° %d",y:"Þ‡Þ¦Þ€Þ¦ÞƒÞ¬Þ‡Þ°",yy:"Þ‡Þ¦Þ€Þ¦ÞƒÞª %d"},preparse:function(e){return e.replace(/ØŒ/g,",")},postformat:function(e){return e.replace(/,/g,"ØŒ")},week:{dow:7,doy:12}})}(n(30381))},50837:function(e,t,n){!function(e){"use strict";e.defineLocale("el",{monthsNominativeEl:"Î™Î±Î½Î¿Ï…Î¬ÏÎ¹Î¿Ï‚_Î¦ÎµÎ²ÏÎ¿Ï…Î¬ÏÎ¹Î¿Ï‚_ÎœÎ¬ÏÏ„Î¹Î¿Ï‚_Î‘Ï€ÏÎ¯Î»Î¹Î¿Ï‚_ÎœÎ¬Î¹Î¿Ï‚_Î™Î¿ÏÎ½Î¹Î¿Ï‚_Î™Î¿ÏÎ»Î¹Î¿Ï‚_Î‘ÏÎ³Î¿Ï…ÏƒÏ„Î¿Ï‚_Î£ÎµÏ€Ï„Î­Î¼Î²ÏÎ¹Î¿Ï‚_ÎŸÎºÏ„ÏŽÎ²ÏÎ¹Î¿Ï‚_ÎÎ¿Î­Î¼Î²ÏÎ¹Î¿Ï‚_Î”ÎµÎºÎ­Î¼Î²ÏÎ¹Î¿Ï‚".split("_"),monthsGenitiveEl:"Î™Î±Î½Î¿Ï…Î±ÏÎ¯Î¿Ï…_Î¦ÎµÎ²ÏÎ¿Ï…Î±ÏÎ¯Î¿Ï…_ÎœÎ±ÏÏ„Î¯Î¿Ï…_Î‘Ï€ÏÎ¹Î»Î¯Î¿Ï…_ÎœÎ±ÎÎ¿Ï…_Î™Î¿Ï…Î½Î¯Î¿Ï…_Î™Î¿Ï…Î»Î¯Î¿Ï…_Î‘Ï…Î³Î¿ÏÏƒÏ„Î¿Ï…_Î£ÎµÏ€Ï„ÎµÎ¼Î²ÏÎ¯Î¿Ï…_ÎŸÎºÏ„Ï‰Î²ÏÎ¯Î¿Ï…_ÎÎ¿ÎµÎ¼Î²ÏÎ¯Î¿Ï…_Î”ÎµÎºÎµÎ¼Î²ÏÎ¯Î¿Ï…".split("_"),months:function(e,t){return e?"string"==typeof t&&/D/.test(t.substring(0,t.indexOf("MMMM")))?this._monthsGenitiveEl[e.month()]:this._monthsNominativeEl[e.month()]:this._monthsNominativeEl},monthsShort:"Î™Î±Î½_Î¦ÎµÎ²_ÎœÎ±Ï_Î‘Ï€Ï_ÎœÎ±ÏŠ_Î™Î¿Ï…Î½_Î™Î¿Ï…Î»_Î‘Ï…Î³_Î£ÎµÏ€_ÎŸÎºÏ„_ÎÎ¿Îµ_Î”ÎµÎº".split("_"),weekdays:"ÎšÏ…ÏÎ¹Î±ÎºÎ®_Î”ÎµÏ…Ï„Î­ÏÎ±_Î¤ÏÎ¯Ï„Î·_Î¤ÎµÏ„Î¬ÏÏ„Î·_Î Î­Î¼Ï€Ï„Î·_Î Î±ÏÎ±ÏƒÎºÎµÏ…Î®_Î£Î¬Î²Î²Î±Ï„Î¿".split("_"),weekdaysShort:"ÎšÏ…Ï_Î”ÎµÏ…_Î¤ÏÎ¹_Î¤ÎµÏ„_Î ÎµÎ¼_Î Î±Ï_Î£Î±Î²".split("_"),weekdaysMin:"ÎšÏ…_Î”Îµ_Î¤Ï_Î¤Îµ_Î Îµ_Î Î±_Î£Î±".split("_"),meridiem:function(e,t,n){return e>11?n?"Î¼Î¼":"ÎœÎœ":n?"Ï€Î¼":"Î Îœ"},isPM:function(e){return"Î¼"===(e+"").toLowerCase()[0]},meridiemParse:/[Î Îœ]\.?Îœ?\.?/i,longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendarEl:{sameDay:"[Î£Î®Î¼ÎµÏÎ± {}] LT",nextDay:"[Î‘ÏÏÎ¹Î¿ {}] LT",nextWeek:"dddd [{}] LT",lastDay:"[Î§Î¸ÎµÏ‚ {}] LT",lastWeek:function(){return 6===this.day()?"[Ï„Î¿ Ï€ÏÎ¿Î·Î³Î¿ÏÎ¼ÎµÎ½Î¿] dddd [{}] LT":"[Ï„Î·Î½ Ï€ÏÎ¿Î·Î³Î¿ÏÎ¼ÎµÎ½Î·] dddd [{}] LT"},sameElse:"L"},calendar:function(e,t){var n,r=this._calendarEl[e],a=t&&t.hours();return n=r,("undefined"!=typeof Function&&n instanceof Function||"[object Function]"===Object.prototype.toString.call(n))&&(r=r.apply(t)),r.replace("{}",a%12==1?"ÏƒÏ„Î·":"ÏƒÏ„Î¹Ï‚")},relativeTime:{future:"ÏƒÎµ %s",past:"%s Ï€ÏÎ¹Î½",s:"Î»Î¯Î³Î± Î´ÎµÏ…Ï„ÎµÏÏŒÎ»ÎµÏ€Ï„Î±",ss:"%d Î´ÎµÏ…Ï„ÎµÏÏŒÎ»ÎµÏ€Ï„Î±",m:"Î­Î½Î± Î»ÎµÏ€Ï„ÏŒ",mm:"%d Î»ÎµÏ€Ï„Î¬",h:"Î¼Î¯Î± ÏŽÏÎ±",hh:"%d ÏŽÏÎµÏ‚",d:"Î¼Î¯Î± Î¼Î­ÏÎ±",dd:"%d Î¼Î­ÏÎµÏ‚",M:"Î­Î½Î±Ï‚ Î¼Î®Î½Î±Ï‚",MM:"%d Î¼Î®Î½ÎµÏ‚",y:"Î­Î½Î±Ï‚ Ï‡ÏÏŒÎ½Î¿Ï‚",yy:"%d Ï‡ÏÏŒÎ½Î¹Î±"},dayOfMonthOrdinalParse:/\d{1,2}Î·/,ordinal:"%dÎ·",week:{dow:1,doy:4}})}(n(30381))},78348:function(e,t,n){!function(e){"use strict";e.defineLocale("en-au",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",ss:"%d seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},dayOfMonthOrdinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(e){var t=e%10;return e+(1==~~(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th")},week:{dow:0,doy:4}})}(n(30381))},77925:function(e,t,n){!function(e){"use strict";e.defineLocale("en-ca",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"YYYY-MM-DD",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",ss:"%d seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},dayOfMonthOrdinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(e){var t=e%10;return e+(1==~~(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th")}})}(n(30381))},22243:function(e,t,n){!function(e){"use strict";e.defineLocale("en-gb",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",ss:"%d seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},dayOfMonthOrdinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(e){var t=e%10;return e+(1==~~(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th")},week:{dow:1,doy:4}})}(n(30381))},46436:function(e,t,n){!function(e){"use strict";e.defineLocale("en-ie",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",ss:"%d seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},dayOfMonthOrdinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(e){var t=e%10;return e+(1==~~(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th")},week:{dow:1,doy:4}})}(n(30381))},47207:function(e,t,n){!function(e){"use strict";e.defineLocale("en-il",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",ss:"%d seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},dayOfMonthOrdinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(e){var t=e%10;return e+(1==~~(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th")}})}(n(30381))},44175:function(e,t,n){!function(e){"use strict";e.defineLocale("en-in",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",ss:"%d seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},dayOfMonthOrdinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(e){var t=e%10;return e+(1==~~(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th")},week:{dow:0,doy:6}})}(n(30381))},76319:function(e,t,n){!function(e){"use strict";e.defineLocale("en-nz",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",ss:"%d seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},dayOfMonthOrdinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(e){var t=e%10;return e+(1==~~(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th")},week:{dow:1,doy:4}})}(n(30381))},31662:function(e,t,n){!function(e){"use strict";e.defineLocale("en-sg",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",ss:"%d seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},dayOfMonthOrdinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(e){var t=e%10;return e+(1==~~(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th")},week:{dow:1,doy:4}})}(n(30381))},92915:function(e,t,n){!function(e){"use strict";e.defineLocale("eo",{months:"januaro_februaro_marto_aprilo_majo_junio_julio_aÅ­gusto_septembro_oktobro_novembro_decembro".split("_"),monthsShort:"jan_feb_mart_apr_maj_jun_jul_aÅ­g_sept_okt_nov_dec".split("_"),weekdays:"dimanÄ‰o_lundo_mardo_merkredo_ÄµaÅ­do_vendredo_sabato".split("_"),weekdaysShort:"dim_lun_mard_merk_ÄµaÅ­_ven_sab".split("_"),weekdaysMin:"di_lu_ma_me_Äµa_ve_sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"[la] D[-an de] MMMM, YYYY",LLL:"[la] D[-an de] MMMM, YYYY HH:mm",LLLL:"dddd[n], [la] D[-an de] MMMM, YYYY HH:mm",llll:"ddd, [la] D[-an de] MMM, YYYY HH:mm"},meridiemParse:/[ap]\.t\.m/i,isPM:function(e){return"p"===e.charAt(0).toLowerCase()},meridiem:function(e,t,n){return e>11?n?"p.t.m.":"P.T.M.":n?"a.t.m.":"A.T.M."},calendar:{sameDay:"[HodiaÅ­ je] LT",nextDay:"[MorgaÅ­ je] LT",nextWeek:"dddd[n je] LT",lastDay:"[HieraÅ­ je] LT",lastWeek:"[pasintan] dddd[n je] LT",sameElse:"L"},relativeTime:{future:"post %s",past:"antaÅ­ %s",s:"kelkaj sekundoj",ss:"%d sekundoj",m:"unu minuto",mm:"%d minutoj",h:"unu horo",hh:"%d horoj",d:"unu tago",dd:"%d tagoj",M:"unu monato",MM:"%d monatoj",y:"unu jaro",yy:"%d jaroj"},dayOfMonthOrdinalParse:/\d{1,2}a/,ordinal:"%da",week:{dow:1,doy:7}})}(n(30381))},55251:function(e,t,n){!function(e){"use strict";var t="ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split("_"),n="ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic".split("_"),r=[/^ene/i,/^feb/i,/^mar/i,/^abr/i,/^may/i,/^jun/i,/^jul/i,/^ago/i,/^sep/i,/^oct/i,/^nov/i,/^dic/i],a=/^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;e.defineLocale("es-do",{months:"enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split("_"),monthsShort:function(e,r){return e?/-MMM-/.test(r)?n[e.month()]:t[e.month()]:t},monthsRegex:a,monthsShortRegex:a,monthsStrictRegex:/^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,monthsShortStrictRegex:/^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,monthsParse:r,longMonthsParse:r,shortMonthsParse:r,weekdays:"domingo_lunes_martes_miÃ©rcoles_jueves_viernes_sÃ¡bado".split("_"),weekdaysShort:"dom._lun._mar._miÃ©._jue._vie._sÃ¡b.".split("_"),weekdaysMin:"do_lu_ma_mi_ju_vi_sÃ¡".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY h:mm A",LLLL:"dddd, D [de] MMMM [de] YYYY h:mm A"},calendar:{sameDay:function(){return"[hoy a la"+(1!==this.hours()?"s":"")+"] LT"},nextDay:function(){return"[maÃ±ana a la"+(1!==this.hours()?"s":"")+"] LT"},nextWeek:function(){return"dddd [a la"+(1!==this.hours()?"s":"")+"] LT"},lastDay:function(){return"[ayer a la"+(1!==this.hours()?"s":"")+"] LT"},lastWeek:function(){return"[el] dddd [pasado a la"+(1!==this.hours()?"s":"")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"hace %s",s:"unos segundos",ss:"%d segundos",m:"un minuto",mm:"%d minutos",h:"una hora",hh:"%d horas",d:"un dÃ­a",dd:"%d dÃ­as",w:"una semana",ww:"%d semanas",M:"un mes",MM:"%d meses",y:"un aÃ±o",yy:"%d aÃ±os"},dayOfMonthOrdinalParse:/\d{1,2}Âº/,ordinal:"%dÂº",week:{dow:1,doy:4}})}(n(30381))},96112:function(e,t,n){!function(e){"use strict";var t="ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split("_"),n="ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic".split("_"),r=[/^ene/i,/^feb/i,/^mar/i,/^abr/i,/^may/i,/^jun/i,/^jul/i,/^ago/i,/^sep/i,/^oct/i,/^nov/i,/^dic/i],a=/^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;e.defineLocale("es-mx",{months:"enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split("_"),monthsShort:function(e,r){return e?/-MMM-/.test(r)?n[e.month()]:t[e.month()]:t},monthsRegex:a,monthsShortRegex:a,monthsStrictRegex:/^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,monthsShortStrictRegex:/^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,monthsParse:r,longMonthsParse:r,shortMonthsParse:r,weekdays:"domingo_lunes_martes_miÃ©rcoles_jueves_viernes_sÃ¡bado".split("_"),weekdaysShort:"dom._lun._mar._miÃ©._jue._vie._sÃ¡b.".split("_"),weekdaysMin:"do_lu_ma_mi_ju_vi_sÃ¡".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY H:mm",LLLL:"dddd, D [de] MMMM [de] YYYY H:mm"},calendar:{sameDay:function(){return"[hoy a la"+(1!==this.hours()?"s":"")+"] LT"},nextDay:function(){return"[maÃ±ana a la"+(1!==this.hours()?"s":"")+"] LT"},nextWeek:function(){return"dddd [a la"+(1!==this.hours()?"s":"")+"] LT"},lastDay:function(){return"[ayer a la"+(1!==this.hours()?"s":"")+"] LT"},lastWeek:function(){return"[el] dddd [pasado a la"+(1!==this.hours()?"s":"")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"hace %s",s:"unos segundos",ss:"%d segundos",m:"un minuto",mm:"%d minutos",h:"una hora",hh:"%d horas",d:"un dÃ­a",dd:"%d dÃ­as",w:"una semana",ww:"%d semanas",M:"un mes",MM:"%d meses",y:"un aÃ±o",yy:"%d aÃ±os"},dayOfMonthOrdinalParse:/\d{1,2}Âº/,ordinal:"%dÂº",week:{dow:0,doy:4},invalidDate:"Fecha invÃ¡lida"})}(n(30381))},71146:function(e,t,n){!function(e){"use strict";var t="ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split("_"),n="ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic".split("_"),r=[/^ene/i,/^feb/i,/^mar/i,/^abr/i,/^may/i,/^jun/i,/^jul/i,/^ago/i,/^sep/i,/^oct/i,/^nov/i,/^dic/i],a=/^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;e.defineLocale("es-us",{months:"enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split("_"),monthsShort:function(e,r){return e?/-MMM-/.test(r)?n[e.month()]:t[e.month()]:t},monthsRegex:a,monthsShortRegex:a,monthsStrictRegex:/^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,monthsShortStrictRegex:/^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,monthsParse:r,longMonthsParse:r,shortMonthsParse:r,weekdays:"domingo_lunes_martes_miÃ©rcoles_jueves_viernes_sÃ¡bado".split("_"),weekdaysShort:"dom._lun._mar._miÃ©._jue._vie._sÃ¡b.".split("_"),weekdaysMin:"do_lu_ma_mi_ju_vi_sÃ¡".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"MM/DD/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY h:mm A",LLLL:"dddd, D [de] MMMM [de] YYYY h:mm A"},calendar:{sameDay:function(){return"[hoy a la"+(1!==this.hours()?"s":"")+"] LT"},nextDay:function(){return"[maÃ±ana a la"+(1!==this.hours()?"s":"")+"] LT"},nextWeek:function(){return"dddd [a la"+(1!==this.hours()?"s":"")+"] LT"},lastDay:function(){return"[ayer a la"+(1!==this.hours()?"s":"")+"] LT"},lastWeek:function(){return"[el] dddd [pasado a la"+(1!==this.hours()?"s":"")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"hace %s",s:"unos segundos",ss:"%d segundos",m:"un minuto",mm:"%d minutos",h:"una hora",hh:"%d horas",d:"un dÃ­a",dd:"%d dÃ­as",w:"una semana",ww:"%d semanas",M:"un mes",MM:"%d meses",y:"un aÃ±o",yy:"%d aÃ±os"},dayOfMonthOrdinalParse:/\d{1,2}Âº/,ordinal:"%dÂº",week:{dow:0,doy:6}})}(n(30381))},55655:function(e,t,n){!function(e){"use strict";var t="ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split("_"),n="ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic".split("_"),r=[/^ene/i,/^feb/i,/^mar/i,/^abr/i,/^may/i,/^jun/i,/^jul/i,/^ago/i,/^sep/i,/^oct/i,/^nov/i,/^dic/i],a=/^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;e.defineLocale("es",{months:"enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split("_"),monthsShort:function(e,r){return e?/-MMM-/.test(r)?n[e.month()]:t[e.month()]:t},monthsRegex:a,monthsShortRegex:a,monthsStrictRegex:/^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,monthsShortStrictRegex:/^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,monthsParse:r,longMonthsParse:r,shortMonthsParse:r,weekdays:"domingo_lunes_martes_miÃ©rcoles_jueves_viernes_sÃ¡bado".split("_"),weekdaysShort:"dom._lun._mar._miÃ©._jue._vie._sÃ¡b.".split("_"),weekdaysMin:"do_lu_ma_mi_ju_vi_sÃ¡".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY H:mm",LLLL:"dddd, D [de] MMMM [de] YYYY H:mm"},calendar:{sameDay:function(){return"[hoy a la"+(1!==this.hours()?"s":"")+"] LT"},nextDay:function(){return"[maÃ±ana a la"+(1!==this.hours()?"s":"")+"] LT"},nextWeek:function(){return"dddd [a la"+(1!==this.hours()?"s":"")+"] LT"},lastDay:function(){return"[ayer a la"+(1!==this.hours()?"s":"")+"] LT"},lastWeek:function(){return"[el] dddd [pasado a la"+(1!==this.hours()?"s":"")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"hace %s",s:"unos segundos",ss:"%d segundos",m:"un minuto",mm:"%d minutos",h:"una hora",hh:"%d horas",d:"un dÃ­a",dd:"%d dÃ­as",w:"una semana",ww:"%d semanas",M:"un mes",MM:"%d meses",y:"un aÃ±o",yy:"%d aÃ±os"},dayOfMonthOrdinalParse:/\d{1,2}Âº/,ordinal:"%dÂº",week:{dow:1,doy:4},invalidDate:"Fecha invÃ¡lida"})}(n(30381))},5603:function(e,t,n){!function(e){"use strict";function t(e,t,n,r){var a={s:["mÃµne sekundi","mÃµni sekund","paar sekundit"],ss:[e+"sekundi",e+"sekundit"],m:["Ã¼he minuti","Ã¼ks minut"],mm:[e+" minuti",e+" minutit"],h:["Ã¼he tunni","tund aega","Ã¼ks tund"],hh:[e+" tunni",e+" tundi"],d:["Ã¼he pÃ¤eva","Ã¼ks pÃ¤ev"],M:["kuu aja","kuu aega","Ã¼ks kuu"],MM:[e+" kuu",e+" kuud"],y:["Ã¼he aasta","aasta","Ã¼ks aasta"],yy:[e+" aasta",e+" aastat"]};return t?a[n][2]?a[n][2]:a[n][1]:r?a[n][0]:a[n][1]}e.defineLocale("et",{months:"jaanuar_veebruar_mÃ¤rts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember".split("_"),monthsShort:"jaan_veebr_mÃ¤rts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets".split("_"),weekdays:"pÃ¼hapÃ¤ev_esmaspÃ¤ev_teisipÃ¤ev_kolmapÃ¤ev_neljapÃ¤ev_reede_laupÃ¤ev".split("_"),weekdaysShort:"P_E_T_K_N_R_L".split("_"),weekdaysMin:"P_E_T_K_N_R_L".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[TÃ¤na,] LT",nextDay:"[Homme,] LT",nextWeek:"[JÃ¤rgmine] dddd LT",lastDay:"[Eile,] LT",lastWeek:"[Eelmine] dddd LT",sameElse:"L"},relativeTime:{future:"%s pÃ¤rast",past:"%s tagasi",s:t,ss:t,m:t,mm:t,h:t,hh:t,d:t,dd:"%d pÃ¤eva",M:t,MM:t,y:t,yy:t},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}(n(30381))},77763:function(e,t,n){!function(e){"use strict";e.defineLocale("eu",{months:"urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua".split("_"),monthsShort:"urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.".split("_"),monthsParseExact:!0,weekdays:"igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata".split("_"),weekdaysShort:"ig._al._ar._az._og._ol._lr.".split("_"),weekdaysMin:"ig_al_ar_az_og_ol_lr".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"YYYY[ko] MMMM[ren] D[a]",LLL:"YYYY[ko] MMMM[ren] D[a] HH:mm",LLLL:"dddd, YYYY[ko] MMMM[ren] D[a] HH:mm",l:"YYYY-M-D",ll:"YYYY[ko] MMM D[a]",lll:"YYYY[ko] MMM D[a] HH:mm",llll:"ddd, YYYY[ko] MMM D[a] HH:mm"},calendar:{sameDay:"[gaur] LT[etan]",nextDay:"[bihar] LT[etan]",nextWeek:"dddd LT[etan]",lastDay:"[atzo] LT[etan]",lastWeek:"[aurreko] dddd LT[etan]",sameElse:"L"},relativeTime:{future:"%s barru",past:"duela %s",s:"segundo batzuk",ss:"%d segundo",m:"minutu bat",mm:"%d minutu",h:"ordu bat",hh:"%d ordu",d:"egun bat",dd:"%d egun",M:"hilabete bat",MM:"%d hilabete",y:"urte bat",yy:"%d urte"},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}})}(n(30381))},76959:function(e,t,n){!function(e){"use strict";var t={1:"Û±",2:"Û²",3:"Û³",4:"Û´",5:"Ûµ",6:"Û¶",7:"Û·",8:"Û¸",9:"Û¹",0:"Û°"},n={"Û±":"1","Û²":"2","Û³":"3","Û´":"4","Ûµ":"5","Û¶":"6","Û·":"7","Û¸":"8","Û¹":"9","Û°":"0"};e.defineLocale("fa",{months:"Ú˜Ø§Ù†ÙˆÛŒÙ‡_ÙÙˆØ±ÛŒÙ‡_Ù…Ø§Ø±Ø³_Ø¢ÙˆØ±ÛŒÙ„_Ù…Ù‡_Ú˜ÙˆØ¦Ù†_Ú˜ÙˆØ¦ÛŒÙ‡_Ø§ÙˆØª_Ø³Ù¾ØªØ§Ù…Ø¨Ø±_Ø§Ú©ØªØ¨Ø±_Ù†ÙˆØ§Ù…Ø¨Ø±_Ø¯Ø³Ø§Ù…Ø¨Ø±".split("_"),monthsShort:"Ú˜Ø§Ù†ÙˆÛŒÙ‡_ÙÙˆØ±ÛŒÙ‡_Ù…Ø§Ø±Ø³_Ø¢ÙˆØ±ÛŒÙ„_Ù…Ù‡_Ú˜ÙˆØ¦Ù†_Ú˜ÙˆØ¦ÛŒÙ‡_Ø§ÙˆØª_Ø³Ù¾ØªØ§Ù…Ø¨Ø±_Ø§Ú©ØªØ¨Ø±_Ù†ÙˆØ§Ù…Ø¨Ø±_Ø¯Ø³Ø§Ù…Ø¨Ø±".split("_"),weekdays:"ÛŒÚ©â€ŒØ´Ù†Ø¨Ù‡_Ø¯ÙˆØ´Ù†Ø¨Ù‡_Ø³Ù‡â€ŒØ´Ù†Ø¨Ù‡_Ú†Ù‡Ø§Ø±Ø´Ù†Ø¨Ù‡_Ù¾Ù†Ø¬â€ŒØ´Ù†Ø¨Ù‡_Ø¬Ù…Ø¹Ù‡_Ø´Ù†Ø¨Ù‡".split("_"),weekdaysShort:"ÛŒÚ©â€ŒØ´Ù†Ø¨Ù‡_Ø¯ÙˆØ´Ù†Ø¨Ù‡_Ø³Ù‡â€ŒØ´Ù†Ø¨Ù‡_Ú†Ù‡Ø§Ø±Ø´Ù†Ø¨Ù‡_Ù¾Ù†Ø¬â€ŒØ´Ù†Ø¨Ù‡_Ø¬Ù…Ø¹Ù‡_Ø´Ù†Ø¨Ù‡".split("_"),weekdaysMin:"ÛŒ_Ø¯_Ø³_Ú†_Ù¾_Ø¬_Ø´".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},meridiemParse:/Ù‚Ø¨Ù„ Ø§Ø² Ø¸Ù‡Ø±|Ø¨Ø¹Ø¯ Ø§Ø² Ø¸Ù‡Ø±/,isPM:function(e){return/Ø¨Ø¹Ø¯ Ø§Ø² Ø¸Ù‡Ø±/.test(e)},meridiem:function(e,t,n){return e<12?"Ù‚Ø¨Ù„ Ø§Ø² Ø¸Ù‡Ø±":"Ø¨Ø¹Ø¯ Ø§Ø² Ø¸Ù‡Ø±"},calendar:{sameDay:"[Ø§Ù…Ø±ÙˆØ² Ø³Ø§Ø¹Øª] LT",nextDay:"[ÙØ±Ø¯Ø§ Ø³Ø§Ø¹Øª] LT",nextWeek:"dddd [Ø³Ø§Ø¹Øª] LT",lastDay:"[Ø¯ÛŒØ±ÙˆØ² Ø³Ø§Ø¹Øª] LT",lastWeek:"dddd [Ù¾ÛŒØ´] [Ø³Ø§Ø¹Øª] LT",sameElse:"L"},relativeTime:{future:"Ø¯Ø± %s",past:"%s Ù¾ÛŒØ´",s:"Ú†Ù†Ø¯ Ø«Ø§Ù†ÛŒÙ‡",ss:"%d Ø«Ø§Ù†ÛŒÙ‡",m:"ÛŒÚ© Ø¯Ù‚ÛŒÙ‚Ù‡",mm:"%d Ø¯Ù‚ÛŒÙ‚Ù‡",h:"ÛŒÚ© Ø³Ø§Ø¹Øª",hh:"%d Ø³Ø§Ø¹Øª",d:"ÛŒÚ© Ø±ÙˆØ²",dd:"%d Ø±ÙˆØ²",M:"ÛŒÚ© Ù…Ø§Ù‡",MM:"%d Ù…Ø§Ù‡",y:"ÛŒÚ© Ø³Ø§Ù„",yy:"%d Ø³Ø§Ù„"},preparse:function(e){return e.replace(/[Û°-Û¹]/g,(function(e){return n[e]})).replace(/ØŒ/g,",")},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]})).replace(/,/g,"ØŒ")},dayOfMonthOrdinalParse:/\d{1,2}Ù…/,ordinal:"%dÙ…",week:{dow:6,doy:12}})}(n(30381))},11897:function(e,t,n){!function(e){"use strict";var t="nolla yksi kaksi kolme neljÃ¤ viisi kuusi seitsemÃ¤n kahdeksan yhdeksÃ¤n".split(" "),n=["nolla","yhden","kahden","kolmen","neljÃ¤n","viiden","kuuden",t[7],t[8],t[9]];function r(e,r,a,s){var i="";switch(a){case"s":return s?"muutaman sekunnin":"muutama sekunti";case"ss":i=s?"sekunnin":"sekuntia";break;case"m":return s?"minuutin":"minuutti";case"mm":i=s?"minuutin":"minuuttia";break;case"h":return s?"tunnin":"tunti";case"hh":i=s?"tunnin":"tuntia";break;case"d":return s?"pÃ¤ivÃ¤n":"pÃ¤ivÃ¤";case"dd":i=s?"pÃ¤ivÃ¤n":"pÃ¤ivÃ¤Ã¤";break;case"M":return s?"kuukauden":"kuukausi";case"MM":i=s?"kuukauden":"kuukautta";break;case"y":return s?"vuoden":"vuosi";case"yy":i=s?"vuoden":"vuotta"}return function(e,r){return e<10?r?n[e]:t[e]:e}(e,s)+" "+i}e.defineLocale("fi",{months:"tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesÃ¤kuu_heinÃ¤kuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu".split("_"),monthsShort:"tammi_helmi_maalis_huhti_touko_kesÃ¤_heinÃ¤_elo_syys_loka_marras_joulu".split("_"),weekdays:"sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai".split("_"),weekdaysShort:"su_ma_ti_ke_to_pe_la".split("_"),weekdaysMin:"su_ma_ti_ke_to_pe_la".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD.MM.YYYY",LL:"Do MMMM[ta] YYYY",LLL:"Do MMMM[ta] YYYY, [klo] HH.mm",LLLL:"dddd, Do MMMM[ta] YYYY, [klo] HH.mm",l:"D.M.YYYY",ll:"Do MMM YYYY",lll:"Do MMM YYYY, [klo] HH.mm",llll:"ddd, Do MMM YYYY, [klo] HH.mm"},calendar:{sameDay:"[tÃ¤nÃ¤Ã¤n] [klo] LT",nextDay:"[huomenna] [klo] LT",nextWeek:"dddd [klo] LT",lastDay:"[eilen] [klo] LT",lastWeek:"[viime] dddd[na] [klo] LT",sameElse:"L"},relativeTime:{future:"%s pÃ¤Ã¤stÃ¤",past:"%s sitten",s:r,ss:r,m:r,mm:r,h:r,hh:r,d:r,dd:r,M:r,MM:r,y:r,yy:r},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}(n(30381))},42549:function(e,t,n){!function(e){"use strict";e.defineLocale("fil",{months:"Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre".split("_"),monthsShort:"Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis".split("_"),weekdays:"Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado".split("_"),weekdaysShort:"Lin_Lun_Mar_Miy_Huw_Biy_Sab".split("_"),weekdaysMin:"Li_Lu_Ma_Mi_Hu_Bi_Sab".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"MM/D/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY HH:mm",LLLL:"dddd, MMMM DD, YYYY HH:mm"},calendar:{sameDay:"LT [ngayong araw]",nextDay:"[Bukas ng] LT",nextWeek:"LT [sa susunod na] dddd",lastDay:"LT [kahapon]",lastWeek:"LT [noong nakaraang] dddd",sameElse:"L"},relativeTime:{future:"sa loob ng %s",past:"%s ang nakalipas",s:"ilang segundo",ss:"%d segundo",m:"isang minuto",mm:"%d minuto",h:"isang oras",hh:"%d oras",d:"isang araw",dd:"%d araw",M:"isang buwan",MM:"%d buwan",y:"isang taon",yy:"%d taon"},dayOfMonthOrdinalParse:/\d{1,2}/,ordinal:function(e){return e},week:{dow:1,doy:4}})}(n(30381))},94694:function(e,t,n){!function(e){"use strict";e.defineLocale("fo",{months:"januar_februar_mars_aprÃ­l_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),weekdays:"sunnudagur_mÃ¡nadagur_tÃ½sdagur_mikudagur_hÃ³sdagur_frÃ­ggjadagur_leygardagur".split("_"),weekdaysShort:"sun_mÃ¡n_tÃ½s_mik_hÃ³s_frÃ­_ley".split("_"),weekdaysMin:"su_mÃ¡_tÃ½_mi_hÃ³_fr_le".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D. MMMM, YYYY HH:mm"},calendar:{sameDay:"[Ã dag kl.] LT",nextDay:"[Ã morgin kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[Ã gjÃ¡r kl.] LT",lastWeek:"[sÃ­Ã°stu] dddd [kl] LT",sameElse:"L"},relativeTime:{future:"um %s",past:"%s sÃ­Ã°ani",s:"fÃ¡ sekund",ss:"%d sekundir",m:"ein minuttur",mm:"%d minuttir",h:"ein tÃ­mi",hh:"%d tÃ­mar",d:"ein dagur",dd:"%d dagar",M:"ein mÃ¡naÃ°ur",MM:"%d mÃ¡naÃ°ir",y:"eitt Ã¡r",yy:"%d Ã¡r"},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}(n(30381))},63049:function(e,t,n){!function(e){"use strict";e.defineLocale("fr-ca",{months:"janvier_fÃ©vrier_mars_avril_mai_juin_juillet_aoÃ»t_septembre_octobre_novembre_dÃ©cembre".split("_"),monthsShort:"janv._fÃ©vr._mars_avr._mai_juin_juil._aoÃ»t_sept._oct._nov._dÃ©c.".split("_"),monthsParseExact:!0,weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"di_lu_ma_me_je_ve_sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Aujourdâ€™hui Ã ] LT",nextDay:"[Demain Ã ] LT",nextWeek:"dddd [Ã ] LT",lastDay:"[Hier Ã ] LT",lastWeek:"dddd [dernier Ã ] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",ss:"%d secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"un an",yy:"%d ans"},dayOfMonthOrdinalParse:/\d{1,2}(er|e)/,ordinal:function(e,t){switch(t){default:case"M":case"Q":case"D":case"DDD":case"d":return e+(1===e?"er":"e");case"w":case"W":return e+(1===e?"re":"e")}}})}(n(30381))},52330:function(e,t,n){!function(e){"use strict";e.defineLocale("fr-ch",{months:"janvier_fÃ©vrier_mars_avril_mai_juin_juillet_aoÃ»t_septembre_octobre_novembre_dÃ©cembre".split("_"),monthsShort:"janv._fÃ©vr._mars_avr._mai_juin_juil._aoÃ»t_sept._oct._nov._dÃ©c.".split("_"),monthsParseExact:!0,weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"di_lu_ma_me_je_ve_sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Aujourdâ€™hui Ã ] LT",nextDay:"[Demain Ã ] LT",nextWeek:"dddd [Ã ] LT",lastDay:"[Hier Ã ] LT",lastWeek:"dddd [dernier Ã ] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",ss:"%d secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"un an",yy:"%d ans"},dayOfMonthOrdinalParse:/\d{1,2}(er|e)/,ordinal:function(e,t){switch(t){default:case"M":case"Q":case"D":case"DDD":case"d":return e+(1===e?"er":"e");case"w":case"W":return e+(1===e?"re":"e")}},week:{dow:1,doy:4}})}(n(30381))},94470:function(e,t,n){!function(e){"use strict";var t=/(janv\.?|fÃ©vr\.?|mars|avr\.?|mai|juin|juil\.?|aoÃ»t|sept\.?|oct\.?|nov\.?|dÃ©c\.?|janvier|fÃ©vrier|mars|avril|mai|juin|juillet|aoÃ»t|septembre|octobre|novembre|dÃ©cembre)/i,n=[/^janv/i,/^fÃ©vr/i,/^mars/i,/^avr/i,/^mai/i,/^juin/i,/^juil/i,/^aoÃ»t/i,/^sept/i,/^oct/i,/^nov/i,/^dÃ©c/i];e.defineLocale("fr",{months:"janvier_fÃ©vrier_mars_avril_mai_juin_juillet_aoÃ»t_septembre_octobre_novembre_dÃ©cembre".split("_"),monthsShort:"janv._fÃ©vr._mars_avr._mai_juin_juil._aoÃ»t_sept._oct._nov._dÃ©c.".split("_"),monthsRegex:t,monthsShortRegex:t,monthsStrictRegex:/^(janvier|fÃ©vrier|mars|avril|mai|juin|juillet|aoÃ»t|septembre|octobre|novembre|dÃ©cembre)/i,monthsShortStrictRegex:/(janv\.?|fÃ©vr\.?|mars|avr\.?|mai|juin|juil\.?|aoÃ»t|sept\.?|oct\.?|nov\.?|dÃ©c\.?)/i,monthsParse:n,longMonthsParse:n,shortMonthsParse:n,weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"di_lu_ma_me_je_ve_sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Aujourdâ€™hui Ã ] LT",nextDay:"[Demain Ã ] LT",nextWeek:"dddd [Ã ] LT",lastDay:"[Hier Ã ] LT",lastWeek:"dddd [dernier Ã ] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",ss:"%d secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",w:"une semaine",ww:"%d semaines",M:"un mois",MM:"%d mois",y:"un an",yy:"%d ans"},dayOfMonthOrdinalParse:/\d{1,2}(er|)/,ordinal:function(e,t){switch(t){case"D":return e+(1===e?"er":"");default:case"M":case"Q":case"DDD":case"d":return e+(1===e?"er":"e");case"w":case"W":return e+(1===e?"re":"e")}},week:{dow:1,doy:4}})}(n(30381))},5044:function(e,t,n){!function(e){"use strict";var t="jan._feb._mrt._apr._mai_jun._jul._aug._sep._okt._nov._des.".split("_"),n="jan_feb_mrt_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_");e.defineLocale("fy",{months:"jannewaris_febrewaris_maart_april_maaie_juny_july_augustus_septimber_oktober_novimber_desimber".split("_"),monthsShort:function(e,r){return e?/-MMM-/.test(r)?n[e.month()]:t[e.month()]:t},monthsParseExact:!0,weekdays:"snein_moandei_tiisdei_woansdei_tongersdei_freed_sneon".split("_"),weekdaysShort:"si._mo._ti._wo._to._fr._so.".split("_"),weekdaysMin:"Si_Mo_Ti_Wo_To_Fr_So".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[hjoed om] LT",nextDay:"[moarn om] LT",nextWeek:"dddd [om] LT",lastDay:"[juster om] LT",lastWeek:"[Ã´frÃ»ne] dddd [om] LT",sameElse:"L"},relativeTime:{future:"oer %s",past:"%s lyn",s:"in pear sekonden",ss:"%d sekonden",m:"ien minÃºt",mm:"%d minuten",h:"ien oere",hh:"%d oeren",d:"ien dei",dd:"%d dagen",M:"ien moanne",MM:"%d moannen",y:"ien jier",yy:"%d jierren"},dayOfMonthOrdinalParse:/\d{1,2}(ste|de)/,ordinal:function(e){return e+(1===e||8===e||e>=20?"ste":"de")},week:{dow:1,doy:4}})}(n(30381))},29295:function(e,t,n){!function(e){"use strict";e.defineLocale("ga",{months:["EanÃ¡ir","Feabhra","MÃ¡rta","AibreÃ¡n","Bealtaine","Meitheamh","IÃºil","LÃºnasa","MeÃ¡n FÃ³mhair","Deireadh FÃ³mhair","Samhain","Nollaig"],monthsShort:["Ean","Feabh","MÃ¡rt","Aib","Beal","Meith","IÃºil","LÃºn","M.F.","D.F.","Samh","Noll"],monthsParseExact:!0,weekdays:["DÃ© Domhnaigh","DÃ© Luain","DÃ© MÃ¡irt","DÃ© CÃ©adaoin","DÃ©ardaoin","DÃ© hAoine","DÃ© Sathairn"],weekdaysShort:["Domh","Luan","MÃ¡irt","CÃ©ad","DÃ©ar","Aoine","Sath"],weekdaysMin:["Do","Lu","MÃ¡","CÃ©","DÃ©","A","Sa"],longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Inniu ag] LT",nextDay:"[AmÃ¡rach ag] LT",nextWeek:"dddd [ag] LT",lastDay:"[InnÃ© ag] LT",lastWeek:"dddd [seo caite] [ag] LT",sameElse:"L"},relativeTime:{future:"i %s",past:"%s Ã³ shin",s:"cÃºpla soicind",ss:"%d soicind",m:"nÃ³imÃ©ad",mm:"%d nÃ³imÃ©ad",h:"uair an chloig",hh:"%d uair an chloig",d:"lÃ¡",dd:"%d lÃ¡",M:"mÃ­",MM:"%d mÃ­onna",y:"bliain",yy:"%d bliain"},dayOfMonthOrdinalParse:/\d{1,2}(d|na|mh)/,ordinal:function(e){return e+(1===e?"d":e%10==2?"na":"mh")},week:{dow:1,doy:4}})}(n(30381))},2101:function(e,t,n){!function(e){"use strict";e.defineLocale("gd",{months:["Am Faoilleach","An Gearran","Am MÃ rt","An Giblean","An CÃ¨itean","An t-Ã’gmhios","An t-Iuchar","An LÃ¹nastal","An t-Sultain","An DÃ mhair","An t-Samhain","An DÃ¹bhlachd"],monthsShort:["Faoi","Gear","MÃ rt","Gibl","CÃ¨it","Ã’gmh","Iuch","LÃ¹n","Sult","DÃ mh","Samh","DÃ¹bh"],monthsParseExact:!0,weekdays:["DidÃ²mhnaich","Diluain","DimÃ irt","Diciadain","Diardaoin","Dihaoine","Disathairne"],weekdaysShort:["Did","Dil","Dim","Dic","Dia","Dih","Dis"],weekdaysMin:["DÃ²","Lu","MÃ ","Ci","Ar","Ha","Sa"],longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[An-diugh aig] LT",nextDay:"[A-mÃ ireach aig] LT",nextWeek:"dddd [aig] LT",lastDay:"[An-dÃ¨ aig] LT",lastWeek:"dddd [seo chaidh] [aig] LT",sameElse:"L"},relativeTime:{future:"ann an %s",past:"bho chionn %s",s:"beagan diogan",ss:"%d diogan",m:"mionaid",mm:"%d mionaidean",h:"uair",hh:"%d uairean",d:"latha",dd:"%d latha",M:"mÃ¬os",MM:"%d mÃ¬osan",y:"bliadhna",yy:"%d bliadhna"},dayOfMonthOrdinalParse:/\d{1,2}(d|na|mh)/,ordinal:function(e){return e+(1===e?"d":e%10==2?"na":"mh")},week:{dow:1,doy:4}})}(n(30381))},38794:function(e,t,n){!function(e){"use strict";e.defineLocale("gl",{months:"xaneiro_febreiro_marzo_abril_maio_xuÃ±o_xullo_agosto_setembro_outubro_novembro_decembro".split("_"),monthsShort:"xan._feb._mar._abr._mai._xuÃ±._xul._ago._set._out._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"domingo_luns_martes_mÃ©rcores_xoves_venres_sÃ¡bado".split("_"),weekdaysShort:"dom._lun._mar._mÃ©r._xov._ven._sÃ¡b.".split("_"),weekdaysMin:"do_lu_ma_mÃ©_xo_ve_sÃ¡".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY H:mm",LLLL:"dddd, D [de] MMMM [de] YYYY H:mm"},calendar:{sameDay:function(){return"[hoxe "+(1!==this.hours()?"Ã¡s":"Ã¡")+"] LT"},nextDay:function(){return"[maÃ±Ã¡ "+(1!==this.hours()?"Ã¡s":"Ã¡")+"] LT"},nextWeek:function(){return"dddd ["+(1!==this.hours()?"Ã¡s":"a")+"] LT"},lastDay:function(){return"[onte "+(1!==this.hours()?"Ã¡":"a")+"] LT"},lastWeek:function(){return"[o] dddd [pasado "+(1!==this.hours()?"Ã¡s":"a")+"] LT"},sameElse:"L"},relativeTime:{future:function(e){return 0===e.indexOf("un")?"n"+e:"en "+e},past:"hai %s",s:"uns segundos",ss:"%d segundos",m:"un minuto",mm:"%d minutos",h:"unha hora",hh:"%d horas",d:"un dÃ­a",dd:"%d dÃ­as",M:"un mes",MM:"%d meses",y:"un ano",yy:"%d anos"},dayOfMonthOrdinalParse:/\d{1,2}Âº/,ordinal:"%dÂº",week:{dow:1,doy:4}})}(n(30381))},27884:function(e,t,n){!function(e){"use strict";function t(e,t,n,r){var a={s:["à¤¥à¥‹à¤¡à¤¯à¤¾ à¤¸à¥…à¤•à¤‚à¤¡à¤¾à¤‚à¤¨à¥€","à¤¥à¥‹à¤¡à¥‡ à¤¸à¥…à¤•à¤‚à¤¡"],ss:[e+" à¤¸à¥…à¤•à¤‚à¤¡à¤¾à¤‚à¤¨à¥€",e+" à¤¸à¥…à¤•à¤‚à¤¡"],m:["à¤à¤•à¤¾ à¤®à¤¿à¤£à¤Ÿà¤¾à¤¨","à¤à¤• à¤®à¤¿à¤¨à¥‚à¤Ÿ"],mm:[e+" à¤®à¤¿à¤£à¤Ÿà¤¾à¤‚à¤¨à¥€",e+" à¤®à¤¿à¤£à¤Ÿà¤¾à¤‚"],h:["à¤à¤•à¤¾ à¤µà¤°à¤¾à¤¨","à¤à¤• à¤µà¤°"],hh:[e+" à¤µà¤°à¤¾à¤‚à¤¨à¥€",e+" à¤µà¤°à¤¾à¤‚"],d:["à¤à¤•à¤¾ à¤¦à¤¿à¤¸à¤¾à¤¨","à¤à¤• à¤¦à¥€à¤¸"],dd:[e+" à¤¦à¤¿à¤¸à¤¾à¤‚à¤¨à¥€",e+" à¤¦à¥€à¤¸"],M:["à¤à¤•à¤¾ à¤®à¥à¤¹à¤¯à¤¨à¥à¤¯à¤¾à¤¨","à¤à¤• à¤®à¥à¤¹à¤¯à¤¨à¥‹"],MM:[e+" à¤®à¥à¤¹à¤¯à¤¨à¥à¤¯à¤¾à¤¨à¥€",e+" à¤®à¥à¤¹à¤¯à¤¨à¥‡"],y:["à¤à¤•à¤¾ à¤µà¤°à¥à¤¸à¤¾à¤¨","à¤à¤• à¤µà¤°à¥à¤¸"],yy:[e+" à¤µà¤°à¥à¤¸à¤¾à¤‚à¤¨à¥€",e+" à¤µà¤°à¥à¤¸à¤¾à¤‚"]};return r?a[n][0]:a[n][1]}e.defineLocale("gom-deva",{months:{standalone:"à¤œà¤¾à¤¨à¥‡à¤µà¤¾à¤°à¥€_à¤«à¥‡à¤¬à¥à¤°à¥à¤µà¤¾à¤°à¥€_à¤®à¤¾à¤°à¥à¤š_à¤à¤ªà¥à¤°à¥€à¤²_à¤®à¥‡_à¤œà¥‚à¤¨_à¤œà¥à¤²à¤¯_à¤‘à¤—à¤¸à¥à¤Ÿ_à¤¸à¤ªà¥à¤Ÿà¥‡à¤‚à¤¬à¤°_à¤‘à¤•à¥à¤Ÿà¥‹à¤¬à¤°_à¤¨à¥‹à¤µà¥à¤¹à¥‡à¤‚à¤¬à¤°_à¤¡à¤¿à¤¸à¥‡à¤‚à¤¬à¤°".split("_"),format:"à¤œà¤¾à¤¨à¥‡à¤µà¤¾à¤°à¥€à¤šà¥à¤¯à¤¾_à¤«à¥‡à¤¬à¥à¤°à¥à¤µà¤¾à¤°à¥€à¤šà¥à¤¯à¤¾_à¤®à¤¾à¤°à¥à¤šà¤¾à¤šà¥à¤¯à¤¾_à¤à¤ªà¥à¤°à¥€à¤²à¤¾à¤šà¥à¤¯à¤¾_à¤®à¥‡à¤¯à¤¾à¤šà¥à¤¯à¤¾_à¤œà¥‚à¤¨à¤¾à¤šà¥à¤¯à¤¾_à¤œà¥à¤²à¤¯à¤¾à¤šà¥à¤¯à¤¾_à¤‘à¤—à¤¸à¥à¤Ÿà¤¾à¤šà¥à¤¯à¤¾_à¤¸à¤ªà¥à¤Ÿà¥‡à¤‚à¤¬à¤°à¤¾à¤šà¥à¤¯à¤¾_à¤‘à¤•à¥à¤Ÿà¥‹à¤¬à¤°à¤¾à¤šà¥à¤¯à¤¾_à¤¨à¥‹à¤µà¥à¤¹à¥‡à¤‚à¤¬à¤°à¤¾à¤šà¥à¤¯à¤¾_à¤¡à¤¿à¤¸à¥‡à¤‚à¤¬à¤°à¤¾à¤šà¥à¤¯à¤¾".split("_"),isFormat:/MMMM(\s)+D[oD]?/},monthsShort:"à¤œà¤¾à¤¨à¥‡._à¤«à¥‡à¤¬à¥à¤°à¥._à¤®à¤¾à¤°à¥à¤š_à¤à¤ªà¥à¤°à¥€._à¤®à¥‡_à¤œà¥‚à¤¨_à¤œà¥à¤²._à¤‘à¤—._à¤¸à¤ªà¥à¤Ÿà¥‡à¤‚._à¤‘à¤•à¥à¤Ÿà¥‹._à¤¨à¥‹à¤µà¥à¤¹à¥‡à¤‚._à¤¡à¤¿à¤¸à¥‡à¤‚.".split("_"),monthsParseExact:!0,weekdays:"à¤†à¤¯à¤¤à¤¾à¤°_à¤¸à¥‹à¤®à¤¾à¤°_à¤®à¤‚à¤—à¤³à¤¾à¤°_à¤¬à¥à¤§à¤µà¤¾à¤°_à¤¬à¤¿à¤°à¥‡à¤¸à¥à¤¤à¤¾à¤°_à¤¸à¥à¤•à¥à¤°à¤¾à¤°_à¤¶à¥‡à¤¨à¤µà¤¾à¤°".split("_"),weekdaysShort:"à¤†à¤¯à¤¤._à¤¸à¥‹à¤®._à¤®à¤‚à¤—à¤³._à¤¬à¥à¤§._à¤¬à¥à¤°à¥‡à¤¸à¥à¤¤._à¤¸à¥à¤•à¥à¤°._à¤¶à¥‡à¤¨.".split("_"),weekdaysMin:"à¤†_à¤¸à¥‹_à¤®à¤‚_à¤¬à¥_à¤¬à¥à¤°à¥‡_à¤¸à¥_à¤¶à¥‡".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"A h:mm [à¤µà¤¾à¤œà¤¤à¤¾à¤‚]",LTS:"A h:mm:ss [à¤µà¤¾à¤œà¤¤à¤¾à¤‚]",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY A h:mm [à¤µà¤¾à¤œà¤¤à¤¾à¤‚]",LLLL:"dddd, MMMM Do, YYYY, A h:mm [à¤µà¤¾à¤œà¤¤à¤¾à¤‚]",llll:"ddd, D MMM YYYY, A h:mm [à¤µà¤¾à¤œà¤¤à¤¾à¤‚]"},calendar:{sameDay:"[à¤†à¤¯à¤œ] LT",nextDay:"[à¤«à¤¾à¤²à¥à¤¯à¤¾à¤‚] LT",nextWeek:"[à¤«à¥à¤¡à¤²à¥‹] dddd[,] LT",lastDay:"[à¤•à¤¾à¤²] LT",lastWeek:"[à¤«à¤¾à¤Ÿà¤²à¥‹] dddd[,] LT",sameElse:"L"},relativeTime:{future:"%s",past:"%s à¤†à¤¦à¥€à¤‚",s:t,ss:t,m:t,mm:t,h:t,hh:t,d:t,dd:t,M:t,MM:t,y:t,yy:t},dayOfMonthOrdinalParse:/\d{1,2}(à¤µà¥‡à¤°)/,ordinal:function(e,t){return"D"===t?e+"à¤µà¥‡à¤°":e},week:{dow:0,doy:3},meridiemParse:/à¤°à¤¾à¤¤à¥€|à¤¸à¤•à¤¾à¤³à¥€à¤‚|à¤¦à¤¨à¤ªà¤¾à¤°à¤¾à¤‚|à¤¸à¤¾à¤‚à¤œà¥‡/,meridiemHour:function(e,t){return 12===e&&(e=0),"à¤°à¤¾à¤¤à¥€"===t?e<4?e:e+12:"à¤¸à¤•à¤¾à¤³à¥€à¤‚"===t?e:"à¤¦à¤¨à¤ªà¤¾à¤°à¤¾à¤‚"===t?e>12?e:e+12:"à¤¸à¤¾à¤‚à¤œà¥‡"===t?e+12:void 0},meridiem:function(e,t,n){return e<4?"à¤°à¤¾à¤¤à¥€":e<12?"à¤¸à¤•à¤¾à¤³à¥€à¤‚":e<16?"à¤¦à¤¨à¤ªà¤¾à¤°à¤¾à¤‚":e<20?"à¤¸à¤¾à¤‚à¤œà¥‡":"à¤°à¤¾à¤¤à¥€"}})}(n(30381))},23168:function(e,t,n){!function(e){"use strict";function t(e,t,n,r){var a={s:["thoddea sekondamni","thodde sekond"],ss:[e+" sekondamni",e+" sekond"],m:["eka mintan","ek minut"],mm:[e+" mintamni",e+" mintam"],h:["eka voran","ek vor"],hh:[e+" voramni",e+" voram"],d:["eka disan","ek dis"],dd:[e+" disamni",e+" dis"],M:["eka mhoinean","ek mhoino"],MM:[e+" mhoineamni",e+" mhoine"],y:["eka vorsan","ek voros"],yy:[e+" vorsamni",e+" vorsam"]};return r?a[n][0]:a[n][1]}e.defineLocale("gom-latn",{months:{standalone:"Janer_Febrer_Mars_Abril_Mai_Jun_Julai_Agost_Setembr_Otubr_Novembr_Dezembr".split("_"),format:"Janerachea_Febrerachea_Marsachea_Abrilachea_Maiachea_Junachea_Julaiachea_Agostachea_Setembrachea_Otubrachea_Novembrachea_Dezembrachea".split("_"),isFormat:/MMMM(\s)+D[oD]?/},monthsShort:"Jan._Feb._Mars_Abr._Mai_Jun_Jul._Ago._Set._Otu._Nov._Dez.".split("_"),monthsParseExact:!0,weekdays:"Aitar_Somar_Mongllar_Budhvar_Birestar_Sukrar_Son'var".split("_"),weekdaysShort:"Ait._Som._Mon._Bud._Bre._Suk._Son.".split("_"),weekdaysMin:"Ai_Sm_Mo_Bu_Br_Su_Sn".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"A h:mm [vazta]",LTS:"A h:mm:ss [vazta]",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY A h:mm [vazta]",LLLL:"dddd, MMMM Do, YYYY, A h:mm [vazta]",llll:"ddd, D MMM YYYY, A h:mm [vazta]"},calendar:{sameDay:"[Aiz] LT",nextDay:"[Faleam] LT",nextWeek:"[Fuddlo] dddd[,] LT",lastDay:"[Kal] LT",lastWeek:"[Fattlo] dddd[,] LT",sameElse:"L"},relativeTime:{future:"%s",past:"%s adim",s:t,ss:t,m:t,mm:t,h:t,hh:t,d:t,dd:t,M:t,MM:t,y:t,yy:t},dayOfMonthOrdinalParse:/\d{1,2}(er)/,ordinal:function(e,t){return"D"===t?e+"er":e},week:{dow:0,doy:3},meridiemParse:/rati|sokallim|donparam|sanje/,meridiemHour:function(e,t){return 12===e&&(e=0),"rati"===t?e<4?e:e+12:"sokallim"===t?e:"donparam"===t?e>12?e:e+12:"sanje"===t?e+12:void 0},meridiem:function(e,t,n){return e<4?"rati":e<12?"sokallim":e<16?"donparam":e<20?"sanje":"rati"}})}(n(30381))},95349:function(e,t,n){!function(e){"use strict";var t={1:"à«§",2:"à«¨",3:"à«©",4:"à«ª",5:"à««",6:"à«¬",7:"à«­",8:"à«®",9:"à«¯",0:"à«¦"},n={"à«§":"1","à«¨":"2","à«©":"3","à«ª":"4","à««":"5","à«¬":"6","à«­":"7","à«®":"8","à«¯":"9","à«¦":"0"};e.defineLocale("gu",{months:"àªœàª¾àª¨à«àª¯à«àª†àª°à«€_àª«à«‡àª¬à«àª°à«àª†àª°à«€_àª®àª¾àª°à«àªš_àªàªªà«àª°àª¿àª²_àª®à«‡_àªœà«‚àª¨_àªœà«àª²àª¾àªˆ_àª‘àª—àª¸à«àªŸ_àª¸àªªà«àªŸà«‡àª®à«àª¬àª°_àª‘àª•à«àªŸà«àª¬àª°_àª¨àªµà«‡àª®à«àª¬àª°_àª¡àª¿àª¸à«‡àª®à«àª¬àª°".split("_"),monthsShort:"àªœàª¾àª¨à«àª¯à«._àª«à«‡àª¬à«àª°à«._àª®àª¾àª°à«àªš_àªàªªà«àª°àª¿._àª®à«‡_àªœà«‚àª¨_àªœà«àª²àª¾._àª‘àª—._àª¸àªªà«àªŸà«‡._àª‘àª•à«àªŸà«._àª¨àªµà«‡._àª¡àª¿àª¸à«‡.".split("_"),monthsParseExact:!0,weekdays:"àª°àªµàª¿àªµàª¾àª°_àª¸à«‹àª®àªµàª¾àª°_àª®àª‚àª—àª³àªµàª¾àª°_àª¬à«àª§à«àªµàª¾àª°_àª—à«àª°à«àªµàª¾àª°_àª¶à«àª•à«àª°àªµàª¾àª°_àª¶àª¨àª¿àªµàª¾àª°".split("_"),weekdaysShort:"àª°àªµàª¿_àª¸à«‹àª®_àª®àª‚àª—àª³_àª¬à«àª§à«_àª—à«àª°à«_àª¶à«àª•à«àª°_àª¶àª¨àª¿".split("_"),weekdaysMin:"àª°_àª¸à«‹_àª®àª‚_àª¬à«_àª—à«_àª¶à«_àª¶".split("_"),longDateFormat:{LT:"A h:mm àªµàª¾àª—à«àª¯à«‡",LTS:"A h:mm:ss àªµàª¾àª—à«àª¯à«‡",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm àªµàª¾àª—à«àª¯à«‡",LLLL:"dddd, D MMMM YYYY, A h:mm àªµàª¾àª—à«àª¯à«‡"},calendar:{sameDay:"[àª†àªœ] LT",nextDay:"[àª•àª¾àª²à«‡] LT",nextWeek:"dddd, LT",lastDay:"[àª—àª‡àª•àª¾àª²à«‡] LT",lastWeek:"[àªªàª¾àª›àª²àª¾] dddd, LT",sameElse:"L"},relativeTime:{future:"%s àª®àª¾",past:"%s àªªàª¹à«‡àª²àª¾",s:"àª…àª®à«àª• àªªàª³à«‹",ss:"%d àª¸à«‡àª•àª‚àª¡",m:"àªàª• àª®àª¿àª¨àª¿àªŸ",mm:"%d àª®àª¿àª¨àª¿àªŸ",h:"àªàª• àª•àª²àª¾àª•",hh:"%d àª•àª²àª¾àª•",d:"àªàª• àª¦àª¿àªµàª¸",dd:"%d àª¦àª¿àªµàª¸",M:"àªàª• àª®àª¹àª¿àª¨à«‹",MM:"%d àª®àª¹àª¿àª¨à«‹",y:"àªàª• àªµàª°à«àª·",yy:"%d àªµàª°à«àª·"},preparse:function(e){return e.replace(/[à«§à«¨à«©à«ªà««à«¬à«­à«®à«¯à«¦]/g,(function(e){return n[e]}))},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]}))},meridiemParse:/àª°àª¾àª¤|àª¬àªªà«‹àª°|àª¸àªµàª¾àª°|àª¸àª¾àª‚àªœ/,meridiemHour:function(e,t){return 12===e&&(e=0),"àª°àª¾àª¤"===t?e<4?e:e+12:"àª¸àªµàª¾àª°"===t?e:"àª¬àªªà«‹àª°"===t?e>=10?e:e+12:"àª¸àª¾àª‚àªœ"===t?e+12:void 0},meridiem:function(e,t,n){return e<4?"àª°àª¾àª¤":e<10?"àª¸àªµàª¾àª°":e<17?"àª¬àªªà«‹àª°":e<20?"àª¸àª¾àª‚àªœ":"àª°àª¾àª¤"},week:{dow:0,doy:6}})}(n(30381))},24206:function(e,t,n){!function(e){"use strict";e.defineLocale("he",{months:"×™× ×•××¨_×¤×‘×¨×•××¨_×ž×¨×¥_××¤×¨×™×œ_×ž××™_×™×•× ×™_×™×•×œ×™_××•×’×•×¡×˜_×¡×¤×˜×ž×‘×¨_××•×§×˜×•×‘×¨_× ×•×‘×ž×‘×¨_×“×¦×ž×‘×¨".split("_"),monthsShort:"×™× ×•×³_×¤×‘×¨×³_×ž×¨×¥_××¤×¨×³_×ž××™_×™×•× ×™_×™×•×œ×™_××•×’×³_×¡×¤×˜×³_××•×§×³_× ×•×‘×³_×“×¦×ž×³".split("_"),weekdays:"×¨××©×•×Ÿ_×©× ×™_×©×œ×™×©×™_×¨×‘×™×¢×™_×—×ž×™×©×™_×©×™×©×™_×©×‘×ª".split("_"),weekdaysShort:"××³_×‘×³_×’×³_×“×³_×”×³_×•×³_×©×³".split("_"),weekdaysMin:"×_×‘_×’_×“_×”_×•_×©".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D [×‘]MMMM YYYY",LLL:"D [×‘]MMMM YYYY HH:mm",LLLL:"dddd, D [×‘]MMMM YYYY HH:mm",l:"D/M/YYYY",ll:"D MMM YYYY",lll:"D MMM YYYY HH:mm",llll:"ddd, D MMM YYYY HH:mm"},calendar:{sameDay:"[×”×™×•× ×‘Ö¾]LT",nextDay:"[×ž×—×¨ ×‘Ö¾]LT",nextWeek:"dddd [×‘×©×¢×”] LT",lastDay:"[××ª×ž×•×œ ×‘Ö¾]LT",lastWeek:"[×‘×™×•×] dddd [×”××—×¨×•×Ÿ ×‘×©×¢×”] LT",sameElse:"L"},relativeTime:{future:"×‘×¢×•×“ %s",past:"×œ×¤× ×™ %s",s:"×ž×¡×¤×¨ ×©× ×™×•×ª",ss:"%d ×©× ×™×•×ª",m:"×“×§×”",mm:"%d ×“×§×•×ª",h:"×©×¢×”",hh:function(e){return 2===e?"×©×¢×ª×™×™×":e+" ×©×¢×•×ª"},d:"×™×•×",dd:function(e){return 2===e?"×™×•×ž×™×™×":e+" ×™×ž×™×"},M:"×—×•×“×©",MM:function(e){return 2===e?"×—×•×“×©×™×™×":e+" ×—×•×“×©×™×"},y:"×©× ×”",yy:function(e){return 2===e?"×©× ×ª×™×™×":e%10==0&&10!==e?e+" ×©× ×”":e+" ×©× ×™×"}},meridiemParse:/××—×”"×¦|×œ×¤× ×”"×¦|××—×¨×™ ×”×¦×”×¨×™×™×|×œ×¤× ×™ ×”×¦×”×¨×™×™×|×œ×¤× ×•×ª ×‘×•×§×¨|×‘×‘×•×§×¨|×‘×¢×¨×‘/i,isPM:function(e){return/^(××—×”"×¦|××—×¨×™ ×”×¦×”×¨×™×™×|×‘×¢×¨×‘)$/.test(e)},meridiem:function(e,t,n){return e<5?"×œ×¤× ×•×ª ×‘×•×§×¨":e<10?"×‘×‘×•×§×¨":e<12?n?'×œ×¤× ×”"×¦':"×œ×¤× ×™ ×”×¦×”×¨×™×™×":e<18?n?'××—×”"×¦':"××—×¨×™ ×”×¦×”×¨×™×™×":"×‘×¢×¨×‘"}})}(n(30381))},30094:function(e,t,n){!function(e){"use strict";var t={1:"à¥§",2:"à¥¨",3:"à¥©",4:"à¥ª",5:"à¥«",6:"à¥¬",7:"à¥­",8:"à¥®",9:"à¥¯",0:"à¥¦"},n={"à¥§":"1","à¥¨":"2","à¥©":"3","à¥ª":"4","à¥«":"5","à¥¬":"6","à¥­":"7","à¥®":"8","à¥¯":"9","à¥¦":"0"},r=[/^à¤œà¤¨/i,/^à¤«à¤¼à¤°|à¤«à¤°/i,/^à¤®à¤¾à¤°à¥à¤š/i,/^à¤…à¤ªà¥à¤°à¥ˆ/i,/^à¤®à¤ˆ/i,/^à¤œà¥‚à¤¨/i,/^à¤œà¥à¤²/i,/^à¤…à¤—/i,/^à¤¸à¤¿à¤¤à¤‚|à¤¸à¤¿à¤¤/i,/^à¤…à¤•à¥à¤Ÿà¥‚/i,/^à¤¨à¤µ|à¤¨à¤µà¤‚/i,/^à¤¦à¤¿à¤¸à¤‚|à¤¦à¤¿à¤¸/i];e.defineLocale("hi",{months:{format:"à¤œà¤¨à¤µà¤°à¥€_à¤«à¤¼à¤°à¤µà¤°à¥€_à¤®à¤¾à¤°à¥à¤š_à¤…à¤ªà¥à¤°à¥ˆà¤²_à¤®à¤ˆ_à¤œà¥‚à¤¨_à¤œà¥à¤²à¤¾à¤ˆ_à¤…à¤—à¤¸à¥à¤¤_à¤¸à¤¿à¤¤à¤®à¥à¤¬à¤°_à¤…à¤•à¥à¤Ÿà¥‚à¤¬à¤°_à¤¨à¤µà¤®à¥à¤¬à¤°_à¤¦à¤¿à¤¸à¤®à¥à¤¬à¤°".split("_"),standalone:"à¤œà¤¨à¤µà¤°à¥€_à¤«à¤°à¤µà¤°à¥€_à¤®à¤¾à¤°à¥à¤š_à¤…à¤ªà¥à¤°à¥ˆà¤²_à¤®à¤ˆ_à¤œà¥‚à¤¨_à¤œà¥à¤²à¤¾à¤ˆ_à¤…à¤—à¤¸à¥à¤¤_à¤¸à¤¿à¤¤à¤‚à¤¬à¤°_à¤…à¤•à¥à¤Ÿà¥‚à¤¬à¤°_à¤¨à¤µà¤‚à¤¬à¤°_à¤¦à¤¿à¤¸à¤‚à¤¬à¤°".split("_")},monthsShort:"à¤œà¤¨._à¤«à¤¼à¤°._à¤®à¤¾à¤°à¥à¤š_à¤…à¤ªà¥à¤°à¥ˆ._à¤®à¤ˆ_à¤œà¥‚à¤¨_à¤œà¥à¤²._à¤…à¤—._à¤¸à¤¿à¤¤._à¤…à¤•à¥à¤Ÿà¥‚._à¤¨à¤µ._à¤¦à¤¿à¤¸.".split("_"),weekdays:"à¤°à¤µà¤¿à¤µà¤¾à¤°_à¤¸à¥‹à¤®à¤µà¤¾à¤°_à¤®à¤‚à¤—à¤²à¤µà¤¾à¤°_à¤¬à¥à¤§à¤µà¤¾à¤°_à¤—à¥à¤°à¥‚à¤µà¤¾à¤°_à¤¶à¥à¤•à¥à¤°à¤µà¤¾à¤°_à¤¶à¤¨à¤¿à¤µà¤¾à¤°".split("_"),weekdaysShort:"à¤°à¤µà¤¿_à¤¸à¥‹à¤®_à¤®à¤‚à¤—à¤²_à¤¬à¥à¤§_à¤—à¥à¤°à¥‚_à¤¶à¥à¤•à¥à¤°_à¤¶à¤¨à¤¿".split("_"),weekdaysMin:"à¤°_à¤¸à¥‹_à¤®à¤‚_à¤¬à¥_à¤—à¥_à¤¶à¥_à¤¶".split("_"),longDateFormat:{LT:"A h:mm à¤¬à¤œà¥‡",LTS:"A h:mm:ss à¤¬à¤œà¥‡",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm à¤¬à¤œà¥‡",LLLL:"dddd, D MMMM YYYY, A h:mm à¤¬à¤œà¥‡"},monthsParse:r,longMonthsParse:r,shortMonthsParse:[/^à¤œà¤¨/i,/^à¤«à¤¼à¤°/i,/^à¤®à¤¾à¤°à¥à¤š/i,/^à¤…à¤ªà¥à¤°à¥ˆ/i,/^à¤®à¤ˆ/i,/^à¤œà¥‚à¤¨/i,/^à¤œà¥à¤²/i,/^à¤…à¤—/i,/^à¤¸à¤¿à¤¤/i,/^à¤…à¤•à¥à¤Ÿà¥‚/i,/^à¤¨à¤µ/i,/^à¤¦à¤¿à¤¸/i],monthsRegex:/^(à¤œà¤¨à¤µà¤°à¥€|à¤œà¤¨\.?|à¤«à¤¼à¤°à¤µà¤°à¥€|à¤«à¤°à¤µà¤°à¥€|à¤«à¤¼à¤°\.?|à¤®à¤¾à¤°à¥à¤š?|à¤…à¤ªà¥à¤°à¥ˆà¤²|à¤…à¤ªà¥à¤°à¥ˆ\.?|à¤®à¤ˆ?|à¤œà¥‚à¤¨?|à¤œà¥à¤²à¤¾à¤ˆ|à¤œà¥à¤²\.?|à¤…à¤—à¤¸à¥à¤¤|à¤…à¤—\.?|à¤¸à¤¿à¤¤à¤®à¥à¤¬à¤°|à¤¸à¤¿à¤¤à¤‚à¤¬à¤°|à¤¸à¤¿à¤¤\.?|à¤…à¤•à¥à¤Ÿà¥‚à¤¬à¤°|à¤…à¤•à¥à¤Ÿà¥‚\.?|à¤¨à¤µà¤®à¥à¤¬à¤°|à¤¨à¤µà¤‚à¤¬à¤°|à¤¨à¤µ\.?|à¤¦à¤¿à¤¸à¤®à¥à¤¬à¤°|à¤¦à¤¿à¤¸à¤‚à¤¬à¤°|à¤¦à¤¿à¤¸\.?)/i,monthsShortRegex:/^(à¤œà¤¨à¤µà¤°à¥€|à¤œà¤¨\.?|à¤«à¤¼à¤°à¤µà¤°à¥€|à¤«à¤°à¤µà¤°à¥€|à¤«à¤¼à¤°\.?|à¤®à¤¾à¤°à¥à¤š?|à¤…à¤ªà¥à¤°à¥ˆà¤²|à¤…à¤ªà¥à¤°à¥ˆ\.?|à¤®à¤ˆ?|à¤œà¥‚à¤¨?|à¤œà¥à¤²à¤¾à¤ˆ|à¤œà¥à¤²\.?|à¤…à¤—à¤¸à¥à¤¤|à¤…à¤—\.?|à¤¸à¤¿à¤¤à¤®à¥à¤¬à¤°|à¤¸à¤¿à¤¤à¤‚à¤¬à¤°|à¤¸à¤¿à¤¤\.?|à¤…à¤•à¥à¤Ÿà¥‚à¤¬à¤°|à¤…à¤•à¥à¤Ÿà¥‚\.?|à¤¨à¤µà¤®à¥à¤¬à¤°|à¤¨à¤µà¤‚à¤¬à¤°|à¤¨à¤µ\.?|à¤¦à¤¿à¤¸à¤®à¥à¤¬à¤°|à¤¦à¤¿à¤¸à¤‚à¤¬à¤°|à¤¦à¤¿à¤¸\.?)/i,monthsStrictRegex:/^(à¤œà¤¨à¤µà¤°à¥€?|à¤«à¤¼à¤°à¤µà¤°à¥€|à¤«à¤°à¤µà¤°à¥€?|à¤®à¤¾à¤°à¥à¤š?|à¤…à¤ªà¥à¤°à¥ˆà¤²?|à¤®à¤ˆ?|à¤œà¥‚à¤¨?|à¤œà¥à¤²à¤¾à¤ˆ?|à¤…à¤—à¤¸à¥à¤¤?|à¤¸à¤¿à¤¤à¤®à¥à¤¬à¤°|à¤¸à¤¿à¤¤à¤‚à¤¬à¤°|à¤¸à¤¿à¤¤?\.?|à¤…à¤•à¥à¤Ÿà¥‚à¤¬à¤°|à¤…à¤•à¥à¤Ÿà¥‚\.?|à¤¨à¤µà¤®à¥à¤¬à¤°|à¤¨à¤µà¤‚à¤¬à¤°?|à¤¦à¤¿à¤¸à¤®à¥à¤¬à¤°|à¤¦à¤¿à¤¸à¤‚à¤¬à¤°?)/i,monthsShortStrictRegex:/^(à¤œà¤¨\.?|à¤«à¤¼à¤°\.?|à¤®à¤¾à¤°à¥à¤š?|à¤…à¤ªà¥à¤°à¥ˆ\.?|à¤®à¤ˆ?|à¤œà¥‚à¤¨?|à¤œà¥à¤²\.?|à¤…à¤—\.?|à¤¸à¤¿à¤¤\.?|à¤…à¤•à¥à¤Ÿà¥‚\.?|à¤¨à¤µ\.?|à¤¦à¤¿à¤¸\.?)/i,calendar:{sameDay:"[à¤†à¤œ] LT",nextDay:"[à¤•à¤²] LT",nextWeek:"dddd, LT",lastDay:"[à¤•à¤²] LT",lastWeek:"[à¤ªà¤¿à¤›à¤²à¥‡] dddd, LT",sameElse:"L"},relativeTime:{future:"%s à¤®à¥‡à¤‚",past:"%s à¤ªà¤¹à¤²à¥‡",s:"à¤•à¥à¤› à¤¹à¥€ à¤•à¥à¤·à¤£",ss:"%d à¤¸à¥‡à¤•à¤‚à¤¡",m:"à¤à¤• à¤®à¤¿à¤¨à¤Ÿ",mm:"%d à¤®à¤¿à¤¨à¤Ÿ",h:"à¤à¤• à¤˜à¤‚à¤Ÿà¤¾",hh:"%d à¤˜à¤‚à¤Ÿà¥‡",d:"à¤à¤• à¤¦à¤¿à¤¨",dd:"%d à¤¦à¤¿à¤¨",M:"à¤à¤• à¤®à¤¹à¥€à¤¨à¥‡",MM:"%d à¤®à¤¹à¥€à¤¨à¥‡",y:"à¤à¤• à¤µà¤°à¥à¤·",yy:"%d à¤µà¤°à¥à¤·"},preparse:function(e){return e.replace(/[à¥§à¥¨à¥©à¥ªà¥«à¥¬à¥­à¥®à¥¯à¥¦]/g,(function(e){return n[e]}))},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]}))},meridiemParse:/à¤°à¤¾à¤¤|à¤¸à¥à¤¬à¤¹|à¤¦à¥‹à¤ªà¤¹à¤°|à¤¶à¤¾à¤®/,meridiemHour:function(e,t){return 12===e&&(e=0),"à¤°à¤¾à¤¤"===t?e<4?e:e+12:"à¤¸à¥à¤¬à¤¹"===t?e:"à¤¦à¥‹à¤ªà¤¹à¤°"===t?e>=10?e:e+12:"à¤¶à¤¾à¤®"===t?e+12:void 0},meridiem:function(e,t,n){return e<4?"à¤°à¤¾à¤¤":e<10?"à¤¸à¥à¤¬à¤¹":e<17?"à¤¦à¥‹à¤ªà¤¹à¤°":e<20?"à¤¶à¤¾à¤®":"à¤°à¤¾à¤¤"},week:{dow:0,doy:6}})}(n(30381))},30316:function(e,t,n){!function(e){"use strict";function t(e,t,n){var r=e+" ";switch(n){case"ss":return r+(1===e?"sekunda":2===e||3===e||4===e?"sekunde":"sekundi");case"m":return t?"jedna minuta":"jedne minute";case"mm":return r+(1===e?"minuta":2===e||3===e||4===e?"minute":"minuta");case"h":return t?"jedan sat":"jednog sata";case"hh":return r+(1===e?"sat":2===e||3===e||4===e?"sata":"sati");case"dd":return r+(1===e?"dan":"dana");case"MM":return r+(1===e?"mjesec":2===e||3===e||4===e?"mjeseca":"mjeseci");case"yy":return r+(1===e?"godina":2===e||3===e||4===e?"godine":"godina")}}e.defineLocale("hr",{months:{format:"sijeÄnja_veljaÄe_oÅ¾ujka_travnja_svibnja_lipnja_srpnja_kolovoza_rujna_listopada_studenoga_prosinca".split("_"),standalone:"sijeÄanj_veljaÄa_oÅ¾ujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac".split("_")},monthsShort:"sij._velj._oÅ¾u._tra._svi._lip._srp._kol._ruj._lis._stu._pro.".split("_"),monthsParseExact:!0,weekdays:"nedjelja_ponedjeljak_utorak_srijeda_Äetvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sri._Äet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_Äe_pe_su".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"Do MMMM YYYY",LLL:"Do MMMM YYYY H:mm",LLLL:"dddd, Do MMMM YYYY H:mm"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[juÄer u] LT",lastWeek:function(){switch(this.day()){case 0:return"[proÅ¡lu] [nedjelju] [u] LT";case 3:return"[proÅ¡lu] [srijedu] [u] LT";case 6:return"[proÅ¡le] [subote] [u] LT";case 1:case 2:case 4:case 5:return"[proÅ¡li] dddd [u] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"par sekundi",ss:t,m:t,mm:t,h:t,hh:t,d:"dan",dd:t,M:"mjesec",MM:t,y:"godinu",yy:t},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}})}(n(30381))},22138:function(e,t,n){!function(e){"use strict";var t="vasÃ¡rnap hÃ©tfÅ‘n kedden szerdÃ¡n csÃ¼tÃ¶rtÃ¶kÃ¶n pÃ©nteken szombaton".split(" ");function n(e,t,n,r){var a=e;switch(n){case"s":return r||t?"nÃ©hÃ¡ny mÃ¡sodperc":"nÃ©hÃ¡ny mÃ¡sodperce";case"ss":return a+(r||t)?" mÃ¡sodperc":" mÃ¡sodperce";case"m":return"egy"+(r||t?" perc":" perce");case"mm":return a+(r||t?" perc":" perce");case"h":return"egy"+(r||t?" Ã³ra":" Ã³rÃ¡ja");case"hh":return a+(r||t?" Ã³ra":" Ã³rÃ¡ja");case"d":return"egy"+(r||t?" nap":" napja");case"dd":return a+(r||t?" nap":" napja");case"M":return"egy"+(r||t?" hÃ³nap":" hÃ³napja");case"MM":return a+(r||t?" hÃ³nap":" hÃ³napja");case"y":return"egy"+(r||t?" Ã©v":" Ã©ve");case"yy":return a+(r||t?" Ã©v":" Ã©ve")}return""}function r(e){return(e?"":"[mÃºlt] ")+"["+t[this.day()]+"] LT[-kor]"}e.defineLocale("hu",{months:"januÃ¡r_februÃ¡r_mÃ¡rcius_Ã¡prilis_mÃ¡jus_jÃºnius_jÃºlius_augusztus_szeptember_oktÃ³ber_november_december".split("_"),monthsShort:"jan._feb._mÃ¡rc._Ã¡pr._mÃ¡j._jÃºn._jÃºl._aug._szept._okt._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"vasÃ¡rnap_hÃ©tfÅ‘_kedd_szerda_csÃ¼tÃ¶rtÃ¶k_pÃ©ntek_szombat".split("_"),weekdaysShort:"vas_hÃ©t_kedd_sze_csÃ¼t_pÃ©n_szo".split("_"),weekdaysMin:"v_h_k_sze_cs_p_szo".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"YYYY.MM.DD.",LL:"YYYY. MMMM D.",LLL:"YYYY. MMMM D. H:mm",LLLL:"YYYY. MMMM D., dddd H:mm"},meridiemParse:/de|du/i,isPM:function(e){return"u"===e.charAt(1).toLowerCase()},meridiem:function(e,t,n){return e<12?!0===n?"de":"DE":!0===n?"du":"DU"},calendar:{sameDay:"[ma] LT[-kor]",nextDay:"[holnap] LT[-kor]",nextWeek:function(){return r.call(this,!0)},lastDay:"[tegnap] LT[-kor]",lastWeek:function(){return r.call(this,!1)},sameElse:"L"},relativeTime:{future:"%s mÃºlva",past:"%s",s:n,ss:n,m:n,mm:n,h:n,hh:n,d:n,dd:n,M:n,MM:n,y:n,yy:n},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}(n(30381))},11423:function(e,t,n){!function(e){"use strict";e.defineLocale("hy-am",{months:{format:"Õ°Õ¸Ö‚Õ¶Õ¾Õ¡Ö€Õ«_ÖƒÕ¥Õ¿Ö€Õ¾Õ¡Ö€Õ«_Õ´Õ¡Ö€Õ¿Õ«_Õ¡ÕºÖ€Õ«Õ¬Õ«_Õ´Õ¡ÕµÕ«Õ½Õ«_Õ°Õ¸Ö‚Õ¶Õ«Õ½Õ«_Õ°Õ¸Ö‚Õ¬Õ«Õ½Õ«_Ö…Õ£Õ¸Õ½Õ¿Õ¸Õ½Õ«_Õ½Õ¥ÕºÕ¿Õ¥Õ´Õ¢Õ¥Ö€Õ«_Õ°Õ¸Õ¯Õ¿Õ¥Õ´Õ¢Õ¥Ö€Õ«_Õ¶Õ¸ÕµÕ¥Õ´Õ¢Õ¥Ö€Õ«_Õ¤Õ¥Õ¯Õ¿Õ¥Õ´Õ¢Õ¥Ö€Õ«".split("_"),standalone:"Õ°Õ¸Ö‚Õ¶Õ¾Õ¡Ö€_ÖƒÕ¥Õ¿Ö€Õ¾Õ¡Ö€_Õ´Õ¡Ö€Õ¿_Õ¡ÕºÖ€Õ«Õ¬_Õ´Õ¡ÕµÕ«Õ½_Õ°Õ¸Ö‚Õ¶Õ«Õ½_Õ°Õ¸Ö‚Õ¬Õ«Õ½_Ö…Õ£Õ¸Õ½Õ¿Õ¸Õ½_Õ½Õ¥ÕºÕ¿Õ¥Õ´Õ¢Õ¥Ö€_Õ°Õ¸Õ¯Õ¿Õ¥Õ´Õ¢Õ¥Ö€_Õ¶Õ¸ÕµÕ¥Õ´Õ¢Õ¥Ö€_Õ¤Õ¥Õ¯Õ¿Õ¥Õ´Õ¢Õ¥Ö€".split("_")},monthsShort:"Õ°Õ¶Õ¾_ÖƒÕ¿Ö€_Õ´Ö€Õ¿_Õ¡ÕºÖ€_Õ´ÕµÕ½_Õ°Õ¶Õ½_Õ°Õ¬Õ½_Ö…Õ£Õ½_Õ½ÕºÕ¿_Õ°Õ¯Õ¿_Õ¶Õ´Õ¢_Õ¤Õ¯Õ¿".split("_"),weekdays:"Õ¯Õ«Ö€Õ¡Õ¯Õ«_Õ¥Ö€Õ¯Õ¸Ö‚Õ·Õ¡Õ¢Õ©Õ«_Õ¥Ö€Õ¥Ö„Õ·Õ¡Õ¢Õ©Õ«_Õ¹Õ¸Ö€Õ¥Ö„Õ·Õ¡Õ¢Õ©Õ«_Õ°Õ«Õ¶Õ£Õ·Õ¡Õ¢Õ©Õ«_Õ¸Ö‚Ö€Õ¢Õ¡Õ©_Õ·Õ¡Õ¢Õ¡Õ©".split("_"),weekdaysShort:"Õ¯Ö€Õ¯_Õ¥Ö€Õ¯_Õ¥Ö€Ö„_Õ¹Ö€Ö„_Õ°Õ¶Õ£_Õ¸Ö‚Ö€Õ¢_Õ·Õ¢Õ©".split("_"),weekdaysMin:"Õ¯Ö€Õ¯_Õ¥Ö€Õ¯_Õ¥Ö€Ö„_Õ¹Ö€Ö„_Õ°Õ¶Õ£_Õ¸Ö‚Ö€Õ¢_Õ·Õ¢Õ©".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY Õ©.",LLL:"D MMMM YYYY Õ©., HH:mm",LLLL:"dddd, D MMMM YYYY Õ©., HH:mm"},calendar:{sameDay:"[Õ¡ÕµÕ½Ö…Ö€] LT",nextDay:"[Õ¾Õ¡Õ²Õ¨] LT",lastDay:"[Õ¥Ö€Õ¥Õ¯] LT",nextWeek:function(){return"dddd [Ö…Ö€Õ¨ ÕªÕ¡Õ´Õ¨] LT"},lastWeek:function(){return"[Õ¡Õ¶ÖÕ¡Õ®] dddd [Ö…Ö€Õ¨ ÕªÕ¡Õ´Õ¨] LT"},sameElse:"L"},relativeTime:{future:"%s Õ°Õ¥Õ¿Õ¸",past:"%s Õ¡Õ¼Õ¡Õ»",s:"Õ´Õ« Ö„Õ¡Õ¶Õ« Õ¾Õ¡ÕµÖ€Õ¯ÕµÕ¡Õ¶",ss:"%d Õ¾Õ¡ÕµÖ€Õ¯ÕµÕ¡Õ¶",m:"Ö€Õ¸ÕºÕ¥",mm:"%d Ö€Õ¸ÕºÕ¥",h:"ÕªÕ¡Õ´",hh:"%d ÕªÕ¡Õ´",d:"Ö…Ö€",dd:"%d Ö…Ö€",M:"Õ¡Õ´Õ«Õ½",MM:"%d Õ¡Õ´Õ«Õ½",y:"Õ¿Õ¡Ö€Õ«",yy:"%d Õ¿Õ¡Ö€Õ«"},meridiemParse:/Õ£Õ«Õ·Õ¥Ö€Õ¾Õ¡|Õ¡Õ¼Õ¡Õ¾Õ¸Õ¿Õ¾Õ¡|ÖÕ¥Ö€Õ¥Õ¯Õ¾Õ¡|Õ¥Ö€Õ¥Õ¯Õ¸ÕµÕ¡Õ¶/,isPM:function(e){return/^(ÖÕ¥Ö€Õ¥Õ¯Õ¾Õ¡|Õ¥Ö€Õ¥Õ¯Õ¸ÕµÕ¡Õ¶)$/.test(e)},meridiem:function(e){return e<4?"Õ£Õ«Õ·Õ¥Ö€Õ¾Õ¡":e<12?"Õ¡Õ¼Õ¡Õ¾Õ¸Õ¿Õ¾Õ¡":e<17?"ÖÕ¥Ö€Õ¥Õ¯Õ¾Õ¡":"Õ¥Ö€Õ¥Õ¯Õ¸ÕµÕ¡Õ¶"},dayOfMonthOrdinalParse:/\d{1,2}|\d{1,2}-(Õ«Õ¶|Ö€Õ¤)/,ordinal:function(e,t){switch(t){case"DDD":case"w":case"W":case"DDDo":return 1===e?e+"-Õ«Õ¶":e+"-Ö€Õ¤";default:return e}},week:{dow:1,doy:7}})}(n(30381))},29218:function(e,t,n){!function(e){"use strict";e.defineLocale("id",{months:"Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember".split("_"),monthsShort:"Jan_Feb_Mar_Apr_Mei_Jun_Jul_Agt_Sep_Okt_Nov_Des".split("_"),weekdays:"Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu".split("_"),weekdaysShort:"Min_Sen_Sel_Rab_Kam_Jum_Sab".split("_"),weekdaysMin:"Mg_Sn_Sl_Rb_Km_Jm_Sb".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] HH.mm",LLLL:"dddd, D MMMM YYYY [pukul] HH.mm"},meridiemParse:/pagi|siang|sore|malam/,meridiemHour:function(e,t){return 12===e&&(e=0),"pagi"===t?e:"siang"===t?e>=11?e:e+12:"sore"===t||"malam"===t?e+12:void 0},meridiem:function(e,t,n){return e<11?"pagi":e<15?"siang":e<19?"sore":"malam"},calendar:{sameDay:"[Hari ini pukul] LT",nextDay:"[Besok pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kemarin pukul] LT",lastWeek:"dddd [lalu pukul] LT",sameElse:"L"},relativeTime:{future:"dalam %s",past:"%s yang lalu",s:"beberapa detik",ss:"%d detik",m:"semenit",mm:"%d menit",h:"sejam",hh:"%d jam",d:"sehari",dd:"%d hari",M:"sebulan",MM:"%d bulan",y:"setahun",yy:"%d tahun"},week:{dow:0,doy:6}})}(n(30381))},90135:function(e,t,n){!function(e){"use strict";function t(e){return e%100==11||e%10!=1}function n(e,n,r,a){var s=e+" ";switch(r){case"s":return n||a?"nokkrar sekÃºndur":"nokkrum sekÃºndum";case"ss":return t(e)?s+(n||a?"sekÃºndur":"sekÃºndum"):s+"sekÃºnda";case"m":return n?"mÃ­nÃºta":"mÃ­nÃºtu";case"mm":return t(e)?s+(n||a?"mÃ­nÃºtur":"mÃ­nÃºtum"):n?s+"mÃ­nÃºta":s+"mÃ­nÃºtu";case"hh":return t(e)?s+(n||a?"klukkustundir":"klukkustundum"):s+"klukkustund";case"d":return n?"dagur":a?"dag":"degi";case"dd":return t(e)?n?s+"dagar":s+(a?"daga":"dÃ¶gum"):n?s+"dagur":s+(a?"dag":"degi");case"M":return n?"mÃ¡nuÃ°ur":a?"mÃ¡nuÃ°":"mÃ¡nuÃ°i";case"MM":return t(e)?n?s+"mÃ¡nuÃ°ir":s+(a?"mÃ¡nuÃ°i":"mÃ¡nuÃ°um"):n?s+"mÃ¡nuÃ°ur":s+(a?"mÃ¡nuÃ°":"mÃ¡nuÃ°i");case"y":return n||a?"Ã¡r":"Ã¡ri";case"yy":return t(e)?s+(n||a?"Ã¡r":"Ã¡rum"):s+(n||a?"Ã¡r":"Ã¡ri")}}e.defineLocale("is",{months:"janÃºar_febrÃºar_mars_aprÃ­l_maÃ­_jÃºnÃ­_jÃºlÃ­_Ã¡gÃºst_september_oktÃ³ber_nÃ³vember_desember".split("_"),monthsShort:"jan_feb_mar_apr_maÃ­_jÃºn_jÃºl_Ã¡gÃº_sep_okt_nÃ³v_des".split("_"),weekdays:"sunnudagur_mÃ¡nudagur_Ã¾riÃ°judagur_miÃ°vikudagur_fimmtudagur_fÃ¶studagur_laugardagur".split("_"),weekdaysShort:"sun_mÃ¡n_Ã¾ri_miÃ°_fim_fÃ¶s_lau".split("_"),weekdaysMin:"Su_MÃ¡_Ãžr_Mi_Fi_FÃ¶_La".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY [kl.] H:mm",LLLL:"dddd, D. MMMM YYYY [kl.] H:mm"},calendar:{sameDay:"[Ã­ dag kl.] LT",nextDay:"[Ã¡ morgun kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[Ã­ gÃ¦r kl.] LT",lastWeek:"[sÃ­Ã°asta] dddd [kl.] LT",sameElse:"L"},relativeTime:{future:"eftir %s",past:"fyrir %s sÃ­Ã°an",s:n,ss:n,m:n,mm:n,h:"klukkustund",hh:n,d:n,dd:n,M:n,MM:n,y:n,yy:n},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}(n(30381))},10150:function(e,t,n){!function(e){"use strict";e.defineLocale("it-ch",{months:"gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre".split("_"),monthsShort:"gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic".split("_"),weekdays:"domenica_lunedÃ¬_martedÃ¬_mercoledÃ¬_giovedÃ¬_venerdÃ¬_sabato".split("_"),weekdaysShort:"dom_lun_mar_mer_gio_ven_sab".split("_"),weekdaysMin:"do_lu_ma_me_gi_ve_sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Oggi alle] LT",nextDay:"[Domani alle] LT",nextWeek:"dddd [alle] LT",lastDay:"[Ieri alle] LT",lastWeek:function(){return 0===this.day()?"[la scorsa] dddd [alle] LT":"[lo scorso] dddd [alle] LT"},sameElse:"L"},relativeTime:{future:function(e){return(/^[0-9].+$/.test(e)?"tra":"in")+" "+e},past:"%s fa",s:"alcuni secondi",ss:"%d secondi",m:"un minuto",mm:"%d minuti",h:"un'ora",hh:"%d ore",d:"un giorno",dd:"%d giorni",M:"un mese",MM:"%d mesi",y:"un anno",yy:"%d anni"},dayOfMonthOrdinalParse:/\d{1,2}Âº/,ordinal:"%dÂº",week:{dow:1,doy:4}})}(n(30381))},90626:function(e,t,n){!function(e){"use strict";e.defineLocale("it",{months:"gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre".split("_"),monthsShort:"gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic".split("_"),weekdays:"domenica_lunedÃ¬_martedÃ¬_mercoledÃ¬_giovedÃ¬_venerdÃ¬_sabato".split("_"),weekdaysShort:"dom_lun_mar_mer_gio_ven_sab".split("_"),weekdaysMin:"do_lu_ma_me_gi_ve_sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:function(){return"[Oggi a"+(this.hours()>1?"lle ":0===this.hours()?" ":"ll'")+"]LT"},nextDay:function(){return"[Domani a"+(this.hours()>1?"lle ":0===this.hours()?" ":"ll'")+"]LT"},nextWeek:function(){return"dddd [a"+(this.hours()>1?"lle ":0===this.hours()?" ":"ll'")+"]LT"},lastDay:function(){return"[Ieri a"+(this.hours()>1?"lle ":0===this.hours()?" ":"ll'")+"]LT"},lastWeek:function(){return 0===this.day()?"[La scorsa] dddd [a"+(this.hours()>1?"lle ":0===this.hours()?" ":"ll'")+"]LT":"[Lo scorso] dddd [a"+(this.hours()>1?"lle ":0===this.hours()?" ":"ll'")+"]LT"},sameElse:"L"},relativeTime:{future:"tra %s",past:"%s fa",s:"alcuni secondi",ss:"%d secondi",m:"un minuto",mm:"%d minuti",h:"un'ora",hh:"%d ore",d:"un giorno",dd:"%d giorni",w:"una settimana",ww:"%d settimane",M:"un mese",MM:"%d mesi",y:"un anno",yy:"%d anni"},dayOfMonthOrdinalParse:/\d{1,2}Âº/,ordinal:"%dÂº",week:{dow:1,doy:4}})}(n(30381))},39183:function(e,t,n){!function(e){"use strict";e.defineLocale("ja",{eras:[{since:"2019-05-01",offset:1,name:"ä»¤å’Œ",narrow:"ã‹¿",abbr:"R"},{since:"1989-01-08",until:"2019-04-30",offset:1,name:"å¹³æˆ",narrow:"ã»",abbr:"H"},{since:"1926-12-25",until:"1989-01-07",offset:1,name:"æ˜­å’Œ",narrow:"ã¼",abbr:"S"},{since:"1912-07-30",until:"1926-12-24",offset:1,name:"å¤§æ­£",narrow:"ã½",abbr:"T"},{since:"1873-01-01",until:"1912-07-29",offset:6,name:"æ˜Žæ²»",narrow:"ã¾",abbr:"M"},{since:"0001-01-01",until:"1873-12-31",offset:1,name:"è¥¿æš¦",narrow:"AD",abbr:"AD"},{since:"0000-12-31",until:-1/0,offset:1,name:"ç´€å…ƒå‰",narrow:"BC",abbr:"BC"}],eraYearOrdinalRegex:/(å…ƒ|\d+)å¹´/,eraYearOrdinalParse:function(e,t){return"å…ƒ"===t[1]?1:parseInt(t[1]||e,10)},months:"1æœˆ_2æœˆ_3æœˆ_4æœˆ_5æœˆ_6æœˆ_7æœˆ_8æœˆ_9æœˆ_10æœˆ_11æœˆ_12æœˆ".split("_"),monthsShort:"1æœˆ_2æœˆ_3æœˆ_4æœˆ_5æœˆ_6æœˆ_7æœˆ_8æœˆ_9æœˆ_10æœˆ_11æœˆ_12æœˆ".split("_"),weekdays:"æ—¥æ›œæ—¥_æœˆæ›œæ—¥_ç«æ›œæ—¥_æ°´æ›œæ—¥_æœ¨æ›œæ—¥_é‡‘æ›œæ—¥_åœŸæ›œæ—¥".split("_"),weekdaysShort:"æ—¥_æœˆ_ç«_æ°´_æœ¨_é‡‘_åœŸ".split("_"),weekdaysMin:"æ—¥_æœˆ_ç«_æ°´_æœ¨_é‡‘_åœŸ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY/MM/DD",LL:"YYYYå¹´MæœˆDæ—¥",LLL:"YYYYå¹´MæœˆDæ—¥ HH:mm",LLLL:"YYYYå¹´MæœˆDæ—¥ dddd HH:mm",l:"YYYY/MM/DD",ll:"YYYYå¹´MæœˆDæ—¥",lll:"YYYYå¹´MæœˆDæ—¥ HH:mm",llll:"YYYYå¹´MæœˆDæ—¥(ddd) HH:mm"},meridiemParse:/åˆå‰|åˆå¾Œ/i,isPM:function(e){return"åˆå¾Œ"===e},meridiem:function(e,t,n){return e<12?"åˆå‰":"åˆå¾Œ"},calendar:{sameDay:"[ä»Šæ—¥] LT",nextDay:"[æ˜Žæ—¥] LT",nextWeek:function(e){return e.week()!==this.week()?"[æ¥é€±]dddd LT":"dddd LT"},lastDay:"[æ˜¨æ—¥] LT",lastWeek:function(e){return this.week()!==e.week()?"[å…ˆé€±]dddd LT":"dddd LT"},sameElse:"L"},dayOfMonthOrdinalParse:/\d{1,2}æ—¥/,ordinal:function(e,t){switch(t){case"y":return 1===e?"å…ƒå¹´":e+"å¹´";case"d":case"D":case"DDD":return e+"æ—¥";default:return e}},relativeTime:{future:"%så¾Œ",past:"%så‰",s:"æ•°ç§’",ss:"%dç§’",m:"1åˆ†",mm:"%dåˆ†",h:"1æ™‚é–“",hh:"%dæ™‚é–“",d:"1æ—¥",dd:"%dæ—¥",M:"1ãƒ¶æœˆ",MM:"%dãƒ¶æœˆ",y:"1å¹´",yy:"%då¹´"}})}(n(30381))},24286:function(e,t,n){!function(e){"use strict";e.defineLocale("jv",{months:"Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_Nopember_Desember".split("_"),monthsShort:"Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nop_Des".split("_"),weekdays:"Minggu_Senen_Seloso_Rebu_Kemis_Jemuwah_Septu".split("_"),weekdaysShort:"Min_Sen_Sel_Reb_Kem_Jem_Sep".split("_"),weekdaysMin:"Mg_Sn_Sl_Rb_Km_Jm_Sp".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] HH.mm",LLLL:"dddd, D MMMM YYYY [pukul] HH.mm"},meridiemParse:/enjing|siyang|sonten|ndalu/,meridiemHour:function(e,t){return 12===e&&(e=0),"enjing"===t?e:"siyang"===t?e>=11?e:e+12:"sonten"===t||"ndalu"===t?e+12:void 0},meridiem:function(e,t,n){return e<11?"enjing":e<15?"siyang":e<19?"sonten":"ndalu"},calendar:{sameDay:"[Dinten puniko pukul] LT",nextDay:"[Mbenjang pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kala wingi pukul] LT",lastWeek:"dddd [kepengker pukul] LT",sameElse:"L"},relativeTime:{future:"wonten ing %s",past:"%s ingkang kepengker",s:"sawetawis detik",ss:"%d detik",m:"setunggal menit",mm:"%d menit",h:"setunggal jam",hh:"%d jam",d:"sedinten",dd:"%d dinten",M:"sewulan",MM:"%d wulan",y:"setaun",yy:"%d taun"},week:{dow:1,doy:7}})}(n(30381))},12105:function(e,t,n){!function(e){"use strict";e.defineLocale("ka",{months:"áƒ˜áƒáƒœáƒ•áƒáƒ áƒ˜_áƒ—áƒ”áƒ‘áƒ”áƒ áƒ•áƒáƒšáƒ˜_áƒ›áƒáƒ áƒ¢áƒ˜_áƒáƒžáƒ áƒ˜áƒšáƒ˜_áƒ›áƒáƒ˜áƒ¡áƒ˜_áƒ˜áƒ•áƒœáƒ˜áƒ¡áƒ˜_áƒ˜áƒ•áƒšáƒ˜áƒ¡áƒ˜_áƒáƒ’áƒ•áƒ˜áƒ¡áƒ¢áƒ_áƒ¡áƒ”áƒ¥áƒ¢áƒ”áƒ›áƒ‘áƒ”áƒ áƒ˜_áƒáƒ¥áƒ¢áƒáƒ›áƒ‘áƒ”áƒ áƒ˜_áƒœáƒáƒ”áƒ›áƒ‘áƒ”áƒ áƒ˜_áƒ“áƒ”áƒ™áƒ”áƒ›áƒ‘áƒ”áƒ áƒ˜".split("_"),monthsShort:"áƒ˜áƒáƒœ_áƒ—áƒ”áƒ‘_áƒ›áƒáƒ _áƒáƒžáƒ _áƒ›áƒáƒ˜_áƒ˜áƒ•áƒœ_áƒ˜áƒ•áƒš_áƒáƒ’áƒ•_áƒ¡áƒ”áƒ¥_áƒáƒ¥áƒ¢_áƒœáƒáƒ”_áƒ“áƒ”áƒ™".split("_"),weekdays:{standalone:"áƒ™áƒ•áƒ˜áƒ áƒ_áƒáƒ áƒ¨áƒáƒ‘áƒáƒ—áƒ˜_áƒ¡áƒáƒ›áƒ¨áƒáƒ‘áƒáƒ—áƒ˜_áƒáƒ—áƒ®áƒ¨áƒáƒ‘áƒáƒ—áƒ˜_áƒ®áƒ£áƒ—áƒ¨áƒáƒ‘áƒáƒ—áƒ˜_áƒžáƒáƒ áƒáƒ¡áƒ™áƒ”áƒ•áƒ˜_áƒ¨áƒáƒ‘áƒáƒ—áƒ˜".split("_"),format:"áƒ™áƒ•áƒ˜áƒ áƒáƒ¡_áƒáƒ áƒ¨áƒáƒ‘áƒáƒ—áƒ¡_áƒ¡áƒáƒ›áƒ¨áƒáƒ‘áƒáƒ—áƒ¡_áƒáƒ—áƒ®áƒ¨áƒáƒ‘áƒáƒ—áƒ¡_áƒ®áƒ£áƒ—áƒ¨áƒáƒ‘áƒáƒ—áƒ¡_áƒžáƒáƒ áƒáƒ¡áƒ™áƒ”áƒ•áƒ¡_áƒ¨áƒáƒ‘áƒáƒ—áƒ¡".split("_"),isFormat:/(áƒ¬áƒ˜áƒœáƒ|áƒ¨áƒ”áƒ›áƒ“áƒ”áƒ’)/},weekdaysShort:"áƒ™áƒ•áƒ˜_áƒáƒ áƒ¨_áƒ¡áƒáƒ›_áƒáƒ—áƒ®_áƒ®áƒ£áƒ—_áƒžáƒáƒ _áƒ¨áƒáƒ‘".split("_"),weekdaysMin:"áƒ™áƒ•_áƒáƒ _áƒ¡áƒ_áƒáƒ—_áƒ®áƒ£_áƒžáƒ_áƒ¨áƒ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[áƒ“áƒ¦áƒ”áƒ¡] LT[-áƒ–áƒ”]",nextDay:"[áƒ®áƒ•áƒáƒš] LT[-áƒ–áƒ”]",lastDay:"[áƒ’áƒ£áƒ¨áƒ˜áƒœ] LT[-áƒ–áƒ”]",nextWeek:"[áƒ¨áƒ”áƒ›áƒ“áƒ”áƒ’] dddd LT[-áƒ–áƒ”]",lastWeek:"[áƒ¬áƒ˜áƒœáƒ] dddd LT-áƒ–áƒ”",sameElse:"L"},relativeTime:{future:function(e){return e.replace(/(áƒ¬áƒáƒ›|áƒ¬áƒ£áƒ—|áƒ¡áƒáƒáƒ—|áƒ¬áƒ”áƒš|áƒ“áƒ¦|áƒ—áƒ•)(áƒ˜|áƒ”)/,(function(e,t,n){return"áƒ˜"===n?t+"áƒ¨áƒ˜":t+n+"áƒ¨áƒ˜"}))},past:function(e){return/(áƒ¬áƒáƒ›áƒ˜|áƒ¬áƒ£áƒ—áƒ˜|áƒ¡áƒáƒáƒ—áƒ˜|áƒ“áƒ¦áƒ”|áƒ—áƒ•áƒ”)/.test(e)?e.replace(/(áƒ˜|áƒ”)$/,"áƒ˜áƒ¡ áƒ¬áƒ˜áƒœ"):/áƒ¬áƒ”áƒšáƒ˜/.test(e)?e.replace(/áƒ¬áƒ”áƒšáƒ˜$/,"áƒ¬áƒšáƒ˜áƒ¡ áƒ¬áƒ˜áƒœ"):e},s:"áƒ áƒáƒ›áƒ“áƒ”áƒœáƒ˜áƒ›áƒ” áƒ¬áƒáƒ›áƒ˜",ss:"%d áƒ¬áƒáƒ›áƒ˜",m:"áƒ¬áƒ£áƒ—áƒ˜",mm:"%d áƒ¬áƒ£áƒ—áƒ˜",h:"áƒ¡áƒáƒáƒ—áƒ˜",hh:"%d áƒ¡áƒáƒáƒ—áƒ˜",d:"áƒ“áƒ¦áƒ”",dd:"%d áƒ“áƒ¦áƒ”",M:"áƒ—áƒ•áƒ”",MM:"%d áƒ—áƒ•áƒ”",y:"áƒ¬áƒ”áƒšáƒ˜",yy:"%d áƒ¬áƒ”áƒšáƒ˜"},dayOfMonthOrdinalParse:/0|1-áƒšáƒ˜|áƒ›áƒ”-\d{1,2}|\d{1,2}-áƒ”/,ordinal:function(e){return 0===e?e:1===e?e+"-áƒšáƒ˜":e<20||e<=100&&e%20==0||e%100==0?"áƒ›áƒ”-"+e:e+"-áƒ”"},week:{dow:1,doy:7}})}(n(30381))},47772:function(e,t,n){!function(e){"use strict";var t={0:"-ÑˆÑ–",1:"-ÑˆÑ–",2:"-ÑˆÑ–",3:"-ÑˆÑ–",4:"-ÑˆÑ–",5:"-ÑˆÑ–",6:"-ÑˆÑ‹",7:"-ÑˆÑ–",8:"-ÑˆÑ–",9:"-ÑˆÑ‹",10:"-ÑˆÑ‹",20:"-ÑˆÑ‹",30:"-ÑˆÑ‹",40:"-ÑˆÑ‹",50:"-ÑˆÑ–",60:"-ÑˆÑ‹",70:"-ÑˆÑ–",80:"-ÑˆÑ–",90:"-ÑˆÑ‹",100:"-ÑˆÑ–"};e.defineLocale("kk",{months:"Ò›Ð°Ò£Ñ‚Ð°Ñ€_Ð°Ò›Ð¿Ð°Ð½_Ð½Ð°ÑƒÑ€Ñ‹Ð·_ÑÓ™ÑƒÑ–Ñ€_Ð¼Ð°Ð¼Ñ‹Ñ€_Ð¼Ð°ÑƒÑÑ‹Ð¼_ÑˆÑ–Ð»Ð´Ðµ_Ñ‚Ð°Ð¼Ñ‹Ð·_Ò›Ñ‹Ñ€ÐºÒ¯Ð¹ÐµÐº_Ò›Ð°Ð·Ð°Ð½_Ò›Ð°Ñ€Ð°ÑˆÐ°_Ð¶ÐµÐ»Ñ‚Ð¾Ò›ÑÐ°Ð½".split("_"),monthsShort:"Ò›Ð°Ò£_Ð°Ò›Ð¿_Ð½Ð°Ñƒ_ÑÓ™Ñƒ_Ð¼Ð°Ð¼_Ð¼Ð°Ñƒ_ÑˆÑ–Ð»_Ñ‚Ð°Ð¼_Ò›Ñ‹Ñ€_Ò›Ð°Ð·_Ò›Ð°Ñ€_Ð¶ÐµÐ»".split("_"),weekdays:"Ð¶ÐµÐºÑÐµÐ½Ð±Ñ–_Ð´Ò¯Ð¹ÑÐµÐ½Ð±Ñ–_ÑÐµÐ¹ÑÐµÐ½Ð±Ñ–_ÑÓ™Ñ€ÑÐµÐ½Ð±Ñ–_Ð±ÐµÐ¹ÑÐµÐ½Ð±Ñ–_Ð¶Ò±Ð¼Ð°_ÑÐµÐ½Ð±Ñ–".split("_"),weekdaysShort:"Ð¶ÐµÐº_Ð´Ò¯Ð¹_ÑÐµÐ¹_ÑÓ™Ñ€_Ð±ÐµÐ¹_Ð¶Ò±Ð¼_ÑÐµÐ½".split("_"),weekdaysMin:"Ð¶Ðº_Ð´Ð¹_ÑÐ¹_ÑÑ€_Ð±Ð¹_Ð¶Ð¼_ÑÐ½".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Ð‘Ò¯Ð³Ñ–Ð½ ÑÐ°Ò“Ð°Ñ‚] LT",nextDay:"[Ð•Ñ€Ñ‚ÐµÒ£ ÑÐ°Ò“Ð°Ñ‚] LT",nextWeek:"dddd [ÑÐ°Ò“Ð°Ñ‚] LT",lastDay:"[ÐšÐµÑˆÐµ ÑÐ°Ò“Ð°Ñ‚] LT",lastWeek:"[Ó¨Ñ‚ÐºÐµÐ½ Ð°Ð¿Ñ‚Ð°Ð½Ñ‹Ò£] dddd [ÑÐ°Ò“Ð°Ñ‚] LT",sameElse:"L"},relativeTime:{future:"%s Ñ–ÑˆÑ–Ð½Ð´Ðµ",past:"%s Ð±Ò±Ñ€Ñ‹Ð½",s:"Ð±Ñ–Ñ€Ð½ÐµÑˆÐµ ÑÐµÐºÑƒÐ½Ð´",ss:"%d ÑÐµÐºÑƒÐ½Ð´",m:"Ð±Ñ–Ñ€ Ð¼Ð¸Ð½ÑƒÑ‚",mm:"%d Ð¼Ð¸Ð½ÑƒÑ‚",h:"Ð±Ñ–Ñ€ ÑÐ°Ò“Ð°Ñ‚",hh:"%d ÑÐ°Ò“Ð°Ñ‚",d:"Ð±Ñ–Ñ€ ÐºÒ¯Ð½",dd:"%d ÐºÒ¯Ð½",M:"Ð±Ñ–Ñ€ Ð°Ð¹",MM:"%d Ð°Ð¹",y:"Ð±Ñ–Ñ€ Ð¶Ñ‹Ð»",yy:"%d Ð¶Ñ‹Ð»"},dayOfMonthOrdinalParse:/\d{1,2}-(ÑˆÑ–|ÑˆÑ‹)/,ordinal:function(e){return e+(t[e]||t[e%10]||t[e>=100?100:null])},week:{dow:1,doy:7}})}(n(30381))},18758:function(e,t,n){!function(e){"use strict";var t={1:"áŸ¡",2:"áŸ¢",3:"áŸ£",4:"áŸ¤",5:"áŸ¥",6:"áŸ¦",7:"áŸ§",8:"áŸ¨",9:"áŸ©",0:"áŸ "},n={"áŸ¡":"1","áŸ¢":"2","áŸ£":"3","áŸ¤":"4","áŸ¥":"5","áŸ¦":"6","áŸ§":"7","áŸ¨":"8","áŸ©":"9","áŸ ":"0"};e.defineLocale("km",{months:"áž˜áž€ážšáž¶_áž€áž»áž˜áŸ’áž—áŸˆ_áž˜áž¸áž“áž¶_áž˜áŸážŸáž¶_áž§ážŸáž—áž¶_áž˜áž·ážáž»áž“áž¶_áž€áž€áŸ’áž€ážŠáž¶_ážŸáž¸áž áž¶_áž€áž‰áŸ’áž‰áž¶_ážáž»áž›áž¶_ážœáž·áž…áŸ’áž†áž·áž€áž¶_áž’áŸ’áž“áž¼".split("_"),monthsShort:"áž˜áž€ážšáž¶_áž€áž»áž˜áŸ’áž—áŸˆ_áž˜áž¸áž“áž¶_áž˜áŸážŸáž¶_áž§ážŸáž—áž¶_áž˜áž·ážáž»áž“áž¶_áž€áž€áŸ’áž€ážŠáž¶_ážŸáž¸áž áž¶_áž€áž‰áŸ’áž‰áž¶_ážáž»áž›áž¶_ážœáž·áž…áŸ’áž†áž·áž€áž¶_áž’áŸ’áž“áž¼".split("_"),weekdays:"áž¢áž¶áž‘áž·ážáŸ’áž™_áž…áŸáž“áŸ’áž‘_áž¢áž„áŸ’áž‚áž¶ážš_áž–áž»áž’_áž–áŸ’ážšáž ážŸáŸ’áž”ážáž·áŸ_ážŸáž»áž€áŸ’ážš_ážŸáŸ…ážšáŸ".split("_"),weekdaysShort:"áž¢áž¶_áž…_áž¢_áž–_áž–áŸ’ážš_ážŸáž»_ážŸ".split("_"),weekdaysMin:"áž¢áž¶_áž…_áž¢_áž–_áž–áŸ’ážš_ážŸáž»_ážŸ".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},meridiemParse:/áž–áŸ’ážšáž¹áž€|áž›áŸ’áž„áž¶áž…/,isPM:function(e){return"áž›áŸ’áž„áž¶áž…"===e},meridiem:function(e,t,n){return e<12?"áž–áŸ’ážšáž¹áž€":"áž›áŸ’áž„áž¶áž…"},calendar:{sameDay:"[ážáŸ’áž„áŸƒáž“áŸáŸ‡ áž˜áŸ‰áŸ„áž„] LT",nextDay:"[ážŸáŸ’áž¢áŸ‚áž€ áž˜áŸ‰áŸ„áž„] LT",nextWeek:"dddd [áž˜áŸ‰áŸ„áž„] LT",lastDay:"[áž˜áŸ’ážŸáž·áž›áž˜áž·áž‰ áž˜áŸ‰áŸ„áž„] LT",lastWeek:"dddd [ážŸáž”áŸ’ážáž¶áž áŸáž˜áž»áž“] [áž˜áŸ‰áŸ„áž„] LT",sameElse:"L"},relativeTime:{future:"%sáž‘áŸ€áž",past:"%sáž˜áž»áž“",s:"áž”áŸ‰áž»áž“áŸ’áž˜áž¶áž“ážœáž·áž“áž¶áž‘áž¸",ss:"%d ážœáž·áž“áž¶áž‘áž¸",m:"áž˜áž½áž™áž“áž¶áž‘áž¸",mm:"%d áž“áž¶áž‘áž¸",h:"áž˜áž½áž™áž˜áŸ‰áŸ„áž„",hh:"%d áž˜áŸ‰áŸ„áž„",d:"áž˜áž½áž™ážáŸ’áž„áŸƒ",dd:"%d ážáŸ’áž„áŸƒ",M:"áž˜áž½áž™ážáŸ‚",MM:"%d ážáŸ‚",y:"áž˜áž½áž™áž†áŸ’áž“áž¶áŸ†",yy:"%d áž†áŸ’áž“áž¶áŸ†"},dayOfMonthOrdinalParse:/áž‘áž¸\d{1,2}/,ordinal:"áž‘áž¸%d",preparse:function(e){return e.replace(/[áŸ¡áŸ¢áŸ£áŸ¤áŸ¥áŸ¦áŸ§áŸ¨áŸ©áŸ ]/g,(function(e){return n[e]}))},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]}))},week:{dow:1,doy:4}})}(n(30381))},79282:function(e,t,n){!function(e){"use strict";var t={1:"à³§",2:"à³¨",3:"à³©",4:"à³ª",5:"à³«",6:"à³¬",7:"à³­",8:"à³®",9:"à³¯",0:"à³¦"},n={"à³§":"1","à³¨":"2","à³©":"3","à³ª":"4","à³«":"5","à³¬":"6","à³­":"7","à³®":"8","à³¯":"9","à³¦":"0"};e.defineLocale("kn",{months:"à²œà²¨à²µà²°à²¿_à²«à³†à²¬à³à²°à²µà²°à²¿_à²®à²¾à²°à³à²šà³_à²à²ªà³à²°à²¿à²²à³_à²®à³†à³•_à²œà³‚à²¨à³_à²œà³à²²à³†à³–_à²†à²—à²¸à³à²Ÿà³_à²¸à³†à²ªà³à²Ÿà³†à²‚à²¬à²°à³_à²…à²•à³à²Ÿà³†à³‚à³•à²¬à²°à³_à²¨à²µà³†à²‚à²¬à²°à³_à²¡à²¿à²¸à³†à²‚à²¬à²°à³".split("_"),monthsShort:"à²œà²¨_à²«à³†à²¬à³à²°_à²®à²¾à²°à³à²šà³_à²à²ªà³à²°à²¿à²²à³_à²®à³†à³•_à²œà³‚à²¨à³_à²œà³à²²à³†à³–_à²†à²—à²¸à³à²Ÿà³_à²¸à³†à²ªà³à²Ÿà³†à²‚_à²…à²•à³à²Ÿà³†à³‚à³•_à²¨à²µà³†à²‚_à²¡à²¿à²¸à³†à²‚".split("_"),monthsParseExact:!0,weekdays:"à²­à²¾à²¨à³à²µà²¾à²°_à²¸à³†à³‚à³•à²®à²µà²¾à²°_à²®à²‚à²—à²³à²µà²¾à²°_à²¬à³à²§à²µà²¾à²°_à²—à³à²°à³à²µà²¾à²°_à²¶à³à²•à³à²°à²µà²¾à²°_à²¶à²¨à²¿à²µà²¾à²°".split("_"),weekdaysShort:"à²­à²¾à²¨à³_à²¸à³†à³‚à³•à²®_à²®à²‚à²—à²³_à²¬à³à²§_à²—à³à²°à³_à²¶à³à²•à³à²°_à²¶à²¨à²¿".split("_"),weekdaysMin:"à²­à²¾_à²¸à³†à³‚à³•_à²®à²‚_à²¬à³_à²—à³_à²¶à³_à²¶".split("_"),longDateFormat:{LT:"A h:mm",LTS:"A h:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm",LLLL:"dddd, D MMMM YYYY, A h:mm"},calendar:{sameDay:"[à²‡à²‚à²¦à³] LT",nextDay:"[à²¨à²¾à²³à³†] LT",nextWeek:"dddd, LT",lastDay:"[à²¨à²¿à²¨à³à²¨à³†] LT",lastWeek:"[à²•à³†à³‚à²¨à³†à²¯] dddd, LT",sameElse:"L"},relativeTime:{future:"%s à²¨à²‚à²¤à²°",past:"%s à²¹à²¿à²‚à²¦à³†",s:"à²•à³†à²²à²µà³ à²•à³à²·à²£à²—à²³à³",ss:"%d à²¸à³†à²•à³†à²‚à²¡à³à²—à²³à³",m:"à²’à²‚à²¦à³ à²¨à²¿à²®à²¿à²·",mm:"%d à²¨à²¿à²®à²¿à²·",h:"à²’à²‚à²¦à³ à²—à²‚à²Ÿà³†",hh:"%d à²—à²‚à²Ÿà³†",d:"à²’à²‚à²¦à³ à²¦à²¿à²¨",dd:"%d à²¦à²¿à²¨",M:"à²’à²‚à²¦à³ à²¤à²¿à²‚à²—à²³à³",MM:"%d à²¤à²¿à²‚à²—à²³à³",y:"à²’à²‚à²¦à³ à²µà²°à³à²·",yy:"%d à²µà²°à³à²·"},preparse:function(e){return e.replace(/[à³§à³¨à³©à³ªà³«à³¬à³­à³®à³¯à³¦]/g,(function(e){return n[e]}))},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]}))},meridiemParse:/à²°à²¾à²¤à³à²°à²¿|à²¬à³†à²³à²¿à²—à³à²—à³†|à²®à²§à³à²¯à²¾à²¹à³à²¨|à²¸à²‚à²œà³†/,meridiemHour:function(e,t){return 12===e&&(e=0),"à²°à²¾à²¤à³à²°à²¿"===t?e<4?e:e+12:"à²¬à³†à²³à²¿à²—à³à²—à³†"===t?e:"à²®à²§à³à²¯à²¾à²¹à³à²¨"===t?e>=10?e:e+12:"à²¸à²‚à²œà³†"===t?e+12:void 0},meridiem:function(e,t,n){return e<4?"à²°à²¾à²¤à³à²°à²¿":e<10?"à²¬à³†à²³à²¿à²—à³à²—à³†":e<17?"à²®à²§à³à²¯à²¾à²¹à³à²¨":e<20?"à²¸à²‚à²œà³†":"à²°à²¾à²¤à³à²°à²¿"},dayOfMonthOrdinalParse:/\d{1,2}(à²¨à³†à³•)/,ordinal:function(e){return e+"à²¨à³†à³•"},week:{dow:0,doy:6}})}(n(30381))},33730:function(e,t,n){!function(e){"use strict";e.defineLocale("ko",{months:"1ì›”_2ì›”_3ì›”_4ì›”_5ì›”_6ì›”_7ì›”_8ì›”_9ì›”_10ì›”_11ì›”_12ì›”".split("_"),monthsShort:"1ì›”_2ì›”_3ì›”_4ì›”_5ì›”_6ì›”_7ì›”_8ì›”_9ì›”_10ì›”_11ì›”_12ì›”".split("_"),weekdays:"ì¼ìš”ì¼_ì›”ìš”ì¼_í™”ìš”ì¼_ìˆ˜ìš”ì¼_ëª©ìš”ì¼_ê¸ˆìš”ì¼_í† ìš”ì¼".split("_"),weekdaysShort:"ì¼_ì›”_í™”_ìˆ˜_ëª©_ê¸ˆ_í† ".split("_"),weekdaysMin:"ì¼_ì›”_í™”_ìˆ˜_ëª©_ê¸ˆ_í† ".split("_"),longDateFormat:{LT:"A h:mm",LTS:"A h:mm:ss",L:"YYYY.MM.DD.",LL:"YYYYë…„ MMMM Dì¼",LLL:"YYYYë…„ MMMM Dì¼ A h:mm",LLLL:"YYYYë…„ MMMM Dì¼ dddd A h:mm",l:"YYYY.MM.DD.",ll:"YYYYë…„ MMMM Dì¼",lll:"YYYYë…„ MMMM Dì¼ A h:mm",llll:"YYYYë…„ MMMM Dì¼ dddd A h:mm"},calendar:{sameDay:"ì˜¤ëŠ˜ LT",nextDay:"ë‚´ì¼ LT",nextWeek:"dddd LT",lastDay:"ì–´ì œ LT",lastWeek:"ì§€ë‚œì£¼ dddd LT",sameElse:"L"},relativeTime:{future:"%s í›„",past:"%s ì „",s:"ëª‡ ì´ˆ",ss:"%dì´ˆ",m:"1ë¶„",mm:"%dë¶„",h:"í•œ ì‹œê°„",hh:"%dì‹œê°„",d:"í•˜ë£¨",dd:"%dì¼",M:"í•œ ë‹¬",MM:"%dë‹¬",y:"ì¼ ë…„",yy:"%dë…„"},dayOfMonthOrdinalParse:/\d{1,2}(ì¼|ì›”|ì£¼)/,ordinal:function(e,t){switch(t){case"d":case"D":case"DDD":return e+"ì¼";case"M":return e+"ì›”";case"w":case"W":return e+"ì£¼";default:return e}},meridiemParse:/ì˜¤ì „|ì˜¤í›„/,isPM:function(e){return"ì˜¤í›„"===e},meridiem:function(e,t,n){return e<12?"ì˜¤ì „":"ì˜¤í›„"}})}(n(30381))},1408:function(e,t,n){!function(e){"use strict";var t={1:"Ù¡",2:"Ù¢",3:"Ù£",4:"Ù¤",5:"Ù¥",6:"Ù¦",7:"Ù§",8:"Ù¨",9:"Ù©",0:"Ù "},n={"Ù¡":"1","Ù¢":"2","Ù£":"3","Ù¤":"4","Ù¥":"5","Ù¦":"6","Ù§":"7","Ù¨":"8","Ù©":"9","Ù ":"0"},r=["Ú©Ø§Ù†ÙˆÙ†ÛŒ Ø¯ÙˆÙˆÛ•Ù…","Ø´ÙˆØ¨Ø§Øª","Ø¦Ø§Ø²Ø§Ø±","Ù†ÛŒØ³Ø§Ù†","Ø¦Ø§ÛŒØ§Ø±","Ø­ÙˆØ²Û•ÛŒØ±Ø§Ù†","ØªÛ•Ù…Ù…ÙˆØ²","Ø¦Ø§Ø¨","Ø¦Û•ÛŒÙ„ÙˆÙˆÙ„","ØªØ´Ø±ÛŒÙ†ÛŒ ÛŒÛ•ÙƒÛ•Ù…","ØªØ´Ø±ÛŒÙ†ÛŒ Ø¯ÙˆÙˆÛ•Ù…","ÙƒØ§Ù†ÙˆÙ†ÛŒ ÛŒÛ•Ú©Û•Ù…"];e.defineLocale("ku",{months:r,monthsShort:r,weekdays:"ÛŒÙ‡â€ŒÙƒØ´Ù‡â€ŒÙ…Ù…Ù‡â€Œ_Ø¯ÙˆÙˆØ´Ù‡â€ŒÙ…Ù…Ù‡â€Œ_Ø³ÛŽØ´Ù‡â€ŒÙ…Ù…Ù‡â€Œ_Ú†ÙˆØ§Ø±Ø´Ù‡â€ŒÙ…Ù…Ù‡â€Œ_Ù¾ÛŽÙ†Ø¬Ø´Ù‡â€ŒÙ…Ù…Ù‡â€Œ_Ù‡Ù‡â€ŒÛŒÙ†ÛŒ_Ø´Ù‡â€ŒÙ…Ù…Ù‡â€Œ".split("_"),weekdaysShort:"ÛŒÙ‡â€ŒÙƒØ´Ù‡â€ŒÙ…_Ø¯ÙˆÙˆØ´Ù‡â€ŒÙ…_Ø³ÛŽØ´Ù‡â€ŒÙ…_Ú†ÙˆØ§Ø±Ø´Ù‡â€ŒÙ…_Ù¾ÛŽÙ†Ø¬Ø´Ù‡â€ŒÙ…_Ù‡Ù‡â€ŒÛŒÙ†ÛŒ_Ø´Ù‡â€ŒÙ…Ù…Ù‡â€Œ".split("_"),weekdaysMin:"ÛŒ_Ø¯_Ø³_Ú†_Ù¾_Ù‡_Ø´".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},meridiemParse:/Ø¦ÛŽÙˆØ§Ø±Ù‡â€Œ|Ø¨Ù‡â€ŒÛŒØ§Ù†ÛŒ/,isPM:function(e){return/Ø¦ÛŽÙˆØ§Ø±Ù‡â€Œ/.test(e)},meridiem:function(e,t,n){return e<12?"Ø¨Ù‡â€ŒÛŒØ§Ù†ÛŒ":"Ø¦ÛŽÙˆØ§Ø±Ù‡â€Œ"},calendar:{sameDay:"[Ø¦Ù‡â€ŒÙ…Ø±Û† ÙƒØ§ØªÚ˜Ù…ÛŽØ±] LT",nextDay:"[Ø¨Ù‡â€ŒÛŒØ§Ù†ÛŒ ÙƒØ§ØªÚ˜Ù…ÛŽØ±] LT",nextWeek:"dddd [ÙƒØ§ØªÚ˜Ù…ÛŽØ±] LT",lastDay:"[Ø¯ÙˆÛŽÙ†ÛŽ ÙƒØ§ØªÚ˜Ù…ÛŽØ±] LT",lastWeek:"dddd [ÙƒØ§ØªÚ˜Ù…ÛŽØ±] LT",sameElse:"L"},relativeTime:{future:"Ù„Ù‡â€Œ %s",past:"%s",s:"Ú†Ù‡â€ŒÙ†Ø¯ Ú†Ø±ÙƒÙ‡â€ŒÛŒÙ‡â€ŒÙƒ",ss:"Ú†Ø±ÙƒÙ‡â€Œ %d",m:"ÛŒÙ‡â€ŒÙƒ Ø®ÙˆÙ„Ù‡â€ŒÙƒ",mm:"%d Ø®ÙˆÙ„Ù‡â€ŒÙƒ",h:"ÛŒÙ‡â€ŒÙƒ ÙƒØ§ØªÚ˜Ù…ÛŽØ±",hh:"%d ÙƒØ§ØªÚ˜Ù…ÛŽØ±",d:"ÛŒÙ‡â€ŒÙƒ Ú•Û†Ú˜",dd:"%d Ú•Û†Ú˜",M:"ÛŒÙ‡â€ŒÙƒ Ù…Ø§Ù†Ú¯",MM:"%d Ù…Ø§Ù†Ú¯",y:"ÛŒÙ‡â€ŒÙƒ Ø³Ø§Úµ",yy:"%d Ø³Ø§Úµ"},preparse:function(e){return e.replace(/[Ù¡Ù¢Ù£Ù¤Ù¥Ù¦Ù§Ù¨Ù©Ù ]/g,(function(e){return n[e]})).replace(/ØŒ/g,",")},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]})).replace(/,/g,"ØŒ")},week:{dow:6,doy:12}})}(n(30381))},33291:function(e,t,n){!function(e){"use strict";var t={0:"-Ñ‡Ò¯",1:"-Ñ‡Ð¸",2:"-Ñ‡Ð¸",3:"-Ñ‡Ò¯",4:"-Ñ‡Ò¯",5:"-Ñ‡Ð¸",6:"-Ñ‡Ñ‹",7:"-Ñ‡Ð¸",8:"-Ñ‡Ð¸",9:"-Ñ‡Ñƒ",10:"-Ñ‡Ñƒ",20:"-Ñ‡Ñ‹",30:"-Ñ‡Ñƒ",40:"-Ñ‡Ñ‹",50:"-Ñ‡Ò¯",60:"-Ñ‡Ñ‹",70:"-Ñ‡Ð¸",80:"-Ñ‡Ð¸",90:"-Ñ‡Ñƒ",100:"-Ñ‡Ò¯"};e.defineLocale("ky",{months:"ÑÐ½Ð²Ð°Ñ€ÑŒ_Ñ„ÐµÐ²Ñ€Ð°Ð»ÑŒ_Ð¼Ð°Ñ€Ñ‚_Ð°Ð¿Ñ€ÐµÐ»ÑŒ_Ð¼Ð°Ð¹_Ð¸ÑŽÐ½ÑŒ_Ð¸ÑŽÐ»ÑŒ_Ð°Ð²Ð³ÑƒÑÑ‚_ÑÐµÐ½Ñ‚ÑÐ±Ñ€ÑŒ_Ð¾ÐºÑ‚ÑÐ±Ñ€ÑŒ_Ð½Ð¾ÑÐ±Ñ€ÑŒ_Ð´ÐµÐºÐ°Ð±Ñ€ÑŒ".split("_"),monthsShort:"ÑÐ½Ð²_Ñ„ÐµÐ²_Ð¼Ð°Ñ€Ñ‚_Ð°Ð¿Ñ€_Ð¼Ð°Ð¹_Ð¸ÑŽÐ½ÑŒ_Ð¸ÑŽÐ»ÑŒ_Ð°Ð²Ð³_ÑÐµÐ½_Ð¾ÐºÑ‚_Ð½Ð¾Ñ_Ð´ÐµÐº".split("_"),weekdays:"Ð–ÐµÐºÑˆÐµÐ¼Ð±Ð¸_Ð”Ò¯Ð¹ÑˆÓ©Ð¼Ð±Ò¯_Ð¨ÐµÐ¹ÑˆÐµÐ¼Ð±Ð¸_Ð¨Ð°Ñ€ÑˆÐµÐ¼Ð±Ð¸_Ð‘ÐµÐ¹ÑˆÐµÐ¼Ð±Ð¸_Ð–ÑƒÐ¼Ð°_Ð˜ÑˆÐµÐ¼Ð±Ð¸".split("_"),weekdaysShort:"Ð–ÐµÐº_Ð”Ò¯Ð¹_Ð¨ÐµÐ¹_Ð¨Ð°Ñ€_Ð‘ÐµÐ¹_Ð–ÑƒÐ¼_Ð˜ÑˆÐµ".split("_"),weekdaysMin:"Ð–Ðº_Ð”Ð¹_Ð¨Ð¹_Ð¨Ñ€_Ð‘Ð¹_Ð–Ð¼_Ð˜Ñˆ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Ð‘Ò¯Ð³Ò¯Ð½ ÑÐ°Ð°Ñ‚] LT",nextDay:"[Ð­Ñ€Ñ‚ÐµÒ£ ÑÐ°Ð°Ñ‚] LT",nextWeek:"dddd [ÑÐ°Ð°Ñ‚] LT",lastDay:"[ÐšÐµÑ‡ÑÑ ÑÐ°Ð°Ñ‚] LT",lastWeek:"[Ó¨Ñ‚ÐºÓ©Ð½ Ð°Ð¿Ñ‚Ð°Ð½Ñ‹Ð½] dddd [ÐºÒ¯Ð½Ò¯] [ÑÐ°Ð°Ñ‚] LT",sameElse:"L"},relativeTime:{future:"%s Ð¸Ñ‡Ð¸Ð½Ð´Ðµ",past:"%s Ð¼ÑƒÑ€ÑƒÐ½",s:"Ð±Ð¸Ñ€Ð½ÐµÑ‡Ðµ ÑÐµÐºÑƒÐ½Ð´",ss:"%d ÑÐµÐºÑƒÐ½Ð´",m:"Ð±Ð¸Ñ€ Ð¼Ò¯Ð½Ó©Ñ‚",mm:"%d Ð¼Ò¯Ð½Ó©Ñ‚",h:"Ð±Ð¸Ñ€ ÑÐ°Ð°Ñ‚",hh:"%d ÑÐ°Ð°Ñ‚",d:"Ð±Ð¸Ñ€ ÐºÒ¯Ð½",dd:"%d ÐºÒ¯Ð½",M:"Ð±Ð¸Ñ€ Ð°Ð¹",MM:"%d Ð°Ð¹",y:"Ð±Ð¸Ñ€ Ð¶Ñ‹Ð»",yy:"%d Ð¶Ñ‹Ð»"},dayOfMonthOrdinalParse:/\d{1,2}-(Ñ‡Ð¸|Ñ‡Ñ‹|Ñ‡Ò¯|Ñ‡Ñƒ)/,ordinal:function(e){return e+(t[e]||t[e%10]||t[e>=100?100:null])},week:{dow:1,doy:7}})}(n(30381))},36841:function(e,t,n){!function(e){"use strict";function t(e,t,n,r){var a={m:["eng Minutt","enger Minutt"],h:["eng Stonn","enger Stonn"],d:["een Dag","engem Dag"],M:["ee Mount","engem Mount"],y:["ee Joer","engem Joer"]};return t?a[n][0]:a[n][1]}function n(e){if(e=parseInt(e,10),isNaN(e))return!1;if(e<0)return!0;if(e<10)return 4<=e&&e<=7;if(e<100){var t=e%10;return n(0===t?e/10:t)}if(e<1e4){for(;e>=10;)e/=10;return n(e)}return n(e/=1e3)}e.defineLocale("lb",{months:"Januar_Februar_MÃ¤erz_AbrÃ«ll_Mee_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),monthsParseExact:!0,weekdays:"Sonndeg_MÃ©indeg_DÃ«nschdeg_MÃ«ttwoch_Donneschdeg_Freideg_Samschdeg".split("_"),weekdaysShort:"So._MÃ©._DÃ«._MÃ«._Do._Fr._Sa.".split("_"),weekdaysMin:"So_MÃ©_DÃ«_MÃ«_Do_Fr_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm [Auer]",LTS:"H:mm:ss [Auer]",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm [Auer]",LLLL:"dddd, D. MMMM YYYY H:mm [Auer]"},calendar:{sameDay:"[Haut um] LT",sameElse:"L",nextDay:"[Muer um] LT",nextWeek:"dddd [um] LT",lastDay:"[GÃ«schter um] LT",lastWeek:function(){switch(this.day()){case 2:case 4:return"[Leschten] dddd [um] LT";default:return"[Leschte] dddd [um] LT"}}},relativeTime:{future:function(e){return n(e.substr(0,e.indexOf(" ")))?"a "+e:"an "+e},past:function(e){return n(e.substr(0,e.indexOf(" ")))?"viru "+e:"virun "+e},s:"e puer Sekonnen",ss:"%d Sekonnen",m:t,mm:"%d Minutten",h:t,hh:"%d Stonnen",d:t,dd:"%d Deeg",M:t,MM:"%d MÃ©int",y:t,yy:"%d Joer"},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}(n(30381))},55466:function(e,t,n){!function(e){"use strict";e.defineLocale("lo",{months:"àº¡àº±àº‡àºàº­àº™_àºàº¸àº¡àºžàº²_àº¡àºµàº™àº²_à»€àº¡àºªàº²_àºžàº¶àº”àºªàº°àºžàº²_àº¡àº´àº–àº¸àº™àº²_àºà»àº¥àº°àºàº»àº”_àºªàº´àº‡àº«àº²_àºàº±àº™àºàº²_àº•àº¸àº¥àº²_àºžàº°àºˆàº´àº_àº—àº±àº™àº§àº²".split("_"),monthsShort:"àº¡àº±àº‡àºàº­àº™_àºàº¸àº¡àºžàº²_àº¡àºµàº™àº²_à»€àº¡àºªàº²_àºžàº¶àº”àºªàº°àºžàº²_àº¡àº´àº–àº¸àº™àº²_àºà»àº¥àº°àºàº»àº”_àºªàº´àº‡àº«àº²_àºàº±àº™àºàº²_àº•àº¸àº¥àº²_àºžàº°àºˆàº´àº_àº—àº±àº™àº§àº²".split("_"),weekdays:"àº­àº²àº—àº´àº”_àºˆàº±àº™_àº­àº±àº‡àº„àº²àº™_àºžàº¸àº”_àºžàº°àº«àº±àº”_àºªàº¸àº_à»€àºªàº»àº²".split("_"),weekdaysShort:"àº—àº´àº”_àºˆàº±àº™_àº­àº±àº‡àº„àº²àº™_àºžàº¸àº”_àºžàº°àº«àº±àº”_àºªàº¸àº_à»€àºªàº»àº²".split("_"),weekdaysMin:"àº—_àºˆ_àº­àº„_àºž_àºžàº«_àºªàº_àºª".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"àº§àº±àº™dddd D MMMM YYYY HH:mm"},meridiemParse:/àº•àº­àº™à»€àºŠàº»à»‰àº²|àº•àº­àº™à»àº¥àº‡/,isPM:function(e){return"àº•àº­àº™à»àº¥àº‡"===e},meridiem:function(e,t,n){return e<12?"àº•àº­àº™à»€àºŠàº»à»‰àº²":"àº•àº­àº™à»àº¥àº‡"},calendar:{sameDay:"[àº¡àº·à»‰àº™àºµà»‰à»€àº§àº¥àº²] LT",nextDay:"[àº¡àº·à»‰àº­àº·à»ˆàº™à»€àº§àº¥àº²] LT",nextWeek:"[àº§àº±àº™]dddd[à»œà»‰àº²à»€àº§àº¥àº²] LT",lastDay:"[àº¡àº·à»‰àº§àº²àº™àº™àºµà»‰à»€àº§àº¥àº²] LT",lastWeek:"[àº§àº±àº™]dddd[à»àº¥à»‰àº§àº™àºµà»‰à»€àº§àº¥àº²] LT",sameElse:"L"},relativeTime:{future:"àº­àºµàº %s",past:"%sàºœà»ˆàº²àº™àº¡àº²",s:"àºšà»à»ˆà»€àº—àº»à»ˆàº²à»ƒàº”àº§àº´àº™àº²àº—àºµ",ss:"%d àº§àº´àº™àº²àº—àºµ",m:"1 àº™àº²àº—àºµ",mm:"%d àº™àº²àº—àºµ",h:"1 àºŠàº»à»ˆàº§à»‚àº¡àº‡",hh:"%d àºŠàº»à»ˆàº§à»‚àº¡àº‡",d:"1 àº¡àº·à»‰",dd:"%d àº¡àº·à»‰",M:"1 à»€àº”àº·àº­àº™",MM:"%d à»€àº”àº·àº­àº™",y:"1 àº›àºµ",yy:"%d àº›àºµ"},dayOfMonthOrdinalParse:/(àº—àºµà»ˆ)\d{1,2}/,ordinal:function(e){return"àº—àºµà»ˆ"+e}})}(n(30381))},57010:function(e,t,n){!function(e){"use strict";var t={ss:"sekundÄ—_sekundÅ¾iÅ³_sekundes",m:"minutÄ—_minutÄ—s_minutÄ™",mm:"minutÄ—s_minuÄiÅ³_minutes",h:"valanda_valandos_valandÄ…",hh:"valandos_valandÅ³_valandas",d:"diena_dienos_dienÄ…",dd:"dienos_dienÅ³_dienas",M:"mÄ—nuo_mÄ—nesio_mÄ—nesÄ¯",MM:"mÄ—nesiai_mÄ—nesiÅ³_mÄ—nesius",y:"metai_metÅ³_metus",yy:"metai_metÅ³_metus"};function n(e,t,n,r){return t?a(n)[0]:r?a(n)[1]:a(n)[2]}function r(e){return e%10==0||e>10&&e<20}function a(e){return t[e].split("_")}function s(e,t,s,i){var o=e+" ";return 1===e?o+n(0,t,s[0],i):t?o+(r(e)?a(s)[1]:a(s)[0]):i?o+a(s)[1]:o+(r(e)?a(s)[1]:a(s)[2])}e.defineLocale("lt",{months:{format:"sausio_vasario_kovo_balandÅ¾io_geguÅ¾Ä—s_birÅ¾elio_liepos_rugpjÅ«Äio_rugsÄ—jo_spalio_lapkriÄio_gruodÅ¾io".split("_"),standalone:"sausis_vasaris_kovas_balandis_geguÅ¾Ä—_birÅ¾elis_liepa_rugpjÅ«tis_rugsÄ—jis_spalis_lapkritis_gruodis".split("_"),isFormat:/D[oD]?(\[[^\[\]]*\]|\s)+MMMM?|MMMM?(\[[^\[\]]*\]|\s)+D[oD]?/},monthsShort:"sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd".split("_"),weekdays:{format:"sekmadienÄ¯_pirmadienÄ¯_antradienÄ¯_treÄiadienÄ¯_ketvirtadienÄ¯_penktadienÄ¯_Å¡eÅ¡tadienÄ¯".split("_"),standalone:"sekmadienis_pirmadienis_antradienis_treÄiadienis_ketvirtadienis_penktadienis_Å¡eÅ¡tadienis".split("_"),isFormat:/dddd HH:mm/},weekdaysShort:"Sek_Pir_Ant_Tre_Ket_Pen_Å eÅ¡".split("_"),weekdaysMin:"S_P_A_T_K_Pn_Å ".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"YYYY [m.] MMMM D [d.]",LLL:"YYYY [m.] MMMM D [d.], HH:mm [val.]",LLLL:"YYYY [m.] MMMM D [d.], dddd, HH:mm [val.]",l:"YYYY-MM-DD",ll:"YYYY [m.] MMMM D [d.]",lll:"YYYY [m.] MMMM D [d.], HH:mm [val.]",llll:"YYYY [m.] MMMM D [d.], ddd, HH:mm [val.]"},calendar:{sameDay:"[Å iandien] LT",nextDay:"[Rytoj] LT",nextWeek:"dddd LT",lastDay:"[Vakar] LT",lastWeek:"[PraÄ—jusÄ¯] dddd LT",sameElse:"L"},relativeTime:{future:"po %s",past:"prieÅ¡ %s",s:function(e,t,n,r){return t?"kelios sekundÄ—s":r?"keliÅ³ sekundÅ¾iÅ³":"kelias sekundes"},ss:s,m:n,mm:s,h:n,hh:s,d:n,dd:s,M:n,MM:s,y:n,yy:s},dayOfMonthOrdinalParse:/\d{1,2}-oji/,ordinal:function(e){return e+"-oji"},week:{dow:1,doy:4}})}(n(30381))},37595:function(e,t,n){!function(e){"use strict";var t={ss:"sekundes_sekundÄ“m_sekunde_sekundes".split("_"),m:"minÅ«tes_minÅ«tÄ“m_minÅ«te_minÅ«tes".split("_"),mm:"minÅ«tes_minÅ«tÄ“m_minÅ«te_minÅ«tes".split("_"),h:"stundas_stundÄm_stunda_stundas".split("_"),hh:"stundas_stundÄm_stunda_stundas".split("_"),d:"dienas_dienÄm_diena_dienas".split("_"),dd:"dienas_dienÄm_diena_dienas".split("_"),M:"mÄ“neÅ¡a_mÄ“neÅ¡iem_mÄ“nesis_mÄ“neÅ¡i".split("_"),MM:"mÄ“neÅ¡a_mÄ“neÅ¡iem_mÄ“nesis_mÄ“neÅ¡i".split("_"),y:"gada_gadiem_gads_gadi".split("_"),yy:"gada_gadiem_gads_gadi".split("_")};function n(e,t,n){return n?t%10==1&&t%100!=11?e[2]:e[3]:t%10==1&&t%100!=11?e[0]:e[1]}function r(e,r,a){return e+" "+n(t[a],e,r)}function a(e,r,a){return n(t[a],e,r)}e.defineLocale("lv",{months:"janvÄris_februÄris_marts_aprÄ«lis_maijs_jÅ«nijs_jÅ«lijs_augusts_septembris_oktobris_novembris_decembris".split("_"),monthsShort:"jan_feb_mar_apr_mai_jÅ«n_jÅ«l_aug_sep_okt_nov_dec".split("_"),weekdays:"svÄ“tdiena_pirmdiena_otrdiena_treÅ¡diena_ceturtdiena_piektdiena_sestdiena".split("_"),weekdaysShort:"Sv_P_O_T_C_Pk_S".split("_"),weekdaysMin:"Sv_P_O_T_C_Pk_S".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY.",LL:"YYYY. [gada] D. MMMM",LLL:"YYYY. [gada] D. MMMM, HH:mm",LLLL:"YYYY. [gada] D. MMMM, dddd, HH:mm"},calendar:{sameDay:"[Å odien pulksten] LT",nextDay:"[RÄ«t pulksten] LT",nextWeek:"dddd [pulksten] LT",lastDay:"[Vakar pulksten] LT",lastWeek:"[PagÄjuÅ¡Ä] dddd [pulksten] LT",sameElse:"L"},relativeTime:{future:"pÄ“c %s",past:"pirms %s",s:function(e,t){return t?"daÅ¾as sekundes":"daÅ¾Äm sekundÄ“m"},ss:r,m:a,mm:r,h:a,hh:r,d:a,dd:r,M:a,MM:r,y:a,yy:r},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}(n(30381))},39861:function(e,t,n){!function(e){"use strict";var t={words:{ss:["sekund","sekunda","sekundi"],m:["jedan minut","jednog minuta"],mm:["minut","minuta","minuta"],h:["jedan sat","jednog sata"],hh:["sat","sata","sati"],dd:["dan","dana","dana"],MM:["mjesec","mjeseca","mjeseci"],yy:["godina","godine","godina"]},correctGrammaticalCase:function(e,t){return 1===e?t[0]:e>=2&&e<=4?t[1]:t[2]},translate:function(e,n,r){var a=t.words[r];return 1===r.length?n?a[0]:a[1]:e+" "+t.correctGrammaticalCase(e,a)}};e.defineLocale("me",{months:"januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar".split("_"),monthsShort:"jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"nedjelja_ponedjeljak_utorak_srijeda_Äetvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sri._Äet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_Äe_pe_su".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danas u] LT",nextDay:"[sjutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[juÄe u] LT",lastWeek:function(){return["[proÅ¡le] [nedjelje] [u] LT","[proÅ¡log] [ponedjeljka] [u] LT","[proÅ¡log] [utorka] [u] LT","[proÅ¡le] [srijede] [u] LT","[proÅ¡log] [Äetvrtka] [u] LT","[proÅ¡log] [petka] [u] LT","[proÅ¡le] [subote] [u] LT"][this.day()]},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"nekoliko sekundi",ss:t.translate,m:t.translate,mm:t.translate,h:t.translate,hh:t.translate,d:"dan",dd:t.translate,M:"mjesec",MM:t.translate,y:"godinu",yy:t.translate},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}})}(n(30381))},35493:function(e,t,n){!function(e){"use strict";e.defineLocale("mi",{months:"Kohi-tÄte_Hui-tanguru_PoutÅ«-te-rangi_Paenga-whÄwhÄ_Haratua_Pipiri_HÅngoingoi_Here-turi-kÅkÄ_Mahuru_Whiringa-Ä-nuku_Whiringa-Ä-rangi_Hakihea".split("_"),monthsShort:"Kohi_Hui_Pou_Pae_Hara_Pipi_HÅngoi_Here_Mahu_Whi-nu_Whi-ra_Haki".split("_"),monthsRegex:/(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,monthsStrictRegex:/(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,monthsShortRegex:/(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,monthsShortStrictRegex:/(?:['a-z\u0101\u014D\u016B]+\-?){1,2}/i,weekdays:"RÄtapu_Mane_TÅ«rei_Wenerei_TÄite_Paraire_HÄtarei".split("_"),weekdaysShort:"Ta_Ma_TÅ«_We_TÄi_Pa_HÄ".split("_"),weekdaysMin:"Ta_Ma_TÅ«_We_TÄi_Pa_HÄ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [i] HH:mm",LLLL:"dddd, D MMMM YYYY [i] HH:mm"},calendar:{sameDay:"[i teie mahana, i] LT",nextDay:"[apopo i] LT",nextWeek:"dddd [i] LT",lastDay:"[inanahi i] LT",lastWeek:"dddd [whakamutunga i] LT",sameElse:"L"},relativeTime:{future:"i roto i %s",past:"%s i mua",s:"te hÄ“kona ruarua",ss:"%d hÄ“kona",m:"he meneti",mm:"%d meneti",h:"te haora",hh:"%d haora",d:"he ra",dd:"%d ra",M:"he marama",MM:"%d marama",y:"he tau",yy:"%d tau"},dayOfMonthOrdinalParse:/\d{1,2}Âº/,ordinal:"%dÂº",week:{dow:1,doy:4}})}(n(30381))},95966:function(e,t,n){!function(e){"use strict";e.defineLocale("mk",{months:"Ñ˜Ð°Ð½ÑƒÐ°Ñ€Ð¸_Ñ„ÐµÐ²Ñ€ÑƒÐ°Ñ€Ð¸_Ð¼Ð°Ñ€Ñ‚_Ð°Ð¿Ñ€Ð¸Ð»_Ð¼Ð°Ñ˜_Ñ˜ÑƒÐ½Ð¸_Ñ˜ÑƒÐ»Ð¸_Ð°Ð²Ð³ÑƒÑÑ‚_ÑÐµÐ¿Ñ‚ÐµÐ¼Ð²Ñ€Ð¸_Ð¾ÐºÑ‚Ð¾Ð¼Ð²Ñ€Ð¸_Ð½Ð¾ÐµÐ¼Ð²Ñ€Ð¸_Ð´ÐµÐºÐµÐ¼Ð²Ñ€Ð¸".split("_"),monthsShort:"Ñ˜Ð°Ð½_Ñ„ÐµÐ²_Ð¼Ð°Ñ€_Ð°Ð¿Ñ€_Ð¼Ð°Ñ˜_Ñ˜ÑƒÐ½_Ñ˜ÑƒÐ»_Ð°Ð²Ð³_ÑÐµÐ¿_Ð¾ÐºÑ‚_Ð½Ð¾Ðµ_Ð´ÐµÐº".split("_"),weekdays:"Ð½ÐµÐ´ÐµÐ»Ð°_Ð¿Ð¾Ð½ÐµÐ´ÐµÐ»Ð½Ð¸Ðº_Ð²Ñ‚Ð¾Ñ€Ð½Ð¸Ðº_ÑÑ€ÐµÐ´Ð°_Ñ‡ÐµÑ‚Ð²Ñ€Ñ‚Ð¾Ðº_Ð¿ÐµÑ‚Ð¾Ðº_ÑÐ°Ð±Ð¾Ñ‚Ð°".split("_"),weekdaysShort:"Ð½ÐµÐ´_Ð¿Ð¾Ð½_Ð²Ñ‚Ð¾_ÑÑ€Ðµ_Ñ‡ÐµÑ‚_Ð¿ÐµÑ‚_ÑÐ°Ð±".split("_"),weekdaysMin:"Ð½e_Ð¿o_Ð²Ñ‚_ÑÑ€_Ñ‡Ðµ_Ð¿Ðµ_Ña".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"D.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd, D MMMM YYYY H:mm"},calendar:{sameDay:"[Ð”ÐµÐ½ÐµÑ Ð²Ð¾] LT",nextDay:"[Ð£Ñ‚Ñ€Ðµ Ð²Ð¾] LT",nextWeek:"[Ð’Ð¾] dddd [Ð²Ð¾] LT",lastDay:"[Ð’Ñ‡ÐµÑ€Ð° Ð²Ð¾] LT",lastWeek:function(){switch(this.day()){case 0:case 3:case 6:return"[Ð˜Ð·Ð¼Ð¸Ð½Ð°Ñ‚Ð°Ñ‚Ð°] dddd [Ð²Ð¾] LT";case 1:case 2:case 4:case 5:return"[Ð˜Ð·Ð¼Ð¸Ð½Ð°Ñ‚Ð¸Ð¾Ñ‚] dddd [Ð²Ð¾] LT"}},sameElse:"L"},relativeTime:{future:"Ð·Ð° %s",past:"Ð¿Ñ€ÐµÐ´ %s",s:"Ð½ÐµÐºÐ¾Ð»ÐºÑƒ ÑÐµÐºÑƒÐ½Ð´Ð¸",ss:"%d ÑÐµÐºÑƒÐ½Ð´Ð¸",m:"ÐµÐ´Ð½Ð° Ð¼Ð¸Ð½ÑƒÑ‚Ð°",mm:"%d Ð¼Ð¸Ð½ÑƒÑ‚Ð¸",h:"ÐµÐ´ÐµÐ½ Ñ‡Ð°Ñ",hh:"%d Ñ‡Ð°ÑÐ°",d:"ÐµÐ´ÐµÐ½ Ð´ÐµÐ½",dd:"%d Ð´ÐµÐ½Ð°",M:"ÐµÐ´ÐµÐ½ Ð¼ÐµÑÐµÑ†",MM:"%d Ð¼ÐµÑÐµÑ†Ð¸",y:"ÐµÐ´Ð½Ð° Ð³Ð¾Ð´Ð¸Ð½Ð°",yy:"%d Ð³Ð¾Ð´Ð¸Ð½Ð¸"},dayOfMonthOrdinalParse:/\d{1,2}-(ÐµÐ²|ÐµÐ½|Ñ‚Ð¸|Ð²Ð¸|Ñ€Ð¸|Ð¼Ð¸)/,ordinal:function(e){var t=e%10,n=e%100;return 0===e?e+"-ÐµÐ²":0===n?e+"-ÐµÐ½":n>10&&n<20?e+"-Ñ‚Ð¸":1===t?e+"-Ð²Ð¸":2===t?e+"-Ñ€Ð¸":7===t||8===t?e+"-Ð¼Ð¸":e+"-Ñ‚Ð¸"},week:{dow:1,doy:7}})}(n(30381))},87341:function(e,t,n){!function(e){"use strict";e.defineLocale("ml",{months:"à´œà´¨àµà´µà´°à´¿_à´«àµ†à´¬àµà´°àµà´µà´°à´¿_à´®à´¾àµ¼à´šàµà´šàµ_à´à´ªàµà´°à´¿àµ½_à´®àµ‡à´¯àµ_à´œàµ‚àµº_à´œàµ‚à´²àµˆ_à´“à´—à´¸àµà´±àµà´±àµ_à´¸àµ†à´ªàµà´±àµà´±à´‚à´¬àµ¼_à´’à´•àµà´Ÿàµ‹à´¬àµ¼_à´¨à´µà´‚à´¬àµ¼_à´¡à´¿à´¸à´‚à´¬àµ¼".split("_"),monthsShort:"à´œà´¨àµ._à´«àµ†à´¬àµà´°àµ._à´®à´¾àµ¼._à´à´ªàµà´°à´¿._à´®àµ‡à´¯àµ_à´œàµ‚àµº_à´œàµ‚à´²àµˆ._à´“à´—._à´¸àµ†à´ªàµà´±àµà´±._à´’à´•àµà´Ÿàµ‹._à´¨à´µà´‚._à´¡à´¿à´¸à´‚.".split("_"),monthsParseExact:!0,weekdays:"à´žà´¾à´¯à´±à´¾à´´àµà´š_à´¤à´¿à´™àµà´•à´³à´¾à´´àµà´š_à´šàµŠà´µàµà´µà´¾à´´àµà´š_à´¬àµà´§à´¨à´¾à´´àµà´š_à´µàµà´¯à´¾à´´à´¾à´´àµà´š_à´µàµ†à´³àµà´³à´¿à´¯à´¾à´´àµà´š_à´¶à´¨à´¿à´¯à´¾à´´àµà´š".split("_"),weekdaysShort:"à´žà´¾à´¯àµ¼_à´¤à´¿à´™àµà´•àµ¾_à´šàµŠà´µàµà´µ_à´¬àµà´§àµ»_à´µàµà´¯à´¾à´´à´‚_à´µàµ†à´³àµà´³à´¿_à´¶à´¨à´¿".split("_"),weekdaysMin:"à´žà´¾_à´¤à´¿_à´šàµŠ_à´¬àµ_à´µàµà´¯à´¾_à´µàµ†_à´¶".split("_"),longDateFormat:{LT:"A h:mm -à´¨àµ",LTS:"A h:mm:ss -à´¨àµ",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm -à´¨àµ",LLLL:"dddd, D MMMM YYYY, A h:mm -à´¨àµ"},calendar:{sameDay:"[à´‡à´¨àµà´¨àµ] LT",nextDay:"[à´¨à´¾à´³àµ†] LT",nextWeek:"dddd, LT",lastDay:"[à´‡à´¨àµà´¨à´²àµ†] LT",lastWeek:"[à´•à´´à´¿à´žàµà´ž] dddd, LT",sameElse:"L"},relativeTime:{future:"%s à´•à´´à´¿à´žàµà´žàµ",past:"%s à´®àµàµ»à´ªàµ",s:"à´…àµ½à´ª à´¨à´¿à´®à´¿à´·à´™àµà´™àµ¾",ss:"%d à´¸àµ†à´•àµà´•àµ»à´¡àµ",m:"à´’à´°àµ à´®à´¿à´¨à´¿à´±àµà´±àµ",mm:"%d à´®à´¿à´¨à´¿à´±àµà´±àµ",h:"à´’à´°àµ à´®à´£à´¿à´•àµà´•àµ‚àµ¼",hh:"%d à´®à´£à´¿à´•àµà´•àµ‚àµ¼",d:"à´’à´°àµ à´¦à´¿à´µà´¸à´‚",dd:"%d à´¦à´¿à´µà´¸à´‚",M:"à´’à´°àµ à´®à´¾à´¸à´‚",MM:"%d à´®à´¾à´¸à´‚",y:"à´’à´°àµ à´µàµ¼à´·à´‚",yy:"%d à´µàµ¼à´·à´‚"},meridiemParse:/à´°à´¾à´¤àµà´°à´¿|à´°à´¾à´µà´¿à´²àµ†|à´‰à´šàµà´š à´•à´´à´¿à´žàµà´žàµ|à´µàµˆà´•àµà´¨àµà´¨àµ‡à´°à´‚|à´°à´¾à´¤àµà´°à´¿/i,meridiemHour:function(e,t){return 12===e&&(e=0),"à´°à´¾à´¤àµà´°à´¿"===t&&e>=4||"à´‰à´šàµà´š à´•à´´à´¿à´žàµà´žàµ"===t||"à´µàµˆà´•àµà´¨àµà´¨àµ‡à´°à´‚"===t?e+12:e},meridiem:function(e,t,n){return e<4?"à´°à´¾à´¤àµà´°à´¿":e<12?"à´°à´¾à´µà´¿à´²àµ†":e<17?"à´‰à´šàµà´š à´•à´´à´¿à´žàµà´žàµ":e<20?"à´µàµˆà´•àµà´¨àµà´¨àµ‡à´°à´‚":"à´°à´¾à´¤àµà´°à´¿"}})}(n(30381))},5115:function(e,t,n){!function(e){"use strict";function t(e,t,n,r){switch(n){case"s":return t?"Ñ…ÑÐ´Ñ…ÑÐ½ ÑÐµÐºÑƒÐ½Ð´":"Ñ…ÑÐ´Ñ…ÑÐ½ ÑÐµÐºÑƒÐ½Ð´Ñ‹Ð½";case"ss":return e+(t?" ÑÐµÐºÑƒÐ½Ð´":" ÑÐµÐºÑƒÐ½Ð´Ñ‹Ð½");case"m":case"mm":return e+(t?" Ð¼Ð¸Ð½ÑƒÑ‚":" Ð¼Ð¸Ð½ÑƒÑ‚Ñ‹Ð½");case"h":case"hh":return e+(t?" Ñ†Ð°Ð³":" Ñ†Ð°Ð³Ð¸Ð¹Ð½");case"d":case"dd":return e+(t?" Ó©Ð´Ó©Ñ€":" Ó©Ð´Ñ€Ð¸Ð¹Ð½");case"M":case"MM":return e+(t?" ÑÐ°Ñ€":" ÑÐ°Ñ€Ñ‹Ð½");case"y":case"yy":return e+(t?" Ð¶Ð¸Ð»":" Ð¶Ð¸Ð»Ð¸Ð¹Ð½");default:return e}}e.defineLocale("mn",{months:"ÐÑÐ³Ð´Ò¯Ð³ÑÑÑ€ ÑÐ°Ñ€_Ð¥Ð¾Ñ‘Ñ€Ð´ÑƒÐ³Ð°Ð°Ñ€ ÑÐ°Ñ€_Ð“ÑƒÑ€Ð°Ð²Ð´ÑƒÐ³Ð°Ð°Ñ€ ÑÐ°Ñ€_Ð”Ó©Ñ€Ó©Ð²Ð´Ò¯Ð³ÑÑÑ€ ÑÐ°Ñ€_Ð¢Ð°Ð²Ð´ÑƒÐ³Ð°Ð°Ñ€ ÑÐ°Ñ€_Ð—ÑƒÑ€Ð³Ð°Ð´ÑƒÐ³Ð°Ð°Ñ€ ÑÐ°Ñ€_Ð”Ð¾Ð»Ð´ÑƒÐ³Ð°Ð°Ñ€ ÑÐ°Ñ€_ÐÐ°Ð¹Ð¼Ð´ÑƒÐ³Ð°Ð°Ñ€ ÑÐ°Ñ€_Ð•ÑÐ´Ò¯Ð³ÑÑÑ€ ÑÐ°Ñ€_ÐÑ€Ð°Ð²Ð´ÑƒÐ³Ð°Ð°Ñ€ ÑÐ°Ñ€_ÐÑ€Ð²Ð°Ð½ Ð½ÑÐ³Ð´Ò¯Ð³ÑÑÑ€ ÑÐ°Ñ€_ÐÑ€Ð²Ð°Ð½ Ñ…Ð¾Ñ‘Ñ€Ð´ÑƒÐ³Ð°Ð°Ñ€ ÑÐ°Ñ€".split("_"),monthsShort:"1 ÑÐ°Ñ€_2 ÑÐ°Ñ€_3 ÑÐ°Ñ€_4 ÑÐ°Ñ€_5 ÑÐ°Ñ€_6 ÑÐ°Ñ€_7 ÑÐ°Ñ€_8 ÑÐ°Ñ€_9 ÑÐ°Ñ€_10 ÑÐ°Ñ€_11 ÑÐ°Ñ€_12 ÑÐ°Ñ€".split("_"),monthsParseExact:!0,weekdays:"ÐÑÐ¼_Ð”Ð°Ð²Ð°Ð°_ÐœÑÐ³Ð¼Ð°Ñ€_Ð›Ñ…Ð°Ð³Ð²Ð°_ÐŸÒ¯Ñ€ÑÐ²_Ð‘Ð°Ð°ÑÐ°Ð½_Ð‘ÑÐ¼Ð±Ð°".split("_"),weekdaysShort:"ÐÑÐ¼_Ð”Ð°Ð²_ÐœÑÐ³_Ð›Ñ…Ð°_ÐŸÒ¯Ñ€_Ð‘Ð°Ð°_Ð‘ÑÐ¼".split("_"),weekdaysMin:"ÐÑ_Ð”Ð°_ÐœÑ_Ð›Ñ…_ÐŸÒ¯_Ð‘Ð°_Ð‘Ñ".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"YYYY Ð¾Ð½Ñ‹ MMMMÑ‹Ð½ D",LLL:"YYYY Ð¾Ð½Ñ‹ MMMMÑ‹Ð½ D HH:mm",LLLL:"dddd, YYYY Ð¾Ð½Ñ‹ MMMMÑ‹Ð½ D HH:mm"},meridiemParse:/Ò®Ó¨|Ò®Ð¥/i,isPM:function(e){return"Ò®Ð¥"===e},meridiem:function(e,t,n){return e<12?"Ò®Ó¨":"Ò®Ð¥"},calendar:{sameDay:"[Ó¨Ð½Ó©Ó©Ð´Ó©Ñ€] LT",nextDay:"[ÐœÐ°Ñ€Ð³Ð°Ð°Ñˆ] LT",nextWeek:"[Ð˜Ñ€ÑÑ…] dddd LT",lastDay:"[Ó¨Ñ‡Ð¸Ð³Ð´Ó©Ñ€] LT",lastWeek:"[Ó¨Ð½Ð³Ó©Ñ€ÑÓ©Ð½] dddd LT",sameElse:"L"},relativeTime:{future:"%s Ð´Ð°Ñ€Ð°Ð°",past:"%s Ó©Ð¼Ð½Ó©",s:t,ss:t,m:t,mm:t,h:t,hh:t,d:t,dd:t,M:t,MM:t,y:t,yy:t},dayOfMonthOrdinalParse:/\d{1,2} Ó©Ð´Ó©Ñ€/,ordinal:function(e,t){switch(t){case"d":case"D":case"DDD":return e+" Ó©Ð´Ó©Ñ€";default:return e}}})}(n(30381))},10370:function(e,t,n){!function(e){"use strict";var t={1:"à¥§",2:"à¥¨",3:"à¥©",4:"à¥ª",5:"à¥«",6:"à¥¬",7:"à¥­",8:"à¥®",9:"à¥¯",0:"à¥¦"},n={"à¥§":"1","à¥¨":"2","à¥©":"3","à¥ª":"4","à¥«":"5","à¥¬":"6","à¥­":"7","à¥®":"8","à¥¯":"9","à¥¦":"0"};function r(e,t,n,r){var a="";if(t)switch(n){case"s":a="à¤•à¤¾à¤¹à¥€ à¤¸à¥‡à¤•à¤‚à¤¦";break;case"ss":a="%d à¤¸à¥‡à¤•à¤‚à¤¦";break;case"m":a="à¤à¤• à¤®à¤¿à¤¨à¤¿à¤Ÿ";break;case"mm":a="%d à¤®à¤¿à¤¨à¤¿à¤Ÿà¥‡";break;case"h":a="à¤à¤• à¤¤à¤¾à¤¸";break;case"hh":a="%d à¤¤à¤¾à¤¸";break;case"d":a="à¤à¤• à¤¦à¤¿à¤µà¤¸";break;case"dd":a="%d à¤¦à¤¿à¤µà¤¸";break;case"M":a="à¤à¤• à¤®à¤¹à¤¿à¤¨à¤¾";break;case"MM":a="%d à¤®à¤¹à¤¿à¤¨à¥‡";break;case"y":a="à¤à¤• à¤µà¤°à¥à¤·";break;case"yy":a="%d à¤µà¤°à¥à¤·à¥‡"}else switch(n){case"s":a="à¤•à¤¾à¤¹à¥€ à¤¸à¥‡à¤•à¤‚à¤¦à¤¾à¤‚";break;case"ss":a="%d à¤¸à¥‡à¤•à¤‚à¤¦à¤¾à¤‚";break;case"m":a="à¤à¤•à¤¾ à¤®à¤¿à¤¨à¤¿à¤Ÿà¤¾";break;case"mm":a="%d à¤®à¤¿à¤¨à¤¿à¤Ÿà¤¾à¤‚";break;case"h":a="à¤à¤•à¤¾ à¤¤à¤¾à¤¸à¤¾";break;case"hh":a="%d à¤¤à¤¾à¤¸à¤¾à¤‚";break;case"d":a="à¤à¤•à¤¾ à¤¦à¤¿à¤µà¤¸à¤¾";break;case"dd":a="%d à¤¦à¤¿à¤µà¤¸à¤¾à¤‚";break;case"M":a="à¤à¤•à¤¾ à¤®à¤¹à¤¿à¤¨à¥à¤¯à¤¾";break;case"MM":a="%d à¤®à¤¹à¤¿à¤¨à¥à¤¯à¤¾à¤‚";break;case"y":a="à¤à¤•à¤¾ à¤µà¤°à¥à¤·à¤¾";break;case"yy":a="%d à¤µà¤°à¥à¤·à¤¾à¤‚"}return a.replace(/%d/i,e)}e.defineLocale("mr",{months:"à¤œà¤¾à¤¨à¥‡à¤µà¤¾à¤°à¥€_à¤«à¥‡à¤¬à¥à¤°à¥à¤µà¤¾à¤°à¥€_à¤®à¤¾à¤°à¥à¤š_à¤à¤ªà¥à¤°à¤¿à¤²_à¤®à¥‡_à¤œà¥‚à¤¨_à¤œà¥à¤²à¥ˆ_à¤‘à¤—à¤¸à¥à¤Ÿ_à¤¸à¤ªà¥à¤Ÿà¥‡à¤‚à¤¬à¤°_à¤‘à¤•à¥à¤Ÿà¥‹à¤¬à¤°_à¤¨à¥‹à¤µà¥à¤¹à¥‡à¤‚à¤¬à¤°_à¤¡à¤¿à¤¸à¥‡à¤‚à¤¬à¤°".split("_"),monthsShort:"à¤œà¤¾à¤¨à¥‡._à¤«à¥‡à¤¬à¥à¤°à¥._à¤®à¤¾à¤°à¥à¤š._à¤à¤ªà¥à¤°à¤¿._à¤®à¥‡._à¤œà¥‚à¤¨._à¤œà¥à¤²à¥ˆ._à¤‘à¤—._à¤¸à¤ªà¥à¤Ÿà¥‡à¤‚._à¤‘à¤•à¥à¤Ÿà¥‹._à¤¨à¥‹à¤µà¥à¤¹à¥‡à¤‚._à¤¡à¤¿à¤¸à¥‡à¤‚.".split("_"),monthsParseExact:!0,weekdays:"à¤°à¤µà¤¿à¤µà¤¾à¤°_à¤¸à¥‹à¤®à¤µà¤¾à¤°_à¤®à¤‚à¤—à¤³à¤µà¤¾à¤°_à¤¬à¥à¤§à¤µà¤¾à¤°_à¤—à¥à¤°à¥‚à¤µà¤¾à¤°_à¤¶à¥à¤•à¥à¤°à¤µà¤¾à¤°_à¤¶à¤¨à¤¿à¤µà¤¾à¤°".split("_"),weekdaysShort:"à¤°à¤µà¤¿_à¤¸à¥‹à¤®_à¤®à¤‚à¤—à¤³_à¤¬à¥à¤§_à¤—à¥à¤°à¥‚_à¤¶à¥à¤•à¥à¤°_à¤¶à¤¨à¤¿".split("_"),weekdaysMin:"à¤°_à¤¸à¥‹_à¤®à¤‚_à¤¬à¥_à¤—à¥_à¤¶à¥_à¤¶".split("_"),longDateFormat:{LT:"A h:mm à¤µà¤¾à¤œà¤¤à¤¾",LTS:"A h:mm:ss à¤µà¤¾à¤œà¤¤à¤¾",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm à¤µà¤¾à¤œà¤¤à¤¾",LLLL:"dddd, D MMMM YYYY, A h:mm à¤µà¤¾à¤œà¤¤à¤¾"},calendar:{sameDay:"[à¤†à¤œ] LT",nextDay:"[à¤‰à¤¦à¥à¤¯à¤¾] LT",nextWeek:"dddd, LT",lastDay:"[à¤•à¤¾à¤²] LT",lastWeek:"[à¤®à¤¾à¤—à¥€à¤²] dddd, LT",sameElse:"L"},relativeTime:{future:"%sà¤®à¤§à¥à¤¯à¥‡",past:"%sà¤ªà¥‚à¤°à¥à¤µà¥€",s:r,ss:r,m:r,mm:r,h:r,hh:r,d:r,dd:r,M:r,MM:r,y:r,yy:r},preparse:function(e){return e.replace(/[à¥§à¥¨à¥©à¥ªà¥«à¥¬à¥­à¥®à¥¯à¥¦]/g,(function(e){return n[e]}))},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]}))},meridiemParse:/à¤ªà¤¹à¤¾à¤Ÿà¥‡|à¤¸à¤•à¤¾à¤³à¥€|à¤¦à¥à¤ªà¤¾à¤°à¥€|à¤¸à¤¾à¤¯à¤‚à¤•à¤¾à¤³à¥€|à¤°à¤¾à¤¤à¥à¤°à¥€/,meridiemHour:function(e,t){return 12===e&&(e=0),"à¤ªà¤¹à¤¾à¤Ÿà¥‡"===t||"à¤¸à¤•à¤¾à¤³à¥€"===t?e:"à¤¦à¥à¤ªà¤¾à¤°à¥€"===t||"à¤¸à¤¾à¤¯à¤‚à¤•à¤¾à¤³à¥€"===t||"à¤°à¤¾à¤¤à¥à¤°à¥€"===t?e>=12?e:e+12:void 0},meridiem:function(e,t,n){return e>=0&&e<6?"à¤ªà¤¹à¤¾à¤Ÿà¥‡":e<12?"à¤¸à¤•à¤¾à¤³à¥€":e<17?"à¤¦à¥à¤ªà¤¾à¤°à¥€":e<20?"à¤¸à¤¾à¤¯à¤‚à¤•à¤¾à¤³à¥€":"à¤°à¤¾à¤¤à¥à¤°à¥€"},week:{dow:0,doy:6}})}(n(30381))},41237:function(e,t,n){!function(e){"use strict";e.defineLocale("ms-my",{months:"Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember".split("_"),monthsShort:"Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis".split("_"),weekdays:"Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu".split("_"),weekdaysShort:"Ahd_Isn_Sel_Rab_Kha_Jum_Sab".split("_"),weekdaysMin:"Ah_Is_Sl_Rb_Km_Jm_Sb".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] HH.mm",LLLL:"dddd, D MMMM YYYY [pukul] HH.mm"},meridiemParse:/pagi|tengahari|petang|malam/,meridiemHour:function(e,t){return 12===e&&(e=0),"pagi"===t?e:"tengahari"===t?e>=11?e:e+12:"petang"===t||"malam"===t?e+12:void 0},meridiem:function(e,t,n){return e<11?"pagi":e<15?"tengahari":e<19?"petang":"malam"},calendar:{sameDay:"[Hari ini pukul] LT",nextDay:"[Esok pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kelmarin pukul] LT",lastWeek:"dddd [lepas pukul] LT",sameElse:"L"},relativeTime:{future:"dalam %s",past:"%s yang lepas",s:"beberapa saat",ss:"%d saat",m:"seminit",mm:"%d minit",h:"sejam",hh:"%d jam",d:"sehari",dd:"%d hari",M:"sebulan",MM:"%d bulan",y:"setahun",yy:"%d tahun"},week:{dow:1,doy:7}})}(n(30381))},9847:function(e,t,n){!function(e){"use strict";e.defineLocale("ms",{months:"Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember".split("_"),monthsShort:"Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis".split("_"),weekdays:"Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu".split("_"),weekdaysShort:"Ahd_Isn_Sel_Rab_Kha_Jum_Sab".split("_"),weekdaysMin:"Ah_Is_Sl_Rb_Km_Jm_Sb".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] HH.mm",LLLL:"dddd, D MMMM YYYY [pukul] HH.mm"},meridiemParse:/pagi|tengahari|petang|malam/,meridiemHour:function(e,t){return 12===e&&(e=0),"pagi"===t?e:"tengahari"===t?e>=11?e:e+12:"petang"===t||"malam"===t?e+12:void 0},meridiem:function(e,t,n){return e<11?"pagi":e<15?"tengahari":e<19?"petang":"malam"},calendar:{sameDay:"[Hari ini pukul] LT",nextDay:"[Esok pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kelmarin pukul] LT",lastWeek:"dddd [lepas pukul] LT",sameElse:"L"},relativeTime:{future:"dalam %s",past:"%s yang lepas",s:"beberapa saat",ss:"%d saat",m:"seminit",mm:"%d minit",h:"sejam",hh:"%d jam",d:"sehari",dd:"%d hari",M:"sebulan",MM:"%d bulan",y:"setahun",yy:"%d tahun"},week:{dow:1,doy:7}})}(n(30381))},72126:function(e,t,n){!function(e){"use strict";e.defineLocale("mt",{months:"Jannar_Frar_Marzu_April_Mejju_Ä unju_Lulju_Awwissu_Settembru_Ottubru_Novembru_DiÄ‹embru".split("_"),monthsShort:"Jan_Fra_Mar_Apr_Mej_Ä un_Lul_Aww_Set_Ott_Nov_DiÄ‹".split("_"),weekdays:"Il-Ä¦add_It-Tnejn_It-Tlieta_L-ErbgÄ§a_Il-Ä¦amis_Il-Ä imgÄ§a_Is-Sibt".split("_"),weekdaysShort:"Ä¦ad_Tne_Tli_Erb_Ä¦am_Ä im_Sib".split("_"),weekdaysMin:"Ä¦a_Tn_Tl_Er_Ä¦a_Ä i_Si".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Illum fil-]LT",nextDay:"[GÄ§ada fil-]LT",nextWeek:"dddd [fil-]LT",lastDay:"[Il-bieraÄ§ fil-]LT",lastWeek:"dddd [li gÄ§adda] [fil-]LT",sameElse:"L"},relativeTime:{future:"fâ€™ %s",past:"%s ilu",s:"ftit sekondi",ss:"%d sekondi",m:"minuta",mm:"%d minuti",h:"siegÄ§a",hh:"%d siegÄ§at",d:"Ä¡urnata",dd:"%d Ä¡ranet",M:"xahar",MM:"%d xhur",y:"sena",yy:"%d sni"},dayOfMonthOrdinalParse:/\d{1,2}Âº/,ordinal:"%dÂº",week:{dow:1,doy:4}})}(n(30381))},56165:function(e,t,n){!function(e){"use strict";var t={1:"á",2:"á‚",3:"áƒ",4:"á„",5:"á…",6:"á†",7:"á‡",8:"áˆ",9:"á‰",0:"á€"},n={"á":"1","á‚":"2","áƒ":"3","á„":"4","á…":"5","á†":"6","á‡":"7","áˆ":"8","á‰":"9","á€":"0"};e.defineLocale("my",{months:"á€‡á€”á€ºá€”á€á€«á€›á€®_á€–á€±á€–á€±á€¬á€ºá€á€«á€›á€®_á€™á€á€º_á€§á€•á€¼á€®_á€™á€±_á€‡á€½á€”á€º_á€‡á€°á€œá€­á€¯á€„á€º_á€žá€¼á€‚á€¯á€á€º_á€…á€€á€ºá€á€„á€ºá€˜á€¬_á€¡á€±á€¬á€€á€ºá€á€­á€¯á€˜á€¬_á€”á€­á€¯á€á€„á€ºá€˜á€¬_á€’á€®á€‡á€„á€ºá€˜á€¬".split("_"),monthsShort:"á€‡á€”á€º_á€–á€±_á€™á€á€º_á€•á€¼á€®_á€™á€±_á€‡á€½á€”á€º_á€œá€­á€¯á€„á€º_á€žá€¼_á€…á€€á€º_á€¡á€±á€¬á€€á€º_á€”á€­á€¯_á€’á€®".split("_"),weekdays:"á€á€”á€„á€ºá€¹á€‚á€”á€½á€±_á€á€”á€„á€ºá€¹á€œá€¬_á€¡á€„á€ºá€¹á€‚á€«_á€—á€¯á€’á€¹á€“á€Ÿá€°á€¸_á€€á€¼á€¬á€žá€•á€á€±á€¸_á€žá€±á€¬á€€á€¼á€¬_á€…á€”á€±".split("_"),weekdaysShort:"á€”á€½á€±_á€œá€¬_á€‚á€«_á€Ÿá€°á€¸_á€€á€¼á€¬_á€žá€±á€¬_á€”á€±".split("_"),weekdaysMin:"á€”á€½á€±_á€œá€¬_á€‚á€«_á€Ÿá€°á€¸_á€€á€¼á€¬_á€žá€±á€¬_á€”á€±".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[á€šá€”á€±.] LT [á€™á€¾á€¬]",nextDay:"[á€™á€”á€€á€ºá€–á€¼á€”á€º] LT [á€™á€¾á€¬]",nextWeek:"dddd LT [á€™á€¾á€¬]",lastDay:"[á€™á€”á€±.á€€] LT [á€™á€¾á€¬]",lastWeek:"[á€•á€¼á€®á€¸á€á€²á€·á€žá€±á€¬] dddd LT [á€™á€¾á€¬]",sameElse:"L"},relativeTime:{future:"á€œá€¬á€™á€Šá€ºá€· %s á€™á€¾á€¬",past:"á€œá€½á€”á€ºá€á€²á€·á€žá€±á€¬ %s á€€",s:"á€…á€€á€¹á€€á€”á€º.á€¡á€”á€Šá€ºá€¸á€„á€šá€º",ss:"%d á€…á€€á€¹á€€á€”á€·á€º",m:"á€á€…á€ºá€™á€­á€”á€…á€º",mm:"%d á€™á€­á€”á€…á€º",h:"á€á€…á€ºá€”á€¬á€›á€®",hh:"%d á€”á€¬á€›á€®",d:"á€á€…á€ºá€›á€€á€º",dd:"%d á€›á€€á€º",M:"á€á€…á€ºá€œ",MM:"%d á€œ",y:"á€á€…á€ºá€”á€¾á€…á€º",yy:"%d á€”á€¾á€…á€º"},preparse:function(e){return e.replace(/[áá‚áƒá„á…á†á‡áˆá‰á€]/g,(function(e){return n[e]}))},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]}))},week:{dow:1,doy:4}})}(n(30381))},64924:function(e,t,n){!function(e){"use strict";e.defineLocale("nb",{months:"januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan._feb._mars_apr._mai_juni_juli_aug._sep._okt._nov._des.".split("_"),monthsParseExact:!0,weekdays:"sÃ¸ndag_mandag_tirsdag_onsdag_torsdag_fredag_lÃ¸rdag".split("_"),weekdaysShort:"sÃ¸._ma._ti._on._to._fr._lÃ¸.".split("_"),weekdaysMin:"sÃ¸_ma_ti_on_to_fr_lÃ¸".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY [kl.] HH:mm",LLLL:"dddd D. MMMM YYYY [kl.] HH:mm"},calendar:{sameDay:"[i dag kl.] LT",nextDay:"[i morgen kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[i gÃ¥r kl.] LT",lastWeek:"[forrige] dddd [kl.] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"%s siden",s:"noen sekunder",ss:"%d sekunder",m:"ett minutt",mm:"%d minutter",h:"en time",hh:"%d timer",d:"en dag",dd:"%d dager",w:"en uke",ww:"%d uker",M:"en mÃ¥ned",MM:"%d mÃ¥neder",y:"ett Ã¥r",yy:"%d Ã¥r"},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}(n(30381))},16744:function(e,t,n){!function(e){"use strict";var t={1:"à¥§",2:"à¥¨",3:"à¥©",4:"à¥ª",5:"à¥«",6:"à¥¬",7:"à¥­",8:"à¥®",9:"à¥¯",0:"à¥¦"},n={"à¥§":"1","à¥¨":"2","à¥©":"3","à¥ª":"4","à¥«":"5","à¥¬":"6","à¥­":"7","à¥®":"8","à¥¯":"9","à¥¦":"0"};e.defineLocale("ne",{months:"à¤œà¤¨à¤µà¤°à¥€_à¤«à¥‡à¤¬à¥à¤°à¥à¤µà¤°à¥€_à¤®à¤¾à¤°à¥à¤š_à¤…à¤ªà¥à¤°à¤¿à¤²_à¤®à¤ˆ_à¤œà¥à¤¨_à¤œà¥à¤²à¤¾à¤ˆ_à¤…à¤—à¤·à¥à¤Ÿ_à¤¸à¥‡à¤ªà¥à¤Ÿà¥‡à¤®à¥à¤¬à¤°_à¤…à¤•à¥à¤Ÿà¥‹à¤¬à¤°_à¤¨à¥‹à¤­à¥‡à¤®à¥à¤¬à¤°_à¤¡à¤¿à¤¸à¥‡à¤®à¥à¤¬à¤°".split("_"),monthsShort:"à¤œà¤¨._à¤«à¥‡à¤¬à¥à¤°à¥._à¤®à¤¾à¤°à¥à¤š_à¤…à¤ªà¥à¤°à¤¿._à¤®à¤ˆ_à¤œà¥à¤¨_à¤œà¥à¤²à¤¾à¤ˆ._à¤…à¤—._à¤¸à¥‡à¤ªà¥à¤Ÿ._à¤…à¤•à¥à¤Ÿà¥‹._à¤¨à¥‹à¤­à¥‡._à¤¡à¤¿à¤¸à¥‡.".split("_"),monthsParseExact:!0,weekdays:"à¤†à¤‡à¤¤à¤¬à¤¾à¤°_à¤¸à¥‹à¤®à¤¬à¤¾à¤°_à¤®à¤™à¥à¤—à¤²à¤¬à¤¾à¤°_à¤¬à¥à¤§à¤¬à¤¾à¤°_à¤¬à¤¿à¤¹à¤¿à¤¬à¤¾à¤°_à¤¶à¥à¤•à¥à¤°à¤¬à¤¾à¤°_à¤¶à¤¨à¤¿à¤¬à¤¾à¤°".split("_"),weekdaysShort:"à¤†à¤‡à¤¤._à¤¸à¥‹à¤®._à¤®à¤™à¥à¤—à¤²._à¤¬à¥à¤§._à¤¬à¤¿à¤¹à¤¿._à¤¶à¥à¤•à¥à¤°._à¤¶à¤¨à¤¿.".split("_"),weekdaysMin:"à¤†._à¤¸à¥‹._à¤®à¤‚._à¤¬à¥._à¤¬à¤¿._à¤¶à¥._à¤¶.".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"Aà¤•à¥‹ h:mm à¤¬à¤œà¥‡",LTS:"Aà¤•à¥‹ h:mm:ss à¤¬à¤œà¥‡",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, Aà¤•à¥‹ h:mm à¤¬à¤œà¥‡",LLLL:"dddd, D MMMM YYYY, Aà¤•à¥‹ h:mm à¤¬à¤œà¥‡"},preparse:function(e){return e.replace(/[à¥§à¥¨à¥©à¥ªà¥«à¥¬à¥­à¥®à¥¯à¥¦]/g,(function(e){return n[e]}))},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]}))},meridiemParse:/à¤°à¤¾à¤¤à¤¿|à¤¬à¤¿à¤¹à¤¾à¤¨|à¤¦à¤¿à¤‰à¤à¤¸à¥‹|à¤¸à¤¾à¤à¤/,meridiemHour:function(e,t){return 12===e&&(e=0),"à¤°à¤¾à¤¤à¤¿"===t?e<4?e:e+12:"à¤¬à¤¿à¤¹à¤¾à¤¨"===t?e:"à¤¦à¤¿à¤‰à¤à¤¸à¥‹"===t?e>=10?e:e+12:"à¤¸à¤¾à¤à¤"===t?e+12:void 0},meridiem:function(e,t,n){return e<3?"à¤°à¤¾à¤¤à¤¿":e<12?"à¤¬à¤¿à¤¹à¤¾à¤¨":e<16?"à¤¦à¤¿à¤‰à¤à¤¸à¥‹":e<20?"à¤¸à¤¾à¤à¤":"à¤°à¤¾à¤¤à¤¿"},calendar:{sameDay:"[à¤†à¤œ] LT",nextDay:"[à¤­à¥‹à¤²à¤¿] LT",nextWeek:"[à¤†à¤‰à¤à¤¦à¥‹] dddd[,] LT",lastDay:"[à¤¹à¤¿à¤œà¥‹] LT",lastWeek:"[à¤—à¤à¤•à¥‹] dddd[,] LT",sameElse:"L"},relativeTime:{future:"%sà¤®à¤¾",past:"%s à¤…à¤—à¤¾à¤¡à¤¿",s:"à¤•à¥‡à¤¹à¥€ à¤•à¥à¤·à¤£",ss:"%d à¤¸à¥‡à¤•à¥‡à¤£à¥à¤¡",m:"à¤à¤• à¤®à¤¿à¤¨à¥‡à¤Ÿ",mm:"%d à¤®à¤¿à¤¨à¥‡à¤Ÿ",h:"à¤à¤• à¤˜à¤£à¥à¤Ÿà¤¾",hh:"%d à¤˜à¤£à¥à¤Ÿà¤¾",d:"à¤à¤• à¤¦à¤¿à¤¨",dd:"%d à¤¦à¤¿à¤¨",M:"à¤à¤• à¤®à¤¹à¤¿à¤¨à¤¾",MM:"%d à¤®à¤¹à¤¿à¤¨à¤¾",y:"à¤à¤• à¤¬à¤°à¥à¤·",yy:"%d à¤¬à¤°à¥à¤·"},week:{dow:0,doy:6}})}(n(30381))},59814:function(e,t,n){!function(e){"use strict";var t="jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.".split("_"),n="jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split("_"),r=[/^jan/i,/^feb/i,/^maart|mrt.?$/i,/^apr/i,/^mei$/i,/^jun[i.]?$/i,/^jul[i.]?$/i,/^aug/i,/^sep/i,/^okt/i,/^nov/i,/^dec/i],a=/^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;e.defineLocale("nl-be",{months:"januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split("_"),monthsShort:function(e,r){return e?/-MMM-/.test(r)?n[e.month()]:t[e.month()]:t},monthsRegex:a,monthsShortRegex:a,monthsStrictRegex:/^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december)/i,monthsShortStrictRegex:/^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,monthsParse:r,longMonthsParse:r,shortMonthsParse:r,weekdays:"zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split("_"),weekdaysShort:"zo._ma._di._wo._do._vr._za.".split("_"),weekdaysMin:"zo_ma_di_wo_do_vr_za".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[vandaag om] LT",nextDay:"[morgen om] LT",nextWeek:"dddd [om] LT",lastDay:"[gisteren om] LT",lastWeek:"[afgelopen] dddd [om] LT",sameElse:"L"},relativeTime:{future:"over %s",past:"%s geleden",s:"een paar seconden",ss:"%d seconden",m:"Ã©Ã©n minuut",mm:"%d minuten",h:"Ã©Ã©n uur",hh:"%d uur",d:"Ã©Ã©n dag",dd:"%d dagen",M:"Ã©Ã©n maand",MM:"%d maanden",y:"Ã©Ã©n jaar",yy:"%d jaar"},dayOfMonthOrdinalParse:/\d{1,2}(ste|de)/,ordinal:function(e){return e+(1===e||8===e||e>=20?"ste":"de")},week:{dow:1,doy:4}})}(n(30381))},93901:function(e,t,n){!function(e){"use strict";var t="jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.".split("_"),n="jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split("_"),r=[/^jan/i,/^feb/i,/^maart|mrt.?$/i,/^apr/i,/^mei$/i,/^jun[i.]?$/i,/^jul[i.]?$/i,/^aug/i,/^sep/i,/^okt/i,/^nov/i,/^dec/i],a=/^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;e.defineLocale("nl",{months:"januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split("_"),monthsShort:function(e,r){return e?/-MMM-/.test(r)?n[e.month()]:t[e.month()]:t},monthsRegex:a,monthsShortRegex:a,monthsStrictRegex:/^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december)/i,monthsShortStrictRegex:/^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,monthsParse:r,longMonthsParse:r,shortMonthsParse:r,weekdays:"zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split("_"),weekdaysShort:"zo._ma._di._wo._do._vr._za.".split("_"),weekdaysMin:"zo_ma_di_wo_do_vr_za".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[vandaag om] LT",nextDay:"[morgen om] LT",nextWeek:"dddd [om] LT",lastDay:"[gisteren om] LT",lastWeek:"[afgelopen] dddd [om] LT",sameElse:"L"},relativeTime:{future:"over %s",past:"%s geleden",s:"een paar seconden",ss:"%d seconden",m:"Ã©Ã©n minuut",mm:"%d minuten",h:"Ã©Ã©n uur",hh:"%d uur",d:"Ã©Ã©n dag",dd:"%d dagen",w:"Ã©Ã©n week",ww:"%d weken",M:"Ã©Ã©n maand",MM:"%d maanden",y:"Ã©Ã©n jaar",yy:"%d jaar"},dayOfMonthOrdinalParse:/\d{1,2}(ste|de)/,ordinal:function(e){return e+(1===e||8===e||e>=20?"ste":"de")},week:{dow:1,doy:4}})}(n(30381))},83877:function(e,t,n){!function(e){"use strict";e.defineLocale("nn",{months:"januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan._feb._mars_apr._mai_juni_juli_aug._sep._okt._nov._des.".split("_"),monthsParseExact:!0,weekdays:"sundag_mÃ¥ndag_tysdag_onsdag_torsdag_fredag_laurdag".split("_"),weekdaysShort:"su._mÃ¥._ty._on._to._fr._lau.".split("_"),weekdaysMin:"su_mÃ¥_ty_on_to_fr_la".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY [kl.] H:mm",LLLL:"dddd D. MMMM YYYY [kl.] HH:mm"},calendar:{sameDay:"[I dag klokka] LT",nextDay:"[I morgon klokka] LT",nextWeek:"dddd [klokka] LT",lastDay:"[I gÃ¥r klokka] LT",lastWeek:"[FÃ¸regÃ¥ande] dddd [klokka] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"%s sidan",s:"nokre sekund",ss:"%d sekund",m:"eit minutt",mm:"%d minutt",h:"ein time",hh:"%d timar",d:"ein dag",dd:"%d dagar",w:"ei veke",ww:"%d veker",M:"ein mÃ¥nad",MM:"%d mÃ¥nader",y:"eit Ã¥r",yy:"%d Ã¥r"},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}(n(30381))},92135:function(e,t,n){!function(e){"use strict";e.defineLocale("oc-lnc",{months:{standalone:"geniÃ¨r_febriÃ¨r_marÃ§_abril_mai_junh_julhet_agost_setembre_octÃ²bre_novembre_decembre".split("_"),format:"de geniÃ¨r_de febriÃ¨r_de marÃ§_d'abril_de mai_de junh_de julhet_d'agost_de setembre_d'octÃ²bre_de novembre_de decembre".split("_"),isFormat:/D[oD]?(\s)+MMMM/},monthsShort:"gen._febr._marÃ§_abr._mai_junh_julh._ago._set._oct._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"dimenge_diluns_dimars_dimÃ¨cres_dijÃ²us_divendres_dissabte".split("_"),weekdaysShort:"dg._dl._dm._dc._dj._dv._ds.".split("_"),weekdaysMin:"dg_dl_dm_dc_dj_dv_ds".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM [de] YYYY",ll:"D MMM YYYY",LLL:"D MMMM [de] YYYY [a] H:mm",lll:"D MMM YYYY, H:mm",LLLL:"dddd D MMMM [de] YYYY [a] H:mm",llll:"ddd D MMM YYYY, H:mm"},calendar:{sameDay:"[uÃ¨i a] LT",nextDay:"[deman a] LT",nextWeek:"dddd [a] LT",lastDay:"[iÃ¨r a] LT",lastWeek:"dddd [passat a] LT",sameElse:"L"},relativeTime:{future:"d'aquÃ­ %s",past:"fa %s",s:"unas segondas",ss:"%d segondas",m:"una minuta",mm:"%d minutas",h:"una ora",hh:"%d oras",d:"un jorn",dd:"%d jorns",M:"un mes",MM:"%d meses",y:"un an",yy:"%d ans"},dayOfMonthOrdinalParse:/\d{1,2}(r|n|t|Ã¨|a)/,ordinal:function(e,t){var n=1===e?"r":2===e?"n":3===e?"r":4===e?"t":"Ã¨";return"w"!==t&&"W"!==t||(n="a"),e+n},week:{dow:1,doy:4}})}(n(30381))},15858:function(e,t,n){!function(e){"use strict";var t={1:"à©§",2:"à©¨",3:"à©©",4:"à©ª",5:"à©«",6:"à©¬",7:"à©­",8:"à©®",9:"à©¯",0:"à©¦"},n={"à©§":"1","à©¨":"2","à©©":"3","à©ª":"4","à©«":"5","à©¬":"6","à©­":"7","à©®":"8","à©¯":"9","à©¦":"0"};e.defineLocale("pa-in",{months:"à¨œà¨¨à¨µà¨°à©€_à¨«à¨¼à¨°à¨µà¨°à©€_à¨®à¨¾à¨°à¨š_à¨…à¨ªà©à¨°à©ˆà¨²_à¨®à¨ˆ_à¨œà©‚à¨¨_à¨œà©à¨²à¨¾à¨ˆ_à¨…à¨—à¨¸à¨¤_à¨¸à¨¤à©°à¨¬à¨°_à¨…à¨•à¨¤à©‚à¨¬à¨°_à¨¨à¨µà©°à¨¬à¨°_à¨¦à¨¸à©°à¨¬à¨°".split("_"),monthsShort:"à¨œà¨¨à¨µà¨°à©€_à¨«à¨¼à¨°à¨µà¨°à©€_à¨®à¨¾à¨°à¨š_à¨…à¨ªà©à¨°à©ˆà¨²_à¨®à¨ˆ_à¨œà©‚à¨¨_à¨œà©à¨²à¨¾à¨ˆ_à¨…à¨—à¨¸à¨¤_à¨¸à¨¤à©°à¨¬à¨°_à¨…à¨•à¨¤à©‚à¨¬à¨°_à¨¨à¨µà©°à¨¬à¨°_à¨¦à¨¸à©°à¨¬à¨°".split("_"),weekdays:"à¨à¨¤à¨µà¨¾à¨°_à¨¸à©‹à¨®à¨µà¨¾à¨°_à¨®à©°à¨—à¨²à¨µà¨¾à¨°_à¨¬à©à¨§à¨µà¨¾à¨°_à¨µà©€à¨°à¨µà¨¾à¨°_à¨¸à¨¼à©à©±à¨•à¨°à¨µà¨¾à¨°_à¨¸à¨¼à¨¨à©€à¨šà¨°à¨µà¨¾à¨°".split("_"),weekdaysShort:"à¨à¨¤_à¨¸à©‹à¨®_à¨®à©°à¨—à¨²_à¨¬à©à¨§_à¨µà©€à¨°_à¨¸à¨¼à©à¨•à¨°_à¨¸à¨¼à¨¨à©€".split("_"),weekdaysMin:"à¨à¨¤_à¨¸à©‹à¨®_à¨®à©°à¨—à¨²_à¨¬à©à¨§_à¨µà©€à¨°_à¨¸à¨¼à©à¨•à¨°_à¨¸à¨¼à¨¨à©€".split("_"),longDateFormat:{LT:"A h:mm à¨µà¨œà©‡",LTS:"A h:mm:ss à¨µà¨œà©‡",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm à¨µà¨œà©‡",LLLL:"dddd, D MMMM YYYY, A h:mm à¨µà¨œà©‡"},calendar:{sameDay:"[à¨…à¨œ] LT",nextDay:"[à¨•à¨²] LT",nextWeek:"[à¨…à¨—à¨²à¨¾] dddd, LT",lastDay:"[à¨•à¨²] LT",lastWeek:"[à¨ªà¨¿à¨›à¨²à©‡] dddd, LT",sameElse:"L"},relativeTime:{future:"%s à¨µà¨¿à©±à¨š",past:"%s à¨ªà¨¿à¨›à¨²à©‡",s:"à¨•à©à¨ à¨¸à¨•à¨¿à©°à¨Ÿ",ss:"%d à¨¸à¨•à¨¿à©°à¨Ÿ",m:"à¨‡à¨• à¨®à¨¿à©°à¨Ÿ",mm:"%d à¨®à¨¿à©°à¨Ÿ",h:"à¨‡à©±à¨• à¨˜à©°à¨Ÿà¨¾",hh:"%d à¨˜à©°à¨Ÿà©‡",d:"à¨‡à©±à¨• à¨¦à¨¿à¨¨",dd:"%d à¨¦à¨¿à¨¨",M:"à¨‡à©±à¨• à¨®à¨¹à©€à¨¨à¨¾",MM:"%d à¨®à¨¹à©€à¨¨à©‡",y:"à¨‡à©±à¨• à¨¸à¨¾à¨²",yy:"%d à¨¸à¨¾à¨²"},preparse:function(e){return e.replace(/[à©§à©¨à©©à©ªà©«à©¬à©­à©®à©¯à©¦]/g,(function(e){return n[e]}))},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]}))},meridiemParse:/à¨°à¨¾à¨¤|à¨¸à¨µà©‡à¨°|à¨¦à©à¨ªà¨¹à¨¿à¨°|à¨¸à¨¼à¨¾à¨®/,meridiemHour:function(e,t){return 12===e&&(e=0),"à¨°à¨¾à¨¤"===t?e<4?e:e+12:"à¨¸à¨µà©‡à¨°"===t?e:"à¨¦à©à¨ªà¨¹à¨¿à¨°"===t?e>=10?e:e+12:"à¨¸à¨¼à¨¾à¨®"===t?e+12:void 0},meridiem:function(e,t,n){return e<4?"à¨°à¨¾à¨¤":e<10?"à¨¸à¨µà©‡à¨°":e<17?"à¨¦à©à¨ªà¨¹à¨¿à¨°":e<20?"à¨¸à¨¼à¨¾à¨®":"à¨°à¨¾à¨¤"},week:{dow:0,doy:6}})}(n(30381))},64495:function(e,t,n){!function(e){"use strict";var t="styczeÅ„_luty_marzec_kwiecieÅ„_maj_czerwiec_lipiec_sierpieÅ„_wrzesieÅ„_paÅºdziernik_listopad_grudzieÅ„".split("_"),n="stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_wrzeÅ›nia_paÅºdziernika_listopada_grudnia".split("_"),r=[/^sty/i,/^lut/i,/^mar/i,/^kwi/i,/^maj/i,/^cze/i,/^lip/i,/^sie/i,/^wrz/i,/^paÅº/i,/^lis/i,/^gru/i];function a(e){return e%10<5&&e%10>1&&~~(e/10)%10!=1}function s(e,t,n){var r=e+" ";switch(n){case"ss":return r+(a(e)?"sekundy":"sekund");case"m":return t?"minuta":"minutÄ™";case"mm":return r+(a(e)?"minuty":"minut");case"h":return t?"godzina":"godzinÄ™";case"hh":return r+(a(e)?"godziny":"godzin");case"ww":return r+(a(e)?"tygodnie":"tygodni");case"MM":return r+(a(e)?"miesiÄ…ce":"miesiÄ™cy");case"yy":return r+(a(e)?"lata":"lat")}}e.defineLocale("pl",{months:function(e,r){return e?/D MMMM/.test(r)?n[e.month()]:t[e.month()]:t},monthsShort:"sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paÅº_lis_gru".split("_"),monthsParse:r,longMonthsParse:r,shortMonthsParse:r,weekdays:"niedziela_poniedziaÅ‚ek_wtorek_Å›roda_czwartek_piÄ…tek_sobota".split("_"),weekdaysShort:"ndz_pon_wt_Å›r_czw_pt_sob".split("_"),weekdaysMin:"Nd_Pn_Wt_Åšr_Cz_Pt_So".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[DziÅ› o] LT",nextDay:"[Jutro o] LT",nextWeek:function(){switch(this.day()){case 0:return"[W niedzielÄ™ o] LT";case 2:return"[We wtorek o] LT";case 3:return"[W Å›rodÄ™ o] LT";case 6:return"[W sobotÄ™ o] LT";default:return"[W] dddd [o] LT"}},lastDay:"[Wczoraj o] LT",lastWeek:function(){switch(this.day()){case 0:return"[W zeszÅ‚Ä… niedzielÄ™ o] LT";case 3:return"[W zeszÅ‚Ä… Å›rodÄ™ o] LT";case 6:return"[W zeszÅ‚Ä… sobotÄ™ o] LT";default:return"[W zeszÅ‚y] dddd [o] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"%s temu",s:"kilka sekund",ss:s,m:s,mm:s,h:s,hh:s,d:"1 dzieÅ„",dd:"%d dni",w:"tydzieÅ„",ww:s,M:"miesiÄ…c",MM:s,y:"rok",yy:s},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}(n(30381))},57971:function(e,t,n){!function(e){"use strict";e.defineLocale("pt-br",{months:"janeiro_fevereiro_marÃ§o_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro".split("_"),monthsShort:"jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez".split("_"),weekdays:"domingo_segunda-feira_terÃ§a-feira_quarta-feira_quinta-feira_sexta-feira_sÃ¡bado".split("_"),weekdaysShort:"dom_seg_ter_qua_qui_sex_sÃ¡b".split("_"),weekdaysMin:"do_2Âª_3Âª_4Âª_5Âª_6Âª_sÃ¡".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY [Ã s] HH:mm",LLLL:"dddd, D [de] MMMM [de] YYYY [Ã s] HH:mm"},calendar:{sameDay:"[Hoje Ã s] LT",nextDay:"[AmanhÃ£ Ã s] LT",nextWeek:"dddd [Ã s] LT",lastDay:"[Ontem Ã s] LT",lastWeek:function(){return 0===this.day()||6===this.day()?"[Ãšltimo] dddd [Ã s] LT":"[Ãšltima] dddd [Ã s] LT"},sameElse:"L"},relativeTime:{future:"em %s",past:"hÃ¡ %s",s:"poucos segundos",ss:"%d segundos",m:"um minuto",mm:"%d minutos",h:"uma hora",hh:"%d horas",d:"um dia",dd:"%d dias",M:"um mÃªs",MM:"%d meses",y:"um ano",yy:"%d anos"},dayOfMonthOrdinalParse:/\d{1,2}Âº/,ordinal:"%dÂº",invalidDate:"Data invÃ¡lida"})}(n(30381))},89520:function(e,t,n){!function(e){"use strict";e.defineLocale("pt",{months:"janeiro_fevereiro_marÃ§o_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro".split("_"),monthsShort:"jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez".split("_"),weekdays:"Domingo_Segunda-feira_TerÃ§a-feira_Quarta-feira_Quinta-feira_Sexta-feira_SÃ¡bado".split("_"),weekdaysShort:"Dom_Seg_Ter_Qua_Qui_Sex_SÃ¡b".split("_"),weekdaysMin:"Do_2Âª_3Âª_4Âª_5Âª_6Âª_SÃ¡".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY HH:mm",LLLL:"dddd, D [de] MMMM [de] YYYY HH:mm"},calendar:{sameDay:"[Hoje Ã s] LT",nextDay:"[AmanhÃ£ Ã s] LT",nextWeek:"dddd [Ã s] LT",lastDay:"[Ontem Ã s] LT",lastWeek:function(){return 0===this.day()||6===this.day()?"[Ãšltimo] dddd [Ã s] LT":"[Ãšltima] dddd [Ã s] LT"},sameElse:"L"},relativeTime:{future:"em %s",past:"hÃ¡ %s",s:"segundos",ss:"%d segundos",m:"um minuto",mm:"%d minutos",h:"uma hora",hh:"%d horas",d:"um dia",dd:"%d dias",w:"uma semana",ww:"%d semanas",M:"um mÃªs",MM:"%d meses",y:"um ano",yy:"%d anos"},dayOfMonthOrdinalParse:/\d{1,2}Âº/,ordinal:"%dÂº",week:{dow:1,doy:4}})}(n(30381))},96459:function(e,t,n){!function(e){"use strict";function t(e,t,n){var r=" ";return(e%100>=20||e>=100&&e%100==0)&&(r=" de "),e+r+{ss:"secunde",mm:"minute",hh:"ore",dd:"zile",ww:"sÄƒptÄƒmÃ¢ni",MM:"luni",yy:"ani"}[n]}e.defineLocale("ro",{months:"ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie".split("_"),monthsShort:"ian._feb._mart._apr._mai_iun._iul._aug._sept._oct._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"duminicÄƒ_luni_marÈ›i_miercuri_joi_vineri_sÃ¢mbÄƒtÄƒ".split("_"),weekdaysShort:"Dum_Lun_Mar_Mie_Joi_Vin_SÃ¢m".split("_"),weekdaysMin:"Du_Lu_Ma_Mi_Jo_Vi_SÃ¢".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd, D MMMM YYYY H:mm"},calendar:{sameDay:"[azi la] LT",nextDay:"[mÃ¢ine la] LT",nextWeek:"dddd [la] LT",lastDay:"[ieri la] LT",lastWeek:"[fosta] dddd [la] LT",sameElse:"L"},relativeTime:{future:"peste %s",past:"%s Ã®n urmÄƒ",s:"cÃ¢teva secunde",ss:t,m:"un minut",mm:t,h:"o orÄƒ",hh:t,d:"o zi",dd:t,w:"o sÄƒptÄƒmÃ¢nÄƒ",ww:t,M:"o lunÄƒ",MM:t,y:"un an",yy:t},week:{dow:1,doy:7}})}(n(30381))},21793:function(e,t,n){!function(e){"use strict";function t(e,t,n){return"m"===n?t?"Ð¼Ð¸Ð½ÑƒÑ‚Ð°":"Ð¼Ð¸Ð½ÑƒÑ‚Ñƒ":e+" "+(r=+e,a={ss:t?"ÑÐµÐºÑƒÐ½Ð´Ð°_ÑÐµÐºÑƒÐ½Ð´Ñ‹_ÑÐµÐºÑƒÐ½Ð´":"ÑÐµÐºÑƒÐ½Ð´Ñƒ_ÑÐµÐºÑƒÐ½Ð´Ñ‹_ÑÐµÐºÑƒÐ½Ð´",mm:t?"Ð¼Ð¸Ð½ÑƒÑ‚Ð°_Ð¼Ð¸Ð½ÑƒÑ‚Ñ‹_Ð¼Ð¸Ð½ÑƒÑ‚":"Ð¼Ð¸Ð½ÑƒÑ‚Ñƒ_Ð¼Ð¸Ð½ÑƒÑ‚Ñ‹_Ð¼Ð¸Ð½ÑƒÑ‚",hh:"Ñ‡Ð°Ñ_Ñ‡Ð°ÑÐ°_Ñ‡Ð°ÑÐ¾Ð²",dd:"Ð´ÐµÐ½ÑŒ_Ð´Ð½Ñ_Ð´Ð½ÐµÐ¹",ww:"Ð½ÐµÐ´ÐµÐ»Ñ_Ð½ÐµÐ´ÐµÐ»Ð¸_Ð½ÐµÐ´ÐµÐ»ÑŒ",MM:"Ð¼ÐµÑÑÑ†_Ð¼ÐµÑÑÑ†Ð°_Ð¼ÐµÑÑÑ†ÐµÐ²",yy:"Ð³Ð¾Ð´_Ð³Ð¾Ð´Ð°_Ð»ÐµÑ‚"}[n].split("_"),r%10==1&&r%100!=11?a[0]:r%10>=2&&r%10<=4&&(r%100<10||r%100>=20)?a[1]:a[2]);var r,a}var n=[/^ÑÐ½Ð²/i,/^Ñ„ÐµÐ²/i,/^Ð¼Ð°Ñ€/i,/^Ð°Ð¿Ñ€/i,/^Ð¼Ð°[Ð¹Ñ]/i,/^Ð¸ÑŽÐ½/i,/^Ð¸ÑŽÐ»/i,/^Ð°Ð²Ð³/i,/^ÑÐµÐ½/i,/^Ð¾ÐºÑ‚/i,/^Ð½Ð¾Ñ/i,/^Ð´ÐµÐº/i];e.defineLocale("ru",{months:{format:"ÑÐ½Ð²Ð°Ñ€Ñ_Ñ„ÐµÐ²Ñ€Ð°Ð»Ñ_Ð¼Ð°Ñ€Ñ‚Ð°_Ð°Ð¿Ñ€ÐµÐ»Ñ_Ð¼Ð°Ñ_Ð¸ÑŽÐ½Ñ_Ð¸ÑŽÐ»Ñ_Ð°Ð²Ð³ÑƒÑÑ‚Ð°_ÑÐµÐ½Ñ‚ÑÐ±Ñ€Ñ_Ð¾ÐºÑ‚ÑÐ±Ñ€Ñ_Ð½Ð¾ÑÐ±Ñ€Ñ_Ð´ÐµÐºÐ°Ð±Ñ€Ñ".split("_"),standalone:"ÑÐ½Ð²Ð°Ñ€ÑŒ_Ñ„ÐµÐ²Ñ€Ð°Ð»ÑŒ_Ð¼Ð°Ñ€Ñ‚_Ð°Ð¿Ñ€ÐµÐ»ÑŒ_Ð¼Ð°Ð¹_Ð¸ÑŽÐ½ÑŒ_Ð¸ÑŽÐ»ÑŒ_Ð°Ð²Ð³ÑƒÑÑ‚_ÑÐµÐ½Ñ‚ÑÐ±Ñ€ÑŒ_Ð¾ÐºÑ‚ÑÐ±Ñ€ÑŒ_Ð½Ð¾ÑÐ±Ñ€ÑŒ_Ð´ÐµÐºÐ°Ð±Ñ€ÑŒ".split("_")},monthsShort:{format:"ÑÐ½Ð²._Ñ„ÐµÐ²Ñ€._Ð¼Ð°Ñ€._Ð°Ð¿Ñ€._Ð¼Ð°Ñ_Ð¸ÑŽÐ½Ñ_Ð¸ÑŽÐ»Ñ_Ð°Ð²Ð³._ÑÐµÐ½Ñ‚._Ð¾ÐºÑ‚._Ð½Ð¾ÑÐ±._Ð´ÐµÐº.".split("_"),standalone:"ÑÐ½Ð²._Ñ„ÐµÐ²Ñ€._Ð¼Ð°Ñ€Ñ‚_Ð°Ð¿Ñ€._Ð¼Ð°Ð¹_Ð¸ÑŽÐ½ÑŒ_Ð¸ÑŽÐ»ÑŒ_Ð°Ð²Ð³._ÑÐµÐ½Ñ‚._Ð¾ÐºÑ‚._Ð½Ð¾ÑÐ±._Ð´ÐµÐº.".split("_")},weekdays:{standalone:"Ð²Ð¾ÑÐºÑ€ÐµÑÐµÐ½ÑŒÐµ_Ð¿Ð¾Ð½ÐµÐ´ÐµÐ»ÑŒÐ½Ð¸Ðº_Ð²Ñ‚Ð¾Ñ€Ð½Ð¸Ðº_ÑÑ€ÐµÐ´Ð°_Ñ‡ÐµÑ‚Ð²ÐµÑ€Ð³_Ð¿ÑÑ‚Ð½Ð¸Ñ†Ð°_ÑÑƒÐ±Ð±Ð¾Ñ‚Ð°".split("_"),format:"Ð²Ð¾ÑÐºÑ€ÐµÑÐµÐ½ÑŒÐµ_Ð¿Ð¾Ð½ÐµÐ´ÐµÐ»ÑŒÐ½Ð¸Ðº_Ð²Ñ‚Ð¾Ñ€Ð½Ð¸Ðº_ÑÑ€ÐµÐ´Ñƒ_Ñ‡ÐµÑ‚Ð²ÐµÑ€Ð³_Ð¿ÑÑ‚Ð½Ð¸Ñ†Ñƒ_ÑÑƒÐ±Ð±Ð¾Ñ‚Ñƒ".split("_"),isFormat:/\[ ?[Ð’Ð²] ?(?:Ð¿Ñ€Ð¾ÑˆÐ»ÑƒÑŽ|ÑÐ»ÐµÐ´ÑƒÑŽÑ‰ÑƒÑŽ|ÑÑ‚Ñƒ)? ?] ?dddd/},weekdaysShort:"Ð²Ñ_Ð¿Ð½_Ð²Ñ‚_ÑÑ€_Ñ‡Ñ‚_Ð¿Ñ‚_ÑÐ±".split("_"),weekdaysMin:"Ð²Ñ_Ð¿Ð½_Ð²Ñ‚_ÑÑ€_Ñ‡Ñ‚_Ð¿Ñ‚_ÑÐ±".split("_"),monthsParse:n,longMonthsParse:n,shortMonthsParse:n,monthsRegex:/^(ÑÐ½Ð²Ð°Ñ€[ÑŒÑ]|ÑÐ½Ð²\.?|Ñ„ÐµÐ²Ñ€Ð°Ð»[ÑŒÑ]|Ñ„ÐµÐ²Ñ€?\.?|Ð¼Ð°Ñ€Ñ‚Ð°?|Ð¼Ð°Ñ€\.?|Ð°Ð¿Ñ€ÐµÐ»[ÑŒÑ]|Ð°Ð¿Ñ€\.?|Ð¼Ð°[Ð¹Ñ]|Ð¸ÑŽÐ½[ÑŒÑ]|Ð¸ÑŽÐ½\.?|Ð¸ÑŽÐ»[ÑŒÑ]|Ð¸ÑŽÐ»\.?|Ð°Ð²Ð³ÑƒÑÑ‚Ð°?|Ð°Ð²Ð³\.?|ÑÐµÐ½Ñ‚ÑÐ±Ñ€[ÑŒÑ]|ÑÐµÐ½Ñ‚?\.?|Ð¾ÐºÑ‚ÑÐ±Ñ€[ÑŒÑ]|Ð¾ÐºÑ‚\.?|Ð½Ð¾ÑÐ±Ñ€[ÑŒÑ]|Ð½Ð¾ÑÐ±?\.?|Ð´ÐµÐºÐ°Ð±Ñ€[ÑŒÑ]|Ð´ÐµÐº\.?)/i,monthsShortRegex:/^(ÑÐ½Ð²Ð°Ñ€[ÑŒÑ]|ÑÐ½Ð²\.?|Ñ„ÐµÐ²Ñ€Ð°Ð»[ÑŒÑ]|Ñ„ÐµÐ²Ñ€?\.?|Ð¼Ð°Ñ€Ñ‚Ð°?|Ð¼Ð°Ñ€\.?|Ð°Ð¿Ñ€ÐµÐ»[ÑŒÑ]|Ð°Ð¿Ñ€\.?|Ð¼Ð°[Ð¹Ñ]|Ð¸ÑŽÐ½[ÑŒÑ]|Ð¸ÑŽÐ½\.?|Ð¸ÑŽÐ»[ÑŒÑ]|Ð¸ÑŽÐ»\.?|Ð°Ð²Ð³ÑƒÑÑ‚Ð°?|Ð°Ð²Ð³\.?|ÑÐµÐ½Ñ‚ÑÐ±Ñ€[ÑŒÑ]|ÑÐµÐ½Ñ‚?\.?|Ð¾ÐºÑ‚ÑÐ±Ñ€[ÑŒÑ]|Ð¾ÐºÑ‚\.?|Ð½Ð¾ÑÐ±Ñ€[ÑŒÑ]|Ð½Ð¾ÑÐ±?\.?|Ð´ÐµÐºÐ°Ð±Ñ€[ÑŒÑ]|Ð´ÐµÐº\.?)/i,monthsStrictRegex:/^(ÑÐ½Ð²Ð°Ñ€[ÑÑŒ]|Ñ„ÐµÐ²Ñ€Ð°Ð»[ÑÑŒ]|Ð¼Ð°Ñ€Ñ‚Ð°?|Ð°Ð¿Ñ€ÐµÐ»[ÑÑŒ]|Ð¼Ð°[ÑÐ¹]|Ð¸ÑŽÐ½[ÑÑŒ]|Ð¸ÑŽÐ»[ÑÑŒ]|Ð°Ð²Ð³ÑƒÑÑ‚Ð°?|ÑÐµÐ½Ñ‚ÑÐ±Ñ€[ÑÑŒ]|Ð¾ÐºÑ‚ÑÐ±Ñ€[ÑÑŒ]|Ð½Ð¾ÑÐ±Ñ€[ÑÑŒ]|Ð´ÐµÐºÐ°Ð±Ñ€[ÑÑŒ])/i,monthsShortStrictRegex:/^(ÑÐ½Ð²\.|Ñ„ÐµÐ²Ñ€?\.|Ð¼Ð°Ñ€[Ñ‚.]|Ð°Ð¿Ñ€\.|Ð¼Ð°[ÑÐ¹]|Ð¸ÑŽÐ½[ÑŒÑ.]|Ð¸ÑŽÐ»[ÑŒÑ.]|Ð°Ð²Ð³\.|ÑÐµÐ½Ñ‚?\.|Ð¾ÐºÑ‚\.|Ð½Ð¾ÑÐ±?\.|Ð´ÐµÐº\.)/i,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY Ð³.",LLL:"D MMMM YYYY Ð³., H:mm",LLLL:"dddd, D MMMM YYYY Ð³., H:mm"},calendar:{sameDay:"[Ð¡ÐµÐ³Ð¾Ð´Ð½Ñ, Ð²] LT",nextDay:"[Ð—Ð°Ð²Ñ‚Ñ€Ð°, Ð²] LT",lastDay:"[Ð’Ñ‡ÐµÑ€Ð°, Ð²] LT",nextWeek:function(e){if(e.week()===this.week())return 2===this.day()?"[Ð’Ð¾] dddd, [Ð²] LT":"[Ð’] dddd, [Ð²] LT";switch(this.day()){case 0:return"[Ð’ ÑÐ»ÐµÐ´ÑƒÑŽÑ‰ÐµÐµ] dddd, [Ð²] LT";case 1:case 2:case 4:return"[Ð’ ÑÐ»ÐµÐ´ÑƒÑŽÑ‰Ð¸Ð¹] dddd, [Ð²] LT";case 3:case 5:case 6:return"[Ð’ ÑÐ»ÐµÐ´ÑƒÑŽÑ‰ÑƒÑŽ] dddd, [Ð²] LT"}},lastWeek:function(e){if(e.week()===this.week())return 2===this.day()?"[Ð’Ð¾] dddd, [Ð²] LT":"[Ð’] dddd, [Ð²] LT";switch(this.day()){case 0:return"[Ð’ Ð¿Ñ€Ð¾ÑˆÐ»Ð¾Ðµ] dddd, [Ð²] LT";case 1:case 2:case 4:return"[Ð’ Ð¿Ñ€Ð¾ÑˆÐ»Ñ‹Ð¹] dddd, [Ð²] LT";case 3:case 5:case 6:return"[Ð’ Ð¿Ñ€Ð¾ÑˆÐ»ÑƒÑŽ] dddd, [Ð²] LT"}},sameElse:"L"},relativeTime:{future:"Ñ‡ÐµÑ€ÐµÐ· %s",past:"%s Ð½Ð°Ð·Ð°Ð´",s:"Ð½ÐµÑÐºÐ¾Ð»ÑŒÐºÐ¾ ÑÐµÐºÑƒÐ½Ð´",ss:t,m:t,mm:t,h:"Ñ‡Ð°Ñ",hh:t,d:"Ð´ÐµÐ½ÑŒ",dd:t,w:"Ð½ÐµÐ´ÐµÐ»Ñ",ww:t,M:"Ð¼ÐµÑÑÑ†",MM:t,y:"Ð³Ð¾Ð´",yy:t},meridiemParse:/Ð½Ð¾Ñ‡Ð¸|ÑƒÑ‚Ñ€Ð°|Ð´Ð½Ñ|Ð²ÐµÑ‡ÐµÑ€Ð°/i,isPM:function(e){return/^(Ð´Ð½Ñ|Ð²ÐµÑ‡ÐµÑ€Ð°)$/.test(e)},meridiem:function(e,t,n){return e<4?"Ð½Ð¾Ñ‡Ð¸":e<12?"ÑƒÑ‚Ñ€Ð°":e<17?"Ð´Ð½Ñ":"Ð²ÐµÑ‡ÐµÑ€Ð°"},dayOfMonthOrdinalParse:/\d{1,2}-(Ð¹|Ð³Ð¾|Ñ)/,ordinal:function(e,t){switch(t){case"M":case"d":case"DDD":return e+"-Ð¹";case"D":return e+"-Ð³Ð¾";case"w":case"W":return e+"-Ñ";default:return e}},week:{dow:1,doy:4}})}(n(30381))},40950:function(e,t,n){!function(e){"use strict";var t=["Ø¬Ù†ÙˆØ±ÙŠ","ÙÙŠØ¨Ø±ÙˆØ±ÙŠ","Ù…Ø§Ø±Ú†","Ø§Ù¾Ø±ÙŠÙ„","Ù…Ø¦ÙŠ","Ø¬ÙˆÙ†","Ø¬ÙˆÙ„Ø§Ø¡Ù","Ø¢Ú¯Ø³Ù½","Ø³ÙŠÙ¾Ù½Ù…Ø¨Ø±","Ø¢ÚªÙ½ÙˆØ¨Ø±","Ù†ÙˆÙ…Ø¨Ø±","ÚŠØ³Ù…Ø¨Ø±"],n=["Ø¢Ú†Ø±","Ø³ÙˆÙ…Ø±","Ø§Ú±Ø§Ø±Ùˆ","Ø§Ø±Ø¨Ø¹","Ø®Ù…ÙŠØ³","Ø¬Ù…Ø¹","Ú‡Ù†Ú‡Ø±"];e.defineLocale("sd",{months:t,monthsShort:t,weekdays:n,weekdaysShort:n,weekdaysMin:n,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"ddddØŒ D MMMM YYYY HH:mm"},meridiemParse:/ØµØ¨Ø­|Ø´Ø§Ù…/,isPM:function(e){return"Ø´Ø§Ù…"===e},meridiem:function(e,t,n){return e<12?"ØµØ¨Ø­":"Ø´Ø§Ù…"},calendar:{sameDay:"[Ø§Ú„] LT",nextDay:"[Ø³Ú€Ø§Ú»ÙŠ] LT",nextWeek:"dddd [Ø§Ú³ÙŠÙ† Ù‡ÙØªÙŠ ØªÙŠ] LT",lastDay:"[ÚªØ§Ù„Ù‡Ù‡] LT",lastWeek:"[Ú¯Ø²Ø±ÙŠÙ„ Ù‡ÙØªÙŠ] dddd [ØªÙŠ] LT",sameElse:"L"},relativeTime:{future:"%s Ù¾ÙˆØ¡",past:"%s Ø§Ú³",s:"Ú†Ù†Ø¯ Ø³ÙŠÚªÙ†ÚŠ",ss:"%d Ø³ÙŠÚªÙ†ÚŠ",m:"Ù‡Úª Ù…Ù†Ù½",mm:"%d Ù…Ù†Ù½",h:"Ù‡Úª ÚªÙ„Ø§Úª",hh:"%d ÚªÙ„Ø§Úª",d:"Ù‡Úª ÚÙŠÙ†Ù‡Ù†",dd:"%d ÚÙŠÙ†Ù‡Ù†",M:"Ù‡Úª Ù…Ù‡ÙŠÙ†Ùˆ",MM:"%d Ù…Ù‡ÙŠÙ†Ø§",y:"Ù‡Úª Ø³Ø§Ù„",yy:"%d Ø³Ø§Ù„"},preparse:function(e){return e.replace(/ØŒ/g,",")},postformat:function(e){return e.replace(/,/g,"ØŒ")},week:{dow:1,doy:4}})}(n(30381))},10490:function(e,t,n){!function(e){"use strict";e.defineLocale("se",{months:"oÄ‘Ä‘ajagemÃ¡nnu_guovvamÃ¡nnu_njukÄamÃ¡nnu_cuoÅ‹omÃ¡nnu_miessemÃ¡nnu_geassemÃ¡nnu_suoidnemÃ¡nnu_borgemÃ¡nnu_ÄakÄamÃ¡nnu_golggotmÃ¡nnu_skÃ¡bmamÃ¡nnu_juovlamÃ¡nnu".split("_"),monthsShort:"oÄ‘Ä‘j_guov_njuk_cuo_mies_geas_suoi_borg_ÄakÄ_golg_skÃ¡b_juov".split("_"),weekdays:"sotnabeaivi_vuossÃ¡rga_maÅ‹Å‹ebÃ¡rga_gaskavahkku_duorastat_bearjadat_lÃ¡vvardat".split("_"),weekdaysShort:"sotn_vuos_maÅ‹_gask_duor_bear_lÃ¡v".split("_"),weekdaysMin:"s_v_m_g_d_b_L".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"MMMM D. [b.] YYYY",LLL:"MMMM D. [b.] YYYY [ti.] HH:mm",LLLL:"dddd, MMMM D. [b.] YYYY [ti.] HH:mm"},calendar:{sameDay:"[otne ti] LT",nextDay:"[ihttin ti] LT",nextWeek:"dddd [ti] LT",lastDay:"[ikte ti] LT",lastWeek:"[ovddit] dddd [ti] LT",sameElse:"L"},relativeTime:{future:"%s geaÅ¾es",past:"maÅ‹it %s",s:"moadde sekunddat",ss:"%d sekunddat",m:"okta minuhta",mm:"%d minuhtat",h:"okta diimmu",hh:"%d diimmut",d:"okta beaivi",dd:"%d beaivvit",M:"okta mÃ¡nnu",MM:"%d mÃ¡nut",y:"okta jahki",yy:"%d jagit"},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}(n(30381))},90124:function(e,t,n){!function(e){"use strict";e.defineLocale("si",{months:"à¶¢à¶±à·€à·à¶»à·’_à¶´à·™à¶¶à¶»à·€à·à¶»à·’_à¶¸à·à¶»à·Šà¶­à·”_à¶…à¶´à·Šâ€à¶»à·šà¶½à·Š_à¶¸à·à¶ºà·’_à¶¢à·–à¶±à·’_à¶¢à·–à¶½à·’_à¶…à¶œà·à·ƒà·Šà¶­à·”_à·ƒà·à¶´à·Šà¶­à·à¶¸à·Šà¶¶à¶»à·Š_à¶”à¶šà·Šà¶­à·à¶¶à¶»à·Š_à¶±à·œà·€à·à¶¸à·Šà¶¶à¶»à·Š_à¶¯à·™à·ƒà·à¶¸à·Šà¶¶à¶»à·Š".split("_"),monthsShort:"à¶¢à¶±_à¶´à·™à¶¶_à¶¸à·à¶»à·Š_à¶…à¶´à·Š_à¶¸à·à¶ºà·’_à¶¢à·–à¶±à·’_à¶¢à·–à¶½à·’_à¶…à¶œà·_à·ƒà·à¶´à·Š_à¶”à¶šà·Š_à¶±à·œà·€à·_à¶¯à·™à·ƒà·".split("_"),weekdays:"à¶‰à¶»à·’à¶¯à·_à·ƒà¶³à·”à¶¯à·_à¶…à¶Ÿà·„à¶»à·”à·€à·à¶¯à·_à¶¶à¶¯à·à¶¯à·_à¶¶à·Šâ€à¶»à·„à·ƒà·Šà¶´à¶­à·’à¶±à·Šà¶¯à·_à·ƒà·’à¶šà·”à¶»à·à¶¯à·_à·ƒà·™à¶±à·ƒà·”à¶»à·à¶¯à·".split("_"),weekdaysShort:"à¶‰à¶»à·’_à·ƒà¶³à·”_à¶…à¶Ÿ_à¶¶à¶¯à·_à¶¶à·Šâ€à¶»à·„_à·ƒà·’à¶šà·”_à·ƒà·™à¶±".split("_"),weekdaysMin:"à¶‰_à·ƒ_à¶…_à¶¶_à¶¶à·Šâ€à¶»_à·ƒà·’_à·ƒà·™".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"a h:mm",LTS:"a h:mm:ss",L:"YYYY/MM/DD",LL:"YYYY MMMM D",LLL:"YYYY MMMM D, a h:mm",LLLL:"YYYY MMMM D [à·€à·à¶±à·’] dddd, a h:mm:ss"},calendar:{sameDay:"[à¶…à¶¯] LT[à¶§]",nextDay:"[à·„à·™à¶§] LT[à¶§]",nextWeek:"dddd LT[à¶§]",lastDay:"[à¶Šà¶ºà·š] LT[à¶§]",lastWeek:"[à¶´à·ƒà·”à¶œà·’à¶º] dddd LT[à¶§]",sameElse:"L"},relativeTime:{future:"%sà¶šà·’à¶±à·Š",past:"%sà¶šà¶§ à¶´à·™à¶»",s:"à¶­à¶­à·Šà¶´à¶» à¶šà·’à·„à·’à¶´à¶º",ss:"à¶­à¶­à·Šà¶´à¶» %d",m:"à¶¸à·’à¶±à·’à¶­à·Šà¶­à·”à·€",mm:"à¶¸à·’à¶±à·’à¶­à·Šà¶­à·” %d",h:"à¶´à·à¶º",hh:"à¶´à·à¶º %d",d:"à¶¯à·’à¶±à¶º",dd:"à¶¯à·’à¶± %d",M:"à¶¸à·à·ƒà¶º",MM:"à¶¸à·à·ƒ %d",y:"à·€à·ƒà¶»",yy:"à·€à·ƒà¶» %d"},dayOfMonthOrdinalParse:/\d{1,2} à·€à·à¶±à·’/,ordinal:function(e){return e+" à·€à·à¶±à·’"},meridiemParse:/à¶´à·™à¶» à·€à¶»à·”|à¶´à·ƒà·Š à·€à¶»à·”|à¶´à·™.à·€|à¶´.à·€./,isPM:function(e){return"à¶´.à·€."===e||"à¶´à·ƒà·Š à·€à¶»à·”"===e},meridiem:function(e,t,n){return e>11?n?"à¶´.à·€.":"à¶´à·ƒà·Š à·€à¶»à·”":n?"à¶´à·™.à·€.":"à¶´à·™à¶» à·€à¶»à·”"}})}(n(30381))},64249:function(e,t,n){!function(e){"use strict";var t="januÃ¡r_februÃ¡r_marec_aprÃ­l_mÃ¡j_jÃºn_jÃºl_august_september_oktÃ³ber_november_december".split("_"),n="jan_feb_mar_apr_mÃ¡j_jÃºn_jÃºl_aug_sep_okt_nov_dec".split("_");function r(e){return e>1&&e<5}function a(e,t,n,a){var s=e+" ";switch(n){case"s":return t||a?"pÃ¡r sekÃºnd":"pÃ¡r sekundami";case"ss":return t||a?s+(r(e)?"sekundy":"sekÃºnd"):s+"sekundami";case"m":return t?"minÃºta":a?"minÃºtu":"minÃºtou";case"mm":return t||a?s+(r(e)?"minÃºty":"minÃºt"):s+"minÃºtami";case"h":return t?"hodina":a?"hodinu":"hodinou";case"hh":return t||a?s+(r(e)?"hodiny":"hodÃ­n"):s+"hodinami";case"d":return t||a?"deÅˆ":"dÅˆom";case"dd":return t||a?s+(r(e)?"dni":"dnÃ­"):s+"dÅˆami";case"M":return t||a?"mesiac":"mesiacom";case"MM":return t||a?s+(r(e)?"mesiace":"mesiacov"):s+"mesiacmi";case"y":return t||a?"rok":"rokom";case"yy":return t||a?s+(r(e)?"roky":"rokov"):s+"rokmi"}}e.defineLocale("sk",{months:t,monthsShort:n,weekdays:"nedeÄ¾a_pondelok_utorok_streda_Å¡tvrtok_piatok_sobota".split("_"),weekdaysShort:"ne_po_ut_st_Å¡t_pi_so".split("_"),weekdaysMin:"ne_po_ut_st_Å¡t_pi_so".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd D. MMMM YYYY H:mm"},calendar:{sameDay:"[dnes o] LT",nextDay:"[zajtra o] LT",nextWeek:function(){switch(this.day()){case 0:return"[v nedeÄ¾u o] LT";case 1:case 2:return"[v] dddd [o] LT";case 3:return"[v stredu o] LT";case 4:return"[vo Å¡tvrtok o] LT";case 5:return"[v piatok o] LT";case 6:return"[v sobotu o] LT"}},lastDay:"[vÄera o] LT",lastWeek:function(){switch(this.day()){case 0:return"[minulÃº nedeÄ¾u o] LT";case 1:case 2:case 4:case 5:return"[minulÃ½] dddd [o] LT";case 3:return"[minulÃº stredu o] LT";case 6:return"[minulÃº sobotu o] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"pred %s",s:a,ss:a,m:a,mm:a,h:a,hh:a,d:a,dd:a,M:a,MM:a,y:a,yy:a},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}(n(30381))},14985:function(e,t,n){!function(e){"use strict";function t(e,t,n,r){var a=e+" ";switch(n){case"s":return t||r?"nekaj sekund":"nekaj sekundami";case"ss":return a+(1===e?t?"sekundo":"sekundi":2===e?t||r?"sekundi":"sekundah":e<5?t||r?"sekunde":"sekundah":"sekund");case"m":return t?"ena minuta":"eno minuto";case"mm":return a+(1===e?t?"minuta":"minuto":2===e?t||r?"minuti":"minutama":e<5?t||r?"minute":"minutami":t||r?"minut":"minutami");case"h":return t?"ena ura":"eno uro";case"hh":return a+(1===e?t?"ura":"uro":2===e?t||r?"uri":"urama":e<5?t||r?"ure":"urami":t||r?"ur":"urami");case"d":return t||r?"en dan":"enim dnem";case"dd":return a+(1===e?t||r?"dan":"dnem":2===e?t||r?"dni":"dnevoma":t||r?"dni":"dnevi");case"M":return t||r?"en mesec":"enim mesecem";case"MM":return a+(1===e?t||r?"mesec":"mesecem":2===e?t||r?"meseca":"mesecema":e<5?t||r?"mesece":"meseci":t||r?"mesecev":"meseci");case"y":return t||r?"eno leto":"enim letom";case"yy":return a+(1===e?t||r?"leto":"letom":2===e?t||r?"leti":"letoma":e<5?t||r?"leta":"leti":t||r?"let":"leti")}}e.defineLocale("sl",{months:"januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december".split("_"),monthsShort:"jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"nedelja_ponedeljek_torek_sreda_Äetrtek_petek_sobota".split("_"),weekdaysShort:"ned._pon._tor._sre._Äet._pet._sob.".split("_"),weekdaysMin:"ne_po_to_sr_Äe_pe_so".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danes ob] LT",nextDay:"[jutri ob] LT",nextWeek:function(){switch(this.day()){case 0:return"[v] [nedeljo] [ob] LT";case 3:return"[v] [sredo] [ob] LT";case 6:return"[v] [soboto] [ob] LT";case 1:case 2:case 4:case 5:return"[v] dddd [ob] LT"}},lastDay:"[vÄeraj ob] LT",lastWeek:function(){switch(this.day()){case 0:return"[prejÅ¡njo] [nedeljo] [ob] LT";case 3:return"[prejÅ¡njo] [sredo] [ob] LT";case 6:return"[prejÅ¡njo] [soboto] [ob] LT";case 1:case 2:case 4:case 5:return"[prejÅ¡nji] dddd [ob] LT"}},sameElse:"L"},relativeTime:{future:"Äez %s",past:"pred %s",s:t,ss:t,m:t,mm:t,h:t,hh:t,d:t,dd:t,M:t,MM:t,y:t,yy:t},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}})}(n(30381))},51104:function(e,t,n){!function(e){"use strict";e.defineLocale("sq",{months:"Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_NÃ«ntor_Dhjetor".split("_"),monthsShort:"Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_NÃ«n_Dhj".split("_"),weekdays:"E Diel_E HÃ«nÃ«_E MartÃ«_E MÃ«rkurÃ«_E Enjte_E Premte_E ShtunÃ«".split("_"),weekdaysShort:"Die_HÃ«n_Mar_MÃ«r_Enj_Pre_Sht".split("_"),weekdaysMin:"D_H_Ma_MÃ«_E_P_Sh".split("_"),weekdaysParseExact:!0,meridiemParse:/PD|MD/,isPM:function(e){return"M"===e.charAt(0)},meridiem:function(e,t,n){return e<12?"PD":"MD"},longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Sot nÃ«] LT",nextDay:"[NesÃ«r nÃ«] LT",nextWeek:"dddd [nÃ«] LT",lastDay:"[Dje nÃ«] LT",lastWeek:"dddd [e kaluar nÃ«] LT",sameElse:"L"},relativeTime:{future:"nÃ« %s",past:"%s mÃ« parÃ«",s:"disa sekonda",ss:"%d sekonda",m:"njÃ« minutÃ«",mm:"%d minuta",h:"njÃ« orÃ«",hh:"%d orÃ«",d:"njÃ« ditÃ«",dd:"%d ditÃ«",M:"njÃ« muaj",MM:"%d muaj",y:"njÃ« vit",yy:"%d vite"},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}(n(30381))},79915:function(e,t,n){!function(e){"use strict";var t={words:{ss:["ÑÐµÐºÑƒÐ½Ð´Ð°","ÑÐµÐºÑƒÐ½Ð´Ðµ","ÑÐµÐºÑƒÐ½Ð´Ð¸"],m:["Ñ˜ÐµÐ´Ð°Ð½ Ð¼Ð¸Ð½ÑƒÑ‚","Ñ˜ÐµÐ´Ð½Ð¾Ð³ Ð¼Ð¸Ð½ÑƒÑ‚Ð°"],mm:["Ð¼Ð¸Ð½ÑƒÑ‚","Ð¼Ð¸Ð½ÑƒÑ‚Ð°","Ð¼Ð¸Ð½ÑƒÑ‚Ð°"],h:["Ñ˜ÐµÐ´Ð°Ð½ ÑÐ°Ñ‚","Ñ˜ÐµÐ´Ð½Ð¾Ð³ ÑÐ°Ñ‚Ð°"],hh:["ÑÐ°Ñ‚","ÑÐ°Ñ‚Ð°","ÑÐ°Ñ‚Ð¸"],d:["Ñ˜ÐµÐ´Ð°Ð½ Ð´Ð°Ð½","Ñ˜ÐµÐ´Ð½Ð¾Ð³ Ð´Ð°Ð½Ð°"],dd:["Ð´Ð°Ð½","Ð´Ð°Ð½Ð°","Ð´Ð°Ð½Ð°"],M:["Ñ˜ÐµÐ´Ð°Ð½ Ð¼ÐµÑÐµÑ†","Ñ˜ÐµÐ´Ð½Ð¾Ð³ Ð¼ÐµÑÐµÑ†Ð°"],MM:["Ð¼ÐµÑÐµÑ†","Ð¼ÐµÑÐµÑ†Ð°","Ð¼ÐµÑÐµÑ†Ð¸"],y:["Ñ˜ÐµÐ´Ð½Ñƒ Ð³Ð¾Ð´Ð¸Ð½Ñƒ","Ñ˜ÐµÐ´Ð½Ðµ Ð³Ð¾Ð´Ð¸Ð½Ðµ"],yy:["Ð³Ð¾Ð´Ð¸Ð½Ñƒ","Ð³Ð¾Ð´Ð¸Ð½Ðµ","Ð³Ð¾Ð´Ð¸Ð½Ð°"]},correctGrammaticalCase:function(e,t){return e%10>=1&&e%10<=4&&(e%100<10||e%100>=20)?e%10==1?t[0]:t[1]:t[2]},translate:function(e,n,r,a){var s,i=t.words[r];return 1===r.length?"y"===r&&n?"Ñ˜ÐµÐ´Ð½Ð° Ð³Ð¾Ð´Ð¸Ð½Ð°":a||n?i[0]:i[1]:(s=t.correctGrammaticalCase(e,i),"yy"===r&&n&&"Ð³Ð¾Ð´Ð¸Ð½Ñƒ"===s?e+" Ð³Ð¾Ð´Ð¸Ð½Ð°":e+" "+s)}};e.defineLocale("sr-cyrl",{months:"Ñ˜Ð°Ð½ÑƒÐ°Ñ€_Ñ„ÐµÐ±Ñ€ÑƒÐ°Ñ€_Ð¼Ð°Ñ€Ñ‚_Ð°Ð¿Ñ€Ð¸Ð»_Ð¼Ð°Ñ˜_Ñ˜ÑƒÐ½_Ñ˜ÑƒÐ»_Ð°Ð²Ð³ÑƒÑÑ‚_ÑÐµÐ¿Ñ‚ÐµÐ¼Ð±Ð°Ñ€_Ð¾ÐºÑ‚Ð¾Ð±Ð°Ñ€_Ð½Ð¾Ð²ÐµÐ¼Ð±Ð°Ñ€_Ð´ÐµÑ†ÐµÐ¼Ð±Ð°Ñ€".split("_"),monthsShort:"Ñ˜Ð°Ð½._Ñ„ÐµÐ±._Ð¼Ð°Ñ€._Ð°Ð¿Ñ€._Ð¼Ð°Ñ˜_Ñ˜ÑƒÐ½_Ñ˜ÑƒÐ»_Ð°Ð²Ð³._ÑÐµÐ¿._Ð¾ÐºÑ‚._Ð½Ð¾Ð²._Ð´ÐµÑ†.".split("_"),monthsParseExact:!0,weekdays:"Ð½ÐµÐ´ÐµÑ™Ð°_Ð¿Ð¾Ð½ÐµÐ´ÐµÑ™Ð°Ðº_ÑƒÑ‚Ð¾Ñ€Ð°Ðº_ÑÑ€ÐµÐ´Ð°_Ñ‡ÐµÑ‚Ð²Ñ€Ñ‚Ð°Ðº_Ð¿ÐµÑ‚Ð°Ðº_ÑÑƒÐ±Ð¾Ñ‚Ð°".split("_"),weekdaysShort:"Ð½ÐµÐ´._Ð¿Ð¾Ð½._ÑƒÑ‚Ð¾._ÑÑ€Ðµ._Ñ‡ÐµÑ‚._Ð¿ÐµÑ‚._ÑÑƒÐ±.".split("_"),weekdaysMin:"Ð½Ðµ_Ð¿Ð¾_ÑƒÑ‚_ÑÑ€_Ñ‡Ðµ_Ð¿Ðµ_ÑÑƒ".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"D. M. YYYY.",LL:"D. MMMM YYYY.",LLL:"D. MMMM YYYY. H:mm",LLLL:"dddd, D. MMMM YYYY. H:mm"},calendar:{sameDay:"[Ð´Ð°Ð½Ð°Ñ Ñƒ] LT",nextDay:"[ÑÑƒÑ‚Ñ€Ð° Ñƒ] LT",nextWeek:function(){switch(this.day()){case 0:return"[Ñƒ] [Ð½ÐµÐ´ÐµÑ™Ñƒ] [Ñƒ] LT";case 3:return"[Ñƒ] [ÑÑ€ÐµÐ´Ñƒ] [Ñƒ] LT";case 6:return"[Ñƒ] [ÑÑƒÐ±Ð¾Ñ‚Ñƒ] [Ñƒ] LT";case 1:case 2:case 4:case 5:return"[Ñƒ] dddd [Ñƒ] LT"}},lastDay:"[Ñ˜ÑƒÑ‡Ðµ Ñƒ] LT",lastWeek:function(){return["[Ð¿Ñ€Ð¾ÑˆÐ»Ðµ] [Ð½ÐµÐ´ÐµÑ™Ðµ] [Ñƒ] LT","[Ð¿Ñ€Ð¾ÑˆÐ»Ð¾Ð³] [Ð¿Ð¾Ð½ÐµÐ´ÐµÑ™ÐºÐ°] [Ñƒ] LT","[Ð¿Ñ€Ð¾ÑˆÐ»Ð¾Ð³] [ÑƒÑ‚Ð¾Ñ€ÐºÐ°] [Ñƒ] LT","[Ð¿Ñ€Ð¾ÑˆÐ»Ðµ] [ÑÑ€ÐµÐ´Ðµ] [Ñƒ] LT","[Ð¿Ñ€Ð¾ÑˆÐ»Ð¾Ð³] [Ñ‡ÐµÑ‚Ð²Ñ€Ñ‚ÐºÐ°] [Ñƒ] LT","[Ð¿Ñ€Ð¾ÑˆÐ»Ð¾Ð³] [Ð¿ÐµÑ‚ÐºÐ°] [Ñƒ] LT","[Ð¿Ñ€Ð¾ÑˆÐ»Ðµ] [ÑÑƒÐ±Ð¾Ñ‚Ðµ] [Ñƒ] LT"][this.day()]},sameElse:"L"},relativeTime:{future:"Ð·Ð° %s",past:"Ð¿Ñ€Ðµ %s",s:"Ð½ÐµÐºÐ¾Ð»Ð¸ÐºÐ¾ ÑÐµÐºÑƒÐ½Ð´Ð¸",ss:t.translate,m:t.translate,mm:t.translate,h:t.translate,hh:t.translate,d:t.translate,dd:t.translate,M:t.translate,MM:t.translate,y:t.translate,yy:t.translate},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}})}(n(30381))},49131:function(e,t,n){!function(e){"use strict";var t={words:{ss:["sekunda","sekunde","sekundi"],m:["jedan minut","jednog minuta"],mm:["minut","minuta","minuta"],h:["jedan sat","jednog sata"],hh:["sat","sata","sati"],d:["jedan dan","jednog dana"],dd:["dan","dana","dana"],M:["jedan mesec","jednog meseca"],MM:["mesec","meseca","meseci"],y:["jednu godinu","jedne godine"],yy:["godinu","godine","godina"]},correctGrammaticalCase:function(e,t){return e%10>=1&&e%10<=4&&(e%100<10||e%100>=20)?e%10==1?t[0]:t[1]:t[2]},translate:function(e,n,r,a){var s,i=t.words[r];return 1===r.length?"y"===r&&n?"jedna godina":a||n?i[0]:i[1]:(s=t.correctGrammaticalCase(e,i),"yy"===r&&n&&"godinu"===s?e+" godina":e+" "+s)}};e.defineLocale("sr",{months:"januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar".split("_"),monthsShort:"jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"nedelja_ponedeljak_utorak_sreda_Äetvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sre._Äet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_Äe_pe_su".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"D. M. YYYY.",LL:"D. MMMM YYYY.",LLL:"D. MMMM YYYY. H:mm",LLLL:"dddd, D. MMMM YYYY. H:mm"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedelju] [u] LT";case 3:return"[u] [sredu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[juÄe u] LT",lastWeek:function(){return["[proÅ¡le] [nedelje] [u] LT","[proÅ¡log] [ponedeljka] [u] LT","[proÅ¡log] [utorka] [u] LT","[proÅ¡le] [srede] [u] LT","[proÅ¡log] [Äetvrtka] [u] LT","[proÅ¡log] [petka] [u] LT","[proÅ¡le] [subote] [u] LT"][this.day()]},sameElse:"L"},relativeTime:{future:"za %s",past:"pre %s",s:"nekoliko sekundi",ss:t.translate,m:t.translate,mm:t.translate,h:t.translate,hh:t.translate,d:t.translate,dd:t.translate,M:t.translate,MM:t.translate,y:t.translate,yy:t.translate},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}})}(n(30381))},85893:function(e,t,n){!function(e){"use strict";e.defineLocale("ss",{months:"Bhimbidvwane_Indlovana_Indlov'lenkhulu_Mabasa_Inkhwekhweti_Inhlaba_Kholwane_Ingci_Inyoni_Imphala_Lweti_Ingongoni".split("_"),monthsShort:"Bhi_Ina_Inu_Mab_Ink_Inh_Kho_Igc_Iny_Imp_Lwe_Igo".split("_"),weekdays:"Lisontfo_Umsombuluko_Lesibili_Lesitsatfu_Lesine_Lesihlanu_Umgcibelo".split("_"),weekdaysShort:"Lis_Umb_Lsb_Les_Lsi_Lsh_Umg".split("_"),weekdaysMin:"Li_Us_Lb_Lt_Ls_Lh_Ug".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendar:{sameDay:"[Namuhla nga] LT",nextDay:"[Kusasa nga] LT",nextWeek:"dddd [nga] LT",lastDay:"[Itolo nga] LT",lastWeek:"dddd [leliphelile] [nga] LT",sameElse:"L"},relativeTime:{future:"nga %s",past:"wenteka nga %s",s:"emizuzwana lomcane",ss:"%d mzuzwana",m:"umzuzu",mm:"%d emizuzu",h:"lihora",hh:"%d emahora",d:"lilanga",dd:"%d emalanga",M:"inyanga",MM:"%d tinyanga",y:"umnyaka",yy:"%d iminyaka"},meridiemParse:/ekuseni|emini|entsambama|ebusuku/,meridiem:function(e,t,n){return e<11?"ekuseni":e<15?"emini":e<19?"entsambama":"ebusuku"},meridiemHour:function(e,t){return 12===e&&(e=0),"ekuseni"===t?e:"emini"===t?e>=11?e:e+12:"entsambama"===t||"ebusuku"===t?0===e?0:e+12:void 0},dayOfMonthOrdinalParse:/\d{1,2}/,ordinal:"%d",week:{dow:1,doy:4}})}(n(30381))},98760:function(e,t,n){!function(e){"use strict";e.defineLocale("sv",{months:"januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),weekdays:"sÃ¶ndag_mÃ¥ndag_tisdag_onsdag_torsdag_fredag_lÃ¶rdag".split("_"),weekdaysShort:"sÃ¶n_mÃ¥n_tis_ons_tor_fre_lÃ¶r".split("_"),weekdaysMin:"sÃ¶_mÃ¥_ti_on_to_fr_lÃ¶".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [kl.] HH:mm",LLLL:"dddd D MMMM YYYY [kl.] HH:mm",lll:"D MMM YYYY HH:mm",llll:"ddd D MMM YYYY HH:mm"},calendar:{sameDay:"[Idag] LT",nextDay:"[Imorgon] LT",lastDay:"[IgÃ¥r] LT",nextWeek:"[PÃ¥] dddd LT",lastWeek:"[I] dddd[s] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"fÃ¶r %s sedan",s:"nÃ¥gra sekunder",ss:"%d sekunder",m:"en minut",mm:"%d minuter",h:"en timme",hh:"%d timmar",d:"en dag",dd:"%d dagar",M:"en mÃ¥nad",MM:"%d mÃ¥nader",y:"ett Ã¥r",yy:"%d Ã¥r"},dayOfMonthOrdinalParse:/\d{1,2}(\:e|\:a)/,ordinal:function(e){var t=e%10;return e+(1==~~(e%100/10)?":e":1===t||2===t?":a":":e")},week:{dow:1,doy:4}})}(n(30381))},91172:function(e,t,n){!function(e){"use strict";e.defineLocale("sw",{months:"Januari_Februari_Machi_Aprili_Mei_Juni_Julai_Agosti_Septemba_Oktoba_Novemba_Desemba".split("_"),monthsShort:"Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ago_Sep_Okt_Nov_Des".split("_"),weekdays:"Jumapili_Jumatatu_Jumanne_Jumatano_Alhamisi_Ijumaa_Jumamosi".split("_"),weekdaysShort:"Jpl_Jtat_Jnne_Jtan_Alh_Ijm_Jmos".split("_"),weekdaysMin:"J2_J3_J4_J5_Al_Ij_J1".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"hh:mm A",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[leo saa] LT",nextDay:"[kesho saa] LT",nextWeek:"[wiki ijayo] dddd [saat] LT",lastDay:"[jana] LT",lastWeek:"[wiki iliyopita] dddd [saat] LT",sameElse:"L"},relativeTime:{future:"%s baadaye",past:"tokea %s",s:"hivi punde",ss:"sekunde %d",m:"dakika moja",mm:"dakika %d",h:"saa limoja",hh:"masaa %d",d:"siku moja",dd:"siku %d",M:"mwezi mmoja",MM:"miezi %d",y:"mwaka mmoja",yy:"miaka %d"},week:{dow:1,doy:7}})}(n(30381))},27333:function(e,t,n){!function(e){"use strict";var t={1:"à¯§",2:"à¯¨",3:"à¯©",4:"à¯ª",5:"à¯«",6:"à¯¬",7:"à¯­",8:"à¯®",9:"à¯¯",0:"à¯¦"},n={"à¯§":"1","à¯¨":"2","à¯©":"3","à¯ª":"4","à¯«":"5","à¯¬":"6","à¯­":"7","à¯®":"8","à¯¯":"9","à¯¦":"0"};e.defineLocale("ta",{months:"à®œà®©à®µà®°à®¿_à®ªà®¿à®ªà¯à®°à®µà®°à®¿_à®®à®¾à®°à¯à®šà¯_à®à®ªà¯à®°à®²à¯_à®®à¯‡_à®œà¯‚à®©à¯_à®œà¯‚à®²à¯ˆ_à®†à®•à®¸à¯à®Ÿà¯_à®šà¯†à®ªà¯à®Ÿà¯†à®®à¯à®ªà®°à¯_à®…à®•à¯à®Ÿà¯‡à®¾à®ªà®°à¯_à®¨à®µà®®à¯à®ªà®°à¯_à®Ÿà®¿à®šà®®à¯à®ªà®°à¯".split("_"),monthsShort:"à®œà®©à®µà®°à®¿_à®ªà®¿à®ªà¯à®°à®µà®°à®¿_à®®à®¾à®°à¯à®šà¯_à®à®ªà¯à®°à®²à¯_à®®à¯‡_à®œà¯‚à®©à¯_à®œà¯‚à®²à¯ˆ_à®†à®•à®¸à¯à®Ÿà¯_à®šà¯†à®ªà¯à®Ÿà¯†à®®à¯à®ªà®°à¯_à®…à®•à¯à®Ÿà¯‡à®¾à®ªà®°à¯_à®¨à®µà®®à¯à®ªà®°à¯_à®Ÿà®¿à®šà®®à¯à®ªà®°à¯".split("_"),weekdays:"à®žà®¾à®¯à®¿à®±à¯à®±à¯à®•à¯à®•à®¿à®´à®®à¯ˆ_à®¤à®¿à®™à¯à®•à®Ÿà¯à®•à®¿à®´à®®à¯ˆ_à®šà¯†à®µà¯à®µà®¾à®¯à¯à®•à®¿à®´à®®à¯ˆ_à®ªà¯à®¤à®©à¯à®•à®¿à®´à®®à¯ˆ_à®µà®¿à®¯à®¾à®´à®•à¯à®•à®¿à®´à®®à¯ˆ_à®µà¯†à®³à¯à®³à®¿à®•à¯à®•à®¿à®´à®®à¯ˆ_à®šà®©à®¿à®•à¯à®•à®¿à®´à®®à¯ˆ".split("_"),weekdaysShort:"à®žà®¾à®¯à®¿à®±à¯_à®¤à®¿à®™à¯à®•à®³à¯_à®šà¯†à®µà¯à®µà®¾à®¯à¯_à®ªà¯à®¤à®©à¯_à®µà®¿à®¯à®¾à®´à®©à¯_à®µà¯†à®³à¯à®³à®¿_à®šà®©à®¿".split("_"),weekdaysMin:"à®žà®¾_à®¤à®¿_à®šà¯†_à®ªà¯_à®µà®¿_à®µà¯†_à®š".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, HH:mm",LLLL:"dddd, D MMMM YYYY, HH:mm"},calendar:{sameDay:"[à®‡à®©à¯à®±à¯] LT",nextDay:"[à®¨à®¾à®³à¯ˆ] LT",nextWeek:"dddd, LT",lastDay:"[à®¨à¯‡à®±à¯à®±à¯] LT",lastWeek:"[à®•à®Ÿà®¨à¯à®¤ à®µà®¾à®°à®®à¯] dddd, LT",sameElse:"L"},relativeTime:{future:"%s à®‡à®²à¯",past:"%s à®®à¯à®©à¯",s:"à®’à®°à¯ à®šà®¿à®² à®µà®¿à®¨à®¾à®Ÿà®¿à®•à®³à¯",ss:"%d à®µà®¿à®¨à®¾à®Ÿà®¿à®•à®³à¯",m:"à®’à®°à¯ à®¨à®¿à®®à®¿à®Ÿà®®à¯",mm:"%d à®¨à®¿à®®à®¿à®Ÿà®™à¯à®•à®³à¯",h:"à®’à®°à¯ à®®à®£à®¿ à®¨à¯‡à®°à®®à¯",hh:"%d à®®à®£à®¿ à®¨à¯‡à®°à®®à¯",d:"à®’à®°à¯ à®¨à®¾à®³à¯",dd:"%d à®¨à®¾à®Ÿà¯à®•à®³à¯",M:"à®’à®°à¯ à®®à®¾à®¤à®®à¯",MM:"%d à®®à®¾à®¤à®™à¯à®•à®³à¯",y:"à®’à®°à¯ à®µà®°à¯à®Ÿà®®à¯",yy:"%d à®†à®£à¯à®Ÿà¯à®•à®³à¯"},dayOfMonthOrdinalParse:/\d{1,2}à®µà®¤à¯/,ordinal:function(e){return e+"à®µà®¤à¯"},preparse:function(e){return e.replace(/[à¯§à¯¨à¯©à¯ªà¯«à¯¬à¯­à¯®à¯¯à¯¦]/g,(function(e){return n[e]}))},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]}))},meridiemParse:/à®¯à®¾à®®à®®à¯|à®µà¯ˆà®•à®±à¯ˆ|à®•à®¾à®²à¯ˆ|à®¨à®£à¯à®ªà®•à®²à¯|à®Žà®±à¯à®ªà®¾à®Ÿà¯|à®®à®¾à®²à¯ˆ/,meridiem:function(e,t,n){return e<2?" à®¯à®¾à®®à®®à¯":e<6?" à®µà¯ˆà®•à®±à¯ˆ":e<10?" à®•à®¾à®²à¯ˆ":e<14?" à®¨à®£à¯à®ªà®•à®²à¯":e<18?" à®Žà®±à¯à®ªà®¾à®Ÿà¯":e<22?" à®®à®¾à®²à¯ˆ":" à®¯à®¾à®®à®®à¯"},meridiemHour:function(e,t){return 12===e&&(e=0),"à®¯à®¾à®®à®®à¯"===t?e<2?e:e+12:"à®µà¯ˆà®•à®±à¯ˆ"===t||"à®•à®¾à®²à¯ˆ"===t||"à®¨à®£à¯à®ªà®•à®²à¯"===t&&e>=10?e:e+12},week:{dow:0,doy:6}})}(n(30381))},23110:function(e,t,n){!function(e){"use strict";e.defineLocale("te",{months:"à°œà°¨à°µà°°à°¿_à°«à°¿à°¬à±à°°à°µà°°à°¿_à°®à°¾à°°à±à°šà°¿_à°à°ªà±à°°à°¿à°²à±_à°®à±‡_à°œà±‚à°¨à±_à°œà±à°²à±ˆ_à°†à°—à°¸à±à°Ÿà±_à°¸à±†à°ªà±à°Ÿà±†à°‚à°¬à°°à±_à°…à°•à±à°Ÿà±‹à°¬à°°à±_à°¨à°µà°‚à°¬à°°à±_à°¡à°¿à°¸à±†à°‚à°¬à°°à±".split("_"),monthsShort:"à°œà°¨._à°«à°¿à°¬à±à°°._à°®à°¾à°°à±à°šà°¿_à°à°ªà±à°°à°¿._à°®à±‡_à°œà±‚à°¨à±_à°œà±à°²à±ˆ_à°†à°—._à°¸à±†à°ªà±._à°…à°•à±à°Ÿà±‹._à°¨à°µ._à°¡à°¿à°¸à±†.".split("_"),monthsParseExact:!0,weekdays:"à°†à°¦à°¿à°µà°¾à°°à°‚_à°¸à±‹à°®à°µà°¾à°°à°‚_à°®à°‚à°—à°³à°µà°¾à°°à°‚_à°¬à±à°§à°µà°¾à°°à°‚_à°—à±à°°à±à°µà°¾à°°à°‚_à°¶à±à°•à±à°°à°µà°¾à°°à°‚_à°¶à°¨à°¿à°µà°¾à°°à°‚".split("_"),weekdaysShort:"à°†à°¦à°¿_à°¸à±‹à°®_à°®à°‚à°—à°³_à°¬à±à°§_à°—à±à°°à±_à°¶à±à°•à±à°°_à°¶à°¨à°¿".split("_"),weekdaysMin:"à°†_à°¸à±‹_à°®à°‚_à°¬à±_à°—à±_à°¶à±_à°¶".split("_"),longDateFormat:{LT:"A h:mm",LTS:"A h:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm",LLLL:"dddd, D MMMM YYYY, A h:mm"},calendar:{sameDay:"[à°¨à±‡à°¡à±] LT",nextDay:"[à°°à±‡à°ªà±] LT",nextWeek:"dddd, LT",lastDay:"[à°¨à°¿à°¨à±à°¨] LT",lastWeek:"[à°—à°¤] dddd, LT",sameElse:"L"},relativeTime:{future:"%s à°²à±‹",past:"%s à°•à±à°°à°¿à°¤à°‚",s:"à°•à±Šà°¨à±à°¨à°¿ à°•à±à°·à°£à°¾à°²à±",ss:"%d à°¸à±†à°•à°¨à±à°²à±",m:"à°’à°• à°¨à°¿à°®à°¿à°·à°‚",mm:"%d à°¨à°¿à°®à°¿à°·à°¾à°²à±",h:"à°’à°• à°—à°‚à°Ÿ",hh:"%d à°—à°‚à°Ÿà°²à±",d:"à°’à°• à°°à±‹à°œà±",dd:"%d à°°à±‹à°œà±à°²à±",M:"à°’à°• à°¨à±†à°²",MM:"%d à°¨à±†à°²à°²à±",y:"à°’à°• à°¸à°‚à°µà°¤à±à°¸à°°à°‚",yy:"%d à°¸à°‚à°µà°¤à±à°¸à°°à°¾à°²à±"},dayOfMonthOrdinalParse:/\d{1,2}à°µ/,ordinal:"%dà°µ",meridiemParse:/à°°à°¾à°¤à±à°°à°¿|à°‰à°¦à°¯à°‚|à°®à°§à±à°¯à°¾à°¹à±à°¨à°‚|à°¸à°¾à°¯à°‚à°¤à±à°°à°‚/,meridiemHour:function(e,t){return 12===e&&(e=0),"à°°à°¾à°¤à±à°°à°¿"===t?e<4?e:e+12:"à°‰à°¦à°¯à°‚"===t?e:"à°®à°§à±à°¯à°¾à°¹à±à°¨à°‚"===t?e>=10?e:e+12:"à°¸à°¾à°¯à°‚à°¤à±à°°à°‚"===t?e+12:void 0},meridiem:function(e,t,n){return e<4?"à°°à°¾à°¤à±à°°à°¿":e<10?"à°‰à°¦à°¯à°‚":e<17?"à°®à°§à±à°¯à°¾à°¹à±à°¨à°‚":e<20?"à°¸à°¾à°¯à°‚à°¤à±à°°à°‚":"à°°à°¾à°¤à±à°°à°¿"},week:{dow:0,doy:6}})}(n(30381))},52095:function(e,t,n){!function(e){"use strict";e.defineLocale("tet",{months:"Janeiru_Fevereiru_Marsu_Abril_Maiu_JuÃ±u_Jullu_Agustu_Setembru_Outubru_Novembru_Dezembru".split("_"),monthsShort:"Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),weekdays:"Domingu_Segunda_Tersa_Kuarta_Kinta_Sesta_Sabadu".split("_"),weekdaysShort:"Dom_Seg_Ters_Kua_Kint_Sest_Sab".split("_"),weekdaysMin:"Do_Seg_Te_Ku_Ki_Ses_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Ohin iha] LT",nextDay:"[Aban iha] LT",nextWeek:"dddd [iha] LT",lastDay:"[Horiseik iha] LT",lastWeek:"dddd [semana kotuk] [iha] LT",sameElse:"L"},relativeTime:{future:"iha %s",past:"%s liuba",s:"segundu balun",ss:"segundu %d",m:"minutu ida",mm:"minutu %d",h:"oras ida",hh:"oras %d",d:"loron ida",dd:"loron %d",M:"fulan ida",MM:"fulan %d",y:"tinan ida",yy:"tinan %d"},dayOfMonthOrdinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(e){var t=e%10;return e+(1==~~(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th")},week:{dow:1,doy:4}})}(n(30381))},27321:function(e,t,n){!function(e){"use strict";var t={0:"-ÑƒÐ¼",1:"-ÑƒÐ¼",2:"-ÑŽÐ¼",3:"-ÑŽÐ¼",4:"-ÑƒÐ¼",5:"-ÑƒÐ¼",6:"-ÑƒÐ¼",7:"-ÑƒÐ¼",8:"-ÑƒÐ¼",9:"-ÑƒÐ¼",10:"-ÑƒÐ¼",12:"-ÑƒÐ¼",13:"-ÑƒÐ¼",20:"-ÑƒÐ¼",30:"-ÑŽÐ¼",40:"-ÑƒÐ¼",50:"-ÑƒÐ¼",60:"-ÑƒÐ¼",70:"-ÑƒÐ¼",80:"-ÑƒÐ¼",90:"-ÑƒÐ¼",100:"-ÑƒÐ¼"};e.defineLocale("tg",{months:{format:"ÑÐ½Ð²Ð°Ñ€Ð¸_Ñ„ÐµÐ²Ñ€Ð°Ð»Ð¸_Ð¼Ð°Ñ€Ñ‚Ð¸_Ð°Ð¿Ñ€ÐµÐ»Ð¸_Ð¼Ð°Ð¹Ð¸_Ð¸ÑŽÐ½Ð¸_Ð¸ÑŽÐ»Ð¸_Ð°Ð²Ð³ÑƒÑÑ‚Ð¸_ÑÐµÐ½Ñ‚ÑÐ±Ñ€Ð¸_Ð¾ÐºÑ‚ÑÐ±Ñ€Ð¸_Ð½Ð¾ÑÐ±Ñ€Ð¸_Ð´ÐµÐºÐ°Ð±Ñ€Ð¸".split("_"),standalone:"ÑÐ½Ð²Ð°Ñ€_Ñ„ÐµÐ²Ñ€Ð°Ð»_Ð¼Ð°Ñ€Ñ‚_Ð°Ð¿Ñ€ÐµÐ»_Ð¼Ð°Ð¹_Ð¸ÑŽÐ½_Ð¸ÑŽÐ»_Ð°Ð²Ð³ÑƒÑÑ‚_ÑÐµÐ½Ñ‚ÑÐ±Ñ€_Ð¾ÐºÑ‚ÑÐ±Ñ€_Ð½Ð¾ÑÐ±Ñ€_Ð´ÐµÐºÐ°Ð±Ñ€".split("_")},monthsShort:"ÑÐ½Ð²_Ñ„ÐµÐ²_Ð¼Ð°Ñ€_Ð°Ð¿Ñ€_Ð¼Ð°Ð¹_Ð¸ÑŽÐ½_Ð¸ÑŽÐ»_Ð°Ð²Ð³_ÑÐµÐ½_Ð¾ÐºÑ‚_Ð½Ð¾Ñ_Ð´ÐµÐº".split("_"),weekdays:"ÑÐºÑˆÐ°Ð½Ð±Ðµ_Ð´ÑƒÑˆÐ°Ð½Ð±Ðµ_ÑÐµÑˆÐ°Ð½Ð±Ðµ_Ñ‡Ð¾Ñ€ÑˆÐ°Ð½Ð±Ðµ_Ð¿Ð°Ð½Ò·ÑˆÐ°Ð½Ð±Ðµ_Ò·ÑƒÐ¼ÑŠÐ°_ÑˆÐ°Ð½Ð±Ðµ".split("_"),weekdaysShort:"ÑÑˆÐ±_Ð´ÑˆÐ±_ÑÑˆÐ±_Ñ‡ÑˆÐ±_Ð¿ÑˆÐ±_Ò·ÑƒÐ¼_ÑˆÐ½Ð±".split("_"),weekdaysMin:"ÑÑˆ_Ð´Ñˆ_ÑÑˆ_Ñ‡Ñˆ_Ð¿Ñˆ_Ò·Ð¼_ÑˆÐ±".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Ð˜Ð¼Ñ€Ó¯Ð· ÑÐ¾Ð°Ñ‚Ð¸] LT",nextDay:"[Ð¤Ð°Ñ€Ð´Ð¾ ÑÐ¾Ð°Ñ‚Ð¸] LT",lastDay:"[Ð”Ð¸Ñ€Ó¯Ð· ÑÐ¾Ð°Ñ‚Ð¸] LT",nextWeek:"dddd[Ð¸] [Ò³Ð°Ñ„Ñ‚Ð°Ð¸ Ð¾ÑÐ½Ð´Ð° ÑÐ¾Ð°Ñ‚Ð¸] LT",lastWeek:"dddd[Ð¸] [Ò³Ð°Ñ„Ñ‚Ð°Ð¸ Ð³ÑƒÐ·Ð°ÑˆÑ‚Ð° ÑÐ¾Ð°Ñ‚Ð¸] LT",sameElse:"L"},relativeTime:{future:"Ð±Ð°ÑŠÐ´Ð¸ %s",past:"%s Ð¿ÐµÑˆ",s:"ÑÐºÑ‡Ð°Ð½Ð´ ÑÐ¾Ð½Ð¸Ñ",m:"ÑÐº Ð´Ð°Ò›Ð¸Ò›Ð°",mm:"%d Ð´Ð°Ò›Ð¸Ò›Ð°",h:"ÑÐº ÑÐ¾Ð°Ñ‚",hh:"%d ÑÐ¾Ð°Ñ‚",d:"ÑÐº Ñ€Ó¯Ð·",dd:"%d Ñ€Ó¯Ð·",M:"ÑÐº Ð¼Ð¾Ò³",MM:"%d Ð¼Ð¾Ò³",y:"ÑÐº ÑÐ¾Ð»",yy:"%d ÑÐ¾Ð»"},meridiemParse:/ÑˆÐ°Ð±|ÑÑƒÐ±Ò³|Ñ€Ó¯Ð·|Ð±ÐµÐ³Ð¾Ò³/,meridiemHour:function(e,t){return 12===e&&(e=0),"ÑˆÐ°Ð±"===t?e<4?e:e+12:"ÑÑƒÐ±Ò³"===t?e:"Ñ€Ó¯Ð·"===t?e>=11?e:e+12:"Ð±ÐµÐ³Ð¾Ò³"===t?e+12:void 0},meridiem:function(e,t,n){return e<4?"ÑˆÐ°Ð±":e<11?"ÑÑƒÐ±Ò³":e<16?"Ñ€Ó¯Ð·":e<19?"Ð±ÐµÐ³Ð¾Ò³":"ÑˆÐ°Ð±"},dayOfMonthOrdinalParse:/\d{1,2}-(ÑƒÐ¼|ÑŽÐ¼)/,ordinal:function(e){return e+(t[e]||t[e%10]||t[e>=100?100:null])},week:{dow:1,doy:7}})}(n(30381))},9041:function(e,t,n){!function(e){"use strict";e.defineLocale("th",{months:"à¸¡à¸à¸£à¸²à¸„à¸¡_à¸à¸¸à¸¡à¸ à¸²à¸žà¸±à¸™à¸˜à¹Œ_à¸¡à¸µà¸™à¸²à¸„à¸¡_à¹€à¸¡à¸©à¸²à¸¢à¸™_à¸žà¸¤à¸©à¸ à¸²à¸„à¸¡_à¸¡à¸´à¸–à¸¸à¸™à¸²à¸¢à¸™_à¸à¸£à¸à¸Žà¸²à¸„à¸¡_à¸ªà¸´à¸‡à¸«à¸²à¸„à¸¡_à¸à¸±à¸™à¸¢à¸²à¸¢à¸™_à¸•à¸¸à¸¥à¸²à¸„à¸¡_à¸žà¸¤à¸¨à¸ˆà¸´à¸à¸²à¸¢à¸™_à¸˜à¸±à¸™à¸§à¸²à¸„à¸¡".split("_"),monthsShort:"à¸¡.à¸„._à¸.à¸ž._à¸¡à¸µ.à¸„._à¹€à¸¡.à¸¢._à¸ž.à¸„._à¸¡à¸´.à¸¢._à¸.à¸„._à¸ª.à¸„._à¸.à¸¢._à¸•.à¸„._à¸ž.à¸¢._à¸˜.à¸„.".split("_"),monthsParseExact:!0,weekdays:"à¸­à¸²à¸—à¸´à¸•à¸¢à¹Œ_à¸ˆà¸±à¸™à¸—à¸£à¹Œ_à¸­à¸±à¸‡à¸„à¸²à¸£_à¸žà¸¸à¸˜_à¸žà¸¤à¸«à¸±à¸ªà¸šà¸”à¸µ_à¸¨à¸¸à¸à¸£à¹Œ_à¹€à¸ªà¸²à¸£à¹Œ".split("_"),weekdaysShort:"à¸­à¸²à¸—à¸´à¸•à¸¢à¹Œ_à¸ˆà¸±à¸™à¸—à¸£à¹Œ_à¸­à¸±à¸‡à¸„à¸²à¸£_à¸žà¸¸à¸˜_à¸žà¸¤à¸«à¸±à¸ª_à¸¨à¸¸à¸à¸£à¹Œ_à¹€à¸ªà¸²à¸£à¹Œ".split("_"),weekdaysMin:"à¸­à¸²._à¸ˆ._à¸­._à¸ž._à¸žà¸¤._à¸¨._à¸ª.".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY à¹€à¸§à¸¥à¸² H:mm",LLLL:"à¸§à¸±à¸™ddddà¸—à¸µà¹ˆ D MMMM YYYY à¹€à¸§à¸¥à¸² H:mm"},meridiemParse:/à¸à¹ˆà¸­à¸™à¹€à¸—à¸µà¹ˆà¸¢à¸‡|à¸«à¸¥à¸±à¸‡à¹€à¸—à¸µà¹ˆà¸¢à¸‡/,isPM:function(e){return"à¸«à¸¥à¸±à¸‡à¹€à¸—à¸µà¹ˆà¸¢à¸‡"===e},meridiem:function(e,t,n){return e<12?"à¸à¹ˆà¸­à¸™à¹€à¸—à¸µà¹ˆà¸¢à¸‡":"à¸«à¸¥à¸±à¸‡à¹€à¸—à¸µà¹ˆà¸¢à¸‡"},calendar:{sameDay:"[à¸§à¸±à¸™à¸™à¸µà¹‰ à¹€à¸§à¸¥à¸²] LT",nextDay:"[à¸žà¸£à¸¸à¹ˆà¸‡à¸™à¸µà¹‰ à¹€à¸§à¸¥à¸²] LT",nextWeek:"dddd[à¸«à¸™à¹‰à¸² à¹€à¸§à¸¥à¸²] LT",lastDay:"[à¹€à¸¡à¸·à¹ˆà¸­à¸§à¸²à¸™à¸™à¸µà¹‰ à¹€à¸§à¸¥à¸²] LT",lastWeek:"[à¸§à¸±à¸™]dddd[à¸—à¸µà¹ˆà¹à¸¥à¹‰à¸§ à¹€à¸§à¸¥à¸²] LT",sameElse:"L"},relativeTime:{future:"à¸­à¸µà¸ %s",past:"%sà¸—à¸µà¹ˆà¹à¸¥à¹‰à¸§",s:"à¹„à¸¡à¹ˆà¸à¸µà¹ˆà¸§à¸´à¸™à¸²à¸—à¸µ",ss:"%d à¸§à¸´à¸™à¸²à¸—à¸µ",m:"1 à¸™à¸²à¸—à¸µ",mm:"%d à¸™à¸²à¸—à¸µ",h:"1 à¸Šà¸±à¹ˆà¸§à¹‚à¸¡à¸‡",hh:"%d à¸Šà¸±à¹ˆà¸§à¹‚à¸¡à¸‡",d:"1 à¸§à¸±à¸™",dd:"%d à¸§à¸±à¸™",w:"1 à¸ªà¸±à¸›à¸”à¸²à¸«à¹Œ",ww:"%d à¸ªà¸±à¸›à¸”à¸²à¸«à¹Œ",M:"1 à¹€à¸”à¸·à¸­à¸™",MM:"%d à¹€à¸”à¸·à¸­à¸™",y:"1 à¸›à¸µ",yy:"%d à¸›à¸µ"}})}(n(30381))},19005:function(e,t,n){!function(e){"use strict";var t={1:"'inji",5:"'inji",8:"'inji",70:"'inji",80:"'inji",2:"'nji",7:"'nji",20:"'nji",50:"'nji",3:"'Ã¼nji",4:"'Ã¼nji",100:"'Ã¼nji",6:"'njy",9:"'unjy",10:"'unjy",30:"'unjy",60:"'ynjy",90:"'ynjy"};e.defineLocale("tk",{months:"Ãanwar_Fewral_Mart_Aprel_MaÃ½_IÃ½un_IÃ½ul_Awgust_SentÃ½abr_OktÃ½abr_NoÃ½abr_Dekabr".split("_"),monthsShort:"Ãan_Few_Mar_Apr_MaÃ½_IÃ½n_IÃ½l_Awg_Sen_Okt_NoÃ½_Dek".split("_"),weekdays:"ÃekÅŸenbe_DuÅŸenbe_SiÅŸenbe_Ã‡arÅŸenbe_PenÅŸenbe_Anna_Åženbe".split("_"),weekdaysShort:"Ãek_DuÅŸ_SiÅŸ_Ã‡ar_Pen_Ann_Åžen".split("_"),weekdaysMin:"Ãk_DÅŸ_SÅŸ_Ã‡r_Pn_An_Åžn".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[bugÃ¼n sagat] LT",nextDay:"[ertir sagat] LT",nextWeek:"[indiki] dddd [sagat] LT",lastDay:"[dÃ¼Ã½n] LT",lastWeek:"[geÃ§en] dddd [sagat] LT",sameElse:"L"},relativeTime:{future:"%s soÅˆ",past:"%s Ã¶Åˆ",s:"birnÃ¤Ã§e sekunt",m:"bir minut",mm:"%d minut",h:"bir sagat",hh:"%d sagat",d:"bir gÃ¼n",dd:"%d gÃ¼n",M:"bir aÃ½",MM:"%d aÃ½",y:"bir Ã½yl",yy:"%d Ã½yl"},ordinal:function(e,n){switch(n){case"d":case"D":case"Do":case"DD":return e;default:if(0===e)return e+"'unjy";var r=e%10;return e+(t[r]||t[e%100-r]||t[e>=100?100:null])}},week:{dow:1,doy:7}})}(n(30381))},75768:function(e,t,n){!function(e){"use strict";e.defineLocale("tl-ph",{months:"Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre".split("_"),monthsShort:"Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis".split("_"),weekdays:"Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado".split("_"),weekdaysShort:"Lin_Lun_Mar_Miy_Huw_Biy_Sab".split("_"),weekdaysMin:"Li_Lu_Ma_Mi_Hu_Bi_Sab".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"MM/D/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY HH:mm",LLLL:"dddd, MMMM DD, YYYY HH:mm"},calendar:{sameDay:"LT [ngayong araw]",nextDay:"[Bukas ng] LT",nextWeek:"LT [sa susunod na] dddd",lastDay:"LT [kahapon]",lastWeek:"LT [noong nakaraang] dddd",sameElse:"L"},relativeTime:{future:"sa loob ng %s",past:"%s ang nakalipas",s:"ilang segundo",ss:"%d segundo",m:"isang minuto",mm:"%d minuto",h:"isang oras",hh:"%d oras",d:"isang araw",dd:"%d araw",M:"isang buwan",MM:"%d buwan",y:"isang taon",yy:"%d taon"},dayOfMonthOrdinalParse:/\d{1,2}/,ordinal:function(e){return e},week:{dow:1,doy:4}})}(n(30381))},89444:function(e,t,n){!function(e){"use strict";var t="pagh_waâ€™_chaâ€™_wej_loS_vagh_jav_Soch_chorgh_Hut".split("_");function n(e,n,r,a){var s=function(e){var n=Math.floor(e%1e3/100),r=Math.floor(e%100/10),a=e%10,s="";return n>0&&(s+=t[n]+"vatlh"),r>0&&(s+=(""!==s?" ":"")+t[r]+"maH"),a>0&&(s+=(""!==s?" ":"")+t[a]),""===s?"pagh":s}(e);switch(r){case"ss":return s+" lup";case"mm":return s+" tup";case"hh":return s+" rep";case"dd":return s+" jaj";case"MM":return s+" jar";case"yy":return s+" DIS"}}e.defineLocale("tlh",{months:"teraâ€™ jar waâ€™_teraâ€™ jar chaâ€™_teraâ€™ jar wej_teraâ€™ jar loS_teraâ€™ jar vagh_teraâ€™ jar jav_teraâ€™ jar Soch_teraâ€™ jar chorgh_teraâ€™ jar Hut_teraâ€™ jar waâ€™maH_teraâ€™ jar waâ€™maH waâ€™_teraâ€™ jar waâ€™maH chaâ€™".split("_"),monthsShort:"jar waâ€™_jar chaâ€™_jar wej_jar loS_jar vagh_jar jav_jar Soch_jar chorgh_jar Hut_jar waâ€™maH_jar waâ€™maH waâ€™_jar waâ€™maH chaâ€™".split("_"),monthsParseExact:!0,weekdays:"lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj".split("_"),weekdaysShort:"lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj".split("_"),weekdaysMin:"lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[DaHjaj] LT",nextDay:"[waâ€™leS] LT",nextWeek:"LLL",lastDay:"[waâ€™Huâ€™] LT",lastWeek:"LLL",sameElse:"L"},relativeTime:{future:function(e){var t=e;return-1!==e.indexOf("jaj")?t.slice(0,-3)+"leS":-1!==e.indexOf("jar")?t.slice(0,-3)+"waQ":-1!==e.indexOf("DIS")?t.slice(0,-3)+"nem":t+" pIq"},past:function(e){var t=e;return-1!==e.indexOf("jaj")?t.slice(0,-3)+"Huâ€™":-1!==e.indexOf("jar")?t.slice(0,-3)+"wen":-1!==e.indexOf("DIS")?t.slice(0,-3)+"ben":t+" ret"},s:"puS lup",ss:n,m:"waâ€™ tup",mm:n,h:"waâ€™ rep",hh:n,d:"waâ€™ jaj",dd:n,M:"waâ€™ jar",MM:n,y:"waâ€™ DIS",yy:n},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}(n(30381))},72397:function(e,t,n){!function(e){"use strict";var t={1:"'inci",5:"'inci",8:"'inci",70:"'inci",80:"'inci",2:"'nci",7:"'nci",20:"'nci",50:"'nci",3:"'Ã¼ncÃ¼",4:"'Ã¼ncÃ¼",100:"'Ã¼ncÃ¼",6:"'ncÄ±",9:"'uncu",10:"'uncu",30:"'uncu",60:"'Ä±ncÄ±",90:"'Ä±ncÄ±"};e.defineLocale("tr",{months:"Ocak_Åžubat_Mart_Nisan_MayÄ±s_Haziran_Temmuz_AÄŸustos_EylÃ¼l_Ekim_KasÄ±m_AralÄ±k".split("_"),monthsShort:"Oca_Åžub_Mar_Nis_May_Haz_Tem_AÄŸu_Eyl_Eki_Kas_Ara".split("_"),weekdays:"Pazar_Pazartesi_SalÄ±_Ã‡arÅŸamba_PerÅŸembe_Cuma_Cumartesi".split("_"),weekdaysShort:"Paz_Pzt_Sal_Ã‡ar_Per_Cum_Cmt".split("_"),weekdaysMin:"Pz_Pt_Sa_Ã‡a_Pe_Cu_Ct".split("_"),meridiem:function(e,t,n){return e<12?n?"Ã¶Ã¶":"Ã–Ã–":n?"Ã¶s":"Ã–S"},meridiemParse:/Ã¶Ã¶|Ã–Ã–|Ã¶s|Ã–S/,isPM:function(e){return"Ã¶s"===e||"Ã–S"===e},longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[bugÃ¼n saat] LT",nextDay:"[yarÄ±n saat] LT",nextWeek:"[gelecek] dddd [saat] LT",lastDay:"[dÃ¼n] LT",lastWeek:"[geÃ§en] dddd [saat] LT",sameElse:"L"},relativeTime:{future:"%s sonra",past:"%s Ã¶nce",s:"birkaÃ§ saniye",ss:"%d saniye",m:"bir dakika",mm:"%d dakika",h:"bir saat",hh:"%d saat",d:"bir gÃ¼n",dd:"%d gÃ¼n",w:"bir hafta",ww:"%d hafta",M:"bir ay",MM:"%d ay",y:"bir yÄ±l",yy:"%d yÄ±l"},ordinal:function(e,n){switch(n){case"d":case"D":case"Do":case"DD":return e;default:if(0===e)return e+"'Ä±ncÄ±";var r=e%10;return e+(t[r]||t[e%100-r]||t[e>=100?100:null])}},week:{dow:1,doy:7}})}(n(30381))},28254:function(e,t,n){!function(e){"use strict";function t(e,t,n,r){var a={s:["viensas secunds","'iensas secunds"],ss:[e+" secunds",e+" secunds"],m:["'n mÃ­ut","'iens mÃ­ut"],mm:[e+" mÃ­uts",e+" mÃ­uts"],h:["'n Ã¾ora","'iensa Ã¾ora"],hh:[e+" Ã¾oras",e+" Ã¾oras"],d:["'n ziua","'iensa ziua"],dd:[e+" ziuas",e+" ziuas"],M:["'n mes","'iens mes"],MM:[e+" mesen",e+" mesen"],y:["'n ar","'iens ar"],yy:[e+" ars",e+" ars"]};return r||t?a[n][0]:a[n][1]}e.defineLocale("tzl",{months:"Januar_Fevraglh_MarÃ§_AvrÃ¯u_Mai_GÃ¼n_Julia_Guscht_Setemvar_ListopÃ¤ts_Noemvar_Zecemvar".split("_"),monthsShort:"Jan_Fev_Mar_Avr_Mai_GÃ¼n_Jul_Gus_Set_Lis_Noe_Zec".split("_"),weekdays:"SÃºladi_LÃºneÃ§i_Maitzi_MÃ¡rcuri_XhÃºadi_ViÃ©nerÃ§i_SÃ¡turi".split("_"),weekdaysShort:"SÃºl_LÃºn_Mai_MÃ¡r_XhÃº_ViÃ©_SÃ¡t".split("_"),weekdaysMin:"SÃº_LÃº_Ma_MÃ¡_Xh_Vi_SÃ¡".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD.MM.YYYY",LL:"D. MMMM [dallas] YYYY",LLL:"D. MMMM [dallas] YYYY HH.mm",LLLL:"dddd, [li] D. MMMM [dallas] YYYY HH.mm"},meridiemParse:/d\'o|d\'a/i,isPM:function(e){return"d'o"===e.toLowerCase()},meridiem:function(e,t,n){return e>11?n?"d'o":"D'O":n?"d'a":"D'A"},calendar:{sameDay:"[oxhi Ã ] LT",nextDay:"[demÃ  Ã ] LT",nextWeek:"dddd [Ã ] LT",lastDay:"[ieiri Ã ] LT",lastWeek:"[sÃ¼r el] dddd [lasteu Ã ] LT",sameElse:"L"},relativeTime:{future:"osprei %s",past:"ja%s",s:t,ss:t,m:t,mm:t,h:t,hh:t,d:t,dd:t,M:t,MM:t,y:t,yy:t},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}(n(30381))},30699:function(e,t,n){!function(e){"use strict";e.defineLocale("tzm-latn",{months:"innayr_brË¤ayrË¤_marË¤sË¤_ibrir_mayyw_ywnyw_ywlywz_É£wÅ¡t_Å¡wtanbir_ktË¤wbrË¤_nwwanbir_dwjnbir".split("_"),monthsShort:"innayr_brË¤ayrË¤_marË¤sË¤_ibrir_mayyw_ywnyw_ywlywz_É£wÅ¡t_Å¡wtanbir_ktË¤wbrË¤_nwwanbir_dwjnbir".split("_"),weekdays:"asamas_aynas_asinas_akras_akwas_asimwas_asiá¸yas".split("_"),weekdaysShort:"asamas_aynas_asinas_akras_akwas_asimwas_asiá¸yas".split("_"),weekdaysMin:"asamas_aynas_asinas_akras_akwas_asimwas_asiá¸yas".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[asdkh g] LT",nextDay:"[aska g] LT",nextWeek:"dddd [g] LT",lastDay:"[assant g] LT",lastWeek:"dddd [g] LT",sameElse:"L"},relativeTime:{future:"dadkh s yan %s",past:"yan %s",s:"imik",ss:"%d imik",m:"minuá¸",mm:"%d minuá¸",h:"saÉ›a",hh:"%d tassaÉ›in",d:"ass",dd:"%d ossan",M:"ayowr",MM:"%d iyyirn",y:"asgas",yy:"%d isgasn"},week:{dow:6,doy:12}})}(n(30381))},51106:function(e,t,n){!function(e){"use strict";e.defineLocale("tzm",{months:"âµ‰âµâµâ´°âµ¢âµ”_â´±âµ•â´°âµ¢âµ•_âµŽâ´°âµ•âµš_âµ‰â´±âµ”âµ‰âµ”_âµŽâ´°âµ¢âµ¢âµ“_âµ¢âµ“âµâµ¢âµ“_âµ¢âµ“âµâµ¢âµ“âµ£_âµ–âµ“âµ›âµœ_âµ›âµ“âµœâ´°âµâ´±âµ‰âµ”_â´½âµŸâµ“â´±âµ•_âµâµ“âµ¡â´°âµâ´±âµ‰âµ”_â´·âµ“âµŠâµâ´±âµ‰âµ”".split("_"),monthsShort:"âµ‰âµâµâ´°âµ¢âµ”_â´±âµ•â´°âµ¢âµ•_âµŽâ´°âµ•âµš_âµ‰â´±âµ”âµ‰âµ”_âµŽâ´°âµ¢âµ¢âµ“_âµ¢âµ“âµâµ¢âµ“_âµ¢âµ“âµâµ¢âµ“âµ£_âµ–âµ“âµ›âµœ_âµ›âµ“âµœâ´°âµâ´±âµ‰âµ”_â´½âµŸâµ“â´±âµ•_âµâµ“âµ¡â´°âµâ´±âµ‰âµ”_â´·âµ“âµŠâµâ´±âµ‰âµ”".split("_"),weekdays:"â´°âµ™â´°âµŽâ´°âµ™_â´°âµ¢âµâ´°âµ™_â´°âµ™âµ‰âµâ´°âµ™_â´°â´½âµ”â´°âµ™_â´°â´½âµ¡â´°âµ™_â´°âµ™âµ‰âµŽâµ¡â´°âµ™_â´°âµ™âµ‰â´¹âµ¢â´°âµ™".split("_"),weekdaysShort:"â´°âµ™â´°âµŽâ´°âµ™_â´°âµ¢âµâ´°âµ™_â´°âµ™âµ‰âµâ´°âµ™_â´°â´½âµ”â´°âµ™_â´°â´½âµ¡â´°âµ™_â´°âµ™âµ‰âµŽâµ¡â´°âµ™_â´°âµ™âµ‰â´¹âµ¢â´°âµ™".split("_"),weekdaysMin:"â´°âµ™â´°âµŽâ´°âµ™_â´°âµ¢âµâ´°âµ™_â´°âµ™âµ‰âµâ´°âµ™_â´°â´½âµ”â´°âµ™_â´°â´½âµ¡â´°âµ™_â´°âµ™âµ‰âµŽâµ¡â´°âµ™_â´°âµ™âµ‰â´¹âµ¢â´°âµ™".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[â´°âµ™â´·âµ… â´´] LT",nextDay:"[â´°âµ™â´½â´° â´´] LT",nextWeek:"dddd [â´´] LT",lastDay:"[â´°âµšâ´°âµâµœ â´´] LT",lastWeek:"dddd [â´´] LT",sameElse:"L"},relativeTime:{future:"â´·â´°â´·âµ… âµ™ âµ¢â´°âµ %s",past:"âµ¢â´°âµ %s",s:"âµ‰âµŽâµ‰â´½",ss:"%d âµ‰âµŽâµ‰â´½",m:"âµŽâµ‰âµâµ“â´º",mm:"%d âµŽâµ‰âµâµ“â´º",h:"âµ™â´°âµ„â´°",hh:"%d âµœâ´°âµ™âµ™â´°âµ„âµ‰âµ",d:"â´°âµ™âµ™",dd:"%d oâµ™âµ™â´°âµ",M:"â´°âµ¢oâµ“âµ”",MM:"%d âµ‰âµ¢âµ¢âµ‰âµ”âµ",y:"â´°âµ™â´³â´°âµ™",yy:"%d âµ‰âµ™â´³â´°âµ™âµ"},week:{dow:6,doy:12}})}(n(30381))},9288:function(e,t,n){!function(e){"use strict";e.defineLocale("ug-cn",{months:"ÙŠØ§Ù†Û‹Ø§Ø±_ÙÛÛ‹Ø±Ø§Ù„_Ù…Ø§Ø±Øª_Ø¦Ø§Ù¾Ø±ÛÙ„_Ù…Ø§ÙŠ_Ø¦Ù‰ÙŠÛ‡Ù†_Ø¦Ù‰ÙŠÛ‡Ù„_Ø¦Ø§Û‹ØºÛ‡Ø³Øª_Ø³ÛÙ†ØªÛ•Ø¨Ù‰Ø±_Ø¦Û†ÙƒØªÛ•Ø¨Ù‰Ø±_Ù†ÙˆÙŠØ§Ø¨Ù‰Ø±_Ø¯ÛÙƒØ§Ø¨Ù‰Ø±".split("_"),monthsShort:"ÙŠØ§Ù†Û‹Ø§Ø±_ÙÛÛ‹Ø±Ø§Ù„_Ù…Ø§Ø±Øª_Ø¦Ø§Ù¾Ø±ÛÙ„_Ù…Ø§ÙŠ_Ø¦Ù‰ÙŠÛ‡Ù†_Ø¦Ù‰ÙŠÛ‡Ù„_Ø¦Ø§Û‹ØºÛ‡Ø³Øª_Ø³ÛÙ†ØªÛ•Ø¨Ù‰Ø±_Ø¦Û†ÙƒØªÛ•Ø¨Ù‰Ø±_Ù†ÙˆÙŠØ§Ø¨Ù‰Ø±_Ø¯ÛÙƒØ§Ø¨Ù‰Ø±".split("_"),weekdays:"ÙŠÛ•ÙƒØ´Û•Ù†Ø¨Û•_Ø¯ÛˆØ´Û•Ù†Ø¨Û•_Ø³Û•ÙŠØ´Û•Ù†Ø¨Û•_Ú†Ø§Ø±Ø´Û•Ù†Ø¨Û•_Ù¾Û•ÙŠØ´Û•Ù†Ø¨Û•_Ø¬ÛˆÙ…Û•_Ø´Û•Ù†Ø¨Û•".split("_"),weekdaysShort:"ÙŠÛ•_Ø¯Ûˆ_Ø³Û•_Ú†Ø§_Ù¾Û•_Ø¬Ûˆ_Ø´Û•".split("_"),weekdaysMin:"ÙŠÛ•_Ø¯Ûˆ_Ø³Û•_Ú†Ø§_Ù¾Û•_Ø¬Ûˆ_Ø´Û•".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"YYYY-ÙŠÙ‰Ù„Ù‰M-Ø¦Ø§ÙŠÙ†Ù‰Ú­D-ÙƒÛˆÙ†Ù‰",LLL:"YYYY-ÙŠÙ‰Ù„Ù‰M-Ø¦Ø§ÙŠÙ†Ù‰Ú­D-ÙƒÛˆÙ†Ù‰ØŒ HH:mm",LLLL:"ddddØŒ YYYY-ÙŠÙ‰Ù„Ù‰M-Ø¦Ø§ÙŠÙ†Ù‰Ú­D-ÙƒÛˆÙ†Ù‰ØŒ HH:mm"},meridiemParse:/ÙŠÛØ±Ù‰Ù… ÙƒÛÚ†Û•|Ø³Û•Ú¾Û•Ø±|Ú†ÛˆØ´ØªÙ‰Ù† Ø¨Û‡Ø±Û‡Ù†|Ú†ÛˆØ´|Ú†ÛˆØ´ØªÙ‰Ù† ÙƒÛÙŠÙ‰Ù†|ÙƒÛ•Ú†/,meridiemHour:function(e,t){return 12===e&&(e=0),"ÙŠÛØ±Ù‰Ù… ÙƒÛÚ†Û•"===t||"Ø³Û•Ú¾Û•Ø±"===t||"Ú†ÛˆØ´ØªÙ‰Ù† Ø¨Û‡Ø±Û‡Ù†"===t?e:"Ú†ÛˆØ´ØªÙ‰Ù† ÙƒÛÙŠÙ‰Ù†"===t||"ÙƒÛ•Ú†"===t?e+12:e>=11?e:e+12},meridiem:function(e,t,n){var r=100*e+t;return r<600?"ÙŠÛØ±Ù‰Ù… ÙƒÛÚ†Û•":r<900?"Ø³Û•Ú¾Û•Ø±":r<1130?"Ú†ÛˆØ´ØªÙ‰Ù† Ø¨Û‡Ø±Û‡Ù†":r<1230?"Ú†ÛˆØ´":r<1800?"Ú†ÛˆØ´ØªÙ‰Ù† ÙƒÛÙŠÙ‰Ù†":"ÙƒÛ•Ú†"},calendar:{sameDay:"[Ø¨ÛˆÚ¯ÛˆÙ† Ø³Ø§Ø¦Û•Øª] LT",nextDay:"[Ø¦Û•ØªÛ• Ø³Ø§Ø¦Û•Øª] LT",nextWeek:"[ÙƒÛÙ„Û•Ø±ÙƒÙ‰] dddd [Ø³Ø§Ø¦Û•Øª] LT",lastDay:"[ØªÛ†Ù†ÛˆÚ¯ÛˆÙ†] LT",lastWeek:"[Ø¦Ø§Ù„Ø¯Ù‰Ù†Ù‚Ù‰] dddd [Ø³Ø§Ø¦Û•Øª] LT",sameElse:"L"},relativeTime:{future:"%s ÙƒÛÙŠÙ‰Ù†",past:"%s Ø¨Û‡Ø±Û‡Ù†",s:"Ù†Û•Ú†Ú†Û• Ø³ÛÙƒÙˆÙ†Øª",ss:"%d Ø³ÛÙƒÙˆÙ†Øª",m:"Ø¨Ù‰Ø± Ù…Ù‰Ù†Û‡Øª",mm:"%d Ù…Ù‰Ù†Û‡Øª",h:"Ø¨Ù‰Ø± Ø³Ø§Ø¦Û•Øª",hh:"%d Ø³Ø§Ø¦Û•Øª",d:"Ø¨Ù‰Ø± ÙƒÛˆÙ†",dd:"%d ÙƒÛˆÙ†",M:"Ø¨Ù‰Ø± Ø¦Ø§ÙŠ",MM:"%d Ø¦Ø§ÙŠ",y:"Ø¨Ù‰Ø± ÙŠÙ‰Ù„",yy:"%d ÙŠÙ‰Ù„"},dayOfMonthOrdinalParse:/\d{1,2}(-ÙƒÛˆÙ†Ù‰|-Ø¦Ø§ÙŠ|-Ú¾Û•Ù¾ØªÛ•)/,ordinal:function(e,t){switch(t){case"d":case"D":case"DDD":return e+"-ÙƒÛˆÙ†Ù‰";case"w":case"W":return e+"-Ú¾Û•Ù¾ØªÛ•";default:return e}},preparse:function(e){return e.replace(/ØŒ/g,",")},postformat:function(e){return e.replace(/,/g,"ØŒ")},week:{dow:1,doy:7}})}(n(30381))},67691:function(e,t,n){!function(e){"use strict";function t(e,t,n){return"m"===n?t?"Ñ…Ð²Ð¸Ð»Ð¸Ð½Ð°":"Ñ…Ð²Ð¸Ð»Ð¸Ð½Ñƒ":"h"===n?t?"Ð³Ð¾Ð´Ð¸Ð½Ð°":"Ð³Ð¾Ð´Ð¸Ð½Ñƒ":e+" "+(r=+e,a={ss:t?"ÑÐµÐºÑƒÐ½Ð´Ð°_ÑÐµÐºÑƒÐ½Ð´Ð¸_ÑÐµÐºÑƒÐ½Ð´":"ÑÐµÐºÑƒÐ½Ð´Ñƒ_ÑÐµÐºÑƒÐ½Ð´Ð¸_ÑÐµÐºÑƒÐ½Ð´",mm:t?"Ñ…Ð²Ð¸Ð»Ð¸Ð½Ð°_Ñ…Ð²Ð¸Ð»Ð¸Ð½Ð¸_Ñ…Ð²Ð¸Ð»Ð¸Ð½":"Ñ…Ð²Ð¸Ð»Ð¸Ð½Ñƒ_Ñ…Ð²Ð¸Ð»Ð¸Ð½Ð¸_Ñ…Ð²Ð¸Ð»Ð¸Ð½",hh:t?"Ð³Ð¾Ð´Ð¸Ð½Ð°_Ð³Ð¾Ð´Ð¸Ð½Ð¸_Ð³Ð¾Ð´Ð¸Ð½":"Ð³Ð¾Ð´Ð¸Ð½Ñƒ_Ð³Ð¾Ð´Ð¸Ð½Ð¸_Ð³Ð¾Ð´Ð¸Ð½",dd:"Ð´ÐµÐ½ÑŒ_Ð´Ð½Ñ–_Ð´Ð½Ñ–Ð²",MM:"Ð¼Ñ–ÑÑÑ†ÑŒ_Ð¼Ñ–ÑÑÑ†Ñ–_Ð¼Ñ–ÑÑÑ†Ñ–Ð²",yy:"Ñ€Ñ–Ðº_Ñ€Ð¾ÐºÐ¸_Ñ€Ð¾ÐºÑ–Ð²"}[n].split("_"),r%10==1&&r%100!=11?a[0]:r%10>=2&&r%10<=4&&(r%100<10||r%100>=20)?a[1]:a[2]);var r,a}function n(e){return function(){return e+"Ð¾"+(11===this.hours()?"Ð±":"")+"] LT"}}e.defineLocale("uk",{months:{format:"ÑÑ–Ñ‡Ð½Ñ_Ð»ÑŽÑ‚Ð¾Ð³Ð¾_Ð±ÐµÑ€ÐµÐ·Ð½Ñ_ÐºÐ²Ñ–Ñ‚Ð½Ñ_Ñ‚Ñ€Ð°Ð²Ð½Ñ_Ñ‡ÐµÑ€Ð²Ð½Ñ_Ð»Ð¸Ð¿Ð½Ñ_ÑÐµÑ€Ð¿Ð½Ñ_Ð²ÐµÑ€ÐµÑÐ½Ñ_Ð¶Ð¾Ð²Ñ‚Ð½Ñ_Ð»Ð¸ÑÑ‚Ð¾Ð¿Ð°Ð´Ð°_Ð³Ñ€ÑƒÐ´Ð½Ñ".split("_"),standalone:"ÑÑ–Ñ‡ÐµÐ½ÑŒ_Ð»ÑŽÑ‚Ð¸Ð¹_Ð±ÐµÑ€ÐµÐ·ÐµÐ½ÑŒ_ÐºÐ²Ñ–Ñ‚ÐµÐ½ÑŒ_Ñ‚Ñ€Ð°Ð²ÐµÐ½ÑŒ_Ñ‡ÐµÑ€Ð²ÐµÐ½ÑŒ_Ð»Ð¸Ð¿ÐµÐ½ÑŒ_ÑÐµÑ€Ð¿ÐµÐ½ÑŒ_Ð²ÐµÑ€ÐµÑÐµÐ½ÑŒ_Ð¶Ð¾Ð²Ñ‚ÐµÐ½ÑŒ_Ð»Ð¸ÑÑ‚Ð¾Ð¿Ð°Ð´_Ð³Ñ€ÑƒÐ´ÐµÐ½ÑŒ".split("_")},monthsShort:"ÑÑ–Ñ‡_Ð»ÑŽÑ‚_Ð±ÐµÑ€_ÐºÐ²Ñ–Ñ‚_Ñ‚Ñ€Ð°Ð²_Ñ‡ÐµÑ€Ð²_Ð»Ð¸Ð¿_ÑÐµÑ€Ð¿_Ð²ÐµÑ€_Ð¶Ð¾Ð²Ñ‚_Ð»Ð¸ÑÑ‚_Ð³Ñ€ÑƒÐ´".split("_"),weekdays:function(e,t){var n={nominative:"Ð½ÐµÐ´Ñ–Ð»Ñ_Ð¿Ð¾Ð½ÐµÐ´Ñ–Ð»Ð¾Ðº_Ð²Ñ–Ð²Ñ‚Ð¾Ñ€Ð¾Ðº_ÑÐµÑ€ÐµÐ´Ð°_Ñ‡ÐµÑ‚Ð²ÐµÑ€_Ð¿â€™ÑÑ‚Ð½Ð¸Ñ†Ñ_ÑÑƒÐ±Ð¾Ñ‚Ð°".split("_"),accusative:"Ð½ÐµÐ´Ñ–Ð»ÑŽ_Ð¿Ð¾Ð½ÐµÐ´Ñ–Ð»Ð¾Ðº_Ð²Ñ–Ð²Ñ‚Ð¾Ñ€Ð¾Ðº_ÑÐµÑ€ÐµÐ´Ñƒ_Ñ‡ÐµÑ‚Ð²ÐµÑ€_Ð¿â€™ÑÑ‚Ð½Ð¸Ñ†ÑŽ_ÑÑƒÐ±Ð¾Ñ‚Ñƒ".split("_"),genitive:"Ð½ÐµÐ´Ñ–Ð»Ñ–_Ð¿Ð¾Ð½ÐµÐ´Ñ–Ð»ÐºÐ°_Ð²Ñ–Ð²Ñ‚Ð¾Ñ€ÐºÐ°_ÑÐµÑ€ÐµÐ´Ð¸_Ñ‡ÐµÑ‚Ð²ÐµÑ€Ð³Ð°_Ð¿â€™ÑÑ‚Ð½Ð¸Ñ†Ñ–_ÑÑƒÐ±Ð¾Ñ‚Ð¸".split("_")};return!0===e?n.nominative.slice(1,7).concat(n.nominative.slice(0,1)):e?n[/(\[[Ð’Ð²Ð£Ñƒ]\]) ?dddd/.test(t)?"accusative":/\[?(?:Ð¼Ð¸Ð½ÑƒÐ»Ð¾Ñ—|Ð½Ð°ÑÑ‚ÑƒÐ¿Ð½Ð¾Ñ—)? ?\] ?dddd/.test(t)?"genitive":"nominative"][e.day()]:n.nominative},weekdaysShort:"Ð½Ð´_Ð¿Ð½_Ð²Ñ‚_ÑÑ€_Ñ‡Ñ‚_Ð¿Ñ‚_ÑÐ±".split("_"),weekdaysMin:"Ð½Ð´_Ð¿Ð½_Ð²Ñ‚_ÑÑ€_Ñ‡Ñ‚_Ð¿Ñ‚_ÑÐ±".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY Ñ€.",LLL:"D MMMM YYYY Ñ€., HH:mm",LLLL:"dddd, D MMMM YYYY Ñ€., HH:mm"},calendar:{sameDay:n("[Ð¡ÑŒÐ¾Ð³Ð¾Ð´Ð½Ñ– "),nextDay:n("[Ð—Ð°Ð²Ñ‚Ñ€Ð° "),lastDay:n("[Ð’Ñ‡Ð¾Ñ€Ð° "),nextWeek:n("[Ð£] dddd ["),lastWeek:function(){switch(this.day()){case 0:case 3:case 5:case 6:return n("[ÐœÐ¸Ð½ÑƒÐ»Ð¾Ñ—] dddd [").call(this);case 1:case 2:case 4:return n("[ÐœÐ¸Ð½ÑƒÐ»Ð¾Ð³Ð¾] dddd [").call(this)}},sameElse:"L"},relativeTime:{future:"Ð·Ð° %s",past:"%s Ñ‚Ð¾Ð¼Ñƒ",s:"Ð´ÐµÐºÑ–Ð»ÑŒÐºÐ° ÑÐµÐºÑƒÐ½Ð´",ss:t,m:t,mm:t,h:"Ð³Ð¾Ð´Ð¸Ð½Ñƒ",hh:t,d:"Ð´ÐµÐ½ÑŒ",dd:t,M:"Ð¼Ñ–ÑÑÑ†ÑŒ",MM:t,y:"Ñ€Ñ–Ðº",yy:t},meridiemParse:/Ð½Ð¾Ñ‡Ñ–|Ñ€Ð°Ð½ÐºÑƒ|Ð´Ð½Ñ|Ð²ÐµÑ‡Ð¾Ñ€Ð°/,isPM:function(e){return/^(Ð´Ð½Ñ|Ð²ÐµÑ‡Ð¾Ñ€Ð°)$/.test(e)},meridiem:function(e,t,n){return e<4?"Ð½Ð¾Ñ‡Ñ–":e<12?"Ñ€Ð°Ð½ÐºÑƒ":e<17?"Ð´Ð½Ñ":"Ð²ÐµÑ‡Ð¾Ñ€Ð°"},dayOfMonthOrdinalParse:/\d{1,2}-(Ð¹|Ð³Ð¾)/,ordinal:function(e,t){switch(t){case"M":case"d":case"DDD":case"w":case"W":return e+"-Ð¹";case"D":return e+"-Ð³Ð¾";default:return e}},week:{dow:1,doy:7}})}(n(30381))},13795:function(e,t,n){!function(e){"use strict";var t=["Ø¬Ù†ÙˆØ±ÛŒ","ÙØ±ÙˆØ±ÛŒ","Ù…Ø§Ø±Ú†","Ø§Ù¾Ø±ÛŒÙ„","Ù…Ø¦ÛŒ","Ø¬ÙˆÙ†","Ø¬ÙˆÙ„Ø§Ø¦ÛŒ","Ø§Ú¯Ø³Øª","Ø³ØªÙ…Ø¨Ø±","Ø§Ú©ØªÙˆØ¨Ø±","Ù†ÙˆÙ…Ø¨Ø±","Ø¯Ø³Ù…Ø¨Ø±"],n=["Ø§ØªÙˆØ§Ø±","Ù¾ÛŒØ±","Ù…Ù†Ú¯Ù„","Ø¨Ø¯Ú¾","Ø¬Ù…Ø¹Ø±Ø§Øª","Ø¬Ù…Ø¹Û","ÛÙØªÛ"];e.defineLocale("ur",{months:t,monthsShort:t,weekdays:n,weekdaysShort:n,weekdaysMin:n,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"ddddØŒ D MMMM YYYY HH:mm"},meridiemParse:/ØµØ¨Ø­|Ø´Ø§Ù…/,isPM:function(e){return"Ø´Ø§Ù…"===e},meridiem:function(e,t,n){return e<12?"ØµØ¨Ø­":"Ø´Ø§Ù…"},calendar:{sameDay:"[Ø¢Ø¬ Ø¨ÙˆÙ‚Øª] LT",nextDay:"[Ú©Ù„ Ø¨ÙˆÙ‚Øª] LT",nextWeek:"dddd [Ø¨ÙˆÙ‚Øª] LT",lastDay:"[Ú¯Ø°Ø´ØªÛ Ø±ÙˆØ² Ø¨ÙˆÙ‚Øª] LT",lastWeek:"[Ú¯Ø°Ø´ØªÛ] dddd [Ø¨ÙˆÙ‚Øª] LT",sameElse:"L"},relativeTime:{future:"%s Ø¨Ø¹Ø¯",past:"%s Ù‚Ø¨Ù„",s:"Ú†Ù†Ø¯ Ø³ÛŒÚ©Ù†Úˆ",ss:"%d Ø³ÛŒÚ©Ù†Úˆ",m:"Ø§ÛŒÚ© Ù…Ù†Ù¹",mm:"%d Ù…Ù†Ù¹",h:"Ø§ÛŒÚ© Ú¯Ú¾Ù†Ù¹Û",hh:"%d Ú¯Ú¾Ù†Ù¹Û’",d:"Ø§ÛŒÚ© Ø¯Ù†",dd:"%d Ø¯Ù†",M:"Ø§ÛŒÚ© Ù…Ø§Û",MM:"%d Ù…Ø§Û",y:"Ø§ÛŒÚ© Ø³Ø§Ù„",yy:"%d Ø³Ø§Ù„"},preparse:function(e){return e.replace(/ØŒ/g,",")},postformat:function(e){return e.replace(/,/g,"ØŒ")},week:{dow:1,doy:4}})}(n(30381))},60588:function(e,t,n){!function(e){"use strict";e.defineLocale("uz-latn",{months:"Yanvar_Fevral_Mart_Aprel_May_Iyun_Iyul_Avgust_Sentabr_Oktabr_Noyabr_Dekabr".split("_"),monthsShort:"Yan_Fev_Mar_Apr_May_Iyun_Iyul_Avg_Sen_Okt_Noy_Dek".split("_"),weekdays:"Yakshanba_Dushanba_Seshanba_Chorshanba_Payshanba_Juma_Shanba".split("_"),weekdaysShort:"Yak_Dush_Sesh_Chor_Pay_Jum_Shan".split("_"),weekdaysMin:"Ya_Du_Se_Cho_Pa_Ju_Sha".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"D MMMM YYYY, dddd HH:mm"},calendar:{sameDay:"[Bugun soat] LT [da]",nextDay:"[Ertaga] LT [da]",nextWeek:"dddd [kuni soat] LT [da]",lastDay:"[Kecha soat] LT [da]",lastWeek:"[O'tgan] dddd [kuni soat] LT [da]",sameElse:"L"},relativeTime:{future:"Yaqin %s ichida",past:"Bir necha %s oldin",s:"soniya",ss:"%d soniya",m:"bir daqiqa",mm:"%d daqiqa",h:"bir soat",hh:"%d soat",d:"bir kun",dd:"%d kun",M:"bir oy",MM:"%d oy",y:"bir yil",yy:"%d yil"},week:{dow:1,doy:7}})}(n(30381))},6791:function(e,t,n){!function(e){"use strict";e.defineLocale("uz",{months:"ÑÐ½Ð²Ð°Ñ€_Ñ„ÐµÐ²Ñ€Ð°Ð»_Ð¼Ð°Ñ€Ñ‚_Ð°Ð¿Ñ€ÐµÐ»_Ð¼Ð°Ð¹_Ð¸ÑŽÐ½_Ð¸ÑŽÐ»_Ð°Ð²Ð³ÑƒÑÑ‚_ÑÐµÐ½Ñ‚ÑÐ±Ñ€_Ð¾ÐºÑ‚ÑÐ±Ñ€_Ð½Ð¾ÑÐ±Ñ€_Ð´ÐµÐºÐ°Ð±Ñ€".split("_"),monthsShort:"ÑÐ½Ð²_Ñ„ÐµÐ²_Ð¼Ð°Ñ€_Ð°Ð¿Ñ€_Ð¼Ð°Ð¹_Ð¸ÑŽÐ½_Ð¸ÑŽÐ»_Ð°Ð²Ð³_ÑÐµÐ½_Ð¾ÐºÑ‚_Ð½Ð¾Ñ_Ð´ÐµÐº".split("_"),weekdays:"Ð¯ÐºÑˆÐ°Ð½Ð±Ð°_Ð”ÑƒÑˆÐ°Ð½Ð±Ð°_Ð¡ÐµÑˆÐ°Ð½Ð±Ð°_Ð§Ð¾Ñ€ÑˆÐ°Ð½Ð±Ð°_ÐŸÐ°Ð¹ÑˆÐ°Ð½Ð±Ð°_Ð–ÑƒÐ¼Ð°_Ð¨Ð°Ð½Ð±Ð°".split("_"),weekdaysShort:"Ð¯ÐºÑˆ_Ð”ÑƒÑˆ_Ð¡ÐµÑˆ_Ð§Ð¾Ñ€_ÐŸÐ°Ð¹_Ð–ÑƒÐ¼_Ð¨Ð°Ð½".split("_"),weekdaysMin:"Ð¯Ðº_Ð”Ñƒ_Ð¡Ðµ_Ð§Ð¾_ÐŸÐ°_Ð–Ñƒ_Ð¨Ð°".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"D MMMM YYYY, dddd HH:mm"},calendar:{sameDay:"[Ð‘ÑƒÐ³ÑƒÐ½ ÑÐ¾Ð°Ñ‚] LT [Ð´Ð°]",nextDay:"[Ð­Ñ€Ñ‚Ð°Ð³Ð°] LT [Ð´Ð°]",nextWeek:"dddd [ÐºÑƒÐ½Ð¸ ÑÐ¾Ð°Ñ‚] LT [Ð´Ð°]",lastDay:"[ÐšÐµÑ‡Ð° ÑÐ¾Ð°Ñ‚] LT [Ð´Ð°]",lastWeek:"[Ð£Ñ‚Ð³Ð°Ð½] dddd [ÐºÑƒÐ½Ð¸ ÑÐ¾Ð°Ñ‚] LT [Ð´Ð°]",sameElse:"L"},relativeTime:{future:"Ð¯ÐºÐ¸Ð½ %s Ð¸Ñ‡Ð¸Ð´Ð°",past:"Ð‘Ð¸Ñ€ Ð½ÐµÑ‡Ð° %s Ð¾Ð»Ð´Ð¸Ð½",s:"Ñ„ÑƒÑ€ÑÐ°Ñ‚",ss:"%d Ñ„ÑƒÑ€ÑÐ°Ñ‚",m:"Ð±Ð¸Ñ€ Ð´Ð°ÐºÐ¸ÐºÐ°",mm:"%d Ð´Ð°ÐºÐ¸ÐºÐ°",h:"Ð±Ð¸Ñ€ ÑÐ¾Ð°Ñ‚",hh:"%d ÑÐ¾Ð°Ñ‚",d:"Ð±Ð¸Ñ€ ÐºÑƒÐ½",dd:"%d ÐºÑƒÐ½",M:"Ð±Ð¸Ñ€ Ð¾Ð¹",MM:"%d Ð¾Ð¹",y:"Ð±Ð¸Ñ€ Ð¹Ð¸Ð»",yy:"%d Ð¹Ð¸Ð»"},week:{dow:1,doy:7}})}(n(30381))},65666:function(e,t,n){!function(e){"use strict";e.defineLocale("vi",{months:"thÃ¡ng 1_thÃ¡ng 2_thÃ¡ng 3_thÃ¡ng 4_thÃ¡ng 5_thÃ¡ng 6_thÃ¡ng 7_thÃ¡ng 8_thÃ¡ng 9_thÃ¡ng 10_thÃ¡ng 11_thÃ¡ng 12".split("_"),monthsShort:"Thg 01_Thg 02_Thg 03_Thg 04_Thg 05_Thg 06_Thg 07_Thg 08_Thg 09_Thg 10_Thg 11_Thg 12".split("_"),monthsParseExact:!0,weekdays:"chá»§ nháº­t_thá»© hai_thá»© ba_thá»© tÆ°_thá»© nÄƒm_thá»© sÃ¡u_thá»© báº£y".split("_"),weekdaysShort:"CN_T2_T3_T4_T5_T6_T7".split("_"),weekdaysMin:"CN_T2_T3_T4_T5_T6_T7".split("_"),weekdaysParseExact:!0,meridiemParse:/sa|ch/i,isPM:function(e){return/^ch$/i.test(e)},meridiem:function(e,t,n){return e<12?n?"sa":"SA":n?"ch":"CH"},longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM [nÄƒm] YYYY",LLL:"D MMMM [nÄƒm] YYYY HH:mm",LLLL:"dddd, D MMMM [nÄƒm] YYYY HH:mm",l:"DD/M/YYYY",ll:"D MMM YYYY",lll:"D MMM YYYY HH:mm",llll:"ddd, D MMM YYYY HH:mm"},calendar:{sameDay:"[HÃ´m nay lÃºc] LT",nextDay:"[NgÃ y mai lÃºc] LT",nextWeek:"dddd [tuáº§n tá»›i lÃºc] LT",lastDay:"[HÃ´m qua lÃºc] LT",lastWeek:"dddd [tuáº§n trÆ°á»›c lÃºc] LT",sameElse:"L"},relativeTime:{future:"%s tá»›i",past:"%s trÆ°á»›c",s:"vÃ i giÃ¢y",ss:"%d giÃ¢y",m:"má»™t phÃºt",mm:"%d phÃºt",h:"má»™t giá»",hh:"%d giá»",d:"má»™t ngÃ y",dd:"%d ngÃ y",w:"má»™t tuáº§n",ww:"%d tuáº§n",M:"má»™t thÃ¡ng",MM:"%d thÃ¡ng",y:"má»™t nÄƒm",yy:"%d nÄƒm"},dayOfMonthOrdinalParse:/\d{1,2}/,ordinal:function(e){return e},week:{dow:1,doy:4}})}(n(30381))},14378:function(e,t,n){!function(e){"use strict";e.defineLocale("x-pseudo",{months:"J~Ã¡Ã±ÃºÃ¡~rÃ½_F~Ã©brÃº~Ã¡rÃ½_~MÃ¡rc~h_Ãp~rÃ­l_~MÃ¡Ã½_~JÃºÃ±Ã©~_JÃºl~Ã½_ÃÃº~gÃºst~_SÃ©p~tÃ©mb~Ã©r_Ã“~ctÃ³b~Ã©r_Ã‘~Ã³vÃ©m~bÃ©r_~DÃ©cÃ©~mbÃ©r".split("_"),monthsShort:"J~Ã¡Ã±_~FÃ©b_~MÃ¡r_~Ãpr_~MÃ¡Ã½_~JÃºÃ±_~JÃºl_~ÃÃºg_~SÃ©p_~Ã“ct_~Ã‘Ã³v_~DÃ©c".split("_"),monthsParseExact:!0,weekdays:"S~ÃºÃ±dÃ¡~Ã½_MÃ³~Ã±dÃ¡Ã½~_TÃºÃ©~sdÃ¡Ã½~_WÃ©d~Ã±Ã©sd~Ã¡Ã½_T~hÃºrs~dÃ¡Ã½_~FrÃ­d~Ã¡Ã½_S~Ã¡tÃºr~dÃ¡Ã½".split("_"),weekdaysShort:"S~ÃºÃ±_~MÃ³Ã±_~TÃºÃ©_~WÃ©d_~ThÃº_~FrÃ­_~SÃ¡t".split("_"),weekdaysMin:"S~Ãº_MÃ³~_TÃº_~WÃ©_T~h_Fr~_SÃ¡".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[T~Ã³dÃ¡~Ã½ Ã¡t] LT",nextDay:"[T~Ã³mÃ³~rrÃ³~w Ã¡t] LT",nextWeek:"dddd [Ã¡t] LT",lastDay:"[Ã~Ã©st~Ã©rdÃ¡~Ã½ Ã¡t] LT",lastWeek:"[L~Ã¡st] dddd [Ã¡t] LT",sameElse:"L"},relativeTime:{future:"Ã­~Ã± %s",past:"%s Ã¡~gÃ³",s:"Ã¡ ~fÃ©w ~sÃ©cÃ³~Ã±ds",ss:"%d s~Ã©cÃ³Ã±~ds",m:"Ã¡ ~mÃ­Ã±~ÃºtÃ©",mm:"%d m~Ã­Ã±Ãº~tÃ©s",h:"Ã¡~Ã± hÃ³~Ãºr",hh:"%d h~Ã³Ãºrs",d:"Ã¡ ~dÃ¡Ã½",dd:"%d d~Ã¡Ã½s",M:"Ã¡ ~mÃ³Ã±~th",MM:"%d m~Ã³Ã±t~hs",y:"Ã¡ ~Ã½Ã©Ã¡r",yy:"%d Ã½~Ã©Ã¡rs"},dayOfMonthOrdinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(e){var t=e%10;return e+(1==~~(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th")},week:{dow:1,doy:4}})}(n(30381))},75805:function(e,t,n){!function(e){"use strict";e.defineLocale("yo",{months:"Sáº¹Ìráº¹Ì_EÌ€reÌ€leÌ€_áº¸ráº¹Ì€naÌ€_IÌ€gbeÌ_EÌ€bibi_OÌ€kuÌ€du_Agáº¹mo_OÌ€guÌn_Owewe_á»ŒÌ€waÌ€raÌ€_BeÌluÌ_á»ŒÌ€páº¹Ì€Ì€".split("_"),monthsShort:"Sáº¹Ìr_EÌ€rl_áº¸rn_IÌ€gb_EÌ€bi_OÌ€kuÌ€_Agáº¹_OÌ€guÌ_Owe_á»ŒÌ€waÌ€_BeÌl_á»ŒÌ€páº¹Ì€Ì€".split("_"),weekdays:"AÌ€iÌ€kuÌ_AjeÌ_IÌ€sáº¹Ìgun_á»Œjá»ÌruÌ_á»Œjá»Ìbá»_áº¸tiÌ€_AÌ€baÌmáº¹Ìta".split("_"),weekdaysShort:"AÌ€iÌ€k_AjeÌ_IÌ€sáº¹Ì_á»Œjr_á»Œjb_áº¸tiÌ€_AÌ€baÌ".split("_"),weekdaysMin:"AÌ€iÌ€_Aj_IÌ€s_á»Œr_á»Œb_áº¸t_AÌ€b".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendar:{sameDay:"[OÌ€niÌ€ ni] LT",nextDay:"[á»ŒÌ€la ni] LT",nextWeek:"dddd [á»Œsáº¹Ì€ toÌn'bá»] [ni] LT",lastDay:"[AÌ€na ni] LT",lastWeek:"dddd [á»Œsáº¹Ì€ toÌlá»Ì] [ni] LT",sameElse:"L"},relativeTime:{future:"niÌ %s",past:"%s ká»jaÌ",s:"iÌ€sáº¹juÌ aayaÌ die",ss:"aayaÌ %d",m:"iÌ€sáº¹juÌ kan",mm:"iÌ€sáº¹juÌ %d",h:"waÌkati kan",hh:"waÌkati %d",d:"á»já»Ì kan",dd:"á»já»Ì %d",M:"osuÌ€ kan",MM:"osuÌ€ %d",y:"á»duÌn kan",yy:"á»duÌn %d"},dayOfMonthOrdinalParse:/á»já»Ì\s\d{1,2}/,ordinal:"á»já»Ì %d",week:{dow:1,doy:4}})}(n(30381))},83839:function(e,t,n){!function(e){"use strict";e.defineLocale("zh-cn",{months:"ä¸€æœˆ_äºŒæœˆ_ä¸‰æœˆ_å››æœˆ_äº”æœˆ_å…­æœˆ_ä¸ƒæœˆ_å…«æœˆ_ä¹æœˆ_åæœˆ_åä¸€æœˆ_åäºŒæœˆ".split("_"),monthsShort:"1æœˆ_2æœˆ_3æœˆ_4æœˆ_5æœˆ_6æœˆ_7æœˆ_8æœˆ_9æœˆ_10æœˆ_11æœˆ_12æœˆ".split("_"),weekdays:"æ˜ŸæœŸæ—¥_æ˜ŸæœŸä¸€_æ˜ŸæœŸäºŒ_æ˜ŸæœŸä¸‰_æ˜ŸæœŸå››_æ˜ŸæœŸäº”_æ˜ŸæœŸå…­".split("_"),weekdaysShort:"å‘¨æ—¥_å‘¨ä¸€_å‘¨äºŒ_å‘¨ä¸‰_å‘¨å››_å‘¨äº”_å‘¨å…­".split("_"),weekdaysMin:"æ—¥_ä¸€_äºŒ_ä¸‰_å››_äº”_å…­".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY/MM/DD",LL:"YYYYå¹´MæœˆDæ—¥",LLL:"YYYYå¹´MæœˆDæ—¥Ahç‚¹mmåˆ†",LLLL:"YYYYå¹´MæœˆDæ—¥ddddAhç‚¹mmåˆ†",l:"YYYY/M/D",ll:"YYYYå¹´MæœˆDæ—¥",lll:"YYYYå¹´MæœˆDæ—¥ HH:mm",llll:"YYYYå¹´MæœˆDæ—¥dddd HH:mm"},meridiemParse:/å‡Œæ™¨|æ—©ä¸Š|ä¸Šåˆ|ä¸­åˆ|ä¸‹åˆ|æ™šä¸Š/,meridiemHour:function(e,t){return 12===e&&(e=0),"å‡Œæ™¨"===t||"æ—©ä¸Š"===t||"ä¸Šåˆ"===t?e:"ä¸‹åˆ"===t||"æ™šä¸Š"===t?e+12:e>=11?e:e+12},meridiem:function(e,t,n){var r=100*e+t;return r<600?"å‡Œæ™¨":r<900?"æ—©ä¸Š":r<1130?"ä¸Šåˆ":r<1230?"ä¸­åˆ":r<1800?"ä¸‹åˆ":"æ™šä¸Š"},calendar:{sameDay:"[ä»Šå¤©]LT",nextDay:"[æ˜Žå¤©]LT",nextWeek:function(e){return e.week()!==this.week()?"[ä¸‹]dddLT":"[æœ¬]dddLT"},lastDay:"[æ˜¨å¤©]LT",lastWeek:function(e){return this.week()!==e.week()?"[ä¸Š]dddLT":"[æœ¬]dddLT"},sameElse:"L"},dayOfMonthOrdinalParse:/\d{1,2}(æ—¥|æœˆ|å‘¨)/,ordinal:function(e,t){switch(t){case"d":case"D":case"DDD":return e+"æ—¥";case"M":return e+"æœˆ";case"w":case"W":return e+"å‘¨";default:return e}},relativeTime:{future:"%såŽ",past:"%så‰",s:"å‡ ç§’",ss:"%d ç§’",m:"1 åˆ†é’Ÿ",mm:"%d åˆ†é’Ÿ",h:"1 å°æ—¶",hh:"%d å°æ—¶",d:"1 å¤©",dd:"%d å¤©",w:"1 å‘¨",ww:"%d å‘¨",M:"1 ä¸ªæœˆ",MM:"%d ä¸ªæœˆ",y:"1 å¹´",yy:"%d å¹´"},week:{dow:1,doy:4}})}(n(30381))},55726:function(e,t,n){!function(e){"use strict";e.defineLocale("zh-hk",{months:"ä¸€æœˆ_äºŒæœˆ_ä¸‰æœˆ_å››æœˆ_äº”æœˆ_å…­æœˆ_ä¸ƒæœˆ_å…«æœˆ_ä¹æœˆ_åæœˆ_åä¸€æœˆ_åäºŒæœˆ".split("_"),monthsShort:"1æœˆ_2æœˆ_3æœˆ_4æœˆ_5æœˆ_6æœˆ_7æœˆ_8æœˆ_9æœˆ_10æœˆ_11æœˆ_12æœˆ".split("_"),weekdays:"æ˜ŸæœŸæ—¥_æ˜ŸæœŸä¸€_æ˜ŸæœŸäºŒ_æ˜ŸæœŸä¸‰_æ˜ŸæœŸå››_æ˜ŸæœŸäº”_æ˜ŸæœŸå…­".split("_"),weekdaysShort:"é€±æ—¥_é€±ä¸€_é€±äºŒ_é€±ä¸‰_é€±å››_é€±äº”_é€±å…­".split("_"),weekdaysMin:"æ—¥_ä¸€_äºŒ_ä¸‰_å››_äº”_å…­".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY/MM/DD",LL:"YYYYå¹´MæœˆDæ—¥",LLL:"YYYYå¹´MæœˆDæ—¥ HH:mm",LLLL:"YYYYå¹´MæœˆDæ—¥dddd HH:mm",l:"YYYY/M/D",ll:"YYYYå¹´MæœˆDæ—¥",lll:"YYYYå¹´MæœˆDæ—¥ HH:mm",llll:"YYYYå¹´MæœˆDæ—¥dddd HH:mm"},meridiemParse:/å‡Œæ™¨|æ—©ä¸Š|ä¸Šåˆ|ä¸­åˆ|ä¸‹åˆ|æ™šä¸Š/,meridiemHour:function(e,t){return 12===e&&(e=0),"å‡Œæ™¨"===t||"æ—©ä¸Š"===t||"ä¸Šåˆ"===t?e:"ä¸­åˆ"===t?e>=11?e:e+12:"ä¸‹åˆ"===t||"æ™šä¸Š"===t?e+12:void 0},meridiem:function(e,t,n){var r=100*e+t;return r<600?"å‡Œæ™¨":r<900?"æ—©ä¸Š":r<1200?"ä¸Šåˆ":1200===r?"ä¸­åˆ":r<1800?"ä¸‹åˆ":"æ™šä¸Š"},calendar:{sameDay:"[ä»Šå¤©]LT",nextDay:"[æ˜Žå¤©]LT",nextWeek:"[ä¸‹]ddddLT",lastDay:"[æ˜¨å¤©]LT",lastWeek:"[ä¸Š]ddddLT",sameElse:"L"},dayOfMonthOrdinalParse:/\d{1,2}(æ—¥|æœˆ|é€±)/,ordinal:function(e,t){switch(t){case"d":case"D":case"DDD":return e+"æ—¥";case"M":return e+"æœˆ";case"w":case"W":return e+"é€±";default:return e}},relativeTime:{future:"%så¾Œ",past:"%så‰",s:"å¹¾ç§’",ss:"%d ç§’",m:"1 åˆ†é˜",mm:"%d åˆ†é˜",h:"1 å°æ™‚",hh:"%d å°æ™‚",d:"1 å¤©",dd:"%d å¤©",M:"1 å€‹æœˆ",MM:"%d å€‹æœˆ",y:"1 å¹´",yy:"%d å¹´"}})}(n(30381))},99807:function(e,t,n){!function(e){"use strict";e.defineLocale("zh-mo",{months:"ä¸€æœˆ_äºŒæœˆ_ä¸‰æœˆ_å››æœˆ_äº”æœˆ_å…­æœˆ_ä¸ƒæœˆ_å…«æœˆ_ä¹æœˆ_åæœˆ_åä¸€æœˆ_åäºŒæœˆ".split("_"),monthsShort:"1æœˆ_2æœˆ_3æœˆ_4æœˆ_5æœˆ_6æœˆ_7æœˆ_8æœˆ_9æœˆ_10æœˆ_11æœˆ_12æœˆ".split("_"),weekdays:"æ˜ŸæœŸæ—¥_æ˜ŸæœŸä¸€_æ˜ŸæœŸäºŒ_æ˜ŸæœŸä¸‰_æ˜ŸæœŸå››_æ˜ŸæœŸäº”_æ˜ŸæœŸå…­".split("_"),weekdaysShort:"é€±æ—¥_é€±ä¸€_é€±äºŒ_é€±ä¸‰_é€±å››_é€±äº”_é€±å…­".split("_"),weekdaysMin:"æ—¥_ä¸€_äºŒ_ä¸‰_å››_äº”_å…­".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"YYYYå¹´MæœˆDæ—¥",LLL:"YYYYå¹´MæœˆDæ—¥ HH:mm",LLLL:"YYYYå¹´MæœˆDæ—¥dddd HH:mm",l:"D/M/YYYY",ll:"YYYYå¹´MæœˆDæ—¥",lll:"YYYYå¹´MæœˆDæ—¥ HH:mm",llll:"YYYYå¹´MæœˆDæ—¥dddd HH:mm"},meridiemParse:/å‡Œæ™¨|æ—©ä¸Š|ä¸Šåˆ|ä¸­åˆ|ä¸‹åˆ|æ™šä¸Š/,meridiemHour:function(e,t){return 12===e&&(e=0),"å‡Œæ™¨"===t||"æ—©ä¸Š"===t||"ä¸Šåˆ"===t?e:"ä¸­åˆ"===t?e>=11?e:e+12:"ä¸‹åˆ"===t||"æ™šä¸Š"===t?e+12:void 0},meridiem:function(e,t,n){var r=100*e+t;return r<600?"å‡Œæ™¨":r<900?"æ—©ä¸Š":r<1130?"ä¸Šåˆ":r<1230?"ä¸­åˆ":r<1800?"ä¸‹åˆ":"æ™šä¸Š"},calendar:{sameDay:"[ä»Šå¤©] LT",nextDay:"[æ˜Žå¤©] LT",nextWeek:"[ä¸‹]dddd LT",lastDay:"[æ˜¨å¤©] LT",lastWeek:"[ä¸Š]dddd LT",sameElse:"L"},dayOfMonthOrdinalParse:/\d{1,2}(æ—¥|æœˆ|é€±)/,ordinal:function(e,t){switch(t){case"d":case"D":case"DDD":return e+"æ—¥";case"M":return e+"æœˆ";case"w":case"W":return e+"é€±";default:return e}},relativeTime:{future:"%så…§",past:"%så‰",s:"å¹¾ç§’",ss:"%d ç§’",m:"1 åˆ†é˜",mm:"%d åˆ†é˜",h:"1 å°æ™‚",hh:"%d å°æ™‚",d:"1 å¤©",dd:"%d å¤©",M:"1 å€‹æœˆ",MM:"%d å€‹æœˆ",y:"1 å¹´",yy:"%d å¹´"}})}(n(30381))},74152:function(e,t,n){!function(e){"use strict";e.defineLocale("zh-tw",{months:"ä¸€æœˆ_äºŒæœˆ_ä¸‰æœˆ_å››æœˆ_äº”æœˆ_å…­æœˆ_ä¸ƒæœˆ_å…«æœˆ_ä¹æœˆ_åæœˆ_åä¸€æœˆ_åäºŒæœˆ".split("_"),monthsShort:"1æœˆ_2æœˆ_3æœˆ_4æœˆ_5æœˆ_6æœˆ_7æœˆ_8æœˆ_9æœˆ_10æœˆ_11æœˆ_12æœˆ".split("_"),weekdays:"æ˜ŸæœŸæ—¥_æ˜ŸæœŸä¸€_æ˜ŸæœŸäºŒ_æ˜ŸæœŸä¸‰_æ˜ŸæœŸå››_æ˜ŸæœŸäº”_æ˜ŸæœŸå…­".split("_"),weekdaysShort:"é€±æ—¥_é€±ä¸€_é€±äºŒ_é€±ä¸‰_é€±å››_é€±äº”_é€±å…­".split("_"),weekdaysMin:"æ—¥_ä¸€_äºŒ_ä¸‰_å››_äº”_å…­".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY/MM/DD",LL:"YYYYå¹´MæœˆDæ—¥",LLL:"YYYYå¹´MæœˆDæ—¥ HH:mm",LLLL:"YYYYå¹´MæœˆDæ—¥dddd HH:mm",l:"YYYY/M/D",ll:"YYYYå¹´MæœˆDæ—¥",lll:"YYYYå¹´MæœˆDæ—¥ HH:mm",llll:"YYYYå¹´MæœˆDæ—¥dddd HH:mm"},meridiemParse:/å‡Œæ™¨|æ—©ä¸Š|ä¸Šåˆ|ä¸­åˆ|ä¸‹åˆ|æ™šä¸Š/,meridiemHour:function(e,t){return 12===e&&(e=0),"å‡Œæ™¨"===t||"æ—©ä¸Š"===t||"ä¸Šåˆ"===t?e:"ä¸­åˆ"===t?e>=11?e:e+12:"ä¸‹åˆ"===t||"æ™šä¸Š"===t?e+12:void 0},meridiem:function(e,t,n){var r=100*e+t;return r<600?"å‡Œæ™¨":r<900?"æ—©ä¸Š":r<1130?"ä¸Šåˆ":r<1230?"ä¸­åˆ":r<1800?"ä¸‹åˆ":"æ™šä¸Š"},calendar:{sameDay:"[ä»Šå¤©] LT",nextDay:"[æ˜Žå¤©] LT",nextWeek:"[ä¸‹]dddd LT",lastDay:"[æ˜¨å¤©] LT",lastWeek:"[ä¸Š]dddd LT",sameElse:"L"},dayOfMonthOrdinalParse:/\d{1,2}(æ—¥|æœˆ|é€±)/,ordinal:function(e,t){switch(t){case"d":case"D":case"DDD":return e+"æ—¥";case"M":return e+"æœˆ";case"w":case"W":return e+"é€±";default:return e}},relativeTime:{future:"%så¾Œ",past:"%så‰",s:"å¹¾ç§’",ss:"%d ç§’",m:"1 åˆ†é˜",mm:"%d åˆ†é˜",h:"1 å°æ™‚",hh:"%d å°æ™‚",d:"1 å¤©",dd:"%d å¤©",M:"1 å€‹æœˆ",MM:"%d å€‹æœˆ",y:"1 å¹´",yy:"%d å¹´"}})}(n(30381))},46700:(e,t,n)=>{var r={"./af":42786,"./af.js":42786,"./ar":30867,"./ar-dz":14130,"./ar-dz.js":14130,"./ar-kw":96135,"./ar-kw.js":96135,"./ar-ly":56440,"./ar-ly.js":56440,"./ar-ma":47702,"./ar-ma.js":47702,"./ar-sa":16040,"./ar-sa.js":16040,"./ar-tn":37100,"./ar-tn.js":37100,"./ar.js":30867,"./az":31083,"./az.js":31083,"./be":9808,"./be.js":9808,"./bg":68338,"./bg.js":68338,"./bm":67438,"./bm.js":67438,"./bn":8905,"./bn-bd":76225,"./bn-bd.js":76225,"./bn.js":8905,"./bo":11560,"./bo.js":11560,"./br":1278,"./br.js":1278,"./bs":80622,"./bs.js":80622,"./ca":2468,"./ca.js":2468,"./cs":5822,"./cs.js":5822,"./cv":50877,"./cv.js":50877,"./cy":47373,"./cy.js":47373,"./da":24780,"./da.js":24780,"./de":59740,"./de-at":60217,"./de-at.js":60217,"./de-ch":60894,"./de-ch.js":60894,"./de.js":59740,"./dv":5300,"./dv.js":5300,"./el":50837,"./el.js":50837,"./en-au":78348,"./en-au.js":78348,"./en-ca":77925,"./en-ca.js":77925,"./en-gb":22243,"./en-gb.js":22243,"./en-ie":46436,"./en-ie.js":46436,"./en-il":47207,"./en-il.js":47207,"./en-in":44175,"./en-in.js":44175,"./en-nz":76319,"./en-nz.js":76319,"./en-sg":31662,"./en-sg.js":31662,"./eo":92915,"./eo.js":92915,"./es":55655,"./es-do":55251,"./es-do.js":55251,"./es-mx":96112,"./es-mx.js":96112,"./es-us":71146,"./es-us.js":71146,"./es.js":55655,"./et":5603,"./et.js":5603,"./eu":77763,"./eu.js":77763,"./fa":76959,"./fa.js":76959,"./fi":11897,"./fi.js":11897,"./fil":42549,"./fil.js":42549,"./fo":94694,"./fo.js":94694,"./fr":94470,"./fr-ca":63049,"./fr-ca.js":63049,"./fr-ch":52330,"./fr-ch.js":52330,"./fr.js":94470,"./fy":5044,"./fy.js":5044,"./ga":29295,"./ga.js":29295,"./gd":2101,"./gd.js":2101,"./gl":38794,"./gl.js":38794,"./gom-deva":27884,"./gom-deva.js":27884,"./gom-latn":23168,"./gom-latn.js":23168,"./gu":95349,"./gu.js":95349,"./he":24206,"./he.js":24206,"./hi":30094,"./hi.js":30094,"./hr":30316,"./hr.js":30316,"./hu":22138,"./hu.js":22138,"./hy-am":11423,"./hy-am.js":11423,"./id":29218,"./id.js":29218,"./is":90135,"./is.js":90135,"./it":90626,"./it-ch":10150,"./it-ch.js":10150,"./it.js":90626,"./ja":39183,"./ja.js":39183,"./jv":24286,"./jv.js":24286,"./ka":12105,"./ka.js":12105,"./kk":47772,"./kk.js":47772,"./km":18758,"./km.js":18758,"./kn":79282,"./kn.js":79282,"./ko":33730,"./ko.js":33730,"./ku":1408,"./ku.js":1408,"./ky":33291,"./ky.js":33291,"./lb":36841,"./lb.js":36841,"./lo":55466,"./lo.js":55466,"./lt":57010,"./lt.js":57010,"./lv":37595,"./lv.js":37595,"./me":39861,"./me.js":39861,"./mi":35493,"./mi.js":35493,"./mk":95966,"./mk.js":95966,"./ml":87341,"./ml.js":87341,"./mn":5115,"./mn.js":5115,"./mr":10370,"./mr.js":10370,"./ms":9847,"./ms-my":41237,"./ms-my.js":41237,"./ms.js":9847,"./mt":72126,"./mt.js":72126,"./my":56165,"./my.js":56165,"./nb":64924,"./nb.js":64924,"./ne":16744,"./ne.js":16744,"./nl":93901,"./nl-be":59814,"./nl-be.js":59814,"./nl.js":93901,"./nn":83877,"./nn.js":83877,"./oc-lnc":92135,"./oc-lnc.js":92135,"./pa-in":15858,"./pa-in.js":15858,"./pl":64495,"./pl.js":64495,"./pt":89520,"./pt-br":57971,"./pt-br.js":57971,"./pt.js":89520,"./ro":96459,"./ro.js":96459,"./ru":21793,"./ru.js":21793,"./sd":40950,"./sd.js":40950,"./se":10490,"./se.js":10490,"./si":90124,"./si.js":90124,"./sk":64249,"./sk.js":64249,"./sl":14985,"./sl.js":14985,"./sq":51104,"./sq.js":51104,"./sr":49131,"./sr-cyrl":79915,"./sr-cyrl.js":79915,"./sr.js":49131,"./ss":85893,"./ss.js":85893,"./sv":98760,"./sv.js":98760,"./sw":91172,"./sw.js":91172,"./ta":27333,"./ta.js":27333,"./te":23110,"./te.js":23110,"./tet":52095,"./tet.js":52095,"./tg":27321,"./tg.js":27321,"./th":9041,"./th.js":9041,"./tk":19005,"./tk.js":19005,"./tl-ph":75768,"./tl-ph.js":75768,"./tlh":89444,"./tlh.js":89444,"./tr":72397,"./tr.js":72397,"./tzl":28254,"./tzl.js":28254,"./tzm":51106,"./tzm-latn":30699,"./tzm-latn.js":30699,"./tzm.js":51106,"./ug-cn":9288,"./ug-cn.js":9288,"./uk":67691,"./uk.js":67691,"./ur":13795,"./ur.js":13795,"./uz":6791,"./uz-latn":60588,"./uz-latn.js":60588,"./uz.js":6791,"./vi":65666,"./vi.js":65666,"./x-pseudo":14378,"./x-pseudo.js":14378,"./yo":75805,"./yo.js":75805,"./zh-cn":83839,"./zh-cn.js":83839,"./zh-hk":55726,"./zh-hk.js":55726,"./zh-mo":99807,"./zh-mo.js":99807,"./zh-tw":74152,"./zh-tw.js":74152};function a(e){var t=s(e);return n(t)}function s(e){if(!n.o(r,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return r[e]}a.keys=function(){return Object.keys(r)},a.resolve=s,e.exports=a,a.id=46700},30381:function(e,t,n){(e=n.nmd(e)).exports=function(){"use strict";var t,r;function a(){return t.apply(null,arguments)}function s(e){return e instanceof Array||"[object Array]"===Object.prototype.toString.call(e)}function i(e){return null!=e&&"[object Object]"===Object.prototype.toString.call(e)}function o(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function d(e){if(Object.getOwnPropertyNames)return 0===Object.getOwnPropertyNames(e).length;var t;for(t in e)if(o(e,t))return!1;return!0}function u(e){return void 0===e}function _(e){return"number"==typeof e||"[object Number]"===Object.prototype.toString.call(e)}function l(e){return e instanceof Date||"[object Date]"===Object.prototype.toString.call(e)}function c(e,t){var n,r=[],a=e.length;for(n=0;n<a;++n)r.push(t(e[n],n));return r}function m(e,t){for(var n in t)o(t,n)&&(e[n]=t[n]);return o(t,"toString")&&(e.toString=t.toString),o(t,"valueOf")&&(e.valueOf=t.valueOf),e}function h(e,t,n,r){return Pt(e,t,n,r,!0).utc()}function f(e){return null==e._pf&&(e._pf={empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidEra:null,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1,parsedDateParts:[],era:null,meridiem:null,rfc2822:!1,weekdayMismatch:!1}),e._pf}function y(e){if(null==e._isValid){var t=f(e),n=r.call(t.parsedDateParts,(function(e){return null!=e})),a=!isNaN(e._d.getTime())&&t.overflow<0&&!t.empty&&!t.invalidEra&&!t.invalidMonth&&!t.invalidWeekday&&!t.weekdayMismatch&&!t.nullInput&&!t.invalidFormat&&!t.userInvalidated&&(!t.meridiem||t.meridiem&&n);if(e._strict&&(a=a&&0===t.charsLeftOver&&0===t.unusedTokens.length&&void 0===t.bigHour),null!=Object.isFrozen&&Object.isFrozen(e))return a;e._isValid=a}return e._isValid}function p(e){var t=h(NaN);return null!=e?m(f(t),e):f(t).userInvalidated=!0,t}r=Array.prototype.some?Array.prototype.some:function(e){var t,n=Object(this),r=n.length>>>0;for(t=0;t<r;t++)if(t in n&&e.call(this,n[t],t,n))return!0;return!1};var M=a.momentProperties=[],L=!1;function Y(e,t){var n,r,a,s=M.length;if(u(t._isAMomentObject)||(e._isAMomentObject=t._isAMomentObject),u(t._i)||(e._i=t._i),u(t._f)||(e._f=t._f),u(t._l)||(e._l=t._l),u(t._strict)||(e._strict=t._strict),u(t._tzm)||(e._tzm=t._tzm),u(t._isUTC)||(e._isUTC=t._isUTC),u(t._offset)||(e._offset=t._offset),u(t._pf)||(e._pf=f(t)),u(t._locale)||(e._locale=t._locale),s>0)for(n=0;n<s;n++)u(a=t[r=M[n]])||(e[r]=a);return e}function g(e){Y(this,e),this._d=new Date(null!=e._d?e._d.getTime():NaN),this.isValid()||(this._d=new Date(NaN)),!1===L&&(L=!0,a.updateOffset(this),L=!1)}function v(e){return e instanceof g||null!=e&&null!=e._isAMomentObject}function k(e){!1===a.suppressDeprecationWarnings&&"undefined"!=typeof console&&console.warn&&console.warn("Deprecation warning: "+e)}function w(e,t){var n=!0;return m((function(){if(null!=a.deprecationHandler&&a.deprecationHandler(null,e),n){var r,s,i,d=[],u=arguments.length;for(s=0;s<u;s++){if(r="","object"==typeof arguments[s]){for(i in r+="\n["+s+"] ",arguments[0])o(arguments[0],i)&&(r+=i+": "+arguments[0][i]+", ");r=r.slice(0,-2)}else r=arguments[s];d.push(r)}k(e+"\nArguments: "+Array.prototype.slice.call(d).join("")+"\n"+(new Error).stack),n=!1}return t.apply(this,arguments)}),t)}var b,D={};function T(e,t){null!=a.deprecationHandler&&a.deprecationHandler(e,t),D[e]||(k(t),D[e]=!0)}function S(e){return"undefined"!=typeof Function&&e instanceof Function||"[object Function]"===Object.prototype.toString.call(e)}function j(e,t){var n,r=m({},e);for(n in t)o(t,n)&&(i(e[n])&&i(t[n])?(r[n]={},m(r[n],e[n]),m(r[n],t[n])):null!=t[n]?r[n]=t[n]:delete r[n]);for(n in e)o(e,n)&&!o(t,n)&&i(e[n])&&(r[n]=m({},r[n]));return r}function x(e){null!=e&&this.set(e)}a.suppressDeprecationWarnings=!1,a.deprecationHandler=null,b=Object.keys?Object.keys:function(e){var t,n=[];for(t in e)o(e,t)&&n.push(t);return n};function H(e,t,n){var r=""+Math.abs(e),a=t-r.length;return(e>=0?n?"+":"":"-")+Math.pow(10,Math.max(0,a)).toString().substr(1)+r}var O=/(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,E=/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,P={},A={};function F(e,t,n,r){var a=r;"string"==typeof r&&(a=function(){return this[r]()}),e&&(A[e]=a),t&&(A[t[0]]=function(){return H(a.apply(this,arguments),t[1],t[2])}),n&&(A[n]=function(){return this.localeData().ordinal(a.apply(this,arguments),e)})}function W(e,t){return e.isValid()?(t=N(t,e.localeData()),P[t]=P[t]||function(e){var t,n,r,a=e.match(O);for(t=0,n=a.length;t<n;t++)A[a[t]]?a[t]=A[a[t]]:a[t]=(r=a[t]).match(/\[[\s\S]/)?r.replace(/^\[|\]$/g,""):r.replace(/\\/g,"");return function(t){var r,s="";for(r=0;r<n;r++)s+=S(a[r])?a[r].call(t,e):a[r];return s}}(t),P[t](e)):e.localeData().invalidDate()}function N(e,t){var n=5;function r(e){return t.longDateFormat(e)||e}for(E.lastIndex=0;n>=0&&E.test(e);)e=e.replace(E,r),E.lastIndex=0,n-=1;return e}var C={};function R(e,t){var n=e.toLowerCase();C[n]=C[n+"s"]=C[t]=e}function I(e){return"string"==typeof e?C[e]||C[e.toLowerCase()]:void 0}function z(e){var t,n,r={};for(n in e)o(e,n)&&(t=I(n))&&(r[t]=e[n]);return r}var J={};function U(e,t){J[e]=t}function G(e){return e%4==0&&e%100!=0||e%400==0}function q(e){return e<0?Math.ceil(e)||0:Math.floor(e)}function V(e){var t=+e,n=0;return 0!==t&&isFinite(t)&&(n=q(t)),n}function B(e,t){return function(n){return null!=n?(K(this,e,n),a.updateOffset(this,t),this):$(this,e)}}function $(e,t){return e.isValid()?e._d["get"+(e._isUTC?"UTC":"")+t]():NaN}function K(e,t,n){e.isValid()&&!isNaN(n)&&("FullYear"===t&&G(e.year())&&1===e.month()&&29===e.date()?(n=V(n),e._d["set"+(e._isUTC?"UTC":"")+t](n,e.month(),He(n,e.month()))):e._d["set"+(e._isUTC?"UTC":"")+t](n))}var Z,Q=/\d/,X=/\d\d/,ee=/\d{3}/,te=/\d{4}/,ne=/[+-]?\d{6}/,re=/\d\d?/,ae=/\d\d\d\d?/,se=/\d\d\d\d\d\d?/,ie=/\d{1,3}/,oe=/\d{1,4}/,de=/[+-]?\d{1,6}/,ue=/\d+/,_e=/[+-]?\d+/,le=/Z|[+-]\d\d:?\d\d/gi,ce=/Z|[+-]\d\d(?::?\d\d)?/gi,me=/[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i;function he(e,t,n){Z[e]=S(t)?t:function(e,r){return e&&n?n:t}}function fe(e,t){return o(Z,e)?Z[e](t._strict,t._locale):new RegExp(ye(e.replace("\\","").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,(function(e,t,n,r,a){return t||n||r||a}))))}function ye(e){return e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}Z={};var pe={};function Me(e,t){var n,r,a=t;for("string"==typeof e&&(e=[e]),_(t)&&(a=function(e,n){n[t]=V(e)}),r=e.length,n=0;n<r;n++)pe[e[n]]=a}function Le(e,t){Me(e,(function(e,n,r,a){r._w=r._w||{},t(e,r._w,r,a)}))}function Ye(e,t,n){null!=t&&o(pe,e)&&pe[e](t,n._a,n,e)}var ge,ve=0,ke=1,we=2,be=3,De=4,Te=5,Se=6,je=7,xe=8;function He(e,t){if(isNaN(e)||isNaN(t))return NaN;var n,r=(t%(n=12)+n)%n;return e+=(t-r)/12,1===r?G(e)?29:28:31-r%7%2}ge=Array.prototype.indexOf?Array.prototype.indexOf:function(e){var t;for(t=0;t<this.length;++t)if(this[t]===e)return t;return-1},F("M",["MM",2],"Mo",(function(){return this.month()+1})),F("MMM",0,0,(function(e){return this.localeData().monthsShort(this,e)})),F("MMMM",0,0,(function(e){return this.localeData().months(this,e)})),R("month","M"),U("month",8),he("M",re),he("MM",re,X),he("MMM",(function(e,t){return t.monthsShortRegex(e)})),he("MMMM",(function(e,t){return t.monthsRegex(e)})),Me(["M","MM"],(function(e,t){t[ke]=V(e)-1})),Me(["MMM","MMMM"],(function(e,t,n,r){var a=n._locale.monthsParse(e,r,n._strict);null!=a?t[ke]=a:f(n).invalidMonth=e}));var Oe="January_February_March_April_May_June_July_August_September_October_November_December".split("_"),Ee="Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),Pe=/D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,Ae=me,Fe=me;function We(e,t,n){var r,a,s,i=e.toLocaleLowerCase();if(!this._monthsParse)for(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[],r=0;r<12;++r)s=h([2e3,r]),this._shortMonthsParse[r]=this.monthsShort(s,"").toLocaleLowerCase(),this._longMonthsParse[r]=this.months(s,"").toLocaleLowerCase();return n?"MMM"===t?-1!==(a=ge.call(this._shortMonthsParse,i))?a:null:-1!==(a=ge.call(this._longMonthsParse,i))?a:null:"MMM"===t?-1!==(a=ge.call(this._shortMonthsParse,i))||-1!==(a=ge.call(this._longMonthsParse,i))?a:null:-1!==(a=ge.call(this._longMonthsParse,i))||-1!==(a=ge.call(this._shortMonthsParse,i))?a:null}function Ne(e,t){var n;if(!e.isValid())return e;if("string"==typeof t)if(/^\d+$/.test(t))t=V(t);else if(!_(t=e.localeData().monthsParse(t)))return e;return n=Math.min(e.date(),He(e.year(),t)),e._d["set"+(e._isUTC?"UTC":"")+"Month"](t,n),e}function Ce(e){return null!=e?(Ne(this,e),a.updateOffset(this,!0),this):$(this,"Month")}function Re(){function e(e,t){return t.length-e.length}var t,n,r=[],a=[],s=[];for(t=0;t<12;t++)n=h([2e3,t]),r.push(this.monthsShort(n,"")),a.push(this.months(n,"")),s.push(this.months(n,"")),s.push(this.monthsShort(n,""));for(r.sort(e),a.sort(e),s.sort(e),t=0;t<12;t++)r[t]=ye(r[t]),a[t]=ye(a[t]);for(t=0;t<24;t++)s[t]=ye(s[t]);this._monthsRegex=new RegExp("^("+s.join("|")+")","i"),this._monthsShortRegex=this._monthsRegex,this._monthsStrictRegex=new RegExp("^("+a.join("|")+")","i"),this._monthsShortStrictRegex=new RegExp("^("+r.join("|")+")","i")}function Ie(e){return G(e)?366:365}F("Y",0,0,(function(){var e=this.year();return e<=9999?H(e,4):"+"+e})),F(0,["YY",2],0,(function(){return this.year()%100})),F(0,["YYYY",4],0,"year"),F(0,["YYYYY",5],0,"year"),F(0,["YYYYYY",6,!0],0,"year"),R("year","y"),U("year",1),he("Y",_e),he("YY",re,X),he("YYYY",oe,te),he("YYYYY",de,ne),he("YYYYYY",de,ne),Me(["YYYYY","YYYYYY"],ve),Me("YYYY",(function(e,t){t[ve]=2===e.length?a.parseTwoDigitYear(e):V(e)})),Me("YY",(function(e,t){t[ve]=a.parseTwoDigitYear(e)})),Me("Y",(function(e,t){t[ve]=parseInt(e,10)})),a.parseTwoDigitYear=function(e){return V(e)+(V(e)>68?1900:2e3)};var ze=B("FullYear",!0);function Je(e,t,n,r,a,s,i){var o;return e<100&&e>=0?(o=new Date(e+400,t,n,r,a,s,i),isFinite(o.getFullYear())&&o.setFullYear(e)):o=new Date(e,t,n,r,a,s,i),o}function Ue(e){var t,n;return e<100&&e>=0?((n=Array.prototype.slice.call(arguments))[0]=e+400,t=new Date(Date.UTC.apply(null,n)),isFinite(t.getUTCFullYear())&&t.setUTCFullYear(e)):t=new Date(Date.UTC.apply(null,arguments)),t}function Ge(e,t,n){var r=7+t-n;return-(7+Ue(e,0,r).getUTCDay()-t)%7+r-1}function qe(e,t,n,r,a){var s,i,o=1+7*(t-1)+(7+n-r)%7+Ge(e,r,a);return o<=0?i=Ie(s=e-1)+o:o>Ie(e)?(s=e+1,i=o-Ie(e)):(s=e,i=o),{year:s,dayOfYear:i}}function Ve(e,t,n){var r,a,s=Ge(e.year(),t,n),i=Math.floor((e.dayOfYear()-s-1)/7)+1;return i<1?r=i+Be(a=e.year()-1,t,n):i>Be(e.year(),t,n)?(r=i-Be(e.year(),t,n),a=e.year()+1):(a=e.year(),r=i),{week:r,year:a}}function Be(e,t,n){var r=Ge(e,t,n),a=Ge(e+1,t,n);return(Ie(e)-r+a)/7}F("w",["ww",2],"wo","week"),F("W",["WW",2],"Wo","isoWeek"),R("week","w"),R("isoWeek","W"),U("week",5),U("isoWeek",5),he("w",re),he("ww",re,X),he("W",re),he("WW",re,X),Le(["w","ww","W","WW"],(function(e,t,n,r){t[r.substr(0,1)]=V(e)}));function $e(e,t){return e.slice(t,7).concat(e.slice(0,t))}F("d",0,"do","day"),F("dd",0,0,(function(e){return this.localeData().weekdaysMin(this,e)})),F("ddd",0,0,(function(e){return this.localeData().weekdaysShort(this,e)})),F("dddd",0,0,(function(e){return this.localeData().weekdays(this,e)})),F("e",0,0,"weekday"),F("E",0,0,"isoWeekday"),R("day","d"),R("weekday","e"),R("isoWeekday","E"),U("day",11),U("weekday",11),U("isoWeekday",11),he("d",re),he("e",re),he("E",re),he("dd",(function(e,t){return t.weekdaysMinRegex(e)})),he("ddd",(function(e,t){return t.weekdaysShortRegex(e)})),he("dddd",(function(e,t){return t.weekdaysRegex(e)})),Le(["dd","ddd","dddd"],(function(e,t,n,r){var a=n._locale.weekdaysParse(e,r,n._strict);null!=a?t.d=a:f(n).invalidWeekday=e})),Le(["d","e","E"],(function(e,t,n,r){t[r]=V(e)}));var Ke="Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),Ze="Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),Qe="Su_Mo_Tu_We_Th_Fr_Sa".split("_"),Xe=me,et=me,tt=me;function nt(e,t,n){var r,a,s,i=e.toLocaleLowerCase();if(!this._weekdaysParse)for(this._weekdaysParse=[],this._shortWeekdaysParse=[],this._minWeekdaysParse=[],r=0;r<7;++r)s=h([2e3,1]).day(r),this._minWeekdaysParse[r]=this.weekdaysMin(s,"").toLocaleLowerCase(),this._shortWeekdaysParse[r]=this.weekdaysShort(s,"").toLocaleLowerCase(),this._weekdaysParse[r]=this.weekdays(s,"").toLocaleLowerCase();return n?"dddd"===t?-1!==(a=ge.call(this._weekdaysParse,i))?a:null:"ddd"===t?-1!==(a=ge.call(this._shortWeekdaysParse,i))?a:null:-1!==(a=ge.call(this._minWeekdaysParse,i))?a:null:"dddd"===t?-1!==(a=ge.call(this._weekdaysParse,i))||-1!==(a=ge.call(this._shortWeekdaysParse,i))||-1!==(a=ge.call(this._minWeekdaysParse,i))?a:null:"ddd"===t?-1!==(a=ge.call(this._shortWeekdaysParse,i))||-1!==(a=ge.call(this._weekdaysParse,i))||-1!==(a=ge.call(this._minWeekdaysParse,i))?a:null:-1!==(a=ge.call(this._minWeekdaysParse,i))||-1!==(a=ge.call(this._weekdaysParse,i))||-1!==(a=ge.call(this._shortWeekdaysParse,i))?a:null}function rt(){function e(e,t){return t.length-e.length}var t,n,r,a,s,i=[],o=[],d=[],u=[];for(t=0;t<7;t++)n=h([2e3,1]).day(t),r=ye(this.weekdaysMin(n,"")),a=ye(this.weekdaysShort(n,"")),s=ye(this.weekdays(n,"")),i.push(r),o.push(a),d.push(s),u.push(r),u.push(a),u.push(s);i.sort(e),o.sort(e),d.sort(e),u.sort(e),this._weekdaysRegex=new RegExp("^("+u.join("|")+")","i"),this._weekdaysShortRegex=this._weekdaysRegex,this._weekdaysMinRegex=this._weekdaysRegex,this._weekdaysStrictRegex=new RegExp("^("+d.join("|")+")","i"),this._weekdaysShortStrictRegex=new RegExp("^("+o.join("|")+")","i"),this._weekdaysMinStrictRegex=new RegExp("^("+i.join("|")+")","i")}function at(){return this.hours()%12||12}function st(e,t){F(e,0,0,(function(){return this.localeData().meridiem(this.hours(),this.minutes(),t)}))}function it(e,t){return t._meridiemParse}F("H",["HH",2],0,"hour"),F("h",["hh",2],0,at),F("k",["kk",2],0,(function(){return this.hours()||24})),F("hmm",0,0,(function(){return""+at.apply(this)+H(this.minutes(),2)})),F("hmmss",0,0,(function(){return""+at.apply(this)+H(this.minutes(),2)+H(this.seconds(),2)})),F("Hmm",0,0,(function(){return""+this.hours()+H(this.minutes(),2)})),F("Hmmss",0,0,(function(){return""+this.hours()+H(this.minutes(),2)+H(this.seconds(),2)})),st("a",!0),st("A",!1),R("hour","h"),U("hour",13),he("a",it),he("A",it),he("H",re),he("h",re),he("k",re),he("HH",re,X),he("hh",re,X),he("kk",re,X),he("hmm",ae),he("hmmss",se),he("Hmm",ae),he("Hmmss",se),Me(["H","HH"],be),Me(["k","kk"],(function(e,t,n){var r=V(e);t[be]=24===r?0:r})),Me(["a","A"],(function(e,t,n){n._isPm=n._locale.isPM(e),n._meridiem=e})),Me(["h","hh"],(function(e,t,n){t[be]=V(e),f(n).bigHour=!0})),Me("hmm",(function(e,t,n){var r=e.length-2;t[be]=V(e.substr(0,r)),t[De]=V(e.substr(r)),f(n).bigHour=!0})),Me("hmmss",(function(e,t,n){var r=e.length-4,a=e.length-2;t[be]=V(e.substr(0,r)),t[De]=V(e.substr(r,2)),t[Te]=V(e.substr(a)),f(n).bigHour=!0})),Me("Hmm",(function(e,t,n){var r=e.length-2;t[be]=V(e.substr(0,r)),t[De]=V(e.substr(r))})),Me("Hmmss",(function(e,t,n){var r=e.length-4,a=e.length-2;t[be]=V(e.substr(0,r)),t[De]=V(e.substr(r,2)),t[Te]=V(e.substr(a))}));var ot=B("Hours",!0);var dt,ut={calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},longDateFormat:{LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},invalidDate:"Invalid date",ordinal:"%d",dayOfMonthOrdinalParse:/\d{1,2}/,relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",ss:"%d seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",w:"a week",ww:"%d weeks",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},months:Oe,monthsShort:Ee,week:{dow:0,doy:6},weekdays:Ke,weekdaysMin:Qe,weekdaysShort:Ze,meridiemParse:/[ap]\.?m?\.?/i},_t={},lt={};function ct(e,t){var n,r=Math.min(e.length,t.length);for(n=0;n<r;n+=1)if(e[n]!==t[n])return n;return r}function mt(e){return e?e.toLowerCase().replace("_","-"):e}function ht(t){var r=null;if(void 0===_t[t]&&e&&e.exports&&function(e){return null!=e.match("^[^/\\\\]*$")}(t))try{r=dt._abbr,n(46700)("./"+t),ft(r)}catch(e){_t[t]=null}return _t[t]}function ft(e,t){var n;return e&&((n=u(t)?pt(e):yt(e,t))?dt=n:"undefined"!=typeof console&&console.warn&&console.warn("Locale "+e+" not found. Did you forget to load it?")),dt._abbr}function yt(e,t){if(null!==t){var n,r=ut;if(t.abbr=e,null!=_t[e])T("defineLocaleOverride","use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."),r=_t[e]._config;else if(null!=t.parentLocale)if(null!=_t[t.parentLocale])r=_t[t.parentLocale]._config;else{if(null==(n=ht(t.parentLocale)))return lt[t.parentLocale]||(lt[t.parentLocale]=[]),lt[t.parentLocale].push({name:e,config:t}),null;r=n._config}return _t[e]=new x(j(r,t)),lt[e]&&lt[e].forEach((function(e){yt(e.name,e.config)})),ft(e),_t[e]}return delete _t[e],null}function pt(e){var t;if(e&&e._locale&&e._locale._abbr&&(e=e._locale._abbr),!e)return dt;if(!s(e)){if(t=ht(e))return t;e=[e]}return function(e){for(var t,n,r,a,s=0;s<e.length;){for(t=(a=mt(e[s]).split("-")).length,n=(n=mt(e[s+1]))?n.split("-"):null;t>0;){if(r=ht(a.slice(0,t).join("-")))return r;if(n&&n.length>=t&&ct(a,n)>=t-1)break;t--}s++}return dt}(e)}function Mt(e){var t,n=e._a;return n&&-2===f(e).overflow&&(t=n[ke]<0||n[ke]>11?ke:n[we]<1||n[we]>He(n[ve],n[ke])?we:n[be]<0||n[be]>24||24===n[be]&&(0!==n[De]||0!==n[Te]||0!==n[Se])?be:n[De]<0||n[De]>59?De:n[Te]<0||n[Te]>59?Te:n[Se]<0||n[Se]>999?Se:-1,f(e)._overflowDayOfYear&&(t<ve||t>we)&&(t=we),f(e)._overflowWeeks&&-1===t&&(t=je),f(e)._overflowWeekday&&-1===t&&(t=xe),f(e).overflow=t),e}var Lt=/^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,Yt=/^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,gt=/Z|[+-]\d\d(?::?\d\d)?/,vt=[["YYYYYY-MM-DD",/[+-]\d{6}-\d\d-\d\d/],["YYYY-MM-DD",/\d{4}-\d\d-\d\d/],["GGGG-[W]WW-E",/\d{4}-W\d\d-\d/],["GGGG-[W]WW",/\d{4}-W\d\d/,!1],["YYYY-DDD",/\d{4}-\d{3}/],["YYYY-MM",/\d{4}-\d\d/,!1],["YYYYYYMMDD",/[+-]\d{10}/],["YYYYMMDD",/\d{8}/],["GGGG[W]WWE",/\d{4}W\d{3}/],["GGGG[W]WW",/\d{4}W\d{2}/,!1],["YYYYDDD",/\d{7}/],["YYYYMM",/\d{6}/,!1],["YYYY",/\d{4}/,!1]],kt=[["HH:mm:ss.SSSS",/\d\d:\d\d:\d\d\.\d+/],["HH:mm:ss,SSSS",/\d\d:\d\d:\d\d,\d+/],["HH:mm:ss",/\d\d:\d\d:\d\d/],["HH:mm",/\d\d:\d\d/],["HHmmss.SSSS",/\d\d\d\d\d\d\.\d+/],["HHmmss,SSSS",/\d\d\d\d\d\d,\d+/],["HHmmss",/\d\d\d\d\d\d/],["HHmm",/\d\d\d\d/],["HH",/\d\d/]],wt=/^\/?Date\((-?\d+)/i,bt=/^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,Dt={UT:0,GMT:0,EDT:-240,EST:-300,CDT:-300,CST:-360,MDT:-360,MST:-420,PDT:-420,PST:-480};function Tt(e){var t,n,r,a,s,i,o=e._i,d=Lt.exec(o)||Yt.exec(o),u=vt.length,_=kt.length;if(d){for(f(e).iso=!0,t=0,n=u;t<n;t++)if(vt[t][1].exec(d[1])){a=vt[t][0],r=!1!==vt[t][2];break}if(null==a)return void(e._isValid=!1);if(d[3]){for(t=0,n=_;t<n;t++)if(kt[t][1].exec(d[3])){s=(d[2]||" ")+kt[t][0];break}if(null==s)return void(e._isValid=!1)}if(!r&&null!=s)return void(e._isValid=!1);if(d[4]){if(!gt.exec(d[4]))return void(e._isValid=!1);i="Z"}e._f=a+(s||"")+(i||""),Ot(e)}else e._isValid=!1}function St(e){var t=parseInt(e,10);return t<=49?2e3+t:t<=999?1900+t:t}function jt(e){var t,n,r,a,s,i,o,d,u=bt.exec(e._i.replace(/\([^()]*\)|[\n\t]/g," ").replace(/(\s\s+)/g," ").replace(/^\s\s*/,"").replace(/\s\s*$/,""));if(u){if(n=u[4],r=u[3],a=u[2],s=u[5],i=u[6],o=u[7],d=[St(n),Ee.indexOf(r),parseInt(a,10),parseInt(s,10),parseInt(i,10)],o&&d.push(parseInt(o,10)),t=d,!function(e,t,n){return!e||Ze.indexOf(e)===new Date(t[0],t[1],t[2]).getDay()||(f(n).weekdayMismatch=!0,n._isValid=!1,!1)}(u[1],t,e))return;e._a=t,e._tzm=function(e,t,n){if(e)return Dt[e];if(t)return 0;var r=parseInt(n,10),a=r%100;return(r-a)/100*60+a}(u[8],u[9],u[10]),e._d=Ue.apply(null,e._a),e._d.setUTCMinutes(e._d.getUTCMinutes()-e._tzm),f(e).rfc2822=!0}else e._isValid=!1}function xt(e,t,n){return null!=e?e:null!=t?t:n}function Ht(e){var t,n,r,s,i,o=[];if(!e._d){for(r=function(e){var t=new Date(a.now());return e._useUTC?[t.getUTCFullYear(),t.getUTCMonth(),t.getUTCDate()]:[t.getFullYear(),t.getMonth(),t.getDate()]}(e),e._w&&null==e._a[we]&&null==e._a[ke]&&function(e){var t,n,r,a,s,i,o,d,u;null!=(t=e._w).GG||null!=t.W||null!=t.E?(s=1,i=4,n=xt(t.GG,e._a[ve],Ve(At(),1,4).year),r=xt(t.W,1),((a=xt(t.E,1))<1||a>7)&&(d=!0)):(s=e._locale._week.dow,i=e._locale._week.doy,u=Ve(At(),s,i),n=xt(t.gg,e._a[ve],u.year),r=xt(t.w,u.week),null!=t.d?((a=t.d)<0||a>6)&&(d=!0):null!=t.e?(a=t.e+s,(t.e<0||t.e>6)&&(d=!0)):a=s),r<1||r>Be(n,s,i)?f(e)._overflowWeeks=!0:null!=d?f(e)._overflowWeekday=!0:(o=qe(n,r,a,s,i),e._a[ve]=o.year,e._dayOfYear=o.dayOfYear)}(e),null!=e._dayOfYear&&(i=xt(e._a[ve],r[ve]),(e._dayOfYear>Ie(i)||0===e._dayOfYear)&&(f(e)._overflowDayOfYear=!0),n=Ue(i,0,e._dayOfYear),e._a[ke]=n.getUTCMonth(),e._a[we]=n.getUTCDate()),t=0;t<3&&null==e._a[t];++t)e._a[t]=o[t]=r[t];for(;t<7;t++)e._a[t]=o[t]=null==e._a[t]?2===t?1:0:e._a[t];24===e._a[be]&&0===e._a[De]&&0===e._a[Te]&&0===e._a[Se]&&(e._nextDay=!0,e._a[be]=0),e._d=(e._useUTC?Ue:Je).apply(null,o),s=e._useUTC?e._d.getUTCDay():e._d.getDay(),null!=e._tzm&&e._d.setUTCMinutes(e._d.getUTCMinutes()-e._tzm),e._nextDay&&(e._a[be]=24),e._w&&void 0!==e._w.d&&e._w.d!==s&&(f(e).weekdayMismatch=!0)}}function Ot(e){if(e._f!==a.ISO_8601)if(e._f!==a.RFC_2822){e._a=[],f(e).empty=!0;var t,n,r,s,i,o,d,u=""+e._i,_=u.length,l=0;for(d=(r=N(e._f,e._locale).match(O)||[]).length,t=0;t<d;t++)s=r[t],(n=(u.match(fe(s,e))||[])[0])&&((i=u.substr(0,u.indexOf(n))).length>0&&f(e).unusedInput.push(i),u=u.slice(u.indexOf(n)+n.length),l+=n.length),A[s]?(n?f(e).empty=!1:f(e).unusedTokens.push(s),Ye(s,n,e)):e._strict&&!n&&f(e).unusedTokens.push(s);f(e).charsLeftOver=_-l,u.length>0&&f(e).unusedInput.push(u),e._a[be]<=12&&!0===f(e).bigHour&&e._a[be]>0&&(f(e).bigHour=void 0),f(e).parsedDateParts=e._a.slice(0),f(e).meridiem=e._meridiem,e._a[be]=function(e,t,n){var r;return null==n?t:null!=e.meridiemHour?e.meridiemHour(t,n):null!=e.isPM?((r=e.isPM(n))&&t<12&&(t+=12),r||12!==t||(t=0),t):t}(e._locale,e._a[be],e._meridiem),null!==(o=f(e).era)&&(e._a[ve]=e._locale.erasConvertYear(o,e._a[ve])),Ht(e),Mt(e)}else jt(e);else Tt(e)}function Et(e){var t=e._i,n=e._f;return e._locale=e._locale||pt(e._l),null===t||void 0===n&&""===t?p({nullInput:!0}):("string"==typeof t&&(e._i=t=e._locale.preparse(t)),v(t)?new g(Mt(t)):(l(t)?e._d=t:s(n)?function(e){var t,n,r,a,s,i,o=!1,d=e._f.length;if(0===d)return f(e).invalidFormat=!0,void(e._d=new Date(NaN));for(a=0;a<d;a++)s=0,i=!1,t=Y({},e),null!=e._useUTC&&(t._useUTC=e._useUTC),t._f=e._f[a],Ot(t),y(t)&&(i=!0),s+=f(t).charsLeftOver,s+=10*f(t).unusedTokens.length,f(t).score=s,o?s<r&&(r=s,n=t):(null==r||s<r||i)&&(r=s,n=t,i&&(o=!0));m(e,n||t)}(e):n?Ot(e):function(e){var t=e._i;u(t)?e._d=new Date(a.now()):l(t)?e._d=new Date(t.valueOf()):"string"==typeof t?function(e){var t=wt.exec(e._i);null===t?(Tt(e),!1===e._isValid&&(delete e._isValid,jt(e),!1===e._isValid&&(delete e._isValid,e._strict?e._isValid=!1:a.createFromInputFallback(e)))):e._d=new Date(+t[1])}(e):s(t)?(e._a=c(t.slice(0),(function(e){return parseInt(e,10)})),Ht(e)):i(t)?function(e){if(!e._d){var t=z(e._i),n=void 0===t.day?t.date:t.day;e._a=c([t.year,t.month,n,t.hour,t.minute,t.second,t.millisecond],(function(e){return e&&parseInt(e,10)})),Ht(e)}}(e):_(t)?e._d=new Date(t):a.createFromInputFallback(e)}(e),y(e)||(e._d=null),e))}function Pt(e,t,n,r,a){var o,u={};return!0!==t&&!1!==t||(r=t,t=void 0),!0!==n&&!1!==n||(r=n,n=void 0),(i(e)&&d(e)||s(e)&&0===e.length)&&(e=void 0),u._isAMomentObject=!0,u._useUTC=u._isUTC=a,u._l=n,u._i=e,u._f=t,u._strict=r,(o=new g(Mt(Et(u))))._nextDay&&(o.add(1,"d"),o._nextDay=void 0),o}function At(e,t,n,r){return Pt(e,t,n,r,!1)}a.createFromInputFallback=w("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.",(function(e){e._d=new Date(e._i+(e._useUTC?" UTC":""))})),a.ISO_8601=function(){},a.RFC_2822=function(){};var Ft=w("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/",(function(){var e=At.apply(null,arguments);return this.isValid()&&e.isValid()?e<this?this:e:p()})),Wt=w("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/",(function(){var e=At.apply(null,arguments);return this.isValid()&&e.isValid()?e>this?this:e:p()}));function Nt(e,t){var n,r;if(1===t.length&&s(t[0])&&(t=t[0]),!t.length)return At();for(n=t[0],r=1;r<t.length;++r)t[r].isValid()&&!t[r][e](n)||(n=t[r]);return n}var Ct=["year","quarter","month","week","day","hour","minute","second","millisecond"];function Rt(e){var t=z(e),n=t.year||0,r=t.quarter||0,a=t.month||0,s=t.week||t.isoWeek||0,i=t.day||0,d=t.hour||0,u=t.minute||0,_=t.second||0,l=t.millisecond||0;this._isValid=function(e){var t,n,r=!1,a=Ct.length;for(t in e)if(o(e,t)&&(-1===ge.call(Ct,t)||null!=e[t]&&isNaN(e[t])))return!1;for(n=0;n<a;++n)if(e[Ct[n]]){if(r)return!1;parseFloat(e[Ct[n]])!==V(e[Ct[n]])&&(r=!0)}return!0}(t),this._milliseconds=+l+1e3*_+6e4*u+1e3*d*60*60,this._days=+i+7*s,this._months=+a+3*r+12*n,this._data={},this._locale=pt(),this._bubble()}function It(e){return e instanceof Rt}function zt(e){return e<0?-1*Math.round(-1*e):Math.round(e)}function Jt(e,t){F(e,0,0,(function(){var e=this.utcOffset(),n="+";return e<0&&(e=-e,n="-"),n+H(~~(e/60),2)+t+H(~~e%60,2)}))}Jt("Z",":"),Jt("ZZ",""),he("Z",ce),he("ZZ",ce),Me(["Z","ZZ"],(function(e,t,n){n._useUTC=!0,n._tzm=Gt(ce,e)}));var Ut=/([\+\-]|\d\d)/gi;function Gt(e,t){var n,r,a=(t||"").match(e);return null===a?null:0===(r=60*(n=((a[a.length-1]||[])+"").match(Ut)||["-",0,0])[1]+V(n[2]))?0:"+"===n[0]?r:-r}function qt(e,t){var n,r;return t._isUTC?(n=t.clone(),r=(v(e)||l(e)?e.valueOf():At(e).valueOf())-n.valueOf(),n._d.setTime(n._d.valueOf()+r),a.updateOffset(n,!1),n):At(e).local()}function Vt(e){return-Math.round(e._d.getTimezoneOffset())}function Bt(){return!!this.isValid()&&this._isUTC&&0===this._offset}a.updateOffset=function(){};var $t=/^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,Kt=/^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;function Zt(e,t){var n,r,a,s,i,d,u=e,l=null;return It(e)?u={ms:e._milliseconds,d:e._days,M:e._months}:_(e)||!isNaN(+e)?(u={},t?u[t]=+e:u.milliseconds=+e):(l=$t.exec(e))?(n="-"===l[1]?-1:1,u={y:0,d:V(l[we])*n,h:V(l[be])*n,m:V(l[De])*n,s:V(l[Te])*n,ms:V(zt(1e3*l[Se]))*n}):(l=Kt.exec(e))?(n="-"===l[1]?-1:1,u={y:Qt(l[2],n),M:Qt(l[3],n),w:Qt(l[4],n),d:Qt(l[5],n),h:Qt(l[6],n),m:Qt(l[7],n),s:Qt(l[8],n)}):null==u?u={}:"object"==typeof u&&("from"in u||"to"in u)&&(s=At(u.from),i=At(u.to),a=s.isValid()&&i.isValid()?(i=qt(i,s),s.isBefore(i)?d=Xt(s,i):((d=Xt(i,s)).milliseconds=-d.milliseconds,d.months=-d.months),d):{milliseconds:0,months:0},(u={}).ms=a.milliseconds,u.M=a.months),r=new Rt(u),It(e)&&o(e,"_locale")&&(r._locale=e._locale),It(e)&&o(e,"_isValid")&&(r._isValid=e._isValid),r}function Qt(e,t){var n=e&&parseFloat(e.replace(",","."));return(isNaN(n)?0:n)*t}function Xt(e,t){var n={};return n.months=t.month()-e.month()+12*(t.year()-e.year()),e.clone().add(n.months,"M").isAfter(t)&&--n.months,n.milliseconds=+t-+e.clone().add(n.months,"M"),n}function en(e,t){return function(n,r){var a;return null===r||isNaN(+r)||(T(t,"moment()."+t+"(period, number) is deprecated. Please use moment()."+t+"(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."),a=n,n=r,r=a),tn(this,Zt(n,r),e),this}}function tn(e,t,n,r){var s=t._milliseconds,i=zt(t._days),o=zt(t._months);e.isValid()&&(r=null==r||r,o&&Ne(e,$(e,"Month")+o*n),i&&K(e,"Date",$(e,"Date")+i*n),s&&e._d.setTime(e._d.valueOf()+s*n),r&&a.updateOffset(e,i||o))}Zt.fn=Rt.prototype,Zt.invalid=function(){return Zt(NaN)};var nn=en(1,"add"),rn=en(-1,"subtract");function an(e){return"string"==typeof e||e instanceof String}function sn(e){return v(e)||l(e)||an(e)||_(e)||function(e){var t=s(e),n=!1;return t&&(n=0===e.filter((function(t){return!_(t)&&an(e)})).length),t&&n}(e)||function(e){var t,n,r=i(e)&&!d(e),a=!1,s=["years","year","y","months","month","M","days","day","d","dates","date","D","hours","hour","h","minutes","minute","m","seconds","second","s","milliseconds","millisecond","ms"],u=s.length;for(t=0;t<u;t+=1)n=s[t],a=a||o(e,n);return r&&a}(e)||null==e}function on(e,t){if(e.date()<t.date())return-on(t,e);var n=12*(t.year()-e.year())+(t.month()-e.month()),r=e.clone().add(n,"months");return-(n+(t-r<0?(t-r)/(r-e.clone().add(n-1,"months")):(t-r)/(e.clone().add(n+1,"months")-r)))||0}function dn(e){var t;return void 0===e?this._locale._abbr:(null!=(t=pt(e))&&(this._locale=t),this)}a.defaultFormat="YYYY-MM-DDTHH:mm:ssZ",a.defaultFormatUtc="YYYY-MM-DDTHH:mm:ss[Z]";var un=w("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",(function(e){return void 0===e?this.localeData():this.locale(e)}));function _n(){return this._locale}var ln=1e3,cn=6e4,mn=36e5,hn=126227808e5;function fn(e,t){return(e%t+t)%t}function yn(e,t,n){return e<100&&e>=0?new Date(e+400,t,n)-hn:new Date(e,t,n).valueOf()}function pn(e,t,n){return e<100&&e>=0?Date.UTC(e+400,t,n)-hn:Date.UTC(e,t,n)}function Mn(e,t){return t.erasAbbrRegex(e)}function Ln(){var e,t,n=[],r=[],a=[],s=[],i=this.eras();for(e=0,t=i.length;e<t;++e)r.push(ye(i[e].name)),n.push(ye(i[e].abbr)),a.push(ye(i[e].narrow)),s.push(ye(i[e].name)),s.push(ye(i[e].abbr)),s.push(ye(i[e].narrow));this._erasRegex=new RegExp("^("+s.join("|")+")","i"),this._erasNameRegex=new RegExp("^("+r.join("|")+")","i"),this._erasAbbrRegex=new RegExp("^("+n.join("|")+")","i"),this._erasNarrowRegex=new RegExp("^("+a.join("|")+")","i")}function Yn(e,t){F(0,[e,e.length],0,t)}function gn(e,t,n,r,a){var s;return null==e?Ve(this,r,a).year:(t>(s=Be(e,r,a))&&(t=s),vn.call(this,e,t,n,r,a))}function vn(e,t,n,r,a){var s=qe(e,t,n,r,a),i=Ue(s.year,0,s.dayOfYear);return this.year(i.getUTCFullYear()),this.month(i.getUTCMonth()),this.date(i.getUTCDate()),this}F("N",0,0,"eraAbbr"),F("NN",0,0,"eraAbbr"),F("NNN",0,0,"eraAbbr"),F("NNNN",0,0,"eraName"),F("NNNNN",0,0,"eraNarrow"),F("y",["y",1],"yo","eraYear"),F("y",["yy",2],0,"eraYear"),F("y",["yyy",3],0,"eraYear"),F("y",["yyyy",4],0,"eraYear"),he("N",Mn),he("NN",Mn),he("NNN",Mn),he("NNNN",(function(e,t){return t.erasNameRegex(e)})),he("NNNNN",(function(e,t){return t.erasNarrowRegex(e)})),Me(["N","NN","NNN","NNNN","NNNNN"],(function(e,t,n,r){var a=n._locale.erasParse(e,r,n._strict);a?f(n).era=a:f(n).invalidEra=e})),he("y",ue),he("yy",ue),he("yyy",ue),he("yyyy",ue),he("yo",(function(e,t){return t._eraYearOrdinalRegex||ue})),Me(["y","yy","yyy","yyyy"],ve),Me(["yo"],(function(e,t,n,r){var a;n._locale._eraYearOrdinalRegex&&(a=e.match(n._locale._eraYearOrdinalRegex)),n._locale.eraYearOrdinalParse?t[ve]=n._locale.eraYearOrdinalParse(e,a):t[ve]=parseInt(e,10)})),F(0,["gg",2],0,(function(){return this.weekYear()%100})),F(0,["GG",2],0,(function(){return this.isoWeekYear()%100})),Yn("gggg","weekYear"),Yn("ggggg","weekYear"),Yn("GGGG","isoWeekYear"),Yn("GGGGG","isoWeekYear"),R("weekYear","gg"),R("isoWeekYear","GG"),U("weekYear",1),U("isoWeekYear",1),he("G",_e),he("g",_e),he("GG",re,X),he("gg",re,X),he("GGGG",oe,te),he("gggg",oe,te),he("GGGGG",de,ne),he("ggggg",de,ne),Le(["gggg","ggggg","GGGG","GGGGG"],(function(e,t,n,r){t[r.substr(0,2)]=V(e)})),Le(["gg","GG"],(function(e,t,n,r){t[r]=a.parseTwoDigitYear(e)})),F("Q",0,"Qo","quarter"),R("quarter","Q"),U("quarter",7),he("Q",Q),Me("Q",(function(e,t){t[ke]=3*(V(e)-1)})),F("D",["DD",2],"Do","date"),R("date","D"),U("date",9),he("D",re),he("DD",re,X),he("Do",(function(e,t){return e?t._dayOfMonthOrdinalParse||t._ordinalParse:t._dayOfMonthOrdinalParseLenient})),Me(["D","DD"],we),Me("Do",(function(e,t){t[we]=V(e.match(re)[0])}));var kn=B("Date",!0);F("DDD",["DDDD",3],"DDDo","dayOfYear"),R("dayOfYear","DDD"),U("dayOfYear",4),he("DDD",ie),he("DDDD",ee),Me(["DDD","DDDD"],(function(e,t,n){n._dayOfYear=V(e)})),F("m",["mm",2],0,"minute"),R("minute","m"),U("minute",14),he("m",re),he("mm",re,X),Me(["m","mm"],De);var wn=B("Minutes",!1);F("s",["ss",2],0,"second"),R("second","s"),U("second",15),he("s",re),he("ss",re,X),Me(["s","ss"],Te);var bn,Dn,Tn=B("Seconds",!1);for(F("S",0,0,(function(){return~~(this.millisecond()/100)})),F(0,["SS",2],0,(function(){return~~(this.millisecond()/10)})),F(0,["SSS",3],0,"millisecond"),F(0,["SSSS",4],0,(function(){return 10*this.millisecond()})),F(0,["SSSSS",5],0,(function(){return 100*this.millisecond()})),F(0,["SSSSSS",6],0,(function(){return 1e3*this.millisecond()})),F(0,["SSSSSSS",7],0,(function(){return 1e4*this.millisecond()})),F(0,["SSSSSSSS",8],0,(function(){return 1e5*this.millisecond()})),F(0,["SSSSSSSSS",9],0,(function(){return 1e6*this.millisecond()})),R("millisecond","ms"),U("millisecond",16),he("S",ie,Q),he("SS",ie,X),he("SSS",ie,ee),bn="SSSS";bn.length<=9;bn+="S")he(bn,ue);function Sn(e,t){t[Se]=V(1e3*("0."+e))}for(bn="S";bn.length<=9;bn+="S")Me(bn,Sn);Dn=B("Milliseconds",!1),F("z",0,0,"zoneAbbr"),F("zz",0,0,"zoneName");var jn=g.prototype;function xn(e){return e}jn.add=nn,jn.calendar=function(e,t){1===arguments.length&&(arguments[0]?sn(arguments[0])?(e=arguments[0],t=void 0):function(e){var t,n=i(e)&&!d(e),r=!1,a=["sameDay","nextDay","lastDay","nextWeek","lastWeek","sameElse"];for(t=0;t<a.length;t+=1)r=r||o(e,a[t]);return n&&r}(arguments[0])&&(t=arguments[0],e=void 0):(e=void 0,t=void 0));var n=e||At(),r=qt(n,this).startOf("day"),s=a.calendarFormat(this,r)||"sameElse",u=t&&(S(t[s])?t[s].call(this,n):t[s]);return this.format(u||this.localeData().calendar(s,this,At(n)))},jn.clone=function(){return new g(this)},jn.diff=function(e,t,n){var r,a,s;if(!this.isValid())return NaN;if(!(r=qt(e,this)).isValid())return NaN;switch(a=6e4*(r.utcOffset()-this.utcOffset()),t=I(t)){case"year":s=on(this,r)/12;break;case"month":s=on(this,r);break;case"quarter":s=on(this,r)/3;break;case"second":s=(this-r)/1e3;break;case"minute":s=(this-r)/6e4;break;case"hour":s=(this-r)/36e5;break;case"day":s=(this-r-a)/864e5;break;case"week":s=(this-r-a)/6048e5;break;default:s=this-r}return n?s:q(s)},jn.endOf=function(e){var t,n;if(void 0===(e=I(e))||"millisecond"===e||!this.isValid())return this;switch(n=this._isUTC?pn:yn,e){case"year":t=n(this.year()+1,0,1)-1;break;case"quarter":t=n(this.year(),this.month()-this.month()%3+3,1)-1;break;case"month":t=n(this.year(),this.month()+1,1)-1;break;case"week":t=n(this.year(),this.month(),this.date()-this.weekday()+7)-1;break;case"isoWeek":t=n(this.year(),this.month(),this.date()-(this.isoWeekday()-1)+7)-1;break;case"day":case"date":t=n(this.year(),this.month(),this.date()+1)-1;break;case"hour":t=this._d.valueOf(),t+=mn-fn(t+(this._isUTC?0:this.utcOffset()*cn),mn)-1;break;case"minute":t=this._d.valueOf(),t+=cn-fn(t,cn)-1;break;case"second":t=this._d.valueOf(),t+=ln-fn(t,ln)-1}return this._d.setTime(t),a.updateOffset(this,!0),this},jn.format=function(e){e||(e=this.isUtc()?a.defaultFormatUtc:a.defaultFormat);var t=W(this,e);return this.localeData().postformat(t)},jn.from=function(e,t){return this.isValid()&&(v(e)&&e.isValid()||At(e).isValid())?Zt({to:this,from:e}).locale(this.locale()).humanize(!t):this.localeData().invalidDate()},jn.fromNow=function(e){return this.from(At(),e)},jn.to=function(e,t){return this.isValid()&&(v(e)&&e.isValid()||At(e).isValid())?Zt({from:this,to:e}).locale(this.locale()).humanize(!t):this.localeData().invalidDate()},jn.toNow=function(e){return this.to(At(),e)},jn.get=function(e){return S(this[e=I(e)])?this[e]():this},jn.invalidAt=function(){return f(this).overflow},jn.isAfter=function(e,t){var n=v(e)?e:At(e);return!(!this.isValid()||!n.isValid())&&("millisecond"===(t=I(t)||"millisecond")?this.valueOf()>n.valueOf():n.valueOf()<this.clone().startOf(t).valueOf())},jn.isBefore=function(e,t){var n=v(e)?e:At(e);return!(!this.isValid()||!n.isValid())&&("millisecond"===(t=I(t)||"millisecond")?this.valueOf()<n.valueOf():this.clone().endOf(t).valueOf()<n.valueOf())},jn.isBetween=function(e,t,n,r){var a=v(e)?e:At(e),s=v(t)?t:At(t);return!!(this.isValid()&&a.isValid()&&s.isValid())&&("("===(r=r||"()")[0]?this.isAfter(a,n):!this.isBefore(a,n))&&(")"===r[1]?this.isBefore(s,n):!this.isAfter(s,n))},jn.isSame=function(e,t){var n,r=v(e)?e:At(e);return!(!this.isValid()||!r.isValid())&&("millisecond"===(t=I(t)||"millisecond")?this.valueOf()===r.valueOf():(n=r.valueOf(),this.clone().startOf(t).valueOf()<=n&&n<=this.clone().endOf(t).valueOf()))},jn.isSameOrAfter=function(e,t){return this.isSame(e,t)||this.isAfter(e,t)},jn.isSameOrBefore=function(e,t){return this.isSame(e,t)||this.isBefore(e,t)},jn.isValid=function(){return y(this)},jn.lang=un,jn.locale=dn,jn.localeData=_n,jn.max=Wt,jn.min=Ft,jn.parsingFlags=function(){return m({},f(this))},jn.set=function(e,t){if("object"==typeof e){var n,r=function(e){var t,n=[];for(t in e)o(e,t)&&n.push({unit:t,priority:J[t]});return n.sort((function(e,t){return e.priority-t.priority})),n}(e=z(e)),a=r.length;for(n=0;n<a;n++)this[r[n].unit](e[r[n].unit])}else if(S(this[e=I(e)]))return this[e](t);return this},jn.startOf=function(e){var t,n;if(void 0===(e=I(e))||"millisecond"===e||!this.isValid())return this;switch(n=this._isUTC?pn:yn,e){case"year":t=n(this.year(),0,1);break;case"quarter":t=n(this.year(),this.month()-this.month()%3,1);break;case"month":t=n(this.year(),this.month(),1);break;case"week":t=n(this.year(),this.month(),this.date()-this.weekday());break;case"isoWeek":t=n(this.year(),this.month(),this.date()-(this.isoWeekday()-1));break;case"day":case"date":t=n(this.year(),this.month(),this.date());break;case"hour":t=this._d.valueOf(),t-=fn(t+(this._isUTC?0:this.utcOffset()*cn),mn);break;case"minute":t=this._d.valueOf(),t-=fn(t,cn);break;case"second":t=this._d.valueOf(),t-=fn(t,ln)}return this._d.setTime(t),a.updateOffset(this,!0),this},jn.subtract=rn,jn.toArray=function(){var e=this;return[e.year(),e.month(),e.date(),e.hour(),e.minute(),e.second(),e.millisecond()]},jn.toObject=function(){var e=this;return{years:e.year(),months:e.month(),date:e.date(),hours:e.hours(),minutes:e.minutes(),seconds:e.seconds(),milliseconds:e.milliseconds()}},jn.toDate=function(){return new Date(this.valueOf())},jn.toISOString=function(e){if(!this.isValid())return null;var t=!0!==e,n=t?this.clone().utc():this;return n.year()<0||n.year()>9999?W(n,t?"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]":"YYYYYY-MM-DD[T]HH:mm:ss.SSSZ"):S(Date.prototype.toISOString)?t?this.toDate().toISOString():new Date(this.valueOf()+60*this.utcOffset()*1e3).toISOString().replace("Z",W(n,"Z")):W(n,t?"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]":"YYYY-MM-DD[T]HH:mm:ss.SSSZ")},jn.inspect=function(){if(!this.isValid())return"moment.invalid(/* "+this._i+" */)";var e,t,n,r="moment",a="";return this.isLocal()||(r=0===this.utcOffset()?"moment.utc":"moment.parseZone",a="Z"),e="["+r+'("]',t=0<=this.year()&&this.year()<=9999?"YYYY":"YYYYYY","-MM-DD[T]HH:mm:ss.SSS",n=a+'[")]',this.format(e+t+"-MM-DD[T]HH:mm:ss.SSS"+n)},"undefined"!=typeof Symbol&&null!=Symbol.for&&(jn[Symbol.for("nodejs.util.inspect.custom")]=function(){return"Moment<"+this.format()+">"}),jn.toJSON=function(){return this.isValid()?this.toISOString():null},jn.toString=function(){return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")},jn.unix=function(){return Math.floor(this.valueOf()/1e3)},jn.valueOf=function(){return this._d.valueOf()-6e4*(this._offset||0)},jn.creationData=function(){return{input:this._i,format:this._f,locale:this._locale,isUTC:this._isUTC,strict:this._strict}},jn.eraName=function(){var e,t,n,r=this.localeData().eras();for(e=0,t=r.length;e<t;++e){if(n=this.clone().startOf("day").valueOf(),r[e].since<=n&&n<=r[e].until)return r[e].name;if(r[e].until<=n&&n<=r[e].since)return r[e].name}return""},jn.eraNarrow=function(){var e,t,n,r=this.localeData().eras();for(e=0,t=r.length;e<t;++e){if(n=this.clone().startOf("day").valueOf(),r[e].since<=n&&n<=r[e].until)return r[e].narrow;if(r[e].until<=n&&n<=r[e].since)return r[e].narrow}return""},jn.eraAbbr=function(){var e,t,n,r=this.localeData().eras();for(e=0,t=r.length;e<t;++e){if(n=this.clone().startOf("day").valueOf(),r[e].since<=n&&n<=r[e].until)return r[e].abbr;if(r[e].until<=n&&n<=r[e].since)return r[e].abbr}return""},jn.eraYear=function(){var e,t,n,r,s=this.localeData().eras();for(e=0,t=s.length;e<t;++e)if(n=s[e].since<=s[e].until?1:-1,r=this.clone().startOf("day").valueOf(),s[e].since<=r&&r<=s[e].until||s[e].until<=r&&r<=s[e].since)return(this.year()-a(s[e].since).year())*n+s[e].offset;return this.year()},jn.year=ze,jn.isLeapYear=function(){return G(this.year())},jn.weekYear=function(e){return gn.call(this,e,this.week(),this.weekday(),this.localeData()._week.dow,this.localeData()._week.doy)},jn.isoWeekYear=function(e){return gn.call(this,e,this.isoWeek(),this.isoWeekday(),1,4)},jn.quarter=jn.quarters=function(e){return null==e?Math.ceil((this.month()+1)/3):this.month(3*(e-1)+this.month()%3)},jn.month=Ce,jn.daysInMonth=function(){return He(this.year(),this.month())},jn.week=jn.weeks=function(e){var t=this.localeData().week(this);return null==e?t:this.add(7*(e-t),"d")},jn.isoWeek=jn.isoWeeks=function(e){var t=Ve(this,1,4).week;return null==e?t:this.add(7*(e-t),"d")},jn.weeksInYear=function(){var e=this.localeData()._week;return Be(this.year(),e.dow,e.doy)},jn.weeksInWeekYear=function(){var e=this.localeData()._week;return Be(this.weekYear(),e.dow,e.doy)},jn.isoWeeksInYear=function(){return Be(this.year(),1,4)},jn.isoWeeksInISOWeekYear=function(){return Be(this.isoWeekYear(),1,4)},jn.date=kn,jn.day=jn.days=function(e){if(!this.isValid())return null!=e?this:NaN;var t=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=e?(e=function(e,t){return"string"!=typeof e?e:isNaN(e)?"number"==typeof(e=t.weekdaysParse(e))?e:null:parseInt(e,10)}(e,this.localeData()),this.add(e-t,"d")):t},jn.weekday=function(e){if(!this.isValid())return null!=e?this:NaN;var t=(this.day()+7-this.localeData()._week.dow)%7;return null==e?t:this.add(e-t,"d")},jn.isoWeekday=function(e){if(!this.isValid())return null!=e?this:NaN;if(null!=e){var t=function(e,t){return"string"==typeof e?t.weekdaysParse(e)%7||7:isNaN(e)?null:e}(e,this.localeData());return this.day(this.day()%7?t:t-7)}return this.day()||7},jn.dayOfYear=function(e){var t=Math.round((this.clone().startOf("day")-this.clone().startOf("year"))/864e5)+1;return null==e?t:this.add(e-t,"d")},jn.hour=jn.hours=ot,jn.minute=jn.minutes=wn,jn.second=jn.seconds=Tn,jn.millisecond=jn.milliseconds=Dn,jn.utcOffset=function(e,t,n){var r,s=this._offset||0;if(!this.isValid())return null!=e?this:NaN;if(null!=e){if("string"==typeof e){if(null===(e=Gt(ce,e)))return this}else Math.abs(e)<16&&!n&&(e*=60);return!this._isUTC&&t&&(r=Vt(this)),this._offset=e,this._isUTC=!0,null!=r&&this.add(r,"m"),s!==e&&(!t||this._changeInProgress?tn(this,Zt(e-s,"m"),1,!1):this._changeInProgress||(this._changeInProgress=!0,a.updateOffset(this,!0),this._changeInProgress=null)),this}return this._isUTC?s:Vt(this)},jn.utc=function(e){return this.utcOffset(0,e)},jn.local=function(e){return this._isUTC&&(this.utcOffset(0,e),this._isUTC=!1,e&&this.subtract(Vt(this),"m")),this},jn.parseZone=function(){if(null!=this._tzm)this.utcOffset(this._tzm,!1,!0);else if("string"==typeof this._i){var e=Gt(le,this._i);null!=e?this.utcOffset(e):this.utcOffset(0,!0)}return this},jn.hasAlignedHourOffset=function(e){return!!this.isValid()&&(e=e?At(e).utcOffset():0,(this.utcOffset()-e)%60==0)},jn.isDST=function(){return this.utcOffset()>this.clone().month(0).utcOffset()||this.utcOffset()>this.clone().month(5).utcOffset()},jn.isLocal=function(){return!!this.isValid()&&!this._isUTC},jn.isUtcOffset=function(){return!!this.isValid()&&this._isUTC},jn.isUtc=Bt,jn.isUTC=Bt,jn.zoneAbbr=function(){return this._isUTC?"UTC":""},jn.zoneName=function(){return this._isUTC?"Coordinated Universal Time":""},jn.dates=w("dates accessor is deprecated. Use date instead.",kn),jn.months=w("months accessor is deprecated. Use month instead",Ce),jn.years=w("years accessor is deprecated. Use year instead",ze),jn.zone=w("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/",(function(e,t){return null!=e?("string"!=typeof e&&(e=-e),this.utcOffset(e,t),this):-this.utcOffset()})),jn.isDSTShifted=w("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information",(function(){if(!u(this._isDSTShifted))return this._isDSTShifted;var e,t={};return Y(t,this),(t=Et(t))._a?(e=t._isUTC?h(t._a):At(t._a),this._isDSTShifted=this.isValid()&&function(e,t,n){var r,a=Math.min(e.length,t.length),s=Math.abs(e.length-t.length),i=0;for(r=0;r<a;r++)(n&&e[r]!==t[r]||!n&&V(e[r])!==V(t[r]))&&i++;return i+s}(t._a,e.toArray())>0):this._isDSTShifted=!1,this._isDSTShifted}));var Hn=x.prototype;function On(e,t,n,r){var a=pt(),s=h().set(r,t);return a[n](s,e)}function En(e,t,n){if(_(e)&&(t=e,e=void 0),e=e||"",null!=t)return On(e,t,n,"month");var r,a=[];for(r=0;r<12;r++)a[r]=On(e,r,n,"month");return a}function Pn(e,t,n,r){"boolean"==typeof e?(_(t)&&(n=t,t=void 0),t=t||""):(n=t=e,e=!1,_(t)&&(n=t,t=void 0),t=t||"");var a,s=pt(),i=e?s._week.dow:0,o=[];if(null!=n)return On(t,(n+i)%7,r,"day");for(a=0;a<7;a++)o[a]=On(t,(a+i)%7,r,"day");return o}Hn.calendar=function(e,t,n){var r=this._calendar[e]||this._calendar.sameElse;return S(r)?r.call(t,n):r},Hn.longDateFormat=function(e){var t=this._longDateFormat[e],n=this._longDateFormat[e.toUpperCase()];return t||!n?t:(this._longDateFormat[e]=n.match(O).map((function(e){return"MMMM"===e||"MM"===e||"DD"===e||"dddd"===e?e.slice(1):e})).join(""),this._longDateFormat[e])},Hn.invalidDate=function(){return this._invalidDate},Hn.ordinal=function(e){return this._ordinal.replace("%d",e)},Hn.preparse=xn,Hn.postformat=xn,Hn.relativeTime=function(e,t,n,r){var a=this._relativeTime[n];return S(a)?a(e,t,n,r):a.replace(/%d/i,e)},Hn.pastFuture=function(e,t){var n=this._relativeTime[e>0?"future":"past"];return S(n)?n(t):n.replace(/%s/i,t)},Hn.set=function(e){var t,n;for(n in e)o(e,n)&&(S(t=e[n])?this[n]=t:this["_"+n]=t);this._config=e,this._dayOfMonthOrdinalParseLenient=new RegExp((this._dayOfMonthOrdinalParse.source||this._ordinalParse.source)+"|"+/\d{1,2}/.source)},Hn.eras=function(e,t){var n,r,s,i=this._eras||pt("en")._eras;for(n=0,r=i.length;n<r;++n)switch("string"==typeof i[n].since&&(s=a(i[n].since).startOf("day"),i[n].since=s.valueOf()),typeof i[n].until){case"undefined":i[n].until=1/0;break;case"string":s=a(i[n].until).startOf("day").valueOf(),i[n].until=s.valueOf()}return i},Hn.erasParse=function(e,t,n){var r,a,s,i,o,d=this.eras();for(e=e.toUpperCase(),r=0,a=d.length;r<a;++r)if(s=d[r].name.toUpperCase(),i=d[r].abbr.toUpperCase(),o=d[r].narrow.toUpperCase(),n)switch(t){case"N":case"NN":case"NNN":if(i===e)return d[r];break;case"NNNN":if(s===e)return d[r];break;case"NNNNN":if(o===e)return d[r]}else if([s,i,o].indexOf(e)>=0)return d[r]},Hn.erasConvertYear=function(e,t){var n=e.since<=e.until?1:-1;return void 0===t?a(e.since).year():a(e.since).year()+(t-e.offset)*n},Hn.erasAbbrRegex=function(e){return o(this,"_erasAbbrRegex")||Ln.call(this),e?this._erasAbbrRegex:this._erasRegex},Hn.erasNameRegex=function(e){return o(this,"_erasNameRegex")||Ln.call(this),e?this._erasNameRegex:this._erasRegex},Hn.erasNarrowRegex=function(e){return o(this,"_erasNarrowRegex")||Ln.call(this),e?this._erasNarrowRegex:this._erasRegex},Hn.months=function(e,t){return e?s(this._months)?this._months[e.month()]:this._months[(this._months.isFormat||Pe).test(t)?"format":"standalone"][e.month()]:s(this._months)?this._months:this._months.standalone},Hn.monthsShort=function(e,t){return e?s(this._monthsShort)?this._monthsShort[e.month()]:this._monthsShort[Pe.test(t)?"format":"standalone"][e.month()]:s(this._monthsShort)?this._monthsShort:this._monthsShort.standalone},Hn.monthsParse=function(e,t,n){var r,a,s;if(this._monthsParseExact)return We.call(this,e,t,n);for(this._monthsParse||(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[]),r=0;r<12;r++){if(a=h([2e3,r]),n&&!this._longMonthsParse[r]&&(this._longMonthsParse[r]=new RegExp("^"+this.months(a,"").replace(".","")+"$","i"),this._shortMonthsParse[r]=new RegExp("^"+this.monthsShort(a,"").replace(".","")+"$","i")),n||this._monthsParse[r]||(s="^"+this.months(a,"")+"|^"+this.monthsShort(a,""),this._monthsParse[r]=new RegExp(s.replace(".",""),"i")),n&&"MMMM"===t&&this._longMonthsParse[r].test(e))return r;if(n&&"MMM"===t&&this._shortMonthsParse[r].test(e))return r;if(!n&&this._monthsParse[r].test(e))return r}},Hn.monthsRegex=function(e){return this._monthsParseExact?(o(this,"_monthsRegex")||Re.call(this),e?this._monthsStrictRegex:this._monthsRegex):(o(this,"_monthsRegex")||(this._monthsRegex=Fe),this._monthsStrictRegex&&e?this._monthsStrictRegex:this._monthsRegex)},Hn.monthsShortRegex=function(e){return this._monthsParseExact?(o(this,"_monthsRegex")||Re.call(this),e?this._monthsShortStrictRegex:this._monthsShortRegex):(o(this,"_monthsShortRegex")||(this._monthsShortRegex=Ae),this._monthsShortStrictRegex&&e?this._monthsShortStrictRegex:this._monthsShortRegex)},Hn.week=function(e){return Ve(e,this._week.dow,this._week.doy).week},Hn.firstDayOfYear=function(){return this._week.doy},Hn.firstDayOfWeek=function(){return this._week.dow},Hn.weekdays=function(e,t){var n=s(this._weekdays)?this._weekdays:this._weekdays[e&&!0!==e&&this._weekdays.isFormat.test(t)?"format":"standalone"];return!0===e?$e(n,this._week.dow):e?n[e.day()]:n},Hn.weekdaysMin=function(e){return!0===e?$e(this._weekdaysMin,this._week.dow):e?this._weekdaysMin[e.day()]:this._weekdaysMin},Hn.weekdaysShort=function(e){return!0===e?$e(this._weekdaysShort,this._week.dow):e?this._weekdaysShort[e.day()]:this._weekdaysShort},Hn.weekdaysParse=function(e,t,n){var r,a,s;if(this._weekdaysParseExact)return nt.call(this,e,t,n);for(this._weekdaysParse||(this._weekdaysParse=[],this._minWeekdaysParse=[],this._shortWeekdaysParse=[],this._fullWeekdaysParse=[]),r=0;r<7;r++){if(a=h([2e3,1]).day(r),n&&!this._fullWeekdaysParse[r]&&(this._fullWeekdaysParse[r]=new RegExp("^"+this.weekdays(a,"").replace(".","\\.?")+"$","i"),this._shortWeekdaysParse[r]=new RegExp("^"+this.weekdaysShort(a,"").replace(".","\\.?")+"$","i"),this._minWeekdaysParse[r]=new RegExp("^"+this.weekdaysMin(a,"").replace(".","\\.?")+"$","i")),this._weekdaysParse[r]||(s="^"+this.weekdays(a,"")+"|^"+this.weekdaysShort(a,"")+"|^"+this.weekdaysMin(a,""),this._weekdaysParse[r]=new RegExp(s.replace(".",""),"i")),n&&"dddd"===t&&this._fullWeekdaysParse[r].test(e))return r;if(n&&"ddd"===t&&this._shortWeekdaysParse[r].test(e))return r;if(n&&"dd"===t&&this._minWeekdaysParse[r].test(e))return r;if(!n&&this._weekdaysParse[r].test(e))return r}},Hn.weekdaysRegex=function(e){return this._weekdaysParseExact?(o(this,"_weekdaysRegex")||rt.call(this),e?this._weekdaysStrictRegex:this._weekdaysRegex):(o(this,"_weekdaysRegex")||(this._weekdaysRegex=Xe),this._weekdaysStrictRegex&&e?this._weekdaysStrictRegex:this._weekdaysRegex)},Hn.weekdaysShortRegex=function(e){return this._weekdaysParseExact?(o(this,"_weekdaysRegex")||rt.call(this),e?this._weekdaysShortStrictRegex:this._weekdaysShortRegex):(o(this,"_weekdaysShortRegex")||(this._weekdaysShortRegex=et),this._weekdaysShortStrictRegex&&e?this._weekdaysShortStrictRegex:this._weekdaysShortRegex)},Hn.weekdaysMinRegex=function(e){return this._weekdaysParseExact?(o(this,"_weekdaysRegex")||rt.call(this),e?this._weekdaysMinStrictRegex:this._weekdaysMinRegex):(o(this,"_weekdaysMinRegex")||(this._weekdaysMinRegex=tt),this._weekdaysMinStrictRegex&&e?this._weekdaysMinStrictRegex:this._weekdaysMinRegex)},Hn.isPM=function(e){return"p"===(e+"").toLowerCase().charAt(0)},Hn.meridiem=function(e,t,n){return e>11?n?"pm":"PM":n?"am":"AM"},ft("en",{eras:[{since:"0001-01-01",until:1/0,offset:1,name:"Anno Domini",narrow:"AD",abbr:"AD"},{since:"0000-12-31",until:-1/0,offset:1,name:"Before Christ",narrow:"BC",abbr:"BC"}],dayOfMonthOrdinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(e){var t=e%10;return e+(1===V(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th")}}),a.lang=w("moment.lang is deprecated. Use moment.locale instead.",ft),a.langData=w("moment.langData is deprecated. Use moment.localeData instead.",pt);var An=Math.abs;function Fn(e,t,n,r){var a=Zt(t,n);return e._milliseconds+=r*a._milliseconds,e._days+=r*a._days,e._months+=r*a._months,e._bubble()}function Wn(e){return e<0?Math.floor(e):Math.ceil(e)}function Nn(e){return 4800*e/146097}function Cn(e){return 146097*e/4800}function Rn(e){return function(){return this.as(e)}}var In=Rn("ms"),zn=Rn("s"),Jn=Rn("m"),Un=Rn("h"),Gn=Rn("d"),qn=Rn("w"),Vn=Rn("M"),Bn=Rn("Q"),$n=Rn("y");function Kn(e){return function(){return this.isValid()?this._data[e]:NaN}}var Zn=Kn("milliseconds"),Qn=Kn("seconds"),Xn=Kn("minutes"),er=Kn("hours"),tr=Kn("days"),nr=Kn("months"),rr=Kn("years");var ar=Math.round,sr={ss:44,s:45,m:45,h:22,d:26,w:null,M:11};function ir(e,t,n,r,a){return a.relativeTime(t||1,!!n,e,r)}var or=Math.abs;function dr(e){return(e>0)-(e<0)||+e}function ur(){if(!this.isValid())return this.localeData().invalidDate();var e,t,n,r,a,s,i,o,d=or(this._milliseconds)/1e3,u=or(this._days),_=or(this._months),l=this.asSeconds();return l?(e=q(d/60),t=q(e/60),d%=60,e%=60,n=q(_/12),_%=12,r=d?d.toFixed(3).replace(/\.?0+$/,""):"",a=l<0?"-":"",s=dr(this._months)!==dr(l)?"-":"",i=dr(this._days)!==dr(l)?"-":"",o=dr(this._milliseconds)!==dr(l)?"-":"",a+"P"+(n?s+n+"Y":"")+(_?s+_+"M":"")+(u?i+u+"D":"")+(t||e||d?"T":"")+(t?o+t+"H":"")+(e?o+e+"M":"")+(d?o+r+"S":"")):"P0D"}var _r=Rt.prototype;return _r.isValid=function(){return this._isValid},_r.abs=function(){var e=this._data;return this._milliseconds=An(this._milliseconds),this._days=An(this._days),this._months=An(this._months),e.milliseconds=An(e.milliseconds),e.seconds=An(e.seconds),e.minutes=An(e.minutes),e.hours=An(e.hours),e.months=An(e.months),e.years=An(e.years),this},_r.add=function(e,t){return Fn(this,e,t,1)},_r.subtract=function(e,t){return Fn(this,e,t,-1)},_r.as=function(e){if(!this.isValid())return NaN;var t,n,r=this._milliseconds;if("month"===(e=I(e))||"quarter"===e||"year"===e)switch(t=this._days+r/864e5,n=this._months+Nn(t),e){case"month":return n;case"quarter":return n/3;case"year":return n/12}else switch(t=this._days+Math.round(Cn(this._months)),e){case"week":return t/7+r/6048e5;case"day":return t+r/864e5;case"hour":return 24*t+r/36e5;case"minute":return 1440*t+r/6e4;case"second":return 86400*t+r/1e3;case"millisecond":return Math.floor(864e5*t)+r;default:throw new Error("Unknown unit "+e)}},_r.asMilliseconds=In,_r.asSeconds=zn,_r.asMinutes=Jn,_r.asHours=Un,_r.asDays=Gn,_r.asWeeks=qn,_r.asMonths=Vn,_r.asQuarters=Bn,_r.asYears=$n,_r.valueOf=function(){return this.isValid()?this._milliseconds+864e5*this._days+this._months%12*2592e6+31536e6*V(this._months/12):NaN},_r._bubble=function(){var e,t,n,r,a,s=this._milliseconds,i=this._days,o=this._months,d=this._data;return s>=0&&i>=0&&o>=0||s<=0&&i<=0&&o<=0||(s+=864e5*Wn(Cn(o)+i),i=0,o=0),d.milliseconds=s%1e3,e=q(s/1e3),d.seconds=e%60,t=q(e/60),d.minutes=t%60,n=q(t/60),d.hours=n%24,i+=q(n/24),o+=a=q(Nn(i)),i-=Wn(Cn(a)),r=q(o/12),o%=12,d.days=i,d.months=o,d.years=r,this},_r.clone=function(){return Zt(this)},_r.get=function(e){return e=I(e),this.isValid()?this[e+"s"]():NaN},_r.milliseconds=Zn,_r.seconds=Qn,_r.minutes=Xn,_r.hours=er,_r.days=tr,_r.weeks=function(){return q(this.days()/7)},_r.months=nr,_r.years=rr,_r.humanize=function(e,t){if(!this.isValid())return this.localeData().invalidDate();var n,r,a=!1,s=sr;return"object"==typeof e&&(t=e,e=!1),"boolean"==typeof e&&(a=e),"object"==typeof t&&(s=Object.assign({},sr,t),null!=t.s&&null==t.ss&&(s.ss=t.s-1)),r=function(e,t,n,r){var a=Zt(e).abs(),s=ar(a.as("s")),i=ar(a.as("m")),o=ar(a.as("h")),d=ar(a.as("d")),u=ar(a.as("M")),_=ar(a.as("w")),l=ar(a.as("y")),c=s<=n.ss&&["s",s]||s<n.s&&["ss",s]||i<=1&&["m"]||i<n.m&&["mm",i]||o<=1&&["h"]||o<n.h&&["hh",o]||d<=1&&["d"]||d<n.d&&["dd",d];return null!=n.w&&(c=c||_<=1&&["w"]||_<n.w&&["ww",_]),(c=c||u<=1&&["M"]||u<n.M&&["MM",u]||l<=1&&["y"]||["yy",l])[2]=t,c[3]=+e>0,c[4]=r,ir.apply(null,c)}(this,!a,s,n=this.localeData()),a&&(r=n.pastFuture(+this,r)),n.postformat(r)},_r.toISOString=ur,_r.toString=ur,_r.toJSON=ur,_r.locale=dn,_r.localeData=_n,_r.toIsoString=w("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",ur),_r.lang=un,F("X",0,0,"unix"),F("x",0,0,"valueOf"),he("x",_e),he("X",/[+-]?\d+(\.\d{1,3})?/),Me("X",(function(e,t,n){n._d=new Date(1e3*parseFloat(e))})),Me("x",(function(e,t,n){n._d=new Date(V(e))})),a.version="2.29.4",t=At,a.fn=jn,a.min=function(){return Nt("isBefore",[].slice.call(arguments,0))},a.max=function(){return Nt("isAfter",[].slice.call(arguments,0))},a.now=function(){return Date.now?Date.now():+new Date},a.utc=h,a.unix=function(e){return At(1e3*e)},a.months=function(e,t){return En(e,t,"months")},a.isDate=l,a.locale=ft,a.invalid=p,a.duration=Zt,a.isMoment=v,a.weekdays=function(e,t,n){return Pn(e,t,n,"weekdays")},a.parseZone=function(){return At.apply(null,arguments).parseZone()},a.localeData=pt,a.isDuration=It,a.monthsShort=function(e,t){return En(e,t,"monthsShort")},a.weekdaysMin=function(e,t,n){return Pn(e,t,n,"weekdaysMin")},a.defineLocale=yt,a.updateLocale=function(e,t){if(null!=t){var n,r,a=ut;null!=_t[e]&&null!=_t[e].parentLocale?_t[e].set(j(_t[e]._config,t)):(null!=(r=ht(e))&&(a=r._config),t=j(a,t),null==r&&(t.abbr=e),(n=new x(t)).parentLocale=_t[e],_t[e]=n),ft(e)}else null!=_t[e]&&(null!=_t[e].parentLocale?(_t[e]=_t[e].parentLocale,e===ft()&&ft(e)):null!=_t[e]&&delete _t[e]);return _t[e]},a.locales=function(){return b(_t)},a.weekdaysShort=function(e,t,n){return Pn(e,t,n,"weekdaysShort")},a.normalizeUnits=I,a.relativeTimeRounding=function(e){return void 0===e?ar:"function"==typeof e&&(ar=e,!0)},a.relativeTimeThreshold=function(e,t){return void 0!==sr[e]&&(void 0===t?sr[e]:(sr[e]=t,"s"===e&&(sr.ss=t-1),!0))},a.calendarFormat=function(e,t){var n=e.diff(t,"days",!0);return n<-6?"sameElse":n<-1?"lastWeek":n<0?"lastDay":n<1?"sameDay":n<2?"nextDay":n<7?"nextWeek":"sameElse"},a.prototype=jn,a.HTML5_FMT={DATETIME_LOCAL:"YYYY-MM-DDTHH:mm",DATETIME_LOCAL_SECONDS:"YYYY-MM-DDTHH:mm:ss",DATETIME_LOCAL_MS:"YYYY-MM-DDTHH:mm:ss.SSS",DATE:"YYYY-MM-DD",TIME:"HH:mm",TIME_SECONDS:"HH:mm:ss",TIME_MS:"HH:mm:ss.SSS",WEEK:"GGGG-[W]WW",MONTH:"YYYY-MM"},a}()},18987:(e,t,n)=>{"use strict";var r;if(!Object.keys){var a=Object.prototype.hasOwnProperty,s=Object.prototype.toString,i=n(21414),o=Object.prototype.propertyIsEnumerable,d=!o.call({toString:null},"toString"),u=o.call((function(){}),"prototype"),_=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],l=function(e){var t=e.constructor;return t&&t.prototype===e},c={$applicationCache:!0,$console:!0,$external:!0,$frame:!0,$frameElement:!0,$frames:!0,$innerHeight:!0,$innerWidth:!0,$onmozfullscreenchange:!0,$onmozfullscreenerror:!0,$outerHeight:!0,$outerWidth:!0,$pageXOffset:!0,$pageYOffset:!0,$parent:!0,$scrollLeft:!0,$scrollTop:!0,$scrollX:!0,$scrollY:!0,$self:!0,$webkitIndexedDB:!0,$webkitStorageInfo:!0,$window:!0},m=function(){if("undefined"==typeof window)return!1;for(var e in window)try{if(!c["$"+e]&&a.call(window,e)&&null!==window[e]&&"object"==typeof window[e])try{l(window[e])}catch(e){return!0}}catch(e){return!0}return!1}();r=function(e){var t=null!==e&&"object"==typeof e,n="[object Function]"===s.call(e),r=i(e),o=t&&"[object String]"===s.call(e),c=[];if(!t&&!n&&!r)throw new TypeError("Object.keys called on a non-object");var h=u&&n;if(o&&e.length>0&&!a.call(e,0))for(var f=0;f<e.length;++f)c.push(String(f));if(r&&e.length>0)for(var y=0;y<e.length;++y)c.push(String(y));else for(var p in e)h&&"prototype"===p||!a.call(e,p)||c.push(String(p));if(d)for(var M=function(e){if("undefined"==typeof window||!m)return l(e);try{return l(e)}catch(e){return!1}}(e),L=0;L<_.length;++L)M&&"constructor"===_[L]||!a.call(e,_[L])||c.push(_[L]);return c}}e.exports=r},82215:(e,t,n)=>{"use strict";var r=Array.prototype.slice,a=n(21414),s=Object.keys,i=s?function(e){return s(e)}:n(18987),o=Object.keys;i.shim=function(){if(Object.keys){var e=function(){var e=Object.keys(arguments);return e&&e.length===arguments.length}(1,2);e||(Object.keys=function(e){return a(e)?o(r.call(e)):o(e)})}else Object.keys=i;return Object.keys||i},e.exports=i},21414:e=>{"use strict";var t=Object.prototype.toString;e.exports=function(e){var n=t.call(e),r="[object Arguments]"===n;return r||(r="[object Array]"!==n&&null!==e&&"object"==typeof e&&"number"==typeof e.length&&e.length>=0&&"[object Function]"===t.call(e.callee)),r}},84319:function(e,t,n){!function(t,r){"use strict";var a;try{a=n(30381)}catch(e){}e.exports=function(e){var t="function"==typeof e,n=!!window.addEventListener,r=window.document,a=window.setTimeout,s=function(e,t,r,a){n?e.addEventListener(t,r,!!a):e.attachEvent("on"+t,r)},i=function(e,t,r,a){n?e.removeEventListener(t,r,!!a):e.detachEvent("on"+t,r)},o=function(e,t){return-1!==(" "+e.className+" ").indexOf(" "+t+" ")},d=function(e,t){o(e,t)||(e.className=""===e.className?t:e.className+" "+t)},u=function(e,t){var n;e.className=(n=(" "+e.className+" ").replace(" "+t+" "," ")).trim?n.trim():n.replace(/^\s+|\s+$/g,"")},_=function(e){return/Array/.test(Object.prototype.toString.call(e))},l=function(e){return/Date/.test(Object.prototype.toString.call(e))&&!isNaN(e.getTime())},c=function(e){var t=e.getDay();return 0===t||6===t},m=function(e){return e%4==0&&e%100!=0||e%400==0},h=function(e,t){return[31,m(e)?29:28,31,30,31,30,31,31,30,31,30,31][t]},f=function(e){l(e)&&e.setHours(0,0,0,0)},y=function(e,t){return e.getTime()===t.getTime()},p=function(e,t,n){var r,a;for(r in t)(a=void 0!==e[r])&&"object"==typeof t[r]&&null!==t[r]&&void 0===t[r].nodeName?l(t[r])?n&&(e[r]=new Date(t[r].getTime())):_(t[r])?n&&(e[r]=t[r].slice(0)):e[r]=p({},t[r],n):!n&&a||(e[r]=t[r]);return e},M=function(e,t,n){var a;r.createEvent?((a=r.createEvent("HTMLEvents")).initEvent(t,!0,!1),a=p(a,n),e.dispatchEvent(a)):r.createEventObject&&(a=r.createEventObject(),a=p(a,n),e.fireEvent("on"+t,a))},L=function(e){return e.month<0&&(e.year-=Math.ceil(Math.abs(e.month)/12),e.month+=12),e.month>11&&(e.year+=Math.floor(Math.abs(e.month)/12),e.month-=12),e},Y={field:null,bound:void 0,ariaLabel:"Use the arrow keys to pick a date",position:"bottom left",reposition:!0,format:"YYYY-MM-DD",toString:null,parse:null,defaultDate:null,setDefaultDate:!1,firstDay:0,firstWeekOfYearMinDays:4,formatStrict:!1,minDate:null,maxDate:null,yearRange:10,showWeekNumber:!1,pickWholeWeek:!1,minYear:0,maxYear:9999,minMonth:void 0,maxMonth:void 0,startRange:null,endRange:null,isRTL:!1,yearSuffix:"",showMonthAfterYear:!1,showDaysInNextAndPreviousMonths:!1,enableSelectionDaysInNextAndPreviousMonths:!1,numberOfMonths:1,mainCalendar:"left",container:void 0,blurFieldOnSelect:!0,i18n:{previousMonth:"Previous Month",nextMonth:"Next Month",months:["January","February","March","April","May","June","July","August","September","October","November","December"],weekdays:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],weekdaysShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]},theme:null,events:[],onSelect:null,onOpen:null,onClose:null,onDraw:null,keyboardInput:!0},g=function(e,t,n){for(t+=e.firstDay;t>=7;)t-=7;return n?e.i18n.weekdaysShort[t]:e.i18n.weekdays[t]},v=function(e){var t=[],n="false";if(e.isEmpty){if(!e.showDaysInNextAndPreviousMonths)return'<td class="is-empty"></td>';t.push("is-outside-current-month"),e.enableSelectionDaysInNextAndPreviousMonths||t.push("is-selection-disabled")}return e.isDisabled&&t.push("is-disabled"),e.isToday&&t.push("is-today"),e.isSelected&&(t.push("is-selected"),n="true"),e.hasEvent&&t.push("has-event"),e.isInRange&&t.push("is-inrange"),e.isStartRange&&t.push("is-startrange"),e.isEndRange&&t.push("is-endrange"),'<td data-day="'+e.day+'" class="'+t.join(" ")+'" aria-selected="'+n+'"><button class="pika-button pika-day" type="button" data-pika-year="'+e.year+'" data-pika-month="'+e.month+'" data-pika-day="'+e.day+'">'+e.day+"</button></td>"},k=function(n,r,a,s){var i=new Date(a,r,n);return'<td class="pika-week">'+(t?e(i).isoWeek():function(e,t){e.setHours(0,0,0,0);var n=e.getDate(),r=e.getDay(),a=t,s=a-1,i=function(e){return(e+7-1)%7};e.setDate(n+s-i(r));var o=new Date(e.getFullYear(),0,a),d=(e.getTime()-o.getTime())/864e5;return 1+Math.round((d-s+i(o.getDay()))/7)}(i,s))+"</td>"},w=function(e,t,n,r){return'<tr class="pika-row'+(n?" pick-whole-week":"")+(r?" is-selected":"")+'">'+(t?e.reverse():e).join("")+"</tr>"},b=function(e,t,n,r,a,s){var i,o,d,u,l,c=e._o,m=n===c.minYear,h=n===c.maxYear,f='<div id="'+s+'" class="pika-title" role="heading" aria-live="assertive">',y=!0,p=!0;for(d=[],i=0;i<12;i++)d.push('<option value="'+(n===a?i-t:12+i-t)+'"'+(i===r?' selected="selected"':"")+(m&&i<c.minMonth||h&&i>c.maxMonth?' disabled="disabled"':"")+">"+c.i18n.months[i]+"</option>");for(u='<div class="pika-label">'+c.i18n.months[r]+'<select class="pika-select pika-select-month" tabindex="-1">'+d.join("")+"</select></div>",_(c.yearRange)?(i=c.yearRange[0],o=c.yearRange[1]+1):(i=n-c.yearRange,o=1+n+c.yearRange),d=[];i<o&&i<=c.maxYear;i++)i>=c.minYear&&d.push('<option value="'+i+'"'+(i===n?' selected="selected"':"")+">"+i+"</option>");return l='<div class="pika-label">'+n+c.yearSuffix+'<select class="pika-select pika-select-year" tabindex="-1">'+d.join("")+"</select></div>",c.showMonthAfterYear?f+=l+u:f+=u+l,m&&(0===r||c.minMonth>=r)&&(y=!1),h&&(11===r||c.maxMonth<=r)&&(p=!1),0===t&&(f+='<button class="pika-prev'+(y?"":" is-disabled")+'" type="button">'+c.i18n.previousMonth+"</button>"),t===e._o.numberOfMonths-1&&(f+='<button class="pika-next'+(p?"":" is-disabled")+'" type="button">'+c.i18n.nextMonth+"</button>"),f+"</div>"},D=function(e,t,n){return'<table cellpadding="0" cellspacing="0" class="pika-table" role="grid" aria-labelledby="'+n+'">'+function(e){var t,n=[];for(e.showWeekNumber&&n.push("<th></th>"),t=0;t<7;t++)n.push('<th scope="col"><abbr title="'+g(e,t)+'">'+g(e,t,!0)+"</abbr></th>");return"<thead><tr>"+(e.isRTL?n.reverse():n).join("")+"</tr></thead>"}(e)+("<tbody>"+t.join("")+"</tbody></table>")},T=function(i){var d=this,u=d.config(i);d._onMouseDown=function(e){if(d._v){var t=(e=e||window.event).target||e.srcElement;if(t)if(o(t,"is-disabled")||(!o(t,"pika-button")||o(t,"is-empty")||o(t.parentNode,"is-disabled")?o(t,"pika-prev")?d.prevMonth():o(t,"pika-next")&&d.nextMonth():(d.setDate(new Date(t.getAttribute("data-pika-year"),t.getAttribute("data-pika-month"),t.getAttribute("data-pika-day"))),u.bound&&a((function(){d.hide(),u.blurFieldOnSelect&&u.field&&u.field.blur()}),100))),o(t,"pika-select"))d._c=!0;else{if(!e.preventDefault)return e.returnValue=!1,!1;e.preventDefault()}}},d._onChange=function(e){var t=(e=e||window.event).target||e.srcElement;t&&(o(t,"pika-select-month")?d.gotoMonth(t.value):o(t,"pika-select-year")&&d.gotoYear(t.value))},d._onKeyChange=function(e){if(e=e||window.event,d.isVisible())switch(e.keyCode){case 13:case 27:u.field&&u.field.blur();break;case 37:d.adjustDate("subtract",1);break;case 38:d.adjustDate("subtract",7);break;case 39:d.adjustDate("add",1);break;case 40:d.adjustDate("add",7);break;case 8:case 46:d.setDate(null)}},d._parseFieldValue=function(){if(u.parse)return u.parse(u.field.value,u.format);if(t){var n=e(u.field.value,u.format,u.formatStrict);return n&&n.isValid()?n.toDate():null}return new Date(Date.parse(u.field.value))},d._onInputChange=function(e){var t;e.firedBy!==d&&(t=d._parseFieldValue(),l(t)&&d.setDate(t),d._v||d.show())},d._onInputFocus=function(){d.show()},d._onInputClick=function(){d.show()},d._onInputBlur=function(){var e=r.activeElement;do{if(o(e,"pika-single"))return}while(e=e.parentNode);d._c||(d._b=a((function(){d.hide()}),50)),d._c=!1},d._onClick=function(e){var t=(e=e||window.event).target||e.srcElement,r=t;if(t){!n&&o(t,"pika-select")&&(t.onchange||(t.setAttribute("onchange","return;"),s(t,"change",d._onChange)));do{if(o(r,"pika-single")||r===u.trigger)return}while(r=r.parentNode);d._v&&t!==u.trigger&&r!==u.trigger&&d.hide()}},d.el=r.createElement("div"),d.el.className="pika-single"+(u.isRTL?" is-rtl":"")+(u.theme?" "+u.theme:""),s(d.el,"mousedown",d._onMouseDown,!0),s(d.el,"touchend",d._onMouseDown,!0),s(d.el,"change",d._onChange),u.keyboardInput&&s(r,"keydown",d._onKeyChange),u.field&&(u.container?u.container.appendChild(d.el):u.bound?r.body.appendChild(d.el):u.field.parentNode.insertBefore(d.el,u.field.nextSibling),s(u.field,"change",d._onInputChange),u.defaultDate||(u.defaultDate=d._parseFieldValue(),u.setDefaultDate=!0));var _=u.defaultDate;l(_)?u.setDefaultDate?d.setDate(_,!0):d.gotoDate(_):d.gotoDate(new Date),u.bound?(this.hide(),d.el.className+=" is-bound",s(u.trigger,"click",d._onInputClick),s(u.trigger,"focus",d._onInputFocus),s(u.trigger,"blur",d._onInputBlur)):this.show()};return T.prototype={config:function(e){this._o||(this._o=p({},Y,!0));var t=p(this._o,e,!0);t.isRTL=!!t.isRTL,t.field=t.field&&t.field.nodeName?t.field:null,t.theme="string"==typeof t.theme&&t.theme?t.theme:null,t.bound=!!(void 0!==t.bound?t.field&&t.bound:t.field),t.trigger=t.trigger&&t.trigger.nodeName?t.trigger:t.field,t.disableWeekends=!!t.disableWeekends,t.disableDayFn="function"==typeof t.disableDayFn?t.disableDayFn:null;var n=parseInt(t.numberOfMonths,10)||1;if(t.numberOfMonths=n>4?4:n,l(t.minDate)||(t.minDate=!1),l(t.maxDate)||(t.maxDate=!1),t.minDate&&t.maxDate&&t.maxDate<t.minDate&&(t.maxDate=t.minDate=!1),t.minDate&&this.setMinDate(t.minDate),t.maxDate&&this.setMaxDate(t.maxDate),_(t.yearRange)){var r=(new Date).getFullYear()-10;t.yearRange[0]=parseInt(t.yearRange[0],10)||r,t.yearRange[1]=parseInt(t.yearRange[1],10)||r}else t.yearRange=Math.abs(parseInt(t.yearRange,10))||Y.yearRange,t.yearRange>100&&(t.yearRange=100);return t},toString:function(n){return n=n||this._o.format,l(this._d)?this._o.toString?this._o.toString(this._d,n):t?e(this._d).format(n):this._d.toDateString():""},getMoment:function(){return t?e(this._d):null},setMoment:function(n,r){t&&e.isMoment(n)&&this.setDate(n.toDate(),r)},getDate:function(){return l(this._d)?new Date(this._d.getTime()):null},setDate:function(e,t){if(!e)return this._d=null,this._o.field&&(this._o.field.value="",M(this._o.field,"change",{firedBy:this})),this.draw();if("string"==typeof e&&(e=new Date(Date.parse(e))),l(e)){var n=this._o.minDate,r=this._o.maxDate;l(n)&&e<n?e=n:l(r)&&e>r&&(e=r),this._d=new Date(e.getTime()),f(this._d),this.gotoDate(this._d),this._o.field&&(this._o.field.value=this.toString(),M(this._o.field,"change",{firedBy:this})),t||"function"!=typeof this._o.onSelect||this._o.onSelect.call(this,this.getDate())}},clear:function(){this.setDate(null)},gotoDate:function(e){var t=!0;if(l(e)){if(this.calendars){var n=new Date(this.calendars[0].year,this.calendars[0].month,1),r=new Date(this.calendars[this.calendars.length-1].year,this.calendars[this.calendars.length-1].month,1),a=e.getTime();r.setMonth(r.getMonth()+1),r.setDate(r.getDate()-1),t=a<n.getTime()||r.getTime()<a}t&&(this.calendars=[{month:e.getMonth(),year:e.getFullYear()}],"right"===this._o.mainCalendar&&(this.calendars[0].month+=1-this._o.numberOfMonths)),this.adjustCalendars()}},adjustDate:function(e,t){var n,r=this.getDate()||new Date,a=24*parseInt(t)*60*60*1e3;"add"===e?n=new Date(r.valueOf()+a):"subtract"===e&&(n=new Date(r.valueOf()-a)),this.setDate(n)},adjustCalendars:function(){this.calendars[0]=L(this.calendars[0]);for(var e=1;e<this._o.numberOfMonths;e++)this.calendars[e]=L({month:this.calendars[0].month+e,year:this.calendars[0].year});this.draw()},gotoToday:function(){this.gotoDate(new Date)},gotoMonth:function(e){isNaN(e)||(this.calendars[0].month=parseInt(e,10),this.adjustCalendars())},nextMonth:function(){this.calendars[0].month++,this.adjustCalendars()},prevMonth:function(){this.calendars[0].month--,this.adjustCalendars()},gotoYear:function(e){isNaN(e)||(this.calendars[0].year=parseInt(e,10),this.adjustCalendars())},setMinDate:function(e){e instanceof Date?(f(e),this._o.minDate=e,this._o.minYear=e.getFullYear(),this._o.minMonth=e.getMonth()):(this._o.minDate=Y.minDate,this._o.minYear=Y.minYear,this._o.minMonth=Y.minMonth,this._o.startRange=Y.startRange),this.draw()},setMaxDate:function(e){e instanceof Date?(f(e),this._o.maxDate=e,this._o.maxYear=e.getFullYear(),this._o.maxMonth=e.getMonth()):(this._o.maxDate=Y.maxDate,this._o.maxYear=Y.maxYear,this._o.maxMonth=Y.maxMonth,this._o.endRange=Y.endRange),this.draw()},setStartRange:function(e){this._o.startRange=e},setEndRange:function(e){this._o.endRange=e},draw:function(e){if(this._v||e){var t,n=this._o,r=n.minYear,s=n.maxYear,i=n.minMonth,o=n.maxMonth,d="";this._y<=r&&(this._y=r,!isNaN(i)&&this._m<i&&(this._m=i)),this._y>=s&&(this._y=s,!isNaN(o)&&this._m>o&&(this._m=o));for(var u=0;u<n.numberOfMonths;u++)t="pika-title-"+Math.random().toString(36).replace(/[^a-z]+/g,"").substr(0,2),d+='<div class="pika-lendar">'+b(this,u,this.calendars[u].year,this.calendars[u].month,this.calendars[0].year,t)+this.render(this.calendars[u].year,this.calendars[u].month,t)+"</div>";this.el.innerHTML=d,n.bound&&"hidden"!==n.field.type&&a((function(){n.trigger.focus()}),1),"function"==typeof this._o.onDraw&&this._o.onDraw(this),n.bound&&n.field.setAttribute("aria-label",n.ariaLabel)}},adjustPosition:function(){var e,t,n,a,s,i,o,_,l,c,m,h;if(!this._o.container){if(this.el.style.position="absolute",t=e=this._o.trigger,n=this.el.offsetWidth,a=this.el.offsetHeight,s=window.innerWidth||r.documentElement.clientWidth,i=window.innerHeight||r.documentElement.clientHeight,o=window.pageYOffset||r.body.scrollTop||r.documentElement.scrollTop,m=!0,h=!0,"function"==typeof e.getBoundingClientRect)_=(c=e.getBoundingClientRect()).left+window.pageXOffset,l=c.bottom+window.pageYOffset;else for(_=t.offsetLeft,l=t.offsetTop+t.offsetHeight;t=t.offsetParent;)_+=t.offsetLeft,l+=t.offsetTop;(this._o.reposition&&_+n>s||this._o.position.indexOf("right")>-1&&_-n+e.offsetWidth>0)&&(_=_-n+e.offsetWidth,m=!1),(this._o.reposition&&l+a>i+o||this._o.position.indexOf("top")>-1&&l-a-e.offsetHeight>0)&&(l=l-a-e.offsetHeight,h=!1),this.el.style.left=_+"px",this.el.style.top=l+"px",d(this.el,m?"left-aligned":"right-aligned"),d(this.el,h?"bottom-aligned":"top-aligned"),u(this.el,m?"right-aligned":"left-aligned"),u(this.el,h?"top-aligned":"bottom-aligned")}},render:function(e,t,n){var r=this._o,a=new Date,s=h(e,t),i=new Date(e,t,1).getDay(),o=[],d=[];f(a),r.firstDay>0&&(i-=r.firstDay)<0&&(i+=7);for(var u=0===t?11:t-1,_=11===t?0:t+1,m=0===t?e-1:e,p=11===t?e+1:e,M=h(m,u),L=s+i,Y=L;Y>7;)Y-=7;L+=7-Y;for(var g=!1,b=0,T=0;b<L;b++){var S=new Date(e,t,b-i+1),j=!!l(this._d)&&y(S,this._d),x=y(S,a),H=-1!==r.events.indexOf(S.toDateString()),O=b<i||b>=s+i,E=b-i+1,P=t,A=e,F=r.startRange&&y(r.startRange,S),W=r.endRange&&y(r.endRange,S),N=r.startRange&&r.endRange&&r.startRange<S&&S<r.endRange;O&&(b<i?(E=M+E,P=u,A=m):(E-=s,P=_,A=p));var C={day:E,month:P,year:A,hasEvent:H,isSelected:j,isToday:x,isDisabled:r.minDate&&S<r.minDate||r.maxDate&&S>r.maxDate||r.disableWeekends&&c(S)||r.disableDayFn&&r.disableDayFn(S),isEmpty:O,isStartRange:F,isEndRange:W,isInRange:N,showDaysInNextAndPreviousMonths:r.showDaysInNextAndPreviousMonths,enableSelectionDaysInNextAndPreviousMonths:r.enableSelectionDaysInNextAndPreviousMonths};r.pickWholeWeek&&j&&(g=!0),d.push(v(C)),7==++T&&(r.showWeekNumber&&d.unshift(k(b-i,t,e,r.firstWeekOfYearMinDays)),o.push(w(d,r.isRTL,r.pickWholeWeek,g)),d=[],T=0,g=!1)}return D(r,o,n)},isVisible:function(){return this._v},show:function(){this.isVisible()||(this._v=!0,this.draw(),u(this.el,"is-hidden"),this._o.bound&&(s(r,"click",this._onClick),this.adjustPosition()),"function"==typeof this._o.onOpen&&this._o.onOpen.call(this))},hide:function(){var e=this._v;!1!==e&&(this._o.bound&&i(r,"click",this._onClick),this._o.container||(this.el.style.position="static",this.el.style.left="auto",this.el.style.top="auto"),d(this.el,"is-hidden"),this._v=!1,void 0!==e&&"function"==typeof this._o.onClose&&this._o.onClose.call(this))},destroy:function(){var e=this._o;this.hide(),i(this.el,"mousedown",this._onMouseDown,!0),i(this.el,"touchend",this._onMouseDown,!0),i(this.el,"change",this._onChange),e.keyboardInput&&i(r,"keydown",this._onKeyChange),e.field&&(i(e.field,"change",this._onInputChange),e.bound&&(i(e.trigger,"click",this._onInputClick),i(e.trigger,"focus",this._onInputFocus),i(e.trigger,"blur",this._onInputBlur))),this.el.parentNode&&this.el.parentNode.removeChild(this.el)}},T}(a)}()},35666:e=>{var t=function(e){"use strict";var t,n=Object.prototype,r=n.hasOwnProperty,a=Object.defineProperty||function(e,t,n){e[t]=n.value},s="function"==typeof Symbol?Symbol:{},i=s.iterator||"@@iterator",o=s.asyncIterator||"@@asyncIterator",d=s.toStringTag||"@@toStringTag";function u(e,t,n){return Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{u({},"")}catch(e){u=function(e,t,n){return e[t]=n}}function _(e,t,n,r){var s=t&&t.prototype instanceof p?t:p,i=Object.create(s.prototype),o=new x(r||[]);return a(i,"_invoke",{value:D(e,n,o)}),i}function l(e,t,n){try{return{type:"normal",arg:e.call(t,n)}}catch(e){return{type:"throw",arg:e}}}e.wrap=_;var c="suspendedStart",m="suspendedYield",h="executing",f="completed",y={};function p(){}function M(){}function L(){}var Y={};u(Y,i,(function(){return this}));var g=Object.getPrototypeOf,v=g&&g(g(H([])));v&&v!==n&&r.call(v,i)&&(Y=v);var k=L.prototype=p.prototype=Object.create(Y);function w(e){["next","throw","return"].forEach((function(t){u(e,t,(function(e){return this._invoke(t,e)}))}))}function b(e,t){function n(a,s,i,o){var d=l(e[a],e,s);if("throw"!==d.type){var u=d.arg,_=u.value;return _&&"object"==typeof _&&r.call(_,"__await")?t.resolve(_.__await).then((function(e){n("next",e,i,o)}),(function(e){n("throw",e,i,o)})):t.resolve(_).then((function(e){u.value=e,i(u)}),(function(e){return n("throw",e,i,o)}))}o(d.arg)}var s;a(this,"_invoke",{value:function(e,r){function a(){return new t((function(t,a){n(e,r,t,a)}))}return s=s?s.then(a,a):a()}})}function D(e,t,n){var r=c;return function(a,s){if(r===h)throw new Error("Generator is already running");if(r===f){if("throw"===a)throw s;return O()}for(n.method=a,n.arg=s;;){var i=n.delegate;if(i){var o=T(i,n);if(o){if(o===y)continue;return o}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(r===c)throw r=f,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r=h;var d=l(e,t,n);if("normal"===d.type){if(r=n.done?f:m,d.arg===y)continue;return{value:d.arg,done:n.done}}"throw"===d.type&&(r=f,n.method="throw",n.arg=d.arg)}}}function T(e,n){var r=n.method,a=e.iterator[r];if(a===t)return n.delegate=null,"throw"===r&&e.iterator.return&&(n.method="return",n.arg=t,T(e,n),"throw"===n.method)||"return"!==r&&(n.method="throw",n.arg=new TypeError("The iterator does not provide a '"+r+"' method")),y;var s=l(a,e.iterator,n.arg);if("throw"===s.type)return n.method="throw",n.arg=s.arg,n.delegate=null,y;var i=s.arg;return i?i.done?(n[e.resultName]=i.value,n.next=e.nextLoc,"return"!==n.method&&(n.method="next",n.arg=t),n.delegate=null,y):i:(n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,y)}function S(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function j(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function x(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(S,this),this.reset(!0)}function H(e){if(e){var n=e[i];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var a=-1,s=function n(){for(;++a<e.length;)if(r.call(e,a))return n.value=e[a],n.done=!1,n;return n.value=t,n.done=!0,n};return s.next=s}}return{next:O}}function O(){return{value:t,done:!0}}return M.prototype=L,a(k,"constructor",{value:L,configurable:!0}),a(L,"constructor",{value:M,configurable:!0}),M.displayName=u(L,d,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===M||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,L):(e.__proto__=L,u(e,d,"GeneratorFunction")),e.prototype=Object.create(k),e},e.awrap=function(e){return{__await:e}},w(b.prototype),u(b.prototype,o,(function(){return this})),e.AsyncIterator=b,e.async=function(t,n,r,a,s){void 0===s&&(s=Promise);var i=new b(_(t,n,r,a),s);return e.isGeneratorFunction(n)?i:i.next().then((function(e){return e.done?e.value:i.next()}))},w(k),u(k,d,"Generator"),u(k,i,(function(){return this})),u(k,"toString",(function(){return"[object Generator]"})),e.keys=function(e){var t=Object(e),n=[];for(var r in t)n.push(r);return n.reverse(),function e(){for(;n.length;){var r=n.pop();if(r in t)return e.value=r,e.done=!1,e}return e.done=!0,e}},e.values=H,x.prototype={constructor:x,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(j),!e)for(var n in this)"t"===n.charAt(0)&&r.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=t)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var n=this;function a(r,a){return o.type="throw",o.arg=e,n.next=r,a&&(n.method="next",n.arg=t),!!a}for(var s=this.tryEntries.length-1;s>=0;--s){var i=this.tryEntries[s],o=i.completion;if("root"===i.tryLoc)return a("end");if(i.tryLoc<=this.prev){var d=r.call(i,"catchLoc"),u=r.call(i,"finallyLoc");if(d&&u){if(this.prev<i.catchLoc)return a(i.catchLoc,!0);if(this.prev<i.finallyLoc)return a(i.finallyLoc)}else if(d){if(this.prev<i.catchLoc)return a(i.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return a(i.finallyLoc)}}}},abrupt:function(e,t){for(var n=this.tryEntries.length-1;n>=0;--n){var a=this.tryEntries[n];if(a.tryLoc<=this.prev&&r.call(a,"finallyLoc")&&this.prev<a.finallyLoc){var s=a;break}}s&&("break"===e||"continue"===e)&&s.tryLoc<=t&&t<=s.finallyLoc&&(s=null);var i=s?s.completion:{};return i.type=e,i.arg=t,s?(this.method="next",this.next=s.finallyLoc,y):this.complete(i)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),y},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.finallyLoc===e)return this.complete(n.completion,n.afterLoc),j(n),y}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.tryLoc===e){var r=n.completion;if("throw"===r.type){var a=r.arg;j(n)}return a}}throw new Error("illegal catch attempt")},delegateYield:function(e,n,r){return this.delegate={iterator:H(e),resultName:n,nextLoc:r},"next"===this.method&&(this.arg=t),y}},e}(e.exports);try{regeneratorRuntime=t}catch(e){"object"==typeof globalThis?globalThis.regeneratorRuntime=t:Function("r","regeneratorRuntime = r")(t)}},79246:(e,t,n)=>{"use strict";var r=n(21924),a=n(40210),s=n(98420),i=r("RegExp.prototype.exec"),o=a("%TypeError%");e.exports=function(e){if(!s(e))throw new o("`regex` must be a RegExp");return function(t){return null!==i(e,t)}}},67771:(e,t,n)=>{"use strict";var r=n(40210),a=n(12296),s=n(31044)(),i=n(27296),o=r("%TypeError%"),d=r("%Math.floor%");e.exports=function(e,t){if("function"!=typeof e)throw new o("`fn` is not a function");if("number"!=typeof t||t<0||t>4294967295||d(t)!==t)throw new o("`length` must be a positive 32-bit integer");var n=arguments.length>2&&!!arguments[2],r=!0,u=!0;if("length"in e&&i){var _=i(e,"length");_&&!_.configurable&&(r=!1),_&&!_.writable&&(u=!1)}return(r||u||!n)&&(s?a(e,"length",t,!0,!0):a(e,"length",t)),e}},61040:(e,t,n)=>{"use strict";var r=n(58974),a=n(16324),s=n(21924)("String.prototype.replace"),i=/^\s$/.test("á Ž"),o=i?/^[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]+/:/^[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]+/,d=i?/[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]+$/:/[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]+$/;e.exports=function(){var e=a(r(this));return s(s(e,o,""),d,"")}},46057:(e,t,n)=>{"use strict";var r=n(55559),a=n(4289),s=n(58974),i=n(61040),o=n(30254),d=n(60029),u=r(o()),_=function(e){return s(e),u(e)};a(_,{getPolyfill:o,implementation:i,shim:d}),e.exports=_},30254:(e,t,n)=>{"use strict";var r=n(61040);e.exports=function(){return String.prototype.trim&&"â€‹"==="â€‹".trim()&&"á Ž"==="á Ž".trim()&&"_á Ž"==="_á Ž".trim()&&"á Ž_"==="á Ž_".trim()?String.prototype.trim:r}},60029:(e,t,n)=>{"use strict";var r=n(4289),a=n(30254);e.exports=function(){var e=a();return r(String.prototype,{trim:e},{trim:function(){return String.prototype.trim!==e}}),e}},41546:(e,t,n)=>{"use strict";e.exports=n(95320)},58974:(e,t,n)=>{"use strict";e.exports=n(4559)},82837:(e,t,n)=>{"use strict";var r=n(40210),a=r("%Number%"),s=r("%RegExp%"),i=r("%TypeError%"),o=r("%parseInt%"),d=n(21924),u=n(79246),_=d("String.prototype.slice"),l=u(/^0b[01]+$/i),c=u(/^0o[0-7]+$/i),m=u(/^[-+]0x[0-9a-f]+$/i),h=u(new s("["+["Â…","â€‹","ï¿¾"].join("")+"]","g")),f=n(46057),y=n(58294);e.exports=function e(t){if("String"!==y(t))throw new i("Assertion failed: `argument` is not a String");if(l(t))return a(o(_(t,2),2));if(c(t))return a(o(_(t,2),8));if(h(t)||m(t))return NaN;var n=f(t);return n!==t?e(n):a(t)}},88681:(e,t,n)=>{"use strict";var r=n(43798),a=n(39217),s=n(29086),i=n(22633);e.exports=function(e){var t=r(e);return s(t)||0===t?0:i(t)?a(t):t}},17020:(e,t,n)=>{"use strict";var r=n(11645),a=n(88681);e.exports=function(e){var t=a(e);return t<=0?0:t>r?r:t}},43798:(e,t,n)=>{"use strict";var r=n(40210),a=r("%TypeError%"),s=r("%Number%"),i=n(64790),o=n(94647),d=n(82837);e.exports=function(e){var t=i(e)?e:o(e,s);if("symbol"==typeof t)throw new a("Cannot convert a Symbol value to a number");if("bigint"==typeof t)throw new a("Conversion from 'BigInt' to 'number' is not allowed.");return"string"==typeof t?d(t):s(t)}},20377:(e,t,n)=>{"use strict";var r=n(40210)("%Object%"),a=n(58974);e.exports=function(e){return a(e),r(e)}},94647:(e,t,n)=>{"use strict";var r=n(41503);e.exports=function(e){return arguments.length>1?r(e,arguments[1]):r(e)}},16324:(e,t,n)=>{"use strict";var r=n(40210),a=r("%String%"),s=r("%TypeError%");e.exports=function(e){if("symbol"==typeof e)throw new s("Cannot convert a Symbol value to a string");return a(e)}},58294:(e,t,n)=>{"use strict";var r=n(23951);e.exports=function(e){return"symbol"==typeof e?"Symbol":"bigint"==typeof e?"BigInt":r(e)}},69806:(e,t,n)=>{"use strict";var r=n(58294),a=Math.floor;e.exports=function(e){return"BigInt"===r(e)?e:a(e)}},39217:(e,t,n)=>{"use strict";var r=n(40210),a=n(69806),s=r("%TypeError%");e.exports=function(e){if("number"!=typeof e&&"bigint"!=typeof e)throw new s("argument must be a Number or a BigInt");var t=e<0?-a(-e):a(e);return 0===t?0:t}},4559:(e,t,n)=>{"use strict";var r=n(40210)("%TypeError%");e.exports=function(e,t){if(null==e)throw new r(t||"Cannot call method on "+e);return e}},23951:e=>{"use strict";e.exports=function(e){return null===e?"Null":void 0===e?"Undefined":"function"==typeof e||"object"==typeof e?"Object":"number"==typeof e?"Number":"boolean"==typeof e?"Boolean":"string"==typeof e?"String":void 0}},22633:(e,t,n)=>{"use strict";var r=n(29086);e.exports=function(e){return("number"==typeof e||"bigint"==typeof e)&&!r(e)&&e!==1/0&&e!==-1/0}},29086:e=>{"use strict";e.exports=Number.isNaN||function(e){return e!=e}},64790:e=>{"use strict";e.exports=function(e){return null===e||"function"!=typeof e&&"object"!=typeof e}},11645:e=>{"use strict";e.exports=Number.MAX_SAFE_INTEGER||9007199254740991},22622:e=>{"use strict";e.exports=JSON.parse('{"pickaday":{"month":{"april":"Abril","august":"Agosto","december":"Dezembro","february":"Fevereiro","january":"Janeiro","july":"Julho","june":"Junho","march":"MarÃ§o","may":"Maio","november":"Novembro","october":"Outubro","september":"Setembro"},"nextMonth":"PrÃ³ximo mÃªs","previousMonth":"MÃªs anterior","weekday":{"friday":"SÃ¡bado","monday":"TerÃ§a-feira","saturday":"Domingo","sunday":"Segunda-feira","thursday":"Sexta-feira","tuesday":"Quarta-feira","wednesday":"Quinta-feira"},"weekdaysShort":{"fri":"SÃ¡b","mon":"Ter","sat":"Dom","sun":"Seg","thur":"Sex","tue":"Qua","wed":"Qui"}}}')},76978:e=>{"use strict";e.exports=JSON.parse('{"pickaday":{"month":{"april":"April","august":"August","december":"Dezember","february":"Februar","january":"Januar","july":"Juli","june":"Juni","march":"MÃ¤rz","may":"Mai","november":"November","october":"Oktober","september":"September"},"nextMonth":"NÃ¤chster Monat","previousMonth":"Vorheriger Monat","weekday":{"friday":"Freitag","monday":"Montag","saturday":"Samstag","sunday":"Sonntag","thursday":"Donnerstag","tuesday":"Dienstag","wednesday":"Mittwoch"},"weekdaysShort":{"fri":"Fr","mon":"Mo","sat":"Sa","sun":"So","thur":"Do","tue":"Di","wed":"Mi"}}}')},41432:e=>{"use strict";e.exports=JSON.parse('{"pickaday":{"month":{"april":"April","august":"August","december":"December","february":"February","january":"January","july":"July","june":"June","march":"March","may":"May","november":"November","october":"October","september":"September"},"nextMonth":"Next Month","previousMonth":"Previous Month","weekday":{"friday":"Friday","monday":"Monday","saturday":"Saturday","sunday":"Sunday","thursday":"Thursday","tuesday":"Tuesday","wednesday":"Wednesday"},"weekdaysShort":{"fri":"Fri","mon":"Mon","sat":"Sat","sun":"Sun","thur":"Thur","tue":"Tue","wed":"Wed"}}}')},95955:e=>{"use strict";e.exports=JSON.parse('{"pickaday":{"month":{"april":"Abril","august":"Agosto","december":"Diciembre","february":"Febrero","january":"Enero","july":"Julio","june":"Junio","march":"Marzo","may":"Mayo","november":"Noviembre","october":"Octubre","september":"Septiembre"},"nextMonth":"Mes siguiente","previousMonth":"Mes anterior","weekday":{"friday":"Viernes","monday":"Lunes","saturday":"SÃ¡bado","sunday":"Domingo","thursday":"Jueves","tuesday":"Martes","wednesday":"MiÃ©rcoles"},"weekdaysShort":{"fri":"Vi","mon":"Lu","sat":"Sa","sun":"Do","thur":"Ju","tue":"Ma","wed":"Mi"}}}')},33011:e=>{"use strict";e.exports=JSON.parse('{"pickaday":{"month":{"april":"Avril","august":"AoÃ»t","december":"DÃ©cembre","february":"FÃ©vrier","january":"Janvier","july":"Juillet","june":"Juin","march":"Mars","may":"Mai","november":"Novembre","october":"Octobre","september":"Septembre"},"nextMonth":"Mois suivant","previousMonth":"Mois prÃ©cÃ©dent","weekday":{"friday":"Vendredi","monday":"Lundi","saturday":"Samedi","sunday":"Dimanche","thursday":"Jeudi","tuesday":"Mardi","wednesday":"Mercredi"},"weekdaysShort":{"fri":"Ven","mon":"Lun","sat":"Sam","sun":"Dim","thur":"Jeu","tue":"Mar","wed":"Mer"}}}')},44762:e=>{"use strict";e.exports=JSON.parse('{"pickaday":{"month":{"april":"Aprile","august":"Agosto","december":"Dicembre","february":"Febbraio","january":"Gennaio","july":"Luglio","june":"Giugno","march":"Marzo","may":"Maggio","november":"Novembre","october":"Ottobre","september":"Settembre"},"nextMonth":"Mese successivo","previousMonth":"Mese precedente","weekday":{"friday":"VenerdÃ­","monday":"LunedÃ­","saturday":"Sabato","sunday":"Domenica","thursday":"GiovedÃ­","tuesday":"MartedÃ­","wednesday":"MercoledÃ­"},"weekdaysShort":{"fri":"Ven","mon":"Lun","sat":"Sab","sun":"Dom","thur":"Gio","tue":"Mar","wed":"Mer"}}}')},65911:e=>{"use strict";e.exports=JSON.parse('{"pickaday":{"month":{"april":"Abril","august":"Agosto","december":"Dezembro","february":"Fevereiro","january":"Janeiro","july":"Julho","june":"Junho","march":"MarÃ§o","may":"Maio","november":"Novembro","october":"Outubro","september":"Setembro"},"nextMonth":"PrÃ³ximo mÃªs","previousMonth":"MÃªs anterior","weekday":{"friday":"SÃ¡bado","monday":"TerÃ§a-feira","saturday":"Domingo","sunday":"Segunda-feira","thursday":"Sexta-feira","tuesday":"Quarta-feira","wednesday":"Quinta-feira"},"weekdaysShort":{"fri":"SÃ¡b","mon":"Ter","sat":"Dom","sun":"Seg","thur":"Sex","tue":"Qua","wed":"Qui"}}}')}},t={};function n(r){var a=t[r];if(void 0!==a)return a.exports;var s=t[r]={id:r,loaded:!1,exports:{}};return e[r].call(s.exports,s,s.exports,n),s.loaded=!0,s.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),n(91387),n(86622),n(65548),n(62274),n(76762),n(38496),n(20319),n(84759),n(23336)})();
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/*!
 * Splide.js
 * Version  : 4.1.2
 * License  : MIT
 * Copyright: 2022 Naotoshi Fujita
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Splide = factory());
})(this, function () {
  'use strict';

  var MEDIA_PREFERS_REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
  var CREATED = 1;
  var MOUNTED = 2;
  var IDLE = 3;
  var MOVING = 4;
  var SCROLLING = 5;
  var DRAGGING = 6;
  var DESTROYED = 7;
  var STATES = {
    CREATED: CREATED,
    MOUNTED: MOUNTED,
    IDLE: IDLE,
    MOVING: MOVING,
    SCROLLING: SCROLLING,
    DRAGGING: DRAGGING,
    DESTROYED: DESTROYED
  };

  function empty(array) {
    array.length = 0;
  }

  function slice(arrayLike, start, end) {
    return Array.prototype.slice.call(arrayLike, start, end);
  }

  function apply(func) {
    return func.bind.apply(func, [null].concat(slice(arguments, 1)));
  }

  var nextTick = setTimeout;

  var noop = function noop() {};

  function raf(func) {
    return requestAnimationFrame(func);
  }

  function typeOf(type, subject) {
    return typeof subject === type;
  }

  function isObject(subject) {
    return !isNull(subject) && typeOf("object", subject);
  }

  var isArray = Array.isArray;
  var isFunction = apply(typeOf, "function");
  var isString = apply(typeOf, "string");
  var isUndefined = apply(typeOf, "undefined");

  function isNull(subject) {
    return subject === null;
  }

  function isHTMLElement(subject) {
    try {
      return subject instanceof (subject.ownerDocument.defaultView || window).HTMLElement;
    } catch (e) {
      return false;
    }
  }

  function toArray(value) {
    return isArray(value) ? value : [value];
  }

  function forEach(values, iteratee) {
    toArray(values).forEach(iteratee);
  }

  function includes(array, value) {
    return array.indexOf(value) > -1;
  }

  function push(array, items) {
    array.push.apply(array, toArray(items));
    return array;
  }

  function toggleClass(elm, classes, add) {
    if (elm) {
      forEach(classes, function (name) {
        if (name) {
          elm.classList[add ? "add" : "remove"](name);
        }
      });
    }
  }

  function addClass(elm, classes) {
    toggleClass(elm, isString(classes) ? classes.split(" ") : classes, true);
  }

  function append(parent, children) {
    forEach(children, parent.appendChild.bind(parent));
  }

  function before(nodes, ref) {
    forEach(nodes, function (node) {
      var parent = (ref || node).parentNode;

      if (parent) {
        parent.insertBefore(node, ref);
      }
    });
  }

  function matches(elm, selector) {
    return isHTMLElement(elm) && (elm["msMatchesSelector"] || elm.matches).call(elm, selector);
  }

  function children(parent, selector) {
    var children2 = parent ? slice(parent.children) : [];
    return selector ? children2.filter(function (child) {
      return matches(child, selector);
    }) : children2;
  }

  function child(parent, selector) {
    return selector ? children(parent, selector)[0] : parent.firstElementChild;
  }

  var ownKeys = Object.keys;

  function forOwn(object, iteratee, right) {
    if (object) {
      (right ? ownKeys(object).reverse() : ownKeys(object)).forEach(function (key) {
        key !== "__proto__" && iteratee(object[key], key);
      });
    }

    return object;
  }

  function assign(object) {
    slice(arguments, 1).forEach(function (source) {
      forOwn(source, function (value, key) {
        object[key] = source[key];
      });
    });
    return object;
  }

  function merge(object) {
    slice(arguments, 1).forEach(function (source) {
      forOwn(source, function (value, key) {
        if (isArray(value)) {
          object[key] = value.slice();
        } else if (isObject(value)) {
          object[key] = merge({}, isObject(object[key]) ? object[key] : {}, value);
        } else {
          object[key] = value;
        }
      });
    });
    return object;
  }

  function omit(object, keys) {
    forEach(keys || ownKeys(object), function (key) {
      delete object[key];
    });
  }

  function removeAttribute(elms, attrs) {
    forEach(elms, function (elm) {
      forEach(attrs, function (attr) {
        elm && elm.removeAttribute(attr);
      });
    });
  }

  function setAttribute(elms, attrs, value) {
    if (isObject(attrs)) {
      forOwn(attrs, function (value2, name) {
        setAttribute(elms, name, value2);
      });
    } else {
      forEach(elms, function (elm) {
        isNull(value) || value === "" ? removeAttribute(elm, attrs) : elm.setAttribute(attrs, String(value));
      });
    }
  }

  function create(tag, attrs, parent) {
    var elm = document.createElement(tag);

    if (attrs) {
      isString(attrs) ? addClass(elm, attrs) : setAttribute(elm, attrs);
    }

    parent && append(parent, elm);
    return elm;
  }

  function style(elm, prop, value) {
    if (isUndefined(value)) {
      return getComputedStyle(elm)[prop];
    }

    if (!isNull(value)) {
      elm.style[prop] = "" + value;
    }
  }

  function display(elm, display2) {
    style(elm, "display", display2);
  }

  function focus(elm) {
    elm["setActive"] && elm["setActive"]() || elm.focus({
      preventScroll: true
    });
  }

  function getAttribute(elm, attr) {
    return elm.getAttribute(attr);
  }

  function hasClass(elm, className) {
    return elm && elm.classList.contains(className);
  }

  function rect(target) {
    return target.getBoundingClientRect();
  }

  function remove(nodes) {
    forEach(nodes, function (node) {
      if (node && node.parentNode) {
        node.parentNode.removeChild(node);
      }
    });
  }

  function parseHtml(html) {
    return child(new DOMParser().parseFromString(html, "text/html").body);
  }

  function prevent(e, stopPropagation) {
    e.preventDefault();

    if (stopPropagation) {
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }

  function query(parent, selector) {
    return parent && parent.querySelector(selector);
  }

  function queryAll(parent, selector) {
    return selector ? slice(parent.querySelectorAll(selector)) : [];
  }

  function removeClass(elm, classes) {
    toggleClass(elm, classes, false);
  }

  function timeOf(e) {
    return e.timeStamp;
  }

  function unit(value) {
    return isString(value) ? value : value ? value + "px" : "";
  }

  var PROJECT_CODE = "splide";
  var DATA_ATTRIBUTE = "data-" + PROJECT_CODE;

  function assert(condition, message) {
    if (!condition) {
      throw new Error("[" + PROJECT_CODE + "] " + (message || ""));
    }
  }

  var min = Math.min,
      max = Math.max,
      floor = Math.floor,
      ceil = Math.ceil,
      abs = Math.abs;

  function approximatelyEqual(x, y, epsilon) {
    return abs(x - y) < epsilon;
  }

  function between(number, x, y, exclusive) {
    var minimum = min(x, y);
    var maximum = max(x, y);
    return exclusive ? minimum < number && number < maximum : minimum <= number && number <= maximum;
  }

  function clamp(number, x, y) {
    var minimum = min(x, y);
    var maximum = max(x, y);
    return min(max(minimum, number), maximum);
  }

  function sign(x) {
    return +(x > 0) - +(x < 0);
  }

  function format(string, replacements) {
    forEach(replacements, function (replacement) {
      string = string.replace("%s", "" + replacement);
    });
    return string;
  }

  function pad(number) {
    return number < 10 ? "0" + number : "" + number;
  }

  var ids = {};

  function uniqueId(prefix) {
    return "" + prefix + pad(ids[prefix] = (ids[prefix] || 0) + 1);
  }

  function EventBinder() {
    var listeners = [];

    function bind(targets, events, callback, options) {
      forEachEvent(targets, events, function (target, event, namespace) {
        var isEventTarget = ("addEventListener" in target);
        var remover = isEventTarget ? target.removeEventListener.bind(target, event, callback, options) : target["removeListener"].bind(target, callback);
        isEventTarget ? target.addEventListener(event, callback, options) : target["addListener"](callback);
        listeners.push([target, event, namespace, callback, remover]);
      });
    }

    function unbind(targets, events, callback) {
      forEachEvent(targets, events, function (target, event, namespace) {
        listeners = listeners.filter(function (listener) {
          if (listener[0] === target && listener[1] === event && listener[2] === namespace && (!callback || listener[3] === callback)) {
            listener[4]();
            return false;
          }

          return true;
        });
      });
    }

    function dispatch(target, type, detail) {
      var e;
      var bubbles = true;

      if (typeof CustomEvent === "function") {
        e = new CustomEvent(type, {
          bubbles: bubbles,
          detail: detail
        });
      } else {
        e = document.createEvent("CustomEvent");
        e.initCustomEvent(type, bubbles, false, detail);
      }

      target.dispatchEvent(e);
      return e;
    }

    function forEachEvent(targets, events, iteratee) {
      forEach(targets, function (target) {
        target && forEach(events, function (events2) {
          events2.split(" ").forEach(function (eventNS) {
            var fragment = eventNS.split(".");
            iteratee(target, fragment[0], fragment[1]);
          });
        });
      });
    }

    function destroy() {
      listeners.forEach(function (data) {
        data[4]();
      });
      empty(listeners);
    }

    return {
      bind: bind,
      unbind: unbind,
      dispatch: dispatch,
      destroy: destroy
    };
  }

  var EVENT_MOUNTED = "mounted";
  var EVENT_READY = "ready";
  var EVENT_MOVE = "move";
  var EVENT_MOVED = "moved";
  var EVENT_CLICK = "click";
  var EVENT_ACTIVE = "active";
  var EVENT_INACTIVE = "inactive";
  var EVENT_VISIBLE = "visible";
  var EVENT_HIDDEN = "hidden";
  var EVENT_REFRESH = "refresh";
  var EVENT_UPDATED = "updated";
  var EVENT_RESIZE = "resize";
  var EVENT_RESIZED = "resized";
  var EVENT_DRAG = "drag";
  var EVENT_DRAGGING = "dragging";
  var EVENT_DRAGGED = "dragged";
  var EVENT_SCROLL = "scroll";
  var EVENT_SCROLLED = "scrolled";
  var EVENT_OVERFLOW = "overflow";
  var EVENT_DESTROY = "destroy";
  var EVENT_ARROWS_MOUNTED = "arrows:mounted";
  var EVENT_ARROWS_UPDATED = "arrows:updated";
  var EVENT_PAGINATION_MOUNTED = "pagination:mounted";
  var EVENT_PAGINATION_UPDATED = "pagination:updated";
  var EVENT_NAVIGATION_MOUNTED = "navigation:mounted";
  var EVENT_AUTOPLAY_PLAY = "autoplay:play";
  var EVENT_AUTOPLAY_PLAYING = "autoplay:playing";
  var EVENT_AUTOPLAY_PAUSE = "autoplay:pause";
  var EVENT_LAZYLOAD_LOADED = "lazyload:loaded";
  var EVENT_SLIDE_KEYDOWN = "sk";
  var EVENT_SHIFTED = "sh";
  var EVENT_END_INDEX_CHANGED = "ei";

  function EventInterface(Splide2) {
    var bus = Splide2 ? Splide2.event.bus : document.createDocumentFragment();
    var binder = EventBinder();

    function on(events, callback) {
      binder.bind(bus, toArray(events).join(" "), function (e) {
        callback.apply(callback, isArray(e.detail) ? e.detail : []);
      });
    }

    function emit(event) {
      binder.dispatch(bus, event, slice(arguments, 1));
    }

    if (Splide2) {
      Splide2.event.on(EVENT_DESTROY, binder.destroy);
    }

    return assign(binder, {
      bus: bus,
      on: on,
      off: apply(binder.unbind, bus),
      emit: emit
    });
  }

  function RequestInterval(interval, onInterval, onUpdate, limit) {
    var now = Date.now;
    var startTime;
    var rate = 0;
    var id;
    var paused = true;
    var count = 0;

    function update() {
      if (!paused) {
        rate = interval ? min((now() - startTime) / interval, 1) : 1;
        onUpdate && onUpdate(rate);

        if (rate >= 1) {
          onInterval();
          startTime = now();

          if (limit && ++count >= limit) {
            return pause();
          }
        }

        id = raf(update);
      }
    }

    function start(resume) {
      resume || cancel();
      startTime = now() - (resume ? rate * interval : 0);
      paused = false;
      id = raf(update);
    }

    function pause() {
      paused = true;
    }

    function rewind() {
      startTime = now();
      rate = 0;

      if (onUpdate) {
        onUpdate(rate);
      }
    }

    function cancel() {
      id && cancelAnimationFrame(id);
      rate = 0;
      id = 0;
      paused = true;
    }

    function set(time) {
      interval = time;
    }

    function isPaused() {
      return paused;
    }

    return {
      start: start,
      rewind: rewind,
      pause: pause,
      cancel: cancel,
      set: set,
      isPaused: isPaused
    };
  }

  function State(initialState) {
    var state = initialState;

    function set(value) {
      state = value;
    }

    function is(states) {
      return includes(toArray(states), state);
    }

    return {
      set: set,
      is: is
    };
  }

  function Throttle(func, duration) {
    var interval = RequestInterval(duration || 0, func, null, 1);
    return function () {
      interval.isPaused() && interval.start();
    };
  }

  function Media(Splide2, Components2, options) {
    var state = Splide2.state;
    var breakpoints = options.breakpoints || {};
    var reducedMotion = options.reducedMotion || {};
    var binder = EventBinder();
    var queries = [];

    function setup() {
      var isMin = options.mediaQuery === "min";
      ownKeys(breakpoints).sort(function (n, m) {
        return isMin ? +n - +m : +m - +n;
      }).forEach(function (key) {
        register(breakpoints[key], "(" + (isMin ? "min" : "max") + "-width:" + key + "px)");
      });
      register(reducedMotion, MEDIA_PREFERS_REDUCED_MOTION);
      update();
    }

    function destroy(completely) {
      if (completely) {
        binder.destroy();
      }
    }

    function register(options2, query) {
      var queryList = matchMedia(query);
      binder.bind(queryList, "change", update);
      queries.push([options2, queryList]);
    }

    function update() {
      var destroyed = state.is(DESTROYED);
      var direction = options.direction;
      var merged = queries.reduce(function (merged2, entry) {
        return merge(merged2, entry[1].matches ? entry[0] : {});
      }, {});
      omit(options);
      set(merged);

      if (options.destroy) {
        Splide2.destroy(options.destroy === "completely");
      } else if (destroyed) {
        destroy(true);
        Splide2.mount();
      } else {
        direction !== options.direction && Splide2.refresh();
      }
    }

    function reduce(enable) {
      if (matchMedia(MEDIA_PREFERS_REDUCED_MOTION).matches) {
        enable ? merge(options, reducedMotion) : omit(options, ownKeys(reducedMotion));
      }
    }

    function set(opts, base, notify) {
      merge(options, opts);
      base && merge(Object.getPrototypeOf(options), opts);

      if (notify || !state.is(CREATED)) {
        Splide2.emit(EVENT_UPDATED, options);
      }
    }

    return {
      setup: setup,
      destroy: destroy,
      reduce: reduce,
      set: set
    };
  }

  var ARROW = "Arrow";
  var ARROW_LEFT = ARROW + "Left";
  var ARROW_RIGHT = ARROW + "Right";
  var ARROW_UP = ARROW + "Up";
  var ARROW_DOWN = ARROW + "Down";
  var RTL = "rtl";
  var TTB = "ttb";
  var ORIENTATION_MAP = {
    width: ["height"],
    left: ["top", "right"],
    right: ["bottom", "left"],
    x: ["y"],
    X: ["Y"],
    Y: ["X"],
    ArrowLeft: [ARROW_UP, ARROW_RIGHT],
    ArrowRight: [ARROW_DOWN, ARROW_LEFT]
  };

  function Direction(Splide2, Components2, options) {
    function resolve(prop, axisOnly, direction) {
      direction = direction || options.direction;
      var index = direction === RTL && !axisOnly ? 1 : direction === TTB ? 0 : -1;
      return ORIENTATION_MAP[prop] && ORIENTATION_MAP[prop][index] || prop.replace(/width|left|right/i, function (match, offset) {
        var replacement = ORIENTATION_MAP[match.toLowerCase()][index] || match;
        return offset > 0 ? replacement.charAt(0).toUpperCase() + replacement.slice(1) : replacement;
      });
    }

    function orient(value) {
      return value * (options.direction === RTL ? 1 : -1);
    }

    return {
      resolve: resolve,
      orient: orient
    };
  }

  var ROLE = "role";
  var TAB_INDEX = "tabindex";
  var DISABLED = "disabled";
  var ARIA_PREFIX = "aria-";
  var ARIA_CONTROLS = ARIA_PREFIX + "controls";
  var ARIA_CURRENT = ARIA_PREFIX + "current";
  var ARIA_SELECTED = ARIA_PREFIX + "selected";
  var ARIA_LABEL = ARIA_PREFIX + "label";
  var ARIA_LABELLEDBY = ARIA_PREFIX + "labelledby";
  var ARIA_HIDDEN = ARIA_PREFIX + "hidden";
  var ARIA_ORIENTATION = ARIA_PREFIX + "orientation";
  var ARIA_ROLEDESCRIPTION = ARIA_PREFIX + "roledescription";
  var ARIA_LIVE = ARIA_PREFIX + "live";
  var ARIA_BUSY = ARIA_PREFIX + "busy";
  var ARIA_ATOMIC = ARIA_PREFIX + "atomic";
  var ALL_ATTRIBUTES = [ROLE, TAB_INDEX, DISABLED, ARIA_CONTROLS, ARIA_CURRENT, ARIA_LABEL, ARIA_LABELLEDBY, ARIA_HIDDEN, ARIA_ORIENTATION, ARIA_ROLEDESCRIPTION];
  var CLASS_PREFIX = PROJECT_CODE + "__";
  var STATUS_CLASS_PREFIX = "is-";
  var CLASS_ROOT = PROJECT_CODE;
  var CLASS_TRACK = CLASS_PREFIX + "track";
  var CLASS_LIST = CLASS_PREFIX + "list";
  var CLASS_SLIDE = CLASS_PREFIX + "slide";
  var CLASS_CLONE = CLASS_SLIDE + "--clone";
  var CLASS_CONTAINER = CLASS_SLIDE + "__container";
  var CLASS_ARROWS = CLASS_PREFIX + "arrows";
  var CLASS_ARROW = CLASS_PREFIX + "arrow";
  var CLASS_ARROW_PREV = CLASS_ARROW + "--prev";
  var CLASS_ARROW_NEXT = CLASS_ARROW + "--next";
  var CLASS_PAGINATION = CLASS_PREFIX + "pagination";
  var CLASS_PAGINATION_PAGE = CLASS_PAGINATION + "__page";
  var CLASS_PROGRESS = CLASS_PREFIX + "progress";
  var CLASS_PROGRESS_BAR = CLASS_PROGRESS + "__bar";
  var CLASS_TOGGLE = CLASS_PREFIX + "toggle";
  var CLASS_SPINNER = CLASS_PREFIX + "spinner";
  var CLASS_SR = CLASS_PREFIX + "sr";
  var CLASS_INITIALIZED = STATUS_CLASS_PREFIX + "initialized";
  var CLASS_ACTIVE = STATUS_CLASS_PREFIX + "active";
  var CLASS_PREV = STATUS_CLASS_PREFIX + "prev";
  var CLASS_NEXT = STATUS_CLASS_PREFIX + "next";
  var CLASS_VISIBLE = STATUS_CLASS_PREFIX + "visible";
  var CLASS_LOADING = STATUS_CLASS_PREFIX + "loading";
  var CLASS_FOCUS_IN = STATUS_CLASS_PREFIX + "focus-in";
  var CLASS_OVERFLOW = STATUS_CLASS_PREFIX + "overflow";
  var STATUS_CLASSES = [CLASS_ACTIVE, CLASS_VISIBLE, CLASS_PREV, CLASS_NEXT, CLASS_LOADING, CLASS_FOCUS_IN, CLASS_OVERFLOW];
  var CLASSES = {
    slide: CLASS_SLIDE,
    clone: CLASS_CLONE,
    arrows: CLASS_ARROWS,
    arrow: CLASS_ARROW,
    prev: CLASS_ARROW_PREV,
    next: CLASS_ARROW_NEXT,
    pagination: CLASS_PAGINATION,
    page: CLASS_PAGINATION_PAGE,
    spinner: CLASS_SPINNER
  };

  function closest(from, selector) {
    if (isFunction(from.closest)) {
      return from.closest(selector);
    }

    var elm = from;

    while (elm && elm.nodeType === 1) {
      if (matches(elm, selector)) {
        break;
      }

      elm = elm.parentElement;
    }

    return elm;
  }

  var FRICTION = 5;
  var LOG_INTERVAL = 200;
  var POINTER_DOWN_EVENTS = "touchstart mousedown";
  var POINTER_MOVE_EVENTS = "touchmove mousemove";
  var POINTER_UP_EVENTS = "touchend touchcancel mouseup click";

  function Elements(Splide2, Components2, options) {
    var _EventInterface = EventInterface(Splide2),
        on = _EventInterface.on,
        bind = _EventInterface.bind;

    var root = Splide2.root;
    var i18n = options.i18n;
    var elements = {};
    var slides = [];
    var rootClasses = [];
    var trackClasses = [];
    var track;
    var list;
    var isUsingKey;

    function setup() {
      collect();
      init();
      update();
    }

    function mount() {
      on(EVENT_REFRESH, destroy);
      on(EVENT_REFRESH, setup);
      on(EVENT_UPDATED, update);
      bind(document, POINTER_DOWN_EVENTS + " keydown", function (e) {
        isUsingKey = e.type === "keydown";
      }, {
        capture: true
      });
      bind(root, "focusin", function () {
        toggleClass(root, CLASS_FOCUS_IN, !!isUsingKey);
      });
    }

    function destroy(completely) {
      var attrs = ALL_ATTRIBUTES.concat("style");
      empty(slides);
      removeClass(root, rootClasses);
      removeClass(track, trackClasses);
      removeAttribute([track, list], attrs);
      removeAttribute(root, completely ? attrs : ["style", ARIA_ROLEDESCRIPTION]);
    }

    function update() {
      removeClass(root, rootClasses);
      removeClass(track, trackClasses);
      rootClasses = getClasses(CLASS_ROOT);
      trackClasses = getClasses(CLASS_TRACK);
      addClass(root, rootClasses);
      addClass(track, trackClasses);
      setAttribute(root, ARIA_LABEL, options.label);
      setAttribute(root, ARIA_LABELLEDBY, options.labelledby);
    }

    function collect() {
      track = find("." + CLASS_TRACK);
      list = child(track, "." + CLASS_LIST);
      assert(track && list, "A track/list element is missing.");
      push(slides, children(list, "." + CLASS_SLIDE + ":not(." + CLASS_CLONE + ")"));
      forOwn({
        arrows: CLASS_ARROWS,
        pagination: CLASS_PAGINATION,
        prev: CLASS_ARROW_PREV,
        next: CLASS_ARROW_NEXT,
        bar: CLASS_PROGRESS_BAR,
        toggle: CLASS_TOGGLE
      }, function (className, key) {
        elements[key] = find("." + className);
      });
      assign(elements, {
        root: root,
        track: track,
        list: list,
        slides: slides
      });
    }

    function init() {
      var id = root.id || uniqueId(PROJECT_CODE);
      var role = options.role;
      root.id = id;
      track.id = track.id || id + "-track";
      list.id = list.id || id + "-list";

      if (!getAttribute(root, ROLE) && root.tagName !== "SECTION" && role) {
        setAttribute(root, ROLE, role);
      }

      setAttribute(root, ARIA_ROLEDESCRIPTION, i18n.carousel);
      setAttribute(list, ROLE, "presentation");
    }

    function find(selector) {
      var elm = query(root, selector);
      return elm && closest(elm, "." + CLASS_ROOT) === root ? elm : void 0;
    }

    function getClasses(base) {
      return [base + "--" + options.type, base + "--" + options.direction, options.drag && base + "--draggable", options.isNavigation && base + "--nav", base === CLASS_ROOT && CLASS_ACTIVE];
    }

    return assign(elements, {
      setup: setup,
      mount: mount,
      destroy: destroy
    });
  }

  var SLIDE = "slide";
  var LOOP = "loop";
  var FADE = "fade";

  function Slide$1(Splide2, index, slideIndex, slide) {
    var event = EventInterface(Splide2);
    var on = event.on,
        emit = event.emit,
        bind = event.bind;
    var Components = Splide2.Components,
        root = Splide2.root,
        options = Splide2.options;
    var isNavigation = options.isNavigation,
        updateOnMove = options.updateOnMove,
        i18n = options.i18n,
        pagination = options.pagination,
        slideFocus = options.slideFocus;
    var resolve = Components.Direction.resolve;
    var styles = getAttribute(slide, "style");
    var label = getAttribute(slide, ARIA_LABEL);
    var isClone = slideIndex > -1;
    var container = child(slide, "." + CLASS_CONTAINER);
    var destroyed;

    function mount() {
      if (!isClone) {
        slide.id = root.id + "-slide" + pad(index + 1);
        setAttribute(slide, ROLE, pagination ? "tabpanel" : "group");
        setAttribute(slide, ARIA_ROLEDESCRIPTION, i18n.slide);
        setAttribute(slide, ARIA_LABEL, label || format(i18n.slideLabel, [index + 1, Splide2.length]));
      }

      listen();
    }

    function listen() {
      bind(slide, "click", apply(emit, EVENT_CLICK, self));
      bind(slide, "keydown", apply(emit, EVENT_SLIDE_KEYDOWN, self));
      on([EVENT_MOVED, EVENT_SHIFTED, EVENT_SCROLLED], update);
      on(EVENT_NAVIGATION_MOUNTED, initNavigation);

      if (updateOnMove) {
        on(EVENT_MOVE, onMove);
      }
    }

    function destroy() {
      destroyed = true;
      event.destroy();
      removeClass(slide, STATUS_CLASSES);
      removeAttribute(slide, ALL_ATTRIBUTES);
      setAttribute(slide, "style", styles);
      setAttribute(slide, ARIA_LABEL, label || "");
    }

    function initNavigation() {
      var controls = Splide2.splides.map(function (target) {
        var Slide2 = target.splide.Components.Slides.getAt(index);
        return Slide2 ? Slide2.slide.id : "";
      }).join(" ");
      setAttribute(slide, ARIA_LABEL, format(i18n.slideX, (isClone ? slideIndex : index) + 1));
      setAttribute(slide, ARIA_CONTROLS, controls);
      setAttribute(slide, ROLE, slideFocus ? "button" : "");
      slideFocus && removeAttribute(slide, ARIA_ROLEDESCRIPTION);
    }

    function onMove() {
      if (!destroyed) {
        update();
      }
    }

    function update() {
      if (!destroyed) {
        var curr = Splide2.index;
        updateActivity();
        updateVisibility();
        toggleClass(slide, CLASS_PREV, index === curr - 1);
        toggleClass(slide, CLASS_NEXT, index === curr + 1);
      }
    }

    function updateActivity() {
      var active = isActive();

      if (active !== hasClass(slide, CLASS_ACTIVE)) {
        toggleClass(slide, CLASS_ACTIVE, active);
        setAttribute(slide, ARIA_CURRENT, isNavigation && active || "");
        emit(active ? EVENT_ACTIVE : EVENT_INACTIVE, self);
      }
    }

    function updateVisibility() {
      var visible = isVisible();
      var hidden = !visible && (!isActive() || isClone);

      if (!Splide2.state.is([MOVING, SCROLLING])) {
        setAttribute(slide, ARIA_HIDDEN, hidden || "");
      }

      setAttribute(queryAll(slide, options.focusableNodes || ""), TAB_INDEX, hidden ? -1 : "");

      if (slideFocus) {
        setAttribute(slide, TAB_INDEX, hidden ? -1 : 0);
      }

      if (visible !== hasClass(slide, CLASS_VISIBLE)) {
        toggleClass(slide, CLASS_VISIBLE, visible);
        emit(visible ? EVENT_VISIBLE : EVENT_HIDDEN, self);
      }

      if (!visible && document.activeElement === slide) {
        var Slide2 = Components.Slides.getAt(Splide2.index);
        Slide2 && focus(Slide2.slide);
      }
    }

    function style$1(prop, value, useContainer) {
      style(useContainer && container || slide, prop, value);
    }

    function isActive() {
      var curr = Splide2.index;
      return curr === index || options.cloneStatus && curr === slideIndex;
    }

    function isVisible() {
      if (Splide2.is(FADE)) {
        return isActive();
      }

      var trackRect = rect(Components.Elements.track);
      var slideRect = rect(slide);
      var left = resolve("left", true);
      var right = resolve("right", true);
      return floor(trackRect[left]) <= ceil(slideRect[left]) && floor(slideRect[right]) <= ceil(trackRect[right]);
    }

    function isWithin(from, distance) {
      var diff = abs(from - index);

      if (!isClone && (options.rewind || Splide2.is(LOOP))) {
        diff = min(diff, Splide2.length - diff);
      }

      return diff <= distance;
    }

    var self = {
      index: index,
      slideIndex: slideIndex,
      slide: slide,
      container: container,
      isClone: isClone,
      mount: mount,
      destroy: destroy,
      update: update,
      style: style$1,
      isWithin: isWithin
    };
    return self;
  }

  function Slides(Splide2, Components2, options) {
    var _EventInterface2 = EventInterface(Splide2),
        on = _EventInterface2.on,
        emit = _EventInterface2.emit,
        bind = _EventInterface2.bind;

    var _Components2$Elements = Components2.Elements,
        slides = _Components2$Elements.slides,
        list = _Components2$Elements.list;
    var Slides2 = [];

    function mount() {
      init();
      on(EVENT_REFRESH, destroy);
      on(EVENT_REFRESH, init);
    }

    function init() {
      slides.forEach(function (slide, index) {
        register(slide, index, -1);
      });
    }

    function destroy() {
      forEach$1(function (Slide2) {
        Slide2.destroy();
      });
      empty(Slides2);
    }

    function update() {
      forEach$1(function (Slide2) {
        Slide2.update();
      });
    }

    function register(slide, index, slideIndex) {
      var object = Slide$1(Splide2, index, slideIndex, slide);
      object.mount();
      Slides2.push(object);
      Slides2.sort(function (Slide1, Slide2) {
        return Slide1.index - Slide2.index;
      });
    }

    function get(excludeClones) {
      return excludeClones ? filter(function (Slide2) {
        return !Slide2.isClone;
      }) : Slides2;
    }

    function getIn(page) {
      var Controller = Components2.Controller;
      var index = Controller.toIndex(page);
      var max = Controller.hasFocus() ? 1 : options.perPage;
      return filter(function (Slide2) {
        return between(Slide2.index, index, index + max - 1);
      });
    }

    function getAt(index) {
      return filter(index)[0];
    }

    function add(items, index) {
      forEach(items, function (slide) {
        if (isString(slide)) {
          slide = parseHtml(slide);
        }

        if (isHTMLElement(slide)) {
          var ref = slides[index];
          ref ? before(slide, ref) : append(list, slide);
          addClass(slide, options.classes.slide);
          observeImages(slide, apply(emit, EVENT_RESIZE));
        }
      });
      emit(EVENT_REFRESH);
    }

    function remove$1(matcher) {
      remove(filter(matcher).map(function (Slide2) {
        return Slide2.slide;
      }));
      emit(EVENT_REFRESH);
    }

    function forEach$1(iteratee, excludeClones) {
      get(excludeClones).forEach(iteratee);
    }

    function filter(matcher) {
      return Slides2.filter(isFunction(matcher) ? matcher : function (Slide2) {
        return isString(matcher) ? matches(Slide2.slide, matcher) : includes(toArray(matcher), Slide2.index);
      });
    }

    function style(prop, value, useContainer) {
      forEach$1(function (Slide2) {
        Slide2.style(prop, value, useContainer);
      });
    }

    function observeImages(elm, callback) {
      var images = queryAll(elm, "img");
      var length = images.length;

      if (length) {
        images.forEach(function (img) {
          bind(img, "load error", function () {
            if (! --length) {
              callback();
            }
          });
        });
      } else {
        callback();
      }
    }

    function getLength(excludeClones) {
      return excludeClones ? slides.length : Slides2.length;
    }

    function isEnough() {
      return Slides2.length > options.perPage;
    }

    return {
      mount: mount,
      destroy: destroy,
      update: update,
      register: register,
      get: get,
      getIn: getIn,
      getAt: getAt,
      add: add,
      remove: remove$1,
      forEach: forEach$1,
      filter: filter,
      style: style,
      getLength: getLength,
      isEnough: isEnough
    };
  }

  function Layout(Splide2, Components2, options) {
    var _EventInterface3 = EventInterface(Splide2),
        on = _EventInterface3.on,
        bind = _EventInterface3.bind,
        emit = _EventInterface3.emit;

    var Slides = Components2.Slides;
    var resolve = Components2.Direction.resolve;
    var _Components2$Elements2 = Components2.Elements,
        root = _Components2$Elements2.root,
        track = _Components2$Elements2.track,
        list = _Components2$Elements2.list;
    var getAt = Slides.getAt,
        styleSlides = Slides.style;
    var vertical;
    var rootRect;
    var overflow;

    function mount() {
      init();
      bind(window, "resize load", Throttle(apply(emit, EVENT_RESIZE)));
      on([EVENT_UPDATED, EVENT_REFRESH], init);
      on(EVENT_RESIZE, resize);
    }

    function init() {
      vertical = options.direction === TTB;
      style(root, "maxWidth", unit(options.width));
      style(track, resolve("paddingLeft"), cssPadding(false));
      style(track, resolve("paddingRight"), cssPadding(true));
      resize(true);
    }

    function resize(force) {
      var newRect = rect(root);

      if (force || rootRect.width !== newRect.width || rootRect.height !== newRect.height) {
        style(track, "height", cssTrackHeight());
        styleSlides(resolve("marginRight"), unit(options.gap));
        styleSlides("width", cssSlideWidth());
        styleSlides("height", cssSlideHeight(), true);
        rootRect = newRect;
        emit(EVENT_RESIZED);

        if (overflow !== (overflow = isOverflow())) {
          toggleClass(root, CLASS_OVERFLOW, overflow);
          emit(EVENT_OVERFLOW, overflow);
        }
      }
    }

    function cssPadding(right) {
      var padding = options.padding;
      var prop = resolve(right ? "right" : "left");
      return padding && unit(padding[prop] || (isObject(padding) ? 0 : padding)) || "0px";
    }

    function cssTrackHeight() {
      var height = "";

      if (vertical) {
        height = cssHeight();
        assert(height, "height or heightRatio is missing.");
        height = "calc(" + height + " - " + cssPadding(false) + " - " + cssPadding(true) + ")";
      }

      return height;
    }

    function cssHeight() {
      return unit(options.height || rect(list).width * options.heightRatio);
    }

    function cssSlideWidth() {
      return options.autoWidth ? null : unit(options.fixedWidth) || (vertical ? "" : cssSlideSize());
    }

    function cssSlideHeight() {
      return unit(options.fixedHeight) || (vertical ? options.autoHeight ? null : cssSlideSize() : cssHeight());
    }

    function cssSlideSize() {
      var gap = unit(options.gap);
      return "calc((100%" + (gap && " + " + gap) + ")/" + (options.perPage || 1) + (gap && " - " + gap) + ")";
    }

    function listSize() {
      return rect(list)[resolve("width")];
    }

    function slideSize(index, withoutGap) {
      var Slide = getAt(index || 0);
      return Slide ? rect(Slide.slide)[resolve("width")] + (withoutGap ? 0 : getGap()) : 0;
    }

    function totalSize(index, withoutGap) {
      var Slide = getAt(index);

      if (Slide) {
        var right = rect(Slide.slide)[resolve("right")];
        var left = rect(list)[resolve("left")];
        return abs(right - left) + (withoutGap ? 0 : getGap());
      }

      return 0;
    }

    function sliderSize(withoutGap) {
      return totalSize(Splide2.length - 1) - totalSize(0) + slideSize(0, withoutGap);
    }

    function getGap() {
      var Slide = getAt(0);
      return Slide && parseFloat(style(Slide.slide, resolve("marginRight"))) || 0;
    }

    function getPadding(right) {
      return parseFloat(style(track, resolve("padding" + (right ? "Right" : "Left")))) || 0;
    }

    function isOverflow() {
      return Splide2.is(FADE) || sliderSize(true) > listSize();
    }

    return {
      mount: mount,
      resize: resize,
      listSize: listSize,
      slideSize: slideSize,
      sliderSize: sliderSize,
      totalSize: totalSize,
      getPadding: getPadding,
      isOverflow: isOverflow
    };
  }

  var MULTIPLIER = 2;

  function Clones(Splide2, Components2, options) {
    var event = EventInterface(Splide2);
    var on = event.on;
    var Elements = Components2.Elements,
        Slides = Components2.Slides;
    var resolve = Components2.Direction.resolve;
    var clones = [];
    var cloneCount;

    function mount() {
      on(EVENT_REFRESH, remount);
      on([EVENT_UPDATED, EVENT_RESIZE], observe);

      if (cloneCount = computeCloneCount()) {
        generate(cloneCount);
        Components2.Layout.resize(true);
      }
    }

    function remount() {
      destroy();
      mount();
    }

    function destroy() {
      remove(clones);
      empty(clones);
      event.destroy();
    }

    function observe() {
      var count = computeCloneCount();

      if (cloneCount !== count) {
        if (cloneCount < count || !count) {
          event.emit(EVENT_REFRESH);
        }
      }
    }

    function generate(count) {
      var slides = Slides.get().slice();
      var length = slides.length;

      if (length) {
        while (slides.length < count) {
          push(slides, slides);
        }

        push(slides.slice(-count), slides.slice(0, count)).forEach(function (Slide, index) {
          var isHead = index < count;
          var clone = cloneDeep(Slide.slide, index);
          isHead ? before(clone, slides[0].slide) : append(Elements.list, clone);
          push(clones, clone);
          Slides.register(clone, index - count + (isHead ? 0 : length), Slide.index);
        });
      }
    }

    function cloneDeep(elm, index) {
      var clone = elm.cloneNode(true);
      addClass(clone, options.classes.clone);
      clone.id = Splide2.root.id + "-clone" + pad(index + 1);
      return clone;
    }

    function computeCloneCount() {
      var clones2 = options.clones;

      if (!Splide2.is(LOOP)) {
        clones2 = 0;
      } else if (isUndefined(clones2)) {
        var fixedSize = options[resolve("fixedWidth")] && Components2.Layout.slideSize(0);
        var fixedCount = fixedSize && ceil(rect(Elements.track)[resolve("width")] / fixedSize);
        clones2 = fixedCount || options[resolve("autoWidth")] && Splide2.length || options.perPage * MULTIPLIER;
      }

      return clones2;
    }

    return {
      mount: mount,
      destroy: destroy
    };
  }

  function Move(Splide2, Components2, options) {
    var _EventInterface4 = EventInterface(Splide2),
        on = _EventInterface4.on,
        emit = _EventInterface4.emit;

    var set = Splide2.state.set;
    var _Components2$Layout = Components2.Layout,
        slideSize = _Components2$Layout.slideSize,
        getPadding = _Components2$Layout.getPadding,
        totalSize = _Components2$Layout.totalSize,
        listSize = _Components2$Layout.listSize,
        sliderSize = _Components2$Layout.sliderSize;
    var _Components2$Directio = Components2.Direction,
        resolve = _Components2$Directio.resolve,
        orient = _Components2$Directio.orient;
    var _Components2$Elements3 = Components2.Elements,
        list = _Components2$Elements3.list,
        track = _Components2$Elements3.track;
    var Transition;

    function mount() {
      Transition = Components2.Transition;
      on([EVENT_MOUNTED, EVENT_RESIZED, EVENT_UPDATED, EVENT_REFRESH], reposition);
    }

    function reposition() {
      if (!Components2.Controller.isBusy()) {
        Components2.Scroll.cancel();
        jump(Splide2.index);
        Components2.Slides.update();
      }
    }

    function move(dest, index, prev, callback) {
      if (dest !== index && canShift(dest > prev)) {
        cancel();
        translate(shift(getPosition(), dest > prev), true);
      }

      set(MOVING);
      emit(EVENT_MOVE, index, prev, dest);
      Transition.start(index, function () {
        set(IDLE);
        emit(EVENT_MOVED, index, prev, dest);
        callback && callback();
      });
    }

    function jump(index) {
      translate(toPosition(index, true));
    }

    function translate(position, preventLoop) {
      if (!Splide2.is(FADE)) {
        var destination = preventLoop ? position : loop(position);
        style(list, "transform", "translate" + resolve("X") + "(" + destination + "px)");
        position !== destination && emit(EVENT_SHIFTED);
      }
    }

    function loop(position) {
      if (Splide2.is(LOOP)) {
        var index = toIndex(position);
        var exceededMax = index > Components2.Controller.getEnd();
        var exceededMin = index < 0;

        if (exceededMin || exceededMax) {
          position = shift(position, exceededMax);
        }
      }

      return position;
    }

    function shift(position, backwards) {
      var excess = position - getLimit(backwards);
      var size = sliderSize();
      position -= orient(size * (ceil(abs(excess) / size) || 1)) * (backwards ? 1 : -1);
      return position;
    }

    function cancel() {
      translate(getPosition(), true);
      Transition.cancel();
    }

    function toIndex(position) {
      var Slides = Components2.Slides.get();
      var index = 0;
      var minDistance = Infinity;

      for (var i = 0; i < Slides.length; i++) {
        var slideIndex = Slides[i].index;
        var distance = abs(toPosition(slideIndex, true) - position);

        if (distance <= minDistance) {
          minDistance = distance;
          index = slideIndex;
        } else {
          break;
        }
      }

      return index;
    }

    function toPosition(index, trimming) {
      var position = orient(totalSize(index - 1) - offset(index));
      return trimming ? trim(position) : position;
    }

    function getPosition() {
      var left = resolve("left");
      return rect(list)[left] - rect(track)[left] + orient(getPadding(false));
    }

    function trim(position) {
      if (options.trimSpace && Splide2.is(SLIDE)) {
        position = clamp(position, 0, orient(sliderSize(true) - listSize()));
      }

      return position;
    }

    function offset(index) {
      var focus = options.focus;
      return focus === "center" ? (listSize() - slideSize(index, true)) / 2 : +focus * slideSize(index) || 0;
    }

    function getLimit(max) {
      return toPosition(max ? Components2.Controller.getEnd() : 0, !!options.trimSpace);
    }

    function canShift(backwards) {
      var shifted = orient(shift(getPosition(), backwards));
      return backwards ? shifted >= 0 : shifted <= list[resolve("scrollWidth")] - rect(track)[resolve("width")];
    }

    function exceededLimit(max, position) {
      position = isUndefined(position) ? getPosition() : position;
      var exceededMin = max !== true && orient(position) < orient(getLimit(false));
      var exceededMax = max !== false && orient(position) > orient(getLimit(true));
      return exceededMin || exceededMax;
    }

    return {
      mount: mount,
      move: move,
      jump: jump,
      translate: translate,
      shift: shift,
      cancel: cancel,
      toIndex: toIndex,
      toPosition: toPosition,
      getPosition: getPosition,
      getLimit: getLimit,
      exceededLimit: exceededLimit,
      reposition: reposition
    };
  }

  function Controller(Splide2, Components2, options) {
    var _EventInterface5 = EventInterface(Splide2),
        on = _EventInterface5.on,
        emit = _EventInterface5.emit;

    var Move = Components2.Move;
    var getPosition = Move.getPosition,
        getLimit = Move.getLimit,
        toPosition = Move.toPosition;
    var _Components2$Slides = Components2.Slides,
        isEnough = _Components2$Slides.isEnough,
        getLength = _Components2$Slides.getLength;
    var omitEnd = options.omitEnd;
    var isLoop = Splide2.is(LOOP);
    var isSlide = Splide2.is(SLIDE);
    var getNext = apply(getAdjacent, false);
    var getPrev = apply(getAdjacent, true);
    var currIndex = options.start || 0;
    var endIndex;
    var prevIndex = currIndex;
    var slideCount;
    var perMove;
    var perPage;

    function mount() {
      init();
      on([EVENT_UPDATED, EVENT_REFRESH, EVENT_END_INDEX_CHANGED], init);
      on(EVENT_RESIZED, onResized);
    }

    function init() {
      slideCount = getLength(true);
      perMove = options.perMove;
      perPage = options.perPage;
      endIndex = getEnd();
      var index = clamp(currIndex, 0, omitEnd ? endIndex : slideCount - 1);

      if (index !== currIndex) {
        currIndex = index;
        Move.reposition();
      }
    }

    function onResized() {
      if (endIndex !== getEnd()) {
        emit(EVENT_END_INDEX_CHANGED);
      }
    }

    function go(control, allowSameIndex, callback) {
      if (!isBusy()) {
        var dest = parse(control);
        var index = loop(dest);

        if (index > -1 && (allowSameIndex || index !== currIndex)) {
          setIndex(index);
          Move.move(dest, index, prevIndex, callback);
        }
      }
    }

    function scroll(destination, duration, snap, callback) {
      Components2.Scroll.scroll(destination, duration, snap, function () {
        var index = loop(Move.toIndex(getPosition()));
        setIndex(omitEnd ? min(index, endIndex) : index);
        callback && callback();
      });
    }

    function parse(control) {
      var index = currIndex;

      if (isString(control)) {
        var _ref = control.match(/([+\-<>])(\d+)?/) || [],
            indicator = _ref[1],
            number = _ref[2];

        if (indicator === "+" || indicator === "-") {
          index = computeDestIndex(currIndex + +("" + indicator + (+number || 1)), currIndex);
        } else if (indicator === ">") {
          index = number ? toIndex(+number) : getNext(true);
        } else if (indicator === "<") {
          index = getPrev(true);
        }
      } else {
        index = isLoop ? control : clamp(control, 0, endIndex);
      }

      return index;
    }

    function getAdjacent(prev, destination) {
      var number = perMove || (hasFocus() ? 1 : perPage);
      var dest = computeDestIndex(currIndex + number * (prev ? -1 : 1), currIndex, !(perMove || hasFocus()));

      if (dest === -1 && isSlide) {
        if (!approximatelyEqual(getPosition(), getLimit(!prev), 1)) {
          return prev ? 0 : endIndex;
        }
      }

      return destination ? dest : loop(dest);
    }

    function computeDestIndex(dest, from, snapPage) {
      if (isEnough() || hasFocus()) {
        var index = computeMovableDestIndex(dest);

        if (index !== dest) {
          from = dest;
          dest = index;
          snapPage = false;
        }

        if (dest < 0 || dest > endIndex) {
          if (!perMove && (between(0, dest, from, true) || between(endIndex, from, dest, true))) {
            dest = toIndex(toPage(dest));
          } else {
            if (isLoop) {
              dest = snapPage ? dest < 0 ? -(slideCount % perPage || perPage) : slideCount : dest;
            } else if (options.rewind) {
              dest = dest < 0 ? endIndex : 0;
            } else {
              dest = -1;
            }
          }
        } else {
          if (snapPage && dest !== from) {
            dest = toIndex(toPage(from) + (dest < from ? -1 : 1));
          }
        }
      } else {
        dest = -1;
      }

      return dest;
    }

    function computeMovableDestIndex(dest) {
      if (isSlide && options.trimSpace === "move" && dest !== currIndex) {
        var position = getPosition();

        while (position === toPosition(dest, true) && between(dest, 0, Splide2.length - 1, !options.rewind)) {
          dest < currIndex ? --dest : ++dest;
        }
      }

      return dest;
    }

    function loop(index) {
      return isLoop ? (index + slideCount) % slideCount || 0 : index;
    }

    function getEnd() {
      var end = slideCount - (hasFocus() || isLoop && perMove ? 1 : perPage);

      while (omitEnd && end-- > 0) {
        if (toPosition(slideCount - 1, true) !== toPosition(end, true)) {
          end++;
          break;
        }
      }

      return clamp(end, 0, slideCount - 1);
    }

    function toIndex(page) {
      return clamp(hasFocus() ? page : perPage * page, 0, endIndex);
    }

    function toPage(index) {
      return hasFocus() ? min(index, endIndex) : floor((index >= endIndex ? slideCount - 1 : index) / perPage);
    }

    function toDest(destination) {
      var closest = Move.toIndex(destination);
      return isSlide ? clamp(closest, 0, endIndex) : closest;
    }

    function setIndex(index) {
      if (index !== currIndex) {
        prevIndex = currIndex;
        currIndex = index;
      }
    }

    function getIndex(prev) {
      return prev ? prevIndex : currIndex;
    }

    function hasFocus() {
      return !isUndefined(options.focus) || options.isNavigation;
    }

    function isBusy() {
      return Splide2.state.is([MOVING, SCROLLING]) && !!options.waitForTransition;
    }

    return {
      mount: mount,
      go: go,
      scroll: scroll,
      getNext: getNext,
      getPrev: getPrev,
      getAdjacent: getAdjacent,
      getEnd: getEnd,
      setIndex: setIndex,
      getIndex: getIndex,
      toIndex: toIndex,
      toPage: toPage,
      toDest: toDest,
      hasFocus: hasFocus,
      isBusy: isBusy
    };
  }

  var XML_NAME_SPACE = "http://www.w3.org/2000/svg";
  var PATH = "m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z";
  var SIZE = 40;

  function Arrows(Splide2, Components2, options) {
    var event = EventInterface(Splide2);
    var on = event.on,
        bind = event.bind,
        emit = event.emit;
    var classes = options.classes,
        i18n = options.i18n;
    var Elements = Components2.Elements,
        Controller = Components2.Controller;
    var placeholder = Elements.arrows,
        track = Elements.track;
    var wrapper = placeholder;
    var prev = Elements.prev;
    var next = Elements.next;
    var created;
    var wrapperClasses;
    var arrows = {};

    function mount() {
      init();
      on(EVENT_UPDATED, remount);
    }

    function remount() {
      destroy();
      mount();
    }

    function init() {
      var enabled = options.arrows;

      if (enabled && !(prev && next)) {
        createArrows();
      }

      if (prev && next) {
        assign(arrows, {
          prev: prev,
          next: next
        });
        display(wrapper, enabled ? "" : "none");
        addClass(wrapper, wrapperClasses = CLASS_ARROWS + "--" + options.direction);

        if (enabled) {
          listen();
          update();
          setAttribute([prev, next], ARIA_CONTROLS, track.id);
          emit(EVENT_ARROWS_MOUNTED, prev, next);
        }
      }
    }

    function destroy() {
      event.destroy();
      removeClass(wrapper, wrapperClasses);

      if (created) {
        remove(placeholder ? [prev, next] : wrapper);
        prev = next = null;
      } else {
        removeAttribute([prev, next], ALL_ATTRIBUTES);
      }
    }

    function listen() {
      on([EVENT_MOUNTED, EVENT_MOVED, EVENT_REFRESH, EVENT_SCROLLED, EVENT_END_INDEX_CHANGED], update);
      bind(next, "click", apply(go, ">"));
      bind(prev, "click", apply(go, "<"));
    }

    function go(control) {
      Controller.go(control, true);
    }

    function createArrows() {
      wrapper = placeholder || create("div", classes.arrows);
      prev = createArrow(true);
      next = createArrow(false);
      created = true;
      append(wrapper, [prev, next]);
      !placeholder && before(wrapper, track);
    }

    function createArrow(prev2) {
      var arrow = "<button class=\"" + classes.arrow + " " + (prev2 ? classes.prev : classes.next) + "\" type=\"button\"><svg xmlns=\"" + XML_NAME_SPACE + "\" viewBox=\"0 0 " + SIZE + " " + SIZE + "\" width=\"" + SIZE + "\" height=\"" + SIZE + "\" focusable=\"false\"><path d=\"" + (options.arrowPath || PATH) + "\" />";
      return parseHtml(arrow);
    }

    function update() {
      if (prev && next) {
        var index = Splide2.index;
        var prevIndex = Controller.getPrev();
        var nextIndex = Controller.getNext();
        var prevLabel = prevIndex > -1 && index < prevIndex ? i18n.last : i18n.prev;
        var nextLabel = nextIndex > -1 && index > nextIndex ? i18n.first : i18n.next;
        prev.disabled = prevIndex < 0;
        next.disabled = nextIndex < 0;
        setAttribute(prev, ARIA_LABEL, prevLabel);
        setAttribute(next, ARIA_LABEL, nextLabel);
        emit(EVENT_ARROWS_UPDATED, prev, next, prevIndex, nextIndex);
      }
    }

    return {
      arrows: arrows,
      mount: mount,
      destroy: destroy,
      update: update
    };
  }

  var INTERVAL_DATA_ATTRIBUTE = DATA_ATTRIBUTE + "-interval";

  function Autoplay(Splide2, Components2, options) {
    var _EventInterface6 = EventInterface(Splide2),
        on = _EventInterface6.on,
        bind = _EventInterface6.bind,
        emit = _EventInterface6.emit;

    var interval = RequestInterval(options.interval, Splide2.go.bind(Splide2, ">"), onAnimationFrame);
    var isPaused = interval.isPaused;
    var Elements = Components2.Elements,
        _Components2$Elements4 = Components2.Elements,
        root = _Components2$Elements4.root,
        toggle = _Components2$Elements4.toggle;
    var autoplay = options.autoplay;
    var hovered;
    var focused;
    var stopped = autoplay === "pause";

    function mount() {
      if (autoplay) {
        listen();
        toggle && setAttribute(toggle, ARIA_CONTROLS, Elements.track.id);
        stopped || play();
        update();
      }
    }

    function listen() {
      if (options.pauseOnHover) {
        bind(root, "mouseenter mouseleave", function (e) {
          hovered = e.type === "mouseenter";
          autoToggle();
        });
      }

      if (options.pauseOnFocus) {
        bind(root, "focusin focusout", function (e) {
          focused = e.type === "focusin";
          autoToggle();
        });
      }

      if (toggle) {
        bind(toggle, "click", function () {
          stopped ? play() : pause(true);
        });
      }

      on([EVENT_MOVE, EVENT_SCROLL, EVENT_REFRESH], interval.rewind);
      on(EVENT_MOVE, onMove);
    }

    function play() {
      if (isPaused() && Components2.Slides.isEnough()) {
        interval.start(!options.resetProgress);
        focused = hovered = stopped = false;
        update();
        emit(EVENT_AUTOPLAY_PLAY);
      }
    }

    function pause(stop) {
      if (stop === void 0) {
        stop = true;
      }

      stopped = !!stop;
      update();

      if (!isPaused()) {
        interval.pause();
        emit(EVENT_AUTOPLAY_PAUSE);
      }
    }

    function autoToggle() {
      if (!stopped) {
        hovered || focused ? pause(false) : play();
      }
    }

    function update() {
      if (toggle) {
        toggleClass(toggle, CLASS_ACTIVE, !stopped);
        setAttribute(toggle, ARIA_LABEL, options.i18n[stopped ? "play" : "pause"]);
      }
    }

    function onAnimationFrame(rate) {
      var bar = Elements.bar;
      bar && style(bar, "width", rate * 100 + "%");
      emit(EVENT_AUTOPLAY_PLAYING, rate);
    }

    function onMove(index) {
      var Slide = Components2.Slides.getAt(index);
      interval.set(Slide && +getAttribute(Slide.slide, INTERVAL_DATA_ATTRIBUTE) || options.interval);
    }

    return {
      mount: mount,
      destroy: interval.cancel,
      play: play,
      pause: pause,
      isPaused: isPaused
    };
  }

  function Cover(Splide2, Components2, options) {
    var _EventInterface7 = EventInterface(Splide2),
        on = _EventInterface7.on;

    function mount() {
      if (options.cover) {
        on(EVENT_LAZYLOAD_LOADED, apply(toggle, true));
        on([EVENT_MOUNTED, EVENT_UPDATED, EVENT_REFRESH], apply(cover, true));
      }
    }

    function cover(cover2) {
      Components2.Slides.forEach(function (Slide) {
        var img = child(Slide.container || Slide.slide, "img");

        if (img && img.src) {
          toggle(cover2, img, Slide);
        }
      });
    }

    function toggle(cover2, img, Slide) {
      Slide.style("background", cover2 ? "center/cover no-repeat url(\"" + img.src + "\")" : "", true);
      display(img, cover2 ? "none" : "");
    }

    return {
      mount: mount,
      destroy: apply(cover, false)
    };
  }

  var BOUNCE_DIFF_THRESHOLD = 10;
  var BOUNCE_DURATION = 600;
  var FRICTION_FACTOR = 0.6;
  var BASE_VELOCITY = 1.5;
  var MIN_DURATION = 800;

  function Scroll(Splide2, Components2, options) {
    var _EventInterface8 = EventInterface(Splide2),
        on = _EventInterface8.on,
        emit = _EventInterface8.emit;

    var set = Splide2.state.set;
    var Move = Components2.Move;
    var getPosition = Move.getPosition,
        getLimit = Move.getLimit,
        exceededLimit = Move.exceededLimit,
        translate = Move.translate;
    var isSlide = Splide2.is(SLIDE);
    var interval;
    var callback;
    var friction = 1;

    function mount() {
      on(EVENT_MOVE, clear);
      on([EVENT_UPDATED, EVENT_REFRESH], cancel);
    }

    function scroll(destination, duration, snap, onScrolled, noConstrain) {
      var from = getPosition();
      clear();

      if (snap && (!isSlide || !exceededLimit())) {
        var size = Components2.Layout.sliderSize();
        var offset = sign(destination) * size * floor(abs(destination) / size) || 0;
        destination = Move.toPosition(Components2.Controller.toDest(destination % size)) + offset;
      }

      var noDistance = approximatelyEqual(from, destination, 1);
      friction = 1;
      duration = noDistance ? 0 : duration || max(abs(destination - from) / BASE_VELOCITY, MIN_DURATION);
      callback = onScrolled;
      interval = RequestInterval(duration, onEnd, apply(update, from, destination, noConstrain), 1);
      set(SCROLLING);
      emit(EVENT_SCROLL);
      interval.start();
    }

    function onEnd() {
      set(IDLE);
      callback && callback();
      emit(EVENT_SCROLLED);
    }

    function update(from, to, noConstrain, rate) {
      var position = getPosition();
      var target = from + (to - from) * easing(rate);
      var diff = (target - position) * friction;
      translate(position + diff);

      if (isSlide && !noConstrain && exceededLimit()) {
        friction *= FRICTION_FACTOR;

        if (abs(diff) < BOUNCE_DIFF_THRESHOLD) {
          scroll(getLimit(exceededLimit(true)), BOUNCE_DURATION, false, callback, true);
        }
      }
    }

    function clear() {
      if (interval) {
        interval.cancel();
      }
    }

    function cancel() {
      if (interval && !interval.isPaused()) {
        clear();
        onEnd();
      }
    }

    function easing(t) {
      var easingFunc = options.easingFunc;
      return easingFunc ? easingFunc(t) : 1 - Math.pow(1 - t, 4);
    }

    return {
      mount: mount,
      destroy: clear,
      scroll: scroll,
      cancel: cancel
    };
  }

  var SCROLL_LISTENER_OPTIONS = {
    passive: false,
    capture: true
  };

  function Drag(Splide2, Components2, options) {
    var _EventInterface9 = EventInterface(Splide2),
        on = _EventInterface9.on,
        emit = _EventInterface9.emit,
        bind = _EventInterface9.bind,
        unbind = _EventInterface9.unbind;

    var state = Splide2.state;
    var Move = Components2.Move,
        Scroll = Components2.Scroll,
        Controller = Components2.Controller,
        track = Components2.Elements.track,
        reduce = Components2.Media.reduce;
    var _Components2$Directio2 = Components2.Direction,
        resolve = _Components2$Directio2.resolve,
        orient = _Components2$Directio2.orient;
    var getPosition = Move.getPosition,
        exceededLimit = Move.exceededLimit;
    var basePosition;
    var baseEvent;
    var prevBaseEvent;
    var isFree;
    var dragging;
    var exceeded = false;
    var clickPrevented;
    var disabled;
    var target;

    function mount() {
      bind(track, POINTER_MOVE_EVENTS, noop, SCROLL_LISTENER_OPTIONS);
      bind(track, POINTER_UP_EVENTS, noop, SCROLL_LISTENER_OPTIONS);
      bind(track, POINTER_DOWN_EVENTS, onPointerDown, SCROLL_LISTENER_OPTIONS);
      bind(track, "click", onClick, {
        capture: true
      });
      bind(track, "dragstart", prevent);
      on([EVENT_MOUNTED, EVENT_UPDATED], init);
    }

    function init() {
      var drag = options.drag;
      disable(!drag);
      isFree = drag === "free";
    }

    function onPointerDown(e) {
      clickPrevented = false;

      if (!disabled) {
        var isTouch = isTouchEvent(e);

        if (isDraggable(e.target) && (isTouch || !e.button)) {
          if (!Controller.isBusy()) {
            target = isTouch ? track : window;
            dragging = state.is([MOVING, SCROLLING]);
            prevBaseEvent = null;
            bind(target, POINTER_MOVE_EVENTS, onPointerMove, SCROLL_LISTENER_OPTIONS);
            bind(target, POINTER_UP_EVENTS, onPointerUp, SCROLL_LISTENER_OPTIONS);
            Move.cancel();
            Scroll.cancel();
            save(e);
          } else {
            prevent(e, true);
          }
        }
      }
    }

    function onPointerMove(e) {
      if (!state.is(DRAGGING)) {
        state.set(DRAGGING);
        emit(EVENT_DRAG);
      }

      if (e.cancelable) {
        if (dragging) {
          Move.translate(basePosition + constrain(diffCoord(e)));
          var expired = diffTime(e) > LOG_INTERVAL;
          var hasExceeded = exceeded !== (exceeded = exceededLimit());

          if (expired || hasExceeded) {
            save(e);
          }

          clickPrevented = true;
          emit(EVENT_DRAGGING);
          prevent(e);
        } else if (isSliderDirection(e)) {
          dragging = shouldStart(e);
          prevent(e);
        }
      }
    }

    function onPointerUp(e) {
      if (state.is(DRAGGING)) {
        state.set(IDLE);
        emit(EVENT_DRAGGED);
      }

      if (dragging) {
        move(e);
        prevent(e);
      }

      unbind(target, POINTER_MOVE_EVENTS, onPointerMove);
      unbind(target, POINTER_UP_EVENTS, onPointerUp);
      dragging = false;
    }

    function onClick(e) {
      if (!disabled && clickPrevented) {
        prevent(e, true);
      }
    }

    function save(e) {
      prevBaseEvent = baseEvent;
      baseEvent = e;
      basePosition = getPosition();
    }

    function move(e) {
      var velocity = computeVelocity(e);
      var destination = computeDestination(velocity);
      var rewind = options.rewind && options.rewindByDrag;
      reduce(false);

      if (isFree) {
        Controller.scroll(destination, 0, options.snap);
      } else if (Splide2.is(FADE)) {
        Controller.go(orient(sign(velocity)) < 0 ? rewind ? "<" : "-" : rewind ? ">" : "+");
      } else if (Splide2.is(SLIDE) && exceeded && rewind) {
        Controller.go(exceededLimit(true) ? ">" : "<");
      } else {
        Controller.go(Controller.toDest(destination), true);
      }

      reduce(true);
    }

    function shouldStart(e) {
      var thresholds = options.dragMinThreshold;
      var isObj = isObject(thresholds);
      var mouse = isObj && thresholds.mouse || 0;
      var touch = (isObj ? thresholds.touch : +thresholds) || 10;
      return abs(diffCoord(e)) > (isTouchEvent(e) ? touch : mouse);
    }

    function isSliderDirection(e) {
      return abs(diffCoord(e)) > abs(diffCoord(e, true));
    }

    function computeVelocity(e) {
      if (Splide2.is(LOOP) || !exceeded) {
        var time = diffTime(e);

        if (time && time < LOG_INTERVAL) {
          return diffCoord(e) / time;
        }
      }

      return 0;
    }

    function computeDestination(velocity) {
      return getPosition() + sign(velocity) * min(abs(velocity) * (options.flickPower || 600), isFree ? Infinity : Components2.Layout.listSize() * (options.flickMaxPages || 1));
    }

    function diffCoord(e, orthogonal) {
      return coordOf(e, orthogonal) - coordOf(getBaseEvent(e), orthogonal);
    }

    function diffTime(e) {
      return timeOf(e) - timeOf(getBaseEvent(e));
    }

    function getBaseEvent(e) {
      return baseEvent === e && prevBaseEvent || baseEvent;
    }

    function coordOf(e, orthogonal) {
      return (isTouchEvent(e) ? e.changedTouches[0] : e)["page" + resolve(orthogonal ? "Y" : "X")];
    }

    function constrain(diff) {
      return diff / (exceeded && Splide2.is(SLIDE) ? FRICTION : 1);
    }

    function isDraggable(target2) {
      var noDrag = options.noDrag;
      return !matches(target2, "." + CLASS_PAGINATION_PAGE + ", ." + CLASS_ARROW) && (!noDrag || !matches(target2, noDrag));
    }

    function isTouchEvent(e) {
      return typeof TouchEvent !== "undefined" && e instanceof TouchEvent;
    }

    function isDragging() {
      return dragging;
    }

    function disable(value) {
      disabled = value;
    }

    return {
      mount: mount,
      disable: disable,
      isDragging: isDragging
    };
  }

  var NORMALIZATION_MAP = {
    Spacebar: " ",
    Right: ARROW_RIGHT,
    Left: ARROW_LEFT,
    Up: ARROW_UP,
    Down: ARROW_DOWN
  };

  function normalizeKey(key) {
    key = isString(key) ? key : key.key;
    return NORMALIZATION_MAP[key] || key;
  }

  var KEYBOARD_EVENT = "keydown";

  function Keyboard(Splide2, Components2, options) {
    var _EventInterface10 = EventInterface(Splide2),
        on = _EventInterface10.on,
        bind = _EventInterface10.bind,
        unbind = _EventInterface10.unbind;

    var root = Splide2.root;
    var resolve = Components2.Direction.resolve;
    var target;
    var disabled;

    function mount() {
      init();
      on(EVENT_UPDATED, destroy);
      on(EVENT_UPDATED, init);
      on(EVENT_MOVE, onMove);
    }

    function init() {
      var keyboard = options.keyboard;

      if (keyboard) {
        target = keyboard === "global" ? window : root;
        bind(target, KEYBOARD_EVENT, onKeydown);
      }
    }

    function destroy() {
      unbind(target, KEYBOARD_EVENT);
    }

    function disable(value) {
      disabled = value;
    }

    function onMove() {
      var _disabled = disabled;
      disabled = true;
      nextTick(function () {
        disabled = _disabled;
      });
    }

    function onKeydown(e) {
      if (!disabled) {
        var key = normalizeKey(e);

        if (key === resolve(ARROW_LEFT)) {
          Splide2.go("<");
        } else if (key === resolve(ARROW_RIGHT)) {
          Splide2.go(">");
        }
      }
    }

    return {
      mount: mount,
      destroy: destroy,
      disable: disable
    };
  }

  var SRC_DATA_ATTRIBUTE = DATA_ATTRIBUTE + "-lazy";
  var SRCSET_DATA_ATTRIBUTE = SRC_DATA_ATTRIBUTE + "-srcset";
  var IMAGE_SELECTOR = "[" + SRC_DATA_ATTRIBUTE + "], [" + SRCSET_DATA_ATTRIBUTE + "]";

  function LazyLoad(Splide2, Components2, options) {
    var _EventInterface11 = EventInterface(Splide2),
        on = _EventInterface11.on,
        off = _EventInterface11.off,
        bind = _EventInterface11.bind,
        emit = _EventInterface11.emit;

    var isSequential = options.lazyLoad === "sequential";
    var events = [EVENT_MOVED, EVENT_SCROLLED];
    var entries = [];

    function mount() {
      if (options.lazyLoad) {
        init();
        on(EVENT_REFRESH, init);
      }
    }

    function init() {
      empty(entries);
      register();

      if (isSequential) {
        loadNext();
      } else {
        off(events);
        on(events, check);
        check();
      }
    }

    function register() {
      Components2.Slides.forEach(function (Slide) {
        queryAll(Slide.slide, IMAGE_SELECTOR).forEach(function (img) {
          var src = getAttribute(img, SRC_DATA_ATTRIBUTE);
          var srcset = getAttribute(img, SRCSET_DATA_ATTRIBUTE);

          if (src !== img.src || srcset !== img.srcset) {
            var className = options.classes.spinner;
            var parent = img.parentElement;
            var spinner = child(parent, "." + className) || create("span", className, parent);
            entries.push([img, Slide, spinner]);
            img.src || display(img, "none");
          }
        });
      });
    }

    function check() {
      entries = entries.filter(function (data) {
        var distance = options.perPage * ((options.preloadPages || 1) + 1) - 1;
        return data[1].isWithin(Splide2.index, distance) ? load(data) : true;
      });
      entries.length || off(events);
    }

    function load(data) {
      var img = data[0];
      addClass(data[1].slide, CLASS_LOADING);
      bind(img, "load error", apply(onLoad, data));
      setAttribute(img, "src", getAttribute(img, SRC_DATA_ATTRIBUTE));
      setAttribute(img, "srcset", getAttribute(img, SRCSET_DATA_ATTRIBUTE));
      removeAttribute(img, SRC_DATA_ATTRIBUTE);
      removeAttribute(img, SRCSET_DATA_ATTRIBUTE);
    }

    function onLoad(data, e) {
      var img = data[0],
          Slide = data[1];
      removeClass(Slide.slide, CLASS_LOADING);

      if (e.type !== "error") {
        remove(data[2]);
        display(img, "");
        emit(EVENT_LAZYLOAD_LOADED, img, Slide);
        emit(EVENT_RESIZE);
      }

      isSequential && loadNext();
    }

    function loadNext() {
      entries.length && load(entries.shift());
    }

    return {
      mount: mount,
      destroy: apply(empty, entries),
      check: check
    };
  }

  function Pagination(Splide2, Components2, options) {
    var event = EventInterface(Splide2);
    var on = event.on,
        emit = event.emit,
        bind = event.bind;
    var Slides = Components2.Slides,
        Elements = Components2.Elements,
        Controller = Components2.Controller;
    var hasFocus = Controller.hasFocus,
        getIndex = Controller.getIndex,
        go = Controller.go;
    var resolve = Components2.Direction.resolve;
    var placeholder = Elements.pagination;
    var items = [];
    var list;
    var paginationClasses;

    function mount() {
      destroy();
      on([EVENT_UPDATED, EVENT_REFRESH, EVENT_END_INDEX_CHANGED], mount);
      var enabled = options.pagination;
      placeholder && display(placeholder, enabled ? "" : "none");

      if (enabled) {
        on([EVENT_MOVE, EVENT_SCROLL, EVENT_SCROLLED], update);
        createPagination();
        update();
        emit(EVENT_PAGINATION_MOUNTED, {
          list: list,
          items: items
        }, getAt(Splide2.index));
      }
    }

    function destroy() {
      if (list) {
        remove(placeholder ? slice(list.children) : list);
        removeClass(list, paginationClasses);
        empty(items);
        list = null;
      }

      event.destroy();
    }

    function createPagination() {
      var length = Splide2.length;
      var classes = options.classes,
          i18n = options.i18n,
          perPage = options.perPage;
      var max = hasFocus() ? Controller.getEnd() + 1 : ceil(length / perPage);
      list = placeholder || create("ul", classes.pagination, Elements.track.parentElement);
      addClass(list, paginationClasses = CLASS_PAGINATION + "--" + getDirection());
      setAttribute(list, ROLE, "tablist");
      setAttribute(list, ARIA_LABEL, i18n.select);
      setAttribute(list, ARIA_ORIENTATION, getDirection() === TTB ? "vertical" : "");

      for (var i = 0; i < max; i++) {
        var li = create("li", null, list);
        var button = create("button", {
          class: classes.page,
          type: "button"
        }, li);
        var controls = Slides.getIn(i).map(function (Slide) {
          return Slide.slide.id;
        });
        var text = !hasFocus() && perPage > 1 ? i18n.pageX : i18n.slideX;
        bind(button, "click", apply(onClick, i));

        if (options.paginationKeyboard) {
          bind(button, "keydown", apply(onKeydown, i));
        }

        setAttribute(li, ROLE, "presentation");
        setAttribute(button, ROLE, "tab");
        setAttribute(button, ARIA_CONTROLS, controls.join(" "));
        setAttribute(button, ARIA_LABEL, format(text, i + 1));
        setAttribute(button, TAB_INDEX, -1);
        items.push({
          li: li,
          button: button,
          page: i
        });
      }
    }

    function onClick(page) {
      go(">" + page, true);
    }

    function onKeydown(page, e) {
      var length = items.length;
      var key = normalizeKey(e);
      var dir = getDirection();
      var nextPage = -1;

      if (key === resolve(ARROW_RIGHT, false, dir)) {
        nextPage = ++page % length;
      } else if (key === resolve(ARROW_LEFT, false, dir)) {
        nextPage = (--page + length) % length;
      } else if (key === "Home") {
        nextPage = 0;
      } else if (key === "End") {
        nextPage = length - 1;
      }

      var item = items[nextPage];

      if (item) {
        focus(item.button);
        go(">" + nextPage);
        prevent(e, true);
      }
    }

    function getDirection() {
      return options.paginationDirection || options.direction;
    }

    function getAt(index) {
      return items[Controller.toPage(index)];
    }

    function update() {
      var prev = getAt(getIndex(true));
      var curr = getAt(getIndex());

      if (prev) {
        var button = prev.button;
        removeClass(button, CLASS_ACTIVE);
        removeAttribute(button, ARIA_SELECTED);
        setAttribute(button, TAB_INDEX, -1);
      }

      if (curr) {
        var _button = curr.button;
        addClass(_button, CLASS_ACTIVE);
        setAttribute(_button, ARIA_SELECTED, true);
        setAttribute(_button, TAB_INDEX, "");
      }

      emit(EVENT_PAGINATION_UPDATED, {
        list: list,
        items: items
      }, prev, curr);
    }

    return {
      items: items,
      mount: mount,
      destroy: destroy,
      getAt: getAt,
      update: update
    };
  }

  var TRIGGER_KEYS = [" ", "Enter"];

  function Sync(Splide2, Components2, options) {
    var isNavigation = options.isNavigation,
        slideFocus = options.slideFocus;
    var events = [];

    function mount() {
      Splide2.splides.forEach(function (target) {
        if (!target.isParent) {
          sync(Splide2, target.splide);
          sync(target.splide, Splide2);
        }
      });

      if (isNavigation) {
        navigate();
      }
    }

    function destroy() {
      events.forEach(function (event) {
        event.destroy();
      });
      empty(events);
    }

    function remount() {
      destroy();
      mount();
    }

    function sync(splide, target) {
      var event = EventInterface(splide);
      event.on(EVENT_MOVE, function (index, prev, dest) {
        target.go(target.is(LOOP) ? dest : index);
      });
      events.push(event);
    }

    function navigate() {
      var event = EventInterface(Splide2);
      var on = event.on;
      on(EVENT_CLICK, onClick);
      on(EVENT_SLIDE_KEYDOWN, onKeydown);
      on([EVENT_MOUNTED, EVENT_UPDATED], update);
      events.push(event);
      event.emit(EVENT_NAVIGATION_MOUNTED, Splide2.splides);
    }

    function update() {
      setAttribute(Components2.Elements.list, ARIA_ORIENTATION, options.direction === TTB ? "vertical" : "");
    }

    function onClick(Slide) {
      Splide2.go(Slide.index);
    }

    function onKeydown(Slide, e) {
      if (includes(TRIGGER_KEYS, normalizeKey(e))) {
        onClick(Slide);
        prevent(e);
      }
    }

    return {
      setup: apply(Components2.Media.set, {
        slideFocus: isUndefined(slideFocus) ? isNavigation : slideFocus
      }, true),
      mount: mount,
      destroy: destroy,
      remount: remount
    };
  }

  function Wheel(Splide2, Components2, options) {
    var _EventInterface12 = EventInterface(Splide2),
        bind = _EventInterface12.bind;

    var lastTime = 0;

    function mount() {
      if (options.wheel) {
        bind(Components2.Elements.track, "wheel", onWheel, SCROLL_LISTENER_OPTIONS);
      }
    }

    function onWheel(e) {
      if (e.cancelable) {
        var deltaY = e.deltaY;
        var backwards = deltaY < 0;
        var timeStamp = timeOf(e);

        var _min = options.wheelMinThreshold || 0;

        var sleep = options.wheelSleep || 0;

        if (abs(deltaY) > _min && timeStamp - lastTime > sleep) {
          Splide2.go(backwards ? "<" : ">");
          lastTime = timeStamp;
        }

        shouldPrevent(backwards) && prevent(e);
      }
    }

    function shouldPrevent(backwards) {
      return !options.releaseWheel || Splide2.state.is(MOVING) || Components2.Controller.getAdjacent(backwards) !== -1;
    }

    return {
      mount: mount
    };
  }

  var SR_REMOVAL_DELAY = 90;

  function Live(Splide2, Components2, options) {
    var _EventInterface13 = EventInterface(Splide2),
        on = _EventInterface13.on;

    var track = Components2.Elements.track;
    var enabled = options.live && !options.isNavigation;
    var sr = create("span", CLASS_SR);
    var interval = RequestInterval(SR_REMOVAL_DELAY, apply(toggle, false));

    function mount() {
      if (enabled) {
        disable(!Components2.Autoplay.isPaused());
        setAttribute(track, ARIA_ATOMIC, true);
        sr.textContent = "\u2026";
        on(EVENT_AUTOPLAY_PLAY, apply(disable, true));
        on(EVENT_AUTOPLAY_PAUSE, apply(disable, false));
        on([EVENT_MOVED, EVENT_SCROLLED], apply(toggle, true));
      }
    }

    function toggle(active) {
      setAttribute(track, ARIA_BUSY, active);

      if (active) {
        append(track, sr);
        interval.start();
      } else {
        remove(sr);
        interval.cancel();
      }
    }

    function destroy() {
      removeAttribute(track, [ARIA_LIVE, ARIA_ATOMIC, ARIA_BUSY]);
      remove(sr);
    }

    function disable(disabled) {
      if (enabled) {
        setAttribute(track, ARIA_LIVE, disabled ? "off" : "polite");
      }
    }

    return {
      mount: mount,
      disable: disable,
      destroy: destroy
    };
  }

  var ComponentConstructors = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Media: Media,
    Direction: Direction,
    Elements: Elements,
    Slides: Slides,
    Layout: Layout,
    Clones: Clones,
    Move: Move,
    Controller: Controller,
    Arrows: Arrows,
    Autoplay: Autoplay,
    Cover: Cover,
    Scroll: Scroll,
    Drag: Drag,
    Keyboard: Keyboard,
    LazyLoad: LazyLoad,
    Pagination: Pagination,
    Sync: Sync,
    Wheel: Wheel,
    Live: Live
  });
  var I18N = {
    prev: "Previous slide",
    next: "Next slide",
    first: "Go to first slide",
    last: "Go to last slide",
    slideX: "Go to slide %s",
    pageX: "Go to page %s",
    play: "Start autoplay",
    pause: "Pause autoplay",
    carousel: "carousel",
    slide: "slide",
    select: "Select a slide to show",
    slideLabel: "%s of %s"
  };
  var DEFAULTS = {
    type: "slide",
    role: "region",
    speed: 400,
    perPage: 1,
    cloneStatus: true,
    arrows: true,
    pagination: true,
    paginationKeyboard: true,
    interval: 5e3,
    pauseOnHover: true,
    pauseOnFocus: true,
    resetProgress: true,
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    drag: true,
    direction: "ltr",
    trimSpace: true,
    focusableNodes: "a, button, textarea, input, select, iframe",
    live: true,
    classes: CLASSES,
    i18n: I18N,
    reducedMotion: {
      speed: 0,
      rewindSpeed: 0,
      autoplay: "pause"
    }
  };

  function Fade(Splide2, Components2, options) {
    var Slides = Components2.Slides;

    function mount() {
      EventInterface(Splide2).on([EVENT_MOUNTED, EVENT_REFRESH], init);
    }

    function init() {
      Slides.forEach(function (Slide) {
        Slide.style("transform", "translateX(-" + 100 * Slide.index + "%)");
      });
    }

    function start(index, done) {
      Slides.style("transition", "opacity " + options.speed + "ms " + options.easing);
      nextTick(done);
    }

    return {
      mount: mount,
      start: start,
      cancel: noop
    };
  }

  function Slide(Splide2, Components2, options) {
    var Move = Components2.Move,
        Controller = Components2.Controller,
        Scroll = Components2.Scroll;
    var list = Components2.Elements.list;
    var transition = apply(style, list, "transition");
    var endCallback;

    function mount() {
      EventInterface(Splide2).bind(list, "transitionend", function (e) {
        if (e.target === list && endCallback) {
          cancel();
          endCallback();
        }
      });
    }

    function start(index, done) {
      var destination = Move.toPosition(index, true);
      var position = Move.getPosition();
      var speed = getSpeed(index);

      if (abs(destination - position) >= 1 && speed >= 1) {
        if (options.useScroll) {
          Scroll.scroll(destination, speed, false, done);
        } else {
          transition("transform " + speed + "ms " + options.easing);
          Move.translate(destination, true);
          endCallback = done;
        }
      } else {
        Move.jump(index);
        done();
      }
    }

    function cancel() {
      transition("");
      Scroll.cancel();
    }

    function getSpeed(index) {
      var rewindSpeed = options.rewindSpeed;

      if (Splide2.is(SLIDE) && rewindSpeed) {
        var prev = Controller.getIndex(true);
        var end = Controller.getEnd();

        if (prev === 0 && index >= end || prev >= end && index === 0) {
          return rewindSpeed;
        }
      }

      return options.speed;
    }

    return {
      mount: mount,
      start: start,
      cancel: cancel
    };
  }

  var _Splide = /*#__PURE__*/function () {
    function _Splide(target, options) {
      this.event = EventInterface();
      this.Components = {};
      this.state = State(CREATED);
      this.splides = [];
      this._o = {};
      this._E = {};
      var root = isString(target) ? query(document, target) : target;
      assert(root, root + " is invalid.");
      this.root = root;
      options = merge({
        label: getAttribute(root, ARIA_LABEL) || "",
        labelledby: getAttribute(root, ARIA_LABELLEDBY) || ""
      }, DEFAULTS, _Splide.defaults, options || {});

      try {
        merge(options, JSON.parse(getAttribute(root, DATA_ATTRIBUTE)));
      } catch (e) {
        assert(false, "Invalid JSON");
      }

      this._o = Object.create(merge({}, options));
    }

    var _proto = _Splide.prototype;

    _proto.mount = function mount(Extensions, Transition) {
      var _this = this;

      var state = this.state,
          Components2 = this.Components;
      assert(state.is([CREATED, DESTROYED]), "Already mounted!");
      state.set(CREATED);
      this._C = Components2;
      this._T = Transition || this._T || (this.is(FADE) ? Fade : Slide);
      this._E = Extensions || this._E;
      var Constructors = assign({}, ComponentConstructors, this._E, {
        Transition: this._T
      });
      forOwn(Constructors, function (Component, key) {
        var component = Component(_this, Components2, _this._o);
        Components2[key] = component;
        component.setup && component.setup();
      });
      forOwn(Components2, function (component) {
        component.mount && component.mount();
      });
      this.emit(EVENT_MOUNTED);
      addClass(this.root, CLASS_INITIALIZED);
      state.set(IDLE);
      this.emit(EVENT_READY);
      return this;
    };

    _proto.sync = function sync(splide) {
      this.splides.push({
        splide: splide
      });
      splide.splides.push({
        splide: this,
        isParent: true
      });

      if (this.state.is(IDLE)) {
        this._C.Sync.remount();

        splide.Components.Sync.remount();
      }

      return this;
    };

    _proto.go = function go(control) {
      this._C.Controller.go(control);

      return this;
    };

    _proto.on = function on(events, callback) {
      this.event.on(events, callback);
      return this;
    };

    _proto.off = function off(events) {
      this.event.off(events);
      return this;
    };

    _proto.emit = function emit(event) {
      var _this$event;

      (_this$event = this.event).emit.apply(_this$event, [event].concat(slice(arguments, 1)));

      return this;
    };

    _proto.add = function add(slides, index) {
      this._C.Slides.add(slides, index);

      return this;
    };

    _proto.remove = function remove(matcher) {
      this._C.Slides.remove(matcher);

      return this;
    };

    _proto.is = function is(type) {
      return this._o.type === type;
    };

    _proto.refresh = function refresh() {
      this.emit(EVENT_REFRESH);
      return this;
    };

    _proto.destroy = function destroy(completely) {
      if (completely === void 0) {
        completely = true;
      }

      var event = this.event,
          state = this.state;

      if (state.is(CREATED)) {
        EventInterface(this).on(EVENT_READY, this.destroy.bind(this, completely));
      } else {
        forOwn(this._C, function (component) {
          component.destroy && component.destroy(completely);
        }, true);
        event.emit(EVENT_DESTROY);
        event.destroy();
        completely && empty(this.splides);
        state.set(DESTROYED);
      }

      return this;
    };

    _createClass(_Splide, [{
      key: "options",
      get: function get() {
        return this._o;
      },
      set: function set(options) {
        this._C.Media.set(options, true, true);
      }
    }, {
      key: "length",
      get: function get() {
        return this._C.Slides.getLength(true);
      }
    }, {
      key: "index",
      get: function get() {
        return this._C.Controller.getIndex();
      }
    }]);

    return _Splide;
  }();

  var Splide = _Splide;
  Splide.defaults = {};
  Splide.STATES = STATES;
  return Splide;
});

/*!
  * Bootstrap v5.3.1 (https://getbootstrap.com/)
  * Copyright 2011-2023 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@popperjs/core')) :
  typeof define === 'function' && define.amd ? define(['@popperjs/core'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.bootstrap = factory(global.Popper));
})(this, (function (Popper) { 'use strict';

  function _interopNamespaceDefault(e) {
    const n = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } });
    if (e) {
      for (const k in e) {
        if (k !== 'default') {
          const d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: () => e[k]
          });
        }
      }
    }
    n.default = e;
    return Object.freeze(n);
  }

  const Popper__namespace = /*#__PURE__*/_interopNamespaceDefault(Popper);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap dom/data.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * Constants
   */

  const elementMap = new Map();
  const Data = {
    set(element, key, instance) {
      if (!elementMap.has(element)) {
        elementMap.set(element, new Map());
      }
      const instanceMap = elementMap.get(element);

      // make it clear we only want one instance per element
      // can be removed later when multiple key/instances are fine to be used
      if (!instanceMap.has(key) && instanceMap.size !== 0) {
        // eslint-disable-next-line no-console
        console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
        return;
      }
      instanceMap.set(key, instance);
    },
    get(element, key) {
      if (elementMap.has(element)) {
        return elementMap.get(element).get(key) || null;
      }
      return null;
    },
    remove(element, key) {
      if (!elementMap.has(element)) {
        return;
      }
      const instanceMap = elementMap.get(element);
      instanceMap.delete(key);

      // free up element references if there are no instances left for an element
      if (instanceMap.size === 0) {
        elementMap.delete(element);
      }
    }
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  const MAX_UID = 1000000;
  const MILLISECONDS_MULTIPLIER = 1000;
  const TRANSITION_END = 'transitionend';

  /**
   * Properly escape IDs selectors to handle weird IDs
   * @param {string} selector
   * @returns {string}
   */
  const parseSelector = selector => {
    if (selector && window.CSS && window.CSS.escape) {
      // document.querySelector needs escaping to handle IDs (html5+) containing for instance /
      selector = selector.replace(/#([^\s"#']+)/g, (match, id) => `#${CSS.escape(id)}`);
    }
    return selector;
  };

  // Shout-out Angus Croll (https://goo.gl/pxwQGp)
  const toType = object => {
    if (object === null || object === undefined) {
      return `${object}`;
    }
    return Object.prototype.toString.call(object).match(/\s([a-z]+)/i)[1].toLowerCase();
  };

  /**
   * Public Util API
   */

  const getUID = prefix => {
    do {
      prefix += Math.floor(Math.random() * MAX_UID);
    } while (document.getElementById(prefix));
    return prefix;
  };
  const getTransitionDurationFromElement = element => {
    if (!element) {
      return 0;
    }

    // Get transition-duration of the element
    let {
      transitionDuration,
      transitionDelay
    } = window.getComputedStyle(element);
    const floatTransitionDuration = Number.parseFloat(transitionDuration);
    const floatTransitionDelay = Number.parseFloat(transitionDelay);

    // Return 0 if element or transition duration is not found
    if (!floatTransitionDuration && !floatTransitionDelay) {
      return 0;
    }

    // If multiple durations are defined, take the first
    transitionDuration = transitionDuration.split(',')[0];
    transitionDelay = transitionDelay.split(',')[0];
    return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
  };
  const triggerTransitionEnd = element => {
    element.dispatchEvent(new Event(TRANSITION_END));
  };
  const isElement = object => {
    if (!object || typeof object !== 'object') {
      return false;
    }
    if (typeof object.jquery !== 'undefined') {
      object = object[0];
    }
    return typeof object.nodeType !== 'undefined';
  };
  const getElement = object => {
    // it's a jQuery object or a node element
    if (isElement(object)) {
      return object.jquery ? object[0] : object;
    }
    if (typeof object === 'string' && object.length > 0) {
      return document.querySelector(parseSelector(object));
    }
    return null;
  };
  const isVisible = element => {
    if (!isElement(element) || element.getClientRects().length === 0) {
      return false;
    }
    const elementIsVisible = getComputedStyle(element).getPropertyValue('visibility') === 'visible';
    // Handle `details` element as its content may falsie appear visible when it is closed
    const closedDetails = element.closest('details:not([open])');
    if (!closedDetails) {
      return elementIsVisible;
    }
    if (closedDetails !== element) {
      const summary = element.closest('summary');
      if (summary && summary.parentNode !== closedDetails) {
        return false;
      }
      if (summary === null) {
        return false;
      }
    }
    return elementIsVisible;
  };
  const isDisabled = element => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return true;
    }
    if (element.classList.contains('disabled')) {
      return true;
    }
    if (typeof element.disabled !== 'undefined') {
      return element.disabled;
    }
    return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
  };
  const findShadowRoot = element => {
    if (!document.documentElement.attachShadow) {
      return null;
    }

    // Can find the shadow root otherwise it'll return the document
    if (typeof element.getRootNode === 'function') {
      const root = element.getRootNode();
      return root instanceof ShadowRoot ? root : null;
    }
    if (element instanceof ShadowRoot) {
      return element;
    }

    // when we don't find a shadow root
    if (!element.parentNode) {
      return null;
    }
    return findShadowRoot(element.parentNode);
  };
  const noop = () => {};

  /**
   * Trick to restart an element's animation
   *
   * @param {HTMLElement} element
   * @return void
   *
   * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
   */
  const reflow = element => {
    element.offsetHeight; // eslint-disable-line no-unused-expressions
  };

  const getjQuery = () => {
    if (window.jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
      return window.jQuery;
    }
    return null;
  };
  const DOMContentLoadedCallbacks = [];
  const onDOMContentLoaded = callback => {
    if (document.readyState === 'loading') {
      // add listener on the first call when the document is in loading state
      if (!DOMContentLoadedCallbacks.length) {
        document.addEventListener('DOMContentLoaded', () => {
          for (const callback of DOMContentLoadedCallbacks) {
            callback();
          }
        });
      }
      DOMContentLoadedCallbacks.push(callback);
    } else {
      callback();
    }
  };
  const isRTL = () => document.documentElement.dir === 'rtl';
  const defineJQueryPlugin = plugin => {
    onDOMContentLoaded(() => {
      const $ = getjQuery();
      /* istanbul ignore if */
      if ($) {
        const name = plugin.NAME;
        const JQUERY_NO_CONFLICT = $.fn[name];
        $.fn[name] = plugin.jQueryInterface;
        $.fn[name].Constructor = plugin;
        $.fn[name].noConflict = () => {
          $.fn[name] = JQUERY_NO_CONFLICT;
          return plugin.jQueryInterface;
        };
      }
    });
  };
  const execute = (possibleCallback, args = [], defaultValue = possibleCallback) => {
    return typeof possibleCallback === 'function' ? possibleCallback(...args) : defaultValue;
  };
  const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
    if (!waitForTransition) {
      execute(callback);
      return;
    }
    const durationPadding = 5;
    const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
    let called = false;
    const handler = ({
      target
    }) => {
      if (target !== transitionElement) {
        return;
      }
      called = true;
      transitionElement.removeEventListener(TRANSITION_END, handler);
      execute(callback);
    };
    transitionElement.addEventListener(TRANSITION_END, handler);
    setTimeout(() => {
      if (!called) {
        triggerTransitionEnd(transitionElement);
      }
    }, emulatedDuration);
  };

  /**
   * Return the previous/next element of a list.
   *
   * @param {array} list    The list of elements
   * @param activeElement   The active element
   * @param shouldGetNext   Choose to get next or previous element
   * @param isCycleAllowed
   * @return {Element|elem} The proper element
   */
  const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
    const listLength = list.length;
    let index = list.indexOf(activeElement);

    // if the element does not exist in the list return an element
    // depending on the direction and if cycle is allowed
    if (index === -1) {
      return !shouldGetNext && isCycleAllowed ? list[listLength - 1] : list[0];
    }
    index += shouldGetNext ? 1 : -1;
    if (isCycleAllowed) {
      index = (index + listLength) % listLength;
    }
    return list[Math.max(0, Math.min(index, listLength - 1))];
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap dom/event-handler.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
  const stripNameRegex = /\..*/;
  const stripUidRegex = /::\d+$/;
  const eventRegistry = {}; // Events storage
  let uidEvent = 1;
  const customEvents = {
    mouseenter: 'mouseover',
    mouseleave: 'mouseout'
  };
  const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);

  /**
   * Private methods
   */

  function makeEventUid(element, uid) {
    return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
  }
  function getElementEvents(element) {
    const uid = makeEventUid(element);
    element.uidEvent = uid;
    eventRegistry[uid] = eventRegistry[uid] || {};
    return eventRegistry[uid];
  }
  function bootstrapHandler(element, fn) {
    return function handler(event) {
      hydrateObj(event, {
        delegateTarget: element
      });
      if (handler.oneOff) {
        EventHandler.off(element, event.type, fn);
      }
      return fn.apply(element, [event]);
    };
  }
  function bootstrapDelegationHandler(element, selector, fn) {
    return function handler(event) {
      const domElements = element.querySelectorAll(selector);
      for (let {
        target
      } = event; target && target !== this; target = target.parentNode) {
        for (const domElement of domElements) {
          if (domElement !== target) {
            continue;
          }
          hydrateObj(event, {
            delegateTarget: target
          });
          if (handler.oneOff) {
            EventHandler.off(element, event.type, selector, fn);
          }
          return fn.apply(target, [event]);
        }
      }
    };
  }
  function findHandler(events, callable, delegationSelector = null) {
    return Object.values(events).find(event => event.callable === callable && event.delegationSelector === delegationSelector);
  }
  function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
    const isDelegated = typeof handler === 'string';
    // TODO: tooltip passes `false` instead of selector, so we need to check
    const callable = isDelegated ? delegationFunction : handler || delegationFunction;
    let typeEvent = getTypeEvent(originalTypeEvent);
    if (!nativeEvents.has(typeEvent)) {
      typeEvent = originalTypeEvent;
    }
    return [isDelegated, callable, typeEvent];
  }
  function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
    if (typeof originalTypeEvent !== 'string' || !element) {
      return;
    }
    let [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);

    // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
    // this prevents the handler from being dispatched the same way as mouseover or mouseout does
    if (originalTypeEvent in customEvents) {
      const wrapFunction = fn => {
        return function (event) {
          if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
            return fn.call(this, event);
          }
        };
      };
      callable = wrapFunction(callable);
    }
    const events = getElementEvents(element);
    const handlers = events[typeEvent] || (events[typeEvent] = {});
    const previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);
    if (previousFunction) {
      previousFunction.oneOff = previousFunction.oneOff && oneOff;
      return;
    }
    const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ''));
    const fn = isDelegated ? bootstrapDelegationHandler(element, handler, callable) : bootstrapHandler(element, callable);
    fn.delegationSelector = isDelegated ? handler : null;
    fn.callable = callable;
    fn.oneOff = oneOff;
    fn.uidEvent = uid;
    handlers[uid] = fn;
    element.addEventListener(typeEvent, fn, isDelegated);
  }
  function removeHandler(element, events, typeEvent, handler, delegationSelector) {
    const fn = findHandler(events[typeEvent], handler, delegationSelector);
    if (!fn) {
      return;
    }
    element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
    delete events[typeEvent][fn.uidEvent];
  }
  function removeNamespacedHandlers(element, events, typeEvent, namespace) {
    const storeElementEvent = events[typeEvent] || {};
    for (const [handlerKey, event] of Object.entries(storeElementEvent)) {
      if (handlerKey.includes(namespace)) {
        removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
      }
    }
  }
  function getTypeEvent(event) {
    // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
    event = event.replace(stripNameRegex, '');
    return customEvents[event] || event;
  }
  const EventHandler = {
    on(element, event, handler, delegationFunction) {
      addHandler(element, event, handler, delegationFunction, false);
    },
    one(element, event, handler, delegationFunction) {
      addHandler(element, event, handler, delegationFunction, true);
    },
    off(element, originalTypeEvent, handler, delegationFunction) {
      if (typeof originalTypeEvent !== 'string' || !element) {
        return;
      }
      const [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
      const inNamespace = typeEvent !== originalTypeEvent;
      const events = getElementEvents(element);
      const storeElementEvent = events[typeEvent] || {};
      const isNamespace = originalTypeEvent.startsWith('.');
      if (typeof callable !== 'undefined') {
        // Simplest case: handler is passed, remove that listener ONLY.
        if (!Object.keys(storeElementEvent).length) {
          return;
        }
        removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null);
        return;
      }
      if (isNamespace) {
        for (const elementEvent of Object.keys(events)) {
          removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
        }
      }
      for (const [keyHandlers, event] of Object.entries(storeElementEvent)) {
        const handlerKey = keyHandlers.replace(stripUidRegex, '');
        if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
          removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
        }
      }
    },
    trigger(element, event, args) {
      if (typeof event !== 'string' || !element) {
        return null;
      }
      const $ = getjQuery();
      const typeEvent = getTypeEvent(event);
      const inNamespace = event !== typeEvent;
      let jQueryEvent = null;
      let bubbles = true;
      let nativeDispatch = true;
      let defaultPrevented = false;
      if (inNamespace && $) {
        jQueryEvent = $.Event(event, args);
        $(element).trigger(jQueryEvent);
        bubbles = !jQueryEvent.isPropagationStopped();
        nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
        defaultPrevented = jQueryEvent.isDefaultPrevented();
      }
      const evt = hydrateObj(new Event(event, {
        bubbles,
        cancelable: true
      }), args);
      if (defaultPrevented) {
        evt.preventDefault();
      }
      if (nativeDispatch) {
        element.dispatchEvent(evt);
      }
      if (evt.defaultPrevented && jQueryEvent) {
        jQueryEvent.preventDefault();
      }
      return evt;
    }
  };
  function hydrateObj(obj, meta = {}) {
    for (const [key, value] of Object.entries(meta)) {
      try {
        obj[key] = value;
      } catch (_unused) {
        Object.defineProperty(obj, key, {
          configurable: true,
          get() {
            return value;
          }
        });
      }
    }
    return obj;
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap dom/manipulator.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  function normalizeData(value) {
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    }
    if (value === Number(value).toString()) {
      return Number(value);
    }
    if (value === '' || value === 'null') {
      return null;
    }
    if (typeof value !== 'string') {
      return value;
    }
    try {
      return JSON.parse(decodeURIComponent(value));
    } catch (_unused) {
      return value;
    }
  }
  function normalizeDataKey(key) {
    return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`);
  }
  const Manipulator = {
    setDataAttribute(element, key, value) {
      element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
    },
    removeDataAttribute(element, key) {
      element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
    },
    getDataAttributes(element) {
      if (!element) {
        return {};
      }
      const attributes = {};
      const bsKeys = Object.keys(element.dataset).filter(key => key.startsWith('bs') && !key.startsWith('bsConfig'));
      for (const key of bsKeys) {
        let pureKey = key.replace(/^bs/, '');
        pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
        attributes[pureKey] = normalizeData(element.dataset[key]);
      }
      return attributes;
    },
    getDataAttribute(element, key) {
      return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
    }
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/config.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Class definition
   */

  class Config {
    // Getters
    static get Default() {
      return {};
    }
    static get DefaultType() {
      return {};
    }
    static get NAME() {
      throw new Error('You have to implement the static method "NAME", for each component!');
    }
    _getConfig(config) {
      config = this._mergeConfigObj(config);
      config = this._configAfterMerge(config);
      this._typeCheckConfig(config);
      return config;
    }
    _configAfterMerge(config) {
      return config;
    }
    _mergeConfigObj(config, element) {
      const jsonConfig = isElement(element) ? Manipulator.getDataAttribute(element, 'config') : {}; // try to parse

      return {
        ...this.constructor.Default,
        ...(typeof jsonConfig === 'object' ? jsonConfig : {}),
        ...(isElement(element) ? Manipulator.getDataAttributes(element) : {}),
        ...(typeof config === 'object' ? config : {})
      };
    }
    _typeCheckConfig(config, configTypes = this.constructor.DefaultType) {
      for (const [property, expectedTypes] of Object.entries(configTypes)) {
        const value = config[property];
        const valueType = isElement(value) ? 'element' : toType(value);
        if (!new RegExp(expectedTypes).test(valueType)) {
          throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
        }
      }
    }
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap base-component.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const VERSION = '5.3.1';

  /**
   * Class definition
   */

  class BaseComponent extends Config {
    constructor(element, config) {
      super();
      element = getElement(element);
      if (!element) {
        return;
      }
      this._element = element;
      this._config = this._getConfig(config);
      Data.set(this._element, this.constructor.DATA_KEY, this);
    }

    // Public
    dispose() {
      Data.remove(this._element, this.constructor.DATA_KEY);
      EventHandler.off(this._element, this.constructor.EVENT_KEY);
      for (const propertyName of Object.getOwnPropertyNames(this)) {
        this[propertyName] = null;
      }
    }
    _queueCallback(callback, element, isAnimated = true) {
      executeAfterTransition(callback, element, isAnimated);
    }
    _getConfig(config) {
      config = this._mergeConfigObj(config, this._element);
      config = this._configAfterMerge(config);
      this._typeCheckConfig(config);
      return config;
    }

    // Static
    static getInstance(element) {
      return Data.get(getElement(element), this.DATA_KEY);
    }
    static getOrCreateInstance(element, config = {}) {
      return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null);
    }
    static get VERSION() {
      return VERSION;
    }
    static get DATA_KEY() {
      return `bs.${this.NAME}`;
    }
    static get EVENT_KEY() {
      return `.${this.DATA_KEY}`;
    }
    static eventName(name) {
      return `${name}${this.EVENT_KEY}`;
    }
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap dom/selector-engine.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  const getSelector = element => {
    let selector = element.getAttribute('data-bs-target');
    if (!selector || selector === '#') {
      let hrefAttribute = element.getAttribute('href');

      // The only valid content that could double as a selector are IDs or classes,
      // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
      // `document.querySelector` will rightfully complain it is invalid.
      // See https://github.com/twbs/bootstrap/issues/32273
      if (!hrefAttribute || !hrefAttribute.includes('#') && !hrefAttribute.startsWith('.')) {
        return null;
      }

      // Just in case some CMS puts out a full URL with the anchor appended
      if (hrefAttribute.includes('#') && !hrefAttribute.startsWith('#')) {
        hrefAttribute = `#${hrefAttribute.split('#')[1]}`;
      }
      selector = hrefAttribute && hrefAttribute !== '#' ? hrefAttribute.trim() : null;
    }
    return parseSelector(selector);
  };
  const SelectorEngine = {
    find(selector, element = document.documentElement) {
      return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
    },
    findOne(selector, element = document.documentElement) {
      return Element.prototype.querySelector.call(element, selector);
    },
    children(element, selector) {
      return [].concat(...element.children).filter(child => child.matches(selector));
    },
    parents(element, selector) {
      const parents = [];
      let ancestor = element.parentNode.closest(selector);
      while (ancestor) {
        parents.push(ancestor);
        ancestor = ancestor.parentNode.closest(selector);
      }
      return parents;
    },
    prev(element, selector) {
      let previous = element.previousElementSibling;
      while (previous) {
        if (previous.matches(selector)) {
          return [previous];
        }
        previous = previous.previousElementSibling;
      }
      return [];
    },
    // TODO: this is now unused; remove later along with prev()
    next(element, selector) {
      let next = element.nextElementSibling;
      while (next) {
        if (next.matches(selector)) {
          return [next];
        }
        next = next.nextElementSibling;
      }
      return [];
    },
    focusableChildren(element) {
      const focusables = ['a', 'button', 'input', 'textarea', 'select', 'details', '[tabindex]', '[contenteditable="true"]'].map(selector => `${selector}:not([tabindex^="-"])`).join(',');
      return this.find(focusables, element).filter(el => !isDisabled(el) && isVisible(el));
    },
    getSelectorFromElement(element) {
      const selector = getSelector(element);
      if (selector) {
        return SelectorEngine.findOne(selector) ? selector : null;
      }
      return null;
    },
    getElementFromSelector(element) {
      const selector = getSelector(element);
      return selector ? SelectorEngine.findOne(selector) : null;
    },
    getMultipleElementsFromSelector(element) {
      const selector = getSelector(element);
      return selector ? SelectorEngine.find(selector) : [];
    }
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/component-functions.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  const enableDismissTrigger = (component, method = 'hide') => {
    const clickEvent = `click.dismiss${component.EVENT_KEY}`;
    const name = component.NAME;
    EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function (event) {
      if (['A', 'AREA'].includes(this.tagName)) {
        event.preventDefault();
      }
      if (isDisabled(this)) {
        return;
      }
      const target = SelectorEngine.getElementFromSelector(this) || this.closest(`.${name}`);
      const instance = component.getOrCreateInstance(target);

      // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method
      instance[method]();
    });
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap alert.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$f = 'alert';
  const DATA_KEY$a = 'bs.alert';
  const EVENT_KEY$b = `.${DATA_KEY$a}`;
  const EVENT_CLOSE = `close${EVENT_KEY$b}`;
  const EVENT_CLOSED = `closed${EVENT_KEY$b}`;
  const CLASS_NAME_FADE$5 = 'fade';
  const CLASS_NAME_SHOW$8 = 'show';

  /**
   * Class definition
   */

  class Alert extends BaseComponent {
    // Getters
    static get NAME() {
      return NAME$f;
    }

    // Public
    close() {
      const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE);
      if (closeEvent.defaultPrevented) {
        return;
      }
      this._element.classList.remove(CLASS_NAME_SHOW$8);
      const isAnimated = this._element.classList.contains(CLASS_NAME_FADE$5);
      this._queueCallback(() => this._destroyElement(), this._element, isAnimated);
    }

    // Private
    _destroyElement() {
      this._element.remove();
      EventHandler.trigger(this._element, EVENT_CLOSED);
      this.dispose();
    }

    // Static
    static jQueryInterface(config) {
      return this.each(function () {
        const data = Alert.getOrCreateInstance(this);
        if (typeof config !== 'string') {
          return;
        }
        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config](this);
      });
    }
  }

  /**
   * Data API implementation
   */

  enableDismissTrigger(Alert, 'close');

  /**
   * jQuery
   */

  defineJQueryPlugin(Alert);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap button.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$e = 'button';
  const DATA_KEY$9 = 'bs.button';
  const EVENT_KEY$a = `.${DATA_KEY$9}`;
  const DATA_API_KEY$6 = '.data-api';
  const CLASS_NAME_ACTIVE$3 = 'active';
  const SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]';
  const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$a}${DATA_API_KEY$6}`;

  /**
   * Class definition
   */

  class Button extends BaseComponent {
    // Getters
    static get NAME() {
      return NAME$e;
    }

    // Public
    toggle() {
      // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
      this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE$3));
    }

    // Static
    static jQueryInterface(config) {
      return this.each(function () {
        const data = Button.getOrCreateInstance(this);
        if (config === 'toggle') {
          data[config]();
        }
      });
    }
  }

  /**
   * Data API implementation
   */

  EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$5, event => {
    event.preventDefault();
    const button = event.target.closest(SELECTOR_DATA_TOGGLE$5);
    const data = Button.getOrCreateInstance(button);
    data.toggle();
  });

  /**
   * jQuery
   */

  defineJQueryPlugin(Button);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/swipe.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$d = 'swipe';
  const EVENT_KEY$9 = '.bs.swipe';
  const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$9}`;
  const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$9}`;
  const EVENT_TOUCHEND = `touchend${EVENT_KEY$9}`;
  const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$9}`;
  const EVENT_POINTERUP = `pointerup${EVENT_KEY$9}`;
  const POINTER_TYPE_TOUCH = 'touch';
  const POINTER_TYPE_PEN = 'pen';
  const CLASS_NAME_POINTER_EVENT = 'pointer-event';
  const SWIPE_THRESHOLD = 40;
  const Default$c = {
    endCallback: null,
    leftCallback: null,
    rightCallback: null
  };
  const DefaultType$c = {
    endCallback: '(function|null)',
    leftCallback: '(function|null)',
    rightCallback: '(function|null)'
  };

  /**
   * Class definition
   */

  class Swipe extends Config {
    constructor(element, config) {
      super();
      this._element = element;
      if (!element || !Swipe.isSupported()) {
        return;
      }
      this._config = this._getConfig(config);
      this._deltaX = 0;
      this._supportPointerEvents = Boolean(window.PointerEvent);
      this._initEvents();
    }

    // Getters
    static get Default() {
      return Default$c;
    }
    static get DefaultType() {
      return DefaultType$c;
    }
    static get NAME() {
      return NAME$d;
    }

    // Public
    dispose() {
      EventHandler.off(this._element, EVENT_KEY$9);
    }

    // Private
    _start(event) {
      if (!this._supportPointerEvents) {
        this._deltaX = event.touches[0].clientX;
        return;
      }
      if (this._eventIsPointerPenTouch(event)) {
        this._deltaX = event.clientX;
      }
    }
    _end(event) {
      if (this._eventIsPointerPenTouch(event)) {
        this._deltaX = event.clientX - this._deltaX;
      }
      this._handleSwipe();
      execute(this._config.endCallback);
    }
    _move(event) {
      this._deltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this._deltaX;
    }
    _handleSwipe() {
      const absDeltaX = Math.abs(this._deltaX);
      if (absDeltaX <= SWIPE_THRESHOLD) {
        return;
      }
      const direction = absDeltaX / this._deltaX;
      this._deltaX = 0;
      if (!direction) {
        return;
      }
      execute(direction > 0 ? this._config.rightCallback : this._config.leftCallback);
    }
    _initEvents() {
      if (this._supportPointerEvents) {
        EventHandler.on(this._element, EVENT_POINTERDOWN, event => this._start(event));
        EventHandler.on(this._element, EVENT_POINTERUP, event => this._end(event));
        this._element.classList.add(CLASS_NAME_POINTER_EVENT);
      } else {
        EventHandler.on(this._element, EVENT_TOUCHSTART, event => this._start(event));
        EventHandler.on(this._element, EVENT_TOUCHMOVE, event => this._move(event));
        EventHandler.on(this._element, EVENT_TOUCHEND, event => this._end(event));
      }
    }
    _eventIsPointerPenTouch(event) {
      return this._supportPointerEvents && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH);
    }

    // Static
    static isSupported() {
      return 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
    }
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap carousel.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$c = 'carousel';
  const DATA_KEY$8 = 'bs.carousel';
  const EVENT_KEY$8 = `.${DATA_KEY$8}`;
  const DATA_API_KEY$5 = '.data-api';
  const ARROW_LEFT_KEY$1 = 'ArrowLeft';
  const ARROW_RIGHT_KEY$1 = 'ArrowRight';
  const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

  const ORDER_NEXT = 'next';
  const ORDER_PREV = 'prev';
  const DIRECTION_LEFT = 'left';
  const DIRECTION_RIGHT = 'right';
  const EVENT_SLIDE = `slide${EVENT_KEY$8}`;
  const EVENT_SLID = `slid${EVENT_KEY$8}`;
  const EVENT_KEYDOWN$1 = `keydown${EVENT_KEY$8}`;
  const EVENT_MOUSEENTER$1 = `mouseenter${EVENT_KEY$8}`;
  const EVENT_MOUSELEAVE$1 = `mouseleave${EVENT_KEY$8}`;
  const EVENT_DRAG_START = `dragstart${EVENT_KEY$8}`;
  const EVENT_LOAD_DATA_API$3 = `load${EVENT_KEY$8}${DATA_API_KEY$5}`;
  const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$8}${DATA_API_KEY$5}`;
  const CLASS_NAME_CAROUSEL = 'carousel';
  const CLASS_NAME_ACTIVE$2 = 'active';
  const CLASS_NAME_SLIDE = 'slide';
  const CLASS_NAME_END = 'carousel-item-end';
  const CLASS_NAME_START = 'carousel-item-start';
  const CLASS_NAME_NEXT = 'carousel-item-next';
  const CLASS_NAME_PREV = 'carousel-item-prev';
  const SELECTOR_ACTIVE = '.active';
  const SELECTOR_ITEM = '.carousel-item';
  const SELECTOR_ACTIVE_ITEM = SELECTOR_ACTIVE + SELECTOR_ITEM;
  const SELECTOR_ITEM_IMG = '.carousel-item img';
  const SELECTOR_INDICATORS = '.carousel-indicators';
  const SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]';
  const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
  const KEY_TO_DIRECTION = {
    [ARROW_LEFT_KEY$1]: DIRECTION_RIGHT,
    [ARROW_RIGHT_KEY$1]: DIRECTION_LEFT
  };
  const Default$b = {
    interval: 5000,
    keyboard: true,
    pause: 'hover',
    ride: false,
    touch: true,
    wrap: true
  };
  const DefaultType$b = {
    interval: '(number|boolean)',
    // TODO:v6 remove boolean support
    keyboard: 'boolean',
    pause: '(string|boolean)',
    ride: '(boolean|string)',
    touch: 'boolean',
    wrap: 'boolean'
  };

  /**
   * Class definition
   */

  class Carousel extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._interval = null;
      this._activeElement = null;
      this._isSliding = false;
      this.touchTimeout = null;
      this._swipeHelper = null;
      this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);
      this._addEventListeners();
      if (this._config.ride === CLASS_NAME_CAROUSEL) {
        this.cycle();
      }
    }

    // Getters
    static get Default() {
      return Default$b;
    }
    static get DefaultType() {
      return DefaultType$b;
    }
    static get NAME() {
      return NAME$c;
    }

    // Public
    next() {
      this._slide(ORDER_NEXT);
    }
    nextWhenVisible() {
      // FIXME TODO use `document.visibilityState`
      // Don't call next when the page isn't visible
      // or the carousel or its parent isn't visible
      if (!document.hidden && isVisible(this._element)) {
        this.next();
      }
    }
    prev() {
      this._slide(ORDER_PREV);
    }
    pause() {
      if (this._isSliding) {
        triggerTransitionEnd(this._element);
      }
      this._clearInterval();
    }
    cycle() {
      this._clearInterval();
      this._updateInterval();
      this._interval = setInterval(() => this.nextWhenVisible(), this._config.interval);
    }
    _maybeEnableCycle() {
      if (!this._config.ride) {
        return;
      }
      if (this._isSliding) {
        EventHandler.one(this._element, EVENT_SLID, () => this.cycle());
        return;
      }
      this.cycle();
    }
    to(index) {
      const items = this._getItems();
      if (index > items.length - 1 || index < 0) {
        return;
      }
      if (this._isSliding) {
        EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
        return;
      }
      const activeIndex = this._getItemIndex(this._getActive());
      if (activeIndex === index) {
        return;
      }
      const order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;
      this._slide(order, items[index]);
    }
    dispose() {
      if (this._swipeHelper) {
        this._swipeHelper.dispose();
      }
      super.dispose();
    }

    // Private
    _configAfterMerge(config) {
      config.defaultInterval = config.interval;
      return config;
    }
    _addEventListeners() {
      if (this._config.keyboard) {
        EventHandler.on(this._element, EVENT_KEYDOWN$1, event => this._keydown(event));
      }
      if (this._config.pause === 'hover') {
        EventHandler.on(this._element, EVENT_MOUSEENTER$1, () => this.pause());
        EventHandler.on(this._element, EVENT_MOUSELEAVE$1, () => this._maybeEnableCycle());
      }
      if (this._config.touch && Swipe.isSupported()) {
        this._addTouchEventListeners();
      }
    }
    _addTouchEventListeners() {
      for (const img of SelectorEngine.find(SELECTOR_ITEM_IMG, this._element)) {
        EventHandler.on(img, EVENT_DRAG_START, event => event.preventDefault());
      }
      const endCallBack = () => {
        if (this._config.pause !== 'hover') {
          return;
        }

        // If it's a touch-enabled device, mouseenter/leave are fired as
        // part of the mouse compatibility events on first tap - the carousel
        // would stop cycling until user tapped out of it;
        // here, we listen for touchend, explicitly pause the carousel
        // (as if it's the second time we tap on it, mouseenter compat event
        // is NOT fired) and after a timeout (to allow for mouse compatibility
        // events to fire) we explicitly restart cycling

        this.pause();
        if (this.touchTimeout) {
          clearTimeout(this.touchTimeout);
        }
        this.touchTimeout = setTimeout(() => this._maybeEnableCycle(), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
      };
      const swipeConfig = {
        leftCallback: () => this._slide(this._directionToOrder(DIRECTION_LEFT)),
        rightCallback: () => this._slide(this._directionToOrder(DIRECTION_RIGHT)),
        endCallback: endCallBack
      };
      this._swipeHelper = new Swipe(this._element, swipeConfig);
    }
    _keydown(event) {
      if (/input|textarea/i.test(event.target.tagName)) {
        return;
      }
      const direction = KEY_TO_DIRECTION[event.key];
      if (direction) {
        event.preventDefault();
        this._slide(this._directionToOrder(direction));
      }
    }
    _getItemIndex(element) {
      return this._getItems().indexOf(element);
    }
    _setActiveIndicatorElement(index) {
      if (!this._indicatorsElement) {
        return;
      }
      const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE, this._indicatorsElement);
      activeIndicator.classList.remove(CLASS_NAME_ACTIVE$2);
      activeIndicator.removeAttribute('aria-current');
      const newActiveIndicator = SelectorEngine.findOne(`[data-bs-slide-to="${index}"]`, this._indicatorsElement);
      if (newActiveIndicator) {
        newActiveIndicator.classList.add(CLASS_NAME_ACTIVE$2);
        newActiveIndicator.setAttribute('aria-current', 'true');
      }
    }
    _updateInterval() {
      const element = this._activeElement || this._getActive();
      if (!element) {
        return;
      }
      const elementInterval = Number.parseInt(element.getAttribute('data-bs-interval'), 10);
      this._config.interval = elementInterval || this._config.defaultInterval;
    }
    _slide(order, element = null) {
      if (this._isSliding) {
        return;
      }
      const activeElement = this._getActive();
      const isNext = order === ORDER_NEXT;
      const nextElement = element || getNextActiveElement(this._getItems(), activeElement, isNext, this._config.wrap);
      if (nextElement === activeElement) {
        return;
      }
      const nextElementIndex = this._getItemIndex(nextElement);
      const triggerEvent = eventName => {
        return EventHandler.trigger(this._element, eventName, {
          relatedTarget: nextElement,
          direction: this._orderToDirection(order),
          from: this._getItemIndex(activeElement),
          to: nextElementIndex
        });
      };
      const slideEvent = triggerEvent(EVENT_SLIDE);
      if (slideEvent.defaultPrevented) {
        return;
      }
      if (!activeElement || !nextElement) {
        // Some weirdness is happening, so we bail
        // TODO: change tests that use empty divs to avoid this check
        return;
      }
      const isCycling = Boolean(this._interval);
      this.pause();
      this._isSliding = true;
      this._setActiveIndicatorElement(nextElementIndex);
      this._activeElement = nextElement;
      const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
      const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;
      nextElement.classList.add(orderClassName);
      reflow(nextElement);
      activeElement.classList.add(directionalClassName);
      nextElement.classList.add(directionalClassName);
      const completeCallBack = () => {
        nextElement.classList.remove(directionalClassName, orderClassName);
        nextElement.classList.add(CLASS_NAME_ACTIVE$2);
        activeElement.classList.remove(CLASS_NAME_ACTIVE$2, orderClassName, directionalClassName);
        this._isSliding = false;
        triggerEvent(EVENT_SLID);
      };
      this._queueCallback(completeCallBack, activeElement, this._isAnimated());
      if (isCycling) {
        this.cycle();
      }
    }
    _isAnimated() {
      return this._element.classList.contains(CLASS_NAME_SLIDE);
    }
    _getActive() {
      return SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
    }
    _getItems() {
      return SelectorEngine.find(SELECTOR_ITEM, this._element);
    }
    _clearInterval() {
      if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
      }
    }
    _directionToOrder(direction) {
      if (isRTL()) {
        return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
      }
      return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
    }
    _orderToDirection(order) {
      if (isRTL()) {
        return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
      }
      return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
    }

    // Static
    static jQueryInterface(config) {
      return this.each(function () {
        const data = Carousel.getOrCreateInstance(this, config);
        if (typeof config === 'number') {
          data.to(config);
          return;
        }
        if (typeof config === 'string') {
          if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
            throw new TypeError(`No method named "${config}"`);
          }
          data[config]();
        }
      });
    }
  }

  /**
   * Data API implementation
   */

  EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_SLIDE, function (event) {
    const target = SelectorEngine.getElementFromSelector(this);
    if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
      return;
    }
    event.preventDefault();
    const carousel = Carousel.getOrCreateInstance(target);
    const slideIndex = this.getAttribute('data-bs-slide-to');
    if (slideIndex) {
      carousel.to(slideIndex);
      carousel._maybeEnableCycle();
      return;
    }
    if (Manipulator.getDataAttribute(this, 'slide') === 'next') {
      carousel.next();
      carousel._maybeEnableCycle();
      return;
    }
    carousel.prev();
    carousel._maybeEnableCycle();
  });
  EventHandler.on(window, EVENT_LOAD_DATA_API$3, () => {
    const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);
    for (const carousel of carousels) {
      Carousel.getOrCreateInstance(carousel);
    }
  });

  /**
   * jQuery
   */

  defineJQueryPlugin(Carousel);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap collapse.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$b = 'collapse';
  const DATA_KEY$7 = 'bs.collapse';
  const EVENT_KEY$7 = `.${DATA_KEY$7}`;
  const DATA_API_KEY$4 = '.data-api';
  const EVENT_SHOW$6 = `show${EVENT_KEY$7}`;
  const EVENT_SHOWN$6 = `shown${EVENT_KEY$7}`;
  const EVENT_HIDE$6 = `hide${EVENT_KEY$7}`;
  const EVENT_HIDDEN$6 = `hidden${EVENT_KEY$7}`;
  const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$7}${DATA_API_KEY$4}`;
  const CLASS_NAME_SHOW$7 = 'show';
  const CLASS_NAME_COLLAPSE = 'collapse';
  const CLASS_NAME_COLLAPSING = 'collapsing';
  const CLASS_NAME_COLLAPSED = 'collapsed';
  const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
  const CLASS_NAME_HORIZONTAL = 'collapse-horizontal';
  const WIDTH = 'width';
  const HEIGHT = 'height';
  const SELECTOR_ACTIVES = '.collapse.show, .collapse.collapsing';
  const SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]';
  const Default$a = {
    parent: null,
    toggle: true
  };
  const DefaultType$a = {
    parent: '(null|element)',
    toggle: 'boolean'
  };

  /**
   * Class definition
   */

  class Collapse extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._isTransitioning = false;
      this._triggerArray = [];
      const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);
      for (const elem of toggleList) {
        const selector = SelectorEngine.getSelectorFromElement(elem);
        const filterElement = SelectorEngine.find(selector).filter(foundElement => foundElement === this._element);
        if (selector !== null && filterElement.length) {
          this._triggerArray.push(elem);
        }
      }
      this._initializeChildren();
      if (!this._config.parent) {
        this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
      }
      if (this._config.toggle) {
        this.toggle();
      }
    }

    // Getters
    static get Default() {
      return Default$a;
    }
    static get DefaultType() {
      return DefaultType$a;
    }
    static get NAME() {
      return NAME$b;
    }

    // Public
    toggle() {
      if (this._isShown()) {
        this.hide();
      } else {
        this.show();
      }
    }
    show() {
      if (this._isTransitioning || this._isShown()) {
        return;
      }
      let activeChildren = [];

      // find active children
      if (this._config.parent) {
        activeChildren = this._getFirstLevelChildren(SELECTOR_ACTIVES).filter(element => element !== this._element).map(element => Collapse.getOrCreateInstance(element, {
          toggle: false
        }));
      }
      if (activeChildren.length && activeChildren[0]._isTransitioning) {
        return;
      }
      const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$6);
      if (startEvent.defaultPrevented) {
        return;
      }
      for (const activeInstance of activeChildren) {
        activeInstance.hide();
      }
      const dimension = this._getDimension();
      this._element.classList.remove(CLASS_NAME_COLLAPSE);
      this._element.classList.add(CLASS_NAME_COLLAPSING);
      this._element.style[dimension] = 0;
      this._addAriaAndCollapsedClass(this._triggerArray, true);
      this._isTransitioning = true;
      const complete = () => {
        this._isTransitioning = false;
        this._element.classList.remove(CLASS_NAME_COLLAPSING);
        this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
        this._element.style[dimension] = '';
        EventHandler.trigger(this._element, EVENT_SHOWN$6);
      };
      const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
      const scrollSize = `scroll${capitalizedDimension}`;
      this._queueCallback(complete, this._element, true);
      this._element.style[dimension] = `${this._element[scrollSize]}px`;
    }
    hide() {
      if (this._isTransitioning || !this._isShown()) {
        return;
      }
      const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$6);
      if (startEvent.defaultPrevented) {
        return;
      }
      const dimension = this._getDimension();
      this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
      reflow(this._element);
      this._element.classList.add(CLASS_NAME_COLLAPSING);
      this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
      for (const trigger of this._triggerArray) {
        const element = SelectorEngine.getElementFromSelector(trigger);
        if (element && !this._isShown(element)) {
          this._addAriaAndCollapsedClass([trigger], false);
        }
      }
      this._isTransitioning = true;
      const complete = () => {
        this._isTransitioning = false;
        this._element.classList.remove(CLASS_NAME_COLLAPSING);
        this._element.classList.add(CLASS_NAME_COLLAPSE);
        EventHandler.trigger(this._element, EVENT_HIDDEN$6);
      };
      this._element.style[dimension] = '';
      this._queueCallback(complete, this._element, true);
    }
    _isShown(element = this._element) {
      return element.classList.contains(CLASS_NAME_SHOW$7);
    }

    // Private
    _configAfterMerge(config) {
      config.toggle = Boolean(config.toggle); // Coerce string values
      config.parent = getElement(config.parent);
      return config;
    }
    _getDimension() {
      return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT;
    }
    _initializeChildren() {
      if (!this._config.parent) {
        return;
      }
      const children = this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE$4);
      for (const element of children) {
        const selected = SelectorEngine.getElementFromSelector(element);
        if (selected) {
          this._addAriaAndCollapsedClass([element], this._isShown(selected));
        }
      }
    }
    _getFirstLevelChildren(selector) {
      const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
      // remove children if greater depth
      return SelectorEngine.find(selector, this._config.parent).filter(element => !children.includes(element));
    }
    _addAriaAndCollapsedClass(triggerArray, isOpen) {
      if (!triggerArray.length) {
        return;
      }
      for (const element of triggerArray) {
        element.classList.toggle(CLASS_NAME_COLLAPSED, !isOpen);
        element.setAttribute('aria-expanded', isOpen);
      }
    }

    // Static
    static jQueryInterface(config) {
      const _config = {};
      if (typeof config === 'string' && /show|hide/.test(config)) {
        _config.toggle = false;
      }
      return this.each(function () {
        const data = Collapse.getOrCreateInstance(this, _config);
        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }
          data[config]();
        }
      });
    }
  }

  /**
   * Data API implementation
   */

  EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$4, function (event) {
    // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
    if (event.target.tagName === 'A' || event.delegateTarget && event.delegateTarget.tagName === 'A') {
      event.preventDefault();
    }
    for (const element of SelectorEngine.getMultipleElementsFromSelector(this)) {
      Collapse.getOrCreateInstance(element, {
        toggle: false
      }).toggle();
    }
  });

  /**
   * jQuery
   */

  defineJQueryPlugin(Collapse);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap dropdown.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$a = 'dropdown';
  const DATA_KEY$6 = 'bs.dropdown';
  const EVENT_KEY$6 = `.${DATA_KEY$6}`;
  const DATA_API_KEY$3 = '.data-api';
  const ESCAPE_KEY$2 = 'Escape';
  const TAB_KEY$1 = 'Tab';
  const ARROW_UP_KEY$1 = 'ArrowUp';
  const ARROW_DOWN_KEY$1 = 'ArrowDown';
  const RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button

  const EVENT_HIDE$5 = `hide${EVENT_KEY$6}`;
  const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$6}`;
  const EVENT_SHOW$5 = `show${EVENT_KEY$6}`;
  const EVENT_SHOWN$5 = `shown${EVENT_KEY$6}`;
  const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
  const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$6}${DATA_API_KEY$3}`;
  const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$6}${DATA_API_KEY$3}`;
  const CLASS_NAME_SHOW$6 = 'show';
  const CLASS_NAME_DROPUP = 'dropup';
  const CLASS_NAME_DROPEND = 'dropend';
  const CLASS_NAME_DROPSTART = 'dropstart';
  const CLASS_NAME_DROPUP_CENTER = 'dropup-center';
  const CLASS_NAME_DROPDOWN_CENTER = 'dropdown-center';
  const SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)';
  const SELECTOR_DATA_TOGGLE_SHOWN = `${SELECTOR_DATA_TOGGLE$3}.${CLASS_NAME_SHOW$6}`;
  const SELECTOR_MENU = '.dropdown-menu';
  const SELECTOR_NAVBAR = '.navbar';
  const SELECTOR_NAVBAR_NAV = '.navbar-nav';
  const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
  const PLACEMENT_TOP = isRTL() ? 'top-end' : 'top-start';
  const PLACEMENT_TOPEND = isRTL() ? 'top-start' : 'top-end';
  const PLACEMENT_BOTTOM = isRTL() ? 'bottom-end' : 'bottom-start';
  const PLACEMENT_BOTTOMEND = isRTL() ? 'bottom-start' : 'bottom-end';
  const PLACEMENT_RIGHT = isRTL() ? 'left-start' : 'right-start';
  const PLACEMENT_LEFT = isRTL() ? 'right-start' : 'left-start';
  const PLACEMENT_TOPCENTER = 'top';
  const PLACEMENT_BOTTOMCENTER = 'bottom';
  const Default$9 = {
    autoClose: true,
    boundary: 'clippingParents',
    display: 'dynamic',
    offset: [0, 2],
    popperConfig: null,
    reference: 'toggle'
  };
  const DefaultType$9 = {
    autoClose: '(boolean|string)',
    boundary: '(string|element)',
    display: 'string',
    offset: '(array|string|function)',
    popperConfig: '(null|object|function)',
    reference: '(string|element|object)'
  };

  /**
   * Class definition
   */

  class Dropdown extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._popper = null;
      this._parent = this._element.parentNode; // dropdown wrapper
      // TODO: v6 revert #37011 & change markup https://getbootstrap.com/docs/5.3/forms/input-group/
      this._menu = SelectorEngine.next(this._element, SELECTOR_MENU)[0] || SelectorEngine.prev(this._element, SELECTOR_MENU)[0] || SelectorEngine.findOne(SELECTOR_MENU, this._parent);
      this._inNavbar = this._detectNavbar();
    }

    // Getters
    static get Default() {
      return Default$9;
    }
    static get DefaultType() {
      return DefaultType$9;
    }
    static get NAME() {
      return NAME$a;
    }

    // Public
    toggle() {
      return this._isShown() ? this.hide() : this.show();
    }
    show() {
      if (isDisabled(this._element) || this._isShown()) {
        return;
      }
      const relatedTarget = {
        relatedTarget: this._element
      };
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$5, relatedTarget);
      if (showEvent.defaultPrevented) {
        return;
      }
      this._createPopper();

      // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
      if ('ontouchstart' in document.documentElement && !this._parent.closest(SELECTOR_NAVBAR_NAV)) {
        for (const element of [].concat(...document.body.children)) {
          EventHandler.on(element, 'mouseover', noop);
        }
      }
      this._element.focus();
      this._element.setAttribute('aria-expanded', true);
      this._menu.classList.add(CLASS_NAME_SHOW$6);
      this._element.classList.add(CLASS_NAME_SHOW$6);
      EventHandler.trigger(this._element, EVENT_SHOWN$5, relatedTarget);
    }
    hide() {
      if (isDisabled(this._element) || !this._isShown()) {
        return;
      }
      const relatedTarget = {
        relatedTarget: this._element
      };
      this._completeHide(relatedTarget);
    }
    dispose() {
      if (this._popper) {
        this._popper.destroy();
      }
      super.dispose();
    }
    update() {
      this._inNavbar = this._detectNavbar();
      if (this._popper) {
        this._popper.update();
      }
    }

    // Private
    _completeHide(relatedTarget) {
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$5, relatedTarget);
      if (hideEvent.defaultPrevented) {
        return;
      }

      // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support
      if ('ontouchstart' in document.documentElement) {
        for (const element of [].concat(...document.body.children)) {
          EventHandler.off(element, 'mouseover', noop);
        }
      }
      if (this._popper) {
        this._popper.destroy();
      }
      this._menu.classList.remove(CLASS_NAME_SHOW$6);
      this._element.classList.remove(CLASS_NAME_SHOW$6);
      this._element.setAttribute('aria-expanded', 'false');
      Manipulator.removeDataAttribute(this._menu, 'popper');
      EventHandler.trigger(this._element, EVENT_HIDDEN$5, relatedTarget);
    }
    _getConfig(config) {
      config = super._getConfig(config);
      if (typeof config.reference === 'object' && !isElement(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') {
        // Popper virtual elements require a getBoundingClientRect method
        throw new TypeError(`${NAME$a.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
      }
      return config;
    }
    _createPopper() {
      if (typeof Popper__namespace === 'undefined') {
        throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org)');
      }
      let referenceElement = this._element;
      if (this._config.reference === 'parent') {
        referenceElement = this._parent;
      } else if (isElement(this._config.reference)) {
        referenceElement = getElement(this._config.reference);
      } else if (typeof this._config.reference === 'object') {
        referenceElement = this._config.reference;
      }
      const popperConfig = this._getPopperConfig();
      this._popper = Popper__namespace.createPopper(referenceElement, this._menu, popperConfig);
    }
    _isShown() {
      return this._menu.classList.contains(CLASS_NAME_SHOW$6);
    }
    _getPlacement() {
      const parentDropdown = this._parent;
      if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
        return PLACEMENT_RIGHT;
      }
      if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
        return PLACEMENT_LEFT;
      }
      if (parentDropdown.classList.contains(CLASS_NAME_DROPUP_CENTER)) {
        return PLACEMENT_TOPCENTER;
      }
      if (parentDropdown.classList.contains(CLASS_NAME_DROPDOWN_CENTER)) {
        return PLACEMENT_BOTTOMCENTER;
      }

      // We need to trim the value because custom properties can also include spaces
      const isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end';
      if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
        return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
      }
      return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
    }
    _detectNavbar() {
      return this._element.closest(SELECTOR_NAVBAR) !== null;
    }
    _getOffset() {
      const {
        offset
      } = this._config;
      if (typeof offset === 'string') {
        return offset.split(',').map(value => Number.parseInt(value, 10));
      }
      if (typeof offset === 'function') {
        return popperData => offset(popperData, this._element);
      }
      return offset;
    }
    _getPopperConfig() {
      const defaultBsPopperConfig = {
        placement: this._getPlacement(),
        modifiers: [{
          name: 'preventOverflow',
          options: {
            boundary: this._config.boundary
          }
        }, {
          name: 'offset',
          options: {
            offset: this._getOffset()
          }
        }]
      };

      // Disable Popper if we have a static display or Dropdown is in Navbar
      if (this._inNavbar || this._config.display === 'static') {
        Manipulator.setDataAttribute(this._menu, 'popper', 'static'); // TODO: v6 remove
        defaultBsPopperConfig.modifiers = [{
          name: 'applyStyles',
          enabled: false
        }];
      }
      return {
        ...defaultBsPopperConfig,
        ...execute(this._config.popperConfig, [defaultBsPopperConfig])
      };
    }
    _selectMenuItem({
      key,
      target
    }) {
      const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(element => isVisible(element));
      if (!items.length) {
        return;
      }

      // if target isn't included in items (e.g. when expanding the dropdown)
      // allow cycling to get the last item in case key equals ARROW_UP_KEY
      getNextActiveElement(items, target, key === ARROW_DOWN_KEY$1, !items.includes(target)).focus();
    }

    // Static
    static jQueryInterface(config) {
      return this.each(function () {
        const data = Dropdown.getOrCreateInstance(this, config);
        if (typeof config !== 'string') {
          return;
        }
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      });
    }
    static clearMenus(event) {
      if (event.button === RIGHT_MOUSE_BUTTON || event.type === 'keyup' && event.key !== TAB_KEY$1) {
        return;
      }
      const openToggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE_SHOWN);
      for (const toggle of openToggles) {
        const context = Dropdown.getInstance(toggle);
        if (!context || context._config.autoClose === false) {
          continue;
        }
        const composedPath = event.composedPath();
        const isMenuTarget = composedPath.includes(context._menu);
        if (composedPath.includes(context._element) || context._config.autoClose === 'inside' && !isMenuTarget || context._config.autoClose === 'outside' && isMenuTarget) {
          continue;
        }

        // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu
        if (context._menu.contains(event.target) && (event.type === 'keyup' && event.key === TAB_KEY$1 || /input|select|option|textarea|form/i.test(event.target.tagName))) {
          continue;
        }
        const relatedTarget = {
          relatedTarget: context._element
        };
        if (event.type === 'click') {
          relatedTarget.clickEvent = event;
        }
        context._completeHide(relatedTarget);
      }
    }
    static dataApiKeydownHandler(event) {
      // If not an UP | DOWN | ESCAPE key => not a dropdown command
      // If input/textarea && if key is other than ESCAPE => not a dropdown command

      const isInput = /input|textarea/i.test(event.target.tagName);
      const isEscapeEvent = event.key === ESCAPE_KEY$2;
      const isUpOrDownEvent = [ARROW_UP_KEY$1, ARROW_DOWN_KEY$1].includes(event.key);
      if (!isUpOrDownEvent && !isEscapeEvent) {
        return;
      }
      if (isInput && !isEscapeEvent) {
        return;
      }
      event.preventDefault();

      // TODO: v6 revert #37011 & change markup https://getbootstrap.com/docs/5.3/forms/input-group/
      const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.next(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.findOne(SELECTOR_DATA_TOGGLE$3, event.delegateTarget.parentNode);
      const instance = Dropdown.getOrCreateInstance(getToggleButton);
      if (isUpOrDownEvent) {
        event.stopPropagation();
        instance.show();
        instance._selectMenuItem(event);
        return;
      }
      if (instance._isShown()) {
        // else is escape and we check if it is shown
        event.stopPropagation();
        instance.hide();
        getToggleButton.focus();
      }
    }
  }

  /**
   * Data API implementation
   */

  EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler);
  EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
  EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
  EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
  EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function (event) {
    event.preventDefault();
    Dropdown.getOrCreateInstance(this).toggle();
  });

  /**
   * jQuery
   */

  defineJQueryPlugin(Dropdown);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/backdrop.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$9 = 'backdrop';
  const CLASS_NAME_FADE$4 = 'fade';
  const CLASS_NAME_SHOW$5 = 'show';
  const EVENT_MOUSEDOWN = `mousedown.bs.${NAME$9}`;
  const Default$8 = {
    className: 'modal-backdrop',
    clickCallback: null,
    isAnimated: false,
    isVisible: true,
    // if false, we use the backdrop helper without adding any element to the dom
    rootElement: 'body' // give the choice to place backdrop under different elements
  };

  const DefaultType$8 = {
    className: 'string',
    clickCallback: '(function|null)',
    isAnimated: 'boolean',
    isVisible: 'boolean',
    rootElement: '(element|string)'
  };

  /**
   * Class definition
   */

  class Backdrop extends Config {
    constructor(config) {
      super();
      this._config = this._getConfig(config);
      this._isAppended = false;
      this._element = null;
    }

    // Getters
    static get Default() {
      return Default$8;
    }
    static get DefaultType() {
      return DefaultType$8;
    }
    static get NAME() {
      return NAME$9;
    }

    // Public
    show(callback) {
      if (!this._config.isVisible) {
        execute(callback);
        return;
      }
      this._append();
      const element = this._getElement();
      if (this._config.isAnimated) {
        reflow(element);
      }
      element.classList.add(CLASS_NAME_SHOW$5);
      this._emulateAnimation(() => {
        execute(callback);
      });
    }
    hide(callback) {
      if (!this._config.isVisible) {
        execute(callback);
        return;
      }
      this._getElement().classList.remove(CLASS_NAME_SHOW$5);
      this._emulateAnimation(() => {
        this.dispose();
        execute(callback);
      });
    }
    dispose() {
      if (!this._isAppended) {
        return;
      }
      EventHandler.off(this._element, EVENT_MOUSEDOWN);
      this._element.remove();
      this._isAppended = false;
    }

    // Private
    _getElement() {
      if (!this._element) {
        const backdrop = document.createElement('div');
        backdrop.className = this._config.className;
        if (this._config.isAnimated) {
          backdrop.classList.add(CLASS_NAME_FADE$4);
        }
        this._element = backdrop;
      }
      return this._element;
    }
    _configAfterMerge(config) {
      // use getElement() with the default "body" to get a fresh Element on each instantiation
      config.rootElement = getElement(config.rootElement);
      return config;
    }
    _append() {
      if (this._isAppended) {
        return;
      }
      const element = this._getElement();
      this._config.rootElement.append(element);
      EventHandler.on(element, EVENT_MOUSEDOWN, () => {
        execute(this._config.clickCallback);
      });
      this._isAppended = true;
    }
    _emulateAnimation(callback) {
      executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
    }
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/focustrap.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$8 = 'focustrap';
  const DATA_KEY$5 = 'bs.focustrap';
  const EVENT_KEY$5 = `.${DATA_KEY$5}`;
  const EVENT_FOCUSIN$2 = `focusin${EVENT_KEY$5}`;
  const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY$5}`;
  const TAB_KEY = 'Tab';
  const TAB_NAV_FORWARD = 'forward';
  const TAB_NAV_BACKWARD = 'backward';
  const Default$7 = {
    autofocus: true,
    trapElement: null // The element to trap focus inside of
  };

  const DefaultType$7 = {
    autofocus: 'boolean',
    trapElement: 'element'
  };

  /**
   * Class definition
   */

  class FocusTrap extends Config {
    constructor(config) {
      super();
      this._config = this._getConfig(config);
      this._isActive = false;
      this._lastTabNavDirection = null;
    }

    // Getters
    static get Default() {
      return Default$7;
    }
    static get DefaultType() {
      return DefaultType$7;
    }
    static get NAME() {
      return NAME$8;
    }

    // Public
    activate() {
      if (this._isActive) {
        return;
      }
      if (this._config.autofocus) {
        this._config.trapElement.focus();
      }
      EventHandler.off(document, EVENT_KEY$5); // guard against infinite focus loop
      EventHandler.on(document, EVENT_FOCUSIN$2, event => this._handleFocusin(event));
      EventHandler.on(document, EVENT_KEYDOWN_TAB, event => this._handleKeydown(event));
      this._isActive = true;
    }
    deactivate() {
      if (!this._isActive) {
        return;
      }
      this._isActive = false;
      EventHandler.off(document, EVENT_KEY$5);
    }

    // Private
    _handleFocusin(event) {
      const {
        trapElement
      } = this._config;
      if (event.target === document || event.target === trapElement || trapElement.contains(event.target)) {
        return;
      }
      const elements = SelectorEngine.focusableChildren(trapElement);
      if (elements.length === 0) {
        trapElement.focus();
      } else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) {
        elements[elements.length - 1].focus();
      } else {
        elements[0].focus();
      }
    }
    _handleKeydown(event) {
      if (event.key !== TAB_KEY) {
        return;
      }
      this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
    }
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/scrollBar.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
  const SELECTOR_STICKY_CONTENT = '.sticky-top';
  const PROPERTY_PADDING = 'padding-right';
  const PROPERTY_MARGIN = 'margin-right';

  /**
   * Class definition
   */

  class ScrollBarHelper {
    constructor() {
      this._element = document.body;
    }

    // Public
    getWidth() {
      // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
      const documentWidth = document.documentElement.clientWidth;
      return Math.abs(window.innerWidth - documentWidth);
    }
    hide() {
      const width = this.getWidth();
      this._disableOverFlow();
      // give padding to element to balance the hidden scrollbar width
      this._setElementAttributes(this._element, PROPERTY_PADDING, calculatedValue => calculatedValue + width);
      // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements to keep showing fullwidth
      this._setElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING, calculatedValue => calculatedValue + width);
      this._setElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN, calculatedValue => calculatedValue - width);
    }
    reset() {
      this._resetElementAttributes(this._element, 'overflow');
      this._resetElementAttributes(this._element, PROPERTY_PADDING);
      this._resetElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING);
      this._resetElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN);
    }
    isOverflowing() {
      return this.getWidth() > 0;
    }

    // Private
    _disableOverFlow() {
      this._saveInitialAttribute(this._element, 'overflow');
      this._element.style.overflow = 'hidden';
    }
    _setElementAttributes(selector, styleProperty, callback) {
      const scrollbarWidth = this.getWidth();
      const manipulationCallBack = element => {
        if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
          return;
        }
        this._saveInitialAttribute(element, styleProperty);
        const calculatedValue = window.getComputedStyle(element).getPropertyValue(styleProperty);
        element.style.setProperty(styleProperty, `${callback(Number.parseFloat(calculatedValue))}px`);
      };
      this._applyManipulationCallback(selector, manipulationCallBack);
    }
    _saveInitialAttribute(element, styleProperty) {
      const actualValue = element.style.getPropertyValue(styleProperty);
      if (actualValue) {
        Manipulator.setDataAttribute(element, styleProperty, actualValue);
      }
    }
    _resetElementAttributes(selector, styleProperty) {
      const manipulationCallBack = element => {
        const value = Manipulator.getDataAttribute(element, styleProperty);
        // We only want to remove the property if the value is `null`; the value can also be zero
        if (value === null) {
          element.style.removeProperty(styleProperty);
          return;
        }
        Manipulator.removeDataAttribute(element, styleProperty);
        element.style.setProperty(styleProperty, value);
      };
      this._applyManipulationCallback(selector, manipulationCallBack);
    }
    _applyManipulationCallback(selector, callBack) {
      if (isElement(selector)) {
        callBack(selector);
        return;
      }
      for (const sel of SelectorEngine.find(selector, this._element)) {
        callBack(sel);
      }
    }
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap modal.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$7 = 'modal';
  const DATA_KEY$4 = 'bs.modal';
  const EVENT_KEY$4 = `.${DATA_KEY$4}`;
  const DATA_API_KEY$2 = '.data-api';
  const ESCAPE_KEY$1 = 'Escape';
  const EVENT_HIDE$4 = `hide${EVENT_KEY$4}`;
  const EVENT_HIDE_PREVENTED$1 = `hidePrevented${EVENT_KEY$4}`;
  const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$4}`;
  const EVENT_SHOW$4 = `show${EVENT_KEY$4}`;
  const EVENT_SHOWN$4 = `shown${EVENT_KEY$4}`;
  const EVENT_RESIZE$1 = `resize${EVENT_KEY$4}`;
  const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY$4}`;
  const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY$4}`;
  const EVENT_KEYDOWN_DISMISS$1 = `keydown.dismiss${EVENT_KEY$4}`;
  const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$4}${DATA_API_KEY$2}`;
  const CLASS_NAME_OPEN = 'modal-open';
  const CLASS_NAME_FADE$3 = 'fade';
  const CLASS_NAME_SHOW$4 = 'show';
  const CLASS_NAME_STATIC = 'modal-static';
  const OPEN_SELECTOR$1 = '.modal.show';
  const SELECTOR_DIALOG = '.modal-dialog';
  const SELECTOR_MODAL_BODY = '.modal-body';
  const SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]';
  const Default$6 = {
    backdrop: true,
    focus: true,
    keyboard: true
  };
  const DefaultType$6 = {
    backdrop: '(boolean|string)',
    focus: 'boolean',
    keyboard: 'boolean'
  };

  /**
   * Class definition
   */

  class Modal extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
      this._backdrop = this._initializeBackDrop();
      this._focustrap = this._initializeFocusTrap();
      this._isShown = false;
      this._isTransitioning = false;
      this._scrollBar = new ScrollBarHelper();
      this._addEventListeners();
    }

    // Getters
    static get Default() {
      return Default$6;
    }
    static get DefaultType() {
      return DefaultType$6;
    }
    static get NAME() {
      return NAME$7;
    }

    // Public
    toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    }
    show(relatedTarget) {
      if (this._isShown || this._isTransitioning) {
        return;
      }
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$4, {
        relatedTarget
      });
      if (showEvent.defaultPrevented) {
        return;
      }
      this._isShown = true;
      this._isTransitioning = true;
      this._scrollBar.hide();
      document.body.classList.add(CLASS_NAME_OPEN);
      this._adjustDialog();
      this._backdrop.show(() => this._showElement(relatedTarget));
    }
    hide() {
      if (!this._isShown || this._isTransitioning) {
        return;
      }
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$4);
      if (hideEvent.defaultPrevented) {
        return;
      }
      this._isShown = false;
      this._isTransitioning = true;
      this._focustrap.deactivate();
      this._element.classList.remove(CLASS_NAME_SHOW$4);
      this._queueCallback(() => this._hideModal(), this._element, this._isAnimated());
    }
    dispose() {
      EventHandler.off(window, EVENT_KEY$4);
      EventHandler.off(this._dialog, EVENT_KEY$4);
      this._backdrop.dispose();
      this._focustrap.deactivate();
      super.dispose();
    }
    handleUpdate() {
      this._adjustDialog();
    }

    // Private
    _initializeBackDrop() {
      return new Backdrop({
        isVisible: Boolean(this._config.backdrop),
        // 'static' option will be translated to true, and booleans will keep their value,
        isAnimated: this._isAnimated()
      });
    }
    _initializeFocusTrap() {
      return new FocusTrap({
        trapElement: this._element
      });
    }
    _showElement(relatedTarget) {
      // try to append dynamic modal
      if (!document.body.contains(this._element)) {
        document.body.append(this._element);
      }
      this._element.style.display = 'block';
      this._element.removeAttribute('aria-hidden');
      this._element.setAttribute('aria-modal', true);
      this._element.setAttribute('role', 'dialog');
      this._element.scrollTop = 0;
      const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);
      if (modalBody) {
        modalBody.scrollTop = 0;
      }
      reflow(this._element);
      this._element.classList.add(CLASS_NAME_SHOW$4);
      const transitionComplete = () => {
        if (this._config.focus) {
          this._focustrap.activate();
        }
        this._isTransitioning = false;
        EventHandler.trigger(this._element, EVENT_SHOWN$4, {
          relatedTarget
        });
      };
      this._queueCallback(transitionComplete, this._dialog, this._isAnimated());
    }
    _addEventListeners() {
      EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS$1, event => {
        if (event.key !== ESCAPE_KEY$1) {
          return;
        }
        if (this._config.keyboard) {
          this.hide();
          return;
        }
        this._triggerBackdropTransition();
      });
      EventHandler.on(window, EVENT_RESIZE$1, () => {
        if (this._isShown && !this._isTransitioning) {
          this._adjustDialog();
        }
      });
      EventHandler.on(this._element, EVENT_MOUSEDOWN_DISMISS, event => {
        // a bad trick to segregate clicks that may start inside dialog but end outside, and avoid listen to scrollbar clicks
        EventHandler.one(this._element, EVENT_CLICK_DISMISS, event2 => {
          if (this._element !== event.target || this._element !== event2.target) {
            return;
          }
          if (this._config.backdrop === 'static') {
            this._triggerBackdropTransition();
            return;
          }
          if (this._config.backdrop) {
            this.hide();
          }
        });
      });
    }
    _hideModal() {
      this._element.style.display = 'none';
      this._element.setAttribute('aria-hidden', true);
      this._element.removeAttribute('aria-modal');
      this._element.removeAttribute('role');
      this._isTransitioning = false;
      this._backdrop.hide(() => {
        document.body.classList.remove(CLASS_NAME_OPEN);
        this._resetAdjustments();
        this._scrollBar.reset();
        EventHandler.trigger(this._element, EVENT_HIDDEN$4);
      });
    }
    _isAnimated() {
      return this._element.classList.contains(CLASS_NAME_FADE$3);
    }
    _triggerBackdropTransition() {
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED$1);
      if (hideEvent.defaultPrevented) {
        return;
      }
      const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
      const initialOverflowY = this._element.style.overflowY;
      // return if the following background transition hasn't yet completed
      if (initialOverflowY === 'hidden' || this._element.classList.contains(CLASS_NAME_STATIC)) {
        return;
      }
      if (!isModalOverflowing) {
        this._element.style.overflowY = 'hidden';
      }
      this._element.classList.add(CLASS_NAME_STATIC);
      this._queueCallback(() => {
        this._element.classList.remove(CLASS_NAME_STATIC);
        this._queueCallback(() => {
          this._element.style.overflowY = initialOverflowY;
        }, this._dialog);
      }, this._dialog);
      this._element.focus();
    }

    /**
     * The following methods are used to handle overflowing modals
     */

    _adjustDialog() {
      const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
      const scrollbarWidth = this._scrollBar.getWidth();
      const isBodyOverflowing = scrollbarWidth > 0;
      if (isBodyOverflowing && !isModalOverflowing) {
        const property = isRTL() ? 'paddingLeft' : 'paddingRight';
        this._element.style[property] = `${scrollbarWidth}px`;
      }
      if (!isBodyOverflowing && isModalOverflowing) {
        const property = isRTL() ? 'paddingRight' : 'paddingLeft';
        this._element.style[property] = `${scrollbarWidth}px`;
      }
    }
    _resetAdjustments() {
      this._element.style.paddingLeft = '';
      this._element.style.paddingRight = '';
    }

    // Static
    static jQueryInterface(config, relatedTarget) {
      return this.each(function () {
        const data = Modal.getOrCreateInstance(this, config);
        if (typeof config !== 'string') {
          return;
        }
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config](relatedTarget);
      });
    }
  }

  /**
   * Data API implementation
   */

  EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function (event) {
    const target = SelectorEngine.getElementFromSelector(this);
    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }
    EventHandler.one(target, EVENT_SHOW$4, showEvent => {
      if (showEvent.defaultPrevented) {
        // only register focus restorer if modal will actually get shown
        return;
      }
      EventHandler.one(target, EVENT_HIDDEN$4, () => {
        if (isVisible(this)) {
          this.focus();
        }
      });
    });

    // avoid conflict when clicking modal toggler while another one is open
    const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR$1);
    if (alreadyOpen) {
      Modal.getInstance(alreadyOpen).hide();
    }
    const data = Modal.getOrCreateInstance(target);
    data.toggle(this);
  });
  enableDismissTrigger(Modal);

  /**
   * jQuery
   */

  defineJQueryPlugin(Modal);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap offcanvas.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$6 = 'offcanvas';
  const DATA_KEY$3 = 'bs.offcanvas';
  const EVENT_KEY$3 = `.${DATA_KEY$3}`;
  const DATA_API_KEY$1 = '.data-api';
  const EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$3}${DATA_API_KEY$1}`;
  const ESCAPE_KEY = 'Escape';
  const CLASS_NAME_SHOW$3 = 'show';
  const CLASS_NAME_SHOWING$1 = 'showing';
  const CLASS_NAME_HIDING = 'hiding';
  const CLASS_NAME_BACKDROP = 'offcanvas-backdrop';
  const OPEN_SELECTOR = '.offcanvas.show';
  const EVENT_SHOW$3 = `show${EVENT_KEY$3}`;
  const EVENT_SHOWN$3 = `shown${EVENT_KEY$3}`;
  const EVENT_HIDE$3 = `hide${EVENT_KEY$3}`;
  const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$3}`;
  const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$3}`;
  const EVENT_RESIZE = `resize${EVENT_KEY$3}`;
  const EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$3}${DATA_API_KEY$1}`;
  const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY$3}`;
  const SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="offcanvas"]';
  const Default$5 = {
    backdrop: true,
    keyboard: true,
    scroll: false
  };
  const DefaultType$5 = {
    backdrop: '(boolean|string)',
    keyboard: 'boolean',
    scroll: 'boolean'
  };

  /**
   * Class definition
   */

  class Offcanvas extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._isShown = false;
      this._backdrop = this._initializeBackDrop();
      this._focustrap = this._initializeFocusTrap();
      this._addEventListeners();
    }

    // Getters
    static get Default() {
      return Default$5;
    }
    static get DefaultType() {
      return DefaultType$5;
    }
    static get NAME() {
      return NAME$6;
    }

    // Public
    toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    }
    show(relatedTarget) {
      if (this._isShown) {
        return;
      }
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
        relatedTarget
      });
      if (showEvent.defaultPrevented) {
        return;
      }
      this._isShown = true;
      this._backdrop.show();
      if (!this._config.scroll) {
        new ScrollBarHelper().hide();
      }
      this._element.setAttribute('aria-modal', true);
      this._element.setAttribute('role', 'dialog');
      this._element.classList.add(CLASS_NAME_SHOWING$1);
      const completeCallBack = () => {
        if (!this._config.scroll || this._config.backdrop) {
          this._focustrap.activate();
        }
        this._element.classList.add(CLASS_NAME_SHOW$3);
        this._element.classList.remove(CLASS_NAME_SHOWING$1);
        EventHandler.trigger(this._element, EVENT_SHOWN$3, {
          relatedTarget
        });
      };
      this._queueCallback(completeCallBack, this._element, true);
    }
    hide() {
      if (!this._isShown) {
        return;
      }
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$3);
      if (hideEvent.defaultPrevented) {
        return;
      }
      this._focustrap.deactivate();
      this._element.blur();
      this._isShown = false;
      this._element.classList.add(CLASS_NAME_HIDING);
      this._backdrop.hide();
      const completeCallback = () => {
        this._element.classList.remove(CLASS_NAME_SHOW$3, CLASS_NAME_HIDING);
        this._element.removeAttribute('aria-modal');
        this._element.removeAttribute('role');
        if (!this._config.scroll) {
          new ScrollBarHelper().reset();
        }
        EventHandler.trigger(this._element, EVENT_HIDDEN$3);
      };
      this._queueCallback(completeCallback, this._element, true);
    }
    dispose() {
      this._backdrop.dispose();
      this._focustrap.deactivate();
      super.dispose();
    }

    // Private
    _initializeBackDrop() {
      const clickCallback = () => {
        if (this._config.backdrop === 'static') {
          EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
          return;
        }
        this.hide();
      };

      // 'static' option will be translated to true, and booleans will keep their value
      const isVisible = Boolean(this._config.backdrop);
      return new Backdrop({
        className: CLASS_NAME_BACKDROP,
        isVisible,
        isAnimated: true,
        rootElement: this._element.parentNode,
        clickCallback: isVisible ? clickCallback : null
      });
    }
    _initializeFocusTrap() {
      return new FocusTrap({
        trapElement: this._element
      });
    }
    _addEventListeners() {
      EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
        if (event.key !== ESCAPE_KEY) {
          return;
        }
        if (this._config.keyboard) {
          this.hide();
          return;
        }
        EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
      });
    }

    // Static
    static jQueryInterface(config) {
      return this.each(function () {
        const data = Offcanvas.getOrCreateInstance(this, config);
        if (typeof config !== 'string') {
          return;
        }
        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config](this);
      });
    }
  }

  /**
   * Data API implementation
   */

  EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function (event) {
    const target = SelectorEngine.getElementFromSelector(this);
    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }
    if (isDisabled(this)) {
      return;
    }
    EventHandler.one(target, EVENT_HIDDEN$3, () => {
      // focus on trigger when it is closed
      if (isVisible(this)) {
        this.focus();
      }
    });

    // avoid conflict when clicking a toggler of an offcanvas, while another is open
    const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);
    if (alreadyOpen && alreadyOpen !== target) {
      Offcanvas.getInstance(alreadyOpen).hide();
    }
    const data = Offcanvas.getOrCreateInstance(target);
    data.toggle(this);
  });
  EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
    for (const selector of SelectorEngine.find(OPEN_SELECTOR)) {
      Offcanvas.getOrCreateInstance(selector).show();
    }
  });
  EventHandler.on(window, EVENT_RESIZE, () => {
    for (const element of SelectorEngine.find('[aria-modal][class*=show][class*=offcanvas-]')) {
      if (getComputedStyle(element).position !== 'fixed') {
        Offcanvas.getOrCreateInstance(element).hide();
      }
    }
  });
  enableDismissTrigger(Offcanvas);

  /**
   * jQuery
   */

  defineJQueryPlugin(Offcanvas);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/sanitizer.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  // js-docs-start allow-list
  const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
  const DefaultAllowlist = {
    // Global attributes allowed on any supplied element below.
    '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
    a: ['target', 'href', 'title', 'rel'],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    div: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: []
  };
  // js-docs-end allow-list

  const uriAttributes = new Set(['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href']);

  /**
   * A pattern that recognizes URLs that are safe wrt. XSS in URL navigation
   * contexts.
   *
   * Shout-out to Angular https://github.com/angular/angular/blob/15.2.8/packages/core/src/sanitization/url_sanitizer.ts#L38
   */
  // eslint-disable-next-line unicorn/better-regex
  const SAFE_URL_PATTERN = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:/?#]*(?:[/?#]|$))/i;
  const allowedAttribute = (attribute, allowedAttributeList) => {
    const attributeName = attribute.nodeName.toLowerCase();
    if (allowedAttributeList.includes(attributeName)) {
      if (uriAttributes.has(attributeName)) {
        return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue));
      }
      return true;
    }

    // Check if a regular expression validates the attribute.
    return allowedAttributeList.filter(attributeRegex => attributeRegex instanceof RegExp).some(regex => regex.test(attributeName));
  };
  function sanitizeHtml(unsafeHtml, allowList, sanitizeFunction) {
    if (!unsafeHtml.length) {
      return unsafeHtml;
    }
    if (sanitizeFunction && typeof sanitizeFunction === 'function') {
      return sanitizeFunction(unsafeHtml);
    }
    const domParser = new window.DOMParser();
    const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
    const elements = [].concat(...createdDocument.body.querySelectorAll('*'));
    for (const element of elements) {
      const elementName = element.nodeName.toLowerCase();
      if (!Object.keys(allowList).includes(elementName)) {
        element.remove();
        continue;
      }
      const attributeList = [].concat(...element.attributes);
      const allowedAttributes = [].concat(allowList['*'] || [], allowList[elementName] || []);
      for (const attribute of attributeList) {
        if (!allowedAttribute(attribute, allowedAttributes)) {
          element.removeAttribute(attribute.nodeName);
        }
      }
    }
    return createdDocument.body.innerHTML;
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/template-factory.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$5 = 'TemplateFactory';
  const Default$4 = {
    allowList: DefaultAllowlist,
    content: {},
    // { selector : text ,  selector2 : text2 , }
    extraClass: '',
    html: false,
    sanitize: true,
    sanitizeFn: null,
    template: '<div></div>'
  };
  const DefaultType$4 = {
    allowList: 'object',
    content: 'object',
    extraClass: '(string|function)',
    html: 'boolean',
    sanitize: 'boolean',
    sanitizeFn: '(null|function)',
    template: 'string'
  };
  const DefaultContentType = {
    entry: '(string|element|function|null)',
    selector: '(string|element)'
  };

  /**
   * Class definition
   */

  class TemplateFactory extends Config {
    constructor(config) {
      super();
      this._config = this._getConfig(config);
    }

    // Getters
    static get Default() {
      return Default$4;
    }
    static get DefaultType() {
      return DefaultType$4;
    }
    static get NAME() {
      return NAME$5;
    }

    // Public
    getContent() {
      return Object.values(this._config.content).map(config => this._resolvePossibleFunction(config)).filter(Boolean);
    }
    hasContent() {
      return this.getContent().length > 0;
    }
    changeContent(content) {
      this._checkContent(content);
      this._config.content = {
        ...this._config.content,
        ...content
      };
      return this;
    }
    toHtml() {
      const templateWrapper = document.createElement('div');
      templateWrapper.innerHTML = this._maybeSanitize(this._config.template);
      for (const [selector, text] of Object.entries(this._config.content)) {
        this._setContent(templateWrapper, text, selector);
      }
      const template = templateWrapper.children[0];
      const extraClass = this._resolvePossibleFunction(this._config.extraClass);
      if (extraClass) {
        template.classList.add(...extraClass.split(' '));
      }
      return template;
    }

    // Private
    _typeCheckConfig(config) {
      super._typeCheckConfig(config);
      this._checkContent(config.content);
    }
    _checkContent(arg) {
      for (const [selector, content] of Object.entries(arg)) {
        super._typeCheckConfig({
          selector,
          entry: content
        }, DefaultContentType);
      }
    }
    _setContent(template, content, selector) {
      const templateElement = SelectorEngine.findOne(selector, template);
      if (!templateElement) {
        return;
      }
      content = this._resolvePossibleFunction(content);
      if (!content) {
        templateElement.remove();
        return;
      }
      if (isElement(content)) {
        this._putElementInTemplate(getElement(content), templateElement);
        return;
      }
      if (this._config.html) {
        templateElement.innerHTML = this._maybeSanitize(content);
        return;
      }
      templateElement.textContent = content;
    }
    _maybeSanitize(arg) {
      return this._config.sanitize ? sanitizeHtml(arg, this._config.allowList, this._config.sanitizeFn) : arg;
    }
    _resolvePossibleFunction(arg) {
      return execute(arg, [this]);
    }
    _putElementInTemplate(element, templateElement) {
      if (this._config.html) {
        templateElement.innerHTML = '';
        templateElement.append(element);
        return;
      }
      templateElement.textContent = element.textContent;
    }
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap tooltip.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$4 = 'tooltip';
  const DISALLOWED_ATTRIBUTES = new Set(['sanitize', 'allowList', 'sanitizeFn']);
  const CLASS_NAME_FADE$2 = 'fade';
  const CLASS_NAME_MODAL = 'modal';
  const CLASS_NAME_SHOW$2 = 'show';
  const SELECTOR_TOOLTIP_INNER = '.tooltip-inner';
  const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`;
  const EVENT_MODAL_HIDE = 'hide.bs.modal';
  const TRIGGER_HOVER = 'hover';
  const TRIGGER_FOCUS = 'focus';
  const TRIGGER_CLICK = 'click';
  const TRIGGER_MANUAL = 'manual';
  const EVENT_HIDE$2 = 'hide';
  const EVENT_HIDDEN$2 = 'hidden';
  const EVENT_SHOW$2 = 'show';
  const EVENT_SHOWN$2 = 'shown';
  const EVENT_INSERTED = 'inserted';
  const EVENT_CLICK$1 = 'click';
  const EVENT_FOCUSIN$1 = 'focusin';
  const EVENT_FOCUSOUT$1 = 'focusout';
  const EVENT_MOUSEENTER = 'mouseenter';
  const EVENT_MOUSELEAVE = 'mouseleave';
  const AttachmentMap = {
    AUTO: 'auto',
    TOP: 'top',
    RIGHT: isRTL() ? 'left' : 'right',
    BOTTOM: 'bottom',
    LEFT: isRTL() ? 'right' : 'left'
  };
  const Default$3 = {
    allowList: DefaultAllowlist,
    animation: true,
    boundary: 'clippingParents',
    container: false,
    customClass: '',
    delay: 0,
    fallbackPlacements: ['top', 'right', 'bottom', 'left'],
    html: false,
    offset: [0, 6],
    placement: 'top',
    popperConfig: null,
    sanitize: true,
    sanitizeFn: null,
    selector: false,
    template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner"></div>' + '</div>',
    title: '',
    trigger: 'hover focus'
  };
  const DefaultType$3 = {
    allowList: 'object',
    animation: 'boolean',
    boundary: '(string|element)',
    container: '(string|element|boolean)',
    customClass: '(string|function)',
    delay: '(number|object)',
    fallbackPlacements: 'array',
    html: 'boolean',
    offset: '(array|string|function)',
    placement: '(string|function)',
    popperConfig: '(null|object|function)',
    sanitize: 'boolean',
    sanitizeFn: '(null|function)',
    selector: '(string|boolean)',
    template: 'string',
    title: '(string|element|function)',
    trigger: 'string'
  };

  /**
   * Class definition
   */

  class Tooltip extends BaseComponent {
    constructor(element, config) {
      if (typeof Popper__namespace === 'undefined') {
        throw new TypeError('Bootstrap\'s tooltips require Popper (https://popper.js.org)');
      }
      super(element, config);

      // Private
      this._isEnabled = true;
      this._timeout = 0;
      this._isHovered = null;
      this._activeTrigger = {};
      this._popper = null;
      this._templateFactory = null;
      this._newContent = null;

      // Protected
      this.tip = null;
      this._setListeners();
      if (!this._config.selector) {
        this._fixTitle();
      }
    }

    // Getters
    static get Default() {
      return Default$3;
    }
    static get DefaultType() {
      return DefaultType$3;
    }
    static get NAME() {
      return NAME$4;
    }

    // Public
    enable() {
      this._isEnabled = true;
    }
    disable() {
      this._isEnabled = false;
    }
    toggleEnabled() {
      this._isEnabled = !this._isEnabled;
    }
    toggle() {
      if (!this._isEnabled) {
        return;
      }
      this._activeTrigger.click = !this._activeTrigger.click;
      if (this._isShown()) {
        this._leave();
        return;
      }
      this._enter();
    }
    dispose() {
      clearTimeout(this._timeout);
      EventHandler.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
      if (this._element.getAttribute('data-bs-original-title')) {
        this._element.setAttribute('title', this._element.getAttribute('data-bs-original-title'));
      }
      this._disposePopper();
      super.dispose();
    }
    show() {
      if (this._element.style.display === 'none') {
        throw new Error('Please use show on visible elements');
      }
      if (!(this._isWithContent() && this._isEnabled)) {
        return;
      }
      const showEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOW$2));
      const shadowRoot = findShadowRoot(this._element);
      const isInTheDom = (shadowRoot || this._element.ownerDocument.documentElement).contains(this._element);
      if (showEvent.defaultPrevented || !isInTheDom) {
        return;
      }

      // TODO: v6 remove this or make it optional
      this._disposePopper();
      const tip = this._getTipElement();
      this._element.setAttribute('aria-describedby', tip.getAttribute('id'));
      const {
        container
      } = this._config;
      if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
        container.append(tip);
        EventHandler.trigger(this._element, this.constructor.eventName(EVENT_INSERTED));
      }
      this._popper = this._createPopper(tip);
      tip.classList.add(CLASS_NAME_SHOW$2);

      // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
      if ('ontouchstart' in document.documentElement) {
        for (const element of [].concat(...document.body.children)) {
          EventHandler.on(element, 'mouseover', noop);
        }
      }
      const complete = () => {
        EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOWN$2));
        if (this._isHovered === false) {
          this._leave();
        }
        this._isHovered = false;
      };
      this._queueCallback(complete, this.tip, this._isAnimated());
    }
    hide() {
      if (!this._isShown()) {
        return;
      }
      const hideEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDE$2));
      if (hideEvent.defaultPrevented) {
        return;
      }
      const tip = this._getTipElement();
      tip.classList.remove(CLASS_NAME_SHOW$2);

      // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support
      if ('ontouchstart' in document.documentElement) {
        for (const element of [].concat(...document.body.children)) {
          EventHandler.off(element, 'mouseover', noop);
        }
      }
      this._activeTrigger[TRIGGER_CLICK] = false;
      this._activeTrigger[TRIGGER_FOCUS] = false;
      this._activeTrigger[TRIGGER_HOVER] = false;
      this._isHovered = null; // it is a trick to support manual triggering

      const complete = () => {
        if (this._isWithActiveTrigger()) {
          return;
        }
        if (!this._isHovered) {
          this._disposePopper();
        }
        this._element.removeAttribute('aria-describedby');
        EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDDEN$2));
      };
      this._queueCallback(complete, this.tip, this._isAnimated());
    }
    update() {
      if (this._popper) {
        this._popper.update();
      }
    }

    // Protected
    _isWithContent() {
      return Boolean(this._getTitle());
    }
    _getTipElement() {
      if (!this.tip) {
        this.tip = this._createTipElement(this._newContent || this._getContentForTemplate());
      }
      return this.tip;
    }
    _createTipElement(content) {
      const tip = this._getTemplateFactory(content).toHtml();

      // TODO: remove this check in v6
      if (!tip) {
        return null;
      }
      tip.classList.remove(CLASS_NAME_FADE$2, CLASS_NAME_SHOW$2);
      // TODO: v6 the following can be achieved with CSS only
      tip.classList.add(`bs-${this.constructor.NAME}-auto`);
      const tipId = getUID(this.constructor.NAME).toString();
      tip.setAttribute('id', tipId);
      if (this._isAnimated()) {
        tip.classList.add(CLASS_NAME_FADE$2);
      }
      return tip;
    }
    setContent(content) {
      this._newContent = content;
      if (this._isShown()) {
        this._disposePopper();
        this.show();
      }
    }
    _getTemplateFactory(content) {
      if (this._templateFactory) {
        this._templateFactory.changeContent(content);
      } else {
        this._templateFactory = new TemplateFactory({
          ...this._config,
          // the `content` var has to be after `this._config`
          // to override config.content in case of popover
          content,
          extraClass: this._resolvePossibleFunction(this._config.customClass)
        });
      }
      return this._templateFactory;
    }
    _getContentForTemplate() {
      return {
        [SELECTOR_TOOLTIP_INNER]: this._getTitle()
      };
    }
    _getTitle() {
      return this._resolvePossibleFunction(this._config.title) || this._element.getAttribute('data-bs-original-title');
    }

    // Private
    _initializeOnDelegatedTarget(event) {
      return this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig());
    }
    _isAnimated() {
      return this._config.animation || this.tip && this.tip.classList.contains(CLASS_NAME_FADE$2);
    }
    _isShown() {
      return this.tip && this.tip.classList.contains(CLASS_NAME_SHOW$2);
    }
    _createPopper(tip) {
      const placement = execute(this._config.placement, [this, tip, this._element]);
      const attachment = AttachmentMap[placement.toUpperCase()];
      return Popper__namespace.createPopper(this._element, tip, this._getPopperConfig(attachment));
    }
    _getOffset() {
      const {
        offset
      } = this._config;
      if (typeof offset === 'string') {
        return offset.split(',').map(value => Number.parseInt(value, 10));
      }
      if (typeof offset === 'function') {
        return popperData => offset(popperData, this._element);
      }
      return offset;
    }
    _resolvePossibleFunction(arg) {
      return execute(arg, [this._element]);
    }
    _getPopperConfig(attachment) {
      const defaultBsPopperConfig = {
        placement: attachment,
        modifiers: [{
          name: 'flip',
          options: {
            fallbackPlacements: this._config.fallbackPlacements
          }
        }, {
          name: 'offset',
          options: {
            offset: this._getOffset()
          }
        }, {
          name: 'preventOverflow',
          options: {
            boundary: this._config.boundary
          }
        }, {
          name: 'arrow',
          options: {
            element: `.${this.constructor.NAME}-arrow`
          }
        }, {
          name: 'preSetPlacement',
          enabled: true,
          phase: 'beforeMain',
          fn: data => {
            // Pre-set Popper's placement attribute in order to read the arrow sizes properly.
            // Otherwise, Popper mixes up the width and height dimensions since the initial arrow style is for top placement
            this._getTipElement().setAttribute('data-popper-placement', data.state.placement);
          }
        }]
      };
      return {
        ...defaultBsPopperConfig,
        ...execute(this._config.popperConfig, [defaultBsPopperConfig])
      };
    }
    _setListeners() {
      const triggers = this._config.trigger.split(' ');
      for (const trigger of triggers) {
        if (trigger === 'click') {
          EventHandler.on(this._element, this.constructor.eventName(EVENT_CLICK$1), this._config.selector, event => {
            const context = this._initializeOnDelegatedTarget(event);
            context.toggle();
          });
        } else if (trigger !== TRIGGER_MANUAL) {
          const eventIn = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSEENTER) : this.constructor.eventName(EVENT_FOCUSIN$1);
          const eventOut = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSELEAVE) : this.constructor.eventName(EVENT_FOCUSOUT$1);
          EventHandler.on(this._element, eventIn, this._config.selector, event => {
            const context = this._initializeOnDelegatedTarget(event);
            context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
            context._enter();
          });
          EventHandler.on(this._element, eventOut, this._config.selector, event => {
            const context = this._initializeOnDelegatedTarget(event);
            context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);
            context._leave();
          });
        }
      }
      this._hideModalHandler = () => {
        if (this._element) {
          this.hide();
        }
      };
      EventHandler.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
    }
    _fixTitle() {
      const title = this._element.getAttribute('title');
      if (!title) {
        return;
      }
      if (!this._element.getAttribute('aria-label') && !this._element.textContent.trim()) {
        this._element.setAttribute('aria-label', title);
      }
      this._element.setAttribute('data-bs-original-title', title); // DO NOT USE IT. Is only for backwards compatibility
      this._element.removeAttribute('title');
    }
    _enter() {
      if (this._isShown() || this._isHovered) {
        this._isHovered = true;
        return;
      }
      this._isHovered = true;
      this._setTimeout(() => {
        if (this._isHovered) {
          this.show();
        }
      }, this._config.delay.show);
    }
    _leave() {
      if (this._isWithActiveTrigger()) {
        return;
      }
      this._isHovered = false;
      this._setTimeout(() => {
        if (!this._isHovered) {
          this.hide();
        }
      }, this._config.delay.hide);
    }
    _setTimeout(handler, timeout) {
      clearTimeout(this._timeout);
      this._timeout = setTimeout(handler, timeout);
    }
    _isWithActiveTrigger() {
      return Object.values(this._activeTrigger).includes(true);
    }
    _getConfig(config) {
      const dataAttributes = Manipulator.getDataAttributes(this._element);
      for (const dataAttribute of Object.keys(dataAttributes)) {
        if (DISALLOWED_ATTRIBUTES.has(dataAttribute)) {
          delete dataAttributes[dataAttribute];
        }
      }
      config = {
        ...dataAttributes,
        ...(typeof config === 'object' && config ? config : {})
      };
      config = this._mergeConfigObj(config);
      config = this._configAfterMerge(config);
      this._typeCheckConfig(config);
      return config;
    }
    _configAfterMerge(config) {
      config.container = config.container === false ? document.body : getElement(config.container);
      if (typeof config.delay === 'number') {
        config.delay = {
          show: config.delay,
          hide: config.delay
        };
      }
      if (typeof config.title === 'number') {
        config.title = config.title.toString();
      }
      if (typeof config.content === 'number') {
        config.content = config.content.toString();
      }
      return config;
    }
    _getDelegateConfig() {
      const config = {};
      for (const [key, value] of Object.entries(this._config)) {
        if (this.constructor.Default[key] !== value) {
          config[key] = value;
        }
      }
      config.selector = false;
      config.trigger = 'manual';

      // In the future can be replaced with:
      // const keysWithDifferentValues = Object.entries(this._config).filter(entry => this.constructor.Default[entry[0]] !== this._config[entry[0]])
      // `Object.fromEntries(keysWithDifferentValues)`
      return config;
    }
    _disposePopper() {
      if (this._popper) {
        this._popper.destroy();
        this._popper = null;
      }
      if (this.tip) {
        this.tip.remove();
        this.tip = null;
      }
    }

    // Static
    static jQueryInterface(config) {
      return this.each(function () {
        const data = Tooltip.getOrCreateInstance(this, config);
        if (typeof config !== 'string') {
          return;
        }
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      });
    }
  }

  /**
   * jQuery
   */

  defineJQueryPlugin(Tooltip);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap popover.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$3 = 'popover';
  const SELECTOR_TITLE = '.popover-header';
  const SELECTOR_CONTENT = '.popover-body';
  const Default$2 = {
    ...Tooltip.Default,
    content: '',
    offset: [0, 8],
    placement: 'right',
    template: '<div class="popover" role="tooltip">' + '<div class="popover-arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div>' + '</div>',
    trigger: 'click'
  };
  const DefaultType$2 = {
    ...Tooltip.DefaultType,
    content: '(null|string|element|function)'
  };

  /**
   * Class definition
   */

  class Popover extends Tooltip {
    // Getters
    static get Default() {
      return Default$2;
    }
    static get DefaultType() {
      return DefaultType$2;
    }
    static get NAME() {
      return NAME$3;
    }

    // Overrides
    _isWithContent() {
      return this._getTitle() || this._getContent();
    }

    // Private
    _getContentForTemplate() {
      return {
        [SELECTOR_TITLE]: this._getTitle(),
        [SELECTOR_CONTENT]: this._getContent()
      };
    }
    _getContent() {
      return this._resolvePossibleFunction(this._config.content);
    }

    // Static
    static jQueryInterface(config) {
      return this.each(function () {
        const data = Popover.getOrCreateInstance(this, config);
        if (typeof config !== 'string') {
          return;
        }
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      });
    }
  }

  /**
   * jQuery
   */

  defineJQueryPlugin(Popover);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap scrollspy.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$2 = 'scrollspy';
  const DATA_KEY$2 = 'bs.scrollspy';
  const EVENT_KEY$2 = `.${DATA_KEY$2}`;
  const DATA_API_KEY = '.data-api';
  const EVENT_ACTIVATE = `activate${EVENT_KEY$2}`;
  const EVENT_CLICK = `click${EVENT_KEY$2}`;
  const EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$2}${DATA_API_KEY}`;
  const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
  const CLASS_NAME_ACTIVE$1 = 'active';
  const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
  const SELECTOR_TARGET_LINKS = '[href]';
  const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
  const SELECTOR_NAV_LINKS = '.nav-link';
  const SELECTOR_NAV_ITEMS = '.nav-item';
  const SELECTOR_LIST_ITEMS = '.list-group-item';
  const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_NAV_ITEMS} > ${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`;
  const SELECTOR_DROPDOWN = '.dropdown';
  const SELECTOR_DROPDOWN_TOGGLE$1 = '.dropdown-toggle';
  const Default$1 = {
    offset: null,
    // TODO: v6 @deprecated, keep it for backwards compatibility reasons
    rootMargin: '0px 0px -25%',
    smoothScroll: false,
    target: null,
    threshold: [0.1, 0.5, 1]
  };
  const DefaultType$1 = {
    offset: '(number|null)',
    // TODO v6 @deprecated, keep it for backwards compatibility reasons
    rootMargin: 'string',
    smoothScroll: 'boolean',
    target: 'element',
    threshold: 'array'
  };

  /**
   * Class definition
   */

  class ScrollSpy extends BaseComponent {
    constructor(element, config) {
      super(element, config);

      // this._element is the observablesContainer and config.target the menu links wrapper
      this._targetLinks = new Map();
      this._observableSections = new Map();
      this._rootElement = getComputedStyle(this._element).overflowY === 'visible' ? null : this._element;
      this._activeTarget = null;
      this._observer = null;
      this._previousScrollData = {
        visibleEntryTop: 0,
        parentScrollTop: 0
      };
      this.refresh(); // initialize
    }

    // Getters
    static get Default() {
      return Default$1;
    }
    static get DefaultType() {
      return DefaultType$1;
    }
    static get NAME() {
      return NAME$2;
    }

    // Public
    refresh() {
      this._initializeTargetsAndObservables();
      this._maybeEnableSmoothScroll();
      if (this._observer) {
        this._observer.disconnect();
      } else {
        this._observer = this._getNewObserver();
      }
      for (const section of this._observableSections.values()) {
        this._observer.observe(section);
      }
    }
    dispose() {
      this._observer.disconnect();
      super.dispose();
    }

    // Private
    _configAfterMerge(config) {
      // TODO: on v6 target should be given explicitly & remove the {target: 'ss-target'} case
      config.target = getElement(config.target) || document.body;

      // TODO: v6 Only for backwards compatibility reasons. Use rootMargin only
      config.rootMargin = config.offset ? `${config.offset}px 0px -30%` : config.rootMargin;
      if (typeof config.threshold === 'string') {
        config.threshold = config.threshold.split(',').map(value => Number.parseFloat(value));
      }
      return config;
    }
    _maybeEnableSmoothScroll() {
      if (!this._config.smoothScroll) {
        return;
      }

      // unregister any previous listeners
      EventHandler.off(this._config.target, EVENT_CLICK);
      EventHandler.on(this._config.target, EVENT_CLICK, SELECTOR_TARGET_LINKS, event => {
        const observableSection = this._observableSections.get(event.target.hash);
        if (observableSection) {
          event.preventDefault();
          const root = this._rootElement || window;
          const height = observableSection.offsetTop - this._element.offsetTop;
          if (root.scrollTo) {
            root.scrollTo({
              top: height,
              behavior: 'smooth'
            });
            return;
          }

          // Chrome 60 doesn't support `scrollTo`
          root.scrollTop = height;
        }
      });
    }
    _getNewObserver() {
      const options = {
        root: this._rootElement,
        threshold: this._config.threshold,
        rootMargin: this._config.rootMargin
      };
      return new IntersectionObserver(entries => this._observerCallback(entries), options);
    }

    // The logic of selection
    _observerCallback(entries) {
      const targetElement = entry => this._targetLinks.get(`#${entry.target.id}`);
      const activate = entry => {
        this._previousScrollData.visibleEntryTop = entry.target.offsetTop;
        this._process(targetElement(entry));
      };
      const parentScrollTop = (this._rootElement || document.documentElement).scrollTop;
      const userScrollsDown = parentScrollTop >= this._previousScrollData.parentScrollTop;
      this._previousScrollData.parentScrollTop = parentScrollTop;
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          this._activeTarget = null;
          this._clearActiveClass(targetElement(entry));
          continue;
        }
        const entryIsLowerThanPrevious = entry.target.offsetTop >= this._previousScrollData.visibleEntryTop;
        // if we are scrolling down, pick the bigger offsetTop
        if (userScrollsDown && entryIsLowerThanPrevious) {
          activate(entry);
          // if parent isn't scrolled, let's keep the first visible item, breaking the iteration
          if (!parentScrollTop) {
            return;
          }
          continue;
        }

        // if we are scrolling up, pick the smallest offsetTop
        if (!userScrollsDown && !entryIsLowerThanPrevious) {
          activate(entry);
        }
      }
    }
    _initializeTargetsAndObservables() {
      this._targetLinks = new Map();
      this._observableSections = new Map();
      const targetLinks = SelectorEngine.find(SELECTOR_TARGET_LINKS, this._config.target);
      for (const anchor of targetLinks) {
        // ensure that the anchor has an id and is not disabled
        if (!anchor.hash || isDisabled(anchor)) {
          continue;
        }
        const observableSection = SelectorEngine.findOne(decodeURI(anchor.hash), this._element);

        // ensure that the observableSection exists & is visible
        if (isVisible(observableSection)) {
          this._targetLinks.set(decodeURI(anchor.hash), anchor);
          this._observableSections.set(anchor.hash, observableSection);
        }
      }
    }
    _process(target) {
      if (this._activeTarget === target) {
        return;
      }
      this._clearActiveClass(this._config.target);
      this._activeTarget = target;
      target.classList.add(CLASS_NAME_ACTIVE$1);
      this._activateParents(target);
      EventHandler.trigger(this._element, EVENT_ACTIVATE, {
        relatedTarget: target
      });
    }
    _activateParents(target) {
      // Activate dropdown parents
      if (target.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
        SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, target.closest(SELECTOR_DROPDOWN)).classList.add(CLASS_NAME_ACTIVE$1);
        return;
      }
      for (const listGroup of SelectorEngine.parents(target, SELECTOR_NAV_LIST_GROUP)) {
        // Set triggered links parents as active
        // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
        for (const item of SelectorEngine.prev(listGroup, SELECTOR_LINK_ITEMS)) {
          item.classList.add(CLASS_NAME_ACTIVE$1);
        }
      }
    }
    _clearActiveClass(parent) {
      parent.classList.remove(CLASS_NAME_ACTIVE$1);
      const activeNodes = SelectorEngine.find(`${SELECTOR_TARGET_LINKS}.${CLASS_NAME_ACTIVE$1}`, parent);
      for (const node of activeNodes) {
        node.classList.remove(CLASS_NAME_ACTIVE$1);
      }
    }

    // Static
    static jQueryInterface(config) {
      return this.each(function () {
        const data = ScrollSpy.getOrCreateInstance(this, config);
        if (typeof config !== 'string') {
          return;
        }
        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      });
    }
  }

  /**
   * Data API implementation
   */

  EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => {
    for (const spy of SelectorEngine.find(SELECTOR_DATA_SPY)) {
      ScrollSpy.getOrCreateInstance(spy);
    }
  });

  /**
   * jQuery
   */

  defineJQueryPlugin(ScrollSpy);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap tab.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$1 = 'tab';
  const DATA_KEY$1 = 'bs.tab';
  const EVENT_KEY$1 = `.${DATA_KEY$1}`;
  const EVENT_HIDE$1 = `hide${EVENT_KEY$1}`;
  const EVENT_HIDDEN$1 = `hidden${EVENT_KEY$1}`;
  const EVENT_SHOW$1 = `show${EVENT_KEY$1}`;
  const EVENT_SHOWN$1 = `shown${EVENT_KEY$1}`;
  const EVENT_CLICK_DATA_API = `click${EVENT_KEY$1}`;
  const EVENT_KEYDOWN = `keydown${EVENT_KEY$1}`;
  const EVENT_LOAD_DATA_API = `load${EVENT_KEY$1}`;
  const ARROW_LEFT_KEY = 'ArrowLeft';
  const ARROW_RIGHT_KEY = 'ArrowRight';
  const ARROW_UP_KEY = 'ArrowUp';
  const ARROW_DOWN_KEY = 'ArrowDown';
  const HOME_KEY = 'Home';
  const END_KEY = 'End';
  const CLASS_NAME_ACTIVE = 'active';
  const CLASS_NAME_FADE$1 = 'fade';
  const CLASS_NAME_SHOW$1 = 'show';
  const CLASS_DROPDOWN = 'dropdown';
  const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
  const SELECTOR_DROPDOWN_MENU = '.dropdown-menu';
  const NOT_SELECTOR_DROPDOWN_TOGGLE = ':not(.dropdown-toggle)';
  const SELECTOR_TAB_PANEL = '.list-group, .nav, [role="tablist"]';
  const SELECTOR_OUTER = '.nav-item, .list-group-item';
  const SELECTOR_INNER = `.nav-link${NOT_SELECTOR_DROPDOWN_TOGGLE}, .list-group-item${NOT_SELECTOR_DROPDOWN_TOGGLE}, [role="tab"]${NOT_SELECTOR_DROPDOWN_TOGGLE}`;
  const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]'; // TODO: could only be `tab` in v6
  const SELECTOR_INNER_ELEM = `${SELECTOR_INNER}, ${SELECTOR_DATA_TOGGLE}`;
  const SELECTOR_DATA_TOGGLE_ACTIVE = `.${CLASS_NAME_ACTIVE}[data-bs-toggle="tab"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="pill"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="list"]`;

  /**
   * Class definition
   */

  class Tab extends BaseComponent {
    constructor(element) {
      super(element);
      this._parent = this._element.closest(SELECTOR_TAB_PANEL);
      if (!this._parent) {
        return;
        // TODO: should throw exception in v6
        // throw new TypeError(`${element.outerHTML} has not a valid parent ${SELECTOR_INNER_ELEM}`)
      }

      // Set up initial aria attributes
      this._setInitialAttributes(this._parent, this._getChildren());
      EventHandler.on(this._element, EVENT_KEYDOWN, event => this._keydown(event));
    }

    // Getters
    static get NAME() {
      return NAME$1;
    }

    // Public
    show() {
      // Shows this elem and deactivate the active sibling if exists
      const innerElem = this._element;
      if (this._elemIsActive(innerElem)) {
        return;
      }

      // Search for active tab on same parent to deactivate it
      const active = this._getActiveElem();
      const hideEvent = active ? EventHandler.trigger(active, EVENT_HIDE$1, {
        relatedTarget: innerElem
      }) : null;
      const showEvent = EventHandler.trigger(innerElem, EVENT_SHOW$1, {
        relatedTarget: active
      });
      if (showEvent.defaultPrevented || hideEvent && hideEvent.defaultPrevented) {
        return;
      }
      this._deactivate(active, innerElem);
      this._activate(innerElem, active);
    }

    // Private
    _activate(element, relatedElem) {
      if (!element) {
        return;
      }
      element.classList.add(CLASS_NAME_ACTIVE);
      this._activate(SelectorEngine.getElementFromSelector(element)); // Search and activate/show the proper section

      const complete = () => {
        if (element.getAttribute('role') !== 'tab') {
          element.classList.add(CLASS_NAME_SHOW$1);
          return;
        }
        element.removeAttribute('tabindex');
        element.setAttribute('aria-selected', true);
        this._toggleDropDown(element, true);
        EventHandler.trigger(element, EVENT_SHOWN$1, {
          relatedTarget: relatedElem
        });
      };
      this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
    }
    _deactivate(element, relatedElem) {
      if (!element) {
        return;
      }
      element.classList.remove(CLASS_NAME_ACTIVE);
      element.blur();
      this._deactivate(SelectorEngine.getElementFromSelector(element)); // Search and deactivate the shown section too

      const complete = () => {
        if (element.getAttribute('role') !== 'tab') {
          element.classList.remove(CLASS_NAME_SHOW$1);
          return;
        }
        element.setAttribute('aria-selected', false);
        element.setAttribute('tabindex', '-1');
        this._toggleDropDown(element, false);
        EventHandler.trigger(element, EVENT_HIDDEN$1, {
          relatedTarget: relatedElem
        });
      };
      this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
    }
    _keydown(event) {
      if (![ARROW_LEFT_KEY, ARROW_RIGHT_KEY, ARROW_UP_KEY, ARROW_DOWN_KEY, HOME_KEY, END_KEY].includes(event.key)) {
        return;
      }
      event.stopPropagation(); // stopPropagation/preventDefault both added to support up/down keys without scrolling the page
      event.preventDefault();
      const children = this._getChildren().filter(element => !isDisabled(element));
      let nextActiveElement;
      if ([HOME_KEY, END_KEY].includes(event.key)) {
        nextActiveElement = children[event.key === HOME_KEY ? 0 : children.length - 1];
      } else {
        const isNext = [ARROW_RIGHT_KEY, ARROW_DOWN_KEY].includes(event.key);
        nextActiveElement = getNextActiveElement(children, event.target, isNext, true);
      }
      if (nextActiveElement) {
        nextActiveElement.focus({
          preventScroll: true
        });
        Tab.getOrCreateInstance(nextActiveElement).show();
      }
    }
    _getChildren() {
      // collection of inner elements
      return SelectorEngine.find(SELECTOR_INNER_ELEM, this._parent);
    }
    _getActiveElem() {
      return this._getChildren().find(child => this._elemIsActive(child)) || null;
    }
    _setInitialAttributes(parent, children) {
      this._setAttributeIfNotExists(parent, 'role', 'tablist');
      for (const child of children) {
        this._setInitialAttributesOnChild(child);
      }
    }
    _setInitialAttributesOnChild(child) {
      child = this._getInnerElement(child);
      const isActive = this._elemIsActive(child);
      const outerElem = this._getOuterElement(child);
      child.setAttribute('aria-selected', isActive);
      if (outerElem !== child) {
        this._setAttributeIfNotExists(outerElem, 'role', 'presentation');
      }
      if (!isActive) {
        child.setAttribute('tabindex', '-1');
      }
      this._setAttributeIfNotExists(child, 'role', 'tab');

      // set attributes to the related panel too
      this._setInitialAttributesOnTargetPanel(child);
    }
    _setInitialAttributesOnTargetPanel(child) {
      const target = SelectorEngine.getElementFromSelector(child);
      if (!target) {
        return;
      }
      this._setAttributeIfNotExists(target, 'role', 'tabpanel');
      if (child.id) {
        this._setAttributeIfNotExists(target, 'aria-labelledby', `${child.id}`);
      }
    }
    _toggleDropDown(element, open) {
      const outerElem = this._getOuterElement(element);
      if (!outerElem.classList.contains(CLASS_DROPDOWN)) {
        return;
      }
      const toggle = (selector, className) => {
        const element = SelectorEngine.findOne(selector, outerElem);
        if (element) {
          element.classList.toggle(className, open);
        }
      };
      toggle(SELECTOR_DROPDOWN_TOGGLE, CLASS_NAME_ACTIVE);
      toggle(SELECTOR_DROPDOWN_MENU, CLASS_NAME_SHOW$1);
      outerElem.setAttribute('aria-expanded', open);
    }
    _setAttributeIfNotExists(element, attribute, value) {
      if (!element.hasAttribute(attribute)) {
        element.setAttribute(attribute, value);
      }
    }
    _elemIsActive(elem) {
      return elem.classList.contains(CLASS_NAME_ACTIVE);
    }

    // Try to get the inner element (usually the .nav-link)
    _getInnerElement(elem) {
      return elem.matches(SELECTOR_INNER_ELEM) ? elem : SelectorEngine.findOne(SELECTOR_INNER_ELEM, elem);
    }

    // Try to get the outer element (usually the .nav-item)
    _getOuterElement(elem) {
      return elem.closest(SELECTOR_OUTER) || elem;
    }

    // Static
    static jQueryInterface(config) {
      return this.each(function () {
        const data = Tab.getOrCreateInstance(this);
        if (typeof config !== 'string') {
          return;
        }
        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      });
    }
  }

  /**
   * Data API implementation
   */

  EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }
    if (isDisabled(this)) {
      return;
    }
    Tab.getOrCreateInstance(this).show();
  });

  /**
   * Initialize on focus
   */
  EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
    for (const element of SelectorEngine.find(SELECTOR_DATA_TOGGLE_ACTIVE)) {
      Tab.getOrCreateInstance(element);
    }
  });
  /**
   * jQuery
   */

  defineJQueryPlugin(Tab);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap toast.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME = 'toast';
  const DATA_KEY = 'bs.toast';
  const EVENT_KEY = `.${DATA_KEY}`;
  const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`;
  const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`;
  const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
  const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
  const EVENT_HIDE = `hide${EVENT_KEY}`;
  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
  const EVENT_SHOW = `show${EVENT_KEY}`;
  const EVENT_SHOWN = `shown${EVENT_KEY}`;
  const CLASS_NAME_FADE = 'fade';
  const CLASS_NAME_HIDE = 'hide'; // @deprecated - kept here only for backwards compatibility
  const CLASS_NAME_SHOW = 'show';
  const CLASS_NAME_SHOWING = 'showing';
  const DefaultType = {
    animation: 'boolean',
    autohide: 'boolean',
    delay: 'number'
  };
  const Default = {
    animation: true,
    autohide: true,
    delay: 5000
  };

  /**
   * Class definition
   */

  class Toast extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._timeout = null;
      this._hasMouseInteraction = false;
      this._hasKeyboardInteraction = false;
      this._setListeners();
    }

    // Getters
    static get Default() {
      return Default;
    }
    static get DefaultType() {
      return DefaultType;
    }
    static get NAME() {
      return NAME;
    }

    // Public
    show() {
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW);
      if (showEvent.defaultPrevented) {
        return;
      }
      this._clearTimeout();
      if (this._config.animation) {
        this._element.classList.add(CLASS_NAME_FADE);
      }
      const complete = () => {
        this._element.classList.remove(CLASS_NAME_SHOWING);
        EventHandler.trigger(this._element, EVENT_SHOWN);
        this._maybeScheduleHide();
      };
      this._element.classList.remove(CLASS_NAME_HIDE); // @deprecated
      reflow(this._element);
      this._element.classList.add(CLASS_NAME_SHOW, CLASS_NAME_SHOWING);
      this._queueCallback(complete, this._element, this._config.animation);
    }
    hide() {
      if (!this.isShown()) {
        return;
      }
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);
      if (hideEvent.defaultPrevented) {
        return;
      }
      const complete = () => {
        this._element.classList.add(CLASS_NAME_HIDE); // @deprecated
        this._element.classList.remove(CLASS_NAME_SHOWING, CLASS_NAME_SHOW);
        EventHandler.trigger(this._element, EVENT_HIDDEN);
      };
      this._element.classList.add(CLASS_NAME_SHOWING);
      this._queueCallback(complete, this._element, this._config.animation);
    }
    dispose() {
      this._clearTimeout();
      if (this.isShown()) {
        this._element.classList.remove(CLASS_NAME_SHOW);
      }
      super.dispose();
    }
    isShown() {
      return this._element.classList.contains(CLASS_NAME_SHOW);
    }

    // Private

    _maybeScheduleHide() {
      if (!this._config.autohide) {
        return;
      }
      if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
        return;
      }
      this._timeout = setTimeout(() => {
        this.hide();
      }, this._config.delay);
    }
    _onInteraction(event, isInteracting) {
      switch (event.type) {
        case 'mouseover':
        case 'mouseout':
          {
            this._hasMouseInteraction = isInteracting;
            break;
          }
        case 'focusin':
        case 'focusout':
          {
            this._hasKeyboardInteraction = isInteracting;
            break;
          }
      }
      if (isInteracting) {
        this._clearTimeout();
        return;
      }
      const nextElement = event.relatedTarget;
      if (this._element === nextElement || this._element.contains(nextElement)) {
        return;
      }
      this._maybeScheduleHide();
    }
    _setListeners() {
      EventHandler.on(this._element, EVENT_MOUSEOVER, event => this._onInteraction(event, true));
      EventHandler.on(this._element, EVENT_MOUSEOUT, event => this._onInteraction(event, false));
      EventHandler.on(this._element, EVENT_FOCUSIN, event => this._onInteraction(event, true));
      EventHandler.on(this._element, EVENT_FOCUSOUT, event => this._onInteraction(event, false));
    }
    _clearTimeout() {
      clearTimeout(this._timeout);
      this._timeout = null;
    }

    // Static
    static jQueryInterface(config) {
      return this.each(function () {
        const data = Toast.getOrCreateInstance(this, config);
        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }
          data[config](this);
        }
      });
    }
  }

  /**
   * Data API implementation
   */

  enableDismissTrigger(Toast);

  /**
   * jQuery
   */

  defineJQueryPlugin(Toast);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap index.umd.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  const index_umd = {
    Alert,
    Button,
    Carousel,
    Collapse,
    Dropdown,
    Modal,
    Offcanvas,
    Popover,
    ScrollSpy,
    Tab,
    Toast,
    Tooltip
  };

  return index_umd;

}));
//# sourceMappingURL=bootstrap.js.map
