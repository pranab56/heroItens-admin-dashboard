"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useGetAllNotificationQuery } from '@/features/notification/notificationApi';
import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

// Types from API
interface Notification {
  _id: string;
  senderId: string;
  receiverId: string;
  carId?: string;
  title: string;
  body: string;
  read: boolean;
  notificationType: string;
  type: string;
  status: string;
  createdAt?: string;
  __v: number;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

const NotificationSystem = () => {
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const { data: apiResponse, isLoading } = useGetAllNotificationQuery({ page, limit });

  const notifications: Notification[] = apiResponse?.data?.data || [];
  const meta: Meta = apiResponse?.data?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };

  // Format date or extract from _id if missing
  const formatDate = (dateString?: string, id?: string): string => {
    let date: Date;

    if (dateString) {
      date = new Date(dateString);
    } else if (id) {
      // Extract timestamp from MongoDB ObjectId
      const timestamp = parseInt(id.substring(0, 8), 16) * 1000;
      date = new Date(timestamp);
    } else {
      return 'N/A';
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', '');
  };

  const getStatusColor = (status: string): string => {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-700';
      case 'PENDING':
        return 'bg-orange-100 text-orange-700';
      case 'FAILED':
        return 'bg-pink-100 text-pink-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getReadStatusColor = (isRead: boolean): string => {
    return isRead ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700';
  };









  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (page < meta.totalPage) {
      setPage(prev => prev + 1);
    }
  };

  // Render pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const totalPages = meta.totalPage;
    const currentPage = meta.page;

    // Always show first page
    buttons.push(
      <Button
        key={1}
        variant={currentPage === 1 ? "default" : "outline"}
        size="sm"
        onClick={() => setPage(1)}
        className={currentPage === 1 ? " text-white" : ""}
      >
        01
      </Button>
    );

    if (totalPages > 1) {
      // Show pages around current page
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        buttons.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            size="sm"
            onClick={() => setPage(i)}
            className={currentPage === i ? " text-white" : ""}
          >
            {i.toString().padStart(2, '0')}
          </Button>
        );
      }

      // Always show last page if different from first
      buttons.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          size="sm"
          onClick={() => setPage(totalPages)}
          className={currentPage === totalPages ? " text-white" : ""}
        >
          {totalPages.toString().padStart(2, '0')}
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <div className="bg-[#1C2936] rounded-lg shadow-sm p-5">

          <h1 className="text-2xl font-semibold text-gray-100">Notifications</h1>


          {/* Table */}
          <div className="overflow-x-auto pt-5">
            <table className="w-full">
              <thead className="bg-[#1C2936] text-white border-y border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Date/Time</th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-[#1C2936] divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-white">
                      Loading notifications...
                    </td>
                  </tr>
                ) : notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <tr
                      key={notification._id}
                      className={`hover:bg-[#27394b] text-white`}
                    >
                      <td className="px-6 py-4 text-sm text-gray-100 font-medium">
                        {notification.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-100">
                        {notification.body}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-100">
                        <span className="bg-gray-700 px-2 py-1 rounded text-xs">{notification.type}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-100">
                        {formatDate(notification.createdAt, notification._id)}
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}>
                          {notification.status}
                        </span>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No notifications found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && meta.total > 0 && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {((page - 1) * limit) + 1} to{' '}
                {Math.min(page * limit, meta.total)} of{' '}
                {meta.total} entries
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </Button>

                {renderPaginationButtons()}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={page >= meta.totalPage}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Single Notification Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This functionality is currently disabled as the API endpoints are not available.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              Close
            </AlertDialogCancel>
            {/* Action disabled */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete All Notifications Dialog */}
      <AlertDialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Notifications</AlertDialogTitle>
            <AlertDialogDescription>
              This functionality is currently disabled as the API endpoints are not available.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              Close
            </AlertDialogCancel>
            {/* Action disabled */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NotificationSystem;