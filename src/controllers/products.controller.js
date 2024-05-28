import { Router } from "express";
const router = Router();

import passportCall from "../utils/passport-call.util.js";
import { io } from "../../app.js";
import {
  getAllProducts,
  getClientInfo,
  getProductById,
  deleteProduct,
  addProduct,
  getProductsByOwner,
} from "../services/product.service.js";
import { adminAuthMiddleware } from "../middlewares/admin-validation.middleware.js";
import {
  deleteProductErrorInfo,
  productIdNotFound,
  createProductErrorInfo,
} from "../handlers/errors/generate-error-info.js";
import { PRODUCT_ERRORS } from "../handlers/errors/product-error-types.js";
import { EErrors } from "../handlers/errors/enum.error.js";
import logger from "handlebars";

// Obtener todos los productos y renderizar la vista home.handlebars
router.get("/", passportCall("jwt"), async (req, res) => {
  try {
    const tokenid = req.user.id;
    if (!tokenid) {
      res.redirect("/login");
    }
    const {
      first_name,
      last_name,
      role,
      adminValidation,
      totalProducts,
      cartId,
    } = await getClientInfo(req); //obtiene los datos del cliente logueado
    const {
      products,
      totalPages,
      pages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      pLimit,
      pSort,
    } = await getAllProducts(req); //obtiene los productos y los datos de paginacion

    res.render("home.handlebars", {
      products,
      totalPages,
      pages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      pLimit,
      pSort,
      first_name,
      last_name,
      role,
      adminValidation,
      cartId,
      totalProducts,
      tokenid,
    });
  } catch (err) {
    logger.error(err);
  }
});

// Obtener un producto por su ID
router.get("/:pid", passportCall("jwt"), async (req, res) => {
  try {
    const pid = req.params.pid;

    const product = await getProductById(pid);

    if (product) {
      res.json({ product });
    } else {
      CustomError.createError({
        name: PRODUCT_ERRORS.PRODUCT_ID_NOT_FOUND,
        cause: productIdNotFound(pid),
        message: `The product with id ${pid} does not exist`,
        code: EErrors.NOT_FOUND,
      });
    }
  } catch (error) {
    res.json({ error });
    req.logger.error(`ID del producto no existe`);
  }
});

// Agregar un nuevo producto
router.post("/", passportCall("jwt"), adminAuthMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
      owner,
    } = req.body;

    if (
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !code ||
      !stock ||
      !status ||
      !category
    ) {
      CustomError.createError({
        name: PRODUCT_ERRORS.ERROR_CREATING_PRODUCT,
        cause: createProductErrorInfo(
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          status,
          category,
          owner
        ),
        message: `One or more properties were incomplete or note valid.`,
        code: EErrors.BAD_REQUEST,
      });
    }
    const newProductInfo = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
      owner,
    };

    const newProduct = await addProduct(newProductInfo, req);

    req.logger.info("Producto agregado con éxito" + newProduct.title);
    res.json({ message: `Producto agregado con éxito:  ${newProduct}` });
  } catch (err) {
    req.logger.error(err);
  }
});

// Actualizar un producto por su ID
router.put(
  "/:pid",
  passportCall("jwt"),
  adminAuthMiddleware,
  async (req, res) => {
    try {
      const pid = req.params.pid;

      const updatedFields = req.body;
      const product = await getProductById(pid);
      if (!product) {
        CustomError.createError({
          name: PRODUCT_ERRORS.ERROR_UPDATING_PRODUCT,
          cause: productIdNotFound(pid),
          message: `The product with id ${pid} does not exist`,
          code: EErrors.NOT_FOUND,
        });
      }
      const update = await updateProduct(pid, updatedFields);

      res.json({
        message: `Producto con ID ${pid} actualizado con éxito`,
        update,
      });
    } catch (err) {
      res.json({ err });
    }
  }
);

// Eliminar un producto por su ID
router.delete(
  "/:pid",
  passportCall("jwt"),
  adminAuthMiddleware,
  async (req, res) => {
    try {
      const pid = req.params.pid;

      const deleted = (await deleteProduct(pid, req)) ? true : false;

      if (!deleted) {
      }

      res.json({
        message: `Producto con ID ${pid} eliminado con éxito`,
      });
    } catch (error) {
      res.json({ error });
    }
  }
);

// Agregar un nuevo producto en tiempo real
router.post(
  "/realtimeproducts",
  passportCall("jwt"),
  adminAuthMiddleware,
  async (req, res) => {
    try {
      const {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,
      } = req.body;

      if (
        !title ||
        !description ||
        !price ||
        !thumbnail ||
        !code ||
        !stock ||
        !status ||
        !category
      ) {
        CustomError.createError({
          name: PRODUCT_ERRORS.ERROR_CREATING_PRODUCT,
          cause: createProductErrorInfo(
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status,
            category
          ),
          message: `One or more properties were incomplete or note valid.`,
          code: EErrors.BAD_REQUEST,
        });
      }
      const newProductInfo = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
      };

      const newProduct = await addProduct(newProductInfo);

      io.emit("addProduct", newProduct);
      res.render("realTimeProducts.handlebars");
    } catch (err) {
      res.json({ err });
    }
  }
);

// Eliminar un producto en tiempo real por su ID
router.delete(
  "/realtimeproducts/:pid",
  passportCall("jwt"),
  adminAuthMiddleware,
  async (req, res) => {
    try {
      const pid = req.params.pid;

      // Obtener la información del producto antes de eliminarlo
      const deletedProduct = await getProductById(pid);

      if (!deletedProduct) {
        CustomError.createError({
          name: PRODUCT_ERRORS.ERROR_DELETING_PRODUCT,
          cause: deleteProductErrorInfo(pid),
          message: "Error trying to delete User",
          code: EErrors.NOT_FOUND,
        });
      }

      // Eliminar el producto
      const deleted = await deleteProduct(pid);

      const newProductList = await getAllProducts();

      // Emitir el evento 'updateProductList' para actualizar la lista de productos
      io.emit("updateProducts", newProductList);
      res.render("realTimeProducts.handlebars");
      res.json({
        message: `Producto con ID ${pid} eliminado con éxito`,
        product: deletedProduct,
      });
    } catch (error) {
      res.json({ error });
    }
  }
);

router.get("/details/:pid", passportCall("jwt"), async (req, res) => {
  try {
    const productId = req.params.pid;

    const {
      first_name,
      last_name,
      role,
      cartId,
      totalProducts,
      adminValidation,
      tokenid,
    } = await getClientInfo(req);

    const product = await getProductById(productId);
    if (!product) {
      CustomError.createError({
        name: PRODUCT_ERRORS.PRODUCT_ID_NOT_FOUND,
        cause: productIdNotFound(pid),
        message: `The product with id ${pid} does not exist`,
        code: EErrors.NOT_FOUND,
      });
    }
    const productrender = [product];
    const { _id, title, description, price, thumbnail, code, stock, status } =
      productrender[0];

    res.render("product.handlebars", {
      _id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      first_name,
      last_name,
      role,
      cartId,
      totalProducts,
      adminValidation,
      tokenid,
    });
  } catch (error) {
    res.json({ error });
  }
});

router.get(
  "/manager/create",
  passportCall("jwt"),
  adminAuthMiddleware,
  async (req, res) => {
    try {
      const tokenid = req.user.id;
      if (!tokenid) {
        res.redirect("/login");
      }

      const {
        first_name,
        last_name,
        role,
        adminValidation,
        totalProducts,
        cartId,
      } = await getClientInfo(req); //obtiene los datos del cliente logueado

      res.render("add-product.handlebars", {
        first_name,
        last_name,
        role,
        adminValidation,
        totalProducts,
        cartId,
        tokenid,
      });
    } catch (err) {
      req.logger.error(err);
    }
  }
);

router.post(
  "/addProducts",
  passportCall("jwt"),
  adminAuthMiddleware,
  async (req, res) => {
    const newProductInfo = req.body;
    req.logger.info(newProductInfo);
    const newProduct = await addProduct(newProductInfo, req);

    res.json({ message: `Producto agregado con éxito ${newProductInfo}` });
  }
);

router.get(
  "/manager/delete",
  passportCall("jwt"),
  adminAuthMiddleware,
  async (req, res) => {
    try {
      const tokenid = req.user.id;
      if (!tokenid) {
        res.redirect("/login");
      }

      const {
        first_name,
        last_name,
        role,
        adminValidation,
        totalProducts,
        cartId,
        email,
      } = await getClientInfo(req); //obtiene los datos del cliente logueado
      const products = await getProductsByOwner(email);

      res.render("delete-products.handlebars", {
        first_name,
        last_name,
        role,
        adminValidation,
        totalProducts,
        cartId,
        products,
        tokenid,
      });
    } catch (err) {
      req.logger.error(err);
    }
  }
);

export { router };
