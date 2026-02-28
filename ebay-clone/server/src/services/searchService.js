const { esClient } = require('../config/elasticsearch');

const indexProduct = async (product) => {
  try {
    await esClient.index({
      index: 'products',
      id: product.id,
      body: {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        condition: product.condition,
        categoryId: product.categoryId,
        sellerId: product.sellerId,
        createdAt: product.createdAt
      }
    });
  } catch (error) {
    console.error('Error indexing product:', error);
  }
};

const searchProducts = async (query, filters = {}) => {
  try {
    const { category, minPrice, maxPrice, condition, type, page = 1, limit = 20, sort } = filters;
    
    const must = [];
    const filter = [];

    // Full-text search
    if (query) {
      must.push({
        multi_match: {
          query,
          fields: ['title^3', 'description']
        }
      });
    }

    // Filters
    if (category) {
      filter.push({ term: { categoryId: category } });
    }

    if (minPrice || maxPrice) {
      const range = {};
      if (minPrice) range.gte = parseFloat(minPrice);
      if (maxPrice) range.lte = parseFloat(maxPrice);
      filter.push({ range: { price: range } });
    }

    if (condition) {
      filter.push({ term: { condition } });
    }

    if (type) {
      filter.push({ term: { type } });
    }

    // Sorting
    let sortField = '_score';
    let sortOrder = 'desc';

    if (sort) {
      const [field, order] = sort.split('_');
      sortField = field;
      sortOrder = order || 'desc';
    }

    const from = (page - 1) * limit;

    const response = await esClient.search({
      index: 'products',
      from,
      size: limit,
      body: {
        query: {
          bool: {
            must: must.length > 0 ? must : [{ match_all: {} }],
            filter
          }
        },
        sort: [
          { [sortField]: { order: sortOrder } }
        ],
        aggs: {
          categories: {
            terms: { field: 'categoryId' }
          },
          conditions: {
            terms: { field: 'condition' }
          },
          price_ranges: {
            range: {
              field: 'price',
              ranges: [
                { to: 50 },
                { from: 50, to: 100 },
                { from: 100, to: 500 },
                { from: 500, to: 1000 },
                { from: 1000 }
              ]
            }
          }
        }
      }
    });

    const total = response.hits.total.value;
    const products = response.hits.hits.map(hit => ({
      id: hit._id,
      ...hit._source,
      score: hit._score
    }));

    return {
      products,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      aggregations: response.aggregations
    };
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

const deleteProductIndex = async (productId) => {
  try {
    await esClient.delete({
      index: 'products',
      id: productId
    });
  } catch (error) {
    console.error('Error deleting product from index:', error);
  }
};

const bulkIndexProducts = async (products) => {
  const body = products.flatMap(product => [
    { index: { _index: 'products', _id: product.id } },
    {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      condition: product.condition,
      categoryId: product.categoryId,
      sellerId: product.sellerId,
      createdAt: product.createdAt
    }
  ]);

  try {
    const response = await esClient.bulk({ body });
    if (response.errors) {
      console.error('Bulk indexing errors:', response.items.filter(item => item.index.error));
    }
  } catch (error) {
    console.error('Error bulk indexing products:', error);
  }
};

module.exports = {
  indexProduct,
  searchProducts,
  deleteProductIndex,
  bulkIndexProducts
};