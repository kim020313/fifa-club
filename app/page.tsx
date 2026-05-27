import Link from 'next/link'

export default function Home() {

  return (

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-10">
        FIFA 클럽 관리
      </h1>

      <div className="flex flex-col gap-4">

        <Link
          href="/player"
          className="border p-4 rounded"
        >
          선수 등록
        </Link>

      </div>

    </div>
  )
}