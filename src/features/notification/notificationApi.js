import { baseApi } from "../../utils/apiBaseQuery";


export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotification: builder.query({
      query: ({ page, limit }) => ({
        url: `/notification?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),

  }),
});

// Export hooks
export const {
  useGetAllNotificationQuery,
} = notificationApi;
