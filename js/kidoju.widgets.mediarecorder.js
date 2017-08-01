/**
 * Copyright (c) 2013-2017 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true */
/* globals define: false */

(function (f, define) {
    'use strict';
    define([
        './window.assert',
        './window.logger',
        './vendor/kendo/kendo.binder'
    ], f);
})(function () {

    'use strict';

    (function ($, undefined) {

        var kendo = window.kendo;
        var ui = kendo.ui;
        var Widget = ui.Widget;
        var assert = window.assert;
        var logger = new window.Logger('kidoju.widgets.mediarecorder');
        var navigator = window.navigator;
        var NS = '.kendoMediaRecorder';
        var UNDEFINED = 'undefined';
        var CHANGE = 'change';
        var ERROR = 'error';
        var WIDGET_CLASS = 'kj-mediarecorder';
        var TYPES = [
            'video/webm',
            'audio/webm',
            'video/mpeg',
            'video/mp4'
        ];
        var CODECS = [
            // https://cs.chromium.org/chromium/src/third_party/WebKit/LayoutTests/fast/mediarecorder/MediaRecorder-isTypeSupported.html
            '', // THis is the only option that works with
            '; codecs="vp8"', // these codecs only work with Chrome, not FF
            ';codecs=vp8',
            ';codecs=vp9',
            ';codecs=daala',
            ';codecs=h264',
            ';codecs=opus'
        ];

        /*********************************************************************************
         * Helpers
         *********************************************************************************/

        // TODO https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Using_the_MediaStream_Recording_API

        var URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

        // TODO shimSourceObject from https://webrtc.github.io/adapter/adapter-latest.js

        // TODO audio and video source selection
        // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices

        /**
         * navigator.mediaDevices.getUserMedia converted to jQuery promises
         * @ see https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
         */
        function getUserMedia (constraints) {
            var dfd = $.Deferred();

            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

                // That's for the most recent browsers
                navigator.mediaDevices.getUserMedia(constraints)
                .then(dfd.resolve).catch(dfd.reject);

            } else {

                // With older browsers, get ahold of the legacy getUserMedia, if present
                var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

                // If the browser is very old
                if (!getUserMedia) {
                    // TODO: we might want to fallback to flash - see https://github.com/addyosmani/getUserMedia.js
                    return dfd.reject(new Error('getUserMedia is not implemented in this browser'));
                }

                // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
                getUserMedia(constraints, dfd.resolve, dfd.reject);
            }

            return dfd.promise();
        }

        // From @samdutton's "Record Audio and Video with MediaRecorder"
        // https://developers.google.com/web/updates/2016/01/mediarecorder
        function download() {
            /*
            theRecorder.stop();
            theStream.getTracks().forEach(track => { track.stop(); });

            var blob = new Blob(recordedChunks, {type: "video/webm"});
            var url =  URL.createObjectURL(blob);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = url;
            a.download = 'test.webm';
            a.click();
            // setTimeout() here is needed for Firefox.
            setTimeout(function() { URL.revokeObjectURL(url); }, 100);
            */
        }


        /*********************************************************************************
         * Widget
         *********************************************************************************/

        /**
         * MediaRecorder (kendoMediaRecorder)
         * @see https://developers.google.com/web/updates/2016/01/mediarecorder
         * @see https://addpipe.com/blog/mediarecorder-api/
         * @see https://webrtc.github.io/samples/
         * @see https://webrtc.github.io/samples/src/content/getusermedia/record/
         * @see https://quickblox.github.io/javascript-media-recorder/sample/
         * @see https://rawgit.com/Miguelao/demos/master/mediarecorder.html
         * @see https://github.com/mattdiamond/Recorderjs
         * @class MediaRecorder
         * @extend Widget
         */
        var MediaRecorder = Widget.extend({

            /**
             * Initializes the widget
             * @method init
             * @param element
             * @param options
             */
            init: function (element, options) {
                var that = this;
                that.ns = NS;
                Widget.fn.init.call(that, element, options);
                logger.debug({ method: 'init', message: 'widget initialized' });
                that._layout();
                that.enable(that.options.enable);
                kendo.notify(that);
            },

            /**
             * Widget events
             * @property events
             */
            events: [
                CHANGE,
                ERROR
            ],

            /**
             * Widget options
             * @property options
             */
            options: {
                name: 'MediaRecorder',
                enable: true,
                audio: true,
                video: true, // { mandatory: { minWidth: 640, minHeight: 360 }
                mimeType: TYPES[0],
                codec: CODECS[0]
            },

            /**
             * Builds the widget layout
             * @method _layout
             * @private
             */
            _layout: function () {
                var that = this;
                var element = that.element;
                var options = that.options;
                that.wrapper = element;
                element.addClass(WIDGET_CLASS);
                that.preview = $('<video autoplay></video>').appendTo(element);
            },


            /**
             * Pause recording/playing
             */
            pause: function () {},

            /**
             * Play recorded video
             */
            play: function () {},

            /**
             * Start recording
             */
            record: function () {
                var that = this;
                var options = that.options;
                var preview = that.preview.get(0);

                that._chunks = [];

                getUserMedia({ audio: options.audio, video: options.video })
                    .done(function (mediaStream) {
                        if ('srcObject' in preview) {
                            // Older browsers may not have srcObject
                            preview.srcObject = mediaStream;
                        } else {
                            // Avoid using this in new browsers, as it is going away.
                            preview.src = URL.createObjectURL(mediaStream);
                        }
                        // preview.controls = true;
                        // preview.onloadedmetadata = function(e) {
                        //    preview.play();
                        // };

                        // Create a media recorder
                        // https://developers.google.com/web/updates/2016/01/mediarecorder
                        // that._mediaRecorder = new MediaRecorder(mediaStream, { mimeType: options.mimeType + options.codec });
                        that._mediaRecorder = new MediaRecorder(preview.captureStream(), { mimeType: options.mimeType + options.codec });

                        // Add chunks
                        that._mediaRecorder.ondataavailable = function(e) {
                            if (e && e.data && e.data.size > 0) {
                                that._chunks.push(e.data);
                            }
                        };

                        that._mediaRecorder.onstop = function(e) {
                            var video = document.createElement('preview');
                            video.controls = true;
                            var blob = new Blob(that._chunks, { type : options.mimeType });
                            // if ('srcObject' in preview) {
                            // Older browsers may not have srcObject
                            // preview.srcObject = blob;
                            // } else {
                            // Avoid using this in new browsers, as it is going away.
                            video.src = URL.createObjectURL(blob);
                            // }
                            document.body.appendChild(video);
                        };

                        that._mediaRecorder.start();
                    })
                    .fail(that._errorHandler.bind(that));
            },

            /**
             * Stop recording
             */
            stop: function () {
                if (this._mediaRecorder instanceof MediaRecorder) {
                    this._mediaRecorder.stop();
                }
            },

            /**
             * Error handler
             * @param err
             * @private
             */
            _errorHandler: function (err) {
                if (!this.trigger(ERROR)) {
                    window.alert('Oops, there was an error'); // TODO
                }
            },

            /**
             * Function called by the enabled/disabled bindings
             * @param enable
             */
            enable: function (enabled) {

            },

            /**
             * Destroys the widget
             * @method destroy
             */
            destroy: function () {
                var that = this;
                var element = that.element;
                // Unbind events
                that.enable(false);

                // Clear references

                // Destroy widget
                Widget.fn.destroy.call(that);
                kendo.destroy(element);
            }
        });

        ui.plugin(MediaRecorder);

    } (window.jQuery));

    return window.kendo;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });
