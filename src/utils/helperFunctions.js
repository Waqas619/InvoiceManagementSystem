// formates date to "YY-MM-DD"
export const DateFormater = (date) => {
  let newDate = new Date(date);
  return newDate.toISOString().split("T")[0];
};

export const ConvertStringToDate = (dateStr) => {
  let timeStamp = Date.parse(dateStr);
  console.log(timeStamp);
  const date = new Date();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var year = date.getFullYear();
  var month = months[date.getMonth()];
  var dateVal = date.getDate();

  var formattedDate = dateVal + "/" + (date.getMonth() + 1) + "/" + year;
  console.log(formattedDate);
  return formattedDate;
};
