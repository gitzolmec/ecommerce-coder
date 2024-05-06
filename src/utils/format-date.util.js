import moment from "moment";

const formatDate = (date) => {
  const currentDate = moment(date);

  // Formatea la fecha como 'YYYY-MM-DD HH:mm:ss'
  const formattedDate = currentDate.format("YYYY-MM-DD HH:mm:ss");

  return formattedDate;
};

export { formatDate };
