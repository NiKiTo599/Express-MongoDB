const graphql = require("graphql");
const mongoose = require("mongoose");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInputObjectType,
} = graphql;

const Products = require("../models/product");
const Categories = require("../models/categories");

const AttributeType = new GraphQLObjectType({
  name: "attribute",
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    value: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

/*const ObjectOfAttributesType = new GraphQLObjectType({
  name: 'sortByAttribute',
  fields: () => ({
    name
  })
})*/

const Imagetype = new GraphQLObjectType({
  name: "image",
  fields: () => ({
    filename: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const ProductType = new GraphQLObjectType({
  name: "product",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    regular_price: { type: new GraphQLNonNull(GraphQLInt) },
    category_id: { type: GraphQLID },
    meta_description: { type: new GraphQLNonNull(GraphQLString) },
    stock: { type: new GraphQLNonNull(GraphQLString) },
    meta_title: { type: new GraphQLNonNull(GraphQLString) },
    description: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString))
      ),
    },
    attributes: { type: new GraphQLNonNull(new GraphQLList(AttributeType)) },
    images: { type: new GraphQLNonNull(new GraphQLList(Imagetype)) },
  }),
});

const CategoriesType = new GraphQLObjectType({
  name: "categories",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    parent_id: { type: GraphQLID },
    meta_description: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const Prices = new GraphQLInputObjectType({
  name: "prices",
  fields: () => ({
    min: { type: GraphQLInt },
    max: { type: GraphQLInt },
  }),
});

/* const AttributesSearchType = new GraphQLInputObjectType({
  name: "attributesSearchType",
  fields: () => ({
    attributes: { type: new GraphQLList(GraphQLString) },
    prices: { type: new GraphQLNonNull(Prices) },
  }),
}); */

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    product: {
      type: ProductType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Products.findById(args.id);
      },
    },
    attributeSortCount: {
      type: GraphQLInt,
      args: {
        attr: { type: new GraphQLList(GraphQLString) },
        prices: { type: Prices },
      },
      resolve(parent, args) {
        return Products.find({
          attributes: {
            $elemMatch: {
              value: {
                $in: args.attr,
              },
            },
          },
          /* $or: [
            {
              attributes: {
                $elemMatch: {
                  value: {
                    $in: args.attr,
                  },
                },
              },
            },
            {
              regular_price: {
                $lte: args.prices.max,
                $gte: args.prices.min,
              },
            },
          ], */
        }).countDocuments();
      },
    },
    products: {
      type: new GraphQLList(ProductType),
      args: {
        category_id: { type: GraphQLID },
        page: { type: GraphQLString },
        attr: { type: new GraphQLList(GraphQLString) },
        prices: { type: Prices },
      },
      resolve(parent, args) {
        let details;
        if (args.attr /* && args.attr.length !== 0 */) {
          details = {
            attributes: {
              $elemMatch: {
                value: {
                  $in: args.attr,
                },
              },
            },
            /* $or: [
              {
                attributes: {
                  $elemMatch: {
                    value: {
                      $in: args.attr,
                    },
                  },
                },
              },
              {
                regular_price: {
                  $lte: args.prices.max,
                  $gte: args.prices.min,
                },
              },
            ], */
          };
        } else {
          details = { category_id: args.category_id };
        }
        return Products.find(details)
          .limit(10)
          .skip((args.page - 1) * 10);
      },
    },
    searchProducts: {
      type: new GraphQLList(ProductType),
      args: {
        name: { type: GraphQLString },
      },
      resolve(parent, { name }) {
        return Products.find({
          name: {
            $regex: name,
            $options: "i",
          },
        }).limit(10);
      },
    },
    productsAttributes: {
      type: new GraphQLList(ProductType),
      args: {
        category_id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return Products.find({ category_id: args.category_id }).sort({
          regular_price: 1,
        });
      },
    },
    categories: {
      type: new GraphQLList(CategoriesType),
      resolve(parent, args) {
        return Categories.find({});
      },
    },
    count: {
      type: GraphQLInt,
      args: {
        category_id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return Products.find({
          category_id: args.category_id,
        }).countDocuments();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: Query,
});
