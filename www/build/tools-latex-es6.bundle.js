/*! Copyright ©2013-2021 Memba® Sarl. All rights reserved. - Version 0.3.8 dated Fri Apr 23 2021 */
(self.webpackChunkMemba_SmartQuiz=self.webpackChunkMemba_SmartQuiz||[]).push([[7951],{33414:function(t,e,i){"use strict";var a=i(59340),l=i.n(a),s=i(73609),n=i.n(s),r=(i(55031),i(13604),i(52426)),o=i(26986),u=window.kendo.attr,d=o.Z.extend({init:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments.length>1?arguments[1]:void 0;o.Z.fn.init.call(this,t),this.type=r.Z.STRING,this.defaultValue=this.defaultValue||(this.nullable?null:""),this.editor=r.Z.SELECT,this.attributes=n().extend({},this.attributes,e),this.attributes[u(r.Z.ROLE)]="dropdownlist",this.attributes[u("text-field")]="text",this.attributes[u("value-field")]="value",this.attributes[u("value-primitive")]=!0,this.attributes[u("source")]=l()(Array.isArray((t||{}).source)?t.source:[])}});e.Z=d},26719:function(t,e,i){"use strict";var a=i(73609),l=i.n(a),s=(i(55031),i(52426)),n=i(26986),r=n.Z.extend({init:function(t,e){n.Z.fn.init.call(this,t),this.type=s.Z.STRING,this.defaultValue=this.defaultValue||(this.nullable?null:""),this.editor=s.Z.INPUT,this.attributes=l().extend({},this.attributes,e,{type:"text",class:"k-textbox"})}});e.Z=r},97513:function(t,e,i){"use strict";i.r(e),i.d(e,{default:function(){return F}});var a=i(77766),l=i.n(a),s=i(73609),n=i.n(s),r=(i(55031),i(46121)),o=i(52426),u=i(72785),d=(i(89587),i(52013)),h=i(3850),c=window.kendo,f=c.destroy,b=c.htmlEncode,p=c.ui,Z=p.plugin,v=p.Widget,m=new h.Z("widgets.latex"),x=v.extend({init:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};v.fn.init.call(this,t,e),m.debug({method:"init",message:"widget initialized"}),this._render(),this.value(this.options.value)},options:{name:"Latex",value:null,errorColor:"#cc0000",inline:!1},value:function(t){var e;return d.Z.nullableTypeOrUndef(o.Z.STRING,d.Z.format(d.Z.messages.nullableTypeOrUndef.default,t,o.Z.STRING)),n().type(t)===o.Z.UNDEFINED?e=this._value:this._value!==t&&(this._value=t,this.refresh()),e},_render:function(){this.wrapper=this.element,this.element.addClass("kj-latex")},refresh:function(){d.Z.isFunction(u.Z&&u.Z.render,d.Z.format(d.Z.messages.isFunction.default,"katex.render"));var t=this.element,e=this.options;try{u.Z.render(this.value()||"",t[0],{displayMode:!e.inline})}catch(a){var i;t.html(l()(i='<span style="color:'.concat(e.errorColor,'">')).call(i,b(a.message),"</span>"))}m.debug({method:"refresh",message:"widget refreshed"})},destroy:function(){v.fn.destroy.call(this),f(this.element)}});Object.prototype.hasOwnProperty.call(window.kendo.ui,"Latex")||Z(x);var y,g,w,T,R,S=i(13984),k=i(33414),N=i(38320),V=i(81293),C=i(26719),E=i(17757),I=i(70103),_=i(41894),L=window.kendo,O=L.format,A=L.ns,G=l()(y=l()(g=l()(w=l()(T=l()(R='<div\n    class="#: class$() #"\n    data-'.concat(A,'behavior="#: properties.behavior #"\n    data-')).call(R,A,'constant="#: properties.constant #"\n    data-')).call(T,A,'id="#: id$() #"\n    data-')).call(w,A,'inline="#: attributes.inline #"\n    data-')).call(g,A,'role="latex"\n    data-')).call(y,A,'value="#: attributes.formula #"\n    style="#: attributes.style #">\n    </div>'),F=E.BaseTool.extend({id:"latex",height:180,width:370,menu:["attributes.formula"],templates:{default:G},attributes:{formula:new N.Z({title:(0,r.Z)("tools.latex.attributes.formula.title"),defaultValue:(0,r.Z)("tools.latex.attributes.formula.defaultValue")}),inline:new S.Z({title:(0,r.Z)("tools.latex.attributes.inline.title"),defaultValue:(0,r.Z)("tools.latex.attributes.inline.defaultValue")}),style:new V.Z({title:(0,r.Z)("tools.latex.attributes.style.title"),validation:_.W0})},properties:{behavior:new k.Z({defaultValue:"none",source:(0,r.Z)("tools.latex.properties.behavior.source"),title:(0,r.Z)("tools.latex.properties.behavior.title")},{style:"width: 100%;"}),constant:new C.Z({title:(0,r.Z)("tools.image.properties.constant.title"),validation:_.u8})},getHtmlContent:function(t,e){return n().extend(t,{class$:function(){return"draggable"===t.properties.behavior?o.Z.INTERACTIVE_CLASS:""},id$:function(){return"none"!==t.properties.behavior&&n().type(t.id)===o.Z.STRING&&t.id.length?t.id:""}}),E.BaseTool.fn.getHtmlContent.call(this,t,e)},validate:function(t,e){var i=E.BaseTool.fn.validate.call(this,t,e),a=this.description,l=this.i18n.messages;return t.attributes&&t.attributes.formula&&t.attributes.formula!==(0,r.Z)("tools.latex.attributes.formula.defaultValue")&&I.Z.RX_FORMULA.test(t.attributes.formula)||i.push({type:o.Z.WARNING,index:e,message:O(l.invalidFormula,a,e+1)}),(!t.attributes||t.attributes.style&&!I.Z.RX_STYLE.test(t.attributes.style))&&i.push({type:o.Z.ERROR,index:e,message:O(l.invalidStyle,a,e+1)}),i}})}}]);