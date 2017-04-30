window.onload=function()
{
	var oMiaov=$('miaov');
	var oWp=$('wrapper');
	var oView=$('view');
	var newImg=$('news');
	var oThumb=$('thumb');
	var oTip=$('tip');
	var oH=oMiaov.getElementsByTagName('h2')[0];
	var oImg=oView.getElementsByTagName('img')[0];
	var oDiv=$('list').getElementsByTagName('div')[0];
	var oLoad=oView.getElementsByTagName('div')[0];
	var aImg=oDiv.getElementsByTagName('img');
	var oSpan=oThumb.getElementsByTagName('span');
	var arr=[];
	var zIndex=3;
	var preIndex=0;
	var bChk=false;
	var bDown=true;
	var iNum=0;
	var iStart=0;
	var iEnd=13;
	var oldIndex=0;

	oMiaov.style.left=oMiaov.offsetLeft+'px';
	oMiaov.style.top=oMiaov.offsetTop+'px';
	oMiaov.style.margin='0px';

	for(var i=0; i<aImg.length; i++)
	{
		arr[i]={left: aImg[i].offsetLeft, top: aImg[i].offsetTop, src: aImg[i].src};
	}

	for(var i=0; i<aImg.length; i++)
	{
		aImg[i].onclick=function()
		{
			if(!oTip.clk)
			{
				fnTip(oTip,'主窗口按住标题可以拖动；点击大图可放大，放大后鼠标在大图上左右滑动可浏览左右被隐藏部分；也可以用鼠标滚轮和键盘左右方向键来切换哦！','left','0',5000);
				oTip.clk=true;
			}
			if(oldIndex==this.index)
			{
				return false;
			}
			iNum=this.index;
			aImg[oldIndex].className='';
			oldIndex=this.index;
			aImg[oldIndex].className='active';
			changePic(this);
		};
		aImg[i].onmouseover=function()
		{
			iNum=this.index;
			changeThumb(this);
		};
		oThumb.onmouseout=function()
		{
			if(oldIndex!=this.index)
			{
				iNum=oldIndex;
				changeThumb(aImg[oldIndex]);
			}
		};
	}

	document.onkeyup=function(ev)
	{
		var oEv=ev||event;

		switch(oEv.keyCode)
		{
			case 37:
				toLeft();
				break;
			case 39:
				toRight();
				break;
		}
	};

	function toBig(obj)
	{
		obj.onclick=function(ev)
		{
			var oEv=ev||window.event;
			var disX=oEv.clientX-oMiaov.offsetLeft;

			if(bChk==true)
			{
				startMove(this,{width: 480, height: 300,left: 10,top: 50},3);
				bChk=false;
			}
			else
			{
				startMove(this,{width: 680, height: 400,left: 0,top: 0},3,function(){
					toMove(this,disX)
				});
				bChk=true;
			}
		};

		obj.onmousemove=function(ev)
		{
			var oEv=ev||event;
			var disX=oEv.clientX-oMiaov.offsetLeft;
			toMove(obj,disX);
		}
	}

	function picShow()
	{
		for(var i=0; i<aImg.length; i++)
		{
			aImg[i].index=i;
			aImg[i].style.position='absolute';
			aImg[i].style.display='none';
		}
		for(var i=iStart; i<iEnd+1; i++)
		{
			if(aImg[i])
			{
				aImg[i].style.display='block';
				aImg[i].style.left=arr[i-iStart].left+'px';
				aImg[i].style.top=arr[i-iStart].top+'px';
				aImg[i].style.margin='0';
			}
		}
		if(iNum==0)
		{
			aImg[iStart].className='active';
			aImg[iStart].style.marginLeft='-8px';
			aImg[iStart].style.marginTop='-7px';
			aImg[iStart].style.zIndex=zIndex++;
		}
	}

	function toMove(obj,disX)
	{
		if(bChk==true&&obj.offsetWidth==680)
		{
			if(disX>250)
			{
				clearInterval(obj.timer);
				startMove(obj,{left: 0},30);
			}else{
				clearInterval(obj.timer);
				startMove(obj,{left: -180},30);				
			}
		}
	}

	function changeThumb(obj)
	{
		startMove(aImg[preIndex],{width: 28, height: 22,marginLeft: 0,marginTop: 0},8);
		startMove(obj,{width: 42, height: 32,marginLeft: -8,marginTop: -7},8);
		obj.style.zIndex=zIndex++;
		preIndex=iNum;
	}

	function changePic(obj)
	{
		bChk=false;
		oLoad.style.display='block';
		aImg[preIndex].className='';
		if(preIndex==0)
		{
			aImg[preIndex].style.width='42px';		
			aImg[preIndex].style.height='32px';		
		}
		startMove(aImg[preIndex],{width: 28, height: 22,marginLeft: 0,marginTop: 0},8);
		startMove(obj,{width: 42, height: 32,marginLeft: -8,marginTop: -7},8);
		obj.style.zIndex=zIndex++;
		picLoad(newImg,obj);
		preIndex=iNum;
		toChange(newImg,oImg);
		oldIndex=iNum;
		aImg[oldIndex].className='active';

		var tmp=oImg;
		oImg=newImg;
		newImg=tmp;
		toBig(oImg);
		toBig(newImg);
	}

	function picLoad(obj1,obj2)
	{
		var oPic=new Image();
		obj1.src=obj2.src;

		oPic.onload=function()
		{
			oLoad.style.display='none';
			obj1.src=this.src;
		}
		oPic.src=reStr(obj2.src);
	}

	function mouseWheel(ev)
	{
		var oEv=ev||event;

		bDown=oEv.wheelDelta?oEv.wheelDelta<0:oEv.detail>0;

		if(bDown)
		{
			toRight();
		}
		else
		{
			toLeft();
		}
		if(oEv.preventDefault){oEv.preventDefault();}
		return false;
	}
	
	function toLeft()
	{
		iNum-=1;
		if(iNum<0)
		{
			iNum=0;
			return false;
		}

		if(iNum==iStart-1)
		{
			iEnd=iStart;
			iStart-=13;
			picShow();
		}
		changePic(aImg[iNum]);
	}
	
	function toRight()
	{
		iNum+=1;
		if(iNum==aImg.length)
		{
			iNum=aImg.length-1;
			return false;
		}
		changePic(aImg[iNum]);
		if(iNum==iEnd)
		{
			iStart=iEnd;
			iEnd+=13;
			picShow();
		}
	}

	oSpan[0].onclick=function()
	{
		if(iStart-13>=0)
		{
			iNum-=13;
			iStart-=13;
			iEnd-=13;
			oldIndex-=13;
			changePic(aImg[iNum]);
			picShow();
		}
		else
		{
			fnTip(oTip,'已经是第一页了！','left','0px',30);
		}
	};

	oSpan[1].onclick=function()
	{
		if(iStart+13<aImg.length-1)
		{
			iNum+=13;
			iStart+=13;
			oldIndex+=13;
			if(iNum>aImg.length-1&&iNum>parseInt(aImg.length/13)*13)
			{
				iNum=aImg.length-1;
				oldIndex=iNum;
			}
			iEnd+=13;
			changePic(aImg[iNum]);
			picShow();
		}
		else
		{
			fnTip(oTip,'已经是最后一页了！','right','0px',30);
		}
	};

	oSpan[0].onmouseover=oSpan[1].onmouseover=function()
	{
		this.className+=' hover';
	};

	oSpan[0].onmouseout=function()
	{
		this.className='s1';
	};

	oSpan[1].onmouseout=function()
	{
		this.className='s2';
	};
		
	myAddEvent(oWp,'mousewheel',mouseWheel);
	myAddEvent(oWp,'DOMMouseScroll',mouseWheel);

	picShow();
	toBig(oImg);
	oTip.clk=false;
	fnDrag(oH,oMiaov);
	picLoad(oImg,aImg[0]);
};

function $(id)
{
	return document.getElementById(id);
}

function toChange(obj1,obj2)
{
	obj1.style.filter="opacity: 100";
	obj1.style.opacity="1";
	obj1.style.top='500px';
	obj1.style.left='150px';
	obj1.style.width='200px';
	obj2.style.top='50px';
	obj2.style.left='10px';
	obj2.style.width='480px';
	startMove(obj1,{width: 480, height: 300,left: 10, top: 50},6);
	startMove(obj2,{width: 480, height: 300,left: 10, top: 0,opacity: 0},6,function(){
		startMove(this,{width: 200, height: 150,left: 150, top: 500},3,function(){
			this.style.filter="opacity: 100";
			this.style.opacity="1";
		});
	});
}

function reStr(str)
{
	var n=str.lastIndexOf('/');
	var s1=str.substring(0,n+1);
	var s2=str.substring(n+2);
	var s=s1+s2;

	return s;
}

function myAddEvent(obj,sEv,fn)
{
	if(obj.attachEvent)
	{
		obj.attachEvent('on'+sEv,fn);
	}
	else
	{
		obj.addEventListener(sEv,fn,false);
	}
}

function startMove(obj,json,x,endFn)
{
	clearInterval(obj.timer);
	obj.timer=setInterval(function()
	{
		doMove(obj,json,x,endFn);
	},30);
}

function doMove(obj,json,x,endFn)
{
	var iCur=0;
	var bStop=true;
	
	for(var attr in json)
	{
		
		if(attr=='opacity')
		{
			if(iCur=Math.round(getStyle(obj,attr)*100)==0)
			{
				iCur=Math.round(getStyle(obj,attr)*100)
			}
			else
			{
				iCur=Math.round(getStyle(obj,attr)*100)||100;
			}
		}
		else
		{
			iCur=parseInt(getStyle(obj,attr))||0;	
		}
		
		var iSpeed=(json[attr]-iCur)/x;
		iSpeed=iSpeed>0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
		
		if(iCur!=json[attr])
		{
			bStop=false;
		}
		
		if(attr=='opacity')
		{
			obj.style.opacity=(iCur+iSpeed)/100;
			obj.style.filter='alpha(opacity='+(iCur+iSpeed)+')';
		}
		else
		{
			obj.style[attr]=iCur+iSpeed+'px';		
		}
	}
	
	if(bStop)
	{
		clearInterval(obj.timer);	
		if(endFn)
		{
			endFn.call(obj);
		}	
	}
	
}

function getStyle(obj,attr)
{
	if(obj.currentStyle)
	{
		return obj.currentStyle[attr];
	}
	else
	{
		return getComputedStyle(obj,false)[attr];
	}
}

function fnDrag(obj,oParent){
	obj.onmousedown=function(ev){
		var oEvent=ev||event;
		var theX=oEvent.clientX-oParent.offsetLeft;
		var theY=oEvent.clientY-oParent.offsetTop;

		if(obj.setCapture)
		{
			obj.onmousemove=function(ev){fnMove(ev);};
			obj.onmouseup=fnUp;
			obj.setCapture();
		}
		else
		{
			document.onmousemove=function(ev){fnMove(ev);};
			document.onmouseup=fnUp;
		}
			
		function fnMove(ev){
			var oEvent=ev||event;
			var l=oEvent.clientX-theX;
			var t=oEvent.clientY-theY;
			if(l<0){
				l=0;	
			}else if(l>document.documentElement.clientWidth-oParent.offsetWidth){
				l=document.documentElement.clientWidth-oParent.offsetWidth;
			}
			if(t<0){
				t=0;	
			}else if(t>document.documentElement.clientHeight-oParent.offsetHeight){
				t=document.documentElement.clientHeight-oParent.offsetHeight;
			}
			oParent.style.left=l+"px";
			oParent.style.top=t+"px";
		};
				
		function fnUp(){
			this.onmouseup=null;
			this.onmousemove=null;
			if(this.releaseCapture)
			{this.releaseCapture();};
		};
		
		return false;
	}
}

function fnTip(obj,txt,pos,val,iTime)
{
	obj.style.left='';
	obj.style.right='';
	obj.style[pos]=val;
	obj.innerHTML=txt;
	startMove(obj,{opacity: 100},8,function(){
		setTimeout(function()
		{
			startMove(obj,{opacity: 0},8);
		},iTime);
	});
}