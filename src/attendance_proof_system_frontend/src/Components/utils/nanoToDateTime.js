import moment from "moment";

export function convertNanosecondsToDate(nanoseconds) {
    const milliseconds = nanoseconds / 1000000;
    const date = new Date(milliseconds);
    const formattedDate = moment(date).format('YYYY-MM-DD / HH:mm');
    return formattedDate;
}

export function convertDateToNanoSeconds(dateString) {
    const date = new Date(dateString);
    const milliseconds = date.getTime();
    const nanoseconds = milliseconds * 1000000;
    return nanoseconds;
}

export function convertNanosecondsToInputFillDate(nanoseconds) {
    const milliseconds = nanoseconds / 1000000;
    const date = new Date(milliseconds);
    const formattedDate = moment(date).format('YYYY-MM-DDTHH:mm');
    return formattedDate;
}
