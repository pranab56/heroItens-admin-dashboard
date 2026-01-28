import { baseApi } from "../../utils/apiBaseQuery";


export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    globalSettings: builder.mutation({
      query: (data) => ({
        url: "/setting/globalSetting",
        method: "PUT",
        body: data
      }),
    }),

    getGlobalSettings: builder.query({
      query: () => ({
        url: "/setting/globalSetting",
        method: "GET",
      }),
    }),

    updatePrivacyPolicy: builder.mutation({
      query: (data) => ({
        url: "/setting/privacyPolicy",
        method: "PUT",
        body: data
      }),
    }),

    getPrivacyPolicy: builder.query({
      query: () => ({
        url: "/setting/privacyPolicy",
        method: "GET",
      }),
    }),

    updateTermsAndConditions: builder.mutation({
      query: (data) => ({
        url: "/setting/termsCondition",
        method: "PUT",
        body: data
      }),
    }),

    getTermsAndConditions: builder.query({
      query: () => ({
        url: "/setting/termsCondition",
        method: "GET",
      }),
    }),


  }),
});

export const {
  useGlobalSettingsMutation,
  useGetGlobalSettingsQuery,
  useUpdatePrivacyPolicyMutation,
  useGetPrivacyPolicyQuery,
  useUpdateTermsAndConditionsMutation,
  useGetTermsAndConditionsQuery
} = settingsApi;
