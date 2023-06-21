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

// export const createProductController = async (req, res) => {
//     try {
//         const body = req.body;
//         body.status = Boolean(body.status);
//         body.price = Number(body.price);
//         body.stock = Number(body.stock);
//         // console.log("body: ", body);
//         const productAdded = await productManager.addProduct(body);
//         res.json({ status: "success", result: productAdded, message: "product added" });
//     } catch (error) {
//         res.status(400).json({ status: "error", message: error.message });
//     }
// }

// export const updateProductController = async (req, res) => {
//     try {
//         const productId = req.params.pid;
//         const body = req.body;
//         body.status = Boolean(body.status);
//         body.price = Number(body.price);
//         body.stock = Number(body.stock);
//         // console.log("body: ", body);
//         //actualizamos el método, pasándole el id y el body
//         const productUpdated = await productManager.updateProduct(productId, body);
//         res.json({ status: "success", result: productUpdated, message: "product updated" });
//     } catch (error) {
//         res.status(400).json({ message: error });
//     }
// }

// export const deleteProductController = async (req, res) => {
//     try {
//         const productId = req.params.pid;
//         //luego eliminamos el producto
//         const productdeleted = await productManager.deleteProduct(productId);
//         res.json({ status: "success", result: productdeleted.message });
//     } catch (error) {
//         res.status(400).json({ message: error });
//     }
// }