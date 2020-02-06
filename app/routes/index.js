const shopRoutes = require('./shopRoutes');
module.exports = function(app, db) {
  shopRoutes(app, db);
  // Тут, позже, будут и другие обработчики маршрутов 
};