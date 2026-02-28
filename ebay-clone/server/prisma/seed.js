const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ebayclone.com' },
    update: {},
    create: {
      email: 'admin@ebayclone.com',
      password: adminPassword,
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isVerified: true
    }
  });

  // Create demo seller
  const sellerPassword = await bcrypt.hash('seller123', 12);
  const seller = await prisma.user.upsert({
    where: { email: 'seller@ebayclone.com' },
    update: {},
    create: {
      email: 'seller@ebayclone.com',
      password: sellerPassword,
      username: 'demoseller',
      firstName: 'Demo',
      lastName: 'Seller',
      role: 'SELLER',
      isVerified: true,
      store: {
        create: {
          name: 'Demo Store',
          description: 'Your one-stop shop for amazing products'
        }
      }
    }
  });

  // Create demo buyer
  const buyerPassword = await bcrypt.hash('buyer123', 12);
  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@ebayclone.com' },
    update: {},
    create: {
      email: 'buyer@ebayclone.com',
      password: buyerPassword,
      username: 'demobuyer',
      firstName: 'Demo',
      lastName: 'Buyer',
      role: 'USER',
      isVerified: true
    }
  });

  // Create categories
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Latest gadgets and electronic devices'
    }
  });

  const fashion = await prisma.category.upsert({
    where: { slug: 'fashion' },
    update: {},
    create: {
      name: 'Fashion',
      slug: 'fashion',
      description: 'Trendy clothing and accessories'
    }
  });

  const home = await prisma.category.upsert({
    where: { slug: 'home-garden' },
    update: {},
    create: {
      name: 'Home & Garden',
      slug: 'home-garden',
      description: 'Furniture, decor, and gardening supplies'
    }
  });

  // Create subcategories
  await prisma.category.upsert({
    where: { slug: 'smartphones' },
    update: {},
    create: {
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'Latest smartphones and accessories',
      parentId: electronics.id
    }
  });

  await prisma.category.upsert({
    where: { slug: 'laptops' },
    update: {},
    create: {
      name: 'Laptops',
      slug: 'laptops',
      description: 'Laptops and notebooks',
      parentId: electronics.id
    }
  });

  await prisma.category.upsert({
    where: { slug: 'mens-clothing' },
    update: {},
    create: {
      name: "Men's Clothing",
      slug: 'mens-clothing',
      description: "Men's fashion and accessories",
      parentId: fashion.id
    }
  });

  await prisma.category.upsert({
    where: { slug: 'womens-clothing' },
    update: {},
    create: {
      name: "Women's Clothing",
      slug: 'womens-clothing',
      description: "Women's fashion and accessories",
      parentId: fashion.id
    }
  });

  // Create sample products
  const product1 = await prisma.product.upsert({
    where: { id: 'product1' },
    update: {},
    create: {
      id: 'product1',
      title: 'iPhone 13 Pro Max - 256GB',
      description: 'Like new iPhone 13 Pro Max in excellent condition. Includes original box and accessories.',
      price: 899.99,
      condition: 'LIKE_NEW',
      quantity: 5,
      sellerId: seller.id,
      categoryId: electronics.id,
      status: 'ACTIVE',
      type: 'FIXED_PRICE'
    }
  });

  const product2 = await prisma.product.upsert({
    where: { id: 'product2' },
    update: {},
    create: {
      id: 'product2',
      title: 'MacBook Pro 14" M1 Pro',
      description: 'Brand new MacBook Pro with M1 Pro chip, 16GB RAM, 512GB SSD',
      price: 1899.99,
      condition: 'NEW',
      quantity: 3,
      sellerId: seller.id,
      categoryId: electronics.id,
      status: 'ACTIVE',
      type: 'FIXED_PRICE'
    }
  });

  // Add product images
  await prisma.image.createMany({
    data: [
      {
        url: 'https://via.placeholder.com/300x300?text=iPhone+13+Pro',
        productId: product1.id,
        isPrimary: true
      },
      {
        url: 'https://via.placeholder.com/300x300?text=MacBook+Pro',
        productId: product2.id,
        isPrimary: true
      }
    ]
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });