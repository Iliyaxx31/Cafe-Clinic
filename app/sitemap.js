export default async function sitemap() {
  return [
    {
      url: "https://cafeclinic.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}