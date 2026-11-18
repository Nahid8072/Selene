import { useState } from "react";
import { Button, Tabs } from "@sakaniui/react";
import { securityNotice } from "../../fixtures/security.ts";
import { AuditLogExplorer } from "./AuditLogExplorer.tsx";
import { AuthenticationPanel } from "./AuthenticationPanel.tsx";
import { InvitationList } from "./InvitationList.tsx";
import { RepositoryPermissionTable } from "./RepositoryPermissionTable.tsx";
import { RolePermissionMatrix } from "./RolePermissionMatrix.tsx";
import { SecurityConfigurationPanel } from "./SecurityConfigurationPanel.tsx";
import { SecurityOverview } from "./SecurityOverview.tsx";
import { UserManagementTable } from "./UserManagementTable.tsx";

const sections = [
  { value: "overview", label: "Security Overview" },
  { value: "users", label: "User Management" },
  { value: "roles", label: "Roles & Permissions" },
  { value: "repositories", label: "Repository Permissions" },
  { value: "authentication", label: "Authentication" },
  { value: "audit", label: "Audit Logs" },
  { value: "settings", label: "Security Settings" },
];

export default function SecurityPage() {
  const [section, setSection] = useState("overview");
  return (
    <div className="page-stack page-stack--tight">
      <header className="page-header">
        <div>
          <h1>Security & Access Control</h1>
          <p>Manage users, permissions, authentication policies and security boundaries across Selene.</p>
        </div>
      </header>
      <p className="section-note">{securityNotice}</p>
      <div className="tab-scroll">
        <Tabs items={sections} value={section} onChange={setSection} />
      </div>
      {section === "overview" ? <SecurityOverview /> : null}
      {section === "users" ? (
        <section className="panel" aria-labelledby="user-management">
          <h2 id="user-management">User management</h2>
          <p className="section-note">Handles are fictional. Invite, role changes, disable, and remove do not run.</p>
          <div className="detail-actions inert-actions">
            <Button type="button" variant="primary" disabled>
              Invite User
            </Button>
          </div>
          <UserManagementTable />
          <h3>Invitations</h3>
          <InvitationList />
        </section>
      ) : null}
      {section === "roles" ? <RolePermissionMatrix /> : null}
      {section === "repositories" ? <RepositoryPermissionTable /> : null}
      {section === "authentication" ? <AuthenticationPanel /> : null}
      {section === "audit" ? <AuditLogExplorer /> : null}
      {section === "settings" ? <SecurityConfigurationPanel /> : null}
    </div>
  );
}
