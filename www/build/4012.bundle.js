/*! Copyright ©2013-2021 Memba® Sarl. All rights reserved. - Version 0.3.8 dated Fri Apr 23 2021 */
(self.webpackChunkMemba_SmartQuiz=self.webpackChunkMemba_SmartQuiz||[]).push([[4012],{74012:function(t,e,a){"use strict";var i=a(86902),s=a.n(i),n=a(14310),o=a.n(n),l=a(20116),r=a.n(l),u=a(34074),c=a.n(u),d=a(39649),h=a.n(d),p=a(73609),f=a.n(p),m=(a(55031),a(13604),a(52426)),_=a(10771),g=a(58957),v=a(26986);a(946);function S(t,e){var a=s()(t);if(o()){var i=o()(t);e&&(i=r()(i).call(i,(function(e){return c()(t,e).enumerable}))),a.push.apply(a,i)}return a}function b(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?S(Object(a),!0).forEach((function(e){k(t,e,a[e])})):h()?Object.defineProperties(t,h()(a)):S(Object(a)).forEach((function(e){Object.defineProperty(t,e,c()(a,e))}))}return t}function k(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}var D=window.kendo.ui.Quiz,Z='<span class="kj-quiz-item kj-quiz-dropdown"># if (data.url) { #<span class="k-image" style="background-image:url(#: data.url$() #);"></span># } #<span class="k-text">#: data.text #</span></span>',w=v.Z.extend({init:function(t,e){v.Z.fn.init.call(this,t),this.type=m.Z.STRING,this.defaultValue=this.defaultValue||(this.nullable?null:""),this.editor=function(t,a){f()("<".concat(m.Z.INPUT,"/>")).css({width:"100%"}).attr(b(b(b({name:a.field},a.attributes),(0,g.DX)(m.Z.BIND,"value: ".concat(a.field))),e)).appendTo(t).kendoDropDownList({autoWidth:!0,dataSource:new _.r({data:a.model.get("attributes.data")}),dataTextField:"text",dataValueField:"text",optionLabel:D.fn.options.messages.optionLabel,template:Z,valueTemplate:Z})}}});e.Z=w},946:function(t,e,a){"use strict";var i,s,n,o=a(77766),l=a.n(o),r=a(94473),u=a.n(r),c=a(86902),d=a.n(c),h=a(14310),p=a.n(h),f=a(20116),m=a.n(f),_=a(34074),g=a.n(_),v=a(39649),S=a.n(v),b=a(73609),k=a.n(b),D=(a(55031),a(13604),a(52013)),Z=a(52426),w=a(3850),y=a(34814),L=a(13514),C=a(68607),T=a(10771);function E(t,e){var a=d()(t);if(p()){var i=p()(t);e&&(i=m()(i).call(i,(function(e){return g()(t,e).enumerable}))),a.push.apply(a,i)}return a}function N(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?E(Object(a),!0).forEach((function(e){O(t,e,a[e])})):S()?Object.defineProperties(t,S()(a)):E(Object(a)).forEach((function(e){Object.defineProperty(t,e,g()(a,e))}))}return t}function O(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}var j=window.kendo,z=j.attr,I=j.data.ObservableArray,A=j.destroy,q=j.format,x=j.ns,H=j.template,G=j.ui,B=G.plugin,J=G.DataBoundWidget,R=G.DropDownList,F=new w.Z("widgets.quiz"),U=".kendoQuiz",P=l()(i='<button class="k-button kj-quiz-item kj-quiz-button" data-'.concat(x,'uid="#: data.uid #" data-')).call(i,x,'value="#: data.{0} #"># if (data.{1}) { #<span class="k-image" style="background-image:url(#: data.{1} #);"></span># } #<span class="k-text">#: data.{0} #</span></button>'),Q=l()(s='<div class="k-widget kj-quiz-item kj-quiz-image" data-'.concat(x,'uid="#: data.uid #" data-')).call(s,x,'value="#: data.{0} #"><div class="k-image" style="background-image:url(#: data.{1} #)"></div></div>'),V=l()(n='<span class="kj-quiz-item kj-quiz-link" data-'.concat(x,'uid="#: data.uid #" data-')).call(n,x,'value="#: data.{0} #">#: data.{0} #</span>'),K='<div class="kj-quiz-item kj-quiz-radio" data-'.concat(x,'uid="#: data.uid #"><input id="{2}_#: data.uid #" name="{2}" type="radio" class="k-radio" value="#: data.{0} #"><label class="k-radio-label" for="{2}_#: data.uid #"># if (data.{1}) { #<span class="k-image" style="background-image:url(#: data.{1} #);"></span># } #<span class="k-text">#: data.{0} #</span></label></div>'),M=".kj-quiz-item.kj-quiz-button",W=".kj-quiz-item.kj-quiz-image",$=".kj-quiz-item.kj-quiz-link",X='[{0}="{1}"]',Y='.kj-quiz-item.kj-quiz-radio>input[type="radio"]',tt="button",et="dropdown",at="image",it="link",st="radio",nt="checked",ot=J.extend({init:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};J.fn.init.call(this,t,e),F.debug({method:"init",message:"widget initialized"}),this._value=this.options.value,this.setOptions(this.options),this._render(),this._dataSource(),this.enable(this.options.enabled)},modes:{button:tt,dropdown:et,link:it,image:at,radio:st},options:{name:"Quiz",autoBind:!0,dataSource:[],mode:tt,shuffle:!1,textField:"text",urlField:"url$()",buttonTemplate:P,dropDownTemplate:'<span class="kj-quiz-item kj-quiz-dropdown"># if (data.{1}) { #<span class="k-image" style="background-image:url(#: data.{1} #);"></span># } #<span class="k-text">#: data.{0} #</span></span>',imageTemplate:Q,linkTemplate:V,radioTemplate:K,itemStyle:{},selectedStyle:{},scaler:"div.kj-stage",stageElement:"div.kj-element",value:null,enabled:!0,messages:{optionLabel:"Select..."}},setOptions:function(t){D.Z.isNonEmptyPlainObject(t,D.Z.format(D.Z.messages.isNonEmptyPlainObject.default,"options")),J.fn.setOptions.call(this,t);var e=this.options,a=e.buttonTemplate,i=e.dropDownTemplate,s=e.groupStyle,n=e.urlField,o=e.itemStyle,l=e.imageTemplate,r=e.linkTemplate,u=e.radioTemplate,c=e.selectedStyle,d=e.textField;this._groupStyle=new L.Z(s||""),this._itemStyle=new L.Z(o||""),this._selectedStyle=new L.Z(c||""),this._buttonTemplate=H(q(a,d,n)),this._dropDownTemplate=q(i,d,n),this._optionLabelTemplate='<span class="kj-quiz-item kj-quiz-dropdown"><span class="k-text">#: data #</span></span>',this._imageTemplate=H(q(l,d,n)),this._linkTemplate=H(q(r,d,n)),this._radioTemplate=H(q(u,d,n,(0,C.kb)()))},events:[Z.Z.CHANGE],value:function(t){var e,a=this;if(D.Z.nullableTypeOrUndef(Z.Z.STRING,t,D.Z.format(D.Z.messages.nullableTypeOrUndef.default,t,Z.Z.STRING)),k().type(t)===Z.Z.UNDEFINED)e=this._value;else if(t!==this._value){var i;this.dataSource instanceof T.r&&u()(i=this.dataSource.data()).call(i,(function(e){return e[a.options.textField]===t}))?this._value=t:this._value=null,this._toggleSelection()}return e},_render:function(){var t=this.element,e=this.options;this.wrapper=t,t.addClass("".concat("kj-quiz"," ").concat(Z.Z.INTERACTIVE_CLASS)),e.mode===et&&this._layoutDropDown()},_layoutDropDown:function(){var t=this.element,e=this.options;this.dropDownList=k()("<".concat(Z.Z.INPUT,">")).width("100%").appendTo(t).kendoDropDownList({autoBind:e.autoBind,change:this._onDropDownListChange.bind(this),open:this._onDropDownListOpen.bind(this),dataSource:[],dataTextField:e.textField,dataValueField:e.textField,optionLabel:e.messages.optionLabel,optionLabelTemplate:this._optionLabelTemplate,template:this._dropDownTemplate,valueTemplate:this._dropDownTemplate,value:e.value,height:400}).data("kendoDropDownList")},_onDropDownListChange:function(){D.Z.instanceof(R,this.dropDownList,D.Z.format(D.Z.messages.instanceof.default,"this.dropDownList","kendo.ui.DropDownList"));var t=this.dropDownList.value();k().type(t)===Z.Z.STRING&&t.length?this._value=t:this._value=null,this.trigger(Z.Z.CHANGE,{value:this._value})},_onDropDownListOpen:function(){var t=this.element,e=this.options,a=t.closest(e.scaler),i=(0,y.Qf)(a),s=t.width(),n=t.height(),o=parseInt(t.css("font-size"),10),l=this.dropDownList.popup;l.element.css({fontSize:"".concat(Math.floor(o*i),"px"),minWidth:"".concat(Math.floor(s*i),"px"),width:"".concat(Math.floor(s*i),"px")}),setTimeout((function(){var s=t.closest(e.stageElement);if(a.length&&s.length){var o=s.position().top+a.offset().top,r=l.wrapper.position().top;r>o&&l.wrapper.css("top",r+(i-1)*n)}}),0)},_onButtonClick:function(t){D.Z.instanceof(k().Event,t,D.Z.format(D.Z.messages.instanceof.default,"e","jQuery.Event"));var e=k()(t.currentTarget).attr(z("value"));e!==this._value?this._value=e:this._value=null,this._toggleButtons(),this.trigger(Z.Z.CHANGE,{value:this._value})},_onImageClick:function(t){D.Z.instanceof(k().Event,t,D.Z.format(D.Z.messages.instanceof.default,"e","jQuery.Event"));var e=k()(t.currentTarget).attr(z("value"));e!==this._value?this._value=e:this._value=null,this._toggleImages(),this.trigger(Z.Z.CHANGE,{value:this._value})},_onLinkClick:function(t){D.Z.instanceof(k().Event,t,D.Z.format(D.Z.messages.instanceof.default,"e","jQuery.Event"));var e=k()(t.currentTarget).attr(z("value"));e!==this._value?this._value=e:this._value=null,this._toggleLinks(),this.trigger(Z.Z.CHANGE,{value:this._value})},_onRadioClick:function(t){D.Z.instanceof(k().Event,t,D.Z.format(D.Z.messages.instanceof.default,"e","jQuery.Event"));var e=k()(t.currentTarget).val();e!==this._value?this._value=e:this._value=null,this._toggleRadios(),this.trigger(Z.Z.CHANGE,{value:this._value})},_toggleSelection:function(){switch(this.options.mode){case tt:default:this._toggleButtons();break;case et:this._toggleDropDownList();break;case at:this._toggleImages();break;case it:this._toggleLinks();break;case st:this._toggleRadios()}},_toggleButtons:function(){var t=this.element;u()(t).call(t,M).removeClass(Z.Z.SELECTED_CLASS).attr("style","").css(this._itemStyle.toJSON()),k().type(this._value)===Z.Z.STRING&&u()(t).call(t,M+q(X,z("value"),this._value)).addClass(Z.Z.SELECTED_CLASS).attr("style","").css(N(N({},this._itemStyle.toJSON()),this._selectedStyle.toJSON()))},_toggleDropDownList:function(){D.Z.instanceof(R,this.dropDownList,D.Z.format(D.Z.messages.instanceof.default,"this.dropDownList","kendo.ui.DropDownList")),this.dropDownList.value(this._value)},_toggleImages:function(){var t=this.element;u()(t).call(t,W).removeClass(Z.Z.SELECTED_CLASS).attr("style","").css(this._itemStyle.toJSON()),k().type(this._value)===Z.Z.STRING&&u()(t).call(t,W+q(X,z("value"),this._value)).addClass(Z.Z.SELECTED_CLASS).attr("style","").css(N(N({},this._itemStyle.toJSON()),this._selectedStyle.toJSON()))},_toggleLinks:function(){var t=this.element;u()(t).call(t,$).removeClass(Z.Z.SELECTED_CLASS).attr("style","").css(this._itemStyle.toJSON()),k().type(this._value)===Z.Z.STRING&&u()(t).call(t,$+q(X,z("value"),this._value)).addClass(Z.Z.SELECTED_CLASS).attr("style","").css(N(N({},this._itemStyle.toJSON()),this._selectedStyle.toJSON()))},_toggleRadios:function(){var t=this.element;t.children("div").attr("style","").css(this._itemStyle.toJSON()),u()(t).call(t,Y).prop(nt,!1).parent().attr("style","").css(this._itemStyle.toJSON()),k().type(this._value)===Z.Z.STRING&&u()(t).call(t,Y+q(X,"value",this._value)).prop(nt,!0).parent().attr("style","").css(N(N({},this._itemStyle.toJSON()),this._selectedStyle.toJSON()))},_dataSource:function(){if(this.dataSource instanceof T.r&&k().isFunction(this._refreshHandler)&&(this.dataSource.unbind(Z.Z.CHANGE,this._refreshHandler),this._refreshHandler=void 0),k().type(this.options.dataSource)!==Z.Z.NULL){this.dataSource=T.r.create(this.options.dataSource),this._refreshHandler=this.refresh.bind(this),this.dataSource.bind(Z.Z.CHANGE,this._refreshHandler);var t=this.dropDownList;t instanceof R&&t.dataSource!==this.dataSource&&t.setDataSource(this.dataSource),this.options.autoBind&&this.dataSource.fetch()}},setDataSource:function(t){this.options.dataSource=t,this._dataSource()},refresh:function(t){var e=this,a=this.element,i=this.options;if(i.mode===et)D.Z.instanceof(R,this.dropDownList,D.Z.format(D.Z.messages.instanceof.default,"that.dropDownList","kendo.ui.DropDownList")),this.dropDownList.refresh(t);else{var s=this.dataSource.data();t&&t.items instanceof I&&(s=t.items),i.shuffle&&(s=(0,C.TV)(s)),a.empty(),k()(s).each((function(t,s){switch(i.mode){case tt:default:k()(e._buttonTemplate(s)).css(e._itemStyle.toJSON()).appendTo(a);break;case at:k()(e._imageTemplate(s)).css(e._itemStyle.toJSON()).appendTo(a);break;case it:k()(e._linkTemplate(s)).css(e._itemStyle.toJSON()).appendTo(a);break;case st:k()(e._radioTemplate(s)).css(e._itemStyle.toJSON()).appendTo(a)}}))}-1===this.dataSource.data().indexOf(this._value)&&(this._value=null,this.trigger(Z.Z.CHANGE,{value:this._value})),F.debug({method:"refresh",message:"widget refreshed"})},enable:function(t){var e=k().type(t)===Z.Z.UNDEFINED||!!t;switch(this.options.mode){case tt:default:this._enableButtons(e);break;case et:this._enableDropDownList(e);break;case at:this._enableImages(e);break;case it:this._enableLinks(e);break;case st:this._enableRadios(e)}},_enableButtons:function(t){var e,a,i,s=this.element;(s.off(U),t)&&s.on(l()(e=l()(a=l()(i="".concat(Z.Z.CLICK)).call(i,U," ")).call(a,Z.Z.TOUCHEND)).call(e,U),M,this._onButtonClick.bind(this));s.toggleClass(Z.Z.DISABLED_CLASS,!t)},_enableDropDownList:function(t){D.Z.instanceof(R,this.dropDownList,D.Z.format(D.Z.messages.instanceof.default,"this.dropDownList","kendo.ui.DropDownList")),this.dropDownList.enable(t)},_enableImages:function(t){var e,a,i,s=this.element;(s.off(U),t)&&s.on(l()(e=l()(a=l()(i="".concat(Z.Z.CLICK)).call(i,U," ")).call(a,Z.Z.TOUCHEND)).call(e,U),W,this._onImageClick.bind(this));s.toggleClass(Z.Z.DISABLED_CLASS,!t)},_enableLinks:function(t){var e,a,i,s=this.element;(s.off(U),t)&&s.on(l()(e=l()(a=l()(i="".concat(Z.Z.CLICK)).call(i,U," ")).call(a,Z.Z.TOUCHEND)).call(e,U),$,this._onLinkClick.bind(this));s.toggleClass(Z.Z.DISABLED_CLASS,!t)},_enableRadios:function(t){var e,a,i,s,n,o,r,c=this.element;(c.off(U),t)?c.on(l()(e=l()(a=l()(i="".concat(Z.Z.CLICK)).call(i,U," ")).call(a,Z.Z.TOUCHEND)).call(e,U),Y,this._onRadioClick.bind(this)):c.on(l()(s=l()(n=l()(o="".concat(Z.Z.CLICK)).call(o,U," ")).call(n,Z.Z.TOUCHEND)).call(s,U),Y,(function(t){t.preventDefault()})).on(l()(r="".concat(Z.Z.CHANGE)).call(r,U),Y,(function(t){k()(t.target).prop("checked",!1)}));u()(c).call(c,Y).toggleClass(Z.Z.DISABLED_CLASS,!t).prop("readonly",!t)},destroy:function(){var t=this.element;this.dropDownList instanceof R&&(this.dropDownList.destroy(),this.dropDownList=void 0),this.setDataSource(null),t.off(U),J.fn.destroy.call(this),A(t),F.debug({method:"destroy",message:"widget destroyed"})}});Object.prototype.hasOwnProperty.call(window.kendo.ui,"Quiz")||B(ot)}}]);