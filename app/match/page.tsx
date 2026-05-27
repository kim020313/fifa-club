'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function MatchPage() {

  const [players, setPlayers] = useState<any[]>([])

  const [player1Search, setPlayer1Search] = useState('')
  const [player2Search, setPlayer2Search] = useState('')

  const [player1, setPlayer1] = useState<any>(null)
  const [player2, setPlayer2] = useState<any>(null)

  const [score1, setScore1] = useState('')
  const [score2, setScore2] = useState('')

  async function loadPlayers() {

    const { data } = await supabase
      .from('players')
      .select('*')
      .order('nickname')

    setPlayers(data || [])
  }

  async function addMatch() {

    if (
      !player1 ||
      !player2 ||
      score1 === '' ||
      score2 === ''
    ) return

    const season = new Date()
      .toISOString()
      .slice(0, 7)

    await supabase
      .from('matches')
      .insert({
        player1_id: player1.id,
        player2_id: player2.id,
        score1: Number(score1),
        score2: Number(score2),
        season
      })

    alert('경기 저장 완료')

    setPlayer1(null)
    setPlayer2(null)

    setPlayer1Search('')
    setPlayer2Search('')

    setScore1('')
    setScore2('')
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
        경기 결과 기록
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

        <input
          type="number"
          value={score1}
          onChange={(e) => setScore1(e.target.value)}
          placeholder="선수1 골"
          className="border p-2"
        />

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

        <input
          type="number"
          value={score2}
          onChange={(e) => setScore2(e.target.value)}
          placeholder="선수2 골"
          className="border p-2"
        />

        <button
          onClick={addMatch}
          className="bg-blue-500 text-white p-2"
        >
          경기 저장
        </button>

      </div>

    </div>
  )
}