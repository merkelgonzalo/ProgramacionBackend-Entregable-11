import { Router } from 'express';
import { getProductsController, getProductController, createProductController, updateProductController, deleteProductController } from "../controllers/products.controller.js";

const router = Router();

router.get('/', getProductsController);

router.get('/:pid', getProductController);

router.post('/', createProductController);

router.put('/:pid', updateProductController);

router.delete('/:pid', deleteProductController);

export default router;