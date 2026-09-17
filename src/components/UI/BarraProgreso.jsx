import "../../styles/components/UI/barraProgreso.css";

export default function BarraProgreso({ actual, total, label = 'Progreso' }) {
  const porcentaje = total > 0 ? Math.round((actual / total) * 100) : 0;

  return (
    <div className="barra-progreso" role="progressbar" aria-valuenow={porcentaje} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <div className="barra-progreso__info">
        <span className="barra-progreso__texto">
          {actual} / {total} componentes
        </span>
        <span className="barra-progreso__porcentaje">{porcentaje}%</span>
      </div>

      <div className="barra-progreso__track">
        <div
          className="barra-progreso__fill"
          style={{ width: `${porcentaje}%` }}
        />
      </div>
    </div>
  );
}