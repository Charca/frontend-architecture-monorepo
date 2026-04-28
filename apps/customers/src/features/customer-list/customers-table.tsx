import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { EmptyState } from "@commerceos/shared/feedback/empty-state";
import { SectionCard } from "@commerceos/shared/components/section-card";
import { StatusBadge } from "@commerceos/shared/components/status-badge";
import { Input } from "@commerceos/ui";
import { Select } from "@commerceos/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@commerceos/ui";
import { formatCurrency, formatDate } from "@commerceos/shared/lib/utils";
import type { Customer } from "@commerceos/shared/types";

interface CustomersTableProps {
  customers: Customer[];
}

export function CustomersTable({ customers }: CustomersTableProps) {
  const [search, setSearch] = useState("");
  const [segment, setSegment] = useState("all");

  const filteredCustomers = useMemo(
    () =>
      customers.filter((customer) => {
        const matchesSearch = `${customer.name} ${customer.email}`.toLowerCase().includes(search.toLowerCase());
        const matchesSegment = segment === "all" || customer.segment === segment;
        return matchesSearch && matchesSegment;
      }),
    [customers, search, segment],
  );

  return (
    <SectionCard contentClassName="space-y-4">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr),220px]">
        <Input placeholder="Search by customer name or email" value={search} onChange={(event) => setSearch(event.target.value)} />
        <Select value={segment} onChange={(event) => setSegment(event.target.value)}>
          <option value="all">All segments</option>
          <option value="VIP">VIP</option>
          <option value="Wholesale">Wholesale</option>
          <option value="At Risk">At Risk</option>
          <option value="New">New</option>
          <option value="Repeat">Repeat</option>
        </Select>
      </div>
      {filteredCustomers.length ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Segment</TableHead>
              <TableHead>Price List</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Lifetime Spend</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <Link to="/customers/$customerId" params={{ customerId: customer.id }} className="font-medium text-primary hover:underline">
                    {customer.name}
                  </Link>
                </TableCell>
                <TableCell className="table-cell-muted">{customer.email}</TableCell>
                <TableCell>
                  <StatusBadge status={customer.segment} />
                </TableCell>
                <TableCell className="table-cell-muted">{customer.priceList?.name ?? "Retail default"}</TableCell>
                <TableCell>{customer.tags.join(", ")}</TableCell>
                <TableCell>{formatCurrency(customer.lifetimeSpend)}</TableCell>
                <TableCell>{formatDate(customer.joinedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState title="No customers found" description="Try a different search query." />
      )}
    </SectionCard>
  );
}
