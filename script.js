const maxGuesses = 6;
const lettersPerWord = 5;
const isValidWord = false;
let unvalidatedGuess = ""
let validGuess
let answer

async function getAnswer() {
  try {
    const response = await fetch("https://words.dev-apis.com/word-of-the-day")
    const body = await response.json();
    console.log("The word is", body.word) 
    // why is there automatically a space before the word?
    return body.word;
  } catch (error) {
    console.error(`There was an error: ${error}.`)
  }
};

// getAnswer().then(response => answer = response)
// console.log("answer:", answer)
// or

async function main() {
  answer = await getAnswer();
  // console.log("answer:", answer);
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

// if (unvalidatedGuess.length === lettersPerWord) {

//   validateWord({ word: unvalidatedGuess }).then((data) => {
//     // JSON data parsed by `data.json()` call:
//     console.log(`The word ${data.word} is valid: ${data.validWord}`); 
//     if (data.validWord) {
//       validGuess = data.word
//     } else {
//       alert(`Sorry, "${data.word}" isn't a valid word.`)
//     }
//   })

// }

let guesses = [];

function isLetters(string) {
   const lettersRegex = /^[A-Za-z]+$/;
   if(string.match(lettersRegex))
     {
      return true;
     }
   else
     {
     alert("message");
     return false;
     }
  }
  // console.log(isLetters("hello"))

const isFiveChars = (string) => {
  if (string.length === 5) return true;
}

let box = document.querySelector("input");

box.addEventListener("keyup", function (e) {
  console.log(e.key); // this.value?

  if (e.key.length === 1 && isLetters(e.key)) unvalidatedGuess = unvalidatedGuess + (e.key);

  if (e.key === 'Backspace' && unvalidatedGuess.length > 1) {
    unvalidatedGuess.slice(0, -1);
    console.log(unvalidatedGuess)
  }

  if (unvalidatedGuess.length === lettersPerWord) {
      validateWord({ word: unvalidatedGuess }).then((data) => {
        // JSON data parsed by `data.json()` call:
        console.log(`The word ${data.word} is valid: ${data.validWord}.`);
        if (data.validWord) {
          unvalidatedGuess = ""
          clearInput()
          // run the checkGuess function here.
          let status = checkGuess(data.word).charsStatus
          console.log(`The first char is in the correct position: ${status[0].isCorrectPosition}. Is included: ${status[0].isIncluded}.`);
          guesses.push(data.word)

          // now display in UI
          // const firstRow = document.querySelectorAll(`.row-1 > div`)
          // firstRow.forEach((element, i) => element.innerHTML = guesses[0][i])
          // // why is the console log not defined?
          // // console.log(`first row: guesses[0] is ${guesses[0][i]}`)
          // firstRow.forEach((e, i) => {
          //   let statusOfGuess1 = checkGuess(guesses[0]).charsStatus
          //   if (statusOfGuess1[i].isCorrectPosition) {
          //     e.style.backgroundColor = "green";
          //   } else if (statusOfGuess1[i].isIncluded) {
          //     e.style.backgroundColor = "yellow"
          //   } else {
          //     e.style.backgroundColor = "grey"
          //   }
          // })

          rows = document.querySelectorAll(`.board > .row`)
          rows.forEach((row, i) => {
            if (!guesses[i]) return
            console.log("guesses[i]2", i, guesses[i], guesses, rows.length)
            let statusOfGuess = checkGuess(guesses[i]).charsStatus
            console.log("guesses[i]", guesses[i])
            // why did the below not work?
            // let divs = document.querySelectorAll(`.row > div`)
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

          // const secondRow = document.querySelectorAll(`.row-2 > div`)
          // secondRow.forEach((element, i) => element.innerHTML = guesses[1][i])
          // const thirdRow = document.querySelectorAll(`.row-3 > div`)
          // thirdRow.forEach((element, i) => element.innerHTML = guesses[2][i])
          // const fourthRow = document.querySelectorAll(`.row-4 > div`)
          // fourthRow.forEach((element, i) => element.innerHTML = guesses[3][i])
          // const fifthRow = document.querySelectorAll(`.row-5 > div`)
          // fifthRow.forEach((element, i) => element.innerHTML = guesses[4][i])
          // const sixthRow = document.querySelectorAll(`.row-6 > div`)
          // sixthRow.forEach((element, i) => element.innerHTML = guesses[5][i])

          
          
          console.log(guesses)
          const didWin = checkWin()
          if (didWin) {
            console.log(`You got it! The answer is ${answer}.`)
            // location.reload() // don't reload, at least not right away
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

// guesses.push(checkGuess("hello"));
// guesses.push(checkGuess("whatz"));
// guesses.push(checkGuess("wordz"));
// guesses.push(checkGuess("words"));

console.log("guesses: ", guesses);

// function handleGuess(guess) {
//   let status = checkGuess(guess);
// }

function displayGuesses() {
  for (let i = 0; i < guesses.length; i++) {
    console.log("guesses[i]2", guesses[i])
    if (guesses[i]) {
      let charStatuses = checkGuess(guesses[i])
      console.log("charStatuses", charStatuses)
    }
  }
}

