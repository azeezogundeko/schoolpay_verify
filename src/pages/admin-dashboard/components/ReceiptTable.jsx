import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import StatusBadge from './StatusBadge';

const ReceiptTable = ({ receipts, selectedReceipts, onSelectReceipt, onSelectAll, onSort, sortConfig }) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleSort = (column) => {
    const direction = sortConfig.column === column && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    onSort(column, direction);
  };

  const getSortIcon = (column) => {
    if (sortConfig.column !== column) return 'ArrowUpDown';
    return sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-soft overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <Checkbox
                  checked={selectedReceipts.length === receipts.length && receipts.length > 0}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  indeterminate={selectedReceipts.length > 0 && selectedReceipts.length < receipts.length}
                />
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('referenceId')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-hover"
                >
                  <span>Reference ID</span>
                  <Icon name={getSortIcon('referenceId')} size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('studentName')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-hover"
                >
                  <span>Student Name</span>
                  <Icon name={getSortIcon('studentName')} size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('session')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-hover"
                >
                  <span>Session</span>
                  <Icon name={getSortIcon('session')} size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('submissionDate')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-hover"
                >
                  <span>Submitted</span>
                  <Icon name={getSortIcon('submissionDate')} size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('amount')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-hover"
                >
                  <span>Amount</span>
                  <Icon name={getSortIcon('amount')} size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-sm font-medium text-foreground">Status</span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {receipts.map((receipt) => (
              <tr
                key={receipt.id}
                className={`transition-hover ${hoveredRow === receipt.id ? 'bg-muted/30' : 'hover:bg-muted/20'}`}
                onMouseEnter={() => setHoveredRow(receipt.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-4 py-4">
                  <Checkbox
                    checked={selectedReceipts.includes(receipt.id)}
                    onChange={(e) => onSelectReceipt(receipt.id, e.target.checked)}
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm text-foreground">{receipt.referenceId}</span>
                    {receipt.isUrgent && (
                      <Icon name="AlertCircle" size={16} className="text-warning" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {receipt.studentName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{receipt.studentName}</div>
                      <div className="text-xs text-muted-foreground">{receipt.studentId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {receipt.session}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-foreground">{formatDate(receipt.submissionDate)}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-foreground">{formatCurrency(receipt.amount)}</div>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={receipt.status} size="sm" />
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Link to={`/receipt-review-detail?id=${receipt.id}`}>
                      <Button variant="outline" size="sm" iconName="Eye" iconPosition="left">
                        Review
                      </Button>
                    </Link>
                    {receipt.status === 'pending' && (
                      <div className="flex items-center space-x-1">
                        <Button variant="success" size="sm" iconName="Check">
                          Approve
                        </Button>
                        <Button variant="destructive" size="sm" iconName="X">
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {receipts.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No receipts found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ReceiptTable;