import { Service, Context, Errors, GenericObject } from 'moleculer';
import { Service as DService, Action, Method } from 'moleculer-decorators';

@DService({
  name: 'products',
})
export default class ProductsService extends Service {
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
  update() {
    return 'products.update';
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
    auth: false,
    visibility: 'published',
  })
  list() {
    return 'products.list';
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
    auth: false,
    visibility: 'published',
  })
  get() {
    return 'products.get';
  }
}
