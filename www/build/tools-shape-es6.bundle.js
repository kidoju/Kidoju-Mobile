/*! Copyright ©2013-2021 Memba® Sarl. All rights reserved. - Version 0.3.8 dated Fri Apr 23 2021 */
(self.webpackChunkMemba_SmartQuiz=self.webpackChunkMemba_SmartQuiz||[]).push([[4956],{7310:function(t,e,i){"use strict";var s=i(73609),n=i.n(s),a=(i(55031),i(52426)),r=i(26986),l=i(70103),o=window.kendo.attr,u=r.Z.extend({init:function(t,e){r.Z.fn.init.call(this,t),this.type=a.Z.STRING,this.defaultValue=this.defaultValue||(this.nullable?null:l.Z.MIDDLE_GREY),this.editor="input",this.attributes=n().extend({},this.attributes,e),this.attributes[o(a.Z.ROLE)]="colorpicker"}});e.Z=u},33414:function(t,e,i){"use strict";var s=i(59340),n=i.n(s),a=i(73609),r=i.n(a),l=(i(55031),i(13604),i(52426)),o=i(26986),u=window.kendo.attr,h=o.Z.extend({init:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments.length>1?arguments[1]:void 0;o.Z.fn.init.call(this,t),this.type=l.Z.STRING,this.defaultValue=this.defaultValue||(this.nullable?null:""),this.editor=l.Z.SELECT,this.attributes=r().extend({},this.attributes,e),this.attributes[u(l.Z.ROLE)]="dropdownlist",this.attributes[u("text-field")]="text",this.attributes[u("value-field")]="value",this.attributes[u("value-primitive")]=!0,this.attributes[u("source")]=n()(Array.isArray((t||{}).source)?t.source:[])}});e.Z=h},40196:function(t,e,i){"use strict";var s=i(73609),n=i.n(s),a=(i(55031),i(52426)),r=i(26986),l=r.Z.extend({init:function(t,e){r.Z.fn.init.call(this,t),this.type=a.Z.STRING,this.defaultValue=this.defaultValue||(this.nullable?null:""),this.editor=a.Z.TEXTAREA,this.attributes=n().extend({},this.attributes,e,{class:"k-textbox"})}});e.Z=l},26719:function(t,e,i){"use strict";var s=i(73609),n=i.n(s),a=(i(55031),i(52426)),r=i(26986),l=r.Z.extend({init:function(t,e){r.Z.fn.init.call(this,t),this.type=a.Z.STRING,this.defaultValue=this.defaultValue||(this.nullable?null:""),this.editor=a.Z.INPUT,this.attributes=n().extend({},this.attributes,e,{type:"text",class:"k-textbox"})}});e.Z=l},45437:function(t,e,i){"use strict";i.r(e),i.d(e,{default:function(){return W}});var s=i(77766),n=i.n(s),a=i(73609),r=i.n(a),l=(i(55031),i(46121)),o=i(52426),u=i(20455),h=i.n(u),d=(i(1700),i(50397),i(52013)),c=i(3850),f=window.kendo,p=f.destroy,b=f.geometry,Z=f.drawing,g=Z.Circle,w=Z.Path,v=Z.Rect,m=Z.Surface,x=Z.Text,y=f.ui,k=y.plugin,T=y.Widget,S=new c.Z("widgets.shape"),E={ELLIPSIS:"ellipsis",POLYGON:"polygon",RECTANGLE:"rectangle"};function C(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return r().type(t)===o.Z.NUMBER?t:e}var z=T.extend({init:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};T.fn.init.call(this,t,e),S.debug({method:"init",message:"widget initialized"}),this._render(),this.resize()},options:{name:"Shape",shape:E.RECTANGLE,angles:4,text:"",style:{fill:{color:"#33ccff"},opacity:1,stroke:{color:"#999",dashType:"solid",width:5}}},shapes:E,_render:function(){var t=this.element;d.Z.ok(t.is(o.Z.DIV),"Please use a div tag to instantiate a Shape widget."),this.wrapper=t.addClass("kj-shape").css({touchAction:o.Z.none,userSelect:o.Z.none}),this.surface=m.create(t)},resize:function(){var t=this.surface;t.clear(),t.resize();var e=t.getSize(),i=this._getShape(e);t.draw(i);var s=this._getText(e);t.draw(s)},_getShape:function(t){var e,i=this.options.style,s=function(t){var e=String(t).toLowerCase();return-1===h()(E).indexOf(e)?E.RECTANGLE:e}(this.options.shape),n={origin:new b.Point(0,0),size:new b.Size(t.width,t.height)};if(s===E.ELLIPSIS)e=n.size.width===n.size.height?function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=C((e.stroke||{}).width,1),s=t.origin.clone().translate(t.size.width/2,t.size.height/2),n=new b.Circle(s,(t.size.width-i)/2);return new g(n,e)}(n,i):function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=C((e.stroke||{}).width,1),s=t.origin.clone().translate(t.size.width/2,t.size.height/2),n=new b.Arc(s,{radiusX:(t.size.width-i)/2,radiusY:(t.size.height-i)/2,startAngle:0,endAngle:360});return w.fromArc(n,e).close()}(n,i);else if(s===E.POLYGON){e=function(t,e){for(var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:4,s=C((e.stroke||{}).width,1),n=t.origin.clone().translate(t.size.width/2,t.size.height/2),a=(t.size.width-s)/2,r=(t.size.height-s)/2,l=new w(e),o=0;o<i;o++){var u=2*Math.PI*o/i;l[0===o?"moveTo":"lineTo"](n.clone().translate(a*Math.cos(u),r*Math.sin(u)))}return l.close()}(n,i,C(this.options.angles,4))}else s===E.RECTANGLE&&(e=function(t,e){var i=C((e.stroke||{}).width,1),s=t.origin.clone().translate(i/2,i/2),n=t.size.clone().setWidth(t.size.width-i).setHeight(t.size.height-i),a=new b.Rect(s,n);return new v(a,e)}(n,i));return e},_getText:function(t){var e=this.options.text,i=new b.Point(10,10);return new x(e,i)},destroy:function(){T.fn.destroy.call(this),S.debug({method:"destroy",message:"widget destroyed"}),p(this.element)}});Object.prototype.hasOwnProperty.call(window.kendo.ui,"Shape")||k(z);var R,L,I,G,N=i(7310),V=i(33414),_=i(69495),A=i(40196),P=i(26719),M=i(17757),q=i(70103),O=i(41894),Y=window.kendo.ns,D=n()(R=n()(L=n()(I=n()(G="<div\n    data-".concat(Y,'role="shape"\n    data-')).call(G,Y,'shape="#: attributes.shape #"\n    data-')).call(I,Y,'angles="#: attributes.angles #"\n    data-')).call(L,Y,'text="#: attributes.text #"\n    data-')).call(R,Y,'style="{fill:{color:&quot;#: fillColor$() #&quot;}, stroke:{color:&quot;#: strokeColor$() #&quot;, width:#: attributes.strokeWidth #}}">\n</div>'),W=M.BaseTool.extend({id:"shape",height:200,width:300,menu:["attributes.shape","attributes.text","attributes.fillColor"],templates:{default:D},attributes:{shape:new V.Z({defaultValue:"rectangle",help:(0,l.Z)("tools.shape.attributes.shape.help"),source:(0,l.Z)("tools.shape.attributes.shape.source"),title:(0,l.Z)("tools.shape.attributes.shape.title")},{style:"width: 100%;"}),angles:new _.Z({help:(0,l.Z)("tools.shape.attributes.angles.help"),title:(0,l.Z)("tools.shape.attributes.angles.title"),defaultValue:4},{"data-decimals":0,"data-format":"n0","data-min":3,"data-max":20}),text:new A.Z({help:(0,l.Z)("tools.shape.attributes.text.help"),title:(0,l.Z)("tools.shape.attributes.text.title")}),fillColor:new N.Z({help:(0,l.Z)("tools.shape.attributes.fillColor.help"),title:(0,l.Z)("tools.shape.attributes.fillColor.title"),defaultValue:q.Z.MIDDLE_GREY,nullable:!0},{"data-clear-button":!0}),strokeColor:new N.Z({help:(0,l.Z)("tools.shape.attributes.strokeColor.help"),title:(0,l.Z)("tools.shape.attributes.strokeColor.title"),defaultValue:q.Z.MIDDLE_GREY,nullable:!0},{"data-clear-button":!0}),strokeWidth:new _.Z({help:(0,l.Z)("tools.shape.attributes.strokeWidth.help"),title:(0,l.Z)("tools.shape.attributes.strokeWidth.title"),defaultValue:1},{"data-decimals":0,"data-format":"n0","data-min":0,"data-max":20})},properties:{behavior:new V.Z({defaultValue:"none",source:(0,l.Z)("tools.shape.properties.behavior.source"),title:(0,l.Z)("tools.shape.properties.behavior.title")},{style:"width: 100%;"}),constant:new P.Z({title:(0,l.Z)("tools.shape.properties.constant.title"),validation:O.u8})},getHtmlContent:function(t,e){return r().extend(t,{fillColor$:function(){var e=t.get("attributes.fillColor");return r().type(e)===o.Z.STRING?e:"none"},strokeColor$:function(){var e=t.get("attributes.strokeColor");return r().type(e)===o.Z.STRING?e:"none"}}),M.BaseTool.fn.getHtmlContent.call(this,t,e)}})},41894:function(t,e,i){"use strict";i.d(e,{aN:function(){return a},u8:function(){return r},pP:function(){return l},TZ:function(){return o},Ze:function(){return u},W0:function(){return h},bq:function(){return d},T:function(){return c}});i(73609),i(55031);var s=i(52426),n=i(70103);var a={required:!0,alt:function(t){return!t.is('[name="attributes.alt"]')}},r={required:!0,constant:function(t){return!!t}},l={required:!0,pattern:n.Z.RX_TEXT},o={score:function(t){return!!t}},u={solution:function(t){return!!t}},h={style:function(t){return!(t.is('[name="attributes.style"]')||t.is('[name="attributes.groupStyle"]')||t.is('[name="attributes.itemStyle"]')||t.is('[name="attributes.selectedStyle"]')||t.is('[name="attributes.highlightStyle"]'))||(t.val()===s.Z.EMPTY||n.Z.RX_STYLE.test(t.val()))}},d={required:!0,text:function(t){return!t.is('[name="attributes.text"]')||n.Z.RX_TEXT.test(t.val())}},c={validation:function(t){return!!t}}}}]);