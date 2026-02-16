import { baseApi } from "../../utils/apiBaseQuery";


export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTire: builder.mutation({
      query: (data) => ({
        url: "/tire",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["payment"],
    }),

    updateTireState: builder.mutation({
      query: ({ id, data }) => ({
        url: `/tire/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["payment"],
    }),

    getAllTire: builder.query({
      query: ({ activeTab, page = 1, limit = 10 }) => ({
        url: `/tire?type=${activeTab}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["payment"],
    }),



    getAllTransectionHistory: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/user/transaction-history?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["payment"],
    }),

  }),
});

export const { useCreateTireMutation, useGetAllTireQuery, useGetAllTransectionHistoryQuery, useUpdateTireStateMutation } = paymentApi;
