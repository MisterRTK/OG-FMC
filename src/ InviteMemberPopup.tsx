import React, { useRef, useEffect } from "react";
import QRCode from "qrcode.react";

interface InviteMemberPopupProps {
  visible: boolean;
  onClose: () => void;
  inviteLink: string;
}

export default function InviteMemberPopup({ visible, onClose, inviteLink }: InviteMemberPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      top: 32,
      right: 32,
      zIndex: 1000,
      background: "rgba(0,0,0,0.25)",
      width: "100vw",
      height: "100vh"
    }}>
      <div
        ref={popupRef}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
          padding: "32px 32px 24px 32px",
          minWidth: 320,
          minHeight: 240,
          margin: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ marginBottom: 12, fontWeight: 700 }}>Invite Family Member</h2>
        <QRCode value={inviteLink} size={180} />
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <input
            type="text"
            value={inviteLink}
            readOnly
            style={{
              width: "100%",
              textAlign: "center",
              background: "#f6f6c2",
              color: "#333",
              border: "1px solid #FFD700",
              borderRadius: "6px",
              padding: "6px",
              marginBottom: "8px",
              fontWeight: 700,
            }}
            onFocus={e => e.target.select()}
          />
          <div style={{ fontSize: 13, color: "#888" }}>
            Scan QR or copy this link to invite!
          </div>
        </div>
      </div>
    </div>
  );
}