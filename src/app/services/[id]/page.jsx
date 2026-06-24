import ServiceDetails from "@/app/Components/services/ServiceDetails";

export default async function ServiceDetailsPage({ params }) {
  const { id } = await params;
  return <ServiceDetails id={id} />;
}