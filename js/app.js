let cardSymbol = [		// Create a list that holds all of cards
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

let cardList = [], targetList = [];		// init variables
let move = 0, matched = 0;

let firstClick = Boolean(true);			// variable for checking first click
let win = Boolean(false);				// variable for checking win game

let fastClicking = Boolean(false);     	// variable for checking fast clickings of cards

let timeUnit;                          		//stopwatch variable
let seconds = 0, minutes = 0, hours = 0;	//stopwatch variables

buildGame();			// start game
cardListener();			// create cards listener
restartListener();		// create restart button listener


/**
* @description Create reset button listener
*/
function restartListener() {
	$('.restart').click(function() {
		stopWatch();
		buildGame();
	});
}

/**
* @description Create card listener
*/
function cardListener() {
	$('ul').on('click','li', function (evt) {			// listener target
		let show = $(evt.target).hasClass('show');		// dection whether the card is open
		let match = $(evt.target).hasClass('match');	// dection whether the card is in match cards
		if ( !(show || match || fastClicking) ) {    	// can't click on open/match cards and can't click on card when other cards are  closing
			cardOpen(evt.target);
			addCardToList(evt.target);
		}
	});
}

/**
* @description Shuffle the list of cards
*/
function shuffle(array) {
 	array.sort(function() { return 0.5 - Math.random() });
}

/**
* @description Display the cards on the page
*/
function buildGame() {
	move = 0;	   // seting variables on start's value
	matched = 0;
	resetList();
	firstClick = true;
	win = false;
	clearWatch();			// reseting stopwatch
 	$('.moves').text(move);			// display 0 moves on page
	$('.fa-star-o').removeClass('fa-star-o').addClass('fa-star');	// display three stars on page
	$('.deck').text('');			// deleting cadrs
	shuffle(cardSymbol);	  		// shuffle cards
	for (let i = 0; i < cardSymbol.length ; i++) {		//loop through each card and create its HTML
		$('.deck').append(`<li class="card"><i class="fa ${cardSymbol[i]}"></i></li>`);
	}
	leaderBoard();
}

/**
* @description Open the card and start stopwatch if it is first open card
*/
function cardOpen(target) {
	if ( firstClick ) {		// first click check
		startWatch();
		firstClick = false;
	}
	$(target).removeClass('close');
	$(target).addClass('show open');
	$(target).children().addClass('show');   //pridam i <i> classu show open, aby neslo klikat i na ikonu
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
	cardList[0] === cardList[1] ? cardMatch(targetList) : cardClose(targetList);
	moveCounter();
	displayStars();
	if (win) {
		stopWatch();
		winGame();
	}
}

function cardClose(targets) {
	$(targets).removeClass('open');
	$(targets).addClass('shaked');
	fastClicking = true;
	setTimeout(function() {
		$(targets).removeClass('show shaked');
		$(targets).addClass('close');
		resetList();
		fastClicking = false;
	},600);
}

function cardMatch(targets) {
	$(targets).removeClass('open');
	$(targets).addClass('match');
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
	swal({
		title: 'Congratulation, You won!',
		html: `<p>With ${move} moves and ${star} in time ${time}.</p> <p>Insert your name for addition to leaderboard:</p>`,
		input: 'text',
		type: 'success',
		confirmButtonText: 'Play again?',
		confirmButtonColor: 'green'
	}).then((result) => {
		if (result.value) {
			const name = result.value;
			addResult({name,move,star,time});
			buildGame();
		} else {
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
  		results.sort((a, b) => a.move - b.move);
  		$('<div class="leaderboard"><h1>Leaderboard</h1></div>').insertAfter('.deck');

  		for (const res of results ) {
	  		$('.leaderboard').append('<div class="line"><div>' + res.name + '</div><span>' + res.move + ' moves</span><span>' + res.star + '</span><span>' + res.time + '</span></div>');
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

function clearResults() {
	localStorage.removeItem('results');
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