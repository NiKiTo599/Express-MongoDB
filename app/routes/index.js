const usersRoute = require('./usersRoute');
const productsRoute = require('./productRoute');
const productCategoriesRoute = require('./productCategoriesRoute')
module.exports = function(app, db) {
  usersRoute(app, db);
  productsRoute(app, db);
  productCategoriesRoute(app, db);
  // Тут, позже, будут и другие обработчики маршрутов 
};