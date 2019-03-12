import { $, jQuery } from 'jquery';
import Graph from './Graph.js';
import Genetic from './Genetic.js';

window.$ = $;
window.jQuery = jQuery;

const graph = new Graph(document.getElementById('scratch'));
const genetic = new Genetic(graph);

graph.draw();

$(document).ready(function() {
	$('#scratch').click(function(e) {
		let x =
			(e.offsetX || e.clientX - $(e.target).offset().left) -
			graph.y_axis_distance_grid_lines * graph.grid_size;
		let y =
			(e.offsetY || e.clientY - $(e.target).offset().top) - graph.x_axis_distance_grid_lines * graph.grid_size;

		let cx = x / graph.grid_size;
		let cy = (y / graph.grid_size) * -1;

		if (graph.setSelectionType == 0) {
			graph.vertices.positive.push([cx, cy]);
		} else {
			graph.vertices.negative.push([cx, cy]);
		}

		graph.draw();
		graph.drawVertices();
	});

	$('#solve').click(function() {
		var config = {
			iterations: $('#iterations').val(),
			size: 250,
			crossover: parseFloat($('#crossover').val()),
			mutation: parseFloat($('#mutation').val()),
			skip: 10
		};

		var userData = {
			terms: parseInt($('#degree').val()) + 1,
			vertices: graph.vertices
		};

		genetic.evolve(config, userData);
	});

	$('#setSelection').change(function() {
		var v = $(this).val();

		graph.setSelectionType = v;
	});

	$('#dataset').change(function() {
		var v = $(this).val();

		$('#dataset option:selected').prop('selected', false);
		$('#dataset option:first').prop('selected', 'selected');

		if (v == '') {
			return;
		} else if (v == 'clear') {
			graph.vertices = { positive: [], negative: [] };
		} else if (v == 'random') {
			graph.vertices = { positive: [], negative: [] };

			var i = 0;

			var x;
			var b = Math.random() * 3;
			var m = Math.random() + 0.5;
			var n = 100;
			for (i = 0; i < n; ++i) {
				var cx = (Math.random() - 0.5) * 10;
				var cy = m * cx + b + (Math.random() - 0.5) * 2;
				graph.vertices.positive.push([cx, cy]);
			}

			var b = Math.random() * 2;
			var m = Math.random() - 0.5;
			var n = 100;
			for (i = 0; i < n; ++i) {
				var cx = (Math.random() - 0.5) * 8;
				var cy = m * cx - b + (Math.random() - 0.5) * 2;
				graph.vertices.negative.push([cx, cy]);
			}
		} else if (v == 'random2') {
			graph.vertices = { positive: [], negative: [] };

			var i = 0;
			for (i = 0; i < 100; ++i) {
				var rx = Math.random() * 14 - 4;
				var ry = Math.random() * 8 - 4;

				graph.vertices.positive.push([rx, ry]);
			}

			for (i = 0; i < 100; ++i) {
				var rx = Math.random() * 14 - 4;
				var ry = Math.random() * 8 - 4;

				graph.vertices.negative.push([rx, ry]);
			}
		}

		graph.draw();
		graph.drawVertices();
	});

	$('#single-selection').change(function() {
		genetic.select1 = window['genetic']['mutationSelectionFunctions'][$(this).val()];
	});

	$('#pair-selection').change(function() {
		genetic.select2 = window['genetic']['crossoverSelectionFunctions'][$(this).val()];
	});

	$('#dataset')
		.val('random2')
		.change();
	$('#setSelection')
		.val('0')
		.change();
});
