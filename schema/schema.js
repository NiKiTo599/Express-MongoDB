const graphql = require("graphql");
const mongoose = require("mongoose");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const Products = require("../models/product");
const Categories = require("../models/categories");

const AttributeType = new GraphQLObjectType({
  name: "attribute",
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    value: { type: new GraphQLNonNull(GraphQLString) }
  })
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
    filename: { type: new GraphQLNonNull(GraphQLString) }
  })
});

const ProductType = new GraphQLObjectType({
  name: "product",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    regular_price: { type: new GraphQLNonNull(GraphQLString) },
    category_id: { type: GraphQLID },
    meta_description: { type: new GraphQLNonNull(GraphQLString) },
    stock: { type: new GraphQLNonNull(GraphQLString) },
    meta_title: { type: new GraphQLNonNull(GraphQLString) },
    description: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString))
      )
    },
    attributes: { type: new GraphQLNonNull(new GraphQLList(AttributeType)) },
    images: { type: new GraphQLNonNull(new GraphQLList(Imagetype)) }
  })
});

const CategoriesType = new GraphQLObjectType({
  name: "categories",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    parent_id: { type: GraphQLID },
    meta_description: { type: new GraphQLNonNull(GraphQLString) }
  })
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    product: {
      type: ProductType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Products.findById(args.id);
      }
    },
    attributeSortCount: {
      type: GraphQLInt,
      args: { attr: { type: new GraphQLList(GraphQLString) } },
      resolve(parent, args) {
        return Products.find({
          attributes: {
            $elemMatch: {
              value: {
                $in: args.attr
              }
            }
          }
        }).countDocuments();
      }
    },
    products: {
      type: new GraphQLList(ProductType),
      args: {
        category_id: { type: GraphQLID },
        page: { type: GraphQLString },
        attr: { type: new GraphQLList(GraphQLString) }
      },
      resolve(parent, args) {
        let details;
        if (args.attr && args.attr.length !== 0) {
          details = {
            attributes: {
              $elemMatch: {
                value: {
                  $in: args.attr
                }
              }
            }
          }
        } else {
          details = { category_id: args.category_id };
        }
        return Products.find(details)
          .limit(10)
          .skip((args.page - 1) * 10);
      }
    },
    productsAttributes: {
      type: new GraphQLList(ProductType),
      args: {
        category_id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Products.find({ category_id: args.category_id });
      }
    },
    categories: {
      type: new GraphQLList(CategoriesType),
      resolve(parent, args) {
        return Categories.find({});
      }
    },
    count: {
      type: GraphQLInt,
      args: {
        category_id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return 5; /*Products.find({ category_id: args.category_id }).count();*/
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: Query
});
