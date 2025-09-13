function displayPokemonChart(pokemonStatsCard, pokemonName, pokemonStatsDataset){
    let ctx = pokemonStatsCard.getContext('2d');
    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: pokemonLabels,
        datasets: [{
          label: pokemonName + ' Stats', 
          data: pokemonStatsDataset,
          backgroundColor: 'rgba(90, 150, 192, 1)',
          borderColor: 'rgba(90, 150, 192, 1)',
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