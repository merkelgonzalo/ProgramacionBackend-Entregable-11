import ProductManager from "../Dao/managers/ProductManager.js";
//import { ProductModel } from "../Dao/models/products.model.js";
//VER !!!!!!!!!!!!!!
//import { checkValidProductFields } from "../middlewares/middlewares.js";

const productManager = new ProductManager();

export const getProductsController = async (req, res) => {
    try {

        const limit = parseInt(req.query.limit) || 10;
        const sort = parseInt(req.query.sort) || 0;
        const page = parseInt(req.query.page) || 1;
        const queryParam = req.query.query || null;

        const query = {};

        if (queryParam !== null) {
            query["$or"] = [
                { category: { $regex: queryParam, $options: "i" } },
                {
                    status: ["true", "false"].includes(queryParam.toLowerCase())
                        ? JSON.parse(queryParam.toLowerCase())
                        : undefined,
                },
            ];
        }

        const options = {
            limit,
            page,
            lean: true
        };

        if (sort !== 0) {
            options.sort = { price: sort };
        }

        const result = await productManager.getProducts(query, options);
        const products = result.docs;
        
        res.send({
            status: "success",
            payload: products
        });
    } catch (error) {
        console.log('Cannot get products with mongoose: '+error);
        res.status(500).json({ status: "error", message: error.message });
    }
}

export const getProductController = async (req, res) => {
    try {
        const result = await productManager.getProductById(req.params.pid);
        if(result === null) throw 'ID NOT FOUND';        
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        console.log('Cannot get the product with mongoose: '+error);
        res.status(400).json({ message: error });
    }
}

export const createProductController = async (req, res) => {
    try {
        let productBody = req.body;
        if(!productBody.title || !productBody.price || !productBody.code || !productBody.category){
            res.status(400).json({status:"error", error: "Incomplete values"});
        }else{
            let result = await productManager.addProduct(productBody);
            res.send({
                status: 'success',
                payload: result
            });
        }
    } catch (error) {
        console.log('Cannot post the product with mongoose: '+error);
        res.status(400).json({ status: "error", message: error.message });
    }
}

export const updateProductController = async (req, res) => {
    try {
        const product = req.body;
        const idProduct = req.params.pid;
        
        if(!product.title || !product.price || !product.code || !product.category){
            res.status(400).json({status:"error", error: "Incomplete values"});
        }else{
            let result = await productManager.updateProduct(idProduct, product);
            if(result.matchedCount === 0) res.status(400).json({status:"error", error: "ID NOT FOUND"});
            res.send({status: 'success', payload: result})
        }
    } catch (error) {
        console.log('Cannot update the product with mongoose: '+error);
        res.status(400).json({ status: "error", message: error.message });
    }
}

export const deleteProductController = async (req, res) => {
    try {
        let result = await productManager.deleteProductById(req.params.pid);
        if(result === null) res.status(400).json({status:"error", error: "ID NOT FOUND"});
        res.send({status: 'success', payload: result})
    } catch (error) {
        console.log('Cannot delete the product with mongoose: '+error);
        res.status(400).json({ status: "error", message: error.message });
    }
}