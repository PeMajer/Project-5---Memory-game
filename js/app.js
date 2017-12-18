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

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */


//Shuffle function from http://stackoverflow.com/a/2450976

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
    	//funkce FLOOR vraci celou cast cisla, pokud je to zaporne cislo je to cela cast snizena o 1
    	//funkce RANDOM vrátí číslo v rozsahu 0 - 1
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function buildGame() {
	shuffle(cardSymbol);
	for (let i = 0; i < cardSymbol.length ; i++) {
		$('#test').append(`<li class="card"><i class="fa ${cardSymbol[i]}"></i></li>`);
	}
}

buildGame();


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

function cardOpen(target) {
	$(target).addClass('show open');
	$(target).children().addClass('show open');   //pridam i <i> classu show open, aby neslo klikat i na ikonu 
	console.log('klinuti na kartu');
}

$('ul').on('click','li', function (evt) {

	let show = $(evt.target).hasClass('show');
	let match = $(evt.target).hasClass('match');
	if ( !(show || match) ) {    //osetreni aby nesla karta otocit dvakrat
		console.log('otoceni karty')
		cardOpen(evt.target)
	}

});