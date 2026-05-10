import { getChecklistItems } from "@/actions/checklist";
import { ChecklistModule } from "@/components/checklist/checklist-module";

export const metadata = {
  title: "Packing Checklist — Traveloop",
  description: "Manage your trip packing checklist.",
};

interface ChecklistPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChecklistPage({ params }: ChecklistPageProps) {
  const { id } = await params;
  const items = await getChecklistItems(id);

  return (
    <ChecklistModule
      tripId={id}
      initialItems={items.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        isDone: item.isDone,
      }))}
    />
  );
}
