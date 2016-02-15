if(window.addEventListener) {
window.addEventListener('load', function () {
	var canvas, context; 
	var canvasMyCan, contextMyCan;

	var tool;
	var toolDefault = 'pencil';
	var toolStyle;
	var toolStyleDefault = 'fill';

	var nextColor = '#000000';
	var nextFont = 'Arial';
	var nextSize;

	var history = [];
    var historyRedo = [];
    var linePathArr = [];
    var textInp = '';

	document.getElementById("clearCanvasButton").onclick = function clearCanvas() {
		contextMyCan.clearRect(0, 0, canvas.width, canvas.height);
	};

	function init () {
	    canvasMyCan = document.getElementById('myCanvas');
	    contextMyCan = canvasMyCan.getContext('2d');
	    
	    // Add the temporary canvas so objects wont get cleared
	    var container = canvasMyCan.parentNode;
	    canvas = document.createElement('canvas');
	    canvas.id = 'tempCanvas';
	    canvas.width = canvasMyCan.width;
	    canvas.height = canvasMyCan.height;
	    container.appendChild(canvas);

	    context = canvas.getContext('2d');

	    var toolSelect = document.getElementById('drawingTool');
	    toolSelect.addEventListener('change', toolChange, false);

	    if (tools[toolDefault]) {
	    	tool = new tools[toolDefault]();
	    	toolSelect.value = toolDefault;
	    }

	    var toolStyleSelect = document.getElementById('toolStyle');
	    toolStyleSelect.addEventListener('change', styleChange, false);
	    toolStyle = toolStyleDefault
	    toolStyleSelect.value = toolStyleDefault;

	    var slider = document.getElementById('mySlider');
	    slider.addEventListener('change', sizeChange, false);

	    var fontSel = document.getElementById('fontSel');
	    fontSel.addEventListener('change', fontChange, false);

	    canvas.addEventListener('mousedown', canvasEvent, false);
	    canvas.addEventListener('mousemove', canvasEvent, false);
	    canvas.addEventListener('mouseup', canvasEvent, false);
	    canvas.addEventListener('keypress', canvasEvent, false);
	}
	
	function canvasEvent (e) {
		if (e.layerX || e.layerX == 0) {
	    	e._x = e.layerX;
	        e._y = e.layerY;
	    } 
	    else if (e.offsetX || e.offsetX == 0) { 
	        e._x = e.offsetX;
	        e._y = e.offsetY;
	    }
	    // Call the event handler of the tool.
	    var func = tool[e.type];
	    if (func) {
	      func(e);
	    }
	}

	function toolChange (e) {
	    if (tools[this.value]) {
	      tool = new tools[this.value]();
	    }
	}

	function styleChange (e) {
	    if (toolStyles[this.value]) {
	      toolStyle = this.value;
	    }
	}

	function sizeChange (e) {
		if (this.value) {
			nextSize = this.value;
		}
	}

	function fontChange (e) {
		if (this.value) {
			nextFont = this.value;
		}
	}

	function canvasUpdate () {
		contextMyCan.drawImage(canvas, 0, 0);
		context.clearRect(0, 0, canvas.width, canvas.height);
  	}

	
	var tools = {};

	tools.line = function () {
		var tool = this;
		console.log(this);
		this.isDrawing = false;

		this.mousedown = function (e) {
			tool.isDrawing = true;
			tool.x0 = e._x;
			tool.y0 = e._y;
		};
		this.mousemove = function (e) {
			if (tool.isDrawing) {
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.beginPath();
				context.moveTo(tool.x0, tool.y0);
				context.lineTo(e._x, e._y);
				context.strokeStyle = nextColor;
				context.lineWidth = nextSize;
				context.stroke();
				context.closePath();
			}
		};
		this.mouseup = function (e) {
			if (tool.isDrawing) {
				var dObj = new drawObject('line', context.strokeStyle, context.lineWidth, 'stroke', tool.x0, tool.y0, e._x, e._y, 0, 0, 0, linePathArr, textInp, nextFont);
            	history.push(dObj);
				tool.mousemove(e);
				tool.isDrawing = false;
				canvasUpdate();
			}
		};
	};

	tools.pencil = function () {
		
		var tool = this;
		this.isDrawing = false;
		this.color = 

		this.mousedown = function (e) {
			context.beginPath();
			context.moveTo(e._x, e._y)
			tool.isDrawing = true;
			tool.x0 = e._x;
			tool.y0 = e._y;
			linePathArr = [];
		};

		this.mousemove = function (e) {
			
			if (tool.isDrawing) {
				context.beginPath();
          		context.moveTo(tool.x0, tool.y0);
	          	context.lineCap = 'round';
	          	context.strokeStyle = this.color;
	           	context.lineWidth = 3;
	          	context.lineTo(e._x , e._y );
	          	context.strokeStyle = nextColor;
	          	context.lineWidth = nextSize;
	          	context.stroke();
	          	
	          	tool.x0 = e._x;
				tool.y0 = e._y;

				linePathArr.push({"x" : tool.x0, "y" : tool.y0 });
			}
		};

		this.mouseup = function (e) {
			if (tool.isDrawing) {
				linePathArr.push({"x" : tool.x0, "y" : tool.y0 });
				context.closePath();
				var dObj = new drawObject('pencil', context.strokeStyle, context.lineWidth, 'stroke', 0, 0, 0, 0, 0, 0, 0, linePathArr, textInp, nextFont);
            	history.push(dObj);
				tool.mousemove(e);
				tool.isDrawing = false;
				canvasUpdate();
			}
		};
	};

	tools.rect = function () {
		var tool = this;
		this.isDrawing = false;
		var width;
		var height;
		this.mousedown = function (e) {
			tool.isDrawing = true;
			tool.x0 = e._x;
			tool.y0 = e._y;
		};

		this.mousemove = function (e) {
			if (tool.isDrawing) {
				context.clearRect(0, 0, canvas.width, canvas.height);
				width = e._x - tool.x0;
				height = e._y - tool.y0;
				context.strokeStyle = nextColor;
				context.lineWidth = nextSize;

				if (toolStyle == 'fill') {
		 			context.fillStyle = nextColor;
		 			context.fillRect(tool.x0, tool.y0, width, height);
		 		}
		 		else {
		 			context.strokeRect(tool.x0, tool.y0, width, height);
		 		}
			}
		};

		this.mouseup = function (e) {
			if (tool.isDrawing) {
				var dObj
				if (toolStyle == 'fill') {
		 			dObj = new drawObject('rect', context.strokeStyle, context.lineWidth, 'fill', tool.x0, tool.y0, 0, 0, width, height, 0, linePathArr, textInp, nextFont);
            	}
		 		else {
		 			dObj = new drawObject('rect', context.strokeStyle, context.lineWidth, 'stroke', tool.x0, tool.y0, 0, 0, width, height, 0, linePathArr, textInp, nextFont);
	            }
				history.push(dObj);

				tool.mousemove(e);
				tool.isDrawing = false;
				canvasUpdate();
			}
		};
	};

	tools.circle = function () {
		var tool = this;
		this.isDrawing = false;
		var radius;
		var x;
		var y;

		this.mousedown = function (e) {
			tool.isDrawing = true;
			tool.x0 = e._x;
			tool.y0 = e._y;
		};

		this.mousemove = function (e) {
			if (tool.isDrawing) {
				x = tool.x0 - e._x;
				y = tool.y0 - e._y;

	            radius = Math.sqrt(x * x + y * y); 

				context.clearRect(0, 0, canvas.width, canvas.height);

		 		context.beginPath();
		 		context.arc(tool.x0,tool.y0,radius,0,2*Math.PI);
				context.strokeStyle = nextColor;
				context.fillStyle = nextColor;
				context.lineWidth = nextSize;

		 		if (toolStyle == 'fill') {
		 			context.fill();
		 		}
		 		else {
		 			context.stroke();
		 		}
			}
		};

		this.mouseup = function (e) {
			if (tool.isDrawing) {
				var dObj
				if (toolStyle == 'fill') {
		 			dObj = new drawObject('circle', context.strokeStyle, context.lineWidth, 'fill', tool.x0, tool.y0, 0, 0, 0, 0, radius, linePathArr, textInp, nextFont);
            	}
		 		else {
		 			dObj = new drawObject('circle', context.strokeStyle, context.lineWidth, 'stroke', tool.x0, tool.y0, 0, 0, 0, 0, radius, linePathArr, textInp, nextFont);
            	}
		 		history.push(dObj);
				
				tool.mousemove(e);
				tool.isDrawing = false;
				canvasUpdate();
			}
		};
	};

	tools.text = function () {
		var tool = this;

		this.mouseup = function (e) {
			tool.x0 = e._x;
			tool.y0 = e._y;
			$('#myTextbox').show();
            $('#myTextbox').css({'left': e._x + 'px', 'top': e._y + 'px' });
            document.getElementById('myTextbox').focus();
        }

        $('#myTextbox').keyup(function (e) { 
	        if(e.keyCode === 13) {
	            var text = $('#myTextbox').val();
	            context.fillStyle = nextColor;
	            context.font = nextSize + "px " + nextFont;

	            if (toolStyle == 'fill') {
		 			context.fillText(text, tool.x0, tool.y0);
		 		}
		 		else {
		 			context.strokeText(text, tool.x0, tool.y0);
		 		}
	            
	            $('#myTextbox').val("");
	            $('#myTextbox').hide();

				var dObj
	            if (toolStyle == 'fill') {
	            	dObj = new drawObject('text', context.strokeStyle, context.lineWidth, 'fill', tool.x0, tool.y0, 0, 0, 0, 0, 0, linePathArr, text, context.font);
            	}
	            else {
	            	dObj = new drawObject('text', context.strokeStyle, context.lineWidth, 'stroke', tool.x0, tool.y0, 0, 0, 0, 0, 0, linePathArr, text, context.font);
            	}
	            history.push(dObj);
	            
	        }
	        else if(e.keyCode === 27) {
	        	console.log('sjomli');
	        	$('#myTextbox').val() = '';
	        	$('#myTextbox').hide();
	        }
	    });
	};

	tools.move = function (e) {
		var tool = this;
		this.isMoving = false;

		this.mousedown = function (e) {
			tool.isMoving = true;
			tool.x0 = e._x;
			tool.y0 = e._y;
		};

		this.mousemove = function (e) {
			var x;
			var y;

			if (!tool.isMoving) {
				return;
			}

			for (i = 0; i < history.length; i++)
			{
				if (tool.x0 >= history[i].x0 && tool.x0 <= history[i].x1 && tool.y0 >= history[i].y0 && tool.y0 <= history[i].y1)
				{
					history[i].x0 = e._x;
					history[i].y0 = e._y;
				}
			}
		}

		this.mouseup = function (e) {
			if (tool.isMoving) {
				tool.mousemove(e);
				tool.isMoving = false;
				canvasUpdate();
			}
		};
	};

	//hide textbox if clicke anywher out of canvas
	$('body').click( function(e) {
		if(e.target.id == "tempCanvas") {
			return;
		}
		else {
			$('#myTextbox').val('');
			$('#myTextbox').hide();
		}
	});

	var toolStyles = {};

	toolStyles.fill = function (e) {
		toolStyle = 'fill';
	};
	toolStyles.stroke = function (e) {
		toolStyle = 'stroke';
	};

	$('#picker').colpick({
		flat:true,
		layout:'hex',
		submit:0,
		colorScheme: 'dark',
		color: '000000',
		onChange: function(hsb,hex,rgb,el,bySetColor) {
			nextColor = '#'+ hex;
		}
	});

    $('#undoB').click(function() {
        undo();
    });

    $('#redoB').click(function() {
        redo();
    });

    $('body').keyup( function (e) {
    	if(e.keyCode === 90 && e.ctrlKey) {
    		undo();
    	}
    	else if(e.keyCode === 89 && e.ctrlKey) {
    		redo();
    	}
    });

    function drawObject(type, color, lineWidth, fillStyle, x0, y0, x1, y1, w, h, r, path, input, font) {     
        
        this.type = type;
        this.color = color;
        this.lineWidth = lineWidth;
        this.fillStyle = fillStyle;
        //x and y cord
        this.x0 = x0; 
        this.y0 = y0;
        this.x1 = x1; 
        this.y1 = y1;
        
        this.w = w; 
        this.h = h; 
        this.r = r;

        this.path = path;
        this.input = input;
        this.font = font;
    }

    function draw(obj) {
    	
    	context.strokeStyle = obj.color
        context.lineWidth = obj.lineWidth;
		context.fillStyle = obj.color;

		context.beginPath();

        if(obj.type == 'pencil') {
        	context.beginPath();
        	context.lineCap = 'round';
        	
        	for (var i=1; i<obj.path.length; i++) {
                context.moveTo(obj.path[i-1].x, obj.path[i-1].y);
                context.lineTo(obj.path[i].x, obj.path[i].y);
                context.closePath();
            } 
            context.stroke();
        }
        else {
        	context.beginPath();
        	if(obj.type == 'line') {
	        	context.beginPath();
	            context.moveTo(obj.x0, obj.y0);
	            context.lineTo(obj.x1, obj.y1);
	        } 
	        else if(obj.type == 'rect') {
        		if (obj.fillStyle == 'fill') {
        			context.fillRect(obj.x0, obj.y0, obj.w, obj.h);
        		}
	        	else {
		 			context.strokeRect(obj.x0, obj.y0, obj.w, obj.h);
	        	}
	        }
	        
	        else if(obj.type == 'circle') {
		 		context.arc(obj.x0, obj.y0, obj.r, 0,2*Math.PI);

		 		if (toolStyle == 'fill') {
		 			context.fill();
		 		}
		 		else {
		 			context.stroke();
		 		}
	        }
	        else if (obj.type == 'text') {
	        	context.font = obj.font;
	        	
	            if (toolStyle == 'fill') {
		 			context.fillText(obj.input, obj.x0, obj.y0);
		 		}
		 		else {
		 			context.strokeText(obj.input, obj.x0, obj.y0);
		 		}
	        }
	        context.stroke();
	        context.closePath();
        }
    }
	
	function undo () {
		if(history.length > 0) {
            contextMyCan.clearRect(0, 0, canvasMyCan.width, canvasMyCan.height);
            context.clearRect(0, 0, canvasMyCan.width, canvasMyCan.height);
            historyRedo.push(history.pop());
            console.log(history);
            console.log(historyRedo);
            for(var i = 0; i < history.length; i++) {
            	console.log('drawing stack');
                draw(history[i]);
            }
        }
        canvasUpdate();
	}

	function redo () {
		if(historyRedo.length > 0) {
            var temp = historyRedo.pop();
            history.push(temp);
            draw(temp);
        }
        canvasUpdate();
	}

    init();

}, false); }
	