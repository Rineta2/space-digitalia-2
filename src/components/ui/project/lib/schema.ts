export interface Framework {
  imageUrl: string;
  title: string;
}

export interface ProjectType {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  profile: {
    image: string;
    title: string;
    text: string;
  };
  author: {
    name: string;
    photoURL: string;
    role: string;
    uid: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
  delivery: number;
  downloads: number;
  images: string[];
  frameworks: Framework[];
  licenseDetails: {
    downloadUrl: string;
    price: number;
    title: string;
    licenseTitle: string;
  }[];
  licenseUrl: string;
  licenseTitle: string;
  linkPreview: string;
  slug: string;
  sold: number;
  status: string;
  stock: number;
  typeCategory: string;
  typeTitle: string;
}
