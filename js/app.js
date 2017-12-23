;;;(function(out){

	var RandType = function(count){
		this.types = ["diamond","eye","cloud","heartbeat","plane","rocket","send","wifi"];	
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
				var type = this.types[index];	
				this.now_types.push(type);
				return type;
			}
		}

		,randPop:function(){
			return this.now_types.pop();			
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
			this.countLabel = new CountLabel();
			var me = this;
			var randtype = new RandType(this.blockCount / 2);
			var block_click_handler = function(index){
				me.blockClicked(index);	
			}
			for(var i = 0 ; i < this.blockCount; i++){
				var type = randtype.random();
				this.blocks.push(new Block(i,type,block_click_handler));	
			}
			$("ul.deck").animateCss('lightSpeedIn',function(){
				me.addBlocks();
			});
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
				block_a.back();	
				block_b.back();	
			}
			this.lastClickedIndex = false;
		}

	}
	
	
	$(function(){
		var app = new App(16);	
		app.init();
		$("#reset").click(function(){
			app.reset();
		});
	});
	

})(window);
