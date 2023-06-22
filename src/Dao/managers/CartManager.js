import { cartModel } from '../models/carts.model.js';
import { productModel } from '../models/products.model.js';
import ManagerAccess from '../managers/ManagerAccess.js';

const managerAccess = new ManagerAccess();

export default class ProductManager {

    constructor() { }

    addCart = async () => {
        try {
            await managerAccess.saveLog('POST a cart');
            let result = await cartModel.create({});
            return result;
        } catch (error) {
            console.log('Cannot post the cart in manager with mongoose: ' + error)
        }
    }

    addProduct = async (idCart, idProduct, quantityBody) => {
        try {
            await managerAccess.saveLog('POST product in a cart');
            let result;
            const cart = await cartModel.find({ _id: idCart });
            const product = await productModel.find({ _id: idProduct });
            if (cart.length === 0 || product.length === 0) {
                result = 0;
            } else {
                cart[0].products.push({ product: idProduct, quantity: quantityBody });
                result = await cartModel.updateOne({ _id: idCart }, { $set: cart[0] });
            }
            return result;
        } catch (error) {
            console.log('Cannot add the product in cart in manager with mongoose: ' + error)
        }
    }

    getCarts = async (req) => {
        try {
            await managerAccess.saveLog('GET all carts');
            let carts = await cartModel.find();
            return carts;
        } catch (error) {
            console.log('Cannot get carts with mongoose in manager: ' + error)
        }
    }

    getCartById = async (cid) => {
        try {
            await managerAccess.saveLog('GET a cart');
            const result = await cartModel.find({ _id: cid });
            return result;
        } catch (error) {
            console.log('Cannot get the cart in manager with mongoose: ' + error);
        }
    }

    getCartByIdPopulate = async (cid) => {
        try {
            await managerAccess.saveLog('GET a cart');
            const result = await cartModel.findById(cid).populate("products.product").lean();
            return result;
        } catch (error) {
            console.log('Cannot get the cart in manager with mongoose: ' + error);
        }
    }

    deleteCart = async (cid) => {
        try {
            await managerAccess.saveLog('DELETE all products in a cart');
            const cart = await cartModel.find({ _id: cid });
            let result;
            if (cart.length === 0) {
                result = 0;
            }else{
                cart[0].products = [];
                result = await cartModel.updateOne({ _id: cid }, { $set: cart[0] });
            }
            return result;
        } catch (error) {
            console.log('Cannot delete all products in the cart in manager with mongoose: ' + error);
        }
    }

    deleteProductById = async (idCart, idProduct) => {
        try {
            await managerAccess.saveLog('DELETE a product in a cart');

            const cart = await cartModel.find({ _id: idCart });
            const product = await productModel.find({ _id: idProduct });
            let result;

            if (cart.length === 0 || product.length === 0) {
                result = 0;
            } else {
                const products = cart[0].products.filter(element => element.product._id != idProduct);
                cart[0].products = products;
                result = await cartModel.updateOne({ _id: idCart }, { $set: cart[0] });
            }
            return result;
        } catch (error) {
            console.log('Cannot delete the product in a cart in manager with mongoose: ' + error);
        }
    }

    updateCart = async (cid, products) => {
        try {
            await managerAccess.saveLog('UPDATE all products in a cart');
            const cart = await cartModel.findById(cid);
            console.log(cart)
            let result;
            if (!cart) {
                result = 0;
            }else{
                cart.products = products;
                result = await cartModel.updateOne({ _id: cid }, { $set: cart });
            }
            return result;
        } catch (error) {
            console.log('Cannot update the cart in manager with mongoose: ' + error);
        }
    }

    updateProduct = async (cid, pid, quantity) => {
        try {
            await managerAccess.saveLog('UPDATE product s quantity in a cart');
            const cart = await cartModel.find({ _id: cid });
            const product = await productModel.find({ _id: pid });
            let result;
            if (cart.length === 0 || product.length === 0) {
                result = 0;
            } else {
                cart[0].products.forEach(function (element) {
                    if (element.product._id == pid) {
                        element.quantity = quantity;
                    }
                });
                result = await cartModel.updateOne({ _id: cid }, { $set: cart[0] });
            }
            return result;
        } catch (error) {
            console.log('Cannot update the product s quantity in manager with mongoose: ' + error);
        }
    }

}
