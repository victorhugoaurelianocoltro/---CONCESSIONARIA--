import { notFound } from "next/navigation";
import VehicleDetailClient from "@/components/VehicleDetailClient";
import { getPublicVehicleBySlug } from "@/lib/dealership-db";

export const dynamic = "force-dynamic";

export default function VehiclePage({ params }: { params: { slug: string } }) {
  const vehicle = getPublicVehicleBySlug(params.slug);
  if (!vehicle) notFound();
  return <VehicleDetailClient vehicle={vehicle} />;
}