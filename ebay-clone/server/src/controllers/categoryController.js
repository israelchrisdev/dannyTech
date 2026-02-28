const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const prisma = new PrismaClient();

exports.getCategories = catchAsync(async (req, res) => {
  const categories = await prisma.category.findMany({
    where: {
      parentId: null
    },
    include: {
      children: {
        include: {
          children: true
        }
      },
      _count: {
        select: {
          products: true
        }
      }
    }
  });

  res.status(200).json({
    status: 'success',
    data: { categories }
  });
});

exports.getCategoryBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      parent: true,
      children: {
        include: {
          _count: {
            select: {
              products: true
            }
          }
        }
      },
      products: {
        where: { status: 'ACTIVE' },
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
          images: {
            take: 1
          },
          seller: {
            select: {
              id: true,
              username: true
            }
          }
        }
      }
    }
  });

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: { category }
  });
});

exports.createCategory = catchAsync(async (req, res) => {
  const { name, description, parentId } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const existingCategory = await prisma.category.findUnique({
    where: { slug }
  });

  if (existingCategory) {
    throw new AppError('Category with this name already exists', 400);
  }

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      description,
      parentId
    },
    include: {
      parent: true
    }
  });

  res.status(201).json({
    status: 'success',
    data: { category }
  });
});

exports.updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const category = await prisma.category.findUnique({
    where: { id }
  });

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: {
      name,
      description
    }
  });

  res.status(200).json({
    status: 'success',
    data: { category: updatedCategory }
  });
});

exports.deleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      products: true,
      children: true
    }
  });

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  if (category.products.length > 0 || category.children.length > 0) {
    throw new AppError('Cannot delete category with products or subcategories', 400);
  }

  await prisma.category.delete({
    where: { id }
  });

  res.status(204).json({
    status: 'success',
    data: null
  });
});