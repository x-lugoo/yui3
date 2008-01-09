(function(){var G=YAHOO,C=G.util,F=C.Dom,B=G.lang,A=G.widget;function E(D){this.constructor.superclass.constructor.apply(this,arguments);}E.NAME="SliderThumb";E.CONFIG={"group":{},"minX":{value:0},"maxX":{value:0},"minY":{value:0},"maxY":{value:0},"tickSize":{validator:function(D){return(B.isNumber(D)&&D>=0);},value:0},"x":{set:function(D){return this._constrain(D,E.X);},value:0},"y":{set:function(D){return this._constrain(D,E.Y);},value:0},"locked":{value:false}};B.extend(E,A.Widget,{initializer:function(D){},renderer:function(){this.centerPoint=this.findCenter();this.initDD();this.apply();},_constrain:function(L,J){var I=this.get("min"+J);var D=this.get("max"+J);var H=this.get("tickSize");if(L<I){L=I;}else{if(L>D){L=D;}else{if(H>0){var K=L%H;if(K>0){if(K<Math.round(H/2)){L=L-K;}else{L=L+(H-K);}}}}}return L;},lock:function(){this.set("locked",true);},unlock:function(){this.set("locked",false);},isLocked:function(){return this.get("locked");},getValue:function(){var H=this.parent,D;if(H._isRegion){D=[this.getXValue(),this.getYValue()];}else{if(H._isVert){D=this.getYValue();}else{D=this.getXValue();}}return D;},getXValue:function(){return this.get("x");},getYValue:function(){return this.get("y");},getXRange:function(){return this.get("maxX")-this.get("minX");},getYRange:function(){return this.get("maxY")-this.get("minY");},getTickPause:function(){var I=this.get("tickSize");if(I>0){var D=(this.parent._isHoriz)?this.getXRange():this.getYRange();var H=Math.round(D/I);if(H>0){return Math.round(360/H);}}return 0;},endMove:function(){this.parent.endMove();},initDD:function(){var H=this,I=this.getXScale(),J=this.getYScale();var D=new C.DD(this.getThumbEl().id,H.get("group"));D.isTarget=false;D.maintainOffset=true;D.scroll=false;D.setInitPosition();D.setXConstraint(H.get("minX")*I,H.get("maxX")*I,H.get("tickSize")*I);D.setYConstraint(H.get("minY")*J,H.get("maxY")*J,H.get("tickSize")*J);this._dd=D;},getOffsetFromParent:function(M){var O=this.getThumbEl();var K;if(!this.deltaOffset){var D=F.getXY(O);M=M||F.getXY(this.getParentEl());K=[(D[0]-M[0]),(D[1]-M[1])];var I=parseInt(F.getStyle(O,"left"),10);var P=parseInt(F.getStyle(O,"top"),10);var L=I-K[0];var J=P-K[1];if(!isNaN(L)&&!isNaN(J)){this.deltaOffset=[L,J];}}else{var H=parseInt(F.getStyle(O,"left"),10);var N=parseInt(F.getStyle(O,"top"),10);K=[H+this.deltaOffset[0],N+this.deltaOffset[1]];}return K;},getUIValue:function(){var H=this.parent,D;if(H._isHoriz){D=this.getUIXValue();}else{if(H._isVert){D=this.getUIYValue();}else{D=[this.getUIXValue(),this.getUIYValue()];}}return D;},getUIXValue:function(){return Math.round(this.getOffsetFromParent()[0]/this.getXScale());},getUIYValue:function(){return Math.round(this.getOffsetFromParent()[1]/this.getYScale());},setXOffset:function(){this.moveThumb(this.getOffsetForX(),null,false,false);},setYOffset:function(){this.moveThumb(null,this.getOffsetForY(),false,false);},getXScale:function(){var D=this.getXRange();if(D>0){var H=this.getParentEl().offsetWidth-this.getThumbEl().offsetWidth;return Math.round(H/D);}else{return 0;}},getYScale:function(){var D=this.getYRange();if(D>0){var H=this.getParentEl().offsetHeight-this.getThumbEl().offsetHeight;return Math.round(H/D);}else{return 0;}},getOffsetForX:function(D){var I=this.getXValue()-this.get("minX");var J=I*this.getXScale()+this.centerPoint.x;var H=F.getXY(this.getParentEl())[0];return H+J;},getOffsetForY:function(J){var H=this.getYValue()-this.get("minY");var I=H*this.getYScale()+this.centerPoint.y;var D=F.getXY(this.getParentEl())[1];return D+I;},findCenter:function(){var D=this.getThumbEl();return{x:parseInt(D.offsetWidth/2,10),y:parseInt(D.offsetHeight/2,10)};},moveThumb:function(Q,P,N,M){var I=F.getXY(this.getThumbEl());var O=this.centerPoint;if(!Q&&Q!==0){Q=I[0]+O.x;}if(!P&&P!==0){P=I[1]+O.y;}this._dd.setDelta(O.x,O.y);var J=this._dd.getTargetCoord(Q,P);var L=[J.x,J.y];var H=this;var K=this.parent.get("animate");if(K&&this.get("tickSize")>0&&!N){this.lock();this.curCoord=I;setTimeout(function(){H.moveOneTick(L);},this.parent.get("tickPause"));}else{if(K&&!N){this.lock();var D=new C.Motion(this.getThumbEl().id,{points:{to:L}},this.get("animationDuration"),C.Easing.easeOut);D.onComplete.subscribe(function(){H.endMove();});D.animate();}else{this._dd.setDragElPos(Q,P);if(!M){this.endMove();}}}},moveOneTick:function(H){var J,K=this.parent;if(K._isRegion){J=this._getNextX(this.curCoord,H);var D=(J)?J[0]:this.curCoord[0];J=this._getNextY([D,this.curCoord[1]],H);}else{if(K._isVert){J=this._getNextY(this.curCoord,H);}else{J=this._getNextX(this.curCoord,H);}}if(J){this.curCoord=J;this._dd.alignElWithMouse(this.getThumbEl(),J[0],J[1]);if(!(J[0]==H[0]&&J[1]==H[1])){var I=this;setTimeout(function(){I.moveOneTick(H);},this.parent.get("tickPause"));}else{this.endMove();}}else{this.endMove();}},_getNextX:function(D,H){var K;var I=[];var J=null;if(D[0]>H[0]){K=this.get("tickSize")-this.centerPoint.x;I=this._dd.getTargetCoord(D[0]-K,D[1]);J=[I.x,I.y];}else{if(D[0]<H[0]){K=this.get("tickSize")+this.centerPoint.x;I=this._dd.getTargetCoord(D[0]+K,D[1]);J=[I.x,I.y];}else{}}return J;},_getNextY:function(D,H){var K;var I=[];var J=null;if(D[1]>H[1]){K=this.get("tickSize")-this.centerPoint.y;I=this._dd.getTargetCoord(D[0],D[1]-K);J=[I.x,I.y];}else{if(D[1]<H[1]){K=this.get("tickSize")+this.centerPoint.y;I=this._dd.getTargetCoord(D[0],D[1]+K);J=[I.x,I.y];}else{}}return J;},getThumbEl:function(){return this._node;},getParentEl:function(){return this.parent._node;},apply:function(){this.addViewListeners();},addViewListeners:function(){this.on("xChange",this.setXOffset,this,true);this.on("yChange",this.setYOffset,this,true);this.on("render",function(){this.setYOffset();this.setXOffset();},this,true);this.on("tickSize",this.onTickSizeChange,this,true);this.on("lockedChange",this.onLockChange,this,true);},onTickSizeChange:function(){if(this.get("tickSize")===0){this._dd.clearTicks();}},onLockChange:function(){var D=this._dd;if(this.get("locked")){D.lock();}else{D.unlock();}},centerPoint:null,curCoord:null,_dd:null});
E.X="X";E.Y="Y";A.SliderThumb=E;})();(function(){var K=YAHOO,F=K.util,H=F.Event,I=F.Dom,B=K.lang,J=B.CONST,A=K.widget;function G(C){this.constructor.superclass.constructor.apply(this,arguments);}G.NAME="Slider";G.E={SlideStart:"slideStart",SlideEnd:"sliderEnd",EndMove:"endMove",Change:J.Change};G.CONFIG={group:{},thumb:{},type:{set:function(C){if(C=="region"){this._isRegion=true;}else{if(C=="horiz"){this._isHoriz=true;}else{this._isVert=true;}}},value:"horiz",validator:function(C){return(C=="horiz"||C=="vert"||C=="region");}},bgEnabled:{value:true},keysEnabled:{value:true},keyIncrement:{value:20},tickPause:{value:40},animationDuration:{value:0.2},animate:{value:!B.isUndefined(F.Anim)},locked:{value:false}};B.extend(G,A.Widget,{initializer:function(C){if(this.get("group")){this.initThumb();}},renderer:function(){this.baselinePos=I.getXY(this.getBackgroundEl());this.getThumb().render();this.initDD();this.apply();},initThumb:function(){var C=this.getThumb();C.parent=this;this.set("tickPause",C.getTickPause());},getThumb:function(){return this.get("thumb");},lock:function(){this.set("locked",true);},unlock:function(){this.set("locked",false);},isLocked:function(){return this.get("locked");},getValue:function(){return this.getThumb().getValue();},getXValue:function(){return this.getThumb().getXValue();},getYValue:function(){return this.getThumb().getYValue();},setValueToMin:function(){this._setValToLimit(false);},setValueToMax:function(){this._setValToLimit(true);},setValue:function(L,E,C){if(this.isLocked()&&!E){return false;}if(isNaN(L)){return false;}var D=this.getThumb();if(this._isRegion){return false;}else{if(this._isHoriz){D.set("x",L,C);}else{if(this._isVert){D.set("y",L,C);}}}},setRegionValue:function(D,C,M,E){if(this.isLocked()&&!M){return false;}if(isNaN(D)&&isNaN(C)){return false;}var L=this.getThumb();if(D||D===0){L.set("x",D,E);}if(C||C===0){L.set("y",C,E);}},stepYValue:function(C){var D=this.get("keyIncrement")*C;var E=this.getYValue()+D;if(this._isVert){this.setValue(E);}else{if(this._isRegion){this.setRegionValue(null,E);}}},stepXValue:function(C){var D=this.get("keyIncrement")*C;var E=this.getXValue()+D;if(this._isHoriz){this.setValue(E);}else{if(this._isRegion){this.setRegionValue(E,null);}}},_setValToLimit:function(D){var M=(D)?"max":"min",E=this.getThumb(),L=A.SliderThumb,C=L.X,N=L.Y;if(this._isRegion){this.setRegionValue(E.get(M+C),E.get(M+N));}else{if(this._isVert){this.setValue(E.get(M+N));}else{this.setValue(E.get(M+C));}}},_slideStart:function(){if(!this._sliding){this.fireEvent(G.E.SlideStart);this._sliding=true;}},_slideEnd:function(){if(this._sliding&&this.moveComplete){this.fireEvent(G.E.SlideEnd);this._sliding=false;this.moveComplete=false;}},endMove:function(){this.unlock();this.moveComplete=true;this.fireEvent(G.E.EndMove);this.fireEvents();},fireEvents:function(E){var D=this.getThumb();if(!E){this.cachePosition();}if(!this.isLocked()){if(this._isRegion){var M=D.getXValue();var L=D.getYValue();if(M!=this.previousX||L!=this.previousY){this.fireEvent(G.E.Change,{x:M,y:L});}this.previousX=M;this.previousY=L;}else{var C=D.getValue();if(C!=this.previousVal){this.fireEvent(G.E.Change,C);}this.previousVal=C;}this._slideEnd();}},focus:function(){this.focusEl();if(this.isLocked()){return false;}else{this._slideStart();return true;}},initDD:function(){this._dd=new F.DragDrop(this.getBackgroundEl().id,this.get("group"),true);this._dd.setInitPosition();this._dd.isTarget=false;},focusEl:function(){var C=this.getBackgroundEl();if(C.focus){try{C.focus();}catch(D){}}this.verifyOffset();},verifyOffset:function(D){var C=I.getXY(this.getBackgroundEl());if(C){if(C[0]!=this.baselinePos[0]||C[1]!=this.baselinePos[1]){this.getThumb()._dd.resetConstraints();this.baselinePos=C;return false;}}return true;},cachePosition:function(){this.getThumb()._dd.cachePosition();},getBackgroundEl:function(){return this._node;},apply:function(){this.addKeyListeners();this.addDDListeners();this.addThumbDDListeners();this.addViewListeners();},addKeyListeners:function(){var C=this.getBackgroundEl();H.on(C,"keydown",this.onKeyDown,this,true);H.on(C,"keypress",this.onKeyPress,this,true);},addDDListeners:function(){var C=this,D=this._dd;D.b4MouseDown=function(E){C.beforeBGMouseDown(E);};D.onDrag=function(E){C.onBGDrag(E);};D.onMouseDown=function(E){C.onBGMouseDown(E);};this.on(G.E.EndMove,this.sync,this,true);},addThumbDDListeners:function(){var C=this,D=this.getThumb()._dd;D.onMouseDown=function(E){C.onThumbMouseDown(E);};D.startDrag=function(E){C.onThumbStartDrag(E);};D.onDrag=function(E){C.onThumbDrag(E);};D.onMouseUp=function(E){C.onThumbMouseUp(E);};},addViewListeners:function(){this.on("lockedChange",this.onLockChange,this,true);},onLockChange:function(){var C=this._dd;var D=this.getThumb();if(this.get("locked")){C.lock();D.lock();}else{C.unlock();D.unlock();}},beforeBGMouseDown:function(D){var C=this.getThumb()._dd;C.autoOffset();C.resetConstraints();},onBGMouseDown:function(C){if(!this.isLocked()&&this.get("bgEnabled")){this.focus();this._moveThumb(C);}},onBGDrag:function(C){if(!this.isLocked()){this._moveThumb(C);}},onThumbMouseDown:function(C){return this.focus();},onThumbStartDrag:function(C){this._slideStart();},onThumbDrag:function(C){this.sync();this.fireEvents(true);},onThumbMouseUp:function(C){if(!this.isLocked()&&!this.moveComplete){this.endMove();}},onKeyPress:function(C){if(this.get("keysEnabled")){switch(H.getCharCode(C)){case 37:case 38:case 39:case 40:case 36:case 35:H.preventDefault(C);break;default:}}},onKeyDown:function(D){var C=G;if(this.get("keysEnabled")){var E=true;switch(H.getCharCode(D)){case 37:this.stepXValue(C.DEC);break;case 38:this.stepYValue(C.DEC);break;case 39:this.stepXValue(C.INC);break;case 40:this.stepYValue(C.INC);break;case 36:this.setValueToMin();break;case 35:this.setValueToMax();break;default:E=false;}if(E){H.stopEvent(D);}}},sync:function(){var C=this.getThumb().getUIValue();if(this._isRegion){this.setRegionValue(C[0],C[1],false,true);}else{this.setValue(C,false,true);
}},_moveThumb:function(D){var C=H.getPageX(D);var E=H.getPageY(D);this.getThumb().moveThumb(C,E);},_dd:null});G.INC=1;G.DEC=-1;G.getHorizSlider=function(E,D,C,N,M){var L=new A.SliderThumb({node:D,group:E,minX:C,maxX:N,minY:0,maxY:0,tickSize:M});return new G({node:E,group:E,thumb:L,type:"horiz"});};G.getVertSlider=function(D,C,N,M,L){var E=new A.SliderThumb({node:C,group:D,minY:N,maxY:M,minX:0,maxX:0,tickSize:L});return new G({node:D,group:D,thumb:E,type:"vert"});};G.getRegionSlider=function(E,D,C,O,P,N,M){var L=new A.SliderThumb({node:D,group:E,minX:C,maxX:O,minY:P,maxY:N,tickSize:M});return new G({node:E,group:E,thumb:L,type:"region"});};A.Slider=G;})();YAHOO.register("slider",YAHOO.widget.Slider,{version:"@VERSION@",build:"@BUILD@"});