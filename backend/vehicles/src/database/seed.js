
const { PrismaClient } = require('@prisma/client');
const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function seedBrands() {
  const brandsFilePath = path.resolve(
    __dirname,
    '../../backup/brand.csv',
  );
  const parser = fs.createReadStream(brandsFilePath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
    }),
  );

  const brands = [];
  for await (const row of parser) {
    brands.push({
      id: row.id,
      displayName: row.displayName,
      description: row.description,
      thumbnailUrl: row.thumbnailUrl,
    });
  }

  await prisma.$transaction(async (tx) => {
    await tx.brand.createMany({
      data: brands,
      skipDuplicates: true,
    });
  });

  console.log('Brands seeding completed.');
}

async function seedCategories() {
  const categoriesFilePath = path.resolve(
    __dirname,
    '../../backup/category.csv',
  );
  const parser = fs.createReadStream(categoriesFilePath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
    }),
  );

  const categories = [];
  for await (const row of parser) {
    categories.push({
      id: row.id,
      displayName: row.displayName,
      description: row.description,
      thumbnailUrl: row.thumbnailUrl,
    });
  }

  await prisma.$transaction(async (tx) => {
    await tx.category.createMany({
      data: categories,
      skipDuplicates: true,
    });
  });

  console.log('Categories seeding completed.');
}

async function seedSpecificationTypes() {
  const specTypesFilePath = path.resolve(
    __dirname,
    '../../backup/specification-type.csv',
  );
  const parser = fs.createReadStream(specTypesFilePath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
    }),
  );

  const specTypes = [];
  for await (const row of parser) {
    specTypes.push({
      id: row.id,
      label: row.label,
      icon: row.icon,
      description: row.description,
    });
  }

  await prisma.$transaction(async (tx) => {
    await tx.specificationType.createMany({
      data: specTypes,
      skipDuplicates: true
    });
  });

  console.log('Specification types seeding completed.');
}

async function seedCars() {
  const carsFilePath = path.resolve(
    __dirname,
    '../../backup/car.csv',
  );
  const parser = fs.createReadStream(carsFilePath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
    }),
  );

  const cars = [];
  for await (const row of parser) {
    cars.push({
      id: row.id,
      regularPrice: parseFloat(row.regularPrice),
      salePrice: row.salePrice ? parseFloat(row.salePrice) : null,
      depositPrice: row.depositPrice ? parseFloat(row.depositPrice) : null,
      quantity: row.quantity ? parseInt(row.quantity) : null,
      isInStock: row.isInStock.toLowerCase() === 'true',
      description: row.description,
      thumbnailUrl: row.thumbnailUrl,
      brandId: row.brandId,
      displayName: row.displayName,
      sku: row.sku,
      slug: row.slug,
      status: row.status,
      seatingCapacity: row.seatingCapacity
        ? parseInt(row.seatingCapacity)
        : 4,
    });
  }

  await prisma.$transaction(async (tx) => {
    await tx.car.createMany({
      data: cars,
      skipDuplicates: true,
    });
  });

  console.log('Cars seeding completed.');
}

async function main() {
  try {
    await seedBrands();
    await seedCategories();
    await seedSpecificationTypes();
    await seedCars();
    console.log('All data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
