export const CATEGORIAS_META = {
  procesador: {
    icono: '🧠',
    descripcion:
      'Tu procesador es la pieza central del rendimiento de los programas. ' +
      'Para saber si un procesador es potente lo que tenés que medir es la ' +
      'frecuencia, el ancho de bus, la memoria caché y los núcleos e hilos de procesamiento.',
  },
  motherboard: {
    icono: '🔌',
    descripcion:
      'La mother conecta todos los componentes y define el socket del CPU y el tipo de RAM.',
  },
  ram: {
    icono: '💾',
    descripcion:
      'La memoria RAM define cuántos programas podés tener abiertos al mismo tiempo.',
  },
  'placa de video': {
    icono: '🎮',
    descripcion:
      'La placa de video define el rendimiento en juegos y tareas gráficas.',
  },
  gpu: {
    icono: '🎮',
    descripcion: 'La placa de video define el rendimiento en juegos.',
  },
  almacenamiento: {
    icono: '💿',
    descripcion:
      'El almacenamiento define la velocidad de carga y cuántos archivos podés guardar.',
  },
  fuente: {
    icono: '⚡',
    descripcion:
      'La fuente debe cubrir el consumo total de tu equipo con margen de sobra.',
  },
  gabinete: {
    icono: '📦',
    descripcion:
      'El gabinete debe ser compatible con el tamaño de tu mother y GPU.',
  },
  cooler: {
    icono: '❄️',
    descripcion: 'La refrigeración mantiene tu CPU a temperatura segura.',
  },
  refrigeracion: {
    icono: '❄️',
    descripcion: 'La refrigeración mantiene tus componentes fríos.',
  },
};

export const getCategoriaMeta = (nombre = '') => {
  const key = nombre.toLowerCase().trim();
  return (
    CATEGORIAS_META[key] || {
      icono: '📦',
      descripcion: '',
    }
  );
};