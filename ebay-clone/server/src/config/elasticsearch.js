const { Client } = require('@elastic/elasticsearch');

const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
});

const connectElasticsearch = async () => {
  try {
    await esClient.ping();
    console.log('Elasticsearch connected');
    
    // Create index if it doesn't exist
    const indexExists = await esClient.indices.exists({ index: 'products' });
    
    if (!indexExists) {
      await esClient.indices.create({
        index: 'products',
        body: {
          mappings: {
            properties: {
              id: { type: 'keyword' },
              title: { type: 'text', analyzer: 'standard' },
              description: { type: 'text', analyzer: 'standard' },
              price: { type: 'float' },
              condition: { type: 'keyword' },
              categoryId: { type: 'keyword' },
              sellerId: { type: 'keyword' },
              createdAt: { type: 'date' }
            }
          }
        }
      });
      console.log('Products index created');
    }
  } catch (error) {
    console.error('Elasticsearch connection error:', error);
  }
};

module.exports = { esClient, connectElasticsearch };