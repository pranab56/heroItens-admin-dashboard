import { baseApi } from "../../utils/apiBaseQuery";


export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotification: builder.query({
      query: ({ page, limit } = {}) => {
        const params = new URLSearchParams();

        if (page) params.append("page", page.toString());
        if (limit) params.append("limit", limit.toString());

        return {
          url: `/notification?${params.toString()}`,
          method: "GET",
        };
      },
    }),


  }),
});

// Export hooks
export const {
  useGetAllNotificationQuery,
} = notificationApi;
