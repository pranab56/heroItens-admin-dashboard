import { baseApi } from "../../utils/apiBaseQuery";


export const shopApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createShop: builder.mutation({
      query: (data) => ({
        url: "/item",
        method: "POST",
        body: data
      }),
    }),

    allShop: builder.query({
      query: () => ({
        url: "/item",
        method: "GET",
      }),
    }),

    updateStatus: builder.mutation({
      query: (id) => ({
        url: `/item/${id}?status=true`,
        method: "GET",
      }),
    }),

  }),
});

export const {
  useCreateShopMutation,
  useAllShopQuery,
  useUpdateStatusMutation
} = shopApi;
