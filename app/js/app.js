/**
* Spotiyou extension chrome
* @loverajoel
**/

(function(){	

	var App = {
		init: function(){
			url = window.location.host;
			App.checkSite(url);
		},
		/**
		* verifies that is site
		* @param {string} url location
		* @return {function} redirect to method
		**/
		checkSite : function(url){
			if(url.indexOf("youtube") > -1) {
				return App.site.youtube.wsIs();
			}
		},
		site : {
			youtube : {
				wsIs : function(){
					if(document.querySelector('.watch')){
						App.site.youtube.s.detail();
					} else if (document.querySelector('.search')){
						App.site.youtube.s.search();
					}
				},
				s : {
					// section detail video
					detail : function(){
						var name = document.getElementById('eow-title').getAttribute('title').split('(')[0].split('[')[0];
						if(name.split('-').length > 1){
							var name = name.split('-')[0] + '-' + name.split('-')[1];
						}
						var item = document.getElementById('watch7-action-buttons');
						App.send.ajax({type:'track',title:name},App.site.youtube.button.pDetail,item)
					},
					// section search
					search : function(){
						var items = document.querySelectorAll('.context-data-item');
						var items = Array.prototype.slice.call(items);
						items.forEach(function(a){
							var name = a.querySelector('.yt-uix-tile-link').getAttribute('title').split('(')[0].split('[')[0];
							if(name.split('-').length > 1){
								var name = name.split('-')[0] + '-' + name.split('-')[1];
							}
							var item = a.querySelector('.ux-thumb-wrap');
							App.send.ajax({type:'track',title:name},App.site.youtube.button.pSearch,item)
						})

						if(document.querySelector('.watch-card-music')){
							if(document.querySelector('#watch-card-tab0')){
								var band = document.querySelector('.watch-card-music').querySelector('.watch-card-title').firstChild.firstChild.innerHTML;
								var items = document.querySelector('#watch-card-tab0').querySelectorAll('tr');
								var items = Array.prototype.slice.call(items);
								items.forEach(function(a){
									var name = a.firstChild.getAttribute('title').split('(')[0].split('[')[0];
									var name = band +' - '+ name;
									var item = a.firstChild.firstChild;
									App.send.ajax({type:'track',title:name},App.site.youtube.button.pSearchCard,item)
								})
							};

							if(document.querySelector('#watch-card-tab1')){
								var band = document.querySelector('.watch-card-music').querySelector('.watch-card-title').firstChild.firstChild.innerHTML;
								var items = document.querySelector('#watch-card-tab1').querySelectorAll('tr');
								var items = Array.prototype.slice.call(items);
								items.forEach(function(a){
									var name = a.firstChild.getAttribute('title').split('(')[0].split('[')[0];
									var name = band +' - '+ name;
									var item = a.firstChild.firstChild;
									App.send.ajax({type:'album',title:name},App.site.youtube.button.pSearchCard,item)
								})
							}
						}
					}
				},
				button : {
					/**
					* print button
					* @param {array}
					* @param {object}
					**/
					pDetail : function(r,a){
						if(r.info.num_results !=0 ){
							var _btn = document.createElement('a');
							_btn.setAttribute('class','spotify_musix');
							_btn.innerHTML = "Listen";
							_btn.addEventListener("click",function(){App.track('Detail')});
							_btn.href = r.tracks[0].href;
							a.appendChild(_btn);
						}
					},
					/**
					* print button
					* @param {array}
					* @param {object}
					**/
					pSearch : function(r,a){
						if(r.info.num_results !=0 ){
							var _btn = document.createElement('a');
							_btn.setAttribute('class','spotify_musix_search');
							_btn.href = r.tracks[0].href;
							_btn.addEventListener("click",function(){App.track('Search')});
							console.log(a)
							a.appendChild(_btn);
						}
					},
					/**
					* print button
					* @param {array}
					* @param {object}
					**/
					pSearchCard : function(r,a){
						if(r.info.num_results !=0 ){
							var _btn = document.createElement('a');
							_btn.setAttribute('class','spotify_musix_search_card');
							if(r.tracks){
								_btn.href = r.tracks[0].href;
							} else if (r.albums){
								_btn.href = r.albums[0].href;
							}
							_btn.addEventListener("click",function(){App.track('Search Card')});
							a.appendChild(_btn);
						}
					},

				}
			}
		},
		send : {
			/**
			* manage ajax connections
			* @param {object} object whit options
			* @param {string} name function callback
			* @param {string} item to add button *optional
			**/
			ajax : function(parameters, callback, item){
				var xhr;
				if(typeof XMLHttpRequest !== 'undefined'){
					xhr = new XMLHttpRequest();
				}else{
					var versions = ["MSXML2.XmlHttp.5.0","MSXML2.XmlHttp.4.0","MSXML2.XmlHttp.3.0","MSXML2.XmlHttp.2.0","Microsoft.XmlHttp"];
					for(var i = 0, len = versions.length; i < len; i++) { try { xhr = new ActiveXObject(versions[i]); break; } catch(e){} };
				}
			xhr.onreadystatechange = ensureReadiness;
			function ensureReadiness() {
				if(xhr.readyState < 4) { return }
					if(xhr.status !== 200) { return }
						if(xhr.readyState === 4) { 
							xhr = JSON.parse(xhr.responseText);
							callback(xhr,item);
						}
					}
					if(parameters.type == 'POST'){
						xhr.open(parameters.type ,url+method, true);
						xhr.setRequestHeader ("Content-type", "application/x-www-form-urlencoded");
						xhr.send(parameters.data);	
					} else {
						xhr.open('GET','http://ws.spotify.com/search/1/'+parameters.type+'.json?q='+parameters.title, true);
						xhr.send();
					}
			},
		},
		/**
		* track event analytics
		* @param {string} name event
		**/
		track : function(t){
			chrome.extension.sendRequest({name: "track", data : t});
		}
	};

	window.onload = App.init();

})()