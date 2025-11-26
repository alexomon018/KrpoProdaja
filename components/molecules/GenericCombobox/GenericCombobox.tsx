"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxItem {
  id: string
  name: string
}

interface GenericComboboxProps {
  items: ComboboxItem[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
}

const MAX_RESULTS = 100;

export function GenericCombobox({
  items,
  value,
  onValueChange,
  placeholder = "Select item...",
  searchPlaceholder = "Search...",
  emptyMessage = "No item found.",
  className,
}: GenericComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const selectedItem = React.useMemo(
    () => items.find((item) => item.name.toLowerCase() === value?.toLowerCase()),
    [items, value]
  )

  // Filter and limit results for performance
  const filteredItems = React.useMemo(() => {
    if (!searchQuery) {
      return items.slice(0, MAX_RESULTS);
    }

    const query = searchQuery.toLowerCase();
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(query)
    );

    return filtered.slice(0, MAX_RESULTS);
  }, [items, searchQuery])

  const handleSelect = React.useCallback((currentValue: string) => {
    onValueChange?.(currentValue === value ? "" : currentValue)
    setOpen(false)
    setSearchQuery("")
  }, [value, onValueChange])

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedItem ? selectedItem.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 w-[var(--radix-popover-trigger-width)]"
        align="start"
        sideOffset={4}
      >
        <Command shouldFilter={false} className="w-full">
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {filteredItems.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.name}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value?.toLowerCase() === item.name.toLowerCase()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
            {filteredItems.length === MAX_RESULTS && searchQuery && (
              <div className="py-2 px-2 text-xs text-muted-foreground text-center border-t">
                Showing first {MAX_RESULTS} results. Keep typing to narrow down...
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
