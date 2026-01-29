import type { GatherArguments } from "@shougo/ddu-vim/source";
import type { Item } from "@shougo/ddu-vim/types";
import { BaseSource } from "@shougo/ddu-vim/source";

import type { ActionData } from "../../@ddu-kinds/inkdrop_menu/main.ts";

type Params = Record<string, never>;

type MenuItem = {
  word: string;
  params: Record<string, unknown>;
};

const menuItems: MenuItem[] = [
  { word: "All Notes", params: {} },
  { word: "Pinned Notes", params: { pinned: true } },
  { word: "Status: Active", params: { statuses: ["active"] } },
  { word: "Status: On Hold", params: { statuses: ["onHold"] } },
  { word: "Status: Completed", params: { statuses: ["completed"] } },
  { word: "Status: Dropped", params: { statuses: ["dropped"] } },
];

export class Source extends BaseSource<Params, ActionData> {
  override kind = "inkdrop_menu";

  override gather(
    _args: GatherArguments<Params>,
  ): ReadableStream<Item<ActionData>[]> {
    return new ReadableStream<Item<ActionData>[]>({
      start(controller) {
        controller.enqueue(menuItems.map((item) => {
          return {
            word: item.word,
            action: {
              word: item.word,
              params: item.params,
            },
          };
        }));
        controller.close();
      },
    });
  }

  override params(): Params {
    return {};
  }
}
