import Clone from './Clone.js';
import Serialization from './Serialization.js';
import Optimize from './Optimize.js';

class Genetic {
	mutationSelectionFunctions = {
		// Roulette selection
		// Calculate sum of all fitness in population
		// Select random number between 0 and sum
		// Take the first population that has fitness bigger than the random value
		roulette: function(pop) {
			let sum = 0;
			const n = pop.length;
			for (let i = 0; i < n; ++i) {
				sum += pop[i].fitness;
			}

			let r = Math.floor(Math.random() * Math.floor(sum));

			sum = 0;

			for (let i = 0; i < n; ++i) {
				sum += pop[i].fitness;

				if (sum > r) {
					return pop[i].entity;
				}
			}

			return pop[Math.floor(Math.random() * pop.length)].entity;
		},
		// Return the fittest
		fittest: function(pop) {
			return pop[0].entity;
		},
		// Return randomly selected entity
		random: function(pop) {
			return pop[Math.floor(Math.random() * pop.length)].entity;
		},
		tournament2: function(pop) {
			var n = pop.length;
			var a = pop[Math.floor(Math.random() * n)];
			var b = pop[Math.floor(Math.random() * n)];

			return a.fitness < b.fitness ? a.entity : b.entity;
		}
	};

	crossOverFunctions = {
		random: function(pop) {
			return [this.mutationSelectionFunctions.random(pop), this.mutationSelectionFunctions.random(pop)];
		},
		tournament2: function(pop) {
			return [
				this.mutationSelectionFunctions.tournament2(pop),
				this.mutationSelectionFunctions.tournament2(pop)
			];
		},
		roulette: function(pop) {
			return [this.mutationSelectionFunctions.roulette(pop), this.mutationSelectionFunctions.roulette(pop)];
		}
	};

	constructor(graph) {
		this.graph = graph;

		// population
		this.fitness = null;
		this.seed = null;
		this.mutate = null;
		this.crossover = null;
		this.select1 = null;
		this.select2 = null;
		this.optimize = null;
		this.generation = null;
		this.notification = null;

		this.configuration = {
			size: 250,
			crossover: 0.9,
			mutation: 0.2,
			iterations: 100,
			fittestAlwaysSurvives: true,
			maxResults: 100,
			webWorkers: true,
			skip: 0
		};

		this.userData = {};
		this.internalGenState = {};

		this.entities = [];

		this.usingWebWorker = false;
	}

	// applies mutation based on mutation probability
	mutateOrNot(entity) {
		return Math.random() <= this.configuration.mutation && this.mutate ? this.mutate(Clone(entity)) : entity;
	}

	// allow chromosomal drift with this range (-0.05, 0.05)
	// applied to randomly chosen coefficent
	mutate(entity) {
		var drift = (Math.random() - 0.5) * 2 * 0.2;

		var i = Math.floor(Math.random() * entity.length);
		entity[i] += drift;

		return entity;
	}

	// For daughter, Takes half of father, and combines it with half of mother
	// For son, Takes other half of mother, and combines it with other half of father
	crossover(mother, father) {
		var father_part = father.splice(0, Math.floor(father.length / 2));
		var mother_part = mother.splice(0, Math.floor(mother.length / 2));

		var son = mother_part.concat(father);
		var daughter = father_part.concat(mother);

		return [son, daughter];
	}

	seed() {
		let a = [];

		for (let i = 0; i < this.userData['terms']; ++i) {
			a.push(Math.random() - 0.5);
		}

		return a;
	}

	/**
	 * Loop through all positive vertices, if its above the polynomial, increase fitness
	 * Loop through all negative vertices, if its below the polynomial increase fitness
	 */
	fitness(entity) {
		let fitness = 0;
		const vertices = this.userData['vertices'];

		for (let i = 0; i < vertices.positive.length; ++i) {
			if (vertices.positive[i][1] - this.constructor.evaluatePoly(entity, vertices.positive[i][0]) < 0) {
				fitness++;
			}
		}

		for (let i = 0; i < vertices.negative.length; ++i) {
			if (vertices.negative[i][1] - this.constructor.evaluatePoly(entity, vertices.negative[i][0]) > 0) {
				fitness++;
			}
		}

		return fitness;
	}

	static evaulatePoly(coefficients, x) {
		let s = 0;
		let p = 1;
		for (let i = 0; i < coefficients.length; ++i) {
			s += p * coefficients[i];
			p *= x;
		}

		return s;
	}

	notification(pop, generation, stats, isFinished) {
		function poly(entity) {
			var a = [];

			for (let i = entity.length - 1; i >= 0; --i) {
				var buf = entity[i].toPrecision(2);
				if (i > 1) buf += '<em><b>x<sup>' + i + '<sup></b></em>';
				else if (i === 1) buf += '<em><b>x</b></em>';

				a.push(buf);
			}

			return a.join(' + ');
		}

		function lerp(a, b, p) {
			return a + (b - a) * p;
		}

		if (generation === 0) {
			this.graph.solutions = [];
		}

		$('#solution').html(poly(pop[0].entity));
		$('#generation').html(generation + 1);
		$('#bestfit').html(pop[0].fitness.toPrecision(4));

		var last = this.graph.last || '';

		let str = pop[0].entity.join(',');

		if (last !== str || isFinished) {
			if (last !== str) {
				this.graph.solutions.push(pop[0].entity);
				this.graph.last = str;
			}

			this.graph.draw();

			let start = Math.max(0, this.graph.solutions.length - 10);

			if (isFinished) {
				start = 0;
			}

			for (let i = start; i < this.graph.solutions.length; ++i) {
				let p = (i - start) / (this.graph.solutions.length - start);

				let r = Math.round(lerp(90, 255, p));
				let g = Math.round(lerp(0, 255, 0));
				let b = Math.round(lerp(200, 50, p));
				let alpha = lerp(0.5, 1, p);
				let strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
				let lineWidth = Math.floor(lerp(10, 1, p));

				this.graph.drawFunction(this.graph.solutions[i], strokeStyle, lineWidth);
			}

			this.graph.drawVertices();
		}
	}

	start() {
		// seed the population
		for (let i = 0; i < this.configuration.size; ++i) {
			this.entities.push(Clone(this.seed()));
		}

		for (let i = 0; i < this.configuration.iterations; ++i) {
			// reset for each generation
			this.internalGenState = {};

			// score and sort
			let pop = this.entities
				.map(function(entity) {
					return { fitness: this.fitness(entity), entity: entity };
				})
				.sort(function(a, b) {
					return this.optimize(a.fitness, b.fitness) ? -1 : 1;
				});

			// generation notification
			let mean =
				pop.reduce(function(a, b) {
					return a + b.fitness;
				}, 0) / pop.length;

			let stdev = Math.sqrt(
				pop
					.map(function(a) {
						return (a.fitness - mean) * (a.fitness - mean);
					})
					.reduce(function(a, b) {
						return a + b;
					}, 0) / pop.length
			);

			let stats = {
				maximum: pop[0].fitness,
				minimum: pop[pop.length - 1].fitness,
				mean: mean,
				stdev: stdev
			};

			let isFinished = i === this.configuration.iterations - 1;

			if (
				this.notification &&
				(isFinished || this.configuration['skip'] === 0 || i % this.configuration['skip'] === 0)
			) {
				this.sendNotification(pop.slice(0, this.maxResults), i, stats, isFinished);
			}

			if (isFinished) break;

			// crossover and mutate
			let newPop = [];

			// always get the best solution, to the next pop
			newPop.push(pop[0].entity);

			while (newPop.length < this.configuration.size) {
				if (
					this.crossover && // if there is a crossover function
					Math.random() <= this.configuration.crossover && // base crossover on specified probability
					newPop.length + 1 < this.configuration.size // keeps us from going 1 over the max population size
				) {
					let parents = this.select2(pop);
					let children = this.crossover(Clone(parents[0]), Clone(parents[1])).map(this.mutateOrNot);

					newPop.push(children[0], children[1]);
				} else {
					newPop.push(this.mutateOrNot(this.select1(pop)));
				}
			}

			this.entities = newPop;
		}
	}

	sendNotification(pop, generation, stats, isFinished) {
		const response = {
			pop: pop.map(Serialization.stringify),
			generation: generation,
			stats: stats,
			isFinished: isFinished
		};

		if (this.usingWebWorker) {
			postMessage(response);
		} else {
			this.notification(
				response.pop.map(Serialization.parse),
				response.generation,
				response.stats,
				response.isFinished
			);
		}
	}

	evolve(config, userData) {
		for (let k in config) {
			this.configuration[k] = config[k];
		}

		for (let k in userData) {
			this.userData[k] = userData[k];
		}

		// determine if we can use webworkers
		this.usingWebWorker =
			this.configuration.webWorkers &&
			typeof Blob !== 'undefined' &&
			typeof Worker !== 'undefined' &&
			typeof window.URL !== 'undefined' &&
			typeof window.URL.createObjectURL !== 'undefined';

		function addslashes(str) {
			return str.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
		}

		// bootstrap webworker script
		var blobScript = "'use strict'\n";
		blobScript +=
			"var Serialization = {'stringify': " +
			Serialization.stringify.toString() +
			", 'parse': " +
			Serialization.parse.toString() +
			'};\n';
		blobScript += 'var Clone = ' + Clone.toString() + ';\n';

		// make available in webworker
		blobScript +=
			'var Optimize = Serialization.parse("' + addslashes(Serialization.stringify(Optimize)) + '");\n';
		blobScript +=
			'var Select1 = Serialization.parse("' +
			addslashes(Serialization.stringify(this.mutationSelectionFunctions)) +
			'");\n';
		blobScript +=
			'var Select2 = Serialization.parse("' +
			addslashes(Serialization.stringify(this.crossOverFunctions)) +
			'");\n';

		// materialize our ga instance in the worker
		blobScript += 'var genetic = Serialization.parse("' + addslashes(Serialization.stringify(this)) + '");\n';
		blobScript += 'onmessage = function(e) { genetic.start(); }\n';

		var self = this;

		if (this.usingWebWorker) {
			// webworker
			var blob = new Blob([blobScript]);
			var worker = new Worker(window.URL.createObjectURL(blob));
			worker.onmessage = function(e) {
				var response = e.data;
				self.notification(
					response.pop.map(Serialization.parse),
					response.generation,
					response.stats,
					response.isFinished
				);
			};
			worker.onerror = function(e) {
				alert('ERROR: Line ' + e.lineno + ' in ' + e.filename + ': ' + e.message);
			};
			worker.postMessage('');
		} else {
			// simulate webworker
			(function() {
				var onmessage;
				eval(blobScript);
				onmessage(null);
			})();
		}
	}
}

export default Genetic;
