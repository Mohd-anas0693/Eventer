import moment from "moment";

export function convertNanosecondsToDate(nanoseconds) {
    // Convert nanoseconds to milliseconds
    const milliseconds = nanoseconds / 1000000;

    // Create a Date object
    const date = new Date(milliseconds);

    // Format the date using moment.js
    const formattedDate = moment(date).format('YYYY-MM-DD / HH:mm');

    return formattedDate;
}

export function convertDateToNanoSeconds(dateString) {
    // Create a Date object from the date string
    const date = new Date(dateString);

    // Get the time in milliseconds
    const milliseconds = date.getTime();

    // Convert milliseconds to nanoseconds
    const nanoseconds = milliseconds * 1000000;

    return nanoseconds;
}

export function convertNanosecondsToInputFillDate(nanoseconds) {
    // Convert nanoseconds to milliseconds
    const milliseconds = nanoseconds / 1000000;

    // Create a Date object
    const date = new Date(milliseconds);

    // Format the date using moment.js
    const formattedDate = moment(date).format('YYYY-MM-DDTHH:mm');

    return formattedDate;
}
