//
// Browser Automaton Extension
//
// Copyright (c) 2020-2021 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// The MIT License (MIT) <http://opensource.org/licenses/MIT>
//

// Chrome extension

var BrowserAutomaton={};

BrowserAutomaton.elId="_900f26b2be9dd71e165c97b8168310eeeb1c7ef878d3cc2fa3d3f177e103ff21";
BrowserAutomaton.elIdRun="_590a37958908ab6e6fa2ad8aa331a58c536a024c9ef244ef4a556fa858604d38";
BrowserAutomaton.elIdUpdateState="_bb90e499e31a68645c940f15186b1d40d4d6d68b18752cd312b24bfae37b6cb8";
BrowserAutomaton.fnName="_3dc656c5131d62c8fac57caec67613bb6ccbb05476c8ad39c785cbf5a5af348d";
BrowserAutomaton.fnCheck="44d5333afbc046f0a4a00e86c2b5bbbd35e2fab8d2902d973e8030e419baa591";

BrowserAutomaton.allowedLink=[];

BrowserAutomaton.getOptions=function(fnNext){
	chrome.storage.sync.get(["allowedLink"],function(result){
		try{
			BrowserAutomaton.allowedLink=JSON.parse(result.allowedLink);
		} catch(e){
			BrowserAutomaton.allowedLink=[];
		};
		fnNext();
	});
};

BrowserAutomaton.states=[];

BrowserAutomaton.loadStates=function(fnNext){
	chrome.storage.local.get(["states"],function(result){
		try{
			BrowserAutomaton.states=JSON.parse(result.states);
		} catch(e){
			BrowserAutomaton.states=[];
		};
		fnNext();
	});
};

BrowserAutomaton.saveStates=function(){	
	chrome.storage.local.set({
		"states": JSON.stringify(BrowserAutomaton.states)
	});
};

BrowserAutomaton.stringEndsWith=function(str, suffix){
    return str.indexOf(suffix, str.length - suffix.length) === (str.length - suffix.length);
};

BrowserAutomaton.mergeObject=function(obj1,obj2){
	if(typeof(obj2)==="object"){
		if(obj2 != null){
			Object.keys(obj2).forEach(function(key){
				if(!Array.isArray(obj2[key])){
					if(typeof(obj2[key])==="object"){
						if(obj2[key] == null){
							obj1[key]=obj2[key];
							return;
						};
						if(typeof(obj1[key])!=="object"){
							obj1[key]={};
						};
						BrowserAutomaton.mergeObject(obj1[key],obj2[key]);
						return;
					};
				};
				if(BrowserAutomaton.stringEndsWith(key,"Add")){
					var subKey=key.substring(0,key.length-3);
					BrowserAutomaton.mergeArray(obj1[subKey],obj2[key]);
					return;
				};
				if(BrowserAutomaton.stringEndsWith(key,"Del")){
					var subKey=key.substring(0,key.length-3);
					BrowserAutomaton.removeFromArray(obj1[subKey],obj2[key]);
					return;
				};
				obj1[key]=obj2[key];				
			});
		};
	};
};

BrowserAutomaton.mergeArray=function(array1,array2){
	if(Array.isArray(array1)){
		if(Array.isArray(array2)){
			for(var k=0;k<array2.length;++k){
				var found=false;
				for(var m=0;m<array1.length;++m){
					if(array1[m]===array2[k]){
						found=true;
						break;
					};
				};
				if(!found){
					array1[array1.length]=array2[k];
				};
			};
		};
	};
};

BrowserAutomaton.removeFromArray=function(array1,array2){
	if(Array.isArray(array1)){
		if(Array.isArray(array2)){
			for(var k=0;k<array2.length;++k){
				var index=-1;
				for(var m=0;m<array1.length;++m){
					if(array1[m]===array2[k]){
						index=m;
						break;
					};
				};
				if(index>=0){
					delete array1[found];
				};
			};
		};
	};
};

BrowserAutomaton.updateState=function(state){
	if(state.protect){
		if(Array.isArray(state.protect.urlAdd)){
			BrowserAutomaton.mergeArray(state.protect.url,state.protect.urlAdd);
		};
		if(Array.isArray(state.protect.urlDel)){
			BrowserAutomaton.removeFromArray(state.protect.url,state.protect.urlDel);
		};
	};
	if(state.firewall){
		if(Array.isArray(state.firewall.allowAdd)){
			BrowserAutomaton.mergeArray(state.protect.url,state.protect.firewallAdd);
		};
		if(Array.isArray(state.protect.urlDel)){
			BrowserAutomaton.removeFromArray(state.protect.url,state.protect.urlDel);
		};
	};
};

BrowserAutomaton.processStateResult=function(elId,tabId,index,step) {
	if(step>15){
		return;
	};
	chrome.scripting.executeScript({
		target:{tabId: tabId},
		func: function(elId){
			var el=document.getElementById(elId);
			if(el){
				return el.innerHTML;
			};
			return "";
		},
		args: [elId]
	},function(results){
		const lastErr = chrome.runtime.lastError;
		if (lastErr){
			return;
		};
		var resultInfo;
		for (resultInfo of results){
			var result=resultInfo.result;
			if(typeof(result)==="undefined"){
				continue;
			};
			if((""+result).length==0){
				setTimeout(function(){
					BrowserAutomaton.processStateResult(elId,tabId,index,step+1);
				},1000);
				return;
			};
			var state={};			
			try{
				state=JSON.parse(result);
			} catch(e){
				state={};
			};
			BrowserAutomaton.mergeObject(BrowserAutomaton.states[index].state,state);
			if(BrowserAutomaton.states[index].state.processEnd) {
				delete BrowserAutomaton.states[index];
			};
			if(BrowserAutomaton.states[index].state.processEndAndKeepFirewall) {
				BrowserAutomaton.states[index].code=undefined;
			};
			BrowserAutomaton.saveStates();
			chrome.scripting.executeScript({
				target:{tabId: tabId},
				func: function(elId){
					var el=document.getElementById(elId);
					if(el){
						el.innerHTML="";
					};			
				},
				args: [elId]
			});
		};
	});
};

BrowserAutomaton.processState=function(tabId,index,url,fnName,openerTabId){	
	if(typeof(BrowserAutomaton.states[index].code)==="undefined"){
		return;
	};
	BrowserAutomaton.states[index].state.index=index;
	BrowserAutomaton.states[index].state.id=tabId;
	BrowserAutomaton.states[index].state.parentId=openerTabId;
	BrowserAutomaton.states[index].state.url=url;
	BrowserAutomaton.states[index].state.version="3.1";	
	chrome.scripting.executeScript({
		target:{tabId: tabId},
		func: function(elId,code,fnName,state,fnCheck){
			var automatonElement=document.getElementById(elId);
			if(!automatonElement){
				automatonElement=document.createElement("div");
				automatonElement.id = elId;
				automatonElement.style.display = "none";
				automatonElement.innerHTML = "";
				document.body.appendChild(automatonElement);
			};
			var automatonScript = document.createElement("script");
			automatonScript.textContent = "(function(){\r\n"+
				    code+";\r\n"+
					"document.getElementById(\""+elId+"\").innerHTML=JSON.stringify("+fnName+".call("+state+"));\r\n"+					
				    "})();\r\n";
			(document.head||document.documentElement).appendChild(automatonScript);
			return fnCheck;
		},
		args: [
			BrowserAutomaton.elIdRun,
			BrowserAutomaton.states[index].code,
			fnName,
			JSON.stringify(BrowserAutomaton.states[index].state),
			BrowserAutomaton.fnCheck			
		],
		world: "MAIN"
	},function(results){
		const lastErr = chrome.runtime.lastError;
		if (lastErr){
			return;
		};
		var resultInfo;			
		for (resultInfo of results){
			var result=resultInfo.result;
			if(typeof(result)==="undefined"){
				continue;
			};
			if((""+result)===BrowserAutomaton.fnCheck){
				BrowserAutomaton.processStateResult(BrowserAutomaton.elIdRun,tabId,index,0);
			};
		};
	});
};

BrowserAutomaton.processCode=function(elId,tabId,fnName,fnCheck){
	var automatonElement=document.getElementById(elId);
	if(automatonElement){
		return "";
	};	
	automatonElement=document.createElement("div");
	automatonElement.id = elId;
	automatonElement.style.display = "none";
	automatonElement.innerHTML = "";
	document.body.appendChild(automatonElement);
	var automatonScript = document.createElement("script");
	automatonScript.textContent = "(function(){\r\n"+
				      "var counter=0;\r\n"+
				      "var processEvent=function(){\r\n"+
				      "\tvar retV=\"undefined\";\r\n"+
				      "\tif(typeof("+fnName+")===\"undefined\"){\r\n"+
				      "\t\tretV=\"loading\";\r\n"+
				      "\t}else{\r\n"+
				      "\t\tretV="+fnName+"();\r\n"+
				      "\t\t"+fnName+"=function(){return \"undefined\";};\r\n"+
				      "\t};\r\n"+
				      "\tif(retV===\"loading\"){\r\n"+
				      "\t\t++counter;\r\n"+
				      "\t\tif(counter >= 15){\r\n"+
				      "\t\t\tdocument.getElementById(\""+elId+"\").innerHTML=\"undefined\";\r\n"+
				      "\t\t\treturn;\r\n"+
				      "\t\t};\r\n"+
				      "\t\tsetTimeout(function(){\r\n"+
				      "\t\t\tprocessEvent();\r\n"+
				      "\t\t},1000);\r\n"+
				      "\t\treturn;\r\n"+
				      "\t};\r\n"+
				      "\tdocument.getElementById(\""+elId+"\").innerHTML=retV;\r\n"+
				      "};\r\n"+
				      "processEvent();\r\n"+
				      "})();\r\n";
	(document.head||document.documentElement).appendChild(automatonScript);
	return fnCheck;
};

BrowserAutomaton.processCodeResponse=function(tabId,url,step){
	if(step>15){
		return;
	};
	chrome.scripting.executeScript({
		target:{tabId: tabId},
		func: function(elId){
			var el=document.getElementById(elId);
			if(el){
				return el.innerHTML;
			};
			return "";
		},
		args: [BrowserAutomaton.elId]
	},function(results){
		const lastErr = chrome.runtime.lastError;
		if (lastErr){
			return;
		};
		var resultInfo;
		for (resultInfo of results){
			var result=resultInfo.result;
			if(typeof(result)==="undefined"){
				continue;
			};
			if((""+result).length==0){
				setTimeout(function(){
					BrowserAutomaton.processResponse(tabId,url,step+1);
				},1000);
				return;
			};
			var index=BrowserAutomaton.states.length;
			BrowserAutomaton.states[index]={
				state:{
					index: index,
					id: tabId,
					firewall:{
						url: "about:blank",
						allow: [],
						deny: []
					},
					action: ["(.*)"],
					protect:{
						url: [],
						code: undefined,
						isProtected: false
					}
				},
				code: atob(result)						
			};
			BrowserAutomaton.processState(tabId,index,url,"init");
			BrowserAutomaton.processStateResult(BrowserAutomaton.elIdUpdateState,tabId,index,0);
		};
	});
};

BrowserAutomaton.processLink=function(tabId,url){
	if(url.indexOf("extension-action=update-state")>0){
		var urlInfo = new URL(url);
		var index = urlInfo.searchParams.get("extension-index");
		if(index){
			BrowserAutomaton.processStateResult(BrowserAutomaton.elIdUpdateState,BrowserAutomaton.states[index].state.id,index,0);
		};
		return;
	};
	chrome.scripting.executeScript({
		target:{tabId: tabId},
		func: BrowserAutomaton.processCode,
		args: [
			BrowserAutomaton.elId,
			tabId,
			BrowserAutomaton.fnName,
			BrowserAutomaton.fnCheck
		],
		world: "MAIN"
	},function(results){
		const lastErr = chrome.runtime.lastError;
		if (lastErr){
			return;
		};
		var resultInfo;
		for (resultInfo of results){
			var result=resultInfo.result;
			if(typeof(result)==="undefined"){
				continue;
			};
			if((""+result)===BrowserAutomaton.fnCheck){
				BrowserAutomaton.processCodeResponse(tabId,url,0);
			};
		};
	});	
};

BrowserAutomaton.processTabUrl=function(tabId, url, openerTabId){
	if(url.indexOf("extension=23ab9c0e7b432f42000005202e2cfa11889bd299e36232cc53dbc91bc384f9b3")>=0){		
		if((url.indexOf("://localhost/")>=0)||BrowserAutomaton.matchString(url,"://localhost:.*/")){
			BrowserAutomaton.processLink(tabId, url);
			return;
		};
		BrowserAutomaton.getOptions(function(){
			if(Array.isArray(BrowserAutomaton.allowedLink)){
				for(k=0; k<BrowserAutomaton.allowedLink.length; ++k){
					if(BrowserAutomaton.allowedLink[k].length>4){
						if(BrowserAutomaton.matchString(url,"://"+BrowserAutomaton.allowedLink[k])){
							BrowserAutomaton.processLink(tabId,url);
							return;
						};
					};
				};
			};
		});
	};
	for(var k=0;k<BrowserAutomaton.states.length;++k){
		if(Array.isArray(BrowserAutomaton.states[k].state.action)){
			for(var m=0;m<BrowserAutomaton.states[k].state.action.length;++m){
				if(BrowserAutomaton.matchString(url,BrowserAutomaton.states[k].state.action[m])){
					BrowserAutomaton.processState(tabId,k,url,"processUrl",openerTabId);
				};
			};
		};
	};
};

BrowserAutomaton.processTab=function(tabId, tab){
	chrome.scripting.executeScript({
		target:{tabId: tabId},
		func: function(){
			return document.location.href;
		}
	},function(results){
		const lastErr = chrome.runtime.lastError;
		if (lastErr){
			return;
		};
		var resultInfo;
		for (resultInfo of results){
			var result=resultInfo.result;
			if(typeof(result)==="undefined"){
				continue;
			};
			var url=""+result;
			if(url.length>0){
				BrowserAutomaton.processTabUrl(tabId, url, tab.openerTabId);
			};
		};		
	});
};

BrowserAutomaton.matchString=function(str,what_){
	return (new RegExp(what_,"i")).test(str);
};

BrowserAutomaton.processProtect=function(state,details){
	if(state.protect){
		if(state.protect.code){
			if(Array.isArray(state.protect.url)){
				for(var m=0;m<state.protect.url.length;++m){
					if(BrowserAutomaton.matchString(details.url,state.protect.url[m])){
						chrome.scripting.executeScript({
							target:{tabId: details.tabId, frameIds: [details.frameId], runAt: "document_start"},
							func: state.protect.code
						},function(results){
							const lastErr = chrome.runtime.lastError;
							if (lastErr){
								return;
							};
							state.protect.isProtected=true;
						});
					};
				};
			};
		};
	};	
};

BrowserAutomaton.processFirewall=function(state,details){
	if(state.firewall){			
		if(Array.isArray(state.firewall.allow)){
			for(var m=0;m<state.firewall.allow.length;++m){
				if(BrowserAutomaton.matchString(details.url,state.firewall.allow[m])){
					return;
				};
			};
		};			
		if(Array.isArray(state.firewall.deny)){
			for(var m=0;m<state.firewall.deny.length;++m){
				if(BrowserAutomaton.matchString(details.url,state.firewall.deny[m])){
					var url="about:blank";
					if(state.firewall.url){
							url=state.firewall.url;
					};
					if(details.url!==url){
						chrome.scripting.executeScript({
							target:{tabId: details.tabId, frameIds: [details.frameId], runAt: "document_start"},
							func: function(url){
								document.location.assign(url);
							},
							args: [url]
						},function(results){
							const lastErr = chrome.runtime.lastError;
							if (lastErr){
								return;
							};							
						});						
						return;
					};
				};
			};
		};
	};	
};

BrowserAutomaton.listenTab=function(tabId,tab){
	if(typeof(tab.status) === "undefined"){
		setTimeout(function(){
			BrowserAutomaton.listenTab(tabId,tab);
		},1000);
		return;
	};

	if(tab.status === "complete"){
		BrowserAutomaton.processTab(tabId, tab);
	};
};

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
	BrowserAutomaton.loadStates(function(){
		if (changeInfo.status === "complete"){
			BrowserAutomaton.processTab(tabId, tab);
			return;
		};
		if(typeof(changeInfo.status) === "undefined"){
			if(tab.status === "complete"){
				BrowserAutomaton.processTab(tabId, tab);
				return;
			};
			BrowserAutomaton.listenTab(tabId, tab);
		};
	});
});

chrome.webNavigation.onCommitted.addListener(function(details){
	BrowserAutomaton.loadStates(function(){
		for(var k=0;k<BrowserAutomaton.states.length;++k){
			BrowserAutomaton.processProtect(BrowserAutomaton.states[k].state,details);
			BrowserAutomaton.processFirewall(BrowserAutomaton.states[k].state,details);
		};
	});
});

chrome.tabs.query({currentWindow:true,status:"complete"},function(tabs){
	BrowserAutomaton.loadStates(function(){
		for(var k=0; k<tabs.length; ++k){
			BrowserAutomaton.processTab(tabs[k].id, tabs[k]);
		};
	});
});

chrome.runtime.onStartup.addListener(function(){
	BrowserAutomaton.states=[];
	BrowserAutomaton.saveStates();
});
