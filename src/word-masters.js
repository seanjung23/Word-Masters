const ANSWER_LENGTH = 5;
// const ROUNDS = 6;
const letters = document.querySelectorAll('.letter');
const loadingDiv = document.querySelector('.info-bar');

const init = async () => {
  let currentGuess = '';
  let currentRow = 0;

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
    // TODO validate the word

    // TODO do all the marking as "correct" "close" or "wrong"

    // TODO did they win or lose

    currentRow++;
    currentGuess = '';
  };

  const backspace = () => {
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);

    letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = "";
  }

  const handleKeyPress = (event) => {
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
}

const isLetter = (letter) => /^[a-zA-Z]$/.test(letter);

init();