import React, { useState } from 'react';
import { SearchIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState([]);

  const categories = [
    { id: 'all', name: 'All Questions', count: 24 },
    { id: 'buying', name: 'Buying', count: 8 },
    { id: 'selling', name: 'Selling', count: 7 },
    { id: 'payments', name: 'Payments', count: 5 },
    { id: 'shipping', name: 'Shipping', count: 4 }
  ];

  const faqs = [
    {
      id: 1,
      category: 'buying',
      question: 'How do I search for items?',
      answer: 'You can search for items using the search bar at the top of any page. Enter keywords, item numbers, or seller names. You can also browse by category using the "Shop by Category" dropdown menu.'
    },
    {
      id: 2,
      category: 'buying',
      question: 'How do I place a bid?',
      answer: 'To place a bid on an auction item, go to the item listing page and enter your maximum bid amount in the bid box. You\'ll be notified if you\'re outbid and can increase your bid if desired.'
    },
    {
      id: 3,
      category: 'buying',
      question: 'What is a Buy It Now price?',
      answer: 'Buy It Now allows you to purchase an item immediately at a fixed price, without waiting for an auction to end. Not all listings offer this option.'
    },
    {
      id: 4,
      category: 'selling',
      question: 'How do I create a listing?',
      answer: 'Click on "Sell" at the top of the page. You\'ll be guided through the listing process, including adding photos, writing a description, setting a price, and choosing shipping options.'
    },
    {
      id: 5,
      category: 'selling',
      question: 'What are the selling fees?',
      answer: 'We charge a small insertion fee for each listing and a final value fee when your item sells. Fees vary by category and listing type. Check our fee schedule for detailed information.'
    },
    {
      id: 6,
      category: 'selling',
      question: 'How do I manage my listings?',
      answer: 'Go to "My eBay" and click on "Selling" to view and manage all your active listings. From there you can edit, relist, or end listings as needed.'
    },
    {
      id: 7,
      category: 'payments',
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and in some cases, financing options.'
    },
    {
      id: 8,
      category: 'payments',
      question: 'When will I receive my payout?',
      answer: 'Payouts are typically processed within 2-3 business days after the buyer\'s payment clears. Funds are sent to your linked bank account or PayPal account.'
    },
    {
      id: 9,
      category: 'shipping',
      question: 'How do I track my package?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also track your package by going to "My eBay" > "Purchase History" and clicking on the order.'
    },
    {
      id: 10,
      category: 'shipping',
      question: 'What if my item doesn\'t arrive?',
      answer: 'If your item hasn\'t arrived by the estimated delivery date, first check the tracking information. If it\'s been more than the expected delivery time, contact the seller or open a case in the Resolution Center.'
    }
  ];

  const toggleItem = (id) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Frequently Asked Questions</h1>
      <p className="text-gray-600 mb-8">Find answers to common questions about buying, selling, and using our platform.</p>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              activeCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFaqs.map(faq => (
          <div key={faq.id} className="bg-white rounded-lg shadow overflow-hidden">
            <button
              onClick={() => toggleItem(faq.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
            >
              <span className="font-medium text-left">{faq.question}</span>
              {openItems.includes(faq.id) ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {openItems.includes(faq.id) && (
              <div className="px-6 pb-4">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}

        {filteredFaqs.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No FAQs match your search.</p>
          </div>
        )}
      </div>

      {/* Still Need Help */}
      <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Still Need Help?</h2>
        <p className="text-gray-600 mb-4">Can't find the answer you're looking for? Contact our support team.</p>
        <a
          href="/help/contact"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
};

export default FAQ;