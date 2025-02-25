export interface ICategory {
  catId: string;  
  catResId: string;
  catName: string;
  catSlug: string;
  catDescription: string;
  catOrder: number;
  catStatus: 'ENABLED' | 'DISABLED'
}
