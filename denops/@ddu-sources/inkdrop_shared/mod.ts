import xdg from "@404wolf/xdg-portable";
import { join } from "@std/path";
import { exists } from "@std/fs";
import { parse } from "@std/toml";
import { is, maybe } from "@core/unknownutil";

import { InkdropClient } from "@kyoh86/inkdrop-local";

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
