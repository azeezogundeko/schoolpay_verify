import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const HelpSection = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'How long is my payment code valid?',
      answer: 'Payment codes are valid for 24 hours from generation. After this time, you\'ll need to generate a new code.'
    },
    {
      id: 2,
      question: 'What payment methods are accepted?',
      answer: 'You can use any payment method accepted by your school\'s payment system. The code works with online banking, mobile wallets, and card payments.'
    },
    {
      id: 3,
      question: 'What if I lose my payment code?',
      answer: 'If you lose your code, simply generate a new one using the same student information. The previous code will be automatically invalidated.'
    },
    {
      id: 4,
      question: 'How do I upload my receipt?',
      answer: 'After making payment, click "Upload Payment Receipt" and follow the instructions to submit your payment proof for verification.'
    }
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-soft">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="HelpCircle" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Frequently Asked Questions</h3>
      </div>

      <div className="space-y-3">
        {faqs.map((faq) => (
          <div key={faq.id} className="border border-border rounded-lg">
            <button
              onClick={() => toggleFaq(faq.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-hover"
            >
              <span className="text-sm font-medium text-foreground">{faq.question}</span>
              <Icon 
                name={expandedFaq === faq.id ? "ChevronUp" : "ChevronDown"} 
                size={16} 
                className="text-muted-foreground flex-shrink-0 ml-2" 
              />
            </button>
            {expandedFaq === faq.id && (
              <div className="px-4 pb-4">
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-center space-x-4 text-sm">
          <a 
            href="mailto:support@schoolpay.edu" 
            className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-hover"
          >
            <Icon name="Mail" size={16} />
            <span>Email Support</span>
          </a>
          <div className="w-px h-4 bg-border"></div>
          <a 
            href="tel:+1-555-0123" 
            className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-hover"
          >
            <Icon name="Phone" size={16} />
            <span>Call Support</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default HelpSection;