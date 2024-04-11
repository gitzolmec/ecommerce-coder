const { Router } = require("express");

const router = Router();
const {
  getAllProducts,
  getProductById,
  getClientInfo,
  updateProduct,
  deleteProduct,
  addProduct,
} = require("../../services/product.service");

const generateProducts = require("../../utils/products-mock.util");
const CustomError = require("../../handlers/errors/custom.error");
const PRODUCT_ERRORS = require("../../handlers/errors/product-error-types");
const {
  productIdNotFound,
} = require("../../handlers/errors/generate-error-info");
const EErrors = require("../../handlers/errors/enum.error");
const { addProductToCart } = require("../../services/carts.service");

router.get("/mockingproducts", async (req, res) => {
  try {
    const products = await generateProducts();
    res.json({ message: products });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "error", message: "Not Found" });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const product = await addProductToCart(req);
    res.json({ message: product });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "error", message: "Not Found" });
  }
});

router.post("/addproduct", async (req, res) => {
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
      category,
    };

    const newProduct = await addProduct(newProductInfo, req);
    req.logger.info("Producto agregado con éxito " + newProduct.title);
    res.json({ message: "Producto agregado con éxito" });
  } catch (err) {
    res.json({ err });
  }
});

module.exports = router;
