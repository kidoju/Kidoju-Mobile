/*! Copyright ©2013-2021 Memba® Sarl. All rights reserved. - Version 0.3.8 dated Fri Apr 23 2021 */
(self.webpackChunkMemba_SmartQuiz=self.webpackChunkMemba_SmartQuiz||[]).push([[3777],{18941:function(e,t,n){"use strict";n.d(t,{Z:function(){return x}});var a=n(86902),i=n.n(a),o=n(14310),s=n.n(o),l=n(20116),r=n.n(l),d=n(34074),c=n.n(d),u=n(39649),m=n.n(u),h=n(73609),f=n.n(h),p=(n(55031),n(28490)),g=n(52013),Z=n(52426),v=n(58957),b=n(52482),E=n(38970),S=(n(41587),n(77766)),w=n.n(S),k=(n(1700),n(3850)),y=window.kendo,C=y.destroy,T=y.ui,_=T.plugin,M=T.Widget,L=new k.Z("widgets.buttonbox"),A=".kendoButtonBox",F=M.extend({init:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};M.fn.init.call(this,e,t),L.debug({method:"init",message:"widget initialized"}),this._render(),this.setOptions({enabled:!this.element.prop("disabled")&&this.options.enabled,readonly:!!this.element.prop("readonly")||this.options.readonly,value:this.options.value})},events:[Z.Z.CHANGE,Z.Z.CLICK],options:{name:"ButtonBox",enabled:!0,readonly:!1,value:"",iconClass:"k-i-more-horizontal"},setOptions:function(e){this.enable(e.enabled),this.readonly(e.readonly),this.value(e.value)},value:function(e){var t,n=this.element,a=n.val();return f().type(e)===Z.Z.UNDEFINED?t=a:e!==a&&n.val(e),t},_render:function(){var e=this.element,t=this.options;g.Z.ok(e.is(Z.Z.INPUT),"Please use an input tag to instantiate a ButtonBox widget."),this._inputWrapper=e.wrap("<".concat(Z.Z.SPAN,"/>")).parent().addClass("k-picker-wrap").addClass(Z.Z.DEFAULT_CLASS),this.wrapper=this._inputWrapper.wrap("<".concat(Z.Z.SPAN,"/>")).parent().addClass("k-widget k-datepicker").addClass("kj-buttonbox").addClass(e.attr("class")).attr("style",e.attr("style")),this._button=f()("<".concat(Z.Z.SPAN,"/>")).addClass("k-icon ".concat(t.iconClass)).wrap("<".concat(Z.Z.SPAN,"/>")).parent().addClass("k-select").attr({ariaLabel:"select",role:"button",unselectable:"on"}).appendTo(this._inputWrapper),e.removeAttr("class").addClass("k-input").removeAttr("style").css({width:"100%"})},enable:function(e){var t,n,a,i,o,s,l,r,d=f().type(e)===Z.Z.UNDEFINED||!!e,c=this._button,u=this._inputWrapper,m=this.element;(c.off(A),u.off(A),m.off(A),d)?(c.on(w()(t="".concat(Z.Z.MOUSEDOWN)).call(t,A),(function(e){return e.preventDefault()})).on(w()(n="".concat(Z.Z.MOUSEUP)).call(n,A),this._onClick.bind(this)),u.addClass(Z.Z.DEFAULT_CLASS).removeClass(Z.Z.DISABLED_CLASS).on(w()(a=w()(i=w()(o="".concat(Z.Z.MOUSEENTER)).call(o,A," ")).call(i,Z.Z.MOUSELEAVE)).call(a,A),this._toggleHover.bind(this)),m.removeAttr(Z.Z.DISABLED).attr(Z.Z.ARIA_DISABLED,!1).on(w()(s="".concat(Z.Z.CHANGE)).call(s,A),this._onChange.bind(this)).on(w()(l="".concat(Z.Z.FOCUSOUT)).call(l,A),this._onBlur.bind(this)).on(w()(r="".concat(Z.Z.FOCUS)).call(r,A),this._onFocus.bind(this))):(u.addClass(d?Z.Z.DEFAULT_CLASS:Z.Z.DISABLED_CLASS).removeClass(d?Z.Z.DISABLED_CLASS:Z.Z.DEFAULT_CLASS),m.attr(Z.Z.DISABLED,!d).attr(Z.Z.ARIA_DISABLED,!d))},readonly:function(e){var t=f().type(e)===Z.Z.UNDEFINED||!!e;this.element.attr(Z.Z.READONLY,t)},_onBlur:function(){this._inputWrapper.removeClass(Z.Z.FOCUSED_CLASS)},_onChange:function(){this.trigger(Z.Z.CHANGE)},_onClick:function(){this.element.blur(),this.trigger(Z.Z.CLICK)},_onFocus:function(){this._inputWrapper.addClass(Z.Z.FOCUSED_CLASS)},_toggleHover:function(e){f()(e.currentTarget).toggleClass(Z.Z.HOVER_CLASS,e.type===Z.Z.MOUSEENTER)},destroy:function(){var e=this._button,t=this._inputWrapper,n=this.element;M.fn.destroy.call(this),L.debug({method:"destroy",message:"widget destroyed"}),e.off(A),n.off(A),t.off(A),C(n)}});Object.prototype.hasOwnProperty.call(window.kendo.ui,"ButtonBox")||_(F);var D=n(26986),N=n(40793);function U(e,t){var n=i()(e);if(s()){var a=s()(e);t&&(a=r()(a).call(a,(function(t){return c()(e,t).enumerable}))),n.push.apply(n,a)}return n}function O(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?U(Object(n),!0).forEach((function(t){I(e,t,n[t])})):m()?Object.defineProperties(e,m()(n)):U(Object(n)).forEach((function(t){Object.defineProperty(e,t,c()(n,t))}))}return e}function I(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var B=window.kendo.ui.BaseDialog,x=D.Z.extend({init:function(e,t){var n=this;D.Z.fn.init.call(this,e),this.type=Z.Z.STRING,this.defaultValue=this.defaultValue||(this.nullable?null:""),this.editor=function(e,a){f()("<".concat(Z.Z.INPUT,">")).css({width:"100%"}).prop({readonly:!0}).attr(O(O(O({name:a.field},a.attributes),(0,v.DX)(Z.Z.BIND,"value: ".concat(a.field))),t)).appendTo(e).kendoButtonBox({click:n.showDialog.bind(n,a)})}},showDialog:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};g.Z.instanceof(b.I,e.model,g.Z.format(g.Z.messages.instanceof.default,"options.model","PageComponent")),g.Z.instanceof(N.Z,p.Z[e.model.tool],g.Z.format(g.Z.messages.instanceof.default,"assets[options.model.tool]","ToolAssets")),(0,E.Z)({title:e.title||this.title,data:{value:e.model.get(e.field)},assets:p.Z[e.model.tool]}).then((function(t){t.action===B.fn.options.messages.actions.ok.action&&e.model.set(e.field,t.data.value)})).catch(f().noop)}})},13984:function(e,t,n){"use strict";var a=n(73609),i=n.n(a),o=(n(55031),n(94179),n(52426)),s=n(26986),l=window.kendo.attr,r=s.Z.extend({init:function(e,t){s.Z.fn.init.call(this,e),this.type=o.Z.BOOLEAN,this.defaultValue=this.defaultValue||!!this.nullable&&null,this.editor="input",this.attributes=i().extend({},this.attributes,t),this.attributes[l(o.Z.ROLE)]="switch"}});t.Z=r},17975:function(e,t,n){"use strict";var a,i=n(77766),o=n.n(i),s=n(94473),l=n.n(s),r=n(93476),d=n.n(r),c=n(73609),u=n.n(c),m=(n(55031),n(65048),n(13730),n(52013)),h=n(52426),f=n(3850),p=window.kendo,g=p.attr,Z=p.destroy,v=p.format,b=p.fx,E=p.ns,S=p.ui,w=S.plugin,k=S.Slider,y=S.Widget,C=new f.Z("widgets.audiovideo"),T=".kendoAudioVideo",_="k-widget kj-audiovideo",M=o()(a='<a href="#" class="k-button k-button-icon" data-'.concat(E)).call(a,h.Z.ACTION,'="{0}" tabindex="0" title="{1}"><span class="k-icon {2}"></span></a>'),L="a.k-button[".concat(g(h.Z.ACTION),'="{0}"]'),A="span.k-icon",F="kj-audiovideo-seeker",D="div.".concat(F),N="kj-audiovideo-time",U="span.".concat(N),O="kj-audiovideo-volume",I="div.".concat(O),B="loadedmetadata",x="play",P="timeupdate",H="volumechange",R="pause",j="ended",V="play",z="volume",W="full",Q="audio",q="video",G="k-i-full-screen",K="k-i-volume-off",Y="k-i-pause",X="k-i-play",J="k-i-volume-up";function $(e){switch(m.Z.type(h.Z.STRING,e,m.Z.format(m.Z.messages.type.default,"url",h.Z.STRING)),e.split(".").pop()){case"mp3":return"audio/mpeg";case"mp4":return"video/mp4";case"ogg":return"audio/ogg";case"ogv":return"video/ogg";case"wav":return"audio/wav";case"webm":return"video/webm";default:return"application/octet-stream"}}function ee(e){m.Z.type(h.Z.NUMBER,e,m.Z.format(m.Z.messages.type.default,"seconds",h.Z.NUMBER)),m.Z.ok(e>=0&&e<86400,"Cannot format negative numbers or days.");var t=Math.round(e),n=Math.floor(t/60),a=Math.floor(n/60);return t%=60,n%=60,0===a?v("{0:00}:{1:00}",n,t):v("{0:00}:{1:00}:{2:00}",a,n,t)}var te=y.extend({init:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};y.fn.init.call(this,e,t),C.debug({method:"init",message:"widget initialized"}),this._render()},options:{name:"AudioVideo",autoPlay:!1,enabled:!0,files:[],messages:{play:"Play/Pause",mute:"Mute/Unmute",fullScreen:"Full Screen",notSupported:"Media not supported"},mode:Q,toolbarHeight:48},modes:{audio:Q,video:q},_render:function(){var e=this.element,t=this.options;this.wrapper=e.addClass(_).addClass(h.Z.INTERACTIVE_CLASS).css({position:"relative"}),this._media(),this._toolbar(),this.enable(t.enabled)},_media:function(){var e=this,t=this.element,n=this.options;n.mode===Q?this.media=u()("<audio/>"):this.media=u()("<video/>"),this.media.attr("preload","auto").prop("autoplay",n.autoPlay).css({width:"100%"});var a=u().type(n.files)===h.Z.STRING?[n.files]:n.files;m.Z.isArray(a,m.Z.format(m.Z.messages.isArray.default,"options.files")),a.forEach((function(t){u().type(t)===h.Z.STRING&&t.length&&u()("<source/>").attr({src:t,type:$(t)}).appendTo(e.media)})),this.media.append(n.messages.notSupported).on(B,this._onLoadedMetadata.bind(this)).on(x,this._onPlay.bind(this)).on(P,this._onTimeUpdate.bind(this)).on(R,this._onPause.bind(this)).on(j,this._onEnded.bind(this)).on(H,this._onVolumeChange.bind(this)),t.append(this.media)},_onLoadedMetadata:function(e){if(m.Z.instanceof(u().Event,e,m.Z.format(m.Z.messages.instanceof.default,"e","jQuery.Event")),this.toolbar instanceof u()&&this.seekerSlider instanceof k&&this.volumeSlider instanceof k){var t,n=e.target;m.Z.instanceof(window.HTMLMediaElement,n,m.Z.format(m.Z.messages.instanceof.default,"this.media.get(0)","HTMLMediaElement")),this._setSeekerSlider(n.duration),this.seekerSlider.value(0),l()(t=this.toolbar).call(t,U).text(ee(n.duration)),this.volumeSlider.value(n.volume),this.resize()}},_onPlay:function(e){m.Z.instanceof(u().Event,e,m.Z.format(m.Z.messages.instanceof.default,"e","jQuery.Event"));var t,n=this.media.get(0);(m.Z.instanceof(window.HTMLMediaElement,n,m.Z.format(m.Z.messages.instanceof.default,"this.media.get(0)","HTMLMediaElement")),this.toolbar instanceof u())&&l()(t=this.toolbar).call(t,v(L,V)).children(A).removeClass(X).addClass(Y)},_onTimeUpdate:function(e){if(m.Z.instanceof(u().Event,e,m.Z.format(m.Z.messages.instanceof.default,"e","jQuery.Event")),this.toolbar instanceof u()){var t,n=e.target;m.Z.instanceof(window.HTMLMediaElement,n,m.Z.format(m.Z.messages.instanceof.default,"this.media.get(0)","HTMLMediaElement")),l()(t=this.toolbar).call(t,U).text(ee(n.duration-n.currentTime)),this.seekerSlider.value(n.currentTime)}},_onPause:function(e){m.Z.instanceof(u().Event,e,m.Z.format(m.Z.messages.instanceof.default,"e","jQuery.Event"));var t,n=this.media.get(0);(m.Z.instanceof(window.HTMLMediaElement,n,m.Z.format(m.Z.messages.instanceof.default,"this.media.get(0)","HTMLMediaElement")),this.toolbar instanceof u())&&l()(t=this.toolbar).call(t,v(L,V)).children(A).removeClass(Y).addClass(X)},_onEnded:function(e){if(m.Z.instanceof(u().Event,e,m.Z.format(m.Z.messages.instanceof.default,"e","jQuery.Event")),this.toolbar instanceof u()&&this.seekerSlider instanceof k){var t,n=e.target;m.Z.instanceof(window.HTMLMediaElement,n,m.Z.format(m.Z.messages.instanceof.default,"this.media.get(0)","HTMLMediaElement")),n.currentTime=0,this.seekerSlider.value(n.currentTime),l()(t=this.toolbar).call(t,v(L,V)).children(A).removeClass(Y).addClass(X)}},_onVolumeChange:function(e){m.Z.instanceof(u().Event,e,m.Z.format(m.Z.messages.instanceof.default,"e","jQuery.Event"));var t,n,a=this.media.get(0);(m.Z.instanceof(window.HTMLMediaElement,a,m.Z.format(m.Z.messages.instanceof.default,"this.media.get(0)","HTMLMediaElement")),this.toolbar instanceof u()&&this.volumeSlider instanceof k)&&(a.muted?(this.volumeSlider.value(0),l()(t=this.toolbar).call(t,v(L,z)).children(A).removeClass(K).addClass(J)):(this.volumeSlider.value(a.volume),l()(n=this.toolbar).call(n,v(L,z)).children(A).removeClass(J).addClass(K)))},_toolbar:function(){var e=this.element,t=this.options,n={boxSizing:"border-box",width:"100%"};t.mode===q&&u().extend(n,{bottom:0,left:0,position:"absolute",visibility:"hidden",zIndex:99}),this.toolbar=u()("<".concat(h.Z.DIV,"/>")).addClass("k-widget k-toolbar kj-audiovideo-toolbar").css(n).appendTo(e),u()(v(M,V,t.messages.play,X)).appendTo(this.toolbar),this._setSeekerSlider(1),u()("<".concat(h.Z.SPAN,"/>")).addClass(N).appendTo(this.toolbar),u()(v(M,z,t.messages.mute,K)).appendTo(this.toolbar),this._setVolumeSlider(),t.mode===q&&u()(v(M,W,t.messages.fullScreen,G)).appendTo(this.toolbar)},_setSeekerSlider:function(e){var t=this.toolbar,n=l()(t).call(t,D);n&&0===n.length&&(n=u()("<".concat(h.Z.DIV,"/>")).addClass(F).appendTo(t));var a=l()(n).call(n,"input").data("kendoSlider");a instanceof k&&(a.destroy(),n.empty()),this.seekerSlider=u()("<".concat(h.Z.INPUT,">")).appendTo(n).kendoSlider({max:e,min:0,smallStep:.1,largeStep:1,showButtons:!1,tickPlacement:"none",tooltip:{template:function(e){return ee(e.value)}},change:this._onSeekerSliderChange.bind(this)}).data("kendoSlider")},_setVolumeSlider:function(){var e=this.toolbar,t=l()(e).call(e,I);t&&0===t.length&&(t=u()("<".concat(h.Z.DIV,"/>")).addClass(O).appendTo(e));var n=l()(t).call(t,"input").data("kendoSlider");n instanceof k&&(n.destroy(),t.empty()),this.volumeSlider=u()("<".concat(h.Z.INPUT,">")).appendTo(t).kendoSlider({max:1,min:0,smallStep:.05,largeStep:.25,showButtons:!1,tickPlacement:"none",tooltip:{format:"{0:p0}"},change:this._onVolumeSliderChange.bind(this)}).data("kendoSlider")},_onButtonClick:function(e){switch(m.Z.instanceof(u().Event,e,m.Z.format(m.Z.messages.instanceof.default,"e","jQuery.Event")),u()(e.currentTarget).attr(g(h.Z.ACTION))){case V:default:this.togglePlayPause();break;case z:this.toggleMute();break;case W:this.toggleFullScreen()}},togglePlayPause:function(){var e=this.media.get(0);m.Z.instanceof(window.HTMLMediaElement,e,m.Z.format(m.Z.messages.instanceof.default,"this.media.get(0)","HTMLMediaElement"));var t,n=u().Deferred();try{(t=e.paused&&e.readyState>=1?e.play():e.pause())instanceof d()?t.then(n.resolve).catch(n.reject):n.resolve()}catch(e){n.reject(e)}return n.promise()},toggleMute:function(){var e=this.media.get(0);m.Z.instanceof(window.HTMLMediaElement,e,m.Z.format(m.Z.messages.instanceof.default,"this.media.get(0)","HTMLMediaElement")),e.muted=!e.muted},toggleFullScreen:function(){var e=this.media.get(0);m.Z.instanceof(window.HTMLVideoElement,e,m.Z.format(m.Z.messages.instanceof.default,"this.media.get(0)","HTMLVideoElement")),document.fullscreenElement===e||document.webkitFullscreenElement===e||document.msFullscreenElement===e||document.mozFullScreenElement===e?u().isFunction(document.exitFullscreen)?document.exitFullscreen():u().isFunction(document.webkitExitFullscreen)?document.webkitExitFullscreen():u().isFunction(document.msExitFullscreen)?document.msExitFullscreen():u().isFunction(document.mozCancelFullScreen)&&document.mozCancelFullScreen():document.fullscreenEnabled&&u().isFunction(e.requestFullscreen)?e.requestFullscreen():document.webkitFullscreenEnabled&&u().isFunction(e.webkitRequestFullscreen)?e.webkitRequestFullscreen(window.Element.ALLOW_KEYBOARD_INPUT):document.msFullscreenEnabled&&u().isFunction(e.msRequestFullscreen)?e.msRequestFullscreen():document.mozFullScreenEnabled&&u().isFunction(e.mozRequestFullScreen)&&e.mozRequestFullScreen()},_onVolumeSliderChange:function(e){m.Z.isNonEmptyPlainObject(e,m.Z.format(m.Z.messages.isNonEmptyPlainObject.default,"e","jQuery.Event")),this.volume(e.value)},volume:function(e){var t;m.Z.typeOrUndef(h.Z.NUMBER,e,m.Z.format(m.Z.messages.typeOrUndef.default,"value",h.Z.NUMBER));var n=this.media.get(0);return m.Z.instanceof(window.HTMLMediaElement,n,m.Z.format(m.Z.messages.instanceof.default,"this.media.get(0)","HTMLMediaElement")),u().type(e)===h.Z.UNDEFINED?t=n.volume:n.volume=e<0?0:e>1?1:e,t},_onSeekerSliderChange:function(e){this.seek(e.value)},seek:function(e){var t;m.Z.typeOrUndef(h.Z.NUMBER,e,m.Z.format(m.Z.messages.nullableTypeOrUndef.default,"value",h.Z.NUMBER));var n=this.media.get(0);if(m.Z.instanceof(window.HTMLMediaElement,n,m.Z.format(m.Z.messages.instanceof.default,"this.media.get(0)","HTMLMediaElement")),u().type(e)===h.Z.UNDEFINED)t=n.currentTime;else{var a=Math.min(Math.max(e,0),n.duration);n.pause(),a>=n.seekable.start(0)&&a<=n.seekable.end(0)?n.currentTime=a:n.currentTime=0,n.paused||n.play()}return t},resize:function(){var e=this.element,t=this.media,n=this.options,a=this.seekerSlider,i=this.toolbar,o=this.volumeSlider;if(t instanceof u()&&i instanceof u()&&a instanceof k&&o instanceof k){i.css({visibility:"hidden"}).show();var s=l()(i).call(i,"a.k-button").show(),r=l()(i).call(i,D).show(),d=l()(i).call(i,U).show(),c=l()(i).call(i,I).show(),m=n.mode===q,h=m?n.toolbarHeight:e.height(),f=e.width(),p=h/100,g=4*p,Z=h-2*g,b=1.5*Z;m&&e.height(t.height()),i.height(h),s.css({fontSize:.7*.8*Z,height:Z,width:Z,margin:g}),s.children("svg").attr({height:Math.max(Z-10,0),width:Math.max(Z-10,0)});var E=Z+2*g;d.css({fontSize:.8*Z,margin:"0 ".concat(g),lineHeight:"1em"});var S=d.width()+2*g;c.css({margin:3*g}),o.wrapper.width(Z),o.resize();var w=c.width()+6*g,y=i.width()-(s.length*E+S+w);if(r.css({margin:3*g}),a.wrapper.width(Math.max(y-6*g-24*p,0)),a.resize(),p>.5){l()(i).call(i,".k-slider-track").css({height:2*p*8,marginTop:2*p*-4}),l()(i).call(i,".k-slider-selection").css({height:2*p*8,marginTop:2*p*-4});var C=l()(i).call(i,".k-draghandle");C.css({height:4*p*8,width:4*p*8,borderRadius:2*p*8}),C.first().css({left:-2*p*8})}l()(s).call(s,v(L,z)).toggle(f>=s.length*E),l()(s).call(s,v(L,W)).toggle(f>=(s.length-1)*E),d.toggle(f>=s.length*E+S),c.toggle(f>=s.length*E+S+w),r.toggle(r.width()>=b),i.toggle(!m||!this._enabled).css({visibility:"visible"})}},enable:function(e){var t=u().type(e)===h.Z.UNDEFINED||!!e,n=this.element,a=this.options,i=this.seekerSlider,s=this.toolbar,l=this.volumeSlider;if(s instanceof u()&&i instanceof k&&l instanceof k){if(n.off(T),s.off(T),t){var r,d,c,m,f,p,g,Z;if(n.on(o()(r="".concat(h.Z.RESIZE)).call(r,T),this.resize.bind(this)),a.mode===q)n.on(o()(c=o()(m=o()(f="".concat(h.Z.MOUSEENTER)).call(f,T," ")).call(m,h.Z.TOUCHSTART)).call(c,T),(function(){b(s).expand("vertical").stop().play()})).on(o()(p=o()(g=o()(Z="".concat(h.Z.MOUSELEAVE)).call(Z,T," ")).call(g,h.Z.FOCUSOUT)).call(p,T),(function(){b(s).expand("vertical").stop().reverse()}));s.removeClass(h.Z.DISABLED_CLASS).on(o()(d="".concat(h.Z.CLICK)).call(d,T),"a.k-button",this._onButtonClick.bind(this))}else s.addClass(h.Z.DISABLED_CLASS).show();i.enable(t),l.enable(t),this._enabled=t}},destroy:function(){var e=this.element;y.fn.destroy.call(this),l()(e).call(e,"*").off(),e.off(),e.empty(),e.removeClass(_),Z(e),C.debug({method:"destroy",message:"widget destroyed"})}});Object.prototype.hasOwnProperty.call(window.kendo.ui,"AudioVideo")||w(te)}}]);