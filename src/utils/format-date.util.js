import moment from "moment";

const formatDate = (date) => {
  const currentDate = moment(date);

  // Formatea la fecha como 'YYYY-MM-DD HH:mm:ss'
  const formattedDate = currentDate.format("YYYY-MM-DD HH:mm:ss");

  return formattedDate;
};

const formatFileDate = (date) => {
  const currentDate = moment(date);

  // Formatea la fecha como 'YYYY-MM-DD'
  const formattedDate = currentDate.format("DD-MM-YYYY");

  return formattedDate;
};

export { formatDate, formatFileDate };
