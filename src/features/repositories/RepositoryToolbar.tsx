import { Button, Input, Select } from "@sakaniui/react";
import { IconRefresh, IconSearch } from "@sakaniui/react/icons";
import { providerFilterOptions, syncStatusFilterOptions } from "../../fixtures/repositories.ts";

export function RepositoryToolbar() {
  return (
    <div className="repo-toolbar" aria-label="Repository filters">
      <div className="repo-toolbar__search">
        <Input
          size="sm"
          disabled
          placeholder="Search repositories"
          aria-label="Search repositories"
          leadingIcon={<IconSearch size={16} aria-hidden />}
          value=""
        />
      </div>
      <div className="repo-toolbar__filter">
        <Select
          size="sm"
          disabled
          label="Provider"
          placeholder="Any"
          options={providerFilterOptions}
        />
      </div>
      <div className="repo-toolbar__filter">
        <Select
          size="sm"
          disabled
          label="Sync status"
          placeholder="Any"
          options={syncStatusFilterOptions}
        />
      </div>
      <Button type="button" variant="secondary" size="sm" disabled leftIcon={<IconRefresh size={16} aria-hidden />}>
        Refresh
      </Button>
    </div>
  );
}
