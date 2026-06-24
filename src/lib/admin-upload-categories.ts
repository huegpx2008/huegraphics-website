export const adminUploadCategories = [
  { value: "screen-printing", label: "Screen Printing" },
  { value: "embroidery", label: "Embroidery" },
  { value: "dtf-transfers", label: "DTF Transfers" },
  { value: "signs-banners", label: "Signs & Banners" },
  { value: "vehicle-graphics", label: "Vehicle Graphics" },
  { value: "business-printing", label: "Business Printing" },
  { value: "shop-behind-the-scenes", label: "Shop / Behind the Scenes" },
] as const;

export type AdminUploadCategory =
  (typeof adminUploadCategories)[number]["value"];

export function getAdminUploadCategory(value: string) {
  return adminUploadCategories.find((category) => category.value === value);
}
