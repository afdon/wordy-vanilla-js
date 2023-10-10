const maxGuesses = 6;
const lettersPerWord = 5;
const isValidWord = false;
let unvalidatedGuess = ""
let validGuess
let answer

async function getAnswer() {
  try {
    const response = await fetch("https://words.dev-apis.com/word-of-the-day?random=1")
    const body = await response.json();
    // console.log("The word is", body.word) 
    return body.word;
  } catch (error) {
    console.error(`There was an error: ${error}.`)
  }
};

async function main() {
  answer = await getAnswer();
}
main()

async function validateWord(data = {}) {
  try {
    const response = await fetch("https://words.dev-apis.com/validate-word", {
      method: "POST",
      cache: "no-cache",
      body: JSON.stringify(data),
    })
    return response.json();
  } catch (error) {
    console.error(`There was an error: ${error}.`)
  }
}

let guesses = [];

function isLetters(string) {
   const lettersRegex = /^[A-Za-z]+$/;
   if(string.match(lettersRegex))
     {
      return true;
     }
   else
     {
     return false;
     }
  }

const isFiveChars = (string) => {
  if (string.length === 5) return true;
}

let box = document.querySelector("input");

box.addEventListener("keyup", function (e) {
  console.log(e.key); 

  if (e.key.length === 1 && isLetters(e.key)) unvalidatedGuess = unvalidatedGuess + (e.key);

  if (e.key === 'Backspace' && unvalidatedGuess.length > 1) {
    unvalidatedGuess.slice(0, -1);
    console.log(unvalidatedGuess)
  }

  if (unvalidatedGuess.length === lettersPerWord) {
      validateWord({ word: unvalidatedGuess }).then((data) => {
        console.log(`The word ${data.word} is valid: ${data.validWord}.`);
        if (data.validWord) {
          unvalidatedGuess = ""
          clearInput()
          // run the checkGuess function here.
          let status = checkGuess(data.word).charsStatus
          // console.log(`The first char is in the correct position: ${status[0].isCorrectPosition}. Is included: ${status[0].isIncluded}.`);
          guesses.push(data.word)

          rows = document.querySelectorAll(`.board > .row`)
          rows.forEach((row, i) => {
            if (!guesses[i]) return
            // console.log("guesses[i]2", i, guesses[i], guesses, rows.length)
            let statusOfGuess = checkGuess(guesses[i]).charsStatus
            // console.log("guesses[i]", guesses[i])
            let cells = row.querySelectorAll(`div`)
            cells.forEach((cell, j) => {
              if (guesses[i][j]) {cell.innerHTML = guesses[i][j]}
              if (statusOfGuess[j].isCorrectPosition) {
                cell.style.backgroundColor = "green";
              } else if (statusOfGuess[j].isIncluded) {
                cell.style.backgroundColor = "yellow"
              } else {
                cell.style.backgroundColor = "darkgrey"
              }
            })
          })
          
          console.log(guesses)
          const didWin = checkWin()
          if (didWin) {
            console.log(`You got it! The answer is ${answer}.`)
            // location.reload() // don't reload
          } else if (guesses.length === maxGuesses) {
              console.log(`Sorry, you lose. The answer was ${answer}. Try again tomorrow.`)
            
            guesses = [] // end the game and reset guesses
            location.reload(); // reload the page
          }
        } else {
          console.log(`Sorry, "${data.word}" isn't a valid word.`)
          unvalidatedGuess = ""
        }
        clearInput()
      })
  }

  function checkWin() {
    if (guesses.includes(answer)) {
      return true
    } else {
      return false
    }
  }

  function clearInput() {
    box.value = ""
  }

  console.log(`This is guesses: ${guesses}. The array length is ${guesses.length}.`);
});


function checkGuess(guess) {
  console.log("guess:", guess)
  const chars = guess.split("");
  let isCorrectAnswer = true;

  let charsStatus = chars.map((c, i) => {
    let isCorrectPosition = false;
    let isIncluded = false;

    if (c === answer[i]) {
      isCorrectPosition = true;
      isIncluded = true;
    } else if (answer.includes(c)) {
      isIncluded = true;
      isCorrectAnswer = false;
    } else {
      isCorrectAnswer = false;
    }

    return {
      char: c,
      isCorrectPosition,
      isIncluded,
    };
  });

  return {
    isCorrectAnswer,
    charsStatus,
  };
}

console.log("guesses: ", guesses);

// function displayGuesses() {
//   for (let i = 0; i < guesses.length; i++) {
//     // console.log("guesses[i]2", guesses[i])
//     if (guesses[i]) {
//       let charStatuses = checkGuess(guesses[i])
//       // console.log("charStatuses", charStatuses)
//     }
//   }
// }

