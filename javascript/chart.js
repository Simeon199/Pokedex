/**
 * Creates and returns a Chart.js bar chart displaying the stats of a given Pokémon.
 * The chart is rendered on the provided canvas element with a horizontal bar layout.
 *
 * @param {HTMLCanvasElement} pokemonStatsCard - The canvas element where the chart will be drawn.
 * @param {string} pokemonName - The name of the Pokémon, used as the dataset label.
 * @param {number[]} pokemonStatsDataset - An array of numerical values representing the Pokémon's stats.
 * @returns {Chart} A new Chart.js Chart instance configured as a horizontal bar chart.
 */

function displayPokemonChart(pokemonStatsCard, pokemonName, pokemonStatsDataset){
    let ctx = pokemonStatsCard.getContext('2d');
    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: pokemonLabels,
        datasets: [{
          label: pokemonName + ' Stats', 
          data: pokemonStatsDataset,
          backgroundColor: 'rgba(70, 128, 136, 1)',
          borderColor: 'rgba(70, 128, 136, 1)',
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          legend: {
            labels: {
              color: "black"
            }
          }
        },
        indexAxis: 'y',
        scales: {
          x: {
            ticks: {
              color: "black"
            }
          },
          y: {
            ticks: {
              color: "black"
            },
            beginAtZero: true
          }
        }
      }
    });
  }