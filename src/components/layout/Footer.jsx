import React from 'react'
import { Link } from 'react-router-dom'
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Síguenos</h3>
          <div className="social-links">
            <a href="#" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
        <div className="footer-section">
          <h3>Nosotros</h3>
          <Link to="/conocenos">Conócenos</Link>
          <Link to="/responsabilidad-social">Responsabilidad social</Link>
          <Link to="/tiendas">Nuestras tiendas</Link>
        </div>
        <div className="footer-section">
          <h3>Atención al cliente</h3>
          <Link to="/atencion-cliente">Atención al cliente</Link>
          <Link to="/horarios">Horarios de atención</Link>
          <Link to="/preguntas-frecuentes">Preguntas frecuentes</Link>
        </div>
        <div className="footer-section">
          <h3>Políticas y condiciones</h3>
          <Link to="/politica-datos">Políticas de datos personales</Link>
          <Link to="/condiciones-promociones">Condición de promociones</Link>
          <Link to="/terminos">Términos y condiciones</Link>
        </div>
      </div>
    </footer>
  )
}
export default Footer

