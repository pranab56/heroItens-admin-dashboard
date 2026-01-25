import { baseApi } from "../../utils/apiBaseQuery";


export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    forgotEmail: builder.mutation({
      query: (forgotEmail) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: forgotEmail,
      }),
    }),

    forgotEmailOTPCheck: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: data,
      }),
    }),


    resetPassword: builder.mutation({
      query: ({ token, newPassword, confirmPassword }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: {
          newPassword: newPassword,
          confirmPassword: confirmPassword,
          token: token,
        },
      }),
    }),

  }),
});

// Export hooks
export const {
  useLoginMutation,
  useForgotEmailMutation,
  useForgotEmailOTPCheckMutation,
  useResetPasswordMutation
} = authApi;
