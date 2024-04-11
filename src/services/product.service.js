const ProductDAO = require("../DAO/Mongo/product-dao.mongo");
const CustomError = require("../handlers/errors/custom.error");
const {
  unauthorizedToDeleteProduct,
} = require("../handlers/errors/generate-error-info");
const PRODUCT_ERRORS = require("../handlers/errors/product-error-types");
const { logger } = require("../middlewares/logger.middleware");
const {
  generarCodigoProducto,
} = require("../utils/product-code-generator.util");
const totalQuantity = require("../utils/total-quantity.util");
const { getUserById } = require("./users.service");

const Products = new ProductDAO();

const getAllProducts = async (req) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const sort = req.query.sort || 1;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const category = req.query.category || "";
    const products = await Products.getProducts(limit, page, sort, category);
    const paginationInfo = products[products.length - 1];
    const Pages = paginationInfo.totalPages;
    // Acceder a las propiedades de paginación
    const totalPages = paginationInfo.totalPages;
    const pages = paginationInfo.page;
    const hasPrevPage = paginationInfo.hasPrevPage;
    const hasNextPage = paginationInfo.hasNextPage;
    const prevPage = paginationInfo.prevPage;
    const nextPage = paginationInfo.nextPage;
    const pLimit = paginationInfo.limit;
    let pSort = 0;
    if (sort == 1) {
      pSort = "asc";
    } else {
      pSort = "desc";
    }
    return {
      products,
      totalPages,
      pages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      pLimit,
      pSort,
    };
  } catch (error) {
    logger.fatal(error);
  }
};

const addProduct = async (productInfo, req) => {
  if (req.user) {
    const userId = req.user.id;
    const user = await getUserById(userId);
    const role = user.role;
    if (role === "admin") {
      productInfo.owner = "admin";
      productInfo.code = generarCodigoProducto(productInfo.title);
      productInfo.status = "true";
      return await Products.addProduct(productInfo.title);
    }
    if (role === "premium") {
      productInfo.owner = user.email;
      productInfo.code = generarCodigoProducto(productInfo.title);
      productInfo.status = "true";

      return await Products.addProduct(productInfo);
    }

    logger.error(
      `Los usuarios con el role ${role} no estan autorizados para agregar productos`
    );
  }
};

const getProductById = async (id) => {
  return await Products.getProductById(id);
};

const updateProduct = async (id, productInfo) => {
  return await Products.updateProduct(id, productInfo);
};
const getClientInfo = async (req) => {
  try {
    const tokenid = req.user.id;
    if (!tokenid) {
      return res.redirect("/login");
    }

    const userInfo = await getUserById(tokenid);
    const cartId = userInfo.cartId;
    const totalProducts = await totalQuantity(cartId);

    const { first_name, last_name, role, email } = userInfo;
    let adminValidation = "";
    if (role === "admin") {
      adminValidation = "admin";
    } else if (role === "premium") {
      adminValidation = "premium";
    } else {
      adminValidation = "user";
    }

    return {
      first_name,
      last_name,
      role,
      adminValidation,
      totalProducts,
      cartId,
      email,
    };
  } catch (error) {
    logger.error(error);
  }
};

const deleteProduct = async (id, req) => {
  const token = req.user.id;
  const user = await getUserById(token);
  const product = await getProductById(id);
  if (user.role === "admin") {
    return await Products.deleteProduct(id);
  }
  if (user.role === "premium" && product.owner === user.email) {
    return await Products.deleteProduct(id);
  }
  if (user.role === "premium" && product.owner != user.email) {
    return CustomError.createError({
      name: PRODUCT_ERRORS.ERROR_DELETING_PRODUCT_BY_ID,
      cause: unauthorizedToDeleteProduct(),
      message: "Error trying to delete product",
      code: EErrors.NOT_FOUND,
    });
  }
};

const getProductsByOwner = async (email) => {
  const products = await Products.getProductsByOwner(email);
  return products;
};

const deleteProductByOwner = async (id) => {
  return await Products.deleteProduct(id);
};
module.exports = {
  getAllProducts,
  getProductById,
  getClientInfo,
  updateProduct,
  deleteProduct,
  addProduct,
  getProductsByOwner,
  deleteProductByOwner,
};
