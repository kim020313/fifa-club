import Link from 'next/link'

const menus = [
  { title: "경기 등록", href: "/match" },
  { title: "팀 관리", href: "/teams" },
  { title: "선수 관리", href: "/players" },
]

export default function Home() {
  return (
    <div className="min-h-screen p-10">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center gap-5 mb-12">
          <img
            src="/logo.png"
            alt="logo"
            className="w-24 h-24 object-contain"
          />

          <div>
            <h1 className="text-5xl font-bold">
              FC 스페셜 매치
            </h1>
            <p className="text-gray-300 mt-2">
              클럽 친선전 기록 관리 시스템
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {menus.map((menu) => (
            <Link
              key={menu.href}
              href={menu.href}
              className="
                bg-white/10
                border border-white/10
                backdrop-blur-md
                rounded-2xl
                p-8
                hover:bg-white/20
                transition
                duration-200
                shadow-xl
              "
            >
              <div className="text-2xl font-bold mb-2">
                {menu.title}
              </div>

              <div className="text-gray-300 text-sm">
                클릭하여 이동
              </div>
            </Link>
          ))}

        </div>

      </div>
    </div>
  )
}