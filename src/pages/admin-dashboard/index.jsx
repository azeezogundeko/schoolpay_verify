import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeaderNav from '../../components/ui/AdminHeaderNav';
import AdminBreadcrumbs from '../../components/ui/AdminBreadcrumbs';
import MetricsCard from './components/MetricsCard';
import FilterPanel from './components/FilterPanel';
import BulkActionsPanel from './components/BulkActionsPanel';
import ReceiptTable from './components/ReceiptTable';
import ActivityFeed from './components/ActivityFeed';
import Pagination from './components/Pagination';
import { receiptAPI, dashboardAPI } from '../../services/api';
import { formatErrorMessage } from '../../utils/apiHelpers';
import { useToastContext } from '../../contexts/ToastContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToastContext();
  const [selectedReceipts, setSelectedReceipts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortConfig, setSortConfig] = useState({ column: 'created_at', direction: 'desc' });
  const [filters, setFilters] = useState({
    status: 'all',
    session: 'all',
    dateRange: 'last7days',
    amountRange: 'all',
    search: '',
    fromDate: '',
    toDate: ''
  });

  // API data states
  const [receipts, setReceipts] = useState([]);
  const [metrics, setMetrics] = useState({ total: 0, pending: 0, verified: 0, flagged: 0 });
  const [activities, setActivities] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for receipts with session information
  const mockReceipts = [
    {
      id: 'RCP001',
      referenceId: 'PAY-2025-001234',
      studentName: 'Emily Johnson',
      studentId: 'STU123456',
      studentEmail: 'emily.johnson@student.edu',
      submissionDate: new Date('2025-01-17T08:30:00'),
      amount: 125.50,
      status: 'pending',
      session: '2024/2025',
      isUrgent: false
    },
    {
      id: 'RCP002',
      referenceId: 'PAY-2025-001235',
      studentName: 'Michael Chen',
      studentId: 'STU234567',
      studentEmail: 'michael.chen@student.edu',
      submissionDate: new Date('2025-01-17T07:45:00'),
      amount: 89.99,
      status: 'verified',
      session: '2024/2025',
      isUrgent: false
    },
    {
      id: 'RCP003',
      referenceId: 'PAY-2025-001236',
      studentName: 'Sarah Williams',
      studentId: 'STU345678',
      studentEmail: 'sarah.williams@student.edu',
      submissionDate: new Date('2025-01-17T06:15:00'),
      amount: 250.00,
      status: 'flagged',
      session: '2023/2024',
      isUrgent: true
    },
    {
      id: 'RCP004',
      referenceId: 'PAY-2025-001237',
      studentName: 'David Rodriguez',
      studentId: 'STU456789',
      studentEmail: 'david.rodriguez@student.edu',
      submissionDate: new Date('2025-01-16T14:20:00'),
      amount: 75.25,
      status: 'pending',
      session: '2024/2025',
      isUrgent: false
    },
    {
      id: 'RCP005',
      referenceId: 'PAY-2025-001238',
      studentName: 'Jessica Brown',
      studentId: 'STU567890',
      studentEmail: 'jessica.brown@student.edu',
      submissionDate: new Date('2025-01-16T11:30:00'),
      amount: 180.75,
      status: 'rejected',
      session: '2023/2024',
      isUrgent: false
    },
    {
      id: 'RCP006',
      referenceId: 'PAY-2025-001239',
      studentName: 'Alex Thompson',
      studentId: 'STU678901',
      studentEmail: 'alex.thompson@student.edu',
      submissionDate: new Date('2025-01-16T09:45:00'),
      amount: 95.00,
      status: 'verified',
      session: '2024/2025',
      isUrgent: false
    },
    {
      id: 'RCP007',
      referenceId: 'PAY-2025-001240',
      studentName: 'Maria Garcia',
      studentId: 'STU789012',
      studentEmail: 'maria.garcia@student.edu',
      submissionDate: new Date('2025-01-15T16:10:00'),
      amount: 320.50,
      status: 'pending',
      session: '2023/2024',
      isUrgent: true
    },
    {
      id: 'RCP008',
      referenceId: 'PAY-2025-001241',
      studentName: 'James Wilson',
      studentId: 'STU890123',
      studentEmail: 'james.wilson@student.edu',
      submissionDate: new Date('2025-01-15T13:25:00'),
      amount: 67.80,
      status: 'flagged',
      session: '2024/2025',
      isUrgent: false
    }
  ];

  // Mock activity data
  const mockActivities = [
    {
      id: 'ACT001',
      type: 'receipt_submitted',
      user: 'Emily Johnson',
      action: 'submitted a new receipt',
      target: 'PAY-2025-001234',
      timestamp: new Date('2025-01-17T08:30:00')
    },
    {
      id: 'ACT002',
      type: 'receipt_approved',
      user: 'Admin User',
      action: 'approved receipt',
      target: 'PAY-2025-001235',
      timestamp: new Date('2025-01-17T08:15:00')
    },
    {
      id: 'ACT003',
      type: 'receipt_flagged',
      user: 'AI System',
      action: 'flagged receipt for review',
      target: 'PAY-2025-001236',
      timestamp: new Date('2025-01-17T06:20:00')
    },
    {
      id: 'ACT004',
      type: 'bulk_action',
      user: 'Admin User',
      action: 'approved 5 receipts in bulk',
      target: null,
      timestamp: new Date('2025-01-16T15:30:00')
    },
    {
      id: 'ACT005',
      type: 'receipt_rejected',
      user: 'Admin User',
      action: 'rejected receipt',
      target: 'PAY-2025-001238',
      timestamp: new Date('2025-01-16T12:45:00')
    }
  ];

  // Check authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin-login');
    }
  }, [navigate]);

  // Fetch metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await dashboardAPI.getMetrics();
        if (response.success) {
          setMetrics(response.data);
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
  }, [receipts]); // Refetch when receipts change

  // Fetch activities
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await dashboardAPI.getActivities(10);
        if (response.success) {
          setActivities(response.data);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
    // Refresh activities every 30 seconds
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch receipts
  useEffect(() => {
    const fetchReceipts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Build filter params
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          sortColumn: sortConfig.column,
          sortDirection: sortConfig.direction
        };

        if (filters.status && filters.status !== 'all') {
          params.status = filters.status;
        }
        if (filters.search) {
          params.search = filters.search;
        }
        if (filters.fromDate) {
          params.fromDate = filters.fromDate;
        }
        if (filters.toDate) {
          params.toDate = filters.toDate;
        }

        const response = await receiptAPI.getAll(params);

        if (response.success) {
          // Transform API data to match component expectations
          const transformedReceipts = response.data.receipts.map(receipt => ({
            id: receipt.id,
            referenceId: receipt.reference_id,
            studentName: receipt.payment_codes?.student_name || 'Unknown',
            studentId: receipt.payment_codes?.student_id || 'Unknown',
            studentEmail: receipt.payment_codes?.student_email || '',
            submissionDate: new Date(receipt.created_at),
            amount: receipt.extracted_amount || receipt.payment_codes?.expected_amount || 0,
            status: receipt.status,
            session: receipt.payment_codes?.session || 'Unknown',
            isUrgent: receipt.is_urgent || false
          }));

          setReceipts(transformedReceipts);
          setTotalItems(response.data.pagination.total);
        }
      } catch (error) {
        console.error('Error fetching receipts:', error);
        setError(formatErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceipts();
  }, [currentPage, itemsPerPage, sortConfig, filters]);

  // Pagination - calculated from API response
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      session: 'all',
      dateRange: 'last7days',
      amountRange: 'all',
      search: '',
      fromDate: '',
      toDate: ''
    });
    setCurrentPage(1);
  };

  const handleSort = (column, direction) => {
    setSortConfig({ column, direction });
  };

  const handleSelectReceipt = (receiptId, isSelected) => {
    if (isSelected) {
      setSelectedReceipts(prev => [...prev, receiptId]);
    } else {
      setSelectedReceipts(prev => prev.filter(id => id !== receiptId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedReceipts(receipts.map(receipt => receipt.id));
    } else {
      setSelectedReceipts([]);
    }
  };

  const handleBulkApprove = async () => {
    try {
      await receiptAPI.bulkUpdate(selectedReceipts, 'verified');
      toast.success(`Successfully approved ${selectedReceipts.length} receipt(s)`);
      setSelectedReceipts([]);
      // Refetch receipts
      setFilters(prev => ({ ...prev }));
    } catch (error) {
      console.error('Bulk approve error:', error);
      toast.error('Failed to approve receipts: ' + formatErrorMessage(error));
    }
  };

  const handleBulkReject = async () => {
    try {
      await receiptAPI.bulkUpdate(selectedReceipts, 'rejected');
      toast.success(`Successfully rejected ${selectedReceipts.length} receipt(s)`);
      setSelectedReceipts([]);
      // Refetch receipts
      setFilters(prev => ({ ...prev }));
    } catch (error) {
      console.error('Bulk reject error:', error);
      toast.error('Failed to reject receipts: ' + formatErrorMessage(error));
    }
  };

  const handleBulkExport = () => {
    console.log('Bulk export:', selectedReceipts);
  };

  const handleExport = () => {
    console.log('Export all filtered receipts');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedReceipts([]);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setSelectedReceipts([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeaderNav />
      <AdminBreadcrumbs />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Monitor and manage payment verification workflows
            </p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricsCard
              title="Total Receipts"
              value={metrics.total}
              change="+12%"
              changeType="increase"
              icon="FileText"
              color="primary"
            />
            <MetricsCard
              title="Pending Review"
              value={metrics.pending}
              change="+5%"
              changeType="increase"
              icon="Clock"
              color="warning"
            />
            <MetricsCard
              title="Verified"
              value={metrics.verified}
              change="+18%"
              changeType="increase"
              icon="CheckCircle"
              color="success"
            />
            <MetricsCard
              title="Flagged"
              value={metrics.flagged}
              change="-8%"
              changeType="decrease"
              icon="AlertTriangle"
              color="error"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                onExport={handleExport}
              />

              <BulkActionsPanel
                selectedCount={selectedReceipts.length}
                onBulkApprove={handleBulkApprove}
                onBulkReject={handleBulkReject}
                onBulkExport={handleBulkExport}
                onClearSelection={() => setSelectedReceipts([])}
              />

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading receipts...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600">{error}</p>
                </div>
              ) : (
                <>
                  <ReceiptTable
                    receipts={receipts}
                    selectedReceipts={selectedReceipts}
                    onSelectReceipt={handleSelectReceipt}
                    onSelectAll={handleSelectAll}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                  />

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                  />
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ActivityFeed activities={activities} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;