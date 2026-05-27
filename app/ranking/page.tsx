'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function RankingPage() {

  const currentSeason =
    new Date()
      .toISOString()
      .slice(0, 7)

  const [season, setSeason] =
    useState(currentSeason)

  const [ranking, setRanking] =
    useState<any[]>([])

  async function loadRanking() {

    const { data: players } = await supabase
      .from('players')
      .select('*')

    const { data: matches } = await supabase
      .from('matches')
      .select('*')
      .eq('season', season)

    if (!players || !matches) return

    const stats: any = {}

    players.forEach((player) => {

      stats[player.id] = {
        id: player.id,
        nickname: player.nickname,

        game: 0,
        win: 0,
        draw: 0,
        lose: 0,

        goal: 0,
        concede: 0,

        diff: 0,
        point: 0,
        winrate: 0
      }
    })

    matches.forEach((match) => {

      const p1 = stats[match.player1_id]
      const p2 = stats[match.player2_id]

      if (!p1 || !p2) return

      p1.game += 1
      p2.game += 1

      p1.goal += match.score1
      p1.concede += match.score2

      p2.goal += match.score2
      p2.concede += match.score1

      if (match.score1 > match.score2) {

        p1.win += 1
        p1.point += 3

        p2.lose += 1
      }

      else if (match.score1 < match.score2) {

        p2.win += 1
        p2.point += 3

        p1.lose += 1
      }

      else {

        p1.draw += 1
        p2.draw += 1

        p1.point += 1
        p2.point += 1
      }
    })

    Object.values(stats).forEach((player: any) => {

      player.diff =
        player.goal - player.concede

      if (player.game > 0) {

        player.winrate =
          (
            player.win /
            player.game *
            100
          ).toFixed(1)
      }

      else {

        player.winrate = 0
      }
    })

    const sorted = Object
      .values(stats)
      .sort((a: any, b: any) => {

        if (b.point !== a.point) {
          return b.point - a.point
        }

        return b.diff - a.diff
      })

    setRanking(sorted)
  }

  useEffect(() => {
    loadRanking()
  }, [season])

  return (

    <div className="p-5 overflow-x-auto">

      <h1 className="text-3xl font-bold mb-6">
        승점 순위표
      </h1>

      <div className="mb-5">

        <input
          type="month"
          value={season}
          onChange={(e) =>
            setSeason(e.target.value)
          }
          className="border p-2"
        />

      </div>

      <table className="border-collapse border w-full">

        <thead>

          <tr className="bg-gray-200">

            <th className="border p-2">순위</th>
            <th className="border p-2">닉네임</th>
            <th className="border p-2">경기</th>
            <th className="border p-2">승</th>
            <th className="border p-2">무</th>
            <th className="border p-2">패</th>
            <th className="border p-2">득</th>
            <th className="border p-2">실</th>
            <th className="border p-2">득실</th>
            <th className="border p-2">승점</th>
            <th className="border p-2">승률</th>

          </tr>

        </thead>

        <tbody>

          {ranking.map((player: any, index) => (

            <tr key={player.id}>

              <td className="border p-2 text-center">
                {index + 1}
              </td>

              <td className="border p-2">
                {player.nickname}
              </td>

              <td className="border p-2 text-center">
                {player.game}
              </td>

              <td className="border p-2 text-center">
                {player.win}
              </td>

              <td className="border p-2 text-center">
                {player.draw}
              </td>

              <td className="border p-2 text-center">
                {player.lose}
              </td>

              <td className="border p-2 text-center">
                {player.goal}
              </td>

              <td className="border p-2 text-center">
                {player.concede}
              </td>

              <td className="border p-2 text-center">
                {player.diff}
              </td>

              <td className="border p-2 text-center font-bold">
                {player.point}
              </td>

              <td className="border p-2 text-center">
                {player.winrate}%
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  )
}