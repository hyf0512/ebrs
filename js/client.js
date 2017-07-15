$(function(){
    $(window).scroll(function(){
        if ($(".banner").hasClass("bannerMini")) {
            if($(this).scrollTop() < 10) {
                $(".banner").slideUp(10,function(){
					$(this).removeClass("bannerMini").slideDown(10);
				});
            }
        }else {
            if($(this).scrollTop() > 110) {
                $(".banner").fadeOut(10,function(){
					$(this).addClass("bannerMini").slideDown(200);
				});
            }
        }
    }).scroll();
});

function CloseWindow(){
	if (navigator.userAgent.indexOf("MSIE") > 0) {
		if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
			window.opener = null;
			window.close();
		} else {
			window.open('', '_top');
			window.top.close();
		}
	}
	else if (navigator.userAgent.indexOf("Firefox") > 0) {
		window.close();
		window.location.href = 'about:blank';
		window.close();
	} else {
		window.opener = null;
		window.open('', '_self', '');
		window.close();
	}
}

function ShowWait()
{
    if(!$(document).find("#waitDialog").html())
    {
        $('<div id="waitDialog"><img src="img/wait.gif" /><span>加载中,请稍候...</span></div>').appendTo("body");
    }
    $("#waitDialog").show();
}

function HideWait()
{
    $("#waitDialog").hide();
}

var g_bBusy = false;
function OnBusy()
{
    if(g_bBusy)
    {
        return false;
    }else{
        g_bBusy = true;
        ShowWait();
        return true;
    }
}

function IsBusy(){
    return g_bBusy;
}

function OnUnBusy()
{
    g_bBusy = false;
    HideWait();
}
