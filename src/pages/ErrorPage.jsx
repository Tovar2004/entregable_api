import { Link } from "react-router-dom";
import "../styles/ErrorPage.css";

const ErrorPage = () => {
  return (
    <div className="error-container">
      <img
        src="https://rickandmortyapi.com/api/character/avatar/unknown.jpeg"
        alt="Not found"
        className="error-image"
      />
      <h1 className="error-code">404</h1>
      <h2 className="error-subtitle">¡Página no encontrada en este universo!</h2>
      <p className="error-text">
        Parece que Rick te teletransportó a la dimensión equivocada.
      </p>
      <Link to="/" className="error-btn">
        🛸 Volver al inicio
      </Link>
    </div>
  );
};

export default ErrorPage;