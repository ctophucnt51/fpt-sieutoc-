export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "khuyen-mai" | "huong-dan" | "tin-tuc" | "goi-cuoc";
  categoryName: string;
  thumbnail: string;
  author: string;
  published: boolean;
  featured?: boolean;
  views: number;
  readTimeMinutes: number;
  createdAt: string;
  updatedAt: string;
}

// Helper: Convert Vietnamese string to SEO-friendly slug (pure client/server safe)
export function slugifyVietnamese(text: string): string {
  let str = text.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/[^a-z0-9 -]/g, "");
  str = str.replace(/\s+/g, "-");
  str = str.replace(/-+/g, "-");
  return str.trim();
}
