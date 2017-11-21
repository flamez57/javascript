function css(obj, attr, value)
{
	if(arguments.length==2)
		return parseFloat(obj.currentStyle?obj.currentStyle[attr]:document.defaultView.getComputedStyle(obj, false)[attr]);
	else if(arguments.length==3)
		switch(attr)
		{
			case 'width':
			case 'height':
			case 'paddingLeft':
			case 'paddingTop':
			case 'paddingRight':
			case 'paddingBottom':
				value=Math.max(value,0);
			case 'left':
			case 'top':
			case 'marginLeft':
			case 'marginTop':
			case 'marginRight':
			case 'marginBottom':
				obj.style[attr]=value+'px';
				break;
			case 'opacity':
				obj.style.filter="alpha(opacity:"+value*100+")";
				obj.style.opacity=value;
				break;
			default:
				obj.style[attr]=value;
		}
	
	return function (attr_in, value_in){css(obj, attr_in, value_in)};
}

var MIAOV_MOVE_TYPE={
	BUFFER: 1,
	FLEX: 2
};

function miaovStartMove2(obj, oTarget, iType, fnCallBack, fnDuring)
{
	var fnMove=null;
	if(obj.timer)
	{
		clearInterval(obj.timer);
	}
	
	switch(iType)
	{
		case MIAOV_MOVE_TYPE.BUFFER:
			fnMove=miaovDoMoveBuffer;
			break;
		case MIAOV_MOVE_TYPE.FLEX:
			fnMove=miaovDoMoveFlex;
			break;
	}
	
	obj.timer=setInterval(function (){
		fnMove(obj, oTarget, fnCallBack, fnDuring);
	}, 30);
}

function miaovDoMoveBuffer(obj, oTarget, fnCallBack, fnDuring)
{
	var bStop=true;
	var attr='';
	var speed=0;
	var cur=0;
	
	for(attr in oTarget)
	{
		cur=css(obj, attr);
		if(Math.abs(oTarget[attr]-cur)>=1)
		//if(oTarget[attr]!=cur)
		{
			bStop=false;
			
			speed=(oTarget[attr]-cur)/5;
			speed=speed>0?Math.ceil(speed):Math.floor(speed);
			
			css(obj, attr, cur+speed);
		}
	}
	
	if(fnDuring)fnDuring.call(obj);
	
	if(bStop)
	{
		clearInterval(obj.timer);
		obj.timer=null;
		
		if(fnCallBack)fnCallBack.call(obj);
	}
}

function miaovDoMoveFlex(obj, oTarget, fnCallBack, fnDuring)
{
	var bStop=true;
	var attr='';
	var speed=0;
	var cur=0;
	
	for(attr in oTarget)
	{
		if(!obj.oSpeed)obj.oSpeed={};
		if(!obj.oSpeed[attr])obj.oSpeed[attr]=0;
		cur=css(obj, attr);
		if(Math.abs(oTarget[attr]-cur)>=1 || Math.abs(obj.oSpeed[attr])>=1)
		{
			bStop=false;
			
			obj.oSpeed[attr]+=(oTarget[attr]-cur)/5;
			obj.oSpeed[attr]*=0.7;
			
			css(obj, attr, cur+obj.oSpeed[attr]);
		}
	}
	
	if(fnDuring)fnDuring.call(obj);
	
	if(bStop)
	{
		clearInterval(obj.timer);
		obj.timer=null;
		
		if(fnCallBack)fnCallBack.call(obj);
	}
}

window.onload=function ()
{
	var oDiv=document.getElementById('box');
	var aLi=oDiv.getElementsByTagName('ul')[0].getElementsByTagName('li');
	var iTime=400;
	var iTime2=200;
	var i=0;
	
	var duringA=function (){
		css(this, 'marginLeft', -(css(this, 'width'))/2-1);
	};

	for(i=0;i<aLi.length;i++)
	{
		
		aLi[i].onmouseover=function ()
		{
			var oImg=this.getElementsByTagName('img')[0];
			var oA=this.getElementsByTagName('a')[0];
			var oBg=this.getElementsByTagName('span')[1];
			
			if(this.timer)
			{
				clearTimeout(this.timer);
				this.timer=null;
				return;
			}
			
			oA.onmouseover=oImg.onmouseover=oBg.onmouseover=function (ev){
				if(this.parentNode.timer)
				{
					clearTimeout(this.parentNode.timer);
					this.parentNode.timer=null;
					(ev||event).cancelBubble=true;
				}
			};
			oImg.onmouseout=oA.onmouseout=oBg.onmouseout=function (ev){
				var oParent=this.parentNode;
				if(oParent.timer)clearTimeout(oParent.timer);
				oParent.timer=setTimeout(function (){
					oParent.onmouseout();
					oParent.timer=null;
				},200);
				(ev||event).cancelBubble=true;
			};
			
			miaovStartMove2(oImg, {width: 153}, MIAOV_MOVE_TYPE.FLEX, function (){
				css(this, 'marginLeft', -78);
			}, duringA);
			
			miaovStartMove2(oA, {top: 56, paddingTop: 36, paddingBottom: 36}, MIAOV_MOVE_TYPE.FLEX);
			miaovStartMove2(oBg, {height: 115}, MIAOV_MOVE_TYPE.BUFFER);
		};
		
		aLi[i].onmouseout=function ()
		{
			var oImg=this.getElementsByTagName('img')[0];
			var oA=this.getElementsByTagName('a')[0];
			var oBg=this.getElementsByTagName('span')[1];
			
			miaovStartMove2(oImg, {width: 0}, MIAOV_MOVE_TYPE.BUFFER, function (){
				css(this, 'marginLeft', 0);
			}, duringA);
			miaovStartMove2(oA, {top: 4, paddingTop: 8, paddingBottom: 0}, MIAOV_MOVE_TYPE.BUFFER);
			miaovStartMove2(oBg, {height: 0}, MIAOV_MOVE_TYPE.BUFFER);
		};
	}
};