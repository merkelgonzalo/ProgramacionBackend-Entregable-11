import { productModel } from '../models/products.model.js';

export default class ProductManager{

    constructor(){}

    addProduct = async (productBody) => {
        try{
            let {title, description, price, thumnail, code, stock, category} = productBody;
            let result = await productModel.create({
                title,
                description,
                price,
                thumnail,
                code,
                stock,
                category,
                status: true
            });
            
            return result;

        }catch(error){
            console.log('Cannot post the product in manager with mongoose: '+error)
        }
    }

    getProducts = async(req) => {   
        try{
            let limit = req.query.limit;
            if(limit == undefined){
                limit = 10;
            }
            let products = await productModel.find();
            products = products.slice(0,limit);
            return products;
        }catch(error){
            console.log('Cannot get products in manager with mongoose: '+error)
        }
    }

    getProductById = async(aId) => {
        try{
            const result = await productModel.findOne({_id:aId});
            return result;
        }catch(error){
            console.log('Cannot get product by id in manager with mongoose: '+error)
        }
    }

    updateProduct = async (idProduct, product) => {

        try{
            let result = await productModel.updateOne({_id:idProduct}, {$set:product});
            return result;
        }catch(error){
            console.log('Cannot update product by id in manager with mongoose: '+error)
        }
        
    }

    deleteProductById = async (aId) => {
        try{
            let result = await productModel.findByIdAndDelete(aId);
            return result;
        }catch(error){
            console.log('Cannot delete the product in manager with mongoose: '+error);
        }
    }

}
