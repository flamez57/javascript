//设置提示文本
var g_aDefaultText=[];
var g_aDefaultTextColor=[];
var g_aNormalTextColor=[];
var g_iDefaultTextMaxIndex=0;

function setDefaultText(oInputElement, sDefaultText, sDefaultTextColor, sNormalTextColor)
{
	//将信息保存起来，以后使用
	g_aDefaultText.push(sDefaultText);
	g_aDefaultTextColor.push(sDefaultTextColor);
	g_aNormalTextColor.push(sNormalTextColor);
	
	//初始化为提示文本
	oInputElement.value=sDefaultText;
	oInputElement.style.color=sDefaultTextColor;
	
	//设置“是否正在显示提示文本”信息
	oInputElement.isDefault=true;
	oInputElement.index=g_iDefaultTextMaxIndex++;
	
	//添加事件
	oInputElement.onfocus=__defaultTextOnFocusHandler__;
	oInputElement.onblur=__defaultTextOnBlurHandler__;
}

function defaultTextSetText(oInputElement, sText)
{
	oInputElement.isDefault=false;
	oInputElement.value=sText;
	oInputElement.style.color=g_aNormalTextColor[oInputElement.index];
}

function __defaultTextOnFocusHandler__(ev)
{
	if(this.isDefault)
	{
		this.value='';
		this.style.color=g_aNormalTextColor[this.index];
	}
}

function __defaultTextOnBlurHandler__(ev)
{
	if(this.value.length)
	{
		this.isDefault=false;
	}
	else
	{
		this.isDefault=true;
		this.value=g_aDefaultText[this.index];
		this.style.color=g_aDefaultTextColor[this.index];
	}
}

//下拉列表
var g_aUl=[];
var g_aFnOnItemSelect=[];
var g_iDropDownMaxIndex=0;

function setDropDown(oUl, fnOnItemSelect)
{
	var aLis=oUl.getElementsByTagName('li');
	var i;
	
	//
	g_aUl.push(oUl);
	g_aFnOnItemSelect.push(fnOnItemSelect);
	
	//
	oUl.style.display='none';
	
	for(i=0;i<aLis.length;i++)
	{
		aLis[i].className='';
		
		aLis[i].index=g_iDropDownMaxIndex;
		
		aLis[i].onmouseover=__dropDownOnMouseOverHandler__;
		aLis[i].onmouseout=__dropDownOnMouseOutHandler__;
		aLis[i].onmousedown=__dropDownOnMouseDownHandler__;
	}
	
	g_iDropDownMaxIndex++;
}

function __dropDownOnMouseOverHandler__(ev)
{
	this.className='active';
}

function __dropDownOnMouseOutHandler__(ev)
{
	this.className='';
}

function __dropDownOnMouseDownHandler__(ev)
{
	g_aFnOnItemSelect[this.index](this.innerHTML);
	g_aUl[this.index].style.display='none';
}

//性别
var g_aGenderManBtn=[];
var g_aGenderWomanBtn=[];
var g_aInputGender=[];
var g_iGenderMaxIndex=0;

function setGenderSelector(oGenderManElement, oGenderWomanElement, oInputGender)
{
	g_aGenderManBtn.push(oGenderManElement);
	g_aGenderWomanBtn.push(oGenderWomanElement);
	g_aInputGender.push(oInputGender);
	
	oInputGender.value='male';	//female
	oGenderManElement.className='men_active';
	oGenderWomanElement.className='woman_normal';
	
	oGenderManElement.index=g_iGenderMaxIndex;
	oGenderWomanElement.index=g_iGenderMaxIndex;
	
	g_iGenderMaxIndex++;
	
	oGenderManElement.onmousedown=__genderManBtnClickHandler__;
	oGenderWomanElement.onmousedown=__genderWomanBtnClickHandler__;
}

function __genderManBtnClickHandler__(ev)
{
	if(this.className === 'men_normal')
	{
		this.className='men_active';
		g_aGenderWomanBtn[this.index].className='woman_normal';
		g_aInputGender[this.index].value='male';
	}
}

function __genderWomanBtnClickHandler__(ev)
{
	if(this.className === 'woman_normal')
	{
		this.className='woman_active';
		g_aGenderManBtn[this.index].className='men_normal';
		g_aInputGender[this.index].value='female';
	}
}

//兴趣
function setHobby(oUl, oInput)
{
	var aLis=oUl.getElementsByTagName('li');
	var aSelectedValue=[];
	var i=0;
	
	oInput.value=aLis[0].innerHTML;
	
	for(i=0;i<aLis.length;i++)
	{
		aLis[i].onmousedown=function ()
		{
			if(this.className=='active')
			{
				for(i=0;i<aSelectedValue.length;i++)
				{
					if(aSelectedValue[i]==this.innerHTML)
					{
						aSelectedValue.splice(i, 1);
						break;
					}
				}
				
				this.className='';
			}
			else
			{
				aSelectedValue.push(this.innerHTML);
				this.className='active';
			}
			
			oInput.value=aSelectedValue.join(',');
		};
	}
}

window.onload=function ()
{
	var oInputName=document.getElementById('name');
	var oInputContact=document.getElementById('contact');
	var oInputComeFrom=document.getElementById('come_from');
	
	var oUlDropDown=document.getElementById('come_from_drop_down');
	var oBtnComeFromDropDown=document.getElementById('btn_come_from_drop_down');
	
	var oBtnGenderMan=document.getElementById('gender_man');
	var oBtnGenderWoman=document.getElementById('gender_woman');
	var oInputGender=document.getElementById('gender');
	
	var oInputHobby=document.getElementById('hobby');
	var oUlHobbyDropDown=document.getElementById('hobby_drop_down');
	
	setDefaultText(oInputName, '尊姓大名', '#777777', 'black');
	setDefaultText(oInputContact, '联系QQ或MSN', '#777777', 'black');
	setDefaultText(oInputComeFrom, '你来自哪里？', '#777777', 'black');
	
	setDropDown
	(
	 	oUlDropDown,
		function (sText)
		{
			defaultTextSetText(oInputComeFrom, sText);
		}
	);
	
	oBtnComeFromDropDown.onmousedown=function (ev)
	{
		var oEvent=window.event||ev;
		
		oEvent.cancelBubble=true;
		
		if(oUlDropDown.style.display === 'none')
		{
			this.className='select_active';
			oUlDropDown.style.display='block';
		}
		else
		{
			this.className='select_normal';
			oUlDropDown.style.display='none';
		}
	};
	
	document.onmousedown=function ()
	{
		oBtnComeFromDropDown.className='select_normal';
		oUlDropDown.style.display='none';
	};
	
	setGenderSelector(oBtnGenderMan, oBtnGenderWoman, oInputGender);
	
	setHobby(oUlHobbyDropDown, oInputHobby);
}