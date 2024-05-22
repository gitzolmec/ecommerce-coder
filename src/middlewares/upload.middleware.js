import { UserDao } from "../DAO/Mongo/user-dao.mongo.js";
const userDAO = new UserDao();

const uploadFiles = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const { fileType } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).send("No se ha seleccionado ningún archivo");
    }

    const user = await userDAO.getUserById(uid);

    if (!user) {
      return res.status(404).send("Usuario no encontrado");
    }

    const filePath = `/${fileType}s/${file.filename}`;
    const newDocument = { name: file.originalname, reference: filePath };

    const updatedUser = await userDAO.updateUserDocuments(uid, newDocument);

    if (fileType === "dni") {
      user.personal_documents.push({ name: fileType, status: true });
      user.save();
    } else if (fileType === "addressDocument") {
      user.personal_documents.push({ name: fileType, status: true });
      user.save();
    } else if (fileType === "accountDocument") {
      user.personal_documents.push({ name: fileType, status: true });
      user.save();
    }

    res.json({ message: "Archivo cargado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al subir el archivo");
  }
};

export default uploadFiles;
