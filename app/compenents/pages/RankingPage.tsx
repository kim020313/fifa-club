'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function RankingPage() {
  const currentSeason = new Date().toISOString().slice(0, 7)
  const [season, setSeason] = useState(currentSeason)
  const [ranking, setRanking] = useState<any[]>([])

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
      } else if (match.score1 < match.score2) {
        p2.win += 1
        p2.point += 3
        p1.lose += 1
      } else {
        p1.draw += 1
        p2.draw += 1
        p1.point += 1
        p2.point += 1
      }
    })

    Object.values(stats).forEach((player: any) => {
      player.diff = player.goal - player.concede

      if (player.game > 0) {
        player.winrate = ((player.win / player.game) * 100).toFixed(1)
      } else {
        player.winrate = 0
      }
    })

    const sorted = Object.values(stats).sort((a: any, b: any) => {
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
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">승점 순위표</h1>
        <input
          type="month"
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      {ranking.length === 0 ? (
        <div className="text-gray-400 text-center py-12">
          해당 기간의 경기 데이터가 없습니다.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-b border-white/10">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">순위</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">닉네임</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">경기</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">승</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">무</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">패</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">득</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">실</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">득실</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-blue-400">승점</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">승률</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((player: any, index) => (
                <tr
                  key={player.id}
                  className="border-b border-white/10 hover:bg-white/5 transition"
                >
                  <td className="px-6 py-4 text-white font-medium">
                    <span className={`inline-block w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-yellow-500/30 text-yellow-300 font-bold' :
                      index === 1 ? 'bg-gray-400/30 text-gray-300 font-bold' :
                      index === 2 ? 'bg-orange-700/30 text-orange-300 font-bold' :
                      'bg-white/10 text-gray-400'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white font-medium">{player.nickname}</td>
                  <td className="px-6 py-4 text-center text-gray-300">{player.game}</td>
                  <td className="px-6 py-4 text-center text-green-400 font-medium">{player.win}</td>
                  <td className="px-6 py-4 text-center text-yellow-400 font-medium">{player.draw}</td>
                  <td className="px-6 py-4 text-center text-red-400 font-medium">{player.lose}</td>
                  <td className="px-6 py-4 text-center text-blue-300">{player.goal}</td>
                  <td className="px-6 py-4 text-center text-red-300">{player.concede}</td>
                  <td className="px-6 py-4 text-center text-white font-medium">{player.diff > 0 ? '+' : ''}{player.diff}</td>
                  <td className="px-6 py-4 text-center text-blue-300 font-bold text-lg">{player.point}</td>
                  <td className="px-6 py-4 text-center text-gray-300">{player.winrate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
