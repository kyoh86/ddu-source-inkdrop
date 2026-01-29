import xdg from "jsr:@404wolf/xdg-portable@^0.1.0";
import { join } from "jsr:@std/path@^1.1.4";
import { exists } from "jsr:@std/fs@^1.0.21";
import { parse } from "jsr:@std/toml@^1.0.11";
import { is, maybe } from "jsr:@core/unknownutil@^4.3.0";

import { InkdropClient } from "jsr:@kyoh86/inkdrop-local@^0.1.1";

export type State = {
  baseUrl: string;
  username: string;
  password: string;
};

export function statePath(): string {
  return join(xdg.state(), "denops-inkdrop", "credentials.toml");
}

export async function loadState(): Promise<State | undefined> {
  const path = statePath();
  if (!await exists(path, { isFile: true, isReadable: true })) {
    return;
  }
  return maybe(
    parse(await Deno.readTextFile(path)),
    is.ObjectOf({
      baseUrl: is.String,
      username: is.String,
      password: is.String,
    }),
  );
}

export async function createClient(): Promise<InkdropClient | undefined> {
  const state = await loadState();
  if (!state) {
    return;
  }
  return new InkdropClient({
    baseUrl: state.baseUrl,
    username: state.username,
    password: state.password,
  });
}
