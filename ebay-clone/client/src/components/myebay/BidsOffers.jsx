import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClockIcon, TagIcon, CheckIcon, XIcon } from '@heroicons/react/outline';

const BidsOffers = () => {
  const [activeTab, setActiveTab] = useState('active');

  const bids = [
    {
      id: 1,
      title: 'Vintage Rolex Watch',
      image: 'https://via.placeholder.com/100',
      currentBid: 2500,
      yourBid: 2550,
      bidsCount: 8,
      endTime: '2h 15m',
      status: 'winning',
      seller: 'luxurywatches'
    },
    {
      id: 2,
      title: 'Antique Victorian Chair',
      image: 'https://via.placeholder.com/100',
      currentBid: 450,
      yourBid: 475,
      bidsCount: 12,
      endTime: '1d 4h',
      status: 'outbid',
      seller: 'antiquevintage'
    },
    {
      id: 3,
      title: 'Canon EOS 5D Mark IV',
      image: 'https://via.placeholder.com/100',
      currentBid: 1850,
      yourBid: 1900,
      bidsCount: 6,
      endTime: '3d 8h',
      status: 'winning',
      seller: 'camerastore'
    }
  ];

  const offers = [
    {
      id: 4,
      title: 'Designer Handbag',
      image: 'https://via.placeholder.com/100',
      price: 1200,
      yourOffer: 950,
      sellerOffer: 1100,
      status: 'countered',
      seller: 'fashionista'
    },
    {
      id: 5,
      title: 'Gaming Laptop',
      image: 'https://via.placeholder.com/100',
      price: 1500,
      yourOffer: 1300,
      status: 'pending',
      seller: 'techdeals'
    }
  ];

  const history = [
    {
      id: 6,
      title: 'Smartphone',
      image: 'https://via.placeholder.com/100',
      finalPrice: 850,
      status: 'won',
      date: '2 weeks ago',
      seller: 'gadgetstore'
    },
    {
      id: 7,
      title: 'Vintage Camera',
      image: 'https://via.placeholder.com/100',
      finalPrice: 320,
      status: 'lost',
      date: '3 weeks ago',
      seller: 'retrophoto'
    },
    {
      id: 8,
      title: 'Leather Jacket',
      image: 'https://via.placeholder.com/100',
      finalPrice: 180,
      status: 'won',
      date: '1 month ago',
      seller: 'vintageclothing'
    }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      winning: 'bg-green-100 text-green-800',
      outbid: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      countered: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      declined: 'bg-gray-100 text-gray-800',
      won: 'bg-green-100 text-green-800',
      lost: 'bg-gray-100 text-gray-800'
    };
    
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      winning: 'Winning',
      outbid: 'Outbid',
      pending: 'Pending',
      countered: 'Countered',
      accepted: 'Accepted',
      declined: 'Declined',
      won: 'Won',
      lost: 'Lost'
    };
    return texts[status] || status;
  };

  const renderBids = () => (
    <div className="space-y-4">
      {bids.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-start space-x-4">
            {/* Image */}
            <Link to={`/product/${item.id}`} className="flex-shrink-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 object-cover rounded"
              />
            </Link>

            {/* Details */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <Link to={`/product/${item.id}`} className="hover:text-blue-600">
                    <h3 className="font-medium">{item.title}</h3>
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">Seller: {item.seller}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(item.status)}`}>
                  {getStatusText(item.status)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-500">Current Bid</p>
                  <p className="font-bold">${item.currentBid}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Your Bid</p>
                  <p className="font-medium">${item.yourBid}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Bids</p>
                  <p className="font-medium">{item.bidsCount}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>Ends in {item.endTime}</span>
                </div>
                <div className="flex space-x-3">
                  <Link
                    to={`/product/${item.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Item
                  </Link>
                  <button className="text-sm bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                    Place Bid
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderOffers = () => (
    <div className="space-y-4">
      {offers.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-start space-x-4">
            {/* Image */}
            <Link to={`/product/${item.id}`} className="flex-shrink-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 object-cover rounded"
              />
            </Link>

            {/* Details */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <Link to={`/product/${item.id}`} className="hover:text-blue-600">
                    <h3 className="font-medium">{item.title}</h3>
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">Seller: {item.seller}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(item.status)}`}>
                  {getStatusText(item.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-500">Listed Price</p>
                  <p className="font-bold">${item.price}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Your Offer</p>
                  <p className="font-medium">${item.yourOffer}</p>
                </div>
                {item.sellerOffer && (
                  <div>
                    <p className="text-xs text-gray-500">Seller Counter</p>
                    <p className="font-medium">${item.sellerOffer}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <TagIcon className="h-4 w-4 mr-1" />
                  <span>Best Offer Available</span>
                </div>
                <div className="flex space-x-3">
                  {item.status === 'countered' && (
                    <>
                      <button className="text-sm bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 flex items-center">
                        <CheckIcon className="h-4 w-4 mr-1" />
                        Accept
                      </button>
                      <button className="text-sm border border-gray-300 px-4 py-1 rounded hover:bg-gray-50 flex items-center">
                        <XIcon className="h-4 w-4 mr-1" />
                        Decline
                      </button>
                    </>
                  )}
                  {item.status === 'pending' && (
                    <button className="text-sm border border-gray-300 px-4 py-1 rounded hover:bg-gray-50">
                      Cancel Offer
                    </button>
                  )}
                  <Link
                    to={`/product/${item.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Item
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-4">
      {history.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-start space-x-4">
            {/* Image */}
            <Link to={`/product/${item.id}`} className="flex-shrink-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 object-cover rounded"
              />
            </Link>

            {/* Details */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <Link to={`/product/${item.id}`} className="hover:text-blue-600">
                    <h3 className="font-medium">{item.title}</h3>
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">Seller: {item.seller}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(item.status)}`}>
                  {getStatusText(item.status)}
                </span>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-xs text-gray-500">Final Price</p>
                  <p className="font-bold">${item.finalPrice}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm text-gray-600">{item.date}</p>
                </div>
                <div className="flex space-x-3">
                  {item.status === 'won' && (
                    <button className="text-sm bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                      Leave Feedback
                    </button>
                  )}
                  <Link
                    to={`/product/${item.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Item
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEmpty = () => (
    <div className="bg-white rounded-lg shadow p-8 text-center">
      <p className="text-gray-500">No items found</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Bids & Offers</h1>

      {/* Tabs */}
      <div className="border-b mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-4 px-1 ${
              activeTab === 'active'
                ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab('bids')}
            className={`pb-4 px-1 ${
              activeTab === 'bids'
                ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Bids
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`pb-4 px-1 ${
              activeTab === 'offers'
                ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Offers
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-4 px-1 ${
              activeTab === 'history'
                ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'bids' && renderBids()}
      {activeTab === 'offers' && renderOffers()}
      {activeTab === 'history' && renderHistory()}
      {activeTab === 'active' && (
        <div className="space-y-8">
          {bids.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-4">Active Bids</h2>
              {renderBids()}
            </div>
          )}
          {offers.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-4">Active Offers</h2>
              {renderOffers()}
            </div>
          )}
          {bids.length === 0 && offers.length === 0 && renderEmpty()}
        </div>
      )}
    </div>
  );
};

export default BidsOffers;