import { useState } from 'react'

type chess = string | undefined

interface ISquareProps {
  squareChess: chess
  squareClick: () => void
}
interface IBoardProps {
  boardRes: chess[]
  onPlay: (idx: number) => void
}

interface IStepsProps {
  historyRes: chess[][]
  jumpTo: (n: number) => void
}
const squareMap = [...Array(9)].map((_, idx) => idx)

function Square({ squareChess, squareClick }: ISquareProps) {
  return (
    <li
      className="w-24 h-24 border flex items-center text-2xl select-none justify-center cursor-pointer transition-all duration-300 hover:(border-green-200)"
      onClick={squareClick}
    >
      {squareChess}
    </li>
  )
}

function Board({ boardRes, onPlay }: IBoardProps) {
  // Board pass the top clickFn's logic and current data to the children
  const SquareItem = squareMap.map((idx) => (
    <Square
      squareChess={boardRes[idx]}
      squareClick={() => onPlay(idx)}
      key={idx}
    ></Square>
  ))
  return <ul className="grid grid-cols-3">{SquareItem}</ul>
}

function Steps({ historyRes, jumpTo }: IStepsProps) {
  const steps = historyRes.map((_, step) => {
    let desc = step === 0 ? 'Start!' : `Go to move #${step}`
    return (
      <li key={`id:${step}`}>
        <button
          onClick={() => jumpTo(step)}
          className="font-mono rounded-md text-sm border py-2 px-4 hover:(bg-green-100/10 text-green-400)"
        >
          {desc}
        </button>
      </li>
    )
  })
  return (
    <ul className="flex justify-start w-48 flex-col gap-2 absolute top-0 -right-[70%]">
      {steps}
    </ul>
  )
}

function App() {
  function handelPlay(idx: number) {
    const tempRes = history[currentStep].slice(0)
    if (tempRes[idx] || winnerCaculating(tempRes)) return
    tempRes[idx] = XisNext ? '❌' : '✅'
    const currentHistory = [...history.slice(0, currentStep + 1), tempRes]
    setHistory(currentHistory)
    setCurrentStep(currentHistory.length - 1)
  }
  function jumpTo(n: number) {
    setCurrentStep(n)
  }

  const [history, setHistory] = useState<chess[][]>([Array(9)])
  const [currentStep, setCurrentStep] = useState(0)
  const XisNext = currentStep % 2 === 0
  const currentRes = history[currentStep]
  const noWinner = currentStep === 9 && winnerCaculating(currentRes) === null // 10 step at most(include a init step)

  return (
    <div className="w-screen-md mx-auto h-screen flex flex-col gap-2 justify-center items-center">
      <h1 className=" text-4xl font-bold font-mono mb-8">Tic Tac Toe</h1>
      <div className="relative">
        <Board boardRes={currentRes} onPlay={handelPlay} />
        <Steps historyRes={history} jumpTo={jumpTo}></Steps>
        <div className="absolute -bottom-[15%] font-mono text-lg">
          {noWinner
            ? 'Oops, end in a draw!'
            : winnerCaculating(currentRes) && (
                <span>The winner is:{winnerCaculating(currentRes)}</span>
              )}
        </div>
      </div>
    </div>
  )
}

function winnerCaculating(chessBoard: chess[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (
      chessBoard[a] &&
      chessBoard[a] === chessBoard[b] &&
      chessBoard[a] === chessBoard[c]
    ) {
      return chessBoard[a]
    }
  }
  return null
}

export default App
