function getStyle(obj, attr)
{
	if(obj.currentStyle)
	{
		return obj.currentStyle[attr];
	}
	else
	{
		return getComputedStyle(obj, false)[attr];
	}
}

//startMove(oDiv, {width: 200, height: 200});

function startMove(obj, json, fnEnd)
{
	clearInterval(obj.timer);
	var attr;
	obj.timer=setInterval(function (){
		
		var bStop=true;		//是不是都到了，假设所有的都到了
		
		for(attr in json)
		{
			var iCur=0;
			
			//取当前位置
			if(attr=='opacity')
			{
				iCur=parseInt(parseFloat(getStyle(obj, attr))*100);
			}
			else
			{
				iCur=parseInt(getStyle(obj, attr));
			}
			
			//算速度
			var iSpeed=(json[attr]-iCur)/8;
			iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);
			
			//到没到
			
			if(attr=='opacity')
			{
				obj.style.filter='alpha(opacity:'+(iCur+iSpeed)+')';
				obj.style.opacity=(iCur+iSpeed)/100;
			}
			else
			{
				obj.style[attr]=iCur+iSpeed+'px';
			}
			
			if(iCur!=json[attr])
			{
				bStop=false;
			}
		}
		
		if(bStop)
		{
			clearInterval(obj.timer);
			if(fnEnd)
			{
				fnEnd();
			}
		}
		//alert(obj.offsetHeight);
	}, 30);
}