function leaderBoard() {
	$('.leaderboard').remove();
	const data = localStorage.getItem('results');
	if (data) {
  		const results = JSON.parse(data);
  		$('<div class="leaderboard"><h1>LeaderBoard</h1><div>').insertAfter('.deck');
  		$('.leaderboard').append('<h2> Moves:' + results.move + ' ' + results.star + '  ' + results.time + '</h2>');
  		console.log('data v localu');
  		console.log(results);
	}
	console.log('leaderboard');
}

function addResult(result){
	localStorage.setItem('results', JSON.stringify(result));
}