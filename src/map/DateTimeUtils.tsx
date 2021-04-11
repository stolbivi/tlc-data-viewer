import moment from "moment";

export const DATE_FORMAT = "YYYY-MM-DD";
export const TIME_FORMAT = "h:mm:ss a";

export function getEpoch(date: Date, time: moment.Moment) {
  let dateString = moment(date).format(DATE_FORMAT);
  let timeString = time.format(TIME_FORMAT);
  let newDate = moment(
    dateString + "_" + timeString,
    DATE_FORMAT + "_" + TIME_FORMAT
  );
  return Math.floor(newDate.toDate().getTime() / 1000);
}
