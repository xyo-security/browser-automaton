//
// Browser Automaton Extension
//
// Copyright (c) 2020 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// The MIT License (MIT) <http://opensource.org/licenses/MIT>
//

var BrowserAutomatonOptions= {};

BrowserAutomatonOptions.allowedLink=[];

BrowserAutomatonOptions.getOptions=function() {
	chrome.storage.sync.get({
		allowedLink: '[]'
	}, function(items) {
		try {
			BrowserAutomatonOptions.allowedLink=JSON.parse(items.allowedLink);
		} catch(e) {
			BrowserAutomatonOptions.allowedLink=[];
		};
		BrowserAutomatonOptions.updateOptions();
	});
};

BrowserAutomatonOptions.setOptions=function() {
	chrome.storage.sync.set({
		allowedLink: JSON.stringify(BrowserAutomatonOptions.allowedLink)
	}, function() {
		(document.getElementById("allowed-link-status")).innerHTML="<span style=\"color:#008800;\">Settings saved!</span>";
	});
};

BrowserAutomatonOptions.loadOptions=function() {
	BrowserAutomatonOptions.getOptions();
};

BrowserAutomatonOptions.updateOptions=function() {
	var value="";
	for(k=0; k<BrowserAutomatonOptions.allowedLink.length; ++k) {
		value+=BrowserAutomatonOptions.allowedLink[k]+"\r\n";
	};
	document.forms["save"].elements["allowed-link"].value=value;
};

BrowserAutomatonOptions.saveOptions=function() {
	var value=(""+document.forms["save"].elements["allowed-link"].value).trim();
	var items=value.split("\n");
	var list=[];
	var listIndex=0;
	for(k=0; k<items.length; ++k) {
		items[k]=(items[k].replace("\r","")).trim();
		if((""+items[k]).length>0) {
			list[listIndex]=items[k];
			++listIndex;
		};
	};
	BrowserAutomatonOptions.allowedLink=list;
	BrowserAutomatonOptions.setOptions();
};

BrowserAutomatonOptions.windowLoad=function() {
	window.removeEventListener("load", BrowserAutomatonOptions.windowLoad);

	document.getElementById("allowed-link-btn").onclick=function() {
		BrowserAutomatonOptions.saveOptions();
	};

	BrowserAutomatonOptions.loadOptions();

};

window.addEventListener("load", BrowserAutomatonOptions.windowLoad);

