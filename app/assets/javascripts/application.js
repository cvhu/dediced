var KEY = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    ESCAPE: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    NUMPAD_ENTER: 108,
    COMMA: 188
};

var urlReg = /^(\s)*(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;




jQuery.fn.newPost = function(){
	var selector = this;
	// $(selector).text('');
	$(selector).hide();
	var cancel_button = $('<a href="#" class="cancel"> [x]</a>');
	var instruction = $("<div id='add_new_instruction'>Add a New Post:</div>");
	var url_input = $('<input id="post_url" name="yum[url]" size="20" type="text" />');
	$(url_input).prepopulateElement("http://example.com");
	var go_button = $('<a href="#" id="go_button"> next </a>');			
	$(selector).text('');
	var wrapper = $('<div id="add-new-form-wrapper"></div>');
	$(selector).append(cancel_button).append(instruction).append(url_input).append(go_button).append(wrapper).fadeIn();
	
	
	$(url_input).keypress(function(event){
		if (event.keyCode == 13){
			fetchURL();
		}
	});			
	
	$(go_button).click(function(e){
		e.preventDefault();
		fetchURL();
	});
	
	
	function fetchURL(){
		var url = $(url_input).val();		
		if(!urlReg.test(url)){
			url = "http://"+ url;
		}
		$(url_input).val(url);
		$.ajax({
			url: "/cdhttp.json",
			data: {'uri': url},
			// url: url,
			beforeSend: function(){
				$(url_input).addClass('progress');
			},
			success: function(data){
				$(go_button).html('redo');
				$(url_input).removeClass('progress');
				// $(url_input).hide();
				// $(go_button).hide();	
				var post_preview = $('<div id="post_preview"></div>').html(data);
				var post_form = $('<div id="new_post_form" class="form"></div>');
				$(post_preview).buildCoverFlow(data, url);
				$(post_form).newPostForm(data.title, url);
				$(wrapper).hide();
				// var restart_button = $('<a id="restart_button" href="#"><< start over</a>');
				// $(restart_button).click(function(e){
				// 	e.preventDefault();
				// 	$(selector).newPost();
				// })						
				$(wrapper).empty().append(cancel_button).append(post_preview).append(post_form);
				$("#tag_tokens").tokenInput("/tags.json", {
				    crossDomain: false,
				    prePopulate: $("#tag_tokens").data("pre"),
					theme: 'dealicious',
					allowCreation: true
			  	});
				$("#tag_tokens").populateInputHint('at least one area is required', -1);
				$("#tag_tokens").prepopulateTokenElement('add area...');				
				$(wrapper).fadeIn();	
				
				$(url_input).keyup(function(){
					$(wrapper).empty();
				})
			}
		});
	}
	
	return $(selector).parent();
	
};

jQuery.fn.newPostForm = function(title, url){
	var selector = this;
	var display_url = $('<div id="display_url"></div>').text(url);
	var name_input = $('<input id="post_name" name="yum[name]" size="40" type="text" />').val(title);
	$(name_input).prepopulateElement("Post Title");
	$(name_input).populateInputHint('title cannot be blank', -1);
	$(name_input).blur(function(){
		$(this).defineRequired('enter a name');
	});
	$(name_input).keyup(function(){
		$(this).validatesLength(40);
	});
	
	var tag_tokens = $('<input data-pre="[]" id="tag_tokens" name="yum[tag_tokens]" size="30" type="text" />');
	
	var review_limit = 274;
	var review_input = $('<textarea cols="40" id="post_review" name="yum[review]" rows="4"></textarea>');
	$(review_input).prepopulateElement('Want to be the first one to comment on this post?');
	$(review_input).populateInputHint(review_limit+' characters remaining', 0);
	$(review_input).keyup(function(){
		$(this).validatesLength(review_limit);
	});
	var submit_button = $('<a href="#" id="post_create_button" class="submit_button"> submit </a>');		
	$(submit_button).click(function(e){
		e.preventDefault();
		// closeDialog($(selector).parent());
		var name = $(name_input).returnOnlyIfValid();
		var tags = $(tag_tokens).returnOnlyIfValid();
		var review = $(review_input).returnOnlyIfValid();
		var yumJSON = {
			"name": name,
			"url": url,
			"tag_tokens":tags,
			"review":review
		};
		
		var cover_img = $('.focused_cover').find('img');
		if (cover_img.length > 0){
			var img = new Image();
			var src = $(cover_img).attr('src');
			img.src = src;
			if (img.height > img.width){
				var w = Math.round(img.width/img.width*100)+'%';
				var h = Math.round(img.height/img.width*100)+'%';
			}
			else{
				var w = Math.round(img.width/img.height*100)+'%';
				var h = Math.round(img.height/img.height*100)+'%';
			}
			var imgJSON = {
				"uri": $(cover_img).attr('src'),
				"x": '-10',
		      	"y": '-10',
		      	"w": ''+w,
		      	"h": ''+h
			};			
		}		
		
		var jsonData = {'yum':yumJSON, 'img':imgJSON};
		// alert(JSON.stringify(jsonData, null, 2));
		$('#restart_button').remove();
		$('#post_preview').remove();
		$.ajax({
			url: "/create_yum.json", 
			data: {'yum':yumJSON, 'img':imgJSON}, 
			beforeSend: function(){
				$(selector).empty().loading();
			},
			success: function(data){
				$(selector).unloading().loadYumProfile(data.yum_api.yum.token);;				
				// slideOverToYumProfile(data.yum_api.yum.token);
				// openYum(data.yum_api.yum.token);
				
			}		
		});	
	});
	$(selector).text('').append(display_url).append(name_input).append(tag_tokens).append(review_input).append(submit_button);			
	
}

jQuery.fn.buildCoverFlow = function(data, url){
	var selector = this;
	var cover_preview = $('<div id="cover_preview"></div>')
	var text_cover = $("<div id='text_cover' class='post_cover'></div>").append($("<div class='page_title'></div>").text(data.title)).css('background', '#f80');
	$(cover_preview).append(text_cover);
	$.each(data.img, function(i, src){
		if(!urlReg.test(src)){
			src = url + src
		}
		var img = new Image();
		img.src = src;
		// $("#yum_url_preview").append(src);																		
		if (!((img.width/(0.0+img.height)>2.5)||(img.width/(0.0+img.height)<1/2.5)||(img.width*img.height < 1000)||(img.width*img.height>10000000))){
			if (img.width> img.height){
				var cover = $('<div class="post_cover"></div>').append($('<img height="150px"/>').attr('src',src));
			}
			else{
				var cover = $('<div class="post_cover"></div>').append($('<img width="150px"/>').attr('src',src));
			}
			$(cover_preview).append(cover);
		}
	});
	var total = $(cover_preview).find(".post_cover").length;			
	if (total>1){
		var cover_count = $("<div id='cover_count'><span id='count'>"+1+"</span>/<span id='total'>"+total+"</span></div>");
		var left = $('<a href="#" id="left_button"><img src="/assets/left_grey.png"/></a>');
		var right = $('<a href="#" id="right_button"><img src="/assets/right_grey.png"/></a>');
		$(left).hover(
			function(){
				$(this).find("img").attr("src", "/assets/left.png");
			},
			function(){
				$(this).find("img").attr("src", "/assets/left_grey.png");
			});
		$(right).hover(
			function(){
				$(this).find("img").attr("src", "/assets/right.png");
			},
			function(){
				$(this).find("img").attr("src", "/assets/right_grey.png");
			});
		$(left).click(function(e){
			e.preventDefault();
			var check = $('.focused_cover').prev();
			if ($(check).length ==0){
				$(selector).find('.post_cover:last').showCover();
				$("#count").text($("#total").text());
			}
			else{
				$(check).showCover();
				$("#count").text(parseInt($("#count").text())-1);
			}
		});
		$(right).click(function(e){
			e.preventDefault();
			var check = $('.focused_cover').next();
			if ($(check).length ==0){
				$(selector).find('.post_cover:first').showCover();					
				$("#count").text(1);
			}
			else{
				$(check).showCover();
				$("#count").text(parseInt($("#count").text())+1);
			}

		});
		$(selector).append(left).append(cover_preview).append(right).append(cover_count);
	}
	else{
		$(selector).append(cover_preview);
	}
	$(selector).find("#text_cover").next().showCover();
}

jQuery.fn.showCover = function(){
	var selector = this;
	$(selector).siblings(".post_cover").removeClass('focused_cover').hide();			
	$(selector).addClass('focused_cover').show();
}

function rateYum(yum_id, act){
	$('#scorediff').remove();
	var scoreDiv = $('<div id="scorediff"></div>').appendTo('body');
	$.ajax({
		url: "/create_rating",
		data: {'yum_id':yum_id, 'act':act},	
		beforeSend: function(){
			$(scoreDiv).text('loading...').addClass('progress');
		},
		success: function(data){
			$(scoreDiv).empty().removeClass('progress');
			if (parseInt(data.value) > 0){
				$(scoreDiv).append($('<img src="/assets/up.png" height="30px"/>')).append($('<div class="scorediff_title">uped</div>').css('color', '#0a0'));
			}else{
				if (parseInt(data.value) < 0){
					$(scoreDiv).append($('<img src="/assets/down.png" height="30px"/>')).append($('<div class="scorediff_title">downed</div>').css('color', '#f00'));
				}else{
					$(scoreDiv).append($('<div class="scorediff_title">unvoted</div>'));
				}
			}
			
			$.each(data.scorediff, function(i, diff){
				var scorediff_item = $('<div class="scorediff_item"></div>');
				var after = $('<div class="after_score"> </div>').html((diff.after*100).toFixed(1)+'%').paintScoreColor(diff.after);
				var diff_score = diff.after - diff.before;
				if (diff_score > 0){
					var diff_div = $('<div class="diff_score"></div>').html('(+'+(diff_score*100).toFixed(1)+'%)').css('color', '#0a0');
				}else{
					var diff_div = $('<div class="diff_score"></div>').html('(-'+(diff_score*100).toFixed(1)+'%)').css('color', '#f00');
				}
				
				var area_div = $('<div class="scorediff_area"></div>').html(diff.area);
				$(scorediff_item).append(after).append(diff_div).append(area_div);
				$(scoreDiv).append(scorediff_item);
			});
			$(scoreDiv).hide().fadeIn();//.delay(5000).fadeOut();
		}
	});
}

function rateComment(comment_id, act){
	$.ajax({
		url: "/create_comment_rating",
		data: {'comment_id':comment_id, 'act':act},		
	});
}

function openYum(token){
	var yum_wrapper = $('<div id="yum-wrapper" class="dialog"></div>').html('<a href="#" class="cancel"> [x]</a>');
	$(yum_wrapper).loadYumProfile(token);
	openDialogWithoutClone(yum_wrapper);
}


function openDialog(selector){
	$(selector)
		.clone()
		.show()
		.appendTo('#overlay')
		.parent()
		.fadeIn('fast')
		.find(".dialog")
		.show();
}

function openDialogWithoutClone(selector){
	$(selector)
		.find('.ok, .cancel')
		.live('click', function(){
			closeDialog(this);
		})
		.end()
		.find('.ok')
		.live('click', function(){
		})
		.end()
		.find('.cancel')
		.live('click', function(){
	});
	$(selector)
		.show()
		.appendTo('#overlay')
		.parent()
		.fadeIn('fast')
		.find(".dialog")
		.show();
}

function openNewPost(selector){
	$(selector)
		.find('.ok, .cancel')
		.live('click', function(){
			closeDialog(this);
		})
		.end()
		.find('.ok')
		.live('click', function(){
		})
		.end()
		.find('.cancel')
		.live('click', function(){
	});
	
	$(selector)
		.addClass('dialog')
		.clone()
		.show()
		.appendTo('#overlay')
		.find('#add_new').newPost()
		.parent()
		.fadeIn('fast')
		.find(".dialog")
		.show();
}

function openAuthenticationRequest(selector){
	$(selector)
		.find('.ok, .cancel')
		.live('click', function(){
			closeDialog(this);
		})
		.end()
		.find('.ok')
		.live('click', function(){
		})
		.end()
		.find('.cancel')
		.live('click', function(){
	});
	
	$(selector)
		.addClass('dialog')
		.clone()
		.show()
		.appendTo('#overlay')
		.parent()
		.fadeIn('fast')
		.find(".dialog")
		.show();
}




function closeDialog(selector){
	$(selector)
		.parents('#overlay')
		.fadeOut('fast', function (){
			$(this)
				.find(".dialog")
				.remove();
		});
}

function closeYumDialog(selector){
	$('#yum_frame').text('');
	$('#main_frame').hide();
	$(selector)
		.parents('#overlay')
		.fadeOut('fast', function (){
			$(this)
				.find(".dialog")
				.remove();
		});
}

jQuery.fn.authorityScore = function(user_id, area){	
	var wrapper = this;
	
	// alert($("#auth_score").attr('score'));
	$.ajax({
		url: "/user/authors.json?user_id="+user_id+"&area_name="+area,
		beforeSend: function(){
			$(wrapper).addClass('center_progress');
		},
		error: function(){
			$(wrapper).removeClass('center_progress');
			$(wrapper).text('error');
		},
		success: function(data){
			// var current_score = $("#auth_score").attr('score');
			var current_score = parseFloat($("#auth_score").attr('score'));
			$(wrapper).removeClass('center_progress');
			if (data.uped==0 && data.downed==0){
				$(wrapper).html('<span class="nan">unrated</span>');
				var score = 0.5;
			}else{
				var score = (1+data.uped)/(data.uped+data.downed+2.0);
				$(wrapper).text((score*100).toFixed(0)+'%');	
			}			

			current_score = current_score*score;
			var len = parseInt($("#auth_score").attr('len'));
			var final_score = Math.pow(current_score, 1.0/len);
			
			// alert(current_score);			
			$('#auth_score').text((final_score*100).toFixed(0)+'%').attr('score', ''+current_score);
		}
	});
}

jQuery.fn.interestScore = function(user_id, area){	
	var wrapper = this;
	
	// alert($("#auth_score").attr('score'));
	$.ajax({
		url: "/user/interests.json?user_id="+user_id+"&area_name="+area,
		beforeSend: function(){
			$(wrapper).addClass('center_progress');
		},
		error: function(){
			$(wrapper).removeClass('center_progress');
			$(wrapper).text('error');
		},
		success: function(data){
			// var current_score = $("#auth_score").attr('score');
			var current_score = parseFloat($("#interest_score").attr('score'));
			$(wrapper).removeClass('center_progress');
			if (data.ups==0 && data.downs==0){
				$(wrapper).html('<span class="nan">unrated</span>');
				var score = 0.5;
			}else{
				var score = (1+data.ups)/(data.ups+data.downs+2.0);
				$(wrapper).text((score*100).toFixed(0)+'%');	
			}			

			current_score = current_score*score;
			var len = parseInt($("#interest_score").attr('len'));
			var final_score = Math.pow(current_score, 1.0/len);
			
			// alert(current_score);			
			$('#interest_score').text((final_score*100).toFixed(0)+'%').attr('score', ''+current_score);
		}
	});
}
// load the full view of yum to the current selector, based on input JSON data
jQuery.fn.loadYum = function(data, score){
	var wrapper = this;
	var yum = $('<div class="yum"></div>');
	$(wrapper).append(yum);
	$(yum).append($('<a href="#" class="cancel">[x]</a>'));	
	$(yum)
		.find('.ok, .cancel')
		.live('click', function(){
			closeYumDialog(this);
		})
		.end()
		.find('.ok')
		.live('click', function(){
		})
		.end()
		.find('.cancel')
		.live('click', function(){
	});
	
	var content = $('<div class="yum_content"></div>');
	var name = $('<div class="yum_content_name"></div>').text(data.yum.name);
	$(content).append(name);
	var qrurl = "http://dediced.com/qr/"+data.yum.token;
	var url = $('<div class="yum_content_url link"></div>').append($('<a target="_blank">page link</a>').attr('href', qrurl));
	$(content).append(url);
	$(yum).append(content);
	

	var left = $('<div class="left250"></div>');
	
	if ((data.imgsrc=='/assets/default.png')|(data.imgsrc=='/images/default.png')|(data.imgsrc.length == 0)){
		var cover = $("<div id='text_cover' class='post_cover'></div>").append($("<div class='page_title'></div>").text(data.yum.name)).paintScoreCover(score);
	}
	else{
		var cover = $('<img/>').attr('src',data.imgsrc).attr('style', data.imgcss);
	}	
	$(left).append($('<div class="full250"></div>').html(cover));
	
	// var stats = $('<div class="stats"></div>');
	// $(stats).append($('<div class="total_uped"></div>').text(data.rating.total.ups).append($('<div class="subscript">up</div>')));
	// $(stats).append($('<div class="total_downed"></div>').text(data.rating.total.downs).append($('<div class="subscript">down</div>')));
	var scores = $('<table id="post_score"></table');
	var tags_len = data.tags.length;
	var total_score = $('<tr></tr>').append($('<td></td>').append($('<div class="stats"></div>').append($('<div id="auth_score"></div>').attr('score','1.0').attr('len',tags_len).text(100+'%')).append($('<div class="subscript">authority</div>'))))
		.append($('<td></td>').append($('<div class="stats"></div>').append($('<div  id="interest_score"></div>').attr('score','1.0').attr('len',tags_len).text(100+'%')).append($('<div class="subscript">interest</div>'))))
		.append($('<td></td>').append($('<div class="stats total_uped"></div>').text(data.rating.total.ups).append($('<div class="subscript">up</div>')))
							  .append($('<div class="total_downed stats"></div>').text(data.rating.total.downs).append($('<div class="subscript">down</div>'))));
	$(scores).prepend(total_score);
	$(left).append(scores);
	
	var qrtext = '/q/'+data.yum.token;
	var qrcode = $('<img/>').attr('src','https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl='+qrurl+'&choe=UTF-8');
	$(left).append($('<a></a>').attr('href',qrtext).append(qrcode));
	$(yum).append(left);
	for (var i = 0;i<tags_len;i++){
		var row = $('<tr></tr>');
		var area = $('<td></td>').append($('<a class="yum_content_tag"></a>').attr('href','/area/'+data.tags[i].name).append(data.tags[i].name));
		var auth = $('<td class="a_score"></td>').text('n/a');
		var interest = $('<td class="i_score"></td>').text('n/a');
		$(row).append(auth).append(interest).append(area);
		$(scores).append(row);
		$(auth).authorityScore(data.yum.user_id, data.tags[i].name);
		$(interest).interestScore($('#user_profile').attr('user_id'), data.tags[i].name);
	}
	
	
	var right = $('<div class="right500"></div>');
	var review = $('<div class="yum_review"></div>');
	
	var user = $('<div class="yum_review_user"></div>');
	var badge = $('<div class="user_badge"></div>');
	var thumbnail = $('<div class="thumbnail50"></div>').append($('<img/>').attr('src',data.user.gravatar25));
	$(badge).append(thumbnail);
	var info = $('<div class="user_info"></div>').text(data.user.name);
	$(badge).append(info);
	$(user).append(badge);
	$(review).append(user);
	
	var review_content = $('<div class="yum_review_content"></div>').prepend($('<span/>').text(data.yum.review));
	var review_timestamp = $('<div class="yum_review_timestamp"></div>').text(data.yum.created_at);
	$(review_content).append(review_timestamp);
	$(review).append(review_content);
	
	$(review).loadComments(data.yum.id);
	$(right).append(review);
	
	$(yum).append(right);

	
	

}


jQuery.fn.loadYumletsPage = function(current_page, base_url){
	var selector = this;	
	var load_icon = $(selector).find("#load_more");
	$.ajax({
		url: base_url+"?current_page="+current_page, 
		beforeSend: function(){
			$(load_icon).addClass('center_progress');
		},
		success: function(data){
			$(load_icon).remove().fadeOut();
			for (var i = 0; i < 16; i++){
				$(selector).loadDefaultYumlet(data.api[i]);
			};
			if (data.more_pages==1){						
				$(selector).loadMorePages(current_page, base_url);
			}													
		}
	});
}

jQuery.fn.loadMorePages = function(current_page, base_url){
	var load_button = $('<a id="load_more" href="#">load more</a>');
	var selector = this;
	$(selector).append(load_button);
	$(load_button).click(function(e){
		e.preventDefault();
		$(this).remove();
		var load_more = $('<div id="load_more">loading...</div>');
		$(selector).append(load_more);
		$(selector).loadYumletsPage(current_page+1, base_url);
	});
}

jQuery.fn.loadShakeYumlet = function(api){
	var wrapper = this;
	var shake_unit = $('<div class="shake_unit"></div>').attr('score', api.score);
	var shake_units = $(wrapper).find('.shake_unit');
	$(shake_unit).loadYumlet(api.yum_api, api.score);
	$(shake_unit).append($('<div class="yumlet_i_score"></div>').text((api.score*100).toFixed(1)+'%')
															 .paintScore(api.score));
															
	if (shake_units.length==0){
		// alert(shake_units.length+'not working');
		$(wrapper).append(shake_unit);		
	}else{
		$.each( shake_units, function(i, unit){
			if (parseFloat($(unit).attr('score')) < api.score){
				// alert(shake_units.length+": "+i + '('+api.score+'/'+$(unit).attr('score')+')');
				$(shake_unit).insertBefore(unit);
				// $(wrapper).prepend(shake_unit);
				return false;
			}else{
				if (i == (shake_units.length-1)){
					$(wrapper).append(shake_unit);
				}
			}
		});	
	}
	// $(wrapper).append(shake_unit);
}

jQuery.fn.loadDefaultYumlet = function(api){
	var wrapper = this;
	var shake_unit = $('<div class="shake_unit"></div>').attr('score', api.score);
	var shake_units = $(wrapper).find('.shake_unit');
	$(shake_unit).loadYumlet(api.yum_api, api.score);
	$(shake_unit).append($('<div class="yumlet_i_score"></div>').text((api.score*100).toFixed(1)+'%')
															 .paintScore(api.score));
															
	$(wrapper).append(shake_unit);		
}

jQuery.fn.loadMoreShakes = function(user_id, current_page){
	var load_button = $('<a id="load_more" href="#"> more shakes! </a>');
	
	var wrapper = this;
	$(wrapper).prepend(load_button);
	$(load_button).click(function(e){
		e.preventDefault();
		$(this).remove();
		var load_more = $('<div id="load_more">loading... </div>');
		$(wrapper).prepend(load_more);
		$(wrapper).loadShake(user_id, current_page + 1);
	});
}

jQuery.fn.loadMoreSearch = function(q, current_page){
	var load_button = $('<a id="load_more" href="http://google.com"> load more! </a>');	
	var wrapper = this;
	$(wrapper).append(load_button);	
	$(load_button).click(function(e){
		e.preventDefault();
		$(this).remove();
		var load_more = $('<div id="load_more">loading... </div>');
		$(wrapper).append(load_more);
		$(wrapper).loadSearch(q, current_page + 1);
	});
}


jQuery.fn.paintScoreColor = function(score){
	$(this).css('color', 'hsl('+(Math.log(2.0-score)*360)+', 70%, 50%)');
	return this;
}



jQuery.fn.loadYumlet = function(data, score){
	var selector = this;
	var yumlet = $('<div class="yumlet"></div>');
	var content = $('<div class="yum_content"></div>');
	var title_limit = 70;
	if (data.yum.name.length > title_limit){
		var title_text = data.yum.name.substring(0,title_limit) +'...';
	}else{
		var title_text = data.yum.name;
	}
	var name = $('<div class="yum_content_name"></div>').text(title_text);
	$(content).append(name);
	var url = $('<div class="yum_content_url link"></div>').append($('<a target="_blank">link</a>').attr('href', data.yum.url));	
	$(content).append(url);
	
	var tags = $('<div class="yum_content_tags"></div>');
	if (data.tags.length>0){
		var area = $('<a class="yum_content_tag"></a>').attr('href','/area/'+data.tags[0].name).append(data.tags[0].name);
		$(tags).append(area);	
		$(content).append(tags);
		if (data.tags.length>1){
			var more_area = $('<div class="more_areas"></div>').text('+'+ (data.tags.length - 1)+' areas');
			var tooltip = $('<div class="tooltip"></div>');
			for (var i = 1;i<data.tags.length;i++){
				var area = $('<a class="yum_content_tag"></a>').attr('href','/area/'+data.tags[i].name).append(data.tags[i].name);
				$(tooltip).append(area);
			}
			$(content).append(more_area);
			$(more_area).append(tooltip);
			$(more_area).buildTooltip();
		}		
	}

	var buttons = $('<div class="rate_buttons"></div>');	
	$(buttons).feedbackButtons(data, score);
	$(content).append(buttons);
	
	
	$(yumlet).append(content);	
	
	if ((data.imgsrc=='/images/default.png')|(data.imgsrc.length == 0)){
		var cover = $("<div id='text_cover' class='post_cover'></div>").append($("<div class='page_title'></div>").text(title_text)).paintScoreCover(score);
	}
	else{
		
		
		var img = new Image();
		img.src = data.imgsrc;
		// $("#yum_url_preview").append(src);																		
		if (img.width > img.height){
			var cover = $('<div class="post_cover"></div>').append($('<img height="150px"/>').attr('src',data.imgsrc));
		}
		else{
			var cover = $('<div class="post_cover"></div>').append($('<img width="150px"/>').attr('src',data.imgsrc));
		}
			// $(cover_preview).append(cover);
		
		// var cover = $('<img/>').attr('src',data.imgsrc).attr('style', data.imgcss);
	}
	
	var image = $('<div class="yum_image"></div>');
	var thumbnail = $('<div class="thumbnail150"></div>');
	
	$(thumbnail).append(cover);
	$(image).append(thumbnail);
	$(yumlet).append(image);
	
	$(content).hide();
	$(yumlet).hoverIntent(
		function(){
			$(image).hide();
			$(content).fadeIn();
		}, function(){
			$(content).hide();
			$(image).fadeIn();
		});
	
	$(yumlet).hide();
	$(selector).append(yumlet);
	$(yumlet).fadeIn('slow');
}

jQuery.fn.buildTooltip = function(){
	var selector = this;
	var tooltip =  $(selector).find('.tooltip');
	$(tooltip).hide();
	$(selector).hover(
		function(){
			$(tooltip).fadeIn('fast');			
		}, function(){
			$(tooltip).fadeOut('fast');	
		}
	);
}

jQuery.fn.loadYumlets = function(data){
	var yums = this;
	$.each(data, function(i, yum){
		$(yums).loadYumlet(yum);
	});
}



jQuery.fn.paintArea = function( count, total){
	var area = this;
	$(area).css('border', '3px solid hsl(0, '+count/total*100+'%, 50%)');
	$(area).css('background', 'hsl(0, '+count/total*100+'%, 70%)');
	// $(area).attr('title', 'test');
	// $(area).find('[title]').tooltip();
};

function loadProfileTopFive(user_id){
	var wrapper = $('#container>.right-column');
	var strengths = $('<div id="user-profile-strengths"></div>').appendTo(wrapper);
	var strengths_title = $('<div id="user-profile-strengths-title"></div>').html('Related Areas').appendTo(strengths);
	var strengths_content = $('<div id="user-profile-strengths-content"></div>').appendTo(strengths);
	$.ajax({
		url: '/api/user/strengths.json?user_id='+user_id,
		beforeSend: function(){
			$(strengths_content).html('loading...');
		},
		success: function(data){
			$(strengths_content).html('');
			var areas = $('<div id="search-relevant-areas"></div>').appendTo(strengths_content);
			var related_areas_title = $('<div id="search-related-areas-title"></div>').appendTo(areas);
			$.each(data, function(i,v){
				var area = $('<a class="search-relevant-area"></a>').paintScore(v.score).attr('score', v.score).appendTo(areas).attr('href', '/area/'+v.area);
				$('<div class="search-relevant-area-name"></div>').html(v.area).appendTo(area);
			})			
		}
	});
	
	// 
	// var topInterests = $('<table id="top_interests"></table>');
	// $(wrapper).append($('<div id="top_interests_section"></div>').append($('<div class="table_title">Top Interests</div>')).append(topInterests));
	// $.ajax({
	// 	url: '/user/interestsList.json?user_id='+user_id,
	// 	beforeSend: function(){
	// 		$(topInterests).text('loading...   ').addClass('progress');
	// 	},
	// 	success: function(data){
	// 		$(topInterests).text('').removeClass('progress');
	// 		$('<div class="i_score">'+(data.score*100).toFixed(0)+'%</div>').insertBefore('#top_interests');
	// 		for (var i = 0; i < 5; i++){
	// 			var area = data.list[i];
	// 			var area_cell = $('<td></td>').html($('<a class="area"></a>').attr('href','/area/'+data.list[i].area_name).html(data.list[i].area_name));
	// 			var score_cell = $('<td class="score"></td>').text((area.score*100).toFixed(0)+'%');
	// 			var row = $('<tr></tr>').append(score_cell).append(area_cell);
	// 			$(topInterests).append(row);
	// 		}
	// 		var more_button = $('<tr><td></td><td><a href="#more" class="more_button">show more</a></td></tr>');
	// 		$(topInterests).append(more_button);
	// 		$(more_button).click(function(e){
	// 			e.preventDefault();
	// 			var dialog = $('#dialog_wrapper').clone();
	// 			$(dialog).addClass('dialog');
	// 			$(dialog).loadFullProfileInterests(data.list);
	// 			$(dialog).show()
	// 				.appendTo("#overlay")
	// 				.parent()
	// 				.fadeIn('fast');
	// 			$(".dialog").show();
	// 			
	// 		});
	// 		
	// 	}
	// });
}



jQuery.fn.loadFullProfileAuthors = function(data){
	var wrapper = this;
	var yum = $('<div id="dialog"></div>');
	$(wrapper).append(yum);
	$(yum).append($('<a href="#" class="cancel">[x]</a>'));	
	$(yum)
		.find('.ok, .cancel')
		.live('click', function(){
			closeYumDialog(this);
		})
		.end()
		.find('.ok')
		.live('click', function(){
		})
		.end()
		.find('.cancel')
		.live('click', function(){
	});
	var topAuthors = $('<table id="top_authors"></table>');
	$(yum).append('<div class="section_title">Top Experts</div>').append(topAuthors);
	for (var i = 0; i < data.length; i++){
		var area = data[i];
		var area_cell = $('<td></td>').html($('<a class="area"></a>').attr('href','/area/'+data[i].area_name).html(data[i].area_name));
		var score_cell = $('<td class="score"></td>').text((area.score*100).toFixed(0)+'%');
		var row = $('<tr></tr>').append(score_cell).append(area_cell);
		$(topAuthors).append(row);
	}
}


jQuery.fn.loadFullProfileInterests = function(data){
	var wrapper = this;
	var yum = $('<div id="dialog"></div>');
	$(wrapper).append(yum);
	$(yum).append($('<a href="#" class="cancel">[x]</a>'));	
	$(yum)
		.find('.ok, .cancel')
		.live('click', function(){
			closeYumDialog(this);
		})
		.end()
		.find('.ok')
		.live('click', function(){
		})
		.end()
		.find('.cancel')
		.live('click', function(){
	});
	var topInterests = $('<table id="top_interests"></table>');
	$(yum).append('<div class="section_title">Top Interests</div>').append(topInterests);
	for (var i = 0; i < data.length; i++){
		var area = data[i];
		var area_cell = $('<td></td>').html($('<a class="area"></a>').attr('href','/area/'+data[i].area_name).html(data[i].area_name));
		var score_cell = $('<td class="score"></td>').text((area.score*100).toFixed(0)+'%');
		var row = $('<tr></tr>').append(score_cell).append(area_cell);
		$(topInterests).append(row);
	}
}

jQuery.fn.loadAreaTopFive = function(area_name){
	var wrapper = this;
	var topAuthors = $('<table id="top_authors"></table');
	$(wrapper).append($('<div id="top_authors_section"></div>').append($('<div class="table_title">Top Experts</div>')).append(topAuthors));
	$.ajax({
		url: '/tag/authorsList.json?area_name='+area_name,
		beforeSend: function(){
			$(topAuthors).text('loading...   ').addClass('progress');
		},
		success: function(data){			
			$(topAuthors).text('').removeClass('progress');
			$('<div class="a_score">'+(data.score*100).toFixed(0)+'%</div>').insertBefore('#top_authors');
			if (data.list.length > 5){
				var limit = 5;
			}else{
				var limit = data.list.length;
			}
			for (var i = 0; i < limit; i++){
				var area = data.list[i];
				var area_cell = $('<td></td>').html($('<div class="user"></div>').html('<img src="'+data.list[i].user_gravatar25+'"/>'+'<a href="/users/'+data.list[i].user_id+'">'+data.list[i].user_name+'</a>'));
				var score_cell = $('<td class="score"></td>').text((area.score*100).toFixed(0)+'%');
				var row = $('<tr></tr>').append(score_cell).append(area_cell);
				$(topAuthors).append(row);
			}
			
			if (data.list.length > 5){				
				var more_button = $('<tr><td></td><td><a href="#more" class="more_button">show more</a></td></tr>');
				$(topAuthors).append(more_button);

				$(more_button).click(function(e){
					e.preventDefault();
					var dialog = $('#dialog_wrapper').clone();
					$(dialog).addClass('dialog');
					$(dialog).loadFullAreaAuthors(data.list);
					$(dialog).show()
						.appendTo("#overlay")
						.parent()
						.fadeIn('fast');
					$(".dialog").show();

				});
			}
		}
	});
	
	
	var topInterests = $('<table id="top_interests"></table>');
	$(wrapper).append($('<div id="top_interests_section"></div>').append($('<div class="table_title">Top Interests</div>')).append(topInterests));
	$.ajax({
		url: '/tag/interestsList.json?area_name='+area_name,
		beforeSend: function(){
			$(topInterests).text('loading...   ').addClass('progress');
		},
		success: function(data){
			$(topInterests).text('').removeClass('progress');
			$('<div class="i_score">'+(data.score*100).toFixed(0)+'%</div>').insertBefore('#top_interests');
			if (data.list.length > 5){
				var limit = 5;
			}else{
				var limit = data.list.length;
			}			
			for (var i = 0; i < limit; i++){
				var area = data.list[i];
				var area_cell = $('<td></td>').html($('<div class="user"></div>').html('<img src="'+data.list[i].user_gravatar25+'"/>'+'<a href="/users/'+data.list[i].user_id+'">'+data.list[i].user_name+'</a>'));
				var score_cell = $('<td class="score"></td>').text((area.score*100).toFixed(0)+'%');
				var row = $('<tr></tr>').append(score_cell).append(area_cell);
				$(topInterests).append(row);
			}
			if (data.list.length > 5){				
				var more_button = $('<tr><td></td><td><a href="#more" class="more_button">show more</a></td></tr>');
				$(topAuthors).append(more_button);

				$(more_button).click(function(e){
					e.preventDefault();
					var dialog = $('#dialog_wrapper').clone();
					$(dialog).addClass('dialog');
					$(dialog).loadFullAreaInterests(data.list);
					$(dialog).show()
						.appendTo("#overlay")
						.parent()
						.fadeIn('fast');
					$(".dialog").show();

				});
			}
			
			
		}
	});
}



jQuery.fn.loadFullAreaAuthors = function(data){
	var wrapper = this;
	var yum = $('<div id="dialog"></div>');
	$(wrapper).append(yum);
	$(yum).append($('<a href="#" class="cancel">[x]</a>'));	
	$(yum)
		.find('.ok, .cancel')
		.live('click', function(){
			closeYumDialog(this);
		})
		.end()
		.find('.ok')
		.live('click', function(){
		})
		.end()
		.find('.cancel')
		.live('click', function(){
	});
	var topAuthors = $('<table id="top_authors"></table>');
	$(yum).append('<div class="section_title">Top Experts</div>').append(topAuthors);
	for (var i = 0; i < data.length; i++){
		var area = data[i];
		var area_cell = $('<td></td>').html($('<div class="user"></div>').html('<img src="'+data.list[i].user_gravatar25+'"/>'+'<a href="/users/'+data.list[i].user_id+'">'+data.list[i].user_name+'</a>'));
		var score_cell = $('<td class="score"></td>').text((area.score*100).toFixed(0)+'%');
		var row = $('<tr></tr>').append(score_cell).append(area_cell);
		$(topAuthors).append(row);
	}
}


jQuery.fn.loadFullAreaInterests = function(data){
	var wrapper = this;
	var yum = $('<div id="dialog"></div>');
	$(wrapper).append(yum);
	$(yum).append($('<a href="#" class="cancel">[x]</a>'));	
	$(yum)
		.find('.ok, .cancel')
		.live('click', function(){
			closeYumDialog(this);
		})
		.end()
		.find('.ok')
		.live('click', function(){
		})
		.end()
		.find('.cancel')
		.live('click', function(){
	});
	var topInterests = $('<table id="top_interests"></table>');
	$(yum).append('<div class="section_title">Top Interests</div>').append(topInterests);
	for (var i = 0; i < data.length; i++){
		var area = data[i];
		var area_cell = $('<td></td>').html($('<div class="user"></div>').html('<img src="'+data.list[i].user_gravatar25+'"/>'+'<a href="/users/'+data.list[i].user_id+'">'+data.list[i].user_name+'</a>'));
		var score_cell = $('<td class="score"></td>').text((area.score*100).toFixed(0)+'%');
		var row = $('<tr></tr>').append(score_cell).append(area_cell);
		$(topInterests).append(row);
	}
}

jQuery.fn.loadRelatedAreas = function(url){
	var wrapper = this;
	$.ajax({
		url: url,
		beforeSend: function(){
			$(wrapper).text('loading...').css('text-align', 'center').addClass('center_progress');
		},
		success: function(data){
			$(wrapper).html('<div class="section_title">Related Areas</div>').removeClass('center_progress');
			for (var i = 0;i<data.length; i++){
				var area = $('<a class="area"></a>').attr('href','/area/'+data[i].tag).html(data[i].tag);
				$(area).paintArea(data[i].count, data[i].total);
				$(wrapper).append($('<div class="related_tag"></div>').append($(area)));
			}
		}
	});
};

(function($) {
    $.fn.listenForChange = function(options) {
        settings = $.extend({
            interval: 200 // in microseconds
        }, options);

        var jquery_object = this;
        var current_focus = null;

        jquery_object.filter(":input").add(":input", jquery_object).focus( function() {
            current_focus = this;
        }).blur( function() {
            current_focus = null;
        });

        setInterval(function() {
            // allow
            jquery_object.filter(":input").add(":input", jquery_object).each(function() {
                // set data cache on element to input value if not yet set
                if ($(this).data('change_listener') == undefined) {
                    $(this).data('change_listener', $(this).val());
                    return;
                }
                // return if the value matches the cache
                if ($(this).data('change_listener') == $(this).val()) {
                    return;
                }
                // // ignore if element is in focus (since change event will fire on blur)
                // if (this == current_focus) {
                //     return;
                // }
                // if we make it here, manually fire the change event and set the new value
                $(this).trigger('change');
                $(this).data('change_listener', $(this).val());
            });
        }, settings.interval);
        return this;
    };
})(jQuery);

// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();


jQuery.fn.prepareSubscribe = function(){
	var selector = this;
	var form = $(this).find("#sign_up_form");
	var email_field = $('<input id="preuser_email" name="preuser[email]" type="text" />');
	var location_field = $('<input id="preuser_location" name="preuser[location]" type="text" />');
	var submit = $('<a href="#" id="preuser_submit_button" class="submit_button"> submit </a>');
	
	$(form).append(email_field).append(location_field).append(submit);
	
	// $(selector).find('#preuser_email').populateElement($(selector).find('#preuser_email'), 'email');
	$(email_field).prepopulateElement('email');
	$(location_field).prepopulateElement('location');

	

	// validate email (make sure nobody subscribes twice!)
	$(email_field).populateInputHint('invalid email', -1);
	$(email_field).blur(function(){
		$(this).validatesEmail($(this), '/search_pre_user_by_email.json');
	});			
	$(email_field).keyup(function(){
		$(this).validatesEmail($(this), '/search_pre_user_by_email.json');
	});
	
	// map preview
	$(location_field).populateInputHint('enter your location', -1);
	
	
	$(location_field).keyup(function(){
		// $(this).populateInputHint("thanks!", 1);
		delay(function(){
			$(location_field).searchCity($(location_field).val());
		}, 700);				
	});
	
	$(submit).click(function(e){
		e.preventDefault();
		var email = $(email_field).returnOnlyIfValid();
		var address = $(location_field).returnOnlyIfValid();
		var preuserJSON = {
			"email": email,
			"address": address
		};
		
		$.ajax({
			url: "/create_preuser.json", 
			data: {'pre_user':preuserJSON}, 
			beforeSend: function(){
				$(selector).addClass('center_progress');
				$(email_field).fadeOut();
				$(location_field).fadeOut();
				$(submit).fadeOut();				
				$(selector).find('.form').text('').append('<img src="/assets/progress.gif"/> submitting...');
			},
			success: function(data){
				$(selector).removeClass('center_progress');
				$(selector).loadPreuser(data);				
			}
		});
		
	});
	
	jQuery.fn.loadPreuser = function(data){
		var form = $(this).find('.form');
		$(form).text('');
		$(form).append($('<a href="#" class="cancel"> [x]</a>'));
		$(form).append($("<div id='load_preuser_title'></div>").text("Thanks for subscribing!"));
		$(form).append($("<div id='load_preuser_note'></div>").text("You will get an invitation email when we release our beta!"));	
	};
}


jQuery.fn.postsTab = function(user_id){
	var selector = this;	
	$(selector).empty().loadStream("/api/yums_by_user/"+user_id+".json", 1);
}


jQuery.fn.upsTab = function(user_id){
	var selector = this;
	$(selector).empty().loadStream("/api/yums_by_user_ups/"+user_id+".json", 1);
}


jQuery.fn.interestsSection = function(user_id){
	var selector = this;
	$.ajax({
		url: "/user/interestsList.json?user_id="+user_id, 
		beforeSend: function(){
			$(selector).text('loading...').css('text-align','center').addClass('center_progress');
		},
		success: function(data){
			$(selector).removeClass('center_progress');
			$(selector).html('<div class="section_title">Interests</div>');
			$(selector).loadInterests(data);					
		}
	});
}

jQuery.fn.loadInterests = function(data){
	var selector = this;
	$(selector).append("<tr><th>area</th><th>ups</th><th>down</th></tr>");
	$.each(data, function(i, area){
		// var interest = $("<div class='interest'></div>");
		var interest = $("<tr class='interest'></tr>");
		$(interest).loadInterest(area);
		$(selector).append(interest);		
	});
}

jQuery.fn.loadInterest = function(data){
	var selector = this;
	$(selector).append($("<td class='area'></td>").text(data.name));
	$(selector).append($("<td class='ups'></td>").text(data.ups));
	$(selector).append($("<td class='downs'></td>").text(data.downs));
	// $(selector).append($("<div class='ups'></div>").text(data.ups));
	// $(selector).append($("<div class='downs'></div>").text(data.downs));
	// $(selector).append($("<div class='area'></div>").text(data.name));
	
}

// 
// jQuery.fn.authorsSection = function(user_id){
// 	var selector = this;
// 	$.ajax({
// 		url: "/user/authorsList.json?user_id="+user_id, 
// 		beforeSend: function(){
// 			$(selector).text('loading...').css('text-align','center').addClass('center_progress');
// 		},
// 		success: function(data){
// 			$(selector).removeClass('center_progress');
// 			$(selector).html('<div class="section_title">Experts</div>')
// 			$(selector).loadAuthors(data);					
// 		}
// 	});
// }
// 
// jQuery.fn.loadAuthors = function(data){
// 	var selector = this;
// 	$(selector).append("<tr><th>area</th><th>posts</th><th>score</th><th>ups</th><th>down</th></tr>");
// 	$.each(data, function(i, area){
// 		var author = $("<tr class='author'></tr>");
// 		// var author = $("<div class='author'></div>");
// 		$(author).loadAuthor(area);
// 		$(selector).append(author);		
// 	});
// }
// 
// jQuery.fn.loadAuthor = function(data){
// 	var selector = this;
// 	$(selector).append($("<td class='area'></td>").text(data.name));
// 	$(selector).append($("<td class='posts'></td>").text(data.posts));
// 	$(selector).append($("<td class='score'></td>").text((data.score*100).toFixed(0)+'%'));
// 	$(selector).append($("<td class='uped'></td>").text(data.uped));
// 	$(selector).append($("<td class='downed'></td>").text(data.downed));
// 
// 
// 	// $(selector).append($("<div class='posts'></div>").text(data.posts));
// 	// $(selector).append($("<div class='uped'></div>").text(data.uped));
// 	// $(selector).append($("<div class='downed'></div>").text(data.downed));
// 	// $(selector).append($("<div class='area'></div>").text(data.name));
// 	
// }
jQuery.fn.addNewYum = function(){
	var selector = this;
	// prepopulates and validates
	
	$(selector).find("#yum_url").populateElement($("#yum_url"), "http://example.com");
	
	$(selector).find("#yum_url").focus(function(){
		$(selector).find("yum_next_button").fadeIn();
	});
	
	$(selector).find("#yum_name").populateElement($(selector).find("#yum_name"),'title of your post');
  	$(selector).find("#yum_name").populateInputHint('enter a name', -1);
	$(selector).find("#yum_name").blur(function(){
		$(this).defineRequired('enter a name');
	});
	
	$(selector).find("#yum_name").keyup(function(){
		$(this).validatesLength(40);
	});			
	
	$(selector).find("#yum_tag_tokens").populateInputHint('enter at least a keyword', -1);
	
	$(selector).find("#yum_tag_tokens").blur(function(){
		$(this).defineTagsRequired('enter a list of tags');
	});
	
	$(selector).find("#yum_tag_tokens").tokenInput("/tags.json", {
    crossDomain: false,
    prePopulate: $(selector).find("#yum_tag_tokens").data("pre"),
	theme: 'dealicious',
	allowCreation: true
  	});
  
	
	$(selector).find("#yum_tag_tokens").keyup(function(){
		$(this).validatesExistence();
	});
	
	var review_limit = 274;
	$(selector).find("#yum_review").populateElement($("#yum_review"),'be the first to comment on this post!');
	$(selector).find("#yum_review").populateInputHint(review_limit+' characters remaining', 0);
	$(selector).find("#yum_review").keyup(function(){
		$(this).validatesLength(review_limit);
	});
	
	
	// submit YumForm
	var submit_button = $(selector).find("#yum_submit_button");
	$(submit_button).click(function(e){
		e.preventDefault();
		closeDialog($(selector).find("#add_new"));
		var name = $(selector).find("#yum_name").returnOnlyIfValid();
		var url = $(selector).find("#yum_url").returnOnlyIfValid();
		var tags = $(selector).find("#yum_tag_tokens").returnOnlyIfValid();
		var address = $(selector).find("#yum_address").returnOnlyIfValid();
		var review = $(selector).find("#yum_review").returnOnlyIfValid();
		var yumJSON = {
			"name": name,
			"url": url,
			"tag_tokens":tags,
			"address":address,
			"review":review
		};
		
		var imgJSON = {
			"uri": $('#target').attr('src'),
			"x": $('#img_x').val(),
	      	"y": $('#img_y').val(),
	      	"w": $('#img_w').val(),
	      	"h": $('#img_h').val()
		};
		
		$.ajax({
			url: "/create_yum.json", 
			data: {'yum':yumJSON, 'img':imgJSON}, 
			beforeSend: function(){
				$(selector).find("#add_new").addClass('center_progress');
			},
			success: function(data){
				$(selector).find("#add_new").removeClass('center_progress');
				openYum(data.yum.id);
				
			}
		});
		
		// alert("name: "+yumJSON.name+"\n"+"tags: "+yumJSON.tags+"\n"+"address: "+yumJSON.address+"\n"+"review: "+yumJSON.review+"\n");
	});			
	
	var next_button = $('<a href="#" id="yum_next_button"/>').text('next');			
	
	$(next_button).click(function(e){
		prepareYumForm(e);
	});
	
	function prepareYumForm(e){				
		e.preventDefault();
		
		// preparing for scrop_image layout
		var preview = $('#yum_url_preview');
		var form = $('#add_new_form');
		$(form).fadeIn();
		var url = $('#yum_url').val();
		
		// cropping image
		var selected_img = new Image();	
		$(selected_img).attr('width', '200px');
		$(selected_img).attr('id', 'target');
		selected_img.src = $(".liselected img").attr('src');				
		
		// preview/thumbnail image
		var thumbnail_img = new Image();
		$(thumbnail_img).attr('id', 'preview');								
		thumbnail_img.src = $(".liselected img").attr('src');				
		
		// hide the loadURL interface
		$('#yum_go_button').hide();
		$('#yum_url').hide();				
		
		// reset preview
		$(preview).text('');
		$(preview).append($(selected_img)).fadeIn();
		$("#yum_thumbnail").append($('<div class="thumbnail100"/>').prepend($(thumbnail_img)));
		$('#add_new_instruction').text('almost there');
		$(preview).css({
			'width': '200px',
			'float': 'left'
		});				
		$(form).css({
			'float':'left'
		}).fadeIn();

		// jCrop module
		jQuery(function($){
	      // Create variables (in this scope) to hold the API and image size
	      var jcrop_api, boundx, boundy;	
	      $('#target').Jcrop({		
			setSelect: [ 0, 0, 100,100 ],
	        onChange: updatePreview,
	        onSelect: updatePreview,
	        onRelease:  clearCoords,
			setSelect: [50,50,100,100],
	        aspectRatio: 1			
	      },function(){
	        // Use the API to get the real image size
	        var bounds = this.getBounds();
	        boundx = bounds[0];
	        boundy = bounds[1];
	        // Store the API in the jcrop_api variable
	        jcrop_api = this;
	      });
		  function updatePreview(c)
	      {

	        if (parseInt(c.w) > 0)
	        {
	          var rx = 100 / c.w;
	          var ry = 100 / c.h;

	          $('#preview').css({
	            width: Math.round(rx * boundx) + 'px',
	            height: Math.round(ry * boundy) + 'px',
	            marginLeft: '-' + Math.round(rx * c.x) + 'px',
	            marginTop: '-' + Math.round(ry * c.y) + 'px'
	          });
			$('#img_x').val(Math.round(rx * c.x));
	      	$('#img_y').val(Math.round(ry * c.y));
	      	$('#img_w').val(Math.round(rx * boundx));
	      	$('#img_h').val(Math.round(ry * boundy));

	        }
	      };

	    });
		
	};
	
	
	$("#yum_go_button").click(function(e){
		$('#yum_url_preview').text('');
		e.preventDefault();
		var url = $("#yum_url").val();
		var urlReg = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
		if(!urlReg.test(url)){
			url = "http://"+ url;
		}
		$("#yum_url").val(url);
		var fcbklist = $("<ul id='fcbklist'/>");
		var selected = $("<div id='selected_img'/>");
		$('#yum_url_preview').append(fcbklist);
		$('#yum_url_preview').append(selected);
		$.ajax({
			url: "/cdhttp.json", 
			data:{'uri':url}, 
			beforeSend: function(){
				$("#yum_url").addClass('progress');
			},
			success: function(data){
				$("#yum_url").removeClass('progress');
				$.each(data.img, function(i, src){
					
					var quotedReg = /\u0022/;
					if(quotedReg.test(src)){
						src = src.substring(2,src.length-2);
					}
					if(!urlReg.test(src)){
						src = url + src
					}
					var img = new Image();
					img.src = src;
					// $("#yum_url_preview").append(src);																		
					if (!((img.width/(0.0+img.height)>2.5)||(img.width/(0.0+img.height)<1/2.5)||(img.width*img.height < 1000)||(img.width*img.height>10000000))){
						var li = $('<li/>').append($('<img width="50px"/>').attr('src',src));
						$(fcbklist).append(li);
					}						
				});
				$.fcbkListSelection('#fcbklist', "400", "50", "2");
				$(selected).append($('<img width="100px"/>').attr('src',$(".liselected img").attr("src")));	
				$('.fcbklist_item').click(function(e){
					e.preventDefault();
					var selected_src = $(this).find('img').attr('src');
					$(selected).find('img').attr('src', selected_src);
				});
				var selected_img = new Image();
				selected_img.src = $(".liselected img").attr('src');				
				if(selected_img.width!=0){
					$("#yum_url_preview").append(next_button);
					$('#add_new_instruction').text('Choose an image, and hit "next"');
				}
				else{
					$('#add_new_instruction').text('Ooops, try again');
				}
			}
		});
	});
	
	
	

    function clearCoords()
    {
      $('#coords input').val('');
      $('#h').css({color:'red'});
      window.setTimeout(function(){
        $('#h').css({color:'inherit'});
      },500);
    };	
	
}

// ajax preview of the location + map
jQuery.fn.searchCity = function(q){
	var selector = this;
	$(selector).next('.input_hint').remove();
	$(selector).parent().find('.map_preview').remove();
	$.ajax({
		dataType: "json",
		url: '/geosearch.json?q='+q,
		beforeSend: function(){
			$(selector).addClass('progress');
		},
		error: function(){
			$(selector).populateInputHint('ajax request failed', 0);
		},
		success: function(json){
			$(selector).removeClass('progress');
			if (json.length!=1){
				$(selector).populateInputHint('please be more specific', -1);
			}
			else{
				$(selector).populateInputHint('at '+json[0].data.formatted_address, 1);
				$(selector).populateMapPreview("http://maps.googleapis.com/maps/api/staticmap?markers="+q+"&zoom=10&size=200x150&sensor=false");
			}
		}
	})
}


jQuery.fn.validatesLength = function(value){
	var inputLength = $(this).val().length;
	if(inputLength<=value){
		$(this).populateInputHint(value - $(this).val().length+" characters remaining", 1);
	}
	else{
		$(this).populateInputHint($(this).val().length-value+" characters exceeded", -1);
	}
	
};


//check if the email has signed up
jQuery.fn.checkEmailExists = function(url){
	var selector = this;
	var value = $(selector).val();
	$.ajax({
		dataType: "json",
		url: url+'?email='+value,
		beforeSend: function(){
			$(selector).addClass('progress');
		},
		error: function(){
			$(selector).populateInputHint("Oops, ajax request failed. Please try again!", -1);
		},
		success: function(json){
			$(selector).removeClass('progress');
			if (json.length > 0){
				
				$(selector).populateInputHint("complete.", 1);
			}
			else{
				$(selector).populateInputHint("email doesn't exist", -1);
			}
		},
		// complete: function(){
		// }
	});
};

// check if the field only contatains real numbers
jQuery.fn.validates_real_number = function(){
	var selector = $(this);
	var value = $(selector).val();
	var hint = $(selector).parentsUntil('tr').parent().find('.hint');
	var numReg = /^[0-9]+(\.[0-9]{2})?$/;
	if (!numReg.test(value)){
		hint.html('<span class=bad>invalid price </span>');
		$(this).client_validation(false, selector);
	}
	else{
		hint.html('<span class=good> good! </span>');
		$(this).client_validation(true, selector);
	}
};

// check if url is valid
jQuery.fn.validates_url = function(){
	var selector = this;
	var value = $(selector).val();
	var hint = $(selector).parentsUntil('tr').parent().find('.hint');
	var urlReg = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
	if(!urlReg.test(value)){
		hint.html('<span class=bad>invalid url </span>');
		$(this).client_validation(false, selector);
	}
	else{
		hint.html('<span class=good> good! </span>');
		$(this).client_validation(true, selector);
	}
};

// check if the email is in the right patter or hasn't been taken yet
jQuery.fn.validatesEmail = function(selector, url){
	var value = $(selector).val();
	if (value == ''){
		$(selector).populateInputHint("email cannot be blank", -1);
	}
	else{
		var emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; //^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		if (!emailReg.test(value)){
			$(selector).populateInputHint("invalid email", -1);
		}
		else{
			$.ajax({
				dataType: "json",
				url: url+'?email='+value,
				beforeSend: function(){
					$(selector).addClass('progress');
				},
				error: function(){
					$(selector).populateInputHint("Oops, ajax request failed, please try again", -1);
				},
				success: function(json){
					var taken = 0;
					$(selector).removeClass('progress');					
					$.each(json, function(){						
						
						if(value == this.pre_user.email){
							
							taken = 1;
						}
					});			
					
					if (taken == 1){
						$(selector).populateInputHint("It seems like you've already subscribed!", -1);
					}
					else{
						$(selector).populateInputHint("Complete!", 1);
					}
				},
				// complete: function(){
				// }
			});
		}
	}
};

jQuery.fn.validatesUserEmail = function(){
	var selector = this;
	var value = $(selector).val();	
	if (value == ''){
		$(selector).populateInputHint("email cannot be blank", -1);
	}
	else{
		var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		if (!emailReg.test(value)){
			$(selector).populateInputHint("invalid email", -1);
		}
		else{
			$(selector).checkEmailExists('/check_user_by_email.json');
		}
	}
};


jQuery.fn.validatesUsername = function(){
	var selector = this;
	var value = $(selector).val();
	if (value == ''){
		$(selector).populateTableInputHint("username cannot be blank", -1);
	}
	else{
		var emailReg = /^[A-Za-z](?=[A-Za-z0-9_.]{3,31}$)[a-zA-Z0-9_]*\.?[a-zA-Z0-9_]*$/;
		if (!emailReg.test(value)){
			$(selector).populateTableInputHint("No spaces. Use 4 to 32 characters and start with a letter. You may use letters, numbers, underscores, and one dot (.)", -1);
		}
		else{
			$.ajax({
				dataType: "json",
				url: '/check_user_by_name?name='+value,
				beforeSend: function(){
					$(selector).addClass('progress');
				},
				error: function(){
					$(selector).populateTableInputHint("Oops, ajax request failed, please try again", -1);
				},
				success: function(json){
					var taken = 0;
					$(selector).removeClass('progress');					
					$.each(json, function(){						
						
						if(value == this.user.name){
							
							taken = 1;
						}
					});			
					
					if (taken == 1){
						$(selector).populateTableInputHint("Sorry, but "+value + " is already taken.", -1);
					}
					else{
						$(selector).populateTableInputHint("Complete!", 1);
					}
				},
				// complete: function(){
				// }
			});
		}
	}
};

jQuery.fn.confirmPassword = function(){
	var selector = this;
	var password_field = $(selector).find("#user_password");
	$(password_field).populateTableInputHint("required", -1);
	var confirmation_field = $(selector).find("#user_password_confirmation");
	$(confirmation_field).populateTableInputHint("required", -1);
	var passwordReg = /(?=^.{4,}$)/;
	$(password_field).keyup(function(){
		
		if (passwordReg.test($(password_field).val())){
			$(password_field).populateTableInputHint("Complete!", 1);
		}
		else{
			$(password_field).populateTableInputHint("at least 4 chars long", -1);
		}
	});
	
	$(confirmation_field).keyup(function(){
		if ($(password_field).val() == $(confirmation_field).val()){
			$(confirmation_field).populateTableInputHint("Complete!", 1);
		}
		else{
			$(confirmation_field).populateTableInputHint("It needs to be the same password!", -1);
		}
	});
}

jQuery.fn.validates_min_max = function(min, max){
	var selector = this;
	var value = $(selector).val();
	var len = value.length;
	var hint = $(selector).parentsUntil('tr').parent().find('.hint');
	if (value == ''){
		hint.html('<span class=bad> cannot be blank</span>');
		$(this).client_validation(false, selector);
	}
	else{
		if (len < min){
			hint.html('<span class=bad> (min '+min+' characters)</span>');
			$(this).client_validation(false, selector);
		}
		else{
			if (len > max){
				hint.html('<span class=bad>(max ' + max+' characters)</span>');
				$(this).client_validation(false, selector);				
			}
			else{
				hint.html('<span class=good>'+len + ' characters ('+(max-len)+' left)</span>');
				$(this).client_validation(true, selector);
			}
		}
		
	}
}

jQuery.fn.defineRequired = function(stringValue){
	var selector = this;
	if ($(selector).hasClass('prepopulate')){
		$(selector).populateInputHint(stringValue, -1);	
	}		
}

jQuery.fn.defineTagsRequired = function(tokenCounts){
	var selector = this;
	var hintPre = $(selector).parent().parent().next();
	if(tokenCounts==0){
		$(hintPre).populateInputHint('at least one area is required', -1);
	}
	else{
		$(hintPre).populateInputHint("good!", 1);
	}
	return this;
	
	
}

jQuery.fn.prepopulateElement = function(defvalue) {
	var selector = this;
	$(selector).attr('placeholder', defvalue);
	// $(selector).each(	
	// 	function(){
	// 		$(this)
	// 			.val(defvalue)
	// 			.addClass('prepopulate');
	// 		$(this).click(function(){
	// 			$(this)
	// 				.val('')
	// 				.removeClass('prepopulate');
	// 		});
	// 		$(this).blur(function(){
	// 			if($(this).val()===''){
	// 				$(this).val(defvalue).addClass('prepopulate');
	// 			}
	// 		});
	// 	});
   	$(selector).each(function() {
       if($.trim(this.value) == "") {
           this.value = defvalue;
		   $(selector).addClass('prepopulate');
       }
   	});
 
   	$(selector).bind('change keyup focus click blur',function() {
       if(this.value == defvalue) {
			$(selector).removeClass('prepopulate');
            this.value = "";

       }
   	});
   
   	$(selector).blur(function() {
       if($.trim(this.value) == "") {
           this.value = defvalue;
		   $(selector).addClass('prepopulate');
       }
   	});
	return selector;
};

jQuery.fn.prepopulateTokenElement = function(defvalue) {
	var input = $(this).prev().find('input');
	var root = $(this).prev();
	var selector = input;
	$(selector).each(function() {
	    if($.trim(this.value) == "") {
	        this.value = defvalue;
	  $(input).addClass('prepopulate');
	  $(root).addClass('prepopulate');
	    }
	});

	$(selector).focus(function() {
	    if(this.value == defvalue) {
	$(root).removeClass('prepopulate');
	$(input).removeClass('prepopulate');
	        this.value = "";

	    }
	});

	$(selector).blur(function() {
	    if($.trim(this.value) == "") {
	        this.value = defvalue;
	  $(input).addClass('prepopulate');
	  $(root).addClass('prepopulate');
	    }
	});
};

// pre-populated field value to give hint to the user
jQuery.fn.populateElement = function(selector, defvalue) {
   $(selector).each(function() {
       if($.trim(this.value) == "") {
           this.value = defvalue;
		   $(selector).addClass('prepopulate');
       }
   });
 
   $(selector).focus(function() {
       if(this.value == defvalue) {
			$(selector).removeClass('prepopulate');
           this.value = "";

       }
   });
   
   $(selector).blur(function() {
       if($.trim(this.value) == "") {
           this.value = defvalue;
		   $(selector).addClass('prepopulate');
       }
   });
};

jQuery.fn.populateInputHint = function(stringValue, valid) {
  	var selector = this;
	if (!$(selector).next().hasClass('input_hint')){
		var hint = $('<div class="input_hint"/>').text(stringValue);
		hint.insertAfter($(selector));
	}
	else{
		var hint = $(selector).next();
		hint.text(stringValue);
	}
	if(valid>0){
		hint.removeClass('invalid');
		hint.css('color', '#0a0');
	}
	else if(valid<0){
		hint.addClass('invalid');
		hint.css('color', '#f00');
	}
	$(selector).parent('.form').showSubmit();
	// $(selector).append(hint);
};

jQuery.fn.populateTableInputHint = function(stringValue, valid) {
  	var selector = this;
	if (!$(selector).next().hasClass('input_hint')){
		var hint = $('<div class="input_hint"/>').text(stringValue);
		hint.insertAfter($(selector));
	}
	else{
		var hint = $(selector).next();
		hint.text(stringValue);
	}
	if(valid>0){
		hint.removeClass('invalid');
		hint.css('color', '#0a0');
	}
	else if(valid<0){
		hint.addClass('invalid');
		hint.css('color', '#f00');
	}
	$(selector).parentsUntil('.form').showSubmit();
	// $(selector).append(hint);
};

jQuery.fn.populateMapPreview = function(src) {
  	var selector = this;
	if (!$(selector).next().hasClass('map_preview')){
		var img = $('<img class="map_preview"/>').attr('src',src);
		img.insertAfter($(selector));
	}
	else{
		var img = $(selector).next();
		img.attr('src', src);
	}
};

jQuery.fn.returnOnlyIfValid = function(){
	var selector = this;
	if (($(selector).hasClass("prepopulate"))||($(selector).hasClass("invalid"))){
		return '';
	}
	else{
		return $(selector).val();
	}
}

jQuery.fn.populateSubmitHint = function(stringValue){
	var selector = this;
	if (!$(selector).next().hasClass('submit_hint')){
		var hint = $('<span class="submit_hint"/>').text(stringValue);
		hint.insertAfter($(selector));		
	}
	else{
		var hint = $(selector).next();
		hint.text(stringValue);
	}
}

jQuery.fn.showSubmit = function(){
	var form = this;
	var submit = $(form).find('.submit_button');
	if($(form).find(".invalid").length>0){
		$(submit).populateSubmitHint('clear all the red entries to continue');
		$(submit).hide();
	}
	else{
		$(submit).populateSubmitHint('looking good!');		
		$(submit).fadeIn();
	}
}

function disableLink(e) {
    // cancels the event
    e.preventDefault();

    return false;
}

// preload comments
jQuery.fn.callComments = function(){
	var comments = $(this).find('.comments');
	var toggle_comments = $(this).find('.toggle_comments');
	var toggle_comments_text = $(toggle_comments).text();
	$.get('yum_comments/'+$(this).attr("id")+'.js', null, null, "script");
	$(toggle_comments).click(function(e){
		e.preventDefault();
		if($(comments).is(':visible')){
			$(comments).fadeOut();
			$(this).text(toggle_comments_text);
		} else{
			$(comments).fadeIn();
			$(this).text('[x]');
		};
	});
};


jQuery.fn.submitWithAjax = function() {
	this.submit(function(e) {
		e.preventDefault();
		$.post(this.action+'.js', $(this).serialize(), null, "script");
		return false;
	})
	return this;
};

jQuery.fn.submitWithAjaxCallback = function(callback) {
	this.submit(function(e) {
		e.preventDefault();
		$.post(this.action+'.js', $(this).serialize(), callback(), "script");
		return false;
	})
	return this;
};


jQuery.fn.getWithAjax = function() {
	this.submit(function() {
		$.get(this.action, $(this).serialize(), null, "script");
		return false;
	})
	return this;
};

jQuery.fn.renderWithAjax = function(url){
	
	$.ajax({
		type: "GET",
		dataType: 'script',
		url: url,
		beforeSend: function(){
			$('#top_locations').addClass('progress');
		},
		error: function(){
			$('#top_locations').html('ajax request failed');
		},
		success: function(){
			$('#top_locations').removeClass('progress');
		}
	})
}

function searchBar(){	
	var field = $("#search-field");
	$(field).prepopulateElement('search area');
	var submit = $("#search-submit");
	$.ajax({
		url: '/area_names.json',
		beforeSend: function(){
			$(submit).addClass('progress');
		},
		success: function(data){
			$(submit).removeClass('progress');
			$(field).autocomplete({source:data});
			$(field).bind('click change keyup blur focus', function(){
				$(submit).attr('href','/area/'+$(this).val());
			});
			
			
			$(field).focus(function(){
				var $this = $(this);
		        if (!$this.data('expand')) {
		                    $this.data('expand', true);
		                    $this.animate({width:'+=132px',left:'-=16px'}, 'linear');
		                    $this.siblings('.s').animate({width:'-=32px',left:'+=16px'}, 'linear')
		        }
		        $this.val("").focus();
			});
			
			$(field).blur(function(){
				var $this = $(this);
			        $this.data('expand', false);
			        $this.animate({width:'-=132px',left:'+=16px'}, 'linear');
			        $this.siblings('.s').animate({width:'+=32px',left:'-=16px'}, 'linear')
			});
			
			$(".ui-autocomplete").click(function(e){				
				e.preventDefault();
				$(submit).attr('href','/area/'+$(field).val());
			});
			
			$(field).keypress(function(event){
				if (event.keyCode == 13){
					window.location = $(submit).attr('href');
				}
			});			
		}
	})
}

jQuery.fn.validates_sign_up_email = function(){
	var root = this;
	var value = $(this).val();
	var url = '/search_pre_user_by_email.json';
	if (value == ''){
		$(root).populateInputHint("email cannot be blank", -1);
	}
	else{
		var emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; //^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		if (!emailReg.test(value)){
			$(root).populateInputHint("invalid email", -1);
		}
		else{
			$.ajax({
				dataType: "json",
				url: url+'?email='+value,
				beforeSend: function(){
					$(root).addClass('progress');
				},
				error: function(){
					$(root).populateInputHint("Oops, ajax request failed, please try again", -1);
				},
				success: function(json){
					$(root).removeClass('progress');					
					console.log(json.length);
					if (json.length>0){
						$(root).populateInputHint("It seems like you've already subscribed!", -1);
					}
					else{
						var form = $(root).parent().parent();
						$.ajax({
							url:"/api/pre_user/create.json?email="+value,
							beforeSend: function(){
								$(form).loading();
							},
							success: function(data){
								$(form).unloading();
								$(form).html(data.message);
							}
						})
						
						// $(root).populateInputHint("Complete!", 1);
					}
				},
				// complete: function(){
				// }
			});
		}
	}
}

function signUp(selector){
	$(selector).click(function(e){
		e.preventDefault();
		var dialog = $("#dialog_wrapper").clone();
		$(dialog).addClass("dialog");
		
		var wrapper = $('<div id="dialog"></div>');
		$(dialog).append(wrapper);
		$(wrapper).append($('<a href="#" class="cancel">[x]</a>'));
		$(dialog)
			.find('.ok, .cancel')
			.live('click', function(e){
				e.preventDefault();
				closeDialog(this);
			})
			.end()
			.find('.ok')
			.live('click', function(){
			})
			.end()
			.find('.cancel')
			.live('click', function(){
		});
		var form = $('<div id="sign-up-wrapper"></div>').appendTo(wrapper);
		var title = $('<div class="title">Sign up to join us!</div>').prependTo(wrapper);
		var email_div = $('<div class="label-prepopulate sign-up-field"></div>').appendTo(form);
		var email_label = $('<label for="email"></label>').text('Email').appendTo(email_div);
		var email_input = $('<input id="email" name="email" type="text">').appendTo(email_div);
		var submit = $('<input class="sign-up-submit-button" name="commit" type="submit" value="sign up">').appendTo(form);
		$(email_div).labelPrepopulate();
		$(submit).click(function(e){
			e.preventDefault();
			$(email_input).validates_sign_up_email();
		})
		$(dialog).show()
			.appendTo("#overlay")
			.parent()
			.fadeIn('fast');
		$(".dialog").show();
	});
}

function feedback(){
	$("#feedback").click(function(e){
		e.preventDefault();
		var dialog = $("#dialog_wrapper").clone();
		$(dialog).addClass("dialog");
		
		var wrapper = $('<div id="dialog"></div>');
		$(dialog).append(wrapper);
		$(wrapper).append($('<a href="#" class="cancel">[x]</a>'));
		$(dialog)
			.find('.ok, .cancel')
			.live('click', function(e){
				e.preventDefault();
				closeDialog(this);
			})
			.end()
			.find('.ok')
			.live('click', function(){
			})
			.end()
			.find('.cancel')
			.live('click', function(){
		});
		var form = $('<div id="feedback_form"></div>');
		var title = $('<div class="title">We love to hear from you</div>');
		var email = $('<input id="feedback_email" name="feedback[email]" size="40" type="text" />');
		$(email).prepopulateElement('your email');
		$(email).populateInputHint('email required', -1);
		$(email).blur(function(){
			$(this).defineRequired('please enter your email');
		});
		$(email).keyup(function(){
			$(this).validatesLength(40);
		});
		
		var subject = $('<input id="feedback_subject" name="feedback[subject]" size="40" type="text" />');
		$(subject).prepopulateElement('subject');
		var message = $('<textarea id="feedback_message" name="feedback[message]" size="40" type="text" />');
		$(message).prepopulateElement('message');
		var submit = $('<a href="#" id="feedback_submit" class="submit_button">send</a>');
		$(wrapper).append(title).append(form);
		$(form).append(email).append(subject).append(message).append(submit);
		$(dialog).show()
			.appendTo("#overlay")
			.parent()
			.fadeIn('fast');
		$(".dialog").show();
		$(submit).click(function(e){
			e.preventDefault();
			var feedbackJSON = {
				"email": email.returnOnlyIfValid(),
				"subject": subject.returnOnlyIfValid(),
				"message": message.returnOnlyIfValid()
			};
			
			$.ajax({
				url: "/send_feedback_email",
				data: feedbackJSON,
				beforeSend: function(){
					$(form).text('sending message').addClass('center_progress');
				},
				success: function(data){
					$(form).text('message submitted').removeClass('center_progress');;
				}
			})
			
			// alert(JSON.stringify(feedbackJSON));
		})
	});
}


function change(state) {
    if(state === null) { // initial page
    } else { // page added with pushState
        // window.location.replace(state.url);	
    }
}

$(window).bind("popstate", function(e) {
    change(e.originalEvent.state);
});

(function(original) { // overwrite history.pushState so that it also calls
                      // the change function when called
    history.pushState = function(state) {
        change(state);
        return original.apply(this, arguments);
    };
})(history.pushState);


// ################# Dediced 0.7

$(document).ready(function() {
	// $('#user-bar-signup').click(function(e){
	// 	e.preventDefault();
	// 	var wrapper = $('#sign_up_wrapper').clone().addClass('dialog');
	// 	$(wrapper).prepareSubscribe();
	// 	openDialogWithoutClone($(wrapper));				
	// });
	
	

	
	$('#user-profile').loadProfileBar($('#user-profile').attr('user_id'));

	var add_new = $("#add_new_wrapper");	
	$('#add-new-button').click(function(e){
		e.preventDefault();
		if ($('#user-profile').attr('user_id')==undefined){
			openAuthenticationRequest($('#authentication-wrapper'));
		}else{
			openNewPost(add_new);
		}		
	});
	
		
	$('input, textarea, a').focus(function(){
		$(this).addClass('focused');
	});
	
	$('input, textarea, a').blur(function(){
		$(this).removeClass('focused');
	});
		
	// searchBar();
	
	var field = $('#search-field');
	var submit = $('#search-submit');
	searchSetup(field, submit);
	
	feedback();
	signUp($("#user-bar-signup"));

})


jQuery.fn.labelPrepopulate = function(){
	var div = this;
	var label = $(div).find('label');
	var input = $(div).find('input');
	if ($(input).val() != ''){
		$(label).hide();
	}else{
		$(input).addClass('prepopulate');
	}
	$(input).bind('change keyup focus click blur', function(){
		if(this.value == ''){
			$(label).fadeIn();
			$(this).addClass('prepopulate');
		}else{
			$(label).fadeOut();
			$(this).removeClass('prepopulate');
		}
	})
}

jQuery.fn.loadProfileBar = function(user_id){
	var user_profile = this;
	var menu = $('<div id="profile-dropdown"></div>');
	var profile = $('<a href="/@'+$('#user-name').text()+'"></a>').html('<span>Profile</span>').appendTo(menu);
	// var profile = $('<a href="#"></a>').html('<span class="setting-icon icon"></span>Settings').appendTo(menu);
	var profile = $('<a href="/log_out"></a>').html('<span>Log Out</span>').appendTo(menu);
	$(menu).appendTo(user_profile).hide();
	$(user_profile).click(function(e){
		$(menu).toggle('slow');
		e.stopPropagation();
	});
	
	$(document).click(function(e){
		$(menu).slideUp('slow');
	})
	
}

jQuery.fn.paintScore = function(score){
	if (score>1.0){
		score = 1.0;
	}
	
	$(this).css('background', 'hsl('+(Math.log(2.0-score)*360)+', 70%, 50%)');
	return this;
}

jQuery.fn.paintScoreArea = function(score){
	if (score>1.0){
		score = 1.0;
	}
	
	$(this).css('background', 'hsl('+(Math.log(2.0-score)*360)+', 20%, 70%)');
	return this;
}


jQuery.fn.paintScoreFont = function(score){
	if (score>1.0){
		score = 1.0;
	}
	
	$(this).css('color', 'hsl('+(Math.log(2.0-score)*360)+', 70%, 50%)');
	return this;
}

jQuery.fn.paintScoreCover = function(score){
	if (score>1.0){
		score = 1.0;
	}
	$(this).css('background', 'hsl('+(Math.log(2.0-score)*360)+', 50%, 50%)');
	return this;
}

jQuery.fn.loadStream = function(url, current_page){
	var wrapper = this;	
	var load_icon = $(wrapper).find("#load-more");
	if ($(load_icon).length ==0 ){
		load_icon = $('<div id="load-more">loading... </div>').appendTo(wrapper);
	}
	$.ajax({
		url: url+'?current_page='+current_page,
		beforeSend: function(){
			$(load_icon).text('loading...');
		},
		success: function(data){
			$(load_icon).fadeOut().remove();
			$.each(data.apis, function(i,v){
				$(wrapper).loadYumCover(v);
			})
			if (data.more_pages == 1){
				$(wrapper).loadMoreStream(url, current_page);
			}
		}
	});
}
		

		
jQuery.fn.loadMoreStream = function(url, current_page){
	var load_button = $('<a id="load-more" href="#"> more  </a>');

	var wrapper = this;
	$(wrapper).append(load_button);
	$(load_button).click(function(e){
		e.preventDefault();
		$(this).remove();
		var load_more = $('<div id="load-more">loading... </div>');
		$(wrapper).append(load_more);
		$(wrapper).loadStream(url, current_page + 1);
	});
}

jQuery.fn.loadYumCover = function(api){
	var wrapper = this;
	
	var stream_unit = $('<div class="stream-unit"></div>').attr('score', api.score);
	
	
	var data = api.yum_api;
	var score = api.score;
	
	var cover = buildYumCover(data, score);

	var thumbnail = $('<div class="thumbnail-150"></div>');

	$(thumbnail).append(cover);
	if (api.score > 1.0){
		$(stream_unit).append(thumbnail).append($('<div class="cover-interest-score"></div>').text('match').paintScore(1.0));
	}else{
		$(stream_unit).append(thumbnail).append($('<div class="cover-interest-score"></div>').text((api.score*100).toFixed(1)+'%').paintScore(api.score));
	}	
	$(stream_unit).hide().appendTo(wrapper).fadeIn('slow');
	
	
	$(stream_unit).hoverIntent(function(){
		var hovered = $('<div class="stream-hovered"></div>');
		$(hovered).on('click',function(e){
			e.preventDefault();
			slideOverToYumProfile(data.yum.token);
		})
		
		var view = $('<a href="#" class="stream-hovered-view"></a>').html('<span class="icon content-icon"/> View ').appendTo(hovered);
		// $(view).on('click', function(e){
		// 	e.preventDefault();
		// 	$("#stream-wrapper").hide('slide', {direction:'left'}, 500);
		// 	$("#content-wrapper").showYumProfile(data.yum.token);
		// 	var path = '/p/'+data.yum.token;
		// 	history.pushState({url: path}, path, path);
		// 	$("#menu-sidebar").fadeOut();
		// 	$("#search-relevant-areas").fadeOut();
		// });
		// var buttons = $('<div class="rate_buttons"></div>').appendTo(hovered);	
		// $(buttons).feedbackButtons(data, score);		
		
		
		$(hovered).appendTo(this).fadeIn();
	},function(){
		$(this).find('.stream-hovered').fadeOut().remove();
	})

}

function slideOverToYumProfile(token){
	$("#stream-wrapper").hide('slide', {direction:'left'}, 500);
	$("#content-wrapper").showYumProfile(token);
	var path = '/p/'+token;
	history.pushState({url: path}, path, path);
	$("#menu-sidebar").fadeOut();
	$("#search-relevant-areas").fadeOut();		
	
}

jQuery.fn.showYumProfile = function(token){
	var wrapper = this;
	var yum_profile = $('<div id="slide-yum-profile"></div>');
	var back_to_stream = $('<a href="#" id="back-to-stream"></a>').html('<span class="icon back-icon"/> Go back').appendTo($('#container>.left-column'));
	// $(yum_profile).hide().appendTo(wrapper).delay(500).show('slide', {direction: 'right'}, 500);
	$(yum_profile).loadYumProfile(token);
	$(yum_profile).hide().appendTo(wrapper).delay(500).fadeIn('fast');
	$(back_to_stream).click(function(e){
		e.preventDefault();
		$("#menu-sidebar").fadeIn();
		history.back();
		// $(yum_profile).hide('slide', {direction:'right'}, 500).remove();
		$(yum_profile).fadeOut('slow').delay(500).remove();
		$(this).remove();
		$('#stream-wrapper').show('slide', {direction:'left'}, 500);				
		// $('#stream').delay(500).fadeIn();
		$("#search-relevant-areas").fadeIn();
	});
}

function buildYumCover(data, score){
	
	var title_limit = 70;
	if (data.yum.name.length > title_limit){
		var title_text = data.yum.name.substring(0,title_limit) +'...';
	}else{
		var title_text = data.yum.name;
	}
	if ((data.imgsrc=='/images/default.png')|(data.imgsrc.length == 0)){
		var cover = $("<div class='post-cover text-cover'></div>").append($("<div class='page-title'></div>").text(title_text)).paintScoreCover(score);
	}
	else{
		var img = new Image();
		img.src = data.imgsrc;
		if (img.width > img.height){
			var cover = $('<div class="post-cover"></div>').append($('<img height="150px"/>').attr('src',data.imgsrc));
		}
		else{
			var cover = $('<div class="post-cover"></div>').append($('<img width="150px"/>').attr('src',data.imgsrc));
		}
		
		if (!img.complete || typeof img.naturalWidth == "undefined" || img.naturalWidth == 0) {
			var cover = $("<div class='post-cover text-cover'></div>").append($("<div class='page-title'></div>").text(title_text)).paintScoreCover(score);
	    }
	}
	
	return cover;
}

jQuery.fn.loadYumProfile = function(token){
	var root = this;
	var yum = $('<div id="yum-profile"></div>').appendTo(root);
	$.ajax({
		url: '/api/post.json?token=' + token,
		beforeSend: function(){
			$(yum).text('loading...');
		},
		success: function(json){
			var data = json.yum_api;
			var score = json.score;
			$(yum).empty();
			// $(yum).empty().hide().delay(500).fadeIn();
			// var go = $('<a href="'+data.yum.url+'" target="_blank" id="yum-profile-go"></a>').html('<span class="icon go-icon"></span> Go To Link').prependTo(root);
			var tool = $('<div id="yum-profile-toolbar"></div>').appendTo(yum);
									
			
			// var toread = $('<a href="#" id="yum-profile-toread"></a>').html('<span class="icon toread-icon icon"></span> ToRead').appendTo(tool);
			var share = $('<a href="#" id="yum-profile-share"></a>').html('<span class="icon share-icon icon"></span> Share').appendTo(tool);
			$(share).click(function(e){
				e.preventDefault();
				shareYum(data.yum.id);				
			})
			
			var buttons = $('<div class="yum-profile-vote-buttons"></div>').appendTo(tool);	
			$(buttons).feedbackButtons(data, score);
			
			
			var left = $('<div id="yum-profile-left"></div>').appendTo(yum);
			var right = $('<div id="yum-profile-right"></div>').appendTo(yum);
			
			var coverLink = $('<a class="cover-link" target="_blank"></a>').attr('href', data.yum.url).appendTo(left)
			buildYumCover(data, score).appendTo(coverLink);
			// if ($(yum).find('.text-cover').length==0){
			var title = $('<a target="_blank" class="cover-link" id="yum-profile-title"></a>').attr('href', data.yum.url).html(data.yum.name).prependTo(tool);
			// }
						
			var tags_len = data.tags.length;
			/*var stats = $('<div id="yum-profile-stats"></div>').appendTo(top_right_top);
			var total_ups = $('<div id="yum-profile-total-ups" class="yum-profile-stats"></div>').text(data.rating.total.ups)
										.append($('<div class="subscript">Up</div>'))
										.appendTo(stats);
			var total_downs = $('<div id="yum-profile-total-downs" class="yum-profile-stats"></div>').text(data.rating.total.downs)
										.append($('<div class="subscript">Down</div>'))
										.appendTo(stats);
			var total_views = $('<div id="yum-profile-total-views" class="yum-profile-stats"></div>').text(data.viewcounts)
										.append($('<div class="subscript">View</div>'))
										.appendTo(stats);
			*/
			
			var scores = $('<div id="yum-profile-scores"></div>').appendTo(left);
			var total_scores = $('<div id="yum-profile-total-scores"></div>').appendTo(scores);
			var total_interest_score = $('<div class="yum-profile-stats"></div>')
										.append($('<div id="yum-profile-total-interest"></div>').attr('score', '1.0').attr('len', tags_len).text(100+'%'))
										.append($('<div class="subscript">Interest</div>'))
										.appendTo(total_scores);
			var total_authority_score = $('<div class="yum-profile-stats"></div>')
										.append($('<div id="yum-profile-total-authority"></div>').attr('score', '1.0').attr('len', tags_len).text(100+'%'))
										.append($('<div class="subscript">Authority</div>'))
										.appendTo(total_scores);
			
			
			for (var i = 0;i<tags_len;i++){
				var score_div = $('<div class="yum-profile-score"></div>').appendTo(scores);
				var area = $('<a class="yum-profile-score-area"></a>').attr('href', '/area/'+data.tags[i].name).text(data.tags[i].name).appendTo(score_div);
				var i_score = $('<div class="yum-profile-score-i_score"></div>').appendTo(score_div).hide().loadYumProfileIScore(data.yum.user_id, data.tags[i].name);
				var a_score = $('<div class="yum-profile-score-a_score"></div>').appendTo(score_div).hide().loadYumProfileAScore(data.yum.user_id, data.tags[i].name);
			}
			
			
			var review_obj = {
				content: data.yum.review,
				created_at: data.yum.created_at,
				user: {
					name: data.user.name,
					imgsrc: data.user.gravatar25
				}
			}

			var review = $('<div class="yum-review yum-profile-section"></div>').appendTo(right);
			var title = $('<div class="yum-profile-section-title"></div>').text('Added by').appendTo(review);
			$(review).append(getComment(review_obj));
			var comments = $('<div id="yum-profile-comments" class="yum-profile-section"></div>').appendTo(right);
			$(comments).loadComments(data.yum.id);			

		}
	})
	
	
}

jQuery.fn.loadYumProfileAScore = function(user_id, area){	
	var wrapper = this;

	$.ajax({
		url: "/api/area/authority.json?area="+area+"&user_id="+user_id,
		beforeSend: function(){
			$(wrapper).text('loading...');
		},
		error: function(){
			$(wrapper).text('error');
		},
		success: function(score){			
			$(wrapper).text((score*100).toFixed(0)+'%').paintScore(score);
			$(wrapper).parent().find('.yum-profile-score-area').paintScoreArea(score);
			var total = $("#yum-profile-total-authority");
			var current_score = parseFloat($(total).attr('score'));
			current_score = current_score*score;
			var len = parseInt($(total).attr('len'));
			var final_score = Math.pow(current_score, 1.0/len);
			$(total).text((final_score*100).toFixed(0)+'%').attr('score', ''+current_score).parent().paintScore(final_score);
		}
	});
}

jQuery.fn.loadYumProfileIScore = function(user_id, area){	
	var wrapper = this;

	$.ajax({
		url: "/api/area/interest.json?area="+area+"&user_id="+user_id,
		beforeSend: function(){
			$(wrapper).text('loading...');
		},
		error: function(){
			$(wrapper).text('error');
		},
		success: function(score){			
			$(wrapper).text((score*100).toFixed(0)+'%').paintScore(score);
			$(wrapper).parent().find('.yum-profile-score-area').paintScoreArea(score);
			var total = $("#yum-profile-total-interest");
			var current_score = parseFloat($(total).attr('score'));
			current_score = current_score*score;
			var len = parseInt($(total).attr('len'));
			var final_score = Math.pow(current_score, 1.0/len);
			$(total).text((final_score*100).toFixed(0)+'%').attr('score', ''+current_score).parent().paintScore(final_score);
		}
	});
}



// = Comments

jQuery.fn.loadComments = function(yum_id){
	var wrapper = this;
	var title = $('<div class="yum-profile-section-title"></div>').text('Comments').appendTo(wrapper);
	
	var new_comment = $('<div id="yum-profile-comments-form"></div>');
	var input = $('<input id="yum-profile-comments-form-content" type="text"/>');
	var submit = $('<a href="#" id="yum-profile-comments-form-submit"></a>').text('send');
	$(new_comment).append(input).append(submit);
	$(wrapper).append(new_comment);
	$.ajax({
		url: "/comments_by_yum_id/"+yum_id+".json", 
		beforeSend: function(){
			$(wrapper).addClass('center_progress');
		},
		success: function(data){
			$(wrapper).removeClass('center_progress');			
			$.each(data,function(i,comment){
				var comment_element = getComment(comment);
				$(wrapper).append(comment_element);
			});			
		}
	});
	
	
		
	$(submit).hide();
	$(input).prepopulateElement("write your comment here...");
	$(input).focus(function(){
		$(submit).fadeIn();
	});	
	$(submit).click(function(e){
		e.preventDefault();
		var content = $(input).returnOnlyIfValid();
		var commentJSON = {
			"content": content,
			"yum_id":yum_id
		};
		$.ajax({
			url: "/create_comment.json",
			data: {'comment':commentJSON},
			beforeSend: function(){
				$(input).addClass('progress');
			},
			success: function(data){
				$(input).removeClass('progress');
				var comment_element = getComment(data);
				$(comment_element).insertAfter(new_comment);
				$(input).val('');
				$(input).prepopulateElement('more comment? ');
			}
		});		
	});
	

}

function getComment(comment){
	var comment_wrapper = $('<div class="yum-profile-comment"></div>');
	$(comment_wrapper).hide();
	
	var user = $('<div class="yum-profile-comment-user"></div>').appendTo(comment_wrapper);
	var img = $('<div class="yum-profile-comment-user-img"></div>').append($('<img/>').attr('src',comment.user.imgsrc)).appendTo(user);
	var name = $('<a class="yum-profile-comment-user-name"></a>').attr('href', '/@'+comment.user.name).text(comment.user.name).appendTo(user);
	
	var content = $('<div class="yum-profile-comment-content"></div>').text(comment.content).appendTo(comment_wrapper);;
	var timestamp = $('<div class="yum-profile-comment-timestamp"></div>').text(comment.created_at).appendTo(comment_wrapper);
	
	// var actions = $('<div class="comment_actions"></div>');
	// var like = $('<a href="#" class="like_comment">like</a>');
	// $(like).click(function(e){
	// 	e.preventDefault();
	// 	rateComment(comment.comment_id, 'like');
	// 	$(stats).updateCommentStats(comment.comment_id);
	// 	$(this).hide();
	// });
	// var hide = $('<a href="#" class="hide_comment">hide</a>');
	// $(hide).click(function(e){
	// 	e.preventDefault();
	// 	rateComment(comment.comment_id, 'hide');
	// 	$(comment_wrapper).fadeOut();
	// });
	// $(actions).append(like).append($('<span> &#8226; </span>')).append(hide);
	// $(comment_wrapper).append(actions);
	// 
	// var stats = $('<div class="comment_stats"></div>');
	// var total_likes = $('<span class="total_comment_like"></span>').text(comment.rating.total_like);
	// var total_hides = $('<span class="total_comment_hide"></span>').text(comment.rating.total_hide);
	// $(stats).append(total_likes).append($('<span> : </span>')).append(total_hides);
	// $(comment_wrapper).append(stats);
	$(comment_wrapper).fadeIn();
	
	return comment_wrapper;
}

jQuery.fn.updateCommentStats = function(comment_id){
	var comment_stats = this;
	var total_like = $(comment_stats).find('.total_comment_like');
	$(total_like).hide().text(parseInt($(total_like).text())+1).fadeIn();
}

jQuery.fn.insertComment = function(comment){
	var comments = this;
	var comment_selector = $(comments).find('.template').clone().removeClass('template');
	// $(comment_selector).find('.thumbnail30').append($('<img/>').attr('src',comment.user.imgsrc).attr('style',comment.user.imgcss));
	$(comment_selector).find('.user_info').text(comment.user.name);
	$(comment_selector).find('.comment_content').prepend($('<span/>').text(comment.content));
	$(comment_selector).find('.comment_timestamp').text(comment.created_at);
	$(comment_selector).hide().insertBefore($(comments).find('.comment_form'));
	$(comment_selector).slideDown();	
}


// == Menu side-bar ==
jQuery.fn.menu_selected = function(){
	var root = this;
	$("#menu-sidebar").find('a').removeClass('menu-selected');
	$(root).addClass('menu-selected');
}




// == Vote Up/Down ==


jQuery.fn.feedbackButtons = function(data, score){
	var buttons = this;	
	$(buttons).append($('<a class="rate_up icon up-icon" href="#"></a>'));
	$(buttons).append($('<a class="rate_down icon down-icon" href="#"></a>'));
	$(buttons).refreshRateButtons(data.yum.id, data.rating.self);
};

jQuery.fn.refreshRateButtons = function(yum_id, self_rating){
	var buttons = this;
	var up_button = $(buttons).find('.rate_up');
	var down_button = $(buttons).find('.rate_down');
	if (self_rating > 0){
		$(up_button).addClass('rated');
		$(down_button).hide();
		$(up_button).hoverIntent(
			function(){
				$(this).removeClass('rated');
			},
			function(){
				$(this).addClass('rated');
			}
		);
		$(up_button).click(function(e){
			e.preventDefault();
			rateYum(yum_id, 'cancel');
			$(buttons).refreshRateButtons(yum_id, 0);
		});
	}
	else{
		if (self_rating < 0){
			$(down_button).addClass('rated');
			$(up_button).hide();
			$(down_button).hoverIntent(
				function(){
					$(this).removeClass('rated');
				},
				function(){
					$(this).addClass('rated');
				}
			);
			$(down_button).click(function(e){
				e.preventDefault();
				rateYum(yum_id, 'cancel');
				$(buttons).refreshRateButtons(yum_id, 0);
			});
		}
		else{
			$(up_button).fadeIn('fast');
			$(down_button).fadeIn('fast');
			$(up_button).hoverIntent(
				function(){
					$(this).addClass('rated');
				},
				function(){
					$(this).removeClass('rated');
				}
			);
			$(down_button).hoverIntent(
				function(){
					$(this).addClass('rated');
				},
				function(){
					$(this).removeClass('rated');
				}
			);
			$(up_button).click(function(e){
				e.preventDefault();
				rateYum(yum_id, 'like');
				$(buttons).refreshRateButtons(yum_id, 1);
			});
			$(down_button).click(function(e){
				e.preventDefault();
				rateYum(yum_id, 'dislike');
				$(buttons).refreshRateButtons(yum_id, -1);
			});
			
			
		}
	}

}


//= Share =
function shareYum(yum_id){
	var dialog = $("#dialog_wrapper").clone();
	$(dialog).addClass("dialog");

	var wrapper = $('<div id="dialog"></div>');
	$(dialog).append(wrapper);
	$(wrapper).append($('<a href="#" class="cancel">[x]</a>'));
	$(wrapper)
		.find('.ok, .cancel')
		.live('click', function(){
			closeYumDialog(this);
		})
		.end()
		.find('.ok')
		.live('click', function(){
		})
		.end()
		.find('.cancel')
		.live('click', function(){
	});
	$(dialog).show()
		.appendTo("#overlay")
		.parent()
		.fadeIn('fast');
	$(".dialog").show();
	
	var share_div = $('<div id="share-div"></div>').appendTo(wrapper);
	var field_div = $('<div id="share-field-div" class="label-prepopulate"></div>').appendTo(share_div);
	var label = $('<label></label>').html('email').appendTo(field_div);
	var field = $('<input type="text" id="share-field"/>').appendTo(field_div);
	$(field_div).labelPrepopulate()
	var add = $('<a id="share-add-button" href="#"></a>').html('send').appendTo(share_div);
	var view = $('<div id="share-view"></div>').appendTo(share_div);
	$(add).click(function(e){
		e.preventDefault();
		var share_to = $('<div class="share-to"></div>').html($(field).val());
		$(view).append(share_to);
		$(field).val('');
		$(share_to).sendShareEmail(yum_id);
	})
}

jQuery.fn.sendShareEmail = function(yum_id){
	var root = this;
	var email = $(this).text();
	var status = $('<div class="share-to-status"></div><br/>').insertAfter(root);
	$.ajax({
		url: '/send_share_email.json?email='+email+'&yum_id='+yum_id,
		beforeSend: function(){
			$(status).text('sending...');
		},
		success: function(data){
			$(status).text('success!');
		}
	})
}

// = Search

		
function searchFormView(){
	console.log('searchFormView');
	$('#search-field').removeClass('dropdown-search').hide();
	$('#logo').hide();			
	$('#search-submit').hide();
	$('#menu-sidebar').hide();

	$('#search-div-form').hide().delay(1500).slideDown('slow');
	$('#search-div-slogan').hide().delay(500).fadeIn('slow');
	$('#home-stats').hide().delay(500).fadeIn('slow');
	var field = $('#search-div-field');
	var submit = $('#search-div-submit');
	searchSetup(field, submit);

}

function searchResultsView(query){	
	console.log('searchResultsView');		
	$('#search-div').remove();
	$('#logo').fadeIn();
	var field = $('#search-field').fadeIn();
	var submit = $('#search-submit').fadeIn();
	$('#menu-sidebar').fadeIn();
	var wrapper = $('<div id="content-wrapper"></div>').appendTo($('#content'));
	var results = $('<div id="stream-wrapper"></div>').appendTo(wrapper);
	$(field).focus().val(query);	
	$(field).searchLive();
	
}

function searchSetup(field, submit){
	console.log('searchSetup');
	$(field).keyup(function(){			
		var query = $(field).val();
		$.ajax({
			url: '/api/keywords/search.json?q='+query,
			beforeSend: function(){
				$(submit).removeClass('search-icon').addClass('loading-icon');
			},
			success: function(data){
				$(submit).addClass('search-icon').removeClass('loading-icon');
				$(field).autocomplete({source:data});
				
				$(submit).attr('href','/search?q='+$(field).val().split(/\s+/).join('+'));
				
				$(field).bind('click change keyup blur focus', function(){
					$(submit).attr('href','/search?q='+$(field).val().split(/\s+/).join('+'));
				});
				
				$(".ui-autocomplete").click(function(e){				
					e.preventDefault();
					$(submit).attr('href','/search?q='+$(field).val().split(/\s+/).join('+'));
				});
				
				$(field).keypress(function(event){
					if (event.keyCode == 13){
						window.location = $(submit).attr('href');
					}
				});
				
				$('.ui-autocomplete').keypress(function(event){
					if (event.keyCode == 13){
						window.location = $(submit).attr('href');
					}
				});
				
			}
		})
	})
	
	$(submit).click(function(e){
		e.preventDefault();
		var query = $(field).val();
		if (query.length>=3){
			window.location = $(submit).attr('href');
			// searchResultsView(query);
		}				
	})
}

jQuery.fn.searchLive = function(){
	console.log('searchLive');
	var field = this;
	var query = $(field).val();
	var results = $('#stream-wrapper');			
	delay(function(){	
		if (query.length>=3){
			$.ajax({
				url: '/api/search.json?q='+query,
				beforeSend: function(){
					$(results).loading();
				},
				success: function(data){
					$(results).unloading().empty();
					var results_title = $('<div id="search-results-title"></div>').appendTo(results);
					if (data.posts.length == 0){
						$(results_title).html('No results for <div class="search-query-text">'+query+'</div>');
						var pioneer = $('<div id="pioneer"></div>').html('Be the first to post!').appendTo(results);
						$('#add-new-button').appendTo(pioneer);
					}else{
						$(results_title).html('Search results for <div class="search-query-text">' +query+'</div>');
						$.each(data.posts, function(i,v){
							$(results).loadYumCover(v);
						})	
					}										
					var right = $('#container').children('.right-column').empty();
					var areas = $('<div id="search-relevant-areas"></div>').appendTo(right);
					var related_areas_title = $('<div id="search-related-areas-title"></div>').appendTo(areas);					
					if (data.relevant_areas.length == 0){
						// $(related_areas_title).html('No related areas for <div class="search-query-text">'+query+'</div>');
					}else{
						$(related_areas_title).html('Related areas to <div class="search-query-text">'+query+'</div>');
						$.each(data.relevant_areas, function(i,v){
							var area = $('<a class="search-relevant-area"></a>').paintScore(v.score).attr('score', v.score).appendTo(areas).attr('href', '/area/'+v.area);
							$('<div class="search-relevant-area-name"></div>').html(v.area).appendTo(area);
						})	
					}
					var submit = $('#search-submit');
					searchSetup(field, submit);
				
					
				}
			})					
		}
	}, 100);			
}

jQuery.fn.loading = function(){
	$(this).html('<div class="loading">Loading... <span class="loading-icon icon"></span></div>');
	return this;
}

jQuery.fn.unloading = function(){
	$(this).find('.loading').remove();
	return this;
}