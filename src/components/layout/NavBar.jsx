import { Link } from 'react-router-dom'
function NavBar() {
  return (
    <nav className="navbar">
      <div className="container">
        <ul>
          <li><Link to="/categorias"><i className="fa fa-bars"></i> Categorías</Link></li>
          <li><Link to="/productos">Productos</Link></li>
        </ul>
      </div>
    </nav>
  )
}
export default NavBar

