import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import {
  QuestionMarkCircleIcon,
  BookOpenIcon,
  ChatIcon,
  PhoneIcon,
  MailIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  TruckIcon,
  CreditCardIcon,
  RefreshIcon,
  UserGroupIcon
} from '@heroicons/react/outline';
import FAQ from './FAQ';
import ContactSupport from './ContactSupport';
import Tutorials from './Tutorials';

const HelpCenter = () => {
  const helpTopics = [
    {
      icon: BookOpenIcon,
      title: 'Buying Help',
      description: 'Learn how to find items, place bids, and complete purchases',
      link: '/help/buying',
      color: 'blue'
    },
    {
      icon: DocumentTextIcon,
      title: 'Selling Help',
      description: 'Get started with selling, create listings, and manage your sales',
      link: '/help/selling',
      color: 'green'
    },
    {
      icon: CreditCardIcon,
      title: 'Payments',
      description: 'Information about payments, fees, and payouts',
      link: '/help/payments',
      color: 'purple'
    },
    {
      icon: TruckIcon,
      title: 'Shipping & Returns',
      description: 'Learn about shipping options and return policies',
      link: '/help/shipping',
      color: 'orange'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Account & Security',
      description: 'Manage your account settings and keep your information secure',
      link: '/help/account',
      color: 'red'
    },
    {
      icon: DocumentTextIcon,
      title: 'Policies',
      description: 'Read our policies and terms of service',
      link: '/help/policies',
      color: 'indigo'
    },
    {
      icon: RefreshIcon,
      title: 'A-Z Guarantee',
      description: 'Learn about buyer protection and how to file a claim',
      link: '/help/guarantee',
      color: 'pink'
    }
  ];

  const popularArticles = [
    {
      title: 'How to track your package',
      views: '12.5k views',
      link: '/help/tracking'
    },
    {
      title: 'Understanding selling fees',
      views: '8.3k views',
      link: '/help/fees'
    },
    {
      title: 'Return policy explained',
      views: '7.1k views',
      link: '/help/returns'
    },
    {
      title: 'How to leave feedback',
      views: '5.9k views',
      link: '/help/feedback'
    },
    {
      title: 'Secure payment methods',
      views: '4.8k views',
      link: '/help/payments'
    }
  ];

  const resources = [
    {
      icon: QuestionMarkCircleIcon,
      title: 'FAQ',
      description: 'Find answers to common questions',
      link: '/help/faq'
    },
    {
      icon: BookOpenIcon,
      title: 'Tutorials',
      description: 'Step-by-step guides and videos',
      link: '/help/tutorials'
    },
    {
      icon: UserGroupIcon,
      title: 'Community',
      description: 'Get help from other users',
      link: '/community'
    },
    {
      icon: ChatIcon,
      title: 'Contact Us',
      description: 'Reach out to our support team',
      link: '/help/contact'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">How can we help you?</h1>
        <div className="max-w-2xl mx-auto">
          <div className="flex">
            <input
              type="text"
              placeholder="Search for help articles..."
              className="flex-1 border rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700">
              Search
            </button>
          </div>
        </div>
      </div>

      <Routes>
        <Route path="/" element={
          <>
            {/* Help Topics */}
            <div className="mb-12">
              <h2 className="text-xl font-bold mb-6">Help Topics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {helpTopics.map((topic) => (
                  <Link
                    key={topic.title}
                    to={topic.link}
                    className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
                  >
                    <div className={`inline-block p-3 bg-${topic.color}-100 rounded-lg mb-4`}>
                      <topic.icon className={`h-6 w-6 text-${topic.color}-600`} />
                    </div>
                    <h3 className="font-bold mb-2">{topic.title}</h3>
                    <p className="text-sm text-gray-600">{topic.description}</p>
                    <span className="text-sm text-blue-600 mt-4 inline-block">
                      Learn more →
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Popular Articles */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-bold mb-4">Popular Articles</h2>
                <div className="bg-white rounded-lg shadow divide-y">
                  {popularArticles.map((article) => (
                    <Link
                      key={article.title}
                      to={article.link}
                      className="block p-4 hover:bg-gray-50"
                    >
                      <h3 className="font-medium mb-1">{article.title}</h3>
                      <p className="text-sm text-gray-500">{article.views}</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div>
                <h2 className="text-xl font-bold mb-4">Resources</h2>
                <div className="space-y-4">
                  {resources.map((resource) => (
                    <Link
                      key={resource.title}
                      to={resource.link}
                      className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition block"
                    >
                      <div className="flex items-start space-x-4">
                        <resource.icon className="h-6 w-6 text-blue-600 flex-shrink-0" />
                        <div>
                          <h3 className="font-medium">{resource.title}</h3>
                          <p className="text-sm text-gray-600">{resource.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Options */}
            <div className="bg-gray-50 rounded-lg p-8">
              <h2 className="text-xl font-bold text-center mb-8">Still need help?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <PhoneIcon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-medium mb-2">Phone Support</h3>
                  <p className="text-sm text-gray-600 mb-2">Mon-Fri, 8am-8pm ET</p>
                  <p className="text-blue-600 font-medium">1-800-123-4567</p>
                </div>
                <div className="text-center">
                  <ChatIcon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-medium mb-2">Live Chat</h3>
                  <p className="text-sm text-gray-600 mb-2">Available 24/7</p>
                  <button className="text-blue-600 hover:underline">Start Chat</button>
                </div>
                <div className="text-center">
                  <MailIcon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-medium mb-2">Email</h3>
                  <p className="text-sm text-gray-600 mb-2">Response within 24 hours</p>
                  <a href="/help/contact" className="text-blue-600 hover:underline">
                    Send Message
                  </a>
                </div>
              </div>
            </div>
          </>
        } />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<ContactSupport />} />
        <Route path="/tutorials" element={<Tutorials />} />
      </Routes>
    </div>
  );
};

export default HelpCenter;