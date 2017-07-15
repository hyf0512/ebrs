(function(){
	function erStatLoad(){
		//TODO:页面停留秒长，页面滚动最大值，点击位置等。
		if(stat_type != ""){
			var stat_loadtime = 0;
			if(stat_time > 0){
                stat_loadtime = (new Date().getTime()) - stat_time;
            }
			doPost("../stat/visit","t="+stat_type+"&id="+stat_id+"&d=0&l="+stat_loadtime+"&m=0");
        }
	}

	function doPost(url,data,callback)
	{
		try{
			var xmlHttp = _getXmlHttp();
			xmlHttp.open("POST", url, true);
			xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");
			xmlHttp.onreadystatechange = function() 
			{
				if(xmlHttp.readyState == 4)
				{
					try{
						if (xmlHttp.status == 200)
						{
							if(typeof(callback) == "function"){
								callback(xmlHttp.responseText);
							}						
						}
					}catch(eee){
					}
					xmlHttp = null;
				}
			}
			xmlHttp.send(data);
		} catch (eee) {
		}
	}

	// private: xmlhttp factory
	function _getXmlHttp() 
	{
		try
		{
			if(window.XMLHttpRequest) 
			{
				var req = new XMLHttpRequest();
				// some versions of Moz do not support the readyState property and the onreadystate event so we patch it!
				if(req.readyState == null) 
				{
					req.readyState = 1;
					req.addEventListener("load", 
										function() 
										{
											req.readyState = 4;
											if(typeof req.onreadystatechange == "function")
												req.onreadystatechange();
										},
										false);
				}
				return req;
			}
			if(window.ActiveXObject) 
				return new ActiveXObject(_getXmlHttpProgID());
		}
		catch (ex) {}
		throw new Error("Your browser does not support XmlHttp objects");
	}

	function _getXmlHttpProgID()
	{
		if(_getXmlHttpProgID.progid)
			return _getXmlHttpProgID.progid;
		var progids = ["Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
		var o;
		for(var i = 0; i < progids.length; i++)
		{
			try
			{
				o = new ActiveXObject(progids[i]);
				return _getXmlHttpProgID.progid = progids[i];
			}
			catch (ex) {};
		}
		throw new Error("Could not find an installed XML parser");
	}

	if(window.addEventListener){
		window.addEventListener('load',erStatLoad,false);
	}else{
		window.attachEvent('onload',erStatLoad);
	}
})();