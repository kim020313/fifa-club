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
        (match.player1_id === player1.id && match.player2_id === player2.id) ||
        (match.player1_id === player2.id && match.player2_id === player1.id)

      if (!isTargetMatch) return

      let scoreA = 0
      let scoreB = 0

      if (match.player1_id === player1.id) {
        scoreA = match.score1
        scoreB = match.score2
      } else {
        scoreA = match.score2
        scoreB = match.score1
      }

      p1Goal += scoreA
      p2Goal += scoreB

      if (scoreA > scoreB) {
        p1Win += 1
      } else if (scoreA < scoreB) {
        p2Win += 1
      } else {
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
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">상대 전적</h1>

      <div className="bg-white/5 border border-white/10 rounded-lg p-8 space-y-6">
        {/* 선수1 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            선수1 검색
          </label>
          <input
            value={player1Search}
            onChange={(e) => setPlayer1Search(e.target.value)}
            placeholder="선수명 입력"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          {player1Search && (
            <div className="mt-2 bg-black/40 border border-white/10 rounded-lg overflow-hidden max-h-40 overflow-y-auto">
              {filteredPlayer1.map((player) => (
                <div
                  key={player.id}
                  onClick={() => {
                    setPlayer1(player)
                    setPlayer1Search(player.nickname)
                  }}
                  className="p-3 cursor-pointer hover:bg-white/10 border-b border-white/10 last:border-b-0 transition"
                >
                  {player.nickname}
                </div>
              ))}
            </div>
          )}
          {player1 && (
            <div className="mt-2 p-2 bg-blue-500/20 border border-blue-500/50 rounded text-blue-300 text-sm">
              선택됨: {player1.nickname}
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <span className="text-2xl font-bold text-gray-400">VS</span>
        </div>

        {/* 선수2 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            선수2 검색
          </label>
          <input
            value={player2Search}
            onChange={(e) => setPlayer2Search(e.target.value)}
            placeholder="선수명 입력"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          {player2Search && (
            <div className="mt-2 bg-black/40 border border-white/10 rounded-lg overflow-hidden max-h-40 overflow-y-auto">
              {filteredPlayer2.map((player) => (
                <div
                  key={player.id}
                  onClick={() => {
                    setPlayer2(player)
                    setPlayer2Search(player.nickname)
                  }}
                  className="p-3 cursor-pointer hover:bg-white/10 border-b border-white/10 last:border-b-0 transition"
                >
                  {player.nickname}
                </div>
              ))}
            </div>
          )}
          {player2 && (
            <div className="mt-2 p-2 bg-blue-500/20 border border-blue-500/50 rounded text-blue-300 text-sm">
              선택됨: {player2.nickname}
            </div>
          )}
        </div>

        <button
          onClick={calculateHeadToHead}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg font-medium transition shadow-lg hover:shadow-blue-500/50"
        >
          전적 확인
        </button>
      </div>

      {result && player1 && player2 && (
        <div className="mt-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-8">
          <div className="text-2xl font-bold text-center mb-8 text-white">
            {player1.nickname} <span className="text-gray-400">vs</span> {player2.nickname}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{result.p1Win}</div>
              <div className="text-sm text-gray-400 mt-1">승리</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{result.draw}</div>
              <div className="text-sm text-gray-400 mt-1">무승부</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">{result.p2Win}</div>
              <div className="text-sm text-gray-400 mt-1">패배</div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">{player1.nickname} 총 득점</span>
              <span className="font-bold text-blue-300">{result.p1Goal}골</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">{player2.nickname} 총 득점</span>
              <span className="font-bold text-blue-300">{result.p2Goal}골</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
