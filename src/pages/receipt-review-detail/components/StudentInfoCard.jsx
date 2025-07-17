import React from 'react';
import Icon from '../../../components/AppIcon';

const StudentInfoCard = ({ receipt }) => {
  const infoItems = [
    { label: 'Reference ID', value: receipt.referenceId, icon: 'Hash' },
    { label: 'Student Name', value: receipt.studentName, icon: 'User' },
    { label: 'Student ID', value: receipt.studentId, icon: 'CreditCard' },
    { label: 'Email', value: receipt.email, icon: 'Mail' },
    { label: 'Phone', value: receipt.phone, icon: 'Phone' },
    { label: 'Grade/Class', value: receipt.grade, icon: 'GraduationCap' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Icon name="User" size={20} className="mr-2" />
        Student Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infoItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
              <Icon name={item.icon} size={16} className="text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-sm font-medium text-foreground truncate">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentInfoCard;