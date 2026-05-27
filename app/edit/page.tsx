'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function EditPage() {

  const [players, setPlayers] = useState<any[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [newNickname, setNewNickname] = useState('')

  async function loadPlayers() {

    const { data } = await supabase
      .from('players')
      .select('*')
      .order('id')

    setPlayers(data || [])
  }

  async function updateNickname() {

    if (!selectedId || !newNickname) return

    await supabase
      .from('players')
      .update({
        nickname: newNickname
      })
      .eq('id', selectedId)

    setNewNickname('')

    loadPlayers()
  }

  useEffect(() => {
    loadPlayers()
  }, [])

  return (

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-10">
        닉네임 변경
      </h1>

      <div className="flex flex-col gap-4 max-w-md">

        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="border p-2"
        >

          <option value="">
            선수 선택
          </option>

          {players.map((player) => (

            <option
              key={player.id}
              value={player.id}
            >
              {player.nickname}
            </option>

          ))}

        </select>

        <input
          value={newNickname}
          onChange={(e) => setNewNickname(e.target.value)}
          placeholder="새 닉네임 입력"
          className="border p-2"
        />

        <button
          onClick={updateNickname}
          className="bg-blue-500 text-white p-2"
        >
          닉네임 변경
        </button>

      </div>

      <div className="mt-10 flex flex-col gap-2">

        {players.map((player) => (

          <div
            key={player.id}
            className="border p-3"
          >
            {player.nickname}
          </div>

        ))}

      </div>

    </div>
  )
}