import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const StudentInfoForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    paymentAmount: '',
    paymentPurpose: 'tuition',
    session: '2024/2025'
  });

  const [errors, setErrors] = useState({});

  const paymentPurposeOptions = [
    { value: 'tuition', label: 'Tuition Fee' },
    { value: 'library', label: 'Library Fee' },
    { value: 'lab', label: 'Laboratory Fee' },
    { value: 'sports', label: 'Sports Fee' },
    { value: 'exam', label: 'Examination Fee' },
    { value: 'other', label: 'Other' }
  ];

  const sessionOptions = [
    { value: '2024/2025', label: '2024/2025 Academic Year' },
    { value: '2023/2024', label: '2023/2024 Academic Year' },
    { value: '2022/2023', label: '2022/2023 Academic Year' },
    { value: '2021/2022', label: '2021/2022 Academic Year' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Student name is required';
    } else if (formData.studentName.trim().length < 2) {
      newErrors.studentName = 'Name must be at least 2 characters';
    }

    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    } else if (!/^[A-Z0-9]{6,12}$/.test(formData.studentId.trim())) {
      newErrors.studentId = 'Student ID must be 6-12 alphanumeric characters';
    }

    if (!formData.paymentAmount) {
      newErrors.paymentAmount = 'Payment amount is required';
    } else if (isNaN(formData.paymentAmount) || parseFloat(formData.paymentAmount) <= 0) {
      newErrors.paymentAmount = 'Please enter a valid amount';
    } else if (parseFloat(formData.paymentAmount) > 10000) {
      newErrors.paymentAmount = 'Amount cannot exceed $10,000';
    }

    if (!formData.session) {
      newErrors.session = 'Academic session is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        paymentAmount: parseFloat(formData.paymentAmount)
      });
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-soft">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Icon name="CreditCard" size={20} color="white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Generate Payment Code</h2>
          <p className="text-sm text-muted-foreground">Enter your details to create a unique payment code</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Student Name"
            type="text"
            placeholder="Enter your full name"
            value={formData.studentName}
            onChange={(e) => handleInputChange('studentName', e.target.value)}
            error={errors.studentName}
            required
            disabled={isLoading}
          />

          <Input
            label="Student ID"
            type="text"
            placeholder="Enter your student ID (e.g., STU123456)"
            value={formData.studentId}
            onChange={(e) => handleInputChange('studentId', e.target.value.toUpperCase())}
            error={errors.studentId}
            required
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Academic Session"
            options={sessionOptions}
            value={formData.session}
            onChange={(value) => handleInputChange('session', value)}
            error={errors.session}
            required
            disabled={isLoading}
            placeholder="Select academic session"
          />

          <Input
            label="Payment Amount"
            type="number"
            placeholder="0.00"
            value={formData.paymentAmount}
            onChange={(e) => handleInputChange('paymentAmount', e.target.value)}
            error={errors.paymentAmount}
            required
            disabled={isLoading}
            min="0.01"
            max="10000"
            step="0.01"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Payment Purpose"
            options={paymentPurposeOptions}
            value={formData.paymentPurpose}
            onChange={(value) => handleInputChange('paymentPurpose', value)}
            disabled={isLoading}
            placeholder="Select payment purpose"
          />
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={isLoading}
            iconName="Zap"
            iconPosition="left"
            disabled={isLoading}
          >
            {isLoading ? 'Generating Code...' : 'Generate Payment Code'}
          </Button>
        </div>
      </form>

      <div className="mt-4 p-3 bg-muted rounded-md">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Important Notes:</p>
            <ul className="space-y-1 text-xs">
              <li>• Payment codes are valid for 24 hours</li>
              <li>• Keep your code secure until payment is complete</li>
              <li>• You'll need to upload your receipt after payment</li>
              <li>• Selected session must match your current enrollment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentInfoForm;