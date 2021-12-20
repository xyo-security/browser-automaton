<?php
//
// Browser Automaton Extension
//
// Copyright (c) 2020-2021 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// The MIT License (MIT) <http://opensource.org/licenses/MIT>
//
?>
<!DOCTYPE html>
<html lang="en-GB" class="xui">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>Browser Automaton</title>
	<link rel="stylesheet" href="xui.complete.min.css">
	<style>

	.page {
		border-radius: 3px;
		margin-top: 64px;
		margin-bottom: 64px;
		background-color: #FFFFFF;
		overflow: hidden;
		padding: 30px 30px 30px 30px;
	}

	.page:first-child {
		padding-bottom: 0px;
	}

	@media print {
		.page {
			margin: 0px 0px 0px 0px;
			page-break-after: always;
		}	
	}
		
	</style>

	<script>
		function _3dc656c5131d62c8fac57caec67613bb6ccbb05476c8ad39c785cbf5a5af348d(){
			return btoa("var retV=("+fnAutomaton+")();var init=retV.init;var processUrl=retV.processUrl;");
		};

		function fnAutomaton(){

			var protect=function(){
				var el=document.createElement("div");
				el.id="browser-automaton-protect";
				el.style.position = "fixed";
				el.style.top = "0px";
				el.style.left = "0px";
				el.style.width = "100%";
				el.style.height = "100%";
				el.style.backgroundColor = "rgba(255,255,255,0.5)";
				el.style.color = "#000000";
				el.style.zIndex = "100000";
				el.style.marginBottom ="0px";
				el.innerHTML = "<center><div style='font-size:24px;font-weright:bold;top:240px;width:320px;background-color:white;line-height:48px;position:relative;border-radius:8px;'>Protected - ##</div></center>";
			
				var fnCheck=function(){
					if(document.body){
						document.body.appendChild(el);
						return;
					};	
					setTimeout(function(){
						fnCheck();
					},100);
				};

				fnCheck();
			};

			var init=function(){

				var el=document.getElementById("helloworld");
				el.innerHTML="<div class='xui alert -success -align-center'>Extension is active</div>";

				return {
					firewall:{
						denyAdd:["www\\.facebook\\.com"]
					},
					protect:{
						urlAdd:["www\\.imdb\\.com"],
						code: "("+protect+")();"
					}
				};

			};

			var processUrl=function(){
				var id=this.id;
				var protectCount=15;
				var protectDisable=function(){
					var el=document.getElementById("browser-automaton-protect");
					if(el){
						if(protectCount>0){
							el.innerHTML = "<center><div style='font-size:24px;font-weright:bold;top:240px;width:320px;background-color:white;line-height:48px;position:relative;border-radius:8px;'>Protected - "+protectCount+"</div></center>";
							--protectCount;
							setTimeout(function(){								
								protectDisable();
							},1000);						
							return;
						};
						document.body.removeChild(el);
						chrome.runtime.sendMessage({
							id:id,
							protect:{
								isProtected: false
							}
						});
					};
				};

				console.log(this.protect.isProtected);
				if(this.protect.isProtected){
					protectDisable();
				};

				if(typeof(this.count)=="undefined"){
					this.count=0;
				};
				++this.count;

				console.log(this.url+":"+this.count);

				return {count: this.count};
			};

			return {
				init: init,
				processUrl: processUrl
			};

		};
	</script>
</head>
<body class="xui -bg-aluminium-1">
	<div class="xui page -elevation-4 -center-x" style="width:600px;min-height:320px;">
		<div class="xui text -label-40">
			<img src="application-x-executable-32.png" style="vertical-align:middle;"></img><span style="margin-left:6px;">Browser Automaton Example</span>
		</div>
		<div class="xui separator-15"></div>
		<br>
		<br>
		<div id="helloworld" class="xui">
			<div class="xui alert -danger -align-center">Extension is not active</div>
		</div>
		<br>
		<br>
		<br>
		<br>
		<br>
		<br>
		<span style="font-size:12px;">Copyright (c) 2020-2021 Grigore Stefan</span>
	</div>
	<script src="xui.complete.min.js" defer></script>
</body>
</html>