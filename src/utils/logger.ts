import * as expressWinston from "express-winston";
import * as winston from "winston";
import Blgr from "blgr";
import moment from "moment";

const blgrLogger = new Blgr(process.env.LOG_LEVEL || "debug");

/* 
blgr levels - 
  'none',
  'error',
  'warning',
  'info',
  'debug',
  'spam'
*/

const tsFormat = (ts: any) => moment(ts).format("YYYY-MM-DD HH:mm:ss").trim();

const defaultLogger = expressWinston.logger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.json(),
    winston.format.printf((info) => {
      return `-> ${tsFormat(info.timestamp)}: ${info.message}`;
    })
  ),
  meta: false, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP Request {{req.method}} {{req.url}} Response {{res.statusCode}} in {{res.responseTime}}ms",
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  ignoreRoute(req) {
    if (req.path.includes("png")) return true;
    return false;
  }, // optional: allows to skip some log messages based on request and/or response
});

export default defaultLogger;

async function logBase(level: string, ...message: any | Array<any>) {
  await blgrLogger.open();
  const [date, time] = new Date(Date.now())
    .toISOString()
    .split(".")[0]
    .split("T");
  const dateArr: string[] = date.split("-");
  dateArr.push(dateArr.shift()!.substring(2));
  blgrLogger[level](
    `${dateArr.join("-")}T${time}`,
    ...(Array.isArray(message) ? message : [message])
  );
}

async function logNone(...message: any | Array<any>) {
  logBase("none", ...message);
}
async function logError(...message: any | Array<any>) {
  logBase("error", ...message);
}
async function logWarn(...message: any | Array<any>) {
  logBase("warn", ...message);
}
async function logInfo(...message: any | Array<any>) {
  logBase("info", ...message);
}
async function logDebug(...message: any | Array<any>) {
  logBase("debug", ...message);
}

const logger = {
  none: logNone,
  error: logError,
  warn: logWarn,
  info: logInfo,
  debug: logDebug,
};

export { logger };
