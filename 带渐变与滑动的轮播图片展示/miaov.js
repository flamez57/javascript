// JavaScript Document

function startMove(obj,json,fnEnd){
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		doMove(obj,json,fnEnd);
	},30);
}
function doMove(obj,json,fnEnd){
	var iCur = 0;
	var attr = null;
	var bStop = true;
	for(attr in json){
		if(attr=='opacity'){
			if(parseInt(100*getStyle(obj,attr))==0){
				iCur = parseInt(100*getStyle(obj,attr));
			}
			else{
				iCur = parseInt(100*getStyle(obj,attr)) || 100;
			}
		}
		else{
			iCur = parseInt(getStyle(obj,attr)) || 0;
		}
		var iSpeed = (json[attr] - iCur)/5;
		iSpeed = (iSpeed>0) ? Math.ceil(iSpeed) : Math.floor(iSpeed);
		if(json[attr]!=iCur){
			bStop = false;
		}
		if(attr=='opacity'){
			obj.style.filter = 'alpha(opacity='+ (iCur + iSpeed) +')';
			obj.style.opacity = (iCur + iSpeed)/100;
		}
		else{
			obj.style[attr] = iCur + iSpeed + 'px';
		}	
	}
	if(bStop){
		clearInterval(obj.timer);
		if(fnEnd){
			fnEnd.call(obj);
		}
	}
}
function stopMove(obj){
	clearInterval(obj.timer);
}
function getStyle(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}
	else{
		return getComputedStyle(obj)[attr];
	}
}