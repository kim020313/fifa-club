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

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-10">
        선수 등록
      </h1>

      <div className="flex gap-2 mb-4">

        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임 입력"
          className="border p-2"
        />

        <button
          onClick={addPlayer}
          className="bg-blue-500 text-white px-4"
        >
          추가
        </button>

      </div>

      <div className="mb-6 text-red-500">
        {message}
      </div>

      <div className="flex flex-col gap-2">

        {players.map((player) => (

          <div
            key={player.id}
            className="border p-3 flex justify-between items-center"
          >

            <div>
              {player.nickname}
            </div>

            <button
              onClick={() => deletePlayer(player.id)}
              className="bg-red-500 text-white px-3 py-1"
            >
              삭제
            </button>

          </div>

        ))}

      </div>

    </div>
  )
}