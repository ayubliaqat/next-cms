
export type BlogCategory = 
  | 'Health Benefits' 
  | 'Recipes' 
  | 'Sourcing Stories' 
  | 'Nutritional Science';

/**
 * SEO Sub-interface for cleaner nesting
 */
export interface IBlogSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage: string;
}

/**
 * Visibility and Indexing controls
 */
export interface IBlogControls {
  isSearchable: boolean; // True = Google Index | False = NoIndex
  isFeatured: boolean;   // Home page spotlight
}

/**
 * The Master Blog Post Interface
 */
export interface IBlogPost {
  _id?: string;               // Optional for new posts before they hit DB
  title: string;
  slug: string;               // Handled by our separate slugify utility
  category: BlogCategory;
  author: string;
  
  // Content & Media
  coverImage: string;
  excerpt: string;            // Summary for the card view
  content: string;            // Raw Markdown body
  
  // Grouped SEO & Controls
  seo: IBlogSEO;
  indexControl: IBlogControls;

  // Metadata
  isPublished: boolean;
  publishedAt: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}