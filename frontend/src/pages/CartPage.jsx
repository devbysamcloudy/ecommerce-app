import { Link } from 'react-router-dom'

function CartPage({ cart, removeFromCart }) {
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <h2 className='text-3xl font-bold mb-8 text-gray-800'>Shopping Cart</h2>
      {cart.length === 0 ? (
        <div className='text-center'>
          <p className='text-gray-500 text-lg mb-4'>Your cart is empty</p>
          <Link to='/' className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-semibold'>
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className='bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto'>
          {cart.map(item => (
            <div key={item._id} className='flex justify-between items-center border-b border-gray-200 py-4'>
              <div>
                <p className='font-semibold text-gray-800'>{item.name}</p>
                {item.countInStock === 0 && (
                  <p className='text-red-500 text-sm'>⚠️ Out of stock — remove before checkout</p>
                )}
              </div>
              <p className='text-gray-500'>x{item.quantity}</p>
              <p className='text-sm text-gray-400'>({item.countInStock} available)</p>
              <p className='text-blue-600 font-bold'>${item.price * item.quantity}</p>
              <button
                onClick={() => removeFromCart(item._id)}
                className='bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm'
              >
                Remove
              </button>
            </div>
          ))}
          <div className='flex justify-between items-center mt-6'>
            <h3 className='text-xl font-bold text-gray-800'>Total</h3>
            <h3 className='text-xl font-bold text-blue-600'>${total}</h3>
          </div>
          {cart.some(item => item.countInStock === 0) ? (
            <p className='text-red-500 text-center mt-6 font-semibold'>
              ⚠️ Remove out of stock items before proceeding
            </p>
          ) : (
            <Link to='/checkout'>
              <button className='w-full bg-gray-900 hover:bg-gray-700 text-white py-3 rounded font-semibold mt-6'>
                Proceed to Checkout
              </button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default CartPage