;;;(function(out){

	var CountLabel = function(){
	}

	CountLabel.prototype = {

		show:function(count){
			$("#clickCount").html(count);	
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
			if(this.state == BLOCK_STATE.MATCH){
				this.dom.unbind("click");	
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

