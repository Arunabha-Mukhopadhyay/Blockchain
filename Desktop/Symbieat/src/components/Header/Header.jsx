import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <h2>Order your favourite food here</h2>
        <p>
          Discover new experiences and explore a world of possibilities with
          just a click. Uncover exciting content tailored for you.
        </p>
        <button>View Menu</button>
      </div>
    </div>
  );
}

export default Header