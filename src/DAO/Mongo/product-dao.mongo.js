import { logger } from "../../middlewares/logger.middleware.js";
import { Products } from "../../models/products.model.js";

import { io } from "../../../app.js";
class ProductDAO {
  async getProducts(limit, qpage, sort, category) {
    try {
      limit = limit ? limit : 6;
      sort = sort ? sort : "asc";
      qpage = qpage ? qpage : 1;
      category = category ? category : "";

      const options = {
        sort: { price: sort },
        limit: limit,
        page: qpage,
        lean: true,
      };
      const query = category ? { status: true, category } : { status: true };

      const {
        docs,
        totalPages,
        page,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
      } = await Products.paginate(query, options);
      let parameters = { limit: limit, sort: sort };
      let products = docs;
      let productObj = {
        totalPages,
        page,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        ...parameters,
      };
      products.push(productObj);

      return products;
    } catch (error) {
      logger.error("Error al obtener los productos desde MongoDB");

      throw error;
    }
  }

  async getProductById(id) {
    try {
      const product = await Products.findOne({ _id: id });

      return product;
    } catch (error) {
      logger.error("Error al obtener el producto desde MongoDB: ", error);
    }
  }

  async getProductsByOwner(email, owner) {
    try {
      if (owner.role === "admin") {
        const products = await Products.find({
          status: true,
        }).lean();

        return products;
      }
      if (owner.role === "premium") {
        const products = await Products.find({
          owner: email,
          status: true,
        }).lean();
        return products;
      }

      return products;
    } catch (error) {
      logger.error(
        "Error al obtener los productos del usuario desde MongoDB: ",
        error
      );
    }
  }

  async addProduct(productInfo) {
    try {
      logger.info("Agregando producto a MongoDB: ", productInfo);
      return await Products.create(productInfo);
    } catch (error) {
      logger.error("Error al agregar el producto a MongoDB: ", error);
    }
  }

  async updateProduct(id, productInfo) {
    return await Products.updateOne({ _id: id }, productInfo);
  }

  async deleteProduct(id) {
    const productList = await Products.updateOne(
      { _id: id },
      { $set: { status: false } }
    );
    const productId = id.toString();

    io.emit("updateProductByOwner", productId);
    return productList;
  }
}
export { ProductDAO };
