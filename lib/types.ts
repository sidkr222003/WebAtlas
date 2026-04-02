export interface Item {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  pricing?: string;
  tags?: string[];
  subcategories?: string[];
  rank?: number;
}

export interface Collection {
  id: string;
  name: string;
  color: string;
  itemCount?: number;
  items: Item[];
}
