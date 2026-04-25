"use client";

import { useEffect } from "react";

type Props = {
  requestId?: string;
};

export function PayPalPopupHandler({ requestId }: Props) {
  useEffect(() => {
    if (!window.opener || window.opener.closed) return;

    try {
      if (requestId) {
        window.opener.location.assign(`/results/${requestId}`);
      } else {
        window.opener.location.reload();
      }
    } catch {
      // Ignore cross-window navigation errors; still attempt to close popup.
    }

    window.close();
  }, [requestId]);

  return null;
}
