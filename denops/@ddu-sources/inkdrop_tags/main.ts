import type { GatherArguments } from "@shougo/ddu-vim/source";
import type { ActionData as FileActionData } from "@shougo/ddu-kind-file";
import type { Item } from "@shougo/ddu-vim/types";
import { BaseSource } from "@shougo/ddu-vim/source";

import type { TagDoc } from "@kyoh86/inkdrop-local";
import { createClient } from "../inkdrop_shared/mod.ts";

type ActionData = FileActionData & TagDoc;

type Params = Record<string, never>;

export class Source extends BaseSource<Params, ActionData> {
  override kind = "file";

  override gather(
    _args: GatherArguments<Params>,
  ): ReadableStream<Item<ActionData>[]> {
    return new ReadableStream<Item<ActionData>[]>({
      async start(controller) {
        try {
          const client = await createClient();
          if (!client) {
            return;
          }

          const tags = await client.tags.list<TagDoc>();
          controller.enqueue(tags.map((tag) => {
            const encoded = encodeURIComponent(tag.name);
            return {
              word: tag.name,
              action: {
                ...tag,
                path:
                  `inkdrop://notes-list;tagId=${tag._id}&tagName=${encoded}`,
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
    return {};
  }
}
