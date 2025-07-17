import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('');

  // Mock credentials for demonstration
  const mockCredentials = {
    username: 'admin@schoolpay.edu',
    password: 'SchoolAdmin2025!'
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!formData.username.includes('@')) {
      newErrors.username = 'Please enter a valid email address';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (showCaptcha && !captchaValue.trim()) {
      newErrors.captcha = 'Please complete the CAPTCHA';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (formData.username === mockCredentials.username && 
          formData.password === mockCredentials.password) {
        // Successful login
        localStorage.setItem('adminToken', 'mock-admin-token-2025');
        localStorage.setItem('adminUser', JSON.stringify({
          username: formData.username,
          loginTime: new Date().toISOString(),
          rememberMe: formData.rememberMe
        }));
        navigate('/admin-dashboard');
      } else {
        // Failed login
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);
        
        if (newFailedAttempts >= 3) {
          setShowCaptcha(true);
        }
        
        setErrors({
          general: `Invalid credentials. Please use:\nEmail: ${mockCredentials.username}\nPassword: ${mockCredentials.password}`
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleForgotPassword = () => {
    // Mock forgot password functionality
    alert('Password reset link would be sent to your registered email address.\n\nFor demo purposes, use:\nEmail: admin@schoolpay.edu\nPassword: SchoolAdmin2025!');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Error Message */}
        {errors.general && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertCircle" size={20} className="text-error mt-0.5 flex-shrink-0" />
              <div className="text-sm text-error whitespace-pre-line">
                {errors.general}
              </div>
            </div>
          </div>
        )}

        {/* Username Field */}
        <Input
          label="Username / Email"
          type="email"
          name="username"
          placeholder="Enter your email address"
          value={formData.username}
          onChange={handleInputChange}
          error={errors.username}
          required
          disabled={isLoading}
        />

        {/* Password Field */}
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            required
            disabled={isLoading}
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-hover"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            <Icon name={showPassword ? "EyeOff" : "Eye"} size={20} />
          </button>
        </div>

        {/* CAPTCHA (shown after 3 failed attempts) */}
        {showCaptcha && (
          <div className="space-y-3">
            <div className="bg-muted rounded-lg p-4 text-center">
              <div className="text-lg font-mono bg-background px-4 py-2 rounded border-2 border-dashed border-border inline-block">
                7X9K2
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Enter the characters shown above
              </p>
            </div>
            <Input
              label="CAPTCHA Verification"
              type="text"
              placeholder="Enter CAPTCHA code"
              value={captchaValue}
              onChange={(e) => setCaptchaValue(e.target.value)}
              error={errors.captcha}
              required
              disabled={isLoading}
            />
          </div>
        )}

        {/* Remember Me */}
        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-primary hover:text-primary/80 transition-hover"
            disabled={isLoading}
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          iconName="LogIn"
          iconPosition="left"
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        {/* Support Information */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Need help? Contact IT Support
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <a 
              href="mailto:support@schoolpay.edu" 
              className="text-primary hover:text-primary/80 transition-hover flex items-center space-x-1"
            >
              <Icon name="Mail" size={16} />
              <span>support@schoolpay.edu</span>
            </a>
            <span className="text-muted-foreground">|</span>
            <a 
              href="tel:+1-555-0123" 
              className="text-primary hover:text-primary/80 transition-hover flex items-center space-x-1"
            >
              <Icon name="Phone" size={16} />
              <span>(555) 012-3456</span>
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;