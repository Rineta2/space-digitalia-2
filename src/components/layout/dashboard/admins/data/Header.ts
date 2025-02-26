import { FiHome, FiSettings } from "react-icons/fi";

import { GiCardboardBoxClosed } from "react-icons/gi";

export const menuItems = [
  {
    icon: FiHome,
    label: "Dashboard",
    href: "/dashboard/admins",
  },

  {
    icon: GiCardboardBoxClosed,
    label: "Project",
    href: "/dashboard/admins/project",
    subItems: [{ label: "Daftar Project", href: "/dashboard/admins/project" }],
  },

  {
    icon: FiSettings,
    label: "Pengaturan",
    href: "/dashboard/admins/settings",
    subItems: [
      { label: "Profile", href: "/dashboard/admins/settings/profile" },
      { label: "Security", href: "/dashboard/admins/settings/security" },
    ],
  },

  {
    icon: FiHome,
    label: "Home",
    href: "/",
  },
];
