export enum Role {
  SUPER_ADMIN = "super-admins",
  ADMIN = "admins",
  USER = "user",
}

export interface UserAccount {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  photoURL?: string;
  updatedAt: Date;
  isActive: boolean;
  phoneNumber: string;
  createdAt: Date;
}

export interface AuthContextType {
  user: UserAccount | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserAccount>;
  loginWithGoogle: () => Promise<UserAccount>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  hasRole: (roles: string | string[]) => boolean;
  getDashboardUrl: (userRole: string) => string;
  register: (
    email: string,
    password: string,
    displayName: string,
    phone: string
  ) => Promise<void>;
  showInactiveModal: boolean;
  setShowInactiveModal: (show: boolean) => void;
}

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
