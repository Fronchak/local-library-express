function getDatePlusTimeZoneOffSet(date) {
  const dateInMiliseconds = date.getTime();
  const localOffSetInMiliseconds = new Date().getTimezoneOffset() * 60 * 1000;
  return new Date(dateInMiliseconds + localOffSetInMiliseconds);
};

module.exports = getDatePlusTimeZoneOffSet;
