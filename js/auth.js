$(function(){

    /**
     * 未登录链接
     */
    $(".banner .session .nosession").unbind("click").click(function(){
        showLoginDlg();
    });

    /**
     * 已登录链接
     */
    $(".banner .session .logined").unbind("click").click(function(){
        location.href = "User";
    });

    /**
     * 登录链接
     */
	$(".btnLogin").unbind("click").click(function(){
		hideRegisterDlg();
        var backurl = $(".btnRegister").data("backurl");
        var sysid = $(".btnRegister").data("sysid");
        var sign = $(".btnRegister").data("sign");
        var timestamp = $(".btnRegister").data("timestamp");
		showLoginDlg(backurl,sysid,sign,timestamp);
	});

    /**
     * 注册链接
     */
	$(".btnRegister").unbind("click").click(function(){
		hideLoginDlg();
		showRegisterDlg();
	});
});


/**
 * 二维码轮询定时器
 */
var qrTimer = null;
function closeQrTimer(){
    if(qrTimer){
        clearTimeout(qrTimer);
        qrTimer = null;
    }
}

/**
 * 关闭登录窗口
 */
function hideLoginDlg(){
	closeQrTimer();
	var dlg = $(".LoginDlg");
	dlg.hide();
}

/**
 * 弹出显示登录窗口
 */
function showLoginDlg(backurl,sysid,sign,timestamp){
    var dlg = $(".LoginDlg");

    $.ajax({url: "../auth/extLoginIsValid", type: "POST", data: "type=QQ", dataType: 'json'})
        .done(function(data) {
            if(data.code == 0){
                $(".lineExtLoginQQ",dlg).show();
            }else{
                $(".lineExtLoginQQ",dlg).hide();
            }
        });

    dlg.show();

    /**
     * 保存登录成功后的跳转URL。
     */
    $(".btnRegister").data("backurl",backurl);
    $(".btnRegister").data("sysid",sysid);
    $(".btnRegister").data("sign",sign);
    $(".btnRegister").data("timestamp",timestamp);

    /**
     * 关闭按钮
     */
    $(".btnDlgClose",dlg).unbind("click").click(function(){
        hideLoginDlg();
        OnUnBusy();
		if(backurl){
			location.href = backurl;
		}
    });

    /**
     * 用QQ账号登录
     */
	$(".extLoginQQ",dlg).unbind("click").click(function(){
	    location.href = "../auth/extLogin?type=QQ";
        //window.open("../auth/extLogin?type=QQ","QQ登录",
        //    "width=450,height=320,menubar=0,scrollbars=1,resizable=1,status=1,titlebar=0,toolbar=0,location=1");
	});

    /**
     * 提交登录动作
     */
    $(".btnLoginSubmit",dlg).unbind("click").click(function(){
        if(IsBusy()){
            return;
        }
        OnBusy();
        var userId = $(".userId",dlg).val();
        var password = $(".password",dlg).val();
        var code = $(".code",dlg).val();
        $.ajax({url:"../auth/Login",type:"POST", data:"t=pc&sysid="+sysid+"&sign="+sign+"&timestamp="+timestamp+"&code="+code+"&userId="+userId+"&password="+password,dataType: "json"})
         .done(function(data){
             if(data.code == 0){
				if(backurl){
                    if(backurl.indexOf("?")>=0){
                        location.href = backurl + "&sessionid="+data.sessionId+"&openid="+data.openId;
                    }else{
                        location.href = backurl + "?sessionid="+data.sessionId+"&openid="+data.openId;
                    }
				}else{
					location.href = location.href;
				}
             }else{
                 OnUnBusy();
                 $(".verifycode",dlg).click();
                 alert(data.message || "登录失败");
             }

         }).fail(function() {
            OnUnBusy();
            $(".verifycode",dlg).click();
            alert("登录失败2");
         });
    });

    /**
     * 切换为账号密码登录
     */
    function showPassLogin(){
        closeQrTimer();
        $(".password",dlg).val("");
        $(".userId",dlg).val("").focus();
        $(".formContent",dlg).show();
        $(".qrlogin",dlg).hide();
        $(".loginType>img",dlg).attr("src","img/qrlogin.png");

        $(".verifycode",dlg).unbind("click").click(function(){
            $(".code",dlg).val("");
            $(this).attr("src","../themes/img/wait.gif");
            $(this).attr("src","../auth/Verifycode?"+Math.random());
        }).click();
    }

    /**
     * 切换为扫码登录
     */
    function showQrLogin(){
        $(".formContent",dlg).hide();
        $(".qrlogin",dlg).show();
        $(".loginType>img",dlg).attr("src","img/passlogin.png");

        function qrTimerFunc(){
            $.ajax({url:"../auth/Login",type:"POST", data:"t=qr&sysid="+sysid+"&sign="+sign+"&timestamp="+timestamp,dataType: "json"})
                .done(function(data){
                    if(data.code == 0){
                        OnBusy();
                        if(backurl){
                            if(backurl.indexOf("?")>=0){
                                location.href = backurl + "&sessionid="+data.sessionId+"&openid="+data.openId;
                            }else{
                                location.href = backurl + "?sessionid="+data.sessionId+"&openid="+data.openId;
                            }
						}else{
							location.href = location.href;
						}
                    }else{
                        closeQrTimer();
                        qrTimer = setTimeout(qrTimerFunc,500);
                    }
                }).fail(function() {
                closeQrTimer();
                qrTimer = setTimeout(qrTimerFunc,500);
            });
        }

        closeQrTimer();
        qrTimer = setTimeout(qrTimerFunc,500);
    }

    /**
     * 默认账号密码登录
     */
    showPassLogin();

    /**
     * 切换按钮
     */
    $(".loginType",dlg).unbind("click").click(function(){
        if($(".formContent",dlg).is(":visible")){
            showQrLogin();
        }else{
            showPassLogin();
        }
    });
}

/**
 * 关闭注册窗口
 */
function hideRegisterDlg(){
	closeQrTimer();
	var dlg = $(".RegisterDlg");
	dlg.hide();
}

/**
 * 弹出显示注册窗口
 */
function showRegisterDlg(){
    var dlg = $(".RegisterDlg");
    dlg.show();

    /**
     * 保存登录成功后的跳转URL。
     */
    var backurl = $(".btnRegister").data("backurl");
    var sysid = $(".btnRegister").data("sysid");
    var sign = $(".btnRegister").data("sign");
    var timestamp = $(".btnRegister").data("timestamp");

    /**
     * 关闭按钮
     */
    $(".btnDlgClose",dlg).unbind("click").click(function(){
        dlg.hide();
        OnUnBusy();
		if(backurl){
			location.href = backurl;
		}
    });

    var numSMSCodeCountdown = 0;
    /**
     * 短信验证码倒计时
     */
    function SMSCodeCountdown(){
        if(numSMSCodeCountdown == 0){
            $(".btnGetSmscode",dlg).text("获取短信验证码").removeAttr("disabled").removeClass("disabled");
            return;
        }
        $(".btnGetSmscode",dlg).text("发送成功("+numSMSCodeCountdown+"秒)");
        numSMSCodeCountdown--;
        setTimeout(SMSCodeCountdown,1000);
    }

    /**
     * 获取短信验证码动作
     */
	$(".btnGetSmscode",dlg).unbind("click").click(function(){
		$(".smscode",dlg).val("");
        var mobile = encodeURI($(".mobile",dlg).val().trim());
        if(mobile == null || mobile.length == 0){
            alert("手机号不能为空");
            return;
        }
        $(".btnGetSmscode",dlg).text("验证码发送中...").attr("disabled",true).addClass("disabled");
        $.ajax({url: "../auth/SMSCode", type: "POST", data: "mobile="+mobile+"&t=" + Math.random(), dataType: 'json'})
            .done(function(data) {
                if(data.code != 0){
                    alert("获取短信验证码失败.");
                    $(".btnGetSmscode",dlg).text("获取短信验证码").removeAttr("disabled").removeClass("disabled");
                }else{
                    numSMSCodeCountdown = 60;
                    SMSCodeCountdown();
                }
            })
            .fail(function(){
                alert("获取短信验证码失败.");
                $(".btnGetSmscode",dlg).text("获取短信验证码").removeAttr("disabled").removeClass("disabled");
            });
	});

    /**
     * 判断手机号是否被占用。
     */
	$(".mobile",dlg).unbind("change").change(function(){
		var mobile = $(this).val();
		if(mobile == null || mobile.length == 0){
			return;
		}
		
		$.ajax({url: "../auth/IsExistMobile", type: "POST", data: "mobile=" + mobile, dataType: 'json'})
		.done(function(data) {
			if(data.code == 1){
				alert("手机号已被占用,请换个手机号.");
			}
		});
	});

    /**
     * 注册提交
     */
	$(".btnRegSubmit",dlg).unbind("click").click(function(){
        if(IsBusy()){
            return;
        }
        var mobile = encodeURI($(".mobile",dlg).val().trim());
        var name = encodeURI($(".name",dlg).val().trim());
        var password = encodeURI($(".password",dlg).val());
        var smscode = encodeURI($(".smscode",dlg).val());
		if(mobile == null || mobile.length == 0){
			alert("手机号不能为空");
			return;
		}
		if(name == null || name.length == 0){
			alert("昵称不能为空");
			return;
		}
		if(password == null || password.length == 0){
			alert("密码不能为空");
			return;
		}
		if(smscode == null || smscode.length == 0){
			alert("验证码不能为空");
			return;
		}
		if(!$(".isAgree",dlg).is(":checked")){
            alert("您还未接受《用户协议》");
            return;
        }

        OnBusy();
        $.ajax({url:"../auth/Regist",type:"POST", data:"sysid="+sysid+"&sign="+sign+"&timestamp="+timestamp+"&smscode="+smscode+"&mobile="+mobile+"&name="+name+"&password="+password,dataType: "json"})
         .done(function(data){
             OnUnBusy();
             if(data.code == 0){
                alert("注册成功!");
                dlg.hide();
				showLoginDlg(backurl,sysid,sign,timestamp);
             }else{
                 alert(data.message || "注册失败");
             }

         }).fail(function() {
            OnUnBusy();
            alert("注册失败2");
         });
    });
}
