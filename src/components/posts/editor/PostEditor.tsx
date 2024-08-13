"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useSession } from "@/app/(main)/SessionProvider";
import { UserAvatar } from "@/components/UserAvatar";
import { useSubmitPostMutation } from "./mutations";
import { LoadingButton } from "@/components/LoadingButton";
import { Attachment, useMediaUpload } from "./useMediaUpload";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, X } from "lucide-react";
import "./styles.css";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
export function PostEditor() {
  const { user } = useSession();
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "What's crack-a-lackin'?",
      }),
    ],
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";
  const {
    attachments,
    reset: resetMediaUpload,
    isUploading,
    uploadProgress,
    startUpload,
    removeAttachment,
  } = useMediaUpload();
  console.log(attachments[0]);
  console.log("this isnt undefined");

  const mutation = useSubmitPostMutation();
  function onSubmit() {
    mutation.mutate(
      {
        content: input,
        mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[],
      },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
          resetMediaUpload();
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
        <EditorContent
          editor={editor}
          className="max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3"
        />
      </div>
      {!!attachments.length && (
        <AttachmentPreviews
          attachments={attachments}
          removeAttchment={removeAttachment}
        />
      )}
      <div className="flex items-center justify-end gap-3">
        {isUploading && (
          <>
            <span className="text-sm">{uploadProgress ?? 0}%</span>
            <Loader2 className="size-5 animate-spin text-primary" />
          </>
        )}
        <AddAttachmentsButton
          onFilesSelected={startUpload}
          disabled={isUploading || attachments.length >= 5}
        />
        <LoadingButton
          onClick={onSubmit}
          loading={mutation.isPending}
          disabled={!input.trim()}
          className="min-w-20"
        >
          Post
        </LoadingButton>
      </div>
    </div>
  );
}

function AddAttachmentsButton({
  onFilesSelected,
  disabled,
}: {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Button
        variant={`ghost`}
        disabled={disabled}
        size={`icon`}
        className="text-primary hover:text-primary"
        onClick={() => inputRef.current?.click()}
      >
        <ImageIcon size={20} />
      </Button>
      <input
        type="file"
        ref={inputRef}
        accept="image/* , video/*"
        multiple
        className="sr-only hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length > 0) {
            onFilesSelected(files);
            e.target.value = "";
          }
        }}
      />
    </>
  );
}

function AttachmentPreviews({
  attachments,
  removeAttchment,
}: {
  attachments: Attachment[];
  removeAttchment: (fileName: string) => void;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm: grid-cols-2 sm:grid",
      )}
    >
      {attachments.map((attachment) => (
        <AttachMentPreview
          key={attachment.file.name}
          attachment={attachment}
          onRemoveClick={() => removeAttchment(attachment.file.name)}
        />
      ))}
    </div>
  );
}

function AttachMentPreview({
  attachment: { file, mediaId, isUploading },
  onRemoveClick,
}: {
  attachment: Attachment;
  onRemoveClick: () => void;
}) {
  const src = URL.createObjectURL(file);
  return (
    <div
      className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}
    >
      {file.type.startsWith("image") ? (
        <Image
          src={src}
          alt="Attachment preview"
          width={500}
          height={500}
          className="size-fit max-h-[30rem] rounded-2xl"
        />
      ) : (
        <video controls className="size-fit max-h-[30rem] rounded-2xl">
          <source src={src} type={file.type} />
        </video>
      )}
      {!isUploading && (
        <button
          onClick={onRemoveClick}
          className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
