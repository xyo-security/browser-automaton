//
// Browser Automaton Extension
//
// Copyright (c) 2020 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// The MIT License (MIT) <http://opensource.org/licenses/MIT>
//

// Chrome extension

var BrowserAutomaton= {};

BrowserAutomaton.allowedLink=[];

BrowserAutomaton.getOptions=function(fnNext) {
	chrome.storage.sync.get({
		allowedLink: "[]"
	}, function(items) {
		try {
			BrowserAutomaton.allowedLink=JSON.parse(items.allowedLink);
		} catch(e) {
			BrowserAutomaton.allowedLink=[];
		};
		fnNext();
	});
};

BrowserAutomaton.states=[];

BrowserAutomaton.stringEndsWith=function(str, suffix){
    return str.indexOf(suffix, str.length - suffix.length) === (str.length - suffix.length);
};

BrowserAutomaton.mergeObject=function(obj1,obj2){
	if(typeof(obj2)==="object"){
		if(obj2 != null){
			Object.keys(obj2).forEach(function(key) {
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

BrowserAutomaton.processState=function(tabId,index,url,fnName,openerTabId){
	if(typeof(BrowserAutomaton.states[index].code)==="undefined"){
		return;
	};
	BrowserAutomaton.states[index].state.index=index;
	BrowserAutomaton.states[index].state.id=tabId;
	BrowserAutomaton.states[index].state.parentId=openerTabId;
	BrowserAutomaton.states[index].state.url=url;
	BrowserAutomaton.states[index].state.version="3.0";
	chrome.tabs.executeScript(tabId, {
		matchAboutBlank: true,
		code: "(function(){"+BrowserAutomaton.states[index].code+";return "+fnName+".call("+JSON.stringify(BrowserAutomaton.states[index].state)+");})();"
	},function(result){
		if(typeof(result)==="undefined"){
			return;
		};
		if(result.length>0){
			var code=result[0];
			if(typeof(code)==="undefined"){
				return;
			};
			BrowserAutomaton.mergeObject(BrowserAutomaton.states[index].state,code);
			if(BrowserAutomaton.states[index].state.processEnd){
				delete BrowserAutomaton.states[index];
			};
			if(BrowserAutomaton.states[index].state.processEndAndKeepFirewall){
				BrowserAutomaton.states[index].code=undefined;
			};
		};
	});
};

BrowserAutomaton.elId="_900f26b2be9dd71e165c97b8168310eeeb1c7ef878d3cc2fa3d3f177e103ff21";
BrowserAutomaton.fnName="_3dc656c5131d62c8fac57caec67613bb6ccbb05476c8ad39c785cbf5a5af348d";
BrowserAutomaton.fnCheck="44d5333afbc046f0a4a00e86c2b5bbbd35e2fab8d2902d973e8030e419baa591";

BrowserAutomaton.process=function(elId,tabId,fnName,fnCheck) {

	var automatonElement=document.getElementById(elId);
	if(automatonElement) {
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

BrowserAutomaton.processResponse=function(tabId,url) {
	var counter=0;
	var processEvent=function(){
		chrome.tabs.executeScript(tabId, {
			matchAboutBlank: true,
			code: "document.getElementById(\""+BrowserAutomaton.elId+"\").innerHTML;"
		},function(result) {
			if(typeof(result)==="undefined"){
				return;
			};
			if(result.length>0){
				var code=result[0];
				if(typeof(code)==="undefined"){
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
						protect: {
							url: [],
							code: undefined,
							isProtected: false
						}
					},
					code: atob(code)
				};
				BrowserAutomaton.processState(tabId,index,url,"init");
				return;
			};
			++counter;
			if(counter>15){
				return;
			};
			setTimeout(function() {
				processEvent();
			},1000);
		});
	};
	processEvent();
};

BrowserAutomaton.processLink=function(tabId,url) {
	chrome.tabs.executeScript(tabId, {
		matchAboutBlank: true,
		code: "("+BrowserAutomaton.process+").apply(undefined,"+JSON.stringify([
			BrowserAutomaton.elId,
			tabId,
			BrowserAutomaton.fnName,
			BrowserAutomaton.fnCheck
		])+");"
	},function(result) {
		if(typeof(result)==="undefined"){
			return;
		};
		if((""+result)===BrowserAutomaton.fnCheck) {
			BrowserAutomaton.processResponse(tabId,url);
		};
	});
};

BrowserAutomaton.processTab=function(tabId, tab) {
	if(tab.url.indexOf("extension=23ab9c0e7b432f42000005202e2cfa11889bd299e36232cc53dbc91bc384f9b3")>=0) {
		if((tab.url.indexOf("://localhost/")>=0)||BrowserAutomaton.matchString(tab.url,"://localhost:.*/")) {
			BrowserAutomaton.processLink(tabId);
			return;
		};
		BrowserAutomaton.getOptions(function() {
			if(Array.isArray(BrowserAutomaton.allowedLink)) {
				for(k=0; k<BrowserAutomaton.allowedLink.length; ++k) {
					if(BrowserAutomaton.allowedLink[k].length>4) {
						if(BrowserAutomaton.matchString(tab.url,"://"+BrowserAutomaton.allowedLink[k])) {
							BrowserAutomaton.processLink(tabId,tab.url);
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
				if(BrowserAutomaton.matchString(tab.url,BrowserAutomaton.states[k].state.action[m])) {
					BrowserAutomaton.processState(tabId,k,tab.url,"processUrl",tab.openerTabId);
				};
			};
		};
	};
};

BrowserAutomaton.listenTab=function(tabId,tab) {
	if(typeof(tab.status) === "undefined") {
		setTimeout(function() {
			BrowserAutomaton.listenTab(tabId,tab);
		},1000);
		return;
	};

	if(tab.status === "complete") {
		BrowserAutomaton.processTab(tabId, tab);
	};
};

BrowserAutomaton.matchString=function(str,what_) {
	return (new RegExp(what_,"i")).test(str);
};

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (changeInfo.status === "complete") {
		BrowserAutomaton.processTab(tabId, tab);
		return;
	};
	if(typeof(changeInfo.status) === "undefined") {
		if(tab.status === "complete") {
			BrowserAutomaton.processTab(tabId, tab);
			return;
		};
		BrowserAutomaton.listenTab(tabId, tab);
	};
});

BrowserAutomaton.processProtect=function(state,details){
	if(state.protect){
		if(state.protect.code){
			if(Array.isArray(state.protect.url)){
				for(var m=0;m<state.protect.url.length;++m){
					if(BrowserAutomaton.matchString(details.url,state.protect.url[m])){
						chrome.tabs.executeScript(details.tabId, {
							matchAboutBlank: true,
							allFrames: true,
							frameId: details.frameId,
							code: state.protect.code,
							runAt: "document_start"
						},function(result){
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
						chrome.tabs.executeScript(details.tabId, {
							matchAboutBlank: true,
							allFrames: true,
							frameId: details.frameId,
							code: "document.location.assign(\""+url+"\");",
							runAt: "document_start"
						});
						return;
					};
				};
			};
		};
	};
	
};

chrome.webNavigation.onCommitted.addListener(function(details){
	for(var k=0;k<BrowserAutomaton.states.length;++k){
		BrowserAutomaton.processProtect(BrowserAutomaton.states[k].state,details);
		BrowserAutomaton.processFirewall(BrowserAutomaton.states[k].state,details);
	};
});

chrome.tabs.query({currentWindow:true,status:"complete"},function(tabs) {
	for(var k=0; k<tabs.length; ++k) {
		BrowserAutomaton.processTab(tabs[k].id, tabs[k]);
	};
});

chrome.runtime.onMessage.addListener(function(request, sender){
	if(sender.tab){
		if(typeof(request)!="undefined"){
			if(typeof(request)==="object"){
				if(request!=null){
					if(typeof(request.index)!="undefined"){
						BrowserAutomaton.mergeObject(BrowserAutomaton.states[request.index].state,request);
						return;
					};
					for(var k=0;k<BrowserAutomaton.states.length;++k){
						if(BrowserAutomaton.states[k].state.id==sender.tab.id){
							if(request.id==BrowserAutomaton.states[k].state.id){
								BrowserAutomaton.mergeObject(BrowserAutomaton.states[k].state,request);
							};
							break;
						};
					};
				};
			};
		};
	};
});

