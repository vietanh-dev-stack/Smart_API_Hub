export const relations: Record<string, Record<string, string>> = {
  categories: {
    products: "category_id",
  },
  users: {
    products: "user_id",
    categories: "user_id",
  },
};