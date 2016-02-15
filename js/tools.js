/*$(document).ready(function(){
	var tools = {};

	tools.line = function () {
		var tool = this;
		this.started = false;

		this.mousedown = function (ev) {
			tool.started = true;
			tool.x0 = ev._x;
			tool.y0 = ev._y;
		};

		this.mousemove = function (ev) {
			if (!tool.started) {
				return;
			}

			context.clearRect(0, 0, canvas.width, canvas.height);

			context.beginPath();
			context.moveTo(tool.x0, tool.y0);
			context.lineTo(ev._x, ev._y);
			context.stroke();
			context.closePath();
		};

		this.mouseup = function (ev) {
			if (tool.started) {
				tool.mousemove(ev);
				tool.started = false;
				img_update();
			}
		};
	};
});
*/
