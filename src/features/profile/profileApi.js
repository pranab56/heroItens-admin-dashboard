import { baseApi } from "../../utils/apiBaseQuery";


export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query({
      query: (userId) => ({
        url: `/user/profile?userId=${userId}`,
        method: "GET",
      }),
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/user/profile",
        method: "PATCH",
        body: data
      }),
    }),

    changePassword: builder.mutation({
      query: (body) => ({
        url: `/auth/change-password`,
        method: "POST",
        body: body
      }),
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation
} = profileApi;
