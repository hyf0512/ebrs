var clicknum=0;
function getcomment(bookid,page,needlines){
	var comment;
	$.ajax({
		type:"post",
		url:url+"/comment/Get",
		async:false,
		data:"id="+bookid+"&page="+page+"&needlines="+needlines+"&UserSessionId="+sessionId,
		dataType:'json',
		success:function(data, textStatus, jqXHR){
			comment=data;
			console.log(data);
		}
	});
	$("#commentpage").val(comment.currentPage);
	return comment;
}
function gocomment(){
	var getsessionId=document.cookie;
	getsessionId=getsessionId.substring(14,sessionId.length);
	if(getsessionId==null|getsessionId==""){
		openlogin();
	}
	else{
		if(clicknum==0){
			$("#starBig").find('img').attr("src","img/star-off.png");
			$(".score-mid").find('img').attr("src","img/star-off.png");
			$(".score-mid img").slice(0, score).attr("src","img/star-on.png");
		}
		else{
			$("#starBig img").slice(0, clicknum).attr("src","img/star-on.png");
			$("#starBig img").slice(clicknum, 5).attr("src","img/star-off.png");
			$(".score-mid img").slice(0, clicknum).attr("src","img/star-on.png");
			$(".score-mid img").slice(clicknum, 5).attr("src","img/star-off.png");
		}
		$(".lbf-panel").css("display","block");
		$(".lbf-overlay").css("display","block");
	}
	
}
function closecomment(){
	$(".lbf-panel").css("display","none");
	$(".lbf-overlay").css("display","none");
	$(".score-mid").find('img').attr("src","img/star-off.png");
	$(".score-mid img").slice(0, score).attr("src","img/star-on.png");
	$("#evaMsgText").val("");
	clicknum=0;
}
function changecommentpage(page){
	$("#comment-list dl").remove();
	$("#comment-list div").remove();
	var commentchangelist=getcomment(bookId,page,$("#needlines").val());
	var listinfo=creatcommentlist(commentchangelist,$("#needlines").val());
	$(listinfo).appendTo("#comment-list");
}
function nextcommentpage(){
	$("#comment-list dl").remove();
	$("#comment-list div").remove();
	var page=parseInt($("#commentpage").val())+1;
	var commentchangelist=getcomment(bookId,page,$("#needlines").val());
	var listinfo=creatcommentlist(commentchangelist,$("#needlines").val());
	$(listinfo).appendTo("#comment-list");
}
function precommentpage(){
	$("#comment-list dl").remove();
	$("#comment-list div").remove();
	var page=$("#commentpage").val()-1;
	var commentchangelist=getcomment(bookId,page,$("#needlines").val());
	var listinfo=creatcommentlist(commentchangelist,$("#needlines").val());
	$(listinfo).appendTo("#comment-list");
}
function dianzan(commentId){
	
	$.ajax({
		type:"post",
		url:url+"/comment/Vote",
		async:false,
		data:"commentId="+commentId,
		dataType:'jsonp',
		success:function(data, textStatus, jqXHR){
			console.log(data);
			if(data.code=="0"){
				$("#"+commentId).css("color","#ed4259");
				$("#"+commentId+" b").css("color","#ed4259");
				var sum=parseInt($("#"+commentId+" b").text())+1;
				$("#"+commentId+" b").text(sum.toString());
				$("#"+commentId).removeAttr("href");
			}
			else if(data.code=="1"){
				alert(code.message);
			}
		}
	});
	
}
function creatcommentlist(commentlist,needlines){
	var commentinfo='<dl>';
	var result=commentlist.result;
	for(var i=0;i<result.length;i++){
		commentinfo=commentinfo+'<dd>\
				<div class="comment-info">\
					<h6>\
						<a class="zan"';
						if(result[i].status==null||result[i].status==0){
							commentinfo=commentinfo+' href="javascript:dianzan('+result[i].commentId+');" id="'+result[i].commentId+'">';
						}
						else if(result[i].status!=null&&result[i].status!=0&&result[i].status==3){
							commentinfo=commentinfo+' style="color: #ed4259;">';
						}
							commentinfo=commentinfo+'<b>'+result[i].votecount+'</b>\
							<em class="iconfont">\
								<i class="icon-thumbs-up"></i>\
							</em>\
						</a>\
						<a class="blue">'+result[i].userName+'</a>\
						<i>评</i>\
						<span class="score-min star'+result[i].rating+'"></span>\
					</h6>\
					<p class="normal">'+result[i].content+'</p>\
					<p>'+format(result[i].time)+'</p>\
				</div>\
			</dd>';
	}
	commentinfo=commentinfo+'</dl>';
	var totalpage=parseInt(commentlist.totalCount/needlines);
	if(commentlist.totalCount%needlines!=0){
		totalpage=totalpage+1;
	}
	var nowpage = commentlist.currentPage;
	var pageinfo='<div class="page-box cf">\
			<div class="pagination fr" id="page-container">\
				<div class="lbf-pagination">\
					<ul class="lbf-pagination-item-list" id="page-index">';
	if(totalpage>=nowpage){
		if(nowpage==1){
			if((totalpage-nowpage)<=5){
				pageinfo=pageinfo+'<li class="lbf-pagination-item">\
					<a class="lbf-pagination-prev lbf-pagination-disabled"><</a>\
				</li>\
				<li class="lbf-pagination-item">\
					<a class="lbf-pagination-page  lbf-pagination-current">1</a>\
				</li>';
				for(var i=2;i<=totalpage;i++){
					pageinfo=pageinfo+'<li class="lbf-pagination-item">\
					<a class="lbf-pagination-page" href="javascript:changecommentpage('+i+')">'+i+'</a>\
				</li>';
				}
				if(totalpage!=1){
					pageinfo=pageinfo+'<li class="lbf-pagination-item">\
					<a class="lbf-pagination-next" href="javascript:nextcommentpage();">></a>\
				</li>';
				}
				else{
					pageinfo=pageinfo+'<li class="lbf-pagination-item">\
					<a class="lbf-pagination-next lbf-pagination-disabled">></a>\
				</li>';
				}
			}
			else{
				pageinfo=pageinfo+'<li class="lbf-pagination-item">\
					<a class="lbf-pagination-prev lbf-pagination-disabled"><</a>\
				</li>\
				<li class="lbf-pagination-item">\
					<a class="lbf-pagination-page  lbf-pagination-current">1</a>\
				</li>';
				for(var i=2;i<=6;i++){
					pageinfo=pageinfo+'<li class="lbf-pagination-item">\
					<a class="lbf-pagination-page" href="javascript:changecommentpage('+i+')">'+i+'</a>\
				</li>';
				}
				pageinfo=pageinfo+'<li class="lbf-pagination-item">\
					<span class="lbf-pagination-ellipsis">...</span>\
				</li>\
				<li class="lbf-pagination-item">\
					<a class="lbf-pagination-page" href="javascript:changecommentpage('+totalpage+')">'+totalpage+'</a>\
				</li>\
				<li class="lbf-pagination-item">\
					<a class="lbf-pagination-next" href="javascript:nextcommentpage();">></a>\
				</li>';
			}
		}
		else if(nowpage<=(totalpage-3)&&nowpage>1&&totalpage>6){
			pageinfo=pageinfo+'<li class="lbf-pagination-item">\
					<a class="lbf-pagination-prev" href="javascript:precommentpage();"><</a>\
				</li>';
			if(nowpage<5){
				for(var i=1;i<6;i++){
					if(i==nowpage){
						pageinfo=pageinfo+'<li class="lbf-pagination-item">\
					<a class="lbf-pagination-page  lbf-pagination-current">'+i+'</a>\
				</li>';
					}
					else{
						pageinfo=pageinfo+'<li class="lbf-pagination-item">\
					<a class="lbf-pagination-page" href="javascript:changecommentpage('+i+')">'+i+'</a>\
				</li>';
					}
				}
			}
			else{
				pageinfo=pageinfo+'<li class="lbf-pagination-item">\
					<a class="lbf-pagination-page" href="javascript:changecommentpage(1)">1</a>\
				</li>\
				<li class="lbf-pagination-item">\
					<span class="lbf-pagination-ellipsis">...</span>\
				</li>';
				for(var i=nowpage-2;i<=parseInt(nowpage)+2;i++){
					if(i==nowpage){
						pageinfo=pageinfo+'<li class="lbf-pagination-item">\
					<a class="lbf-pagination-page  lbf-pagination-current">'+i+'</a>\
				</li>';
					}
					else{
						pageinfo=pageinfo+'<li class="lbf-pagination-item">\
					<a class="lbf-pagination-page" href="javascript:changecommentpage('+i+')">'+i+'</a>\
				</li>';
					}
				}
			}
			pageinfo=pageinfo+'<li class="lbf-pagination-item">\
					<span class="lbf-pagination-ellipsis">...</span>\
				</li>\
				<li class="lbf-pagination-item">\
					<a class="lbf-pagination-page" href="javascript:changecommentpage('+totalpage+')">'+totalpage+'</a>\
				</li>\
				<li class="lbf-pagination-item">\
					<a class="lbf-pagination-next" href="javascript:nextcommentpage();">></a>\
				</li>';
		}
		else if(nowpage>(totalpage-3)&&(nowpage<=totalpage)&&totalpage>6){
			pageinfo=pageinfo+'<li class="lbf-pagination-item">\
					<a class="lbf-pagination-prev" href="javascript:precommentpage();"><</a>\
				</li>\
				<li class="lbf-pagination-item">\
					<a class="lbf-pagination-page" href="javascript:changecommentpage(1)">1</a>\
				</li>\
				<li class="lbf-pagination-item">\
					<span class="lbf-pagination-ellipsis">...</span>\
				</li>';
			for(var i=totalpage-3;i<=totalpage;i++){
				if(i==nowpage){
						pageinfo=pageinfo+'<li class="lbf-pagination-item">\
					<a class="lbf-pagination-page  lbf-pagination-current">'+i+'</a>\
				</li>';
					}
					else{
						pageinfo=pageinfo+'<li class="lbf-pagination-item">\
					<a class="lbf-pagination-page" href="javascript:changecommentpage('+i+')">'+i+'</a>\
				</li>';
					}
			}
			if(nowpage!=totalpage){
				pageinfo=pageinfo+'<li class="lbf-pagination-item">\
					<a class="lbf-pagination-next" href="javascript:nextcommentpage();">></a>\
				</li>';
			}
			else{
				pageinfo=pageinfo+'<li class="lbf-pagination-item">\
					<a class="lbf-pagination-next lbf-pagination-disabled">></a>\
				</li>';
			}
		}
		else if(totalpage<=6){
			pageinfo=pageinfo+'<li class="lbf-pagination-item">\
					<a class="lbf-pagination-prev" href="javascript:precommentpage();"><</a>\
				</li>\
				<li class="lbf-pagination-item">\
					<a class="lbf-pagination-page" href="javascript:changecommentpage(1)">1</a>\
				</li>';
			for(var i=2;i<=totalpage;i++){
				if(i==nowpage){
						pageinfo=pageinfo+'<li class="lbf-pagination-item">\
					<a class="lbf-pagination-page  lbf-pagination-current">'+i+'</a>\
				</li>';
					}
					else{
						pageinfo=pageinfo+'<li class="lbf-pagination-item">\
					<a class="lbf-pagination-page" href="javascript:changecommentpage('+i+')">'+i+'</a>\
				</li>';
					}
			}
			if(nowpage!=totalpage){
				pageinfo=pageinfo+'<li class="lbf-pagination-item">\
					<a class="lbf-pagination-next" href="javascript:nextcommentpage();">></a>\
				</li>';
			}
			else{
				pageinfo=pageinfo+'<li class="lbf-pagination-item">\
					<a class="lbf-pagination-next lbf-pagination-disabled">></a>\
				</li>';
			}
		}
	}
	commentinfo=commentinfo+pageinfo+'</ul>\
				</div>\
			</div>\
		</div>';
	return commentinfo;
}
function commentbook(){
	if(sessionId==null||sessionId==""){
		openlogin();
	}
	else{
		$.ajax({
			type:"post",
			url:url+"/client/RecommendBook",
			async:false,
			data:"id="+bookId,
			dataType:"jsonp",
			success:function(data){
				console.log(data);
				if(data.code=="0"){
					window.location.reload();
				}
			}
		});
	}
}
$(function(){
	$(".icon-remove").click(function(){
			$(".score-mid").find('img').attr("src","img/star-off.png");
			$(".score-mid img").slice(0,score).attr("src","img/star-on.png");
		});
	var commentnum=1;
		 	 $("#starBig img").mouseover(function(){
		 	 	if(commentnum==1){
		 	 		$(this).prevAll().andSelf().attr("src","img/star-on.png");
		 	 		commentnum++;
		 	 	}
		 	 	if(commentnum==2){
		 	 		$(this).nextAll().attr("src","img/star-off.png");
		 	 		commentnum--;
		 	 	}
		 	 });
		 	  $("#starBig").mouseleave(function(){
		 	  	if(clicknum==0){
		 	  		$(this).find('img').attr("src","img/star-off.png");
		 	  	}
		 	  	else{
		 	  		$("#starBig img").slice(0, clicknum).attr("src","img/star-on.png");
		 	  		$("#starBig img").slice(clicknum, 5).attr("src","img/star-off.png");
		 	  	}
		 	 });
		 	 $("#starBig img").click(function(){
		 	 	$(this).prevAll().andSelf().attr("src","img/star-on.png");
		 	 	clicknum=$(this).attr("alt");
		 	 });
	$(".popup-btn a").click(function(){
		if(clicknum==0){
			alert("请评分");
		}
		else if($("#evaMsgText").val()==""){
			alert("请进行评价");
		}
		else{
			$.ajax({
				type:"post",
				url:url+"/comment/Set",
				async:false,
				data:"bookId="+bookId+"&rating="+clicknum+"&content="+$("#evaMsgText").val(),
				dataType:'jsonp',
				success:function(data, textStatus, jqXHR){
					if(data.code==1){
						alert("评论失败，"+data.message);
					}
					else if(data.code==0){
						alert("评论成功");
						closecomment();
					}
				}
			});
		}
	});
});
