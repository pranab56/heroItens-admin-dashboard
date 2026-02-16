import { baseApi } from "../../utils/apiBaseQuery";


export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createCategory: builder.mutation({
      query: (data) => ({
        url: "/category/create",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["category"],
    }),

    createModal: builder.mutation({
      query: (data) => ({
        url: "/model",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["category"],
    }),

    getAllCategory: builder.query({
      query: () => ({
        url: "/category/all",
        method: "GET",
      }),
      providesTags: ["category"],
    }),

    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/category/${id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["category"],
    }),

    deleteCategory: builder.mutation({
      query: ({ id }) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["category"],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetAllCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useCreateModalMutation,
} = settingsApi;
