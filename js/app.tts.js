/**
 * Copyright (c) 2013-2017 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true */
/* globals define: false, require: false */


(function (f, define) {
    'use strict';
    define([
        './window.assert',
        './window.logger'
    ], f);
})(function () {

    'use strict';

    var app = window.app = window.app || {};
    var tts = app.tts = app.tts || {};
    var UNDEFINED = 'undefined';
    var CHUNK_SIZE = 175;

    (function ($, undefined) {

        var assert = window.assert;
        var logger = new window.Logger('app.tts');

        /**
         * Test cordova plugin
         * @see https://github.com/vilic/cordova-plugin-tts
         * @type {*}
         */
        tts.useCordovaPlugIn = !!(window.cordova && window.device && window.device.platform !== 'browser' && window.TTS && $.isFunction(window.TTS.speak));

        /**
         * Test HTML5 Speech API
         */
        tts.useSpeechSynthesis = !!('speechSynthesis' in window && $.isFunction(window.speechSynthesis.speak) && $.isFunction(window.SpeechSynthesisUtterance));

        /**
         * Clear markdown from markings that are irrelevant to speech
         * (Note it is also possible to convert to html and request the text())
         * @param markdown
         * @private
         */
        tts._clearMarkdown = function (markdown) {
            return markdown
                .replace(/[#`>_\*]/g, '') // remove headings, code (backticks), emphasis
                .replace(/!?\[([^\]]+)\]\([^\)]+\)/g, '$1'); // remove web and image links
        };

        /**
         * Chrome does not speak text longer than approx. 300 characters,
         * so we need to chunk text into an array of smaller strings to play
         * @see http://stackoverflow.com/questions/21947730/chrome-speech-synthesis-with-longer-texts
         * @see https://github.com/unk1911/speech/blob/master/js/speech.js
         * @param text
         * @private
         */
        tts._chunk = function (text, size) {
            var ret = [];
            // Chromium is chrome or opera and window.StyleMedia excludes MS Edge
            // @see http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
            if ('chrome' in window && $.type(window.StyleMedia) === UNDEFINED) {
                var matches = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
                var version = $.isArray(matches) && matches.length === 3 && parseInt(matches[2], 10);
                if (version < 56) {
                    // Note: This regular expression could be improved:
                    // 1. to exclude native voices which do not fail at ~200-300 characters
                    // 2. not to break up numbers like 10,000.00 - see https://github.com/unk1911/speech/blob/master/js/speech.js
                    var rx = new RegExp(
                        '^[\\s\\S]{' + Math.floor(size / 2) + ',' + size +
                        '}[.!?,]{1}|^[\\s\\S]{1,' + size + '}$|^[\\s\\S]{1,' +
                        size + '} ');
                    while (text.length > 0) {
                        var chunk = text.match(rx)[0];
                        ret.push(chunk.trim());
                        text = text.substring(chunk.length);
                    }
                } else {
                    ret.push(text);
                }
            } else {
                ret.push(text);
            }
            return ret;
        };

        /**
         * Get a speach synthesis promise
         * @param text
         * @param language
         * @private
         */
        tts._speachSynthesisPromise = function (text, language) {
            var dfd = $.Deferred();
            if (tts.useSpeechSynthesis) {
                var utterance = new window.SpeechSynthesisUtterance(text);
                if ($.type(window.StyleMedia) === UNDEFINED) {
                    // Setting an unavailable language in Microsoft Edge breaks the speech
                    // and we could not yet find how to list available languages
                    utterance.lang = language;
                }
                // http://www.hongkiat.com/blog/text-to-speech/
                utterance.voice = window.speechSynthesis.getVoices()[0];
                utterance.rate = 1;
                utterance.onend = function (evt) { // Returns a SpeechSynthesisEvent
                    if (evt.type === 'error') {
                        // This occurs on Edge when the language pack has not been installed
                        dfd.reject(new Error('Speech synthesis error'));
                    } else {
                        dfd.resolve(evt);
                    }
                };
                utterance.onerror = dfd.reject;
                window.speechSynthesis.speak(utterance);
                if ('console' in window) {
                    window.console.log(utterance); // a funny workaround to ensure the onend callback is called in Chrome
                }
            } else {
                dfd.resolve();
            }
            return dfd.promise();
        };

        /**
         * Use tts to speak
         * @param text
         * @param language
         * @param clear
         */
        tts.doSpeak = function (text, language, clear) {
            var dfd = $.Deferred();
            if (clear) {
                text = tts._clearMarkdown(text);
            }
            if (tts.useCordovaPlugIn) {
                window.alert('Plugin');
                // For iOS and Android via TTS plugin
                // Note: iOS WKWebView engine for cordova supports speechSynthesis (see other branch of if) but does not output any sound
                window.TTS.speak({ text: text, locale: language === 'fr' ? 'fr-FR' : 'en-US', rate: 1.5 }, dfd.resolve, dfd.reject);
            } else if (tts.useSpeechSynthesis) {
                // In the browser - https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
                var chunks = tts._chunk(text, CHUNK_SIZE);
                window.alert('Chunks ' + chunks.length);
                var promises = [];
                $.each(chunks, function (index, chunk) {
                    promises.push(tts._speachSynthesisPromise(chunk, language));
                });
                $.when.apply(null, promises)
                    .done(dfd.resolve)
                    .fail(dfd.reject);
            } else {
                dfd.resolve();
            }
            return dfd.promise();
        };

        /**
         * Use tts to cancel speak
         */
        tts.cancelSpeak = function () {
            var dfd =  $.Deferred();
            if (tts.useCordovaPlugIn) {
                // For iOS and Android via TTS plugin
                // @see http://ourcodeworld.com/articles/read/370/how-to-convert-text-to-speech-speech-synthesis-in-cordova
                window.TTS.speak('', dfd.resolve, dfd.reject);
            }  else if (tts.useSpeechSynthesis) {
                // In the browser - https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/cancel
                window.speechSynthesis.cancel();
                dfd.resolve();
            } else {
                dfd.resolve();
            }
            return dfd.promise();
        };

    }(window.jQuery));

    return app.tts;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });
