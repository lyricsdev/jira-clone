import { useState, useRef } from "react";
import { Form, useSubmit, useSearchParams } from "@remix-run/react";
import * as Dialog from "@radix-ui/react-dialog";
import { userMock1 } from "@domain/user";
import { Issue } from "@domain/issue";
import { Comment, CommentId } from "@domain/comment";
import { UserAvatar } from "@app/components/avatar";
import { PanelHeader } from "./panel-header";
import { Title } from "./title";
import { Description } from "./description";
import { CreateComment } from "./comment/create-comment";
import { ViewComment } from "./comment/view-comment";
import { SelectStatus } from "./select-status";
import { SelectPriority } from "./select-priority";
import { SelectAsignee } from "./select-asignee";
import { useAppStore } from "@app/views/app/app.store";
import { CategoryType } from "@domain/category";
// import { textAreOnlySpaces } from "@app/utils";

export const IssuePanel = ({ issue }: Props): JSX.Element => {
  const [comments, setComments] = useState<Comment[]>(issue?.comments || []);
  const { user } = useAppStore();
  const formRef = useRef<HTMLFormElement>(null);
  const submit = useSubmit();
  const params = useSearchParams();
  const initStatus = (params[0].get("category") as CategoryType) || "TODO";

  const handleFormSumbit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postData(e.currentTarget);
  };

  const handleProgrammaticSubmit = (): void => {
    if (formRef.current) {
      postData(formRef.current);
    }
  };

  const postData = (formTarget: HTMLFormElement) => {
    const formData = new FormData(formTarget);
    formData.set("comments", JSON.stringify(comments));
    formData.set("_action", "upsert");

    submit(formData, {
      method: "post",
    });
  };

  const addComment = (newComment: Comment): void => {
    setComments([...comments, newComment]);
  };

  const removeComment = (commentId: CommentId): void => {
    const updatedComments = comments.filter(
      (comment) => comment.id !== commentId
    );
    setComments(updatedComments);
  };

  return (
    <Dialog.Root open={true}>
      <Dialog.Portal>
        <Dialog.Overlay className="absolute top-0 left-0 z-50 box-border grid h-full w-full place-items-center overflow-y-auto bg-black bg-opacity-50 py-[40px] px-[40px]">
          <Dialog.Content
            onEscapeKeyDown={handleProgrammaticSubmit}
            onPointerDownOutside={handleProgrammaticSubmit}
            className="relative z-50 w-4/5 max-w-[1000px] rounded-md bg-white py-6 px-8 shadow-lg"
          >
            <PanelHeader id={issue?.id || "Create new issue"} />
            <Form method="post" onSubmit={handleFormSumbit} ref={formRef}>
              <div className="grid grid-cols-5 gap-16">
                <section className="col-span-3">
                  <Dialog.Title className="my-5 -ml-3">
                    <Title initTitle={issue?.name || ""} />
                  </Dialog.Title>
                  <p className="font-primary-black text-font-main">
                    Description
                  </p>
                  <div className="-ml-3">
                    <Description initDescription={issue?.description || ""} />
                  </div>
                  <div className="mt-6">
                    <p className="font-primary-black text-font-main">
                      Comments
                    </p>
                    <div>
                      <CreateComment addComment={addComment} />
                    </div>
                    <ul className="mt-8 space-y-6">
                      {comments.map((comment, index) => (
                        <li key={index}>
                          <ViewComment
                            comment={comment}
                            removeComment={removeComment}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
                <section className="col-span-2 space-y-10">
                  <div>
                    <p className="mb-1">Status</p>
                    <SelectStatus
                      initStatus={issue?.categoryType || initStatus}
                    />
                  </div>
                  <div>
                    <p className="mb-1">Priority</p>
                    <SelectPriority initPriority={issue?.priority || "low"} />
                  </div>
                  <div>
                    <p className="mb-1">Asignee</p>
                    <SelectAsignee initAsignee={issue?.asignee || user} />
                  </div>
                  <div>
                    <p className="mb-1">Reporter</p>
                    <div className="mt-1 flex w-fit items-center gap-2 rounded-full bg-grey-300 py-1 pl-1 pr-3.5 pb-1">
                      <UserAvatar {...userMock1} tooltip={false} />
                      <p className="m-0">{userMock1.name}</p>
                    </div>
                    <input type="hidden" name="reporter" value={userMock1.id} />
                  </div>
                </section>
              </div>
              <div className="grid grid-cols-3 items-end">
                <span className="font-primary-light text-2xs text-font-light text-opacity-80">
                  Press{" "}
                  <kbd className="rounded bg-grey-300 p-1 font-primary-light text-icon">
                    Esc
                  </kbd>{" "}
                  to apply changes
                </span>
                <button
                  type="submit"
                  className="w-fit cursor-pointer justify-self-center rounded border-none bg-primary-main py-2 px-8 font-primary-bold text-lg text-white hover:bg-primary-main-hover"
                >
                  Done
                </button>
              </div>
            </Form>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

interface Props {
  issue?: Issue;
}
