import { useCallback, useEffect, useState } from "react";
import words from "./wordList.json";
import HangmanDrawing from "./components/HangmanDrawing";
import HangmanWord from "./components/HangmanWord";
import Keyboard from "./components/Keyboard";

function getWord() {
  return words[Math.floor(Math.random() * words.length)]
}

function App() {
  const [wordToGuess, setWordToGuess] = useState(getWord)
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])

  const incorrectLetters = guessedLetters.filter(
    letter => !wordToGuess.includes(letter)
  )

  const isLoser = incorrectLetters.length >= 6
  const isWinner = wordToGuess
    .split("")
    .every(letter => guessedLetters.includes(letter))

  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || isLoser || isWinner) return

      setGuessedLetters(currentLetters => [...currentLetters, letter])
    },
    [guessedLetters, isWinner, isLoser]
  )

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key
      if (!key.match(/^[a-z]$/)) return

      e.preventDefault()
      addGuessedLetter(key)
    }

    document.addEventListener("keypress", handler)

    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [guessedLetters])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key
      if (key !== "Enter") return

      e.preventDefault()
      setGuessedLetters([])
      setWordToGuess(getWord())
    }

    document.addEventListener("keypress", handler)

    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [])

  const resetGame = () => {
    setGuessedLetters([])
    setWordToGuess(getWord())
  }

  return (
    <div
      style={{
        maxWidth: "70vw",
        display: "flex",
        flexDirection: "column",
        gap: "0.05rem",
        margin: "0 auto",
        alignItems: "center",
        height: "100vh",
        justifyContent: "center",
      }}
    >
      <div style={{ fontSize: "1.5rem", marginBottom: "0.05rem" }}>
        {isWinner && (
          <p>
            Winner! -{" "}
            <button
              style={{
                padding: "0.3rem 0.6rem",
                fontSize: "1rem",
                cursor: "pointer",
              }}
              onClick={resetGame}
            >
              Play Again
            </button>
          </p>
        )}
        {isLoser && (
          <p>
            Nice Try -{" "}
            <button
              style={{
                padding: "0.3rem 0.6rem",
                fontSize: "1rem",
                cursor: "pointer",
              }}
              onClick={resetGame}
            >
              Try Again
            </button>
          </p>
        )}
      </div>
      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
      <HangmanWord
        reveal={isLoser}
        guessedLetters={guessedLetters}
        wordToGuess={wordToGuess}
      />
      <div style={{ alignSelf: "stretch" }}>
        <Keyboard
          disabled={isWinner || isLoser}
          activeLetters={guessedLetters.filter(letter =>
            wordToGuess.includes(letter)
          )}
          inactiveLetters={incorrectLetters}
          addGuessedLetter={addGuessedLetter}
        />
      </div>
    </div>
  )
}

export default App