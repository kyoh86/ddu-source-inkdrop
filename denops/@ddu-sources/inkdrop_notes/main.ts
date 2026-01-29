import type { GatherArguments } from "@shougo/ddu-vim/source";
import type { ActionData as FileActionData } from "@shougo/ddu-kind-file";
import type { Item } from "@shougo/ddu-vim/types";
import { BaseSource } from "@shougo/ddu-vim/source";
import type { NoteDoc } from "@kyoh86/inkdrop-local";
import { createClient } from "../inkdrop_shared/mod.ts";

type ActionData = FileActionData & NoteDoc;

type Params = {
  keyword: string;
  limit: number;
  skip: number;
  sort: "updatedAt" | "createdAt" | "title";
  descending: boolean;
  bookId: string;
  tagId: string;
  statuses: string[];
  pinned: boolean;
};

export class Source extends BaseSource<Params, ActionData> {
  override kind = "file";

  override gather(
    args: GatherArguments<Params>,
  ): ReadableStream<Item<ActionData>[]> {
    return new ReadableStream<Item<ActionData>[]>({
      async start(controller) {
        try {
          const client = await createClient();
          if (!client) {
            return;
          }

          const notes = await client.notes.list<NoteDoc>({
            keyword: args.sourceParams.keyword,
            limit: args.sourceParams.limit,
            skip: args.sourceParams.skip,
            sort: args.sourceParams.sort,
            descending: args.sourceParams.descending,
          });

          let filtered = notes;
          if (args.sourceParams.bookId) {
            filtered = filtered.filter((note) =>
              note.bookId === args.sourceParams.bookId
            );
          }
          if (args.sourceParams.tagId) {
            filtered = filtered.filter((note) =>
              note.tags?.includes(args.sourceParams.tagId)
            );
          }
          if (args.sourceParams.statuses.length > 0) {
            filtered = filtered.filter((note) =>
              args.sourceParams.statuses.includes(note.status ?? "none")
            );
          }
          if (args.sourceParams.pinned) {
            filtered = filtered.filter((note) => note.pinned);
          }

          controller.enqueue(filtered.map((note) => {
            const title = note.title ?? "(untitled)";
            return {
              word: title,
              action: {
                ...note,
                path: `inkdrop://note;noteId=${note._id}`,
              },
            };
          }));
        } catch (err) {
          console.error(err);
        } finally {
          controller.close();
        }
      },
    });
  }

  override params(): Params {
    return {
      keyword: "",
      limit: 100,
      skip: 0,
      sort: "updatedAt",
      descending: true,
      bookId: "",
      tagId: "",
      statuses: [],
      pinned: false,
    };
  }
}
