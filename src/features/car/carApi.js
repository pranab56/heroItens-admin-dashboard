import { baseApi } from "../../utils/apiBaseQuery";


export const carApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllCar: builder.query({
      query: () => ({
        url: "/car/all-car",
        method: "GET",
      }),
      providesTags: ["car"],
    }),

    approveCar: builder.mutation({
      query: (id) => ({
        url: `/car/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["car"],
    }),

    carDetails: builder.query({
      query: (id) => ({
        url: `/car/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["car"],
    }),

    resetCar: builder.mutation({
      query: (id) => ({
        url: `/ranking/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["car"],
    }),

  }),
});

export const { useGetAllCarQuery, useResetCarMutation, useApproveCarMutation, useCarDetailsQuery } = carApi;
