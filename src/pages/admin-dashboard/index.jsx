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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [selectedReceipts, setSelectedReceipts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortConfig, setSortConfig] = useState({ column: 'submissionDate', direction: 'desc' });
  const [filters, setFilters] = useState({
    status: 'all',
    session: 'all',
    dateRange: 'last7days',
    amountRange: 'all',
    search: '',
    fromDate: '',
    toDate: ''
  });

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

  // Filter and sort receipts
  const filteredAndSortedReceipts = useMemo(() => {
    let filtered = [...mockReceipts];

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(receipt => receipt.status === filters.status);
    }

    // Apply session filter
    if (filters.session !== 'all') {
      filtered = filtered.filter(receipt => receipt.session === filters.session);
    }

    // Apply search filter - enhanced to include student ID and code ID
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(receipt => 
        receipt.referenceId.toLowerCase().includes(searchTerm) ||
        receipt.studentName.toLowerCase().includes(searchTerm) ||
        receipt.studentId.toLowerCase().includes(searchTerm) ||
        receipt.studentEmail.toLowerCase().includes(searchTerm) ||
        receipt.id.toLowerCase().includes(searchTerm)
      );
    }

    // Apply date range filter
    const now = new Date();
    if (filters.dateRange !== 'all') {
      const filterDate = new Date();
      switch (filters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(receipt => receipt.submissionDate >= filterDate);
          break;
        case 'yesterday':
          filterDate.setDate(filterDate.getDate() - 1);
          filterDate.setHours(0, 0, 0, 0);
          const yesterdayEnd = new Date(filterDate);
          yesterdayEnd.setHours(23, 59, 59, 999);
          filtered = filtered.filter(receipt => 
            receipt.submissionDate >= filterDate && receipt.submissionDate <= yesterdayEnd
          );
          break;
        case 'last7days':
          filterDate.setDate(filterDate.getDate() - 7);
          filtered = filtered.filter(receipt => receipt.submissionDate >= filterDate);
          break;
        case 'last30days':
          filterDate.setDate(filterDate.getDate() - 30);
          filtered = filtered.filter(receipt => receipt.submissionDate >= filterDate);
          break;
        case 'custom':
          if (filters.fromDate) {
            const fromDate = new Date(filters.fromDate);
            filtered = filtered.filter(receipt => receipt.submissionDate >= fromDate);
          }
          if (filters.toDate) {
            const toDate = new Date(filters.toDate);
            toDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter(receipt => receipt.submissionDate <= toDate);
          }
          break;
      }
    }

    // Apply amount range filter
    if (filters.amountRange !== 'all') {
      switch (filters.amountRange) {
        case '0-50':
          filtered = filtered.filter(receipt => receipt.amount >= 0 && receipt.amount <= 50);
          break;
        case '51-100':
          filtered = filtered.filter(receipt => receipt.amount >= 51 && receipt.amount <= 100);
          break;
        case '101-500':
          filtered = filtered.filter(receipt => receipt.amount >= 101 && receipt.amount <= 500);
          break;
        case '500+':
          filtered = filtered.filter(receipt => receipt.amount > 500);
          break;
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.column];
      let bValue = b[sortConfig.column];

      if (sortConfig.column === 'submissionDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [filters, sortConfig]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = mockReceipts.length;
    const pending = mockReceipts.filter(r => r.status === 'pending').length;
    const verified = mockReceipts.filter(r => r.status === 'verified').length;
    const flagged = mockReceipts.filter(r => r.status === 'flagged').length;

    return {
      total,
      pending,
      verified,
      flagged
    };
  }, []);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedReceipts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReceipts = filteredAndSortedReceipts.slice(startIndex, startIndex + itemsPerPage);

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
      setSelectedReceipts(paginatedReceipts.map(receipt => receipt.id));
    } else {
      setSelectedReceipts([]);
    }
  };

  const handleBulkApprove = () => {
    console.log('Bulk approve:', selectedReceipts);
    setSelectedReceipts([]);
  };

  const handleBulkReject = () => {
    console.log('Bulk reject:', selectedReceipts);
    setSelectedReceipts([]);
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

              <ReceiptTable
                receipts={paginatedReceipts}
                selectedReceipts={selectedReceipts}
                onSelectReceipt={handleSelectReceipt}
                onSelectAll={handleSelectAll}
                onSort={handleSort}
                sortConfig={sortConfig}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredAndSortedReceipts.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ActivityFeed activities={mockActivities} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;