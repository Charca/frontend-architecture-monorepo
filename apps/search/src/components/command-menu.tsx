import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent } from "@commerceos/ui";
import { Input } from "@commerceos/ui";
import { cn } from "@commerceos/ui";
import { useCommandMenuItems } from "../features/command-menu/use-command-menu-items";
import type { CommandItem } from "../features/command-menu/use-command-menu-items";
import { Button } from "@commerceos/ui";

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const items = useCommandMenuItems({ open, onOpenChange, query });

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(0);
      return;
    }

    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!items.length) {
      setActiveIndex(0);
      return;
    }
    setActiveIndex((current) => Math.min(current, items.length - 1));
  }, [items]);

  const groupedItems = useMemo(() => {
    const groups = new Map<string, CommandItem[]>();
    for (const item of items) {
      const currentGroup = groups.get(item.section) ?? [];
      currentGroup.push(item);
      groups.set(item.section, currentGroup);
    }
    return [...groups.entries()];
  }, [items]);

  const handleSelect = async (item: CommandItem) => {
    await item.run();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-2xl">
        <div className="border-b px-4 py-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setActiveIndex((current) => Math.min(current + 1, items.length - 1));
                }
                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setActiveIndex((current) => Math.max(current - 1, 0));
                }
                if (event.key === "Enter" && items[activeIndex]) {
                  event.preventDefault();
                  void handleSelect(items[activeIndex]);
                }
              }}
              placeholder="Search products, orders, customers, settings, and actions..."
              className="h-11 border-0 pl-10 pr-24 text-base shadow-none focus-visible:ring-0"
            />
            <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 md:flex">
              <span className="rounded border bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">↑↓</span>
              <span className="rounded border bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">↵</span>
            </div>
          </div>
        </div>

        <div className="max-h-[28rem] overflow-y-auto p-2">
          {groupedItems.length ? (
            groupedItems.map(([section, sectionItems]) => (
              <div key={section} className="pb-2">
                <div className="px-2 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {section}
                </div>
                <div className="space-y-1">
                  {sectionItems.map((item) => {
                    const itemIndex = items.findIndex((entry) => entry.id === item.id);
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        type="button"
                        variant="ghost"
                        onMouseEnter={() => setActiveIndex(itemIndex)}
                        onClick={() => void handleSelect(item)}
                        className={cn(
                          "h-auto w-full justify-start rounded-lg px-3 py-3 text-left",
                          itemIndex === activeIndex && "bg-accent text-accent-foreground",
                        )}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-background">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{item.label}</span>
                          <span className="block truncate text-xs text-muted-foreground">{item.subtitle}</span>
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-10 text-center">
              <div className="text-sm font-medium">No matching commands</div>
              <div className="mt-1 text-sm text-muted-foreground">Try a product name, order number, customer email, or a setting like shipping.</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
