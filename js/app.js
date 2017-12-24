;;;(function(out){

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
			if(this.xpop || this.now_types.length ==  this.count  ){
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

	var App = function(blockCount){
		this.blockCount = blockCount;	
		this.blocks = [];
		this.lastClickedIndex = false;
		this.clickCount = 0;
	}
	
	App.prototype = {
	
		init:function(){
			this.clickCount = 0;
			this.countLabel = new CountLabel();
			var me = this;
			var block_click_handler = function(index){
				me.blockClicked(index);	
			}
			var icon_types = this.makeTypes(16);
			for(var i = 0 ; i < this.blockCount; i++){
				//随机元素加入到面板中
				var index = Math.floor(Math.random() * icon_types.length);
				var type = icon_types.splice(index,1)[0];
				this.blocks.push(new Block(i,type,block_click_handler));	
			}
			$("ul.deck").animateCss('lightSpeedIn',function(){
				me.addBlocks();
			});
		}

		,makeTypes:function(size){
			var result  = [];		
			var rt = new RandType(size/2);
			for(var i = 0 , j = size ; i < j ; i++){
				result.push(rt.random());	
			} 
			return result;
		}
	
		,addBlocks:function(){
			for(var i = 0 ; i < this.blockCount; i++){
				$('ul.deck').append(this.blocks[i].dom);	
			}
		}
	
		,reset:function(){
			this.blocks = [];	
			$("ul.deck").html("");
			this.init();
			this.countLabel.show("");
		}
	
		,blockClicked:function(index){
			this.countLabel.show(++this.clickCount);
			if(this.lastClickedIndex === false){
				this.lastClickedIndex = index;	
				return ;
			}
			this.matchTwoBlock(index,this.lastClickedIndex);
		}
	
		,matchTwoBlock:function(a,b){
			var block_a = this.blocks[a];
			var block_b = this.blocks[b];
			if(block_a.type == block_b.type){
				block_a.match();	
				block_b.match();	
			} else {
				this.delay(function(){
					block_a.back();	
					block_b.back();	
				});
			}
			this.lastClickedIndex = false;
		}

		,delay:function(callback){
			setTimeout(callback,500);	
		}

	}
	
	
	$(function(){
		//swal("Good job!", "You clicked the button!", "success");
		var app = new App(16);	
		app.init();
		$("#reset").click(function(){
			app.reset();
		});
	});
	

})(window);
