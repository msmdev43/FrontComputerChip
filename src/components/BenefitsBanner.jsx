
import '../styles/components/BenefitsBanner.css';

const benefits = [
  { icon: '⏰', text: 'Comprás antes de las 14 hs, despachamos en el día' },
  { icon: '🖥️', text: 'Stock y precios en tiempo real' },
  { icon: '🚚', text: 'Envío sin cargo desde $55.000' },
  { icon: '📞', text: 'Atención personalizada' },
  { icon: '💳', text: 'Cuotas sin interés' },
];

const BenefitsBanner = () => {
  return (
    <section
      className="benefits-banner"
      aria-label="Beneficios de comprar en ComputerChip"
    >
      <div className="benefits-banner__viewport">
        <div className="benefits-banner__track">
          {[0, 1].map((group) => (
            <div
              className="benefits-banner__group"
              key={group}
              aria-hidden={group === 1}
            >
              {benefits.map((benefit) => (
                <div
                  className="benefits-banner__item"
                  key={benefit.text}
                >
                  <span aria-hidden="true">{benefit.icon}</span>
                  <span>{benefit.text}</span>
                  <span
                    className="benefits-banner__separator"
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsBanner;