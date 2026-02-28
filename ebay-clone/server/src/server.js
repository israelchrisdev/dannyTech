const app = require('./app');
const { PrismaClient } = require('@prisma/client');
const redisClient = require('./config/redis');
const { connectElasticsearch } = require('./config/elasticsearch');

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('Database connected successfully');

    // Connect to Redis
    await redisClient.connect();
    console.log('Redis connected successfully');

    // Connect to Elasticsearch
    await connectElasticsearch();
    console.log('Elasticsearch connected successfully');

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        prisma.$disconnect();
        redisClient.quit();
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();