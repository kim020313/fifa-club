'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function HeadToHeadPage() {

  const [players, setPlayers] = useState<any[]>([])

  const [player1Search, setPlayer1Search] = useState('')
  const [player2Search, setPlayer2Search] = useState('')

  const [player1, setPlayer1] = useState<any>(null)
  const [player2, setPlayer2] = useState<any>(null)

  const [result, setResult] = useState<any>(null)

  async function loadPlayers() {

    const { data } = await supabase
      .from('players')
      .select('*')
      .order('nickname')

    setPlayers(data || [])
  }

  async function calculateHeadToHead() {

    if (!player1 || !player2) return

    const { data: matches } = await supabase
      .from('matches')
      .select('*')

    if (!matches) return

    let p1Win = 0
    let p2Win = 0
    let draw = 0

    let p1Goal = 0
    let p2Goal = 0

    matches.forEach((match) => {

      const isTargetMatch =

        (
          match.player1_id === player1.id &&
          match.player2_id === player2.id
        )

        ||

        (
          match.player1_id === player2.id &&
          match.player2_id === player1.id
        )

      if (!isTargetMatch) return

      let scoreA = 0
      let scoreB = 0

      if (match.player1_id === player1.id) {

        scoreA = match.score1
        scoreB = match.score2
      }

      else {

        scoreA = match.score2
        scoreB = match.score1
      }

      p1Goal += scoreA
      p2Goal += scoreB

      if (scoreA > scoreB) {
        p1Win += 1
      }

      else if (scoreA < scoreB) {
        p2Win += 1
      }

      else {
        draw += 1
      }
    })

    setResult({
      p1Win,
      p2Win,
      draw,
      p1Goal,
      p2Goal
    })
  }

  useEffect(() => {
    loadPlayers()
  }, [])

  const filteredPlayer1 = players.filter((player) =>
    player.nickname.includes(player1Search)
  )

  const filteredPlayer2 = players.filter((player) =>
    player.nickname.includes(player2Search)
  )

  return (

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-10">
        상대 전적
      </h1>

      <div className="flex flex-col gap-6 max-w-md">

        <div>

          <input
            value={player1Search}
            onChange={(e) => setPlayer1Search(e.target.value)}
            placeholder="선수1 검색"
            className="border p-2 w-full"
          />

          <div className="border">

            {filteredPlayer1.map((player) => (

              <div
                key={player.id}
                onClick={() => {
                  setPlayer1(player)
                  setPlayer1Search(player.nickname)
                }}
                className="p-2 cursor-pointer hover:bg-gray-200"
              >
                {player.nickname}
              </div>

            ))}

          </div>

        </div>

        <div>

          <input
            value={player2Search}
            onChange={(e) => setPlayer2Search(e.target.value)}
            placeholder="선수2 검색"
            className="border p-2 w-full"
          />

          <div className="border">

            {filteredPlayer2.map((player) => (

              <div
                key={player.id}
                onClick={() => {
                  setPlayer2(player)
                  setPlayer2Search(player.nickname)
                }}
                className="p-2 cursor-pointer hover:bg-gray-200"
              >
                {player.nickname}
              </div>

            ))}

          </div>

        </div>

        <button
          onClick={calculateHeadToHead}
          className="bg-blue-500 text-white p-2"
        >
          전적 확인
        </button>

      </div>

      {

        result && player1 && player2 && (

          <div className="mt-10 border p-5 max-w-md">

            <div className="text-2xl font-bold mb-5">

              {player1.nickname}
              {' '}
              VS
              {' '}
              {player2.nickname}

            </div>

            <div className="mb-2">
              {player1.nickname} 승:
              {' '}
              {result.p1Win}
            </div>

            <div className="mb-2">
              {player2.nickname} 승:
              {' '}
              {result.p2Win}
            </div>

            <div className="mb-2">
              무승부:
              {' '}
              {result.draw}
            </div>

            <div className="mb-2">
              {player1.nickname} 총 득점:
              {' '}
              {result.p1Goal}
            </div>

            <div>
              {player2.nickname} 총 득점:
              {' '}
              {result.p2Goal}
            </div>

          </div>

        )

      }

    </div>
  )
}