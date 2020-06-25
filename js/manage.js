var rowWithMouse = null;
var o_exist=new Array();

function isElemBox(elem) {
  // true if element is a relevant checkbox
  return (elem.id.indexOf("box_") == 0);
}

function rowUpdateBg(row, box) {
	
	
	row.className=row.className.replace("whitebg","");
	row.className=row.className.replace("graybg","");
	
  if (box && box.checked) {
	//row.style.backgroundColor = "#cccccc";
	
	row.className=row.className+"graybg";
  } else {
  	
  	row.className=row.className+"whitebg";
		//row.style.backgroundColor = (row == rowWithMouse) ? '#FFFFD9' : '#FFFFFF';
  }
}

function rowSelect(row, box) {
  box.checked = true;
  if(row) { 
	rowUpdateBg(row, box); 
  }
}

function rowUnselect(row, box) {
  box.checked = false;
  if(row) { 
	rowUpdateBg(row, box);
  }
}


function getRowFromBox(box) {
  var row = null;
  if (box.parentNode && box.parentNode.parentNode) {
	row = box.parentNode.parentNode;
  } else if (box.parentElement && box.parentElement.parentElement) {
	row = box.parentElement.parentElement;
  }
  if (row != null && row.id.indexOf('tr_') == 0) {
	return row;
  }
  return document.getElementById('tr_' + box.id.substr(4));
}

function rowToggle(myId) {
  var row = document.getElementById('tr_' + myId);
  var box = document.getElementById('box_' + myId);
  var f = box.form;
  
  
  if (box.checked == true) {
	rowSelect(row, box);
	f.toggleAll.checked = isAllSelected(f);
  } else {
	rowUnselect(row, box);
	f.toggleAll.checked = false;
  }
  
  if(typeof(checkRowToggle)=="function")
		{
			checkRowToggle(myId);
		}
}

function isAllSelected(f) {
  for (var i=0; i < f.elements.length; i++) {
	var box = f.elements[i];
	if (isElemBox(box) && box.checked == false) {
	  return false;
	}
  }
  return true;
}


function rowToggleAll(tabox) {
	
  var f = tabox.form;
  for (var i=0; i < f.elements.length; i++) {
		var box = f.elements[i];
		if (isElemBox(box) && box.checked != tabox.checked) {
		  var row = getRowFromBox(box);
		  if (tabox.checked) {
			rowSelect(row, box);
		  } else {
			rowUnselect(row, box);
		  }
		  
		  if(typeof(checkRowToggle)=="function")
			{
				checkRowToggle(box.id.replace("box_",""));
			}
		}
		
		
  }
  
  
}

var rolloverWarning = null;
function beforeRolloverSubmit(f, msg) {
	top.o_parentFrame=window;
  var numElemBoxes = 0;
  for (var i=0; i < f.elements.length; i++) {
	var box = f.elements[i];
	if (isElemBox(box)) {
	  numElemBoxes++;
	  if (box.checked == true) {
		if (rolloverWarning) {
		  var r = confirm(rolloverWarning);
		  rolloverWarning = null;
		  return r;
		}
		return true;
	  }
	}
  }
  if (numElemBoxes == 1) {
	
	  f.toggleAll.checked = true;
	rowToggleAll(f.toggleAll);
	if (rolloverWarning) {
	  var r = confirm(rolloverWarning);
	  rolloverWarning = null;
	  return r;
	}        
	return true;
  }
  alert(msg);
  rolloverWarning = null;
  return false;
}

function AddNew(s_url)
{
	$('frmitem').action=s_url;
	$('frmitem').target="_self";
	$('frmitem').submit();
}

function ExistVerify(s_name,s_tip)
{
	var o_obj=new Object();
	o_obj.id=s_name;
	o_obj.tip=s_tip; 
	o_exist.push(o_obj); 
}

function beforeItemSubmit()
{
	try
	{
  	top.o_parentFrame=window;
  }
  catch(e)
  {
  	
  }
  
  var b_tip=false;
	for(i_cyc=0;i_cyc<o_exist.length;i_cyc++)
	{
		$('spn_'+o_exist[i_cyc].id).innerHTML="";
		if(($(o_exist[i_cyc].id).value=="")&&($(o_exist[i_cyc].id).parentNode.parentNode.style.display==""))
		{
			
			b_tip=true;
			$('spn_'+o_exist[i_cyc].id).innerHTML="<br />"+o_exist[i_cyc].tip;
			
		}
		
	}
	
	//其他需要处理的内容；
	
	if(typeof(checkOther)=="function")
	{
		b_tip=checkOther()||b_tip;
	}
	
	
	
		
	if(b_tip)
	{
		document.documentElement.scrollTop=0;
		return false;
	}
	else
	{
		b_save=true;
		return true;
	}	
}



function UploadClass(s_id,i_sel)
{
	var spnobj=parent.parent.frames[1].document.getElementById("spn"+s_id);
	if(spnobj!=null)
	{
		spnobj.innerHTML="";
		var i_layer=parseInt(spnobj.className.substring(spnobj.className.length-1));
		top.o_parentFrame=parent.frames[1];
		
		//RunScript(top.frames["fredo"],'/admin/dynamic.aspx?sel=1&layer='+i_layer+'&id='+s_id+'&rnd='+Math.random());
		
		window.open('/admin/dynamic.aspx?body=1&sel=1&layer='+i_layer+'&id='+s_id+'&rnd='+Math.random(), 'fremenu'+i_sel);
	}
}


function ShowFileUpload(s_obj,s_chk,s_width,s_frame)
{
	
	popup_open("/admin/common/uploadfile.html?frame="+s_frame+"&obj="+s_obj+"&chkimg="+s_chk+"&width="+s_width,"上载文件",410,70);
}


//1、获取编辑器中HTML内容
function getEditorHTMLContents(EditorName)
{ 
    var oEditor = FCKeditorAPI.GetInstance(EditorName); 
    return(oEditor.GetXHTML(true)); 
}

//2、获取编辑器中文字内容（在博客发布时获取无html代码摘要使用）
function getEditorTextContents(EditorName)
{ 
    var oEditor = FCKeditorAPI.GetInstance(EditorName); 
    return(oEditor.EditorDocument.body.innerText); 
}
//3、设置编辑器中内容
function SetEditorContents(EditorName, ContentStr)
{ 
	try
	{
    var oEditor = FCKeditorAPI.GetInstance(EditorName) ; 
    if(oEditor.EditMode == FCK_EDITMODE_WYSIWYG)
    {
    	oEditor.SwitchEditMode();	
    }
    
    oEditor.SetHTML(ContentStr) ; 
  }
  catch(E)
  {
  	$(EditorName).value=ContentStr;
  }
}


function DelSelectItem(selobj)
{
	for(i=selobj.options.length-1;i>=0;i--)
  {
  	if(selobj.options[i].selected)
  	{
  		selobj.options[i] =null;		
  	}
  }
	
	if(selobj.options.length>0)
		selobj.options[selobj.options.length-1].selected=true;
}

function SetSelectValue(s_id)
{
  for(i=0;i<$(s_id).options.length;i++)
  {
  	$(s_id).options[i].selected =true;
  }
}


function MoveItemSelect(selobj,i_move)
{
	var o_opt;
	if(i_move==1)
	{
		for(i=selobj.options.length-1;i>=0;i--)
		{
			if((i+1<selobj.options.length)&&(selobj.options[i].selected))
			{
				o_opt=selobj.options[i+1];
				selobj.options[i+1]=new Option(selobj.options[i].text,selobj.options[i].value);
				selobj.options[i+1].selected=true;
				selobj.options[i]=o_opt;
			}
		}
	}
	else
	{
		for(i=0;i<selobj.options.length;i++)
		{
			if((i-1>=0)&&(selobj.options[i].selected))
			{
				o_opt=selobj.options[i-1];
				selobj.options[i-1]=new Option(selobj.options[i].text,selobj.options[i].value);
				selobj.options[i-1].selected=true;
				selobj.options[i]=o_opt;
			}
		}
	}
}

//后台搜索名称
function SearchName()
{
		$('frmitem').target="";
		$('frmitem').action="";
		$('formdo').value="";
		$('frmitem').onsubmit=null;
		
		
		if(!isNaN($('frmitem').Name.length))
		{
			if($('frmitem').Key[1].value!="")
			{
				$('frmitem').Key[0].value=$('frmitem').Key[1].value;
			}
			
			$('frmitem').Name[1].name="";
			$('frmitem').Key[1].name="";
		}
		
		$('frmitem').submit();
}

//设置关键词
function SetSearchKey(s_key)
{
	if($('Key')==null)
		return ;
		
	if(s_key!="")
	{
		var s_kid=$('Key').id;
		if(s_kid!="")
		{
			if(!isNaN($('frmitem').Name.length))
			{
				$('frmitem').Key[0].value=s_key;
				$('frmitem').Key[1].value=s_key;
			}	
			else
			{
				$('frmitem').Key.value=s_key;
			}
		}	
	}
	
}

// 显示不同行的背景颜色
function ShowSplitBar()
{
	if(typeof(NoSplitBar)=="function")
	{
		return ; //不执行
	}
	
	//debugger;
	
	if($('tablelist')!=null)
	{
		for(i=1;i< $('tablelist').rows.length;i++)
		{
			if( i % 2 ==0)
			{
				$('tablelist').rows[i].className="splitbar";
			}
		}
	}
}

function Resize()
{
	
	if(typeof(i_tabs)=="undefined")
		return ;
	
	
	var i_hei=ClientHeight()-Wa($('divsbar'),"offsetTop")-4;
	
	for(i=0;i<i_tabs;i++)
	{
		$('fresvc'+i).style.height=i_hei+"px";
	}
	
	
}

//检查路径
function CheckUrl(s_name)
{
	var reg=/[^a-zA-Z0-9\/\-_@]/ig;
	var b_ret=true;
	
	if($(s_name).value!="")
	{
		$('spn_'+s_name).innerHTML="";
		
		if(reg.test($(s_name).value))
		{
			b_ret=false;
			$('spn_'+s_name).innerHTML="<br />网页地址有特殊字符。";
		}
	}	
	
	return b_ret;
}


function ShowSelectTip(imgobj)
{
	var divobj=imgobj.previousSibling.previousSibling;
	
	ShowTip(imgobj,divobj.childNodes[1].innerHTML+"("+divobj.childNodes[0].innerHTML+")",divobj.childNodes[2].innerHTML);
			
}


function copyToClipboard(txt) { 
 if(window.clipboardData)  
  { 
    window.clipboardData.clearData(); 
    window.clipboardData.setData("Text", txt); 
  }else if(navigator.userAgent.indexOf("Opera") != -1) { 
    window.location = txt; 
  }else if (window.netscape) { 
    try  
    { 
      netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect"); 
    }catch (e) { 
      alert("您的firefox安全限制限制您进行剪贴板操作，请在地址栏中输入“about:config”将“signed.applets.codebase_principal_support”设置为“true”之后重试"); 
      return false; 
    } 
    var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard); 
    if (!clip) 
      return; 
    var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable); 
    if (!trans) 
      return; 
    trans.addDataFlavor('text/unicode'); 
    var str = new Object(); 
    var len = new Object(); 
    var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString); 
    var copytext = txt; 
    str.data = copytext; 
    trans.setTransferData("text/unicode",str,copytext.length*2); 
    var clipid = Components.interfaces.nsIClipboard; 
    if (!clip) 
      return false; 
    clip.setData(trans,null,clipid.kGlobalClipboard); 
  } 
  
  
  try
  {
  		var WshShell = new ActiveXObject("Wscript.Shell");
	   try{
	   	WshShell.SendKeys("{F12}");
	   } catch(e){
	   	alert('发送消息出错')	 			
	   }
	   WshShell.Quit; 	 
  }
  catch(E)
  {
  	alert(E.description)	 			
  }
  
} 

function IsHaveBackup()
{
	 if(typeof(LoadBody)=="function")
		{
			LoadBody();//打开页面
		}
		
	var s_xml= GetCookie("ContentCache");
	 
	 if(s_xml==null)
	 {
	 	  return ;
   }
   
   
   var re = new RegExp("<Url>((.|\n)*?)</Url>");
	 if(re.exec(s_xml)!=null)
	 {
		 if(RegExp.$1==location.pathname)
		 {
		 		if($('butrestore')!=null)
		 		{
		 	 		$('butrestore').style.display="";
		 	 	}
		 }
	 }
	 
	
   
}



function GetInputXML()
{
	 
	 
	 var formobj=$('frmitem');
	 var s_ret="<Url>"+location.pathname+"</Url>";
	 
	 for(i=0;i<formobj.elements.length;i++)
	 {
	 		var obj=formobj.elements[i];
	 		
	 			
	 		switch(obj.type)
	 		{
	 			case "text":
	 			case "textarea":
	 			{
	 				s_ret+="<"+obj.id+">"+obj.value+"</"+obj.id+">";
	 				break;
	 			}
	 			case "checkbox":
	 			{
	 				var s_on="0";
	 				if(obj.checked)
	 				{
	 					s_on="1";
	 				}
	 				
	 				s_ret+="<"+obj.id+">"+s_on+"</"+obj.id+">";
	 				break;
	 			}
	 			case "button":
	 			{
	 				break;
	 			}
	 			case "select-one":
	 			{
	 				var s_value="";
	 				
	 				
	 				for(j=0;j<obj.options.length;j++)
	 				{
	 					if(obj.options[j].selected)
	 					{
	 						s_value+=","+obj.options[j].value;
	 					}
	 				}
	 				
	 				if(s_value.length>0)
	 				{
	 					s_value=s_value.substr(1);
	 				}
	 				
	 				s_ret+="<"+obj.id+">"+s_value+"</"+obj.id+">";
	 				break;
	 			}
	 			
	 		}
	 }
	 
	 //保存到本地
	 SetCookie("ContentCache",s_ret);
	 
}


var b_save=false;

function ShowBackupTip()
{
	GetInputXML(); //备份数据
	
	if(!b_save)
	{
		/*
		if(window.confirm("内容已经修改是否备份？"))
		{
			GetInputXML(); //备份数据
		}	
		*/
	}
}

//读取配置 更新文件
function SetInputXML()
{
	 var formobj=$("frmitem");
	 
	 var s_xml= GetCookie("ContentCache");
	 
	 if(s_xml==null)
	 {
	 	  return ;
   }
   
   
	 
	 var s_value="";
	 
	 for(i=0;i<formobj.elements.length;i++)
	 {
	 		var obj=formobj.elements[i];
	 		
	 		s_value="";
	 		var re = new RegExp("<"+obj.id+">((.|\n)*?)</"+obj.id+">");
			if(re.exec(s_xml)!=null)
			{
				s_value= RegExp.$1;
			}
			else
			{
				continue;
			}	
			
	 		switch(obj.tagName)
	 		{
	 			case "INPUT":
	 			{
	 				obj.value=s_value;
	 				if(s_value=="on")
	 				{
	 					obj.checked=true;
	 				}
	 				break;
	 			}
				case "TEXTAREA":	 			
				{
					obj.value=s_value;
					break;
				}
	 			case "SELECT":
	 			{
	 				if(s_value.trim()=="")
	 					continue;
	 				
	 				var s_con=s_value.split(',');
	 				var b_add=0;
	 				
	 				if(obj.options.length==0)
	 					b_add=1;
	 				
	 				
	 				for(j=0;j<s_con.length;j++)
	 				{
	 					if(b_add==0)
	 					{ 
	 						//在已有数据上单选或多选
		 					for(k=0;k<obj.options.length;k++)
			 				{
			 					if(obj.options[k].value==s_con[j])
			 					{
			 						obj.options[k].selected=true;
			 						break;
			 					}
			 				}
			 			}
			 			
	 				}
	 				break;
	 			}
	 		}
	 }
	 
	 document.documentElement.scrollTop=0;
}