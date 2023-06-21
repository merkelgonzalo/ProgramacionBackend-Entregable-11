import { productModel } from '../models/products.model.js';
import ManagerAccess from '../managers/ManagerAccess.js';

const managerAccess = new ManagerAccess();

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

    getProducts = async(query, options) => {   
        try{
            const result = await productModel.paginate(query, options);
            return result;
        }catch(error){
            console.log('Cannot get products in manager with mongoose: '+error)
        }
    }

    getProductById = async(pid) => {
        try{
            await managerAccess.saveLog('GET a product');
            const result = await productModel.findOne({_id:pid});
            return result;
        }catch(error){
            console.log('Cannot get product by id in manager with mongoose: '+error)
        }
    }

    updateProduct = async (idProduct, product) => {
        try{
            await managerAccess.saveLog('UPDATE a product');
            let result = await productModel.updateOne({_id:idProduct}, {$set:product});
            return result;
        }catch(error){
            console.log('Cannot update product by id in manager with mongoose: '+error)
        }
        
    }

    deleteProductById = async (aId) => {
        try{
            await managerAccess.saveLog('DELETE a product');
            let result = await productModel.findByIdAndDelete(aId);
            return result;
        }catch(error){
            console.log('Cannot delete the product in manager with mongoose: '+error);
        }
    }

}
