import { Badge } from "@sakaniui/react";
import { permissionAreas, permissionMatrix, roles, type AccessLevel } from "../../fixtures/security.ts";

function accessBadge(value: AccessLevel) {
  const variant = value === "Allowed" ? "success" : value === "Restricted" ? "warning" : value === "Read Only" ? "info" : "neutral";
  return <Badge variant={variant}>{value}</Badge>;
}

export function RolePermissionMatrix() {
  return (
    <section className="panel" aria-labelledby="role-matrix">
      <h2 id="role-matrix">Roles and permissions</h2>
      <p className="section-note">Illustrative matrix, not enforced IAM. Indicators are Allowed, Restricted, Read Only, and Not Assigned.</p>
      <div className="matrix-scroll">
        <table className="matrix">
          <thead>
            <tr>
              <th scope="col">Area</th>
              {roles.map((role) => (
                <th key={role} scope="col">
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissionAreas.map((area) => (
              <tr key={area}>
                <th scope="row">{area}</th>
                {roles.map((role) => (
                  <td key={role}>{accessBadge(permissionMatrix[area][role])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
