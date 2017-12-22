let cardSymbol = [		//Create a list that holds all of cards
	'fa-diamond',
	'fa-paper-plane-o',
	'fa-anchor',
	'fa-bolt',
	'fa-cube',
	'fa-anchor',
	'fa-leaf',
	'fa-bicycle',
	'fa-diamond',
	'fa-bomb',
	'fa-leaf',
	'fa-bomb',
	'fa-bolt',
	'fa-bicycle',
	'fa-paper-plane-o',
	'fa-cube'
];

let cardList = [], targetList = [];		//init variables
let move = 0, matched = 0;
let firstClick = Boolean(true);
let win = Boolean(false);

let timeUnit;                          		//stopwatch variables
let seconds = 0, minutes = 0, hours = 0;	//stopwatch variables

buildGame();
cardListener();
restartListener();



function restartListener() {
	$('.restart').click(function() {
		stopWatch();
		buildGame();
	});
}

function cardListener() {
	$('ul').on('click','li', function (evt) {
		let show = $(evt.target).hasClass('show');
		let match = $(evt.target).hasClass('match');
		if ( !(show || match) ) {    //osetreni aby nesla karta otocit dvakrat
			cardOpen(evt.target);
			addCardToList(evt.target);
		}
	});
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function shuffle(array) {
 	array.sort(function() { return 0.5 - Math.random() });
}

function buildGame() {
	move = 0;
	matched = 0;
	resetList();
	firstClick = true;
	win = false;
	clearWatch();   //reset stopwatch
 	$('.moves').text(move);   //set 0  moves
	$('.fa-star-o').removeClass('fa-star-o').addClass('fa-star');
	$('.deck').text(''); //deleting cadrs

	shuffle(cardSymbol);	  // shuffle cards

	for (let i = 0; i < cardSymbol.length ; i++) {
		$('.deck').append(`<li class="card"><i class="fa ${cardSymbol[i]}"></i></li>`);
	}

	leaderBoard();
}

function cardOpen(target) {
	if ( firstClick ) {
		startWatch();
		firstClick = false;
	}
	$(target).removeClass('close');
	$(target).addClass('show open');
	$(target).children().addClass('show open');   //pridam i <i> classu show open, aby neslo klikat i na ikonu
}

function addCardToList(target) {
	let card = $(target).children().attr('class'); //zacileni na ikonu ktera je umistena v targetu - li;
	if (cardList.length < 2) {
		cardList.push(card);
		targetList.push(target);  //pole pro ukladani jquerry cilu - karet
	}
	if (cardList.length === 2) {
		compareCards();
	}
}

function compareCards(){
	cardList[0] === cardList[1] ? cardMatch(targetList) : setTimeout('cardClose(targetList)',300);
	moveCounter();
	displayStars();
	if (win) {
		stopWatch();
		winGame();
	}
}

function cardClose(targets) {
	$(targets).removeClass('show open');
	$(targets).addClass('close');
	resetList();
}

function cardMatch(targets) {
	$(targets).removeClass('open');
	$(targets).addClass('animated bounceIn match');
	matched++;
	if (matched === cardSymbol.length/2) {
		win = true;
	}
	resetList();
}

function winGame() {
	let star = $('.fa-star').length;
	star += (star > 1 ? ' stars' : ' star');
	const time = $('.timer').text();
	addResult({move,star,time});
	swal({
		title: 'Congratulation, You won!',
		text: `With ${move} moves and ${star} in time ${time}.`,
		type: 'success',
		confirmButtonText: 'Play again?',
		confirmButtonColor: 'green'
	}).then((result) => {
		if (result.value) {
			buildGame();
		}
	})
}

function resetList(){
	cardList = []; //vynuluje pole
	targetList = [];
}

function moveCounter() {
	move++;
	$('.moves').text(move);
}

function displayStars() {
	if (move > 18) {
		$('#firststar').removeClass('fa-star').addClass('fa-star-o');
	} else if (move > 15 ) {
		$('#secondstar').removeClass('fa-star').addClass('fa-star-o');
	} else if (move > 12) {
		$('#thirdstar').removeClass('fa-star').addClass('fa-star-o');
	}
}

//----------------------LEADERBOARD----------------------
function leaderBoard() {
	$('.leaderboard').remove();
	const data = localStorage.getItem('results');
	if (data) {
  		const results = JSON.parse(data);

  		$('<div class="leaderboard"><h1>Leaderboard</h1><div>').insertAfter('.deck');

  		for (const res of results ) {
	  		$('.leaderboard').append('<h2> Moves:' + res.move + ' ' + res.star + '  ' + res.time + '</h2>');
	  	}
	}
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

//----------------------STOPWATCH----------------------
function startWatch () {
    timeUnit = setInterval(addTime, 1000);
}

function addTime() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    $('.timer').text( ((hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds)) );
}

function stopWatch() {
    clearInterval(timeUnit);
}

function clearWatch() {
    $('.timer').text('00:00:00');
    seconds = 0;
    minutes = 0;
    hours = 0;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */