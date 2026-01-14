"use client";

import React from "react";
import { Editor } from "@tiptap/react";
import { 
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, 
  AlignRight, List, ListOrdered, Undo, Redo, Quote, Youtube as YoutubeIcon,
  Heading1, Heading2, Heading3, Link2, ImageIcon, Table as TableIcon, 
  Palette, Highlighter, Eraser, CheckSquare, Pilcrow
} from "lucide-react";

export default function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  // --- Button Styling Logic ---
  const btn = (active: boolean, danger?: boolean) => `
    p-2 rounded-lg transition-all flex items-center justify-center
    ${active ? "bg-blue-600 text-white shadow-md scale-95" : danger ? "text-red-500 hover:bg-red-50" : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"}
  `;

  const Divider = () => <div className="w-[1px] h-6 bg-slate-300 mx-1 self-center" />;

  // --- Action Handlers ---
  const addImage = () => {
    const url = window.prompt("Enter Image URL (Or just drag and drop into the editor)");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addYoutube = () => {
    const url = window.prompt("Enter YouTube URL");
    if (url) editor.commands.setYoutubeVideo({ src: url });
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-col bg-slate-50 border-b border-slate-300 sticky top-0 z-30 select-none">
      
      {/* ROW 1: STRUCTURE & HISTORY */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200">
        <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          <button type="button" title="Undo (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()} className={btn(false)}><Undo size={16}/></button>
          <button type="button" title="Redo (Ctrl+Y)" onClick={() => editor.chain().focus().redo().run()} className={btn(false)}><Redo size={16}/></button>
        </div>
        
        <Divider />

        <button type="button" title="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btn(editor.isActive("heading", { level: 1 }))}><Heading1 size={18}/></button>
        <button type="button" title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive("heading", { level: 2 }))}><Heading2 size={18}/></button>
        <button type="button" title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive("heading", { level: 3 }))}><Heading3 size={18}/></button>
        <button type="button" title="Paragraph" onClick={() => editor.chain().focus().setParagraph().run()} className={btn(editor.isActive("paragraph"))}><Pilcrow size={16}/></button>

        <Divider />

        <button type="button" title="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive("bulletList"))}><List size={18}/></button>
        <button type="button" title="Numbered List" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive("orderedList"))}><ListOrdered size={18}/></button>
        <button type="button" title="Task List" onClick={() => editor.chain().focus().toggleTaskList().run()} className={btn(editor.isActive("taskList"))}><CheckSquare size={18}/></button>
      </div>

      {/* ROW 2: FORMATTING & MEDIA */}
      <div className="flex flex-wrap items-center gap-1 p-2">
        <div className="flex gap-1">
          <button type="button" title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive("bold"))}><Bold size={16}/></button>
          <button type="button" title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive("italic"))}><Italic size={16}/></button>
          <button type="button" title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btn(editor.isActive("underline"))}><Underline size={16}/></button>
          <button type="button" title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} className={btn(editor.isActive("strike"))}><Strikethrough size={16}/></button>
        </div>

        <Divider />

        <div className="flex gap-1">
          <button type="button" title="Align Left" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btn(editor.isActive({ textAlign: 'left' }))}><AlignLeft size={16}/></button>
          <button type="button" title="Align Center" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btn(editor.isActive({ textAlign: 'center' }))}><AlignCenter size={16}/></button>
          <button type="button" title="Align Right" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={btn(editor.isActive({ textAlign: 'right' }))}><AlignRight size={16}/></button>
        </div>

        <Divider />

        <div className="flex items-center gap-2 px-1">
          <input 
            type="color" 
            title="Text Color"
            onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
            className="w-6 h-6 p-0 border border-slate-300 bg-transparent cursor-pointer rounded"
          />
          <button type="button" title="Highlight Text" onClick={() => editor.chain().focus().toggleHighlight().run()} className={btn(editor.isActive("highlight"))}><Highlighter size={16}/></button>
        </div>

        <Divider />

        <div className="flex gap-1">
          <button type="button" title="Add Link" onClick={setLink} className={btn(editor.isActive("link"))}><Link2 size={16}/></button>
          <button type="button" title="Insert Image" onClick={addImage} className={btn(false)}><ImageIcon size={16}/></button>
          <button type="button" title="Insert YouTube Video" onClick={addYoutube} className={btn(false)}><YoutubeIcon size={16}/></button>
          <button type="button" title="Insert Table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className={btn(editor.isActive("table"))}><TableIcon size={16}/></button>
          <button type="button" title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive("blockquote"))}><Quote size={16}/></button>
        </div>

        <div className="ml-auto">
          <button type="button" title="Clear All Formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} className={btn(false, true)}><Eraser size={16}/></button>
        </div>
      </div>
    </div>
  );
}