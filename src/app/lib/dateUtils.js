/**
 * Date helpers for appointment scheduling.
 *
 * Appointments store `appointmentDate` as a bare "YYYY-MM-DD" string with no
 * timezone, written from the booker's browser. The only correct reading of
 * "today" is therefore the viewer's local calendar date — never a UTC one.
 * `new Date().toISOString().split("T")[0]` is a UTC boundary and shifts the
 * day for anyone east or west of UTC.
 */

/** Local calendar date as "YYYY-MM-DD" (the en-CA locale formats ISO-style). */
export function getLocalDateString(date = new Date()) {
  return date.toLocaleDateString("en-CA");
}

/** True when an appointment's stored date falls on the viewer's local today. */
export function isToday(appointmentDate, now = new Date()) {
  return appointmentDate === getLocalDateString(now);
}
