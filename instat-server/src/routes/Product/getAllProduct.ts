import express from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const product = await prisma.product.findMany();
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})
export default router