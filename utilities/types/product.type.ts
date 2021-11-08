/**
 * Product type
 *
 * @export
 * @interface Product
 */
export interface Product {
  _id: string;
  name: string;
  category?: string;
  price: number;
}
