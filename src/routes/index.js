const express = require('express');
const router = express.Router();
const authRoutes = require('../modules/Auth/auth.route');
const userRoutes = require('../modules/User/user.route');
const staticContentRoutes = require('../modules/StaticContent/staticContent.route');
const feedbackRoutes = require('../modules/FeedBack/feedback.route');
const fqRoutes = require('../modules/F&Q/fq.route')
const transactionRoutes = require('../modules/Transaction/transaction.route')
const notificationRoutes = require('../modules/Notification/notification.route')
const categoryRoutes = require('../modules/Category/category.route')
const serviceRoutes = require('../modules/Service/service.route')
const folderRoutes = require('../modules/Folder/folder.route.js')



const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/fandq',
    route: fqRoutes,
  },
  {
    path: '/category',
    route: categoryRoutes,
  },
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/transaction',
    route: transactionRoutes,
  },
  {
    path: '/static-contents',
    route: staticContentRoutes,
  },
  {
    path: '/feedback',
    route: feedbackRoutes
  },
  {
    path: '/service',
    route: serviceRoutes
  },
  {
    path: '/folder',
    route: folderRoutes
  },
  {
    path: '/notifications',
    route: notificationRoutes
  }
];


moduleRoutes.forEach((route) => router.use(route.path, route.route));

module.exports = router;