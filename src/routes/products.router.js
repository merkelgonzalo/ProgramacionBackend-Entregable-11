import { Router } from 'express';
import ManagerAccess from '../Dao/managers/ManagerAccess.js';
import { productModel } from '../Dao/models/products.model.js';
import ProductManager from '../Dao/managers/ProductManager.js';

const router = Router();
const managerAccess = new ManagerAccess();
const productManager = new ProductManager();

router.get('/', async (req,res) => {
    try{
        await managerAccess.saveLog('GET all products');
        const products = await productManager.getProducts(req);
        res.send({
            status: "success",
            payload: products
        });
    }catch(error){
        console.log('Cannot get products with mongoose: '+error)
    }
});

router.get('/:pid', async (req,res)=>{
    try{
        await managerAccess.saveLog('GET a product');
        const result = await productManager.getProductById(req.params.pid);
        if(result === null) throw "ID not found";        
        res.send({
            status: 'success',
            payload: result
        });
    }catch(error){
        console.log('Cannot get the product with mongoose: '+error);
        return res.send({status:"error", error: "ID not found"});
    }
});

router.post('/', async (req,res) => {
    try{
        await managerAccess.saveLog('POST a product');
        let productBody = req.body;
        
        if(!productBody.title || !productBody.price || !productBody.code || !productBody.category){
            return res.send({status:"error", error: "Incomplete values"});
        }else{
            let result = await productManager.addProduct(productBody);
            res.send({
                status: 'success',
                payload: result
            });
        }
    }catch(error){
        console.log('Cannot post the product with mongoose: '+error)
    }
});

router.put('/:pid', async (req,res) => {
    try{
        await managerAccess.saveLog('UPDATE a product');
        const product = req.body;
        const idProduct = req.params.pid;
        
        if(!product.title || !product.price || !product.code || !product.category){
            return res.send({status:"error", error: "Incomplete values"});
        }else{
            let result = await productManager.updateProduct(idProduct, product);
            if(result.matchedCount === 0) throw "ID not found";
            res.send({status: 'success', payload: result})
        }
    }catch(error){
        console.log('Cannot update the product with mongoose: '+error);
        return res.send({status:"error", error: "ID not found"});
    }
});

router.delete('/:pid', async (req,res) => {
    try{
        await managerAccess.saveLog('DELETE a product');
        let result = await productManager.deleteProductById(req.params.pid);
        if(result === null) throw "ID not found";
        res.send({status: 'success', payload: result})
    }catch(error){
        console.log('Cannot delete the product with mongoose: '+error);
        return res.send({status:"error", error: "ID not found"});
    }
});

export default router;