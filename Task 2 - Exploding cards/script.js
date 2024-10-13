/*
Imports
*/
import * as constants from "./constants.js";
import { card } from "./card.js";

/*
Declarations, Events, and Page Setup
*/

let container = document.createElement('div');
container.classList.add('container');
document.body.appendChild(container);

const button = document.createElement('button');
button.innerText = 'Draw Card';
button.id = 'draw';
container.appendChild(button); 

const msjDiv = document.createElement('div');
msjDiv.id = 'msj';
container.appendChild(msjDiv);

button.addEventListener('click', showCard);

let deck = [];


/*
Functions
*/

// Function to get a random value for the cards
function getRandomValue() {
    return Math.floor(Math.random() * (constants.MAX_POINT_VALUE - constants.MIN_POINT_VALUE + 1)) + constants.MIN_POINT_VALUE;
}

// Function to create cards and fill the array
function createCard() {
    deck = []; 
    for (let i = 0; i < constants.MAX_NUM_CARD_BOMB; i++) {
        deck.push(new card(constants.CARD_TYPES.BOMB));
    }
    for (let i = 0; i < constants.MAX_NUM_CARD_DEFUSE; i++) {
        deck.push(new card(constants.CARD_TYPES.DEFUSE));
    }
    for (let i = 0; i < constants.MAX_NUM_CARD_JUMP; i++) {
        deck.push(new card(constants.CARD_TYPES.JUMP));
    }
    for (let i = 0; i < constants.MAX_NUM_CARD_NOPE; i++) {
        deck.push(new card(constants.CARD_TYPES.NOPE));
    }
    for (let i = 0; i < constants.MAX_NUM_CARD_POINTS; i++) {
        deck.push(new card(constants.CARD_TYPES.POINTS, getRandomValue()));
    }
}

// Function to shuffle the deck using Fisher-Yates
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Function to display a card
function showCard() {
    const messageElement = document.getElementById('msj');

    if (deck.length === 0) {
        messageElement.innerText = "No more cards!";

        // Change the button to "Restart"
        const button = document.getElementById('draw');
        button.innerText = 'Restart';
        button.id = 'reload';

        // Change the functionality of the button to resetGame
        button.removeEventListener('click', showCard);
        button.addEventListener('click', resetGame);

        // Remove the displayed card, if it exists
        const existingCard = document.querySelector('.card');
        if (existingCard) {
            existingCard.remove();
        }

    } else {
        // Remove the previous card, if it exists
        const existingCard = document.querySelector('.card');
        if (existingCard) {
            existingCard.remove();
        }

        const cardToShow = deck.pop();

        cardStructure(cardToShow);
    }
}

// Function to reset the game
function resetGame() {
    // Re-create the deck and shuffle it
    createCard();
    shuffleDeck(deck);

    // Change the message
    document.getElementById('msj').innerText = "The deck has been reset!";

    // Change the button back to "Draw Card"
    const button = document.getElementById('reload');
    button.innerText = 'Draw Card';
    button.id = 'draw';

    // Remove the "resetGame" event and add back the "showCard" event
    button.removeEventListener('click', resetGame);
    button.addEventListener('click', showCard);
    document.getElementById('msj').innerText = "";

    // Remove the displayed card, if it exists
    const existingCard = document.querySelector('.card');
    if (existingCard) {
        existingCard.remove();
    }
}

// Fill and shuffle the deck on page load
createCard();
shuffleDeck(deck);


/*
Function to fully create the card structure
*/
function cardStructure(cardToShow) {

    let cardDiv = document.createElement('div');
    cardDiv.classList.add('card');

    // Add additional class based on the type of card
    switch (cardToShow.type) {
        case constants.CARD_TYPES.BOMB:
            cardDiv.classList.add('bomb-card');
            break;
        case constants.CARD_TYPES.DEFUSE:
            cardDiv.classList.add('defuse-card');
            break;
        case constants.CARD_TYPES.JUMP:
            cardDiv.classList.add('jump-card');
            break;
        case constants.CARD_TYPES.NOPE:
            cardDiv.classList.add('nope-card');
            break;
        case constants.CARD_TYPES.POINTS:
            cardDiv.classList.add('points-card');
            break;
        default:
            console.warn(`Unknown card type: ${cardToShow.type}`);
    }

    let iconTop = document.createElement('img');
    iconTop.src = constants.cardImages[cardToShow.type];
    iconTop.alt = `${cardToShow.type} Icon`;
    iconTop.classList.add('icon-top');
    cardDiv.appendChild(iconTop);

    let cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header');

    let cardHeaderTitle = document.createElement('strong');
    cardHeaderTitle.innerText = constants.CARD_TYPES[cardToShow.type];
    cardHeader.appendChild(cardHeaderTitle);

    // Optional description of the card value (only if it is POINTS)
    if (cardToShow.type === constants.CARD_TYPES.POINTS && cardToShow.value !== 0) {
        let cardHeaderDescription = document.createElement('p');
        cardHeaderDescription.innerText = `Value: ${cardToShow.value}`;
        cardHeader.appendChild(cardHeaderDescription);
    }

    cardDiv.appendChild(cardHeader);

    let cardImage = document.createElement('img');
    cardImage.src = constants.cardImages[cardToShow.type];
    cardImage.alt = 'Card Image';
    cardImage.classList.add('card-image');
    cardDiv.appendChild(cardImage);

    let iconBottom = document.createElement('img');
    iconBottom.src = constants.cardImages[cardToShow.type];
    iconBottom.alt = 'Bottom Icon';
    iconBottom.classList.add('icon-bottom');
    cardDiv.appendChild(iconBottom);

    document.body.appendChild(cardDiv);
}

