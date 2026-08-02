<template>
  <div class="tiptap-editor" :class="{ 'is-dark': dark }">
    <!-- 工具栏 -->
    <div class="editor-toolbar" v-if="editor">
      <div class="toolbar-group">
        <button class="toolbar-btn" :class="{ active: editor.isActive('bold') }" title="加粗" @click="editor.chain().focus().toggleBold().run()">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" fill="currentColor"/></svg>
        </button>
        <button class="toolbar-btn" :class="{ active: editor.isActive('italic') }" title="斜体" @click="editor.chain().focus().toggleItalic().run()">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" fill="currentColor"/></svg>
        </button>
        <button class="toolbar-btn" :class="{ active: editor.isActive('underline') }" title="下划线" @click="editor.chain().focus().toggleUnderline().run()">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" fill="currentColor"/></svg>
        </button>
        <button class="toolbar-btn" :class="{ active: editor.isActive('strike') }" title="删除线" @click="editor.chain().focus().toggleStrike().run()">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z" fill="currentColor"/></svg>
        </button>
      </div>
      <div class="toolbar-divider" />
      <div class="toolbar-group">
        <button class="toolbar-btn" :class="{ active: editor.isActive('heading', { level: 1 }) }" title="标题1" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()">H1</button>
        <button class="toolbar-btn" :class="{ active: editor.isActive('heading', { level: 2 }) }" title="标题2" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">H2</button>
        <button class="toolbar-btn" :class="{ active: editor.isActive('heading', { level: 3 }) }" title="标题3" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()">H3</button>
      </div>
      <div class="toolbar-divider" />
      <div class="toolbar-group">
        <button class="toolbar-btn" :class="{ active: editor.isActive('bulletList') }" title="无序列表" @click="editor.chain().focus().toggleBulletList().run()">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" fill="currentColor"/></svg>
        </button>
        <button class="toolbar-btn" :class="{ active: editor.isActive('orderedList') }" title="有序列表" @click="editor.chain().focus().toggleOrderedList().run()">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z" fill="currentColor"/></svg>
        </button>
      </div>
      <div class="toolbar-divider" />
      <div class="toolbar-group">
        <button class="toolbar-btn" :class="{ active: editor.isActive('blockquote') }" title="引用" @click="editor.chain().focus().toggleBlockquote().run()">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" fill="currentColor"/></svg>
        </button>
        <button class="toolbar-btn" :class="{ active: editor.isActive('codeBlock') }" title="代码块" @click="editor.chain().focus().toggleCodeBlock().run()">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" fill="currentColor"/></svg>
        </button>
        <button class="toolbar-btn" title="分割线" @click="editor.chain().focus().setHorizontalRule().run()">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M3 17h18v-2H3v2zm0-3h18v-2H3v2zm0-5h18V7H3v2z" fill="currentColor"/></svg>
        </button>
      </div>
      <div class="toolbar-divider" />
      <div class="toolbar-group">
        <button class="toolbar-btn" title="插入图片" @click="handleImageUpload">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="currentColor"/></svg>
        </button>
        <button class="toolbar-btn" :class="{ active: editor.isActive('link') }" title="插入链接" @click="setLink">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" fill="currentColor"/></svg>
        </button>
      </div>
      <div class="toolbar-divider" />
      <div class="toolbar-group toolbar-right">
        <button class="toolbar-btn" title="撤销" @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" fill="currentColor"/></svg>
        </button>
        <button class="toolbar-btn" title="重做" @click="editor.chain().focus().redo().run()" :disabled="!editor.can().chain().focus().redo().run()">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.06-5.5 7.6-5.5 1.96 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z" fill="currentColor"/></svg>
        </button>
      </div>
    </div>

    <!-- 编辑器内容区 -->
    <editor-content :editor="editor" class="editor-content" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'

const props = withDefaults(defineProps<{
  modelValue?: string
  dark?: boolean
}>(), {
  modelValue: '',
  dark: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
      codeBlock: false
    }),
    Image.configure({
      inline: true,
      allowBase64: true
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: { rel: 'noopener noreferrer' }
    }),
    Placeholder.configure({ placeholder: '开始写作...' }),
    Underline
  ],
  onUpdate: () => {
    emit('update:modelValue', editor.value?.getHTML() || '')
  }
})

function setLink() {
  if (!editor.value) return
  const previousUrl = editor.value.getAttributes('link').href
  const url = window.prompt('输入链接地址', previousUrl || 'https://')
  if (url === null) return
  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

function handleImageUpload() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = () => {
    const file = input.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const url = e.target?.result as string
      editor.value?.chain().focus().setImage({ src: url }).run()
    }
    reader.readAsDataURL(file)
  }
  input.click()
}

watch(() => props.modelValue, (val) => {
  if (editor.value && val !== editor.value.getHTML()) {
    editor.value.commands.setContent(val, { emitUpdate: false })
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
.tiptap-editor {
  border: 1px solid rgba(45, 212, 191, 0.2);
  border-radius: 10px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
  transition: border-color 0.2s;
}

.tiptap-editor:focus-within {
  border-color: #0d9488;
  box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15);
}

.editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(45, 212, 191, 0.1);
  background: rgba(0, 0, 0, 0.15);
  user-select: none;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 1px;
}

.toolbar-group.toolbar-right {
  margin-left: auto;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background: rgba(45, 212, 191, 0.15);
  margin: 0 4px;
}

.toolbar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.65);
  font-size: 13px;
  font-weight: 600;
  transition: all 0.15s;
}

.toolbar-btn:hover {
  background: rgba(45, 212, 191, 0.15);
  color: #fff;
}

.toolbar-btn.active {
  background: #0d9488;
  color: #fff;
}

.toolbar-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.toolbar-btn:disabled:hover {
  background: transparent;
  color: rgba(255, 255, 255, 0.65);
}

.editor-content {
  padding: 20px 24px;
  min-height: 400px;
  max-height: 600px;
  overflow-y: auto;
  outline: none;
}

.editor-content :deep(.ProseMirror) {
  outline: none;
  min-height: 360px;
  font-size: 15px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.85);
}

.editor-content :deep(.ProseMirror p) {
  margin: 0 0 12px;
}

.editor-content :deep(.ProseMirror h1) {
  font-size: 28px;
  font-weight: 700;
  margin: 24px 0 12px;
  color: #fff;
  line-height: 1.3;
}

.editor-content :deep(.ProseMirror h2) {
  font-size: 22px;
  font-weight: 600;
  margin: 20px 0 10px;
  color: #f3f4f6;
  line-height: 1.35;
}

.editor-content :deep(.ProseMirror h3) {
  font-size: 18px;
  font-weight: 600;
  margin: 16px 0 8px;
  color: #e5e7eb;
  line-height: 1.4;
}

.editor-content :deep(.ProseMirror ul),
.editor-content :deep(.ProseMirror ol) {
  padding-left: 24px;
  margin: 8px 0 16px;
}

.editor-content :deep(.ProseMirror li) {
  margin-bottom: 4px;
}

.editor-content :deep(.ProseMirror ul) {
  list-style: disc;
}

.editor-content :deep(.ProseMirror ol) {
  list-style: decimal;
}

.editor-content :deep(.ProseMirror blockquote) {
  border-left: 3px solid #2dd4bf;
  padding: 8px 16px;
  margin: 12px 0;
  background: rgba(45, 212, 191, 0.08);
  border-radius: 0 8px 8px 0;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
}

.editor-content :deep(.ProseMirror code) {
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  color: #2dd4bf;
}

.editor-content :deep(.ProseMirror pre) {
  background: #0f172a;
  color: #e5e7eb;
  padding: 16px 20px;
  border-radius: 8px;
  margin: 12px 0;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.6;
}

.editor-content :deep(.ProseMirror pre code) {
  background: none;
  color: inherit;
  padding: 0;
}

.editor-content :deep(.ProseMirror img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 12px 0;
}

.editor-content :deep(.ProseMirror a) {
  color: #2dd4bf;
  text-decoration: underline;
  cursor: pointer;
}

.editor-content :deep(.ProseMirror hr) {
  border: none;
  border-top: 1px solid rgba(45, 212, 191, 0.2);
  margin: 24px 0;
}

.editor-content :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: rgba(255, 255, 255, 0.25);
  pointer-events: none;
  height: 0;
}
</style>