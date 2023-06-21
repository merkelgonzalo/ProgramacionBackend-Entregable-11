import { cartModel } from '../models/carts.model.js';
import { productModel } from '../models/products.model.js';
import ManagerAccess from '../managers/ManagerAccess.js';

const managerAccess = new ManagerAccess();

export default class ProductManager{

    constructor(){}

    addCart = async (req) => {
        try{
            await managerAccess.saveLog('POST a cart');
            let result = await cartModel.create({});
            return result;
        }catch(error){
            console.log('Cannot post the cart in manager with mongoose: '+error)
        }
    }

    addProduct = async (req) => {
        try{
            await managerAccess.saveLog('POST product in a cart');
            const idCart = req.params.cid;
            const idProduct = req.params.pid;
            const quantityBody = req.body.quantity

            const cart = await cartModel.find({_id:idCart});
            if(cart.length === 0){
                throw new Error("ID CART NOT FOUND");
            }
            cart[0].products.push({product:idProduct, quantity:quantityBody});
            
            let result = await cartModel.updateOne({_id:idCart}, {$set:cart[0]});

            return result;
        }catch(error){
            console.log('Cannot post the product in cart in manager with mongoose: '+error)
        }
    }

    getCarts = async(req) => {   
        try{
            await managerAccess.saveLog('GET all carts');
            let limit = req.query.limit;
            let carts = await cartModel.find();
            if(limit != undefined){
                carts = carts.slice(0,limit);
            }
            return carts;
        }catch(error){
            console.log('Cannot get carts with mongoose in manager: '+error)
        }
    }

    getCartById = async(req) => {
        try{
            await managerAccess.saveLog('GET a cart');
            const idCart = req.params.cid;
            const result = await cartModel.find({_id:idCart});
            if(result.length === 0){
                throw "CART ID NOT FOUND";
            }
            return result;
        }catch(error){
            console.log('Cannot get the cart in manager with mongoose: '+error);
        }
    }

    deleteCart = async (cid) => {
        try{
            await managerAccess.saveLog('DELETE all products in a cart');

            const cart = await cartModel.find({_id:cid});

            if(cart.length === 0){
                throw "ID NOT FOUND";
            }

            cart[0].products = [];
            const result = await cartModel.updateOne({_id:cid}, {$set:cart[0]});
            return result;
        }catch(error){
            console.log('Cannot delete all products in the cart in manager with mongoose: '+error);
        }
    }

    deleteProductById = async (req) => {
        try{
            await managerAccess.saveLog('DELETE a product in a cart');
            const idCart = req.params.cid;
            const idProduct = req.params.pid;
    
            const cart = await cartModel.find({_id:idCart});
            const product = await productModel.find({_id:idProduct});

            if(cart.length === 0 || product.length === 0){
                throw new Error("ID NOT FOUND");
            }
    
            const products = cart[0].products.filter(element => element.product._id != idProduct);
            cart[0].products = products;
            
            const result = await cartModel.updateOne({_id:idCart}, {$set:cart[0]});
            return result;
        }catch(error){
            console.log('Cannot delete the product in a cart in manager with mongoose: '+error);
        }
    }

    updateCart = async (cid, products) => {
        try{
            await managerAccess.saveLog('UPDATE all products in a cart');
            const cart = await cartModel.findById(cid);
            if(!cart){
                throw new Error("ID NOT FOUND");
            }
            cart.products = products;
            const result = await cartModel.updateOne({_id:cid}, {$set:cart});
            return result;
        }catch(error){
            console.log('Cannot update the cart in manager with mongoose: '+error);
        } 
    }

    updateProduct = async (cid, pid, quantity) => {
        try{
            await managerAccess.saveLog('UPDATE product s quantity in a cart');
            const cart = await cartModel.find({_id:cid});
            const product = await productModel.find({_id:pid});
            
            if(cart.length === 0 || product.length === 0){
                throw new Error("ID NOT FOUND");
            }
    
            cart[0].products.forEach(function(element){
                if(element.product._id == pid){
                    element.quantity = quantity;
                }
            });
            
            const result = await cartModel.updateOne({_id:cid}, {$set:cart[0]});
    
            return result;
        }catch(error){
            console.log('Cannot update the product s quantity in manager with mongoose: '+error);
        }
    }

}
