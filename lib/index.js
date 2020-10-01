"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
var setState_ = function (state, subs) { return function (stateKey, stateAtKey) {
    var state_ = state;
    var subs_ = subs;
    state_[stateKey] = stateAtKey;
    subs_[stateKey] && Object.keys(subs[stateKey]).forEach(function (subKey) {
        subs_[stateKey][subKey](state_);
    });
}; };
var fromStateOnce_ = function (state, subs) { return function (stateKeys, fn) {
    var state_ = state;
    fn(state_);
}; };
var fromState_ = function (state, subs) { return function (subKey, stateKeys, fn) {
    var state_ = state;
    var subs_ = subs;
    stateKeys.forEach(function (stateKey) {
        subs_[stateKey] = subs_[stateKey] ? subs_[stateKey] : {};
        subs_[stateKey][subKey] = fn;
    });
    fn(state_);
}; };
var fromNextState_ = function (state, subs) { return function (subKey, stateKeys, fn) {
    var state_ = state;
    var subs_ = subs;
    stateKeys.forEach(function (stateKey) {
        subs_[stateKey] = subs_[stateKey] ? subs_[stateKey] : {};
        subs_[stateKey][subKey] = fn;
    });
}; };
var fromStateWhile_ = function (state, subs) { return function (subKey, condition, stateKeys, fn) {
    var state_ = state;
    var subs_ = subs;
    if (condition(state_)) {
        stateKeys.forEach(function (stateKey) {
            subs_[stateKey] = subs_[stateKey] ? subs_[stateKey] : {};
            subs_[stateKey][subKey] = fn;
        });
        fn(state_);
    }
    else {
        stateKeys.forEach(function (stateKey) {
            delete subs_[stateKey][subKey];
        });
    }
}; };
var fromNextStateWhile_ = function (state, subs) { return function (subKey, condition, stateKeys, fn) {
    var state_ = state;
    var subs_ = subs;
    if (condition(state_)) {
        stateKeys.forEach(function (stateKey) {
            subs_[stateKey] = subs_[stateKey] ? subs_[stateKey] : {};
            subs_[stateKey][subKey] = fn;
        });
    }
    else {
        stateKeys.forEach(function (stateKey) {
            delete subs_[stateKey][subKey];
        });
    }
}; };
exports.register = function () {
    var state = {};
    var subs = {};
    return {
        setState: setState_(state, subs),
        fromStateOnce: fromStateOnce_(state, subs),
        fromState: fromState_(state, subs),
        fromStateWhile: fromStateWhile_(state, subs),
        fromNextState: fromNextState_(state, subs),
        fromNextStateWhile: fromNextStateWhile_(state, subs)
    };
};
