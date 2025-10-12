const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const routes = require("./routes");
const morgan = require("morgan");
const logger = require("./helpers/logger");
const bodyParser = require("body-parser");
const session = require("express-session");
require("dotenv").config();
const { getDevLoginPage } = require("./helpers/logViewerLogin");

const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');

// Initialize i18next for localization
i18next.use(Backend).use(middleware.LanguageDetector).init({
  fallbackLng: ["en", "dn"],
  backend: {
    loadPath: './locales/{{lng}}/translation.json'
  }
});

// Import Error Handling Middleware
const {
  notFoundHandler,
  errorHandler,
  errorConverter,
} = require("./middlewares/errorHandler");
const { stripeWebhook } = require("./modules/MySubscription/mysubscription.controller");

// Initialize Express App
const app = express();

// Use i18next middleware to handle localization
app.use(middleware.handle(i18next));

// Webhook Route: Make sure express.raw is before express.json
app.use('/api/v1/payment/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Body Parsers for general use (after the raw parser for webhooks)
app.use(express.json()); // Handles application/json for other routes
app.use(bodyParser.urlencoded({ extended: true })); // Handles form submissions

// Security: Helmet for setting HTTP headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Session Management (Memory Store for Sessions)
const MemoryStore = session.MemoryStore;
const memoryStore = new MemoryStore();
app.use(session({
  secret: process.env.SESSION_SECRET || 'realestate',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === "production",  // Use secure cookies in production
    httpOnly: true,  // Make cookies inaccessible to JavaScript
    maxAge: 1000 * 60 * 60 * 24 * 7,  // Session expires in 1 week
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
  store: memoryStore,  
}));

// CORS Middleware: Allow all origins
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));

// Morgan Logging: Log HTTP request status and response time
const morganFormat = ":method :url :status :response-time ms";
app.use(morgan(morganFormat, {
  stream: {
    write: (message) => {
      const logObject = {
        method: message.split(" ")[0],
        url: message.split(" ")[1],
        status: message.split(" ")[2],
        responseTime: message.split(" ")[3].replace("ms", "").trim(),
      };
      logger.log({
        level: "info",
        message: "Response time log",
        ...logObject,
        label: "ResponseTime",
      });
    },
  },
}));

// Static Files Middleware (for assets in 'public')
app.use(express.static("public"));

// Serve assetlinks.json dynamically
app.get('/.well-known/assetlinks.json', (req, res) => {
  res.json([
    {
      "relation": ["delegate_permission/common.handle_all_urls"],
      "target": {
        "namespace": "android_app",
        "package_name": "com.example.training_plus",
        "sha256_cert_fingerprints": [
          "E5:01:D5:F0:FD:A6:80:08:6C:1A:98:75:F3:9E:4F:30:98:05:7D:7C:D8:8B:1E:0E:DA:09:37:AE:32:1C:45:99"
        ]
      }
    }
  ]);
});

// Define Routes
app.use("/api/v1", routes);

// Dev login page for testing
app.get("/", (req, res) => {
  res.send({ message: req.t('create-message') });
});

// Health check route for basic status
app.get("/dev-login", (req, res) => {
  console.log("Serving Dev Login Page");
  res.send(getDevLoginPage());
  // res.send(getDevLoginPage());
});

// Error Handling Middleware (must be last middleware)
app.use(notFoundHandler); 
app.use(errorConverter); 
app.use(errorHandler);

module.exports = app;
