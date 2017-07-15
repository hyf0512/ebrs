$(function() {
    /**
     * 申请绑定身份按钮
     */
    $(".btnAppIdent").unbind("click").click(function(){
        showAppIdentDlg();
    });

});

function showAppIdentDlg() {
    var dlg = $(".AppIdentDlg");
    dlg.show();
    $(".account",dlg).val("");
    $(".password",dlg).val("");

    /**
     * 关闭按钮
     */
    $(".btnDlgClose",dlg).unbind("click").click(function(){
        dlg.hide();
        OnUnBusy();
    });

    OnBusy();
    var libraryEle = $(".library",dlg).empty();
    /**
     * 获取图书馆列表
     */
    $.ajax({url:"../auth/GetLibList",type:"POST", data:"",dataType: "json",async: false})
        .done(function(data){
            if(data.code == 0 && data.result != null && data.result.length > 0){
                for(var i = 0; i < data.result.length; i++){
                    var libtype = 0;
                    if(data.result[i].libSystem != null && data.result[i].libSystem.length > 0){
                        libtype = 1;
                    }
                    $("<option value='"+data.result[i].libraryId+"' data-libtype='"+libtype+"'>"+data.result[i].libName+"</option>").appendTo(libraryEle);
                }
            }else{
                alert("获取图书馆列表失败");
                OnUnBusy();
                return;
            }
        }).fail(function() {
            alert("获取图书馆列表失败");
            OnUnBusy();
            return;
    });
    OnUnBusy();

    /**
     * 图书馆身份绑定方式有接口对接和人工审核两种
     */
    libraryEle.unbind("change").change(function(){
        var libType = parseInt($(".library",dlg).find("option:selected").data("libtype"));
        if(libType == 0){

        }else{

        }
    }).change(0);

    /**
     * 申请提交
     */
    $(".btnAppSubmit",dlg).unbind("click").click(function(){
        if(IsBusy()){
            return;
        }

        var library = encodeURI($(".library",dlg).val().trim());
        var libType = parseInt($(".library",dlg).find("option:selected").data("libtype"));
        var account = encodeURI($(".account",dlg).val().trim());
        var password = encodeURI($(".password",dlg).val());
        if(library == null || library.length == 0){
            alert("图书馆选择项不能为空");
            return;
        }
        if(account == null || account.length == 0){
            alert("图书馆内账号不能为空");
            return;
        }
        if(password == null || password.length == 0){
            alert("图书馆内密码不能为空");
            return;
        }

        OnBusy();
        $.ajax({url:"../auth/AppIdent",type:"POST", data:"libType="+libType+"&library="+library+"&account="+account+"&password="+password,dataType: "json"})
            .done(function(data){
                if(data.code == 0){
                    if(libType == 0){
                        alert("提交成功!");
                    }else{
                        alert("绑定成功!");
                    }
                    dlg.hide();
                    location.href = location.href;
                }else{
                    OnUnBusy();
                    if(libType == 0){
                        alert(data.message || "提交失败!");
                    }else{
                        alert(data.message || "绑定失败!");
                    }
                }

            }).fail(function() {
            OnUnBusy();
            if(libType == 0){
                alert("提交失败!");
            }else{
                alert("绑定失败!");
            }
        });
    });
}
