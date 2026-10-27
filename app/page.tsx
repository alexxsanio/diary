
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
    const element = document.querySelector(".journal") as HTMLDivElement | null;
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
                className="save-button"
                onClick={() => saveEntry(entry.id)}
                disabled={saving !== null}
                aria-label={`Save entry ${index + 1} as an image`}
                title="Save as PNG"
              >
                <ImageDown size={16} />
                <span>{saving === entry.id ? "Saving…" : "Save image"}</span>
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

        <textarea
          ref={textareaRef}
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
          className="journal-input"
        />

        <button
          className="submit-button"
          type="submit"
          disabled={!draft.trim()}
          aria-label="Add journal entry"
          title="Add entry (Enter)"
        >
          <ArrowUp size={20} />
        </button>
      </form>
    </main>
  );
}
