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
  const [message, setMessage] = useState('')

  async function loadPlayers() {
    const { data } = await supabase
      .from('players')
      .select('*')
      .order('nickname')

    setPlayers(data || [])
  }

  async function addMatch() {
    if (!player1 || !player2 || score1 === '' || score2 === '') {
      setMessage('모든 항목을 입력해주세요.')
      return
    }

    const season = new Date().toISOString().slice(0, 7)

    await supabase
      .from('matches')
      .insert({
        player1_id: player1.id,
        player2_id: player2.id,
        score1: Number(score1),
        score2: Number(score2),
        season
      })

    setMessage('경기 저장 완료!')
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
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">경기 결과 기록</h1>

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

        {/* 점수 입력 */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              선수1 골
            </label>
            <input
              type="number"
              value={score1}
              onChange={(e) => setScore1(e.target.value)}
              placeholder="0"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-center"
            />
          </div>
          <div className="flex items-end justify-center pb-2">
            <span className="text-2xl font-bold text-gray-400">vs</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              선수2 골
            </label>
            <input
              type="number"
              value={score2}
              onChange={(e) => setScore2(e.target.value)}
              placeholder="0"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-center"
            />
          </div>
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

        {message && (
          <div className={`text-sm p-3 rounded ${message.includes('완료') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
            {message}
          </div>
        )}

        <button
          onClick={addMatch}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg font-medium transition shadow-lg hover:shadow-blue-500/50"
        >
          경기 저장
        </button>
      </div>
    </div>
  )
}
