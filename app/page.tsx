'use client'

import { useState } from 'react'
import Image from 'next/image'
import PlayerPage from '@/components/pages/PlayerPage'
import MatchPage from '@/components/pages/MatchPage'
import RankingPage from '@/components/pages/RankingPage'
import HeadToHeadPage from '@/components/pages/HeadToHeadPage'

const menuItems = [
  { id: 'player', title: '선수 등록', icon: '👤' },
  { id: 'match', title: '경기 등록', icon: '📅' },
  { id: 'ranking', title: '승점 순위표', icon: '🏆' },
  { id: 'headtohead', title: '상대 전적', icon: '🆚' },
]

export default function Home() {
  const [activeMenu, setActiveMenu] = useState('player')

  const renderContent = () => {
    switch (activeMenu) {
      case 'player':
        return <PlayerPage />
      case 'match':
        return <MatchPage />
      case 'ranking':
        return <RankingPage />
      case 'headtohead':
        return <HeadToHeadPage />
      default:
        return <PlayerPage />
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* 왼쪽 메뉴 */}
      <div className="w-64 bg-black/40 backdrop-blur-md border-r border-white/10 p-6 fixed left-0 top-0 h-screen overflow-y-auto">
        {/* 로고 */}
        <div className="mb-10 flex items-center gap-3">
          <img
            src="/logo.png"
            alt="logo"
            className="w-12 h-12 object-contain"
          />
          <div>
            <div className="text-sm font-bold text-white">FC</div>
            <div className="text-xs text-gray-400">스페셜매치</div>
          </div>
        </div>

        {/* 메뉴 항목들 */}
        <nav className="space-y-2">
          {menuItems.map((menu) => (
            <button
              key={menu.id}
              onClick={() => setActiveMenu(menu.id)}
              className={`
                w-full text-left px-4 py-3 rounded-lg transition-all duration-200
                flex items-center gap-3 font-medium
                ${
                  activeMenu === menu.id
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <span className="text-lg">{menu.icon}</span>
              <span>{menu.title}</span>
            </button>
          ))}
        </nav>

        {/* 하단 정보 */}
        <div className="absolute bottom-6 left-6 right-6 pt-6 border-t border-white/10">
          <p className="text-xs text-gray-500 text-center">
            Fair Play · Respect · Victory
          </p>
        </div>
      </div>

      {/* 오른쪽 컨텐츠 영역 */}
      <div className="flex-1 ml-64">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md border-b border-white/10 px-10 py-6 sticky top-0 z-10">
          <h1 className="text-4xl font-bold text-white">FC 스페셜매치</h1>
          <p className="text-gray-400 mt-1">클럽 친선전 기록 관리 시스템</p>
        </div>

        {/* 컨텐츠 */}
        <div className="p-10 min-h-[calc(100vh-120px)]">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
