import clienteAxios from '../config/axiosClient';
import { ENDPOINTS } from '../config/config';
import { especificacionService } from './especificacionService';
import { categoriaService } from './categoriaService';
import { marcaService } from './marcaService';
import { relationIds, specificationIds } from '../utils/adminProductForm';
import { syncProductRelations } from '../utils/syncProductRelations';

export const productoService = {
    // ============================================
    // OPERACIONES DE LECTURA (GET)
    // ============================================
    
    getAll: async () => {
        const { data } = await clienteAxios.get(ENDPOINTS.productos.base);
        return data;
    },

    getById: async (id) => {
        const { data } = await clienteAxios.get(ENDPOINTS.productos.porId(id));
        return data;
    },

    getByCategoria: async (categoriaId) => {
        const { data } = await clienteAxios.get(ENDPOINTS.productos.porCategoria(categoriaId));
        return data;
    },

    getByMarca: async (marcaId) => {
        const { data } = await clienteAxios.get(ENDPOINTS.productos.porMarca(marcaId));
        return data;
    },

    getByCategoriaYMarca: async (categoriaId, marcaId) => {
        const [products, brand] = await Promise.all([
            productoService.getByCategoria(categoriaId), marcaService.getById(marcaId)
        ]);
        return products.filter(product => (product.marcas || []).some(value =>
            typeof value === 'string' ? value === brand.nombre : Number(value.id) === Number(marcaId)));
    },

    getByPrecioRange: async (min, max) => {
        const { data } = await clienteAxios.get(ENDPOINTS.productos.precio, {
            params: { min, max }
        });
        return data;
    },

    getByStock: async (inStock) => {
        const { data } = await clienteAxios.get(ENDPOINTS.productos.stock(inStock));
        return data;
    },

    getOnSale: async () => {
        const { data } = await clienteAxios.get(ENDPOINTS.productos.oferta);
        return data;
    },

    getNewProducts: async (days = 7) => {
        const { data } = await clienteAxios.get(ENDPOINTS.productos.nuevos, {
            params: { days }
        });
        return data;
    },

    search: async (q) => {
        const { data } = await clienteAxios.get(ENDPOINTS.productos.buscar, {
            params: { q }
        });
        return data;
    },

    getRelated: async (id) => {
        const { data } = await clienteAxios.get(ENDPOINTS.productos.relacionados(id));
        return data;
    },

    getStats: async () => {
        const { data } = await clienteAxios.get(ENDPOINTS.productos.stats);
        return data;
    },

    // ============================================
    // OPERACIONES DE ESCRITURA Y MODIFICACIÓN
    // ============================================

    create: async (productoCreateRequest) => {
        const { especificacionIds = [], ...fields } = productoCreateRequest;
        const { data } = await clienteAxios.post(ENDPOINTS.productos.base, fields);
        try {
            // El controller de alta solo asigna categorías y marcas.
            for (const specId of new Set(especificacionIds)) await especificacionService.asignar(data.id, specId);
        } catch (cause) {
            const error = new Error('El producto fue creado, pero faltan especificaciones. Reintentá Guardar para completar el mismo producto.');
            error.createdProduct = data;
            error.cause = cause;
            throw error;
        }
        return data;
    },

    update: async (id, productoUpdateRequest) => {
        const { categoriaIds, marcaIds, especificacionIds, ...fields } = productoUpdateRequest;
        // Leer antes de escribir: las relaciones no forman parte de ProductoUpdateRequest.
        const [current, categories, brands, assigned, catalog] = await Promise.all([
            productoService.getById(id), categoriaService.getAll(), marcaService.getAll(),
            especificacionService.getByProducto(id), especificacionService.getAll()
        ]);
        const previous = {
            categoriaIds: relationIds(current, 'categoria', categories),
            marcaIds: relationIds(current, 'marca', brands),
            especificacionIds: specificationIds(assigned, catalog)
        };
        const { data } = await clienteAxios.put(ENDPOINTS.productos.porId(id), fields);
        try {
            await syncProductRelations(id, previous, { categoriaIds, marcaIds, especificacionIds }, {
                addCategories: productoService.addCategories, removeCategories: productoService.removeCategories,
                addBrands: productoService.addBrands, removeBrands: productoService.removeBrands,
                addSpecification: especificacionService.asignar, removeSpecification: especificacionService.eliminarAsignacion
            });
        } catch (cause) {
            const error = new Error('Se guardaron los datos del producto, pero no todas sus relaciones. Podés reintentar Guardar; se consultará el estado actual para completar lo pendiente.');
            error.cause = cause;
            throw error;
        }
        return data;
    },

    updateStock: async (id, stock) => {
        const { data } = await clienteAxios.patch(ENDPOINTS.productos.actualizarStock(id), stock);
        return data;
    },

    softDelete: async (id) => {
        const { data } = await clienteAxios.delete(ENDPOINTS.productos.porId(id));
        return data;
    },

    restore: async (id) => {
        const { data } = await clienteAxios.post(ENDPOINTS.productos.restaurar(id));
        return data;
    },

    // ============================================
    // GESTIÓN DE CATEGORÍAS Y MARCAS ASOCIADAS
    // ============================================

    addCategories: async (id, categoriaIds) => {
        const { data } = await clienteAxios.post(ENDPOINTS.productos.categorias(id), categoriaIds);
        return data;
    },

    removeCategories: async (id, categoriaIds) => {
        const { data } = await clienteAxios.delete(ENDPOINTS.productos.categorias(id), {
            data: categoriaIds
        });
        return data;
    },

    addBrands: async (id, marcaIds) => {
        const { data } = await clienteAxios.post(ENDPOINTS.productos.marcas(id), marcaIds);
        return data;
    },

    removeBrands: async (id, marcaIds) => {
        const { data } = await clienteAxios.delete(ENDPOINTS.productos.marcas(id), {
            data: marcaIds
        });
        return data;
    }
};