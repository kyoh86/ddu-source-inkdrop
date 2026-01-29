import type { Actions } from "@shougo/ddu-vim/types";
import { ActionFlags } from "@shougo/ddu-vim/types";
import { BaseKind } from "@shougo/ddu-vim/kind";

export type ActionData = {
  word: string;
  params: Record<string, unknown>;
};

type Params = Record<string, never>;

export class Kind extends BaseKind<Params> {
  override actions: Actions<Params> = {
    open: async (args) => {
      const first = args.items[0]?.action as ActionData | undefined;
      if (!first) {
        return ActionFlags.None;
      }
      await args.denops.call("ddu#start", {
        name: "inkdrop_notes",
        push: true,
        sources: [{ name: "inkdrop_notes", params: first.params }],
        kindOptions: {
          file: { defaultAction: "open" },
        },
      });
      return ActionFlags.None;
    },
  };

  params(): Params {
    return {};
  }
}
