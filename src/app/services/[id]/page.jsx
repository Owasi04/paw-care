import ServiceDetails from "@/app/Components/services/ServiceDetails";

export default async function ServiceDetailsPage({ params }) {
  const { id } = await params;
  console.log("/services/[id] ar id from serviceDetailsPage ", id);
  return <ServiceDetails id={id} />;
}