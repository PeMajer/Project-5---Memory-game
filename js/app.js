/*
 * Create a list that holds all of your cards
 */

let cardSymbol = [
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

let cardList = [], targetList = [];
let move = 0, matched = 0;
let firstClick = Boolean(true);

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
}

function cardClose(targets) {
	$(targets).removeClass('show open');
	$(targets).addClass('close');
	resetList();
}

function cardMatch(targets) {
	$(targets).addClass('match');
	matched++;
	if (matched === cardSymbol.length/2) {
		stopWatch();
		winGame();
	}
	resetList();
}

function winGame() {
	let star = $('.fa-star').length;
	star += (star > 1 ? ' stars' : ' star');
	const time = $('.timer').text();
	const result = {move,star,time};
	console.log(result);
	addResult(result);
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
	if (move > 17) {
		$('#firststar').removeClass('fa-star').addClass('fa-star-o');
	} else if (move > 14 ) {
		$('#secondstar').removeClass('fa-star').addClass('fa-star-o');
	} else if (move > 11) {
		$('#thirdstar').removeClass('fa-star').addClass('fa-star-o');
	}
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