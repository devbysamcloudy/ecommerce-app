function Cart({ cart }) {
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      width: '250px'
    }}>
      <h2>Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item._id}>
              <p>{item.name} x{item.quantity} — ${item.price * item.quantity}</p>
            </div>
          ))}
          <hr />
          <h3>Total: ${total}</h3>
          <button>Checkout</button>
        </>
      )}
    </div>
  )
}

export default Cart
