const ANSWER_LENGTH = 5;
const ROUNDS = 5;
const letters = document.querySelectorAll('.letter');
const loadingDiv = document.querySelector('.info-bar');

const init = async () => {
  let currentGuess = '';
  let currentRow = 0;
  let isLoading = true;
  let done = false;

  const res = await fetch('https://words.dev-apis.com/word-of-the-day');
  const resObj = await res.json();
  const word = resObj.word.toUpperCase();
  const wordParts = word.split('');

  isLoading = false;
  setLoading(isLoading);

  const addLetter = (letter) => {
    if (currentGuess.length < ANSWER_LENGTH) {
      currentGuess += letter;
    } else {
      currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
    }

    letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter;
  };

  const commit = async () => {
    if (currentGuess.length !== ANSWER_LENGTH) {
      return;
    }

    isLoading = true;
    setLoading(isLoading);

    const res = await fetch('https://words.dev-apis.com/validate-word', {
      method: 'POST',
      body: JSON.stringify({ word: currentGuess })
    });

    const { validWord } = await res.json();

    isLoading = false;
    setLoading(false);

    if (!validWord) {
      markInvalidWord();
      return;
    }

    const guessParts = currentGuess.split('');
    const map = makeMap(wordParts);

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      if (guessParts[i] === wordParts[i]) {
        letters[ANSWER_LENGTH * currentRow + i].classList.add('correct');
      } else if (wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0) {
        letters[ANSWER_LENGTH * currentRow + i].classList.add('close');
        map[guessParts[i]]--;
      } else {
        letters[ANSWER_LENGTH * currentRow + i].classList.add('wrong');
      }
    }

    if (currentGuess === word) {
      alert('Winner!')
      document.querySelector('.brand').classList.add('winner');
      done = true;
    } else if (currentRow === ROUNDS) {
      alert('Loser!');
      done = true;
    }

    currentRow++;
    currentGuess = '';
  };

  const backspace = () => {
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);

    letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = '';
  }

  const markInvalidWord = () => {
    const rowToHighlight = currentRow;

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      letters[ANSWER_LENGTH * rowToHighlight + i].classList.remove('invalid');

      setTimeout(() => {
        letters[ANSWER_LENGTH * rowToHighlight + i].classList.add('invalid');
      }, 10);
    }
  };

  const handleKeyPress = (event) => {
    if (isLoading || done) {
      return;
    }

    const action = event.key;

    if (action === 'Enter') {
      commit();
    } else if (action === 'Backspace') {
      backspace();
    } else if (isLetter(action)) {
      addLetter(action.toUpperCase());
    }
  };

  document.addEventListener('keydown', handleKeyPress);
};

const isLetter = (letter) => /^[a-zA-Z]$/.test(letter);

const setLoading = (isLoading) => {
  loadingDiv.classList.toggle('hide', !isLoading);
}

const makeMap = (array) => {
  let obj = {};

  for (let i = 0; i < array; i++) {
      const letter = array[i];

      if (obj[letter]) {
        obj[letter]++
      } else {
        obj[letter] = 1;
      }
    }

    return obj;
}

init();