import { baseApi } from "../../utils/apiBaseQuery";


export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: "/user",
        method: "GET",
      }),
    }),


    viewUserDetails: builder.query({
      query: (id) => ({
        url: `/user/profile?userId=${id}`,
        method: "GET",
      }),
    }),

    viewCarDetails: builder.query({
      query: (id) => ({
        url: `/car/all-car?userId=${id}`,
        method: "GET",
      }),
    }),


  }),
});


export const {
  useGetAllUsersQuery,
  useViewUserDetailsQuery,
  useViewCarDetailsQuery
} = usersApi;
