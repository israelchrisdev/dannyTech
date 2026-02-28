// Note: This model is defined in Prisma schema
// This file is for reference/documentation purposes

/**
 * Bid Model Reference
 * 
 * @typedef {Object} Bid
 * @property {string} id - Unique identifier
 * @property {number} amount - Bid amount
 * @property {string} userId - ID of user who placed the bid
 * @property {string} productId - ID of product being bid on
 * @property {Date} createdAt - When the bid was placed
 * @property {Date} updatedAt - When the bid was last updated
 * 
 * Relations:
 * @property {User} user - The user who placed the bid
 * @property {Product} product - The product being bid on
 * 
 * Prisma Schema:
 * model Bid {
 *   id        String   @id @default(cuid())
 *   amount    Float
 *   userId    String
 *   user      User     @relation(fields: [userId], references: [id])
 *   productId String
 *   product   Product  @relation(fields: [productId], references: [id])
 *   createdAt DateTime @default(now())
 *   updatedAt DateTime @updatedAt
 * 
 *   @@unique([userId, productId, amount])
 *   @@index([productId])
 *   @@index([userId])
 * }
 */

// This is a reference file only - the actual model is defined in schema.prisma
module.exports = {};
