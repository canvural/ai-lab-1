import Genetic from './Genetic.js';

class Graph {
	constructor(canvas) {
		this.grid_size = 50;
		this.x_axis_distance_grid_lines = 5;
		this.y_axis_distance_grid_lines = 5;
		this.x_axis_starting_point = { number: 1, suffix: '' };
		this.y_axis_starting_point = { number: 1, suffix: '' };

		this.width = parseInt(canvas.style.width, 10);
		this.height = parseInt(canvas.style.height, 10);

		this.num_lines_x = Math.floor(this.height / this.grid_size);
		this.num_lines_y = Math.floor(this.width / this.grid_size);
		this.canvas = document.getElementById('scratch');

		var xmax = this.num_lines_y - this.y_axis_distance_grid_lines;
		var ymax = this.y_axis_distance_grid_lines;

		this.xmax = xmax;
		this.ymax = ymax;

		// retina
		var dpr = window.devicePixelRatio || 1;
		canvas.width = this.width * dpr;
		canvas.height = this.height * dpr;
		this.ctx = canvas.getContext('2d');
		this.ctx.scale(dpr, dpr);

		this.bound = [0, this.width - 1, this.height - 1, 0];

		this.bound[0] += 25;
		this.bound[1] -= 25;
		this.bound[2] -= 25;
		this.bound[3] += 25;

		this.vertices = { positive: [], negative: [] };
		this.solutions = [];
	}

	drawFunction(coefficients, strokeStyle, lineWidth) {
		let ctx = this.ctx;
		ctx.save();

		ctx.strokeStyle = strokeStyle;
		ctx.lineWidth = lineWidth;

		let xmax = this.xmax;
		let xstride = this.grid_size;
		let inc = 1 / xstride;

		ctx.beginPath();

		for (let x = -xmax; x < xmax; x += inc) {
			var cx = x * xstride + this.y_axis_distance_grid_lines * this.grid_size;
			var cy =
				Genetic.evaluatePoly(coefficients, x) * this.grid_size * -1 +
				this.x_axis_distance_grid_lines * this.grid_size;

			if (x === -xmax) {
				ctx.moveTo(cx, cy);
			} else {
				ctx.lineTo(cx, cy);
			}
		}

		ctx.stroke();

		ctx.restore();
	}

	draw() {
		let ctx = this.ctx;
		ctx.save();

		ctx.strokeStyle = '#000';
		ctx.fillStyle = '#000';
		ctx.clearRect(0, 0, this.width, this.height);

		// Draw grid lines along X-axis
		for (let i = 0; i <= this.num_lines_x; i++) {
			ctx.beginPath();
			ctx.lineWidth = 1;

			// If line represents X-axis draw in different color
			if (i === this.x_axis_distance_grid_lines) ctx.strokeStyle = '#000000';
			else ctx.strokeStyle = '#e9e9e9';

			if (i === this.num_lines_x) {
				ctx.moveTo(0, this.grid_size * i);
				ctx.lineTo(this.width, this.grid_size * i);
			} else {
				ctx.moveTo(0, this.grid_size * i + 0.5);
				ctx.lineTo(this.width, this.grid_size * i + 0.5);
			}
			ctx.stroke();
		}

		// Draw grid lines along Y-axis
		for (let i = 0; i <= this.num_lines_y; i++) {
			ctx.beginPath();
			ctx.lineWidth = 1;

			// If line represents X-axis draw in different color
			if (i === this.y_axis_distance_grid_lines) ctx.strokeStyle = '#000000';
			else ctx.strokeStyle = '#e9e9e9';

			if (i === this.num_lines_y) {
				ctx.moveTo(this.grid_size * i, 0);
				ctx.lineTo(this.grid_size * i, this.height);
			} else {
				ctx.moveTo(this.grid_size * i + 0.5, 0);
				ctx.lineTo(this.grid_size * i + 0.5, this.height);
			}
			ctx.stroke();
		}

		// Translate to the new origin. Now Y-axis of the canvas is opposite to the Y-axis of the graph. So the y-coordinate of each element will be negative of the actual
		ctx.translate(
			this.y_axis_distance_grid_lines * this.grid_size,
			this.x_axis_distance_grid_lines * this.grid_size
		);

		// Ticks marks along the positive X-axis
		for (let i = 1; i < this.num_lines_y - this.y_axis_distance_grid_lines; i++) {
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#000000';

			// Draw a tick mark 6px long (-3 to 3)
			ctx.moveTo(this.grid_size * i + 0.5, -3);
			ctx.lineTo(this.grid_size * i + 0.5, 3);
			ctx.stroke();

			// Text value at that point
			ctx.font = '12px sans-serif';
			ctx.textAlign = 'start';
			ctx.fillText(
				this.x_axis_starting_point.number * i + this.x_axis_starting_point.suffix,
				this.grid_size * i - 2,
				15
			);
		}

		// Ticks marks along the negative X-axis
		for (let i = 1; i < this.y_axis_distance_grid_lines; i++) {
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#000000';

			// Draw a tick mark 6px long (-3 to 3)
			ctx.moveTo(-this.grid_size * i + 0.5, -3);
			ctx.lineTo(-this.grid_size * i + 0.5, 3);
			ctx.stroke();

			// Text value at that point
			ctx.font = '12px sans-serif';
			ctx.textAlign = 'end';
			ctx.fillText(
				-this.x_axis_starting_point.number * i + this.x_axis_starting_point.suffix,
				-this.grid_size * i + 3,
				15
			);
		}

		// Ticks marks along the positive Y-axis
		// Positive Y-axis of graph is negative Y-axis of the canvas
		for (let i = 1; i < this.num_lines_x - this.x_axis_distance_grid_lines; i++) {
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#000000';

			// Draw a tick mark 6px long (-3 to 3)
			ctx.moveTo(-3, this.grid_size * i + 0.5);
			ctx.lineTo(3, this.grid_size * i + 0.5);
			ctx.stroke();

			// Text value at that point
			ctx.font = '12px sans-serif';
			ctx.textAlign = 'start';
			ctx.fillText(
				-this.y_axis_starting_point.number * i + this.y_axis_starting_point.suffix,
				8,
				this.grid_size * i + 3
			);
		}

		// Ticks marks along the negative Y-axis
		// Negative Y-axis of graph is positive Y-axis of the canvas
		for (let i = 1; i < this.x_axis_distance_grid_lines; i++) {
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#000000';

			// Draw a tick mark 6px long (-3 to 3)
			ctx.moveTo(-3, -this.grid_size * i + 0.5);
			ctx.lineTo(3, -this.grid_size * i + 0.5);
			ctx.stroke();

			// Text value at that point
			ctx.font = '12px sans-serif';
			ctx.textAlign = 'start';
			ctx.fillText(
				this.y_axis_starting_point.number * i + this.y_axis_starting_point.suffix,
				8,
				-this.grid_size * i + 3
			);
		}

		ctx.restore();
	}

	drawVertices() {
		let ctx = this.ctx;
		//ctx.save();
		ctx.strokeStyle = '#fff';
		ctx.lineWidth = 2;

		// positive vertices
		for (let i = 0; i < this.vertices.positive.length; ++i) {
			ctx.fillStyle = '#000';
			var cx =
				this.vertices.positive[i][0] * this.grid_size + this.y_axis_distance_grid_lines * this.grid_size;
			var cy =
				this.vertices.positive[i][1] * this.grid_size * -1 + this.x_axis_distance_grid_lines * this.grid_size;

			ctx.beginPath();
			ctx.arc(cx, cy, 3, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
		}

		// negative vertices
		for (let i = 0; i < this.vertices.negative.length; ++i) {
			ctx.fillStyle = 'red';
			var cx =
				this.vertices.negative[i][0] * this.grid_size + this.y_axis_distance_grid_lines * this.grid_size;
			var cy =
				this.vertices.negative[i][1] * this.grid_size * -1 + this.x_axis_distance_grid_lines * this.grid_size;

			ctx.beginPath();
			ctx.arc(cx, cy, 3, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
		}

		ctx.restore();
	}
}

export default Graph;
