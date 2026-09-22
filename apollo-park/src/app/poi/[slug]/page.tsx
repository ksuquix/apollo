// Individual POI page — TECHNICAL_SPEC.md §3
// Textual + voice-over description, wait time (local units), closures, holo upscale on supported devices.

export default async function POIDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <section>
      <h1>POI: {slug}</h1>
      <p>Description, media, wait time, and pricing for this POI go here.</p>
    </section>
  );
}
