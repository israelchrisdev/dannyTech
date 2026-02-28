import React, { useState } from 'react';
import { MailIcon, PhoneIcon, ChatIcon, DocumentTextIcon } from '@heroicons/react/outline';

const ContactSupport = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    orderNumber: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    setSubmitted(true);
  };

  const supportOptions = [
    {
      icon: ChatIcon,
      title: 'Live Chat',
      description: 'Chat with our support team',
      availability: '24/7',
      action: 'Start Chat',
      color: 'green'
    },
    {
      icon: PhoneIcon,
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      availability: 'Mon-Fri, 8am-8pm ET',
      number: '1-800-123-4567',
      action: 'Call Now',
      color: 'blue'
    },
    {
      icon: MailIcon,
      title: 'Email Support',
      description: 'Send us an email',
      availability: 'Response within 24 hours',
      action: 'Send Email',
      color: 'purple'
    }
  ];

  const categories = [
    'Buying Help',
    'Selling Help',
    'Account Issues',
    'Payment Problems',
    'Shipping Questions',
    'Returns & Refunds',
    'Technical Support',
    'Report a Problem'
  ];

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-green-100 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
          <MailIcon className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Message Sent!</h2>
        <p className="text-gray-600 mb-8">
          Thank you for contacting us. We'll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Contact Support</h1>
      <p className="text-gray-600 mb-8">We're here to help you 24/7</p>

      {/* Support Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {supportOptions.map((option) => (
          <div key={option.title} className="bg-white rounded-lg shadow p-6 text-center">
            <div className={`inline-block p-3 bg-${option.color}-100 rounded-full mb-4`}>
              <option.icon className={`h-6 w-6 text-${option.color}-600`} />
            </div>
            <h3 className="font-bold mb-2">{option.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{option.description}</p>
            <p className="text-xs text-gray-500 mb-4">{option.availability}</p>
            {option.number && (
              <p className="text-sm font-medium mb-4">{option.number}</p>
            )}
            <button className="text-blue-600 hover:underline text-sm font-medium">
              {option.action} →
            </button>
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-xl font-bold mb-6">Send us a message</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Number (Optional)
            </label>
            <input
              type="text"
              name="orderNumber"
              value={formData.orderNumber}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="e.g., #123456789"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="6"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Describe your issue in detail..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              required
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              I agree to the processing of my personal data
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* FAQ Link */}
      <div className="text-center mt-8">
        <p className="text-gray-600">
          Looking for quick answers?{' '}
          <a href="/help/faq" className="text-blue-600 hover:underline">
            Check our FAQ
          </a>
        </p>
      </div>
    </div>
  );
};

export default ContactSupport;