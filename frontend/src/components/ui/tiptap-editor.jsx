"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, Link as LinkIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

const MenuBar = ({ editor }) => {
    if (!editor) {
        return null
    }

    return (
        <div className="border-b border-input bg-muted/30 px-2 py-1.5 flex gap-1 items-center">
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={cn(
                    "h-8 w-8 p-0",
                    editor.isActive('bold') && "bg-accent"
                )}
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={cn(
                    "h-8 w-8 p-0",
                    editor.isActive('italic') && "bg-accent"
                )}
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn(
                    "h-8 w-8 p-0",
                    editor.isActive('bulletList') && "bg-accent"
                )}
            >
                <List className="h-4 w-4" />
            </Button>
        </div>
    )
}

export function TiptapEditor({ value, onChange, placeholder, className, ...props }) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
        ],
        content: value || '',
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            onChange?.(html)
        },
        editorProps: {
            attributes: {
                class: cn(
                    'prose prose-sm max-w-none focus:outline-none min-h-[120px] px-3 py-2',
                    className
                ),
            },
        },
    })

    // Update editor content when value changes externally
    if (editor && value !== editor.getHTML()) {
        editor.commands.setContent(value || '')
    }

    return (
        <div className="border border-input rounded-md bg-transparent shadow-xs overflow-hidden focus-within:ring-[3px] focus-within:ring-ring/50 focus-within:border-ring transition-[color,box-shadow]">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} placeholder={placeholder} {...props} />
        </div>
    )
}
