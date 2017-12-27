;;;(function(out){
	
	var App = function(blockCount){
		this.blockCount = blockCount;	
		this.blocks = [];
		this.lastClickedIndex = false;
		this.moveCount = 0;
		this.leftCount = 0;
		this.tl = new TimerLabel();
		this.sl = new StarLabel(4);
	}
	
	App.prototype = {
	
		init:function(){
			this.sl.init();
			this.moveCount = 0;
			this.leftCount = this.blockCount;
			this.countLabel = new CountLabel();
			var me = this;
			var block_click_handler = function(index){
				me.blockClicked(index);	
			}
			var icon_types = this.makeTypes(this.blockCount);
			var index,type;
			for(var i = 0 ; i < this.blockCount; i++){
				//随机元素加入到面板中
				index = Math.floor(Math.random() * icon_types.length);
				type = icon_types.splice(index,1)[0];
				this.blocks.push(new Block(i,type,block_click_handler));	
			}
			me.addBlocks();
			me.tl.start();	
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
			this.countLabel.show("");
			this.tl.clear();
			this.init();
		}
	
		,blockClicked:function(index){
			if(this.lastClickedIndex === false){
				this.lastClickedIndex = index;	
				return ;
			}
			this.matchTwoBlock(index,this.lastClickedIndex);
		}
	
		,matchTwoBlock:function(a,b){
			var block_a = this.blocks[a];
			var block_b = this.blocks[b];
			this.lastClickedIndex = false;
			this.countLabel.show(++this.moveCount);
			if(this.moveCount % 10 === 0) {
				if(this.sl.consume() === 0){
					this.failed();	
				}
			}
			if(block_a.type == block_b.type){
				block_a.match();	
				block_b.match();	
				this.leftCount -= 2;
				this.finished();
			} else {
				this.delay(function(){
					block_a.back();	
					block_b.back();	
				});
			}
		}

		,finished:function(){
			var me = this;
			if(this.leftCount == 0){
				this.tl.clear();

				var star_html = '';
				for( var i = 0 ; i < this.sl.left ; i++) {
					star_html += '<i class="fa fa-star"></i>';
				}

				var success_html = '<p>恭喜您顺利完成了游戏，一定还想再玩一局吧!</p><p>本局耗时' + 
        							this.tl.dom.html() + '</p>' + 
        							'<p>获得的星级:&nbsp;&nbsp;' + star_html + '</p>';

				swal({
				    title:'恭喜，恭喜！',
				    icon:'success',
				    content:{
				        element:'div',
				        attributes:{
				            innerHTML:success_html
				        },
				    },
				    button:'再来一局'
				}).then(function(result){
					if(result){
						me.reset();	
					}
				});
			}
		}

		,failed:function(){
			var me = this;
			this.tl.clear();
			swal({
				title: "很遗憾",
				text: "非常遗憾，您未能完成游戏，重来一局吧!",
				icon: "warning",
				button:'重来一局!'
			}).then(function(result){
				if(result){
					me.reset();	
				}
			});
		}

		,delay:function(callback){
			setTimeout(callback,500);	
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
