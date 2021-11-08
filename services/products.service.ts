import { Service, Context, Errors, GenericObject } from 'moleculer';
import { Service as DService, Action, Method } from 'moleculer-decorators';

import { ProductsOpenapi, ProductsValidation } from '../utilities/mixins';
import { ProductModel, ProductDocument } from '../utilities/models';
import DbService from '../utilities/mixins/mongo.mixin';
import { Product, MetaParams } from '../utilities/types';
import { MyError } from '../utilities/adapters';

const { MoleculerClientError, ValidationError } = Errors;

@DService({
  name: 'products',
  mixins: [
    new DbService('Products').start<ProductDocument>(ProductModel),
    ProductsValidation,
    ProductsOpenapi,
  ],

  /**
   * Default settings
   */
  settings: {
    fields: ['_id', 'name', 'category', 'price'],
  },
})
export default class ProductsService extends Service {
  /**
   * Create a new entity.
   * Auth is required!
   *
   * @actions
   * @param {Object} products - Product entity
   *
   * @returns {Object} Created entity
   */
  @Action({
    auth: ['Basic'],
    visibility: 'published',
  })
  create(ctx: Context<Product>): Promise<{ product: Product }> {
    const product = ctx.params;

    return this._create(ctx, product)
      .then((entity: Product) => ({
        product: this.transformResultEntity(entity),
      }))
      .catch((err: MyError) => {
        if (err.name === 'MongoError' && err.code === 11000) {
          throw new ValidationError(err.message);
        }

        throw new ValidationError(err.toString());
      });
  }

  /**
   * Update an entity.
   * Auth is required!
   *
   * @actions
   *
   * @returns {Object} Updated product center
   */
  @Action({
    auth: ['Basic', 'Bearer'],
    visibility: 'published',
  })
  update(
    ctx: Context<Partial<Product>, MetaParams<Product>>
  ): Promise<{ product: Product }> {
    const product = ctx.params;

    // Bearer only update his entity
    if (
      product._id &&
      ctx.meta.user._id &&
      product?._id !== ctx.meta.user._id
    ) {
      throw new MoleculerClientError("Can't update this entity", 401);
    }

    return this._update(ctx, product).then((entity: Product) => ({
      product: this.transformResultEntity(entity),
    }));
  }

  /**
   * List entities with pagination.
   * Auth is required!
   *
   * @actions
   *
   * @returns {Object} List of entities
   */
  @Action({
    auth: ['Basic'],
    visibility: 'published',
  })
  list(ctx: Context<any>) {
    if (ctx.params.search && !ctx.params.searchFields)
      ctx.params.searchFields = 'name';
    const params = this.sanitizeParams(ctx, ctx.params);
    return this._list(ctx, params).then(this.transformResultList);
  }

  /**
   * Get an entity by id
   * Auth is required!
   *
   * @actions
   * @param {String} id - Entity id
   *
   * @returns {Object} The entity
   */
  @Action({
    auth: ['Basic', 'Bearer'],
    visibility: 'published',
    cache: {
      keys: ['id', '#authType'],
      ttl: 60 * 10,
    },
  })
  get(
    ctx: Context<{ id: string }, MetaParams<Product>>
  ): Promise<{ product: Product }> {
    const { id } = ctx.params;

    // Bearer only get his entity
    if (ctx.meta.user._id && id !== ctx.meta.user._id) {
      throw new MoleculerClientError("Can't update this entity", 401);
    }

    return this._get(ctx, { id }).then((entity: Product) => ({
      product: this.transformResultEntity(entity),
    }));
  }

  /**
   * Transform the result entities
   *
   * @param {Array} entities
   */
  @Method
  transformResultList<T>({ rows, ...props }: GenericObject) {
    const products = rows
      .map(this.transformResultEntity)
      .filter((result: T[]) => result);

    return { products, ...props };
  }

  /**
   * Transform a result entity
   *
   * @param {Context} ctx
   * @param {Object} entity
   */
  @Method
  transformResultEntity(entity: Product) {
    if (!entity) return false;
    return this.sanitizeObject({
      _id: entity._id,
      category: entity.category,
      price: entity.price,
    });
  }

  /* Filter null and undefined values
   *
   * @param {Object} object
   */
  @Method
  sanitizeObject(object: Partial<Product>) {
    return Object.entries(object).reduce(
      (acc, [key, val]) =>
        val === null || val === undefined
          ? acc
          : {
              ...acc,
              [key]: val,
            },
      {}
    );
  }
}
