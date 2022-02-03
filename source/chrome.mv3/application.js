//
// Browser Automaton Extension
//
// Copyright (c) 2020-2022 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// The MIT License (MIT) <http://opensource.org/licenses/MIT>
//

// Chrome extension

var BrowserAutomaton={};

BrowserAutomaton.elId="_900f26b2be9dd71e165c97b8168310eeeb1c7ef878d3cc2fa3d3f177e103ff21";
BrowserAutomaton.elIdRun="_590a37958908ab6e6fa2ad8aa331a58c536a024c9ef244ef4a556fa858604d38";
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

BrowserAutomaton.initStateCall=function(index,elId,fnCheck){
	var el= document.getElementById(elId);
	if(el){
		return fnCheck;
	};
	el=document.createElement("div");
	el.id = elId;
	el.style.display = "none";
	el.innerHTML = "";
	document.body.appendChild(el);
	el.addEventListener("click",function(){
		chrome.runtime.sendMessage({
			message: "state",
			index: index,
			state: el.innerHTML,
			div: elId
		});
	})
	return fnCheck;
};

BrowserAutomaton.interpretCode=function(codeToRun){
// <Library>

//
// Acorn v8.7.0
//
// Acorn is a tiny, fast JavaScript parser written in JavaScript.
//
// https://github.com/acornjs/acorn
// https://cdnjs.com/libraries/acorn
//
// MIT License
// Copyright (C) 2012-2022 by various contributors (see AUTHORS)
//

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.acorn = {}));
  })(this, (function (exports) { 'use strict';
  
	// Reserved word lists for various dialects of the language
  
	var reservedWords = {
	  3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
	  5: "class enum extends super const export import",
	  6: "enum",
	  strict: "implements interface let package private protected public static yield",
	  strictBind: "eval arguments"
	};
  
	// And the keywords
  
	var ecma5AndLessKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";
  
	var keywords$1 = {
	  5: ecma5AndLessKeywords,
	  "5module": ecma5AndLessKeywords + " export import",
	  6: ecma5AndLessKeywords + " const class extends export import super"
	};
  
	var keywordRelationalOperator = /^in(stanceof)?$/;
  
	// ## Character categories
  
	// Big ugly regular expressions that match characters in the
	// whitespace, identifier, and identifier-start categories. These
	// are only applied when a character is found to actually have a
	// code point above 128.
	// Generated by `bin/generate-identifier-regex.js`.
	var nonASCIIidentifierStartChars = "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u052f\u0531-\u0556\u0559\u0560-\u0588\u05d0-\u05ea\u05ef-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u0860-\u086a\u0870-\u0887\u0889-\u088e\u08a0-\u08c9\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u09fc\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0af9\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d\u0c58-\u0c5a\u0c5d\u0c60\u0c61\u0c80\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cdd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d04-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d54-\u0d56\u0d5f-\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e86-\u0e8a\u0e8c-\u0ea3\u0ea5\u0ea7-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f5\u13f8-\u13fd\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f8\u1700-\u1711\u171f-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1878\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191e\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4c\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1c80-\u1c88\u1c90-\u1cba\u1cbd-\u1cbf\u1ce9-\u1cec\u1cee-\u1cf3\u1cf5\u1cf6\u1cfa\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2118-\u211d\u2124\u2126\u2128\u212a-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309b-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312f\u3131-\u318e\u31a0-\u31bf\u31f0-\u31ff\u3400-\u4dbf\u4e00-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua69d\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua7ca\ua7d0\ua7d1\ua7d3\ua7d5-\ua7d9\ua7f2-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua8fd\ua8fe\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\ua9e0-\ua9e4\ua9e6-\ua9ef\ua9fa-\ua9fe\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa7e-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab69\uab70-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc";
	var nonASCIIidentifierChars = "\u200c\u200d\xb7\u0300-\u036f\u0387\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u0669\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0711\u0730-\u074a\u07a6-\u07b0\u07c0-\u07c9\u07eb-\u07f3\u07fd\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0859-\u085b\u0898-\u089f\u08ca-\u08e1\u08e3-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09cb-\u09cd\u09d7\u09e2\u09e3\u09e6-\u09ef\u09fe\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2\u0ae3\u0ae6-\u0aef\u0afa-\u0aff\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b55-\u0b57\u0b62\u0b63\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c00-\u0c04\u0c3c\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0c66-\u0c6f\u0c81-\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0ce6-\u0cef\u0d00-\u0d03\u0d3b\u0d3c\u0d3e-\u0d44\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0d62\u0d63\u0d66-\u0d6f\u0d81-\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0de6-\u0def\u0df2\u0df3\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0e50-\u0e59\u0eb1\u0eb4-\u0ebc\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e\u0f3f\u0f71-\u0f84\u0f86\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u102b-\u103e\u1040-\u1049\u1056-\u1059\u105e-\u1060\u1062-\u1064\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u1369-\u1371\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17b4-\u17d3\u17dd\u17e0-\u17e9\u180b-\u180d\u180f-\u1819\u18a9\u1920-\u192b\u1930-\u193b\u1946-\u194f\u19d0-\u19da\u1a17-\u1a1b\u1a55-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1ab0-\u1abd\u1abf-\u1ace\u1b00-\u1b04\u1b34-\u1b44\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1b82\u1ba1-\u1bad\u1bb0-\u1bb9\u1be6-\u1bf3\u1c24-\u1c37\u1c40-\u1c49\u1c50-\u1c59\u1cd0-\u1cd2\u1cd4-\u1ce8\u1ced\u1cf4\u1cf7-\u1cf9\u1dc0-\u1dff\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2cef-\u2cf1\u2d7f\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua620-\ua629\ua66f\ua674-\ua67d\ua69e\ua69f\ua6f0\ua6f1\ua802\ua806\ua80b\ua823-\ua827\ua82c\ua880\ua881\ua8b4-\ua8c5\ua8d0-\ua8d9\ua8e0-\ua8f1\ua8ff-\ua909\ua926-\ua92d\ua947-\ua953\ua980-\ua983\ua9b3-\ua9c0\ua9d0-\ua9d9\ua9e5\ua9f0-\ua9f9\uaa29-\uaa36\uaa43\uaa4c\uaa4d\uaa50-\uaa59\uaa7b-\uaa7d\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uaaeb-\uaaef\uaaf5\uaaf6\uabe3-\uabea\uabec\uabed\uabf0-\uabf9\ufb1e\ufe00-\ufe0f\ufe20-\ufe2f\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f";
  
	var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
	var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
  
	nonASCIIidentifierStartChars = nonASCIIidentifierChars = null;
  
	// These are a run-length and offset encoded representation of the
	// >0xffff code points that are a valid part of identifiers. The
	// offset starts at 0x10000, and each pair of numbers represents an
	// offset to the next range, and then a size of the range. They were
	// generated by bin/generate-identifier-regex.js
  
	// eslint-disable-next-line comma-spacing
	var astralIdentifierStartCodes = [0,11,2,25,2,18,2,1,2,14,3,13,35,122,70,52,268,28,4,48,48,31,14,29,6,37,11,29,3,35,5,7,2,4,43,157,19,35,5,35,5,39,9,51,13,10,2,14,2,6,2,1,2,10,2,14,2,6,2,1,68,310,10,21,11,7,25,5,2,41,2,8,70,5,3,0,2,43,2,1,4,0,3,22,11,22,10,30,66,18,2,1,11,21,11,25,71,55,7,1,65,0,16,3,2,2,2,28,43,28,4,28,36,7,2,27,28,53,11,21,11,18,14,17,111,72,56,50,14,50,14,35,349,41,7,1,79,28,11,0,9,21,43,17,47,20,28,22,13,52,58,1,3,0,14,44,33,24,27,35,30,0,3,0,9,34,4,0,13,47,15,3,22,0,2,0,36,17,2,24,85,6,2,0,2,3,2,14,2,9,8,46,39,7,3,1,3,21,2,6,2,1,2,4,4,0,19,0,13,4,159,52,19,3,21,2,31,47,21,1,2,0,185,46,42,3,37,47,21,0,60,42,14,0,72,26,38,6,186,43,117,63,32,7,3,0,3,7,2,1,2,23,16,0,2,0,95,7,3,38,17,0,2,0,29,0,11,39,8,0,22,0,12,45,20,0,19,72,264,8,2,36,18,0,50,29,113,6,2,1,2,37,22,0,26,5,2,1,2,31,15,0,328,18,190,0,80,921,103,110,18,195,2637,96,16,1070,4050,582,8634,568,8,30,18,78,18,29,19,47,17,3,32,20,6,18,689,63,129,74,6,0,67,12,65,1,2,0,29,6135,9,1237,43,8,8936,3,2,6,2,1,2,290,46,2,18,3,9,395,2309,106,6,12,4,8,8,9,5991,84,2,70,2,1,3,0,3,1,3,3,2,11,2,0,2,6,2,64,2,3,3,7,2,6,2,27,2,3,2,4,2,0,4,6,2,339,3,24,2,24,2,30,2,24,2,30,2,24,2,30,2,24,2,30,2,24,2,7,1845,30,482,44,11,6,17,0,322,29,19,43,1269,6,2,3,2,1,2,14,2,196,60,67,8,0,1205,3,2,26,2,1,2,0,3,0,2,9,2,3,2,0,2,0,7,0,5,0,2,0,2,0,2,2,2,1,2,0,3,0,2,0,2,0,2,0,2,0,2,1,2,0,3,3,2,6,2,3,2,3,2,0,2,9,2,16,6,2,2,4,2,16,4421,42719,33,4152,8,221,3,5761,15,7472,3104,541,1507,4938];
  
	// eslint-disable-next-line comma-spacing
	var astralIdentifierCodes = [509,0,227,0,150,4,294,9,1368,2,2,1,6,3,41,2,5,0,166,1,574,3,9,9,370,1,154,10,50,3,123,2,54,14,32,10,3,1,11,3,46,10,8,0,46,9,7,2,37,13,2,9,6,1,45,0,13,2,49,13,9,3,2,11,83,11,7,0,161,11,6,9,7,3,56,1,2,6,3,1,3,2,10,0,11,1,3,6,4,4,193,17,10,9,5,0,82,19,13,9,214,6,3,8,28,1,83,16,16,9,82,12,9,9,84,14,5,9,243,14,166,9,71,5,2,1,3,3,2,0,2,1,13,9,120,6,3,6,4,0,29,9,41,6,2,3,9,0,10,10,47,15,406,7,2,7,17,9,57,21,2,13,123,5,4,0,2,1,2,6,2,0,9,9,49,4,2,1,2,4,9,9,330,3,19306,9,87,9,39,4,60,6,26,9,1014,0,2,54,8,3,82,0,12,1,19628,1,4706,45,3,22,543,4,4,5,9,7,3,6,31,3,149,2,1418,49,513,54,5,49,9,0,15,0,23,4,2,14,1361,6,2,16,3,6,2,1,2,4,262,6,10,9,357,0,62,13,1495,6,110,6,6,9,4759,9,787719,239];
  
	// This has a complexity linear to the value of the code. The
	// assumption is that looking up astral identifier characters is
	// rare.
	function isInAstralSet(code, set) {
	  var pos = 0x10000;
	  for (var i = 0; i < set.length; i += 2) {
		pos += set[i];
		if (pos > code) { return false }
		pos += set[i + 1];
		if (pos >= code) { return true }
	  }
	}
  
	// Test whether a given character code starts an identifier.
  
	function isIdentifierStart(code, astral) {
	  if (code < 65) { return code === 36 }
	  if (code < 91) { return true }
	  if (code < 97) { return code === 95 }
	  if (code < 123) { return true }
	  if (code <= 0xffff) { return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code)) }
	  if (astral === false) { return false }
	  return isInAstralSet(code, astralIdentifierStartCodes)
	}
  
	// Test whether a given character is part of an identifier.
  
	function isIdentifierChar(code, astral) {
	  if (code < 48) { return code === 36 }
	  if (code < 58) { return true }
	  if (code < 65) { return false }
	  if (code < 91) { return true }
	  if (code < 97) { return code === 95 }
	  if (code < 123) { return true }
	  if (code <= 0xffff) { return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code)) }
	  if (astral === false) { return false }
	  return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes)
	}
  
	// ## Token types
  
	// The assignment of fine-grained, information-carrying type objects
	// allows the tokenizer to store the information it has about a
	// token in a way that is very cheap for the parser to look up.
  
	// All token type variables start with an underscore, to make them
	// easy to recognize.
  
	// The `beforeExpr` property is used to disambiguate between regular
	// expressions and divisions. It is set on all token types that can
	// be followed by an expression (thus, a slash after them would be a
	// regular expression).
	//
	// The `startsExpr` property is used to check if the token ends a
	// `yield` expression. It is set on all token types that either can
	// directly start an expression (like a quotation mark) or can
	// continue an expression (like the body of a string).
	//
	// `isLoop` marks a keyword as starting a loop, which is important
	// to know when parsing a label, in order to allow or disallow
	// continue jumps to that label.
  
	var TokenType = function TokenType(label, conf) {
	  if ( conf === void 0 ) conf = {};
  
	  this.label = label;
	  this.keyword = conf.keyword;
	  this.beforeExpr = !!conf.beforeExpr;
	  this.startsExpr = !!conf.startsExpr;
	  this.isLoop = !!conf.isLoop;
	  this.isAssign = !!conf.isAssign;
	  this.prefix = !!conf.prefix;
	  this.postfix = !!conf.postfix;
	  this.binop = conf.binop || null;
	  this.updateContext = null;
	};
  
	function binop(name, prec) {
	  return new TokenType(name, {beforeExpr: true, binop: prec})
	}
	var beforeExpr = {beforeExpr: true}, startsExpr = {startsExpr: true};
  
	// Map keyword names to token types.
  
	var keywords = {};
  
	// Succinct definitions of keyword token types
	function kw(name, options) {
	  if ( options === void 0 ) options = {};
  
	  options.keyword = name;
	  return keywords[name] = new TokenType(name, options)
	}
  
	var types$1 = {
	  num: new TokenType("num", startsExpr),
	  regexp: new TokenType("regexp", startsExpr),
	  string: new TokenType("string", startsExpr),
	  name: new TokenType("name", startsExpr),
	  privateId: new TokenType("privateId", startsExpr),
	  eof: new TokenType("eof"),
  
	  // Punctuation token types.
	  bracketL: new TokenType("[", {beforeExpr: true, startsExpr: true}),
	  bracketR: new TokenType("]"),
	  braceL: new TokenType("{", {beforeExpr: true, startsExpr: true}),
	  braceR: new TokenType("}"),
	  parenL: new TokenType("(", {beforeExpr: true, startsExpr: true}),
	  parenR: new TokenType(")"),
	  comma: new TokenType(",", beforeExpr),
	  semi: new TokenType(";", beforeExpr),
	  colon: new TokenType(":", beforeExpr),
	  dot: new TokenType("."),
	  question: new TokenType("?", beforeExpr),
	  questionDot: new TokenType("?."),
	  arrow: new TokenType("=>", beforeExpr),
	  template: new TokenType("template"),
	  invalidTemplate: new TokenType("invalidTemplate"),
	  ellipsis: new TokenType("...", beforeExpr),
	  backQuote: new TokenType("`", startsExpr),
	  dollarBraceL: new TokenType("${", {beforeExpr: true, startsExpr: true}),
  
	  // Operators. These carry several kinds of properties to help the
	  // parser use them properly (the presence of these properties is
	  // what categorizes them as operators).
	  //
	  // `binop`, when present, specifies that this operator is a binary
	  // operator, and will refer to its precedence.
	  //
	  // `prefix` and `postfix` mark the operator as a prefix or postfix
	  // unary operator.
	  //
	  // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
	  // binary operators with a very low precedence, that should result
	  // in AssignmentExpression nodes.
  
	  eq: new TokenType("=", {beforeExpr: true, isAssign: true}),
	  assign: new TokenType("_=", {beforeExpr: true, isAssign: true}),
	  incDec: new TokenType("++/--", {prefix: true, postfix: true, startsExpr: true}),
	  prefix: new TokenType("!/~", {beforeExpr: true, prefix: true, startsExpr: true}),
	  logicalOR: binop("||", 1),
	  logicalAND: binop("&&", 2),
	  bitwiseOR: binop("|", 3),
	  bitwiseXOR: binop("^", 4),
	  bitwiseAND: binop("&", 5),
	  equality: binop("==/!=/===/!==", 6),
	  relational: binop("</>/<=/>=", 7),
	  bitShift: binop("<</>>/>>>", 8),
	  plusMin: new TokenType("+/-", {beforeExpr: true, binop: 9, prefix: true, startsExpr: true}),
	  modulo: binop("%", 10),
	  star: binop("*", 10),
	  slash: binop("/", 10),
	  starstar: new TokenType("**", {beforeExpr: true}),
	  coalesce: binop("??", 1),
  
	  // Keyword token types.
	  _break: kw("break"),
	  _case: kw("case", beforeExpr),
	  _catch: kw("catch"),
	  _continue: kw("continue"),
	  _debugger: kw("debugger"),
	  _default: kw("default", beforeExpr),
	  _do: kw("do", {isLoop: true, beforeExpr: true}),
	  _else: kw("else", beforeExpr),
	  _finally: kw("finally"),
	  _for: kw("for", {isLoop: true}),
	  _function: kw("function", startsExpr),
	  _if: kw("if"),
	  _return: kw("return", beforeExpr),
	  _switch: kw("switch"),
	  _throw: kw("throw", beforeExpr),
	  _try: kw("try"),
	  _var: kw("var"),
	  _const: kw("const"),
	  _while: kw("while", {isLoop: true}),
	  _with: kw("with"),
	  _new: kw("new", {beforeExpr: true, startsExpr: true}),
	  _this: kw("this", startsExpr),
	  _super: kw("super", startsExpr),
	  _class: kw("class", startsExpr),
	  _extends: kw("extends", beforeExpr),
	  _export: kw("export"),
	  _import: kw("import", startsExpr),
	  _null: kw("null", startsExpr),
	  _true: kw("true", startsExpr),
	  _false: kw("false", startsExpr),
	  _in: kw("in", {beforeExpr: true, binop: 7}),
	  _instanceof: kw("instanceof", {beforeExpr: true, binop: 7}),
	  _typeof: kw("typeof", {beforeExpr: true, prefix: true, startsExpr: true}),
	  _void: kw("void", {beforeExpr: true, prefix: true, startsExpr: true}),
	  _delete: kw("delete", {beforeExpr: true, prefix: true, startsExpr: true})
	};
  
	// Matches a whole line break (where CRLF is considered a single
	// line break). Used to count lines.
  
	var lineBreak = /\r\n?|\n|\u2028|\u2029/;
	var lineBreakG = new RegExp(lineBreak.source, "g");
  
	function isNewLine(code) {
	  return code === 10 || code === 13 || code === 0x2028 || code === 0x2029
	}
  
	function nextLineBreak(code, from, end) {
	  if ( end === void 0 ) end = code.length;
  
	  for (var i = from; i < end; i++) {
		var next = code.charCodeAt(i);
		if (isNewLine(next))
		  { return i < end - 1 && next === 13 && code.charCodeAt(i + 1) === 10 ? i + 2 : i + 1 }
	  }
	  return -1
	}
  
	var nonASCIIwhitespace = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
  
	var skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;
  
	var ref = Object.prototype;
	var hasOwnProperty = ref.hasOwnProperty;
	var toString = ref.toString;
  
	var hasOwn = Object.hasOwn || (function (obj, propName) { return (
	  hasOwnProperty.call(obj, propName)
	); });
  
	var isArray = Array.isArray || (function (obj) { return (
	  toString.call(obj) === "[object Array]"
	); });
  
	function wordsRegexp(words) {
	  return new RegExp("^(?:" + words.replace(/ /g, "|") + ")$")
	}
  
	var loneSurrogate = /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/;
  
	// These are used when `options.locations` is on, for the
	// `startLoc` and `endLoc` properties.
  
	var Position = function Position(line, col) {
	  this.line = line;
	  this.column = col;
	};
  
	Position.prototype.offset = function offset (n) {
	  return new Position(this.line, this.column + n)
	};
  
	var SourceLocation = function SourceLocation(p, start, end) {
	  this.start = start;
	  this.end = end;
	  if (p.sourceFile !== null) { this.source = p.sourceFile; }
	};
  
	// The `getLineInfo` function is mostly useful when the
	// `locations` option is off (for performance reasons) and you
	// want to find the line/column position for a given character
	// offset. `input` should be the code string that the offset refers
	// into.
  
	function getLineInfo(input, offset) {
	  for (var line = 1, cur = 0;;) {
		var nextBreak = nextLineBreak(input, cur, offset);
		if (nextBreak < 0) { return new Position(line, offset - cur) }
		++line;
		cur = nextBreak;
	  }
	}
  
	// A second argument must be given to configure the parser process.
	// These options are recognized (only `ecmaVersion` is required):
  
	var defaultOptions = {
	  // `ecmaVersion` indicates the ECMAScript version to parse. Must be
	  // either 3, 5, 6 (or 2015), 7 (2016), 8 (2017), 9 (2018), 10
	  // (2019), 11 (2020), 12 (2021), 13 (2022), or `"latest"` (the
	  // latest version the library supports). This influences support
	  // for strict mode, the set of reserved words, and support for
	  // new syntax features.
	  ecmaVersion: null,
	  // `sourceType` indicates the mode the code should be parsed in.
	  // Can be either `"script"` or `"module"`. This influences global
	  // strict mode and parsing of `import` and `export` declarations.
	  sourceType: "script",
	  // `onInsertedSemicolon` can be a callback that will be called
	  // when a semicolon is automatically inserted. It will be passed
	  // the position of the comma as an offset, and if `locations` is
	  // enabled, it is given the location as a `{line, column}` object
	  // as second argument.
	  onInsertedSemicolon: null,
	  // `onTrailingComma` is similar to `onInsertedSemicolon`, but for
	  // trailing commas.
	  onTrailingComma: null,
	  // By default, reserved words are only enforced if ecmaVersion >= 5.
	  // Set `allowReserved` to a boolean value to explicitly turn this on
	  // an off. When this option has the value "never", reserved words
	  // and keywords can also not be used as property names.
	  allowReserved: null,
	  // When enabled, a return at the top level is not considered an
	  // error.
	  allowReturnOutsideFunction: false,
	  // When enabled, import/export statements are not constrained to
	  // appearing at the top of the program, and an import.meta expression
	  // in a script isn't considered an error.
	  allowImportExportEverywhere: false,
	  // By default, await identifiers are allowed to appear at the top-level scope only if ecmaVersion >= 2022.
	  // When enabled, await identifiers are allowed to appear at the top-level scope,
	  // but they are still not allowed in non-async functions.
	  allowAwaitOutsideFunction: null,
	  // When enabled, super identifiers are not constrained to
	  // appearing in methods and do not raise an error when they appear elsewhere.
	  allowSuperOutsideMethod: null,
	  // When enabled, hashbang directive in the beginning of file
	  // is allowed and treated as a line comment.
	  allowHashBang: false,
	  // When `locations` is on, `loc` properties holding objects with
	  // `start` and `end` properties in `{line, column}` form (with
	  // line being 1-based and column 0-based) will be attached to the
	  // nodes.
	  locations: false,
	  // A function can be passed as `onToken` option, which will
	  // cause Acorn to call that function with object in the same
	  // format as tokens returned from `tokenizer().getToken()`. Note
	  // that you are not allowed to call the parser from the
	  // callback—that will corrupt its internal state.
	  onToken: null,
	  // A function can be passed as `onComment` option, which will
	  // cause Acorn to call that function with `(block, text, start,
	  // end)` parameters whenever a comment is skipped. `block` is a
	  // boolean indicating whether this is a block (`/* */`) comment,
	  // `text` is the content of the comment, and `start` and `end` are
	  // character offsets that denote the start and end of the comment.
	  // When the `locations` option is on, two more parameters are
	  // passed, the full `{line, column}` locations of the start and
	  // end of the comments. Note that you are not allowed to call the
	  // parser from the callback—that will corrupt its internal state.
	  onComment: null,
	  // Nodes have their start and end characters offsets recorded in
	  // `start` and `end` properties (directly on the node, rather than
	  // the `loc` object, which holds line/column data. To also add a
	  // [semi-standardized][range] `range` property holding a `[start,
	  // end]` array with the same numbers, set the `ranges` option to
	  // `true`.
	  //
	  // [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
	  ranges: false,
	  // It is possible to parse multiple files into a single AST by
	  // passing the tree produced by parsing the first file as
	  // `program` option in subsequent parses. This will add the
	  // toplevel forms of the parsed file to the `Program` (top) node
	  // of an existing parse tree.
	  program: null,
	  // When `locations` is on, you can pass this to record the source
	  // file in every node's `loc` object.
	  sourceFile: null,
	  // This value, if given, is stored in every node, whether
	  // `locations` is on or off.
	  directSourceFile: null,
	  // When enabled, parenthesized expressions are represented by
	  // (non-standard) ParenthesizedExpression nodes
	  preserveParens: false
	};
  
	// Interpret and default an options object
  
	var warnedAboutEcmaVersion = false;
  
	function getOptions(opts) {
	  var options = {};
  
	  for (var opt in defaultOptions)
		{ options[opt] = opts && hasOwn(opts, opt) ? opts[opt] : defaultOptions[opt]; }
  
	  if (options.ecmaVersion === "latest") {
		options.ecmaVersion = 1e8;
	  } else if (options.ecmaVersion == null) {
		if (!warnedAboutEcmaVersion && typeof console === "object" && console.warn) {
		  warnedAboutEcmaVersion = true;
		  console.warn("Since Acorn 8.0.0, options.ecmaVersion is required.\nDefaulting to 2020, but this will stop working in the future.");
		}
		options.ecmaVersion = 11;
	  } else if (options.ecmaVersion >= 2015) {
		options.ecmaVersion -= 2009;
	  }
  
	  if (options.allowReserved == null)
		{ options.allowReserved = options.ecmaVersion < 5; }
  
	  if (isArray(options.onToken)) {
		var tokens = options.onToken;
		options.onToken = function (token) { return tokens.push(token); };
	  }
	  if (isArray(options.onComment))
		{ options.onComment = pushComment(options, options.onComment); }
  
	  return options
	}
  
	function pushComment(options, array) {
	  return function(block, text, start, end, startLoc, endLoc) {
		var comment = {
		  type: block ? "Block" : "Line",
		  value: text,
		  start: start,
		  end: end
		};
		if (options.locations)
		  { comment.loc = new SourceLocation(this, startLoc, endLoc); }
		if (options.ranges)
		  { comment.range = [start, end]; }
		array.push(comment);
	  }
	}
  
	// Each scope gets a bitset that may contain these flags
	var
		SCOPE_TOP = 1,
		SCOPE_FUNCTION = 2,
		SCOPE_ASYNC = 4,
		SCOPE_GENERATOR = 8,
		SCOPE_ARROW = 16,
		SCOPE_SIMPLE_CATCH = 32,
		SCOPE_SUPER = 64,
		SCOPE_DIRECT_SUPER = 128,
		SCOPE_CLASS_STATIC_BLOCK = 256,
		SCOPE_VAR = SCOPE_TOP | SCOPE_FUNCTION | SCOPE_CLASS_STATIC_BLOCK;
  
	function functionFlags(async, generator) {
	  return SCOPE_FUNCTION | (async ? SCOPE_ASYNC : 0) | (generator ? SCOPE_GENERATOR : 0)
	}
  
	// Used in checkLVal* and declareName to determine the type of a binding
	var
		BIND_NONE = 0, // Not a binding
		BIND_VAR = 1, // Var-style binding
		BIND_LEXICAL = 2, // Let- or const-style binding
		BIND_FUNCTION = 3, // Function declaration
		BIND_SIMPLE_CATCH = 4, // Simple (identifier pattern) catch binding
		BIND_OUTSIDE = 5; // Special case for function names as bound inside the function
  
	var Parser = function Parser(options, input, startPos) {
	  this.options = options = getOptions(options);
	  this.sourceFile = options.sourceFile;
	  this.keywords = wordsRegexp(keywords$1[options.ecmaVersion >= 6 ? 6 : options.sourceType === "module" ? "5module" : 5]);
	  var reserved = "";
	  if (options.allowReserved !== true) {
		reserved = reservedWords[options.ecmaVersion >= 6 ? 6 : options.ecmaVersion === 5 ? 5 : 3];
		if (options.sourceType === "module") { reserved += " await"; }
	  }
	  this.reservedWords = wordsRegexp(reserved);
	  var reservedStrict = (reserved ? reserved + " " : "") + reservedWords.strict;
	  this.reservedWordsStrict = wordsRegexp(reservedStrict);
	  this.reservedWordsStrictBind = wordsRegexp(reservedStrict + " " + reservedWords.strictBind);
	  this.input = String(input);
  
	  // Used to signal to callers of `readWord1` whether the word
	  // contained any escape sequences. This is needed because words with
	  // escape sequences must not be interpreted as keywords.
	  this.containsEsc = false;
  
	  // Set up token state
  
	  // The current position of the tokenizer in the input.
	  if (startPos) {
		this.pos = startPos;
		this.lineStart = this.input.lastIndexOf("\n", startPos - 1) + 1;
		this.curLine = this.input.slice(0, this.lineStart).split(lineBreak).length;
	  } else {
		this.pos = this.lineStart = 0;
		this.curLine = 1;
	  }
  
	  // Properties of the current token:
	  // Its type
	  this.type = types$1.eof;
	  // For tokens that include more information than their type, the value
	  this.value = null;
	  // Its start and end offset
	  this.start = this.end = this.pos;
	  // And, if locations are used, the {line, column} object
	  // corresponding to those offsets
	  this.startLoc = this.endLoc = this.curPosition();
  
	  // Position information for the previous token
	  this.lastTokEndLoc = this.lastTokStartLoc = null;
	  this.lastTokStart = this.lastTokEnd = this.pos;
  
	  // The context stack is used to superficially track syntactic
	  // context to predict whether a regular expression is allowed in a
	  // given position.
	  this.context = this.initialContext();
	  this.exprAllowed = true;
  
	  // Figure out if it's a module code.
	  this.inModule = options.sourceType === "module";
	  this.strict = this.inModule || this.strictDirective(this.pos);
  
	  // Used to signify the start of a potential arrow function
	  this.potentialArrowAt = -1;
	  this.potentialArrowInForAwait = false;
  
	  // Positions to delayed-check that yield/await does not exist in default parameters.
	  this.yieldPos = this.awaitPos = this.awaitIdentPos = 0;
	  // Labels in scope.
	  this.labels = [];
	  // Thus-far undefined exports.
	  this.undefinedExports = Object.create(null);
  
	  // If enabled, skip leading hashbang line.
	  if (this.pos === 0 && options.allowHashBang && this.input.slice(0, 2) === "#!")
		{ this.skipLineComment(2); }
  
	  // Scope tracking for duplicate variable names (see scope.js)
	  this.scopeStack = [];
	  this.enterScope(SCOPE_TOP);
  
	  // For RegExp validation
	  this.regexpState = null;
  
	  // The stack of private names.
	  // Each element has two properties: 'declared' and 'used'.
	  // When it exited from the outermost class definition, all used private names must be declared.
	  this.privateNameStack = [];
	};
  
	var prototypeAccessors = { inFunction: { configurable: true },inGenerator: { configurable: true },inAsync: { configurable: true },canAwait: { configurable: true },allowSuper: { configurable: true },allowDirectSuper: { configurable: true },treatFunctionsAsVar: { configurable: true },allowNewDotTarget: { configurable: true },inClassStaticBlock: { configurable: true } };
  
	Parser.prototype.parse = function parse () {
	  var node = this.options.program || this.startNode();
	  this.nextToken();
	  return this.parseTopLevel(node)
	};
  
	prototypeAccessors.inFunction.get = function () { return (this.currentVarScope().flags & SCOPE_FUNCTION) > 0 };
  
	prototypeAccessors.inGenerator.get = function () { return (this.currentVarScope().flags & SCOPE_GENERATOR) > 0 && !this.currentVarScope().inClassFieldInit };
  
	prototypeAccessors.inAsync.get = function () { return (this.currentVarScope().flags & SCOPE_ASYNC) > 0 && !this.currentVarScope().inClassFieldInit };
  
	prototypeAccessors.canAwait.get = function () {
	  for (var i = this.scopeStack.length - 1; i >= 0; i--) {
		var scope = this.scopeStack[i];
		if (scope.inClassFieldInit || scope.flags & SCOPE_CLASS_STATIC_BLOCK) { return false }
		if (scope.flags & SCOPE_FUNCTION) { return (scope.flags & SCOPE_ASYNC) > 0 }
	  }
	  return (this.inModule && this.options.ecmaVersion >= 13) || this.options.allowAwaitOutsideFunction
	};
  
	prototypeAccessors.allowSuper.get = function () {
	  var ref = this.currentThisScope();
		var flags = ref.flags;
		var inClassFieldInit = ref.inClassFieldInit;
	  return (flags & SCOPE_SUPER) > 0 || inClassFieldInit || this.options.allowSuperOutsideMethod
	};
  
	prototypeAccessors.allowDirectSuper.get = function () { return (this.currentThisScope().flags & SCOPE_DIRECT_SUPER) > 0 };
  
	prototypeAccessors.treatFunctionsAsVar.get = function () { return this.treatFunctionsAsVarInScope(this.currentScope()) };
  
	prototypeAccessors.allowNewDotTarget.get = function () {
	  var ref = this.currentThisScope();
		var flags = ref.flags;
		var inClassFieldInit = ref.inClassFieldInit;
	  return (flags & (SCOPE_FUNCTION | SCOPE_CLASS_STATIC_BLOCK)) > 0 || inClassFieldInit
	};
  
	prototypeAccessors.inClassStaticBlock.get = function () {
	  return (this.currentVarScope().flags & SCOPE_CLASS_STATIC_BLOCK) > 0
	};
  
	Parser.extend = function extend () {
		var plugins = [], len = arguments.length;
		while ( len-- ) plugins[ len ] = arguments[ len ];
  
	  var cls = this;
	  for (var i = 0; i < plugins.length; i++) { cls = plugins[i](cls); }
	  return cls
	};
  
	Parser.parse = function parse (input, options) {
	  return new this(options, input).parse()
	};
  
	Parser.parseExpressionAt = function parseExpressionAt (input, pos, options) {
	  var parser = new this(options, input, pos);
	  parser.nextToken();
	  return parser.parseExpression()
	};
  
	Parser.tokenizer = function tokenizer (input, options) {
	  return new this(options, input)
	};
  
	Object.defineProperties( Parser.prototype, prototypeAccessors );
  
	var pp$9 = Parser.prototype;
  
	// ## Parser utilities
  
	var literal = /^(?:'((?:\\.|[^'\\])*?)'|"((?:\\.|[^"\\])*?)")/;
	pp$9.strictDirective = function(start) {
	  for (;;) {
		// Try to find string literal.
		skipWhiteSpace.lastIndex = start;
		start += skipWhiteSpace.exec(this.input)[0].length;
		var match = literal.exec(this.input.slice(start));
		if (!match) { return false }
		if ((match[1] || match[2]) === "use strict") {
		  skipWhiteSpace.lastIndex = start + match[0].length;
		  var spaceAfter = skipWhiteSpace.exec(this.input), end = spaceAfter.index + spaceAfter[0].length;
		  var next = this.input.charAt(end);
		  return next === ";" || next === "}" ||
			(lineBreak.test(spaceAfter[0]) &&
			 !(/[(`.[+\-/*%<>=,?^&]/.test(next) || next === "!" && this.input.charAt(end + 1) === "="))
		}
		start += match[0].length;
  
		// Skip semicolon, if any.
		skipWhiteSpace.lastIndex = start;
		start += skipWhiteSpace.exec(this.input)[0].length;
		if (this.input[start] === ";")
		  { start++; }
	  }
	};
  
	// Predicate that tests whether the next token is of the given
	// type, and if yes, consumes it as a side effect.
  
	pp$9.eat = function(type) {
	  if (this.type === type) {
		this.next();
		return true
	  } else {
		return false
	  }
	};
  
	// Tests whether parsed token is a contextual keyword.
  
	pp$9.isContextual = function(name) {
	  return this.type === types$1.name && this.value === name && !this.containsEsc
	};
  
	// Consumes contextual keyword if possible.
  
	pp$9.eatContextual = function(name) {
	  if (!this.isContextual(name)) { return false }
	  this.next();
	  return true
	};
  
	// Asserts that following token is given contextual keyword.
  
	pp$9.expectContextual = function(name) {
	  if (!this.eatContextual(name)) { this.unexpected(); }
	};
  
	// Test whether a semicolon can be inserted at the current position.
  
	pp$9.canInsertSemicolon = function() {
	  return this.type === types$1.eof ||
		this.type === types$1.braceR ||
		lineBreak.test(this.input.slice(this.lastTokEnd, this.start))
	};
  
	pp$9.insertSemicolon = function() {
	  if (this.canInsertSemicolon()) {
		if (this.options.onInsertedSemicolon)
		  { this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc); }
		return true
	  }
	};
  
	// Consume a semicolon, or, failing that, see if we are allowed to
	// pretend that there is a semicolon at this position.
  
	pp$9.semicolon = function() {
	  if (!this.eat(types$1.semi) && !this.insertSemicolon()) { this.unexpected(); }
	};
  
	pp$9.afterTrailingComma = function(tokType, notNext) {
	  if (this.type === tokType) {
		if (this.options.onTrailingComma)
		  { this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc); }
		if (!notNext)
		  { this.next(); }
		return true
	  }
	};
  
	// Expect a token of a given type. If found, consume it, otherwise,
	// raise an unexpected token error.
  
	pp$9.expect = function(type) {
	  this.eat(type) || this.unexpected();
	};
  
	// Raise an unexpected token error.
  
	pp$9.unexpected = function(pos) {
	  this.raise(pos != null ? pos : this.start, "Unexpected token");
	};
  
	function DestructuringErrors() {
	  this.shorthandAssign =
	  this.trailingComma =
	  this.parenthesizedAssign =
	  this.parenthesizedBind =
	  this.doubleProto =
		-1;
	}
  
	pp$9.checkPatternErrors = function(refDestructuringErrors, isAssign) {
	  if (!refDestructuringErrors) { return }
	  if (refDestructuringErrors.trailingComma > -1)
		{ this.raiseRecoverable(refDestructuringErrors.trailingComma, "Comma is not permitted after the rest element"); }
	  var parens = isAssign ? refDestructuringErrors.parenthesizedAssign : refDestructuringErrors.parenthesizedBind;
	  if (parens > -1) { this.raiseRecoverable(parens, "Parenthesized pattern"); }
	};
  
	pp$9.checkExpressionErrors = function(refDestructuringErrors, andThrow) {
	  if (!refDestructuringErrors) { return false }
	  var shorthandAssign = refDestructuringErrors.shorthandAssign;
	  var doubleProto = refDestructuringErrors.doubleProto;
	  if (!andThrow) { return shorthandAssign >= 0 || doubleProto >= 0 }
	  if (shorthandAssign >= 0)
		{ this.raise(shorthandAssign, "Shorthand property assignments are valid only in destructuring patterns"); }
	  if (doubleProto >= 0)
		{ this.raiseRecoverable(doubleProto, "Redefinition of __proto__ property"); }
	};
  
	pp$9.checkYieldAwaitInDefaultParams = function() {
	  if (this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos))
		{ this.raise(this.yieldPos, "Yield expression cannot be a default value"); }
	  if (this.awaitPos)
		{ this.raise(this.awaitPos, "Await expression cannot be a default value"); }
	};
  
	pp$9.isSimpleAssignTarget = function(expr) {
	  if (expr.type === "ParenthesizedExpression")
		{ return this.isSimpleAssignTarget(expr.expression) }
	  return expr.type === "Identifier" || expr.type === "MemberExpression"
	};
  
	var pp$8 = Parser.prototype;
  
	// ### Statement parsing
  
	// Parse a program. Initializes the parser, reads any number of
	// statements, and wraps them in a Program node.  Optionally takes a
	// `program` argument.  If present, the statements will be appended
	// to its body instead of creating a new node.
  
	pp$8.parseTopLevel = function(node) {
	  var exports = Object.create(null);
	  if (!node.body) { node.body = []; }
	  while (this.type !== types$1.eof) {
		var stmt = this.parseStatement(null, true, exports);
		node.body.push(stmt);
	  }
	  if (this.inModule)
		{ for (var i = 0, list = Object.keys(this.undefinedExports); i < list.length; i += 1)
		  {
			var name = list[i];
  
			this.raiseRecoverable(this.undefinedExports[name].start, ("Export '" + name + "' is not defined"));
		  } }
	  this.adaptDirectivePrologue(node.body);
	  this.next();
	  node.sourceType = this.options.sourceType;
	  return this.finishNode(node, "Program")
	};
  
	var loopLabel = {kind: "loop"}, switchLabel = {kind: "switch"};
  
	pp$8.isLet = function(context) {
	  if (this.options.ecmaVersion < 6 || !this.isContextual("let")) { return false }
	  skipWhiteSpace.lastIndex = this.pos;
	  var skip = skipWhiteSpace.exec(this.input);
	  var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
	  // For ambiguous cases, determine if a LexicalDeclaration (or only a
	  // Statement) is allowed here. If context is not empty then only a Statement
	  // is allowed. However, `let [` is an explicit negative lookahead for
	  // ExpressionStatement, so special-case it first.
	  if (nextCh === 91 || nextCh === 92 || nextCh > 0xd7ff && nextCh < 0xdc00) { return true } // '[', '/', astral
	  if (context) { return false }
  
	  if (nextCh === 123) { return true } // '{'
	  if (isIdentifierStart(nextCh, true)) {
		var pos = next + 1;
		while (isIdentifierChar(nextCh = this.input.charCodeAt(pos), true)) { ++pos; }
		if (nextCh === 92 || nextCh > 0xd7ff && nextCh < 0xdc00) { return true }
		var ident = this.input.slice(next, pos);
		if (!keywordRelationalOperator.test(ident)) { return true }
	  }
	  return false
	};
  
	// check 'async [no LineTerminator here] function'
	// - 'async /*foo*/ function' is OK.
	// - 'async /*\n*/ function' is invalid.
	pp$8.isAsyncFunction = function() {
	  if (this.options.ecmaVersion < 8 || !this.isContextual("async"))
		{ return false }
  
	  skipWhiteSpace.lastIndex = this.pos;
	  var skip = skipWhiteSpace.exec(this.input);
	  var next = this.pos + skip[0].length, after;
	  return !lineBreak.test(this.input.slice(this.pos, next)) &&
		this.input.slice(next, next + 8) === "function" &&
		(next + 8 === this.input.length ||
		 !(isIdentifierChar(after = this.input.charCodeAt(next + 8)) || after > 0xd7ff && after < 0xdc00))
	};
  
	// Parse a single statement.
	//
	// If expecting a statement and finding a slash operator, parse a
	// regular expression literal. This is to handle cases like
	// `if (foo) /blah/.exec(foo)`, where looking at the previous token
	// does not help.
  
	pp$8.parseStatement = function(context, topLevel, exports) {
	  var starttype = this.type, node = this.startNode(), kind;
  
	  if (this.isLet(context)) {
		starttype = types$1._var;
		kind = "let";
	  }
  
	  // Most types of statements are recognized by the keyword they
	  // start with. Many are trivial to parse, some require a bit of
	  // complexity.
  
	  switch (starttype) {
	  case types$1._break: case types$1._continue: return this.parseBreakContinueStatement(node, starttype.keyword)
	  case types$1._debugger: return this.parseDebuggerStatement(node)
	  case types$1._do: return this.parseDoStatement(node)
	  case types$1._for: return this.parseForStatement(node)
	  case types$1._function:
		// Function as sole body of either an if statement or a labeled statement
		// works, but not when it is part of a labeled statement that is the sole
		// body of an if statement.
		if ((context && (this.strict || context !== "if" && context !== "label")) && this.options.ecmaVersion >= 6) { this.unexpected(); }
		return this.parseFunctionStatement(node, false, !context)
	  case types$1._class:
		if (context) { this.unexpected(); }
		return this.parseClass(node, true)
	  case types$1._if: return this.parseIfStatement(node)
	  case types$1._return: return this.parseReturnStatement(node)
	  case types$1._switch: return this.parseSwitchStatement(node)
	  case types$1._throw: return this.parseThrowStatement(node)
	  case types$1._try: return this.parseTryStatement(node)
	  case types$1._const: case types$1._var:
		kind = kind || this.value;
		if (context && kind !== "var") { this.unexpected(); }
		return this.parseVarStatement(node, kind)
	  case types$1._while: return this.parseWhileStatement(node)
	  case types$1._with: return this.parseWithStatement(node)
	  case types$1.braceL: return this.parseBlock(true, node)
	  case types$1.semi: return this.parseEmptyStatement(node)
	  case types$1._export:
	  case types$1._import:
		if (this.options.ecmaVersion > 10 && starttype === types$1._import) {
		  skipWhiteSpace.lastIndex = this.pos;
		  var skip = skipWhiteSpace.exec(this.input);
		  var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
		  if (nextCh === 40 || nextCh === 46) // '(' or '.'
			{ return this.parseExpressionStatement(node, this.parseExpression()) }
		}
  
		if (!this.options.allowImportExportEverywhere) {
		  if (!topLevel)
			{ this.raise(this.start, "'import' and 'export' may only appear at the top level"); }
		  if (!this.inModule)
			{ this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'"); }
		}
		return starttype === types$1._import ? this.parseImport(node) : this.parseExport(node, exports)
  
		// If the statement does not start with a statement keyword or a
		// brace, it's an ExpressionStatement or LabeledStatement. We
		// simply start parsing an expression, and afterwards, if the
		// next token is a colon and the expression was a simple
		// Identifier node, we switch to interpreting it as a label.
	  default:
		if (this.isAsyncFunction()) {
		  if (context) { this.unexpected(); }
		  this.next();
		  return this.parseFunctionStatement(node, true, !context)
		}
  
		var maybeName = this.value, expr = this.parseExpression();
		if (starttype === types$1.name && expr.type === "Identifier" && this.eat(types$1.colon))
		  { return this.parseLabeledStatement(node, maybeName, expr, context) }
		else { return this.parseExpressionStatement(node, expr) }
	  }
	};
  
	pp$8.parseBreakContinueStatement = function(node, keyword) {
	  var isBreak = keyword === "break";
	  this.next();
	  if (this.eat(types$1.semi) || this.insertSemicolon()) { node.label = null; }
	  else if (this.type !== types$1.name) { this.unexpected(); }
	  else {
		node.label = this.parseIdent();
		this.semicolon();
	  }
  
	  // Verify that there is an actual destination to break or
	  // continue to.
	  var i = 0;
	  for (; i < this.labels.length; ++i) {
		var lab = this.labels[i];
		if (node.label == null || lab.name === node.label.name) {
		  if (lab.kind != null && (isBreak || lab.kind === "loop")) { break }
		  if (node.label && isBreak) { break }
		}
	  }
	  if (i === this.labels.length) { this.raise(node.start, "Unsyntactic " + keyword); }
	  return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement")
	};
  
	pp$8.parseDebuggerStatement = function(node) {
	  this.next();
	  this.semicolon();
	  return this.finishNode(node, "DebuggerStatement")
	};
  
	pp$8.parseDoStatement = function(node) {
	  this.next();
	  this.labels.push(loopLabel);
	  node.body = this.parseStatement("do");
	  this.labels.pop();
	  this.expect(types$1._while);
	  node.test = this.parseParenExpression();
	  if (this.options.ecmaVersion >= 6)
		{ this.eat(types$1.semi); }
	  else
		{ this.semicolon(); }
	  return this.finishNode(node, "DoWhileStatement")
	};
  
	// Disambiguating between a `for` and a `for`/`in` or `for`/`of`
	// loop is non-trivial. Basically, we have to parse the init `var`
	// statement or expression, disallowing the `in` operator (see
	// the second parameter to `parseExpression`), and then check
	// whether the next token is `in` or `of`. When there is no init
	// part (semicolon immediately after the opening parenthesis), it
	// is a regular `for` loop.
  
	pp$8.parseForStatement = function(node) {
	  this.next();
	  var awaitAt = (this.options.ecmaVersion >= 9 && this.canAwait && this.eatContextual("await")) ? this.lastTokStart : -1;
	  this.labels.push(loopLabel);
	  this.enterScope(0);
	  this.expect(types$1.parenL);
	  if (this.type === types$1.semi) {
		if (awaitAt > -1) { this.unexpected(awaitAt); }
		return this.parseFor(node, null)
	  }
	  var isLet = this.isLet();
	  if (this.type === types$1._var || this.type === types$1._const || isLet) {
		var init$1 = this.startNode(), kind = isLet ? "let" : this.value;
		this.next();
		this.parseVar(init$1, true, kind);
		this.finishNode(init$1, "VariableDeclaration");
		if ((this.type === types$1._in || (this.options.ecmaVersion >= 6 && this.isContextual("of"))) && init$1.declarations.length === 1) {
		  if (this.options.ecmaVersion >= 9) {
			if (this.type === types$1._in) {
			  if (awaitAt > -1) { this.unexpected(awaitAt); }
			} else { node.await = awaitAt > -1; }
		  }
		  return this.parseForIn(node, init$1)
		}
		if (awaitAt > -1) { this.unexpected(awaitAt); }
		return this.parseFor(node, init$1)
	  }
	  var startsWithLet = this.isContextual("let"), isForOf = false;
	  var refDestructuringErrors = new DestructuringErrors;
	  var init = this.parseExpression(awaitAt > -1 ? "await" : true, refDestructuringErrors);
	  if (this.type === types$1._in || (isForOf = this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
		if (this.options.ecmaVersion >= 9) {
		  if (this.type === types$1._in) {
			if (awaitAt > -1) { this.unexpected(awaitAt); }
		  } else { node.await = awaitAt > -1; }
		}
		if (startsWithLet && isForOf) { this.raise(init.start, "The left-hand side of a for-of loop may not start with 'let'."); }
		this.toAssignable(init, false, refDestructuringErrors);
		this.checkLValPattern(init);
		return this.parseForIn(node, init)
	  } else {
		this.checkExpressionErrors(refDestructuringErrors, true);
	  }
	  if (awaitAt > -1) { this.unexpected(awaitAt); }
	  return this.parseFor(node, init)
	};
  
	pp$8.parseFunctionStatement = function(node, isAsync, declarationPosition) {
	  this.next();
	  return this.parseFunction(node, FUNC_STATEMENT | (declarationPosition ? 0 : FUNC_HANGING_STATEMENT), false, isAsync)
	};
  
	pp$8.parseIfStatement = function(node) {
	  this.next();
	  node.test = this.parseParenExpression();
	  // allow function declarations in branches, but only in non-strict mode
	  node.consequent = this.parseStatement("if");
	  node.alternate = this.eat(types$1._else) ? this.parseStatement("if") : null;
	  return this.finishNode(node, "IfStatement")
	};
  
	pp$8.parseReturnStatement = function(node) {
	  if (!this.inFunction && !this.options.allowReturnOutsideFunction)
		{ this.raise(this.start, "'return' outside of function"); }
	  this.next();
  
	  // In `return` (and `break`/`continue`), the keywords with
	  // optional arguments, we eagerly look for a semicolon or the
	  // possibility to insert one.
  
	  if (this.eat(types$1.semi) || this.insertSemicolon()) { node.argument = null; }
	  else { node.argument = this.parseExpression(); this.semicolon(); }
	  return this.finishNode(node, "ReturnStatement")
	};
  
	pp$8.parseSwitchStatement = function(node) {
	  this.next();
	  node.discriminant = this.parseParenExpression();
	  node.cases = [];
	  this.expect(types$1.braceL);
	  this.labels.push(switchLabel);
	  this.enterScope(0);
  
	  // Statements under must be grouped (by label) in SwitchCase
	  // nodes. `cur` is used to keep the node that we are currently
	  // adding statements to.
  
	  var cur;
	  for (var sawDefault = false; this.type !== types$1.braceR;) {
		if (this.type === types$1._case || this.type === types$1._default) {
		  var isCase = this.type === types$1._case;
		  if (cur) { this.finishNode(cur, "SwitchCase"); }
		  node.cases.push(cur = this.startNode());
		  cur.consequent = [];
		  this.next();
		  if (isCase) {
			cur.test = this.parseExpression();
		  } else {
			if (sawDefault) { this.raiseRecoverable(this.lastTokStart, "Multiple default clauses"); }
			sawDefault = true;
			cur.test = null;
		  }
		  this.expect(types$1.colon);
		} else {
		  if (!cur) { this.unexpected(); }
		  cur.consequent.push(this.parseStatement(null));
		}
	  }
	  this.exitScope();
	  if (cur) { this.finishNode(cur, "SwitchCase"); }
	  this.next(); // Closing brace
	  this.labels.pop();
	  return this.finishNode(node, "SwitchStatement")
	};
  
	pp$8.parseThrowStatement = function(node) {
	  this.next();
	  if (lineBreak.test(this.input.slice(this.lastTokEnd, this.start)))
		{ this.raise(this.lastTokEnd, "Illegal newline after throw"); }
	  node.argument = this.parseExpression();
	  this.semicolon();
	  return this.finishNode(node, "ThrowStatement")
	};
  
	// Reused empty array added for node fields that are always empty.
  
	var empty$1 = [];
  
	pp$8.parseTryStatement = function(node) {
	  this.next();
	  node.block = this.parseBlock();
	  node.handler = null;
	  if (this.type === types$1._catch) {
		var clause = this.startNode();
		this.next();
		if (this.eat(types$1.parenL)) {
		  clause.param = this.parseBindingAtom();
		  var simple = clause.param.type === "Identifier";
		  this.enterScope(simple ? SCOPE_SIMPLE_CATCH : 0);
		  this.checkLValPattern(clause.param, simple ? BIND_SIMPLE_CATCH : BIND_LEXICAL);
		  this.expect(types$1.parenR);
		} else {
		  if (this.options.ecmaVersion < 10) { this.unexpected(); }
		  clause.param = null;
		  this.enterScope(0);
		}
		clause.body = this.parseBlock(false);
		this.exitScope();
		node.handler = this.finishNode(clause, "CatchClause");
	  }
	  node.finalizer = this.eat(types$1._finally) ? this.parseBlock() : null;
	  if (!node.handler && !node.finalizer)
		{ this.raise(node.start, "Missing catch or finally clause"); }
	  return this.finishNode(node, "TryStatement")
	};
  
	pp$8.parseVarStatement = function(node, kind) {
	  this.next();
	  this.parseVar(node, false, kind);
	  this.semicolon();
	  return this.finishNode(node, "VariableDeclaration")
	};
  
	pp$8.parseWhileStatement = function(node) {
	  this.next();
	  node.test = this.parseParenExpression();
	  this.labels.push(loopLabel);
	  node.body = this.parseStatement("while");
	  this.labels.pop();
	  return this.finishNode(node, "WhileStatement")
	};
  
	pp$8.parseWithStatement = function(node) {
	  if (this.strict) { this.raise(this.start, "'with' in strict mode"); }
	  this.next();
	  node.object = this.parseParenExpression();
	  node.body = this.parseStatement("with");
	  return this.finishNode(node, "WithStatement")
	};
  
	pp$8.parseEmptyStatement = function(node) {
	  this.next();
	  return this.finishNode(node, "EmptyStatement")
	};
  
	pp$8.parseLabeledStatement = function(node, maybeName, expr, context) {
	  for (var i$1 = 0, list = this.labels; i$1 < list.length; i$1 += 1)
		{
		var label = list[i$1];
  
		if (label.name === maybeName)
		  { this.raise(expr.start, "Label '" + maybeName + "' is already declared");
	  } }
	  var kind = this.type.isLoop ? "loop" : this.type === types$1._switch ? "switch" : null;
	  for (var i = this.labels.length - 1; i >= 0; i--) {
		var label$1 = this.labels[i];
		if (label$1.statementStart === node.start) {
		  // Update information about previous labels on this node
		  label$1.statementStart = this.start;
		  label$1.kind = kind;
		} else { break }
	  }
	  this.labels.push({name: maybeName, kind: kind, statementStart: this.start});
	  node.body = this.parseStatement(context ? context.indexOf("label") === -1 ? context + "label" : context : "label");
	  this.labels.pop();
	  node.label = expr;
	  return this.finishNode(node, "LabeledStatement")
	};
  
	pp$8.parseExpressionStatement = function(node, expr) {
	  node.expression = expr;
	  this.semicolon();
	  return this.finishNode(node, "ExpressionStatement")
	};
  
	// Parse a semicolon-enclosed block of statements, handling `"use
	// strict"` declarations when `allowStrict` is true (used for
	// function bodies).
  
	pp$8.parseBlock = function(createNewLexicalScope, node, exitStrict) {
	  if ( createNewLexicalScope === void 0 ) createNewLexicalScope = true;
	  if ( node === void 0 ) node = this.startNode();
  
	  node.body = [];
	  this.expect(types$1.braceL);
	  if (createNewLexicalScope) { this.enterScope(0); }
	  while (this.type !== types$1.braceR) {
		var stmt = this.parseStatement(null);
		node.body.push(stmt);
	  }
	  if (exitStrict) { this.strict = false; }
	  this.next();
	  if (createNewLexicalScope) { this.exitScope(); }
	  return this.finishNode(node, "BlockStatement")
	};
  
	// Parse a regular `for` loop. The disambiguation code in
	// `parseStatement` will already have parsed the init statement or
	// expression.
  
	pp$8.parseFor = function(node, init) {
	  node.init = init;
	  this.expect(types$1.semi);
	  node.test = this.type === types$1.semi ? null : this.parseExpression();
	  this.expect(types$1.semi);
	  node.update = this.type === types$1.parenR ? null : this.parseExpression();
	  this.expect(types$1.parenR);
	  node.body = this.parseStatement("for");
	  this.exitScope();
	  this.labels.pop();
	  return this.finishNode(node, "ForStatement")
	};
  
	// Parse a `for`/`in` and `for`/`of` loop, which are almost
	// same from parser's perspective.
  
	pp$8.parseForIn = function(node, init) {
	  var isForIn = this.type === types$1._in;
	  this.next();
  
	  if (
		init.type === "VariableDeclaration" &&
		init.declarations[0].init != null &&
		(
		  !isForIn ||
		  this.options.ecmaVersion < 8 ||
		  this.strict ||
		  init.kind !== "var" ||
		  init.declarations[0].id.type !== "Identifier"
		)
	  ) {
		this.raise(
		  init.start,
		  ((isForIn ? "for-in" : "for-of") + " loop variable declaration may not have an initializer")
		);
	  }
	  node.left = init;
	  node.right = isForIn ? this.parseExpression() : this.parseMaybeAssign();
	  this.expect(types$1.parenR);
	  node.body = this.parseStatement("for");
	  this.exitScope();
	  this.labels.pop();
	  return this.finishNode(node, isForIn ? "ForInStatement" : "ForOfStatement")
	};
  
	// Parse a list of variable declarations.
  
	pp$8.parseVar = function(node, isFor, kind) {
	  node.declarations = [];
	  node.kind = kind;
	  for (;;) {
		var decl = this.startNode();
		this.parseVarId(decl, kind);
		if (this.eat(types$1.eq)) {
		  decl.init = this.parseMaybeAssign(isFor);
		} else if (kind === "const" && !(this.type === types$1._in || (this.options.ecmaVersion >= 6 && this.isContextual("of")))) {
		  this.unexpected();
		} else if (decl.id.type !== "Identifier" && !(isFor && (this.type === types$1._in || this.isContextual("of")))) {
		  this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value");
		} else {
		  decl.init = null;
		}
		node.declarations.push(this.finishNode(decl, "VariableDeclarator"));
		if (!this.eat(types$1.comma)) { break }
	  }
	  return node
	};
  
	pp$8.parseVarId = function(decl, kind) {
	  decl.id = this.parseBindingAtom();
	  this.checkLValPattern(decl.id, kind === "var" ? BIND_VAR : BIND_LEXICAL, false);
	};
  
	var FUNC_STATEMENT = 1, FUNC_HANGING_STATEMENT = 2, FUNC_NULLABLE_ID = 4;
  
	// Parse a function declaration or literal (depending on the
	// `statement & FUNC_STATEMENT`).
  
	// Remove `allowExpressionBody` for 7.0.0, as it is only called with false
	pp$8.parseFunction = function(node, statement, allowExpressionBody, isAsync, forInit) {
	  this.initFunction(node);
	  if (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !isAsync) {
		if (this.type === types$1.star && (statement & FUNC_HANGING_STATEMENT))
		  { this.unexpected(); }
		node.generator = this.eat(types$1.star);
	  }
	  if (this.options.ecmaVersion >= 8)
		{ node.async = !!isAsync; }
  
	  if (statement & FUNC_STATEMENT) {
		node.id = (statement & FUNC_NULLABLE_ID) && this.type !== types$1.name ? null : this.parseIdent();
		if (node.id && !(statement & FUNC_HANGING_STATEMENT))
		  // If it is a regular function declaration in sloppy mode, then it is
		  // subject to Annex B semantics (BIND_FUNCTION). Otherwise, the binding
		  // mode depends on properties of the current scope (see
		  // treatFunctionsAsVar).
		  { this.checkLValSimple(node.id, (this.strict || node.generator || node.async) ? this.treatFunctionsAsVar ? BIND_VAR : BIND_LEXICAL : BIND_FUNCTION); }
	  }
  
	  var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
	  this.yieldPos = 0;
	  this.awaitPos = 0;
	  this.awaitIdentPos = 0;
	  this.enterScope(functionFlags(node.async, node.generator));
  
	  if (!(statement & FUNC_STATEMENT))
		{ node.id = this.type === types$1.name ? this.parseIdent() : null; }
  
	  this.parseFunctionParams(node);
	  this.parseFunctionBody(node, allowExpressionBody, false, forInit);
  
	  this.yieldPos = oldYieldPos;
	  this.awaitPos = oldAwaitPos;
	  this.awaitIdentPos = oldAwaitIdentPos;
	  return this.finishNode(node, (statement & FUNC_STATEMENT) ? "FunctionDeclaration" : "FunctionExpression")
	};
  
	pp$8.parseFunctionParams = function(node) {
	  this.expect(types$1.parenL);
	  node.params = this.parseBindingList(types$1.parenR, false, this.options.ecmaVersion >= 8);
	  this.checkYieldAwaitInDefaultParams();
	};
  
	// Parse a class declaration or literal (depending on the
	// `isStatement` parameter).
  
	pp$8.parseClass = function(node, isStatement) {
	  this.next();
  
	  // ecma-262 14.6 Class Definitions
	  // A class definition is always strict mode code.
	  var oldStrict = this.strict;
	  this.strict = true;
  
	  this.parseClassId(node, isStatement);
	  this.parseClassSuper(node);
	  var privateNameMap = this.enterClassBody();
	  var classBody = this.startNode();
	  var hadConstructor = false;
	  classBody.body = [];
	  this.expect(types$1.braceL);
	  while (this.type !== types$1.braceR) {
		var element = this.parseClassElement(node.superClass !== null);
		if (element) {
		  classBody.body.push(element);
		  if (element.type === "MethodDefinition" && element.kind === "constructor") {
			if (hadConstructor) { this.raise(element.start, "Duplicate constructor in the same class"); }
			hadConstructor = true;
		  } else if (element.key && element.key.type === "PrivateIdentifier" && isPrivateNameConflicted(privateNameMap, element)) {
			this.raiseRecoverable(element.key.start, ("Identifier '#" + (element.key.name) + "' has already been declared"));
		  }
		}
	  }
	  this.strict = oldStrict;
	  this.next();
	  node.body = this.finishNode(classBody, "ClassBody");
	  this.exitClassBody();
	  return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression")
	};
  
	pp$8.parseClassElement = function(constructorAllowsSuper) {
	  if (this.eat(types$1.semi)) { return null }
  
	  var ecmaVersion = this.options.ecmaVersion;
	  var node = this.startNode();
	  var keyName = "";
	  var isGenerator = false;
	  var isAsync = false;
	  var kind = "method";
	  var isStatic = false;
  
	  if (this.eatContextual("static")) {
		// Parse static init block
		if (ecmaVersion >= 13 && this.eat(types$1.braceL)) {
		  this.parseClassStaticBlock(node);
		  return node
		}
		if (this.isClassElementNameStart() || this.type === types$1.star) {
		  isStatic = true;
		} else {
		  keyName = "static";
		}
	  }
	  node.static = isStatic;
	  if (!keyName && ecmaVersion >= 8 && this.eatContextual("async")) {
		if ((this.isClassElementNameStart() || this.type === types$1.star) && !this.canInsertSemicolon()) {
		  isAsync = true;
		} else {
		  keyName = "async";
		}
	  }
	  if (!keyName && (ecmaVersion >= 9 || !isAsync) && this.eat(types$1.star)) {
		isGenerator = true;
	  }
	  if (!keyName && !isAsync && !isGenerator) {
		var lastValue = this.value;
		if (this.eatContextual("get") || this.eatContextual("set")) {
		  if (this.isClassElementNameStart()) {
			kind = lastValue;
		  } else {
			keyName = lastValue;
		  }
		}
	  }
  
	  // Parse element name
	  if (keyName) {
		// 'async', 'get', 'set', or 'static' were not a keyword contextually.
		// The last token is any of those. Make it the element name.
		node.computed = false;
		node.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc);
		node.key.name = keyName;
		this.finishNode(node.key, "Identifier");
	  } else {
		this.parseClassElementName(node);
	  }
  
	  // Parse element value
	  if (ecmaVersion < 13 || this.type === types$1.parenL || kind !== "method" || isGenerator || isAsync) {
		var isConstructor = !node.static && checkKeyName(node, "constructor");
		var allowsDirectSuper = isConstructor && constructorAllowsSuper;
		// Couldn't move this check into the 'parseClassMethod' method for backward compatibility.
		if (isConstructor && kind !== "method") { this.raise(node.key.start, "Constructor can't have get/set modifier"); }
		node.kind = isConstructor ? "constructor" : kind;
		this.parseClassMethod(node, isGenerator, isAsync, allowsDirectSuper);
	  } else {
		this.parseClassField(node);
	  }
  
	  return node
	};
  
	pp$8.isClassElementNameStart = function() {
	  return (
		this.type === types$1.name ||
		this.type === types$1.privateId ||
		this.type === types$1.num ||
		this.type === types$1.string ||
		this.type === types$1.bracketL ||
		this.type.keyword
	  )
	};
  
	pp$8.parseClassElementName = function(element) {
	  if (this.type === types$1.privateId) {
		if (this.value === "constructor") {
		  this.raise(this.start, "Classes can't have an element named '#constructor'");
		}
		element.computed = false;
		element.key = this.parsePrivateIdent();
	  } else {
		this.parsePropertyName(element);
	  }
	};
  
	pp$8.parseClassMethod = function(method, isGenerator, isAsync, allowsDirectSuper) {
	  // Check key and flags
	  var key = method.key;
	  if (method.kind === "constructor") {
		if (isGenerator) { this.raise(key.start, "Constructor can't be a generator"); }
		if (isAsync) { this.raise(key.start, "Constructor can't be an async method"); }
	  } else if (method.static && checkKeyName(method, "prototype")) {
		this.raise(key.start, "Classes may not have a static property named prototype");
	  }
  
	  // Parse value
	  var value = method.value = this.parseMethod(isGenerator, isAsync, allowsDirectSuper);
  
	  // Check value
	  if (method.kind === "get" && value.params.length !== 0)
		{ this.raiseRecoverable(value.start, "getter should have no params"); }
	  if (method.kind === "set" && value.params.length !== 1)
		{ this.raiseRecoverable(value.start, "setter should have exactly one param"); }
	  if (method.kind === "set" && value.params[0].type === "RestElement")
		{ this.raiseRecoverable(value.params[0].start, "Setter cannot use rest params"); }
  
	  return this.finishNode(method, "MethodDefinition")
	};
  
	pp$8.parseClassField = function(field) {
	  if (checkKeyName(field, "constructor")) {
		this.raise(field.key.start, "Classes can't have a field named 'constructor'");
	  } else if (field.static && checkKeyName(field, "prototype")) {
		this.raise(field.key.start, "Classes can't have a static field named 'prototype'");
	  }
  
	  if (this.eat(types$1.eq)) {
		// To raise SyntaxError if 'arguments' exists in the initializer.
		var scope = this.currentThisScope();
		var inClassFieldInit = scope.inClassFieldInit;
		scope.inClassFieldInit = true;
		field.value = this.parseMaybeAssign();
		scope.inClassFieldInit = inClassFieldInit;
	  } else {
		field.value = null;
	  }
	  this.semicolon();
  
	  return this.finishNode(field, "PropertyDefinition")
	};
  
	pp$8.parseClassStaticBlock = function(node) {
	  node.body = [];
  
	  var oldLabels = this.labels;
	  this.labels = [];
	  this.enterScope(SCOPE_CLASS_STATIC_BLOCK | SCOPE_SUPER);
	  while (this.type !== types$1.braceR) {
		var stmt = this.parseStatement(null);
		node.body.push(stmt);
	  }
	  this.next();
	  this.exitScope();
	  this.labels = oldLabels;
  
	  return this.finishNode(node, "StaticBlock")
	};
  
	pp$8.parseClassId = function(node, isStatement) {
	  if (this.type === types$1.name) {
		node.id = this.parseIdent();
		if (isStatement)
		  { this.checkLValSimple(node.id, BIND_LEXICAL, false); }
	  } else {
		if (isStatement === true)
		  { this.unexpected(); }
		node.id = null;
	  }
	};
  
	pp$8.parseClassSuper = function(node) {
	  node.superClass = this.eat(types$1._extends) ? this.parseExprSubscripts(false) : null;
	};
  
	pp$8.enterClassBody = function() {
	  var element = {declared: Object.create(null), used: []};
	  this.privateNameStack.push(element);
	  return element.declared
	};
  
	pp$8.exitClassBody = function() {
	  var ref = this.privateNameStack.pop();
	  var declared = ref.declared;
	  var used = ref.used;
	  var len = this.privateNameStack.length;
	  var parent = len === 0 ? null : this.privateNameStack[len - 1];
	  for (var i = 0; i < used.length; ++i) {
		var id = used[i];
		if (!hasOwn(declared, id.name)) {
		  if (parent) {
			parent.used.push(id);
		  } else {
			this.raiseRecoverable(id.start, ("Private field '#" + (id.name) + "' must be declared in an enclosing class"));
		  }
		}
	  }
	};
  
	function isPrivateNameConflicted(privateNameMap, element) {
	  var name = element.key.name;
	  var curr = privateNameMap[name];
  
	  var next = "true";
	  if (element.type === "MethodDefinition" && (element.kind === "get" || element.kind === "set")) {
		next = (element.static ? "s" : "i") + element.kind;
	  }
  
	  // `class { get #a(){}; static set #a(_){} }` is also conflict.
	  if (
		curr === "iget" && next === "iset" ||
		curr === "iset" && next === "iget" ||
		curr === "sget" && next === "sset" ||
		curr === "sset" && next === "sget"
	  ) {
		privateNameMap[name] = "true";
		return false
	  } else if (!curr) {
		privateNameMap[name] = next;
		return false
	  } else {
		return true
	  }
	}
  
	function checkKeyName(node, name) {
	  var computed = node.computed;
	  var key = node.key;
	  return !computed && (
		key.type === "Identifier" && key.name === name ||
		key.type === "Literal" && key.value === name
	  )
	}
  
	// Parses module export declaration.
  
	pp$8.parseExport = function(node, exports) {
	  this.next();
	  // export * from '...'
	  if (this.eat(types$1.star)) {
		if (this.options.ecmaVersion >= 11) {
		  if (this.eatContextual("as")) {
			node.exported = this.parseModuleExportName();
			this.checkExport(exports, node.exported.name, this.lastTokStart);
		  } else {
			node.exported = null;
		  }
		}
		this.expectContextual("from");
		if (this.type !== types$1.string) { this.unexpected(); }
		node.source = this.parseExprAtom();
		this.semicolon();
		return this.finishNode(node, "ExportAllDeclaration")
	  }
	  if (this.eat(types$1._default)) { // export default ...
		this.checkExport(exports, "default", this.lastTokStart);
		var isAsync;
		if (this.type === types$1._function || (isAsync = this.isAsyncFunction())) {
		  var fNode = this.startNode();
		  this.next();
		  if (isAsync) { this.next(); }
		  node.declaration = this.parseFunction(fNode, FUNC_STATEMENT | FUNC_NULLABLE_ID, false, isAsync);
		} else if (this.type === types$1._class) {
		  var cNode = this.startNode();
		  node.declaration = this.parseClass(cNode, "nullableID");
		} else {
		  node.declaration = this.parseMaybeAssign();
		  this.semicolon();
		}
		return this.finishNode(node, "ExportDefaultDeclaration")
	  }
	  // export var|const|let|function|class ...
	  if (this.shouldParseExportStatement()) {
		node.declaration = this.parseStatement(null);
		if (node.declaration.type === "VariableDeclaration")
		  { this.checkVariableExport(exports, node.declaration.declarations); }
		else
		  { this.checkExport(exports, node.declaration.id.name, node.declaration.id.start); }
		node.specifiers = [];
		node.source = null;
	  } else { // export { x, y as z } [from '...']
		node.declaration = null;
		node.specifiers = this.parseExportSpecifiers(exports);
		if (this.eatContextual("from")) {
		  if (this.type !== types$1.string) { this.unexpected(); }
		  node.source = this.parseExprAtom();
		} else {
		  for (var i = 0, list = node.specifiers; i < list.length; i += 1) {
			// check for keywords used as local names
			var spec = list[i];
  
			this.checkUnreserved(spec.local);
			// check if export is defined
			this.checkLocalExport(spec.local);
  
			if (spec.local.type === "Literal") {
			  this.raise(spec.local.start, "A string literal cannot be used as an exported binding without `from`.");
			}
		  }
  
		  node.source = null;
		}
		this.semicolon();
	  }
	  return this.finishNode(node, "ExportNamedDeclaration")
	};
  
	pp$8.checkExport = function(exports, name, pos) {
	  if (!exports) { return }
	  if (hasOwn(exports, name))
		{ this.raiseRecoverable(pos, "Duplicate export '" + name + "'"); }
	  exports[name] = true;
	};
  
	pp$8.checkPatternExport = function(exports, pat) {
	  var type = pat.type;
	  if (type === "Identifier")
		{ this.checkExport(exports, pat.name, pat.start); }
	  else if (type === "ObjectPattern")
		{ for (var i = 0, list = pat.properties; i < list.length; i += 1)
		  {
			var prop = list[i];
  
			this.checkPatternExport(exports, prop);
		  } }
	  else if (type === "ArrayPattern")
		{ for (var i$1 = 0, list$1 = pat.elements; i$1 < list$1.length; i$1 += 1) {
		  var elt = list$1[i$1];
  
			if (elt) { this.checkPatternExport(exports, elt); }
		} }
	  else if (type === "Property")
		{ this.checkPatternExport(exports, pat.value); }
	  else if (type === "AssignmentPattern")
		{ this.checkPatternExport(exports, pat.left); }
	  else if (type === "RestElement")
		{ this.checkPatternExport(exports, pat.argument); }
	  else if (type === "ParenthesizedExpression")
		{ this.checkPatternExport(exports, pat.expression); }
	};
  
	pp$8.checkVariableExport = function(exports, decls) {
	  if (!exports) { return }
	  for (var i = 0, list = decls; i < list.length; i += 1)
		{
		var decl = list[i];
  
		this.checkPatternExport(exports, decl.id);
	  }
	};
  
	pp$8.shouldParseExportStatement = function() {
	  return this.type.keyword === "var" ||
		this.type.keyword === "const" ||
		this.type.keyword === "class" ||
		this.type.keyword === "function" ||
		this.isLet() ||
		this.isAsyncFunction()
	};
  
	// Parses a comma-separated list of module exports.
  
	pp$8.parseExportSpecifiers = function(exports) {
	  var nodes = [], first = true;
	  // export { x, y as z } [from '...']
	  this.expect(types$1.braceL);
	  while (!this.eat(types$1.braceR)) {
		if (!first) {
		  this.expect(types$1.comma);
		  if (this.afterTrailingComma(types$1.braceR)) { break }
		} else { first = false; }
  
		var node = this.startNode();
		node.local = this.parseModuleExportName();
		node.exported = this.eatContextual("as") ? this.parseModuleExportName() : node.local;
		this.checkExport(
		  exports,
		  node.exported[node.exported.type === "Identifier" ? "name" : "value"],
		  node.exported.start
		);
		nodes.push(this.finishNode(node, "ExportSpecifier"));
	  }
	  return nodes
	};
  
	// Parses import declaration.
  
	pp$8.parseImport = function(node) {
	  this.next();
	  // import '...'
	  if (this.type === types$1.string) {
		node.specifiers = empty$1;
		node.source = this.parseExprAtom();
	  } else {
		node.specifiers = this.parseImportSpecifiers();
		this.expectContextual("from");
		node.source = this.type === types$1.string ? this.parseExprAtom() : this.unexpected();
	  }
	  this.semicolon();
	  return this.finishNode(node, "ImportDeclaration")
	};
  
	// Parses a comma-separated list of module imports.
  
	pp$8.parseImportSpecifiers = function() {
	  var nodes = [], first = true;
	  if (this.type === types$1.name) {
		// import defaultObj, { x, y as z } from '...'
		var node = this.startNode();
		node.local = this.parseIdent();
		this.checkLValSimple(node.local, BIND_LEXICAL);
		nodes.push(this.finishNode(node, "ImportDefaultSpecifier"));
		if (!this.eat(types$1.comma)) { return nodes }
	  }
	  if (this.type === types$1.star) {
		var node$1 = this.startNode();
		this.next();
		this.expectContextual("as");
		node$1.local = this.parseIdent();
		this.checkLValSimple(node$1.local, BIND_LEXICAL);
		nodes.push(this.finishNode(node$1, "ImportNamespaceSpecifier"));
		return nodes
	  }
	  this.expect(types$1.braceL);
	  while (!this.eat(types$1.braceR)) {
		if (!first) {
		  this.expect(types$1.comma);
		  if (this.afterTrailingComma(types$1.braceR)) { break }
		} else { first = false; }
  
		var node$2 = this.startNode();
		node$2.imported = this.parseModuleExportName();
		if (this.eatContextual("as")) {
		  node$2.local = this.parseIdent();
		} else {
		  this.checkUnreserved(node$2.imported);
		  node$2.local = node$2.imported;
		}
		this.checkLValSimple(node$2.local, BIND_LEXICAL);
		nodes.push(this.finishNode(node$2, "ImportSpecifier"));
	  }
	  return nodes
	};
  
	pp$8.parseModuleExportName = function() {
	  if (this.options.ecmaVersion >= 13 && this.type === types$1.string) {
		var stringLiteral = this.parseLiteral(this.value);
		if (loneSurrogate.test(stringLiteral.value)) {
		  this.raise(stringLiteral.start, "An export name cannot include a lone surrogate.");
		}
		return stringLiteral
	  }
	  return this.parseIdent(true)
	};
  
	// Set `ExpressionStatement#directive` property for directive prologues.
	pp$8.adaptDirectivePrologue = function(statements) {
	  for (var i = 0; i < statements.length && this.isDirectiveCandidate(statements[i]); ++i) {
		statements[i].directive = statements[i].expression.raw.slice(1, -1);
	  }
	};
	pp$8.isDirectiveCandidate = function(statement) {
	  return (
		statement.type === "ExpressionStatement" &&
		statement.expression.type === "Literal" &&
		typeof statement.expression.value === "string" &&
		// Reject parenthesized strings.
		(this.input[statement.start] === "\"" || this.input[statement.start] === "'")
	  )
	};
  
	var pp$7 = Parser.prototype;
  
	// Convert existing expression atom to assignable pattern
	// if possible.
  
	pp$7.toAssignable = function(node, isBinding, refDestructuringErrors) {
	  if (this.options.ecmaVersion >= 6 && node) {
		switch (node.type) {
		case "Identifier":
		  if (this.inAsync && node.name === "await")
			{ this.raise(node.start, "Cannot use 'await' as identifier inside an async function"); }
		  break
  
		case "ObjectPattern":
		case "ArrayPattern":
		case "AssignmentPattern":
		case "RestElement":
		  break
  
		case "ObjectExpression":
		  node.type = "ObjectPattern";
		  if (refDestructuringErrors) { this.checkPatternErrors(refDestructuringErrors, true); }
		  for (var i = 0, list = node.properties; i < list.length; i += 1) {
			var prop = list[i];
  
		  this.toAssignable(prop, isBinding);
			// Early error:
			//   AssignmentRestProperty[Yield, Await] :
			//     `...` DestructuringAssignmentTarget[Yield, Await]
			//
			//   It is a Syntax Error if |DestructuringAssignmentTarget| is an |ArrayLiteral| or an |ObjectLiteral|.
			if (
			  prop.type === "RestElement" &&
			  (prop.argument.type === "ArrayPattern" || prop.argument.type === "ObjectPattern")
			) {
			  this.raise(prop.argument.start, "Unexpected token");
			}
		  }
		  break
  
		case "Property":
		  // AssignmentProperty has type === "Property"
		  if (node.kind !== "init") { this.raise(node.key.start, "Object pattern can't contain getter or setter"); }
		  this.toAssignable(node.value, isBinding);
		  break
  
		case "ArrayExpression":
		  node.type = "ArrayPattern";
		  if (refDestructuringErrors) { this.checkPatternErrors(refDestructuringErrors, true); }
		  this.toAssignableList(node.elements, isBinding);
		  break
  
		case "SpreadElement":
		  node.type = "RestElement";
		  this.toAssignable(node.argument, isBinding);
		  if (node.argument.type === "AssignmentPattern")
			{ this.raise(node.argument.start, "Rest elements cannot have a default value"); }
		  break
  
		case "AssignmentExpression":
		  if (node.operator !== "=") { this.raise(node.left.end, "Only '=' operator can be used for specifying default value."); }
		  node.type = "AssignmentPattern";
		  delete node.operator;
		  this.toAssignable(node.left, isBinding);
		  break
  
		case "ParenthesizedExpression":
		  this.toAssignable(node.expression, isBinding, refDestructuringErrors);
		  break
  
		case "ChainExpression":
		  this.raiseRecoverable(node.start, "Optional chaining cannot appear in left-hand side");
		  break
  
		case "MemberExpression":
		  if (!isBinding) { break }
  
		default:
		  this.raise(node.start, "Assigning to rvalue");
		}
	  } else if (refDestructuringErrors) { this.checkPatternErrors(refDestructuringErrors, true); }
	  return node
	};
  
	// Convert list of expression atoms to binding list.
  
	pp$7.toAssignableList = function(exprList, isBinding) {
	  var end = exprList.length;
	  for (var i = 0; i < end; i++) {
		var elt = exprList[i];
		if (elt) { this.toAssignable(elt, isBinding); }
	  }
	  if (end) {
		var last = exprList[end - 1];
		if (this.options.ecmaVersion === 6 && isBinding && last && last.type === "RestElement" && last.argument.type !== "Identifier")
		  { this.unexpected(last.argument.start); }
	  }
	  return exprList
	};
  
	// Parses spread element.
  
	pp$7.parseSpread = function(refDestructuringErrors) {
	  var node = this.startNode();
	  this.next();
	  node.argument = this.parseMaybeAssign(false, refDestructuringErrors);
	  return this.finishNode(node, "SpreadElement")
	};
  
	pp$7.parseRestBinding = function() {
	  var node = this.startNode();
	  this.next();
  
	  // RestElement inside of a function parameter must be an identifier
	  if (this.options.ecmaVersion === 6 && this.type !== types$1.name)
		{ this.unexpected(); }
  
	  node.argument = this.parseBindingAtom();
  
	  return this.finishNode(node, "RestElement")
	};
  
	// Parses lvalue (assignable) atom.
  
	pp$7.parseBindingAtom = function() {
	  if (this.options.ecmaVersion >= 6) {
		switch (this.type) {
		case types$1.bracketL:
		  var node = this.startNode();
		  this.next();
		  node.elements = this.parseBindingList(types$1.bracketR, true, true);
		  return this.finishNode(node, "ArrayPattern")
  
		case types$1.braceL:
		  return this.parseObj(true)
		}
	  }
	  return this.parseIdent()
	};
  
	pp$7.parseBindingList = function(close, allowEmpty, allowTrailingComma) {
	  var elts = [], first = true;
	  while (!this.eat(close)) {
		if (first) { first = false; }
		else { this.expect(types$1.comma); }
		if (allowEmpty && this.type === types$1.comma) {
		  elts.push(null);
		} else if (allowTrailingComma && this.afterTrailingComma(close)) {
		  break
		} else if (this.type === types$1.ellipsis) {
		  var rest = this.parseRestBinding();
		  this.parseBindingListItem(rest);
		  elts.push(rest);
		  if (this.type === types$1.comma) { this.raise(this.start, "Comma is not permitted after the rest element"); }
		  this.expect(close);
		  break
		} else {
		  var elem = this.parseMaybeDefault(this.start, this.startLoc);
		  this.parseBindingListItem(elem);
		  elts.push(elem);
		}
	  }
	  return elts
	};
  
	pp$7.parseBindingListItem = function(param) {
	  return param
	};
  
	// Parses assignment pattern around given atom if possible.
  
	pp$7.parseMaybeDefault = function(startPos, startLoc, left) {
	  left = left || this.parseBindingAtom();
	  if (this.options.ecmaVersion < 6 || !this.eat(types$1.eq)) { return left }
	  var node = this.startNodeAt(startPos, startLoc);
	  node.left = left;
	  node.right = this.parseMaybeAssign();
	  return this.finishNode(node, "AssignmentPattern")
	};
  
	// The following three functions all verify that a node is an lvalue —
	// something that can be bound, or assigned to. In order to do so, they perform
	// a variety of checks:
	//
	// - Check that none of the bound/assigned-to identifiers are reserved words.
	// - Record name declarations for bindings in the appropriate scope.
	// - Check duplicate argument names, if checkClashes is set.
	//
	// If a complex binding pattern is encountered (e.g., object and array
	// destructuring), the entire pattern is recursively checked.
	//
	// There are three versions of checkLVal*() appropriate for different
	// circumstances:
	//
	// - checkLValSimple() shall be used if the syntactic construct supports
	//   nothing other than identifiers and member expressions. Parenthesized
	//   expressions are also correctly handled. This is generally appropriate for
	//   constructs for which the spec says
	//
	//   > It is a Syntax Error if AssignmentTargetType of [the production] is not
	//   > simple.
	//
	//   It is also appropriate for checking if an identifier is valid and not
	//   defined elsewhere, like import declarations or function/class identifiers.
	//
	//   Examples where this is used include:
	//     a += …;
	//     import a from '…';
	//   where a is the node to be checked.
	//
	// - checkLValPattern() shall be used if the syntactic construct supports
	//   anything checkLValSimple() supports, as well as object and array
	//   destructuring patterns. This is generally appropriate for constructs for
	//   which the spec says
	//
	//   > It is a Syntax Error if [the production] is neither an ObjectLiteral nor
	//   > an ArrayLiteral and AssignmentTargetType of [the production] is not
	//   > simple.
	//
	//   Examples where this is used include:
	//     (a = …);
	//     const a = …;
	//     try { … } catch (a) { … }
	//   where a is the node to be checked.
	//
	// - checkLValInnerPattern() shall be used if the syntactic construct supports
	//   anything checkLValPattern() supports, as well as default assignment
	//   patterns, rest elements, and other constructs that may appear within an
	//   object or array destructuring pattern.
	//
	//   As a special case, function parameters also use checkLValInnerPattern(),
	//   as they also support defaults and rest constructs.
	//
	// These functions deliberately support both assignment and binding constructs,
	// as the logic for both is exceedingly similar. If the node is the target of
	// an assignment, then bindingType should be set to BIND_NONE. Otherwise, it
	// should be set to the appropriate BIND_* constant, like BIND_VAR or
	// BIND_LEXICAL.
	//
	// If the function is called with a non-BIND_NONE bindingType, then
	// additionally a checkClashes object may be specified to allow checking for
	// duplicate argument names. checkClashes is ignored if the provided construct
	// is an assignment (i.e., bindingType is BIND_NONE).
  
	pp$7.checkLValSimple = function(expr, bindingType, checkClashes) {
	  if ( bindingType === void 0 ) bindingType = BIND_NONE;
  
	  var isBind = bindingType !== BIND_NONE;
  
	  switch (expr.type) {
	  case "Identifier":
		if (this.strict && this.reservedWordsStrictBind.test(expr.name))
		  { this.raiseRecoverable(expr.start, (isBind ? "Binding " : "Assigning to ") + expr.name + " in strict mode"); }
		if (isBind) {
		  if (bindingType === BIND_LEXICAL && expr.name === "let")
			{ this.raiseRecoverable(expr.start, "let is disallowed as a lexically bound name"); }
		  if (checkClashes) {
			if (hasOwn(checkClashes, expr.name))
			  { this.raiseRecoverable(expr.start, "Argument name clash"); }
			checkClashes[expr.name] = true;
		  }
		  if (bindingType !== BIND_OUTSIDE) { this.declareName(expr.name, bindingType, expr.start); }
		}
		break
  
	  case "ChainExpression":
		this.raiseRecoverable(expr.start, "Optional chaining cannot appear in left-hand side");
		break
  
	  case "MemberExpression":
		if (isBind) { this.raiseRecoverable(expr.start, "Binding member expression"); }
		break
  
	  case "ParenthesizedExpression":
		if (isBind) { this.raiseRecoverable(expr.start, "Binding parenthesized expression"); }
		return this.checkLValSimple(expr.expression, bindingType, checkClashes)
  
	  default:
		this.raise(expr.start, (isBind ? "Binding" : "Assigning to") + " rvalue");
	  }
	};
  
	pp$7.checkLValPattern = function(expr, bindingType, checkClashes) {
	  if ( bindingType === void 0 ) bindingType = BIND_NONE;
  
	  switch (expr.type) {
	  case "ObjectPattern":
		for (var i = 0, list = expr.properties; i < list.length; i += 1) {
		  var prop = list[i];
  
		this.checkLValInnerPattern(prop, bindingType, checkClashes);
		}
		break
  
	  case "ArrayPattern":
		for (var i$1 = 0, list$1 = expr.elements; i$1 < list$1.length; i$1 += 1) {
		  var elem = list$1[i$1];
  
		if (elem) { this.checkLValInnerPattern(elem, bindingType, checkClashes); }
		}
		break
  
	  default:
		this.checkLValSimple(expr, bindingType, checkClashes);
	  }
	};
  
	pp$7.checkLValInnerPattern = function(expr, bindingType, checkClashes) {
	  if ( bindingType === void 0 ) bindingType = BIND_NONE;
  
	  switch (expr.type) {
	  case "Property":
		// AssignmentProperty has type === "Property"
		this.checkLValInnerPattern(expr.value, bindingType, checkClashes);
		break
  
	  case "AssignmentPattern":
		this.checkLValPattern(expr.left, bindingType, checkClashes);
		break
  
	  case "RestElement":
		this.checkLValPattern(expr.argument, bindingType, checkClashes);
		break
  
	  default:
		this.checkLValPattern(expr, bindingType, checkClashes);
	  }
	};
  
	// The algorithm used to determine whether a regexp can appear at a
  
	var TokContext = function TokContext(token, isExpr, preserveSpace, override, generator) {
	  this.token = token;
	  this.isExpr = !!isExpr;
	  this.preserveSpace = !!preserveSpace;
	  this.override = override;
	  this.generator = !!generator;
	};
  
	var types = {
	  b_stat: new TokContext("{", false),
	  b_expr: new TokContext("{", true),
	  b_tmpl: new TokContext("${", false),
	  p_stat: new TokContext("(", false),
	  p_expr: new TokContext("(", true),
	  q_tmpl: new TokContext("`", true, true, function (p) { return p.tryReadTemplateToken(); }),
	  f_stat: new TokContext("function", false),
	  f_expr: new TokContext("function", true),
	  f_expr_gen: new TokContext("function", true, false, null, true),
	  f_gen: new TokContext("function", false, false, null, true)
	};
  
	var pp$6 = Parser.prototype;
  
	pp$6.initialContext = function() {
	  return [types.b_stat]
	};
  
	pp$6.curContext = function() {
	  return this.context[this.context.length - 1]
	};
  
	pp$6.braceIsBlock = function(prevType) {
	  var parent = this.curContext();
	  if (parent === types.f_expr || parent === types.f_stat)
		{ return true }
	  if (prevType === types$1.colon && (parent === types.b_stat || parent === types.b_expr))
		{ return !parent.isExpr }
  
	  // The check for `tt.name && exprAllowed` detects whether we are
	  // after a `yield` or `of` construct. See the `updateContext` for
	  // `tt.name`.
	  if (prevType === types$1._return || prevType === types$1.name && this.exprAllowed)
		{ return lineBreak.test(this.input.slice(this.lastTokEnd, this.start)) }
	  if (prevType === types$1._else || prevType === types$1.semi || prevType === types$1.eof || prevType === types$1.parenR || prevType === types$1.arrow)
		{ return true }
	  if (prevType === types$1.braceL)
		{ return parent === types.b_stat }
	  if (prevType === types$1._var || prevType === types$1._const || prevType === types$1.name)
		{ return false }
	  return !this.exprAllowed
	};
  
	pp$6.inGeneratorContext = function() {
	  for (var i = this.context.length - 1; i >= 1; i--) {
		var context = this.context[i];
		if (context.token === "function")
		  { return context.generator }
	  }
	  return false
	};
  
	pp$6.updateContext = function(prevType) {
	  var update, type = this.type;
	  if (type.keyword && prevType === types$1.dot)
		{ this.exprAllowed = false; }
	  else if (update = type.updateContext)
		{ update.call(this, prevType); }
	  else
		{ this.exprAllowed = type.beforeExpr; }
	};
  
	// Used to handle egde case when token context could not be inferred correctly in tokenize phase
	pp$6.overrideContext = function(tokenCtx) {
	  if (this.curContext() !== tokenCtx) {
		this.context[this.context.length - 1] = tokenCtx;
	  }
	};
  
	// Token-specific context update code
  
	types$1.parenR.updateContext = types$1.braceR.updateContext = function() {
	  if (this.context.length === 1) {
		this.exprAllowed = true;
		return
	  }
	  var out = this.context.pop();
	  if (out === types.b_stat && this.curContext().token === "function") {
		out = this.context.pop();
	  }
	  this.exprAllowed = !out.isExpr;
	};
  
	types$1.braceL.updateContext = function(prevType) {
	  this.context.push(this.braceIsBlock(prevType) ? types.b_stat : types.b_expr);
	  this.exprAllowed = true;
	};
  
	types$1.dollarBraceL.updateContext = function() {
	  this.context.push(types.b_tmpl);
	  this.exprAllowed = true;
	};
  
	types$1.parenL.updateContext = function(prevType) {
	  var statementParens = prevType === types$1._if || prevType === types$1._for || prevType === types$1._with || prevType === types$1._while;
	  this.context.push(statementParens ? types.p_stat : types.p_expr);
	  this.exprAllowed = true;
	};
  
	types$1.incDec.updateContext = function() {
	  // tokExprAllowed stays unchanged
	};
  
	types$1._function.updateContext = types$1._class.updateContext = function(prevType) {
	  if (prevType.beforeExpr && prevType !== types$1._else &&
		  !(prevType === types$1.semi && this.curContext() !== types.p_stat) &&
		  !(prevType === types$1._return && lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) &&
		  !((prevType === types$1.colon || prevType === types$1.braceL) && this.curContext() === types.b_stat))
		{ this.context.push(types.f_expr); }
	  else
		{ this.context.push(types.f_stat); }
	  this.exprAllowed = false;
	};
  
	types$1.backQuote.updateContext = function() {
	  if (this.curContext() === types.q_tmpl)
		{ this.context.pop(); }
	  else
		{ this.context.push(types.q_tmpl); }
	  this.exprAllowed = false;
	};
  
	types$1.star.updateContext = function(prevType) {
	  if (prevType === types$1._function) {
		var index = this.context.length - 1;
		if (this.context[index] === types.f_expr)
		  { this.context[index] = types.f_expr_gen; }
		else
		  { this.context[index] = types.f_gen; }
	  }
	  this.exprAllowed = true;
	};
  
	types$1.name.updateContext = function(prevType) {
	  var allowed = false;
	  if (this.options.ecmaVersion >= 6 && prevType !== types$1.dot) {
		if (this.value === "of" && !this.exprAllowed ||
			this.value === "yield" && this.inGeneratorContext())
		  { allowed = true; }
	  }
	  this.exprAllowed = allowed;
	};
  
	// A recursive descent parser operates by defining functions for all
  
	var pp$5 = Parser.prototype;
  
	// Check if property name clashes with already added.
	// Object/class getters and setters are not allowed to clash —
	// either with each other or with an init property — and in
	// strict mode, init properties are also not allowed to be repeated.
  
	pp$5.checkPropClash = function(prop, propHash, refDestructuringErrors) {
	  if (this.options.ecmaVersion >= 9 && prop.type === "SpreadElement")
		{ return }
	  if (this.options.ecmaVersion >= 6 && (prop.computed || prop.method || prop.shorthand))
		{ return }
	  var key = prop.key;
	  var name;
	  switch (key.type) {
	  case "Identifier": name = key.name; break
	  case "Literal": name = String(key.value); break
	  default: return
	  }
	  var kind = prop.kind;
	  if (this.options.ecmaVersion >= 6) {
		if (name === "__proto__" && kind === "init") {
		  if (propHash.proto) {
			if (refDestructuringErrors) {
			  if (refDestructuringErrors.doubleProto < 0) {
				refDestructuringErrors.doubleProto = key.start;
			  }
			} else {
			  this.raiseRecoverable(key.start, "Redefinition of __proto__ property");
			}
		  }
		  propHash.proto = true;
		}
		return
	  }
	  name = "$" + name;
	  var other = propHash[name];
	  if (other) {
		var redefinition;
		if (kind === "init") {
		  redefinition = this.strict && other.init || other.get || other.set;
		} else {
		  redefinition = other.init || other[kind];
		}
		if (redefinition)
		  { this.raiseRecoverable(key.start, "Redefinition of property"); }
	  } else {
		other = propHash[name] = {
		  init: false,
		  get: false,
		  set: false
		};
	  }
	  other[kind] = true;
	};
  
	// ### Expression parsing
  
	// These nest, from the most general expression type at the top to
	// 'atomic', nondivisible expression types at the bottom. Most of
	// the functions will simply let the function(s) below them parse,
	// and, *if* the syntactic construct they handle is present, wrap
	// the AST node that the inner parser gave them in another node.
  
	// Parse a full expression. The optional arguments are used to
	// forbid the `in` operator (in for loops initalization expressions)
	// and provide reference for storing '=' operator inside shorthand
	// property assignment in contexts where both object expression
	// and object pattern might appear (so it's possible to raise
	// delayed syntax error at correct position).
  
	pp$5.parseExpression = function(forInit, refDestructuringErrors) {
	  var startPos = this.start, startLoc = this.startLoc;
	  var expr = this.parseMaybeAssign(forInit, refDestructuringErrors);
	  if (this.type === types$1.comma) {
		var node = this.startNodeAt(startPos, startLoc);
		node.expressions = [expr];
		while (this.eat(types$1.comma)) { node.expressions.push(this.parseMaybeAssign(forInit, refDestructuringErrors)); }
		return this.finishNode(node, "SequenceExpression")
	  }
	  return expr
	};
  
	// Parse an assignment expression. This includes applications of
	// operators like `+=`.
  
	pp$5.parseMaybeAssign = function(forInit, refDestructuringErrors, afterLeftParse) {
	  if (this.isContextual("yield")) {
		if (this.inGenerator) { return this.parseYield(forInit) }
		// The tokenizer will assume an expression is allowed after
		// `yield`, but this isn't that kind of yield
		else { this.exprAllowed = false; }
	  }
  
	  var ownDestructuringErrors = false, oldParenAssign = -1, oldTrailingComma = -1, oldDoubleProto = -1;
	  if (refDestructuringErrors) {
		oldParenAssign = refDestructuringErrors.parenthesizedAssign;
		oldTrailingComma = refDestructuringErrors.trailingComma;
		oldDoubleProto = refDestructuringErrors.doubleProto;
		refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = -1;
	  } else {
		refDestructuringErrors = new DestructuringErrors;
		ownDestructuringErrors = true;
	  }
  
	  var startPos = this.start, startLoc = this.startLoc;
	  if (this.type === types$1.parenL || this.type === types$1.name) {
		this.potentialArrowAt = this.start;
		this.potentialArrowInForAwait = forInit === "await";
	  }
	  var left = this.parseMaybeConditional(forInit, refDestructuringErrors);
	  if (afterLeftParse) { left = afterLeftParse.call(this, left, startPos, startLoc); }
	  if (this.type.isAssign) {
		var node = this.startNodeAt(startPos, startLoc);
		node.operator = this.value;
		if (this.type === types$1.eq)
		  { left = this.toAssignable(left, false, refDestructuringErrors); }
		if (!ownDestructuringErrors) {
		  refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = refDestructuringErrors.doubleProto = -1;
		}
		if (refDestructuringErrors.shorthandAssign >= left.start)
		  { refDestructuringErrors.shorthandAssign = -1; } // reset because shorthand default was used correctly
		if (this.type === types$1.eq)
		  { this.checkLValPattern(left); }
		else
		  { this.checkLValSimple(left); }
		node.left = left;
		this.next();
		node.right = this.parseMaybeAssign(forInit);
		if (oldDoubleProto > -1) { refDestructuringErrors.doubleProto = oldDoubleProto; }
		return this.finishNode(node, "AssignmentExpression")
	  } else {
		if (ownDestructuringErrors) { this.checkExpressionErrors(refDestructuringErrors, true); }
	  }
	  if (oldParenAssign > -1) { refDestructuringErrors.parenthesizedAssign = oldParenAssign; }
	  if (oldTrailingComma > -1) { refDestructuringErrors.trailingComma = oldTrailingComma; }
	  return left
	};
  
	// Parse a ternary conditional (`?:`) operator.
  
	pp$5.parseMaybeConditional = function(forInit, refDestructuringErrors) {
	  var startPos = this.start, startLoc = this.startLoc;
	  var expr = this.parseExprOps(forInit, refDestructuringErrors);
	  if (this.checkExpressionErrors(refDestructuringErrors)) { return expr }
	  if (this.eat(types$1.question)) {
		var node = this.startNodeAt(startPos, startLoc);
		node.test = expr;
		node.consequent = this.parseMaybeAssign();
		this.expect(types$1.colon);
		node.alternate = this.parseMaybeAssign(forInit);
		return this.finishNode(node, "ConditionalExpression")
	  }
	  return expr
	};
  
	// Start the precedence parser.
  
	pp$5.parseExprOps = function(forInit, refDestructuringErrors) {
	  var startPos = this.start, startLoc = this.startLoc;
	  var expr = this.parseMaybeUnary(refDestructuringErrors, false, false, forInit);
	  if (this.checkExpressionErrors(refDestructuringErrors)) { return expr }
	  return expr.start === startPos && expr.type === "ArrowFunctionExpression" ? expr : this.parseExprOp(expr, startPos, startLoc, -1, forInit)
	};
  
	// Parse binary operators with the operator precedence parsing
	// algorithm. `left` is the left-hand side of the operator.
	// `minPrec` provides context that allows the function to stop and
	// defer further parser to one of its callers when it encounters an
	// operator that has a lower precedence than the set it is parsing.
  
	pp$5.parseExprOp = function(left, leftStartPos, leftStartLoc, minPrec, forInit) {
	  var prec = this.type.binop;
	  if (prec != null && (!forInit || this.type !== types$1._in)) {
		if (prec > minPrec) {
		  var logical = this.type === types$1.logicalOR || this.type === types$1.logicalAND;
		  var coalesce = this.type === types$1.coalesce;
		  if (coalesce) {
			// Handle the precedence of `tt.coalesce` as equal to the range of logical expressions.
			// In other words, `node.right` shouldn't contain logical expressions in order to check the mixed error.
			prec = types$1.logicalAND.binop;
		  }
		  var op = this.value;
		  this.next();
		  var startPos = this.start, startLoc = this.startLoc;
		  var right = this.parseExprOp(this.parseMaybeUnary(null, false, false, forInit), startPos, startLoc, prec, forInit);
		  var node = this.buildBinary(leftStartPos, leftStartLoc, left, right, op, logical || coalesce);
		  if ((logical && this.type === types$1.coalesce) || (coalesce && (this.type === types$1.logicalOR || this.type === types$1.logicalAND))) {
			this.raiseRecoverable(this.start, "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses");
		  }
		  return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec, forInit)
		}
	  }
	  return left
	};
  
	pp$5.buildBinary = function(startPos, startLoc, left, right, op, logical) {
	  if (right.type === "PrivateIdentifier") { this.raise(right.start, "Private identifier can only be left side of binary expression"); }
	  var node = this.startNodeAt(startPos, startLoc);
	  node.left = left;
	  node.operator = op;
	  node.right = right;
	  return this.finishNode(node, logical ? "LogicalExpression" : "BinaryExpression")
	};
  
	// Parse unary operators, both prefix and postfix.
  
	pp$5.parseMaybeUnary = function(refDestructuringErrors, sawUnary, incDec, forInit) {
	  var startPos = this.start, startLoc = this.startLoc, expr;
	  if (this.isContextual("await") && this.canAwait) {
		expr = this.parseAwait(forInit);
		sawUnary = true;
	  } else if (this.type.prefix) {
		var node = this.startNode(), update = this.type === types$1.incDec;
		node.operator = this.value;
		node.prefix = true;
		this.next();
		node.argument = this.parseMaybeUnary(null, true, update, forInit);
		this.checkExpressionErrors(refDestructuringErrors, true);
		if (update) { this.checkLValSimple(node.argument); }
		else if (this.strict && node.operator === "delete" &&
				 node.argument.type === "Identifier")
		  { this.raiseRecoverable(node.start, "Deleting local variable in strict mode"); }
		else if (node.operator === "delete" && isPrivateFieldAccess(node.argument))
		  { this.raiseRecoverable(node.start, "Private fields can not be deleted"); }
		else { sawUnary = true; }
		expr = this.finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
	  } else if (!sawUnary && this.type === types$1.privateId) {
		if (forInit || this.privateNameStack.length === 0) { this.unexpected(); }
		expr = this.parsePrivateIdent();
		// only could be private fields in 'in', such as #x in obj
		if (this.type !== types$1._in) { this.unexpected(); }
	  } else {
		expr = this.parseExprSubscripts(refDestructuringErrors, forInit);
		if (this.checkExpressionErrors(refDestructuringErrors)) { return expr }
		while (this.type.postfix && !this.canInsertSemicolon()) {
		  var node$1 = this.startNodeAt(startPos, startLoc);
		  node$1.operator = this.value;
		  node$1.prefix = false;
		  node$1.argument = expr;
		  this.checkLValSimple(expr);
		  this.next();
		  expr = this.finishNode(node$1, "UpdateExpression");
		}
	  }
  
	  if (!incDec && this.eat(types$1.starstar)) {
		if (sawUnary)
		  { this.unexpected(this.lastTokStart); }
		else
		  { return this.buildBinary(startPos, startLoc, expr, this.parseMaybeUnary(null, false, false, forInit), "**", false) }
	  } else {
		return expr
	  }
	};
  
	function isPrivateFieldAccess(node) {
	  return (
		node.type === "MemberExpression" && node.property.type === "PrivateIdentifier" ||
		node.type === "ChainExpression" && isPrivateFieldAccess(node.expression)
	  )
	}
  
	// Parse call, dot, and `[]`-subscript expressions.
  
	pp$5.parseExprSubscripts = function(refDestructuringErrors, forInit) {
	  var startPos = this.start, startLoc = this.startLoc;
	  var expr = this.parseExprAtom(refDestructuringErrors, forInit);
	  if (expr.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")")
		{ return expr }
	  var result = this.parseSubscripts(expr, startPos, startLoc, false, forInit);
	  if (refDestructuringErrors && result.type === "MemberExpression") {
		if (refDestructuringErrors.parenthesizedAssign >= result.start) { refDestructuringErrors.parenthesizedAssign = -1; }
		if (refDestructuringErrors.parenthesizedBind >= result.start) { refDestructuringErrors.parenthesizedBind = -1; }
		if (refDestructuringErrors.trailingComma >= result.start) { refDestructuringErrors.trailingComma = -1; }
	  }
	  return result
	};
  
	pp$5.parseSubscripts = function(base, startPos, startLoc, noCalls, forInit) {
	  var maybeAsyncArrow = this.options.ecmaVersion >= 8 && base.type === "Identifier" && base.name === "async" &&
		  this.lastTokEnd === base.end && !this.canInsertSemicolon() && base.end - base.start === 5 &&
		  this.potentialArrowAt === base.start;
	  var optionalChained = false;
  
	  while (true) {
		var element = this.parseSubscript(base, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit);
  
		if (element.optional) { optionalChained = true; }
		if (element === base || element.type === "ArrowFunctionExpression") {
		  if (optionalChained) {
			var chainNode = this.startNodeAt(startPos, startLoc);
			chainNode.expression = element;
			element = this.finishNode(chainNode, "ChainExpression");
		  }
		  return element
		}
  
		base = element;
	  }
	};
  
	pp$5.parseSubscript = function(base, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit) {
	  var optionalSupported = this.options.ecmaVersion >= 11;
	  var optional = optionalSupported && this.eat(types$1.questionDot);
	  if (noCalls && optional) { this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions"); }
  
	  var computed = this.eat(types$1.bracketL);
	  if (computed || (optional && this.type !== types$1.parenL && this.type !== types$1.backQuote) || this.eat(types$1.dot)) {
		var node = this.startNodeAt(startPos, startLoc);
		node.object = base;
		if (computed) {
		  node.property = this.parseExpression();
		  this.expect(types$1.bracketR);
		} else if (this.type === types$1.privateId && base.type !== "Super") {
		  node.property = this.parsePrivateIdent();
		} else {
		  node.property = this.parseIdent(this.options.allowReserved !== "never");
		}
		node.computed = !!computed;
		if (optionalSupported) {
		  node.optional = optional;
		}
		base = this.finishNode(node, "MemberExpression");
	  } else if (!noCalls && this.eat(types$1.parenL)) {
		var refDestructuringErrors = new DestructuringErrors, oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
		this.yieldPos = 0;
		this.awaitPos = 0;
		this.awaitIdentPos = 0;
		var exprList = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, false, refDestructuringErrors);
		if (maybeAsyncArrow && !optional && !this.canInsertSemicolon() && this.eat(types$1.arrow)) {
		  this.checkPatternErrors(refDestructuringErrors, false);
		  this.checkYieldAwaitInDefaultParams();
		  if (this.awaitIdentPos > 0)
			{ this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function"); }
		  this.yieldPos = oldYieldPos;
		  this.awaitPos = oldAwaitPos;
		  this.awaitIdentPos = oldAwaitIdentPos;
		  return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, true, forInit)
		}
		this.checkExpressionErrors(refDestructuringErrors, true);
		this.yieldPos = oldYieldPos || this.yieldPos;
		this.awaitPos = oldAwaitPos || this.awaitPos;
		this.awaitIdentPos = oldAwaitIdentPos || this.awaitIdentPos;
		var node$1 = this.startNodeAt(startPos, startLoc);
		node$1.callee = base;
		node$1.arguments = exprList;
		if (optionalSupported) {
		  node$1.optional = optional;
		}
		base = this.finishNode(node$1, "CallExpression");
	  } else if (this.type === types$1.backQuote) {
		if (optional || optionalChained) {
		  this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
		}
		var node$2 = this.startNodeAt(startPos, startLoc);
		node$2.tag = base;
		node$2.quasi = this.parseTemplate({isTagged: true});
		base = this.finishNode(node$2, "TaggedTemplateExpression");
	  }
	  return base
	};
  
	// Parse an atomic expression — either a single token that is an
	// expression, an expression started by a keyword like `function` or
	// `new`, or an expression wrapped in punctuation like `()`, `[]`,
	// or `{}`.
  
	pp$5.parseExprAtom = function(refDestructuringErrors, forInit) {
	  // If a division operator appears in an expression position, the
	  // tokenizer got confused, and we force it to read a regexp instead.
	  if (this.type === types$1.slash) { this.readRegexp(); }
  
	  var node, canBeArrow = this.potentialArrowAt === this.start;
	  switch (this.type) {
	  case types$1._super:
		if (!this.allowSuper)
		  { this.raise(this.start, "'super' keyword outside a method"); }
		node = this.startNode();
		this.next();
		if (this.type === types$1.parenL && !this.allowDirectSuper)
		  { this.raise(node.start, "super() call outside constructor of a subclass"); }
		// The `super` keyword can appear at below:
		// SuperProperty:
		//     super [ Expression ]
		//     super . IdentifierName
		// SuperCall:
		//     super ( Arguments )
		if (this.type !== types$1.dot && this.type !== types$1.bracketL && this.type !== types$1.parenL)
		  { this.unexpected(); }
		return this.finishNode(node, "Super")
  
	  case types$1._this:
		node = this.startNode();
		this.next();
		return this.finishNode(node, "ThisExpression")
  
	  case types$1.name:
		var startPos = this.start, startLoc = this.startLoc, containsEsc = this.containsEsc;
		var id = this.parseIdent(false);
		if (this.options.ecmaVersion >= 8 && !containsEsc && id.name === "async" && !this.canInsertSemicolon() && this.eat(types$1._function)) {
		  this.overrideContext(types.f_expr);
		  return this.parseFunction(this.startNodeAt(startPos, startLoc), 0, false, true, forInit)
		}
		if (canBeArrow && !this.canInsertSemicolon()) {
		  if (this.eat(types$1.arrow))
			{ return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], false, forInit) }
		  if (this.options.ecmaVersion >= 8 && id.name === "async" && this.type === types$1.name && !containsEsc &&
			  (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc)) {
			id = this.parseIdent(false);
			if (this.canInsertSemicolon() || !this.eat(types$1.arrow))
			  { this.unexpected(); }
			return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], true, forInit)
		  }
		}
		return id
  
	  case types$1.regexp:
		var value = this.value;
		node = this.parseLiteral(value.value);
		node.regex = {pattern: value.pattern, flags: value.flags};
		return node
  
	  case types$1.num: case types$1.string:
		return this.parseLiteral(this.value)
  
	  case types$1._null: case types$1._true: case types$1._false:
		node = this.startNode();
		node.value = this.type === types$1._null ? null : this.type === types$1._true;
		node.raw = this.type.keyword;
		this.next();
		return this.finishNode(node, "Literal")
  
	  case types$1.parenL:
		var start = this.start, expr = this.parseParenAndDistinguishExpression(canBeArrow, forInit);
		if (refDestructuringErrors) {
		  if (refDestructuringErrors.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(expr))
			{ refDestructuringErrors.parenthesizedAssign = start; }
		  if (refDestructuringErrors.parenthesizedBind < 0)
			{ refDestructuringErrors.parenthesizedBind = start; }
		}
		return expr
  
	  case types$1.bracketL:
		node = this.startNode();
		this.next();
		node.elements = this.parseExprList(types$1.bracketR, true, true, refDestructuringErrors);
		return this.finishNode(node, "ArrayExpression")
  
	  case types$1.braceL:
		this.overrideContext(types.b_expr);
		return this.parseObj(false, refDestructuringErrors)
  
	  case types$1._function:
		node = this.startNode();
		this.next();
		return this.parseFunction(node, 0)
  
	  case types$1._class:
		return this.parseClass(this.startNode(), false)
  
	  case types$1._new:
		return this.parseNew()
  
	  case types$1.backQuote:
		return this.parseTemplate()
  
	  case types$1._import:
		if (this.options.ecmaVersion >= 11) {
		  return this.parseExprImport()
		} else {
		  return this.unexpected()
		}
  
	  default:
		this.unexpected();
	  }
	};
  
	pp$5.parseExprImport = function() {
	  var node = this.startNode();
  
	  // Consume `import` as an identifier for `import.meta`.
	  // Because `this.parseIdent(true)` doesn't check escape sequences, it needs the check of `this.containsEsc`.
	  if (this.containsEsc) { this.raiseRecoverable(this.start, "Escape sequence in keyword import"); }
	  var meta = this.parseIdent(true);
  
	  switch (this.type) {
	  case types$1.parenL:
		return this.parseDynamicImport(node)
	  case types$1.dot:
		node.meta = meta;
		return this.parseImportMeta(node)
	  default:
		this.unexpected();
	  }
	};
  
	pp$5.parseDynamicImport = function(node) {
	  this.next(); // skip `(`
  
	  // Parse node.source.
	  node.source = this.parseMaybeAssign();
  
	  // Verify ending.
	  if (!this.eat(types$1.parenR)) {
		var errorPos = this.start;
		if (this.eat(types$1.comma) && this.eat(types$1.parenR)) {
		  this.raiseRecoverable(errorPos, "Trailing comma is not allowed in import()");
		} else {
		  this.unexpected(errorPos);
		}
	  }
  
	  return this.finishNode(node, "ImportExpression")
	};
  
	pp$5.parseImportMeta = function(node) {
	  this.next(); // skip `.`
  
	  var containsEsc = this.containsEsc;
	  node.property = this.parseIdent(true);
  
	  if (node.property.name !== "meta")
		{ this.raiseRecoverable(node.property.start, "The only valid meta property for import is 'import.meta'"); }
	  if (containsEsc)
		{ this.raiseRecoverable(node.start, "'import.meta' must not contain escaped characters"); }
	  if (this.options.sourceType !== "module" && !this.options.allowImportExportEverywhere)
		{ this.raiseRecoverable(node.start, "Cannot use 'import.meta' outside a module"); }
  
	  return this.finishNode(node, "MetaProperty")
	};
  
	pp$5.parseLiteral = function(value) {
	  var node = this.startNode();
	  node.value = value;
	  node.raw = this.input.slice(this.start, this.end);
	  if (node.raw.charCodeAt(node.raw.length - 1) === 110) { node.bigint = node.raw.slice(0, -1).replace(/_/g, ""); }
	  this.next();
	  return this.finishNode(node, "Literal")
	};
  
	pp$5.parseParenExpression = function() {
	  this.expect(types$1.parenL);
	  var val = this.parseExpression();
	  this.expect(types$1.parenR);
	  return val
	};
  
	pp$5.parseParenAndDistinguishExpression = function(canBeArrow, forInit) {
	  var startPos = this.start, startLoc = this.startLoc, val, allowTrailingComma = this.options.ecmaVersion >= 8;
	  if (this.options.ecmaVersion >= 6) {
		this.next();
  
		var innerStartPos = this.start, innerStartLoc = this.startLoc;
		var exprList = [], first = true, lastIsComma = false;
		var refDestructuringErrors = new DestructuringErrors, oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, spreadStart;
		this.yieldPos = 0;
		this.awaitPos = 0;
		// Do not save awaitIdentPos to allow checking awaits nested in parameters
		while (this.type !== types$1.parenR) {
		  first ? first = false : this.expect(types$1.comma);
		  if (allowTrailingComma && this.afterTrailingComma(types$1.parenR, true)) {
			lastIsComma = true;
			break
		  } else if (this.type === types$1.ellipsis) {
			spreadStart = this.start;
			exprList.push(this.parseParenItem(this.parseRestBinding()));
			if (this.type === types$1.comma) { this.raise(this.start, "Comma is not permitted after the rest element"); }
			break
		  } else {
			exprList.push(this.parseMaybeAssign(false, refDestructuringErrors, this.parseParenItem));
		  }
		}
		var innerEndPos = this.lastTokEnd, innerEndLoc = this.lastTokEndLoc;
		this.expect(types$1.parenR);
  
		if (canBeArrow && !this.canInsertSemicolon() && this.eat(types$1.arrow)) {
		  this.checkPatternErrors(refDestructuringErrors, false);
		  this.checkYieldAwaitInDefaultParams();
		  this.yieldPos = oldYieldPos;
		  this.awaitPos = oldAwaitPos;
		  return this.parseParenArrowList(startPos, startLoc, exprList, forInit)
		}
  
		if (!exprList.length || lastIsComma) { this.unexpected(this.lastTokStart); }
		if (spreadStart) { this.unexpected(spreadStart); }
		this.checkExpressionErrors(refDestructuringErrors, true);
		this.yieldPos = oldYieldPos || this.yieldPos;
		this.awaitPos = oldAwaitPos || this.awaitPos;
  
		if (exprList.length > 1) {
		  val = this.startNodeAt(innerStartPos, innerStartLoc);
		  val.expressions = exprList;
		  this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc);
		} else {
		  val = exprList[0];
		}
	  } else {
		val = this.parseParenExpression();
	  }
  
	  if (this.options.preserveParens) {
		var par = this.startNodeAt(startPos, startLoc);
		par.expression = val;
		return this.finishNode(par, "ParenthesizedExpression")
	  } else {
		return val
	  }
	};
  
	pp$5.parseParenItem = function(item) {
	  return item
	};
  
	pp$5.parseParenArrowList = function(startPos, startLoc, exprList, forInit) {
	  return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, false, forInit)
	};
  
	// New's precedence is slightly tricky. It must allow its argument to
	// be a `[]` or dot subscript expression, but not a call — at least,
	// not without wrapping it in parentheses. Thus, it uses the noCalls
	// argument to parseSubscripts to prevent it from consuming the
	// argument list.
  
	var empty = [];
  
	pp$5.parseNew = function() {
	  if (this.containsEsc) { this.raiseRecoverable(this.start, "Escape sequence in keyword new"); }
	  var node = this.startNode();
	  var meta = this.parseIdent(true);
	  if (this.options.ecmaVersion >= 6 && this.eat(types$1.dot)) {
		node.meta = meta;
		var containsEsc = this.containsEsc;
		node.property = this.parseIdent(true);
		if (node.property.name !== "target")
		  { this.raiseRecoverable(node.property.start, "The only valid meta property for new is 'new.target'"); }
		if (containsEsc)
		  { this.raiseRecoverable(node.start, "'new.target' must not contain escaped characters"); }
		if (!this.allowNewDotTarget)
		  { this.raiseRecoverable(node.start, "'new.target' can only be used in functions and class static block"); }
		return this.finishNode(node, "MetaProperty")
	  }
	  var startPos = this.start, startLoc = this.startLoc, isImport = this.type === types$1._import;
	  node.callee = this.parseSubscripts(this.parseExprAtom(), startPos, startLoc, true, false);
	  if (isImport && node.callee.type === "ImportExpression") {
		this.raise(startPos, "Cannot use new with import()");
	  }
	  if (this.eat(types$1.parenL)) { node.arguments = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, false); }
	  else { node.arguments = empty; }
	  return this.finishNode(node, "NewExpression")
	};
  
	// Parse template expression.
  
	pp$5.parseTemplateElement = function(ref) {
	  var isTagged = ref.isTagged;
  
	  var elem = this.startNode();
	  if (this.type === types$1.invalidTemplate) {
		if (!isTagged) {
		  this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal");
		}
		elem.value = {
		  raw: this.value,
		  cooked: null
		};
	  } else {
		elem.value = {
		  raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, "\n"),
		  cooked: this.value
		};
	  }
	  this.next();
	  elem.tail = this.type === types$1.backQuote;
	  return this.finishNode(elem, "TemplateElement")
	};
  
	pp$5.parseTemplate = function(ref) {
	  if ( ref === void 0 ) ref = {};
	  var isTagged = ref.isTagged; if ( isTagged === void 0 ) isTagged = false;
  
	  var node = this.startNode();
	  this.next();
	  node.expressions = [];
	  var curElt = this.parseTemplateElement({isTagged: isTagged});
	  node.quasis = [curElt];
	  while (!curElt.tail) {
		if (this.type === types$1.eof) { this.raise(this.pos, "Unterminated template literal"); }
		this.expect(types$1.dollarBraceL);
		node.expressions.push(this.parseExpression());
		this.expect(types$1.braceR);
		node.quasis.push(curElt = this.parseTemplateElement({isTagged: isTagged}));
	  }
	  this.next();
	  return this.finishNode(node, "TemplateLiteral")
	};
  
	pp$5.isAsyncProp = function(prop) {
	  return !prop.computed && prop.key.type === "Identifier" && prop.key.name === "async" &&
		(this.type === types$1.name || this.type === types$1.num || this.type === types$1.string || this.type === types$1.bracketL || this.type.keyword || (this.options.ecmaVersion >= 9 && this.type === types$1.star)) &&
		!lineBreak.test(this.input.slice(this.lastTokEnd, this.start))
	};
  
	// Parse an object literal or binding pattern.
  
	pp$5.parseObj = function(isPattern, refDestructuringErrors) {
	  var node = this.startNode(), first = true, propHash = {};
	  node.properties = [];
	  this.next();
	  while (!this.eat(types$1.braceR)) {
		if (!first) {
		  this.expect(types$1.comma);
		  if (this.options.ecmaVersion >= 5 && this.afterTrailingComma(types$1.braceR)) { break }
		} else { first = false; }
  
		var prop = this.parseProperty(isPattern, refDestructuringErrors);
		if (!isPattern) { this.checkPropClash(prop, propHash, refDestructuringErrors); }
		node.properties.push(prop);
	  }
	  return this.finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression")
	};
  
	pp$5.parseProperty = function(isPattern, refDestructuringErrors) {
	  var prop = this.startNode(), isGenerator, isAsync, startPos, startLoc;
	  if (this.options.ecmaVersion >= 9 && this.eat(types$1.ellipsis)) {
		if (isPattern) {
		  prop.argument = this.parseIdent(false);
		  if (this.type === types$1.comma) {
			this.raise(this.start, "Comma is not permitted after the rest element");
		  }
		  return this.finishNode(prop, "RestElement")
		}
		// To disallow parenthesized identifier via `this.toAssignable()`.
		if (this.type === types$1.parenL && refDestructuringErrors) {
		  if (refDestructuringErrors.parenthesizedAssign < 0) {
			refDestructuringErrors.parenthesizedAssign = this.start;
		  }
		  if (refDestructuringErrors.parenthesizedBind < 0) {
			refDestructuringErrors.parenthesizedBind = this.start;
		  }
		}
		// Parse argument.
		prop.argument = this.parseMaybeAssign(false, refDestructuringErrors);
		// To disallow trailing comma via `this.toAssignable()`.
		if (this.type === types$1.comma && refDestructuringErrors && refDestructuringErrors.trailingComma < 0) {
		  refDestructuringErrors.trailingComma = this.start;
		}
		// Finish
		return this.finishNode(prop, "SpreadElement")
	  }
	  if (this.options.ecmaVersion >= 6) {
		prop.method = false;
		prop.shorthand = false;
		if (isPattern || refDestructuringErrors) {
		  startPos = this.start;
		  startLoc = this.startLoc;
		}
		if (!isPattern)
		  { isGenerator = this.eat(types$1.star); }
	  }
	  var containsEsc = this.containsEsc;
	  this.parsePropertyName(prop);
	  if (!isPattern && !containsEsc && this.options.ecmaVersion >= 8 && !isGenerator && this.isAsyncProp(prop)) {
		isAsync = true;
		isGenerator = this.options.ecmaVersion >= 9 && this.eat(types$1.star);
		this.parsePropertyName(prop, refDestructuringErrors);
	  } else {
		isAsync = false;
	  }
	  this.parsePropertyValue(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc);
	  return this.finishNode(prop, "Property")
	};
  
	pp$5.parsePropertyValue = function(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc) {
	  if ((isGenerator || isAsync) && this.type === types$1.colon)
		{ this.unexpected(); }
  
	  if (this.eat(types$1.colon)) {
		prop.value = isPattern ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, refDestructuringErrors);
		prop.kind = "init";
	  } else if (this.options.ecmaVersion >= 6 && this.type === types$1.parenL) {
		if (isPattern) { this.unexpected(); }
		prop.kind = "init";
		prop.method = true;
		prop.value = this.parseMethod(isGenerator, isAsync);
	  } else if (!isPattern && !containsEsc &&
				 this.options.ecmaVersion >= 5 && !prop.computed && prop.key.type === "Identifier" &&
				 (prop.key.name === "get" || prop.key.name === "set") &&
				 (this.type !== types$1.comma && this.type !== types$1.braceR && this.type !== types$1.eq)) {
		if (isGenerator || isAsync) { this.unexpected(); }
		prop.kind = prop.key.name;
		this.parsePropertyName(prop);
		prop.value = this.parseMethod(false);
		var paramCount = prop.kind === "get" ? 0 : 1;
		if (prop.value.params.length !== paramCount) {
		  var start = prop.value.start;
		  if (prop.kind === "get")
			{ this.raiseRecoverable(start, "getter should have no params"); }
		  else
			{ this.raiseRecoverable(start, "setter should have exactly one param"); }
		} else {
		  if (prop.kind === "set" && prop.value.params[0].type === "RestElement")
			{ this.raiseRecoverable(prop.value.params[0].start, "Setter cannot use rest params"); }
		}
	  } else if (this.options.ecmaVersion >= 6 && !prop.computed && prop.key.type === "Identifier") {
		if (isGenerator || isAsync) { this.unexpected(); }
		this.checkUnreserved(prop.key);
		if (prop.key.name === "await" && !this.awaitIdentPos)
		  { this.awaitIdentPos = startPos; }
		prop.kind = "init";
		if (isPattern) {
		  prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
		} else if (this.type === types$1.eq && refDestructuringErrors) {
		  if (refDestructuringErrors.shorthandAssign < 0)
			{ refDestructuringErrors.shorthandAssign = this.start; }
		  prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
		} else {
		  prop.value = this.copyNode(prop.key);
		}
		prop.shorthand = true;
	  } else { this.unexpected(); }
	};
  
	pp$5.parsePropertyName = function(prop) {
	  if (this.options.ecmaVersion >= 6) {
		if (this.eat(types$1.bracketL)) {
		  prop.computed = true;
		  prop.key = this.parseMaybeAssign();
		  this.expect(types$1.bracketR);
		  return prop.key
		} else {
		  prop.computed = false;
		}
	  }
	  return prop.key = this.type === types$1.num || this.type === types$1.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never")
	};
  
	// Initialize empty function node.
  
	pp$5.initFunction = function(node) {
	  node.id = null;
	  if (this.options.ecmaVersion >= 6) { node.generator = node.expression = false; }
	  if (this.options.ecmaVersion >= 8) { node.async = false; }
	};
  
	// Parse object or class method.
  
	pp$5.parseMethod = function(isGenerator, isAsync, allowDirectSuper) {
	  var node = this.startNode(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
  
	  this.initFunction(node);
	  if (this.options.ecmaVersion >= 6)
		{ node.generator = isGenerator; }
	  if (this.options.ecmaVersion >= 8)
		{ node.async = !!isAsync; }
  
	  this.yieldPos = 0;
	  this.awaitPos = 0;
	  this.awaitIdentPos = 0;
	  this.enterScope(functionFlags(isAsync, node.generator) | SCOPE_SUPER | (allowDirectSuper ? SCOPE_DIRECT_SUPER : 0));
  
	  this.expect(types$1.parenL);
	  node.params = this.parseBindingList(types$1.parenR, false, this.options.ecmaVersion >= 8);
	  this.checkYieldAwaitInDefaultParams();
	  this.parseFunctionBody(node, false, true, false);
  
	  this.yieldPos = oldYieldPos;
	  this.awaitPos = oldAwaitPos;
	  this.awaitIdentPos = oldAwaitIdentPos;
	  return this.finishNode(node, "FunctionExpression")
	};
  
	// Parse arrow function expression with given parameters.
  
	pp$5.parseArrowExpression = function(node, params, isAsync, forInit) {
	  var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
  
	  this.enterScope(functionFlags(isAsync, false) | SCOPE_ARROW);
	  this.initFunction(node);
	  if (this.options.ecmaVersion >= 8) { node.async = !!isAsync; }
  
	  this.yieldPos = 0;
	  this.awaitPos = 0;
	  this.awaitIdentPos = 0;
  
	  node.params = this.toAssignableList(params, true);
	  this.parseFunctionBody(node, true, false, forInit);
  
	  this.yieldPos = oldYieldPos;
	  this.awaitPos = oldAwaitPos;
	  this.awaitIdentPos = oldAwaitIdentPos;
	  return this.finishNode(node, "ArrowFunctionExpression")
	};
  
	// Parse function body and check parameters.
  
	pp$5.parseFunctionBody = function(node, isArrowFunction, isMethod, forInit) {
	  var isExpression = isArrowFunction && this.type !== types$1.braceL;
	  var oldStrict = this.strict, useStrict = false;
  
	  if (isExpression) {
		node.body = this.parseMaybeAssign(forInit);
		node.expression = true;
		this.checkParams(node, false);
	  } else {
		var nonSimple = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(node.params);
		if (!oldStrict || nonSimple) {
		  useStrict = this.strictDirective(this.end);
		  // If this is a strict mode function, verify that argument names
		  // are not repeated, and it does not try to bind the words `eval`
		  // or `arguments`.
		  if (useStrict && nonSimple)
			{ this.raiseRecoverable(node.start, "Illegal 'use strict' directive in function with non-simple parameter list"); }
		}
		// Start a new scope with regard to labels and the `inFunction`
		// flag (restore them to their old value afterwards).
		var oldLabels = this.labels;
		this.labels = [];
		if (useStrict) { this.strict = true; }
  
		// Add the params to varDeclaredNames to ensure that an error is thrown
		// if a let/const declaration in the function clashes with one of the params.
		this.checkParams(node, !oldStrict && !useStrict && !isArrowFunction && !isMethod && this.isSimpleParamList(node.params));
		// Ensure the function name isn't a forbidden identifier in strict mode, e.g. 'eval'
		if (this.strict && node.id) { this.checkLValSimple(node.id, BIND_OUTSIDE); }
		node.body = this.parseBlock(false, undefined, useStrict && !oldStrict);
		node.expression = false;
		this.adaptDirectivePrologue(node.body.body);
		this.labels = oldLabels;
	  }
	  this.exitScope();
	};
  
	pp$5.isSimpleParamList = function(params) {
	  for (var i = 0, list = params; i < list.length; i += 1)
		{
		var param = list[i];
  
		if (param.type !== "Identifier") { return false
	  } }
	  return true
	};
  
	// Checks function params for various disallowed patterns such as using "eval"
	// or "arguments" and duplicate parameters.
  
	pp$5.checkParams = function(node, allowDuplicates) {
	  var nameHash = Object.create(null);
	  for (var i = 0, list = node.params; i < list.length; i += 1)
		{
		var param = list[i];
  
		this.checkLValInnerPattern(param, BIND_VAR, allowDuplicates ? null : nameHash);
	  }
	};
  
	// Parses a comma-separated list of expressions, and returns them as
	// an array. `close` is the token type that ends the list, and
	// `allowEmpty` can be turned on to allow subsequent commas with
	// nothing in between them to be parsed as `null` (which is needed
	// for array literals).
  
	pp$5.parseExprList = function(close, allowTrailingComma, allowEmpty, refDestructuringErrors) {
	  var elts = [], first = true;
	  while (!this.eat(close)) {
		if (!first) {
		  this.expect(types$1.comma);
		  if (allowTrailingComma && this.afterTrailingComma(close)) { break }
		} else { first = false; }
  
		var elt = (void 0);
		if (allowEmpty && this.type === types$1.comma)
		  { elt = null; }
		else if (this.type === types$1.ellipsis) {
		  elt = this.parseSpread(refDestructuringErrors);
		  if (refDestructuringErrors && this.type === types$1.comma && refDestructuringErrors.trailingComma < 0)
			{ refDestructuringErrors.trailingComma = this.start; }
		} else {
		  elt = this.parseMaybeAssign(false, refDestructuringErrors);
		}
		elts.push(elt);
	  }
	  return elts
	};
  
	pp$5.checkUnreserved = function(ref) {
	  var start = ref.start;
	  var end = ref.end;
	  var name = ref.name;
  
	  if (this.inGenerator && name === "yield")
		{ this.raiseRecoverable(start, "Cannot use 'yield' as identifier inside a generator"); }
	  if (this.inAsync && name === "await")
		{ this.raiseRecoverable(start, "Cannot use 'await' as identifier inside an async function"); }
	  if (this.currentThisScope().inClassFieldInit && name === "arguments")
		{ this.raiseRecoverable(start, "Cannot use 'arguments' in class field initializer"); }
	  if (this.inClassStaticBlock && (name === "arguments" || name === "await"))
		{ this.raise(start, ("Cannot use " + name + " in class static initialization block")); }
	  if (this.keywords.test(name))
		{ this.raise(start, ("Unexpected keyword '" + name + "'")); }
	  if (this.options.ecmaVersion < 6 &&
		this.input.slice(start, end).indexOf("\\") !== -1) { return }
	  var re = this.strict ? this.reservedWordsStrict : this.reservedWords;
	  if (re.test(name)) {
		if (!this.inAsync && name === "await")
		  { this.raiseRecoverable(start, "Cannot use keyword 'await' outside an async function"); }
		this.raiseRecoverable(start, ("The keyword '" + name + "' is reserved"));
	  }
	};
  
	// Parse the next token as an identifier. If `liberal` is true (used
	// when parsing properties), it will also convert keywords into
	// identifiers.
  
	pp$5.parseIdent = function(liberal, isBinding) {
	  var node = this.startNode();
	  if (this.type === types$1.name) {
		node.name = this.value;
	  } else if (this.type.keyword) {
		node.name = this.type.keyword;
  
		// To fix https://github.com/acornjs/acorn/issues/575
		// `class` and `function` keywords push new context into this.context.
		// But there is no chance to pop the context if the keyword is consumed as an identifier such as a property name.
		// If the previous token is a dot, this does not apply because the context-managing code already ignored the keyword
		if ((node.name === "class" || node.name === "function") &&
			(this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46)) {
		  this.context.pop();
		}
	  } else {
		this.unexpected();
	  }
	  this.next(!!liberal);
	  this.finishNode(node, "Identifier");
	  if (!liberal) {
		this.checkUnreserved(node);
		if (node.name === "await" && !this.awaitIdentPos)
		  { this.awaitIdentPos = node.start; }
	  }
	  return node
	};
  
	pp$5.parsePrivateIdent = function() {
	  var node = this.startNode();
	  if (this.type === types$1.privateId) {
		node.name = this.value;
	  } else {
		this.unexpected();
	  }
	  this.next();
	  this.finishNode(node, "PrivateIdentifier");
  
	  // For validating existence
	  if (this.privateNameStack.length === 0) {
		this.raise(node.start, ("Private field '#" + (node.name) + "' must be declared in an enclosing class"));
	  } else {
		this.privateNameStack[this.privateNameStack.length - 1].used.push(node);
	  }
  
	  return node
	};
  
	// Parses yield expression inside generator.
  
	pp$5.parseYield = function(forInit) {
	  if (!this.yieldPos) { this.yieldPos = this.start; }
  
	  var node = this.startNode();
	  this.next();
	  if (this.type === types$1.semi || this.canInsertSemicolon() || (this.type !== types$1.star && !this.type.startsExpr)) {
		node.delegate = false;
		node.argument = null;
	  } else {
		node.delegate = this.eat(types$1.star);
		node.argument = this.parseMaybeAssign(forInit);
	  }
	  return this.finishNode(node, "YieldExpression")
	};
  
	pp$5.parseAwait = function(forInit) {
	  if (!this.awaitPos) { this.awaitPos = this.start; }
  
	  var node = this.startNode();
	  this.next();
	  node.argument = this.parseMaybeUnary(null, true, false, forInit);
	  return this.finishNode(node, "AwaitExpression")
	};
  
	var pp$4 = Parser.prototype;
  
	// This function is used to raise exceptions on parse errors. It
	// takes an offset integer (into the current `input`) to indicate
	// the location of the error, attaches the position to the end
	// of the error message, and then raises a `SyntaxError` with that
	// message.
  
	pp$4.raise = function(pos, message) {
	  var loc = getLineInfo(this.input, pos);
	  message += " (" + loc.line + ":" + loc.column + ")";
	  var err = new SyntaxError(message);
	  err.pos = pos; err.loc = loc; err.raisedAt = this.pos;
	  throw err
	};
  
	pp$4.raiseRecoverable = pp$4.raise;
  
	pp$4.curPosition = function() {
	  if (this.options.locations) {
		return new Position(this.curLine, this.pos - this.lineStart)
	  }
	};
  
	var pp$3 = Parser.prototype;
  
	var Scope = function Scope(flags) {
	  this.flags = flags;
	  // A list of var-declared names in the current lexical scope
	  this.var = [];
	  // A list of lexically-declared names in the current lexical scope
	  this.lexical = [];
	  // A list of lexically-declared FunctionDeclaration names in the current lexical scope
	  this.functions = [];
	  // A switch to disallow the identifier reference 'arguments'
	  this.inClassFieldInit = false;
	};
  
	// The functions in this module keep track of declared variables in the current scope in order to detect duplicate variable names.
  
	pp$3.enterScope = function(flags) {
	  this.scopeStack.push(new Scope(flags));
	};
  
	pp$3.exitScope = function() {
	  this.scopeStack.pop();
	};
  
	// The spec says:
	// > At the top level of a function, or script, function declarations are
	// > treated like var declarations rather than like lexical declarations.
	pp$3.treatFunctionsAsVarInScope = function(scope) {
	  return (scope.flags & SCOPE_FUNCTION) || !this.inModule && (scope.flags & SCOPE_TOP)
	};
  
	pp$3.declareName = function(name, bindingType, pos) {
	  var redeclared = false;
	  if (bindingType === BIND_LEXICAL) {
		var scope = this.currentScope();
		redeclared = scope.lexical.indexOf(name) > -1 || scope.functions.indexOf(name) > -1 || scope.var.indexOf(name) > -1;
		scope.lexical.push(name);
		if (this.inModule && (scope.flags & SCOPE_TOP))
		  { delete this.undefinedExports[name]; }
	  } else if (bindingType === BIND_SIMPLE_CATCH) {
		var scope$1 = this.currentScope();
		scope$1.lexical.push(name);
	  } else if (bindingType === BIND_FUNCTION) {
		var scope$2 = this.currentScope();
		if (this.treatFunctionsAsVar)
		  { redeclared = scope$2.lexical.indexOf(name) > -1; }
		else
		  { redeclared = scope$2.lexical.indexOf(name) > -1 || scope$2.var.indexOf(name) > -1; }
		scope$2.functions.push(name);
	  } else {
		for (var i = this.scopeStack.length - 1; i >= 0; --i) {
		  var scope$3 = this.scopeStack[i];
		  if (scope$3.lexical.indexOf(name) > -1 && !((scope$3.flags & SCOPE_SIMPLE_CATCH) && scope$3.lexical[0] === name) ||
			  !this.treatFunctionsAsVarInScope(scope$3) && scope$3.functions.indexOf(name) > -1) {
			redeclared = true;
			break
		  }
		  scope$3.var.push(name);
		  if (this.inModule && (scope$3.flags & SCOPE_TOP))
			{ delete this.undefinedExports[name]; }
		  if (scope$3.flags & SCOPE_VAR) { break }
		}
	  }
	  if (redeclared) { this.raiseRecoverable(pos, ("Identifier '" + name + "' has already been declared")); }
	};
  
	pp$3.checkLocalExport = function(id) {
	  // scope.functions must be empty as Module code is always strict.
	  if (this.scopeStack[0].lexical.indexOf(id.name) === -1 &&
		  this.scopeStack[0].var.indexOf(id.name) === -1) {
		this.undefinedExports[id.name] = id;
	  }
	};
  
	pp$3.currentScope = function() {
	  return this.scopeStack[this.scopeStack.length - 1]
	};
  
	pp$3.currentVarScope = function() {
	  for (var i = this.scopeStack.length - 1;; i--) {
		var scope = this.scopeStack[i];
		if (scope.flags & SCOPE_VAR) { return scope }
	  }
	};
  
	// Could be useful for `this`, `new.target`, `super()`, `super.property`, and `super[property]`.
	pp$3.currentThisScope = function() {
	  for (var i = this.scopeStack.length - 1;; i--) {
		var scope = this.scopeStack[i];
		if (scope.flags & SCOPE_VAR && !(scope.flags & SCOPE_ARROW)) { return scope }
	  }
	};
  
	var Node = function Node(parser, pos, loc) {
	  this.type = "";
	  this.start = pos;
	  this.end = 0;
	  if (parser.options.locations)
		{ this.loc = new SourceLocation(parser, loc); }
	  if (parser.options.directSourceFile)
		{ this.sourceFile = parser.options.directSourceFile; }
	  if (parser.options.ranges)
		{ this.range = [pos, 0]; }
	};
  
	// Start an AST node, attaching a start offset.
  
	var pp$2 = Parser.prototype;
  
	pp$2.startNode = function() {
	  return new Node(this, this.start, this.startLoc)
	};
  
	pp$2.startNodeAt = function(pos, loc) {
	  return new Node(this, pos, loc)
	};
  
	// Finish an AST node, adding `type` and `end` properties.
  
	function finishNodeAt(node, type, pos, loc) {
	  node.type = type;
	  node.end = pos;
	  if (this.options.locations)
		{ node.loc.end = loc; }
	  if (this.options.ranges)
		{ node.range[1] = pos; }
	  return node
	}
  
	pp$2.finishNode = function(node, type) {
	  return finishNodeAt.call(this, node, type, this.lastTokEnd, this.lastTokEndLoc)
	};
  
	// Finish node at given position
  
	pp$2.finishNodeAt = function(node, type, pos, loc) {
	  return finishNodeAt.call(this, node, type, pos, loc)
	};
  
	pp$2.copyNode = function(node) {
	  var newNode = new Node(this, node.start, this.startLoc);
	  for (var prop in node) { newNode[prop] = node[prop]; }
	  return newNode
	};
  
	// This file contains Unicode properties extracted from the ECMAScript
	// specification. The lists are extracted like so:
	// $$('#table-binary-unicode-properties > figure > table > tbody > tr > td:nth-child(1) code').map(el => el.innerText)
  
	// #table-binary-unicode-properties
	var ecma9BinaryProperties = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS";
	var ecma10BinaryProperties = ecma9BinaryProperties + " Extended_Pictographic";
	var ecma11BinaryProperties = ecma10BinaryProperties;
	var ecma12BinaryProperties = ecma11BinaryProperties + " EBase EComp EMod EPres ExtPict";
	var ecma13BinaryProperties = ecma12BinaryProperties;
	var unicodeBinaryProperties = {
	  9: ecma9BinaryProperties,
	  10: ecma10BinaryProperties,
	  11: ecma11BinaryProperties,
	  12: ecma12BinaryProperties,
	  13: ecma13BinaryProperties
	};
  
	// #table-unicode-general-category-values
	var unicodeGeneralCategoryValues = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu";
  
	// #table-unicode-script-values
	var ecma9ScriptValues = "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb";
	var ecma10ScriptValues = ecma9ScriptValues + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd";
	var ecma11ScriptValues = ecma10ScriptValues + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho";
	var ecma12ScriptValues = ecma11ScriptValues + " Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi";
	var ecma13ScriptValues = ecma12ScriptValues + " Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith";
	var unicodeScriptValues = {
	  9: ecma9ScriptValues,
	  10: ecma10ScriptValues,
	  11: ecma11ScriptValues,
	  12: ecma12ScriptValues,
	  13: ecma13ScriptValues
	};
  
	var data = {};
	function buildUnicodeData(ecmaVersion) {
	  var d = data[ecmaVersion] = {
		binary: wordsRegexp(unicodeBinaryProperties[ecmaVersion] + " " + unicodeGeneralCategoryValues),
		nonBinary: {
		  General_Category: wordsRegexp(unicodeGeneralCategoryValues),
		  Script: wordsRegexp(unicodeScriptValues[ecmaVersion])
		}
	  };
	  d.nonBinary.Script_Extensions = d.nonBinary.Script;
  
	  d.nonBinary.gc = d.nonBinary.General_Category;
	  d.nonBinary.sc = d.nonBinary.Script;
	  d.nonBinary.scx = d.nonBinary.Script_Extensions;
	}
  
	for (var i = 0, list = [9, 10, 11, 12, 13]; i < list.length; i += 1) {
	  var ecmaVersion = list[i];
  
	  buildUnicodeData(ecmaVersion);
	}
  
	var pp$1 = Parser.prototype;
  
	var RegExpValidationState = function RegExpValidationState(parser) {
	  this.parser = parser;
	  this.validFlags = "gim" + (parser.options.ecmaVersion >= 6 ? "uy" : "") + (parser.options.ecmaVersion >= 9 ? "s" : "") + (parser.options.ecmaVersion >= 13 ? "d" : "");
	  this.unicodeProperties = data[parser.options.ecmaVersion >= 13 ? 13 : parser.options.ecmaVersion];
	  this.source = "";
	  this.flags = "";
	  this.start = 0;
	  this.switchU = false;
	  this.switchN = false;
	  this.pos = 0;
	  this.lastIntValue = 0;
	  this.lastStringValue = "";
	  this.lastAssertionIsQuantifiable = false;
	  this.numCapturingParens = 0;
	  this.maxBackReference = 0;
	  this.groupNames = [];
	  this.backReferenceNames = [];
	};
  
	RegExpValidationState.prototype.reset = function reset (start, pattern, flags) {
	  var unicode = flags.indexOf("u") !== -1;
	  this.start = start | 0;
	  this.source = pattern + "";
	  this.flags = flags;
	  this.switchU = unicode && this.parser.options.ecmaVersion >= 6;
	  this.switchN = unicode && this.parser.options.ecmaVersion >= 9;
	};
  
	RegExpValidationState.prototype.raise = function raise (message) {
	  this.parser.raiseRecoverable(this.start, ("Invalid regular expression: /" + (this.source) + "/: " + message));
	};
  
	// If u flag is given, this returns the code point at the index (it combines a surrogate pair).
	// Otherwise, this returns the code unit of the index (can be a part of a surrogate pair).
	RegExpValidationState.prototype.at = function at (i, forceU) {
		if ( forceU === void 0 ) forceU = false;
  
	  var s = this.source;
	  var l = s.length;
	  if (i >= l) {
		return -1
	  }
	  var c = s.charCodeAt(i);
	  if (!(forceU || this.switchU) || c <= 0xD7FF || c >= 0xE000 || i + 1 >= l) {
		return c
	  }
	  var next = s.charCodeAt(i + 1);
	  return next >= 0xDC00 && next <= 0xDFFF ? (c << 10) + next - 0x35FDC00 : c
	};
  
	RegExpValidationState.prototype.nextIndex = function nextIndex (i, forceU) {
		if ( forceU === void 0 ) forceU = false;
  
	  var s = this.source;
	  var l = s.length;
	  if (i >= l) {
		return l
	  }
	  var c = s.charCodeAt(i), next;
	  if (!(forceU || this.switchU) || c <= 0xD7FF || c >= 0xE000 || i + 1 >= l ||
		  (next = s.charCodeAt(i + 1)) < 0xDC00 || next > 0xDFFF) {
		return i + 1
	  }
	  return i + 2
	};
  
	RegExpValidationState.prototype.current = function current (forceU) {
		if ( forceU === void 0 ) forceU = false;
  
	  return this.at(this.pos, forceU)
	};
  
	RegExpValidationState.prototype.lookahead = function lookahead (forceU) {
		if ( forceU === void 0 ) forceU = false;
  
	  return this.at(this.nextIndex(this.pos, forceU), forceU)
	};
  
	RegExpValidationState.prototype.advance = function advance (forceU) {
		if ( forceU === void 0 ) forceU = false;
  
	  this.pos = this.nextIndex(this.pos, forceU);
	};
  
	RegExpValidationState.prototype.eat = function eat (ch, forceU) {
		if ( forceU === void 0 ) forceU = false;
  
	  if (this.current(forceU) === ch) {
		this.advance(forceU);
		return true
	  }
	  return false
	};
  
	function codePointToString$1(ch) {
	  if (ch <= 0xFFFF) { return String.fromCharCode(ch) }
	  ch -= 0x10000;
	  return String.fromCharCode((ch >> 10) + 0xD800, (ch & 0x03FF) + 0xDC00)
	}
  
	/**
	 * Validate the flags part of a given RegExpLiteral.
	 *
	 * @param {RegExpValidationState} state The state to validate RegExp.
	 * @returns {void}
	 */
	pp$1.validateRegExpFlags = function(state) {
	  var validFlags = state.validFlags;
	  var flags = state.flags;
  
	  for (var i = 0; i < flags.length; i++) {
		var flag = flags.charAt(i);
		if (validFlags.indexOf(flag) === -1) {
		  this.raise(state.start, "Invalid regular expression flag");
		}
		if (flags.indexOf(flag, i + 1) > -1) {
		  this.raise(state.start, "Duplicate regular expression flag");
		}
	  }
	};
  
	/**
	 * Validate the pattern part of a given RegExpLiteral.
	 *
	 * @param {RegExpValidationState} state The state to validate RegExp.
	 * @returns {void}
	 */
	pp$1.validateRegExpPattern = function(state) {
	  this.regexp_pattern(state);
  
	  // The goal symbol for the parse is |Pattern[~U, ~N]|. If the result of
	  // parsing contains a |GroupName|, reparse with the goal symbol
	  // |Pattern[~U, +N]| and use this result instead. Throw a *SyntaxError*
	  // exception if _P_ did not conform to the grammar, if any elements of _P_
	  // were not matched by the parse, or if any Early Error conditions exist.
	  if (!state.switchN && this.options.ecmaVersion >= 9 && state.groupNames.length > 0) {
		state.switchN = true;
		this.regexp_pattern(state);
	  }
	};
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-Pattern
	pp$1.regexp_pattern = function(state) {
	  state.pos = 0;
	  state.lastIntValue = 0;
	  state.lastStringValue = "";
	  state.lastAssertionIsQuantifiable = false;
	  state.numCapturingParens = 0;
	  state.maxBackReference = 0;
	  state.groupNames.length = 0;
	  state.backReferenceNames.length = 0;
  
	  this.regexp_disjunction(state);
  
	  if (state.pos !== state.source.length) {
		// Make the same messages as V8.
		if (state.eat(0x29 /* ) */)) {
		  state.raise("Unmatched ')'");
		}
		if (state.eat(0x5D /* ] */) || state.eat(0x7D /* } */)) {
		  state.raise("Lone quantifier brackets");
		}
	  }
	  if (state.maxBackReference > state.numCapturingParens) {
		state.raise("Invalid escape");
	  }
	  for (var i = 0, list = state.backReferenceNames; i < list.length; i += 1) {
		var name = list[i];
  
		if (state.groupNames.indexOf(name) === -1) {
		  state.raise("Invalid named capture referenced");
		}
	  }
	};
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-Disjunction
	pp$1.regexp_disjunction = function(state) {
	  this.regexp_alternative(state);
	  while (state.eat(0x7C /* | */)) {
		this.regexp_alternative(state);
	  }
  
	  // Make the same message as V8.
	  if (this.regexp_eatQuantifier(state, true)) {
		state.raise("Nothing to repeat");
	  }
	  if (state.eat(0x7B /* { */)) {
		state.raise("Lone quantifier brackets");
	  }
	};
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-Alternative
	pp$1.regexp_alternative = function(state) {
	  while (state.pos < state.source.length && this.regexp_eatTerm(state))
		{ }
	};
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-Term
	pp$1.regexp_eatTerm = function(state) {
	  if (this.regexp_eatAssertion(state)) {
		// Handle `QuantifiableAssertion Quantifier` alternative.
		// `state.lastAssertionIsQuantifiable` is true if the last eaten Assertion
		// is a QuantifiableAssertion.
		if (state.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(state)) {
		  // Make the same message as V8.
		  if (state.switchU) {
			state.raise("Invalid quantifier");
		  }
		}
		return true
	  }
  
	  if (state.switchU ? this.regexp_eatAtom(state) : this.regexp_eatExtendedAtom(state)) {
		this.regexp_eatQuantifier(state);
		return true
	  }
  
	  return false
	};
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-Assertion
	pp$1.regexp_eatAssertion = function(state) {
	  var start = state.pos;
	  state.lastAssertionIsQuantifiable = false;
  
	  // ^, $
	  if (state.eat(0x5E /* ^ */) || state.eat(0x24 /* $ */)) {
		return true
	  }
  
	  // \b \B
	  if (state.eat(0x5C /* \ */)) {
		if (state.eat(0x42 /* B */) || state.eat(0x62 /* b */)) {
		  return true
		}
		state.pos = start;
	  }
  
	  // Lookahead / Lookbehind
	  if (state.eat(0x28 /* ( */) && state.eat(0x3F /* ? */)) {
		var lookbehind = false;
		if (this.options.ecmaVersion >= 9) {
		  lookbehind = state.eat(0x3C /* < */);
		}
		if (state.eat(0x3D /* = */) || state.eat(0x21 /* ! */)) {
		  this.regexp_disjunction(state);
		  if (!state.eat(0x29 /* ) */)) {
			state.raise("Unterminated group");
		  }
		  state.lastAssertionIsQuantifiable = !lookbehind;
		  return true
		}
	  }
  
	  state.pos = start;
	  return false
	};
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-Quantifier
	pp$1.regexp_eatQuantifier = function(state, noError) {
	  if ( noError === void 0 ) noError = false;
  
	  if (this.regexp_eatQuantifierPrefix(state, noError)) {
		state.eat(0x3F /* ? */);
		return true
	  }
	  return false
	};
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-QuantifierPrefix
	pp$1.regexp_eatQuantifierPrefix = function(state, noError) {
	  return (
		state.eat(0x2A /* * */) ||
		state.eat(0x2B /* + */) ||
		state.eat(0x3F /* ? */) ||
		this.regexp_eatBracedQuantifier(state, noError)
	  )
	};
	pp$1.regexp_eatBracedQuantifier = function(state, noError) {
	  var start = state.pos;
	  if (state.eat(0x7B /* { */)) {
		var min = 0, max = -1;
		if (this.regexp_eatDecimalDigits(state)) {
		  min = state.lastIntValue;
		  if (state.eat(0x2C /* , */) && this.regexp_eatDecimalDigits(state)) {
			max = state.lastIntValue;
		  }
		  if (state.eat(0x7D /* } */)) {
			// SyntaxError in https://www.ecma-international.org/ecma-262/8.0/#sec-term
			if (max !== -1 && max < min && !noError) {
			  state.raise("numbers out of order in {} quantifier");
			}
			return true
		  }
		}
		if (state.switchU && !noError) {
		  state.raise("Incomplete quantifier");
		}
		state.pos = start;
	  }
	  return false
	};
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-Atom
	pp$1.regexp_eatAtom = function(state) {
	  return (
		this.regexp_eatPatternCharacters(state) ||
		state.eat(0x2E /* . */) ||
		this.regexp_eatReverseSolidusAtomEscape(state) ||
		this.regexp_eatCharacterClass(state) ||
		this.regexp_eatUncapturingGroup(state) ||
		this.regexp_eatCapturingGroup(state)
	  )
	};
	pp$1.regexp_eatReverseSolidusAtomEscape = function(state) {
	  var start = state.pos;
	  if (state.eat(0x5C /* \ */)) {
		if (this.regexp_eatAtomEscape(state)) {
		  return true
		}
		state.pos = start;
	  }
	  return false
	};
	pp$1.regexp_eatUncapturingGroup = function(state) {
	  var start = state.pos;
	  if (state.eat(0x28 /* ( */)) {
		if (state.eat(0x3F /* ? */) && state.eat(0x3A /* : */)) {
		  this.regexp_disjunction(state);
		  if (state.eat(0x29 /* ) */)) {
			return true
		  }
		  state.raise("Unterminated group");
		}
		state.pos = start;
	  }
	  return false
	};
	pp$1.regexp_eatCapturingGroup = function(state) {
	  if (state.eat(0x28 /* ( */)) {
		if (this.options.ecmaVersion >= 9) {
		  this.regexp_groupSpecifier(state);
		} else if (state.current() === 0x3F /* ? */) {
		  state.raise("Invalid group");
		}
		this.regexp_disjunction(state);
		if (state.eat(0x29 /* ) */)) {
		  state.numCapturingParens += 1;
		  return true
		}
		state.raise("Unterminated group");
	  }
	  return false
	};
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-ExtendedAtom
	pp$1.regexp_eatExtendedAtom = function(state) {
	  return (
		state.eat(0x2E /* . */) ||
		this.regexp_eatReverseSolidusAtomEscape(state) ||
		this.regexp_eatCharacterClass(state) ||
		this.regexp_eatUncapturingGroup(state) ||
		this.regexp_eatCapturingGroup(state) ||
		this.regexp_eatInvalidBracedQuantifier(state) ||
		this.regexp_eatExtendedPatternCharacter(state)
	  )
	};
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-InvalidBracedQuantifier
	pp$1.regexp_eatInvalidBracedQuantifier = function(state) {
	  if (this.regexp_eatBracedQuantifier(state, true)) {
		state.raise("Nothing to repeat");
	  }
	  return false
	};
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-SyntaxCharacter
	pp$1.regexp_eatSyntaxCharacter = function(state) {
	  var ch = state.current();
	  if (isSyntaxCharacter(ch)) {
		state.lastIntValue = ch;
		state.advance();
		return true
	  }
	  return false
	};
	function isSyntaxCharacter(ch) {
	  return (
		ch === 0x24 /* $ */ ||
		ch >= 0x28 /* ( */ && ch <= 0x2B /* + */ ||
		ch === 0x2E /* . */ ||
		ch === 0x3F /* ? */ ||
		ch >= 0x5B /* [ */ && ch <= 0x5E /* ^ */ ||
		ch >= 0x7B /* { */ && ch <= 0x7D /* } */
	  )
	}
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-PatternCharacter
	// But eat eager.
	pp$1.regexp_eatPatternCharacters = function(state) {
	  var start = state.pos;
	  var ch = 0;
	  while ((ch = state.current()) !== -1 && !isSyntaxCharacter(ch)) {
		state.advance();
	  }
	  return state.pos !== start
	};
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-ExtendedPatternCharacter
	pp$1.regexp_eatExtendedPatternCharacter = function(state) {
	  var ch = state.current();
	  if (
		ch !== -1 &&
		ch !== 0x24 /* $ */ &&
		!(ch >= 0x28 /* ( */ && ch <= 0x2B /* + */) &&
		ch !== 0x2E /* . */ &&
		ch !== 0x3F /* ? */ &&
		ch !== 0x5B /* [ */ &&
		ch !== 0x5E /* ^ */ &&
		ch !== 0x7C /* | */
	  ) {
		state.advance();
		return true
	  }
	  return false
	};
  
	// GroupSpecifier ::
	//   [empty]
	//   `?` GroupName
	pp$1.regexp_groupSpecifier = function(state) {
	  if (state.eat(0x3F /* ? */)) {
		if (this.regexp_eatGroupName(state)) {
		  if (state.groupNames.indexOf(state.lastStringValue) !== -1) {
			state.raise("Duplicate capture group name");
		  }
		  state.groupNames.push(state.lastStringValue);
		  return
		}
		state.raise("Invalid group");
	  }
	};
  
	// GroupName ::
	//   `<` RegExpIdentifierName `>`
	// Note: this updates `state.lastStringValue` property with the eaten name.
	pp$1.regexp_eatGroupName = function(state) {
	  state.lastStringValue = "";
	  if (state.eat(0x3C /* < */)) {
		if (this.regexp_eatRegExpIdentifierName(state) && state.eat(0x3E /* > */)) {
		  return true
		}
		state.raise("Invalid capture group name");
	  }
	  return false
	};
  
	// RegExpIdentifierName ::
	//   RegExpIdentifierStart
	//   RegExpIdentifierName RegExpIdentifierPart
	// Note: this updates `state.lastStringValue` property with the eaten name.
	pp$1.regexp_eatRegExpIdentifierName = function(state) {
	  state.lastStringValue = "";
	  if (this.regexp_eatRegExpIdentifierStart(state)) {
		state.lastStringValue += codePointToString$1(state.lastIntValue);
		while (this.regexp_eatRegExpIdentifierPart(state)) {
		  state.lastStringValue += codePointToString$1(state.lastIntValue);
		}
		return true
	  }
	  return false
	};
  
	// RegExpIdentifierStart ::
	//   UnicodeIDStart
	//   `$`
	//   `_`
	//   `\` RegExpUnicodeEscapeSequence[+U]
	pp$1.regexp_eatRegExpIdentifierStart = function(state) {
	  var start = state.pos;
	  var forceU = this.options.ecmaVersion >= 11;
	  var ch = state.current(forceU);
	  state.advance(forceU);
  
	  if (ch === 0x5C /* \ */ && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) {
		ch = state.lastIntValue;
	  }
	  if (isRegExpIdentifierStart(ch)) {
		state.lastIntValue = ch;
		return true
	  }
  
	  state.pos = start;
	  return false
	};
	function isRegExpIdentifierStart(ch) {
	  return isIdentifierStart(ch, true) || ch === 0x24 /* $ */ || ch === 0x5F /* _ */
	}
  
	// RegExpIdentifierPart ::
	//   UnicodeIDContinue
	//   `$`
	//   `_`
	//   `\` RegExpUnicodeEscapeSequence[+U]
	//   <ZWNJ>
	//   <ZWJ>
	pp$1.regexp_eatRegExpIdentifierPart = function(state) {
	  var start = state.pos;
	  var forceU = this.options.ecmaVersion >= 11;
	  var ch = state.current(forceU);
	  state.advance(forceU);
  
	  if (ch === 0x5C /* \ */ && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) {
		ch = state.lastIntValue;
	  }
	  if (isRegExpIdentifierPart(ch)) {
		state.lastIntValue = ch;
		return true
	  }
  
	  state.pos = start;
	  return false
	};
	function isRegExpIdentifierPart(ch) {
	  return isIdentifierChar(ch, true) || ch === 0x24 /* $ */ || ch === 0x5F /* _ */ || ch === 0x200C /* <ZWNJ> */ || ch === 0x200D /* <ZWJ> */
	}
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-AtomEscape
	pp$1.regexp_eatAtomEscape = function(state) {
	  if (
		this.regexp_eatBackReference(state) ||
		this.regexp_eatCharacterClassEscape(state) ||
		this.regexp_eatCharacterEscape(state) ||
		(state.switchN && this.regexp_eatKGroupName(state))
	  ) {
		return true
	  }
	  if (state.switchU) {
		// Make the same message as V8.
		if (state.current() === 0x63 /* c */) {
		  state.raise("Invalid unicode escape");
		}
		state.raise("Invalid escape");
	  }
	  return false
	};
	pp$1.regexp_eatBackReference = function(state) {
	  var start = state.pos;
	  if (this.regexp_eatDecimalEscape(state)) {
		var n = state.lastIntValue;
		if (state.switchU) {
		  // For SyntaxError in https://www.ecma-international.org/ecma-262/8.0/#sec-atomescape
		  if (n > state.maxBackReference) {
			state.maxBackReference = n;
		  }
		  return true
		}
		if (n <= state.numCapturingParens) {
		  return true
		}
		state.pos = start;
	  }
	  return false
	};
	pp$1.regexp_eatKGroupName = function(state) {
	  if (state.eat(0x6B /* k */)) {
		if (this.regexp_eatGroupName(state)) {
		  state.backReferenceNames.push(state.lastStringValue);
		  return true
		}
		state.raise("Invalid named reference");
	  }
	  return false
	};
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-CharacterEscape
	pp$1.regexp_eatCharacterEscape = function(state) {
	  return (
		this.regexp_eatControlEscape(state) ||
		this.regexp_eatCControlLetter(state) ||
		this.regexp_eatZero(state) ||
		this.regexp_eatHexEscapeSequence(state) ||
		this.regexp_eatRegExpUnicodeEscapeSequence(state, false) ||
		(!state.switchU && this.regexp_eatLegacyOctalEscapeSequence(state)) ||
		this.regexp_eatIdentityEscape(state)
	  )
	};
	pp$1.regexp_eatCControlLetter = function(state) {
	  var start = state.pos;
	  if (state.eat(0x63 /* c */)) {
		if (this.regexp_eatControlLetter(state)) {
		  return true
		}
		state.pos = start;
	  }
	  return false
	};
	pp$1.regexp_eatZero = function(state) {
	  if (state.current() === 0x30 /* 0 */ && !isDecimalDigit(state.lookahead())) {
		state.lastIntValue = 0;
		state.advance();
		return true
	  }
	  return false
	};
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-ControlEscape
	pp$1.regexp_eatControlEscape = function(state) {
	  var ch = state.current();
	  if (ch === 0x74 /* t */) {
		state.lastIntValue = 0x09; /* \t */
		state.advance();
		return true
	  }
	  if (ch === 0x6E /* n */) {
		state.lastIntValue = 0x0A; /* \n */
		state.advance();
		return true
	  }
	  if (ch === 0x76 /* v */) {
		state.lastIntValue = 0x0B; /* \v */
		state.advance();
		return true
	  }
	  if (ch === 0x66 /* f */) {
		state.lastIntValue = 0x0C; /* \f */
		state.advance();
		return true
	  }
	  if (ch === 0x72 /* r */) {
		state.lastIntValue = 0x0D; /* \r */
		state.advance();
		return true
	  }
	  return false
	};
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-ControlLetter
	pp$1.regexp_eatControlLetter = function(state) {
	  var ch = state.current();
	  if (isControlLetter(ch)) {
		state.lastIntValue = ch % 0x20;
		state.advance();
		return true
	  }
	  return false
	};
	function isControlLetter(ch) {
	  return (
		(ch >= 0x41 /* A */ && ch <= 0x5A /* Z */) ||
		(ch >= 0x61 /* a */ && ch <= 0x7A /* z */)
	  )
	}
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-RegExpUnicodeEscapeSequence
	pp$1.regexp_eatRegExpUnicodeEscapeSequence = function(state, forceU) {
	  if ( forceU === void 0 ) forceU = false;
  
	  var start = state.pos;
	  var switchU = forceU || state.switchU;
  
	  if (state.eat(0x75 /* u */)) {
		if (this.regexp_eatFixedHexDigits(state, 4)) {
		  var lead = state.lastIntValue;
		  if (switchU && lead >= 0xD800 && lead <= 0xDBFF) {
			var leadSurrogateEnd = state.pos;
			if (state.eat(0x5C /* \ */) && state.eat(0x75 /* u */) && this.regexp_eatFixedHexDigits(state, 4)) {
			  var trail = state.lastIntValue;
			  if (trail >= 0xDC00 && trail <= 0xDFFF) {
				state.lastIntValue = (lead - 0xD800) * 0x400 + (trail - 0xDC00) + 0x10000;
				return true
			  }
			}
			state.pos = leadSurrogateEnd;
			state.lastIntValue = lead;
		  }
		  return true
		}
		if (
		  switchU &&
		  state.eat(0x7B /* { */) &&
		  this.regexp_eatHexDigits(state) &&
		  state.eat(0x7D /* } */) &&
		  isValidUnicode(state.lastIntValue)
		) {
		  return true
		}
		if (switchU) {
		  state.raise("Invalid unicode escape");
		}
		state.pos = start;
	  }
  
	  return false
	};
	function isValidUnicode(ch) {
	  return ch >= 0 && ch <= 0x10FFFF
	}
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-IdentityEscape
	pp$1.regexp_eatIdentityEscape = function(state) {
	  if (state.switchU) {
		if (this.regexp_eatSyntaxCharacter(state)) {
		  return true
		}
		if (state.eat(0x2F /* / */)) {
		  state.lastIntValue = 0x2F; /* / */
		  return true
		}
		return false
	  }
  
	  var ch = state.current();
	  if (ch !== 0x63 /* c */ && (!state.switchN || ch !== 0x6B /* k */)) {
		state.lastIntValue = ch;
		state.advance();
		return true
	  }
  
	  return false
	};
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-DecimalEscape
	pp$1.regexp_eatDecimalEscape = function(state) {
	  state.lastIntValue = 0;
	  var ch = state.current();
	  if (ch >= 0x31 /* 1 */ && ch <= 0x39 /* 9 */) {
		do {
		  state.lastIntValue = 10 * state.lastIntValue + (ch - 0x30 /* 0 */);
		  state.advance();
		} while ((ch = state.current()) >= 0x30 /* 0 */ && ch <= 0x39 /* 9 */)
		return true
	  }
	  return false
	};
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-CharacterClassEscape
	pp$1.regexp_eatCharacterClassEscape = function(state) {
	  var ch = state.current();
  
	  if (isCharacterClassEscape(ch)) {
		state.lastIntValue = -1;
		state.advance();
		return true
	  }
  
	  if (
		state.switchU &&
		this.options.ecmaVersion >= 9 &&
		(ch === 0x50 /* P */ || ch === 0x70 /* p */)
	  ) {
		state.lastIntValue = -1;
		state.advance();
		if (
		  state.eat(0x7B /* { */) &&
		  this.regexp_eatUnicodePropertyValueExpression(state) &&
		  state.eat(0x7D /* } */)
		) {
		  return true
		}
		state.raise("Invalid property name");
	  }
  
	  return false
	};
	function isCharacterClassEscape(ch) {
	  return (
		ch === 0x64 /* d */ ||
		ch === 0x44 /* D */ ||
		ch === 0x73 /* s */ ||
		ch === 0x53 /* S */ ||
		ch === 0x77 /* w */ ||
		ch === 0x57 /* W */
	  )
	}
  
	// UnicodePropertyValueExpression ::
	//   UnicodePropertyName `=` UnicodePropertyValue
	//   LoneUnicodePropertyNameOrValue
	pp$1.regexp_eatUnicodePropertyValueExpression = function(state) {
	  var start = state.pos;
  
	  // UnicodePropertyName `=` UnicodePropertyValue
	  if (this.regexp_eatUnicodePropertyName(state) && state.eat(0x3D /* = */)) {
		var name = state.lastStringValue;
		if (this.regexp_eatUnicodePropertyValue(state)) {
		  var value = state.lastStringValue;
		  this.regexp_validateUnicodePropertyNameAndValue(state, name, value);
		  return true
		}
	  }
	  state.pos = start;
  
	  // LoneUnicodePropertyNameOrValue
	  if (this.regexp_eatLoneUnicodePropertyNameOrValue(state)) {
		var nameOrValue = state.lastStringValue;
		this.regexp_validateUnicodePropertyNameOrValue(state, nameOrValue);
		return true
	  }
	  return false
	};
	pp$1.regexp_validateUnicodePropertyNameAndValue = function(state, name, value) {
	  if (!hasOwn(state.unicodeProperties.nonBinary, name))
		{ state.raise("Invalid property name"); }
	  if (!state.unicodeProperties.nonBinary[name].test(value))
		{ state.raise("Invalid property value"); }
	};
	pp$1.regexp_validateUnicodePropertyNameOrValue = function(state, nameOrValue) {
	  if (!state.unicodeProperties.binary.test(nameOrValue))
		{ state.raise("Invalid property name"); }
	};
  
	// UnicodePropertyName ::
	//   UnicodePropertyNameCharacters
	pp$1.regexp_eatUnicodePropertyName = function(state) {
	  var ch = 0;
	  state.lastStringValue = "";
	  while (isUnicodePropertyNameCharacter(ch = state.current())) {
		state.lastStringValue += codePointToString$1(ch);
		state.advance();
	  }
	  return state.lastStringValue !== ""
	};
	function isUnicodePropertyNameCharacter(ch) {
	  return isControlLetter(ch) || ch === 0x5F /* _ */
	}
  
	// UnicodePropertyValue ::
	//   UnicodePropertyValueCharacters
	pp$1.regexp_eatUnicodePropertyValue = function(state) {
	  var ch = 0;
	  state.lastStringValue = "";
	  while (isUnicodePropertyValueCharacter(ch = state.current())) {
		state.lastStringValue += codePointToString$1(ch);
		state.advance();
	  }
	  return state.lastStringValue !== ""
	};
	function isUnicodePropertyValueCharacter(ch) {
	  return isUnicodePropertyNameCharacter(ch) || isDecimalDigit(ch)
	}
  
	// LoneUnicodePropertyNameOrValue ::
	//   UnicodePropertyValueCharacters
	pp$1.regexp_eatLoneUnicodePropertyNameOrValue = function(state) {
	  return this.regexp_eatUnicodePropertyValue(state)
	};
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-CharacterClass
	pp$1.regexp_eatCharacterClass = function(state) {
	  if (state.eat(0x5B /* [ */)) {
		state.eat(0x5E /* ^ */);
		this.regexp_classRanges(state);
		if (state.eat(0x5D /* ] */)) {
		  return true
		}
		// Unreachable since it threw "unterminated regular expression" error before.
		state.raise("Unterminated character class");
	  }
	  return false
	};
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-ClassRanges
	// https://www.ecma-international.org/ecma-262/8.0/#prod-NonemptyClassRanges
	// https://www.ecma-international.org/ecma-262/8.0/#prod-NonemptyClassRangesNoDash
	pp$1.regexp_classRanges = function(state) {
	  while (this.regexp_eatClassAtom(state)) {
		var left = state.lastIntValue;
		if (state.eat(0x2D /* - */) && this.regexp_eatClassAtom(state)) {
		  var right = state.lastIntValue;
		  if (state.switchU && (left === -1 || right === -1)) {
			state.raise("Invalid character class");
		  }
		  if (left !== -1 && right !== -1 && left > right) {
			state.raise("Range out of order in character class");
		  }
		}
	  }
	};
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-ClassAtom
	// https://www.ecma-international.org/ecma-262/8.0/#prod-ClassAtomNoDash
	pp$1.regexp_eatClassAtom = function(state) {
	  var start = state.pos;
  
	  if (state.eat(0x5C /* \ */)) {
		if (this.regexp_eatClassEscape(state)) {
		  return true
		}
		if (state.switchU) {
		  // Make the same message as V8.
		  var ch$1 = state.current();
		  if (ch$1 === 0x63 /* c */ || isOctalDigit(ch$1)) {
			state.raise("Invalid class escape");
		  }
		  state.raise("Invalid escape");
		}
		state.pos = start;
	  }
  
	  var ch = state.current();
	  if (ch !== 0x5D /* ] */) {
		state.lastIntValue = ch;
		state.advance();
		return true
	  }
  
	  return false
	};
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-ClassEscape
	pp$1.regexp_eatClassEscape = function(state) {
	  var start = state.pos;
  
	  if (state.eat(0x62 /* b */)) {
		state.lastIntValue = 0x08; /* <BS> */
		return true
	  }
  
	  if (state.switchU && state.eat(0x2D /* - */)) {
		state.lastIntValue = 0x2D; /* - */
		return true
	  }
  
	  if (!state.switchU && state.eat(0x63 /* c */)) {
		if (this.regexp_eatClassControlLetter(state)) {
		  return true
		}
		state.pos = start;
	  }
  
	  return (
		this.regexp_eatCharacterClassEscape(state) ||
		this.regexp_eatCharacterEscape(state)
	  )
	};
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-ClassControlLetter
	pp$1.regexp_eatClassControlLetter = function(state) {
	  var ch = state.current();
	  if (isDecimalDigit(ch) || ch === 0x5F /* _ */) {
		state.lastIntValue = ch % 0x20;
		state.advance();
		return true
	  }
	  return false
	};
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-HexEscapeSequence
	pp$1.regexp_eatHexEscapeSequence = function(state) {
	  var start = state.pos;
	  if (state.eat(0x78 /* x */)) {
		if (this.regexp_eatFixedHexDigits(state, 2)) {
		  return true
		}
		if (state.switchU) {
		  state.raise("Invalid escape");
		}
		state.pos = start;
	  }
	  return false
	};
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-DecimalDigits
	pp$1.regexp_eatDecimalDigits = function(state) {
	  var start = state.pos;
	  var ch = 0;
	  state.lastIntValue = 0;
	  while (isDecimalDigit(ch = state.current())) {
		state.lastIntValue = 10 * state.lastIntValue + (ch - 0x30 /* 0 */);
		state.advance();
	  }
	  return state.pos !== start
	};
	function isDecimalDigit(ch) {
	  return ch >= 0x30 /* 0 */ && ch <= 0x39 /* 9 */
	}
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-HexDigits
	pp$1.regexp_eatHexDigits = function(state) {
	  var start = state.pos;
	  var ch = 0;
	  state.lastIntValue = 0;
	  while (isHexDigit(ch = state.current())) {
		state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
		state.advance();
	  }
	  return state.pos !== start
	};
	function isHexDigit(ch) {
	  return (
		(ch >= 0x30 /* 0 */ && ch <= 0x39 /* 9 */) ||
		(ch >= 0x41 /* A */ && ch <= 0x46 /* F */) ||
		(ch >= 0x61 /* a */ && ch <= 0x66 /* f */)
	  )
	}
	function hexToInt(ch) {
	  if (ch >= 0x41 /* A */ && ch <= 0x46 /* F */) {
		return 10 + (ch - 0x41 /* A */)
	  }
	  if (ch >= 0x61 /* a */ && ch <= 0x66 /* f */) {
		return 10 + (ch - 0x61 /* a */)
	  }
	  return ch - 0x30 /* 0 */
	}
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-LegacyOctalEscapeSequence
	// Allows only 0-377(octal) i.e. 0-255(decimal).
	pp$1.regexp_eatLegacyOctalEscapeSequence = function(state) {
	  if (this.regexp_eatOctalDigit(state)) {
		var n1 = state.lastIntValue;
		if (this.regexp_eatOctalDigit(state)) {
		  var n2 = state.lastIntValue;
		  if (n1 <= 3 && this.regexp_eatOctalDigit(state)) {
			state.lastIntValue = n1 * 64 + n2 * 8 + state.lastIntValue;
		  } else {
			state.lastIntValue = n1 * 8 + n2;
		  }
		} else {
		  state.lastIntValue = n1;
		}
		return true
	  }
	  return false
	};
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-OctalDigit
	pp$1.regexp_eatOctalDigit = function(state) {
	  var ch = state.current();
	  if (isOctalDigit(ch)) {
		state.lastIntValue = ch - 0x30; /* 0 */
		state.advance();
		return true
	  }
	  state.lastIntValue = 0;
	  return false
	};
	function isOctalDigit(ch) {
	  return ch >= 0x30 /* 0 */ && ch <= 0x37 /* 7 */
	}
  
	// https://www.ecma-international.org/ecma-262/8.0/#prod-Hex4Digits
	// https://www.ecma-international.org/ecma-262/8.0/#prod-HexDigit
	// And HexDigit HexDigit in https://www.ecma-international.org/ecma-262/8.0/#prod-HexEscapeSequence
	pp$1.regexp_eatFixedHexDigits = function(state, length) {
	  var start = state.pos;
	  state.lastIntValue = 0;
	  for (var i = 0; i < length; ++i) {
		var ch = state.current();
		if (!isHexDigit(ch)) {
		  state.pos = start;
		  return false
		}
		state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
		state.advance();
	  }
	  return true
	};
  
	// Object type used to represent tokens. Note that normally, tokens
	// simply exist as properties on the parser object. This is only
	// used for the onToken callback and the external tokenizer.
  
	var Token = function Token(p) {
	  this.type = p.type;
	  this.value = p.value;
	  this.start = p.start;
	  this.end = p.end;
	  if (p.options.locations)
		{ this.loc = new SourceLocation(p, p.startLoc, p.endLoc); }
	  if (p.options.ranges)
		{ this.range = [p.start, p.end]; }
	};
  
	// ## Tokenizer
  
	var pp = Parser.prototype;
  
	// Move to the next token
  
	pp.next = function(ignoreEscapeSequenceInKeyword) {
	  if (!ignoreEscapeSequenceInKeyword && this.type.keyword && this.containsEsc)
		{ this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword); }
	  if (this.options.onToken)
		{ this.options.onToken(new Token(this)); }
  
	  this.lastTokEnd = this.end;
	  this.lastTokStart = this.start;
	  this.lastTokEndLoc = this.endLoc;
	  this.lastTokStartLoc = this.startLoc;
	  this.nextToken();
	};
  
	pp.getToken = function() {
	  this.next();
	  return new Token(this)
	};
  
	// If we're in an ES6 environment, make parsers iterable
	if (typeof Symbol !== "undefined")
	  { pp[Symbol.iterator] = function() {
		var this$1$1 = this;
  
		return {
		  next: function () {
			var token = this$1$1.getToken();
			return {
			  done: token.type === types$1.eof,
			  value: token
			}
		  }
		}
	  }; }
  
	// Toggle strict mode. Re-reads the next number or string to please
	// pedantic tests (`"use strict"; 010;` should fail).
  
	// Read a single token, updating the parser object's token-related
	// properties.
  
	pp.nextToken = function() {
	  var curContext = this.curContext();
	  if (!curContext || !curContext.preserveSpace) { this.skipSpace(); }
  
	  this.start = this.pos;
	  if (this.options.locations) { this.startLoc = this.curPosition(); }
	  if (this.pos >= this.input.length) { return this.finishToken(types$1.eof) }
  
	  if (curContext.override) { return curContext.override(this) }
	  else { this.readToken(this.fullCharCodeAtPos()); }
	};
  
	pp.readToken = function(code) {
	  // Identifier or keyword. '\uXXXX' sequences are allowed in
	  // identifiers, so '\' also dispatches to that.
	  if (isIdentifierStart(code, this.options.ecmaVersion >= 6) || code === 92 /* '\' */)
		{ return this.readWord() }
  
	  return this.getTokenFromCode(code)
	};
  
	pp.fullCharCodeAtPos = function() {
	  var code = this.input.charCodeAt(this.pos);
	  if (code <= 0xd7ff || code >= 0xdc00) { return code }
	  var next = this.input.charCodeAt(this.pos + 1);
	  return next <= 0xdbff || next >= 0xe000 ? code : (code << 10) + next - 0x35fdc00
	};
  
	pp.skipBlockComment = function() {
	  var startLoc = this.options.onComment && this.curPosition();
	  var start = this.pos, end = this.input.indexOf("*/", this.pos += 2);
	  if (end === -1) { this.raise(this.pos - 2, "Unterminated comment"); }
	  this.pos = end + 2;
	  if (this.options.locations) {
		for (var nextBreak = (void 0), pos = start; (nextBreak = nextLineBreak(this.input, pos, this.pos)) > -1;) {
		  ++this.curLine;
		  pos = this.lineStart = nextBreak;
		}
	  }
	  if (this.options.onComment)
		{ this.options.onComment(true, this.input.slice(start + 2, end), start, this.pos,
							   startLoc, this.curPosition()); }
	};
  
	pp.skipLineComment = function(startSkip) {
	  var start = this.pos;
	  var startLoc = this.options.onComment && this.curPosition();
	  var ch = this.input.charCodeAt(this.pos += startSkip);
	  while (this.pos < this.input.length && !isNewLine(ch)) {
		ch = this.input.charCodeAt(++this.pos);
	  }
	  if (this.options.onComment)
		{ this.options.onComment(false, this.input.slice(start + startSkip, this.pos), start, this.pos,
							   startLoc, this.curPosition()); }
	};
  
	// Called at the start of the parse and after every token. Skips
	// whitespace and comments, and.
  
	pp.skipSpace = function() {
	  loop: while (this.pos < this.input.length) {
		var ch = this.input.charCodeAt(this.pos);
		switch (ch) {
		case 32: case 160: // ' '
		  ++this.pos;
		  break
		case 13:
		  if (this.input.charCodeAt(this.pos + 1) === 10) {
			++this.pos;
		  }
		case 10: case 8232: case 8233:
		  ++this.pos;
		  if (this.options.locations) {
			++this.curLine;
			this.lineStart = this.pos;
		  }
		  break
		case 47: // '/'
		  switch (this.input.charCodeAt(this.pos + 1)) {
		  case 42: // '*'
			this.skipBlockComment();
			break
		  case 47:
			this.skipLineComment(2);
			break
		  default:
			break loop
		  }
		  break
		default:
		  if (ch > 8 && ch < 14 || ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch))) {
			++this.pos;
		  } else {
			break loop
		  }
		}
	  }
	};
  
	// Called at the end of every token. Sets `end`, `val`, and
	// maintains `context` and `exprAllowed`, and skips the space after
	// the token, so that the next one's `start` will point at the
	// right position.
  
	pp.finishToken = function(type, val) {
	  this.end = this.pos;
	  if (this.options.locations) { this.endLoc = this.curPosition(); }
	  var prevType = this.type;
	  this.type = type;
	  this.value = val;
  
	  this.updateContext(prevType);
	};
  
	// ### Token reading
  
	// This is the function that is called to fetch the next token. It
	// is somewhat obscure, because it works in character codes rather
	// than characters, and because operator parsing has been inlined
	// into it.
	//
	// All in the name of speed.
	//
	pp.readToken_dot = function() {
	  var next = this.input.charCodeAt(this.pos + 1);
	  if (next >= 48 && next <= 57) { return this.readNumber(true) }
	  var next2 = this.input.charCodeAt(this.pos + 2);
	  if (this.options.ecmaVersion >= 6 && next === 46 && next2 === 46) { // 46 = dot '.'
		this.pos += 3;
		return this.finishToken(types$1.ellipsis)
	  } else {
		++this.pos;
		return this.finishToken(types$1.dot)
	  }
	};
  
	pp.readToken_slash = function() { // '/'
	  var next = this.input.charCodeAt(this.pos + 1);
	  if (this.exprAllowed) { ++this.pos; return this.readRegexp() }
	  if (next === 61) { return this.finishOp(types$1.assign, 2) }
	  return this.finishOp(types$1.slash, 1)
	};
  
	pp.readToken_mult_modulo_exp = function(code) { // '%*'
	  var next = this.input.charCodeAt(this.pos + 1);
	  var size = 1;
	  var tokentype = code === 42 ? types$1.star : types$1.modulo;
  
	  // exponentiation operator ** and **=
	  if (this.options.ecmaVersion >= 7 && code === 42 && next === 42) {
		++size;
		tokentype = types$1.starstar;
		next = this.input.charCodeAt(this.pos + 2);
	  }
  
	  if (next === 61) { return this.finishOp(types$1.assign, size + 1) }
	  return this.finishOp(tokentype, size)
	};
  
	pp.readToken_pipe_amp = function(code) { // '|&'
	  var next = this.input.charCodeAt(this.pos + 1);
	  if (next === code) {
		if (this.options.ecmaVersion >= 12) {
		  var next2 = this.input.charCodeAt(this.pos + 2);
		  if (next2 === 61) { return this.finishOp(types$1.assign, 3) }
		}
		return this.finishOp(code === 124 ? types$1.logicalOR : types$1.logicalAND, 2)
	  }
	  if (next === 61) { return this.finishOp(types$1.assign, 2) }
	  return this.finishOp(code === 124 ? types$1.bitwiseOR : types$1.bitwiseAND, 1)
	};
  
	pp.readToken_caret = function() { // '^'
	  var next = this.input.charCodeAt(this.pos + 1);
	  if (next === 61) { return this.finishOp(types$1.assign, 2) }
	  return this.finishOp(types$1.bitwiseXOR, 1)
	};
  
	pp.readToken_plus_min = function(code) { // '+-'
	  var next = this.input.charCodeAt(this.pos + 1);
	  if (next === code) {
		if (next === 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 62 &&
			(this.lastTokEnd === 0 || lineBreak.test(this.input.slice(this.lastTokEnd, this.pos)))) {
		  // A `-->` line comment
		  this.skipLineComment(3);
		  this.skipSpace();
		  return this.nextToken()
		}
		return this.finishOp(types$1.incDec, 2)
	  }
	  if (next === 61) { return this.finishOp(types$1.assign, 2) }
	  return this.finishOp(types$1.plusMin, 1)
	};
  
	pp.readToken_lt_gt = function(code) { // '<>'
	  var next = this.input.charCodeAt(this.pos + 1);
	  var size = 1;
	  if (next === code) {
		size = code === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2;
		if (this.input.charCodeAt(this.pos + size) === 61) { return this.finishOp(types$1.assign, size + 1) }
		return this.finishOp(types$1.bitShift, size)
	  }
	  if (next === 33 && code === 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 45 &&
		  this.input.charCodeAt(this.pos + 3) === 45) {
		// `<!--`, an XML-style comment that should be interpreted as a line comment
		this.skipLineComment(4);
		this.skipSpace();
		return this.nextToken()
	  }
	  if (next === 61) { size = 2; }
	  return this.finishOp(types$1.relational, size)
	};
  
	pp.readToken_eq_excl = function(code) { // '=!'
	  var next = this.input.charCodeAt(this.pos + 1);
	  if (next === 61) { return this.finishOp(types$1.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2) }
	  if (code === 61 && next === 62 && this.options.ecmaVersion >= 6) { // '=>'
		this.pos += 2;
		return this.finishToken(types$1.arrow)
	  }
	  return this.finishOp(code === 61 ? types$1.eq : types$1.prefix, 1)
	};
  
	pp.readToken_question = function() { // '?'
	  var ecmaVersion = this.options.ecmaVersion;
	  if (ecmaVersion >= 11) {
		var next = this.input.charCodeAt(this.pos + 1);
		if (next === 46) {
		  var next2 = this.input.charCodeAt(this.pos + 2);
		  if (next2 < 48 || next2 > 57) { return this.finishOp(types$1.questionDot, 2) }
		}
		if (next === 63) {
		  if (ecmaVersion >= 12) {
			var next2$1 = this.input.charCodeAt(this.pos + 2);
			if (next2$1 === 61) { return this.finishOp(types$1.assign, 3) }
		  }
		  return this.finishOp(types$1.coalesce, 2)
		}
	  }
	  return this.finishOp(types$1.question, 1)
	};
  
	pp.readToken_numberSign = function() { // '#'
	  var ecmaVersion = this.options.ecmaVersion;
	  var code = 35; // '#'
	  if (ecmaVersion >= 13) {
		++this.pos;
		code = this.fullCharCodeAtPos();
		if (isIdentifierStart(code, true) || code === 92 /* '\' */) {
		  return this.finishToken(types$1.privateId, this.readWord1())
		}
	  }
  
	  this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
	};
  
	pp.getTokenFromCode = function(code) {
	  switch (code) {
	  // The interpretation of a dot depends on whether it is followed
	  // by a digit or another two dots.
	  case 46: // '.'
		return this.readToken_dot()
  
	  // Punctuation tokens.
	  case 40: ++this.pos; return this.finishToken(types$1.parenL)
	  case 41: ++this.pos; return this.finishToken(types$1.parenR)
	  case 59: ++this.pos; return this.finishToken(types$1.semi)
	  case 44: ++this.pos; return this.finishToken(types$1.comma)
	  case 91: ++this.pos; return this.finishToken(types$1.bracketL)
	  case 93: ++this.pos; return this.finishToken(types$1.bracketR)
	  case 123: ++this.pos; return this.finishToken(types$1.braceL)
	  case 125: ++this.pos; return this.finishToken(types$1.braceR)
	  case 58: ++this.pos; return this.finishToken(types$1.colon)
  
	  case 96: // '`'
		if (this.options.ecmaVersion < 6) { break }
		++this.pos;
		return this.finishToken(types$1.backQuote)
  
	  case 48: // '0'
		var next = this.input.charCodeAt(this.pos + 1);
		if (next === 120 || next === 88) { return this.readRadixNumber(16) } // '0x', '0X' - hex number
		if (this.options.ecmaVersion >= 6) {
		  if (next === 111 || next === 79) { return this.readRadixNumber(8) } // '0o', '0O' - octal number
		  if (next === 98 || next === 66) { return this.readRadixNumber(2) } // '0b', '0B' - binary number
		}
  
	  // Anything else beginning with a digit is an integer, octal
	  // number, or float.
	  case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57: // 1-9
		return this.readNumber(false)
  
	  // Quotes produce strings.
	  case 34: case 39: // '"', "'"
		return this.readString(code)
  
	  // Operators are parsed inline in tiny state machines. '=' (61) is
	  // often referred to. `finishOp` simply skips the amount of
	  // characters it is given as second argument, and returns a token
	  // of the type given by its first argument.
	  case 47: // '/'
		return this.readToken_slash()
  
	  case 37: case 42: // '%*'
		return this.readToken_mult_modulo_exp(code)
  
	  case 124: case 38: // '|&'
		return this.readToken_pipe_amp(code)
  
	  case 94: // '^'
		return this.readToken_caret()
  
	  case 43: case 45: // '+-'
		return this.readToken_plus_min(code)
  
	  case 60: case 62: // '<>'
		return this.readToken_lt_gt(code)
  
	  case 61: case 33: // '=!'
		return this.readToken_eq_excl(code)
  
	  case 63: // '?'
		return this.readToken_question()
  
	  case 126: // '~'
		return this.finishOp(types$1.prefix, 1)
  
	  case 35: // '#'
		return this.readToken_numberSign()
	  }
  
	  this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
	};
  
	pp.finishOp = function(type, size) {
	  var str = this.input.slice(this.pos, this.pos + size);
	  this.pos += size;
	  return this.finishToken(type, str)
	};
  
	pp.readRegexp = function() {
	  var escaped, inClass, start = this.pos;
	  for (;;) {
		if (this.pos >= this.input.length) { this.raise(start, "Unterminated regular expression"); }
		var ch = this.input.charAt(this.pos);
		if (lineBreak.test(ch)) { this.raise(start, "Unterminated regular expression"); }
		if (!escaped) {
		  if (ch === "[") { inClass = true; }
		  else if (ch === "]" && inClass) { inClass = false; }
		  else if (ch === "/" && !inClass) { break }
		  escaped = ch === "\\";
		} else { escaped = false; }
		++this.pos;
	  }
	  var pattern = this.input.slice(start, this.pos);
	  ++this.pos;
	  var flagsStart = this.pos;
	  var flags = this.readWord1();
	  if (this.containsEsc) { this.unexpected(flagsStart); }
  
	  // Validate pattern
	  var state = this.regexpState || (this.regexpState = new RegExpValidationState(this));
	  state.reset(start, pattern, flags);
	  this.validateRegExpFlags(state);
	  this.validateRegExpPattern(state);
  
	  // Create Literal#value property value.
	  var value = null;
	  try {
		value = new RegExp(pattern, flags);
	  } catch (e) {
		// ESTree requires null if it failed to instantiate RegExp object.
		// https://github.com/estree/estree/blob/a27003adf4fd7bfad44de9cef372a2eacd527b1c/es5.md#regexpliteral
	  }
  
	  return this.finishToken(types$1.regexp, {pattern: pattern, flags: flags, value: value})
	};
  
	// Read an integer in the given radix. Return null if zero digits
	// were read, the integer value otherwise. When `len` is given, this
	// will return `null` unless the integer has exactly `len` digits.
  
	pp.readInt = function(radix, len, maybeLegacyOctalNumericLiteral) {
	  // `len` is used for character escape sequences. In that case, disallow separators.
	  var allowSeparators = this.options.ecmaVersion >= 12 && len === undefined;
  
	  // `maybeLegacyOctalNumericLiteral` is true if it doesn't have prefix (0x,0o,0b)
	  // and isn't fraction part nor exponent part. In that case, if the first digit
	  // is zero then disallow separators.
	  var isLegacyOctalNumericLiteral = maybeLegacyOctalNumericLiteral && this.input.charCodeAt(this.pos) === 48;
  
	  var start = this.pos, total = 0, lastCode = 0;
	  for (var i = 0, e = len == null ? Infinity : len; i < e; ++i, ++this.pos) {
		var code = this.input.charCodeAt(this.pos), val = (void 0);
  
		if (allowSeparators && code === 95) {
		  if (isLegacyOctalNumericLiteral) { this.raiseRecoverable(this.pos, "Numeric separator is not allowed in legacy octal numeric literals"); }
		  if (lastCode === 95) { this.raiseRecoverable(this.pos, "Numeric separator must be exactly one underscore"); }
		  if (i === 0) { this.raiseRecoverable(this.pos, "Numeric separator is not allowed at the first of digits"); }
		  lastCode = code;
		  continue
		}
  
		if (code >= 97) { val = code - 97 + 10; } // a
		else if (code >= 65) { val = code - 65 + 10; } // A
		else if (code >= 48 && code <= 57) { val = code - 48; } // 0-9
		else { val = Infinity; }
		if (val >= radix) { break }
		lastCode = code;
		total = total * radix + val;
	  }
  
	  if (allowSeparators && lastCode === 95) { this.raiseRecoverable(this.pos - 1, "Numeric separator is not allowed at the last of digits"); }
	  if (this.pos === start || len != null && this.pos - start !== len) { return null }
  
	  return total
	};
  
	function stringToNumber(str, isLegacyOctalNumericLiteral) {
	  if (isLegacyOctalNumericLiteral) {
		return parseInt(str, 8)
	  }
  
	  // `parseFloat(value)` stops parsing at the first numeric separator then returns a wrong value.
	  return parseFloat(str.replace(/_/g, ""))
	}
  
	function stringToBigInt(str) {
	  if (typeof BigInt !== "function") {
		return null
	  }
  
	  // `BigInt(value)` throws syntax error if the string contains numeric separators.
	  return BigInt(str.replace(/_/g, ""))
	}
  
	pp.readRadixNumber = function(radix) {
	  var start = this.pos;
	  this.pos += 2; // 0x
	  var val = this.readInt(radix);
	  if (val == null) { this.raise(this.start + 2, "Expected number in radix " + radix); }
	  if (this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110) {
		val = stringToBigInt(this.input.slice(start, this.pos));
		++this.pos;
	  } else if (isIdentifierStart(this.fullCharCodeAtPos())) { this.raise(this.pos, "Identifier directly after number"); }
	  return this.finishToken(types$1.num, val)
	};
  
	// Read an integer, octal integer, or floating-point number.
  
	pp.readNumber = function(startsWithDot) {
	  var start = this.pos;
	  if (!startsWithDot && this.readInt(10, undefined, true) === null) { this.raise(start, "Invalid number"); }
	  var octal = this.pos - start >= 2 && this.input.charCodeAt(start) === 48;
	  if (octal && this.strict) { this.raise(start, "Invalid number"); }
	  var next = this.input.charCodeAt(this.pos);
	  if (!octal && !startsWithDot && this.options.ecmaVersion >= 11 && next === 110) {
		var val$1 = stringToBigInt(this.input.slice(start, this.pos));
		++this.pos;
		if (isIdentifierStart(this.fullCharCodeAtPos())) { this.raise(this.pos, "Identifier directly after number"); }
		return this.finishToken(types$1.num, val$1)
	  }
	  if (octal && /[89]/.test(this.input.slice(start, this.pos))) { octal = false; }
	  if (next === 46 && !octal) { // '.'
		++this.pos;
		this.readInt(10);
		next = this.input.charCodeAt(this.pos);
	  }
	  if ((next === 69 || next === 101) && !octal) { // 'eE'
		next = this.input.charCodeAt(++this.pos);
		if (next === 43 || next === 45) { ++this.pos; } // '+-'
		if (this.readInt(10) === null) { this.raise(start, "Invalid number"); }
	  }
	  if (isIdentifierStart(this.fullCharCodeAtPos())) { this.raise(this.pos, "Identifier directly after number"); }
  
	  var val = stringToNumber(this.input.slice(start, this.pos), octal);
	  return this.finishToken(types$1.num, val)
	};
  
	// Read a string value, interpreting backslash-escapes.
  
	pp.readCodePoint = function() {
	  var ch = this.input.charCodeAt(this.pos), code;
  
	  if (ch === 123) { // '{'
		if (this.options.ecmaVersion < 6) { this.unexpected(); }
		var codePos = ++this.pos;
		code = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos);
		++this.pos;
		if (code > 0x10FFFF) { this.invalidStringToken(codePos, "Code point out of bounds"); }
	  } else {
		code = this.readHexChar(4);
	  }
	  return code
	};
  
	function codePointToString(code) {
	  // UTF-16 Decoding
	  if (code <= 0xFFFF) { return String.fromCharCode(code) }
	  code -= 0x10000;
	  return String.fromCharCode((code >> 10) + 0xD800, (code & 1023) + 0xDC00)
	}
  
	pp.readString = function(quote) {
	  var out = "", chunkStart = ++this.pos;
	  for (;;) {
		if (this.pos >= this.input.length) { this.raise(this.start, "Unterminated string constant"); }
		var ch = this.input.charCodeAt(this.pos);
		if (ch === quote) { break }
		if (ch === 92) { // '\'
		  out += this.input.slice(chunkStart, this.pos);
		  out += this.readEscapedChar(false);
		  chunkStart = this.pos;
		} else if (ch === 0x2028 || ch === 0x2029) {
		  if (this.options.ecmaVersion < 10) { this.raise(this.start, "Unterminated string constant"); }
		  ++this.pos;
		  if (this.options.locations) {
			this.curLine++;
			this.lineStart = this.pos;
		  }
		} else {
		  if (isNewLine(ch)) { this.raise(this.start, "Unterminated string constant"); }
		  ++this.pos;
		}
	  }
	  out += this.input.slice(chunkStart, this.pos++);
	  return this.finishToken(types$1.string, out)
	};
  
	// Reads template string tokens.
  
	var INVALID_TEMPLATE_ESCAPE_ERROR = {};
  
	pp.tryReadTemplateToken = function() {
	  this.inTemplateElement = true;
	  try {
		this.readTmplToken();
	  } catch (err) {
		if (err === INVALID_TEMPLATE_ESCAPE_ERROR) {
		  this.readInvalidTemplateToken();
		} else {
		  throw err
		}
	  }
  
	  this.inTemplateElement = false;
	};
  
	pp.invalidStringToken = function(position, message) {
	  if (this.inTemplateElement && this.options.ecmaVersion >= 9) {
		throw INVALID_TEMPLATE_ESCAPE_ERROR
	  } else {
		this.raise(position, message);
	  }
	};
  
	pp.readTmplToken = function() {
	  var out = "", chunkStart = this.pos;
	  for (;;) {
		if (this.pos >= this.input.length) { this.raise(this.start, "Unterminated template"); }
		var ch = this.input.charCodeAt(this.pos);
		if (ch === 96 || ch === 36 && this.input.charCodeAt(this.pos + 1) === 123) { // '`', '${'
		  if (this.pos === this.start && (this.type === types$1.template || this.type === types$1.invalidTemplate)) {
			if (ch === 36) {
			  this.pos += 2;
			  return this.finishToken(types$1.dollarBraceL)
			} else {
			  ++this.pos;
			  return this.finishToken(types$1.backQuote)
			}
		  }
		  out += this.input.slice(chunkStart, this.pos);
		  return this.finishToken(types$1.template, out)
		}
		if (ch === 92) { // '\'
		  out += this.input.slice(chunkStart, this.pos);
		  out += this.readEscapedChar(true);
		  chunkStart = this.pos;
		} else if (isNewLine(ch)) {
		  out += this.input.slice(chunkStart, this.pos);
		  ++this.pos;
		  switch (ch) {
		  case 13:
			if (this.input.charCodeAt(this.pos) === 10) { ++this.pos; }
		  case 10:
			out += "\n";
			break
		  default:
			out += String.fromCharCode(ch);
			break
		  }
		  if (this.options.locations) {
			++this.curLine;
			this.lineStart = this.pos;
		  }
		  chunkStart = this.pos;
		} else {
		  ++this.pos;
		}
	  }
	};
  
	// Reads a template token to search for the end, without validating any escape sequences
	pp.readInvalidTemplateToken = function() {
	  for (; this.pos < this.input.length; this.pos++) {
		switch (this.input[this.pos]) {
		case "\\":
		  ++this.pos;
		  break
  
		case "$":
		  if (this.input[this.pos + 1] !== "{") {
			break
		  }
  
		// falls through
		case "`":
		  return this.finishToken(types$1.invalidTemplate, this.input.slice(this.start, this.pos))
  
		// no default
		}
	  }
	  this.raise(this.start, "Unterminated template");
	};
  
	// Used to read escaped characters
  
	pp.readEscapedChar = function(inTemplate) {
	  var ch = this.input.charCodeAt(++this.pos);
	  ++this.pos;
	  switch (ch) {
	  case 110: return "\n" // 'n' -> '\n'
	  case 114: return "\r" // 'r' -> '\r'
	  case 120: return String.fromCharCode(this.readHexChar(2)) // 'x'
	  case 117: return codePointToString(this.readCodePoint()) // 'u'
	  case 116: return "\t" // 't' -> '\t'
	  case 98: return "\b" // 'b' -> '\b'
	  case 118: return "\u000b" // 'v' -> '\u000b'
	  case 102: return "\f" // 'f' -> '\f'
	  case 13: if (this.input.charCodeAt(this.pos) === 10) { ++this.pos; } // '\r\n'
	  case 10: // ' \n'
		if (this.options.locations) { this.lineStart = this.pos; ++this.curLine; }
		return ""
	  case 56:
	  case 57:
		if (this.strict) {
		  this.invalidStringToken(
			this.pos - 1,
			"Invalid escape sequence"
		  );
		}
		if (inTemplate) {
		  var codePos = this.pos - 1;
  
		  this.invalidStringToken(
			codePos,
			"Invalid escape sequence in template string"
		  );
  
		  return null
		}
	  default:
		if (ch >= 48 && ch <= 55) {
		  var octalStr = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0];
		  var octal = parseInt(octalStr, 8);
		  if (octal > 255) {
			octalStr = octalStr.slice(0, -1);
			octal = parseInt(octalStr, 8);
		  }
		  this.pos += octalStr.length - 1;
		  ch = this.input.charCodeAt(this.pos);
		  if ((octalStr !== "0" || ch === 56 || ch === 57) && (this.strict || inTemplate)) {
			this.invalidStringToken(
			  this.pos - 1 - octalStr.length,
			  inTemplate
				? "Octal literal in template string"
				: "Octal literal in strict mode"
			);
		  }
		  return String.fromCharCode(octal)
		}
		if (isNewLine(ch)) {
		  // Unicode new line characters after \ get removed from output in both
		  // template literals and strings
		  return ""
		}
		return String.fromCharCode(ch)
	  }
	};
  
	// Used to read character escape sequences ('\x', '\u', '\U').
  
	pp.readHexChar = function(len) {
	  var codePos = this.pos;
	  var n = this.readInt(16, len);
	  if (n === null) { this.invalidStringToken(codePos, "Bad character escape sequence"); }
	  return n
	};
  
	// Read an identifier, and return it as a string. Sets `this.containsEsc`
	// to whether the word contained a '\u' escape.
	//
	// Incrementally adds only escaped chars, adding other chunks as-is
	// as a micro-optimization.
  
	pp.readWord1 = function() {
	  this.containsEsc = false;
	  var word = "", first = true, chunkStart = this.pos;
	  var astral = this.options.ecmaVersion >= 6;
	  while (this.pos < this.input.length) {
		var ch = this.fullCharCodeAtPos();
		if (isIdentifierChar(ch, astral)) {
		  this.pos += ch <= 0xffff ? 1 : 2;
		} else if (ch === 92) { // "\"
		  this.containsEsc = true;
		  word += this.input.slice(chunkStart, this.pos);
		  var escStart = this.pos;
		  if (this.input.charCodeAt(++this.pos) !== 117) // "u"
			{ this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX"); }
		  ++this.pos;
		  var esc = this.readCodePoint();
		  if (!(first ? isIdentifierStart : isIdentifierChar)(esc, astral))
			{ this.invalidStringToken(escStart, "Invalid Unicode escape"); }
		  word += codePointToString(esc);
		  chunkStart = this.pos;
		} else {
		  break
		}
		first = false;
	  }
	  return word + this.input.slice(chunkStart, this.pos)
	};
  
	// Read an identifier or keyword token. Will check for reserved
	// words when necessary.
  
	pp.readWord = function() {
	  var word = this.readWord1();
	  var type = types$1.name;
	  if (this.keywords.test(word)) {
		type = keywords[word];
	  }
	  return this.finishToken(type, word)
	};
  
	// Acorn is a tiny, fast JavaScript parser written in JavaScript.
  
	var version = "8.7.0";
  
	Parser.acorn = {
	  Parser: Parser,
	  version: version,
	  defaultOptions: defaultOptions,
	  Position: Position,
	  SourceLocation: SourceLocation,
	  getLineInfo: getLineInfo,
	  Node: Node,
	  TokenType: TokenType,
	  tokTypes: types$1,
	  keywordTypes: keywords,
	  TokContext: TokContext,
	  tokContexts: types,
	  isIdentifierChar: isIdentifierChar,
	  isIdentifierStart: isIdentifierStart,
	  Token: Token,
	  isNewLine: isNewLine,
	  lineBreak: lineBreak,
	  lineBreakG: lineBreakG,
	  nonASCIIwhitespace: nonASCIIwhitespace
	};
  
	// The main exported interface (under `self.acorn` when in the
	// browser) is a `parse` function that takes a code string and
	// returns an abstract syntax tree as specified by [Mozilla parser
	// API][api].
	//
	// [api]: https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API
  
	function parse(input, options) {
	  return Parser.parse(input, options)
	}
  
	// This function tries to parse a single expression at a given
	// offset in a string. Useful for parsing mixed-language formats
	// that embed JavaScript expressions.
  
	function parseExpressionAt(input, pos, options) {
	  return Parser.parseExpressionAt(input, pos, options)
	}
  
	// Acorn is organized as a tokenizer and a recursive-descent parser.
	// The `tokenizer` export provides an interface to the tokenizer.
  
	function tokenizer(input, options) {
	  return Parser.tokenizer(input, options)
	}
  
	exports.Node = Node;
	exports.Parser = Parser;
	exports.Position = Position;
	exports.SourceLocation = SourceLocation;
	exports.TokContext = TokContext;
	exports.Token = Token;
	exports.TokenType = TokenType;
	exports.defaultOptions = defaultOptions;
	exports.getLineInfo = getLineInfo;
	exports.isIdentifierChar = isIdentifierChar;
	exports.isIdentifierStart = isIdentifierStart;
	exports.isNewLine = isNewLine;
	exports.keywordTypes = keywords;
	exports.lineBreak = lineBreak;
	exports.lineBreakG = lineBreakG;
	exports.nonASCIIwhitespace = nonASCIIwhitespace;
	exports.parse = parse;
	exports.parseExpressionAt = parseExpressionAt;
	exports.tokContexts = types;
	exports.tokTypes = types$1;
	exports.tokenizer = tokenizer;
	exports.version = version;
  
	Object.defineProperty(exports, '__esModule', { value: true });
  
  }));  

// </Library>
// <Library>

//
// Sval v0.4.8
//
// A JavaScript interpreter writen in JavaScript, based on parser Acorn.
//
// https://github.com/Siubaak/sval
//
// MIT License
// Copyright (c) 2018 Siubaak
//

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('acorn')) :
	typeof define === 'function' && define.amd ? define(['acorn'], factory) :
	(global = global || self, global.Sval = factory(global.acorn));
  }(this, (function (acorn) { 'use strict';
  
	var declaration = /*#__PURE__*/Object.freeze({
	  __proto__: null,
	  get FunctionDeclaration () { return FunctionDeclaration; },
	  get VariableDeclaration () { return VariableDeclaration; },
	  get VariableDeclarator () { return VariableDeclarator; },
	  get ClassDeclaration () { return ClassDeclaration; },
	  get ClassBody () { return ClassBody; },
	  get MethodDefinition () { return MethodDefinition; }
	});
	var declaration$1 = /*#__PURE__*/Object.freeze({
	  __proto__: null,
	  get FunctionDeclaration () { return FunctionDeclaration$1; },
	  get VariableDeclaration () { return VariableDeclaration$1; },
	  get VariableDeclarator () { return VariableDeclarator$1; },
	  get ClassDeclaration () { return ClassDeclaration$1; },
	  get ClassBody () { return ClassBody$1; },
	  get MethodDefinition () { return MethodDefinition$1; }
	});
  
	var freeze = Object.freeze;
	var define = Object.defineProperty;
	var getDptor = Object.getOwnPropertyDescriptor;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	function hasOwn(obj, key) {
		return hasOwnProperty.call(obj, key);
	}
	var getOwnNames = Object.getOwnPropertyNames;
	var setPrototypeOf = Object.setPrototypeOf;
	function setProto(obj, proto) {
		setPrototypeOf ? setPrototypeOf(obj, proto) : obj.__proto__ = proto;
	}
	var getPrototypeOf = Object.getPrototypeOf;
	function getProto(obj) {
		return getPrototypeOf ? getPrototypeOf(obj) : obj.__proto__;
	}
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	function getGetterOrSetter(method, obj, key) {
		while (obj) {
			var descriptor = getOwnPropertyDescriptor(obj, key);
			var value = typeof descriptor !== 'undefined'
				&& typeof descriptor.writable === 'undefined'
				&& typeof descriptor[method] === 'function'
				&& descriptor[method];
			if (value) {
				return value;
			}
			else {
				obj = getProto(obj);
			}
		}
	}
	function getGetter(obj, key) {
		return getGetterOrSetter('get', obj, key);
	}
	function getSetter(obj, key) {
		return getGetterOrSetter('set', obj, key);
	}
	var create = Object.create;
	function inherits(subClass, superClass) {
		setProto(subClass, superClass);
		subClass.prototype = create(superClass.prototype, {
			constructor: {
				value: subClass,
				writable: true,
			}
		});
	}
	function _assign(target) {
		for (var i = 1; i < arguments.length; ++i) {
			var source = arguments[i];
			for (var key in source) {
				if (hasOwn(source, key)) {
					target[key] = source[key];
				}
			}
		}
		return target;
	}
	var assign = Object.assign || _assign;
	var names = [];
	var globalObj = create(null);
	try {
		if (!window.Object)
			throw 0;
		names = getOwnNames(globalObj = window).filter(function (n) { return n !== 'webkitStorageInfo'; });
	}
	catch (err) {
		try {
			if (!global.Object)
				throw 0;
			names = getOwnNames(globalObj = global).filter(function (n) { return n !== 'GLOBAL' && n !== 'root'; });
		}
		catch (err) {
			try {
				globalObj.Object = Object;
			}
			catch (err) { }
			try {
				globalObj.Function = Function;
			}
			catch (err) { }
			try {
				globalObj.Array = Array;
			}
			catch (err) { }
			try {
				globalObj.Number = Number;
			}
			catch (err) { }
			try {
				globalObj.parseFloat = parseFloat;
			}
			catch (err) { }
			try {
				globalObj.parseInt = parseInt;
			}
			catch (err) { }
			try {
				globalObj.Infinity = Infinity;
			}
			catch (err) { }
			try {
				globalObj.NaN = NaN;
			}
			catch (err) { }
			try {
				globalObj.undefined = undefined;
			}
			catch (err) { }
			try {
				globalObj.Boolean = Boolean;
			}
			catch (err) { }
			try {
				globalObj.String = String;
			}
			catch (err) { }
			try {
				globalObj.Symbol = Symbol;
			}
			catch (err) { }
			try {
				globalObj.Date = Date;
			}
			catch (err) { }
			try {
				globalObj.Promise = Promise;
			}
			catch (err) { }
			try {
				globalObj.RegExp = RegExp;
			}
			catch (err) { }
			try {
				globalObj.Error = Error;
			}
			catch (err) { }
			try {
				globalObj.EvalError = EvalError;
			}
			catch (err) { }
			try {
				globalObj.RangeError = RangeError;
			}
			catch (err) { }
			try {
				globalObj.ReferenceError = ReferenceError;
			}
			catch (err) { }
			try {
				globalObj.SyntaxError = SyntaxError;
			}
			catch (err) { }
			try {
				globalObj.TypeError = TypeError;
			}
			catch (err) { }
			try {
				globalObj.URIError = URIError;
			}
			catch (err) { }
			try {
				globalObj.JSON = JSON;
			}
			catch (err) { }
			try {
				globalObj.Math = Math;
			}
			catch (err) { }
			try {
				globalObj.console = console;
			}
			catch (err) { }
			try {
				globalObj.Intl = Intl;
			}
			catch (err) { }
			try {
				globalObj.ArrayBuffer = ArrayBuffer;
			}
			catch (err) { }
			try {
				globalObj.Uint8Array = Uint8Array;
			}
			catch (err) { }
			try {
				globalObj.Int8Array = Int8Array;
			}
			catch (err) { }
			try {
				globalObj.Uint16Array = Uint16Array;
			}
			catch (err) { }
			try {
				globalObj.Int16Array = Int16Array;
			}
			catch (err) { }
			try {
				globalObj.Uint32Array = Uint32Array;
			}
			catch (err) { }
			try {
				globalObj.Int32Array = Int32Array;
			}
			catch (err) { }
			try {
				globalObj.Float32Array = Float32Array;
			}
			catch (err) { }
			try {
				globalObj.Float64Array = Float64Array;
			}
			catch (err) { }
			try {
				globalObj.Uint8ClampedArray = Uint8ClampedArray;
			}
			catch (err) { }
			try {
				globalObj.DataView = DataView;
			}
			catch (err) { }
			try {
				globalObj.Map = Map;
			}
			catch (err) { }
			try {
				globalObj.Set = Set;
			}
			catch (err) { }
			try {
				globalObj.WeakMap = WeakMap;
			}
			catch (err) { }
			try {
				globalObj.WeakSet = WeakSet;
			}
			catch (err) { }
			try {
				globalObj.Proxy = Proxy;
			}
			catch (err) { }
			try {
				globalObj.Reflect = Reflect;
			}
			catch (err) { }
			try {
				globalObj.decodeURI = decodeURI;
			}
			catch (err) { }
			try {
				globalObj.decodeURIComponent = decodeURIComponent;
			}
			catch (err) { }
			try {
				globalObj.encodeURI = encodeURI;
			}
			catch (err) { }
			try {
				globalObj.encodeURIComponent = encodeURIComponent;
			}
			catch (err) { }
			try {
				globalObj.escape = escape;
			}
			catch (err) { }
			try {
				globalObj.unescape = unescape;
			}
			catch (err) { }
			try {
				globalObj.eval = eval;
			}
			catch (err) { }
			try {
				globalObj.isFinite = isFinite;
			}
			catch (err) { }
			try {
				globalObj.isNaN = isNaN;
			}
			catch (err) { }
			try {
				globalObj.SharedArrayBuffer = SharedArrayBuffer;
			}
			catch (err) { }
			try {
				globalObj.Atomics = Atomics;
			}
			catch (err) { }
			try {
				globalObj.WebAssembly = WebAssembly;
			}
			catch (err) { }
			try {
				globalObj.clearInterval = clearInterval;
			}
			catch (err) { }
			try {
				globalObj.clearTimeout = clearTimeout;
			}
			catch (err) { }
			try {
				globalObj.setInterval = setInterval;
			}
			catch (err) { }
			try {
				globalObj.setTimeout = setTimeout;
			}
			catch (err) { }
			try {
				globalObj.crypto = crypto;
			}
			catch (err) { }
			names = getOwnNames(globalObj);
		}
	}
	if (globalObj.Symbol) {
		!globalObj.Symbol.iterator && (globalObj.Symbol.iterator = createSymbol('iterator'));
		!globalObj.Symbol.asyncIterator && (globalObj.Symbol.asyncIterator = createSymbol('asynciterator'));
	}
	var win = create({});
	for (var i = 0; i < names.length; i++) {
		var name_1 = names[i];
		try {
			win[name_1] = globalObj[name_1];
		}
		catch (err) { }
	}
	var WINDOW = createSymbol('window');
	function createSandBox() {
		var _a;
		return assign(create((_a = {}, _a[WINDOW] = globalObj, _a)), win);
	}
	function createSymbol(key) {
		return key + Math.random().toString(36).substring(2);
	}
	function getAsyncIterator(obj) {
		var iterator;
		if (typeof Symbol === 'function') {
			iterator = obj[Symbol.asyncIterator];
			!iterator && (iterator = obj[Symbol.iterator]);
		}
		if (iterator) {
			return iterator.call(obj);
		}
		else if (typeof obj.next === 'function') {
			return obj;
		}
		else {
			var i_1 = 0;
			return {
				next: function () {
					if (obj && i_1 >= obj.length)
						obj = undefined;
					return { value: obj && obj[i_1++], done: !obj };
				}
			};
		}
	}
  
	var version = "0.4.8";
  
	var AWAIT = { RES: undefined };
	var RETURN = { RES: undefined };
	var CONTINUE = createSymbol('continue');
	var BREAK = createSymbol('break');
	var SUPER = createSymbol('super');
	var SUPERCALL = createSymbol('supercall');
	var NOCTOR = createSymbol('noctor');
	var CLSCTOR = createSymbol('clsctor');
	var NEWTARGET = createSymbol('newtarget');
	var NOINIT = createSymbol('noinit');
	var DEADZONE = createSymbol('deadzone');
  
	var Var = (function () {
		function Var(kind, value) {
			this.kind = kind;
			this.value = value;
		}
		Var.prototype.get = function () {
			return this.value;
		};
		Var.prototype.set = function (value) {
			if (this.kind === 'const') {
				throw new TypeError('Assignment to constant variable');
			}
			else {
				return this.value = value;
			}
		};
		return Var;
	}());
	var Prop = (function () {
		function Prop(object, property) {
			this.object = object;
			this.property = property;
		}
		Prop.prototype.get = function () {
			return this.object[this.property];
		};
		Prop.prototype.set = function (value) {
			this.object[this.property] = value;
			return true;
		};
		Prop.prototype.del = function () {
			return delete this.object[this.property];
		};
		return Prop;
	}());
  
	var Scope = (function () {
		function Scope(parent, isolated) {
			if (parent === void 0) { parent = null; }
			if (isolated === void 0) { isolated = false; }
			this.context = create(null);
			this.parent = parent;
			this.isolated = isolated;
		}
		Scope.prototype.global = function () {
			var scope = this;
			while (scope.parent) {
				scope = scope.parent;
			}
			return scope;
		};
		Scope.prototype.clone = function () {
			var cloneScope = new Scope(this.parent, this.isolated);
			for (var name_1 in this.context) {
				var variable = this.context[name_1];
				cloneScope[variable.kind](name_1, variable.get());
			}
			return cloneScope;
		};
		Scope.prototype.find = function (name) {
			if (this.context[name]) {
				return this.context[name];
			}
			else if (this.parent) {
				return this.parent.find(name);
			}
			else {
				var win = this.global().find('window').get();
				if (name in win) {
					return new Prop(win, name);
				}
				else {
					return null;
				}
			}
		};
		Scope.prototype.var = function (name, value) {
			var scope = this;
			while (scope.parent && !scope.isolated) {
				scope = scope.parent;
			}
			var variable = scope.context[name];
			if (!variable) {
				scope.context[name] = new Var('var', value === NOINIT ? undefined : value);
			}
			else {
				if (variable.kind === 'var') {
					if (value !== NOINIT) {
						variable.set(value);
					}
				}
				else {
					throw new SyntaxError("Identifier '" + name + "' has already been declared");
				}
			}
			if (!scope.parent) {
				var win = scope.find('window').get();
				if (value !== NOINIT) {
					define(win, name, { value: value, writable: true, enumerable: true });
				}
			}
		};
		Scope.prototype.let = function (name, value) {
			var variable = this.context[name];
			if (!variable || variable.get() === DEADZONE) {
				this.context[name] = new Var('let', value);
			}
			else {
				throw new SyntaxError("Identifier '" + name + "' has already been declared");
			}
		};
		Scope.prototype.const = function (name, value) {
			var variable = this.context[name];
			if (!variable || variable.get() === DEADZONE) {
				this.context[name] = new Var('const', value);
			}
			else {
				throw new SyntaxError("Identifier '" + name + "' has already been declared");
			}
		};
		Scope.prototype.func = function (name, value) {
			var variable = this.context[name];
			if (!variable || variable.kind === 'var') {
				this.context[name] = new Var('var', value);
			}
			else {
				throw new SyntaxError("Identifier '" + name + "' has already been declared");
			}
		};
		return Scope;
	}());
  
	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0
  
	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.
  
	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */
  
	function __generator(thisArg, body) {
		var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
		return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
		function verb(n) { return function (v) { return step([n, v]); }; }
		function step(op) {
			if (f) throw new TypeError("Generator is already executing.");
			while (_) try {
				if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
				if (y = 0, t) op = [op[0] & 2, t.value];
				switch (op[0]) {
					case 0: case 1: t = op; break;
					case 4: _.label++; return { value: op[1], done: false };
					case 5: _.label++; y = op[1]; op = [0]; continue;
					case 7: op = _.ops.pop(); _.trys.pop(); continue;
					default:
						if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
						if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
						if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
						if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
						if (t[2]) _.ops.pop();
						_.trys.pop(); continue;
				}
				op = body.call(thisArg, _);
			} catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
			if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
		}
	}
  
	function __values(o) {
		var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
		if (m) return m.call(o);
		return {
			next: function () {
				if (o && i >= o.length) o = void 0;
				return { value: o && o[i++], done: !o };
			}
		};
	}
  
	function __read(o, n) {
		var m = typeof Symbol === "function" && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o), r, ar = [], e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
		}
		catch (error) { e = { error: error }; }
		finally {
			try {
				if (r && !r.done && (m = i["return"])) m.call(i);
			}
			finally { if (e) throw e.error; }
		}
		return ar;
	}
  
	function __spread() {
		for (var ar = [], i = 0; i < arguments.length; i++)
			ar = ar.concat(__read(arguments[i]));
		return ar;
	}
  
	function Identifier(node, scope, options) {
		if (options === void 0) { options = {}; }
		var _a = options.getVar, getVar = _a === void 0 ? false : _a, _b = options.throwErr, throwErr = _b === void 0 ? true : _b;
		if (node.name === 'undefined') {
			return undefined;
		}
		var variable = scope.find(node.name);
		if (variable) {
			if (getVar) {
				return variable;
			}
			else {
				var value = variable.get();
				if (value === DEADZONE) {
					throw new ReferenceError(node.name + " is not defined");
				}
				else {
					return value;
				}
			}
		}
		else if (throwErr) {
			throw new ReferenceError(node.name + " is not defined");
		}
		else {
			return undefined;
		}
	}
  
	var identifier = /*#__PURE__*/Object.freeze({
	  __proto__: null,
	  Identifier: Identifier
	});
  
	function Literal(node, scope) {
		return node.value;
	}
  
	var literal = /*#__PURE__*/Object.freeze({
	  __proto__: null,
	  Literal: Literal
	});
  
	function ThisExpression(node, scope) {
		var superCall = scope.find(SUPERCALL);
		if (superCall && !superCall.get()) {
			throw new ReferenceError('Must call super constructor in derived class '
				+ 'before accessing \'this\' or returning from derived constructor');
		}
		else {
			return scope.find('this').get();
		}
	}
	function ArrayExpression(node, scope) {
		var results = [];
		for (var i = 0; i < node.elements.length; i++) {
			var item = node.elements[i];
			if (item.type === 'SpreadElement') {
				results = results.concat(SpreadElement(item, scope));
			}
			else {
				results.push(evaluate(item, scope));
			}
		}
		return results;
	}
	function ObjectExpression(node, scope) {
		var object = {};
		for (var i = 0; i < node.properties.length; i++) {
			var property = node.properties[i];
			if (property.type === 'SpreadElement') {
				assign(object, SpreadElement(property, scope));
			}
			else {
				var key = void 0;
				var propKey = property.key;
				if (property.computed) {
					key = evaluate(propKey, scope);
				}
				else {
					if (propKey.type === 'Identifier') {
						key = propKey.name;
					}
					else {
						key = '' + (Literal(propKey));
					}
				}
				var value = evaluate(property.value, scope);
				var propKind = property.kind;
				if (propKind === 'init') {
					object[key] = value;
				}
				else if (propKind === 'get') {
					var oriDptor = getDptor(object, key);
					define(object, key, {
						get: value,
						set: oriDptor && oriDptor.set,
						enumerable: true,
						configurable: true
					});
				}
				else {
					var oriDptor = getDptor(object, key);
					define(object, key, {
						get: oriDptor && oriDptor.get,
						set: value,
						enumerable: true,
						configurable: true
					});
				}
			}
		}
		return object;
	}
	function FunctionExpression(node, scope) {
		if (node.id && node.id.name) {
			var tmpScope = new Scope(scope);
			var func = createFunc$1(node, tmpScope);
			tmpScope.const(node.id.name, func);
			return func;
		}
		else {
			return createFunc$1(node, scope);
		}
	}
	function UnaryExpression(node, scope) {
		var arg = node.argument;
		switch (node.operator) {
			case '+': return +(evaluate(arg, scope));
			case '-': return -(evaluate(arg, scope));
			case '!': return !(evaluate(arg, scope));
			case '~': return ~(evaluate(arg, scope));
			case 'void': return void (evaluate(arg, scope));
			case 'typeof':
				if (arg.type === 'Identifier') {
					return typeof (Identifier(arg, scope, { throwErr: false }));
				}
				else {
					return typeof (evaluate(arg, scope));
				}
			case 'delete':
				if (arg.type === 'MemberExpression') {
					var variable = MemberExpression(arg, scope, { getVar: true });
					return variable.del();
				}
				else if (arg.type === 'Identifier') {
					throw new SyntaxError('Delete of an unqualified identifier in strict mode');
				}
				else {
					evaluate(arg, scope);
					return true;
				}
			default: throw new SyntaxError("Unexpected token " + node.operator);
		}
	}
	function UpdateExpression(node, scope) {
		var arg = node.argument;
		var variable;
		if (arg.type === 'Identifier') {
			variable = Identifier(arg, scope, { getVar: true });
		}
		else if (arg.type === 'MemberExpression') {
			variable = MemberExpression(arg, scope, { getVar: true });
		}
		else {
			throw new SyntaxError('Unexpected token');
		}
		var value = variable.get();
		if (node.operator === '++') {
			variable.set(value + 1);
			return node.prefix ? variable.get() : value;
		}
		else if (node.operator === '--') {
			variable.set(value - 1);
			return node.prefix ? variable.get() : value;
		}
		else {
			throw new SyntaxError("Unexpected token " + node.operator);
		}
	}
	function BinaryExpression(node, scope) {
		var left = evaluate(node.left, scope);
		var right = evaluate(node.right, scope);
		switch (node.operator) {
			case '==': return left == right;
			case '!=': return left != right;
			case '===': return left === right;
			case '!==': return left !== right;
			case '<': return left < right;
			case '<=': return left <= right;
			case '>': return left > right;
			case '>=': return left >= right;
			case '<<': return left << right;
			case '>>': return left >> right;
			case '>>>': return left >>> right;
			case '+': return left + right;
			case '-': return left - right;
			case '*': return left * right;
			case '**': return Math.pow(left, right);
			case '/': return left / right;
			case '%': return left % right;
			case '|': return left | right;
			case '^': return left ^ right;
			case '&': return left & right;
			case 'in': return left in right;
			case 'instanceof': return left instanceof right;
			default: throw new SyntaxError("Unexpected token " + node.operator);
		}
	}
	function AssignmentExpression(node, scope) {
		var value = evaluate(node.right, scope);
		var left = node.left;
		var variable;
		if (left.type === 'Identifier') {
			variable = Identifier(left, scope, { getVar: true, throwErr: false });
			if (!variable) {
				var win = scope.global().find('window').get();
				variable = new Prop(win, left.name);
			}
		}
		else if (left.type === 'MemberExpression') {
			variable = MemberExpression(left, scope, { getVar: true });
		}
		else {
			return pattern$3(left, scope, { feed: value });
		}
		switch (node.operator) {
			case '=':
				variable.set(value);
				return variable.get();
			case '+=':
				variable.set(variable.get() + value);
				return variable.get();
			case '-=':
				variable.set(variable.get() - value);
				return variable.get();
			case '*=':
				variable.set(variable.get() * value);
				return variable.get();
			case '/=':
				variable.set(variable.get() / value);
				return variable.get();
			case '%=':
				variable.set(variable.get() % value);
				return variable.get();
			case '**=':
				variable.set(Math.pow(variable.get(), value));
				return variable.get();
			case '<<=':
				variable.set(variable.get() << value);
				return variable.get();
			case '>>=':
				variable.set(variable.get() >> value);
				return variable.get();
			case '>>>=':
				variable.set(variable.get() >>> value);
				return variable.get();
			case '|=':
				variable.set(variable.get() | value);
				return variable.get();
			case '^=':
				variable.set(variable.get() ^ value);
				return variable.get();
			case '&=':
				variable.set(variable.get() & value);
				return variable.get();
			default: throw new SyntaxError("Unexpected token " + node.operator);
		}
	}
	function LogicalExpression(node, scope) {
		switch (node.operator) {
			case '||':
				return (evaluate(node.left, scope)) || (evaluate(node.right, scope));
			case '&&':
				return (evaluate(node.left, scope)) && (evaluate(node.right, scope));
			default:
				throw new SyntaxError("Unexpected token " + node.operator);
		}
	}
	function MemberExpression(node, scope, options) {
		if (options === void 0) { options = {}; }
		var _a = options.getObj, getObj = _a === void 0 ? false : _a, _b = options.getVar, getVar = _b === void 0 ? false : _b;
		var object;
		if (node.object.type === 'Super') {
			object = Super(node.object, scope, { getProto: true });
		}
		else {
			object = evaluate(node.object, scope);
		}
		if (getObj)
			return object;
		var key;
		if (node.computed) {
			key = evaluate(node.property, scope);
		}
		else {
			key = node.property.name;
		}
		if (getVar) {
			var setter = getSetter(object, key);
			if (node.object.type === 'Super' && setter) {
				var thisObject = scope.find('this').get();
				var privateKey = createSymbol(key);
				define(thisObject, privateKey, { set: setter });
				return new Prop(thisObject, privateKey);
			}
			else {
				return new Prop(object, key);
			}
		}
		else {
			var getter = getGetter(object, key);
			if (node.object.type === 'Super' && getter) {
				var thisObject = scope.find('this').get();
				return getter.call(thisObject);
			}
			else {
				return object[key];
			}
		}
	}
	function ConditionalExpression(node, scope) {
		return (evaluate(node.test, scope))
			? (evaluate(node.consequent, scope))
			: (evaluate(node.alternate, scope));
	}
	function CallExpression(node, scope) {
		var func;
		var object;
		if (node.callee.type === 'MemberExpression') {
			object = MemberExpression(node.callee, scope, { getObj: true });
			var key = void 0;
			if (node.callee.computed) {
				key = evaluate(node.callee.property, scope);
			}
			else {
				key = node.callee.property.name;
			}
			if (node.callee.object.type === 'Super') {
				var thisObject = scope.find('this').get();
				func = object[key].bind(thisObject);
			}
			else {
				func = object[key];
			}
			if (typeof func !== 'function') {
				throw new TypeError(key + " is not a function");
			}
			else if (func[CLSCTOR]) {
				throw new TypeError("Class constructor " + key + " cannot be invoked without 'new'");
			}
		}
		else {
			object = scope.find('this').get();
			func = evaluate(node.callee, scope);
			if (typeof func !== 'function' || node.callee.type !== 'Super' && func[CLSCTOR]) {
				var name_1;
				if (node.callee.type === 'Identifier') {
					name_1 = node.callee.name;
				}
				else {
					try {
						name_1 = JSON.stringify(func);
					}
					catch (err) {
						name_1 = '' + func;
					}
				}
				if (typeof func !== 'function') {
					throw new TypeError(name_1 + " is not a function");
				}
				else {
					throw new TypeError("Class constructor " + name_1 + " cannot be invoked without 'new'");
				}
			}
		}
		var args = [];
		for (var i = 0; i < node.arguments.length; i++) {
			var arg = node.arguments[i];
			if (arg.type === 'SpreadElement') {
				args = args.concat(SpreadElement(arg, scope));
			}
			else {
				args.push(evaluate(arg, scope));
			}
		}
		if (node.callee.type === 'Super') {
			var superCall = scope.find(SUPERCALL);
			if (superCall.get()) {
				throw new ReferenceError('Super constructor may only be called once');
			}
			else {
				scope.find(SUPERCALL).set(true);
			}
		}
		if (object && object[WINDOW] && func.toString().indexOf('[native code]') !== -1) {
			return func.apply(object[WINDOW], args);
		}
		return func.apply(object, args);
	}
	function NewExpression(node, scope) {
		var constructor = evaluate(node.callee, scope);
		if (typeof constructor !== 'function') {
			var name_2;
			if (node.callee.type === 'Identifier') {
				name_2 = node.callee.name;
			}
			else {
				try {
					name_2 = JSON.stringify(constructor);
				}
				catch (err) {
					name_2 = '' + constructor;
				}
			}
			throw new TypeError(name_2 + " is not a constructor");
		}
		else if (constructor[NOCTOR]) {
			throw new TypeError((constructor.name || '(intermediate value)') + " is not a constructor");
		}
		var args = [];
		for (var i = 0; i < node.arguments.length; i++) {
			var arg = node.arguments[i];
			if (arg.type === 'SpreadElement') {
				args = args.concat(SpreadElement(arg, scope));
			}
			else {
				args.push(evaluate(arg, scope));
			}
		}
		return new (constructor.bind.apply(constructor, __spread([void 0], args)))();
	}
	function MetaProperty(node, scope) {
		return scope.find(NEWTARGET).get();
	}
	function SequenceExpression(node, scope) {
		var result;
		for (var i = 0; i < node.expressions.length; i++) {
			result = evaluate(node.expressions[i], scope);
		}
		return result;
	}
	function ArrowFunctionExpression(node, scope) {
		return createFunc$1(node, scope);
	}
	function TemplateLiteral(node, scope) {
		var quasis = node.quasis.slice();
		var expressions = node.expressions.slice();
		var result = '';
		var temEl;
		var expr;
		while (temEl = quasis.shift()) {
			result += TemplateElement(temEl);
			expr = expressions.shift();
			if (expr) {
				result += evaluate(expr, scope);
			}
		}
		return result;
	}
	function TaggedTemplateExpression(node, scope) {
		var tagFunc = evaluate(node.tag, scope);
		var quasis = node.quasi.quasis;
		var str = quasis.map(function (v) { return v.value.cooked; });
		var raw = quasis.map(function (v) { return v.value.raw; });
		define(str, 'raw', {
			value: freeze(raw)
		});
		var expressions = node.quasi.expressions;
		var args = [];
		if (expressions) {
			for (var i = 0; i < expressions.length; i++) {
				args.push(evaluate(expressions[i], scope));
			}
		}
		return tagFunc.apply(void 0, __spread([freeze(str)], args));
	}
	function TemplateElement(node, scope) {
		return node.value.raw;
	}
	function ClassExpression(node, scope) {
		if (node.id && node.id.name) {
			var tmpScope = new Scope(scope);
			var klass = createClass$1(node, tmpScope);
			tmpScope.const(node.id.name, klass);
			return klass;
		}
		else {
			return createClass$1(node, scope);
		}
	}
	function Super(node, scope, options) {
		if (options === void 0) { options = {}; }
		var _a = options.getProto, getProto = _a === void 0 ? false : _a;
		var superClass = scope.find(SUPER).get();
		return getProto ? superClass.prototype : superClass;
	}
	function SpreadElement(node, scope) {
		return evaluate(node.argument, scope);
	}
  
	var expression = /*#__PURE__*/Object.freeze({
	  __proto__: null,
	  ThisExpression: ThisExpression,
	  ArrayExpression: ArrayExpression,
	  ObjectExpression: ObjectExpression,
	  FunctionExpression: FunctionExpression,
	  UnaryExpression: UnaryExpression,
	  UpdateExpression: UpdateExpression,
	  BinaryExpression: BinaryExpression,
	  AssignmentExpression: AssignmentExpression,
	  LogicalExpression: LogicalExpression,
	  MemberExpression: MemberExpression,
	  ConditionalExpression: ConditionalExpression,
	  CallExpression: CallExpression,
	  NewExpression: NewExpression,
	  MetaProperty: MetaProperty,
	  SequenceExpression: SequenceExpression,
	  ArrowFunctionExpression: ArrowFunctionExpression,
	  TemplateLiteral: TemplateLiteral,
	  TaggedTemplateExpression: TaggedTemplateExpression,
	  TemplateElement: TemplateElement,
	  ClassExpression: ClassExpression,
	  Super: Super,
	  SpreadElement: SpreadElement
	});
  
	function ExpressionStatement(node, scope) {
		evaluate(node.expression, scope);
	}
	function BlockStatement(block, scope, options) {
		if (options === void 0) { options = {}; }
		var _a = options.invasived, invasived = _a === void 0 ? false : _a, _b = options.hoisted, hoisted = _b === void 0 ? false : _b;
		var subScope = invasived ? scope : new Scope(scope);
		if (!hoisted) {
			hoist$1(block, subScope, { onlyBlock: true });
		}
		for (var i = 0; i < block.body.length; i++) {
			var result = evaluate(block.body[i], subScope);
			if (result === BREAK || result === CONTINUE || result === RETURN) {
				return result;
			}
		}
	}
	function EmptyStatement() {
	}
	function DebuggerStatement() {
		debugger;
	}
	function ReturnStatement(node, scope) {
		RETURN.RES = node.argument ? (evaluate(node.argument, scope)) : undefined;
		return RETURN;
	}
	function BreakStatement() {
		return BREAK;
	}
	function ContinueStatement() {
		return CONTINUE;
	}
	function IfStatement(node, scope) {
		if (evaluate(node.test, scope)) {
			return evaluate(node.consequent, scope);
		}
		else {
			return evaluate(node.alternate, scope);
		}
	}
	function SwitchStatement(node, scope) {
		var discriminant = evaluate(node.discriminant, scope);
		var matched = false;
		for (var i = 0; i < node.cases.length; i++) {
			var eachCase = node.cases[i];
			if (!matched
				&& (!eachCase.test
					|| (evaluate(eachCase.test, scope)) === discriminant)) {
				matched = true;
			}
			if (matched) {
				var result = SwitchCase(eachCase, scope);
				if (result === BREAK) {
					break;
				}
				if (result === CONTINUE || result === RETURN) {
					return result;
				}
			}
		}
	}
	function SwitchCase(node, scope) {
		for (var i = 0; i < node.consequent.length; i++) {
			var result = evaluate(node.consequent[i], scope);
			if (result === BREAK || result === CONTINUE || result === RETURN) {
				return result;
			}
		}
	}
	function ThrowStatement(node, scope) {
		throw evaluate(node.argument, scope);
	}
	function TryStatement(node, scope) {
		try {
			return BlockStatement(node.block, scope);
		}
		catch (err) {
			if (node.handler) {
				var subScope = new Scope(scope);
				var param = node.handler.param;
				if (param) {
					if (param.type === 'Identifier') {
						var name_1 = param.name;
						subScope.var(name_1, err);
					}
					else {
						pattern$3(param, scope, { feed: err });
					}
				}
				return CatchClause(node.handler, subScope);
			}
			else {
				throw err;
			}
		}
		finally {
			if (node.finalizer) {
				var result = BlockStatement(node.finalizer, scope);
				if (result === BREAK || result === CONTINUE || result === RETURN) {
					return result;
				}
			}
		}
	}
	function CatchClause(node, scope) {
		return BlockStatement(node.body, scope, { invasived: true });
	}
	function WhileStatement(node, scope) {
		while (evaluate(node.test, scope)) {
			var result = evaluate(node.body, scope);
			if (result === BREAK) {
				break;
			}
			else if (result === CONTINUE) {
				continue;
			}
			else if (result === RETURN) {
				return result;
			}
		}
	}
	function DoWhileStatement(node, scope) {
		do {
			var result = evaluate(node.body, scope);
			if (result === BREAK) {
				break;
			}
			else if (result === CONTINUE) {
				continue;
			}
			else if (result === RETURN) {
				return result;
			}
		} while (evaluate(node.test, scope));
	}
	function ForStatement(node, scope) {
		var forScope = new Scope(scope);
		for (evaluate(node.init, forScope); node.test ? (evaluate(node.test, forScope)) : true; evaluate(node.update, forScope)) {
			var subScope = new Scope(forScope);
			var result = void 0;
			if (node.body.type === 'BlockStatement') {
				result = BlockStatement(node.body, subScope, { invasived: true });
			}
			else {
				result = evaluate(node.body, subScope);
			}
			if (result === BREAK) {
				break;
			}
			else if (result === CONTINUE) {
				continue;
			}
			else if (result === RETURN) {
				return result;
			}
		}
	}
	function ForInStatement(node, scope) {
		for (var value in evaluate(node.right, scope)) {
			var result = ForXHandler$1(node, scope, { value: value });
			if (result === BREAK) {
				break;
			}
			else if (result === CONTINUE) {
				continue;
			}
			else if (result === RETURN) {
				return result;
			}
		}
	}
	function ForOfStatement(node, scope) {
		var e_1, _a;
		var right = evaluate(node.right, scope);
		try {
			for (var right_1 = __values(right), right_1_1 = right_1.next(); !right_1_1.done; right_1_1 = right_1.next()) {
				var value = right_1_1.value;
				var result = ForXHandler$1(node, scope, { value: value });
				if (result === BREAK) {
					break;
				}
				else if (result === CONTINUE) {
					continue;
				}
				else if (result === RETURN) {
					return result;
				}
			}
		}
		catch (e_1_1) { e_1 = { error: e_1_1 }; }
		finally {
			try {
				if (right_1_1 && !right_1_1.done && (_a = right_1.return)) _a.call(right_1);
			}
			finally { if (e_1) throw e_1.error; }
		}
	}
  
	var statement = /*#__PURE__*/Object.freeze({
	  __proto__: null,
	  ExpressionStatement: ExpressionStatement,
	  BlockStatement: BlockStatement,
	  EmptyStatement: EmptyStatement,
	  DebuggerStatement: DebuggerStatement,
	  ReturnStatement: ReturnStatement,
	  BreakStatement: BreakStatement,
	  ContinueStatement: ContinueStatement,
	  IfStatement: IfStatement,
	  SwitchStatement: SwitchStatement,
	  SwitchCase: SwitchCase,
	  ThrowStatement: ThrowStatement,
	  TryStatement: TryStatement,
	  CatchClause: CatchClause,
	  WhileStatement: WhileStatement,
	  DoWhileStatement: DoWhileStatement,
	  ForStatement: ForStatement,
	  ForInStatement: ForInStatement,
	  ForOfStatement: ForOfStatement
	});
  
	function ObjectPattern(node, scope, options) {
		if (options === void 0) { options = {}; }
		var _a = options.kind, kind = _a === void 0 ? 'var' : _a, _b = options.hoist, hoist = _b === void 0 ? false : _b, _c = options.onlyBlock, onlyBlock = _c === void 0 ? false : _c, _d = options.feed, feed = _d === void 0 ? {} : _d;
		var fedKeys = [];
		for (var i = 0; i < node.properties.length; i++) {
			var property = node.properties[i];
			if (hoist) {
				if (onlyBlock || kind === 'var') {
					if (property.type === 'Property') {
						var value = property.value;
						if (value.type === 'Identifier') {
							scope[kind](value.name, onlyBlock ? DEADZONE : kind === 'var' ? NOINIT : undefined);
						}
						else {
							pattern$3(value, scope, { kind: kind, hoist: hoist, onlyBlock: onlyBlock });
						}
					}
					else {
						RestElement(property, scope, { kind: kind, hoist: hoist, onlyBlock: onlyBlock });
					}
				}
			}
			else if (property.type === 'Property') {
				var key = void 0;
				if (property.computed) {
					key = evaluate(property.key, scope);
				}
				else {
					key = property.key.name;
				}
				fedKeys.push(key);
				var value = property.value;
				if (value.type === 'Identifier') {
					scope[kind](value.name, feed[key]);
				}
				else {
					pattern$3(value, scope, { kind: kind, feed: feed[key] });
				}
			}
			else {
				var rest = assign({}, feed);
				for (var i_1 = 0; i_1 < fedKeys.length; i_1++)
					delete rest[fedKeys[i_1]];
				RestElement(property, scope, { kind: kind, feed: rest });
			}
		}
	}
	function ArrayPattern(node, scope, options) {
		if (options === void 0) { options = {}; }
		var kind = options.kind, _a = options.hoist, hoist = _a === void 0 ? false : _a, _b = options.onlyBlock, onlyBlock = _b === void 0 ? false : _b, _c = options.feed, feed = _c === void 0 ? [] : _c;
		var result = [];
		for (var i = 0; i < node.elements.length; i++) {
			var element = node.elements[i];
			if (!element)
				continue;
			if (hoist) {
				if (onlyBlock || kind === 'var') {
					if (element.type === 'Identifier') {
						scope[kind](element.name, onlyBlock ? DEADZONE : kind === 'var' ? NOINIT : undefined);
					}
					else {
						pattern$3(element, scope, { kind: kind, hoist: hoist, onlyBlock: onlyBlock });
					}
				}
			}
			else if (element.type === 'Identifier') {
				if (kind) {
					scope[kind](element.name, feed[i]);
				}
				else {
					var variable = Identifier(element, scope, { getVar: true });
					variable.set(feed[i]);
					result.push(variable.get());
				}
			}
			else if (element.type === 'RestElement') {
				RestElement(element, scope, { kind: kind, feed: feed.slice(i) });
			}
			else {
				pattern$3(element, scope, { kind: kind, feed: feed[i] });
			}
		}
		if (result.length) {
			return result;
		}
	}
	function RestElement(node, scope, options) {
		if (options === void 0) { options = {}; }
		var kind = options.kind, _a = options.hoist, hoist = _a === void 0 ? false : _a, _b = options.onlyBlock, onlyBlock = _b === void 0 ? false : _b, _c = options.feed, feed = _c === void 0 ? [] : _c;
		var arg = node.argument;
		if (hoist) {
			if (onlyBlock || kind === 'var') {
				if (arg.type === 'Identifier') {
					scope[kind](arg.name, onlyBlock ? DEADZONE : kind === 'var' ? NOINIT : undefined);
				}
				else {
					pattern$3(arg, scope, { kind: kind, hoist: hoist, onlyBlock: onlyBlock });
				}
			}
		}
		else if (arg.type === 'Identifier') {
			if (kind) {
				scope[kind](arg.name, feed);
			}
			else {
				var variable = Identifier(arg, scope, { getVar: true });
				variable.set(feed);
			}
		}
		else {
			pattern$3(arg, scope, { kind: kind, feed: feed });
		}
	}
	function AssignmentPattern(node, scope, options) {
		if (options === void 0) { options = {}; }
		var _a = options.kind, kind = _a === void 0 ? 'var' : _a, _b = options.hoist, hoist = _b === void 0 ? false : _b, _c = options.onlyBlock, onlyBlock = _c === void 0 ? false : _c, _d = options.feed, feed = _d === void 0 ? evaluate(node.right, scope) : _d;
		var left = node.left;
		if (hoist) {
			if (onlyBlock || kind === 'var') {
				if (left.type === 'Identifier') {
					scope[kind](left.name, onlyBlock ? DEADZONE : kind === 'var' ? NOINIT : undefined);
				}
				else {
					pattern$3(left, scope, { kind: kind, hoist: hoist, onlyBlock: onlyBlock });
				}
			}
		}
		else if (left.type === 'Identifier') {
			scope[kind](left.name, feed);
		}
		else {
			pattern$3(left, scope, { kind: kind, feed: feed });
		}
	}
  
	var pattern = /*#__PURE__*/Object.freeze({
	  __proto__: null,
	  ObjectPattern: ObjectPattern,
	  ArrayPattern: ArrayPattern,
	  RestElement: RestElement,
	  AssignmentPattern: AssignmentPattern
	});
  
	function Program(program, scope) {
		for (var i = 0; i < program.body.length; i++) {
			evaluate(program.body[i], scope);
		}
	}
  
	var program = /*#__PURE__*/Object.freeze({
	  __proto__: null,
	  Program: Program
	});
  
	var evaluateOps;
	function evaluate(node, scope) {
		if (!node)
			return;
		if (!evaluateOps) {
			evaluateOps = assign({}, declaration, expression, identifier, statement, literal, pattern, program);
		}
		var handler = evaluateOps[node.type];
		if (handler) {
			return handler(node, scope);
		}
		else {
			throw new Error(node.type + " isn't implemented");
		}
	}
  
	function FunctionDeclaration(node, scope) {
		scope.func(node.id.name, createFunc$1(node, scope));
	}
	function VariableDeclaration(node, scope, options) {
		if (options === void 0) { options = {}; }
		for (var i = 0; i < node.declarations.length; i++) {
			VariableDeclarator(node.declarations[i], scope, assign({ kind: node.kind }, options));
		}
	}
	function VariableDeclarator(node, scope, options) {
		if (options === void 0) { options = {}; }
		var _a = options.kind, kind = _a === void 0 ? 'var' : _a, _b = options.hoist, hoist = _b === void 0 ? false : _b, _c = options.onlyBlock, onlyBlock = _c === void 0 ? false : _c, feed = options.feed;
		if (hoist) {
			if (onlyBlock || kind === 'var') {
				if (node.id.type === 'Identifier') {
					scope[kind](node.id.name, onlyBlock ? DEADZONE : kind === 'var' ? NOINIT : undefined);
				}
				else {
					pattern$3(node.id, scope, { kind: kind, hoist: hoist, onlyBlock: onlyBlock });
				}
			}
		}
		else {
			var hasFeed = 'feed' in options;
			var value = hasFeed ? feed : evaluate(node.init, scope);
			if (node.id.type === 'Identifier') {
				var name_1 = node.id.name;
				if (kind === 'var' && !node.init && !hasFeed) {
					scope.var(name_1, NOINIT);
				}
				else {
					scope[kind](name_1, value);
				}
				if (node.init
					&& ['ClassExpression', 'FunctionExpression', 'ArrowFunctionExpression']
						.indexOf(node.init.type) !== -1
					&& !value.name) {
					define(value, 'name', {
						value: name_1,
						configurable: true
					});
				}
			}
			else {
				pattern$3(node.id, scope, { kind: kind, feed: value });
			}
		}
	}
	function ClassDeclaration(node, scope) {
		scope.func(node.id.name, createClass$1(node, scope));
	}
	function ClassBody(node, scope, options) {
		if (options === void 0) { options = {}; }
		var klass = options.klass, superClass = options.superClass;
		for (var i = 0; i < node.body.length; i++) {
			MethodDefinition(node.body[i], scope, { klass: klass, superClass: superClass });
		}
	}
	function MethodDefinition(node, scope, options) {
		if (options === void 0) { options = {}; }
		var klass = options.klass, superClass = options.superClass;
		var key;
		if (node.computed) {
			key = evaluate(node.key, scope);
		}
		else if (node.key.type === 'Identifier') {
			key = node.key.name;
		}
		else {
			throw new SyntaxError('Unexpected token');
		}
		var obj = node.static ? klass : klass.prototype;
		var value = createFunc$1(node.value, scope, { superClass: superClass });
		switch (node.kind) {
			case 'constructor':
				break;
			case 'method':
				define(obj, key, {
					value: value,
					writable: true,
					configurable: true,
				});
				break;
			case 'get': {
				var oriDptor = getDptor(obj, key);
				define(obj, key, {
					get: value,
					set: oriDptor && oriDptor.set,
					configurable: true,
				});
				break;
			}
			case 'set': {
				var oriDptor = getDptor(obj, key);
				define(obj, key, {
					get: oriDptor && oriDptor.get,
					set: value,
					configurable: true,
				});
				break;
			}
			default:
				throw new SyntaxError('Unexpected token');
		}
	}
  
	function Identifier$1(node, scope, options) {
		var _a, getVar, _b, throwErr, variable, value;
		if (options === void 0) { options = {}; }
		return __generator(this, function (_c) {
			_a = options.getVar, getVar = _a === void 0 ? false : _a, _b = options.throwErr, throwErr = _b === void 0 ? true : _b;
			if (node.name === 'undefined') {
				return [2, undefined];
			}
			variable = scope.find(node.name);
			if (variable) {
				if (getVar) {
					return [2, variable];
				}
				else {
					value = variable.get();
					if (value === DEADZONE) {
						throw new ReferenceError(node.name + " is not defined");
					}
					else {
						return [2, value];
					}
				}
			}
			else if (throwErr) {
				throw new ReferenceError(node.name + " is not defined");
			}
			else {
				return [2, undefined];
			}
		});
	}
  
	var identifier$1 = /*#__PURE__*/Object.freeze({
	  __proto__: null,
	  Identifier: Identifier$1
	});
  
	function Literal$1(node, scope) {
		return __generator(this, function (_a) {
			return [2, node.value];
		});
	}
  
	var literal$1 = /*#__PURE__*/Object.freeze({
	  __proto__: null,
	  Literal: Literal$1
	});
  
	function ThisExpression$1(node, scope) {
		var superCall;
		return __generator(this, function (_a) {
			superCall = scope.find(SUPERCALL);
			if (superCall && !superCall.get()) {
				throw new ReferenceError('Must call super constructor in derived class '
					+ 'before accessing \'this\' or returning from derived constructor');
			}
			else {
				return [2, scope.find('this').get()];
			}
		});
	}
	function ArrayExpression$1(node, scope) {
		var results, i, item, _a, _b, _c, _d;
		return __generator(this, function (_e) {
			switch (_e.label) {
				case 0:
					results = [];
					i = 0;
					_e.label = 1;
				case 1:
					if (!(i < node.elements.length)) return [3, 6];
					item = node.elements[i];
					if (!(item.type === 'SpreadElement')) return [3, 3];
					_b = (_a = results).concat;
					return [5, __values(SpreadElement$1(item, scope))];
				case 2:
					results = _b.apply(_a, [_e.sent()]);
					return [3, 5];
				case 3:
					_d = (_c = results).push;
					return [5, __values(evaluate$1(item, scope))];
				case 4:
					_d.apply(_c, [_e.sent()]);
					_e.label = 5;
				case 5:
					i++;
					return [3, 1];
				case 6: return [2, results];
			}
		});
	}
	function ObjectExpression$1(node, scope) {
		var object, i, property, _a, _b, key, propKey, _c, value, propKind, oriDptor, oriDptor;
		return __generator(this, function (_d) {
			switch (_d.label) {
				case 0:
					object = {};
					i = 0;
					_d.label = 1;
				case 1:
					if (!(i < node.properties.length)) return [3, 11];
					property = node.properties[i];
					if (!(property.type === 'SpreadElement')) return [3, 3];
					_a = assign;
					_b = [object];
					return [5, __values(SpreadElement$1(property, scope))];
				case 2:
					_a.apply(void 0, _b.concat([_d.sent()]));
					return [3, 10];
				case 3:
					key = void 0;
					propKey = property.key;
					if (!property.computed) return [3, 5];
					return [5, __values(evaluate$1(propKey, scope))];
				case 4:
					key = _d.sent();
					return [3, 8];
				case 5:
					if (!(propKey.type === 'Identifier')) return [3, 6];
					key = propKey.name;
					return [3, 8];
				case 6:
					_c = '';
					return [5, __values(Literal$1(propKey))];
				case 7:
					key = _c + (_d.sent());
					_d.label = 8;
				case 8: return [5, __values(evaluate$1(property.value, scope))];
				case 9:
					value = _d.sent();
					propKind = property.kind;
					if (propKind === 'init') {
						object[key] = value;
					}
					else if (propKind === 'get') {
						oriDptor = getDptor(object, key);
						define(object, key, {
							get: value,
							set: oriDptor && oriDptor.set,
							enumerable: true,
							configurable: true
						});
					}
					else {
						oriDptor = getDptor(object, key);
						define(object, key, {
							get: oriDptor && oriDptor.get,
							set: value,
							enumerable: true,
							configurable: true
						});
					}
					_d.label = 10;
				case 10:
					i++;
					return [3, 1];
				case 11: return [2, object];
			}
		});
	}
	function FunctionExpression$1(node, scope) {
		var tmpScope, func;
		return __generator(this, function (_a) {
			if (node.id && node.id.name) {
				tmpScope = new Scope(scope);
				func = createFunc(node, tmpScope);
				tmpScope.const(node.id.name, func);
				return [2, func];
			}
			else {
				return [2, createFunc(node, scope)];
			}
		});
	}
	function UnaryExpression$1(node, scope) {
		var arg, _a, variable;
		return __generator(this, function (_b) {
			switch (_b.label) {
				case 0:
					arg = node.argument;
					_a = node.operator;
					switch (_a) {
						case '+': return [3, 1];
						case '-': return [3, 3];
						case '!': return [3, 5];
						case '~': return [3, 7];
						case 'void': return [3, 9];
						case 'typeof': return [3, 11];
						case 'delete': return [3, 15];
					}
					return [3, 20];
				case 1: return [5, __values(evaluate$1(arg, scope))];
				case 2: return [2, +(_b.sent())];
				case 3: return [5, __values(evaluate$1(arg, scope))];
				case 4: return [2, -(_b.sent())];
				case 5: return [5, __values(evaluate$1(arg, scope))];
				case 6: return [2, !(_b.sent())];
				case 7: return [5, __values(evaluate$1(arg, scope))];
				case 8: return [2, ~(_b.sent())];
				case 9: return [5, __values(evaluate$1(arg, scope))];
				case 10: return [2, void (_b.sent())];
				case 11:
					if (!(arg.type === 'Identifier')) return [3, 13];
					return [5, __values(Identifier$1(arg, scope, { throwErr: false }))];
				case 12: return [2, typeof (_b.sent())];
				case 13: return [5, __values(evaluate$1(arg, scope))];
				case 14: return [2, typeof (_b.sent())];
				case 15:
					if (!(arg.type === 'MemberExpression')) return [3, 17];
					return [5, __values(MemberExpression$1(arg, scope, { getVar: true }))];
				case 16:
					variable = _b.sent();
					return [2, variable.del()];
				case 17:
					if (!(arg.type === 'Identifier')) return [3, 18];
					throw new SyntaxError('Delete of an unqualified identifier in strict mode');
				case 18: return [5, __values(evaluate$1(arg, scope))];
				case 19:
					_b.sent();
					return [2, true];
				case 20: throw new SyntaxError("Unexpected token " + node.operator);
			}
		});
	}
	function UpdateExpression$1(node, scope) {
		var arg, variable, value;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					arg = node.argument;
					if (!(arg.type === 'Identifier')) return [3, 2];
					return [5, __values(Identifier$1(arg, scope, { getVar: true }))];
				case 1:
					variable = _a.sent();
					return [3, 5];
				case 2:
					if (!(arg.type === 'MemberExpression')) return [3, 4];
					return [5, __values(MemberExpression$1(arg, scope, { getVar: true }))];
				case 3:
					variable = _a.sent();
					return [3, 5];
				case 4: throw new SyntaxError('Unexpected token');
				case 5:
					value = variable.get();
					if (node.operator === '++') {
						variable.set(value + 1);
						return [2, node.prefix ? variable.get() : value];
					}
					else if (node.operator === '--') {
						variable.set(value - 1);
						return [2, node.prefix ? variable.get() : value];
					}
					else {
						throw new SyntaxError("Unexpected token " + node.operator);
					}
			}
		});
	}
	function BinaryExpression$1(node, scope) {
		var left, right;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0: return [5, __values(evaluate$1(node.left, scope))];
				case 1:
					left = _a.sent();
					return [5, __values(evaluate$1(node.right, scope))];
				case 2:
					right = _a.sent();
					switch (node.operator) {
						case '==': return [2, left == right];
						case '!=': return [2, left != right];
						case '===': return [2, left === right];
						case '!==': return [2, left !== right];
						case '<': return [2, left < right];
						case '<=': return [2, left <= right];
						case '>': return [2, left > right];
						case '>=': return [2, left >= right];
						case '<<': return [2, left << right];
						case '>>': return [2, left >> right];
						case '>>>': return [2, left >>> right];
						case '+': return [2, left + right];
						case '-': return [2, left - right];
						case '*': return [2, left * right];
						case '**': return [2, Math.pow(left, right)];
						case '/': return [2, left / right];
						case '%': return [2, left % right];
						case '|': return [2, left | right];
						case '^': return [2, left ^ right];
						case '&': return [2, left & right];
						case 'in': return [2, left in right];
						case 'instanceof': return [2, left instanceof right];
						default: throw new SyntaxError("Unexpected token " + node.operator);
					}
			}
		});
	}
	function AssignmentExpression$1(node, scope) {
		var value, left, variable, win;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0: return [5, __values(evaluate$1(node.right, scope))];
				case 1:
					value = _a.sent();
					left = node.left;
					if (!(left.type === 'Identifier')) return [3, 3];
					return [5, __values(Identifier$1(left, scope, { getVar: true, throwErr: false }))];
				case 2:
					variable = _a.sent();
					if (!variable) {
						win = scope.global().find('window').get();
						variable = new Prop(win, left.name);
					}
					return [3, 7];
				case 3:
					if (!(left.type === 'MemberExpression')) return [3, 5];
					return [5, __values(MemberExpression$1(left, scope, { getVar: true }))];
				case 4:
					variable = _a.sent();
					return [3, 7];
				case 5: return [5, __values(pattern$2(left, scope, { feed: value }))];
				case 6: return [2, _a.sent()];
				case 7:
					switch (node.operator) {
						case '=':
							variable.set(value);
							return [2, variable.get()];
						case '+=':
							variable.set(variable.get() + value);
							return [2, variable.get()];
						case '-=':
							variable.set(variable.get() - value);
							return [2, variable.get()];
						case '*=':
							variable.set(variable.get() * value);
							return [2, variable.get()];
						case '/=':
							variable.set(variable.get() / value);
							return [2, variable.get()];
						case '%=':
							variable.set(variable.get() % value);
							return [2, variable.get()];
						case '**=':
							variable.set(Math.pow(variable.get(), value));
							return [2, variable.get()];
						case '<<=':
							variable.set(variable.get() << value);
							return [2, variable.get()];
						case '>>=':
							variable.set(variable.get() >> value);
							return [2, variable.get()];
						case '>>>=':
							variable.set(variable.get() >>> value);
							return [2, variable.get()];
						case '|=':
							variable.set(variable.get() | value);
							return [2, variable.get()];
						case '^=':
							variable.set(variable.get() ^ value);
							return [2, variable.get()];
						case '&=':
							variable.set(variable.get() & value);
							return [2, variable.get()];
						default: throw new SyntaxError("Unexpected token " + node.operator);
					}
			}
		});
	}
	function LogicalExpression$1(node, scope) {
		var _a, _b, _c;
		return __generator(this, function (_d) {
			switch (_d.label) {
				case 0:
					_a = node.operator;
					switch (_a) {
						case '||': return [3, 1];
						case '&&': return [3, 5];
					}
					return [3, 9];
				case 1: return [5, __values(evaluate$1(node.left, scope))];
				case 2:
					_b = (_d.sent());
					if (_b) return [3, 4];
					return [5, __values(evaluate$1(node.right, scope))];
				case 3:
					_b = (_d.sent());
					_d.label = 4;
				case 4: return [2, _b];
				case 5: return [5, __values(evaluate$1(node.left, scope))];
				case 6:
					_c = (_d.sent());
					if (!_c) return [3, 8];
					return [5, __values(evaluate$1(node.right, scope))];
				case 7:
					_c = (_d.sent());
					_d.label = 8;
				case 8: return [2, _c];
				case 9: throw new SyntaxError("Unexpected token " + node.operator);
			}
		});
	}
	function MemberExpression$1(node, scope, options) {
		var _a, getObj, _b, getVar, object, key, setter, thisObject, privateKey, getter, thisObject;
		if (options === void 0) { options = {}; }
		return __generator(this, function (_c) {
			switch (_c.label) {
				case 0:
					_a = options.getObj, getObj = _a === void 0 ? false : _a, _b = options.getVar, getVar = _b === void 0 ? false : _b;
					if (!(node.object.type === 'Super')) return [3, 2];
					return [5, __values(Super$1(node.object, scope, { getProto: true }))];
				case 1:
					object = _c.sent();
					return [3, 4];
				case 2: return [5, __values(evaluate$1(node.object, scope))];
				case 3:
					object = _c.sent();
					_c.label = 4;
				case 4:
					if (getObj)
						return [2, object];
					if (!node.computed) return [3, 6];
					return [5, __values(evaluate$1(node.property, scope))];
				case 5:
					key = _c.sent();
					return [3, 7];
				case 6:
					key = node.property.name;
					_c.label = 7;
				case 7:
					if (getVar) {
						setter = getSetter(object, key);
						if (node.object.type === 'Super' && setter) {
							thisObject = scope.find('this').get();
							privateKey = createSymbol(key);
							define(thisObject, privateKey, { set: setter });
							return [2, new Prop(thisObject, privateKey)];
						}
						else {
							return [2, new Prop(object, key)];
						}
					}
					else {
						getter = getGetter(object, key);
						if (node.object.type === 'Super' && getter) {
							thisObject = scope.find('this').get();
							return [2, getter.call(thisObject)];
						}
						else {
							return [2, object[key]];
						}
					}
			}
		});
	}
	function ConditionalExpression$1(node, scope) {
		var _a;
		return __generator(this, function (_b) {
			switch (_b.label) {
				case 0: return [5, __values(evaluate$1(node.test, scope))];
				case 1:
					if (!(_b.sent())) return [3, 3];
					return [5, __values(evaluate$1(node.consequent, scope))];
				case 2:
					_a = (_b.sent());
					return [3, 5];
				case 3: return [5, __values(evaluate$1(node.alternate, scope))];
				case 4:
					_a = (_b.sent());
					_b.label = 5;
				case 5: return [2, _a];
			}
		});
	}
	function CallExpression$1(node, scope) {
		var func, object, key, thisObject, name_1, args, i, arg, _a, _b, _c, _d, superCall;
		return __generator(this, function (_e) {
			switch (_e.label) {
				case 0:
					if (!(node.callee.type === 'MemberExpression')) return [3, 5];
					return [5, __values(MemberExpression$1(node.callee, scope, { getObj: true }))];
				case 1:
					object = _e.sent();
					key = void 0;
					if (!node.callee.computed) return [3, 3];
					return [5, __values(evaluate$1(node.callee.property, scope))];
				case 2:
					key = _e.sent();
					return [3, 4];
				case 3:
					key = node.callee.property.name;
					_e.label = 4;
				case 4:
					if (node.callee.object.type === 'Super') {
						thisObject = scope.find('this').get();
						func = object[key].bind(thisObject);
					}
					else {
						func = object[key];
					}
					if (typeof func !== 'function') {
						throw new TypeError(key + " is not a function");
					}
					else if (func[CLSCTOR]) {
						throw new TypeError("Class constructor " + key + " cannot be invoked without 'new'");
					}
					return [3, 7];
				case 5:
					object = scope.find('this').get();
					return [5, __values(evaluate$1(node.callee, scope))];
				case 6:
					func = _e.sent();
					if (typeof func !== 'function' || node.callee.type !== 'Super' && func[CLSCTOR]) {
						if (node.callee.type === 'Identifier') {
							name_1 = node.callee.name;
						}
						else {
							try {
								name_1 = JSON.stringify(func);
							}
							catch (err) {
								name_1 = '' + func;
							}
						}
						if (typeof func !== 'function') {
							throw new TypeError(name_1 + " is not a function");
						}
						else {
							throw new TypeError("Class constructor " + name_1 + " cannot be invoked without 'new'");
						}
					}
					_e.label = 7;
				case 7:
					args = [];
					i = 0;
					_e.label = 8;
				case 8:
					if (!(i < node.arguments.length)) return [3, 13];
					arg = node.arguments[i];
					if (!(arg.type === 'SpreadElement')) return [3, 10];
					_b = (_a = args).concat;
					return [5, __values(SpreadElement$1(arg, scope))];
				case 9:
					args = _b.apply(_a, [_e.sent()]);
					return [3, 12];
				case 10:
					_d = (_c = args).push;
					return [5, __values(evaluate$1(arg, scope))];
				case 11:
					_d.apply(_c, [_e.sent()]);
					_e.label = 12;
				case 12:
					i++;
					return [3, 8];
				case 13:
					if (node.callee.type === 'Super') {
						superCall = scope.find(SUPERCALL);
						if (superCall.get()) {
							throw new ReferenceError('Super constructor may only be called once');
						}
						else {
							scope.find(SUPERCALL).set(true);
						}
					}
					if (object && object[WINDOW] && func.toString().indexOf('[native code]') !== -1) {
						return [2, func.apply(object[WINDOW], args)];
					}
					return [2, func.apply(object, args)];
			}
		});
	}
	function NewExpression$1(node, scope) {
		var constructor, name_2, args, i, arg, _a, _b, _c, _d;
		return __generator(this, function (_e) {
			switch (_e.label) {
				case 0: return [5, __values(evaluate$1(node.callee, scope))];
				case 1:
					constructor = _e.sent();
					if (typeof constructor !== 'function') {
						if (node.callee.type === 'Identifier') {
							name_2 = node.callee.name;
						}
						else {
							try {
								name_2 = JSON.stringify(constructor);
							}
							catch (err) {
								name_2 = '' + constructor;
							}
						}
						throw new TypeError(name_2 + " is not a constructor");
					}
					else if (constructor[NOCTOR]) {
						throw new TypeError((constructor.name || '(intermediate value)') + " is not a constructor");
					}
					args = [];
					i = 0;
					_e.label = 2;
				case 2:
					if (!(i < node.arguments.length)) return [3, 7];
					arg = node.arguments[i];
					if (!(arg.type === 'SpreadElement')) return [3, 4];
					_b = (_a = args).concat;
					return [5, __values(SpreadElement$1(arg, scope))];
				case 3:
					args = _b.apply(_a, [_e.sent()]);
					return [3, 6];
				case 4:
					_d = (_c = args).push;
					return [5, __values(evaluate$1(arg, scope))];
				case 5:
					_d.apply(_c, [_e.sent()]);
					_e.label = 6;
				case 6:
					i++;
					return [3, 2];
				case 7: return [2, new (constructor.bind.apply(constructor, __spread([void 0], args)))()];
			}
		});
	}
	function MetaProperty$1(node, scope) {
		return __generator(this, function (_a) {
			return [2, scope.find(NEWTARGET).get()];
		});
	}
	function SequenceExpression$1(node, scope) {
		var result, i;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					i = 0;
					_a.label = 1;
				case 1:
					if (!(i < node.expressions.length)) return [3, 4];
					return [5, __values(evaluate$1(node.expressions[i], scope))];
				case 2:
					result = _a.sent();
					_a.label = 3;
				case 3:
					i++;
					return [3, 1];
				case 4: return [2, result];
			}
		});
	}
	function ArrowFunctionExpression$1(node, scope) {
		return __generator(this, function (_a) {
			return [2, createFunc(node, scope)];
		});
	}
	function TemplateLiteral$1(node, scope) {
		var quasis, expressions, result, temEl, expr, _a, _b;
		return __generator(this, function (_c) {
			switch (_c.label) {
				case 0:
					quasis = node.quasis.slice();
					expressions = node.expressions.slice();
					result = '';
					_c.label = 1;
				case 1:
					if (!(temEl = quasis.shift())) return [3, 5];
					_a = result;
					return [5, __values(TemplateElement$1(temEl))];
				case 2:
					result = _a + _c.sent();
					expr = expressions.shift();
					if (!expr) return [3, 4];
					_b = result;
					return [5, __values(evaluate$1(expr, scope))];
				case 3:
					result = _b + _c.sent();
					_c.label = 4;
				case 4: return [3, 1];
				case 5: return [2, result];
			}
		});
	}
	function TaggedTemplateExpression$1(node, scope) {
		var tagFunc, quasis, str, raw, expressions, args, i, _a, _b;
		return __generator(this, function (_c) {
			switch (_c.label) {
				case 0: return [5, __values(evaluate$1(node.tag, scope))];
				case 1:
					tagFunc = _c.sent();
					quasis = node.quasi.quasis;
					str = quasis.map(function (v) { return v.value.cooked; });
					raw = quasis.map(function (v) { return v.value.raw; });
					define(str, 'raw', {
						value: freeze(raw)
					});
					expressions = node.quasi.expressions;
					args = [];
					if (!expressions) return [3, 5];
					i = 0;
					_c.label = 2;
				case 2:
					if (!(i < expressions.length)) return [3, 5];
					_b = (_a = args).push;
					return [5, __values(evaluate$1(expressions[i], scope))];
				case 3:
					_b.apply(_a, [_c.sent()]);
					_c.label = 4;
				case 4:
					i++;
					return [3, 2];
				case 5: return [2, tagFunc.apply(void 0, __spread([freeze(str)], args))];
			}
		});
	}
	function TemplateElement$1(node, scope) {
		return __generator(this, function (_a) {
			return [2, node.value.raw];
		});
	}
	function ClassExpression$1(node, scope) {
		var tmpScope, klass;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					if (!(node.id && node.id.name)) return [3, 2];
					tmpScope = new Scope(scope);
					return [5, __values(createClass(node, tmpScope))];
				case 1:
					klass = _a.sent();
					tmpScope.const(node.id.name, klass);
					return [2, klass];
				case 2: return [5, __values(createClass(node, scope))];
				case 3: return [2, _a.sent()];
			}
		});
	}
	function Super$1(node, scope, options) {
		var _a, getProto, superClass;
		if (options === void 0) { options = {}; }
		return __generator(this, function (_b) {
			_a = options.getProto, getProto = _a === void 0 ? false : _a;
			superClass = scope.find(SUPER).get();
			return [2, getProto ? superClass.prototype : superClass];
		});
	}
	function SpreadElement$1(node, scope) {
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0: return [5, __values(evaluate$1(node.argument, scope))];
				case 1: return [2, _a.sent()];
			}
		});
	}
	function YieldExpression(node, scope) {
		var res, _a;
		return __generator(this, function (_b) {
			switch (_b.label) {
				case 0: return [5, __values(evaluate$1(node.argument, scope))];
				case 1:
					res = _b.sent();
					if (!node.delegate) return [3, 3];
					return [5, __values(res)];
				case 2:
					_a = _b.sent();
					return [3, 5];
				case 3: return [4, res];
				case 4:
					_a = _b.sent();
					_b.label = 5;
				case 5: return [2, _a];
			}
		});
	}
	function AwaitExpression(node, scope) {
		var _a;
		return __generator(this, function (_b) {
			switch (_b.label) {
				case 0:
					_a = AWAIT;
					return [5, __values(evaluate$1(node.argument, scope))];
				case 1:
					_a.RES = _b.sent();
					return [4, AWAIT];
				case 2: return [2, _b.sent()];
			}
		});
	}
  
	var expression$1 = /*#__PURE__*/Object.freeze({
	  __proto__: null,
	  ThisExpression: ThisExpression$1,
	  ArrayExpression: ArrayExpression$1,
	  ObjectExpression: ObjectExpression$1,
	  FunctionExpression: FunctionExpression$1,
	  UnaryExpression: UnaryExpression$1,
	  UpdateExpression: UpdateExpression$1,
	  BinaryExpression: BinaryExpression$1,
	  AssignmentExpression: AssignmentExpression$1,
	  LogicalExpression: LogicalExpression$1,
	  MemberExpression: MemberExpression$1,
	  ConditionalExpression: ConditionalExpression$1,
	  CallExpression: CallExpression$1,
	  NewExpression: NewExpression$1,
	  MetaProperty: MetaProperty$1,
	  SequenceExpression: SequenceExpression$1,
	  ArrowFunctionExpression: ArrowFunctionExpression$1,
	  TemplateLiteral: TemplateLiteral$1,
	  TaggedTemplateExpression: TaggedTemplateExpression$1,
	  TemplateElement: TemplateElement$1,
	  ClassExpression: ClassExpression$1,
	  Super: Super$1,
	  SpreadElement: SpreadElement$1,
	  YieldExpression: YieldExpression,
	  AwaitExpression: AwaitExpression
	});
  
	function ExpressionStatement$1(node, scope) {
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0: return [5, __values(evaluate$1(node.expression, scope))];
				case 1:
					_a.sent();
					return [2];
			}
		});
	}
	function BlockStatement$1(block, scope, options) {
		var _a, invasived, _b, hoisted, subScope, i, result;
		if (options === void 0) { options = {}; }
		return __generator(this, function (_c) {
			switch (_c.label) {
				case 0:
					_a = options.invasived, invasived = _a === void 0 ? false : _a, _b = options.hoisted, hoisted = _b === void 0 ? false : _b;
					subScope = invasived ? scope : new Scope(scope);
					if (!!hoisted) return [3, 2];
					return [5, __values(hoist(block, subScope, { onlyBlock: true }))];
				case 1:
					_c.sent();
					_c.label = 2;
				case 2:
					i = 0;
					_c.label = 3;
				case 3:
					if (!(i < block.body.length)) return [3, 6];
					return [5, __values(evaluate$1(block.body[i], subScope))];
				case 4:
					result = _c.sent();
					if (result === BREAK || result === CONTINUE || result === RETURN) {
						return [2, result];
					}
					_c.label = 5;
				case 5:
					i++;
					return [3, 3];
				case 6: return [2];
			}
		});
	}
	function EmptyStatement$1() {
		return __generator(this, function (_a) {
			return [2];
		});
	}
	function DebuggerStatement$1() {
		return __generator(this, function (_a) {
			debugger;
			return [2];
		});
	}
	function ReturnStatement$1(node, scope) {
		var _a, _b;
		return __generator(this, function (_c) {
			switch (_c.label) {
				case 0:
					_a = RETURN;
					if (!node.argument) return [3, 2];
					return [5, __values(evaluate$1(node.argument, scope))];
				case 1:
					_b = (_c.sent());
					return [3, 3];
				case 2:
					_b = undefined;
					_c.label = 3;
				case 3:
					_a.RES = _b;
					return [2, RETURN];
			}
		});
	}
	function BreakStatement$1() {
		return __generator(this, function (_a) {
			return [2, BREAK];
		});
	}
	function ContinueStatement$1() {
		return __generator(this, function (_a) {
			return [2, CONTINUE];
		});
	}
	function IfStatement$1(node, scope) {
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0: return [5, __values(evaluate$1(node.test, scope))];
				case 1:
					if (!_a.sent()) return [3, 3];
					return [5, __values(evaluate$1(node.consequent, scope))];
				case 2: return [2, _a.sent()];
				case 3: return [5, __values(evaluate$1(node.alternate, scope))];
				case 4: return [2, _a.sent()];
			}
		});
	}
	function SwitchStatement$1(node, scope) {
		var discriminant, matched, i, eachCase, _a, _b, result;
		return __generator(this, function (_c) {
			switch (_c.label) {
				case 0: return [5, __values(evaluate$1(node.discriminant, scope))];
				case 1:
					discriminant = _c.sent();
					matched = false;
					i = 0;
					_c.label = 2;
				case 2:
					if (!(i < node.cases.length)) return [3, 8];
					eachCase = node.cases[i];
					_a = !matched;
					if (!_a) return [3, 5];
					_b = !eachCase.test;
					if (_b) return [3, 4];
					return [5, __values(evaluate$1(eachCase.test, scope))];
				case 3:
					_b = (_c.sent()) === discriminant;
					_c.label = 4;
				case 4:
					_a = (_b);
					_c.label = 5;
				case 5:
					if (_a) {
						matched = true;
					}
					if (!matched) return [3, 7];
					return [5, __values(SwitchCase$1(eachCase, scope))];
				case 6:
					result = _c.sent();
					if (result === BREAK) {
						return [3, 8];
					}
					if (result === CONTINUE || result === RETURN) {
						return [2, result];
					}
					_c.label = 7;
				case 7:
					i++;
					return [3, 2];
				case 8: return [2];
			}
		});
	}
	function SwitchCase$1(node, scope) {
		var i, result;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					i = 0;
					_a.label = 1;
				case 1:
					if (!(i < node.consequent.length)) return [3, 4];
					return [5, __values(evaluate$1(node.consequent[i], scope))];
				case 2:
					result = _a.sent();
					if (result === BREAK || result === CONTINUE || result === RETURN) {
						return [2, result];
					}
					_a.label = 3;
				case 3:
					i++;
					return [3, 1];
				case 4: return [2];
			}
		});
	}
	function ThrowStatement$1(node, scope) {
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0: return [5, __values(evaluate$1(node.argument, scope))];
				case 1: throw _a.sent();
			}
		});
	}
	function TryStatement$1(node, scope) {
		var err_1, subScope, param, name_1, result;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					_a.trys.push([0, 2, 9, 12]);
					return [5, __values(BlockStatement$1(node.block, scope))];
				case 1: return [2, _a.sent()];
				case 2:
					err_1 = _a.sent();
					if (!node.handler) return [3, 7];
					subScope = new Scope(scope);
					param = node.handler.param;
					if (!param) return [3, 5];
					if (!(param.type === 'Identifier')) return [3, 3];
					name_1 = param.name;
					subScope.var(name_1, err_1);
					return [3, 5];
				case 3: return [5, __values(pattern$2(param, scope, { feed: err_1 }))];
				case 4:
					_a.sent();
					_a.label = 5;
				case 5: return [5, __values(CatchClause$1(node.handler, subScope))];
				case 6: return [2, _a.sent()];
				case 7: throw err_1;
				case 8: return [3, 12];
				case 9:
					if (!node.finalizer) return [3, 11];
					return [5, __values(BlockStatement$1(node.finalizer, scope))];
				case 10:
					result = _a.sent();
					if (result === BREAK || result === CONTINUE || result === RETURN) {
						return [2, result];
					}
					_a.label = 11;
				case 11: return [7];
				case 12: return [2];
			}
		});
	}
	function CatchClause$1(node, scope) {
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0: return [5, __values(BlockStatement$1(node.body, scope, { invasived: true }))];
				case 1: return [2, _a.sent()];
			}
		});
	}
	function WhileStatement$1(node, scope) {
		var result;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0: return [5, __values(evaluate$1(node.test, scope))];
				case 1:
					if (!_a.sent()) return [3, 3];
					return [5, __values(evaluate$1(node.body, scope))];
				case 2:
					result = _a.sent();
					if (result === BREAK) {
						return [3, 3];
					}
					else if (result === CONTINUE) {
						return [3, 0];
					}
					else if (result === RETURN) {
						return [2, result];
					}
					return [3, 0];
				case 3: return [2];
			}
		});
	}
	function DoWhileStatement$1(node, scope) {
		var result;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0: return [5, __values(evaluate$1(node.body, scope))];
				case 1:
					result = _a.sent();
					if (result === BREAK) {
						return [3, 4];
					}
					else if (result === CONTINUE) {
						return [3, 2];
					}
					else if (result === RETURN) {
						return [2, result];
					}
					_a.label = 2;
				case 2: return [5, __values(evaluate$1(node.test, scope))];
				case 3:
					if (_a.sent()) return [3, 0];
					_a.label = 4;
				case 4: return [2];
			}
		});
	}
	function ForStatement$1(node, scope) {
		var forScope, _a, subScope, result;
		return __generator(this, function (_b) {
			switch (_b.label) {
				case 0:
					forScope = new Scope(scope);
					return [5, __values(evaluate$1(node.init, forScope))];
				case 1:
					_b.sent();
					_b.label = 2;
				case 2:
					if (!node.test) return [3, 4];
					return [5, __values(evaluate$1(node.test, forScope))];
				case 3:
					_a = (_b.sent());
					return [3, 5];
				case 4:
					_a = true;
					_b.label = 5;
				case 5:
					if (!_a) return [3, 12];
					subScope = new Scope(forScope);
					result = void 0;
					if (!(node.body.type === 'BlockStatement')) return [3, 7];
					return [5, __values(BlockStatement$1(node.body, subScope, { invasived: true }))];
				case 6:
					result = _b.sent();
					return [3, 9];
				case 7: return [5, __values(evaluate$1(node.body, subScope))];
				case 8:
					result = _b.sent();
					_b.label = 9;
				case 9:
					if (result === BREAK) {
						return [3, 12];
					}
					else if (result === CONTINUE) {
						return [3, 10];
					}
					else if (result === RETURN) {
						return [2, result];
					}
					_b.label = 10;
				case 10: return [5, __values(evaluate$1(node.update, forScope))];
				case 11:
					_b.sent();
					return [3, 2];
				case 12: return [2];
			}
		});
	}
	function ForInStatement$1(node, scope) {
		var _a, _b, _i, value, result;
		return __generator(this, function (_c) {
			switch (_c.label) {
				case 0:
					_a = [];
					return [5, __values(evaluate$1(node.right, scope))];
				case 1:
					for (_b in _c.sent())
						_a.push(_b);
					_i = 0;
					_c.label = 2;
				case 2:
					if (!(_i < _a.length)) return [3, 5];
					value = _a[_i];
					return [5, __values(ForXHandler(node, scope, { value: value }))];
				case 3:
					result = _c.sent();
					if (result === BREAK) {
						return [3, 5];
					}
					else if (result === CONTINUE) {
						return [3, 4];
					}
					else if (result === RETURN) {
						return [2, result];
					}
					_c.label = 4;
				case 4:
					_i++;
					return [3, 2];
				case 5: return [2];
			}
		});
	}
	function ForOfStatement$1(node, scope) {
		var right, iterator, ret, result, right_1, right_1_1, value, result, e_1_1;
		var e_1, _a;
		return __generator(this, function (_b) {
			switch (_b.label) {
				case 0: return [5, __values(evaluate$1(node.right, scope))];
				case 1:
					right = _b.sent();
					if (!node.await) return [3, 8];
					iterator = getAsyncIterator(right);
					ret = void 0;
					AWAIT.RES = iterator.next();
					return [4, AWAIT];
				case 2:
					ret = _b.sent();
					_b.label = 3;
				case 3:
					if (!!ret.done) return [3, 7];
					return [5, __values(ForXHandler(node, scope, { value: ret.value }))];
				case 4:
					result = _b.sent();
					if (result === BREAK) {
						return [3, 7];
					}
					else if (result === CONTINUE) {
						return [3, 5];
					}
					else if (result === RETURN) {
						return [2, result];
					}
					_b.label = 5;
				case 5:
					AWAIT.RES = iterator.next();
					return [4, AWAIT];
				case 6:
					ret = _b.sent();
					return [3, 3];
				case 7: return [3, 15];
				case 8:
					_b.trys.push([8, 13, 14, 15]);
					right_1 = __values(right), right_1_1 = right_1.next();
					_b.label = 9;
				case 9:
					if (!!right_1_1.done) return [3, 12];
					value = right_1_1.value;
					return [5, __values(ForXHandler(node, scope, { value: value }))];
				case 10:
					result = _b.sent();
					if (result === BREAK) {
						return [3, 12];
					}
					else if (result === CONTINUE) {
						return [3, 11];
					}
					else if (result === RETURN) {
						return [2, result];
					}
					_b.label = 11;
				case 11:
					right_1_1 = right_1.next();
					return [3, 9];
				case 12: return [3, 15];
				case 13:
					e_1_1 = _b.sent();
					e_1 = { error: e_1_1 };
					return [3, 15];
				case 14:
					try {
						if (right_1_1 && !right_1_1.done && (_a = right_1.return)) _a.call(right_1);
					}
					finally { if (e_1) throw e_1.error; }
					return [7];
				case 15: return [2];
			}
		});
	}
  
	var statement$1 = /*#__PURE__*/Object.freeze({
	  __proto__: null,
	  ExpressionStatement: ExpressionStatement$1,
	  BlockStatement: BlockStatement$1,
	  EmptyStatement: EmptyStatement$1,
	  DebuggerStatement: DebuggerStatement$1,
	  ReturnStatement: ReturnStatement$1,
	  BreakStatement: BreakStatement$1,
	  ContinueStatement: ContinueStatement$1,
	  IfStatement: IfStatement$1,
	  SwitchStatement: SwitchStatement$1,
	  SwitchCase: SwitchCase$1,
	  ThrowStatement: ThrowStatement$1,
	  TryStatement: TryStatement$1,
	  CatchClause: CatchClause$1,
	  WhileStatement: WhileStatement$1,
	  DoWhileStatement: DoWhileStatement$1,
	  ForStatement: ForStatement$1,
	  ForInStatement: ForInStatement$1,
	  ForOfStatement: ForOfStatement$1
	});
  
	function ObjectPattern$1(node, scope, options) {
		var _a, kind, _b, hoist, _c, onlyBlock, _d, feed, fedKeys, i, property, value, key, value, rest, i_1;
		if (options === void 0) { options = {}; }
		return __generator(this, function (_e) {
			switch (_e.label) {
				case 0:
					_a = options.kind, kind = _a === void 0 ? 'var' : _a, _b = options.hoist, hoist = _b === void 0 ? false : _b, _c = options.onlyBlock, onlyBlock = _c === void 0 ? false : _c, _d = options.feed, feed = _d === void 0 ? {} : _d;
					fedKeys = [];
					i = 0;
					_e.label = 1;
				case 1:
					if (!(i < node.properties.length)) return [3, 18];
					property = node.properties[i];
					if (!hoist) return [3, 8];
					if (!(onlyBlock || kind === 'var')) return [3, 7];
					if (!(property.type === 'Property')) return [3, 5];
					value = property.value;
					if (!(value.type === 'Identifier')) return [3, 2];
					scope[kind](value.name, onlyBlock ? DEADZONE : kind === 'var' ? NOINIT : undefined);
					return [3, 4];
				case 2: return [5, __values(pattern$2(value, scope, { kind: kind, hoist: hoist, onlyBlock: onlyBlock }))];
				case 3:
					_e.sent();
					_e.label = 4;
				case 4: return [3, 7];
				case 5: return [5, __values(RestElement$1(property, scope, { kind: kind, hoist: hoist, onlyBlock: onlyBlock }))];
				case 6:
					_e.sent();
					_e.label = 7;
				case 7: return [3, 17];
				case 8:
					if (!(property.type === 'Property')) return [3, 15];
					key = void 0;
					if (!property.computed) return [3, 10];
					return [5, __values(evaluate$1(property.key, scope))];
				case 9:
					key = _e.sent();
					return [3, 11];
				case 10:
					key = property.key.name;
					_e.label = 11;
				case 11:
					fedKeys.push(key);
					value = property.value;
					if (!(value.type === 'Identifier')) return [3, 12];
					scope[kind](value.name, feed[key]);
					return [3, 14];
				case 12: return [5, __values(pattern$2(value, scope, { kind: kind, feed: feed[key] }))];
				case 13:
					_e.sent();
					_e.label = 14;
				case 14: return [3, 17];
				case 15:
					rest = assign({}, feed);
					for (i_1 = 0; i_1 < fedKeys.length; i_1++)
						delete rest[fedKeys[i_1]];
					return [5, __values(RestElement$1(property, scope, { kind: kind, feed: rest }))];
				case 16:
					_e.sent();
					_e.label = 17;
				case 17:
					i++;
					return [3, 1];
				case 18: return [2];
			}
		});
	}
	function ArrayPattern$1(node, scope, options) {
		var kind, _a, hoist, _b, onlyBlock, _c, feed, result, i, element, variable;
		if (options === void 0) { options = {}; }
		return __generator(this, function (_d) {
			switch (_d.label) {
				case 0:
					kind = options.kind, _a = options.hoist, hoist = _a === void 0 ? false : _a, _b = options.onlyBlock, onlyBlock = _b === void 0 ? false : _b, _c = options.feed, feed = _c === void 0 ? [] : _c;
					result = [];
					i = 0;
					_d.label = 1;
				case 1:
					if (!(i < node.elements.length)) return [3, 14];
					element = node.elements[i];
					if (!element)
						return [3, 13];
					if (!hoist) return [3, 5];
					if (!(onlyBlock || kind === 'var')) return [3, 4];
					if (!(element.type === 'Identifier')) return [3, 2];
					scope[kind](element.name, onlyBlock ? DEADZONE : kind === 'var' ? NOINIT : undefined);
					return [3, 4];
				case 2: return [5, __values(pattern$2(element, scope, { kind: kind, hoist: hoist, onlyBlock: onlyBlock }))];
				case 3:
					_d.sent();
					_d.label = 4;
				case 4: return [3, 13];
				case 5:
					if (!(element.type === 'Identifier')) return [3, 9];
					if (!kind) return [3, 6];
					scope[kind](element.name, feed[i]);
					return [3, 8];
				case 6: return [5, __values(Identifier$1(element, scope, { getVar: true }))];
				case 7:
					variable = _d.sent();
					variable.set(feed[i]);
					result.push(variable.get());
					_d.label = 8;
				case 8: return [3, 13];
				case 9:
					if (!(element.type === 'RestElement')) return [3, 11];
					return [5, __values(RestElement$1(element, scope, { kind: kind, feed: feed.slice(i) }))];
				case 10:
					_d.sent();
					return [3, 13];
				case 11: return [5, __values(pattern$2(element, scope, { kind: kind, feed: feed[i] }))];
				case 12:
					_d.sent();
					_d.label = 13;
				case 13:
					i++;
					return [3, 1];
				case 14:
					if (result.length) {
						return [2, result];
					}
					return [2];
			}
		});
	}
	function RestElement$1(node, scope, options) {
		var kind, _a, hoist, _b, onlyBlock, _c, feed, arg, variable;
		if (options === void 0) { options = {}; }
		return __generator(this, function (_d) {
			switch (_d.label) {
				case 0:
					kind = options.kind, _a = options.hoist, hoist = _a === void 0 ? false : _a, _b = options.onlyBlock, onlyBlock = _b === void 0 ? false : _b, _c = options.feed, feed = _c === void 0 ? [] : _c;
					arg = node.argument;
					if (!hoist) return [3, 4];
					if (!(onlyBlock || kind === 'var')) return [3, 3];
					if (!(arg.type === 'Identifier')) return [3, 1];
					scope[kind](arg.name, onlyBlock ? DEADZONE : kind === 'var' ? NOINIT : undefined);
					return [3, 3];
				case 1: return [5, __values(pattern$2(arg, scope, { kind: kind, hoist: hoist, onlyBlock: onlyBlock }))];
				case 2:
					_d.sent();
					_d.label = 3;
				case 3: return [3, 10];
				case 4:
					if (!(arg.type === 'Identifier')) return [3, 8];
					if (!kind) return [3, 5];
					scope[kind](arg.name, feed);
					return [3, 7];
				case 5: return [5, __values(Identifier$1(arg, scope, { getVar: true }))];
				case 6:
					variable = _d.sent();
					variable.set(feed);
					_d.label = 7;
				case 7: return [3, 10];
				case 8: return [5, __values(pattern$2(arg, scope, { kind: kind, feed: feed }))];
				case 9:
					_d.sent();
					_d.label = 10;
				case 10: return [2];
			}
		});
	}
	function AssignmentPattern$1(node, scope, options) {
		var _a, kind, _b, hoist, _c, onlyBlock, _d, feed, _e, left;
		if (options === void 0) { options = {}; }
		return __generator(this, function (_f) {
			switch (_f.label) {
				case 0:
					_a = options.kind, kind = _a === void 0 ? 'var' : _a, _b = options.hoist, hoist = _b === void 0 ? false : _b, _c = options.onlyBlock, onlyBlock = _c === void 0 ? false : _c, _d = options.feed;
					if (!(_d === void 0)) return [3, 2];
					return [5, __values(evaluate$1(node.right, scope))];
				case 1:
					_e = _f.sent();
					return [3, 3];
				case 2:
					_e = _d;
					_f.label = 3;
				case 3:
					feed = _e;
					left = node.left;
					if (!hoist) return [3, 7];
					if (!(onlyBlock || kind === 'var')) return [3, 6];
					if (!(left.type === 'Identifier')) return [3, 4];
					scope[kind](left.name, onlyBlock ? DEADZONE : kind === 'var' ? NOINIT : undefined);
					return [3, 6];
				case 4: return [5, __values(pattern$2(left, scope, { kind: kind, hoist: hoist, onlyBlock: onlyBlock }))];
				case 5:
					_f.sent();
					_f.label = 6;
				case 6: return [3, 10];
				case 7:
					if (!(left.type === 'Identifier')) return [3, 8];
					scope[kind](left.name, feed);
					return [3, 10];
				case 8: return [5, __values(pattern$2(left, scope, { kind: kind, feed: feed }))];
				case 9:
					_f.sent();
					_f.label = 10;
				case 10: return [2];
			}
		});
	}
  
	var pattern$1 = /*#__PURE__*/Object.freeze({
	  __proto__: null,
	  ObjectPattern: ObjectPattern$1,
	  ArrayPattern: ArrayPattern$1,
	  RestElement: RestElement$1,
	  AssignmentPattern: AssignmentPattern$1
	});
  
	var evaluateOps$1;
	function evaluate$1(node, scope) {
		var handler;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					if (!node)
						return [2];
					if (!evaluateOps$1) {
						evaluateOps$1 = assign({}, declaration$1, expression$1, identifier$1, statement$1, literal$1, pattern$1);
					}
					handler = evaluateOps$1[node.type];
					if (!handler) return [3, 2];
					return [5, __values(handler(node, scope))];
				case 1: return [2, _a.sent()];
				case 2: throw new Error(node.type + " isn't implemented");
			}
		});
	}
  
	function FunctionDeclaration$1(node, scope) {
		return __generator(this, function (_a) {
			scope.func(node.id.name, createFunc(node, scope));
			return [2];
		});
	}
	function VariableDeclaration$1(node, scope, options) {
		var i;
		if (options === void 0) { options = {}; }
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					i = 0;
					_a.label = 1;
				case 1:
					if (!(i < node.declarations.length)) return [3, 4];
					return [5, __values(VariableDeclarator$1(node.declarations[i], scope, assign({ kind: node.kind }, options)))];
				case 2:
					_a.sent();
					_a.label = 3;
				case 3:
					i++;
					return [3, 1];
				case 4: return [2];
			}
		});
	}
	function VariableDeclarator$1(node, scope, options) {
		var _a, kind, _b, hoist, _c, onlyBlock, feed, hasFeed, value, _d, name_1;
		if (options === void 0) { options = {}; }
		return __generator(this, function (_e) {
			switch (_e.label) {
				case 0:
					_a = options.kind, kind = _a === void 0 ? 'var' : _a, _b = options.hoist, hoist = _b === void 0 ? false : _b, _c = options.onlyBlock, onlyBlock = _c === void 0 ? false : _c, feed = options.feed;
					if (!hoist) return [3, 4];
					if (!(onlyBlock || kind === 'var')) return [3, 3];
					if (!(node.id.type === 'Identifier')) return [3, 1];
					scope[kind](node.id.name, onlyBlock ? DEADZONE : kind === 'var' ? NOINIT : undefined);
					return [3, 3];
				case 1: return [5, __values(pattern$2(node.id, scope, { kind: kind, hoist: hoist, onlyBlock: onlyBlock }))];
				case 2:
					_e.sent();
					_e.label = 3;
				case 3: return [3, 10];
				case 4:
					hasFeed = 'feed' in options;
					if (!hasFeed) return [3, 5];
					_d = feed;
					return [3, 7];
				case 5: return [5, __values(evaluate$1(node.init, scope))];
				case 6:
					_d = _e.sent();
					_e.label = 7;
				case 7:
					value = _d;
					if (!(node.id.type === 'Identifier')) return [3, 8];
					name_1 = node.id.name;
					if (kind === 'var' && !node.init && !hasFeed) {
						scope.var(name_1, NOINIT);
					}
					else {
						scope[kind](name_1, value);
					}
					if (node.init
						&& ['ClassExpression', 'FunctionExpression', 'ArrowFunctionExpression']
							.indexOf(node.init.type) !== -1
						&& !value.name) {
						define(value, 'name', {
							value: name_1,
							configurable: true
						});
					}
					return [3, 10];
				case 8: return [5, __values(pattern$2(node.id, scope, { kind: kind, feed: value }))];
				case 9:
					_e.sent();
					_e.label = 10;
				case 10: return [2];
			}
		});
	}
	function ClassDeclaration$1(node, scope) {
		var _a, _b, _c;
		return __generator(this, function (_d) {
			switch (_d.label) {
				case 0:
					_b = (_a = scope).func;
					_c = [node.id.name];
					return [5, __values(createClass(node, scope))];
				case 1:
					_b.apply(_a, _c.concat([_d.sent()]));
					return [2];
			}
		});
	}
	function ClassBody$1(node, scope, options) {
		var klass, superClass, i;
		if (options === void 0) { options = {}; }
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					klass = options.klass, superClass = options.superClass;
					i = 0;
					_a.label = 1;
				case 1:
					if (!(i < node.body.length)) return [3, 4];
					return [5, __values(MethodDefinition$1(node.body[i], scope, { klass: klass, superClass: superClass }))];
				case 2:
					_a.sent();
					_a.label = 3;
				case 3:
					i++;
					return [3, 1];
				case 4: return [2];
			}
		});
	}
	function MethodDefinition$1(node, scope, options) {
		var klass, superClass, key, obj, value, oriDptor, oriDptor;
		if (options === void 0) { options = {}; }
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					klass = options.klass, superClass = options.superClass;
					if (!node.computed) return [3, 2];
					return [5, __values(evaluate$1(node.key, scope))];
				case 1:
					key = _a.sent();
					return [3, 3];
				case 2:
					if (node.key.type === 'Identifier') {
						key = node.key.name;
					}
					else {
						throw new SyntaxError('Unexpected token');
					}
					_a.label = 3;
				case 3:
					obj = node.static ? klass : klass.prototype;
					value = createFunc(node.value, scope, { superClass: superClass });
					switch (node.kind) {
						case 'constructor':
							break;
						case 'method':
							define(obj, key, {
								value: value,
								writable: true,
								configurable: true,
							});
							break;
						case 'get': {
							oriDptor = getDptor(obj, key);
							define(obj, key, {
								get: value,
								set: oriDptor && oriDptor.set,
								configurable: true,
							});
							break;
						}
						case 'set': {
							oriDptor = getDptor(obj, key);
							define(obj, key, {
								get: oriDptor && oriDptor.get,
								set: value,
								configurable: true,
							});
							break;
						}
						default:
							throw new SyntaxError('Unexpected token');
					}
					return [2];
			}
		});
	}
  
	function runAsync(iterator, options) {
		if (options === void 0) { options = {}; }
		var res = options.res, err = options.err, ret = options.ret, fullRet = options.fullRet;
		return new Promise(function (resolve, reject) {
			if ('ret' in options) {
				return resolve(iterator.return(ret));
			}
			if ('err' in options) {
				onRejected(err);
			}
			else {
				onFulfilled(res);
			}
			function onFulfilled(res) {
				var ret;
				try {
					ret = iterator.next(res);
				}
				catch (e) {
					return reject(e);
				}
				next(ret);
				return null;
			}
			function onRejected(err) {
				var ret;
				try {
					ret = iterator.throw(err);
				}
				catch (e) {
					return reject(e);
				}
				next(ret);
			}
			function next(ret) {
				if (ret.done)
					return resolve(fullRet ? ret : ret.value);
				if (ret.value !== AWAIT)
					return resolve(ret);
				var awaitValue = ret.value.RES;
				var value = awaitValue && awaitValue.then === 'function'
					? awaitValue : Promise.resolve(awaitValue);
				return value.then(onFulfilled, onRejected);
			}
		});
	}
  
	function hoist(block, scope, options) {
		var _a, onlyBlock, funcDclrList, funcDclrIdxs, i, statement, i;
		if (options === void 0) { options = {}; }
		return __generator(this, function (_b) {
			switch (_b.label) {
				case 0:
					_a = options.onlyBlock, onlyBlock = _a === void 0 ? false : _a;
					funcDclrList = [];
					funcDclrIdxs = [];
					i = 0;
					_b.label = 1;
				case 1:
					if (!(i < block.body.length)) return [3, 7];
					statement = block.body[i];
					if (!(statement.type === 'FunctionDeclaration')) return [3, 2];
					funcDclrList.push(statement);
					funcDclrIdxs.push(i);
					return [3, 6];
				case 2:
					if (!(statement.type === 'VariableDeclaration'
						&& ['const', 'let'].indexOf(statement.kind) !== -1)) return [3, 4];
					return [5, __values(VariableDeclaration$1(statement, scope, { hoist: true, onlyBlock: true }))];
				case 3:
					_b.sent();
					return [3, 6];
				case 4:
					if (!!onlyBlock) return [3, 6];
					return [5, __values(hoistVarRecursion(statement, scope))];
				case 5:
					_b.sent();
					_b.label = 6;
				case 6:
					i++;
					return [3, 1];
				case 7:
					if (funcDclrIdxs.length) {
						for (i = funcDclrIdxs.length - 1; i > -1; i--) {
							block.body.splice(funcDclrIdxs[i], 1);
						}
						block.body = funcDclrList.concat(block.body);
					}
					return [2];
			}
		});
	}
	function hoistVarRecursion(statement, scope) {
		var _a, i, i, j, tryBlock, i, catchBlock, i, finalBlock, i;
		return __generator(this, function (_b) {
			switch (_b.label) {
				case 0:
					_a = statement.type;
					switch (_a) {
						case 'VariableDeclaration': return [3, 1];
						case 'ForInStatement': return [3, 3];
						case 'ForOfStatement': return [3, 3];
						case 'ForStatement': return [3, 5];
						case 'WhileStatement': return [3, 7];
						case 'DoWhileStatement': return [3, 7];
						case 'IfStatement': return [3, 9];
						case 'BlockStatement': return [3, 13];
						case 'SwitchStatement': return [3, 18];
						case 'TryStatement': return [3, 25];
					}
					return [3, 38];
				case 1: return [5, __values(VariableDeclaration$1(statement, scope, { hoist: true }))];
				case 2:
					_b.sent();
					return [3, 38];
				case 3:
					if (!(statement.left.type === 'VariableDeclaration')) return [3, 5];
					return [5, __values(VariableDeclaration$1(statement.left, scope, { hoist: true }))];
				case 4:
					_b.sent();
					_b.label = 5;
				case 5:
					if (!(statement.type === 'ForStatement' && statement.init.type === 'VariableDeclaration')) return [3, 7];
					return [5, __values(VariableDeclaration$1(statement.init, scope, { hoist: true }))];
				case 6:
					_b.sent();
					_b.label = 7;
				case 7: return [5, __values(hoistVarRecursion(statement.body, scope))];
				case 8:
					_b.sent();
					return [3, 38];
				case 9: return [5, __values(hoistVarRecursion(statement.consequent, scope))];
				case 10:
					_b.sent();
					if (!statement.alternate) return [3, 12];
					return [5, __values(hoistVarRecursion(statement.alternate, scope))];
				case 11:
					_b.sent();
					_b.label = 12;
				case 12: return [3, 38];
				case 13:
					i = 0;
					_b.label = 14;
				case 14:
					if (!(i < statement.body.length)) return [3, 17];
					return [5, __values(hoistVarRecursion(statement.body[i], scope))];
				case 15:
					_b.sent();
					_b.label = 16;
				case 16:
					i++;
					return [3, 14];
				case 17: return [3, 38];
				case 18:
					i = 0;
					_b.label = 19;
				case 19:
					if (!(i < statement.cases.length)) return [3, 24];
					j = 0;
					_b.label = 20;
				case 20:
					if (!(j < statement.cases[i].consequent.length)) return [3, 23];
					return [5, __values(hoistVarRecursion(statement.cases[i].consequent[j], scope))];
				case 21:
					_b.sent();
					_b.label = 22;
				case 22:
					j++;
					return [3, 20];
				case 23:
					i++;
					return [3, 19];
				case 24: return [3, 38];
				case 25:
					tryBlock = statement.block.body;
					i = 0;
					_b.label = 26;
				case 26:
					if (!(i < tryBlock.length)) return [3, 29];
					return [5, __values(hoistVarRecursion(tryBlock[i], scope))];
				case 27:
					_b.sent();
					_b.label = 28;
				case 28:
					i++;
					return [3, 26];
				case 29:
					catchBlock = statement.handler && statement.handler.body.body;
					if (!catchBlock) return [3, 33];
					i = 0;
					_b.label = 30;
				case 30:
					if (!(i < catchBlock.length)) return [3, 33];
					return [5, __values(hoistVarRecursion(catchBlock[i], scope))];
				case 31:
					_b.sent();
					_b.label = 32;
				case 32:
					i++;
					return [3, 30];
				case 33:
					finalBlock = statement.finalizer && statement.finalizer.body;
					if (!finalBlock) return [3, 37];
					i = 0;
					_b.label = 34;
				case 34:
					if (!(i < finalBlock.length)) return [3, 37];
					return [5, __values(hoistVarRecursion(finalBlock[i], scope))];
				case 35:
					_b.sent();
					_b.label = 36;
				case 36:
					i++;
					return [3, 34];
				case 37: return [3, 38];
				case 38: return [2];
			}
		});
	}
	function pattern$2(node, scope, options) {
		var _a;
		if (options === void 0) { options = {}; }
		return __generator(this, function (_b) {
			switch (_b.label) {
				case 0:
					_a = node.type;
					switch (_a) {
						case 'ObjectPattern': return [3, 1];
						case 'ArrayPattern': return [3, 3];
						case 'RestElement': return [3, 5];
						case 'AssignmentPattern': return [3, 7];
					}
					return [3, 9];
				case 1: return [5, __values(ObjectPattern$1(node, scope, options))];
				case 2: return [2, _b.sent()];
				case 3: return [5, __values(ArrayPattern$1(node, scope, options))];
				case 4: return [2, _b.sent()];
				case 5: return [5, __values(RestElement$1(node, scope, options))];
				case 6: return [2, _b.sent()];
				case 7: return [5, __values(AssignmentPattern$1(node, scope, options))];
				case 8: return [2, _b.sent()];
				case 9: throw new SyntaxError('Unexpected token');
			}
		});
	}
	function createFunc(node, scope, options) {
		if (options === void 0) { options = {}; }
		if (!node.generator && !node.async) {
			return createFunc$1(node, scope, options);
		}
		var superClass = options.superClass, isCtor = options.isCtor;
		var params = node.params;
		var tmpFunc = function _a() {
			var _i, subScope, i, param, result;
			var _newTarget = this && this instanceof _a ? this.constructor : void 0;
			var args = [];
			for (_i = 0; _i < arguments.length; _i++) {
				args[_i] = arguments[_i];
			}
			return __generator(this, function (_a) {
				switch (_a.label) {
					case 0:
						subScope = new Scope(scope, true);
						if (node.type !== 'ArrowFunctionExpression') {
							subScope.const('this', this);
							subScope.let('arguments', arguments);
							subScope.const(NEWTARGET, _newTarget);
							if (superClass) {
								subScope.const(SUPER, superClass);
								if (isCtor)
									subScope.let(SUPERCALL, false);
							}
						}
						i = 0;
						_a.label = 1;
					case 1:
						if (!(i < params.length)) return [3, 7];
						param = params[i];
						if (!(param.type === 'Identifier')) return [3, 2];
						subScope.var(param.name, args[i]);
						return [3, 6];
					case 2:
						if (!(param.type === 'RestElement')) return [3, 4];
						return [5, __values(RestElement$1(param, subScope, { kind: 'var', feed: args.slice(i) }))];
					case 3:
						_a.sent();
						return [3, 6];
					case 4: return [5, __values(pattern$2(param, subScope, { feed: args[i] }))];
					case 5:
						_a.sent();
						_a.label = 6;
					case 6:
						i++;
						return [3, 1];
					case 7:
						if (!(node.body.type === 'BlockStatement')) return [3, 10];
						return [5, __values(hoist(node.body, subScope))];
					case 8:
						_a.sent();
						return [5, __values(BlockStatement$1(node.body, subScope, {
								invasived: true,
								hoisted: true
							}))];
					case 9:
						result = _a.sent();
						return [3, 12];
					case 10: return [5, __values(evaluate$1(node.body, subScope))];
					case 11:
						result = _a.sent();
						if (node.type === 'ArrowFunctionExpression') {
							RETURN.RES = result;
							result = RETURN;
						}
						_a.label = 12;
					case 12:
						if (result === RETURN) {
							return [2, result.RES];
						}
						return [2];
				}
			});
		};
		var func;
		if (node.async && node.generator) {
			func = function () {
				var iterator = tmpFunc.apply(this, arguments);
				var last = Promise.resolve();
				var hasCatch = false;
				var run = function (opts) {
					return last = last
						.then(function () { return runAsync(iterator, assign({ fullRet: true }, opts)); })
						.catch(function (err) {
						if (!hasCatch) {
							hasCatch = true;
							return Promise.reject(err);
						}
					});
				};
				var asyncIterator = {
					next: function (res) { return run({ res: res }); },
					throw: function (err) { return run({ err: err }); },
					return: function (ret) { return run({ ret: ret }); }
				};
				if (typeof Symbol === 'function') {
					asyncIterator[Symbol.iterator] = function () { return this; };
				}
				return asyncIterator;
			};
		}
		else if (node.async) {
			func = function () { return runAsync(tmpFunc.apply(this, arguments)); };
		}
		else {
			func = tmpFunc;
		}
		define(func, NOCTOR, { value: true });
		define(func, 'name', {
			value: node.id
				&& node.id.name
				|| '',
			configurable: true
		});
		define(func, 'length', {
			value: params.length,
			configurable: true
		});
		return func;
	}
	function createClass(node, scope) {
		var superClass, klass, methodBody, i, method;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0: return [5, __values(evaluate$1(node.superClass, scope))];
				case 1:
					superClass = _a.sent();
					klass = function () {
						if (superClass) {
							superClass.apply(this);
						}
					};
					methodBody = node.body.body;
					for (i = 0; i < methodBody.length; i++) {
						method = methodBody[i];
						if (method.kind === 'constructor') {
							klass = createFunc(method.value, scope, { superClass: superClass, isCtor: true });
							break;
						}
					}
					if (superClass) {
						inherits(klass, superClass);
					}
					return [5, __values(ClassBody$1(node.body, scope, { klass: klass, superClass: superClass }))];
				case 2:
					_a.sent();
					define(klass, CLSCTOR, { value: true });
					define(klass, 'name', {
						value: node.id && node.id.name || '',
						configurable: true
					});
					return [2, klass];
			}
		});
	}
	function ForXHandler(node, scope, options) {
		var value, left, subScope, variable, result;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					value = options.value;
					left = node.left;
					subScope = new Scope(scope);
					if (!(left.type === 'VariableDeclaration')) return [3, 2];
					return [5, __values(VariableDeclaration$1(left, subScope, { feed: value }))];
				case 1:
					_a.sent();
					return [3, 6];
				case 2:
					if (!(left.type === 'Identifier')) return [3, 4];
					return [5, __values(Identifier(left, scope, { getVar: true }))];
				case 3:
					variable = _a.sent();
					variable.set(value);
					return [3, 6];
				case 4: return [5, __values(pattern$2(left, scope, { feed: value }))];
				case 5:
					_a.sent();
					_a.label = 6;
				case 6:
					if (!(node.body.type === 'BlockStatement')) return [3, 8];
					return [5, __values(BlockStatement$1(node.body, subScope, { invasived: true }))];
				case 7:
					result = _a.sent();
					return [3, 10];
				case 8: return [5, __values(evaluate$1(node.body, subScope))];
				case 9:
					result = _a.sent();
					_a.label = 10;
				case 10: return [2, result];
			}
		});
	}
  
	function hoist$1(block, scope, options) {
		if (options === void 0) { options = {}; }
		var _a = options.onlyBlock, onlyBlock = _a === void 0 ? false : _a;
		var funcDclrList = [];
		var funcDclrIdxs = [];
		for (var i = 0; i < block.body.length; i++) {
			var statement = block.body[i];
			if (statement.type === 'FunctionDeclaration') {
				funcDclrList.push(statement);
				funcDclrIdxs.push(i);
			}
			else if (statement.type === 'VariableDeclaration'
				&& ['const', 'let'].indexOf(statement.kind) !== -1) {
				VariableDeclaration(statement, scope, { hoist: true, onlyBlock: true });
			}
			else if (!onlyBlock) {
				hoistVarRecursion$1(statement, scope);
			}
		}
		if (funcDclrIdxs.length) {
			for (var i = funcDclrIdxs.length - 1; i > -1; i--) {
				block.body.splice(funcDclrIdxs[i], 1);
			}
			block.body = funcDclrList.concat(block.body);
		}
	}
	function hoistVarRecursion$1(statement, scope) {
		switch (statement.type) {
			case 'VariableDeclaration':
				VariableDeclaration(statement, scope, { hoist: true });
				break;
			case 'ForInStatement':
			case 'ForOfStatement':
				if (statement.left.type === 'VariableDeclaration') {
					VariableDeclaration(statement.left, scope, { hoist: true });
				}
			case 'ForStatement':
				if (statement.type === 'ForStatement' && statement.init.type === 'VariableDeclaration') {
					VariableDeclaration(statement.init, scope, { hoist: true });
				}
			case 'WhileStatement':
			case 'DoWhileStatement':
				hoistVarRecursion$1(statement.body, scope);
				break;
			case 'IfStatement':
				hoistVarRecursion$1(statement.consequent, scope);
				if (statement.alternate) {
					hoistVarRecursion$1(statement.alternate, scope);
				}
				break;
			case 'BlockStatement':
				for (var i = 0; i < statement.body.length; i++) {
					hoistVarRecursion$1(statement.body[i], scope);
				}
				break;
			case 'SwitchStatement':
				for (var i = 0; i < statement.cases.length; i++) {
					for (var j = 0; j < statement.cases[i].consequent.length; j++) {
						hoistVarRecursion$1(statement.cases[i].consequent[j], scope);
					}
				}
				break;
			case 'TryStatement': {
				var tryBlock = statement.block.body;
				for (var i = 0; i < tryBlock.length; i++) {
					hoistVarRecursion$1(tryBlock[i], scope);
				}
				var catchBlock = statement.handler && statement.handler.body.body;
				if (catchBlock) {
					for (var i = 0; i < catchBlock.length; i++) {
						hoistVarRecursion$1(catchBlock[i], scope);
					}
				}
				var finalBlock = statement.finalizer && statement.finalizer.body;
				if (finalBlock) {
					for (var i = 0; i < finalBlock.length; i++) {
						hoistVarRecursion$1(finalBlock[i], scope);
					}
				}
				break;
			}
		}
	}
	function pattern$3(node, scope, options) {
		if (options === void 0) { options = {}; }
		switch (node.type) {
			case 'ObjectPattern':
				return ObjectPattern(node, scope, options);
			case 'ArrayPattern':
				return ArrayPattern(node, scope, options);
			case 'RestElement':
				return RestElement(node, scope, options);
			case 'AssignmentPattern':
				return AssignmentPattern(node, scope, options);
			default:
				throw new SyntaxError('Unexpected token');
		}
	}
	function createFunc$1(node, scope, options) {
		if (options === void 0) { options = {}; }
		if (node.generator || node.async) {
			return createFunc(node, scope, options);
		}
		var superClass = options.superClass, isCtor = options.isCtor;
		var params = node.params;
		var tmpFunc = function _a() {
			var _newTarget = this && this instanceof _a ? this.constructor : void 0;
			var args = [];
			for (var _i = 0; _i < arguments.length; _i++) {
				args[_i] = arguments[_i];
			}
			var subScope = new Scope(scope, true);
			if (node.type !== 'ArrowFunctionExpression') {
				subScope.const('this', this);
				subScope.let('arguments', arguments);
				subScope.const(NEWTARGET, _newTarget);
				if (superClass) {
					subScope.const(SUPER, superClass);
					if (isCtor)
						subScope.let(SUPERCALL, false);
				}
			}
			for (var i = 0; i < params.length; i++) {
				var param = params[i];
				if (param.type === 'Identifier') {
					subScope.var(param.name, args[i]);
				}
				else if (param.type === 'RestElement') {
					RestElement(param, subScope, { kind: 'var', feed: args.slice(i) });
				}
				else {
					pattern$3(param, subScope, { feed: args[i] });
				}
			}
			var result;
			if (node.body.type === 'BlockStatement') {
				hoist$1(node.body, subScope);
				result = BlockStatement(node.body, subScope, {
					invasived: true,
					hoisted: true
				});
			}
			else {
				result = evaluate(node.body, subScope);
				if (node.type === 'ArrowFunctionExpression') {
					RETURN.RES = result;
					result = RETURN;
				}
			}
			if (result === RETURN) {
				return result.RES;
			}
		};
		var func = tmpFunc;
		if (node.type === 'ArrowFunctionExpression') {
			define(func, NOCTOR, { value: true });
		}
		define(func, 'name', {
			value: node.id
				&& node.id.name
				|| '',
			configurable: true
		});
		define(func, 'length', {
			value: params.length,
			configurable: true
		});
		return func;
	}
	function createClass$1(node, scope) {
		var superClass = evaluate(node.superClass, scope);
		var klass = function () {
			if (superClass) {
				superClass.apply(this);
			}
		};
		var methodBody = node.body.body;
		for (var i = 0; i < methodBody.length; i++) {
			var method = methodBody[i];
			if (method.kind === 'constructor') {
				klass = createFunc$1(method.value, scope, { superClass: superClass, isCtor: true });
				break;
			}
		}
		if (superClass) {
			inherits(klass, superClass);
		}
		ClassBody(node.body, scope, { klass: klass, superClass: superClass });
		define(klass, CLSCTOR, { value: true });
		define(klass, 'name', {
			value: node.id && node.id.name || '',
			configurable: true
		});
		return klass;
	}
	function ForXHandler$1(node, scope, options) {
		var value = options.value;
		var left = node.left;
		var subScope = new Scope(scope);
		if (left.type === 'VariableDeclaration') {
			VariableDeclaration(left, subScope, { feed: value });
		}
		else if (left.type === 'Identifier') {
			var variable = Identifier(left, scope, { getVar: true });
			variable.set(value);
		}
		else {
			pattern$3(left, scope, { feed: value });
		}
		var result;
		if (node.body.type === 'BlockStatement') {
			result = BlockStatement(node.body, subScope, { invasived: true });
		}
		else {
			result = evaluate(node.body, subScope);
		}
		return result;
	}
  
	var Sval = (function () {
		function Sval(options) {
			if (options === void 0) { options = {}; }
			this.options = {};
			this.scope = new Scope(null, true);
			this.exports = {};
			var _a = options.ecmaVer, ecmaVer = _a === void 0 ? 9 : _a, _b = options.sandBox, sandBox = _b === void 0 ? true : _b;
			ecmaVer -= ecmaVer < 2015 ? 0 : 2009;
			if ([3, 5, 6, 7, 8, 9, 10].indexOf(ecmaVer) === -1) {
				throw new Error("unsupported ecmaVer");
			}
			this.options.ecmaVersion = ecmaVer;
			if (sandBox) {
				var win = createSandBox();
				this.scope.let('window', win);
				this.scope.let('this', win);
			}
			else {
				this.scope.let('window', globalObj);
				this.scope.let('this', globalObj);
			}
			this.scope.const('exports', this.exports = {});
		}
		Sval.prototype.import = function (nameOrModules, mod) {
			var _a;
			if (typeof nameOrModules === 'string') {
				nameOrModules = (_a = {}, _a[nameOrModules] = mod, _a);
			}
			if (typeof nameOrModules !== 'object')
				return;
			var names = getOwnNames(nameOrModules);
			for (var i = 0; i < names.length; i++) {
				var name_1 = names[i];
				this.scope.var(name_1, nameOrModules[name_1]);
			}
		};
		Sval.prototype.parse = function (code, parser) {
			if (typeof parser === 'function') {
				return parser(code, assign({}, this.options));
			}
			return acorn.parse(code, this.options);
		};
		Sval.prototype.run = function (code) {
			var ast = typeof code === 'string' ? acorn.parse(code, this.options) : code;
			hoist$1(ast, this.scope);
			evaluate(ast, this.scope);
		};
		Sval.version = version;
		return Sval;
	}());
  
	return Sval;
  
  })));
  // </Library>

	(new Sval({ecmaVer: 2019,sandBox:false})).run(codeToRun);	
};

BrowserAutomaton.processStateGetCode=function(elId,code,fnName,state){
	return "(function(){\r\n"+
				"var BrowserAutomaton={};\r\n"+
				"BrowserAutomaton.setState=function(state){\r\n"+
				"\tdocument.getElementById(\""+elId+"\").innerHTML=window.btoa(JSON.stringify(state));\r\n"+
                "\tdocument.getElementById(\""+elId+"\").click();\r\n"+
				"};\r\n"+
           		code+";\r\n"+
                "BrowserAutomaton.setState("+fnName+".call("+state+"));\r\n"+
    "})();\r\n";	
};

BrowserAutomaton.processStateCall=function(processCode,type,elId,code,fnName,state){
    var codeToRun =	processCode;
    if(type=="inline"){
		var el = document.createElement("script");
		el.textContent = codeToRun;
		(document.head||document.documentElement).appendChild(el);
		setTimeout(function(){
			(document.head||document.documentElement).removeChild(el);
		},3000);
		return;
	};
	if(type=="blob"){
		var el = document.createElement("script");
		var url = URL.createObjectURL(new Blob([codeToRun],{type: "application/javascript"}));
		el.src = url;
		(document.head||document.documentElement).appendChild(el);
		setTimeout(function(){
			(document.head||document.documentElement).removeChild(el);
			URL.revokeObjectURL(url);
		},3000);
		return;
	};
	if(type=="inline-nonce"){
		var nonce=null;
		var elScripts=document.getElementsByTagName("script");
		for(var k=0;k<elScripts.length;++k){
			if(elScripts[k].nonce){
				nonce=elScripts[k].nonce;
				break;
			};
		};
		var el = document.createElement("script");
		el.textContent = codeToRun;
		el.setAttribute("nonce",nonce);
		(document.head||document.documentElement).appendChild(el);
		setTimeout(function(){
			(document.head||document.documentElement).removeChild(el);
		},3000);
		return;
	};
	var codeToRun =	"(function(){\r\n"+
				"var BrowserAutomaton={};\r\n"+
				"BrowserAutomaton.setState=function(state){\r\n"+
				"\tvar trustedPolicy=trustedTypes.createPolicy(\"TrustedHTML\", {createScript(code) {return code;}});\r\n"+
				"\tdocument.getElementById(\""+elId+"\").innerHTML=trustedPolicy.createHTML(window.btoa(JSON.stringify(state)));\r\n"+
				"\tdocument.getElementById(\""+elId+"\").click();\r\n"+
				"};\r\n"+
				code+";\r\n"+
				"BrowserAutomaton.setState("+fnName+".call("+state+"));\r\n"+
			"})();\r\n";
	if(type=="trusted-inline"){
		var trustedPolicy=trustedTypes.createPolicy("TrustedScript", {
			createScript(code) {
				return code;
			}
		});
		var el = document.createElement("script");
		el.textContent = trustedPolicy.createScript(codeToRun);
		(document.head||document.documentElement).appendChild(el);
		setTimeout(function(){
			(document.head||document.documentElement).removeChild(el);
		},3000);
		return;
	};
	if(type=="trusted-inline-nonce"){
		var trustedPolicy=trustedTypes.createPolicy("TrustedScript", {
			createScript(code) {
				return code;
			}
		});
		var nonce=null;
		var elScripts=document.getElementsByTagName("script");
		for(var k=0;k<elScripts.length;++k){
			if(elScripts[k].nonce){
				nonce=elScripts[k].nonce;
				break;
			};
		};
		var el = document.createElement("script");
		el.textContent = trustedPolicy.createScript(codeToRun);
		el.setAttribute("nonce",nonce);
		(document.head||document.documentElement).appendChild(el);
		setTimeout(function(){
			(document.head||document.documentElement).removeChild(el);
		},3000);		
		return;
	};
};

BrowserAutomaton.processState=function(tabId,index,url,fnName,openerTabId){
	if(typeof(BrowserAutomaton.states[index])==="undefined"){
		return;
	};
	if(typeof(BrowserAutomaton.states[index].code)==="undefined"){
		return;
	};	
	BrowserAutomaton.states[index].state.index=index;
	BrowserAutomaton.states[index].state.id=tabId;
	BrowserAutomaton.states[index].state.parentId=openerTabId;
	BrowserAutomaton.states[index].state.url=url;
	BrowserAutomaton.states[index].state.version="3.5";
	chrome.scripting.executeScript({
		target:{tabId: tabId},
		func: BrowserAutomaton.initStateCall,			
		args: [
			index,
			BrowserAutomaton.elIdRun,			
			BrowserAutomaton.fnCheck			
		]
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
				if(typeof(BrowserAutomaton.states[index])==="undefined"){
					return;
				};
				var processFunc=BrowserAutomaton.processStateCall;
				var processCode=BrowserAutomaton.processStateGetCode(
					BrowserAutomaton.elIdRun,
					BrowserAutomaton.states[index].code,
					fnName,JSON.stringify(BrowserAutomaton.states[index].state));					
				if(BrowserAutomaton.states[index].state.type=="interpret"){
					processFunc=BrowserAutomaton.interpretCode;
				};
				chrome.scripting.executeScript({
					target:{tabId: tabId},
					func: processFunc,
					args: [
						processCode,
						BrowserAutomaton.states[index].state.type,
						BrowserAutomaton.elIdRun,
						BrowserAutomaton.states[index].code,
						fnName,
						JSON.stringify(BrowserAutomaton.states[index].state)
					],
					world: "MAIN"
				});				
			};
		};
	});
};

BrowserAutomaton.processStateCMD=function(cmd,args){
	if(cmd=="window.open"){
		window.open.apply(window,args);
	};
};

BrowserAutomaton.initCode=function(url,elId,fnCheck){
	var el=document.getElementById(elId);
	if(el){
		return "";
	};
	el=document.createElement("div");
	el.id = elId;
	el.style.display = "none";
	el.innerHTML = "";
	document.body.appendChild(el);
	el.addEventListener("click",function(){
		chrome.runtime.sendMessage({			
			message: "code",
			code: el.innerHTML,
			url: url,
			div: elId
		});
	})
	return fnCheck;
};

BrowserAutomaton.processCode=function(elId,fnName){
	var codeToRun =	"(function(){\r\n"+
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
				"\t\t\treturn;\r\n"+
				"\t\t};\r\n"+
				"\t\twindow.setTimeout(function(){\r\n"+
				"\t\t\tprocessEvent();\r\n"+
				"\t\t},1000);\r\n"+
				"\t\treturn;\r\n"+
				"\t};\r\n"+					  
				"\tdocument.getElementById(\""+elId+"\").innerHTML=retV;\r\n"+
				"\tdocument.getElementById(\""+elId+"\").click();\r\n"+
				"};\r\n"+
				"processEvent();\r\n"+
			"})();\r\n";
	var nonce=null;
	var elScripts=document.getElementsByTagName("script");
	for(var k=0;k<elScripts.length;++k){
		if(elScripts[k].nonce){
			nonce=elScripts[k].nonce;
			break;
		};
	};
	var el = document.createElement("script");
	el.textContent = codeToRun;
	el.setAttribute("nonce",nonce);
	(document.head||document.documentElement).appendChild(el);
	setTimeout(function(){
		(document.head||document.documentElement).removeChild(el);
	},3000);
};

BrowserAutomaton.processLink=function(tabId,url){
	chrome.scripting.executeScript({
		target:{tabId: tabId},
		func: BrowserAutomaton.initCode,
		args: [
			url,
			BrowserAutomaton.elId,
			BrowserAutomaton.fnCheck
		]		
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
				chrome.scripting.executeScript({
					target:{tabId: tabId},
					func: BrowserAutomaton.processCode,
					args: [
						BrowserAutomaton.elId,
						BrowserAutomaton.fnName						
					],
					world: "MAIN"
				});
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

BrowserAutomaton.processProtectCall=function(codeToRun, type){
	if(type=="inline"){
		var el = document.createElement("script");
		el.textContent = codeToRun;
		(document.head||document.documentElement).appendChild(el);
		setTimeout(function(){
			(document.head||document.documentElement).removeChild(el);
		},3000);
		return;
	};
	if(type=="blob"){
		var el = document.createElement("script");
		var url = URL.createObjectURL(new Blob([codeToRun],{type: "application/javascript"}));
		el.src = url;
		(document.head||document.documentElement).appendChild(el);
		setTimeout(function(){
			(document.head||document.documentElement).removeChild(el);
			URL.revokeObjectURL(url);
		},3000);
		return;
	};
	if(type=="inline-nonce"){
		var nonce=null;
		var elScripts=document.getElementsByTagName("script");
		for(var k=0;k<elScripts.length;++k){
			if(elScripts[k].nonce){
				nonce=elScripts[k].nonce;
				break;
			};
		};
		var el = document.createElement("script");
		el.textContent = codeToRun;
		el.setAttribute("nonce",nonce);
		(document.head||document.documentElement).appendChild(el);
		setTimeout(function(){
			(document.head||document.documentElement).removeChild(el);
		},3000);
		return;
	};
	if(type=="trusted-inline"){
		var trustedPolicy=trustedTypes.createPolicy("TrustedScript", {
			createScript(code) {
				return code;
			}
		});
		var el = document.createElement("script");
		el.textContent = trustedPolicy.createScript(codeToRun);
		(document.head||document.documentElement).appendChild(el);
		setTimeout(function(){
			(document.head||document.documentElement).removeChild(el);
		},3000);
		return;
	};
	if(type=="trusted-inline-nonce"){
		var trustedPolicy=trustedTypes.createPolicy("TrustedScript", {
			createScript(code) {
				return code;
			}
		});
		var nonce=null;
		var elScripts=document.getElementsByTagName("script");
		for(var k=0;k<elScripts.length;++k){
			if(elScripts[k].nonce){
				nonce=elScripts[k].nonce;
				break;
			};
		};
		var el = document.createElement("script");
		el.textContent = trustedPolicy.createScript(codeToRun);
		el.setAttribute("nonce",nonce);
		(document.head||document.documentElement).appendChild(el);
		setTimeout(function(){
			(document.head||document.documentElement).removeChild(el);
		},3000);		
		return;
	};
};

BrowserAutomaton.processProtect=function(state,details){
	if(state.protect){
		if(state.protect.code){
			if(Array.isArray(state.protect.url)){
				for(var m=0;m<state.protect.url.length;++m){
					if(BrowserAutomaton.matchString(details.url,state.protect.url[m])){
						var processFunc=BrowserAutomaton.processProtectCall;
						if(state.type=="interpret"){
							processFunc=BrowserAutomaton.interpretCode;
						};
						chrome.scripting.executeScript({
							target:{tabId: details.tabId, frameIds: [details.frameId]},
							func: processFunc,
							args: [state.protect.code, state.type],
							world: "MAIN"
						},function(results){
							const lastErr = chrome.runtime.lastError;
							if (lastErr){
								return;
							};
							BrowserAutomaton.states[state.index].state.protect.isProtected=true;
							BrowserAutomaton.saveStates();
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
							target:{tabId: details.tabId, frameIds: [details.frameId]},
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

chrome.runtime.onMessage.addListener(function(request, sender){
	BrowserAutomaton.loadStates(function(){
		if(sender.tab){
			if(typeof(request)!="undefined"){
				if(typeof(request)==="object"){
					if(request!=null){
						if(typeof(request.message)=="undefined"){
							return;
						};
						if(request.message=="code"){							
							var index;
							for(index=0;index<BrowserAutomaton.states.length;++index){								
								if(BrowserAutomaton.states[index].state.id==sender.tab.id){
									break;
								};
							};							
							BrowserAutomaton.states[index]={
								state:{
									index: index,
									id: sender.tab.id,
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
									},
									type: "inline",
									cmd: null,
									args: null
								},
								code: atob(request.code)
							};
							BrowserAutomaton.saveStates();
							BrowserAutomaton.processState(sender.tab.id,index,request.url,"init");
						};
						if(typeof(request.index)!="undefined"){
							if(request.message=="state"){
								var stateEncoded=atob(request.state);
								if(stateEncoded!="undefined"){
									var state=JSON.parse(stateEncoded);
									if(state.cmd){
										chrome.scripting.executeScript({
											target:{tabId: sender.tab.id},
											func: BrowserAutomaton.processStateCMD,
											args: [
												state.cmd,
												state.args
											]
										});
									}else{
										state.cmd=null;
										state.args=null;
										BrowserAutomaton.mergeObject(BrowserAutomaton.states[request.index].state,state);
										if(BrowserAutomaton.states[request.index].state.processEnd){
											delete BrowserAutomaton.states[request.index];
										};
										if(BrowserAutomaton.states[request.index].state.processEndAndKeepFirewall){
											BrowserAutomaton.states[request.index].code=undefined;
										};
										BrowserAutomaton.saveStates();
									};
								};
							};
						};
						if(typeof(request.div)!="undefined"){
							chrome.scripting.executeScript({
								target:{tabId: sender.tab.id},
								func: function(elId){
									var el=document.getElementById(elId);
									if(el){
										el.innerHTML="";
									};
								},
								args: [request.div]
							});
						};												
					};
				};
			};
		};
	});
});

