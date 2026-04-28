import { useState } from "react";
import { CommandMenu } from "./components/command-menu";

export function DevApp() {
  const [open, setOpen] = useState(true);
  return (
    <div className="p-8">
      <button className="rounded-md border px-4 py-2" onClick={() => setOpen(true)}>Open command menu</button>
      <CommandMenu open={open} onOpenChange={setOpen} />
    </div>
  );
}
