import { getTravelNotes } from "@/actions/travel-notes";
import { NotesModule } from "@/components/notes/notes-module";

export const metadata = {
  title: "Travel Notes — Traveloop",
  description: "Write and manage your travel journal notes.",
};

interface NotesPageProps {
  params: Promise<{ id: string }>;
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { id } = await params;
  const notes = await getTravelNotes(id);

  return (
    <NotesModule
      tripId={id}
      initialNotes={notes.map((n) => ({
        id: n.id,
        title: n.title ?? null,
        content: n.content,
        createdAt: new Date(n.createdAt),
        updatedAt: new Date(n.updatedAt),
      }))}
    />
  );
}
