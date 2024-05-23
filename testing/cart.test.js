import { expect } from "chai";
import supertest from "supertest";

const requester = supertest(
  "https://ecommerce-coder-production-491e.up.railway.app"
);

describe("8bits", () => {
  let authTokenCookie;

  before(async () => {
    const loginResponse = await requester
      .post("/api/auth/login")
      .send({ email: "premium@user.com", password: "coder963" });

    expect(loginResponse.status).to.equal(200);

    authTokenCookie = loginResponse.headers["set-cookie"][0];

    expect(authTokenCookie).to.exist;
  });

  describe("test de cart", () => {
    it("debe traer el detalle de un carrito por su ID", async () => {
      const cartId = "660c927caf33286e7c7c7ae4";
      const response = await requester
        .get(`/api/carts/${cartId}`)
        .set("Cookie", authTokenCookie);
      console.log(response.type);
      expect(response.type).to.equal("text/html");
      expect(response.text).to.exist;
      expect(response.status).to.equal(200);
    });
  });
  describe("test de products", () => {
    it("debe eliminar un producto del carrito segun su id", async () => {
      const IdValido = "65a964dc052c1c7d321ffb9b"; //id del juego Howarts Legacy para hacer la prueba
      const cartId = "660c927caf33286e7c7c7ae4";
      const response = await requester
        .delete(`/api/carts/${cartId}/products/${IdValido}`)
        .set("Cookie", authTokenCookie);

      console.log(response.body);
      expect(response.status).to.equal(200);
    });
  });

  describe("test de products", () => {
    it("debe Agregar un producto al carrito segun su id", async () => {
      const IdValido = "65a964dc052c1c7d321ffb93";
      const cartId = "660c927caf33286e7c7c7ae4";
      const response = await requester
        .post(`/api/carts/${cartId}/products/${IdValido}`)
        .set("Cookie", authTokenCookie);

      console.log(response.error);
      expect(response.status).to.equal(200);
    });
  });
});
