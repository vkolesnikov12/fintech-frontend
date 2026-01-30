import { baseApi } from '../../../shared/api/base-api'

export interface ProductSearchParams {
	type?: 'CREDIT' | 'DEPOSIT' | 'INVESTMENT'
	status?: 'ACTIVE' | 'INACTIVE'
	search?: string
}

export const productApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getProducts: build.query<unknown, ProductSearchParams | void>({
			query: (params) => ({
				url: '/v1/products',
				method: 'GET',
				params,
			}),
		}),
		updateProduct: build.mutation<void, { id: string; payload: unknown }>({
			query: ({ id, payload }) => ({
				url: `/v1/products/${id}`,
				method: 'PUT',
				body: payload,
			}),
		}),
		deleteProduct: build.mutation<void, { id: string }>({
			query: ({ id }) => ({
				url: `/v1/products/${id}`,
				method: 'DELETE',
			}),
		}),
		getProductAudit: build.query<unknown, { id: string }>({
			query: ({ id }) => ({
				url: `/v1/products/${id}/audit`,
				method: 'GET',
			}),
		}),
	}),
})

export const {
	useLazyGetProductsQuery,
	useUpdateProductMutation,
	useDeleteProductMutation,
	useLazyGetProductAuditQuery,
} = productApi
