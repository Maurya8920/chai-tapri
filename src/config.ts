export interface SiteConfig {
  siteName: string;
  playlistId: string;
  siteUrl: string;
  contactEmail: string;
  whatsappChannelUrl: string;
  whatsappShareUrl: string;
}

export const CONFIG: SiteConfig = {
  siteName: "Chai Tapri",
  playlistId: "PLB6hCBnsas4Q",
  siteUrl: "chai-tapri-virid.vercel.app",
  contactEmail: "namanmaurya4575@gmail.com",
  whatsappChannelUrl: "https://whatsapp.com/channel/0029Vb9idnj7T8bbOgatGO0a",
  whatsappShareUrl:
    "https://wa.me/?text=" +
    encodeURIComponent("Chai ki chuski aur purane gaane ☕🎶 Suno 90s hits 24x7: chai-tapri-virid.vercel.app"),
};