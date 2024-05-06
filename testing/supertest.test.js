import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

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

  describe("test de products", () => {
    it("debe traer el listado de productos", async () => {
      const response = await requester
        .get("/api/products")
        .set("Cookie", authTokenCookie);

      console.log(response.text);
      expect(response.status).to.equal(200);
    });

    it("debe traer un producto segun su id", async () => {
      const IdValido = "65a964dc052c1c7d321ffb9b"; //id del juego Howarts Legacy para hacer la prueba
      const response = await requester
        .get(`/api/products/${IdValido}`)
        .set("Cookie", authTokenCookie);

      console.log(response.body);
      expect(response.status).to.equal(200);
    });

    it("debe agregar un producto a la BD", async () => {
      const response = await requester
        .post("/api/products")
        .set("Cookie", authTokenCookie)
        .send({
          title: "Donkey Kong Country Tropical Freeze NSW",
          description:
            "¡Donkey Kong Country: Tropical Freeze ya se está preparando para el debut de la serie en Nintendo Switch! Los vikingos se han presentado sin invitación en la Isla de Donkey Kong y la han congelado de punta a punta. ¡Ahora les toca a los Kongs romper el hielo!",
          price: 49.99,
          thumbnail: "/img/donkeykong.jpg",
          code: "M2C6K4Y",
          stock: 30,
          status: true,
          category: "Nintendo",
        });

      console.log(response.body);
      expect(response.body).to.exist;
    });
  });
});
