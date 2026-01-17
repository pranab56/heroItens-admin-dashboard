"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Search,
  Trash2
} from 'lucide-react';
import { useState } from 'react';

// Types
type FrontendStatus = 'Sent' | 'Pending' | 'Failed';

interface Notification {
  _id: string;
  userId: string;
  role: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  status: string;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

interface ApiResponse {
  data: Notification[];
  meta: Meta;
}

const NotificationSystem = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);

  // Demo data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      _id: '1',
      userId: 'user001',
      role: 'admin',
      message: 'System maintenance scheduled for tonight',
      createdAt: '2024-01-15T10:30:00Z',
      isRead: true,
      status: 'sent'
    },
    {
      _id: '2',
      userId: 'user002',
      role: 'user',
      message: 'Your password has been changed successfully',
      createdAt: '2024-01-14T14:20:00Z',
      isRead: false,
      status: 'sent'
    },
    {
      _id: '3',
      userId: 'user003',
      role: 'moderator',
      message: 'New user registration requires approval',
      createdAt: '2024-01-14T09:15:00Z',
      isRead: true,
      status: 'pending'
    },
    {
      _id: '4',
      userId: 'user004',
      role: 'user',
      message: 'Payment processing failed',
      createdAt: '2024-01-13T16:45:00Z',
      isRead: false,
      status: 'failed'
    },
    {
      _id: '5',
      userId: 'user005',
      role: 'admin',
      message: 'Security alert: Multiple failed login attempts',
      createdAt: '2024-01-13T11:10:00Z',
      isRead: true,
      status: 'sent'
    },
    {
      _id: '6',
      userId: 'user006',
      role: 'user',
      message: 'Welcome to our platform!',
      createdAt: '2024-01-12T08:00:00Z',
      isRead: true,
      status: 'sent'
    },
    {
      _id: '7',
      userId: 'user007',
      role: 'moderator',
      message: 'Content reported for review',
      createdAt: '2024-01-11T15:30:00Z',
      isRead: false,
      status: 'pending'
    },
    {
      _id: '8',
      userId: 'user008',
      role: 'user',
      message: 'Your subscription is about to expire',
      createdAt: '2024-01-10T12:00:00Z',
      isRead: true,
      status: 'sent'
    },
    {
      _id: '9',
      userId: 'user009',
      role: 'admin',
      message: 'Database backup completed successfully',
      createdAt: '2024-01-09T23:00:00Z',
      isRead: false,
      status: 'sent'
    },
    {
      _id: '10',
      userId: 'user010',
      role: 'user',
      message: 'Email verification required',
      createdAt: '2024-01-08T13:45:00Z',
      isRead: true,
      status: 'failed'
    },
    {
      _id: '11',
      userId: 'user011',
      role: 'moderator',
      message: 'New comment on post #1234',
      createdAt: '2024-01-07T10:20:00Z',
      isRead: true,
      status: 'sent'
    },
    {
      _id: '12',
      userId: 'user012',
      role: 'admin',
      message: 'Server load is high',
      createdAt: '2024-01-06T18:30:00Z',
      isRead: false,
      status: 'pending'
    }
  ]);

  // Simulate API response with demo data
  const apiData: ApiResponse = {
    data: notifications,
    meta: {
      page,
      limit,
      total: notifications.length,
      totalPage: Math.ceil(notifications.length / limit)
    }
  };

  // Map API status to frontend status
  const mapApiStatus = (apiStatus: string): FrontendStatus => {
    switch (apiStatus.toLowerCase()) {
      case 'sent':
        return 'Sent';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      default:
        return 'Pending';
    }
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', '');
  };

  const getStatusColor = (status: FrontendStatus): string => {
    switch (status) {
      case 'Sent':
        return 'bg-green-100 text-green-700';
      case 'Pending':
        return 'bg-orange-100 text-orange-700';
      case 'Failed':
        return 'bg-pink-100 text-pink-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getReadStatusColor = (isRead: boolean): string => {
    return isRead ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700';
  };

  // Handle all notifications read
  const handleReadAllNotifications = async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // Handle single notification delete
  const handleDeleteNotification = async () => {
    if (!selectedNotification) return;

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    setNotifications(prev =>
      prev.filter(notification => notification._id !== selectedNotification)
    );

    setShowDeleteDialog(false);
    setSelectedNotification(null);
  };

  // Handle all notifications delete
  const handleDeleteAllNotifications = async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    setNotifications([]);
    setShowDeleteAllDialog(false);
  };

  // Confirm delete dialog for single notification
  const confirmDelete = (id: string) => {
    setSelectedNotification(id);
    setShowDeleteDialog(true);
  };

  // Confirm delete all dialog
  const confirmDeleteAll = () => {
    setShowDeleteAllDialog(true);
  };

  // Filter notifications based on search and status
  const filteredNotifications = apiData.data.filter(notification => {
    const matchesSearch =
      searchQuery === '' ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      notification.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Paginate filtered notifications
  const paginatedNotifications = filteredNotifications.slice(
    (page - 1) * limit,
    page * limit
  );

  // Handle pagination
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (apiData?.meta && page < apiData.meta.totalPage) {
      setPage(prev => prev + 1);
    }
  };

  // Render pagination buttons
  const renderPaginationButtons = () => {
    if (!apiData?.meta) return null;

    const buttons = [];
    const totalPages = apiData.meta.totalPage;
    const currentPage = apiData.meta.page;

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

    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i > 1 && i < totalPages) {
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
    }

    // Always show last page if there's more than 1 page
    if (totalPages > 1) {
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

  // Loading state (removed API loading)
  const isLoading = false;

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <div className="bg-[#1C2936] rounded-lg shadow-sm p-5">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-100">Notification History</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReadAllNotifications}
                disabled={paginatedNotifications.length === 0}
                className='bg-[#1C2936] border-gray-500 border text-white hover:bg-none'
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark All as Read
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={confirmDeleteAll}
                disabled={paginatedNotifications.length === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete All
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4 pt-5">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by message or role..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchQuery(e.target.value);
                  setPage(1); // Reset to first page when searching
                }}
                className="pl-10 text-white placeholder:text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value);
              setPage(1); // Reset to first page when filtering
            }}>
              <SelectTrigger className="w-48 text-white cursor-pointer">
                <SelectValue placeholder="Status: All" className='text-white' />
              </SelectTrigger>
              <SelectContent className='bg-[#1C2936] text-white'>
                <SelectItem value="all">Status: All</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto pt-5">
            <table className="w-full">
              <thead className="bg-[#1C2936] text-white border-y border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Notif. ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Recipient ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Date/Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Read Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#1C2936] divide-y divide-gray-200">
                {paginatedNotifications.length > 0 ? (
                  paginatedNotifications.map((notification) => (
                    <tr
                      key={notification._id}
                      className={`hover:bg-[#27394b] text-white ${notification.isRead ? '' : ''}`}
                    >
                      <td className="px-6 py-4 text-sm text-gray-100">
                        #{notification._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-100">
                        {notification.userId ? notification.userId.slice(-6).toUpperCase() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-100 capitalize">
                        {notification.role}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-100">
                        {notification.message}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-100">
                        {formatDate(notification.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getReadStatusColor(notification.isRead)}`}>
                          {notification.isRead ? 'Read' : 'Unread'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(mapApiStatus(notification.status))}`}>
                          {mapApiStatus(notification.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button className='hover:bg-gray-800' variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4 text-white" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => confirmDelete(notification._id)}
                              className="cursor-pointer text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      No notifications found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {apiData?.meta && filteredNotifications.length > 0 && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {((page - 1) * limit) + 1} to{' '}
                {Math.min(page * limit, filteredNotifications.length)} of{' '}
                {filteredNotifications.length} entries
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
                  disabled={page >= apiData.meta.totalPage}
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
              This action cannot be undone. This will permanently delete the notification.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteNotification}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete All Notifications Dialog */}
      <AlertDialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Notifications</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete all notifications. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAllNotifications}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NotificationSystem;