import Image from 'next/image'

const NotFound = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Image src="/images/notFound.png" alt="Nie znaleziono" width={960} height={540} className="w-1/2" />
    </div>
  )
}

export default NotFound
