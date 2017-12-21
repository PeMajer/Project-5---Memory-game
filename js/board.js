function leaderBoard() {
	$('.leaderboard').remove();
	const data = localStorage.getItem('results');
	if (data) {
  		const results = JSON.parse(data);

  		$('<div class="leaderboard"><h1>LeaderBoard</h1><div>').insertAfter('.deck');

  		for (const res of results ) {
	  		$('.leaderboard').append('<h2> Moves:' + res.move + ' ' + res.star + '  ' + res.time + '</h2>');
	  	}
  		console.log('data v localu');
  		console.log(results);
	}
	console.log('leaderboard');
}

function addResult(result){
	const data = localStorage.getItem('results');
	if (data) {
	  		let results = JSON.parse(data);
	  		results.push(result);
	  		localStorage.setItem('results', JSON.stringify(results));
	  	} else {
	  		let results = [];
	  		results.push(result);
	  		localStorage.setItem('results', JSON.stringify(results));
	  	}
}


function clearResults() {
	localStorage.clear();
}