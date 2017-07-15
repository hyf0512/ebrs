var qrtime=null;
function GetQueryString(name,url){
		     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)",'i');
			 if(typeof(url) != "string"){
				url = (window.location.search.substr(1)+"");
			 }
		     var r = url.match(reg);
		     if(r!=null){
				 var ret = "";
				 var i = 0;
				 while(i <= r.length-3){
					 if(ret != ""){
						ret += ",";
					 }
					 ret += decodeURI(r[i+2]);
					 i += 3;
				 }
				 return ret;
			 }else{
				 return null;
			 }
		}
function GetQueryString2(name,url){
		    var hash;
			 if(typeof(url) != "string"){
				url = (window.location.search.substr(1)+"");
			 }
			var hashes = url.slice(url.indexOf('?') + 1).split('&');
			var ret = [];
			for(var i = 0; i < hashes.length; i++)
			{
				hash = hashes[i].split('=');
				if(hash[0] == name){
					ret.push(decodeURI(hash[1]));
				}
			}
			return ret;
		}

function gogetlib_account(){
	$("#lib_list").css("display","none");
	$("#login-mask").css("display","block");
	$("#j_normalLogin").css("display","none");
	$(".other-login").css("display","none");
	$("#lib_ident_div").css("display","block");
	$("#logintitle").text("个人中心");
	$.ajax({
				type:"post",
				url:url+"/auth/GetIdent",
				async:false,
				data:'',
				dataType:'jsonp',
				success:function(data){
					$("#lib_ident li").remove();
					if(data.code=="0"){
					$("#getli_useraccount").val($("#nav-user-id").text());
					$("#getli_username").val($("#nav-user-name").text());
					var identlist=data.identList;
					var identresult="";
					if(identlist==null){
						identresult=identresult+'<li style="border: none; margin-bottom: 10px; width: 340px;">\
											<em class="iconfont" style="width: 84px;">\
												<p class="icon-user"></p>\
												<p style="display: inline;">身份：</p>\
											</em>\
											<input type="text" readonly="true" value="\" style="width: 256px;" id="getli_libident" class="lib_input"/>\
										</li>';
					}
					else if(identlist.length<=1){
						identresult=identresult+'<li style="border: none; margin-bottom: 10px; width: 340px;">\
											<em class="iconfont" style="width: 84px;">\
												<p class="icon-user"></p>\
												<p style="display: inline;">身份：</p>\
											</em>\
											<input type="text" readonly="true" value="';
											if(identlist.length==0){
												identresult=identresult+'"';
											}
											if(identlist.length==1){
												identresult=identresult+identlist[0].libName+" "+identlist[0].userIdent+" ";
												if(identlist[0].status=="3"){
													identresult=identresult+"绑定成功";
												}
												else if(identlist[0].status=="4"){
													identresult=identresult+"绑定失败";
												}
												else if(identlist[0].status=="0"){
													identresult=identresult+"处于申请状态";
												}
												else if(identlist[0].status=="1"){
													identresult=identresult+"申请通过";
												}
												else if(identlist[0].status=="2"){
													identresult=identresult+"申请拒绝";
												}
											}
											identresult=identresult+'" style="width: 256px;" id="getli_libident" class="lib_input"/>\
										</li>';
					}
					else{
						identresult=identresult+'<li style="border: none; margin-bottom: 0px; width: 340px;">\
											<em class="iconfont" style="width: 84px;">\
												<p class="icon-user"></p>\
												<p style="display: inline;">身份：</p>\
											</em>\
											<input type="text" readonly="true" value="';
												identresult=identresult+identlist[0].libName+" "+identlist[0].userIdent+" ";
												if(identlist[0].status=="3"){
													identresult=identresult+"绑定成功";
												}
												else if(identlist[0].status=="4"){
													identresult=identresult+"绑定失败";
												}
												else if(identlist[0].status=="0"){
													identresult=identresult+"处于申请状态";
												}
												else if(identlist[0].status=="1"){
													identresult=identresult+"申请通过";
												}
												else if(identlist[0].status=="2"){
													identresult=identresult+"申请拒绝";
												}
											identresult=identresult+'" style="width: 256px;" id="getli_libident" class="lib_input"/>\
										</li>';
						for(var i=1;i<identlist.length;i++){
							identresult=identresult+'<li style="border: none; margin-bottom: 10px; width: 340px;">\
											<input type="text" readonly="true" value="';
												identresult=identresult+identlist[0].libName+" "+identlist[0].userIdent+" ";
												if(identlist[0].status=="3"){
													identresult=identresult+"绑定成功";
												}
												else if(identlist[0].status=="4"){
													identresult=identresult+"绑定失败";
												}
												else if(identlist[0].status=="0"){
													identresult=identresult+"处于申请状态";
												}
												else if(identlist[0].status=="1"){
													identresult=identresult+"申请通过";
												}
												else if(identlist[0].status=="2"){
													identresult=identresult+"申请拒绝";
												}
											identresult=identresult+'" style="width: 256px;" id="getli_libident" class="lib_input"/>\
										</li>';
						}
					}
					$(identresult).appendTo("#lib_ident");
					}
					
				}
			});
			
}
function gotoliblist(){
	$("#lib_list input").val("");
	$("#lib_ident_div").css("display","none");
	$("#logintitle").text("身份绑定");
	$("#lib_list").css("display","block");
	$("#libselect").children("option").remove();
	var liblist="";
			$.ajax({
				type:"post",
				url:url+"/auth/GetLibList",
				async:false,
				data:"libName=",
				dataType:"json",
				success:function(data){
					var lib_list=data.result;
					if(data.code=="0"){
						for(var i=0;i<lib_list.length;i++){
							liblist=liblist+'<option value="'+lib_list[i].libraryId+'">'+lib_list[i].libName+'</option>';
						}
					}
					$(liblist).appendTo("#libselect");
				}
			});
}
function AppIdent(){
	var library=$("#libselect").val();
	var account=$("#lib_username").val();
	var password=$("#lib_userpassword").val();
	if(library==""){
		alert("请选择图书馆");
	}
	else if(account==""){
		alert("请输入图书馆内账号");
	}
	else if(password==""){
		alert("请输入图书馆内密码");
	}
	else{
		$.ajax({
			type:"post",
			url:url+"/auth/AppIdent",
			async:false,
			data:"library="+library+"&libType=1&account="+account+"&password="+password,
			dataType:"jsonp",
			success:function(data){
				if(data.code=="0"){
					alert("绑定成功");
					gogetlib_account();
				}
				else if(data.message!=null&&data.message!=""){
					alert(data.message);
				}
				else{
					alert("绑定失败");
				}
			}
		});
	}
}
function scanlogin(){
			var t="qr";
			var sysid="1";
			var timestamp=(new Date()).valueOf();
			var sign=hex_md5(sysid+"ce07d3f6-77e3-49da-ab35-e22ed07e8e28"+timestamp);
			$.ajax({
   				type: 'post',
    			url: url+'/auth/Login',
    			data: "t=qr&sysid="+sysid+"&sign="+sign+"&timestamp="+timestamp,
    			dataType: 'jsonp',
    			success: function(data, textStatus, jqXHR) {
    				if(data.code=="1"){
    					qrtime=setTimeout(scanlogin,1000);
    				}
    				else if(data.code=="0"){
    					clearTimeout;
    					getusername(data.sessionId,sysid,sign,timestamp);
    					document.cookie="UserSessionId="+data.sessionId;
    					 window.location.reload();
    				}
    			}
    		});
}
function getCookie(name) 
{ 
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
 
    if(arr=document.cookie.match(reg))
 
        return unescape(arr[2]); 
    else 
        return null; 
} 
function delCookie(name) 
{ 
    var exp = new Date(); 
    exp.setTime(exp.getTime() - 1); 
    var cval=getCookie(name); 
    if(cval!=null) 
    document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
} 
function closelogin(){
			clearTimeout(qrtime);
			$("#login-mask").css("display","none");
	}
function openlogin(){
			gotonormallogin(scanlogin);
			$("#login-mask").css("display","block");
}
function gotoscanlogin(){
			$("#j_scanLoginBtn").css("display","none");
			$("#j_normalLoginbtn1").css("display","inline");
			$("#regist").css("display","inline");
			$("#j_normalLoginbtn").css("display","none");
			$("#logintitle").text("扫码登录");
			$("#j_normalLogin").css("display","none");
			$("#j_scanLogin").css("display","block");
			$("#j_regist").css("display","none");
			$("#j_normalLogin input").val("");
			$("#j_regist input").val("");
			scanlogin();
		}
		function gotonormallogin(){
			clearTimeout(qrtime);
			$("#j_scanLoginBtn").css("display","inline");
			$("#j_normalLoginbtn1").css("display","none");
			$("#regist").css("display","inline");
			$("#j_normalLoginbtn").css("display","none");
			$("#logintitle").text("帐号登录");
			$("#j_normalLogin").css("display","block");
			$("#j_scanLogin").css("display","none");
			$("#j_regist").css("display","none");
			$("#codeimg").attr("src", url+"/auth/Verifycode?" + Math.random());
			$("#j_normalLogin input").val("");
			$("#j_regist input").val("");
		}
		function gotoregist(){
			clearTimeout(qrtime);
			$("#j_scanLoginBtn").css("display","inline");
			$("#j_normalLoginbtn1").css("display","none");
			$("#regist").css("display","none");
			$("#j_normalLoginbtn").css("display","inline");
			$("#logintitle").text("注册");
			$("#j_normalLogin").css("display","none");
			$("#j_scanLogin").css("display","none");
			$("#j_regist").css("display","block");
			$("#j_normalLogin input").val("");
		}
		function logout(){
			$.ajax({
				type:"get",
				url:url+"/auth/Logout",
				async:false,
				dataType:"jsonp",
				success:function(data){
					if(data.code=="0"){
						delCookie("UserSessionId");
						window.location.reload();
					}
				}
			});
		}
		var numSMSCodeCountdown = 0;
    /**
     * 短信验证码倒计时
     */
    function SMSCodeCountdown(){
        if(numSMSCodeCountdown == 0){
            $("#getsmscode").text("获取短信验证码").attr("onclick","javascript:getsmscode();").removeClass("disabled");
            return;
        }
        $("#getsmscode").text("发送成功("+numSMSCodeCountdown+"秒)");
        numSMSCodeCountdown--;
        setTimeout(SMSCodeCountdown,1000);
    }
		function getsmscode(){
			var mobile=$("#registmobile").val();
			if(mobile==''||mobile==null){
				alert("请先输入手机号码");
			}
			else{
				var exist=ifmobileexist(mobile);
				if(exist){
					$("#getsmscode").text("验证码发送中...").removeAttr("onclick").addClass("disabled");
					$.ajax({
	   				type: 'post',
	    			url: url+'/auth/SMSCode',
	    			data: "mobile="+mobile,
	    			dataType: 'jsonp',
	    			success: function(data, textStatus, jqXHR) {
		    				if(data.code=="0"){
		    					numSMSCodeCountdown = 60;
	                    		SMSCodeCountdown();
		    				}
	    				}
    				});
				}
				else if(!exist){
					alert("该号码已注册过");
				}
			}
		}
		function ifmobileexist(mobile){
			var existmobile=false;
			$.ajax({
	   				type: 'post',
	    			url: url+'/auth/IsExistMobile',
	    			data: "mobile="+mobile,
	    			dataType: 'json',
	    			async:false,
	    			contentType : "application/x-www-form-urlencoded; charset=utf-8",
	    			success: function(data, textStatus, jqXHR) {
	    				if(data.code=="0"){
	    					existmobile=true;
	    				}
	    				if(data.code=="1"){
	    					existmobile=false;
	    				}
	    			}
    			});
    			return existmobile;
		}
		$(document).ready(function(){
			var sessionId=document.cookie;
			sessionId=sessionId.substring(14,sessionId.length);
			getusername(sessionId,'','','');
			$(".sign-in").mouseover(function(){
				$(this).addClass("act");
				$(this).find(".iconfont i").attr("class","icon-sort-up");
			});
			$(".sign-in").mouseleave(function(){
				$(this).removeClass("act");
			});
			$("#registbtn").click(function(event){
				var mobile=$("#registmobile").val();
				var name=$("#name").val();
				var password=$("#registpassword").val();
				var smscode=$("#registcode").val();
				if(mobile==''||mobile==null){
					alert("请输入手机号");
				}
				else if(name==''||name==null){
					alert("请输入昵称");
				}
				else if(password==''||password==null){
					alert("请输入密码");
				}
				else if(smscode==''||smscode==null){
					alert("请输入验证码");
				}
				else if(!$("#isagree").is(':checked')){
					alert("请先阅读并接收用户协议");
				}
				else{
					password=hex_md5(password);
					$.ajax({
						type:"post",
						url:url+"/auth/Regist",
						async:true,
						data:'smscode='+smscode+'&mobile='+mobile+'&name='+name+'&password='+password,
						dataType:'jsonp',
						success: function(data, textStatus, jqXHR){
							if(data.code=="0"){
								alert("注册成功，请登录");
								numSMSCodeCountdown == 0
								openlogin();
							}
							else if(data.code=="1"){
								alert(data.message+"，注册失败")
							}
						}
					});
				}
			});
		});
		function login(){
			var t="pc";
			var userId=$("#username").val();
			var password=$("#password").val();
			var code =$("#code").val();
			password=hex_md5(password);
			var sysid="1";
			var timestamp=(new Date()).valueOf();
			var sign=hex_md5(sysid+"ce07d3f6-77e3-49da-ab35-e22ed07e8e28"+timestamp);
			$.ajax({
   				type: 'post',
    			url: url+'/auth/Login',
    			data: "t=pc&sysid="+sysid+"&sign="+sign+"&timestamp="+timestamp+"&code="+code+"&userId="+userId+"&password="+password,
    			dataType: 'jsonp',
    			success: function(data, textStatus, jqXHR) {
    				if(data.code=="1"){
    					if(data.message!=null||data.message!=""){
    						alert(data.message);
    						$("#codeimg").attr("src",url+"/auth/Verifycode?" + Math.random())
    					}
    					else{
    						alert("登陆失败");
    					}
    				}
    				else if(data.code=="0"){
    					getusername(data.sessionId,sysid,sign,timestamp);
    					document.cookie="UserSessionId="+data.sessionId;
    					 window.location.reload();
    				}
    			}
    		});
		}
		function getusername(sessionId,sysid,sign,timestamp){
			if(sysid==''||sign==''||timestamp==''){
				sysid="1";
				timestamp=(new Date()).valueOf();
				sign=hex_md5(sysid+"ce07d3f6-77e3-49da-ab35-e22ed07e8e28"+timestamp);
			}
			$.ajax({
    			type:"get",
    			url:url+"/client/UserInfo",
    			async:false,
    			data:"sessionid="+sessionId+"&sysid="+sysid+"&sign="+sign+"&timestamp="+timestamp,
    			dataType:"json",
    			success:function(data, textStatus, jqXHR) {
    				if(data.code=="0"){
    					$(".sign-out").css("display","none");
    					$(".sign-in").removeClass("hidden");
    					$("#nav-user-name").text(data.userName);
    					$("#nav-user-id").text(data.userId);
    					closelogin();
    				}
    			}
    		});
		}
function add0(m){return m<10?'0'+m:m }
		function format(shijianchuo)
		{
			//shijianchuo是整数，否则要parseInt转换
			var time = new Date(shijianchuo);
			var y = time.getFullYear();
			var m = time.getMonth()+1;
			var d = time.getDate();
			var h = time.getHours();
			var mm = time.getMinutes();
			var s = time.getSeconds();
			return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
		}
function godirlist(rdId){
			$("#rdId").val(rdId);
			$("#dir_form").submit();
		}
function get_recommend_list(){
	var resultlist='';
	$.ajax({
		type:"get",
		url:url+"/client/GetRecommendDir",
		async:false,
		dataType:"jsonp",
		success:function(data){
			if(data.code=="0"){
				var length=6;
				var result=data.result;
				if(!result){
					length = 0;
				}else if(result.length<6){
					length=result.length;
				}
				for(var i=0;i<length;i++){
					resultlist=resultlist+'<li>\
								<div class=img-box>\
									<a href="javascript:godirlist('+result[i].rdId+');">\
										<img src="img/150.jpg" />\
									</a>\
								</div>\
								<div class="book-info">\
									<h4>\
										<a href="javascript:godirlist('+result[i].rdId+');">'+result[i].title+'</a>\
									</h4>\
									<p class="author">\
										<a>'+format(result[i].time)+'</a>\
									</p>\
									<p class="intro">'+result[i].count+'位用户荐购过</p>\
								</div>\
							</li>';
				}
				$(resultlist).appendTo("#recommend_list_short");
			}
		}
	});
}

function get_tag_list(){
	var resultlist='';
	$.ajax({
		type:"get",
		url:url+"/client/GetTag",
		async:true,
		dataType:"json",
		success:function(data){
			if(data.code=="0"){
				var result=data.result;
				if(!result || result.length == 0){
					return;
				}
				for(var i=0;i<result.length;i++){
					resultlist=resultlist+'<label><input type="checkbox" name="tag" class="checkbox" value="'+result[i].name+'"/>'+result[i].name+"</label> ";
				}
				$(resultlist).appendTo(".sc_adv_tag .list");
			}
		}
	});
}

function getimgurl(imgPath)
{
	var reg=new RegExp("^(http://)");    
	if(reg.test(imgPath))
	{
		return imgPath;
	}
	
	reg=new RegExp("^(https://)");    
	if(reg.test(imgPath))
	{
		return imgPath;
	}
	
	reg=new RegExp("^(//)");    
	if(reg.test(imgPath))
	{
		return imgPath;
	}
	return url + imgPath;
}