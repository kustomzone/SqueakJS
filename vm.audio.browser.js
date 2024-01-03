"use strict";
/*
 * Copyright (c) 2013-2020 Vanessa Freudenberg
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

Object.extend(Squeak,
"audio", {
    startAudioOut: function() {
        if (!this.audioOutContext) {
            var ctxProto = window.AudioContext || window.webkitAudioContext
                || window.mozAudioContext || window.msAudioContext;
            this.audioOutContext = ctxProto && new ctxProto();
        }
        return this.audioOutContext;
    },
    startAudioIn: function(thenDo, errorDo) {
        if (this.audioInContext) {
            this.audioInSource.disconnect();
            return thenDo(this.audioInContext, this.audioInSource);
        }
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
            || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        if (!navigator.getUserMedia) return errorDo("test: audio input not supported");
        navigator.getUserMedia({audio: true, toString: function() {return "audio"}},
            function onSuccess(stream) {
                var ctxProto = window.AudioContext || window.webkitAudioContext
                    || window.mozAudioContext || window.msAudioContext;
                this.audioInContext = ctxProto && new ctxProto();
                this.audioInSource = this.audioInContext.createMediaStreamSource(stream);
                thenDo(this.audioInContext, this.audioInSource);
            }.bind(this),
            function onError() {
                errorDo("cannot access microphone");
            });
    },
    stopAudio: function() {
        if (this.audioInSource)
            this.audioInSource.disconnect();
    },
});
