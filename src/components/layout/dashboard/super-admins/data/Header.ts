import { FiHome, FiSettings } from "react-icons/fi";

import { RiAdminFill } from "react-icons/ri";

import { GiCardboardBoxClosed } from "react-icons/gi";

import { GrArticle } from "react-icons/gr";

import { FiLayout } from "react-icons/fi";

export const menuItems = [
  {
    icon: FiHome,
    label: "Dashboard",
    href: "/dashboard/super-admins",
  },

  {
    icon: FiLayout,
    label: "Layout",
    href: "/dashboard/super-admins/layout",
    subItems: [
      { label: "Home", href: "/dashboard/super-admins/layout/home" },

      {
        label: "Featured",
        href: "/dashboard/super-admins/layout/featured",
      },

      {
        label: "Service",
        href: "/dashboard/super-admins/layout/service",
      },

      {
        label: "Company",
        href: "/dashboard/super-admins/layout/company",
      },
    ],
  },

  {
    icon: RiAdminFill,
    label: "Accounts",
    href: "/dashboard/super-admins/accounts",
    subItems: [
      { label: "Admins", href: "/dashboard/super-admins/admins" },
      { label: "User", href: "/dashboard/super-admins/user" },
    ],
  },

  {
    icon: GiCardboardBoxClosed,
    label: "Project",
    href: "/dashboard/super-admins/project",
    subItems: [
      { label: "Daftar Project", href: "/dashboard/super-admins/project" },
      { label: "Category", href: "/dashboard/super-admins/project/category" },
      { label: "Type", href: "/dashboard/super-admins/project/type" },
      { label: "Licence", href: "/dashboard/super-admins/project/license" },
    ],
  },

  {
    icon: GrArticle,
    label: "Article",
    href: "/dashboard/super-admins/article",
    subItems: [
      { label: "Daftar Article", href: "/dashboard/super-admins/article" },
      { label: "Category", href: "/dashboard/super-admins/article/category" },
      { label: "Tags", href: "/dashboard/super-admins/article/tags" },
    ],
  },

  {
    icon: FiSettings,
    label: "Pengaturan",
    href: "/dashboard/super-admins/settings",
    subItems: [
      { label: "Profile", href: "/dashboard/super-admins/settings/profile" },
      { label: "Security", href: "/dashboard/super-admins/settings/security" },
    ],
  },

  {
    icon: FiHome,
    label: "Home",
    href: "/",
  },
];
