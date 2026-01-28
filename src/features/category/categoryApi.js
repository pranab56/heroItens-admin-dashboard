import { baseApi } from "../../utils/apiBaseQuery";


export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createCategory: builder.mutation({
      query: (data) => ({
        url: "/category/create",
        method: "POST",
        body: data
      }),
    }),

    getAllCategory: builder.query({
      query: () => ({
        url: "/category/all",
        method: "GET",
      }),
    }),

    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/category/${id}`,
        method: "PUT",
        body: data
      }),
    }),

    deleteCategory: builder.mutation({
      query: ({ id }) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetAllCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} = settingsApi;
