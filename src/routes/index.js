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
const favouriteRoutes = require('../modules/Favourite/favourite.route')
const folderRoutes = require('../modules/Folder/folder.route.js')
const reportRoutes = require('../modules/Report/report.route')
const addressRoutes = require('../modules/Address/address.route')
const bookingRoutes = require('../modules/serviceManagement/serviceManagement.route.js')
const serviceAnnexRoutes = require('../modules/ServiceAnnex/serviceAnnex.route')


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
    path: '/service-annex',
    route: serviceAnnexRoutes
  },
  {
    path: '/service',
    route: serviceRoutes
  },
  {
    path : '/booking',
    route: bookingRoutes
  },
  {
    path: '/address',
    route: addressRoutes
  },
  {
    path: '/report',
    route: reportRoutes
  },
  {
    path: '/folder',
    route: folderRoutes
  },
  {
    path: '/favourite',
    route: favouriteRoutes
  },
  {
    path: '/notifications',
    route: notificationRoutes
  }
];


moduleRoutes.forEach((route) => router.use(route.path, route.route));

module.exports = router;