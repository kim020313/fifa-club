'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function PlayerPage() {
  const [nickname, setNickname] = useState('')
  const [players, setPlayers] = useState<any[]>([])
  const [message, setMessage] = useState('')

  async function loadPlayers() {
    const { data } = await supabase
      .from('players')
      .select('*')
      .order('nickname')

    setPlayers(data || [])
  }

  async function addPlayer() {
    if (!nickname) return

    const { error } = await supabase
      .from('players')
      .insert({
        nickname
      })

    if (error) {
      setMessage('이미 존재하는 닉네임입니다.')
      return
    }

    setMessage('선수 추가 완료')
    setNickname('')
    loadPlayers()
  }

  async function deletePlayer(id: number) {
    const ok = confirm(
      '선수를 삭제하면 관련 경기 기록도 모두 삭제됩니다.\n정말 삭제하시겠습니까?'
    )

    if (!ok) return

    await supabase
      .from('matches')
      .delete()
      .or(`player1_id.eq.${id},player2_id.eq.${id}`)

    await supabase
      .from('players')
      .delete()
      .eq('id', id)

    loadPlayers()
  }

  useEffect(() => {
    loadPlayers()
  }, [])

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">선수 등록</h1>

      <div className="mb-6">
        <div className="flex gap-3 mb-4">
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임 입력"
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white/15 transition"
            onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
          />
          <button
            onClick={addPlayer}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-lg hover:shadow-blue-500/50"
          >
            추가
          </button>
        </div>
        {message && (
          <div className={`text-sm ${message.includes('완료') ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </div>
        )}
      </div>

      <div className="space-y-2">
        {players.length === 0 ? (
          <div className="text-gray-400 text-center py-8">등록된 선수가 없습니다.</div>
        ) : (
          players.map((player) => (
            <div
              key={player.id}
              className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 flex justify-between items-center transition"
            >
              <div className="font-medium text-white">{player.nickname}</div>
              <button
                onClick={() => deletePlayer(player.id)}
                className="bg-red-500/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                삭제
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
