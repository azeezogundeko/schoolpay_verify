import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const FilterPanel = ({ filters, onFilterChange, onClearFilters, onExport }) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'verified', label: 'Verified' },
    { value: 'flagged', label: 'Flagged' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const amountRangeOptions = [
    { value: 'all', label: 'All Amounts' },
    { value: '0-50', label: '$0 - $50' },
    { value: '51-100', label: '$51 - $100' },
    { value: '101-500', label: '$101 - $500' },
    { value: '500+', label: '$500+' }
  ];

  const sessionOptions = [
    { value: 'all', label: 'All Sessions' },
    { value: '2024/2025', label: '2024/2025' },
    { value: '2023/2024', label: '2023/2024' },
    { value: '2022/2023', label: '2022/2023' },
    { value: '2021/2022', label: '2021/2022' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-soft mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Filter Receipts</h3>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear All
          </Button>
          <Button variant="outline" size="sm" onClick={onExport} iconName="Download" iconPosition="left">
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Select
          label="Status"
          options={statusOptions}
          value={filters.status}
          onChange={(value) => onFilterChange('status', value)}
          placeholder="Select status"
        />

        <Select
          label="Session"
          options={sessionOptions}
          value={filters.session}
          onChange={(value) => onFilterChange('session', value)}
          placeholder="Select session"
        />

        <Select
          label="Date Range"
          options={dateRangeOptions}
          value={filters.dateRange}
          onChange={(value) => onFilterChange('dateRange', value)}
          placeholder="Select date range"
        />

        <Select
          label="Amount Range"
          options={amountRangeOptions}
          value={filters.amountRange}
          onChange={(value) => onFilterChange('amountRange', value)}
          placeholder="Select amount"
        />

        <Input
          label="Search"
          type="search"
          placeholder="Name, Code ID, or Reference"
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
      </div>

      {filters.dateRange === 'custom' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Input
            label="From Date"
            type="date"
            value={filters.fromDate}
            onChange={(e) => onFilterChange('fromDate', e.target.value)}
          />
          <Input
            label="To Date"
            type="date"
            value={filters.toDate}
            onChange={(e) => onFilterChange('toDate', e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default FilterPanel;