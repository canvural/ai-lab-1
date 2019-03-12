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

	static evaulatePoly() {}
}

export default Genetic;
