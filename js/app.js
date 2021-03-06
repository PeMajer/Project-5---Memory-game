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
* @description Open the card, display the card's symbol and start stopwatch if it is first open card
*/
function cardOpen(target) {
	if ( firstClick ) {		// first click check
		startWatch();
		firstClick = false;
	}
	$(target).removeClass('close');
	$(target).addClass('show open');
	$(target).children().addClass('show');   //add class show to <i> tags - can't click od it
}

/**
* @description add the card and jquery target to a list of open cards
* @param {object} target - jquery target of card
*/
function addCardToList(target) {
	let card = $(target).children().attr('class');			// getting a card symbol
	if (cardList.length < 2) {
		cardList.push(card);			// add symbol of open card to array/list
		targetList.push(target);  		// add target of open card to array/list
	}
	if (cardList.length === 2) {		// compare cards if two cards open
		compareCards();
	}
}

/**
* @description compare two open cards
*/
function compareCards(){
	cardList[0] === cardList[1] ? cardMatch(targetList) : cardClose(targetList);		//compare symbol of cards
	moveCounter();		// increase moves
	displayStars();		// display stars
	if (win) {			// win game check
		stopWatch();
		winGame();
	}
}

/**
* @description turn the cards back with css animation
* @param {array} targets - targets of click
*/
function cardClose(targets) {
	$(targets).removeClass('open');
	$(targets).addClass('shaked');		// shake with card
	fastClicking = true;				// can't click to other card when animation run
	setTimeout(function() {
		$(targets).removeClass('show shaked');
		$(targets).addClass('close');			// turn back animation
		resetList();			// reset list of card's symbols and targets
		fastClicking = false;
	},600);
}

/**
* @description if the cards do match, lock the cards in the open position
* @param {array} targets - targets of click
*/
function cardMatch(targets) {
	$(targets).removeClass('open');
	$(targets).addClass('match');			// match animation
	matched++;
	if (matched === cardSymbol.length/2) {			// when all cards are "match" then win the game
		win = true;
	}
	resetList();			// reset list of card's symbols and targets
}

/**
* @description if it's win game, show congratulation popup window with information about game
*/
function winGame() {
	let star = $('.fa-star').length;		// geting number of stars
	star += (star > 1 ? ' stars' : ' star');
	const time = $('.timer').text();		// getting time
	swal({			// popup windows with sweet alert 2
		title: 'Congratulation, You won!',
		html: `<p>With ${move} moves and ${star} in time ${time}.</p> <p>Insert your name for addition to leaderboard:</p>`,
		input: 'text',
		type: 'success',
		confirmButtonText: 'Play again?',
		confirmButtonColor: 'green'
	}).then((result) => {
		if (result.value) {
			const name = result.value;			// when name is enter
			addResult({name,move,star,time});	// save result to leaderboard - local storage
			buildGame();			// create new game
		} else {
			buildGame();
		}
	})
}

/**
* @description reset lists with open card symbol and targets of open cards
*/
function resetList(){
	cardList = [];
	targetList = [];
}

/**
* @description increase number of moves
*/
function moveCounter() {
	move++;
	$('.moves').text(move);
}

/**
* @description decrase number of stars
*/
function displayStars() {
	if (move > 15 ) {
		$('#secondstar').removeClass('fa-star').addClass('fa-star-o');			// hide 2nd star
	} else if (move > 12) {
		$('#thirdstar').removeClass('fa-star').addClass('fa-star-o');			// hidde 1st star
	}
}

//----------------------LEADERBOARD----------------------

/**
* @description show leaderboard
*/
function leaderBoard() {
	$('.leaderboard').remove();				// delete leaderboard
	const data = localStorage.getItem('results');		// load data from local storage (from variable results)
	if (data) {
  		const results = JSON.parse(data);					// save object to variable results
  		results.sort((a, b) => a.move - b.move);			// sort this array of objects according to moves
  		$('<div class="leaderboard"><h1>Leaderboard</h1></div>').insertAfter('.deck');			// display leaderboard

  		for (const res of results ) {			// display leaderboard
	  		$('.leaderboard').append('<div class="line"><div>' + res.name + '</div><span>' + res.move + ' moves</span><span>' + res.star + '</span><span>' + res.time + '</span></div>');
	  	}
	}
}

/**
* @description save data to local storage
* @param {object} result - game record with name, moves, stars and time
*/
function addResult(result){
	const data = localStorage.getItem('results');			// load data from local storage (from variable results)
	if (data) {
	  		let results = JSON.parse(data);
	  		results.push(result);
	  		localStorage.setItem('results', JSON.stringify(results));			// save results to storage
	  	} else {
	  		let results = [];			// create new local storage variable
	  		results.push(result);
	  		localStorage.setItem('results', JSON.stringify(results));			// save results to storage
	  	}
}

/**
* @description manual delete results from local storage
*/
function clearResults() {
	localStorage.removeItem('results');
}

//----------------------STOPWATCH----------------------

/**
* @description start stopwatch
*/
function startWatch () {
    timeUnit = setInterval(addTime, 1000);			// repeat with 1s delay -> increase the time by one second
}


/**
* @description increase time and display it
*/
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

/**
* @description stop stopwatch
*/
function stopWatch() {
    clearInterval(timeUnit);
}


/**
* @description set stopwatch to default time - 00:00:00
*/
function clearWatch() {
    $('.timer').text('00:00:00');		// display default time on page
    seconds = 0;
    minutes = 0;
    hours = 0;
}