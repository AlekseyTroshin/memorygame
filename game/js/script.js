// ========================================  Глобальные переменные
let suit = ['C', 'D', 'H', 'S'];
let advantages = ['0', '2', '3', '4', '5', '6', '7', '8', '9', 'J', 'Q', 'K', 'A'];

let cards = [];
let count = 0;
let cardSimilarity = [];
let cardsCreate = [];
let cardTwo = [];
let cardCount = 0;
let cardPoint = 0;
let body = document.body;
let createDeckTimer;
let level = 1;
let dataNext = 1;
let levelTimeMinus = 0;
let miss = 10;
let flagMiss = false;
let createDeck__basic;
let deck;
let deck__body;
let deck__count;
let deck__begin;
let createDeck__miss;
let createDeck__level;
// -------------------------


// ======================================== создание игровых элементов
let createDeckElements = () => {
	createDeck__basic = document.createElement('div');
	createDeck__basic.className = 'deck'; 

	let createDeck__content = document.createElement('div');
	createDeck__content.className = 'deck__content'; 

	let createDeck__head = document.createElement('div');
	createDeck__head.className = 'deck__head'; 

	let createDeck__body = document.createElement('div');
	createDeck__body.className = 'deck__body';

	createDeck__count = document.createElement('p');
	createDeck__count.className = 'deck__count'; 
	createDeck__count.innerHTML = 'Очки: ' + cardPoint;

	createDeck__level = document.createElement('p');
	createDeck__level.className = 'deck__level'; 
	createDeck__level.innerHTML = 'Уровень: ' + level;

	let createDeck__begin = document.createElement('p');
	createDeck__begin.className = 'deck__begin'; 
	createDeck__begin.innerHTML = 'Начать заново';

	createDeck__miss = document.createElement('p');
	createDeck__miss.className = 'deck__miss'; 
	createDeck__miss.innerHTML = '';

	createDeck__head.appendChild(createDeck__begin);
	createDeck__head.appendChild(createDeck__level);
	createDeck__head.appendChild(createDeck__miss);
	createDeck__head.appendChild(createDeck__count);
	createDeck__basic.appendChild(createDeck__content);
	createDeck__content.appendChild(createDeck__head);
	createDeck__content.appendChild(createDeck__body);

	body.insertBefore(createDeck__basic, body.firstChild);

	deck = document.querySelector('.deck');
	deck__body = document.querySelector('.deck__body');
	deck__count = document.querySelector('.deck__count');
	deck__begin = document.querySelector('.deck__begin');

	deck__begin.addEventListener('click', function() {
		if(miss > 0) {
			zeroData();
		}
	});

	deck__body.addEventListener('click', function(event) {
		if(cardCount < 2) {
			let target = event.target;
			let deckCard = target.closest('.deck__card');
			let deckCardParent = target.closest('.deck__item');

			if(!deckCard || hasClass(deckCardParent, 'deck_open')) return;

			if(miss > 0) {
				cardCount = cardCount + 1;
				addClass(deckCardParent, 'deck_open');

				cardSimilarity.push(deckCard.getAttribute('data-card'));
				cardTwo.push(deckCardParent);
				
				checkCard(cardSimilarity, cardTwo);
			}
		}
	});
}
// -------------------------


// ======================================== обнуление данных
let zeroData = () => {
	clearClassCountFunc();
	clearDeckBody();
	clearTimeout(createDeckTimer);
	cardPoint = 0;
	deck__count.innerHTML = 'Очки: ' + cardPoint;
	miss = 10;
	level = 1;
	dataNext = 1;
	createDeck__level.innerHTML = 'Уровень: ' + level;
	createDeck__miss.innerHTML = '';
	levelTimeMinus = 0;
	cardsCreate = [];
	count = 0;
	cards = [];
	flagMiss = false;
	createDeck();
}
// -------------------------


// ======================================== создыние Колоды
let createDeck = () => {
	while(true) {
		let card = advantages[randomFunc(0, advantages.length)] + suit[randomFunc(0, suit.length-1)];

		if(count >= dataNext * 3) {
			break;
		} else if(checkCoincidenceCard(card)) {
			cards[count] = card;
			count = count + 1;
		}
	}

	createDeck__basic.setAttribute('data-level', dataNext );
	cardsDouble = cards.concat(cards);
	cardsDoubleSort = cardsDouble.sort(sortRandom);
	createDeckCard(cardsDoubleSort);

	createDeckTimer = setTimeout(()=> {
		for(let i= 0; i< deck__body.children.length; i++) {
			removeClass(deck__body.children[i], 'deck_open');
		}
	}, 3000 + levelTimeMinus);
}
// -------------------------

// ======================================== создыние Карт
let createDeckCard = (obj) => {
	cardsCreate = [];
	for(let i= 0; i< obj.length; i++) {
		let deck__item = document.createElement('div');
		deck__item.className = 'deck__item deck_open deck_create';

		let deck__card = document.createElement('div');
		deck__card.className ='deck__card';
		deck__card.setAttribute('data-card', obj[i]);
		
		let cardFace = document.createElement('img');
		cardFace.setAttribute('src', `img/${obj[i]}.png`);
		cardFace.className = 'deck__face';
		let cardShirt = document.createElement('img');
		cardShirt.setAttribute('src', `img/shirt.png`);
		cardShirt.className = 'deck__shirt';
		
		deck__card.appendChild(cardFace);
		deck__card.appendChild(cardShirt);
		
		deck__body.appendChild(deck__item);
		cardsCreate.push(deck__card);
	}

	let i = 0;
	let stopInterval = setInterval(function() {
		if(cardsCreate.length === i) {
			clearInterval(stopInterval);
			return;
		}
		deck__body.children[i].appendChild(cardsCreate[i]);
		i += 1;
	}, 50);
}
// -------------------------

// ======================================== проверка Карты
let checkCard = (similarity, cards) => {
	if(similarity[0] === similarity[1]) {
		deletCard(cards);
		cardPoint = cardPoint + level;
		deck__count.innerHTML = 'Очки: ' + cardPoint;
	} else if(similarity[0] != similarity[1] && similarity[1]) {
		if(flagMiss) {
			clickMissCard();
		}
		clearClassCountTimer();
	}
}
// -------------------------

// ======================================== удаление Карты
let deletCard = (cards) => {
	for(let a= 0; a< cards.length; a++) {
		addClass(cards[a], 'deck__delete');
	}
	clearClassCountTimer();
	setTimeout(function() {
		for(let b= 0; b< cards.length; b++) {
			cards[b].removeChild(cards[b].querySelector('.deck__card'));
		}
		deckCardCount = deck__body.querySelectorAll('.deck__card').length;
		if(deckCardCount === 0) {
			levelUp();
			createDeck__level.innerHTML = 'Уровень: ' + level;
			clearClassCountFunc();
			clearDeckBody();
			clearTimeout(createDeckTimer);
			createDeck();
			return;
		}
	} , 900);
}
// -------------------------

// ======================================== обнуление колоды через период времени
let clearClassCountTimer = () => {
	setTimeout(function() {
		clearClassCountFunc();
	} , 900);
}
// -------------------------

// ======================================== обнуление колоды
let clearClassCountFunc = () => {
	for(let i= 0; i< deck__body.children.length; i++) {
		removeClass(deck__body.children[i], 'deck_open');
	}
	cardSimilarity = [];
	cardTwo = [];
	cardCount = 0;
	card = '';
	count = 0;
}
// -------------------------

// ======================================== чистая колода 
let clearDeckBody = () => {
	deck__body.innerHTML = '';
}
// -------------------------

// ======================================== уровень вверх
let levelUp = () => {
	level = level + 1;

	if(level === 2) {
		flagMiss = true;
		createDeck__miss.innerHTML = 'Промахи: ' + miss;
	} 

	if(level < 4) {
		levelTimeMinus += 1000;
	}

	dataNext = dataNext + 1;

	if(dataNext > 3) {
		dataNext = 3;
	}
}
// -------------------------

// ======================================== не правильная пара карт
let clickMissCard = () => {
	miss = miss - 1;
	createDeck__miss.innerHTML = 'Промахи: ' + miss;
	if(miss === 0) {
		gameEnd();
	}
}
// -------------------------

// ========================================  Создание Начального и конечного экрана
let createBeginEnd = (text, textClass, btnText, img, startEndCount) => {
	let startEnd__basic = document.createElement('div');
	startEnd__basic.className = 'startEnd'; 

	let startEnd__content = document.createElement('div');
	startEnd__content.className = 'startEnd__content';  

	let startEnd__body = document.createElement('div');
	startEnd__body.className = 'startEnd__body';

	let startEnd__img = document.createElement('img');
	startEnd__img.className = 'startEnd__img';
	startEnd__img.setAttribute('src' , 'img/' + img);

	let startEnd__btn = document.createElement('div');
	startEnd__btn.className = 'startEnd__btn';

	let startEnd__btnText = document.createElement('p');
	startEnd__btnText.className = 'startEnd__btn-text';
	startEnd__btnText.innerHTML = btnText;

	let startEnd__text = document.createElement('p');
	startEnd__text.className = 'startEnd__text ' + textClass;
	startEnd__text.innerHTML = text;

	let startEnd__count = document.createElement('p');
	startEnd__count.className = 'startEnd__count';
	startEnd__count.innerHTML = 'Ваш итоговый счёт: ' + cardPoint;

	startEnd__btn.appendChild(startEnd__btnText);
	startEnd__body.appendChild(startEnd__img);
	startEnd__body.appendChild(startEnd__text);
	if(startEndCount) {
		startEnd__body.appendChild(startEnd__count);
	}
	startEnd__body.appendChild(startEnd__btn);
	startEnd__content.appendChild(startEnd__body);
	startEnd__basic.appendChild(startEnd__content);
	body.insertBefore(startEnd__basic, body.firstChild);

	let startEnd = body.querySelector('.startEnd');

	startEnd__btn.addEventListener('click', function() {
		body.removeChild(startEnd);
		createDeckElements();
		createDeck();
	});
}


// ========================================  Начало и Конец Игры
let gameBegin = () => {
	createBeginEnd('Memory game', 'startEnd__text_start', 'Начать игру', 'startGame.png', false);
}

let gameEnd = () => {
	body.removeChild(deck);
	createBeginEnd('Поздравляем!', 'startEnd__text_end', 'Ещё раз', 'endGame.png', true);
	zeroData();
}
// -------------------------

// ========================================  Начало игры
gameBegin();
// -------------------------


// ========================================== HELP FUNCTION
let hasClass = (obj, cls) => {
  let classes = obj.className.split(' ');

  for (let i = 0; i < classes.length; i++) {
    if (classes[i] == cls) {
    	return true;	
    }
  }
  return false;
}

let checkCoincidenceCard = (card) => {
	if(cards.indexOf(card) != -1) {
		return false;
	} 
	return true;
}

let removeClass = (obj, cls) => {
  let classes = obj.className.split(' ');

  for (let i = 0; i < classes.length; i++) {
    if (classes[i] == cls) {
      classes.splice(i, 1); 
      i--; 
    }
  }
  obj.className = classes.join(' ');
}


let addClass = (obj, cls) => {
  let classes = obj.className ? obj.className.split(' ') : [];

  for (let i = 0; i < classes.length; i++) {
    if (classes[i] == cls) return;
  }

  classes.push(cls);

  obj.className = classes.join(' ');
}

let randomFunc = (min, max) => {
	return Math.floor(Math.random() * (max - min) + min);
}

let sortRandom = (a, b) => {
	return Math.random() - 0.5;
}
// -------------------------