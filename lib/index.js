"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
var set_ = function (state, subs) { return function (key) { return ({
    with: function (value) {
        var state_ = state;
        var subs_ = subs;
        state_[key] = value;
        subs_[key] && Object.keys(subs[key]).forEach(function (subKey) {
            subs_[key][subKey](state_);
        });
    },
    at: function (itemKey) { return ({
        with: function (item) {
            var _a;
            var state_ = state;
            var subs_ = subs;
            set_(state_, subs_)(key).with(__assign(__assign({}, state_[key]), (_a = {}, _a[itemKey] = item, _a)));
        }
    }); }
}); }; };
var get_ = function (state) { return function () { return state; }; };
var once_ = function (state) { return function (fn) {
    fn(state);
}; };
var listenOn_ = function (state, subs) { return function (subKey) { return ({
    for: function (keys) { return ({
        subscribe: function (fn) {
            var state_ = state;
            var subs_ = subs;
            keys.forEach(function (stateKey) {
                subs_[stateKey] = subs_[stateKey] ? subs_[stateKey] : {};
                subs_[stateKey][subKey] = fn;
            });
            fn(state_);
        },
        while: function (condition) { return ({
            subscribe: function (fn) {
                var state_ = state;
                var subs_ = subs;
                if (condition(state_)) {
                    keys.forEach(function (stateKey) {
                        subs_[stateKey] = subs_[stateKey] ? subs_[stateKey] : {};
                        subs_[stateKey][subKey] = function (state) {
                            // test condition on all future calls
                            if (condition(state)) {
                                fn(state);
                            }
                            else {
                                keys.forEach(function (stateKey) {
                                    if (subs_[stateKey] && subs_[stateKey][subKey]) {
                                        delete subs_[stateKey][subKey];
                                    }
                                });
                            }
                        };
                    });
                    fn(state_);
                }
            }
        }); }
    }); },
    fromNext: function (keys) { return ({
        subscribe: function (fn) {
            var subs_ = subs;
            keys.forEach(function (stateKey) {
                subs_[stateKey] = subs_[stateKey] ? subs_[stateKey] : {};
                subs_[stateKey][subKey] = fn;
            });
        },
        while: function (condition) { return ({
            subscribe: function (fn) {
                var state_ = state;
                var subs_ = subs;
                keys.forEach(function (stateKey) {
                    subs_[stateKey] = subs_[stateKey] ? subs_[stateKey] : {};
                    subs_[stateKey][subKey] = function (state) {
                        // test condition on all future calls
                        if (condition(state)) {
                            fn(state);
                        }
                        else {
                            keys.forEach(function (stateKey) {
                                if (subs_[stateKey] && subs_[stateKey][subKey]) {
                                    delete subs_[stateKey][subKey];
                                }
                            });
                        }
                    };
                });
            }
        }); }
    }); }
}); }; };
exports.register = function () {
    var state = {};
    var subs = {};
    return {
        set: set_(state, subs),
        get: get_(state),
        once: once_(state),
        listenOn: listenOn_(state, subs),
    };
};
