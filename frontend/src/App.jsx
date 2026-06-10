import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import ProductCard from './components/ProductCard'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import AdminPage from './pages/AdminPage'
import SuperAdminPage from './pages/SuperAdminPage'
import ProfilePage from './pages/ProfilePage'
import ProtectedRoute from './components/ProtectedRoute'
import API_URL from './config'
import HeroSection from './components/HeroSection'

function App() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
  }, [])

  const addToCart = (product) => {
    const exists = cart.find(item => item._id === product._id)
    if (exists) {
      if (exists.quantity >= product.countInStock) {
        alert(`Sorry, only ${product.countInStock} items available in stock!`)
        return
      }
      setCart(cart.map(item =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (id) => setCart(cart.filter(item => item._id !== id))

  const categories = ['All', ...new Set(products.map(p => p.category))]
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All' || product.category === category
    return matchesSearch && matchesCategory
  })

 return (
  <>
    <Navbar cartCount={cart.length} />
    <Routes>
      <Route path='/' element={
        <div className='bg-gray-100 min-h-screen'>
          <HeroSection />
          <div id='products' className='p-8'>
            <h1 className='text-3xl font-bold mb-6 text-gray-800'>Our Products</h1>
            <div className='flex gap-4 mb-8'>
              <input type='text' placeholder='Search products...' value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='border border-gray-300 rounded px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500' />
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className='border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            {filteredProducts.length === 0 ? (
              <p className='text-gray-500 text-center text-xl'>No products found</p>
            ) : (
              <div className='flex flex-wrap gap-6'>
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} addToCart={addToCart} />
                ))}
              </div>
            )}
          </div>
        </div>
      } />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path='/cart' element={<CartPage cart={cart} removeFromCart={removeFromCart} />} />
      <Route path='/checkout' element={<ProtectedRoute><CheckoutPage cart={cart} setCart={setCart} /></ProtectedRoute>} />
      <Route path='/orders' element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
      <Route path='/admin' element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
      <Route path='/superadmin' element={<ProtectedRoute superAdminOnly><SuperAdminPage /></ProtectedRoute>} />
    </Routes>
  </>
  )

}

export default App