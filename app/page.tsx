import Link from 'next/link'

export default function Home() {

  return (

    <div className="p-10">

      <h1 className="text-4xl font-bold mb-10">
        FIFA 클럽 관리
      </h1>

      <div className="flex flex-col gap-4 max-w-md">

        <Link
          href="/player"
          className="border p-4 rounded hover:bg-gray-100"
        >
          선수 등록
        </Link>

        <Link
          href="/edit"
          className="border p-4 rounded hover:bg-gray-100"
        >
          닉네임 변경
        </Link>

        <Link
          href="/match"
          className="border p-4 rounded hover:bg-gray-100"
        >
          경기 결과 기록
        </Link>

        <Link
          href="/ranking"
          className="border p-4 rounded hover:bg-gray-100"
        >
          승점 순위표
        </Link>

        <Link
          href="/headtohead"
          className="border p-4 rounded hover:bg-gray-100"
        >
          상대 전적
        </Link>

      </div>

    </div>
  )
}