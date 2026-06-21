export const categoryOptions = [
  { label: 'All Categories', value: 'all' },
  { label: 'Cars', value: 'cars', matches: ['car', 'bike'] },
  { label: 'Electronics', value: 'electronics', matches: ['phone-accessories', 'laptop', 'tv', 'hd'] },
  { label: 'Fashion', value: 'fashion', matches: ['cloth'] },
  { label: 'Home & Kitchen', value: 'home-kitchen', matches: ['fridge', 'electric-cook', 'fan', 'iron'] },
  { label: 'Sports', value: 'sports', matches: ['sports'] },
];

export const categoryLabel = (value) => {
  const found = categoryOptions.find((category) => category.value === value);
  if (found) return found.label;
  return value.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export const categoryMatches = (value) => {
  const found = categoryOptions.find((category) => category.value === value);
  return found?.matches || [value];
};
