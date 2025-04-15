import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import useClients from "@/hooks/useClients";

export function ClientCombobox({ value, onClientSelect }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const router = useRouter();
    const { clients, isLoading } = useClients()

    const filteredClients = search === ""
        ? clients
        : clients.filter((client) =>
            client.name.toLowerCase().includes(search.toLowerCase()) ||
            client.email.toLowerCase().includes(search.toLowerCase()) ||
            (client.company && client.company.toLowerCase().includes(search.toLowerCase()))
        );

    const handleSelect = (clientId) => {
        if (clientId === "add-new") {
            router.push("/clients/create");
            return;
        }

        const selectedClient = clients.find(c => c.id === clientId);
        if (selectedClient) {
            onClientSelect({
                client_name: selectedClient.name,
                client_email: selectedClient.email,
                client_address: selectedClient.address || "",
                client_id: selectedClient.id
            });
        }
        setOpen(false);
    };

    console.log(clients)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value
                        ? clients.find((client) => client.name === value)?.name || value
                        : "Pilih klien..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput
                        placeholder="Cari klien..."
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList>
                        <CommandEmpty>
                            {isLoading ? (
                                <div className="py-6 text-center text-sm">Memuat data klien...</div>
                            ) : (
                                <div className="py-6 text-center text-sm">Tidak ada klien ditemukan</div>
                            )}
                        </CommandEmpty>
                        <CommandGroup heading="Klien">
                            {filteredClients.map((client) => (
                                <CommandItem
                                    key={client.id}
                                    value={client.id}
                                    onSelect={() => handleSelect(client.id)}
                                    className="cursor-pointer"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === client.name ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <span>{client.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {client.email} {client.company ? `· ${client.company}` : ""}
                                        </span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup>
                            <CommandItem className={"cursor-pointer"} onSelect={() => handleSelect("add-new")}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Tambah Klien Baru
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}