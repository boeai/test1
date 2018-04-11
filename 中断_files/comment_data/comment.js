var hdCookieName="hduser";
var cXmlHttp;
String.prototype.Trim = function(){ return this.replace(/^\s*|\s*$/g,"");}
function getPageSize() {   
    var xScroll, yScroll;   
    if (window.innerHeight && window.scrollMaxY) {     
        xScroll = window.innerWidth + window.scrollMaxX;   
        yScroll = window.innerHeight + window.scrollMaxY;   
    } else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac   
        xScroll = document.body.scrollWidth;   
        yScroll = document.body.scrollHeight;   
    } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari   
        xScroll = document.body.offsetWidth;   
        yScroll = document.body.offsetHeight;   
    }   
    var windowWidth, windowHeight;   
    if (self.innerHeight) { // all except Explorer   
        if(document.documentElement.clientWidth){   
            windowWidth = document.documentElement.clientWidth;    
        } else {   
            windowWidth = self.innerWidth;   
        }   
        windowHeight = self.innerHeight;   
    } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode   
        windowWidth = document.documentElement.clientWidth;   
        windowHeight = document.documentElement.clientHeight;   
    } else if (document.body) { // other Explorers   
        windowWidth = document.body.clientWidth;   
        windowHeight = document.body.clientHeight;   
    }      
    // for small pages with total height less then height of the viewport   
    if(yScroll < windowHeight){   
        pageHeight = windowHeight;   
    } else {    
        pageHeight = yScroll;   
    }   
    // for small pages with total width less then width of the viewport   
    if(xScroll < windowWidth){      
        pageWidth = xScroll;           
    } else {   
        pageWidth = windowWidth;   
    }   
    arrayPageSize = new Array(pageWidth,pageHeight,windowWidth,windowHeight);   
    return arrayPageSize;   
}  

function getIframeHeight(){
	var json= document.getElementById("json").value;
    var cpageA=document.getElementsByName("pageA");
    for(var i=0;i<cpageA.length;i++){
    	if(cpageA[i].href.indexOf("&json=")==-1){
    		cpageA[i].href=cpageA[i].href+"&json="+encodeURIComponent(json);
    	}
    }
	var width = 0;   
	var height = 0;  
	if(!!(document.all && navigator.userAgent.indexOf('Opera') === -1)){//ie
		height += document.body.scrollHeight;
		height += 10;
		width+=document.body.scrollWidth;
	}else if (navigator.userAgent.indexOf('Opera') != -1){//Opera
		height += document.body.scrollHeight+12;
		width+=document.body.scrollWidth;
	}else {//firefox
		var bHeight = document.body.scrollHeight;
		var dHeight = document.documentElement.scrollHeight;
		height = Math.max(bHeight, dHeight);
		var bWidth = document.body.scrollWidth;
		var dWidth = document.documentElement.scrollWidth;
		width = Math.max(bWidth, dWidth);
	}
	//if (/firefox/i.test(navigator.userAgent)){
	//	height += 30;
	//}
	//if(height<300){
	//   height=300;
	//}
	var hashurl=document.getElementById("domain").value;
	var proxyiframe = document.getElementById("proxyiframe"); 
	//hashurl = window.location.hash.split("#")[1]; 
	var arrayPageSize=getPageSize();
	proxyiframe.src = "http://"+hashurl+"/iframeheight.html?rnd="+Math.random()+"#"+arrayPageSize[0]+"|"+height;
}
function createCXmlHttpRequestByObject() {
  var xmlObject;
  if (window.ActiveXObject) {
      xmlObject = new ActiveXObject("Microsoft.XMLHTTP");
  }
  else if (window.XMLHttpRequest) {
      xmlObject = new XMLHttpRequest();                
  }
  if (!xmlObject) { // 异常，创建对象实例失败
	window.alert("不能创建cXmlHttpRequest对象实例.");
	return false;
  }
  return xmlObject;
}
function showreply(uuid){
	var replydisplay=document.getElementById("reply_"+uuid).style.display;
	if(replydisplay!=null && replydisplay=='block'){
		hiddenReply(uuid);
		return;
	}
	var pc= document.getElementById("pc").value;
	var ps= document.getElementById("pageStyle").value;
	if(ps==null){
	  ps="3";
	}
	var subjectid= document.getElementById("subjectid").value;
	if(pc==null || pc.Trim().length==0 || subjectid==null || subjectid.Trim().length==0
	|| uuid==null || uuid.Trim().length==0){
		alert("必要的参数为空。");
		return;
	}
	cXmlHttp = createCXmlHttpRequestByObject();
	var para = "action=showReply&cid="+uuid+"&pc="+pc+"&ps="+ps+"&id="+encodeURIComponent(subjectid);
	var url = "/comment.do";
	cXmlHttp.open("POST", url, true);
	cXmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	cXmlHttp.onreadystatechange = function(){showreplyCallback(uuid);}
	cXmlHttp.send(para);	
}
function showreplyCallback(uuid){
	if(cXmlHttp.readyState == 4) {
		if (cXmlHttp.status == 200) {
			 if(cXmlHttp.responseText!=null){
				var replydiv=document.getElementById("reply_"+uuid);
				replydiv.style.display="block";
    			replydiv.innerHTML=cXmlHttp.responseText;
    			getIframeHeight();
			 }
		}
	}
}
function loginAlert(){
	var nextUrl=document.getElementById("purl").value;
	var domain=document.getElementById("domain").value;
	var loginUrl="http://wiki.hudong.com/user/login/userLogin.jsp";
	var registerUrl="http://wiki.hudong.com/user/register/userRegister.jsp";
	if(domain.indexOf("baike.com")>-1){
		loginUrl="http://passport.hudong.com/login.do?site_ource=xiaobaike_page&service="+encodeURIComponent(nextUrl);
		registerUrl="http://passport.hudong.com/user/xbkUserRegister.jsp?autourl="+encodeURIComponent(nextUrl);
	}
	var loginHtml="<div style='margin-top:30px;margin-left:10px;margin-right:10px'>您还没有登录，请先<a onmousedown=\"document.domain='hudong.com';var date=new Date();date.setTime(date.getTime()+24*3600*1000);document.cookie='nextURL="+encodeURIComponent(nextUrl)+";expire='+date.toGMTString()+';path=/;domain=.hudong.com;'\" target='_parent' href='"+loginUrl+"'>登录</a>或<a href='"+registerUrl+"' target='_parent'>注册</a></div>";
	CreateDivAlert(220,100,loginHtml);
}
function doCommentSubmit(){
	var returnValue= getHdCookie(hdCookieName);
	if(returnValue==null){
	    loginAlert();
		return;
	}
	var pc= document.getElementById("pc").value;
	var subjectid= document.getElementById("subjectid").value;
	var pid="0";
	if(document.getElementById("pid")!=null){
		pid= document.getElementById("pid").value;
	}
	var commentcontent= document.getElementById("commentcontent").value;
	if(commentcontent==null || commentcontent.Trim().length==0){
		alert("不能提交空内容。");
		return;
	}
	if(pc==null || pc.Trim().length==0 || subjectid==null || subjectid.Trim().length==0){
		alert("必要的参数为空。");
		return;
	}
	var ps= document.getElementById("pageStyle").value;
	if(ps==null){
	   ps="3";
	}
	if(commentcontent.Trim().length>140){
		alert("提交的内容太长了，最长140个汉字，请删除一部分后再提交。");
		return;
	}
	var commentsubmit = document.getElementById("commentsubmit");
	commentsubmit.disabled=true;
	var json= document.getElementById("json").value;
	cXmlHttp = createCXmlHttpRequestByObject();
	var para = "action=add&pid="+pid+"&pc="+pc+"&ps="+ps+"&id="+encodeURIComponent(subjectid)+"&content="+encodeURIComponent(commentcontent)+"&json="+encodeURIComponent(json);
	var url = "/comment.do";
	cXmlHttp.open("POST", url, true);
	cXmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	cXmlHttp.onreadystatechange = commentCallback;
	cXmlHttp.send(para);	
}
function commentCallback() {
	if (cXmlHttp.readyState == 4) {
		if (cXmlHttp.status == 200) {
			 if(cXmlHttp.responseXML!=null){
			 	var state=cXmlHttp.responseXML.getElementsByTagName("state")[0].firstChild.data;
			 	if(state==1){
			 		//alert("发表成功！");
			 		//location.href=document.location.href.replace(/p=\d+/,"p=1");
			 		var lastcomment=cXmlHttp.responseXML.getElementsByTagName("lastcomment")[0].firstChild.data;
					var snsdiv=document.getElementById("sns-footprint-profile");
					var x=snsdiv.firstChild;
					if(x!=null){
						while (x!=null && x.nodeType!=1){
							x=x.nextSibling;
						}
					}
					if(x!=null){
						x.className="footlist-new";
					}
					snsdiv.innerHTML=lastcomment+snsdiv.innerHTML;
					var commenthead=document.getElementById("commenthead");
					if(commenthead!=null){
						var commentnumStr=commenthead.innerHTML;
						var commentnum=parseInt(commentnumStr.substring(commentnumStr.indexOf("(")+1,commentnumStr.indexOf("个")))+1;
						commenthead.innerHTML=commentnumStr.substring(0,commentnumStr.indexOf("(")+1)+commentnum+commentnumStr.substring(commentnumStr.indexOf("个"));
					}
					document.getElementById("commentcontent").value='';
					document.getElementById("chLeft").innerHTML="还可以输入140个字";
					getIframeHeight();
			 	}else if(state==-1){
			 		//alert("你还没登录！");
			 		loginAlert();
			 	}else if(state==-2){
			 		alert("必要参数为空！");
				}else if(state==-3){
			 		alert("评论太长了,最多140个字符！");			 		
			 	}else if(state==-4){
			 		alert("此讨论区已经关闭！");
				}else if(state==-5){
			 		alert("讨论内容含有违禁词，请先删除再提交！");	
				}else if(state==-6){
			 		alert("你的这个评论已经提交过了！");		
			 	}else if(state==-7){
			 		alert("评论产品码没有通过审核！");			 				 		
			 	}else{
			 	    alert("发表失败！");
			 	}
			 }
		}
	}
	var commentsubmit = document.getElementById("commentsubmit");
	commentsubmit.disabled=false;
}
function replycomment(pid){
	var returnValue= getHdCookie (hdCookieName);
	if(returnValue==null){
		loginAlert();
		return;
	}
	var pc= document.getElementById("pc").value;
	var subjectid= document.getElementById("subjectid").value;
	if(pid==null){
		pid= "0";
	}
	var commentcontent= document.getElementById("text_"+pid).value;
	if(commentcontent==null || commentcontent.Trim().length==0){
		alert("不能提交空内容。");
		return;
	}
	if(pc==null || pc.Trim().length==0 || subjectid==null || subjectid.Trim().length==0){
		alert("必要的参数为空。");
		return;
	}
	var ps= document.getElementById("pageStyle").value;
	if(ps==null){
	   ps="3";
	}
	if(commentcontent.Trim().length>140){
		alert("提交的点评内容太长了，最长140个字符，请删除一部分后再提交。");
		return;
	}
	var replybutton = document.getElementById("replybutton_"+pid);
	replybutton.disabled=true;
	var json= document.getElementById("json").value;
	cXmlHttp = createCXmlHttpRequestByObject();
	var para = "action=add&pid="+pid+"&pc="+pc+"&ps="+ps+"&id="+encodeURIComponent(subjectid)+"&content="+encodeURIComponent(commentcontent)+"&json="+encodeURIComponent(json);
	var url = "/comment.do";
	cXmlHttp.open("POST", url, true);
	cXmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	cXmlHttp.onreadystatechange = function(){replycommentCallback(pid);}
	cXmlHttp.send(para);
	
}
function replycommentCallback(pid) {
	if (cXmlHttp.readyState == 4) {
		if (cXmlHttp.status == 200) {
			 if(cXmlHttp.responseXML!=null){
			 	var state=cXmlHttp.responseXML.getElementsByTagName("state")[0].firstChild.data;
			 	if(state==1){
			 		var uuid=cXmlHttp.responseXML.getElementsByTagName("pid")[0].firstChild.data;
					var replynumA=document.getElementById("replynum_"+uuid);
					var replynumStr=replynumA.innerHTML;
					var replynum=parseInt(replynumStr.substring(3,replynumStr.length-1))+1;
					replynumA.innerHTML="回复("+replynum+")";
					var lastcomment=cXmlHttp.responseXML.getElementsByTagName("lastcommentreply")[0].firstChild.data;
					var uldiv=document.getElementById("ul_"+uuid);
					uldiv.innerHTML=lastcomment+uldiv.innerHTML;
					document.getElementById("text_"+uuid).value='';
					document.getElementById("chLeft_"+pid).innerHTML="还可以输入140个字";
					getIframeHeight();
			 	}else if(state==-1){
			 		//alert("你还没登录！");
			 		loginAlert();
			 	}else if(state==-2){
			 		alert("必要参数为空！");
			 	}else if(state==-3){
			 		alert("评论太长了,最多140个字符！");	
			 	}else if(state==-4){
			 		alert("此讨论区已经关闭！");	
				}else if(state==-5){
			 		alert("回复内容含有违禁词，请先删除再提交！");		
				}else if(state==-6){
			 		alert("你的这个回复已经提交过了！");	
			 	}else if(state==-7){
			 		alert("评论产品码没有通过审核！");				 				 		
			 	}else{
			 	    alert("发表失败！");
			 	}
			 }
		}
	}
	var replybutton = document.getElementById("replybutton_"+pid);
	replybutton.disabled=false;
}
function hiddenReply(uuid){
	document.getElementById("reply_"+uuid).style.display="none";
	getIframeHeight();
}
 	//读cookie判断用户是否登陆
function getHdCookie (name){
 	 try{
 	 	var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
     	if(arr != null) 
     		return unescape(arr[2]);
     }catch(e){
     	return null;
     } 
     return null;
}
function getCookie(Name) {
    var search = Name + "=";
    if(document.cookie.length > 0) {
        offset = document.cookie.indexOf(search); 
        if(offset != -1) {
            offset += search.length;
            end = document.cookie.indexOf(";", offset); 
            if(end == -1) {end = document.cookie.length;} 
            return unescape(document.cookie.substring(offset, end));
        }else{
        	return null;
        }
    }
    return null;
}
function DivAlert(messageDiv){
	this.messageDIV=messageDiv;
	//创建提示框底层 
	this.bottomDIV = document.createElement("div");
	//配置样式
	this.bottomDIV.style.opacity="0.50";
	this.bottomDIV.style.filter="Alpha(opacity=50);";
	this.bottomDIV.style.backgroundColor="#FFFFFF";
	this.bottomDIV.style.height=document.body.scrollHeight+"px";
	this.bottomDIV.style.width="100%";
	this.bottomDIV.style.marginTop="0px";
	this.bottomDIV.style.marginLeft="0px";
	this.bottomDIV.style.position="absolute";
	this.bottomDIV.style.top="0px";
	this.bottomDIV.style.left="0px";
	this.bottomDIV.style.zIndex=100;
	//显示提示框
	var event=GetEvent();
	this.show = function(){
		//显示提示框底层 
		document.body.appendChild(this.bottomDIV);
		//显示messageDIV
		document.body.appendChild(this.messageDIV);
		//把messageDIV定位到body中间
		this.messageDIV.style.position="absolute";
		x=mouseX(event)-this.messageDIV.offsetWidth;
		if(x<0){
			x=0;
		}
		y=mouseY(event)-this.messageDIV.offsetHeight;
		if(y<0){
			y=0;
		}
		this.messageDIV.style.top=y+"px";
		this.messageDIV.style.left=x+"px";
		this.messageDIV.style.zIndex=101;
	}
	//移除提示框
	this.remove = function(){
		document.body.removeChild(this.bottomDIV);
		document.body.removeChild(this.messageDIV);
	}
}
function CreateDivAlert(width,height,htmlContent){
	//创建提示框内容部分
	var d = document.createElement("div");
	d.style.width=width+"px";
	d.style.height=height+"px";
	d.style.borderColor="#666666";
	d.style.borderStyle ="solid";
	d.style.borderWidth ="5px";
	d.style.backgroundColor ="white";
	var h2Node = document.createElement("h2");
	h2Node.style.color="#FFFFFF";
	h2Node.style.background="none repeat scroll 0 0 #009DF0";
	h2Node.style.fontSize="14px";
	h2Node.style.paddingTop ="3px";
	h2Node.style.paddingBottom ="3px";
	h2Node.innerHTML="&nbsp;提示您:";
	d.appendChild(h2Node);
	var closeNode = document.createElement("img");
	closeNode.style.background="url('http://www.huimg.cn/lib/dialog/close.jpg') repeat scroll 0 0 transparent";
	closeNode.style.cursor="pointer";
	closeNode.style.styleFloat="right";
	closeNode.style.position="absolute";
	closeNode.style.right="5px";
	closeNode.style.top="3px";
	closeNode.style.height="16px";
	closeNode.style.width="16px";
	closeNode.onclick=function(){dc.remove();}
	d.appendChild(closeNode);
	//向提示框内容部分画需要显示的信息
	insertHtml("beforeEnd",d,htmlContent);
	//实例化提示框
	var dc = new DivAlert(d);
	//显示提示框
	dc.show();
}
function mouseX(event) {
	event = event || window.event;
	if (event.pageX) return event.pageX;
	else if (event.clientX)
    	return event.clientX + (document.documentElement.scrollLeft ?document.documentElement.scrollLeft:document.body.scrollLeft);
	else return null;
}
function mouseY(event) {
	event = event || window.event;
	if (event.pageY) return event.pageY;
	else if (event.clientY) 
		return event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop :document.body.scrollTop);
	else return null;
}
function GetEvent(){ 
   if(document.all) // IE 
   { 
       return window.event; 
   } 
   func = GetEvent.caller; // 返回调用本函数的函数 
   while(func != null){ 
       // Firefox 中一个隐含的对象 arguments，第一个参数为 event 对象  
       var arg0 = func.arguments[0]; 
       //alert('参数长度：' + func.arguments.length); 
       if(arg0) 
       { 
           if((arg0.constructor == Event || arg0.constructor == MouseEvent) 
               ||(typeof(arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) 
           { 
               return arg0; 
           } 
       } 
       func = func.caller; 
   } 
   return null; 
} 
function insertHtml(where, el, html){
    where = where.toLowerCase();
    if(el.insertAdjacentHTML){
     switch(where){
      case "beforebegin":
      el.insertAdjacentHTML('BeforeBegin', html);
      return el.previousSibling;
      case "afterbegin":
      el.insertAdjacentHTML('AfterBegin', html);
      return el.firstChild;
      case "beforeend":
      el.insertAdjacentHTML('BeforeEnd', html);
      return el.lastChild;
      case "afterend":
      el.insertAdjacentHTML('AfterEnd', html);
      return el.nextSibling;
      }
      throw 'Illegal insertion point -> "' + where + '"';
    }
    var range = el.ownerDocument.createRange();
    var frag;
    switch(where){
     case "beforebegin":
     range.setStartBefore(el);
     frag = range.createContextualFragment(html);
     el.parentNode.insertBefore(frag, el);
     return el.previousSibling;
     case "afterbegin":
     if(el.firstChild){
      range.setStartBefore(el.firstChild);
      frag = range.createContextualFragment(html);
      el.insertBefore(frag, el.firstChild);
      return el.firstChild;
      }else{
       el.innerHTML = html;
       return el.firstChild;
      }
      case "beforeend":
      if(el.lastChild){
       range.setStartAfter(el.lastChild);
       frag = range.createContextualFragment(html);
       el.appendChild(frag);
       return el.lastChild;
       }else{
        el.innerHTML = html;
        return el.lastChild;
        }
      case "afterend":
      range.setStartAfter(el);
      frag = range.createContextualFragment(html);
      el.parentNode.insertBefore(frag, el.nextSibling);
      return el.nextSibling;
     }
     throw 'Illegal insertion point -> "' + where + '"';
    }
function checkLogin(which){
	var returnValue= getHdCookie (hdCookieName);
	if(returnValue==null){
		which.blur();
		loginAlert();
		return false;
	}
	return true;
}    
function checkLength(which,chLeft) { 
	var maxChars = 140; 
	if (which.value.length > maxChars){
		which.value = which.value.substring(0,maxChars); 
	}
	var curr = maxChars - which.value.length; 
	document.getElementById(chLeft).innerHTML = curr.toString(); 
} 
function checkInputLength(which,chLeft) {
	var maxChars = 140; 
	var curr = maxChars - which.value.length;
	if(curr>=0){
		document.getElementById(chLeft).innerHTML = "还可以输入"+curr.toString()+"个字";
		document.getElementById(chLeft).style.color="black";
	}else{
		document.getElementById(chLeft).innerHTML ="已超出"+Math.abs(curr)+"字";
		document.getElementById(chLeft).style.color="red";
	}
}