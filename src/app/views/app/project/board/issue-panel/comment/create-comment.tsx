import { Comment } from "@domain/comment";
import { addCommentDb } from "@infrastructure/db/comment";
import { appStore, useProjectStore } from "@infrastructure/store";
import { UserAvatar } from "@app/components/avatar";
import { EditBox } from "./edit-box";

export const CreateComment = ({
  addComment,
}: CreateCommentProps): JSX.Element => {
  const user = appStore.user;
  const projectStore = useProjectStore();

  const save = (message: string) => {
    const issue = projectStore.editingIssue;

    if (!issue) {
      throw new Error("No issue to edit");
    }

    const comment = new Comment({
      user,
      message,
    });
    addComment(comment);
    addCommentDb(comment, issue.id);
  };

  return (
    <div className="mt-4 flex items-start gap-6">
      <UserAvatar {...user} tooltip={false} />
      <EditBox defaultMessage="" save={save} />
    </div>
  );
};

interface CreateCommentProps {
  addComment: (comment: Comment) => void;
}
