/*! Copyright ©2013-2021 Memba® Sarl. All rights reserved. - Version 0.3.8 dated Fri Apr 23 2021 */
(self.webpackChunkMemba_SmartQuiz=self.webpackChunkMemba_SmartQuiz||[]).push([[1844],{61844:function(t,e,o){var i,n,s;o.amdD,n=[o(55031),o(60104),o(75673)],void 0===(s="function"==typeof(i=function(){return function(t,e){var o=window.kendo,i=o.Class,n=o.ui.Widget,s=t.proxy,l=o.isFunction,r=o.keys,a=o._outerWidth,d=".kendoToolBar",h="k-toolbar",p="k-button",u="k-overflow-button",c="k-toggle-button",f="k-button-group",v="k-split-button",m="k-separator",b="k-spacer",g="spacer",w="k-popup",k="k-toolbar-resizable",C="k-state-active",y="k-state-disabled",A="k-state-hidden",_="k-hidden",x="k-group-start",B="k-group-end",E="k-primary",T="aria-disabled",O="aria-pressed",I="k-icon",F="k-i-",P="k-button-icon",U="k-button-icontext",D="k-list-container k-split-container",z="k-split-button-arrow",G="k-overflow-anchor",H="k-overflow-container",N="k-toolbar-first-visible",M="k-toolbar-last-visible",R="click",S="toggle",W="open",K="close",j="overflowOpen",Q="overflowClose",q="never",V="auto",L="always",J="k-overflow-hidden",X="_optionlist",Y=o.attr("uid");o.toolbar={};var Z={overflowAnchor:'<div tabindex="0" class="k-overflow-anchor k-button" title="More tools" role="button"></div>',overflowContainer:'<ul class="k-overflow-container k-list-container"></ul>'};o.toolbar.registerComponent=function(t,e,o){Z[t]={toolbar:e,overflow:o}};var $=o.Class.extend({addOverflowAttr:function(){this.element.attr(o.attr("overflow"),this.options.overflow||V)},addUidAttr:function(){this.element.attr(Y,this.options.uid)},addIdAttr:function(){this.options.id&&this.element.attr("id",this.options.id)},addOverflowIdAttr:function(){this.options.id&&this.element.attr("id",this.options.id+"_overflow")},attributes:function(){this.options.attributes&&this.element.attr(this.options.attributes)},show:function(){this.element.removeClass(A),this.element.removeClass(_),this.options.hidden=!1},hide:function(){this.element.addClass(A),this.element.addClass(_),this.overflow&&this.overflowHidden&&this.overflowHidden(),this.options.hidden=!0},remove:function(){this.element.remove()},enable:function(t){t===e&&(t=!0),this.element.toggleClass(y,!t),this.element.attr(T,!t),this.options.enable=t},twin:function(){var e=this.element.attr(Y);return this.overflow&&this.options.splitContainerId?t("#"+this.options.splitContainerId).find("["+Y+"='"+e+"']").data(this.options.type):this.overflow?this.toolbar.element.find("["+Y+"='"+e+"']").data(this.options.type):this.toolbar.options.resizable?this.toolbar.popup.element.find("["+Y+"='"+e+"']").data(this.options.type):void 0}});o.toolbar.Item=$;var tt=$.extend({init:function(i,n){var s=i.useButtonTag?t('<button tabindex="0"></button>'):t('<a role="button" href tabindex="0"></a>');this.element=s,this.options=i,this.toolbar=n,this.attributes(),i.primary&&s.addClass(E),i.togglable&&(s.addClass(c),this.toggle(i.selected)),i.url===e||i.useButtonTag||(s.attr("href",i.url),i.mobile&&s.attr(o.attr("role"),"button")),i.group&&(s.attr(o.attr("group"),i.group),this.group=this.toolbar.addToGroup(this,i.group)),!i.togglable&&i.click&&l(i.click)&&(this.clickHandler=i.click),i.togglable&&i.toggle&&l(i.toggle)&&(this.toggleHandler=i.toggle)},toggle:function(t,e){t=!!t,this.group&&t?this.group.select(this):this.group||this.select(t),e&&this.twin()&&this.twin().toggle(t)},getParentGroup:function(){if(this.options.isChild)return this.element.closest("."+f).data("buttonGroup")},_addGraphics:function(){var e,i,n,s=this.element,l=this.options.icon,r=this.options.spriteCssClass,a=this.options.imageUrl;(r||a||l)&&(e=!0,s.contents().filter((function(){return!t(this).hasClass("k-sprite")&&!t(this).hasClass(I)&&!t(this).hasClass("k-image")})).each((function(t,i){(1==i.nodeType||3==i.nodeType&&o.trim(i.nodeValue).length>0)&&(e=!1)})),e?s.addClass(P):s.addClass(U)),l?((i=s.children("span."+I).first())[0]||(i=t('<span class="'+I+'"></span>').prependTo(s)),i.addClass(F+l)):r?((i=s.children("span.k-sprite").first())[0]||(i=t('<span class="k-sprite '+I+'"></span>').prependTo(s)),i.addClass(r)):a&&((n=s.children("img.k-image").first())[0]||(n=t('<img alt="icon" class="k-image" />').prependTo(s)),n.attr("src",a))}});o.toolbar.Button=tt;var et=tt.extend({init:function(t,e){tt.fn.init.call(this,t,e);var o=this.element;o.addClass(p),this.addIdAttr(),t.align&&o.addClass("k-align-"+t.align),"overflow"!=t.showText&&t.text&&(t.mobile?o.html('<span class="km-text">'+t.text+"</span>"):o.html(t.text)),t.hasIcon="overflow"!=t.showIcon&&(t.icon||t.spriteCssClass||t.imageUrl),t.hasIcon&&this._addGraphics(),this.addUidAttr(),this.addOverflowAttr(),this.enable(t.enable),t.hidden&&this.hide(),this.element.data({type:"button",button:this})},select:function(t){t===e&&(t=!1),this.options.togglable&&this.element.attr(O,t),this.element.toggleClass(C,t),this.options.selected=t}});o.toolbar.ToolBarButton=et;var ot=tt.extend({init:function(e,o){this.overflow=!0,tt.fn.init.call(this,t.extend({},e),o);var i=this.element;"toolbar"!=e.showText&&e.text&&(e.mobile?i.html('<span class="km-text">'+e.text+"</span>"):i.html('<span class="k-text">'+e.text+"</span>")),e.hasIcon="toolbar"!=e.showIcon&&(e.icon||e.spriteCssClass||e.imageUrl),e.hasIcon&&this._addGraphics(),e.isChild||this._wrap(),this.addOverflowIdAttr(),this.attributes(),this.addUidAttr(),this.addOverflowAttr(),this.enable(e.enable),i.addClass(u+" "+p),e.hidden&&this.hide(),e.togglable&&this.toggle(e.selected),this.element.data({type:"button",button:this})},_wrap:function(){this.element=this.element.wrap("<li></li>").parent()},overflowHidden:function(){this.element.addClass(J)},select:function(t){t===e&&(t=!1),this.options.isChild?this.element.toggleClass(C,t):this.element.find(".k-button").toggleClass(C,t),this.options.selected=t}});o.toolbar.OverflowButton=ot,o.toolbar.registerComponent("button",et,ot);var it=$.extend({createButtons:function(e){for(var i=this.options,n=i.buttons||[],s=0;s<n.length;s++)n[s].uid||(n[s].uid=o.guid()),new e(t.extend({mobile:i.mobile,isChild:!0,type:"button"},n[s]),this.toolbar).element.appendTo(this.element)},refresh:function(){this.element.children().filter(":not('."+A+"'):first").addClass(x),this.element.children().filter(":not('."+A+"'):last").addClass(B)}});o.toolbar.ButtonGroup=it;var nt=it.extend({init:function(e,o){var i=this.element=t("<div></div>");this.options=e,this.toolbar=o,this.addIdAttr(),e.align&&i.addClass("k-align-"+e.align),this.createButtons(et),this.attributes(),this.addUidAttr(),this.addOverflowAttr(),this.refresh(),i.addClass(f),this.element.data({type:"buttonGroup",buttonGroup:this})}});o.toolbar.ToolBarButtonGroup=nt;var st=it.extend({init:function(e,o){var i=this.element=t("<li></li>");this.options=e,this.toolbar=o,this.overflow=!0,this.addOverflowIdAttr(),this.createButtons(ot),this.attributes(),this.addUidAttr(),this.addOverflowAttr(),this.refresh(),i.addClass((e.mobile?"":f)+" k-overflow-group"),this.element.data({type:"buttonGroup",buttonGroup:this})},overflowHidden:function(){this.element.addClass(J)}});o.toolbar.OverflowButtonGroup=st,o.toolbar.registerComponent("buttonGroup",nt,st);var lt=$.extend({init:function(e,o){var i=this.element=t('<div class="'+v+'" tabindex="0"></div>');this.options=e,this.toolbar=o,this.mainButton=new et(t.extend({},e,{hidden:!1}),o),this.arrowButton=t('<a class="'+p+" "+z+'"><span class="'+(e.mobile?"km-icon km-arrowdown":"k-icon k-i-arrow-60-down")+'"></span></a>'),this.popupElement=t('<ul class="'+D+'"></ul>'),this.mainButton.element.removeAttr("href tabindex").appendTo(i),this.arrowButton.appendTo(i),this.popupElement.appendTo(i),e.align&&i.addClass("k-align-"+e.align),e.id||(e.id=e.uid),i.attr("id",e.id+"_wrapper"),this.addOverflowAttr(),this.addUidAttr(),this.createMenuButtons(),this.createPopup(),this._navigatable(),this.mainButton.main=!0,this.enable(e.enable),e.hidden&&this.hide(),i.data({type:"splitButton",splitButton:this,kendoPopup:this.popup})},_navigatable:function(){var e=this;e.popupElement.on("keydown"+d,"."+p,(function(o){var i=t(o.target).parent();o.preventDefault(),o.keyCode===r.ESC||o.keyCode===r.TAB||o.altKey&&o.keyCode===r.UP?(e.toggle(),e.focus()):o.keyCode===r.DOWN?mt(i,"next").focus():o.keyCode===r.UP?mt(i,"prev").focus():o.keyCode===r.SPACEBAR||o.keyCode===r.ENTER?e.toolbar.userEvents.trigger("tap",{target:t(o.target)}):o.keyCode===r.HOME?i.parent().find(":kendoFocusable").first().focus():o.keyCode===r.END&&i.parent().find(":kendoFocusable").last().focus()}))},createMenuButtons:function(){for(var e=this.options,o=e.menuButtons,i=0;i<o.length;i++)new et(t.extend({mobile:e.mobile,type:"button",click:e.click},o[i]),this.toolbar).element.wrap("<li></li>").parent().appendTo(this.popupElement)},createPopup:function(){var e=this,o=this.options,i=this.element;this.popupElement.attr("id",o.id+X).attr(Y,o.rootUid),o.mobile&&(this.popupElement=ft(this.popupElement)),this.popup=this.popupElement.kendoPopup({appendTo:o.mobile?t(o.mobile).children(".km-pane"):null,anchor:i,isRtl:this.toolbar._isRtl,copyAnchorStyles:!1,animation:o.animation,open:function(t){e.toolbar.trigger(W,{target:i})?t.preventDefault():e.adjustPopupWidth(t.sender)},activate:function(){this.element.find(":kendoFocusable").first().focus()},close:function(t){e.toolbar.trigger(K,{target:i})&&t.preventDefault(),i.focus()}}).data("kendoPopup"),this.popup.element.on(R+d,"a.k-button",vt)},adjustPopupWidth:function(t){var e,i=t.options.anchor,n=a(i);o.wrap(t.element).addClass("k-split-wrapper"),e="border-box"!==t.element.css("box-sizing")?n-(a(t.element)-t.element.width()):n,t.element.css({fontFamily:i.css("font-family"),"min-width":e})},remove:function(){this.popup.element.off(R+d,"a.k-button"),this.popup.destroy(),this.element.remove()},toggle:function(){(this.options.enable||this.popup.visible())&&this.popup.toggle()},enable:function(t){t===e&&(t=!0),this.mainButton.enable(t),this.element.toggleClass(y,!t),this.element.attr(T,!t),this.options.enable=t},focus:function(){this.element.focus()},hide:function(){this.popup&&this.popup.close(),this.element.addClass(A),this.element.addClass(_),this.options.hidden=!0},show:function(){this.element.removeClass(A),this.element.removeClass(_),this.options.hidden=!1}});o.toolbar.ToolBarSplitButton=lt;var rt=$.extend({init:function(e,o){var i,n=this.element=t('<li class="'+v+'"></li>'),s=e.menuButtons;this.options=e,this.toolbar=o,this.overflow=!0,i=(e.id||e.uid)+X,this.mainButton=new ot(t.extend({isChild:!0},e)),this.mainButton.element.appendTo(n);for(var l=0;l<s.length;l++)new ot(t.extend({mobile:e.mobile,type:"button",splitContainerId:i,isChild:!0},s[l],{click:e.click}),this.toolbar).element.appendTo(n);this.addUidAttr(),this.addOverflowAttr(),this.mainButton.main=!0,n.data({type:"splitButton",splitButton:this})},overflowHidden:function(){this.element.addClass(J)}});o.toolbar.OverflowSplitButton=rt,o.toolbar.registerComponent("splitButton",lt,rt);var at=$.extend({init:function(e,o){var i=this.element=t("<div>&nbsp;</div>");this.element=i,this.options=e,this.toolbar=o,this.attributes(),this.addIdAttr(),this.addUidAttr(),this.addOverflowAttr(),i.addClass(m),i.data({type:"separator",separator:this})}}),dt=$.extend({init:function(e,o){var i=this.element=t("<li>&nbsp;</li>");this.element=i,this.options=e,this.toolbar=o,this.overflow=!0,this.attributes(),this.addUidAttr(),this.addOverflowIdAttr(),i.addClass(m),i.data({type:"separator",separator:this})},overflowHidden:function(){this.element.addClass(J)}});o.toolbar.registerComponent("separator",at,dt);var ht=$.extend({init:function(e,o){var i=this.element=t("<div>&nbsp;</div>");this.element=i,this.options=e,this.toolbar=o,i.addClass(b),i.data({type:g})}});o.toolbar.registerComponent(g,ht);var pt=$.extend({init:function(e,o,i){var n=l(e)?e(o):e;n=n instanceof jQuery?n.wrap("<div></div>").parent():t("<div></div>").html(n),this.element=n,this.options=o,this.options.type="template",this.toolbar=i,this.attributes(),this.addUidAttr(),this.addIdAttr(),this.addOverflowAttr(),n.data({type:"template",template:this})}});o.toolbar.TemplateItem=pt;var ut=$.extend({init:function(e,o,i){var n=l(e)?t(e(o)):t(e);n=n instanceof jQuery?n.wrap("<li></li>").parent():t("<li></li>").html(n),this.element=n,this.options=o,this.options.type="template",this.toolbar=i,this.overflow=!0,this.attributes(),this.addUidAttr(),this.addOverflowIdAttr(),this.addOverflowAttr(),n.data({type:"template",template:this})},overflowHidden:function(){this.element.addClass(J)}});function ct(t){t.target.is(".k-toggle-button")||t.target.toggleClass(C,"press"==t.type)}function ft(e){return(e=t(e)).hasClass("km-actionsheet")?e.closest(".km-popup-wrapper"):e.addClass("km-widget km-actionsheet").wrap('<div class="km-actionsheet-wrapper km-actionsheet-tablet km-widget km-popup"></div>').parent().wrap('<div class="km-popup-wrapper k-popup"></div>').parent()}function vt(e){t(e.target).closest("a.k-button").length&&e.preventDefault()}function mt(e,o){var i="next"===o?t.fn.next:t.fn.prev,n="next"===o?t.fn.first:t.fn.last,s=i.call(e);return!s.length&&e.is("."+G)?e:s.is(":kendoFocusable")||!s.length?s:s.find(":kendoFocusable").length?n.call(s.find(":kendoFocusable")):mt(s,o)}o.toolbar.OverflowTemplateItem=ut;var bt=i.extend({init:function(t){this.name=t,this.buttons=[]},add:function(t){this.buttons[this.buttons.length]=t},remove:function(e){var o=t.inArray(e,this.buttons);this.buttons.splice(o,1)},select:function(t){for(var e=0;e<this.buttons.length;e++)this.buttons[e].select(!1);t.select(!0),t.twin()&&t.twin().select(!0)}}),gt=n.extend({init:function(e,i){var l=this;if(n.fn.init.call(l,e,i),i=l.options,(e=l.wrapper=l.element).addClass(h+" k-widget"),this.uid=o.guid(),this._isRtl=o.support.isRtl(e),this._groups={},e.attr(Y,this.uid),l.isMobile="boolean"==typeof i.mobile?i.mobile:l.element.closest(".km-root")[0],l.animation=l.isMobile?{open:{effects:"fade"}}:{},l.isMobile&&(e.addClass("km-widget"),I="km-icon",F="km-",p="km-button",f="km-buttongroup",C="km-state-active",y="km-state-disabled"),i.resizable?(l._renderOverflow(),e.addClass(k),l.overflowUserEvents=new o.UserEvents(l.element,{threshold:5,allowSelection:!0,filter:"."+G,tap:s(l._toggleOverflow,l)}),l._resizeHandler=o.onResize((function(){l.resize()}))):l.popup={element:t([])},i.items&&i.items.length){for(var r=0;r<i.items.length;r++)l.add(i.items[r]);i.resizable&&l._shrink(l.element.innerWidth())}l.userEvents=new o.UserEvents(document,{threshold:5,allowSelection:!0,filter:"["+Y+"="+this.uid+"] a."+p+", ["+Y+"="+this.uid+"] ."+u,tap:s(l._buttonClick,l),press:ct,release:ct}),l.element.on(R+d,"a.k-button",vt),l._navigatable(),i.resizable&&l.popup.element.on(R+d,NaN,vt),i.resizable&&this._toggleOverflowAnchor(),o.notify(l)},events:[R,S,W,K,j,Q],options:{name:"ToolBar",items:[],resizable:!0,mobile:null},addToGroup:function(t,e){var o;return(o=this._groups[e]?this._groups[e]:this._groups[e]=new bt).add(t),o},destroy:function(){var e=this;e.element.find("."+v).each((function(e,o){t(o).data("kendoPopup").destroy()})),e.element.off(d,"a.k-button"),e.userEvents.destroy(),e.options.resizable&&(o.unbindResize(e._resizeHandler),e.overflowUserEvents.destroy(),e.popup.element.off(d,"a.k-button"),e.popup.destroy()),n.fn.destroy.call(e)},add:function(e){var i,n,s=Z[e.type],l=e.template,r=this,a=r.isMobile?"":"k-item k-state-default",d=e.overflowTemplate;if(t.extend(e,{uid:o.guid(),animation:r.animation,mobile:r.isMobile,rootUid:r.uid}),e.menuButtons)for(var h=0;h<e.menuButtons.length;h++)t.extend(e.menuButtons[h],{uid:o.guid()});l&&!d||e.type===g?e.overflow=q:e.overflow||(e.overflow=V),e.overflow!==q&&r.options.resizable&&(d?n=new ut(d,e,r):s&&(n=new s.overflow(e,r)).element.addClass(a),n&&(e.overflow===V&&n.overflowHidden(),n.element.appendTo(r.popup.container),r.angular("compile",(function(){return{elements:n.element.get()}})))),e.overflow!==L&&(l?i=new pt(l,e,r):s&&(i=new s.toolbar(e,r)),i&&(i.element.appendTo(r.element),r.angular("compile",(function(){return{elements:i.element.get()}}))))},_getItem:function(e){var o,i,n,s,l=this.options.resizable;return(o=this.element.find(e)).length||(o=t(".k-split-container[data-uid="+this.uid+"]").find(e)),s=o.length?o.data("type"):"",(i=o.data(s))?(i.main&&(s="splitButton",i=(o=o.parent("."+v)).data(s)),l&&(n=i.twin())):l&&(s=(o=this.popup.element.find(e)).length?o.data("type"):"",(n=o.data(s))&&n.main&&(s="splitButton",n=(o=o.parent("."+v)).data(s))),{type:s,toolbar:i,overflow:n}},remove:function(t){var e=this._getItem(t);e.toolbar&&e.toolbar.remove(),e.overflow&&e.overflow.remove(),this.resize(!0)},hide:function(t){var e,o=this._getItem(t);o.toolbar&&("button"===o.toolbar.options.type&&o.toolbar.options.isChild?(e=o.toolbar.getParentGroup(),o.toolbar.hide(),e&&e.refresh()):o.toolbar.options.hidden||o.toolbar.hide()),o.overflow&&("button"===o.overflow.options.type&&o.overflow.options.isChild?(e=o.overflow.getParentGroup(),o.overflow.hide(),e&&e.refresh()):o.overflow.options.hidden||o.overflow.hide()),this.resize(!0)},show:function(t){var e,o=this._getItem(t);o.toolbar&&("button"===o.toolbar.options.type&&o.toolbar.options.isChild?(e=o.toolbar.getParentGroup(),o.toolbar.show(),e&&e.refresh()):o.toolbar.options.hidden&&o.toolbar.show()),o.overflow&&("button"===o.overflow.options.type&&o.overflow.options.isChild?(e=o.overflow.getParentGroup(),o.toolbar.show(),e&&e.refresh()):o.overflow.options.hidden&&o.overflow.show()),this.resize(!0)},enable:function(t,e){var o=this._getItem(t);void 0===e&&(e=!0),o.toolbar&&o.toolbar.enable(e),o.overflow&&o.overflow.enable(e)},getSelectedFromGroup:function(t){return this.element.find("."+c+"[data-group='"+t+"']").filter("."+C)},toggle:function(o,i){var n=t(o).data("button");n.options.togglable&&(i===e&&(i=!0),n.toggle(i,!0))},_renderOverflow:function(){var e=this,i=Z.overflowContainer,n=e._isRtl,s=n?"left":"right";e.overflowAnchor=t(Z.overflowAnchor).addClass(p),e.element.append(e.overflowAnchor),e.isMobile?(e.overflowAnchor.append('<span class="km-icon km-more"></span>'),i=ft(i)):e.overflowAnchor.append('<span class="k-icon k-i-more-vertical"></span>'),e.popup=new o.ui.Popup(i,{origin:"bottom "+s,position:"top "+s,anchor:e.overflowAnchor,isRtl:n,animation:e.animation,appendTo:e.isMobile?t(e.isMobile).children(".km-pane"):null,copyAnchorStyles:!1,open:function(i){var s=o.wrap(e.popup.element).addClass("k-overflow-wrapper");e.isMobile?e.popup.container.css("max-height",parseFloat(t(".km-content:visible").innerHeight())-15+"px"):s.css("margin-left",(n?-1:1)*((a(s)-s.width())/2+1)),e.trigger(j)&&i.preventDefault()},activate:function(){this.element.find(":kendoFocusable").first().focus()},close:function(t){e.trigger(Q)&&t.preventDefault(),this.element.focus()}}),e.popup.element.on("keydown"+d,"."+p,(function(o){var i=t(o.target),n=i.parent(),s=n.is("."+f)||n.is("."+v);o.preventDefault(),o.keyCode===r.ESC||o.keyCode===r.TAB||o.altKey&&o.keyCode===r.UP?(e._toggleOverflow(),e.overflowAnchor.focus()):o.keyCode===r.DOWN?mt(!s||s&&i.is(":last-child")?n:i,"next").focus():o.keyCode===r.UP?mt(!s||s&&i.is(":first-child")?n:i,"prev").focus():o.keyCode===r.SPACEBAR||o.keyCode===r.ENTER?(e.userEvents.trigger("tap",{target:t(o.target)}),e.overflowAnchor.focus()):o.keyCode===r.HOME?n.parent().find(":kendoFocusable").first().focus():o.keyCode===r.END&&n.parent().find(":kendoFocusable").last().focus()})),e.isMobile?e.popup.container=e.popup.element.find("."+H):e.popup.container=e.popup.element,e.popup.container.attr(Y,this.uid)},_toggleOverflowAnchor:function(){var t=this._isRtl?"padding-left":"padding-right";(this.options.mobile?this.popup.element.find("."+H).children(":not(."+J+", ."+w+")").length>0:this.popup.element.children(":not(."+J+", ."+w+")").length>0)?(this.overflowAnchor.css({visibility:"visible",width:""}),this.wrapper.css(t,this.overflowAnchor.outerWidth(!0))):(this.overflowAnchor.css({visibility:"hidden",width:"1px"}),this.wrapper.css(t,""))},_buttonClick:function(e){var o,i,n,s,r,a,d=this,h=e.target.closest("."+z).length;e.preventDefault(),h?d._toggle(e):(o=t(e.target).closest("."+p,d.element)).hasClass(G)||(!(i=o.data("button"))&&d.popup&&(i=(o=t(e.target).closest("."+u,d.popup.container)).parent("li").data("button")),i&&i.options.enable&&(i.options.togglable?(s=l(i.toggleHandler)?i.toggleHandler:null,i.toggle(!i.options.selected,!0),r={target:o,group:i.options.group,checked:i.options.selected,id:i.options.id,item:i},s&&s.call(d,r),d.trigger(S,r)):(s=l(i.clickHandler)?i.clickHandler:null,r={sender:d,target:o,id:i.options.id,item:i},s&&s.call(d,r),d.trigger(R,r)),i.options.url&&(i.options.attributes&&i.options.attributes.target&&(a=i.options.attributes.target),window.open(i.options.url,a||"_self")),o.hasClass(u)&&d.popup.close(),(n=o.closest(".k-split-container"))[0]&&(n.data("kendoPopup")||n.parents(".km-popup-wrapper").data("kendoPopup")).close()))},_navigatable:function(){var e=this;e.element.attr("tabindex",0).on("focusin"+d,(function(e){var o=t(e.target),i=t(this).find(":kendoFocusable:first");o.is("."+h)&&0!==i.length&&(i.is("."+G)&&(i=mt(i,"next")),i.length&&i[0].focus())})).on("keydown"+d,s(e._keydown,e))},_keydown:function(e){var o=t(e.target),i=e.keyCode,n=this.element.children(":not(.k-separator):visible"),s=this._isRtl?-1:1;if(i===r.TAB){var l=o.parentsUntil(this.element).last(),a=!1,d=!1,h=!1;if(n.not("."+G).length||(h=!0),l.length||(l=o),l.is("."+G)&&!h){var p=n.last();e.shiftKey&&e.preventDefault(),p.is(":kendoFocusable")?n.last().focus():n.last().find(":kendoFocusable").last().focus()}e.shiftKey||n.index(l)!==n.length-1||(a=!l.is("."+f)||o.is(":last-child"));var u=n.index(l)===n.not(".k-overflow-anchor").first().index();if(e.shiftKey&&u&&(d=!l.is("."+f)||o.is(":first-child")),a&&this.overflowAnchor&&"hidden"!==this.overflowAnchor.css("visibility")&&!h&&(e.preventDefault(),this.overflowAnchor.focus()),d||h&&e.shiftKey){e.preventDefault();var c=this._getPrevFocusable(this.wrapper);c&&c.focus()}this._preventNextFocus=!1}if(e.altKey&&i===r.DOWN){var m=t(document.activeElement).data("splitButton"),b=t(document.activeElement).is("."+G);m?m.toggle():b&&this._toggleOverflow()}else{if((i===r.SPACEBAR||i===r.ENTER)&&!o.is("input, checkbox"))return i===r.SPACEBAR&&e.preventDefault(),void(o.is("."+v)?(o=o.children().first(),this.userEvents.trigger("tap",{target:o})):i===r.SPACEBAR&&this.userEvents.trigger("tap",{target:o}));if(i===r.HOME){if(o.is(".k-dropdown")||o.is("input"))return;this.overflowAnchor?n.eq(1).focus():n.first().focus(),e.preventDefault()}else if(i===r.END){if(o.is(".k-dropdown")||o.is("input"))return;this.overflowAnchor&&"hidden"!=t(this.overflowAnchor).css("visibility")?this.overflowAnchor.focus():n.last().focus(),e.preventDefault()}else i!==r.RIGHT||this._preventNextFocus||o.is("input, select, .k-dropdown, .k-colorpicker")||!this._getNextElement(e.target,1*s)?i!==r.LEFT||this._preventNextFocus||o.is("input, select, .k-dropdown, .k-colorpicker")||!this._getNextElement(e.target,-1*s)||(this._getNextElement(e.target,-1*s).focus(),e.preventDefault()):(this._getNextElement(e.target,1*s).focus(),e.preventDefault())}},_getNextElement:function(e,o){var i=this.element.children(":not(.k-separator):visible"),n=-1===i.index(e)?i.index(e.parentElement):i.index(e),s=this.overflowAnchor?1:0,l=o,r=1===o?i.length-1:s,a=1===o?s:i.length-1,d=i[n+o];if(this._preventNextFocus=!1,t(e).closest("."+f).length&&!t(e).is(1===o?":last-child":":first-child"))return t(e).closest("."+f).children()[t(e).closest("."+f).children().index(e)+o];for(this.overflowAnchor&&e===this.overflowAnchor[0]&&-1===o&&(d=i[i.length-1]),n===r&&(d=!this.overflowAnchor||this.overflowAnchor&&"hidden"===t(this.overflowAnchor).css("visibility")?i[a]:this.overflowAnchor);!t(d).is(":kendoFocusable");){if(!(d=-1===o&&t(d).closest("."+f).length?t(d).children(":not(label, div)").last():t(d).children(":not(label, div)").first()).length&&!(d=i[n+(l+=o)]))return this.overflowAnchor;this._preventNextFocus=!t(d).closest("."+f).length}return d},_getPrevFocusable:function(e){return e.is("html")?e:(e.prevAll().each((function(){return(i=t(this)).is(":kendoFocusable")?(o=i,!1):i.find(":kendoFocusable").length>0?(o=i.find(":kendoFocusable").last(),!1):void 0})),o||this._getPrevFocusable(e.parent()));var o,i},_toggle:function(e){var o=t(e.target).closest("."+v).data("splitButton");e.preventDefault(),o.options.enable&&o.toggle()},_toggleOverflow:function(){this.popup.toggle()},_resize:function(t){var e=t.width;this.options.resizable&&(this.popup.close(),this._shrink(e),this._stretch(e),this._markVisibles(),this._toggleOverflowAnchor())},_childrenWidth:function(){var e=0;return this.element.children(":visible:not(."+A+", ."+b+")").each((function(){e+=a(t(this),!0)})),Math.ceil(e)},_shrink:function(t){var e,o;if(t<this._childrenWidth())for(var i=(o=this.element.children(":visible:not([data-overflow='never'], ."+G+")")).length-1;i>=0&&(e=o.eq(i),!(t>this._childrenWidth()));i--)this._hideItem(e)},_stretch:function(t){var e,o;if(t>this._childrenWidth()){o=this.element.children(":hidden:not('."+A+"')");for(var i=0;i<o.length&&(e=o.eq(i),!(t<this._childrenWidth())&&this._showItem(e,t));i++);}},_hideItem:function(t){t.addClass(_),this.popup&&this.popup.container.find(">li[data-uid='"+t.data("uid")+"']").removeClass(J)},_showItem:function(t,e){t.removeClass(_);var o=a(t,!0);return t.addClass(_),!!(t.length&&e>this._childrenWidth()+o)&&(t.removeClass(_),this.popup&&this.popup.container.find(">li[data-uid='"+t.data("uid")+"']").addClass(J),!0)},_markVisibles:function(){var t=this.popup.container.children(),e=this.element.children(":not(.k-overflow-anchor)"),o=t.filter(":not(.k-overflow-hidden)"),i=e.filter(":visible");t.add(e).removeClass(N+" "+M),o.first().add(i.first()).addClass(N),o.last().add(i.last()).addClass(M)}});o.ui.plugin(gt)}(window.kendo.jQuery),window.kendo})?i.apply(e,n):i)||(t.exports=s)}}]);