"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import CharacterCount from "@tiptap/extension-character-count";

import EditorToolbar from "./EditorToolbar";

export default function TiptapEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (val: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        bulletList: { keepAttributes: true },
        orderedList: { keepAttributes: true },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: { class: "rounded-2xl shadow-xl mx-auto max-w-full" },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-600 underline" },
      }),
      Youtube.configure({
        width: 840,
        height: 480,
        HTMLAttributes: {
          class: "rounded-xl overflow-hidden shadow-2xl mx-auto",
        },
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
      CharacterCount,
      Placeholder.configure({ placeholder: "Write your masterpiece..." }),
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none focus:outline-none min-h-[600px] p-10 lg:p-16",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-slate-300 rounded-3xl bg-white overflow-hidden shadow-2xl relative">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />

      {/* Footer Stats bar */}
      <div className="flex justify-between items-center px-6 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 font-medium">
        <div>{editor.storage.characterCount.words()} words</div>
        <div className="flex gap-4">
          <span>{editor.storage.characterCount.characters()} characters</span>
          <span className="text-blue-600">Pro Editor Active</span>
        </div>
      </div>
    </div>
  );
}
