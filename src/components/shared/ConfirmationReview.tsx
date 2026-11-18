import { Button } from "@sakaniui/react";

export function ConfirmationReview({ title, consequence }: { title: string; consequence: string }) {
  return (
    <div className="confirm-review" role="group" aria-label={title}>
      <h3>{title}</h3>
      <p className="section-note">{consequence}</p>
      <div className="detail-actions inert-actions">
        <Button type="button" variant="outline" disabled>
          Cancel
        </Button>
        <Button type="button" variant="outline" disabled>
          Confirm
        </Button>
      </div>
    </div>
  );
}
