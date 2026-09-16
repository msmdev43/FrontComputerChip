// CategoriaSelector.jsx — versión icono grande
import "../../styles/components/UI/categoriaSelector.css";
export default function CategoriaSelector({
  categoria,
  activa,
  productoSeleccionado,
  onActivar,
}) {
  const completada = Boolean(productoSeleccionado);

  return (
    <button
      type="button"
      className={`cat-icon-btn ${activa ? 'cat-icon-btn--activa' : ''} ${
        completada ? 'cat-icon-btn--completada' : ''
      }`}
      onClick={onActivar}
      title={categoria.nombre}
      aria-pressed={activa}
    >
      <img
        src={categoria.iconoGrande}
        alt={categoria.nombre}
        className="cat-icon-btn__img"
      />
      {completada && (
        <span className="cat-icon-btn__check" aria-hidden>✓</span>
      )}
    </button>
  );
}