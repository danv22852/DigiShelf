import axios from 'axios';

export interface GoogleBook {
  googleBooksId: string;
  title: string;
  author: string;
  cover?: string;
  description?: string;
  isbn?: string;
  pageCount?: number;
  publishedDate?: string;
  genre?: string;
}

export const searchGoogleBooks = async (query: string): Promise<GoogleBook[]> => {
  const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
    params: {
      q: query,
      maxResults: 10,
      key: process.env.GOOGLE_BOOKS_API_KEY  // ← add this
    }
  });

  const items = response.data.items || [];

  return items.map((item: any) => {
    const info = item.volumeInfo;
    const isbn = info.industryIdentifiers?.find(
      (id: any) => id.type === 'ISBN_13' || id.type === 'ISBN_10'
    )?.identifier;

    return {
      googleBooksId: item.id,
      title:         info.title || 'Unknown Title',
      author:        info.authors?.join(', ') || 'Unknown Author',
      cover:         info.imageLinks?.thumbnail?.replace('http://', 'https://') || null,
      description:   info.description || null,
      isbn:          isbn || null,
      pageCount:     info.pageCount || null,
      publishedDate: info.publishedDate || null,
      genre:         info.categories?.[0] || null
    };
  });
};