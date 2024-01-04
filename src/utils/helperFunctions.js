// formates date to "YY-MM-DD"
export const DateFormater = (date) => {
  let newDate = new Date(date);
  return newDate.toISOString().split("T")[0];
};
