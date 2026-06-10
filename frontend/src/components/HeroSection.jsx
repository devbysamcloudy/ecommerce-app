import { Link } from 'react-router-dom'

function HeroSection() {
  return (
    <div className='relative bg-gray-900 text-white'>
      <div className='absolute inset-0 overflow-hidden'>
        <img
          src='https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400'
          alt='hero'
          className='w-full h-full object-cover opacity-30'
        />
      </div>
      <div className='relative max-w-4xl mx-auto px-8 py-24 text-center'>
        <h1 className='text-5xl font-bold mb-6'>
          Welcome to ShopEasy
        </h1>
        <p className='text-xl text-gray-300 mb-8'>
          Discover amazing products at unbeatable prices. Shop the latest trends in electronics, fashion, and more.
        </p>
        <div className='flex gap-4 justify-center'>
          <a href='#products'
            className='bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors'>
            Shop Now
          </a>
          <Link to='/register'
            className='bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors'>
            Join Us
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HeroSection