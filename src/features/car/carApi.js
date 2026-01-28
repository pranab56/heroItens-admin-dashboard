import { baseApi } from "../../utils/apiBaseQuery";


export const carApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllCar: builder.query({
      query: () => ({
        url: "/car/all-car",
        method: "GET",
      }),
    }),

    approveCar: builder.mutation({
      query: (id) => ({
        url: `/car/${id}`,
        method: "PATCH",
      }),
    }),

    carDetails: builder.query({
      query: (id) => ({
        url: `/car/${id}`,
        method: "GET",
      }),
    }),

    resetCar: builder.mutation({
      query: (id) => ({
        url: `/ranking/${id}`,
        method: "PATCH",
      }),
    }),

  }),
});

export const { useGetAllCarQuery, useResetCarMutation, useApproveCarMutation, useCarDetailsQuery } = carApi;
