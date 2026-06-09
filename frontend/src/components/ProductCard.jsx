function ProductCard({ product, addToCart }) {
  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 w-64'>
      <img src={product.image} alt={product.name} className='w-full h-48 object-cover' />
      <div className='p-4'>
        <h3 className='font-semibold text-lg mb-1'>{product.name}</h3>
        <p className='text-gray-500 text-sm mb-2'>{product.category}</p>
        <p className='text-blue-600 font-bold text-xl mb-2'>${product.price}</p>
        <p className={`text-sm mb-4 font-semibold ${product.countInStock > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of Stock'}
        </p>
        <button
          onClick={() => addToCart(product)}
          disabled={product.countInStock === 0}
          className={`w-full py-2 rounded font-semibold transition-colors duration-200 
            ${product.countInStock > 0 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
        >
          {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard