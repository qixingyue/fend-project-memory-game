;;;(function(out){

	var StarLabel = function(number){
		this.dom = $('#starLabel');		
		this.number = number;
		this.left = number;
	}

	StarLabel.prototype = {
		init:function(){
			this.dom.html("");
			for(var i = 0 ; i < this.number; i++){
				this.dom.append('<li><i class="fa fa-star"></i></li>');	
			}
		}
		,consume:function(){
			this.left--;
			this.dom.find('li:last').remove();
			return this.left;
		}
	
	}

	var RandType = function(count){
		this.types = [
			"diamond","eye","cloud","heartbeat","plane","rocket","send","wifi","flag","id-card",
			"magic","phone","tag","tint","tv","signing","usd","rmb",
			"eraser","file","table","scissors","link","copy","play"
		];	
		this.count = count;
		this.now_types = [];
		this.xpop = false;
	}

	RandType.prototype = {
		
		random:function(){
			if(this.xpop || this.now_types.length ===  this.count  ){
				this.xpop = true;
				return this.randPop();
			} else {
				var index = Math.floor(Math.random() * this.types.length);
				var type = this.types.splice(index,1)[0];
				this.now_types.push(type);
				return type;
			}
		}

		,randPop:function(){
			var index = Math.floor(Math.random() * this.now_types.length);
			return this.now_types.splice(index,1)[0];
		}
	
	}

	var CountLabel = function(){
	}

	CountLabel.prototype = {

		show:function(count){
			$("#clickCount").html(count);	
		}
	}
	
	var TimerLabel = function(){
		this.timer = null;
		this.elapsed = 0;
		this.dom = $("#elapsedCount");
	}

	TimerLabel.prototype = {

		start:function(){
			var me = this;
			var callback = function(){
				me.tick();	
			}
			this.dom.html("00:00");
			this.timer = setInterval(callback,1000);
		}

		,clear:function(){
			clearInterval(this.timer);	
			this.elapsed = 0;
		}

		,tick:function(){
			this.elapsed++;	
			this.show();
		}

		,show:function(){
			var minute = Math.floor( this.elapsed / 60 ); 	
			var seconds = this.elapsed - minute * 60 ;
			var minute_str = ( minute < 10 ) ? ( "0" + minute ) : ( minute ) ;
			var seconds_str = (seconds < 10 ) ? ("0" + seconds ) : (seconds);
			var time_str = minute_str + ":" + seconds_str;
			this.dom.html(time_str);
		}
	
	}

	var BLOCK_STATE = {
		CLOSE:0,
		OPEN:1,
		MATCH:2
	};
	
	var Block = function(index,type,click_handler){
		this.index = index;
		this.type = type;
		this.state = BLOCK_STATE.CLOSE;
		this.dom = $('<li class="card"><i class="fa fa-' + type + '"></i></li>');
		this.bind_event();
		this.click_handler = click_handler;
	};
	
	Block.prototype = {

		bind_event:function(){
			var me = this;
			this.dom.bind('click',function(){
				me.change_state();
				me.click_handler(me.index);
			});
		}
	
		,change_state:function(){
			if(this.state == BLOCK_STATE.CLOSE){
				this.state = BLOCK_STATE.OPEN;	
			}
			this.show_state(); 
		}
	
		,show_state:function(){
			var class_name = "card ";
			switch(this.state){
				case BLOCK_STATE.CLOSE:
					class_name += "";
					break;
				case BLOCK_STATE.OPEN:
					class_name += "show open";
					break;
				case BLOCK_STATE.MATCH:
					class_name += "show match";
					break;
			}
			this.dom.attr("class",class_name);
			if(this.state != BLOCK_STATE.CLOSE){
				this.dom.unbind("click");	
			} else {
				this.bind_event();	
			}

			if(this.state == BLOCK_STATE.OPEN){
				this.dom.animateCss('flipInX');	
			} else if(this.state == BLOCK_STATE.CLOSE) {
				this.dom.animateCss('flipInY');	
			}
		}
	
		,match:function(){
			this.state = BLOCK_STATE.MATCH;
			this.show_state();
		}
		,back:function(){
			this.state = BLOCK_STATE.CLOSE;
			this.show_state();
		}
	
	};

	out.Block = Block;
	out.CountLabel = CountLabel;
	out.TimerLabel = TimerLabel;
	out.RandType = RandType;
	out.StarLabel = StarLabel;

})(window);



//使用animate.css组件完成其中的动画
$.fn.extend({
    animateCss: function (animationName, callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
            if (callback) {
              callback();
            }
        });
        return this;
    }
});

