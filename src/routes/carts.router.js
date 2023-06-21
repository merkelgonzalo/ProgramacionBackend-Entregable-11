import { Router } from 'express';
import { cartModel } from '../Dao/models/carts.model.js';
import { productModel } from '../Dao/models/products.model.js';
import CartManager from '../Dao/managers/CartManager.js';

const router = Router();
const cartManager = new CartManager();

router.get('/', async (req,res) => {
    try{
        let result = await cartManager.getCarts(req);
        res.send({result: "success", payload: result});
    }catch(error){
        console.log('Cannot get carts with mongoose: '+error)
    }
});

router.get('/:cid', async (req,res)=>{
    try{
        let result = await cartManager.getCartById(req);
        res.send({
            status: 'success',
            payload: result
        });
    }catch(error){
        console.log('Cannot get the cart with mongoose: '+error);
        return res.send({status:"error", error: "ID not found"});
    }
});

router.post('/', async (req,res) => {
    try{
        let result = await cartManager.addCart(req);
        res.send({
            status: 'success',
            payload: result
        }); 
    }catch(error){
        console.log('Cannot post the cart with mongoose: '+error)
    }
});

router.post('/:cid/product/:pid', async (req,res) => {
    try{
        const result = await cartManager.addProduct(req);
        if(result == undefined) throw new Error("ID NOT FOUND");
        res.send({
            status: 'success',
            payload: result
        });
    }catch(error){
        console.log('Cannot post the product with mongoose: '+error);
        return res.send({status:"error", error: "ID not found"});
    }
});

router.delete('/:cid/products/:pid', async (req,res) => {
    try{
        const result = await cartManager.deleteProductById(req);
        if(result == undefined) throw new Error("ID NOT FOUND");
        res.send({
            status: 'success',
            payload: result
        });
    }catch(error){
        console.log('Cannot delete the product with mongoose: '+error);
        return res.send({status:"error", error: "ID not found"});
    }
});

router.delete('/:cid', async (req,res) => {
    try{
        const result = await cartManager.deleteCart(req.params.cid);
        if(result == undefined) throw new Error("ID NOT FOUND");
        res.send({
            status: 'success',
            payload: result
        });
    }catch(error){
        console.log('Cannot delete all products in the cart with mongoose: '+error);
        return res.status(400).send({error: error});
    } 
});

router.put('/:cid', async (req,res) => {
    try{
        const result = await cartManager.updateCart(req.params.cid, req.body.products);
        if(result == undefined) throw new Error("ID NOT FOUND");
        res.send({
            status: 'success',
            payload: result
        });

    }catch(error){
        console.log('Cannot update the cart with mongoose: '+error);
        return res.status(400).send({error: "ID NOT FOUND"});
    } 


});

router.put('/:cid/products/:pid', async (req,res) => {
    try{
        const result = await cartManager.updateProduct(req.params.cid, req.params.pid, req.body.quantity);
        if(result == undefined) throw new Error("ID NOT FOUND");
        res.send({
            status: 'success',
            payload: result
        });
    }catch(error){
        console.log('Cannot update the product s quantity with mongoose: '+error);
        return res.status(400).send({error: "ID NOT FOUND"});
    }



});

export default router;