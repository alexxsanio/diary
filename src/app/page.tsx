
"use client";

import { useRef, useState } from "react";
import * as htmlToImage from 'html-to-image';
import { ArrowUp, ImageDown, Type } from "lucide-react";
import { Nunito, Lora } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

type Entry = {
  id: string;
  content: string;
};

export default function Home() {
  const [showSavePanel, setShowSavePanel] = useState(false);
  const [showSharedEntries, setShowSharedEntries] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [draft, setDraft] = useState("");
  const [font, setFont] = useState<"nunito" | "lora">("nunito");
  const [saving, setSaving] = useState<string | null>(null);

  const entryRefs = useRef<Record<string, HTMLElement | null>>({});

  function handleDraftChange(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setDraft(event.target.value);

    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  function submitEntry() {
    const content = draft.trim();
    if (!content) return;

    setEntries((previous) => [
      ...previous,
      { id: crypto.randomUUID(), content },
    ]);
    setDraft("");
  }
  
  
  async function saveEntry(id: string) {
    const element = document.querySelector(".journal") as HTMLElement | null;
    if (!element || saving) return;

    if (element) {
      htmlToImage
        .toPng(element, { cacheBust: false })
        .then((dataUrl: string) => {
          const link: HTMLAnchorElement = document.createElement('a');
          link.download = 'screenshot.png';
          link.href = dataUrl;
          link.click();
        })
        .catch((error: unknown) => {
          console.error('Oops, something went wrong!', error);
        });
    } else {
      console.error('Could not find element with ID "my-node".');
    }
  }

  const textareaRef = useRef<HTMLTextAreaElement>(null);


  return (
    <main
      className={`${nunito.variable} ${lora.variable} journal`}
      style={{
        fontFamily:
          font === "nunito" ? "var(--font-nunito)" : "var(--font-lora)",
      }}
    >
      <section className="entries" aria-live="polite">
        {entries.map((entry, index) => (
          <article
            key={entry.id}
            className="entry"
            ref={(element) => {
              entryRefs.current[entry.id] = element;
            }}
          >
            <p className="entry-text">{entry.content}</p>

            <footer className="entry-footer">
              <span>Entry {String(index + 1).padStart(2, "0")}</span>
              <button
                type="button"
                className="share-button"
                onClick={() => {
                  // Open the sharing flow for this entry.
                  setDraft(entry.content);
                  setShowSharedEntries(false);
                  setShowSavePanel(false);
                }}
              >
                Share to others
              </button>
            </footer>
          </article>
        ))}
      </section>

      <form
        className="composer"
        onSubmit={(event) => {
          event.preventDefault();
          submitEntry();
        }}
      >
        <div className="composer-row">
          {/* Column 1: Font selector */}
          <div className="composer-tools">
            <Type size={16} aria-hidden="true" />
            <label htmlFor="font-choice" className="sr-only">
              Journal font
            </label>
            <select
              id="font-choice"
              value={font}
              onChange={(event) =>
                setFont(event.target.value as "nunito" | "lora")
              }
              aria-label="Choose font"
            >
              <option value="nunito">Nunito</option>
              <option value="lora">Lora</option>
            </select>
          </div>

          {/* Column 2: Text input */}
          <div className="input-column">
            <textarea
              className="journal-input"
              value={draft}
              onChange={handleDraftChange}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  submitEntry();
                }
              }}
              placeholder="Write something..."
              rows={1}
            />
          </div>

          {/* Column 3: Action buttons */}
          <div className="composer-actions">
            <button
              type="button"
              onClick={() => {
                setShowSavePanel((current) => !current);
                setShowSharedEntries(false);
              }}
            >
              Save panel
            </button>

            <button
              type="button"
              onClick={() => {
                setShowSharedEntries((current) => !current);
                setShowSavePanel(false);
              }}
            >
              Shared by others
            </button>
          </div>
        </div>

        {showSavePanel && (
          <div className="side-panel">
            <p>Save panel</p>
            <p>Your saved entries will appear here.</p>
          </div>
        )}

        {showSharedEntries && (
          <div className="side-panel">
            <p>Shared entries</p>
            <p>Entries shared by other users will appear here.</p>
          </div>
        )}
      </form>
    </main>
  );
}
